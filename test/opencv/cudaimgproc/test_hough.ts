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

import async = require("async");
import alvision = require("../../../tsbinding/alvision");
import util = require('util');
import fs = require('fs');

//#include "test_precomp.hpp"
//
//#ifdef HAVE_CUDA
//
//using namespace cvtest;

///////////////////////////////////////////////////////////////////////////////////////////////////////
// HoughLines

//PARAM_TEST_CASE(HoughLines, alvision.cuda.DeviceInfo, alvision.Size, UseRoi)
class HoughLines extends alvision.cvtest.CUDA_TEST
{
    generateLines(img: alvision.Mat ) : void
    {
        img.setTo(alvision.Scalar.all(0));

        alvision.line(img, new alvision.Point(20, 0), new alvision.Point(20, img.rows()), alvision.Scalar.all(255));
        alvision.line(img, new alvision.Point(0, 50), new alvision.Point(img.cols(), 50), alvision.Scalar.all(255));
        alvision.line(img, new alvision.Point(0, 0),  new alvision.Point(img.cols(), img.rows()), alvision.Scalar.all(255));
        alvision.line(img, new alvision.Point(img.cols(), 0),new alvision.Point(0, img.rows()), alvision.Scalar.all(255));
    }

    drawLines(dst: alvision.Mat, lines: Array<alvision.Vec2f> ) : void
    {
        dst.setTo(alvision.Scalar.all(0));

        for (let i = 0; i < lines.length; ++i)
        {
            let rho = lines[i][0], theta = lines[i][1];
            let pt1 = new alvision.Point(), pt2 = new alvision.Point();
            let a = Math.cos(theta), b = Math.sin(theta);
            let x0 = a*rho, y0 = b*rho;
            pt1.x = Math.round(x0 + 1000*(-b));
            pt1.y = Math.round(y0 + 1000*(a));
            pt2.x = Math.round(x0 - 1000*(-b));
            pt2.y = Math.round(y0 - 1000*(a));
            alvision.line(dst, pt1, pt2, alvision.Scalar.all(255));
        }
    }
};

//CUDA_TEST_P(HoughLines, Accuracy)
class HoughLines_Accuracy extends HoughLines
{
    TestBody() {
        const devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        alvision.cuda.setDevice(devInfo.deviceID());
        const size = this.GET_PARAM < alvision.Size >(1);
        const useRoi = this.GET_PARAM<boolean>(2);

        const rho = 1.0;
        const theta = (1.5 * Math.PI / 180.0);
        const threshold = 100;

        let src = new alvision.Mat (size, alvision.MatrixType.CV_8UC1);
        this.generateLines(src);

        let hough = alvision.cuda.createHoughLinesDetector(rho, theta, threshold);

        let d_lines = new alvision.cuda.GpuMat();
        hough.detect(alvision.loadMat(src, useRoi), d_lines);

        let lines = new Array<alvision.Vec2f>();
        hough.downloadResults(d_lines, lines);

        let dst = new alvision.Mat (size, alvision.MatrixType.CV_8UC1);
        this.drawLines(dst, lines);

        alvision.ASSERT_MAT_NEAR(src, dst, 0.0);
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_ImgProc', 'HoughLines', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    alvision.WHOLE_SUBMAT
    ]));

///////////////////////////////////////////////////////////////////////////////////////////////////////
// HoughCircles

//PARAM_TEST_CASE(HoughCircles, alvision.cuda.DeviceInfo, alvision.Size, UseRoi)
class HoughCircles extends alvision.cvtest.CUDA_TEST
{
    drawCircles(dst: alvision.Mat, circles: Array<alvision.Vec3f>, fill: boolean) : void
    {
        dst.setTo(alvision.Scalar.all(0));

        for (let i = 0; i < circles.length; ++i)
            alvision.circle(dst, new alvision.Point2f(circles[i][0], circles[i][1]), circles[i][2], alvision.Scalar.all(255), fill ? -1 : 1);
    }
};

