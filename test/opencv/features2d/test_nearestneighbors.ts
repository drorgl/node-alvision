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

//#include "test_precomp.hpp"
//
//#include <algorithm>
//#include <vector>
//#include <iostream>
//
//using namespace std;
//using namespace cv;
//using namespace alvision.flann;

//--------------------------------------------------------------------------------
class NearestNeighborTest  extends alvision.cvtest.BaseTest
{
    constructor() {
        super();
    }
    protected minValue = 0;
    protected maxValue = 1;
    protected dims = 30;
    protected featuresCount = 2000;
    protected K = 1; // * should also test 2nd nn etc.?


    run(start_from: alvision.int): void {
        var code = alvision.cvtest.FailureCode.OK, tempCode;
        let desc = new alvision.Mat (this.featuresCount, this.dims,alvision.MatrixType. CV_32FC1);
        alvision.randu(desc,new alvision. Scalar(this.minValue),new alvision. Scalar(this.maxValue));

        this.createModel(desc);

        tempCode = this.checkGetPoins(desc);
        if (tempCode != alvision.cvtest.FailureCode.OK) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "bad accuracy of GetPoints \n");
            code = tempCode;
        }

        tempCode = this.checkFindBoxed();
        if (tempCode != alvision.cvtest.FailureCode.OK) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "bad accuracy of FindBoxed \n");
            code = tempCode;
        }

        tempCode = this.checkFind(desc);
        if (tempCode != alvision.cvtest.FailureCode.OK) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "bad accuracy of Find \n");
            code = tempCode;
        }

        this.releaseModel();

        this.ts.set_failed_test_info(code);
    }
    createModel(data: alvision.Mat): void { }

    findNeighbors(points: alvision.Mat, neighbors: alvision.Mat): alvision.int {
        throw new Error("not implemented");
    }

    checkGetPoins(data: alvision.Mat): alvision.int{
        return alvision.cvtest.FailureCode.OK;
    }
    checkFindBoxed(): alvision.int{
        return alvision.cvtest.FailureCode.OK;
    }
    checkFind(data: alvision.Mat): alvision.int{
        let code = alvision.cvtest.FailureCode.OK;
        let pointsCount = 1000;
        let noise = 0.2;

        let rng = new alvision.RNG();
        let points = new alvision.Mat (pointsCount, this.dims, alvision.MatrixType.CV_32FC1);
        let results = new alvision.Mat (pointsCount,this. K, alvision.MatrixType.CV_32SC1);

        let fmap = new Array<alvision.int>(pointsCount);
        for (let pi = 0; pi < pointsCount; pi++ )
        {
            let fi = rng.next().valueOf() % this.featuresCount.valueOf();
            fmap[pi] = fi;
            for (let d = 0; d < this.dims; d++)
                points.at<alvision.float>("float", pi, d).set(data.at<alvision.float>("float", fi, d).get().valueOf() + rng.uniform(0.0, 1.0).valueOf() * noise);
        }

        code = <alvision.cvtest.FailureCode>this.findNeighbors(points, results);

        if (code == alvision.cvtest.FailureCode.OK) {
            let correctMatches = 0;
            for (let pi = 0; pi < pointsCount; pi++ )
            {
                if (fmap[pi] == results.at<alvision.int>("int", pi, 0).get())
                    correctMatches++;
            }

            let correctPerc = correctMatches / pointsCount;
            if (correctPerc < .75) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "correct_perc = %d\n", correctPerc);
                code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
            }
        }

        return code;
    }
     releaseModel() : void {}
};


//--------------------------------------------------------------------------------
class CV_FlannTest extends NearestNeighborTest
{
    createIndex(data: alvision.Mat, params: alvision.flann.IndexParams) {
        this.index = new alvision.flann.Index(data, params);
    }
    knnSearch(points: alvision.Mat, neighbors: alvision.Mat): alvision.int {
        let dist = new alvision.Mat (points.rows(), neighbors.cols(),alvision.MatrixType. CV_32FC1);
        let knn = 1;

        // 1st way
        this.index.knnSearch(points, neighbors, dist, knn, new alvision.flann.SearchParams());

        // 2nd way
        let neighbors1 = new alvision.Mat (neighbors.size(), alvision.MatrixType.CV_32SC1);
        for (let i = 0; i < points.rows(); i++ )
        {
            let fltPtr = points.ptr<alvision.float>("float", i);
            let query = new Array<alvision.float>();//fltPtr, fltPtr + points.cols);
            let indices = new Array<alvision.int> (neighbors1.cols(), 0);
            let dists = new Array<alvision.float> (dist.cols(), 0);
            this.index.knnSearch(query, indices, dists, knn, new alvision.flann.SearchParams());
            //Array<int>::const_iterator it = indices.begin();
            for (let j = 0; j < indices.length; j++)
                neighbors1.at<alvision.int>("int", i, j).set(indices[j]);
        }

        // compare results
        if (alvision.cvtest.norm(neighbors, neighbors1,alvision.NormTypes.NORM_L1) != 0)
            return alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;

        return alvision.cvtest.FailureCode.OK;
    }
    radiusSearch(points: alvision.Mat, neighbors: alvision.Mat): alvision.int  {
        let dist = new alvision.Mat (1, neighbors.cols(),alvision.MatrixType. CV_32FC1);
        let neighbors1 = new alvision.Mat (neighbors.size(), alvision.MatrixType.CV_32SC1);
        let radius = 10.0;
        //int j;

        // radiusSearch can only search one feature at a time for range search
        for (let i = 0; i < points.rows(); i++ )
        {
            // 1st way
            let p = new alvision.Mat (1, points.cols(), alvision.MatrixType.CV_32FC1, points.ptr<alvision.float>("float", i)),
                n = new alvision.Mat(1, neighbors.cols(), alvision.MatrixType.CV_32SC1, neighbors.ptr<alvision.int>("int", i));
            this.index.radiusSearch(p, n, dist, radius, neighbors.cols(),new  alvision.flann.SearchParams());

            // 2nd way
            let fltPtr = points.ptr<alvision.float>("float", i);
            let query = new Array<alvision.float>();//fltPtr, fltPtr + points.cols);
            let indices = new Array<alvision.int> (neighbors1.cols(), 0);
            let dists = new Array<alvision.float> (dist.cols(), 0);
            this.index.radiusSearch(query, indices, dists, radius, neighbors.cols(),new  alvision.flann.SearchParams());
            //Array<int>::const_iterator it = indices.begin();
            for (let j = 0; j < indices.length; j++)
                neighbors1.at<alvision.int>("int", i, j).set(indices[j]);
        }
        // compare results
        if (alvision.cvtest.norm(neighbors, neighbors1,alvision.NormTypes. NORM_L1) != 0)
            return alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;

        return alvision.cvtest.FailureCode.OK;
    }
    releaseModel(): void{
        delete this.index;
    }
    protected index: alvision.flann.Index
};



