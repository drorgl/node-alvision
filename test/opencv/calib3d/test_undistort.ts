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

        this.img_size.width = alvision.cvtest.randInt(rng) % MAX_X + 1;
        this.img_size.height = alvision.cvtest.randInt(rng) % MAX_Y + 1;

        center_principal_point = ((alvision.cvtest.randInt(rng) % 2)!=0);

        // Generating camera_mat matrix
        double sz = MAX(img_size.width, img_size.height);
        double aspect_ratio = alvision.cvtest.randReal(rng) * 0.6 + 0.7;
        double a[9] = { 0,0,0,0,0,0,0,0,1};
        Mat _a(3, 3, CV_64F, a);
        a[2] = (img_size.width - 1) * 0.5 + alvision.cvtest.randReal(rng) * 10 - 5;
        a[5] = (img_size.height - 1) * 0.5 + alvision.cvtest.randReal(rng) * 10 - 5;
        a[0] = sz / (0.9 - alvision.cvtest.randReal(rng) * 0.6);
        a[4] = aspect_ratio * a[0];

        Mat & _a0 = test_mat[INPUT][0];
        alvision.cvtest.convert(_a, _a0, _a0.type());
        camera_mat = _a0;

        return code;
    }
     prepare_to_validation(test_case_idx: alvision.int): void {
        const src = this.test_mat[this.INPUT][0];
        Mat & dst = test_mat[REF_OUTPUT][0];
        Mat & test_output = test_mat[OUTPUT][0];
        Mat & output = new_camera_mat;
        alvision.cvtest.convert(output, test_output, test_output.type());
        if (!center_principal_point) {
            alvision.cvtest.copy(src, dst);
        }
        else {
            double a[9] = { 0,0,0,0,0,0,0,0,1};
            Mat _a(3, 3, CV_64F, a);
            if (matrix_type == CV_64F) {
                a[0] = src.at<double>(0, 0);
                a[4] = src.at<double>(1, 1);
            }
            else {
                a[0] = src.at<float>(0, 0);
                a[4] = src.at<float>(1, 1);
            }
            a[2] = (img_size.width - 1) * 0.5;
            a[5] = (img_size.height - 1) * 0.5;
            alvision.cvtest.convert(_a, dst, dst.type());
        }
    }
     get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>>): void {
        super.get_test_array_types_and_sizes(test_case_idx, sizes, types);
        RNG & rng = this.ts.get_rng();
        matrix_type = types[INPUT][0] = types[OUTPUT][0] = types[REF_OUTPUT][0] = alvision.cvtest.randInt(rng) % 2 ? CV_64F : CV_32F;
        sizes[INPUT][0] = sizes[OUTPUT][0] = sizes[REF_OUTPUT][0] = cvSize(3, 3);
    }
     run_func(): void {
        this.new_camera_mat = alvision.getDefaultNewCameraMatrix(camera_mat, img_size, center_principal_point);
    }


    private img_size: alvision.Size;
    private camera_mat: alvision.Mat;
    private new_camera_mat: alvision.Mat;

    private matrix_type: alvision.int;

    private center_principal_point: boolean;

    static  MAX_X = 2048;
    static  MAX_Y = 2048;
    static  MAX_VAL = 10000;
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

        this.useCPlus = useDstMat = false;
        this.zero_new_cam = zero_distortion = zero_R = false;
    }
 
    prepare_test_case(test_case_idx: alvision.int ) :alvision.int{

        var rng = this.ts.get_rng();
        var code = super.prepare_test_case(test_case_idx);

        if (code <= 0)
            return code;

        useDstMat = (alvision.cvtest.randInt(rng) % 2) == 0;

        img_size.width = alvision.cvtest.randInt(rng) % MAX_X + 1;
        img_size.height = alvision.cvtest.randInt(rng) % MAX_Y + 1;
        int dist_size = test_mat[INPUT][2].cols > test_mat[INPUT][2].rows ? test_mat[INPUT][2].cols : test_mat[INPUT][2].rows;
        double cam[9] = { 0,0,0,0,0,0,0,0,1};
        vector < double > dist(dist_size);
        vector < double > proj(test_mat[INPUT][4].cols * test_mat[INPUT][4].rows);
        vector < Point2d > points(N_POINTS);

        Mat _camera(3, 3, CV_64F, cam);
        Mat _distort(test_mat[INPUT][2].rows, test_mat[INPUT][2].cols, CV_64F,&dist[0]);
        Mat _proj(test_mat[INPUT][4].size(), CV_64F, &proj[0]);
        Mat _points(test_mat[INPUT][0].size(), CV_64FC2, &points[0]);

        _proj = alvision.Scalar.all(0);

        //Generating points
        for (int i = 0; i < N_POINTS; i++ )
        {
            points[i].x = alvision.cvtest.randReal(rng) * img_size.width;
            points[i].y = alvision.cvtest.randReal(rng) * img_size.height;
        }

        //Generating camera matrix
        double sz = MAX(img_size.width, img_size.height);
        double aspect_ratio = alvision.cvtest.randReal(rng) * 0.6 + 0.7;
        cam[2] = (img_size.width - 1) * 0.5 + alvision.cvtest.randReal(rng) * 10 - 5;
        cam[5] = (img_size.height - 1) * 0.5 + alvision.cvtest.randReal(rng) * 10 - 5;
        cam[0] = sz / (0.9 - alvision.cvtest.randReal(rng) * 0.6);
        cam[4] = aspect_ratio * cam[0];

        //Generating distortion coeffs
        dist[0] = alvision.cvtest.randReal(rng) * 0.06 - 0.03;
        dist[1] = alvision.cvtest.randReal(rng) * 0.06 - 0.03;
        if (dist[0] * dist[1] > 0)
            dist[1] = -dist[1];
        if (alvision.cvtest.randInt(rng) % 4 != 0 )
        {
            dist[2] = alvision.cvtest.randReal(rng) * 0.004 - 0.002;
            dist[3] = alvision.cvtest.randReal(rng) * 0.004 - 0.002;
            if (dist_size > 4)
                dist[4] = alvision.cvtest.randReal(rng) * 0.004 - 0.002;
        }
    else
        {
            dist[2] = dist[3] = 0;
            if (dist_size > 4)
                dist[4] = 0;
        }

        //Generating P matrix (projection)
        if (test_mat[INPUT][4].cols != 4) {
            proj[8] = 1;
            if (alvision.cvtest.randInt(rng) % 2 == 0) // use identity new camera matrix
            {
                proj[0] = 1;
                proj[4] = 1;
            }
        else
            {
                proj[0] = cam[0] + (alvision.cvtest.randReal(rng) - (double)0.5)*0.2 * cam[0]; //10%
                proj[4] = cam[4] + (alvision.cvtest.randReal(rng) - (double)0.5)*0.2 * cam[4]; //10%
                proj[2] = cam[2] + (alvision.cvtest.randReal(rng) - (double)0.5)*0.3 * img_size.width; //15%
                proj[5] = cam[5] + (alvision.cvtest.randReal(rng) - (double)0.5)*0.3 * img_size.height; //15%
            }
        }
        else {
            proj[10] = 1;
            proj[0] = cam[0] + (alvision.cvtest.randReal(rng) - (double)0.5)*0.2 * cam[0]; //10%
            proj[5] = cam[4] + (alvision.cvtest.randReal(rng) - (double)0.5)*0.2 * cam[4]; //10%
            proj[2] = cam[2] + (alvision.cvtest.randReal(rng) - (double)0.5)*0.3 * img_size.width; //15%
            proj[6] = cam[5] + (alvision.cvtest.randReal(rng) - (double)0.5)*0.3 * img_size.height; //15%

            proj[3] = (img_size.height + img_size.width - 1) * 0.5 + alvision.cvtest.randReal(rng) * 10 - 5;
            proj[7] = (img_size.height + img_size.width - 1) * 0.5 + alvision.cvtest.randReal(rng) * 10 - 5;
            proj[11] = (img_size.height + img_size.width - 1) * 0.5 + alvision.cvtest.randReal(rng) * 10 - 5;
        }

        //Generating R matrix
        Mat _rot(3, 3, CV_64F);
        Mat rotation(1, 3, CV_64F);
        rotation.at<double>(0) = Math.PI * (alvision.cvtest.randReal(rng) - (double)0.5); // phi
        rotation.at<double>(1) = Math.PI * (alvision.cvtest.randReal(rng) - (double)0.5); // ksi
        rotation.at<double>(2) = Math.PI * (alvision.cvtest.randReal(rng) - (double)0.5); //khi
        alvision.cvtest.Rodrigues(rotation, _rot);

        //copying data
        //src_points = &_points;
        _points.convertTo(test_mat[INPUT][0], test_mat[INPUT][0].type());
        _camera.convertTo(test_mat[INPUT][1], test_mat[INPUT][1].type());
        _distort.convertTo(test_mat[INPUT][2], test_mat[INPUT][2].type());
        _rot.convertTo(test_mat[INPUT][3], test_mat[INPUT][3].type());
        _proj.convertTo(test_mat[INPUT][4], test_mat[INPUT][4].type());

        zero_distortion = (alvision.cvtest.randInt(rng) % 2) == 0 ? false : true;
        zero_new_cam = (alvision.cvtest.randInt(rng) % 2) == 0 ? false : true;
        zero_R = (alvision.cvtest.randInt(rng) % 2) == 0 ? false : true;

        if (useCPlus) {
            _points.convertTo(src_points, CV_32F);

            camera_mat = test_mat[INPUT][1];
            distortion_coeffs = test_mat[INPUT][2];
            R = test_mat[INPUT][3];
            P = test_mat[INPUT][4];
        }

        return code;

    }
    prepare_to_validation(test_case_idx: alvision.int ) : void{

        var dist_size = this.test_mat[this.INPUT][2].cols > this.test_mat[this.INPUT][2].rows ? this.test_mat[this.INPUT][2].cols : this.test_mat[this.INPUT][2].rows;
        var cam = [ 0,0,0,0,0,0,0,0,1];
        var rot = [ 1,0,0,0,1,0,0,0,1];

        double * dist = new double[dist_size];
        double * proj = new double[test_mat[INPUT][4].cols * test_mat[INPUT][4].rows];
        double * points = new double[N_POINTS * 2];
        double * r_points = new double[N_POINTS * 2];
        //Run reference calculations
        CvMat ref_points= cvMat(test_mat[INPUT][0].rows, test_mat[INPUT][0].cols, CV_64FC2, r_points);
        CvMat _camera = cvMat(3, 3, CV_64F, cam);
        CvMat _rot = cvMat(3, 3, CV_64F, rot);
        CvMat _distort = cvMat(test_mat[INPUT][2].rows, test_mat[INPUT][2].cols, CV_64F, dist);
        CvMat _proj = cvMat(test_mat[INPUT][4].rows, test_mat[INPUT][4].cols, CV_64F, proj);
        CvMat _points= cvMat(test_mat[TEMP][0].rows, test_mat[TEMP][0].cols, CV_64FC2, points);

        Mat __camera = cvarrToMat(&_camera);
        Mat __distort = cvarrToMat(&_distort);
        Mat __rot = cvarrToMat(&_rot);
        Mat __proj = cvarrToMat(&_proj);
        Mat __points = cvarrToMat(&_points);
        Mat _ref_points = cvarrToMat(&ref_points);

        alvision.cvtest.convert(test_mat[INPUT][1], __camera, __camera.type());
        alvision.cvtest.convert(test_mat[INPUT][2], __distort, __distort.type());
        alvision.cvtest.convert(test_mat[INPUT][3], __rot, __rot.type());
        alvision.cvtest.convert(test_mat[INPUT][4], __proj, __proj.type());

        if (useCPlus) {
            if (useDstMat) {
                CvMat temp = dst_points_mat;
                for (int i= 0; i < N_POINTS * 2;i++)
                {
                    points[i] = temp.data.fl[i];
                }
            }
            else {
                for (int i= 0; i < N_POINTS;i++)
                {
                    points[2 * i] = dst_points[i].x;
                    points[2 * i + 1] = dst_points[i].y;
                }
            }
        }
        else {
            alvision.cvtest.convert(test_mat[TEMP][0], __points, __points.type());
        }

        CvMat * input2 = zero_distortion ? 0 : &_distort;
        CvMat * input3 = zero_R ? 0 : &_rot;
        CvMat * input4 = zero_new_cam ? 0 : &_proj;
        distortPoints(&_points,&ref_points,&_camera, input2, input3, input4);

        Mat & dst = test_mat[REF_OUTPUT][0];
        alvision.cvtest.convert(_ref_points, dst, dst.type());

        alvision.cvtest.copy(test_mat[INPUT][0], test_mat[OUTPUT][0]);

        delete [] dist;
        delete [] proj;
        delete [] points;
        delete [] r_points;

    }
    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>, types: Array<Array<alvision.int>> ) : void{
        super.get_test_array_types_and_sizes(test_case_idx, sizes, types);
    var rng = this.ts.get_rng();
        useCPlus = ((alvision.cvtest.randInt(rng) % 2)!=0);
    //useCPlus = 0;
    if (useCPlus) {
        types[INPUT][0] = types[OUTPUT][0] = types[REF_OUTPUT][0] = types[TEMP][0] = CV_32FC2;
    }
    else {
        types[INPUT][0] = types[OUTPUT][0] = types[REF_OUTPUT][0] = types[TEMP][0] = alvision.cvtest.randInt(rng) % 2 ? CV_64FC2 : CV_32FC2;
    }
    types[INPUT][1] = alvision.cvtest.randInt(rng) % 2 ? CV_64F : CV_32F;
    types[INPUT][2] = alvision.cvtest.randInt(rng) % 2 ? CV_64F : CV_32F;
    types[INPUT][3] = alvision.cvtest.randInt(rng) % 2 ? CV_64F : CV_32F;
    types[INPUT][4] = alvision.cvtest.randInt(rng) % 2 ? CV_64F : CV_32F;

    sizes[INPUT][0] = sizes[OUTPUT][0] = sizes[REF_OUTPUT][0] = sizes[TEMP][0] = alvision.cvtest.randInt(rng) % 2 ? cvSize(1, N_POINTS) : cvSize(N_POINTS, 1);
    sizes[INPUT][1] = sizes[INPUT][3] = cvSize(3, 3);
    sizes[INPUT][4] = alvision.cvtest.randInt(rng) % 2 ? cvSize(3, 3) : cvSize(4, 3);

    if (alvision.cvtest.randInt(rng) % 2)
    {
        if (alvision.cvtest.randInt(rng) % 2)
        {
            sizes[INPUT][2] = cvSize(1, 4);
        }
        else
        {
            sizes[INPUT][2] = cvSize(1, 5);
        }
    }
    else
    {
        if (alvision.cvtest.randInt(rng) % 2)
        {
            sizes[INPUT][2] = cvSize(4, 1);
        }
        else
        {
            sizes[INPUT][2] = cvSize(5, 1);
        }
    }
    }
    get_success_error_level(test_case_idx: alvision.int, i: alvision.int, j: alvision.int): alvision.double {
        return 5e-2;
    }
    run_func() : void{

    if (useCPlus) {
        alvision.Mat input2, input3, input4;
        input2 = zero_distortion ? cv ::Mat() : alvision.Mat(test_mat[INPUT][2]);
        input3 = zero_R ? cv ::Mat() : alvision.Mat(test_mat[INPUT][3]);
        input4 = zero_new_cam ? cv ::Mat() : alvision.Mat(test_mat[INPUT][4]);

        if (useDstMat) {
            //alvision.undistortPoints(src_points,dst_points_mat,camera_mat,distortion_coeffs,R,P);
            alvision.undistortPoints(src_points, dst_points_mat, camera_mat, input2, input3, input4);
        }
        else {
            //alvision.undistortPoints(src_points,dst_points,camera_mat,distortion_coeffs,R,P);
            alvision.undistortPoints(src_points, dst_points, camera_mat, input2, input3, input4);
        }
    }
    else {
        CvMat _input0 = test_mat[INPUT][0], _input1 = test_mat[INPUT][1], _input2, _input3, _input4;
        CvMat _output = test_mat[TEMP][0];
        if (!zero_distortion)
            _input2 = test_mat[INPUT][2];
        if (!zero_R)
            _input3 = test_mat[INPUT][3];
        if (!zero_new_cam)
            _input4 = test_mat[INPUT][4];
        cvUndistortPoints(&_input0, &_output, &_input1,
            zero_distortion ? 0 : &_input2,
            zero_R ? 0 : &_input3,
            zero_new_cam ? 0 : &_input4);
    }
}
    distortPoints(_src: alvision.Mat, _dst: alvision.Mat, _cameraMatrix: alvision.Mat,
    _distCoeffs :  alvision.Mat, matR : alvision.Mat,  matP : alvision.Mat) : void{
        double a[9];

        CvMat * __P;
        if ((!matP) || (matP.cols == 3))
            __P = cvCreateMat(3, 3, CV_64F);
        else
            __P = cvCreateMat(3, 4, CV_64F);
        if (matP) {
            alvision.cvtest.convert(cvarrToMat(matP), cvarrToMat(__P), -1);
        }
        else {
            cvZero(__P);
            __P.data.db[0] = 1;
            __P.data.db[4] = 1;
            __P.data.db[8] = 1;
        }
        CvMat * __R = cvCreateMat(3, 3, CV_64F);
        if (matR) {
            cvCopy(matR, __R);
        }
        else {
            cvZero(__R);
            __R.data.db[0] = 1;
            __R.data.db[4] = 1;
            __R.data.db[8] = 1;
        }
        for (int i= 0; i < N_POINTS;i++)
        {
            int movement = __P.cols > 3 ? 1 : 0;
            double x = (_src.data.db[2 * i] - __P.data.db[2]) / __P.data.db[0];
            double y = (_src.data.db[2 * i + 1] - __P.data.db[5 + movement]) / __P.data.db[4 + movement];
            CvMat inverse = cvMat(3, 3, CV_64F, a);
            cvInvert(__R,&inverse);
            double w1 = x * inverse.data.db[6] + y * inverse.data.db[7] + inverse.data.db[8];
            double _x = (x * inverse.data.db[0] + y * inverse.data.db[1] + inverse.data.db[2]) / w1;
            double _y = (x * inverse.data.db[3] + y * inverse.data.db[4] + inverse.data.db[5]) / w1;

            //Distortions

            double __x = _x;
            double __y = _y;
            if (_distCoeffs) {
                double r2 = _x * _x + _y * _y;

                __x = _x * (1 + _distCoeffs.data.db[0] * r2 + _distCoeffs.data.db[1] * r2 * r2) +
                    2 * _distCoeffs.data.db[2] * _x * _y + _distCoeffs.data.db[3] * (r2 + 2 * _x * _x);
                __y = _y * (1 + _distCoeffs.data.db[0] * r2 + _distCoeffs.data.db[1] * r2 * r2) +
                    2 * _distCoeffs.data.db[3] * _x * _y + _distCoeffs.data.db[2] * (r2 + 2 * _y * _y);
                if ((_distCoeffs.cols > 4) || (_distCoeffs.rows > 4)) {
                    __x += _x * _distCoeffs.data.db[4] * r2 * r2 * r2;
                    __y += _y * _distCoeffs.data.db[4] * r2 * r2 * r2;
                }
            }


            _dst.data.db[2 * i] = __x * _cameraMatrix.data.db[0] + _cameraMatrix.data.db[2];
            _dst.data.db[2 * i + 1] = __y * _cameraMatrix.data.db[4] + _cameraMatrix.data.db[5];

        }

        cvReleaseMat(&__R);
        cvReleaseMat(&__P);

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
    prepare_test_case(test_case_idx : alvision.int) : alvision.int {}
    prepare_to_validation(test_case_idx : alvision.int) : void {}
    get_test_array_types_and_sizes(test_case_idx: alvision.int, sizes: Array<Array<alvision.Size>>,types: Array<Array<alvision.int>>): void {}
    get_success_error_level(test_case_idx : alvision.int, i : alvision.int , j  : alvision.int) : alvision.double {}
    run_func() : void {}

    private bool useCPlus;
    private static const int N_POINTS = 100;
    private static const int MAX_X = 2048;
    private static const int MAX_Y = 2048;
    private bool zero_new_cam;
    private bool zero_distortion;
    private bool zero_R;


    private alvision.Size img_size;

    private alvision.Mat camera_mat;
    private alvision.Mat R;
    private alvision.Mat new_camera_mat;
    private alvision.Mat distortion_coeffs;
    private alvision.Mat mapx;
    private alvision.Mat mapy;
    private CvMat* _mapx;
    private CvMat* _mapy;
    private int mat_type;
};

