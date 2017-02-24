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

import alvision_module from "../../bindings";

//import * as _constants from './Constants'
import * as _st from './../static';
import * as _mat from './../Mat';
import * as _types from './../Types';
import * as _core from './../Core';
import * as _base from './../Base';
import * as _cuda from './../cuda';
import * as _persistence from './../persistence';

//#ifndef __OPENCV_SUPERRES_INPUT_ARRAY_UTILITY_HPP__
//#define __OPENCV_SUPERRES_INPUT_ARRAY_UTILITY_HPP__
//
//#include "opencv2/core.hpp"
//#include "opencv2/core/cuda.hpp"
//
//namespace cv
//{
//export namespace superres_input_array_utility {
    interface IarrGetMat {
        (arr: _st.InputArray, buf: _mat.Mat): _mat.Mat;
    }
    export var arrGetMat: IarrGetMat = alvision_module.superres.arrGetMat;

    //Mat arrGetMat(InputArray arr, Mat& buf);

    interface IarrGetUMat {
        (arr: _st.InputArray, buf: _mat.UMat): _mat.UMat;
    }
    export var arrGetUMat: IarrGetUMat = alvision_module.superres.arrGetUMat;
    //UMat arrGetUMat(InputArray arr, UMat& buf);

    interface IarrGetGpuMat {
        (arr: _st.InputArray, buf: _cuda.GpuMat): _cuda.GpuMat;
    }
    export var arrGetGpuMat: IarrGetGpuMat = alvision_module.superres.arrGetGpuMat;
    //cuda::GpuMat arrGetGpuMat(InputArray arr, cuda::GpuMat& buf);
    //

    interface IarrCopy {
        (src: _st.InputArray, dst: _st.OutputArray ): void;
    }

    export var arrCopy: IarrCopy = alvision_module.superres.arrCopy;
        //void arrCopy(InputArray src, OutputArray dst);
        //

    interface IconvertToType {
        (src: _mat.Mat, type: _st.int, buf0: _mat.Mat, buf1: _mat.Mat): _mat.Mat;
        (src: _mat.UMat, type: _st.int, buf0: _mat.UMat, buf1: _mat.UMat): _mat.UMat;
        (src: _cuda.GpuMat, type: _st.int, buf0: _cuda.GpuMat, buf1: _cuda.GpuMat): _cuda.GpuMat;
    }

    export var convertToType: IconvertToType = alvision_module.superres.convertToType;
        //Mat convertToType(const Mat& src, int type, Mat& buf0, Mat& buf1);

    //interface IconvertToType {
    //    (src: _mat.UMat, type: _st.int, buf0: _mat.UMat, buf1: _mat.UMat): _mat.UMat;
    //}
    //
    //export var convertToType : IconvertToType = alvision_module.superres.convertToType;
    //    //UMat convertToType(const UMat& src, int type, UMat& buf0, UMat& buf1);
    //
    //interface IconvertToType {
    //    (src: _cuda.GpuMat, type: _st.int, buf0: _cuda.GpuMat, buf1: _cuda.GpuMat ): _cuda.GpuMat;
    //}
    //export var convertToType: IconvertToType = alvision_module.superres.convertToType;
        //cuda::GpuMat convertToType(const cuda::GpuMat& src, int type, cuda::GpuMat& buf0, cuda::GpuMat& buf1);
//    }
//}
//
//#endif // __OPENCV_SUPERRES_INPUT_ARRAY_UTILITY_HPP__
