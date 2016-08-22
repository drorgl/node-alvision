///*M///////////////////////////////////////////////////////////////////////////////////////
////
////  IMPORTANT: READ BEFORE DOWNLOADING, COPYING, INSTALLING OR USING.
////
////  By downloading, copying, installing or using the software you agree to this license.
////  If you do not agree to this license, do not download, install,
////  copy or use the software.
////
////
////                        Intel License Agreement
////                For Open Source Computer Vision Library
////
//// Copyright (C) 2000, Intel Corporation, all rights reserved.
//// Third party copyrights are property of their respective owners.
////
//// Redistribution and use in source and binary forms, with or without modification,
//// are permitted provided that the following conditions are met:
////
////   * Redistribution's of source code must retain the above copyright notice,
////     this list of conditions and the following disclaimer.
////
////   * Redistribution's in binary form must reproduce the above copyright notice,
////     this list of conditions and the following disclaimer in the documentation
////     and/or other materials provided with the distribution.
////
////   * The name of Intel Corporation may not be used to endorse or promote products
////     derived from this software without specific prior written permission.
////
//// This software is provided by the copyright holders and contributors "as is" and
//// any express or implied warranties, including, but not limited to, the implied
//// warranties of merchantability and fitness for a particular purpose are disclaimed.
//// In no event shall the Intel Corporation or contributors be liable for any direct,
//// indirect, incidental, special, exemplary, or consequential damages
//// (including, but not limited to, procurement of substitute goods or services;
//// loss of use, data, or profits; or business interruption) however caused
//// and on any theory of liability, whether in contract, strict liability,
//// or tort (including negligence or otherwise) arising in any way out of
//// the use of this software, even if advised of the possibility of such damage.
////
////M*/

//import tape = require("tape");
//import path = require("path");
//import colors = require("colors");
//import async = require("async");
//import alvision = require("../../../tsbinding/alvision");
//import util = require('util');
//import fs = require('fs');

////#include "test_precomp.hpp"
////#include "opencv2/imgproc/imgproc_c.h"
////
//class CV_UndistortPointsBadArgTest extends alvision.cvtest.BadArgTest
//{
//    constructor() {
//        super();

//        this.useCPlus = false;
//        this._camera_mat = matR = matP = _distortion_coeffs = _src_points = _dst_points = NULL;
//    }

//    protected run(int): void {
//        //var rng = this.ts.get_rng();
//        var errcount = 0;
//        this.useCPlus = false;
//        //initializing
//        this.img_size.width = 800;
//        this.img_size.height = 600;
//        var cam = [150.f, 0.f, img_size.width / 2.f, 0, 300.f, img_size.height / 2.f, 0.f, 0.f, 1.f];
//        var dist = [0.01, 0.02, 0.001, 0.0005]
//        var s_points = [
//            (img_size.width) / 4.0,
//            (img_size.height) / 4.0,
//        ];
//        var d_points = new Array(N_POINTS2);
//        double p[9] = { 155.f, 0.f, img_size.width / 2.f+img_size.width / 50.f, 0, 310.f, img_size.height / 2.f+img_size.height / 50.f, 0.f, 0.f, 1.f};
//        double r[9] = { 1,0,0,0,1,0,0,0,1};

//        CvMat _camera_mat_orig = cvMat(3, 3, CV_64F, cam);
//        CvMat _distortion_coeffs_orig = cvMat(1, 4, CV_64F, dist);
//        CvMat _P_orig = cvMat(3, 3, CV_64F, p);
//        CvMat _R_orig = cvMat(3, 3, CV_64F, r);
//        CvMat _src_points_orig = cvMat(1, 4, CV_64FC2, s_points);
//        CvMat _dst_points_orig = cvMat(1, 4, CV_64FC2, d_points);

//        _camera_mat = &_camera_mat_orig;
//        _distortion_coeffs = &_distortion_coeffs_orig;
//        matP = &_P_orig;
//        matR = &_R_orig;
//        _src_points = &_src_points_orig;
//        _dst_points = &_dst_points_orig;

//        //tests
//        CvMat * temp1;
//        CvMat * temp;
//        IplImage * temp_img = cvCreateImage(alvision.Size(img_size.width, img_size.height), 8, 3);

//        //-----------
//        temp = (CvMat *)temp_img;
//        _src_points = temp;
//        errcount += run_test_case(CV_StsAssert, "Input data is not CvMat*");
//        _src_points = &_src_points_orig;