CV_InitUndistortRectifyMapTest::CV_InitUndistortRectifyMapTest()
{
    test_array[INPUT].push(null); // test points matrix
    test_array[INPUT].push(null); // camera matrix
    test_array[INPUT].push(null); // distortion coeffs
    test_array[INPUT].push(null); // R matrix
    test_array[INPUT].push(null); // new camera matrix
    test_array[OUTPUT].push(null); // distorted dst points
    test_array[REF_OUTPUT].push(null);

    useCPlus = false;
    zero_distortion = zero_new_cam = zero_R = false;
    _mapx = _mapy = NULL;
    mat_type = 0;
}

void CV_InitUndistortRectifyMapTest::get_test_array_types_and_sizes( int test_case_idx, Array<Array<Size> >& sizes, Array<Array<int> >& types )
{
    super.get_test_array_types_and_sizes(test_case_idx,sizes,types);
    var rng = this.ts.get_rng();
    useCPlus = ((alvision.cvtest.randInt(rng) % 2)!=0);
    //useCPlus = 0;
    types[INPUT][0] = types[OUTPUT][0] = types[REF_OUTPUT][0] = CV_64FC2;

    types[INPUT][1] = alvision.cvtest.randInt(rng)%2 ? CV_64F : CV_32F;
    types[INPUT][2] = alvision.cvtest.randInt(rng)%2 ? CV_64F : CV_32F;
    types[INPUT][3] = alvision.cvtest.randInt(rng)%2 ? CV_64F : CV_32F;
    types[INPUT][4] = alvision.cvtest.randInt(rng)%2 ? CV_64F : CV_32F;

    sizes[INPUT][0] = sizes[OUTPUT][0] = sizes[REF_OUTPUT][0] = cvSize(N_POINTS,1);
    sizes[INPUT][1] = sizes[INPUT][3] = cvSize(3,3);
    sizes[INPUT][4] = cvSize(3,3);

    if (alvision.cvtest.randInt(rng)%2)
    {
        if (alvision.cvtest.randInt(rng)%2)
        {
            sizes[INPUT][2] = cvSize(1,4);
        }
        else
        {
            sizes[INPUT][2] = cvSize(1,5);
        }
    }
    else
    {
        if (alvision.cvtest.randInt(rng)%2)
        {
            sizes[INPUT][2] = cvSize(4,1);
        }
        else
        {
            sizes[INPUT][2] = cvSize(5,1);
        }
    }
}


