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
import colors = require("colors");
import async = require("async");
import alvision = require("../../../tsbinding/alvision");
import util = require('util');
import fs = require('fs');

//#include "test_precomp.hpp"
//#include "opencv2/imgproc/imgproc_c.h"
//
//using namespace cv;
//using namespace std;

class CV_DefaultNewCameraMatrixTest extends alvision.cvtest.ArrayTest {
    constructor() {
        super();

        this.test_array[this.INPUT].push(null);
        this.test_array[this.OUTPUT].push(null);
        this.test_array[this.REF_OUTPUT].push(null);

        this.matrix_type = 0;
        this.center_principal_point = false;
    }

     prepare_test_case(test_case_idx: alvision.int): alvision.int {
        var code = super.prepare_test_case(test_case_idx);

        if (code <= 0)
            return code;

        var rng = this.ts.get_rng();

        this.img_size.width =  alvision.cvtest.randInt(rng).valueOf() % this.MAX_X + 1;
        this.img_size.height = alvision.cvtest.randInt(rng).valueOf() % this.MAX_Y + 1;

        this.center_principal_point = ((alvision.cvtest.randInt(rng).valueOf() % 2)!=0);

        // Generating camera_mat matrix
        var sz = Math.max(this.img_size.width.valueOf(), this.img_size.height.valueOf());
        var aspect_ratio = alvision.cvtest.randReal(rng).valueOf() * 0.6 + 0.7;
        var a = [0, 0, 0, 0, 0, 0, 0, 0, 1];
        var _a = new alvision.Mat(3, 3, alvision.MatrixType.CV_64F, a);
        a[2] = (this.img_size.width .valueOf() - 1) * 0.5 +  alvision.cvtest.randReal(rng).valueOf() * 10 - 5;
        a[5] = (this.img_size.height.valueOf() - 1) * 0.5 + alvision.cvtest.randReal(rng).valueOf() * 10 - 5;
        a[0] = sz / (0.9 - alvision.cvtest.randReal(rng).valueOf() * 0.6);
        a[4] = aspect_ratio * a[0];

        var _a0 = this.test_mat[this.INPUT][0];
        alvision.cvtest.convert(_a, _a0, _a0.type());
        this.camera_mat = _a0;

        return code;
    }
     prepare_to_validation(test_case_idx: alvision.int): void {
        const src = this.test_mat[this.INPUT][0];
        var dst = this.test_mat[this.REF_OUTPUT][0];
        var test_output = this.test_mat[this.OUTPUT][0];
        var output = this.new_camera_mat;
        alvision.cvtest.convert(output, test_output, test_output.type());
        if (!this.center_principal_point) {
            alvision.cvtest.copy(src, dst);
        }
        else {
            var _a = new alvision.Mat(3, 3, alvision.MatrixType.CV_64F, [0, 0, 0, 0, 0, 0, 0, 0, 1]);
            var a = _a.ptr<alvision.double>("double");
            if (this.matrix_type == alvision.MatrixType.CV_64F) {
                a[0] = src.at<alvision.double>("double",0, 0).get();
                a[4] = src.at<alvision.double>("double",1, 1).get();
            }
            else {
                a[0] = src.at<alvision.float>("float", 0, 0).get();
                a[4] = src.at<alvision.float>("float", 1, 1).get();
            }
            a[2] = (this.img_size.width .valueOf() - 1) * 0.5;
            a[5] = (this.img_size.height.valueOf() - 1) * 0.5;
            alvision.cvtest.convert(_a, dst, dst.type());
        }
    }
     get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
        super.get_test_array_types_and_sizes(test_case_idx, sizes, types);
        var rng = this.ts.get_rng();
        this.matrix_type = types[this.INPUT][0] = types[this.OUTPUT][0] = types[this.REF_OUTPUT][0] = alvision.cvtest.randInt(rng).valueOf() % 2 ? alvision.MatrixType.CV_64F : alvision.MatrixType.CV_32F;
        sizes[this.INPUT][0] = sizes[this.OUTPUT][0] = sizes[this.REF_OUTPUT][0] = new alvision.Size(3, 3);
    }
     run_func(): void {
        this.new_camera_mat = alvision.getDefaultNewCameraMatrix(this.camera_mat, this.img_size, this.center_principal_point);
    }


    private img_size: alvision.Size;
    private camera_mat: alvision.Mat;
    private new_camera_mat: alvision.Mat;

    private matrix_type: alvision.int;

    private center_principal_point: boolean;

    private   MAX_X = 2048;
    private   MAX_Y = 2048;
    private   MAX_VAL = 10000;
}


//---------

class CV_UndistortPointsTest extends alvision.cvtest.ArrayTest
{
    constructor(){
        super();
        this.test_array[this.INPUT].push(null); // points matrix
        this.test_array[this.INPUT].push(null); // camera matrix
        this.test_array[this.INPUT].push(null); // distortion coeffs
        this.test_array[this.INPUT].push(null); // R matrix
        this.test_array[this.INPUT].push(null); // P matrix
        this.test_array[this.OUTPUT].push(null); // distorted dst points
        this.test_array[this.TEMP].push(null); // dst points
        this.test_array[this.REF_OUTPUT].push(null);

        this.useCPlus = this.useDstMat = false;
        this.zero_new_cam = this.zero_distortion = this.zero_R = false;
    }
 
