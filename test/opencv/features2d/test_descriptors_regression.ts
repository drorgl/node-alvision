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

using namespace std;
using namespace cv;

const string FEATURES2D_DIR = "features2d";
const string IMAGE_FILENAME = "tsukuba.png";
const string DESCRIPTOR_DIR = FEATURES2D_DIR + "/descriptor_extractors";

/****************************************************************************************\
*                     Regression tests for descriptor extractors.                        *
\****************************************************************************************/
static void writeMatInBin( const Mat& mat, const string& filename )
{
    FILE* f = fopen( filename, "wb");
    if( f )
    {
        int type = mat.type();
        fwrite( (void*)&mat.rows, sizeof(int), 1, f );
        fwrite( (void*)&mat.cols, sizeof(int), 1, f );
        fwrite( (void*)&type, sizeof(int), 1, f );
        int dataSize = (int)(mat.step * mat.rows * mat.channels());
        fwrite( (void*)&dataSize, sizeof(int), 1, f );
        fwrite( (void*)mat.ptr(), 1, dataSize, f );
        fclose(f);
    }
}

static Mat readMatFromBin( const string& filename )
{
    FILE* f = fopen( filename, "rb" );
    if( f )
    {
        int rows, cols, type, dataSize;
        size_t elements_read1 = fread( (void*)&rows, sizeof(int), 1, f );
        size_t elements_read2 = fread( (void*)&cols, sizeof(int), 1, f );
        size_t elements_read3 = fread( (void*)&type, sizeof(int), 1, f );
        size_t elements_read4 = fread( (void*)&dataSize, sizeof(int), 1, f );
        CV_Assert(elements_read1 == 1 && elements_read2 == 1 && elements_read3 == 1 && elements_read4 == 1);

        int step = dataSize / rows / CV_ELEM_SIZE(type);
        CV_Assert(step >= cols);

        Mat m = Mat(rows, step, type).colRange(0, cols);

        size_t elements_read = fread( m.ptr(), 1, dataSize, f );
        CV_Assert(elements_read == (size_t)(dataSize));
        fclose(f);

        return m;
    }
    return Mat();
}

template<class Distance>
class CV_DescriptorExtractorTest  extends alvision.cvtest.BaseTest
{
public:
    typedef typename Distance::ValueType ValueType;
    typedef typename Distance::ResultType DistanceType;

    CV_DescriptorExtractorTest( const string _name, DistanceType _maxDist, const Ptr<DescriptorExtractor>& _dextractor,
                                Distance d = Distance(), Ptr<FeatureDetector> _detector = Ptr<FeatureDetector>()):
        name(_name), maxDist(_maxDist), dextractor(_dextractor), distance(d) , detector(_detector) {}

    ~CV_DescriptorExtractorTest()
    {
    }
protected:
    virtual void createDescriptorExtractor() {}

    void compareDescriptors( const Mat& validDescriptors, const Mat& calcDescriptors )
    {
        if( validDescriptors.size != calcDescriptors.size || validDescriptors.type() != calcDescriptors.type() )
        {
            ts.printf(alvision.cvtest.TSConstants.LOG, "Valid and computed descriptors matrices must have the same size and type.\n");
            this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA );
            return;
        }

        CV_Assert( DataType<ValueType>::type == validDescriptors.type() );

        int dimension = validDescriptors.cols;
        DistanceType curMaxDist = std::numeric_limits<DistanceType>::min();
        for( int y = 0; y < validDescriptors.rows; y++ )
        {
            DistanceType dist = distance( validDescriptors.ptr<ValueType>(y), calcDescriptors.ptr<ValueType>(y), dimension );
            if( dist > curMaxDist )
                curMaxDist = dist;
        }

