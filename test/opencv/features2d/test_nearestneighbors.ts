/*M///////////////////////////////////////////////////////////////////////////////////////
//
//  IMPORTANT: READ BEFORE DOWNLOADING, COPYING, INSTALLING OR USING.
//
//  By downloading, copying, installing or using the software you agree to this license.
//  If you do not agree to this license, do not download, install,
//  copy or use the software.
//
//
//                           License Agreement
//                For Open Source Computer Vision Library
//
// Copyright (C) 2000-2008, Intel Corporation, all rights reserved.
// Copyright (C) 2009, Willow Garage Inc., all rights reserved.
// Copyright (C) 2014, Itseez Inc, all rights reserved.
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
//   * The name of the copyright holders may not be used to endorse or promote products
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

#include <algorithm>
#include <vector>
#include <iostream>

using namespace std;
using namespace cv;
using namespace alvision.flann;

//--------------------------------------------------------------------------------
class NearestNeighborTest  extends alvision.cvtest.BaseTest
{
public:
    NearestNeighborTest() {}
protected:
    static const int minValue = 0;
    static const int maxValue = 1;
    static const int dims = 30;
    static const int featuresCount = 2000;
    static const int K = 1; // * should also test 2nd nn etc.?


    virtual void run( int start_from );
    virtual void createModel( const Mat& data ) = 0;
    virtual int findNeighbors( Mat& points, Mat& neighbors ) = 0;
    virtual int checkGetPoins( const Mat& data );
    virtual int checkFindBoxed();
    virtual int checkFind( const Mat& data );
    virtual void releaseModel() = 0;
};

int NearestNeighborTest::checkGetPoins( const Mat& )
{
   return alvision.cvtest.FailureCode.OK;
}

int NearestNeighborTest::checkFindBoxed()
{
    return alvision.cvtest.FailureCode.OK;
}

int NearestNeighborTest::checkFind( const Mat& data )
{
    int code = alvision.cvtest.FailureCode.OK;
    int pointsCount = 1000;
    float noise = 0.2f;

    RNG rng;
    Mat points( pointsCount, dims, CV_32FC1 );
    Mat results( pointsCount, K, CV_32SC1 );

    Array<int> fmap( pointsCount );
    for( int pi = 0; pi < pointsCount; pi++ )
    {
        int fi = rng.next() % featuresCount;
        fmap[pi] = fi;
        for( int d = 0; d < dims; d++ )
            points.at<float>(pi, d) = data.at<float>(fi, d) + rng.uniform(0.0f, 1.0f) * noise;
    }

    code = findNeighbors( points, results );

    if( code == alvision.cvtest.FailureCode.OK )
    {
        int correctMatches = 0;
        for( int pi = 0; pi < pointsCount; pi++ )
        {
            if( fmap[pi] == results.at<int>(pi, 0) )
                correctMatches++;
        }

        double correctPerc = correctMatches / (double)pointsCount;
        if (correctPerc < .75)
        {
            ts.printf( alvision.cvtest.TSConstants.LOG, "correct_perc = %d\n", correctPerc );
            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
        }
    }

    return code;
}

void NearestNeighborTest::run( int /*start_from*/ ) {
    int code = alvision.cvtest.FailureCode.OK, tempCode;
    Mat desc( featuresCount, dims, CV_32FC1 );
    randu( desc, Scalar(minValue), Scalar(maxValue) );

    createModel( desc );

    tempCode = checkGetPoins( desc );
    if( tempCode != alvision.cvtest.FailureCode.OK )
    {
        ts.printf( alvision.cvtest.TSConstants.LOG, "bad accuracy of GetPoints \n" );
        code = tempCode;
    }

    tempCode = checkFindBoxed();
    if( tempCode != alvision.cvtest.FailureCode.OK )
    {
        ts.printf( alvision.cvtest.TSConstants.LOG, "bad accuracy of FindBoxed \n" );
        code = tempCode;
    }

    tempCode = checkFind( desc );
    if( tempCode != alvision.cvtest.FailureCode.OK )
    {
        ts.printf( alvision.cvtest.TSConstants.LOG, "bad accuracy of Find \n" );
        code = tempCode;
    }

    releaseModel();

    this.ts.set_failed_test_info( code );
}

//--------------------------------------------------------------------------------
class CV_FlannTest : public NearestNeighborTest
{
public:
    CV_FlannTest() {}
protected:
    void createIndex( const Mat& data, const IndexParams& params );
    int knnSearch( Mat& points, Mat& neighbors );
    int radiusSearch( Mat& points, Mat& neighbors );
    virtual void releaseModel();
    Index* index;
};

void CV_FlannTest::createIndex( const Mat& data, const IndexParams& params )
{
    index = new Index( data, params );
}

int CV_FlannTest::knnSearch( Mat& points, Mat& neighbors )
{
    Mat dist( points.rows, neighbors.cols, CV_32FC1);
    int knn = 1, j;

    // 1st way
    index.knnSearch( points, neighbors, dist, knn, SearchParams() );

    // 2nd way
    Mat neighbors1( neighbors.size(), CV_32SC1 );
    for( int i = 0; i < points.rows; i++ )
    {
        float* fltPtr = points.ptr<float>(i);
        Array<float> query( fltPtr, fltPtr + points.cols );
        Array<int> indices( neighbors1.cols, 0 );
        Array<float> dists( dist.cols, 0 );
        index.knnSearch( query, indices, dists, knn, SearchParams() );
        Array<int>::const_iterator it = indices.begin();
        for( j = 0; it != indices.end(); ++it, j++ )
            neighbors1.at<int>(i,j) = *it;
    }

    // compare results
    if( alvision.cvtest.norm( neighbors, neighbors1, NORM_L1 ) != 0 )
        return alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;

    return alvision.cvtest.FailureCode.OK;
}

