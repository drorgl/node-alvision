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
//
//using namespace cv;
//using namespace std;

//template <typename T, typename compute>
class ShapeBaseTest<T, compute> extends alvision.cvtest.BaseTest {
    //typedef Point_<T> PointType;
    constructor(Ttype: string, _NSN: alvision.int, _NP: alvision.int, _CURRENT_MAX_ACCUR: alvision.float, cmp: ICompute<compute>){
        super();
        this.Ttype = Ttype;
        this.cmp = cmp;
        this.NSN = (_NSN);
        this.NP = (_NP);
        this.CURRENT_MAX_ACCUR = (_CURRENT_MAX_ACCUR);
        // generate file list
        //vector < string > shapeNames;
        var shapeNames = new Array<string>();
        shapeNames.push("apple"); //ok
        shapeNames.push("children"); // ok
        shapeNames.push("device7"); // ok
        shapeNames.push("Heart"); // ok
        shapeNames.push("teddy"); // ok
        for (var i = 0; i < shapeNames.length; i++) {
            for (var j = 0; j < this.NSN; ++j) {
                var filename = "";
                filename += alvision.cvtest.TS.ptr().get_data_path()
                    + "shape/mpeg_test/" + shapeNames[i] + "-" + j + 1 + ".png";
                this.filenames.push(filename);
            }
        }
        // distance matrix
        const totalCount = this.filenames.length;//(int)filenames.size();
        this.distanceMat = alvision.Mat.from(alvision.Mat.zeros(totalCount, totalCount, alvision.MatrixType.CV_32F));
    }

    run(iii: alvision.int): void {
        this.mpegTest();
        this.displayMPEGResults();
    }

    convertContourType(currentQuery: alvision.Mat): Array<alvision.Point_<T>> {
        var _contoursQuery = new Array<Array<alvision.Point>>();// vector < vector < Point > > 


        alvision.findContours(currentQuery, _contoursQuery, alvision.RetrievalModes.RETR_LIST, alvision.ContourApproximationModes.CHAIN_APPROX_NONE);

        var contoursQuery = new Array<alvision.Point_<T>>();
        for (var border= 0; border < _contoursQuery.length; border++)
        {
            for (var p= 0; p < _contoursQuery[border].length; p++)
            {
                switch (this.Ttype) {
                    case "float":
                        contoursQuery.push(<any> new alvision.Point2f(_contoursQuery[border][p].x, _contoursQuery[border][p].y));
                        break;
                    case "int":
                        contoursQuery.push(<any>new alvision.Point2i(_contoursQuery[border][p].x, _contoursQuery[border][p].y));
                        break;
                    default:
                        throw new Error("not implemented");
                }
                
            }
        }

        // In case actual number of points is less than n
        for (var add= contoursQuery.length - 1; add < this.NP; add++)
        {
            contoursQuery.push(contoursQuery[contoursQuery.length - add + 1]); //adding dummy values
        }

        // Uniformly sampling
        alvision.random_shuffle(contoursQuery);
        var nStart= this.NP;
        var cont = new Array<alvision.Point_<T>>(); 
        for (var i= 0; i < nStart; i++)
        {
            cont.push(contoursQuery[i]);
        }
        return cont;
    }

