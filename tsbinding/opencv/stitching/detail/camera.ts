/*M///////////////////////////////////////////////////////////////////////////////////////
//
//  IMPORTANT: READ BEFORE DOWNLOADING, COPYING, INSTALLING OR USING.
//
//  By downloading, copying, installing or using the software you agree to this license.
//  If you do not agree to this license, do not download, install,
//  copy or use the software.
//
//
//                          License Agreement
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

import alvision_module from "../../../bindings"

import * as _mat from './../../mat'
import * as _matx from './../../Matx'
//import * as _st from './Constants'
import * as _st from './../../static'
import * as _types from './../../types'
import * as _core from './../../core'
import * as _base from './../../base'
import * as _affine from './../../Affine'

//#ifndef __OPENCV_STITCHING_CAMERA_HPP__
//#define __OPENCV_STITCHING_CAMERA_HPP__
//
//#include "opencv2/core.hpp"
//
//namespace cv {
export namespace detail_camera {

//! @addtogroup stitching
//! @{

/** @brief Describes camera parameters.

@note Translation is assumed to be zero during the whole stitching pipeline. :
 */
class CameraParams
{
//    CameraParams();
//    CameraParams(const CameraParams& other);
//    const CameraParams& operator =(const CameraParams& other);
//    Mat K() const;
//
//    double focal; // Focal length
//    double aspect; // Aspect ratio
//    double ppx; // Principal point X
//    double ppy; // Principal point Y
//    Mat R; // Rotation
//    Mat t; // Translation
};

//! @}

} // namespace detail.camera
//} // namespace cv

//#endif // #ifndef __OPENCV_STITCHING_CAMERA_HPP__
