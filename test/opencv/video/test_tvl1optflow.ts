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
//#include <fstream>
//
//using namespace std;
//using namespace cv;
//using namespace cvtest;

//#define DUMP

//namespace
//{
    // first four bytes, should be the same in little endian
    const FLO_TAG_FLOAT = 202021.25;  // check for this when READING the file

//#ifdef DUMP
    // binary file format for flow data specified here:
    // http://vision.middlebury.edu/flow/data/
    function writeOpticalFlowToFile(flow: alvision.Mat_<alvision.Point2f>, fileName : string) : void
    {
        const FLO_TAG_STRING = "PIEH";    // use this when WRITING the file

        //TODO: implement 
        //let file = fs.openSync(fileName, "w");
        //ofstream file(fileName, ios_base::binary);

        
        //fs.writeSync(file, FLO_TAG_STRING);
        //
        //file.write((const char*) &flow.cols, sizeof(int));
        //file.write((const char*) &flow.rows, sizeof(int));
        //
        //for (let i = 0; i < flow.rows; ++i)
        //{
        //    for (let j = 0; j < flow.cols; ++j)
        //    {
        //        const Point2f u = flow(i, j);
        //
        //        file.write((const char*) &u.x, sizeof(float));
        //        file.write((const char*) &u.y, sizeof(float));
        //    }
        //}
    }
//#endif

    // binary file format for flow data specified here:
    // http://vision.middlebury.edu/flow/data/
    function readOpticalFlowFromFile(flow: alvision.Mat_<alvision.Point2f>, fileName : string) : void
    {
        //TODO: implement read
        //ifstream file(fileName, ios_base::binary);
        //
        //float tag;
        //file.read((char*) &tag, sizeof(float));
        //alvision.CV_Assert( tag == FLO_TAG_FLOAT );
        //
        //Size size;
        //
        //file.read((char*) &size.width, sizeof(int));
        //file.read((char*) &size.height, sizeof(int));
        //
        //flow.create(size);
        //
        //for (let i = 0; i < flow.rows; ++i)
        //{
        //    for (let j = 0; j < flow.cols; ++j)
        //    {
        //        Point2f u;
        //
        //        file.read((char*) &u.x, sizeof(float));
        //        file.read((char*) &u.y, sizeof(float));
        //
        //        flow(i, j) = u;
        //    }
        //}
    }

    function isFlowCorrect(u: alvision.Point2f) : boolean
    {
        return !isNaN(u.x.valueOf()) && !isNaN(u.y.valueOf()) && (Math.abs(u.x.valueOf()) < 1e9) && (Math.abs(u.y.valueOf()) < 1e9);
    }

    function calcRMSE(flow1: alvision.Mat_<alvision.Point2f>, flow2: alvision.Mat_<alvision.Point2f>): alvision.double {
        let sum = 0.0;
        let counter = 0;

        for (let i = 0; i < flow1.rows(); ++i) {
            for (let j = 0; j < flow1.cols(); ++j) {
                const u1 = flow1.Element(i, j);
                const u2 = flow2.Element(i, j);

                if (isFlowCorrect(u1) && isFlowCorrect(u2)) {
                    const diff = u1.op_Substraction(u2);
                    sum = sum.valueOf() + diff.ddot(diff).valueOf();
                    ++counter;
                }
            }
        }
        return Math.sqrt(sum / (1e-9 + counter));
    }

alvision.cvtest.TEST('Video_calcOpticalFlowDual_TVL1', 'Regression', () => {
    const MAX_RMSE = 0.03;

    const frame1_path =    alvision.cvtest.TS.ptr().get_data_path() + "optflow/RubberWhale1.png";
    const frame2_path =    alvision.cvtest.TS.ptr().get_data_path() + "optflow/RubberWhale2.png";
    const gold_flow_path = alvision.cvtest.TS.ptr().get_data_path() + "optflow/tvl1_flow.flo";

    let frame1 = alvision.imread(frame1_path, alvision.ImreadModes. IMREAD_GRAYSCALE);
    let frame2 = alvision.imread(frame2_path, alvision.ImreadModes.IMREAD_GRAYSCALE);
    alvision.ASSERT_FALSE(frame1.empty());
    alvision.ASSERT_FALSE(frame2.empty());

    let flow: alvision.Mat_<alvision.Point2f>;
    let tvl1 = alvision.createOptFlow_DualTVL1();

    tvl1.calc(frame1, frame2, flow);

    //#ifdef DUMP
    writeOpticalFlowToFile(flow, gold_flow_path);
    //#else
    let gold: alvision.Mat_<alvision.Point2f>;
    readOpticalFlowFromFile(gold, gold_flow_path);

    alvision.ASSERT_EQ(gold.rows, flow.rows);
    alvision.ASSERT_EQ(gold.cols, flow.cols);

    let err = calcRMSE(gold, flow);
    alvision.EXPECT_LE(err, MAX_RMSE);
    //#endif
});