    mpegTest(): void {
        // query contours (normal v flipped, h flipped) and testing contour
        //vector < PointType > contoursQuery1, contoursQuery2, contoursQuery3, contoursTesting;
        var contoursQuery1 =  new Array<alvision.Point_<T>>();
        var contoursQuery2  = new Array<alvision.Point_<T>>();
        var contoursQuery3  = new Array<alvision.Point_<T>>();
        var contoursTesting = new Array<alvision.Point_<T>>();




        // reading query and computing its properties
        //for (Array<string>::const_iterator a = filenames.begin(); a != filenames.end(); ++a) {
        for (let aIndex = 0; aIndex < this.filenames.length; aIndex++){
            let a = this.filenames[aIndex];
            // read current image
            //int aIndex = (int)(a - filenames.begin());
            let currentQuery = alvision.imread(a, alvision.ImreadModes. IMREAD_GRAYSCALE);
            let flippedHQuery = new alvision.Mat(), flippedVQuery = new alvision.Mat();
            alvision.flip(currentQuery, flippedHQuery, 0);
            alvision.flip(currentQuery, flippedVQuery, 1);
            // compute border of the query and its flipped versions
            contoursQuery1 = this.convertContourType(currentQuery);
            contoursQuery2 = this.convertContourType(flippedHQuery);
            contoursQuery3 = this.convertContourType(flippedVQuery);
            // compare with all the rest of the images: testing
            //for (Array<string>::const_iterator b = filenames.begin(); b != filenames.end(); ++b) {
            for (let bIndex = 0; bIndex = this.filenames.length;bIndex ++){
                let b = this.filenames[bIndex];
                let distance = 0;
                // skip self-comparisson
                if (a != b) {
                    // read testing image
                    let currentTest = alvision.imread(b, alvision.ImreadModes. IMREAD_GRAYSCALE);
                    // compute border of the testing
                    contoursTesting = this.convertContourType(currentTest);
                    // compute shape distance
                    distance = this.cmp.run(<any>contoursQuery1, <any>contoursQuery2,
                        <any>contoursQuery3, <any>contoursTesting).valueOf();
                }
                this.distanceMat.at<alvision.float>("float", aIndex, bIndex).set(distance);
            }
        }
    }

    displayMPEGResults(): void {
        const FIRST_MANY= 2 * this.NSN.valueOf();

        var corrects= 0;
        var divi= 0;
        for (var row= 0; row < this.distanceMat.rows(); row++)
        {
            if (row % this.NSN.valueOf() == 0) //another group
            {
                divi += this.NSN.valueOf();
            }
            for (var col= divi - this.NSN.valueOf(); col < divi; col++)
            {
                var nsmall= 0;
                for (var i= 0; i < this.distanceMat.cols(); i++)
                {
                    if (this.distanceMat.at<alvision.float>("float",row, col).get() > this.distanceMat.at<alvision.float>("float",row, i).get()) {
                        nsmall++;
                    }
                }
                if (nsmall <= FIRST_MANY) {
                    corrects++;
                }
            }
        }
        var porc = 100 * corrects / (this.NSN.valueOf() * this.distanceMat.rows().valueOf());
        console.log("Test result: ", porc, "%");
        if (porc >= this.CURRENT_MAX_ACCUR)
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);
        else
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
    }

    protected Ttype: string;
    protected NSN: alvision.int;
    protected NP: alvision.int;
    protected CURRENT_MAX_ACCUR: alvision.float;
    protected filenames: Array<string>
    protected distanceMat: alvision.Mat;
    protected cmp: ICompute<compute>;
}

//------------------------------------------------------------------------
//                       Test Shape_SCD.regression
//------------------------------------------------------------------------

interface ICompute<T> {
    run(query1: Array<T>, query2: Array<T>,
        query3: Array<T>, testq:  Array<T>): alvision.float
}

class computeShapeDistance_Chi implements ICompute<alvision.Point2f>
{
    mysc: alvision.ShapeContextDistanceExtractor ;
    constructor()
    {
        const  angularBins=12;
        const  radialBins=4;
        const  minRad=0.2;
        const  maxRad=2;
        this.mysc = alvision.createShapeContextDistanceExtractor(angularBins, radialBins, minRad, maxRad);
        this.mysc.setIterations(1);
        this.mysc.setCostExtractor(alvision.createChiHistogramCostExtractor(30,0.15));
        this.mysc.setTransformAlgorithm( alvision.createThinPlateSplineShapeTransformer() );
    }