    prepare_test_case(test_case_idx: alvision.int ) :alvision.int{

        var rng = this.ts.get_rng();
        var code = super.prepare_test_case(test_case_idx);

        if (code <= 0)
            return code;

        this.useDstMat = (alvision.cvtest.randInt(rng).valueOf() % 2) == 0;

        this.img_size.width =  alvision.cvtest.randInt(rng).valueOf() % this.MAX_X + 1;
        this.img_size.height = alvision.cvtest.randInt(rng).valueOf() % this.MAX_Y + 1;
        var dist_size = this.test_mat[this.INPUT][2].cols() > this.test_mat[this.INPUT][2].rows() ? this.test_mat[this.INPUT][2].cols() : this.test_mat[this.INPUT][2].rows();
        var dist = new Array<alvision.double> (dist_size);
        var proj = new Array<alvision.double> (this.test_mat[this.INPUT][4].cols().valueOf() * this.test_mat[this.INPUT][4].rows().valueOf());
        var points = new Array<alvision.Point2d> (this.N_POINTS);

        var _camera = new alvision.Mat(3, 3, alvision.MatrixType.CV_64F, [0, 0, 0, 0, 0, 0, 0, 0, 1]);// cam);
        var cam = _camera.ptr<alvision.double>("double");
        var _distort = new alvision.Mat(this.test_mat[this.INPUT][2].rows(), this.test_mat[this.INPUT][2].cols(), alvision.MatrixType.CV_64F,dist);
        var _proj    = new alvision.Mat(this.test_mat[this.INPUT][4].size(), alvision.MatrixType.CV_64F, proj);
        var _points  = new alvision.Mat(this.test_mat[this.INPUT][0].size(), alvision.MatrixType.CV_64FC2, points);

        _proj.setTo( alvision.Scalar.all(0));

        //Generating points
        for (var i = 0; i < this.N_POINTS; i++ )
        {
            points[i].x = alvision.cvtest.randReal(rng).valueOf() * this.img_size.width .valueOf();
            points[i].y = alvision.cvtest.randReal(rng).valueOf() * this.img_size.height.valueOf();
        }

        //Generating camera matrix
        var sz = Math.max(this.img_size.width.valueOf(), this.img_size.height.valueOf());
        var aspect_ratio = alvision.cvtest.randReal(rng).valueOf() * 0.6 + 0.7;
        cam[2] = (this.img_size.width .valueOf() - 1) * 0.5 +  alvision.cvtest.randReal(rng).valueOf() * 10 - 5;
        cam[5] = (this.img_size.height.valueOf() - 1) * 0.5 + alvision.cvtest.randReal(rng).valueOf() * 10 - 5;
        cam[0] = sz / (0.9 - alvision.cvtest.randReal(rng).valueOf() * 0.6);
        cam[4] = aspect_ratio * cam[0].valueOf();

        //Generating distortion coeffs
        dist[0] = alvision.cvtest.randReal(rng).valueOf() * 0.06 - 0.03;
        dist[1] = alvision.cvtest.randReal(rng).valueOf() * 0.06 - 0.03;
        if (dist[0].valueOf() * dist[1].valueOf() > 0)
            dist[1] = -dist[1];
        if (alvision.cvtest.randInt(rng).valueOf() % 4 != 0 )
        {
            dist[2] = alvision.cvtest.randReal(rng).valueOf() * 0.004 - 0.002;
            dist[3] = alvision.cvtest.randReal(rng).valueOf() * 0.004 - 0.002;
            if (dist_size > 4)
                dist[4] = alvision.cvtest.randReal(rng).valueOf() * 0.004 - 0.002;
        }
    else
        {
            dist[2] = dist[3] = 0;
            if (dist_size > 4)
                dist[4] = 0;
        }

        //Generating P matrix (projection)
        if (this.test_mat[this.INPUT][4].cols() != 4) {
            proj[8] = 1;
            if (alvision.cvtest.randInt(rng).valueOf() % 2 == 0) // use identity new camera matrix
            {
                proj[0] = 1;
                proj[4] = 1;
            }
        else
            {
                proj[0] = cam[0].valueOf() + (alvision.cvtest.randReal(rng).valueOf() - 0.5)*0.2 * cam[0].valueOf(); //10%
                proj[4] = cam[4].valueOf() + (alvision.cvtest.randReal(rng).valueOf() - 0.5)*0.2 * cam[4].valueOf(); //10%
                proj[2] = cam[2].valueOf() + (alvision.cvtest.randReal(rng).valueOf() - 0.5)*0.3 * this.img_size.width .valueOf(); //15%
                proj[5] = cam[5].valueOf() + (alvision.cvtest.randReal(rng).valueOf() - 0.5)*0.3 * this.img_size.height.valueOf(); //15%
            }
        }
        else {
            proj[10] = 1;
            proj[0] = cam[0].valueOf() + (alvision.cvtest.randReal(rng).valueOf() - 0.5)*0.2 * cam[0].valueOf(); //10%
            proj[5] = cam[4].valueOf() + (alvision.cvtest.randReal(rng).valueOf() - 0.5)*0.2 * cam[4].valueOf(); //10%
            proj[2] = cam[2].valueOf() + (alvision.cvtest.randReal(rng).valueOf() - 0.5)*0.3 * this.img_size.width .valueOf(); //15%
            proj[6] = cam[5].valueOf() + (alvision.cvtest.randReal(rng).valueOf() - 0.5)*0.3 * this.img_size.height.valueOf(); //15%

            proj[3] =  (this.img_size.height.valueOf() + this.img_size.width.valueOf() - 1) * 0.5 + alvision.cvtest.randReal(rng).valueOf() * 10 - 5;
            proj[7] =  (this.img_size.height.valueOf() + this.img_size.width.valueOf() - 1) * 0.5 + alvision.cvtest.randReal(rng).valueOf() * 10 - 5;
            proj[11] = (this.img_size.height.valueOf() + this.img_size.width.valueOf() - 1) * 0.5 + alvision.cvtest.randReal(rng).valueOf() * 10 - 5;
        }

        //Generating R matrix
        var _rot = new alvision.Mat(3, 3, alvision.MatrixType.CV_64F);
        var rotation = new alvision.Mat(1, 3, alvision.MatrixType.CV_64F);
        rotation.at<alvision.double>("double",0).set( Math.PI * (alvision.cvtest.randReal(rng).valueOf() - 0.5)); // phi
        rotation.at<alvision.double>("double",1).set( Math.PI * (alvision.cvtest.randReal(rng).valueOf() - 0.5)); // ksi
        rotation.at<alvision.double>("double",2).set( Math.PI * (alvision.cvtest.randReal(rng).valueOf() - 0.5)); //khi
        alvision.Rodrigues(rotation, _rot);

        //copying data
        //src_points = &_points;
        _points.convertTo( this.test_mat[this.INPUT][0], this.test_mat[this.INPUT][0].type());
        _camera.convertTo( this.test_mat[this.INPUT][1], this.test_mat[this.INPUT][1].type());
        _distort.convertTo(this.test_mat[this.INPUT][2], this.test_mat[this.INPUT][2].type());
        _rot.convertTo(    this.test_mat[this.INPUT][3], this.test_mat[this.INPUT][3].type());
        _proj.convertTo(   this.test_mat[this.INPUT][4], this.test_mat[this.INPUT][4].type());

        this.zero_distortion = (alvision.cvtest.randInt(rng).valueOf() % 2) == 0 ? false : true;
        this.zero_new_cam = (alvision.cvtest.randInt(rng).valueOf() % 2) == 0 ? false : true;
        this.zero_R = (alvision.cvtest.randInt(rng).valueOf() % 2) == 0 ? false : true;

        if (this.useCPlus) {
            _points.convertTo(this.src_points, alvision.MatrixType.CV_32F);

            this.camera_mat = this.test_mat[this.INPUT][1];
            this.distortion_coeffs = this.test_mat[this.INPUT][2];
            this.R = this.test_mat[this.INPUT][3];
            this.P = this.test_mat[this.INPUT][4];
        }

        return code;

    }
    prepare_to_validation(test_case_idx: alvision.int ) : void{

        var dist_size = this.test_mat[this.INPUT][2].cols > this.test_mat[this.INPUT][2].rows ? this.test_mat[this.INPUT][2].cols : this.test_mat[this.INPUT][2].rows;
        //var cam = [ 0,0,0,0,0,0,0,0,1];
        //var rot = [ 1,0,0,0,1,0,0,0,1];

        //var dist = new Array<alvision.double>(dist_size);
        //var proj = new Array<alvision.double>(this.test_mat[this.INPUT][4].cols * this.test_mat[this.INPUT][4].rows);
        //var points = new Array<alvision.double>(this.N_POINTS * 2);
        //var r_points = new Array<alvision.double>(this.N_POINTS * 2);
        //Run reference calculations
        var ref_points = new alvision.Mat(this.test_mat[this.INPUT][0].rows(), this.test_mat[this.INPUT][0].cols(), alvision.MatrixType.CV_64FC2);//, r_points);
        var r_points = ref_points.ptr<alvision.double>("double");
        var _camera = new alvision.Mat(3, 3, alvision.MatrixType.CV_64F);//, cam);
        var cam = _camera.ptr<alvision.double>("double");
        var _rot = new alvision.Mat(3, 3, alvision.MatrixType.CV_64F);//, rot);
        var rot = _rot.ptr<alvision.double>("double");
        var _distort = new alvision.Mat(this.test_mat[this.INPUT][2].rows(), this.test_mat[this.INPUT][2].cols(), alvision.MatrixType.CV_64F);//, dist);
        var dist = _distort.ptr<alvision.double>("double");
        var _proj = new alvision.Mat(this.test_mat[this.INPUT][4].rows(), this.test_mat[this.INPUT][4].cols(), alvision.MatrixType.CV_64F);//, proj);
        var proj = _proj.ptr<alvision.double>("double");
        var _points = new alvision.Mat(this.test_mat[this.TEMP][0].rows(), this.test_mat[this.TEMP][0].cols(), alvision.MatrixType.CV_64FC2);//, points);
        var points = _points.ptr<alvision.double>("double");

        //Mat __camera = cvarrToMat(&_camera);
        //Mat __distort = cvarrToMat(&_distort);
        //Mat __rot = cvarrToMat(&_rot);
        //Mat __proj = cvarrToMat(&_proj);
        //Mat __points = cvarrToMat(&_points);
        //Mat _ref_points = cvarrToMat(&ref_points);

        //alvision.cvtest.convert(this.test_mat[this.INPUT][1], __camera, __camera.type());
        //alvision.cvtest.convert(this.test_mat[this.INPUT][2], __distort, __distort.type());
        //alvision.cvtest.convert(this.test_mat[this.INPUT][3], __rot, __rot.type());
        //alvision.cvtest.convert(this.test_mat[this.INPUT][4], __proj, __proj.type());

        if (this.useCPlus) {
            if (this.useDstMat) {
                var temp = this.dst_points_mat;
                var tempptr = temp.ptr<alvision.double>("double");
                for (var i= 0; i < this.N_POINTS * 2;i++)
                {
                    points[i] = tempptr[i];
                }
            }
            else {
                for (var i= 0; i < this.N_POINTS;i++)
                {
                    points[2 * i] = this.dst_points[i].x;
                    points[2 * i + 1] = this.dst_points[i].y;
                }
            }
        }
        else {
            alvision.cvtest.convert(this.test_mat[this.TEMP][0], _points, _points.type());
        }

        var input2 = this.zero_distortion ? null : _distort;
        var input3 = this.zero_R ? null : _rot;
        var input4 = this.zero_new_cam ? null : _proj;
        this.distortPoints(_points,ref_points,_camera, input2, input3, input4);

        var dst = this.test_mat[this.REF_OUTPUT][0];
        alvision.cvtest.convert(ref_points, dst, dst.type());

        alvision.cvtest.copy(this.test_mat[this.INPUT][0], this.test_mat[this.OUTPUT][0]);

        //delete [] dist;
        //delete [] proj;
        //delete [] points;
        //delete [] r_points;

    }
    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>> ) : void{
        super.get_test_array_types_and_sizes(test_case_idx, sizes, types);
    var rng = this.ts.get_rng();
        this.useCPlus = ((alvision.cvtest.randInt(rng).valueOf() % 2)!=0);
    //useCPlus = 0;
    if (this.useCPlus) {
        types[this.INPUT][0] = types[this.OUTPUT][0] = types[this.REF_OUTPUT][0] = types[this.TEMP][0] = alvision.MatrixType.CV_32FC2;
    }
    else {
        types[this.INPUT][0] = types[this.OUTPUT][0] = types[this.REF_OUTPUT][0] = types[this.TEMP][0] = alvision.cvtest.randInt(rng).valueOf() % 2 ? alvision.MatrixType.CV_64FC2 : alvision.MatrixType.CV_32FC2;
    }
    types[this.INPUT][1] = alvision.cvtest.randInt(rng).valueOf() % 2 ? alvision.MatrixType.CV_64F : alvision.MatrixType.CV_32F;
    types[this.INPUT][2] = alvision.cvtest.randInt(rng).valueOf() % 2 ? alvision.MatrixType.CV_64F : alvision.MatrixType.CV_32F;
    types[this.INPUT][3] = alvision.cvtest.randInt(rng).valueOf() % 2 ? alvision.MatrixType.CV_64F : alvision.MatrixType.CV_32F;
    types[this.INPUT][4] = alvision.cvtest.randInt(rng).valueOf() % 2 ? alvision.MatrixType.CV_64F : alvision.MatrixType.CV_32F;

    sizes[this.INPUT][0] = sizes[this.OUTPUT][0] = sizes[this.REF_OUTPUT][0] = sizes[this.TEMP][0] = alvision.cvtest.randInt(rng).valueOf() % 2 ? new alvision.Size(1, this.N_POINTS) : new alvision.Size(this.N_POINTS, 1);
    sizes[this.INPUT][1] = sizes[this.INPUT][3] = new alvision.Size(3, 3);
    sizes[this.INPUT][4] = alvision.cvtest.randInt(rng).valueOf() % 2 ? new alvision.Size(3, 3) : new alvision.Size(4, 3);

    if (alvision.cvtest.randInt(rng).valueOf() % 2)
    {
        if (alvision.cvtest.randInt(rng).valueOf() % 2)
        {
            sizes[this.INPUT][2] =new  alvision.Size(1, 4);
        }
        else
        {
            sizes[this.INPUT][2] = new alvision.Size(1, 5);
        }
    }
    else
    {
        if (alvision.cvtest.randInt(rng).valueOf() % 2)
        {
            sizes[this.INPUT][2] = new alvision.Size(4, 1);
        }
        else
        {
            sizes[this.INPUT][2] = new alvision.Size(5, 1);
        }
    }
    }
    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
        return 5e-2;
    }
    run_func() : void{

    if (this.useCPlus) {
        //var input2, input3, input4;
        var input2 = this.zero_distortion ? new alvision.Mat() : new alvision.Mat(this.test_mat[this.INPUT][2]);
        var input3 = this.zero_R ? new alvision.Mat() : new alvision.Mat(this.test_mat[this.INPUT][3]);
        var input4 = this.zero_new_cam ? new alvision.Mat() : new alvision.Mat(this.test_mat[this.INPUT][4]);

        if (this.useDstMat) {
            //alvision.undistortPoints(src_points,dst_points_mat,camera_mat,distortion_coeffs,R,P);
            alvision.undistortPoints(this.src_points, this.dst_points_mat, this.camera_mat, input2, input3, input4);
        }
        else {
            //alvision.undistortPoints(src_points,dst_points,camera_mat,distortion_coeffs,R,P);
            alvision.undistortPoints(this.src_points, this.dst_points, this.camera_mat, input2, input3, input4);
        }
    }
    else {
        var _input0 = this.test_mat[this.INPUT][0], _input1 = this.test_mat[this.INPUT][1];
        var _input2 = new alvision.Mat(), _input3 = new alvision.Mat(), _input4 = new alvision.Mat();
        var _output = this.test_mat[this.TEMP][0];
        if (!this.zero_distortion)
            _input2 = this.test_mat[this.INPUT][2];
        if (!this.zero_R)
            _input3 = this.test_mat[this.INPUT][3];
        if (!this.zero_new_cam)
            _input4 = this.test_mat[this.INPUT][4];
        alvision.undistortPoints(_input0, _output, _input1,
            this.zero_distortion ? null : _input2,
            this.zero_R ? null : _input3,
            this.zero_new_cam ? null : _input4);
    }
}
    distortPoints(_src: alvision.Mat, _dst: alvision.Mat, _cameraMatrix: alvision.Mat,
    _distCoeffs :  alvision.Mat, matR : alvision.Mat,  matP : alvision.Mat) : void{
        //double a[9];

        var __P: alvision.Mat;
        if ((!matP) || (matP.cols() == 3))
            __P = new alvision.Mat(3, 3, alvision.MatrixType.CV_64F);
        else
            __P = new alvision.Mat(3, 4, alvision.MatrixType.CV_64F);
        if (matP) {
            alvision.cvtest.convert(matP, __P, -1);
        }
        else {
            __P.setTo(new alvision.Scalar(0));
            //cvZero(__P);
            var pData = __P.ptr<alvision.double>("double");
            pData[0] = 1;
            pData[4] = 1;
            pData[8] = 1;
        }
        var __R = new alvision.Mat(3, 3, alvision.MatrixType.CV_64F);
        if (matR) {
            matR.copyTo(__R);
            //cvCopy(matR, __R);
        }
        else {
            __R.setTo(new alvision.Scalar(0));
            //cvZero(__R);
            var Rdata = __R.ptr<alvision.double>("double");
            Rdata[0] = 1;
            Rdata[4] = 1;
            Rdata[8] = 1;
        }
        for (var i= 0; i < this.N_POINTS;i++)
        {
            var movement = __P.cols() > 3 ? 1 : 0;

            var _srcptr = _src.ptr<alvision.double>("double");
            var _Pptr = __P.ptr<alvision.double>("double");

            var x = (_srcptr[2 * i].valueOf() - _Pptr[2].valueOf()) / _Pptr[0].valueOf();
            var y = (_srcptr[2 * i + 1].valueOf() - _Pptr[5 + movement].valueOf()) / _Pptr[4 + movement].valueOf();
            var inverse = new alvision.Mat(3, 3, alvision.MatrixType.CV_64F);//, a);
            alvision.invert(__R, inverse);

            var inversedata = inverse.ptr<alvision.double>("double");

            var w1 =  x * inversedata[6].valueOf() + y * inversedata[7].valueOf() + inversedata[8].valueOf();
            var _x = (x * inversedata[0].valueOf() + y * inversedata[1].valueOf() + inversedata[2].valueOf()) / w1;
            var _y = (x * inversedata[3].valueOf() + y * inversedata[4].valueOf() + inversedata[5].valueOf()) / w1;

            //Distortions

            var __x = _x;
            var __y = _y;
            if (_distCoeffs) {
                var r2 = _x * _x + _y * _y;

                var _distCoeffsPtr = _distCoeffs.ptr<alvision.double>("double");

                __x = _x * (1 + _distCoeffsPtr[0].valueOf() * r2 + _distCoeffsPtr[1].valueOf() * r2 * r2) +
                    2 * _distCoeffsPtr[2].valueOf() * _x * _y + _distCoeffsPtr[3].valueOf() * (r2 + 2 * _x * _x);
                __y = _y * (1 + _distCoeffsPtr[0].valueOf() * r2 + _distCoeffsPtr[1].valueOf() * r2 * r2) +
                    2 * _distCoeffsPtr[3].valueOf() * _x * _y + _distCoeffsPtr[2].valueOf() * (r2 + 2 * _y * _y);
                if ((_distCoeffs.cols() > 4) || (_distCoeffs.rows() > 4)) {
                    __x += _x * _distCoeffsPtr[4].valueOf() * r2 * r2 * r2;
                    __y += _y * _distCoeffsPtr[4].valueOf() * r2 * r2 * r2;
                }
            }

            var _dstptr = _dst.ptr<alvision.double>("double");
            var _cameraMatrixptr = _cameraMatrix.ptr<alvision.double>("double");

            _dstptr[2 * i] = __x *     _cameraMatrixptr[0].valueOf() + _cameraMatrixptr[2].valueOf();
            _dstptr[2 * i + 1] = __y * _cameraMatrixptr[4].valueOf() + _cameraMatrixptr[5].valueOf();

        }

        //cvReleaseMat(&__R);
        //cvReleaseMat(&__P);

    }


    private  useCPlus: boolean;
    private  useDstMat : boolean;
    private    N_POINTS = 10;
    private    MAX_X = 2048;
    private    MAX_Y = 2048;

    private  zero_new_cam: boolean;
    private  zero_distortion: boolean;
    private  zero_R: boolean;
    
    private img_size: alvision.Size;
    private dst_points_mat: alvision.Mat;
    
    private  camera_mat: alvision.Mat;
    private  R: alvision.Mat;
    private  P: alvision.Mat;
    private  distortion_coeffs: alvision.Mat;
    private  src_points: alvision.Mat;
    private dst_points: Array<alvision.Point2f> ;
}