int CV_InitUndistortRectifyMapTest::prepare_test_case(int test_case_idx)
{
    var rng = this.ts.get_rng();
    int code = super.prepare_test_case( test_case_idx );

    if (code <= 0)
        return code;

    img_size.width = alvision.cvtest.randInt(rng) % MAX_X + 1;
    img_size.height = alvision.cvtest.randInt(rng) % MAX_Y + 1;

    if (useCPlus)
    {
        mat_type = (alvision.cvtest.randInt(rng) % 2) == 0 ? CV_32FC1 : CV_16SC2;
        if ((alvision.cvtest.randInt(rng) % 4) == 0)
            mat_type = -1;
        if ((alvision.cvtest.randInt(rng) % 4) == 0)
            mat_type = CV_32FC2;
        _mapx = 0;
        _mapy = 0;
    }
    else
    {
        int typex = (alvision.cvtest.randInt(rng) % 2) == 0 ? CV_32FC1 : CV_16SC2;
        //typex = CV_32FC1; ///!!!!!!!!!!!!!!!!
        int typey = (typex == CV_32FC1) ? CV_32FC1 : CV_16UC1;

        _mapx = cvCreateMat(img_size.height,img_size.width,typex);
        _mapy = cvCreateMat(img_size.height,img_size.width,typey);


    }

    int dist_size = test_mat[INPUT][2].cols > test_mat[INPUT][2].rows ? test_mat[INPUT][2].cols : test_mat[INPUT][2].rows;
    double cam[9] = {0,0,0,0,0,0,0,0,1};
    Array<double> dist(dist_size);
    Array<double> new_cam(test_mat[INPUT][4].cols * test_mat[INPUT][4].rows);
    Array<Point2d> points(N_POINTS);

    Mat _camera(3,3,CV_64F,cam);
    Mat _distort(test_mat[INPUT][2].size(),CV_64F,&dist[0]);
    Mat _new_cam(test_mat[INPUT][4].size(),CV_64F,&new_cam[0]);
    Mat _points(test_mat[INPUT][0].size(),CV_64FC2, &points[0]);

    //Generating points
    for (int i=0;i<N_POINTS;i++)
    {
        points[i].x = alvision.cvtest.randReal(rng)*img_size.width;
        points[i].y = alvision.cvtest.randReal(rng)*img_size.height;
    }

    //Generating camera matrix
    double sz = MAX(img_size.width,img_size.height);
    double aspect_ratio = alvision.cvtest.randReal(rng)*0.6 + 0.7;
    cam[2] = (img_size.width - 1)*0.5 + alvision.cvtest.randReal(rng)*10 - 5;
    cam[5] = (img_size.height - 1)*0.5 + alvision.cvtest.randReal(rng)*10 - 5;
    cam[0] = sz/(0.9 - alvision.cvtest.randReal(rng)*0.6);
    cam[4] = aspect_ratio*cam[0];

    //Generating distortion coeffs
    dist[0] = alvision.cvtest.randReal(rng)*0.06 - 0.03;
    dist[1] = alvision.cvtest.randReal(rng)*0.06 - 0.03;
    if( dist[0]*dist[1] > 0 )
        dist[1] = -dist[1];
    if( alvision.cvtest.randInt(rng)%4 != 0 )
    {
        dist[2] = alvision.cvtest.randReal(rng)*0.004 - 0.002;
        dist[3] = alvision.cvtest.randReal(rng)*0.004 - 0.002;
        if (dist_size > 4)
            dist[4] = alvision.cvtest.randReal(rng)*0.004 - 0.002;
    }
    else
    {
        dist[2] = dist[3] = 0;
        if (dist_size > 4)
            dist[4] = 0;
    }

    //Generating new camera matrix
    _new_cam = alvision.Scalar.all(0);
    new_cam[8] = 1;

    //new_cam[0] = cam[0];
    //new_cam[4] = cam[4];
    //new_cam[2] = cam[2];
    //new_cam[5] = cam[5];

    new_cam[0] = cam[0] + (alvision.cvtest.randReal(rng) - (double)0.5)*0.2*cam[0]; //10%
    new_cam[4] = cam[4] + (alvision.cvtest.randReal(rng) - (double)0.5)*0.2*cam[4]; //10%
    new_cam[2] = cam[2] + (alvision.cvtest.randReal(rng) - (double)0.5)*0.3*img_size.width; //15%
    new_cam[5] = cam[5] + (alvision.cvtest.randReal(rng) - (double)0.5)*0.3*img_size.height; //15%


    //Generating R matrix
    Mat _rot(3,3,CV_64F);
    Mat rotation(1,3,CV_64F);
    rotation.at<double>(0) = Math.PI/8*(alvision.cvtest.randReal(rng) - (double)0.5); // phi
    rotation.at<double>(1) = Math.PI/8*(alvision.cvtest.randReal(rng) - (double)0.5); // ksi
    rotation.at<double>(2) = Math.PI/3*(alvision.cvtest.randReal(rng) - (double)0.5); //khi
    alvision.cvtest.Rodrigues(rotation, _rot);

    //cvSetIdentity(_rot);
    //copying data
    alvision.cvtest.convert( _points, test_mat[INPUT][0], test_mat[INPUT][0].type());
    alvision.cvtest.convert( _camera, test_mat[INPUT][1], test_mat[INPUT][1].type());
    alvision.cvtest.convert( _distort, test_mat[INPUT][2], test_mat[INPUT][2].type());
    alvision.cvtest.convert( _rot, test_mat[INPUT][3], test_mat[INPUT][3].type());
    alvision.cvtest.convert( _new_cam, test_mat[INPUT][4], test_mat[INPUT][4].type());

    zero_distortion = (alvision.cvtest.randInt(rng)%2) == 0 ? false : true;
    zero_new_cam = (alvision.cvtest.randInt(rng)%2) == 0 ? false : true;
    zero_R = (alvision.cvtest.randInt(rng)%2) == 0 ? false : true;

    if (useCPlus)
    {
        camera_mat = test_mat[INPUT][1];
        distortion_coeffs = test_mat[INPUT][2];
        R = test_mat[INPUT][3];
        new_camera_mat = test_mat[INPUT][4];
    }

    return code;
}

