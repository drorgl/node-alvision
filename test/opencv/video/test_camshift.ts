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
//#include "opencv2/video/tracking_c.h"
//
//using namespace cv;
//using namespace std;

class CV_TrackBaseTest  extends alvision.cvtest.BaseTest
{
    constructor() {
        super();
        this.img = null;
        this.test_case_count = 100;
        this.min_log_size = 5;
        this.max_log_size = 8;
    }
    
    clear(): void {
        //cvReleaseMat( &img);
        this.img = null;
        super.clear();
    }

    read_params(fs: alvision.FileStorage): alvision.int {
        var code = super.read_params(fs);
        if (code < 0)
            return code;

        this.test_case_count = alvision.cvReadInt(this.find_param(fs, "test_case_count"), this.test_case_count);
        this.min_log_size = alvision.cvReadInt(this.find_param(fs, "min_log_size"), this.min_log_size);
        this.max_log_size = alvision.cvReadInt(this.find_param(fs, "max_log_size"), this.max_log_size);

        this.min_log_size = alvision.cvtest.clipInt(this.min_log_size, 1, 10);
        this.max_log_size = alvision.cvtest.clipInt(this.max_log_size, 1, 10);
        if (this.min_log_size > this.max_log_size) {
            //int t;
            let t = this.min_log_size; this.min_log_size = this.max_log_size; this.max_log_size = t;
            //CV_SWAP(min_log_size, max_log_size, t);
        }

        return 0;
    }
    run_func(): void {
    }
    prepare_test_case(test_case_idx: alvision.int): alvision.int {
        var rng = this.ts.get_rng();
        super.prepare_test_case(test_case_idx);

        this.clear();

        this.box0.size.width = Math.exp((alvision.cvtest.randReal(rng).valueOf() * (this.max_log_size.valueOf() - this.min_log_size.valueOf()) + this.min_log_size.valueOf()) * Math.LOG2E);
        this.box0.size.height = Math.exp((alvision.cvtest.randReal(rng).valueOf() * (this.max_log_size.valueOf() - this.min_log_size.valueOf()) + this.min_log_size.valueOf()) * Math.LOG2E);
        this.box0.angle = (alvision.cvtest.randReal(rng).valueOf() * 180.);

        if (this.box0.size.width > this.box0.size.height) {
            let t = this.box0.size.width; this.box0.size.width = this.box0.size.height; this.box0.size.height = t;
        }

        let m = Math.max(this.box0.size.width.valueOf(), this.box0.size.height.valueOf());
        this.img_size.width = Math.round(alvision.cvtest.randReal(rng).valueOf() * m * 0.5 + m + 1);
        this.img_size.height = Math.round(alvision.cvtest.randReal(rng).valueOf() * m * 0.5 + m + 1);
        this.img_type = alvision.cvtest.randInt(rng).valueOf() % 2 ? alvision.MatrixType.CV_32F : alvision.MatrixType.CV_8U;
        this.img_type = alvision.MatrixType.CV_8U;

        this.box0.center.x = (this.img_size.width .valueOf() * 0.5 + (alvision.cvtest.randReal(rng).valueOf() - 0.5) * (this.img_size.width .valueOf() - m));
        this.box0.center.y = (this.img_size.height.valueOf() * 0.5 + (alvision.cvtest.randReal(rng).valueOf() - 0.5) * (this.img_size.height.valueOf() - m));

        this.criteria = new alvision.TermCriteria(alvision.TermCriteriaType.EPS+ alvision.TermCriteriaType.MAX_ITER, 10, 0.1);

        this.generate_object();

        return 1;
    }
    validate_test_results(test_case_idx: alvision.int): alvision.int {
        return 0;
    }
    generate_object(): void {
        //int x, y;
        var cx = this.box0.center.x;
        var cy = this.box0.center.y;
        var width = this.box0.size.width.valueOf() * 0.5;
        var height = this.box0.size.height.valueOf() * 0.5;
        var angle = this.box0.angle.valueOf() * Math.PI / 180.;
        var a = Math.sin(angle), b = -Math.cos(angle);
        var inv_ww = 1. / (width * width), inv_hh = 1. / (height * height);

        this.img = new alvision.Mat(this.img_size.height, this.img_size.width, this.img_type);
        this.img.setTo(0);
        //cvZero(img);

        // use the straightforward algorithm: for every pixel check if it is inside the ellipse
        for (let y = 0; y < this.img_size.height; y++) {
            //uchar * ptr = img.data.ptr + this.img.step * y;
            let ptr = this.img.ptr<alvision.uchar>("uchar").slice(this.img.step * y);
            //float * fl = (float *)ptr;
            let fl = this.img.ptr<alvision.float>("float").slice(this.img.step * y);
            let x_ = (y - cy.valueOf()) * b, y_ = (y - cy.valueOf()) * a;

            for (let x = 0; x < this.img_size.width; x++) {
                let x1 = (x - cx.valueOf()) * a - x_;
                let y1 = (x - cx.valueOf()) * b + y_;

                if (x1 * x1 * inv_hh + y1 * y1 * inv_ww <= 1.) {
                    if (this.img_type == alvision.MatrixType.CV_8U)
                        ptr[x] = 1;
                    else
                        fl[x] = 1.;
                }
            }
        }
    }

    

