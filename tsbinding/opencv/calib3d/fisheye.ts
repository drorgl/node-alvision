import alvision_module from "../../bindings";

import * as _mat from './../mat'
import * as _matx from './../Matx'
//import * as _st from './Constants'
import * as _st from './../static'
import * as _types from './../types'
import * as _core from './../core'
import * as _base from './../base'
import * as _affine from './../Affine'
import * as _features2d from './../features2d'

//#ifndef FISHEYE_INTERNAL_H
//#define FISHEYE_INTERNAL_H
//#include "precomp.hpp"

//namespace cv { namespace internal {

interface IntrinsicParamsStatic {
    new (): IntrinsicParams;
}

export interface IntrinsicParams {
    f: _matx.Vec2d;
    c: _matx.Vec2d;
    k: _matx.Vec4d;
    alpha: _st.double;
    isEstimate: Array<_st.uchar>;

    //constructor() {
    //}
    //constructor(f_: _matx.Vecd, c_: _matx.Vecd, k_: _matx.Vecd, alpha_: _st.double = 0) {
    //    this.f = f_;
    //    this.c = c_;
    //    this.k = k_;
    //    this.alpha = alpha_;
    //}
    //IntrinsicParams operator+(const Mat& a);
    //IntrinsicParams& operator =(const Mat& a);
    Init(f_: _matx.Vec2d, c_: _matx.Vec2d, k_?: _matx.Vec4d /*= new _matx.Vecd(0, 0, 0, 0)*/, alpha_?: _st.double /*= 0*/): void /*{
        this.f = f_;
        this.c = c_;
        this.k = k_;
        this.alpha = alpha_;
    }*/
};

export var IntrinsicParams: IntrinsicParamsStatic = alvision_module.IntrinIntrinsicParams;

//void projectPoints(cv::InputArray objectPoints, cv::OutputArray imagePoints,
//    cv::InputArray _rvec, cv::InputArray _tvec,
//                   const IntrinsicParams& param, cv::OutputArray jacobian);
//
//void ComputeExtrinsicRefine(const Mat& imagePoints, const Mat& objectPoints, Mat& rvec,
//    Mat&  tvec, Mat& J, const int MaxIter,
//const IntrinsicParams& param, const double thresh_cond);

interface IComputeHomography {
    (m: _mat.Mat, M: _mat.Mat ): _mat.Mat;
}
//CV_EXPORTS Mat ComputeHomography(Mat m, Mat M);
export var ComputeHomography: IComputeHomography = alvision_module.ComputeHomography;

interface INormalizePixels{
    (imagePoints: _mat.Mat, param: IntrinsicParams ): _mat.Mat;
}
//CV_EXPORTS Mat NormalizePixels(const Mat& imagePoints, const IntrinsicParams& param);
export var NormalizePixels: INormalizePixels = alvision_module.NormalizePixels;

//void InitExtrinsics(const Mat& _imagePoints, const Mat& _objectPoints, const IntrinsicParams& param, Mat& omckk, Mat& Tckk);
//
//void CalibrateExtrinsics(InputArrayOfArrays objectPoints, InputArrayOfArrays imagePoints,
//                         const IntrinsicParams& param, const int check_cond,
//const double thresh_cond, InputOutputArray omc, InputOutputArray Tc);
//
//void ComputeJacobians(InputArrayOfArrays objectPoints, InputArrayOfArrays imagePoints,
//                      const IntrinsicParams& param, InputArray omc, InputArray Tc,
//const int& check_cond, const double& thresh_cond, Mat& JJ2_inv, Mat& ex3);

interface IEstimateUncertainties{
    (objectPoints: _st.InputArrayOfArrays, imagePoints: _st.InputArrayOfArrays ,
        params: IntrinsicParams, omc: _st.InputArray, Tc: _st.InputArray ,
        errors: IntrinsicParams , std_err: _matx.Vec2d, thresh_cond: _st.double, check_cond: _st.int,cb:( rms: _st.double)=>void ) : void;
}
export var EstimateUncertainties: IEstimateUncertainties = alvision_module.EstimateUncertainties;

//CV_EXPORTS void  EstimateUncertainties(InputArrayOfArrays objectPoints, InputArrayOfArrays imagePoints,
//                           const IntrinsicParams& params, InputArray omc, InputArray Tc,
//    IntrinsicParams& errors, Vec2d& std_err, double thresh_cond, int check_cond, double& rms);

//void dAB(cv::InputArray A, InputArray B, OutputArray dABdA, OutputArray dABdB);
//
//void JRodriguesMatlab(const Mat& src, Mat& dst);
//
//void compose_motion(InputArray _om1, InputArray _T1, InputArray _om2, InputArray _T2,
//    Mat & om3, Mat & T3, Mat & dom3dom1, Mat & dom3dT1, Mat & dom3dom2,
//    Mat & dom3dT2, Mat & dT3dom1, Mat & dT3dT1, Mat & dT3dom2, Mat & dT3dT2);
//
//double median(const Mat& row);
//
//Vec3d median3d(InputArray m);

//}}
//
//#endif