//CUDA_TEST_P(HoughCircles, Accuracy)
class HoughCircles_Accuracy extends HoughCircles {
    TestBody() {
        const devInfo = this.GET_PARAM < alvision.cuda.DeviceInfo >(0);
        alvision.cuda.setDevice(devInfo.deviceID());
        const size = this.GET_PARAM < alvision.Size >(1);
        const useRoi = this.GET_PARAM<boolean>(2);

        const  dp = 2.0;
        const  minDist = 0.0;
        const minRadius = 10;
        const maxRadius = 20;
        const cannyThreshold = 100;
        const votesThreshold = 20;

        let circles_gold = new Array<alvision.Vec3f> (4);
        circles_gold[0] = new alvision.Vec3i(20, 20, minRadius);
        circles_gold[1] = new alvision.Vec3i(90, 87, minRadius + 3);
        circles_gold[2] = new alvision.Vec3i(30, 70, minRadius + 8);
        circles_gold[3] = new alvision.Vec3i(80, 10, maxRadius);

        let src = new alvision.Mat (size,alvision.MatrixType. CV_8UC1);
        this.drawCircles(src, circles_gold, true);

        let houghCircles = alvision.cuda.createHoughCirclesDetector(dp, minDist, cannyThreshold, votesThreshold, minRadius, maxRadius);

        let d_circles = new alvision.cuda.GpuMat();
        houghCircles.detect(alvision.loadMat(src, useRoi), d_circles);

        let circles = new Array<alvision.Vec3f>();
        d_circles.download(circles);

        alvision.ASSERT_FALSE(circles.length ==0);

        for (let i = 0; i < circles.length; ++i)
        {
            let cur = circles[i];

            let found = false;

            for (let j = 0; j < circles_gold.length; ++j)
            {
                let gold = circles_gold[j];

                if (Math.abs(cur[0] - gold[0]) < 5 && Math.abs(cur[1] - gold[1]) < 5 && Math.abs(cur[2] - gold[2]) < 5)
                {
                    found = true;
                    break;
                }
            }

            alvision.ASSERT_TRUE(found);
        }
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_ImgProc', 'HoughCircles', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.DIFFERENT_SIZES,
    alvision.WHOLE_SUBMAT
    ]));

///////////////////////////////////////////////////////////////////////////////////////////////////////
// GeneralizedHough

//PARAM_TEST_CASE(GeneralizedHough, alvision.cuda.DeviceInfo, UseRoi)
class GeneralizedHough extends alvision.cvtest.CUDA_TEST
{
};


//CUDA_TEST_P(GeneralizedHough, Ballard)
class GeneralizedHough_Ballard extends GeneralizedHough
{
    TestBody() {
        const devInfo = this.GET_PARAM < alvision.cuda.DeviceInfo >(0);
        alvision.cuda.setDevice(devInfo.deviceID());
        const useRoi = this.GET_PARAM<boolean>(1);

        let templ = alvision.readImage("../cv/shared/templ.png", alvision.ImreadModes.IMREAD_GRAYSCALE);
        alvision.ASSERT_FALSE(templ.empty());

        let templCenter = new alvision.Point (templ.cols().valueOf() / 2, templ.rows().valueOf() / 2);

        const gold_count = 3;
        let pos_gold = new Array < alvision.Point >(gold_count);
        pos_gold[0] = new alvision.Point(templCenter.x.valueOf() + 10, templCenter.y.valueOf() + 10);
        pos_gold[1] = new alvision.Point(2 * templCenter.x.valueOf() + 40, templCenter.y.valueOf() + 10);
        pos_gold[2] = new alvision.Point(2 * templCenter.x.valueOf() + 40, 2 * templCenter.y.valueOf() + 40);

        let image = new alvision.Mat (templ.rows().valueOf() * 3, templ.cols().valueOf() * 3, alvision.MatrixType.CV_8UC1, alvision.Scalar.all(0));
        for (let i = 0; i < gold_count; ++i)
        {
            let rec = new alvision.Rect (pos_gold[i].x.valueOf() - templCenter.x.valueOf(), pos_gold[i].y.valueOf() - templCenter.y.valueOf(), templ.cols(), templ.rows());
            let imageROI = image.roi(rec);
            templ.copyTo(imageROI);
        }

        let alg = alvision.cuda.createGeneralizedHoughBallard();
        alg.setVotesThreshold(200);

        alg.setTemplate(alvision.loadMat(templ, useRoi));

        let d_pos = new alvision.cuda.GpuMat();
        alg.detect(alvision.loadMat(image, useRoi), d_pos);

        let pos = new Array<alvision.Vec4f>();
        d_pos.download(pos);

        alvision.ASSERT_EQ(gold_count, pos.length);

        for (let i = 0; i < gold_count; ++i)
        {
            let gold = pos_gold[i];

            let found = false;

            for (let j = 0; j < pos.length; ++j)
            {
                let p = new alvision.Point2f (pos[j][0], pos[j][1]);

                if (Math.abs(p.x.valueOf() - gold.x.valueOf()) < 2 && Math.abs(p.y.valueOf() - gold.y.valueOf()) < 2)
                {
                    found = true;
                    break;
                }
            }

            alvision.ASSERT_TRUE(found);
        }
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_ImgProc', 'GeneralizedHough', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    alvision.WHOLE_SUBMAT
    ]));

//#endif // HAVE_CUDA
