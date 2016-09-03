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

import async = require("async");
import alvision = require("../../../tsbinding/alvision");
import util = require('util');
import fs = require('fs');

//#include "test_precomp.hpp"
//#include "opencv2/highgui.hpp"
//
//using namespace std;
//using namespace cv;

const FEATURES2D_DIR = "features2d";
const IMAGE_FILENAME = "tsukuba.png";

/****************************************************************************************\
*                       Algorithmic tests for descriptor matchers                        *
\****************************************************************************************/
class CV_DescriptorMatcherTest  extends alvision.cvtest.BaseTest
{
    constructor(_name: string, _dmatcher: alvision.DescriptorMatcher, _badPart: alvision.float) {
        super();
        this.badPart = (_badPart);
        this.name = (_name);
        this.dmatcher = (_dmatcher);
    }

    private  dim = 500;
    private  queryDescCount = 300; // must be even number because we split train data in some cases in two
    private  countFactor = 4; // do not change it
    private badPart: alvision.float;

     run(iii: alvision.int): void {
        var query = new alvision.Mat(), train = new alvision.Mat();
        this.generateData(query, train);

        this.matchTest(query, train);

        this.knnMatchTest(query, train);

        this.radiusMatchTest(query, train);

    }
    protected generateData(query: alvision.Mat, train: alvision.Mat): void {
        var rng = alvision.theRNG();

        // Generate query descriptors randomly.
        // Descriptor vector elements are integer values.
        var buf = new alvision.Mat(this.queryDescCount,this. dim, alvision.MatrixType.CV_32SC1);
        rng.fill(buf, alvision.DistType.UNIFORM, alvision.Scalar.all(0),new alvision. Scalar(3));
        buf.convertTo(query,alvision.MatrixType. CV_32FC1);

        // Generate train decriptors as follows:
        // copy each query descriptor to train set countFactor times
        // and perturb some one element of the copied descriptors in
        // in ascending order. General boundaries of the perturbation
        // are (0.f, 1.f).
        train.create(query.rows().valueOf() * this.countFactor.valueOf(), query.cols(),alvision.MatrixType. CV_32FC1);
        var step = 1. / this.countFactor.valueOf();
        for (var qIdx = 0; qIdx < query.rows(); qIdx++ )
        {
            var queryDescriptor = query.row(qIdx);
            for (var c = 0; c < this.countFactor; c++ )
            {
                var tIdx = qIdx * this.countFactor + c;
                var trainDescriptor = train.row(tIdx);
                queryDescriptor.copyTo(trainDescriptor);
                var elem = rng.uniform(0,this.dim);
                var diff = rng.uniform(step * c, step * (c + 1));
                trainDescriptor.at<alvision.float>("float", 0, elem).set(trainDescriptor.at<alvision.float>("float", 0, elem).get().valueOf() + diff.valueOf());// += diff;
            }
        }
    }