        stringstream ss;
        ss << "Max distance between valid and computed descriptors " << curMaxDist;
        if( curMaxDist <= maxDist )
            ss << "." << endl;
        else
        {
            ss << ">" << maxDist  << " - bad accuracy!"<< endl;
            this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY );
        }
        ts.printf(alvision.cvtest.TSConstants.LOG,  ss );
    }

    void emptyDataTest()
    {
        assert( dextractor );

        // One image.
        Mat image;
        Array<KeyPoint> keypoints;
        Mat descriptors;

        try
        {
            dextractor.compute( image, keypoints, descriptors );
        }
        catch(...)
        {
            ts.printf( alvision.cvtest.TSConstants.LOG, "compute() on empty image and empty keypoints must not generate exception (1).\n");
            this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA );
        }

        image.create( 50, 50, CV_8UC3 );
        try
        {
            dextractor.compute( image, keypoints, descriptors );
        }
        catch(...)
        {
            ts.printf( alvision.cvtest.TSConstants.LOG, "compute() on nonempty image and empty keypoints must not generate exception (1).\n");
            this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA );
        }

        // Several images.
        Array<Mat> images;
        Array<Array<KeyPoint> > keypointsCollection;
        Array<Mat> descriptorsCollection;
        try
        {
            dextractor.compute( images, keypointsCollection, descriptorsCollection );
        }
        catch(...)
        {
            ts.printf( alvision.cvtest.TSConstants.LOG, "compute() on empty images and empty keypoints collection must not generate exception (2).\n");
            this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA );
        }
    }

    void regressionTest()
    {
        assert( dextractor );

        // Read the test image.
        string imgFilename =  this.ts.get_data_path() + FEATURES2D_DIR + "/" + IMAGE_FILENAME;
        Mat img = imread( imgFilename );
        if( img.empty() )
        {
            ts.printf( alvision.cvtest.TSConstants.LOG, "Image %s can not be read.\n", imgFilename );
            this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA );
            return;
        }
        Array<KeyPoint> keypoints;
        FileStorage fs( this.ts.get_data_path() + FEATURES2D_DIR + "/keypoints.xml.gz", FileStorage::READ );
        if(!detector.empty()) {
            detector.detect(img, keypoints);
        } else {
            read( fs.getFirstTopLevelNode(), keypoints );
        }
        if(!keypoints.empty())
        {
            Mat calcDescriptors;
            double t = (double)getTickCount();
            dextractor.compute( img, keypoints, calcDescriptors );
            t = getTickCount() - t;
            ts.printf(alvision.cvtest.TSConstants.LOG, "\nAverage time of computing one descriptor = %g ms.\n", t/((double)getTickFrequency()*1000.)/calcDescriptors.rows);

            if( calcDescriptors.rows != (int)keypoints.size() )
            {
                ts.printf( alvision.cvtest.TSConstants.LOG, "Count of computed descriptors and keypoints count must be equal.\n" );
                ts.printf( alvision.cvtest.TSConstants.LOG, "Count of keypoints is            %d.\n", (int)keypoints.size() );
                ts.printf( alvision.cvtest.TSConstants.LOG, "Count of computed descriptors is %d.\n", calcDescriptors.rows );
                this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT );
                return;
            }

            if( calcDescriptors.cols != dextractor.descriptorSize() || calcDescriptors.type() != dextractor.descriptorType() )
            {
                ts.printf( alvision.cvtest.TSConstants.LOG, "Incorrect descriptor size or descriptor type.\n" );
                ts.printf( alvision.cvtest.TSConstants.LOG, "Expected size is   %d.\n", dextractor.descriptorSize() );
                ts.printf( alvision.cvtest.TSConstants.LOG, "Calculated size is %d.\n", calcDescriptors.cols );
                ts.printf( alvision.cvtest.TSConstants.LOG, "Expected type is   %d.\n", dextractor.descriptorType() );
                ts.printf( alvision.cvtest.TSConstants.LOG, "Calculated type is %d.\n", calcDescriptors.type() );
                this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT );
                return;
            }

            // TODO read and write descriptor extractor parameters and check them
            Mat validDescriptors = readDescriptors();
            if( !validDescriptors.empty() )
                compareDescriptors( validDescriptors, calcDescriptors );
            else
            {
                if( !writeDescriptors( calcDescriptors ) )
                {
                    ts.printf( alvision.cvtest.TSConstants.LOG, "Descriptors can not be written.\n" );
                    this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA );
                    return;
                }
            }
        }
        if(!fs.isOpened())
        {
            ts.printf( alvision.cvtest.TSConstants.LOG, "Compute and write keypoints.\n" );
            fs.open( this.ts.get_data_path() + FEATURES2D_DIR + "/keypoints.xml.gz", FileStorage::WRITE );
            if( fs.isOpened() )
            {
                Ptr<ORB> fd = ORB::create();
                fd.detect(img, keypoints);
                write( fs, "keypoints", keypoints );
            }
            else
            {
                ts.printf(alvision.cvtest.TSConstants.LOG, "File for writting keypoints can not be opened.\n");
                this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA );
                return;
            }
        }
    }

    void run(int)
    {
        createDescriptorExtractor();
        if( !dextractor )
        {
            ts.printf(alvision.cvtest.TSConstants.LOG, "Descriptor extractor is empty.\n");
            this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA );
            return;
        }

        emptyDataTest();
        regressionTest();

        this.ts.set_failed_test_info( alvision.cvtest.FailureCode.OK );
    }

    virtual Mat readDescriptors()
    {
        Mat res = readMatFromBin( this.ts.get_data_path() + DESCRIPTOR_DIR + "/" + string(name) );
        return res;
    }

    virtual bool writeDescriptors( Mat& descs )
    {
        writeMatInBin( descs,  this.ts.get_data_path() + DESCRIPTOR_DIR + "/" + string(name) );
        return true;
    }

    string name;
    const DistanceType maxDist;
    Ptr<DescriptorExtractor> dextractor;
    Distance distance;
    Ptr<FeatureDetector> detector;

private:
    CV_DescriptorExtractorTest& operator=(const CV_DescriptorExtractorTest&) { return *this; }
};

/****************************************************************************************\
*                                Tests registrations                                     *
\****************************************************************************************/

