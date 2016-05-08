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

#include "test_precomp.hpp"

#ifdef HAVE_CUDA

using namespace cvtest;

//#define DUMP

struct HOG : testing::TestWithParam<alvision.cuda::DeviceInfo>
{
    alvision.cuda::DeviceInfo devInfo;
    alvision.Ptr<alvision.cuda::HOG> hog;

#ifdef DUMP
    std::ofstream f;
#else
    std::ifstream f;
#endif

    int wins_per_img_x;
    int wins_per_img_y;
    int blocks_per_win_x;
    int blocks_per_win_y;
    int block_hist_size;

    virtual void SetUp()
    {
        devInfo = GetParam();

        alvision.cuda::setDevice(devInfo.deviceID());

        hog = alvision.cuda::HOG::create();
    }

#ifdef DUMP
    void dump(const Array<alvision.Point>& locations)
    {
        int nlocations = locations.size();
        f.write((char*)&nlocations, sizeof(nlocations));

        for (int i = 0; i < locations.size(); ++i)
            f.write((char*)&locations[i], sizeof(locations[i]));
    }
#else
    void compare(const Array<alvision.Point>& locations)
    {
        // skip block_hists check
        int rows, cols;
        f.read((char*)&rows, sizeof(rows));
        f.read((char*)&cols, sizeof(cols));
        for (int i = 0; i < rows; ++i)
        {
            for (int j = 0; j < cols; ++j)
            {
                float val;
                f.read((char*)&val, sizeof(val));
            }
        }

        int nlocations;
        f.read((char*)&nlocations, sizeof(nlocations));
        ASSERT_EQ(nlocations, static_cast<int>(locations.size()));

        for (int i = 0; i < nlocations; ++i)
        {
            alvision.Point location;
            f.read((char*)&location, sizeof(location));
            ASSERT_EQ(location, locations[i]);
        }
    }
#endif

    void testDetect(const alvision.Mat& img)
    {
        hog.setGammaCorrection(false);
        hog.setSVMDetector(hog.getDefaultPeopleDetector());

        Array<alvision.Point> locations;

        // Test detect
        hog.detect(loadMat(img), locations);

#ifdef DUMP
        dump(locations);
#else
        compare(locations);
#endif

        // Test detect on smaller image
        alvision.Mat img2;
        alvision.resize(img, img2, alvision.Size(img.cols / 2, img.rows / 2));
        hog.detect(loadMat(img2), locations);

#ifdef DUMP
        dump(locations);
#else
        compare(locations);
#endif

        // Test detect on greater image
        alvision.resize(img, img2, alvision.Size(img.cols * 2, img.rows * 2));
        hog.detect(loadMat(img2), locations);

#ifdef DUMP
        dump(locations);
#else
        compare(locations);
#endif
    }
};

// desabled while resize does not fixed
CUDA_TEST_P(HOG, DISABLED_Detect)
{
    alvision.Mat img_rgb = readImage("hog/road.png");
    ASSERT_FALSE(img_rgb.empty());

    f.open((std::alvision.cvtest.TS.ptr().get_data_path() + "hog/expected_output.bin"), std::ios_base::binary);
    ASSERT_TRUE(f.is_open());

    // Test on color image
    alvision.Mat img;
    alvision.cvtColor(img_rgb, img, alvision.COLOR_BGR2BGRA);
    testDetect(img);

    // Test on gray image
    alvision.cvtColor(img_rgb, img, alvision.COLOR_BGR2GRAY);
    testDetect(img);
}

CUDA_TEST_P(HOG, GetDescriptors)
{
    // Load image (e.g. train data, composed from windows)
    alvision.Mat img_rgb = readImage("hog/train_data.png");
    ASSERT_FALSE(img_rgb.empty());

    // Convert to C4
    alvision.Mat img;
    alvision.cvtColor(img_rgb, img, alvision.COLOR_BGR2BGRA);

    alvision.cuda::GpuMat d_img(img);

    // Convert train images into feature vectors (train table)
    alvision.cuda::GpuMat descriptors, descriptors_by_cols;

    hog.setWinStride(Size(64, 128));

    hog.setDescriptorFormat(alvision.cuda::HOG::DESCR_FORMAT_ROW_BY_ROW);
    hog.compute(d_img, descriptors);

    hog.setDescriptorFormat(alvision.cuda::HOG::DESCR_FORMAT_COL_BY_COL);
    hog.compute(d_img, descriptors_by_cols);

    // Check size of the result train table
    wins_per_img_x = 3;
    wins_per_img_y = 2;
    blocks_per_win_x = 7;
    blocks_per_win_y = 15;
    block_hist_size = 36;
    alvision.Size descr_size_expected = alvision.Size(blocks_per_win_x * blocks_per_win_y * block_hist_size,
                                            wins_per_img_x * wins_per_img_y);
    ASSERT_EQ(descr_size_expected, descriptors.size());

    // Check both formats of output descriptors are handled correctly
    alvision.Mat dr(descriptors);
    alvision.Mat dc(descriptors_by_cols);
    for (int i = 0; i < wins_per_img_x * wins_per_img_y; ++i)
    {
        const float* l = dr.rowRange(i, i + 1).ptr<float>();
        const float* r = dc.rowRange(i, i + 1).ptr<float>();
        for (int y = 0; y < blocks_per_win_y; ++y)
            for (int x = 0; x < blocks_per_win_x; ++x)
                for (int k = 0; k < block_hist_size; ++k)
                    ASSERT_EQ(l[(y * blocks_per_win_x + x) * block_hist_size + k],
                              r[(x * blocks_per_win_y + y) * block_hist_size + k]);
    }
}