    protected emptyDataTest(): void {
        alvision.assert(()=>!this.dmatcher.empty());
        var queryDescriptors = new alvision.Mat(), trainDescriptors = new alvision.Mat(), mask = new alvision.Mat();
        var trainDescriptorCollection = new Array<alvision.Mat>(), masks = new Array<alvision.Mat> ();
        var matches = new Array<alvision.DMatch>();
        var vmatches = new Array<Array<alvision.DMatch>>();

        try {
            this.dmatcher.match(queryDescriptors, trainDescriptors, (matches_) => { matches = matches_; }, mask);
        }
        catch (e) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "match() on empty descriptors must not generate exception (1).\n");
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
        }

        try {
            this.dmatcher.knnMatch(queryDescriptors, trainDescriptors, (matches_) => { vmatches = matches_ }, 2, mask);
        }
        catch (e) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "knnMatch() on empty descriptors must not generate exception (1).\n");
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
        }

        try {
            this.dmatcher.radiusMatch(queryDescriptors, trainDescriptors, vmatches, 10., mask);
        }
        catch (e) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "radiusMatch() on empty descriptors must not generate exception (1).\n");
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
        }

        try {
            this.dmatcher.add(trainDescriptorCollection);
        }
        catch (e) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "add() on empty descriptors must not generate exception.\n");
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
        }

        try {
            this.dmatcher.match(queryDescriptors, (matches_) => { matches = matches_;}, masks);
        }
        catch (e) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "match() on empty descriptors must not generate exception (2).\n");
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
        }

        try {
            this.dmatcher.knnMatch(queryDescriptors, (matches_) => { vmatches = matches_;}, 2, masks);
        }
        catch (e) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "knnMatch() on empty descriptors must not generate exception (2).\n");
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
        }

        try {
            this.dmatcher.radiusMatch(queryDescriptors, (matches_) => { vmatches = matches_ }, 10., masks);
        }
        catch (e) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "radiusMatch() on empty descriptors must not generate exception (2).\n");
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
        }

    }
    protected matchTest(query: alvision.Mat, train: alvision.Mat): void {
        this.dmatcher.clear();

        // test const version of match()
        {
            var matches = new Array<alvision.DMatch>();
            this.dmatcher.match(query, train, (matches_) => { matches = matches_; });

            if (matches.length != this.queryDescCount) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Incorrect matches count while test match() function (1).\n");
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
            }
            else {
                var badCount = 0;
                for (var i = 0; i < matches.length; i++) {
                    var match = matches[i];
                    if ((match.queryIdx != i) || (match.trainIdx != i * this.countFactor) || (match.imgIdx != 0))
                        badCount++;
                }
                if (badCount > this.queryDescCount * this.badPart.valueOf()) {
                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "%f - too large bad matches part while test match() function (1).\n",
                        badCount / this.queryDescCount);
                    this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
                }
            }
        }

        // test const version of match() for the same query and test descriptors
        {
            var matches = new Array<alvision.DMatch>();
            this.dmatcher.match(query, query, (matches_) => { matches = matches_; });

            if (matches.length != query.rows()) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Incorrect matches count while test match() function for the same query and test descriptors (1).\n");
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
            }
            else {
                for (var i = 0; i < matches.length; i++) {
                    var match = matches[i];
                    //console.log(match.distance << std::endl;

                    if (match.queryIdx != i || match.trainIdx != i || Math.abs(match.distance.valueOf()) > alvision.FLT_EPSILON) {
                        this.ts.printf(alvision.cvtest.TSConstants.LOG, "Bad match (i=%d, queryIdx=%d, trainIdx=%d, distance=%f) while test match() function for the same query and test descriptors (1).\n",
                            i, match.queryIdx, match.trainIdx, match.distance);
                        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
                    }
                }
            }
        }

        // test version of match() with add()
        {
            var matches = new Array<alvision.DMatch>();
            // make add() twice to test such case
            this.dmatcher.add(alvision.NewArray<alvision.Mat>(1,()=> train.rowRange(0, train.rows().valueOf() / 2)));
            this.dmatcher.add(alvision.NewArray<alvision.Mat>(1,()=> train.rowRange(train.rows().valueOf() / 2, train.rows())));
            // prepare masks (make first nearest match illegal)
            var masks = new Array<alvision.Mat>(2);
            for (var mi = 0; mi < 2; mi++) {
                masks[mi] = new alvision.Mat(query.rows(), train.rows().valueOf() / 2, alvision.MatrixType.CV_8UC1,  alvision.Scalar.all(1));
                for (var di = 0; di < this.queryDescCount / 2; di++)
                    masks[mi].col(di * this.countFactor).setTo(alvision.Scalar.all(0));
            }

            this.dmatcher.match(query, (matches_) => { matches = matches_; }, masks);

            if (matches.length != this.queryDescCount) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Incorrect matches count while test match() function (2).\n");
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
            }
            else {
                var badCount = 0;
                for (var i = 0; i < matches.length; i++) {
                    var match = matches[i];
                    var shift = this.dmatcher.isMaskSupported() ? 1 : 0;
                    {
                        if (i < this.queryDescCount / 2) {
                            if ((match.queryIdx != i) || (match.trainIdx != i* this.countFactor + shift) || (match.imgIdx != 0) )
                            badCount++;
                        }
                        else {
                            if ((match.queryIdx != i) || (match.trainIdx != (i- this.queryDescCount / 2)*this.countFactor + shift) || (match.imgIdx != 1) )
                            badCount++;
                        }
                    }
                }
                if (badCount > this.queryDescCount * this.badPart.valueOf()) {
                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "%f - too large bad matches part while test match() function (2).\n",
                        badCount / this.queryDescCount);
                    this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
                }
            }
        }
    }

    protected knnMatchTest(query: alvision.Mat, train: alvision.Mat): void {
        this.dmatcher.clear();

    // test const version of knnMatch()
    {
        const knn = 3;

        var matches = new Array<Array<alvision.DMatch>>();
        this.dmatcher.knnMatch(query, train, (matches_) => { matches = matches_; }, knn);

        if (matches.length != this.queryDescCount )
        {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Incorrect matches count while test knnMatch() function (1).\n");
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
        }
        else
        {
            var badCount = 0;
            for (var i = 0; i < matches.length; i++ )
            {
                if (matches[i].length != knn )
                badCount++;
                else
                {
                    var localBadCount = 0;
                    for (var k = 0; k < knn; k++ )
                    {
                        var match = matches[i][k];
                        if ((match.queryIdx != i) || (match.trainIdx != i* this.countFactor + k) || (match.imgIdx != 0) )
                        localBadCount++;
                    }
                    badCount += localBadCount > 0 ? 1 : 0;
                }
            }
            if (badCount > this.queryDescCount* this.badPart.valueOf() )
            {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "%f - too large bad matches part while test knnMatch() function (1).\n",
                    badCount/ this.queryDescCount );
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
            }
        }
    }

    // test version of knnMatch() with add()
    {
        const  knn = 2;
        var matches = new Array<Array<alvision.DMatch>>();
        // make add() twice to test such case
        this.dmatcher.add(alvision.NewArray<alvision.Mat>(1,()=> train.rowRange(0, train.rows().valueOf() / 2)));
        this.dmatcher.add(alvision.NewArray<alvision.Mat>(1,()=> train.rowRange(train.rows().valueOf() / 2, train.rows())));
        // prepare masks (make first nearest match illegal)
        var masks = new Array<alvision.Mat> (2);
        for (var mi = 0; mi < 2; mi++ )
        {
            masks[mi] = new alvision.Mat(query.rows(), train.rows().valueOf() / 2, alvision.MatrixType.CV_8UC1, alvision.Scalar.all(1));
            for (var di = 0; di < this.queryDescCount / 2; di++ )
            masks[mi].col(di * this.countFactor).setTo(alvision.Scalar.all(0));
        }

        this.dmatcher.knnMatch(query, (matches_) => { matches = matches_; }, knn, masks);

        if (matches.length != this.queryDescCount )
        {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Incorrect matches count while test knnMatch() function (2).\n");
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
        }
        else
        {
            var badCount = 0;
            var shift = this.dmatcher.isMaskSupported() ? 1 : 0;
            for (var i = 0; i < matches.length; i++ )
            {
                if (matches[i].length != knn )
                badCount++;
                else
                {
                    var localBadCount = 0;
                    for (var k = 0; k < knn; k++ )
                    {
                        var match = matches[i][k];
                        {
                            if (i < this.queryDescCount / 2) {
                                if ((match.queryIdx != i) || (match.trainIdx != i* this.countFactor + k + shift) ||
                                    (match.imgIdx != 0) )
                                localBadCount++;
                            }
                            else {
                                if ((match.queryIdx != i) || (match.trainIdx != (i- this.queryDescCount / 2)*this.countFactor + k + shift) ||
                                    (match.imgIdx != 1) )
                                localBadCount++;
                            }
                        }
                    }
                    badCount += localBadCount > 0 ? 1 : 0;
                }
            }
            if (badCount > this.queryDescCount* this.badPart.valueOf() )
            {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "%f - too large bad matches part while test knnMatch() function (2).\n",
                    badCount/ this.queryDescCount );
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
            }
        }
    }
    }
    protected radiusMatchTest(query: alvision.Mat, train: alvision.Mat): void {
        this.dmatcher.clear();
    // test const version of match()
    {
        const radius = 1./this.countFactor;
        var matches = new Array<Array<alvision.DMatch>>();
        this.dmatcher.radiusMatch(query, train, matches, radius);

        if (matches.length != this.queryDescCount )
        {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Incorrect matches count while test radiusMatch() function (1).\n");
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
        }
        else
        {
            var badCount = 0;
            for (var i = 0; i < matches.length; i++ )
            {
                if (matches[i].length != 1 )
                badCount++;
                else
                {
                    var match = matches[i][0];
                    if ((match.queryIdx != i) || (match.trainIdx != i* this.countFactor) || (match.imgIdx != 0) )
                    badCount++;
                }
            }
            if (badCount > this.queryDescCount* this.badPart.valueOf() )
            {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "%f - too large bad matches part while test radiusMatch() function (1).\n",
                    badCount/ this.queryDescCount );
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
            }
        }
    }

    // test version of match() with add()
    {
        var n = 3;
        const radius = 1./this.countFactor * n;
        var matches = new Array<Array<alvision.DMatch>>();
        // make add() twice to test such case
        this.dmatcher.add(alvision.NewArray<alvision.Mat>(1,()=> train.rowRange(0, train.rows().valueOf() / 2)));
        this.dmatcher.add(alvision.NewArray<alvision.Mat>(1,()=> train.rowRange(train.rows().valueOf() / 2, train.rows())));
        // prepare masks (make first nearest match illegal)
        var masks = new Array<alvision.Mat> (2);
        for (var mi = 0; mi < 2; mi++ )
        {
            masks[mi] = new alvision.Mat(query.rows(), train.rows().valueOf() / 2, alvision.MatrixType.CV_8UC1, alvision.Scalar.all(1));
            for (var di = 0; di < this.queryDescCount / 2; di++ )
            masks[mi].col(di * this.countFactor).setTo(alvision.Scalar.all(0));
        }

        this.dmatcher.radiusMatch(query, (matches_) => { matches = matches_; }, radius, masks);

        //int curRes = alvision.cvtest.FailureCode.OK;
        if (matches.length != this.queryDescCount )
        {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Incorrect matches count while test radiusMatch() function (1).\n");
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
        }

        var badCount = 0;
        var shift = this.dmatcher.isMaskSupported() ? 1 : 0;
        var needMatchCount = this.dmatcher.isMaskSupported() ? n - 1 : n;
        for (var i = 0; i < matches.length; i++ )
        {
            if (matches[i].length != needMatchCount )
            badCount++;
            else
            {
                var localBadCount = 0;
                for (var k = 0; k < needMatchCount; k++ )
                {
                    var match = matches[i][k];
                    {
                        if (i < this.queryDescCount / 2) {
                            if ((match.queryIdx != i) || (match.trainIdx != i* this.countFactor + k + shift) ||
                                (match.imgIdx != 0) )
                            localBadCount++;
                        }
                        else {
                            if ((match.queryIdx != i) || (match.trainIdx != (i- this.queryDescCount / 2)*this.countFactor + k + shift) ||
                                (match.imgIdx != 1) )
                            localBadCount++;
                        }
                    }
                }
                badCount += localBadCount > 0 ? 1 : 0;
            }
        }
        if (badCount > this.queryDescCount* this.badPart.valueOf() )
        {
            //curRes = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "%f - too large bad matches part while test radiusMatch() function (2).\n",
                badCount/ this.queryDescCount );
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
        }
    }
    }

    protected name: string;
    protected dmatcher: alvision.DescriptorMatcher;

