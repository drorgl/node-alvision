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


//#include "test_precomp.hpp"

//using namespace cv;

namespace cvtest {
    enum CV_BilateralFilterTestEnum
        {
        MAX_WIDTH = 1920, MIN_WIDTH = 1,
        MAX_HEIGHT = 1080, MIN_HEIGHT = 1
    };

    class CV_BilateralFilterTest extends alvision.cvtest.BaseTest {
        private _sigma_color: alvision.double
        private _sigma_space: alvision.double

        private _src: alvision.Mat;
        private _parallel_dst: alvision.Mat;
        private _d: alvision.int;

        
        //public:
        

        constructor() {
            super();
            this._src = new alvision.Mat();
            this._parallel_dst = new alvision.Mat();
            this._d = 0;
            this.test_case_count = 1000;
        }


        protected run_func(): void {
            alvision.bilateralFilter(this._src, this._parallel_dst, this._d, this._sigma_color, this._sigma_space);
        }

        static types: Array<alvision.int> = [alvision.MatrixType.CV_32FC1, alvision.MatrixType.CV_32FC3, alvision.MatrixType.CV_8UC1, alvision.MatrixType.CV_8UC3];

        protected prepare_test_case(test_case_index: alvision.int): alvision.int {
           
            var rng = this.ts.get_rng();
            var size = new alvision.Size(this.getRandInt(rng, CV_BilateralFilterTestEnum.MIN_WIDTH, CV_BilateralFilterTestEnum.MAX_WIDTH), this.getRandInt(rng, CV_BilateralFilterTestEnum.MIN_HEIGHT, CV_BilateralFilterTestEnum.MAX_HEIGHT));
            var type = CV_BilateralFilterTest.types[rng.uniform(0, CV_BilateralFilterTest.types.length - 1).valueOf()];// (sizeof(types) / sizeof(types[0]))];

            this._d = rng.uniform(0., 1.) > 0.5 ? 5 : 3;

            this._src.create(size, type);

            rng.fill(this._src, alvision.DistType.UNIFORM, 0, 256);

            this._sigma_color = this._sigma_space = 1.;

            return 1;
        }

        private static eps: alvision.double = 4;

        protected validate_test_results(test_case_index: alvision.int): alvision.int {
            

            var reference_dst = new alvision.Mat();
            var reference_src = new alvision.Mat();
            if (this._src.depth() == alvision.MatrixType.CV_32F)
                this.reference_bilateral_filter(this._src, reference_dst, this._d, this._sigma_color, this._sigma_space);
            else {
                var type = this._src.type();
                this._src.convertTo(reference_src, alvision.MatrixType.CV_32F);
                this.reference_bilateral_filter(reference_src, reference_dst, this._d, this._sigma_color, this._sigma_space);
                reference_dst.convertTo(reference_dst, type);
            }

            var e: alvision.double = alvision.cvtest.norm(reference_dst, this._parallel_dst, alvision.NormTypes.NORM_L2);
            if (e > CV_BilateralFilterTest.eps) {
                this.ts.printf(alvision.cvtest.TSConstants.CONSOLE, "actual error: %g, expected: %g", e, CV_BilateralFilterTest.eps);
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
            }
            else
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);

            return super.validate_test_results(test_case_index);
        }

        //private:
        //void reference_bilateral_filter(const Mat& src, Mat& dst, int d, double sigma_color,
        //double sigma_space, int borderType = BORDER_DEFAULT);