void CV_InitUndistortRectifyMapTest::prepare_to_validation(int/* test_case_idx*/)
{
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
//        int u = saturate_cast<int>(sptr[i].x);
//        int v = saturate_cast<int>(sptr[i].y);
//        points[i].x = _map1.data.fl[v*_map1.cols + u];
//        points[i].y = _map2.data.fl[v*_map2.cols + u];
//    }
//
//    //---
//
//    alvision.undistortPoints(_points, ref_points, _camera,
//                        zero_distortion ? Mat() : _distort,
//                        zero_R ? Mat::eye(3,3,CV_64F) : _rot,
//                        zero_new_cam ? _camera : _new_cam);
//    //cvTsDistortPoints(&_points,&ref_points,&_camera,&_distort,&_rot,&_new_cam);
//    alvision.cvtest.convert(ref_points, test_mat[REF_OUTPUT][0], test_mat[REF_OUTPUT][0].type());
//    alvision.cvtest.copy(test_mat[INPUT][0],test_mat[OUTPUT][0]);
//
//    cvReleaseMat(&_mapx);
//    cvReleaseMat(&_mapy);
//#else
    int dist_size = test_mat[INPUT][2].cols > test_mat[INPUT][2].rows ? test_mat[INPUT][2].cols : test_mat[INPUT][2].rows;
    double cam[9] = {0,0,0,0,0,0,0,0,1};
    double rot[9] = {1,0,0,0,1,0,0,0,1};
    double* dist = new double[dist_size ];
    double* new_cam = new double[test_mat[INPUT][4].cols * test_mat[INPUT][4].rows];
    double* points = new double[N_POINTS*2];
    double* r_points = new double[N_POINTS*2];
    //Run reference calculations
    CvMat ref_points= cvMat(test_mat[INPUT][0].rows,test_mat[INPUT][0].cols,CV_64FC2,r_points);
    CvMat _camera = cvMat(3,3,CV_64F,cam);
    CvMat _rot = cvMat(3,3,CV_64F,rot);
    CvMat _distort = cvMat(test_mat[INPUT][2].rows,test_mat[INPUT][2].cols,CV_64F,dist);
    CvMat _new_cam = cvMat(test_mat[INPUT][4].rows,test_mat[INPUT][4].cols,CV_64F,new_cam);
    CvMat _points= cvMat(test_mat[INPUT][0].rows,test_mat[INPUT][0].cols,CV_64FC2,points);

    CvMat _input1 = test_mat[INPUT][1];
    CvMat _input2 = test_mat[INPUT][2];
    CvMat _input3 = test_mat[INPUT][3];
    CvMat _input4 = test_mat[INPUT][4];

    alvision.cvtest.convert(cvarrToMat(&_input1), cvarrToMat(&_camera), -1);
    alvision.cvtest.convert(cvarrToMat(&_input2), cvarrToMat(&_distort), -1);
    alvision.cvtest.convert(cvarrToMat(&_input3), cvarrToMat(&_rot), -1);
    alvision.cvtest.convert(cvarrToMat(&_input4), cvarrToMat(&_new_cam), -1);

    //Applying precalculated undistort rectify map
    if (!useCPlus)
    {
        mapx = alvision.cvarrToMat(_mapx);
        mapy = alvision.cvarrToMat(_mapy);
    }
    alvision.Mat map1,map2;
    alvision.convertMaps(mapx,mapy,map1,map2,CV_32FC1);
    CvMat _map1 = map1;
    CvMat _map2 = map2;
    for (int i=0;i<N_POINTS;i++)
    {
        double u = test_mat[INPUT][0].ptr<double>()[2*i];
        double v = test_mat[INPUT][0].ptr<double>()[2*i+1];
        _points.data.db[2*i] = (double)_map1.data.fl[(int)v*_map1.cols+(int)u];
        _points.data.db[2*i+1] = (double)_map2.data.fl[(int)v*_map2.cols+(int)u];
    }

    //---

    cvUndistortPoints(&_points,&ref_points,&_camera,
                      zero_distortion ? 0 : &_distort, zero_R ? 0 : &_rot, zero_new_cam ? &_camera : &_new_cam);
    //cvTsDistortPoints(&_points,&ref_points,&_camera,&_distort,&_rot,&_new_cam);
    CvMat dst = test_mat[REF_OUTPUT][0];
    alvision.cvtest.convert(cvarrToMat(&ref_points), cvarrToMat(&dst), -1);

    alvision.cvtest.copy(test_mat[INPUT][0],test_mat[OUTPUT][0]);

    delete[] dist;
    delete[] new_cam;
    delete[] points;
    delete[] r_points;
    cvReleaseMat(&_mapx);
    cvReleaseMat(&_mapy);
//#endif
}