//private:
//    CV_DescriptorMatcherTest& operator=(const CV_DescriptorMatcherTest&) { return *this; }
};


/****************************************************************************************\
*                                Tests registrations                                     *
\****************************************************************************************/

alvision.cvtest.TEST('Features2d_DescriptorMatcher_BruteForce', 'regression', () => {
    var test = new CV_DescriptorMatcherTest("descriptor-matcher-brute-force",
        alvision.DescriptorMatcher.create("BruteForce"), 0.01 );
    test.safe_run();
});

alvision.cvtest.TEST('Features2d_DescriptorMatcher_FlannBased', 'regression', () => {
    var test = new CV_DescriptorMatcherTest("descriptor-matcher-flann-based",
        alvision.DescriptorMatcher.create("FlannBased"), 0.04 );
    test.safe_run();
});

alvision.cvtest.TEST('Features2d_DMatch', 'read_write', () => {
    var fs = new alvision.FileStorage(".xml", alvision.FileStorageMode.WRITE + alvision.FileStorageMode.MEMORY);
    var matches = new Array<alvision.DMatch>();
    matches.push(new alvision.DMatch(1, 2, 3, 4.5));
    fs.write("Match", matches);
    var str = fs.releaseAndGetString();
    alvision.ASSERT_NE(str.indexOf("4.5"), -1 );
});