    protected min_log_size: alvision.int
    protected max_log_size: alvision.int;
    protected img: alvision.Mat;
    protected box0: alvision.RotatedRect;
    protected img_size: alvision.Size;
    protected criteria: alvision.TermCriteria;
    protected img_type: alvision.int;
};




///////////////////////// CamShift //////////////////////////////

class CV_CamShiftTest extends CV_TrackBaseTest
{
    run_func() {
        let rr = alvision.CamShift(this.img, this.init_rect, this.criteria);//, this.comp, this.box);


        if (this.comp) {
            this.comp.rect = this.init_rect;
            let roi = alvision.Rect.op_And(rr.boundingRect(), new alvision.Rect(0, 0, this.img.cols(), this.img.rows()));
            this.comp.area = Math.round(alvision.sum(this.img).val[0].valueOf());
            //comp ->area = cvRound(cv::sum(img(roi))[0]);
        }

        if (this.box) {
            this.box = rr;
        }


    }
    prepare_test_case(test_case_idx: alvision.int): alvision.int {
        var rng = this.ts.get_rng();
        //double m;
        var code = super.prepare_test_case(test_case_idx);
        //int  area;

        if (code <= 0)
            return code;

        this.area0 = alvision.countNonZero(this.img);

        for (var i = 0; i < 100; i++) {
            let temp = new alvision.Mat();

            let m = Math.max(this.box0.size.width.valueOf(), this.box0.size.height.valueOf()) * 0.8;
            this.init_rect.x = Math.floor(this.box0.center.x.valueOf() - m * (0.45 + alvision.cvtest.randReal(rng).valueOf() * 0.2));
            this.init_rect.y = Math.floor(this.box0.center.y.valueOf() - m * (0.45 + alvision.cvtest.randReal(rng).valueOf() * 0.2));
            this.init_rect.width = Math.ceil (this.box0.center.x.valueOf() + m * (0.45 + alvision.cvtest.randReal(rng).valueOf() * 0.2) - this.init_rect.x.valueOf());
            this.init_rect.height = Math.ceil(this.box0.center.y.valueOf() + m * (0.45 + alvision.cvtest.randReal(rng).valueOf() * 0.2) - this.init_rect.y.valueOf());

            if (this.init_rect.x < 0 || this.init_rect.y < 0 ||
                this.init_rect.x.valueOf() + this.init_rect.width .valueOf()>=  this.img_size.width ||
                this.init_rect.y.valueOf() + this.init_rect.height.valueOf() >= this.img_size.height)
                continue;

            temp = this.img.roi(this.init_rect);
            
            let area = alvision.countNonZero( temp);

            if (area >= 0.1 * this.area0.valueOf())
                break;
        }

        return i < 100 ? code : 0;
    }
    validate_test_results(test_case_idx: alvision.int): alvision.int {
        var code = alvision.cvtest.FailureCode.OK;

        var m = Math.max(this.box0.size.width.valueOf(), this.box0.size.height.valueOf());
            //double        delta;
        //double diff_angle;

        if (isNaN(this.box.size.width.valueOf()) || !isFinite( this.box.size.width .valueOf()) ||  this.box.size.width <= 0 ||
            isNaN(this.box.size.height.valueOf()) || !isFinite(this.box.size.height.valueOf()) || this.box.size.height <= 0 ||
            isNaN(this.box.center.x.valueOf()) || !isFinite(this.box.center.x.valueOf()) ||
            isNaN(this.box.center.y.valueOf()) || !isFinite(this.box.center.y.valueOf()) ||
            isNaN(this.box.angle.valueOf()) || !isFinite(this.box.angle.valueOf()) || this.box.angle < -180 || this.box.angle > 180 ||
            isNaN(this.comp.area.valueOf()) || !isFinite(this.comp.area.valueOf()) || this.comp.area <= 0) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Invalid CvBox2D or CvConnectedComp was returned by cvCamShift\n");
            code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
            //goto _exit_;
            this.ts.set_failed_test_info(code); return code;
        }