//        temp = (CvMat *)temp_img;
//        _dst_points = temp;
//        errcount += run_test_case(CV_StsAssert, "Output data is not CvMat*");
//        _dst_points = &_dst_points_orig;

//        temp = cvCreateMat(2, 3, CV_64F);
//        _src_points = temp;
//        errcount += run_test_case(CV_StsAssert, "Invalid input data matrix size");
//        _src_points = &_src_points_orig;
//        cvReleaseMat(&temp);

//        temp = cvCreateMat(2, 3, CV_64F);
//        _dst_points = temp;
//        errcount += run_test_case(CV_StsAssert, "Invalid output data matrix size");
//        _dst_points = &_dst_points_orig;
//        cvReleaseMat(&temp);

//        temp = cvCreateMat(1, 3, CV_64F);
//        temp1 = cvCreateMat(4, 1, CV_64F);
//        _dst_points = temp;
//        _src_points = temp1;
//        errcount += run_test_case(CV_StsAssert, "Output and input data sizes mismatch");
//        _dst_points = &_dst_points_orig;
//        _src_points = &_src_points_orig;
//        cvReleaseMat(&temp);
//        cvReleaseMat(&temp1);

//        temp = cvCreateMat(1, 3, CV_32S);
//        _dst_points = temp;
//        errcount += run_test_case(CV_StsAssert, "Invalid output data matrix type");
//        _dst_points = &_dst_points_orig;
//        cvReleaseMat(&temp);

//        temp = cvCreateMat(1, 3, CV_32S);
//        _src_points = temp;
//        errcount += run_test_case(CV_StsAssert, "Invalid input data matrix type");
//        _src_points = &_src_points_orig;
//        cvReleaseMat(&temp);
//        //------------
//        temp = cvCreateMat(2, 3, CV_64F);
//        _camera_mat = temp;
//        errcount += run_test_case(CV_StsAssert, "Invalid camera data matrix size");
//        _camera_mat = &_camera_mat_orig;
//        cvReleaseMat(&temp);

//        temp = cvCreateMat(3, 4, CV_64F);
//        _camera_mat = temp;
//        errcount += run_test_case(CV_StsAssert, "Invalid camera data matrix size");
//        _camera_mat = &_camera_mat_orig;
//        cvReleaseMat(&temp);

//        temp = (CvMat *)temp_img;
//        _camera_mat = temp;
//        errcount += run_test_case(CV_StsAssert, "Camera data is not CvMat*");
//        _camera_mat = &_camera_mat_orig;
//        //----------

//        temp = (CvMat *)temp_img;
//        _distortion_coeffs = temp;
//        errcount += run_test_case(CV_StsAssert, "Distortion coefficients data is not CvMat*");
//        _distortion_coeffs = &_distortion_coeffs_orig;

//        temp = cvCreateMat(1, 6, CV_64F);
//        _distortion_coeffs = temp;
//        errcount += run_test_case(CV_StsAssert, "Invalid distortion coefficients data matrix size");
//        _distortion_coeffs = &_distortion_coeffs_orig;
//        cvReleaseMat(&temp);

//        temp = cvCreateMat(3, 3, CV_64F);
//        _distortion_coeffs = temp;
//        errcount += run_test_case(CV_StsAssert, "Invalid distortion coefficients data matrix size");
//        _distortion_coeffs = &_distortion_coeffs_orig;
//        cvReleaseMat(&temp);
//        //----------
//        temp = (CvMat *)temp_img;
//        matR = temp;
//        errcount += run_test_case(CV_StsAssert, "R data is not CvMat*");
//        matR = &_R_orig;

//        temp = cvCreateMat(4, 3, CV_64F);
//        matR = temp;
//        errcount += run_test_case(CV_StsAssert, "Invalid R data matrix size");
//        matR = &_R_orig;
//        cvReleaseMat(&temp);

//        temp = cvCreateMat(3, 2, CV_64F);
//        matR = temp;
//        errcount += run_test_case(CV_StsAssert, "Invalid R data matrix size");
//        matR = &_R_orig;
//        cvReleaseMat(&temp);

//        //-----------
//        temp = (CvMat *)temp_img;
//        matP = temp;
//        errcount += run_test_case(CV_StsAssert, "P data is not CvMat*");
//        matP = &_P_orig;