        private reference_bilateral_filter(src: alvision.Mat, dst: alvision.Mat, d: alvision.int,
            sigma_color: alvision.double, sigma_space: alvision.double, borderType?: alvision.BorderTypes): void {

            var cn = src.channels(); //int
            var i, j, k, maxk, radius;
            var minValSrc : alvision.double = -1, maxValSrc : alvision.double = 1;
            var kExpNumBinsPerChannel : alvision.int = 1 << 12;
            var kExpNumBins : alvision.int = 0;
            var lastExpVal: alvision.float  = 1.0;
            var len, scale_index; //            float 

            var size = src.size();


            dst.create(size, src.type());

            alvision.CV_Assert(()=>(src.type() == alvision.MatrixType.CV_32FC1 || src.type() == alvision.MatrixType.CV_32FC3) &&
                            src.type() == dst.type() && src.size() == dst.size() &&
                            src.data() != dst.data());

                       if (sigma_color <= 0)
                           sigma_color = 1;
                       if (sigma_space <= 0)
                           sigma_space = 1;

                        var gauss_space_coeff : alvision.double = -0.5 / (sigma_space.valueOf() * sigma_space.valueOf());
                        var gauss_color_coeff : alvision.double = -0.5 / (sigma_color.valueOf() * sigma_color.valueOf());

                        if (d <= 0)
                            radius = Math.round(sigma_space.valueOf() * 1.5); //cvRound
                        else
                            radius = d.valueOf() / 2;
                        radius = Math.max(radius, 1);
                        d = radius * 2 + 1;
                        // compute the min/max range for the input image (even if multichannel)

                        alvision.minMaxLoc(src.reshape(1), (minVal, maxVal, minLoc, maxLoc) => {
                            minValSrc = minVal;
                            maxValSrc = maxVal;
                        });
                        if (Math.abs(minValSrc.valueOf() - maxValSrc.valueOf()) < alvision.FLT_EPSILON)
                        {
                            src.copyTo(dst);
                            return;
                        }

                        // temporary copy of the image with borders for easy processing
                        var temp = new alvision.Mat();
                        
                        alvision.copyMakeBorder(src, temp, radius, radius, radius, radius, borderType);
                        alvision.patchNaNs(temp);

                        // allocate lookup tables
                        var space_weight: Array<alvision.float> = [(d.valueOf() * d.valueOf())];
                        var space_ofs: Array<alvision.int> = [(d.valueOf() * d.valueOf())];
                        //float * space_weight = &_space_weight[0];
                        //int * space_ofs = &_space_ofs[0];

                        // assign a length which is slightly more than needed
                        len = (maxValSrc.valueOf() - minValSrc.valueOf()) * cn.valueOf();
                        kExpNumBins = kExpNumBinsPerChannel.valueOf() * cn.valueOf();
            
                        var expLUT: Array<alvision.float> = new Array(kExpNumBins.valueOf() + 2);
                        //vector < float > _expLUT(kExpNumBins + 2);
                
                        //float * expLUT = &_expLUT[0];

                        scale_index = kExpNumBins.valueOf() / len;

                        // initialize the exp LUT
                        for (i = 0; i < kExpNumBins.valueOf() + 2; i++) {
                            if (lastExpVal > 0.0 )
                            {
                                var val: alvision.double = i / scale_index;
                                //double val = i / scale_index;
                                expLUT[i] = Math.exp(val.valueOf() * val.valueOf() * gauss_color_coeff.valueOf());
                                //expLUT[i] = (float)std::exp(val * val * gauss_color_coeff);
                                lastExpVal = expLUT[i];
                            }
                        else{
                                expLUT[i] = 0.0;
                            }
                        }

                // initialize space-related bilateral filter coefficients
                        for (i = -radius, maxk = 0; i <= radius; i++)
                            for (j = -radius; j <= radius; j++) {
                                var r = Math.sqrt(i * i + j * j);
                                //double r = std::sqrt((double)i* i + (double)j* j);
                                if (r > radius)
                                    continue;
                                
                                space_weight[maxk] = Math.exp(r * r * gauss_space_coeff.valueOf());
                                space_ofs[maxk++] =  (i * (temp.step /*/ sizeof(float)*/) + j * cn.valueOf());
                            }

                        for (i = 0; i < size.height; i++) {

                            var stepArray = temp.ptr<alvision.float>(i + radius.valueOf());
                            var sptr = stepArray.slice(radius * cn.valueOf());
                            //var sptr = temp.ptr<alvision.float>(i + radius.valueOf()) + radius * cn.valueOf();

                            var dptr = dst.ptr<alvision.float>(i);
                    //float * dptr = dst.ptr<float>(i);

                    if (cn == 1) {
                        for (j = 0; j < size.width; j++) {
                            var sum: alvision.float = 0;
                            var wsum: alvision.float = 0;
                            var val0: alvision.float = sptr[j];
                            //float sum = 0, wsum = 0;
                            //float val0 = sptr[j];
                            for (k = 0; k < maxk; k++) {
                                var val: alvision.float = sptr[j + space_ofs[k]];
                                var alpha: alvision.float = Math.abs(val.valueOf() - val0.valueOf()) * scale_index;
                                //float val = sptr[j + space_ofs[k]];
                                //float alpha = (float)(std::abs(val - val0) * scale_index);
                                var idx: alvision.int = Math.floor(alpha.valueOf());
                                //int idx = cvFloor(alpha);
                                
                                alpha = alpha.valueOf() - idx.valueOf();
                                var w: alvision.float = space_weight[k].valueOf() * (expLUT[idx.valueOf()].valueOf() + alpha.valueOf() * (expLUT[idx.valueOf() + 1].valueOf() - expLUT[idx.valueOf()].valueOf()));
                                sum = sum.valueOf() +( val.valueOf() * w.valueOf());
                                wsum = wsum.valueOf() + w.valueOf();
                            }
                            dptr[j] = (sum.valueOf() / wsum.valueOf());
                        }
                    }
                    else {
                        alvision.CV_Assert(()=>cn == 3);
                        for (j = 0; j < size.width.valueOf() * 3; j += 3) {
                            var sum_b: alvision.float = 0;
                            var sum_g: alvision.float = 0;
                            var sum_r: alvision.float = 0;
                            var wsum: alvision.float = 0;

                            //float sum_b = 0, sum_g = 0, sum_r = 0, wsum = 0;
                            //float b0 = sptr[j], g0 = sptr[j + 1], r0 = sptr[j + 2];

                            var b0: alvision.float = sptr[j];
                            var g0: alvision.float = sptr[j + 1];
                            var r0 : alvision.float = sptr[j + 2];


                            for (k = 0; k < maxk; k++) {

                                var sptr_k = stepArray.slice((radius * cn.valueOf()) + j + space_ofs[k]);
                                //const float* sptr_k = sptr + j + space_ofs[k];


                                var b: alvision.float = sptr_k[0];
                                var g: alvision.float = sptr_k[1];
                                var r: alvision.float = sptr_k[2];

                                var alpha: alvision.float = ((Math.abs(b.valueOf() - b0.valueOf())
                                    + Math.abs(g.valueOf() - g0.valueOf())
                                    + Math.abs(r.valueOf() - r0.valueOf()))
                                    * scale_index);

                                var idx: alvision.int = Math.floor(alpha.valueOf());
                                alpha = alpha.valueOf() - idx.valueOf();
                                var w : alvision.float   = space_weight[k].valueOf() * (expLUT[idx.valueOf()].valueOf() + alpha.valueOf() * (expLUT[idx.valueOf() + 1].valueOf() - expLUT[idx.valueOf()].valueOf()));
                                sum_b = sum_b.valueOf() + b.valueOf() * w.valueOf();
                                sum_g = sum_g.valueOf() + g.valueOf() * w.valueOf();
                                sum_r = sum_r.valueOf() + r.valueOf() * w.valueOf();
                                wsum = wsum.valueOf()   + w.valueOf();
                            }1
                            wsum = 1.0/  wsum.valueOf();
                            b0 = sum_b.valueOf() * wsum.valueOf();
                            g0 = sum_g.valueOf() * wsum.valueOf();
                            r0 = sum_r.valueOf() * wsum.valueOf();
                            dptr[j] = b0; dptr[j + 1] = g0; dptr[j + 2] = r0;
                        }
                    }
                }
        }


            private getRandInt(rng: alvision.RNG, min_value: alvision.int, max_value: alvision.int): alvision.int {
                var rand_value: alvision.double = rng.uniform(Math.log(min_value.valueOf()), Math.log(max_value.valueOf() + 1));
                return Math.round(Math.exp(rand_value.valueOf()));
            }

            
    };

   

    

    

  

   

    

    alvision.cvtest.TEST('Imgproc_BilateralFilter', 'accuracy', () => {
        var test = new CV_BilateralFilterTest();
        test.safe_run(0);
    });

} // end of namespace cvtest