//------------------------------------------------------

class CV_InitUndistortRectifyMapTest extends alvision.cvtest.ArrayTest
{
    constructor() {
        super();
        this.test_array[this.INPUT].push(null); // test points matrix
        this.test_array[this.INPUT].push(null); // camera matrix
        this.test_array[this.INPUT].push(null); // distortion coeffs
        this.test_array[this.INPUT].push(null); // R matrix
        this.test_array[this.INPUT].push(null); // new camera matrix
        this.test_array[this.OUTPUT].push(null); // distorted dst points
        this.test_array[this.REF_OUTPUT].push(null);

        this.useCPlus = false;
        this.zero_distortion = this.zero_new_cam = this.zero_R = false;
        this._mapx = this._mapy = null;
        this.mat_type = 0;
    }

    prepare_test_case(test_case_idx: alvision.int): alvision.int {
        var rng = this.ts.get_rng();
        var code = super.prepare_test_case(test_case_idx);

        if (code <= 0)
            return code;

        this.img_size.width =  alvision.cvtest.randInt(rng).valueOf() % this.MAX_X + 1;
        this.img_size.height = alvision.cvtest.randInt(rng).valueOf() % this.MAX_Y + 1;

        if (this.useCPlus) {
            this.mat_type = (alvision.cvtest.randInt(rng).valueOf() % 2) == 0 ? alvision.MatrixType.CV_32FC1 : alvision.MatrixType.CV_16SC2;
            if ((alvision.cvtest.randInt(rng).valueOf() % 4) == 0)
                this.mat_type = -1;
            if ((alvision.cvtest.randInt(rng).valueOf() % 4) == 0)
                this.mat_type = alvision.MatrixType.CV_32FC2;
            this._mapx = null;
            this._mapy = null;
        }
        else {
            var typex = (alvision.cvtest.randInt(rng).valueOf() % 2) == 0 ? alvision.MatrixType.CV_32FC1 : alvision.MatrixType.CV_16SC2;
            //typex = alvision.MatrixType.CV_32FC1; ///!!!!!!!!!!!!!!!!
            var typey = (typex == alvision.MatrixType.CV_32FC1) ? alvision.MatrixType.CV_32FC1 : alvision.MatrixType.CV_16UC1;

            this._mapx = new alvision.Mat(this.img_size.height, this.img_size.width, typex);
            this._mapy = new alvision.Mat(this.img_size.height, this.img_size.width, typey);


        }

        var dist_size = this.test_mat[this.INPUT][2].cols() > this.test_mat[this.INPUT][2].rows() ? this.test_mat[this.INPUT][2].cols() : this.test_mat[this.INPUT][2].rows();
        //double cam[9] = { 0,0,0,0,0,0,0,0,1};
        //var dist = new Array<alvision.double> (dist_size);
        //var new_cam = new Array<alvision.double> (this.test_mat[this.INPUT][4].cols.valueOf() * this.test_mat[this.INPUT][4].rows.valueOf());
        //var points = new Array<alvision.Point2d> (this.N_POINTS);

        var _camera = new alvision.Mat(3, 3, alvision.MatrixType.CV_64F);//, cam);
        var cam = _camera.ptr<alvision.double>("double");
        var _distort = new alvision.Mat(this.test_mat[this.INPUT][2].size(), alvision.MatrixType.CV_64F);//,&dist[0]);
        var dist = _distort.ptr<alvision.double>("double");
        var _new_cam = new alvision.Mat(this.test_mat[this.INPUT][4].size(), alvision.MatrixType.CV_64F);//,&new_cam[0]);
        var new_cam = _new_cam.ptr<alvision.double>("double");
        var _points = new alvision.Mat(this.test_mat[this.INPUT][0].size(), alvision.MatrixType.CV_64FC2);//, &points[0]);
        var points = _points.ptr<alvision.Point2d>("Point2d");

        //Generating points
        for (var i= 0; i < this.N_POINTS;i++)
        {
            points[i].x = alvision.cvtest.randReal(rng).valueOf() * this.img_size.width .valueOf();
            points[i].y = alvision.cvtest.randReal(rng).valueOf() * this.img_size.height.valueOf();
        }

        //Generating camera matrix
        var sz = Math.max(this.img_size.width.valueOf(), this.img_size.height.valueOf());
        var aspect_ratio = alvision.cvtest.randReal(rng).valueOf() * 0.6 + 0.7;
        cam[2] = (this.img_size.width .valueOf()- 1) * 0.5 +  alvision.cvtest.randReal(rng).valueOf() * 10 - 5;
        cam[5] = (this.img_size.height.valueOf() - 1) * 0.5 + alvision.cvtest.randReal(rng).valueOf() * 10 - 5;
        cam[0] = sz / (0.9 - alvision.cvtest.randReal(rng).valueOf() * 0.6);
        cam[4] = aspect_ratio * cam[0].valueOf();

        //Generating distortion coeffs
        dist[0] = alvision.cvtest.randReal(rng).valueOf() * 0.06 - 0.03;
        dist[1] = alvision.cvtest.randReal(rng).valueOf() * 0.06 - 0.03;
        if (dist[0].valueOf() * dist[1].valueOf() > 0)
            dist[1] = -dist[1];
        if (alvision.cvtest.randInt(rng).valueOf() % 4 != 0) {
            dist[2] = alvision.cvtest.randReal(rng).valueOf() * 0.004 - 0.002;
            dist[3] = alvision.cvtest.randReal(rng).valueOf() * 0.004 - 0.002;
            if (dist_size > 4)
                dist[4] = alvision.cvtest.randReal(rng).valueOf() * 0.004 - 0.002;
        }
        else {
            dist[2] = dist[3] = 0;
            if (dist_size > 4)
                dist[4] = 0;
        }

        //Generating new camera matrix
        _new_cam.setTo(alvision.Scalar.all(0));
        new_cam[8] = 1;

        //new_cam[0] = cam[0];
        //new_cam[4] = cam[4];
        //new_cam[2] = cam[2];
        //new_cam[5] = cam[5];

        new_cam[0] = cam[0].valueOf() + (alvision.cvtest.randReal(rng).valueOf() - 0.5)*0.2 * cam[0].valueOf(); //10%
        new_cam[4] = cam[4].valueOf() + (alvision.cvtest.randReal(rng).valueOf() - 0.5)*0.2 * cam[4].valueOf(); //10%
        new_cam[2] = cam[2].valueOf() + (alvision.cvtest.randReal(rng).valueOf() - 0.5)*0.3 * this.img_size.width .valueOf(); //15%
        new_cam[5] = cam[5].valueOf() + (alvision.cvtest.randReal(rng).valueOf() - 0.5)*0.3 * this.img_size.height.valueOf(); //15%


        //Generating R matrix
        var _rot = new alvision.Mat (3, 3, alvision.MatrixType.CV_64F);
        var rotation = new alvision.Mat (1, 3, alvision.MatrixType.CV_64F);
        rotation.at<alvision.double>("double",0).set( Math.PI / 8 * (alvision.cvtest.randReal(rng).valueOf() - 0.5)); // phi
        rotation.at<alvision.double>("double",1).set( Math.PI / 8 * (alvision.cvtest.randReal(rng).valueOf() - 0.5)); // ksi
        rotation.at<alvision.double>("double",2).set( Math.PI / 3 * (alvision.cvtest.randReal(rng).valueOf() - 0.5)); //khi
        alvision.Rodrigues(rotation, _rot);

        //alvision.setIdentity(_rot);
        //copying data
        alvision.cvtest.convert(_points, this.test_mat[this.INPUT][0], this.test_mat[this.INPUT][0].type());
        alvision.cvtest.convert(_camera, this.test_mat[this.INPUT][1], this.test_mat[this.INPUT][1].type());
        alvision.cvtest.convert(_distort,this.test_mat[this.INPUT][2], this.test_mat[this.INPUT][2].type());
        alvision.cvtest.convert(_rot,    this.test_mat[this.INPUT][3], this.test_mat[this.INPUT][3].type());
        alvision.cvtest.convert(_new_cam,this.test_mat[this.INPUT][4], this.test_mat[this.INPUT][4].type());

        this.zero_distortion = (alvision.cvtest.randInt(rng).valueOf() % 2) == 0 ? false : true;
        this.zero_new_cam =    (alvision.cvtest.randInt(rng).valueOf() % 2) == 0 ? false : true;
        this.zero_R =          (alvision.cvtest.randInt(rng).valueOf() % 2) == 0 ? false : true;

        if (this.useCPlus) {
            this.camera_mat =       this.test_mat[this.INPUT][1];
            this.distortion_coeffs =this.test_mat[this.INPUT][2];
            this.R =                this.test_mat[this.INPUT][3];
            this.new_camera_mat =   this.test_mat[this.INPUT][4];
        }

        return code;
    }
    prepare_to_validation(test_case_idx: alvision.int): void {
        //#if 0
        //    int dist_size = test_mat[INPUT][2].cols > test_mat[INPUT][2].rows ? test_mat[INPUT][2].cols : test_mat[INPUT][2].rows;
        //    double cam[9] = {0,0,0,0,0,0,0,0,1};
        //    double rot[9] = {1,0,0,0,1,0,0,0,1};
        //    Array<double> dist(dist_size);
        //    Array<double> new_cam(test_mat[INPUT][4].cols * test_mat[INPUT][4].rows);
        //    Array<Point2d> points(N_POINTS);
        //    Array<Point2d> r_points(N_POINTS);
        //    //Run reference calculations
        //    Mat ref_points(test_mat[INPUT][0].size(),CV_64FC2,&r_points[0]);
        //    Mat _camera(3,3,CV_64F,cam);
        //    Mat _rot(3,3,CV_64F,rot);
        //    Mat _distort(test_mat[INPUT][2].size(),CV_64F,&dist[0]);
        //    Mat _new_cam(test_mat[INPUT][4].size(),CV_64F,&new_cam[0]);
        //    Mat _points(test_mat[INPUT][0].size(),CV_64FC2,&points[0]);
        //
        //    alvision.cvtest.convert(test_mat[INPUT][1],_camera,_camera.type());
        //    alvision.cvtest.convert(test_mat[INPUT][2],_distort,_distort.type());
        //    alvision.cvtest.convert(test_mat[INPUT][3],_rot,_rot.type());
        //    alvision.cvtest.convert(test_mat[INPUT][4],_new_cam,_new_cam.type());
        //
        //    //Applying precalculated undistort rectify map
        //    if (!useCPlus)
        //    {
        //        mapx = alvision.Mat(_mapx);
        //        mapy = alvision.Mat(_mapy);
        //    }
        //    alvision.Mat map1,map2;
        //    alvision.convertMaps(mapx,mapy,map1,map2,CV_32FC1);
        //    CvMat _map1 = map1;
        //    CvMat _map2 = map2;
        //    const Point2d* sptr = (const Point2d*)test_mat[INPUT][0].data;
        //    for( int i = 0;i < N_POINTS; i++ )
        //    {
        //        int u = alvision.saturate_cast<int>(sptr[i].x);
        //        int v = alvision.saturate_cast<int>(sptr[i].y);
        //        points[i].x = _map1.data.fl[v*_map1.cols + u];
        //        points[i].y = _map2.data.fl[v*_map2.cols + u];
        //    }
        //
        //    //---
        //
        //    alvision.undistortPoints(_points, ref_points, _camera,
        //                        zero_distortion ? Mat() : _distort,
        //                        zero_R ? alvision.Mat.eye(3,3,CV_64F) : _rot,
        //                        zero_new_cam ? _camera : _new_cam);
        //    //cvTsDistortPoints(&_points,&ref_points,&_camera,&_distort,&_rot,&_new_cam);
        //    alvision.cvtest.convert(ref_points, test_mat[REF_OUTPUT][0], test_mat[REF_OUTPUT][0].type());
        //    alvision.cvtest.copy(test_mat[INPUT][0],test_mat[OUTPUT][0]);
        //
        //    cvReleaseMat(&_mapx);
        //    cvReleaseMat(&_mapy);
        //#else
        var dist_size = this.test_mat[this.INPUT][2].cols > this.test_mat[this.INPUT][2].rows ? this.test_mat[this.INPUT][2].cols : this.test_mat[this.INPUT][2].rows;
        //double cam[9] = { 0,0,0,0,0,0,0,0,1};
        //double rot[9] = { 1,0,0,0,1,0,0,0,1};
        //double * dist = new double[dist_size];
        //double * new_cam = new double[test_mat[INPUT][4].cols * test_mat[INPUT][4].rows];
        //double * points = new double[N_POINTS * 2];
        //double * r_points = new double[N_POINTS * 2];
        //Run reference calculations
        var ref_points = new alvision.Mat(this.test_mat[this.INPUT][0].rows(), this.test_mat[this.INPUT][0].cols(), alvision.MatrixType.CV_64FC2);//, r_points);
        var _camera =  new alvision.Mat(3, 3, alvision.MatrixType.CV_64F);//, cam);
        var _rot =     new alvision.Mat(3, 3, alvision.MatrixType.CV_64F);//, rot);
        var _distort = new alvision.Mat(this.test_mat[this.INPUT][2].rows(), this.test_mat[this.INPUT][2].cols(), alvision.MatrixType.CV_64F  );//, dist);
        var _new_cam = new alvision.Mat(this.test_mat[this.INPUT][4].rows(), this.test_mat[this.INPUT][4].cols(), alvision.MatrixType.CV_64F  );//, new_cam);
        var _points=   new alvision.Mat(this.test_mat[this.INPUT][0].rows(), this.test_mat[this.INPUT][0].cols(), alvision.MatrixType.CV_64FC2);//, points);

        var _input1 = this.test_mat[this.INPUT][1];
        var _input2 = this.test_mat[this.INPUT][2];
        var _input3 = this.test_mat[this.INPUT][3];
        var _input4 = this.test_mat[this.INPUT][4];

        alvision.cvtest.convert(_input1, _camera, -1);
        alvision.cvtest.convert(_input2, _distort, -1);
        alvision.cvtest.convert(_input3, _rot, -1);
        alvision.cvtest.convert(_input4, _new_cam, -1);

        //Applying precalculated undistort rectify map
        //if (!this.useCPlus) {
        //    this.mapx = _mapx;
        //    this.mapy = _mapy;
        //}
        var map1 = new alvision.Mat(), map2 = new alvision.Mat ();
        alvision.convertMaps(this.mapx, this.mapy, map1, map2, alvision.MatrixType.CV_32FC1);
        var _map1 = map1;
        var _map2 = map2;
        for (var i= 0; i < this.N_POINTS;i++)
        {
            var u = this.test_mat[this.INPUT][0].ptr<alvision.double>("double")[2 * i];
            var v = this.test_mat[this.INPUT][0].ptr<alvision.double>("double")[2 * i + 1];
            var pointsdata = _points.ptr<alvision.double>("double");
            var map1data = _map1.ptr<alvision.float>("float");
            var map2data = _map2.ptr<alvision.float>("float");
            pointsdata[2 * i] = map1data[v.valueOf() * _map1.cols().valueOf() + u.valueOf()];
            pointsdata[2 * i + 1] = map2data[v.valueOf() * _map2.cols().valueOf() + u.valueOf()];
        }

        //---

        alvision.undistortPoints(_points,ref_points,_camera,
            this.zero_distortion ? null : _distort,
            this.zero_R ? null : _rot,
            this.zero_new_cam ? _camera : _new_cam);
        //cvTsDistortPoints(&_points,&ref_points,&_camera,&_distort,&_rot,&_new_cam);
        var dst = this.test_mat[this.REF_OUTPUT][0];
        alvision.cvtest.convert(ref_points, dst, -1);

        alvision.cvtest.copy(this.test_mat[this.INPUT][0], this.test_mat[this.OUTPUT][0]);

        //delete [] dist;
        //delete [] new_cam;
        //delete [] points;
        //delete [] r_points;
        //cvReleaseMat(&_mapx);
        //cvReleaseMat(&_mapy);
//#endif
    }
    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {

        super.get_test_array_types_and_sizes(test_case_idx, sizes, types);
        var rng = this.ts.get_rng();
        this.useCPlus = ((alvision.cvtest.randInt(rng).valueOf() % 2) != 0);
        //useCPlus = 0;
        types[this.INPUT][0] = types[this.OUTPUT][0] = types[this.REF_OUTPUT][0] = alvision.MatrixType.CV_64FC2;

        types[this.INPUT][1] = alvision.cvtest.randInt(rng).valueOf() % 2 ? alvision.MatrixType.CV_64F : alvision.MatrixType.CV_32F;
        types[this.INPUT][2] = alvision.cvtest.randInt(rng).valueOf() % 2 ? alvision.MatrixType.CV_64F : alvision.MatrixType.CV_32F;
        types[this.INPUT][3] = alvision.cvtest.randInt(rng).valueOf() % 2 ? alvision.MatrixType.CV_64F : alvision.MatrixType.CV_32F;
        types[this.INPUT][4] = alvision.cvtest.randInt(rng).valueOf() % 2 ? alvision.MatrixType.CV_64F : alvision.MatrixType.CV_32F;

        sizes[this.INPUT][0] = sizes[this.OUTPUT][0] = sizes[this.REF_OUTPUT][0] = new alvision.Size(this.N_POINTS, 1);
        sizes[this.INPUT][1] = sizes[this.INPUT][3] = new alvision.Size(3, 3);
        sizes[this.INPUT][4] = new alvision.Size(3, 3);

        if (alvision.cvtest.randInt(rng).valueOf() % 2) {
            if (alvision.cvtest.randInt(rng).valueOf() % 2) {
                sizes[this.INPUT][2] =new alvision.Size(1, 4);
            }
            else {
                sizes[this.INPUT][2] = new alvision.Size(1, 5);
            }
        }
        else {
            if (alvision.cvtest.randInt(rng).valueOf() % 2) {
                sizes[this.INPUT][2] = new alvision.Size(4, 1);
            }
            else {
                sizes[this.INPUT][2] = new alvision.Size(5, 1);
            }
        }
    }
    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
        return 8;
    }
    run_func(): void {
        if (this.useCPlus) {
            //alvision.Mat input2, input3, input4;
            var input2 = this.zero_distortion ? new alvision.Mat() : this.test_mat[this.INPUT][2];
            var input3 = this.zero_R ? new alvision.Mat() : this.test_mat[this.INPUT][3];
            var input4 = this.zero_new_cam ? new alvision.Mat() : this.test_mat[this.INPUT][4];
            alvision.initUndistortRectifyMap(this.camera_mat, input2, input3, input4, this.img_size, this.mat_type, this.mapx, this.mapy);
        }
        //else {
        //    var input1 = this.test_mat[this.INPUT][1], input2: alvision.Mat, input3: alvision.Mat, input4: alvision.Mat;
        //    if (!this.zero_distortion)
        //        input2 = this.test_mat[this.INPUT][2];
        //    if (!this.zero_R)
        //        input3 = this.test_mat[this.INPUT][3];
        //    if (!this.zero_new_cam)
        //        input4 = this.test_mat[this.INPUT][4];
        //    alvision.initUndistortRectifyMap(input1,
        //        this.zero_distortion ? 0 : &input2,
        //        this.zero_R ? 0 : &input3,
        //        this.zero_new_cam ? 0 : &input4,
        //        this._mapx, _mapy);
        //}
    }

    private  useCPlus : boolean;
      private  N_POINTS = 100;
      private  MAX_X = 2048;
      private  MAX_Y = 2048;
      private zero_new_cam: boolean;
      private zero_distortion: boolean;
      private zero_R: boolean;


      private img_size: alvision.Size;

    private  camera_mat             : alvision.Mat;
    private  R                      : alvision.Mat;
    private  new_camera_mat         : alvision.Mat;
    private  distortion_coeffs      : alvision.Mat;
    private  mapx                   : alvision.Mat;
    private mapy: alvision.Mat;
    private _mapx: alvision.Mat;
    private  _mapy : alvision.Mat;
    private mat_type: alvision.int;
};




//////////////////////////////////////////////////////////////////////////////////////////////////////

alvision.cvtest.TEST('Calib3d_DefaultNewCameraMatrix', 'accuracy', () => { var test = new CV_DefaultNewCameraMatrixTest(); test.safe_run(); });
alvision.cvtest.TEST('Calib3d_UndistortPoints', 'accuracy', () => { var test = new CV_UndistortPointsTest (); test.safe_run(); });
alvision.cvtest.TEST('Calib3d_InitUndistortRectifyMap', 'accuracy', () => { var test = new CV_InitUndistortRectifyMapTest(); test.safe_run(); });