void CV_InitUndistortRectifyMapTest::run_func()
{
    if (useCPlus)
    {
        alvision.Mat input2,input3,input4;
        input2 = zero_distortion ? alvision.Mat() : test_mat[INPUT][2];
        input3 = zero_R ? alvision.Mat() : test_mat[INPUT][3];
        input4 = zero_new_cam ? alvision.Mat() : test_mat[INPUT][4];
        alvision.initUndistortRectifyMap(camera_mat,input2,input3,input4,img_size,mat_type,mapx,mapy);
    }
    else
    {
        CvMat input1 = test_mat[INPUT][1], input2, input3, input4;
        if( !zero_distortion )
            input2 = test_mat[INPUT][2];
        if( !zero_R )
            input3 = test_mat[INPUT][3];
        if( !zero_new_cam )
            input4 = test_mat[INPUT][4];
        cvInitUndistortRectifyMap(&input1,
                                  zero_distortion ? 0 : &input2,
                                  zero_R ? 0 : &input3,
                                  zero_new_cam ? 0 : &input4,
                                  _mapx,_mapy);
    }
}

double CV_InitUndistortRectifyMapTest::get_success_error_level( int /*test_case_idx*/, int /*i*/, int /*j*/ )
{
    return 8;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////

alvision.cvtest.TEST('Calib3d_DefaultNewCameraMatrix', 'accuracy', () => { CV_DefaultNewCameraMatrixTest test; test.safe_run(); });
alvision.cvtest.TEST('Calib3d_UndistortPoints', 'accuracy', () => { CV_UndistortPointsTest test; test.safe_run(); });
alvision.cvtest.TEST('Calib3d_InitUndistortRectifyMap', 'accuracy', () => { CV_InitUndistortRectifyMapTest test; test.safe_run(); });