        this.box.angle = (180 - this.box.angle.valueOf());

        if (Math.abs(this.box.size.width.valueOf() -  this.box0.size.width .valueOf()) >  this.box0.size.width .valueOf() * 0.2 ||
            Math.abs(this.box.size.height.valueOf() - this.box0.size.height.valueOf()) >  this.box0.size.height.valueOf() * 0.3) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Incorrect CvBox2D size (=%.1f x %.1f, should be %.1f x %.1f)\n",
                this.box.size.width, this.box.size.height, this.box0.size.width, this.box0.size.height);
            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
            //goto _exit_;
            this.ts.set_failed_test_info(code); return code;
        }

        if (Math.abs(this.box.center.x.valueOf() - this.box0.center.x.valueOf()) > m * 0.1 ||
            Math.abs(this.box.center.y.valueOf() - this.box0.center.y.valueOf()) > m * 0.1) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Incorrect CvBox2D position (=(%.1f, %.1f), should be (%.1f, %.1f))\n",
                this.box.center.x, this.box.center.y, this.box0.center.x, this.box0.center.y);
            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
            //goto _exit_;
            this.ts.set_failed_test_info(code); return code;
        }

        if (this.box.angle < 0)
            this.box.angle = this.box.angle.valueOf() + 180;

        let diff_angle = Math.abs(this.box0.angle.valueOf() - this.box.angle.valueOf());
        diff_angle = Math.min(diff_angle, Math.abs(this.box0.angle.valueOf() - this.box.angle.valueOf() + 180));

        if (Math.abs(diff_angle) > 30 && this.box0.size.height > this.box0.size.width.valueOf() * 1.2) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Incorrect CvBox2D angle (=%1.f, should be %1.f)\n",
                this.box.angle, this.box0.angle);
            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
            //goto _exit_;
            this.ts.set_failed_test_info(code); return code;
        }

        let delta = m * 0.7;

        if (this.comp.rect.x < this.box0.center.x.valueOf() - delta ||
            this.comp.rect.y < this.box0.center.y.valueOf() - delta ||
            this.comp.rect.x.valueOf() + this.comp.rect.width .valueOf() >  this.box0.center.x.valueOf() + delta ||
            this.comp.rect.y.valueOf() + this.comp.rect.height.valueOf() >  this.box0.center.y.valueOf() + delta) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG,
                "Incorrect CvConnectedComp ((%d,%d,%d,%d) is not within (%.1f,%.1f,%.1f,%.1f))\n",
                this.comp.rect.x, this.comp.rect.y, this.comp.rect.x.valueOf() + this.comp.rect.width.valueOf(), this.comp.rect.y.valueOf() + this.comp.rect.height.valueOf(),
                this.box0.center.x.valueOf() - delta, this.box0.center.y.valueOf() - delta, this.box0.center.x.valueOf() + delta, this.box0.center.y.valueOf() + delta);
            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
            this.ts.set_failed_test_info(code); return code;
            //goto _exit_;
        }

        if (Math.abs(this.comp.area.valueOf() - this.area0.valueOf()) > this.area0.valueOf() * 0.15) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG,
                "Incorrect CvConnectedComp area (=%.1f, should be %d)\n", this.comp.area, this.area0);
            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
            //goto _exit_;
            this.ts.set_failed_test_info(code); return code;
        }

        //_exit_:

        if (code < 0) {
//            #if 0 //defined _DEBUG && defined WIN32
//        IplImage* dst = cvCreateImage(img_size, 8, 3);
//            cvNamedWindow("test", 1);
//            cvCmpS(img, 0, img, CV_CMP_GT);
//            cvCvtColor(img, dst, CV_GRAY2BGR);
//            cvRectangle(dst, cvPoint(init_rect.x, init_rect.y),
//                cvPoint(init_rect.x + init_rect.width, init_rect.y + init_rect.height),
//                CV_RGB(255, 0, 0), 3, 8, 0);
//            cvEllipseBox(dst, box, CV_RGB(0, 255, 0), 3, 8, 0);
//            cvShowImage("test", dst);
//            cvReleaseImage( &dst);
//            cvWaitKey();
//            #endif
            this.ts.set_failed_test_info(code);
        }
        return code;
    }
    generate_object(): void {
    }

    protected box: alvision.RotatedRect;
    protected init_rect: alvision.Rect;
    protected comp: alvision.ConnectedComp;
    protected area0: alvision.int;
};