int CV_FlannTest::radiusSearch( Mat& points, Mat& neighbors )
{
    Mat dist( 1, neighbors.cols, CV_32FC1);
    Mat neighbors1( neighbors.size(), CV_32SC1 );
    float radius = 10.0f;
    int j;

    // radiusSearch can only search one feature at a time for range search
    for( int i = 0; i < points.rows; i++ )
    {
        // 1st way
        Mat p( 1, points.cols, CV_32FC1, points.ptr<float>(i) ),
            n( 1, neighbors.cols, CV_32SC1, neighbors.ptr<int>(i) );
        index.radiusSearch( p, n, dist, radius, neighbors.cols, SearchParams() );

        // 2nd way
        float* fltPtr = points.ptr<float>(i);
        Array<float> query( fltPtr, fltPtr + points.cols );
        Array<int> indices( neighbors1.cols, 0 );
        Array<float> dists( dist.cols, 0 );
        index.radiusSearch( query, indices, dists, radius, neighbors.cols, SearchParams() );
        Array<int>::const_iterator it = indices.begin();
        for( j = 0; it != indices.end(); ++it, j++ )
            neighbors1.at<int>(i,j) = *it;
    }
    // compare results
    if( alvision.cvtest.norm( neighbors, neighbors1, NORM_L1 ) != 0 )
        return alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;

    return alvision.cvtest.FailureCode.OK;
}

void CV_FlannTest::releaseModel()
{
    delete index;
}

//---------------------------------------
class CV_FlannLinearIndexTest : public CV_FlannTest
{
public:
    CV_FlannLinearIndexTest() {}
protected:
    virtual void createModel( const Mat& data ) { createIndex( data, LinearIndexParams() ); }
    virtual int findNeighbors( Mat& points, Mat& neighbors ) { return knnSearch( points, neighbors ); }
};

//---------------------------------------
class CV_FlannKMeansIndexTest : public CV_FlannTest
{
public:
    CV_FlannKMeansIndexTest() {}
protected:
    virtual void createModel( const Mat& data ) { createIndex( data, KMeansIndexParams() ); }
    virtual int findNeighbors( Mat& points, Mat& neighbors ) { return radiusSearch( points, neighbors ); }
};

//---------------------------------------
class CV_FlannKDTreeIndexTest : public CV_FlannTest
{
public:
    CV_FlannKDTreeIndexTest() {}
protected:
    virtual void createModel( const Mat& data ) { createIndex( data, KDTreeIndexParams() ); }
    virtual int findNeighbors( Mat& points, Mat& neighbors ) { return radiusSearch( points, neighbors ); }
};

//----------------------------------------
class CV_FlannCompositeIndexTest : public CV_FlannTest
{
public:
    CV_FlannCompositeIndexTest() {}
protected:
    virtual void createModel( const Mat& data ) { createIndex( data, CompositeIndexParams() ); }
    virtual int findNeighbors( Mat& points, Mat& neighbors ) { return knnSearch( points, neighbors ); }
};

//----------------------------------------
class CV_FlannAutotunedIndexTest : public CV_FlannTest
{
public:
    CV_FlannAutotunedIndexTest() {}
protected:
    virtual void createModel( const Mat& data ) { createIndex( data, AutotunedIndexParams() ); }
    virtual int findNeighbors( Mat& points, Mat& neighbors ) { return knnSearch( points, neighbors ); }
};
//----------------------------------------
class CV_FlannSavedIndexTest : public CV_FlannTest
{
public:
    CV_FlannSavedIndexTest() {}
protected:
    virtual void createModel( const Mat& data );
    virtual int findNeighbors( Mat& points, Mat& neighbors ) { return knnSearch( points, neighbors ); }
};

void CV_FlannSavedIndexTest::createModel(const alvision.Mat &data)
{
    switch ( alvision.cvtest.randInt(ts.get_rng()) % 2 )
    {
        //case 0: createIndex( data, LinearIndexParams() ); break; // nothing to save for linear search
        case 0: createIndex( data, KMeansIndexParams() ); break;
        case 1: createIndex( data, KDTreeIndexParams() ); break;
        //case 2: createIndex( data, CompositeIndexParams() ); break; // nothing to save for linear search
        //case 2: createIndex( data, AutotunedIndexParams() ); break; // possible linear index !
        default: assert(0);
    }
    string filename = tempfile();
    index.save( filename );

    createIndex( data, SavedIndexParams(filename));
    remove( filename );
}

TEST(Features2d_FLANN_Linear, regression) { CV_FlannLinearIndexTest test; test.safe_run(); }
TEST(Features2d_FLANN_KMeans, regression) { CV_FlannKMeansIndexTest test; test.safe_run(); }
TEST(Features2d_FLANN_KDTree, regression) { CV_FlannKDTreeIndexTest test; test.safe_run(); }
TEST(Features2d_FLANN_Composite, regression) { CV_FlannCompositeIndexTest test; test.safe_run(); }
TEST(Features2d_FLANN_Auto, regression) { CV_FlannAutotunedIndexTest test; test.safe_run(); }
TEST(Features2d_FLANN_Saved, regression) { CV_FlannSavedIndexTest test; test.safe_run(); }