//        temp = cvCreateMat(4, 3, CV_64F);
//        matP = temp;
//        errcount += run_test_case(CV_StsAssert, "Invalid P data matrix size");
//        matP = &_P_orig;
//        cvReleaseMat(&temp);

//        temp = cvCreateMat(3, 2, CV_64F);
//        matP = temp;
//        errcount += run_test_case(CV_StsAssert, "Invalid P data matrix size");
//        matP = &_P_orig;
//        cvReleaseMat(&temp);
//        //------------
//        //C++ tests
//        useCPlus = true;

//        camera_mat = alvision.cvarrToMat(&_camera_mat_orig);
//        distortion_coeffs = alvision.cvarrToMat(&_distortion_coeffs_orig);
//        P = alvision.cvarrToMat(&_P_orig);
//        R = alvision.cvarrToMat(&_R_orig);
//        src_points = alvision.cvarrToMat(&_src_points_orig);

//        temp = cvCreateMat(2, 2, CV_32FC2);
//        src_points = alvision.cvarrToMat(temp);
//        errcount += run_test_case(CV_StsAssert, "Invalid input data matrix size");
//        src_points = alvision.cvarrToMat(&_src_points_orig);
//        cvReleaseMat(&temp);

//        temp = cvCreateMat(1, 4, CV_64FC2);
//        src_points = alvision.cvarrToMat(temp);
//        errcount += run_test_case(CV_StsAssert, "Invalid input data matrix type");
//        src_points = alvision.cvarrToMat(&_src_points_orig);
//        cvReleaseMat(&temp);

//        src_points = alvision.Mat();
//        errcount += run_test_case(CV_StsAssert, "Input data matrix is not continuous");
//        src_points = alvision.cvarrToMat(&_src_points_orig);
//        cvReleaseMat(&temp);



//        //------------
//        cvReleaseImage(&temp_img);
//        this.ts.set_failed_test_info(errcount > 0 ? cvtest ::TS::FAIL_BAD_ARG_CHECK : alvision.cvtest.FailureCode.OK);
//    }
//    protected run_func(): void {
//        if (useCPlus) {
//            alvision.undistortPoints(src_points, dst_points, camera_mat, distortion_coeffs, R, P);
//        }
//        else {
//            cvUndistortPoints(_src_points, _dst_points, _camera_mat, _distortion_coeffs, matR, matP);
//        }
//    }

//    //common
//    private img_size : alvision.Size
//    private useCPlus: boolean;
//    //static const int N_POINTS = 1;
//    const N_POINTS2  : alvision.int = 2;

//    ////C
//    //CvMat* _camera_mat;
//    //CvMat* matR;
//    //CvMat* matP;
//    //CvMat* _distortion_coeffs;
//    //CvMat* _src_points;
//    //CvMat* _dst_points;


//    //C++
//    private camera_mat: alvision.Mat;
//    private R: alvision.Mat;
//    private P: alvision.Mat;
//    private distortion_coeffs: alvision.Mat;
//    private src_points: alvision.Mat;
//    private dst_points: Array<alvision.Point2f>;

//};



////=========
//class CV_InitUndistortRectifyMapBadArgTest extends alvision.cvtest.BadArgTest
//{
//    constructor() {
//        super();
//        useCPlus = false;
//        _camera_mat = matR = _new_camera_mat = _distortion_coeffs = _mapx = _mapy = NULL;
//    }
//    protected run(int): void{
//        int errcount = 0;
//        //initializing
//        img_size.width = 800;
//        img_size.height = 600;
//        double cam[9] = { 150.f, 0.f, img_size.width / 2.f, 0, 300.f, img_size.height / 2.f, 0.f, 0.f, 1.f};
//        double dist[4] = { 0.01,0.02,0.001,0.0005};
//        float * arr_mapx = new float[img_size.width * img_size.height];
//        float * arr_mapy = new float[img_size.width * img_size.height];
//        double arr_new_camera_mat[9] = { 155.f, 0.f, img_size.width / 2.f+img_size.width / 50.f, 0, 310.f, img_size.height / 2.f+img_size.height / 50.f, 0.f, 0.f, 1.f};
//        double r[9] = { 1,0,0,0,1,0,0,0,1};