///////////////////////// MeanShift //////////////////////////////

class CV_MeanShiftTest extends CV_TrackBaseTest
{
    run_func(): void {
        alvision.meanShift(this.img, this.init_rect, this.criteria);//, this.comp);

        if (this.comp) {
            this.comp.rect = this.init_rect;
            this.comp.area = Math.round(alvision.sum(this.img.roi(this.init_rect)).val[0].valueOf());
        }
    }
    prepare_test_case(test_case_idx: alvision.int): alvision.int {
        var rng = this.ts.get_rng();
        //double m;
        var code = super.prepare_test_case(test_case_idx);


        if (code <= 0)
            return code;

        this.area0 = alvision.countNonZero(this.img);

        for (var i = 0; i < 100; i++) {
            let temp = new alvision.Mat();

            let m = (this.box0.size.width.valueOf() + this.box0.size.height.valueOf()) * 0.5;
            this.init_rect.x = Math.floor(this.box0.center.x.valueOf() - m * (0.4 + alvision.cvtest.randReal(rng).valueOf() * 0.2));
            this.init_rect.y = Math.floor(this.box0.center.y.valueOf() - m * (0.4 + alvision.cvtest.randReal(rng).valueOf() * 0.2));
            this.init_rect.width = Math.ceil( this.box0.center.x.valueOf() + m * (0.4 + alvision.cvtest.randReal(rng).valueOf() * 0.2) - this.init_rect.x.valueOf());
            this.init_rect.height = Math.ceil(this.box0.center.y.valueOf() + m * (0.4 + alvision.cvtest.randReal(rng).valueOf() * 0.2) - this.init_rect.y.valueOf());

            if (this.init_rect.x < 0 || this.init_rect.y < 0 ||
                this.init_rect.x.valueOf() + this.init_rect.width .valueOf()>=  this.img_size.width ||
                this.init_rect.y.valueOf() + this.init_rect.height.valueOf() >= this.img_size.height)
                continue;

            
            temp = this.img.roi(this.init_rect);
            this.area = alvision.countNonZero(temp);

            if (this.area >= 0.5 * this.area0.valueOf())
                break;
        }

        return i < 100 ? code : 0;
    }
    validate_test_results(test_case_idx: alvision.int): alvision.int {
        var code = alvision.cvtest.FailureCode.OK;
        //CvPoint2D32f c;
        let c = new alvision.Point2f();
        let m = Math.max(this.box0.size.width.valueOf(), this.box0.size.height.valueOf()), delta;

        
        
        
        if (isNaN(this.comp.area.valueOf()) || !isFinite(this.comp.area.valueOf()) || this.comp.area <= 0) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Invalid CvConnectedComp was returned by cvMeanShift\n");
            code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
            //goto _exit_;
            this.ts.set_failed_test_info(code); return code;
        }

