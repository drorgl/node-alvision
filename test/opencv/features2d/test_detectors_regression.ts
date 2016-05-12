/*M///////////////////////////////////////////////////////////////////////////////////////
//
//  IMPORTANT: READ BEFORE DOWNLOADING, COPYING, INSTALLING OR USING.
//
//  By downloading, copying, installing or using the software you agree to this license.
//  If you do not agree to this license, do not download, install,
//  copy or use the software.
//
//
//                        Intel License Agreement
//                For Open Source Computer Vision Library
//
// Copyright (C) 2000, Intel Corporation, all rights reserved.
// Third party copyrights are property of their respective owners.
//
// Redistribution and use in source and binary forms, with or without modification,
// are permitted provided that the following conditions are met:
//
//   * Redistribution's of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//
//   * Redistribution's in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//
//   * The name of Intel Corporation may not be used to endorse or promote products
//     derived from this software without specific prior written permission.
//
// This software is provided by the copyright holders and contributors "as is" and
// any express or implied warranties, including, but not limited to, the implied
// warranties of merchantability and fitness for a particular purpose are disclaimed.
// In no event shall the Intel Corporation or contributors be liable for any direct,
// indirect, incidental, special, exemplary, or consequential damages
// (including, but not limited to, procurement of substitute goods or services;
// loss of use, data, or profits; or business interruption) however caused
// and on any theory of liability, whether in contract, strict liability,
// or tort (including negligence or otherwise) arising in any way out of
// the use of this software, even if advised of the possibility of such damage.
//
//M*/

import tape = require("tape");
import path = require("path");
import colors = require("colors");
import async = require("async");
import alvision = require("../../../tsbinding/alvision");
import util = require('util');
import fs = require('fs');

#include "test_precomp.hpp"
#include "opencv2/highgui.hpp"

using namespace std;
using namespace cv;

const string FEATURES2D_DIR = "features2d";
const string IMAGE_FILENAME = "tsukuba.png";
const string DETECTOR_DIR = FEATURES2D_DIR + "/feature_detectors";

/****************************************************************************************\
*            Regression tests for feature detectors comparing keypoints.                 *
\****************************************************************************************/

class CV_FeatureDetectorTest  extends alvision.cvtest.BaseTest
{
public:
    CV_FeatureDetectorTest( const string& _name, const Ptr<FeatureDetector>& _fdetector ) :
        name(_name), fdetector(_fdetector) {}

protected:
    bool isSimilarKeypoints( const KeyPoint& p1, const KeyPoint& p2 );
    void compareKeypointSets( const Array<KeyPoint>& validKeypoints, const Array<KeyPoint>& calcKeypoints );

    void emptyDataTest();
    void regressionTest(); // TODO test of detect() with mask

    virtual void run( int );

    string name;
    Ptr<FeatureDetector> fdetector;
};

void CV_FeatureDetectorTest::emptyDataTest()
{
    // One image.
    Mat image;
    Array<KeyPoint> keypoints;
    try
    {
        fdetector.detect( image, keypoints );
    }
    catch(e)
    {
        ts.printf( alvision.cvtest.TSConstants.LOG, "detect() on empty image must not generate exception (1).\n" );
        this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT );
    }

    if( !keypoints.empty() )
    {
        ts.printf( alvision.cvtest.TSConstants.LOG, "detect() on empty image must return empty keypoints vector (1).\n" );
        this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT );
        return;
    }

    // Several images.
    Array<Mat> images;
    Array<Array<KeyPoint> > keypointCollection;
    try
    {
        fdetector.detect( images, keypointCollection );
    }
    catch(e)
    {
        ts.printf( alvision.cvtest.TSConstants.LOG, "detect() on empty image vector must not generate exception (2).\n" );
        this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT );
    }
}

bool CV_FeatureDetectorTest::isSimilarKeypoints( const KeyPoint& p1, const KeyPoint& p2 )
{
    const float maxPtDif = 1.f;
    const float maxSizeDif = 1.f;
    const float maxAngleDif = 2.f;
    const float maxResponseDif = 0.1f;

    float dist = (float)norm( p1.pt - p2.pt );
    return (dist < maxPtDif &&
            fabs(p1.size - p2.size) < maxSizeDif &&
            abs(p1.angle - p2.angle) < maxAngleDif &&
            abs(p1.response - p2.response) < maxResponseDif &&
            p1.octave == p2.octave &&
            p1.class_id == p2.class_id );
}