TEST( Features2d_DescriptorExtractor_BRISK, regression )
{
    CV_DescriptorExtractorTest<Hamming> test( "descriptor-brisk",
                                             (CV_DescriptorExtractorTest<Hamming>::DistanceType)2.f,
                                            BRISK::create() );
    test.safe_run();
}

TEST( Features2d_DescriptorExtractor_ORB, regression )
{
    // TODO adjust the parameters below
    CV_DescriptorExtractorTest<Hamming> test( "descriptor-orb",
#if CV_NEON
                                              (CV_DescriptorExtractorTest<Hamming>::DistanceType)25.f,
#else
                                              (CV_DescriptorExtractorTest<Hamming>::DistanceType)12.f,
#endif
                                             ORB::create() );
    test.safe_run();
}

TEST( Features2d_DescriptorExtractor_KAZE, regression )
{
    CV_DescriptorExtractorTest< L2<float> > test( "descriptor-kaze",  0.03f,
                                                 KAZE::create(),
                                                 L2<float>(), KAZE::create() );
    test.safe_run();
}

TEST( Features2d_DescriptorExtractor_AKAZE, regression )
{
    CV_DescriptorExtractorTest<Hamming> test( "descriptor-akaze",
                                              (CV_DescriptorExtractorTest<Hamming>::DistanceType)12.f,
                                              AKAZE::create(),
                                              Hamming(), AKAZE::create());
    test.safe_run();
}

TEST( Features2d_DescriptorExtractor, batch )
{
    string path = string(alvision.cvtest.TS.ptr().get_data_path() + "detectors_descriptors_evaluation/images_datasets/graf");
    Array<Mat> imgs, descriptors;
    Array<Array<KeyPoint> > keypoints;
    int i, n = 6;
    Ptr<ORB> orb = ORB::create();

    for( i = 0; i < n; i++ )
    {
        string imgname = format("%s/img%d.png", path, i+1);
        Mat img = imread(imgname, 0);
        imgs.push(img);
    }

    orb.detect(imgs, keypoints);
    orb.compute(imgs, keypoints, descriptors);

    ASSERT_EQ((int)keypoints.size(), n);
    ASSERT_EQ((int)descriptors.size(), n);

    for( i = 0; i < n; i++ )
    {
        EXPECT_GT((int)keypoints[i].size(), 100);
        EXPECT_GT(descriptors[i].rows, 100);
    }
}

TEST( Features2d_Feature2d, no_crash )
{
    const String& pattern = string(alvision.cvtest.TS.ptr().get_data_path() + "shared/*.png");
    Array<String> fnames;
    glob(pattern, fnames, false);
    sort(fnames.begin(), fnames.end());

    Ptr<AKAZE> akaze = AKAZE::create();
    Ptr<ORB> orb = ORB::create();
    Ptr<KAZE> kaze = KAZE::create();
    Ptr<BRISK> brisk = BRISK::create();
    size_t i, n = fnames.size();
    Array<KeyPoint> keypoints;
    Mat descriptors;
    orb.setMaxFeatures(5000);

    for( i = 0; i < n; i++ )
    {
        printf("%d. image: %s:\n", (int)i, fnames[i]);
        if( strstr(fnames[i], "MP.png") != 0 )
            continue;
        bool checkCount = strstr(fnames[i], "templ.png") == 0;

        Mat img = imread(fnames[i], -1);
        printf("\tAKAZE ... "); fflush(stdout);
        akaze.detectAndCompute(img, noArray(), keypoints, descriptors);
        printf("(%d keypoints) ", (int)keypoints.size()); fflush(stdout);
        if( checkCount )
        {
            EXPECT_GT((int)keypoints.size(), 0);
        }
        ASSERT_EQ(descriptors.rows, (int)keypoints.size());
        printf("ok\n");

        printf("\tKAZE ... "); fflush(stdout);
        kaze.detectAndCompute(img, noArray(), keypoints, descriptors);
        printf("(%d keypoints) ", (int)keypoints.size()); fflush(stdout);
        if( checkCount )
        {
            EXPECT_GT((int)keypoints.size(), 0);
        }
        ASSERT_EQ(descriptors.rows, (int)keypoints.size());
        printf("ok\n");

        printf("\tORB ... "); fflush(stdout);
        orb.detectAndCompute(img, noArray(), keypoints, descriptors);
        printf("(%d keypoints) ", (int)keypoints.size()); fflush(stdout);
        if( checkCount )
        {
            EXPECT_GT((int)keypoints.size(), 0);
        }
        ASSERT_EQ(descriptors.rows, (int)keypoints.size());
        printf("ok\n");

        printf("\tBRISK ... "); fflush(stdout);
        brisk.detectAndCompute(img, noArray(), keypoints, descriptors);
        printf("(%d keypoints) ", (int)keypoints.size()); fflush(stdout);
        if( checkCount )
        {
            EXPECT_GT((int)keypoints.size(), 0);
        }
        ASSERT_EQ(descriptors.rows, (int)keypoints.size());
        printf("ok\n");
    }
}