//        CvMat _camera_mat_orig = cvMat(3, 3, CV_64F, cam);
//        CvMat _distortion_coeffs_orig = cvMat(1, 4, CV_64F, dist);
//        CvMat _new_camera_mat_orig = cvMat(3, 3, CV_64F, arr_new_camera_mat);
//        CvMat _R_orig = cvMat(3, 3, CV_64F, r);
//        CvMat _mapx_orig = cvMat(img_size.height, img_size.width, CV_32FC1, arr_mapx);
//        CvMat _mapy_orig = cvMat(img_size.height, img_size.width, CV_32FC1, arr_mapy);
//        int mat_type_orig = CV_32FC1;

//        _camera_mat = &_camera_mat_orig;
//        _distortion_coeffs = &_distortion_coeffs_orig;
//        _new_camera_mat = &_new_camera_mat_orig;
//        matR = &_R_orig;
//        _mapx = &_mapx_orig;
//        _mapy = &_mapy_orig;
//        mat_type = mat_type_orig;

//        //tests
//        useCPlus = true;
//        CvMat * temp;

//        //C++ tests
//        useCPlus = true;

//        camera_mat = alvision.cvarrToMat(&_camera_mat_orig);
//        distortion_coeffs = alvision.cvarrToMat(&_distortion_coeffs_orig);
//        new_camera_mat = alvision.cvarrToMat(&_new_camera_mat_orig);
//        R = alvision.cvarrToMat(&_R_orig);
//        mapx = alvision.cvarrToMat(&_mapx_orig);
//        mapy = alvision.cvarrToMat(&_mapy_orig);


//        mat_type = CV_64F;
//        errcount += run_test_case(CV_StsAssert, "Invalid map matrix type");
//        mat_type = mat_type_orig;

//        temp = cvCreateMat(3, 2, CV_32FC1);
//        camera_mat = alvision.cvarrToMat(temp);
//        errcount += run_test_case(CV_StsAssert, "Invalid camera data matrix size");
//        camera_mat = alvision.cvarrToMat(&_camera_mat_orig);
//        cvReleaseMat(&temp);

//        temp = cvCreateMat(4, 3, CV_32FC1);
//        R = alvision.cvarrToMat(temp);
//        errcount += run_test_case(CV_StsAssert, "Invalid R data matrix size");
//        R = alvision.cvarrToMat(&_R_orig);
//        cvReleaseMat(&temp);

//        temp = cvCreateMat(6, 1, CV_32FC1);
//        distortion_coeffs = alvision.cvarrToMat(temp);
//        errcount += run_test_case(CV_StsAssert, "Invalid distortion coefficients data matrix size");
//        distortion_coeffs = alvision.cvarrToMat(&_distortion_coeffs_orig);
//        cvReleaseMat(&temp);

//        //------------
//        delete [] arr_mapx;
//        delete [] arr_mapy;
//        this.ts.set_failed_test_info(errcount > 0 ? cvtest ::TS::FAIL_BAD_ARG_CHECK : alvision.cvtest.FailureCode.OK);
//    }
//    protected run_func() : void{
//    if (useCPlus) {
//        alvision.initUndistortRectifyMap(camera_mat, distortion_coeffs, R, new_camera_mat, img_size, mat_type, mapx, mapy);
//    }
//    else {
//        cvInitUndistortRectifyMap(_camera_mat, _distortion_coeffs, matR, _new_camera_mat, _mapx, _mapy);
//    }
//}

//private:
//    //common
//    alvision.Size img_size;
//    bool useCPlus;

//    //C
//    CvMat* _camera_mat;
//    CvMat* matR;
//    CvMat* _new_camera_mat;
//    CvMat* _distortion_coeffs;
//    CvMat* _mapx;
//    CvMat* _mapy;


//    //C++
//    alvision.Mat camera_mat;
//    alvision.Mat R;
//    alvision.Mat new_camera_mat;
//    alvision.Mat distortion_coeffs;
//    alvision.Mat mapx;
//    alvision.Mat mapy;
//    int mat_type;

//};



////=========
//class CV_UndistortBadArgTest extends alvision.cvtest.BadArgTest
//{
//    constructor() {
//        super();

//        useCPlus = false;
//        _camera_mat = _new_camera_mat = _distortion_coeffs = _src = _dst = NULL;