void CV_FeatureDetectorTest::compareKeypointSets( const Array<KeyPoint>& validKeypoints, const Array<KeyPoint>& calcKeypoints )
{
    const float maxCountRatioDif = 0.01f;

    // Compare counts of validation and calculated keypoints.
    float countRatio = (float)validKeypoints.size() / (float)calcKeypoints.size();
    if( countRatio < 1 - maxCountRatioDif || countRatio > 1.f + maxCountRatioDif )
    {
        ts.printf( alvision.cvtest.TSConstants.LOG, "Bad keypoints count ratio (validCount = %d, calcCount = %d).\n",
                    validKeypoints.size(), calcKeypoints.size() );
        this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT );
        return;
    }

    int progress = 0, progressCount = (int)(validKeypoints.size() * calcKeypoints.size());
    int badPointCount = 0, commonPointCount = max((int)validKeypoints.size(), (int)calcKeypoints.size());
    for( size_t v = 0; v < validKeypoints.size(); v++ )
    {
        int nearestIdx = -1;
        float minDist = std::numeric_limits<float>::max();

        for( size_t c = 0; c < calcKeypoints.size(); c++ )
        {
            progress = update_progress( progress, (int)(v*calcKeypoints.size() + c), progressCount, 0 );
            float curDist = (float)norm( calcKeypoints[c].pt - validKeypoints[v].pt );
            if( curDist < minDist )
            {
                minDist = curDist;
                nearestIdx = (int)c;
            }
        }

        assert( minDist >= 0 );
        if( !isSimilarKeypoints( validKeypoints[v], calcKeypoints[nearestIdx] ) )
            badPointCount++;
    }
    ts.printf( alvision.cvtest.TSConstants.LOG, "badPointCount = %d; validPointCount = %d; calcPointCount = %d\n",
                badPointCount, validKeypoints.size(), calcKeypoints.size() );
    if( badPointCount > 0.9 * commonPointCount )
    {
        ts.printf( alvision.cvtest.TSConstants.LOG, " - Bad accuracy!\n" );
        this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY );
        return;
    }
    ts.printf( alvision.cvtest.TSConstants.LOG, " - OK\n" );
}

void CV_FeatureDetectorTest::regressionTest()
{
    assert( !fdetector.empty() );
    string imgFilename = this.ts.get_data_path() + FEATURES2D_DIR + "/" + IMAGE_FILENAME;
    string resFilename = this.ts.get_data_path() + DETECTOR_DIR + "/" + string(name) + ".xml.gz";

    // Read the test image.
    Mat image = imread( imgFilename );
    if( image.empty() )
    {
        ts.printf( alvision.cvtest.TSConstants.LOG, "Image %s can not be read.\n", imgFilename );
        this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA );
        return;
    }

    FileStorage fs( resFilename, FileStorage::READ );

    // Compute keypoints.
    Array<KeyPoint> calcKeypoints;
    fdetector.detect( image, calcKeypoints );

    if( fs.isOpened() ) // Compare computed and valid keypoints.
    {
        // TODO compare saved feature detector params with current ones

        // Read validation keypoints set.
        Array<KeyPoint> validKeypoints;
        read( fs["keypoints"], validKeypoints );
        if( validKeypoints.empty() )
        {
            ts.printf( alvision.cvtest.TSConstants.LOG, "Keypoints can not be read.\n" );
            this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA );
            return;
        }

        compareKeypointSets( validKeypoints, calcKeypoints );
    }
    else // Write detector parameters and computed keypoints as validation data.
    {
        fs.open( resFilename, FileStorage::WRITE );
        if( !fs.isOpened() )
        {
            ts.printf( alvision.cvtest.TSConstants.LOG, "File %s can not be opened to write.\n", resFilename );
            this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA );
            return;
        }
        else
        {
            fs << "detector_params" << "{";
            fdetector.write( fs );
            fs << "}";

            write( fs, "keypoints", calcKeypoints );
        }
    }
}

void CV_FeatureDetectorTest::run( int /*start_from*/ )
{
    if( !fdetector )
    {
        ts.printf( alvision.cvtest.TSConstants.LOG, "Feature detector is empty.\n" );
        this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA );
        return;
    }

    emptyDataTest();
    regressionTest();

    this.ts.set_failed_test_info( alvision.cvtest.FailureCode.OK );
}

/****************************************************************************************\
*                                Tests registrations                                     *
\****************************************************************************************/

TEST( Features2d_Detector_BRISK, regression )
{
    CV_FeatureDetectorTest test( "detector-brisk", BRISK::create() );
    test.safe_run();
}

TEST( Features2d_Detector_FAST, regression )
{
    CV_FeatureDetectorTest test( "detector-fast", FastFeatureDetector::create() );
    test.safe_run();
}

TEST( Features2d_Detector_AGAST, regression )
{
    CV_FeatureDetectorTest test( "detector-agast", AgastFeatureDetector::create() );
    test.safe_run();
}

TEST( Features2d_Detector_GFTT, regression )
{
    CV_FeatureDetectorTest test( "detector-gftt", GFTTDetector::create() );
    test.safe_run();
}

TEST( Features2d_Detector_Harris, regression )
{
    Ptr<GFTTDetector> gftt = GFTTDetector::create();
    gftt.setHarrisDetector(true);
    CV_FeatureDetectorTest test( "detector-harris", gftt);
    test.safe_run();
}

TEST( Features2d_Detector_MSER, DISABLED_regression )
{
    CV_FeatureDetectorTest test( "detector-mser", MSER::create() );
    test.safe_run();
}

TEST( Features2d_Detector_ORB, regression )
{
    CV_FeatureDetectorTest test( "detector-orb", ORB::create() );
    test.safe_run();
}

TEST( Features2d_Detector_KAZE, regression )
{
    CV_FeatureDetectorTest test( "detector-kaze", KAZE::create() );
    test.safe_run();
}

TEST( Features2d_Detector_AKAZE, regression )
{
    CV_FeatureDetectorTest test( "detector-akaze", AKAZE::create() );
    test.safe_run();
}