INSTANTIATE_TEST_CASE_P(CUDA_ObjDetect, HOG, ALL_DEVICES);

//============== caltech hog tests =====================//

struct CalTech : public ::testing::TestWithParam<std::tr1::tuple<alvision.cuda::DeviceInfo, std::string> >
{
    alvision.cuda::DeviceInfo devInfo;
    alvision.Mat img;

    virtual void SetUp()
    {
        devInfo = GET_PARAM(0);
        alvision.cuda::setDevice(devInfo.deviceID());

        img = readImage(GET_PARAM(1), alvision.ImreadModes.IMREAD_GRAYSCALE);
        ASSERT_FALSE(img.empty());
    }
};

CUDA_TEST_P(CalTech, HOG)
{
    alvision.cuda::GpuMat d_img(img);
    alvision.Mat markedImage(img.clone());

    alvision.Ptr<alvision.cuda::HOG> d_hog = alvision.cuda::HOG::create();
    d_hog.setSVMDetector(d_hog.getDefaultPeopleDetector());
    d_hog.setNumLevels(d_hog.getNumLevels() + 32);

    Array<alvision.Rect> found_locations;
    d_hog.detectMultiScale(d_img, found_locations);

#if defined (LOG_CASCADE_STATISTIC)
    for (int i = 0; i < (int)found_locations.size(); i++)
    {
        alvision.Rect r = found_locations[i];

        std::cout << r.x << " " << r.y  << " " << r.width << " " << r.height << std::endl;
        alvision.rectangle(markedImage, r , CV_RGB(255, 0, 0));
    }

    alvision.imshow("Res", markedImage);
    alvision.waitKey();
#endif
}

INSTANTIATE_TEST_CASE_P(detect, CalTech, testing::Combine(ALL_DEVICES,
    ::testing::Values<std::string>("caltech/image_00000009_0.png", "caltech/image_00000032_0.png",
        "caltech/image_00000165_0.png", "caltech/image_00000261_0.png", "caltech/image_00000469_0.png",
        "caltech/image_00000527_0.png", "caltech/image_00000574_0.png")));




//////////////////////////////////////////////////////////////////////////////////////////
/// LBP classifier

PARAM_TEST_CASE(LBP_Read_classifier, alvision.cuda::DeviceInfo, int)
{
    alvision.cuda::DeviceInfo devInfo;

    virtual void SetUp()
    {
        devInfo = GET_PARAM(0);
        alvision.cuda::setDevice(devInfo.deviceID());
    }
};

CUDA_TEST_P(LBP_Read_classifier, Accuracy)
{
    std::string classifierXmlPath = std::alvision.cvtest.TS.ptr().get_data_path() + "lbpcascade/lbpcascade_frontalface.xml";

    alvision.Ptr<alvision.cuda::CascadeClassifier> d_cascade;

    ASSERT_NO_THROW(
        d_cascade = alvision.cuda::CascadeClassifier::create(classifierXmlPath);
    );

    ASSERT_FALSE(d_cascade.empty());
}

INSTANTIATE_TEST_CASE_P(CUDA_ObjDetect, LBP_Read_classifier,
                        testing::Combine(ALL_DEVICES, testing::Values<int>(0)));


PARAM_TEST_CASE(LBP_classify, alvision.cuda::DeviceInfo, int)
{
    alvision.cuda::DeviceInfo devInfo;

    virtual void SetUp()
    {
        devInfo = GET_PARAM(0);
        alvision.cuda::setDevice(devInfo.deviceID());
    }
};

CUDA_TEST_P(LBP_classify, Accuracy)
{
    std::string classifierXmlPath = std::alvision.cvtest.TS.ptr().get_data_path() + "lbpcascade/lbpcascade_frontalface.xml";
    std::string imagePath = std::alvision.cvtest.TS.ptr().get_data_path() + "lbpcascade/er.png";

    alvision.CascadeClassifier cpuClassifier(classifierXmlPath);
    ASSERT_FALSE(cpuClassifier.empty());

    alvision.Mat image = alvision.imread(imagePath);
    image = image.colRange(0, image.cols/2);
    alvision.Mat grey;
    cvtColor(image, grey, alvision.COLOR_BGR2GRAY);
    ASSERT_FALSE(image.empty());

    Array<alvision.Rect> rects;
    cpuClassifier.detectMultiScale(grey, rects);
    alvision.Mat markedImage = image.clone();

    Array<alvision.Rect>::iterator it = rects.begin();
    for (; it != rects.end(); ++it)
        alvision.rectangle(markedImage, *it, alvision.Scalar(255, 0, 0));

    alvision.Ptr<alvision.cuda::CascadeClassifier> gpuClassifier =
            alvision.cuda::CascadeClassifier::create(classifierXmlPath);

    alvision.cuda::GpuMat tested(grey);
    alvision.cuda::GpuMat gpu_rects_buf;
    gpuClassifier.detectMultiScale(tested, gpu_rects_buf);

    Array<alvision.Rect> gpu_rects;
    gpuClassifier.convert(gpu_rects_buf, gpu_rects);

#if defined (LOG_CASCADE_STATISTIC)
    for (size_t i = 0; i < gpu_rects.size(); i++)
    {
        alvision.Rect r = gpu_rects[i];

        std::cout << r.x << " " << r.y  << " " << r.width << " " << r.height << std::endl;
        alvision.rectangle(markedImage, r , CV_RGB(255, 0, 0));
    }

    alvision.imshow("Res", markedImage);
    alvision.waitKey();
#endif
}

INSTANTIATE_TEST_CASE_P(CUDA_ObjDetect, LBP_classify,
                        testing::Combine(ALL_DEVICES, testing::Values<int>(0)));

#endif // HAVE_CUDA
