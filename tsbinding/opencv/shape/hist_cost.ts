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
// Copyright (C) 2013, OpenCV Foundation, all rights reserved.
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

import * as _mat from './../mat'
import * as _matx from './../matx'
//import * as _st from './Constants'
import * as _st from './../static'
import * as _types from './../types'
import * as _core from './../core'
import * as _base from './../base'
import * as _affine from './../Affine'
import * as _features2d from './../features2d'

//#ifndef __OPENCV_HIST_COST_HPP__
//#define __OPENCV_HIST_COST_HPP__
//
//#include "opencv2/imgproc.hpp"
//
//namespace cv
//{

//! @addtogroup shape
//! @{

/** @brief Abstract base class for histogram cost algorithms.
 */
export interface HistogramCostExtractor extends _core.Algorithm
{
//    CV_WRAP virtual void buildCostMatrix(InputArray descriptors1, InputArray descriptors2, OutputArray costMatrix) = 0;
//
//    CV_WRAP virtual void setNDummies(int nDummies) = 0;
//    CV_WRAP virtual int getNDummies() const = 0;
//
//    CV_WRAP virtual void setDefaultCost(float defaultCost) = 0;
//    CV_WRAP virtual float getDefaultCost() const = 0;
};



/** @brief A norm based cost extraction. :
 */
interface NormHistogramCostExtractor extends HistogramCostExtractor
{
//public:
//    CV_WRAP virtual void setNormFlag(int flag) = 0;
//    CV_WRAP virtual int getNormFlag() const = 0;
};

interface IcreateNormHistogramCostExtractor {
    (flag?: _st.int /*= DIST_L2*/, nDummies?: _st.int  /*= 25*/, defaultCost?: _st.float  /*= 0.2f*/): HistogramCostExtractor;
}

export var createNormHistogramCostExtractor: IcreateNormHistogramCostExtractor = alvision_module.createNormHistogramCostExtractor;

//CV_EXPORTS_W Ptr<HistogramCostExtractor>
//    createNormHistogramCostExtractor(int flag=DIST_L2, int nDummies=25, float defaultCost=0.2f);

/** @brief An EMD based cost extraction. :
 */
interface EMDHistogramCostExtractor extends HistogramCostExtractor
{
//public:
//    CV_WRAP virtual void setNormFlag(int flag) = 0;
//    CV_WRAP virtual int getNormFlag() const = 0;
};

interface IcreateEMDHistogramCostExtractor {
    (flag?: _st.int /*= DIST_L2*/, nDummies?: _st.int  /*= 25*/, defaultCost?: _st.float  /*= 0.2f*/): HistogramCostExtractor;
}

export var createEMDHistogramCostExtractor: IcreateEMDHistogramCostExtractor = alvision_module.createEMDHistogramCostExtractor;

//CV_EXPORTS_W Ptr<HistogramCostExtractor>
//    createEMDHistogramCostExtractor(int flag=DIST_L2, int nDummies=25, float defaultCost=0.2f);

/** @brief An Chi based cost extraction. :
 */
interface ChiHistogramCostExtractor extends HistogramCostExtractor
{};

interface IcreateChiHistogramCostExtractor {
    (nDummies?: _st.int  /*= 25*/, defaultCost?: _st.float  /*= 0.2f*/): HistogramCostExtractor;
}

export var createChiHistogramCostExtractor: IcreateChiHistogramCostExtractor = alvision_module.createChiHistogramCostExtractor;

//CV_EXPORTS_W Ptr<HistogramCostExtractor> createChiHistogramCostExtractor(int nDummies=25, float defaultCost=0.2f);

/** @brief An EMD-L1 based cost extraction. :
 */
interface EMDL1HistogramCostExtractor extends HistogramCostExtractor
{};

interface IcreateEMDL1HistogramCostExtractor {
    (nDummies?: _st.int  /*= 25*/, defaultCost?: _st.float  /*= 0.2f*/): HistogramCostExtractor;
}

export var createEMDL1HistogramCostExtractor: IcreateEMDL1HistogramCostExtractor = alvision_module.createEMDL1HistogramCostExtractor;

//CV_EXPORTS_W Ptr<HistogramCostExtractor>
//    createEMDL1HistogramCostExtractor(int nDummies=25, float defaultCost=0.2f);

//! @}

//} // cv
//#endif
//