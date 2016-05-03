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

var alvision_module = require('../../../lib/bindings.js');

import * as _mat from './../mat'
import * as _matx from './../matx'
//import * as _st from './Constants'
import * as _st from './../static'
import * as _types from './../types'
import * as _core from './../core'
import * as _base from './../base'
import * as _affine from './../Affine'
import * as _features2d from './../features2d'

//#ifndef __OPENCV_STITCHING_WARPER_CREATORS_HPP__
//#define __OPENCV_STITCHING_WARPER_CREATORS_HPP__
//
//#include "opencv2/stitching/detail/warpers.hpp"

//namespace cv {

//! @addtogroup stitching_warp
//! @{

/** @brief Image warper factories base class.
 */
interface WarperCreator
{
//public:
//    virtual ~WarperCreator() {}
//    virtual Ptr<detail::RotationWarper> create(float scale) const = 0;
};

/** @brief Plane warper factory class.
  @sa detail::PlaneWarper
 */
interface PlaneWarper extends WarperCreator
{
//public:
//    Ptr<detail::RotationWarper> create(float scale) const { return makePtr<detail::PlaneWarper>(scale); }
};

/** @brief Cylindrical warper factory class.
@sa detail::CylindricalWarper
*/
interface CylindricalWarper extends WarperCreator
{
//public:
//    Ptr<detail::RotationWarper> create(float scale) const { return makePtr<detail::CylindricalWarper>(scale); }
};

/** @brief Spherical warper factory class */
interface SphericalWarper extends WarperCreator
{
//public:
//    Ptr<detail::RotationWarper> create(float scale) const { return makePtr<detail::SphericalWarper>(scale); }
};

interface FisheyeWarper extends WarperCreator
{
//public:
//    Ptr<detail::RotationWarper> create(float scale) const { return makePtr<detail::FisheyeWarper>(scale); }
};

interface StereographicWarper extends WarperCreator
{
//public:
//    Ptr<detail::RotationWarper> create(float scale) const { return makePtr<detail::StereographicWarper>(scale); }
};

interface CompressedRectilinearWarper extends WarperCreator
{
//    float a, b;
//public:
//    CompressedRectilinearWarper(float A = 1, float B = 1)
//    {
//        a = A; b = B;
//    }
//    Ptr<detail::RotationWarper> create(float scale) const { return makePtr<detail::CompressedRectilinearWarper>(scale, a, b); }
};

interface CompressedRectilinearPortraitWarper extends WarperCreator
{
//    float a, b;
//public:
//    CompressedRectilinearPortraitWarper(float A = 1, float B = 1)
//    {
//        a = A; b = B;
//    }
//    Ptr<detail::RotationWarper> create(float scale) const { return makePtr<detail::CompressedRectilinearPortraitWarper>(scale, a, b); }
};

interface PaniniWarper extends WarperCreator
{
//    float a, b;
//public:
//    PaniniWarper(float A = 1, float B = 1)
//    {
//        a = A; b = B;
//    }
//    Ptr<detail::RotationWarper> create(float scale) const { return makePtr<detail::PaniniWarper>(scale, a, b); }
};

interface PaniniPortraitWarper extends WarperCreator
{
//    float a, b;
//public:
//    PaniniPortraitWarper(float A = 1, float B = 1)
//    {
//        a = A; b = B;
//    }
//    Ptr<detail::RotationWarper> create(float scale) const { return makePtr<detail::PaniniPortraitWarper>(scale, a, b); }
};

interface MercatorWarper extends WarperCreator
{
//public:
//    Ptr<detail::RotationWarper> create(float scale) const { return makePtr<detail::MercatorWarper>(scale); }
};

interface TransverseMercatorWarper extends WarperCreator
{
//public:
//    Ptr<detail::RotationWarper> create(float scale) const { return makePtr<detail::TransverseMercatorWarper>(scale); }
};



//#ifdef HAVE_OPENCV_CUDAWARPING
interface PlaneWarperGpu extends WarperCreator
{
//public:
//    Ptr<detail::RotationWarper> create(float scale) const { return makePtr<detail::PlaneWarperGpu>(scale); }
};


interface CylindricalWarperGpu extends WarperCreator
{
//public:
//    Ptr<detail::RotationWarper> create(float scale) const { return makePtr<detail::CylindricalWarperGpu>(scale); }
};


interface SphericalWarperGpu extends WarperCreator
{
//public:
//    Ptr<detail::RotationWarper> create(float scale) const { return makePtr<detail::SphericalWarperGpu>(scale); }
};
//#endif

//! @} stitching_warp

//} // namespace cv

//#endif // __OPENCV_STITCHING_WARPER_CREATORS_HPP__