//---------------------------------------
class CV_FlannLinearIndexTest extends CV_FlannTest
{
    createModel(data: alvision.Mat): void { this.createIndex(data, new alvision.flann.LinearIndexParams() ); }
    findNeighbors(points:alvision.Mat,neighbors : alvision.Mat) : alvision.int { return this.knnSearch( points, neighbors ); }
};

//---------------------------------------
class CV_FlannKMeansIndexTest extends CV_FlannTest
{
    createModel(data:alvision.Mat) : void { this.createIndex( data,new alvision.flann.KMeansIndexParams() ); }
    findNeighbors(points:alvision.Mat,neighbors : alvision.Mat) : alvision.int { return this.radiusSearch( points, neighbors ); }
};

//---------------------------------------
class CV_FlannKDTreeIndexTest extends CV_FlannTest
{
    createModel(data:alvision.Mat) : void { this.createIndex( data,new alvision.flann.KDTreeIndexParams() ); }
    findNeighbors(points:alvision.Mat,neighbors : alvision.Mat) : alvision.int { return this.radiusSearch( points, neighbors ); }
};

//----------------------------------------
class CV_FlannCompositeIndexTest extends CV_FlannTest
{
    createModel(data:alvision.Mat) : void { this.createIndex( data,new alvision.flann.CompositeIndexParams() ); }
    findNeighbors(points:alvision.Mat,neighbors : alvision.Mat) : alvision.int { return this.knnSearch( points, neighbors ); }
};

//----------------------------------------
class CV_FlannAutotunedIndexTest extends CV_FlannTest
{
    createModel(data:alvision.Mat) : void { this.createIndex( data,new  alvision.flann.AutotunedIndexParams() ); }
    findNeighbors(points:alvision.Mat,neighbors : alvision.Mat) : alvision.int { return this.knnSearch( points, neighbors ); }
};
//----------------------------------------
class CV_FlannSavedIndexTest extends CV_FlannTest
{
    createModel(data: alvision.Mat): void {
        switch (alvision.cvtest.randInt(this.ts.get_rng()).valueOf() % 2) {
            //case 0: createIndex( data, LinearIndexParams() ); break; // nothing to save for linear search
            case 0: this.createIndex(data, new alvision.flann.KMeansIndexParams()); break;
            case 1: this.createIndex(data, new alvision.flann.KDTreeIndexParams()); break;
            //case 2: createIndex( data, CompositeIndexParams() ); break; // nothing to save for linear search
            //case 2: createIndex( data, AutotunedIndexParams() ); break; // possible linear index !
            default: alvision.assert(()=>false);
        }
        let filename = alvision.tempfile("");
        this.index.save(filename);

        this.createIndex(data, new alvision.flann.SavedIndexParams(filename));
        alvision.remove(filename);
    }
    findNeighbors(points:alvision.Mat,neighbors : alvision.Mat) : alvision.int { return this.knnSearch( points, neighbors ); }
};



alvision.cvtest.TEST('Features2d_FLANN_Linear', 'regression', () => { let test = new CV_FlannLinearIndexTest(); test.safe_run(); });
alvision.cvtest.TEST('Features2d_FLANN_KMeans', 'regression', () => { let test = new CV_FlannKMeansIndexTest(); test.safe_run(); });
alvision.cvtest.TEST('Features2d_FLANN_KDTree', 'regression', () => { let test = new CV_FlannKDTreeIndexTest(); test.safe_run(); });
alvision.cvtest.TEST('Features2d_FLANN_Composite', 'regression', () => { let test = new CV_FlannCompositeIndexTest (); test.safe_run(); });
alvision.cvtest.TEST('Features2d_FLANN_Auto', 'regression', () => { let test = new CV_FlannAutotunedIndexTest(); test.safe_run(); });
alvision.cvtest.TEST('Features2d_FLANN_Saved', 'regression', () => { let test = new CV_FlannSavedIndexTest(); test.safe_run(); });