//    }
//    protected run(int): void {
//        int errcount = 0;
//        //initializing
//        img_size.width = 800;
//        img_size.height = 600;
//        double cam[9] = { 150.f, 0.f, img_size.width / 2.f, 0, 300.f, img_size.height / 2.f, 0.f, 0.f, 1.f};
//        double dist[4] = { 0.01,0.02,0.001,0.0005};
//        float * arr_src = new float[img_size.width * img_size.height];
//        float * arr_dst = new float[img_size.width * img_size.height];
//        double arr_new_camera_mat[9] = { 155.f, 0.f, img_size.width / 2.f+img_size.width / 50.f, 0, 310.f, img_size.height / 2.f+img_size.height / 50.f, 0.f, 0.f, 1.f};

//        CvMat _camera_mat_orig = cvMat(3, 3, CV_64F, cam);
//        CvMat _distortion_coeffs_orig = cvMat(1, 4, CV_64F, dist);
//        CvMat _new_camera_mat_orig = cvMat(3, 3, CV_64F, arr_new_camera_mat);
//        CvMat _src_orig = cvMat(img_size.height, img_size.width, CV_32FC1, arr_src);
//        CvMat _dst_orig = cvMat(img_size.height, img_size.width, CV_32FC1, arr_dst);

//        _camera_mat = &_camera_mat_orig;
//        _distortion_coeffs = &_distortion_coeffs_orig;
//        _new_camera_mat = &_new_camera_mat_orig;
//        _src = &_src_orig;
//        _dst = &_dst_orig;

//        //tests
//        useCPlus = true;
//        CvMat * temp;
//        CvMat * temp1;

//        //C tests
//        useCPlus = false;

//        temp = cvCreateMat(800, 600, CV_32F);
//        temp1 = cvCreateMat(800, 601, CV_32F);
//        _src = temp;
//        _dst = temp1;
//        errcount += run_test_case(CV_StsAssert, "Input and output data matrix sizes mismatch");
//        _src = &_src_orig;
//        _dst = &_dst_orig;
//        cvReleaseMat(&temp);
//        cvReleaseMat(&temp1);

//        temp = cvCreateMat(800, 600, CV_32F);
//        temp1 = cvCreateMat(800, 600, CV_64F);
//        _src = temp;
//        _dst = temp1;
//        errcount += run_test_case(CV_StsAssert, "Input and output data matrix types mismatch");
//        _src = &_src_orig;
//        _dst = &_dst_orig;
//        cvReleaseMat(&temp);
//        cvReleaseMat(&temp1);

//        //C++ tests
//        useCPlus = true;

//        camera_mat = alvision.cvarrToMat(&_camera_mat_orig);
//        distortion_coeffs = alvision.cvarrToMat(&_distortion_coeffs_orig);
//        new_camera_mat = alvision.cvarrToMat(&_new_camera_mat_orig);
//        src = alvision.cvarrToMat(&_src_orig);
//        dst = alvision.cvarrToMat(&_dst_orig);

//        //------------
//        delete [] arr_src;
//        delete [] arr_dst;
//        this.ts.set_failed_test_info(errcount > 0 ? cvtest ::TS::FAIL_BAD_ARG_CHECK : alvision.cvtest.FailureCode.OK);
//    }
//    protected run_func(): void {
//        if (useCPlus) {
//            alvision.undistort(src, dst, camera_mat, distortion_coeffs, new_camera_mat);
//        }
//        else {
//            cvUndistort2(_src, _dst, _camera_mat, _distortion_coeffs, _new_camera_mat);
//        }
//    }


//    //common
//    private img_size: alvision.Size;
//    private useCPlus: boolean;

//    //C
//    CvMat* _camera_mat;
//    CvMat* _new_camera_mat;
//    CvMat* _distortion_coeffs;
//    CvMat* _src;
//    CvMat* _dst;


//    //C++
//    alvision.Mat camera_mat;
//    alvision.Mat new_camera_mat;
//    alvision.Mat distortion_coeffs;
//    alvision.Mat src;
//    alvision.Mat dst;

//};


//alvision.cvtest.TEST('Calib3d_UndistortPoints', 'badarg', () => { var test = new CV_UndistortPointsBadArgTest(); test.safe_run(); });
//alvision.cvtest.TEST('Calib3d_InitUndistortRectifyMap', 'badarg', () => { var test = new CV_InitUndistortRectifyMapBadArgTest(); test.safe_run(); });
//alvision.cvtest.TEST('Calib3d_Undistort', 'badarg', () => { var test = new CV_UndistortBadArgTest(); test.safe_run(); });

///* End of file. */
