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
//import alvision_module from "../../../bindings"

import * as _mat from './../../mat'
import * as _matx from './../../Matx'
//import * as _st from './Constants'
import * as _st from './../../static'
import * as _types from './../../types'
import * as _core from './../../core'
import * as _base from './../../base'
import * as _affine from './../../Affine'

//#ifndef __OPENCV_STITCHING_BLENDERS_HPP__
//#define __OPENCV_STITCHING_BLENDERS_HPP__
//
//#if defined(NO)
//#  warning Detected Apple 'NO' macro definition, it can cause build conflicts. Please, include this header before any Apple headers.
//#endif
//
//#include "opencv2/core.hpp"
//
//namespace cv {
export namespace detail_blenders {

    //! @addtogroup stitching_blend
    //! @{

    /** @brief Base class for all blenders.
    
    Simple blender which puts one image over another
    */
    interface Blender {
        //public:
        //    virtual ~Blender() {}
        //
        //    enum { NO, FEATHER, MULTI_BAND };
        //    static Ptr<Blender> createDefault(int type, bool try_gpu = false);
        //
            /** @brief Prepares the blender for blending.
        
            @param corners Source images top-left corners
            @param sizes Source image sizes
             */
        prepare(corners: Array<_types.Point>, sizes : Array<_types.Size>): void;
            /** @overload */
        prepare(dst_roi: _types.Rect ): void;
            /** @brief Processes the image.
        
            @param img Source image
            @param mask Source image mask
            @param tl Source image top-left corners
             */
        feed(img: _st.InputArray, mask: _st.InputArray , tl : _types.Point): void;
            /** @brief Blends and returns the final pano.
        
            @param dst Final pano
            @param dst_mask Final pano mask
             */
        blend(dst: _st.InputOutputArray, dst_mask: _st.InputOutputArray ): void;
        //
        //protected:
        //    UMat dst_, dst_mask_;
        //    Rect dst_roi_;
    };

    /** @brief Simple blender which mixes images at its borders.
     */
    interface FeatherBlender extends Blender {
        //public:
        //    FeatherBlender(float sharpness = 0.02f);
        //
        //    float sharpness() const { return sharpness_; }
        //    void setSharpness(float val) { sharpness_ = val; }
        //
        //    void prepare(Rect dst_roi);
        //    void feed(InputArray img, InputArray mask, Point tl);
        //    void blend(InputOutputArray dst, InputOutputArray dst_mask);
        //
        //    //! Creates weight maps for fixed set of source images by their masks and top-left corners.
        //    //! Final image can be obtained by simple weighting of the source images.
        //    Rect createWeightMaps(const std::vector<UMat> &masks, const std::vector<Point> &corners,
        //                          std::vector<UMat> &weight_maps);
        //
        //private:
        //    float sharpness_;
        //    UMat weight_map_;
        //    UMat dst_weight_map_;
    };

    //inline FeatherBlender::FeatherBlender(float _sharpness) { setSharpness(_sharpness); }

    /** @brief Blender which uses multi-band blending algorithm (see @cite BA83).
     */
    interface MultiBandBlenderStatic {
        new (try_gpu?: boolean /* = false*/, num_bands?: _st.int /* = 5*/, weight_type?: _st.int /* = CV_32F*/): MultiBandBlender;
    }

    interface MultiBandBlender extends Blender {
        //public:
        
        //
        //    int numBands() const { return actual_num_bands_; }
        //    void setNumBands(int val) { actual_num_bands_ = val; }
        //
        //    void prepare(Rect dst_roi);
        //    void feed(InputArray img, InputArray mask, Point tl);
        //    void blend(InputOutputArray dst, InputOutputArray dst_mask);
        //
        //private:
        //    int actual_num_bands_, num_bands_;
        //    std::vector<UMat> dst_pyr_laplace_;
        //    std::vector<UMat> dst_band_weights_;
        //    Rect dst_roi_final_;
        //    bool can_use_gpu_;
        //    int weight_type_; //CV_32F or CV_16S
    };

    export var MultiBandBlender: MultiBandBlenderStatic = alvision_module.MultiBandBlender;


    //////////////////////////////////////////////////////////////////////////////
    // Auxiliary functions

    interface InormalizeUsingWeightMap {
        (weight: _st.InputArray, src: _st.InputOutputArray ): void;
    }

    export var normalizeUsingWeightMap: InormalizeUsingWeightMap = alvision_module.normalizeUsingWeightMap;

    //void CV_EXPORTS normalizeUsingWeightMap(InputArray weight, InputOutputArray src);

    interface IcreateWeightMap {
        (mask: _st.InputArray, sharpness: _st.float, weight: _st.InputOutputArray ): void;
    }
    export var createWeightMap: IcreateWeightMap = alvision_module.createWeightMap;

    //void CV_EXPORTS createWeightMap(InputArray mask, float sharpness, InputOutputArray weight);

    interface IcreateLaplacePyr {
        (img: _st.InputArray, num_levels: _st.int /*, cb:(pyr : Array<_mat.UMat>)=>void*/): void;
    }

    export var createLaplacePyr: IcreateLaplacePyr = alvision_module.createLaplacePyr;

    //void CV_EXPORTS createLaplacePyr(InputArray img, int num_levels, std::vector<UMat>& pyr);

    interface IcreateLaplacePyrGpu {
        (img: _st.InputArray, num_levels: _st.int /*,cb:(pyr : Array<_mat.UMat>)=>void*/): void;
    }
    export var createLaplacePyrGpu: IcreateLaplacePyrGpu = alvision_module.createLaplacePyrGpu;


    //void CV_EXPORTS createLaplacePyrGpu(InputArray img, int num_levels, std::vector<UMat>& pyr);

    // Restores source image

    interface IrestoreImageFromLaplacePyr {
        (pyr /*std::vector<UMat>& */): void;
    }

    export var restoreImageFromLaplacePyr: IrestoreImageFromLaplacePyr = alvision_module.restoreImageFromLaplacePyr;

    //void CV_EXPORTS restoreImageFromLaplacePyr(std::vector<UMat>& pyr);

    interface IrestoreImageFromLaplacePyrGpu {
        (pyr /*std::vector<UMat>&*/ ): void;
    }

    export var restoreImageFromLaplacePyrGpu: IrestoreImageFromLaplacePyrGpu = alvision_module.restoreImageFromLaplacePyrGpu;
//void CV_EXPORTS restoreImageFromLaplacePyrGpu(std::vector<UMat>& pyr);

//! @}

} // namespace detail.blenders
//} // namespace cv

//#endif // __OPENCV_STITCHING_BLENDERS_HPP__