    run(query1: Array<alvision.Point2f>, query2: Array<alvision.Point2f>,
        query3: Array<alvision.Point2f>, testq: Array<alvision.Point2f>): alvision.float
    {
        return Math.min(this.mysc.computeDistance(query1, testq).valueOf(),
            Math.min(this.mysc.computeDistance(query2, testq).valueOf(),
                this.mysc.computeDistance(query3, testq).valueOf()));
    }
};

alvision.cvtest.TEST('Shape_SCD', 'regression', () => {
    const NSN_val= 5;//10;//20; //number of shapes per class
    const NP_val= 120; //number of points simplifying the contour
    const CURRENT_MAX_ACCUR_val= 95; //99% and 100% reached in several tests, 95 is fixed as minimum boundary
    var test = new ShapeBaseTest<alvision.float, alvision.Point2f>("float", NSN_val, NP_val, CURRENT_MAX_ACCUR_val, new computeShapeDistance_Chi());
    test.safe_run();
});

//------------------------------------------------------------------------
//                       Test ShapeEMD_SCD.regression
//------------------------------------------------------------------------

class computeShapeDistance_EMD implements ICompute<alvision.Point2f>
{
    mysc: alvision.ShapeContextDistanceExtractor;
    constructor()
    {
        const  angularBins=12;
        const  radialBins=4;
        const  minRad=0.2;
        const  maxRad=2;
        this.mysc = alvision.createShapeContextDistanceExtractor(angularBins, radialBins, minRad, maxRad);
        this.mysc.setIterations(1);
        this.mysc.setCostExtractor( alvision.createEMDL1HistogramCostExtractor() );
        this.mysc.setTransformAlgorithm( alvision.createThinPlateSplineShapeTransformer() );
    }
    run(query1: Array<alvision.Point2f> ,query2 : Array<alvision.Point2f>,
        query3: Array<alvision.Point2f>, testq: Array<alvision.Point2f>  ) : alvision.float
    {
        return Math.min(this.mysc.computeDistance(query1, testq).valueOf(),
                        Math.min(this.mysc.computeDistance(query2, testq).valueOf(),
                                 this.mysc.computeDistance(query3, testq).valueOf()));
    }
};

alvision.cvtest.TEST('ShapeEMD_SCD', 'regression', () => {
    const  NSN_val= 5;//10;//20; //number of shapes per class
    const  NP_val= 100; //number of points simplifying the contour
    const CURRENT_MAX_ACCUR_val= 95; //98% and 99% reached in several tests, 95 is fixed as minimum boundary
    var test = new ShapeBaseTest<alvision.float, alvision.Point2f>("float", NSN_val, NP_val, CURRENT_MAX_ACCUR_val, new computeShapeDistance_EMD());
    test.safe_run();
});

//------------------------------------------------------------------------
//                       Test Hauss.regression
//------------------------------------------------------------------------

class computeShapeDistance_Haussdorf implements ICompute<alvision.Point>
{
    haus: alvision.HausdorffDistanceExtractor;
    constructor()
    {
        this.haus = alvision.createHausdorffDistanceExtractor();
    }
    run(query1: Array<alvision.Point>, query2: Array<alvision.Point> ,
        query3: Array<alvision.Point>, testq: Array<alvision.Point> ): alvision.float 
    {
        return Math.min(this.haus.computeDistance(query1,testq).valueOf(),
                        Math.min(this.haus.computeDistance(query2,testq).valueOf(),
                                 this.haus.computeDistance(query3,testq).valueOf()));
    }
};

alvision.cvtest.TEST('Hauss', 'regression', () => {
    const NSN_val= 5;//10;//20; //number of shapes per class
    const NP_val = 180; //number of points simplifying the contour
    const CURRENT_MAX_ACCUR_val= 85; //90% and 91% reached in several tests, 85 is fixed as minimum boundary
    var test = new ShapeBaseTest<alvision.int, alvision.Point>("int", NSN_val, NP_val, CURRENT_MAX_ACCUR_val, new computeShapeDistance_Haussdorf());
    test.safe_run();
});