        c.x = (this.comp.rect.x.valueOf() + this.comp.rect.width .valueOf() * 0.5);
        c.y = (this.comp.rect.y.valueOf() + this.comp.rect.height.valueOf() * 0.5);

        if (Math.abs(c.x.valueOf() - this.box0.center.x.valueOf()) > m * 0.1 ||
            Math.abs(c.y.valueOf() - this.box0.center.y.valueOf()) > m * 0.1) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Incorrect CvBox2D position (=(%.1f, %.1f), should be (%.1f, %.1f))\n",
                c.x, c.y, this.box0.center.x, this.box0.center.y);
            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
            //goto _exit_;
            this.ts.set_failed_test_info(code); return code;
        }

        delta = m * 0.7;

        if (this.comp.rect.x < this.box0.center.x.valueOf() - delta ||
            this.comp.rect.y < this.box0.center.y.valueOf() - delta ||
            this.comp.rect.x.valueOf() + this.comp.rect.width .valueOf() >  this.box0.center.x + delta ||
            this.comp.rect.y.valueOf() + this.comp.rect.height.valueOf() > this.box0.center.y + delta) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG,
                "Incorrect CvConnectedComp ((%d,%d,%d,%d) is not within (%.1f,%.1f,%.1f,%.1f))\n",
                this.comp.rect.x, this.comp.rect.y, this.comp.rect.x.valueOf() +  this.comp.rect.width.valueOf(), this.comp.rect.y.valueOf() + this.comp.rect.height.valueOf(),
                this.box0.center.x.valueOf() - delta, this.box0.center.y.valueOf() - delta, this.box0.center.x + delta, this.box0.center.y + delta);
            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
            //goto _exit_;
            this.ts.set_failed_test_info(code); return code;
        }

        if (Math.abs((this.comp.area.valueOf() - this.area0.valueOf())) > Math.abs((this.area.valueOf() - this.area0.valueOf())) + this.area0.valueOf() * 0.05) {
            this.ts.printf(alvision.cvtest.TSConstants.LOG,
                "Incorrect CvConnectedComp area (=%.1f, should be %d)\n", this.comp.area, this.area0);
            code = alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;
            //goto _exit_;
            this.ts.set_failed_test_info(code); return code;
        }

        //_exit_:

        if (code < 0) {
//            #if 0// defined _DEBUG && defined WIN32
//        IplImage* dst = cvCreateImage(img_size, 8, 3);
//            cvNamedWindow("test", 1);
//            cvCmpS(img, 0, img, CV_CMP_GT);
//            cvCvtColor(img, dst, CV_GRAY2BGR);
//            cvRectangle(dst, cvPoint(init_rect.x, init_rect.y),
//                cvPoint(init_rect.x + init_rect.width, init_rect.y + init_rect.height),
//                CV_RGB(255, 0, 0), 3, 8, 0);
//            cvRectangle(dst, cvPoint(comp.rect.x, comp.rect.y),
//                cvPoint(comp.rect.x + comp.rect.width, comp.rect.y + comp.rect.height),
//                CV_RGB(0, 255, 0), 3, 8, 0);
//            cvShowImage("test", dst);
//            cvReleaseImage( &dst);
//            cvWaitKey();
//            #endif
            this.ts.set_failed_test_info(code);
        }
        return code;
    }
    generate_object(): void { }

    protected init_rect: alvision.Rect;
    protected comp: alvision.ConnectedComp;
    protected area0: alvision.int;
    protected area: alvision.int;
};




alvision.cvtest.TEST('Video_CAMShift', 'accuracy', () => { var test = new CV_CamShiftTest(); test.safe_run(); test.clear();});
alvision.cvtest.TEST('Video_MeanShift', 'accuracy', () => { var test = new CV_MeanShiftTest(); test.safe_run(); test.clear(); });

/* End of file. */
