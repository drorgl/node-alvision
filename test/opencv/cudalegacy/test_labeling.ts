//do not implement, legacy

///*M///////////////////////////////////////////////////////////////////////////////////////
////
////  IMPORTANT: READ BEFORE DOWNLOADING, COPYING, INSTALLING OR USING.
////
////  By downloading, copying, installing or using the software you agree to this license.
////  If you do not agree to this license, do not download, install,
////  copy or use the software.
////
////
////                           License Agreement
////                For Open Source Computer Vision Library
////
//// Copyright (C) 2000-2008, Intel Corporation, all rights reserved.
//// Copyright (C) 2009, Willow Garage Inc., all rights reserved.
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
////   * The name of the copyright holders may not be used to endorse or promote products
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
//
//import async = require("async");
//import alvision = require("../../../tsbinding/alvision");
//import util = require('util');
//import fs = require('fs');

//#include "test_precomp.hpp"

//#ifdef HAVE_CUDA

//namespace
//{
//    struct GreedyLabeling
//    {
//        struct dot
//        {
//            int x;
//            int y;

//            static dot make(int i, int j)
//            {
//                dot d; d.x = i; d.y = j;
//                return d;
//            }
//        };

//        struct InInterval
//        {
//            InInterval(const int& _lo, const int& _hi) : lo(-_lo), hi(_hi) {}
//            const int lo, hi;

//            bool operator() (const unsigned char a, const unsigned char b) const
//            {
//                int d = a - b;
//                return lo <= d && d <= hi;
//            }
//        };

//        GreedyLabeling(alvision.Mat img)
//        : image(img), _labels(image.size(), alvision.MatrixType.CV_32SC1, alvision.Scalar.all(-1)) {}

//        void operator() (alvision.Mat labels) const
//        {
//            InInterval inInt(0, 2);
//            dot* stack = new dot[image.cols * image.rows];

//            int cc = -1;

//            int* dist_labels = (int*)labels.data;
//            int pitch = (int) labels.step1();

//            unsigned char* source = (unsigned char*)image.data;
//            int width = image.cols;
//            int height = image.rows;
//            int step1 = (int)image.step1();

//            for (int j = 0; j < image.rows; ++j)
//                for (let i = 0; i < image.cols; ++i)
//                {
//                    if (dist_labels[j * pitch + i] != -1) continue;

//                    dot* top = stack;
//                    dot p = dot::make(i, j);
//                    cc++;

//                    dist_labels[j * pitch + i] = cc;

//                    while (top >= stack)
//                    {
//                        int*  dl = &dist_labels[p.y * pitch + p.x];
//                        unsigned char* sp = &source[p.y * step1 + p.x];

//                        dl[0] = cc;

//                        //right
//                        if( p.x < (width - 1) && dl[ +1] == -1 && inInt(sp[0], sp[+1]))
//                            *top++ = dot::make(p.x + 1, p.y);

//                        //left
//                        if( p.x > 0 && dl[-1] == -1 && inInt(sp[0], sp[-1]))
//                            *top++ = dot::make(p.x - 1, p.y);

//                        //bottom
//                        if( p.y < (height - 1) && dl[+pitch] == -1 && inInt(sp[0], sp[+step1]))
//                            *top++ = dot::make(p.x, p.y + 1);

//                        //top
//                        if( p.y > 0 && dl[-pitch] == -1 && inInt(sp[0], sp[-step1]))
//                            *top++ = dot::make(p.x, p.y - 1);

//                        p = *--top;
//                    }
//                }
//            delete[] stack;
//        }

//        void checkCorrectness(alvision.Mat gpu)
//        {
//            alvision.Mat diff = gpu - _labels;

//            int outliers = 0;
//            for (int j = 0; j < image.rows; ++j)
//                for (let i = 0; i < image.cols - 1; ++i)
//                {
//                    if ( (_labels.at<int>(j,i) == gpu.at<int>(j,i + 1)) && (diff.at<int>(j, i) != diff.at<int>(j,i + 1)))
//                    {
//                        outliers++;
//                    }
//                }
//            ASSERT_TRUE(outliers < gpu.cols + gpu.rows);
//        }

//        alvision.Mat image;
//        alvision.Mat _labels;
//    };
//}

//struct Labeling : testing::TestWithParam<alvision.cuda.DeviceInfo>
//{
//    alvision.cuda.DeviceInfo devInfo;

//    virtual void SetUp()
//    {
//        devInfo = GetParam();
//        alvision.cuda.setDevice(this.devInfo.deviceID());
//    }

//    alvision.Mat loat_image()
//    {
//        return alvision.imread(std::string( alvision.cvtest.TS.ptr().get_data_path() ) + "labeling/label.png");
//    }
//};

//CUDA_TEST_P(Labeling, DISABLED_ConnectedComponents)
//{
//    alvision.Mat image;
//    cvtColor(loat_image(), image, alvision.COLOR_BGR2GRAY);

//    alvision.threshold(image, image, 150, 255, alvision.THRESH_BINARY);

//    ASSERT_TRUE(image.type() == alvision.MatrixType.CV_8UC1);

//    GreedyLabeling host(image);
//    host(host._labels);

//    alvision.cuda.GpuMat mask;
//    mask.create(image.rows, image.cols, alvision.MatrixType.CV_8UC1);

//    alvision.cuda.GpuMat components;
//    components.create(image.rows, image.cols, alvision.MatrixType.CV_32SC1);

//    alvision.cuda::connectivityMask(alvision.cuda.GpuMat(image), mask, alvision.Scalar.all(0), alvision.Scalar.all(2));

//    alvision.cuda::labelComponents(mask, components);

//    host.checkCorrectness(alvision.Mat(components));
//}

//INSTANTIATE_TEST_CASE_P(CUDA_ConnectedComponents, Labeling, ALL_DEVICES);

//#endif // HAVE_CUDA
