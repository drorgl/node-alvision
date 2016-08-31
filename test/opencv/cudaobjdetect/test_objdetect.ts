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

//#include "test_precomp.hpp"
//
//#ifdef HAVE_CUDA
//
//using namespace cvtest;

//#define DUMP

const DUMP = true;

class HOG extends alvision.cvtest.CUDA_TEST //: testing::TestWithParam<alvision.cuda.DeviceInfo>
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected hog: alvision.cudaobjdetect.HOG;

//if (DUMP)
//    std::ofstream fo;
    protected fo: number;
//else
//    std::ifstream f;
    protected f: number;


    protected wins_per_img_x: alvision.int;
    protected wins_per_img_y: alvision.int;
    protected blocks_per_win_x: alvision.int;
    protected blocks_per_win_y: alvision.int;
    protected block_hist_size: alvision.int;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);

        alvision.cuda.setDevice(this.devInfo.deviceID());

        this.hog = alvision.cudaobjdetect.HOG.create();
    }

//#ifdef DUMP
    dump(locations: Array<alvision.Point>): void {
        var nlocations = locations.length;

        let buf = new Buffer(4);
        buf.writeInt32BE(nlocations,0);
        
        for (var i = 0; i < locations.length; ++i) {
            buf = Buffer.concat([buf, locations[i].toBuffer()]);
        }

        fs.writeSync(this.f, buf, 0, buf.length, 0);
    }
//#else
    compare(locations: Array<alvision.Point> ) : void
    {
        // skip block_hists check
        //int rows, cols;
        let fsloc = 0;

        let buf = new Buffer(8);
        fsloc += fs.readSync(this.f, buf, 0, buf.length, fsloc);
        
        

        let rows = buf.readInt32BE(0);
        let cols = buf.readInt32BE(4);

        //f.read((char*)&rows, sizeof(rows));
        //f.read((char*)&cols, sizeof(cols));
        for (let i = 0; i < rows; ++i)
        {
            for (let j = 0; j < cols; ++j)
            {
                buf = new Buffer(4);
                fsloc += fs.readSync(this.f, buf, 0, buf.length, fsloc);
                let val = buf.readFloatBE(0);
            }
        }

        buf = new Buffer(4);
        fsloc += fs.readSync(this.f, buf, 0, buf.length, fsloc);

        let nlocations = buf.readInt32BE(0);

        alvision.ASSERT_EQ(()=>nlocations, (locations.length));

        buf = new Buffer(4);
        fsloc += fs.readSync(this.f, buf, 0, buf.length, fsloc);

        var pointSize = (new alvision.Point()).toBuffer().length;

        for (var i = 0; i < nlocations; ++i)
        {
            buf = new Buffer(pointSize);
            fsloc += fs.readSync(this.f, buf, 0, buf.length, fsloc);
            let location = new alvision.Point(buf);
            alvision.ASSERT_EQ(location, locations[i]);
        }
    }
//#endif

    testDetect(img: alvision.Mat ) : void
    {
        this.hog.setGammaCorrection(false);
        this.hog.setSVMDetector(this.hog.getDefaultPeopleDetector());

        var locations = new Array<alvision.Point>();

        // Test detect
        this.hog.detect(alvision.loadMat(img), locations);

        
if (DUMP)
        this.dump(locations);
else
        this.compare(locations);


        // Test detect on smaller image
        var img2 = new alvision.Mat();
        alvision.resize(img, img2, new alvision.Size(img.cols().valueOf() / 2, img.rows().valueOf() / 2));
        this.hog.detect(alvision.loadMat(img2), locations);

if (DUMP)
        this.dump(locations);
else
        this.compare(locations);
//#endif

        // Test detect on greater image
        alvision.resize(img, img2, new alvision.Size(img.cols().valueOf() * 2, img.rows().valueOf() * 2));
        this.hog.detect(alvision.loadMat(img2), locations);

if (DUMP)
        this.dump(locations);
//#else
        this.compare(locations);
//#endif
    }
};

// desabled while resize does not fixed
//CUDA_TEST_P(HOG, DISABLED_Detect)
class HOG_DISABLED_Detect extends HOG
{
    public TestBody(): void {
        var img_rgb = alvision.readImage("hog/road.png");
        alvision.ASSERT_FALSE(img_rgb.empty());


        this.f = fs.openSync(alvision.cvtest.TS.ptr().get_data_path() + "hog/expected_output.bin", "r");
        //alvision.ASSERT_TRUE(fs.statSync( f.is_open());

        // Test on color image
        var img = new alvision.Mat();
        alvision.cvtColor(img_rgb, img, alvision.ColorConversionCodes.COLOR_BGR2BGRA);
        this.testDetect(img);

        // Test on gray image
        alvision.cvtColor(img_rgb, img, alvision.ColorConversionCodes.COLOR_BGR2GRAY);
        this.testDetect(img);
    }
}

//CUDA_TEST_P(HOG, GetDescriptors)
class HOG_GetDescriptors extends HOG
{
    public TestBody(): void {
        // Load image (e.g. train data, composed from windows)
        var img_rgb = alvision.readImage("hog/train_data.png");
        alvision.ASSERT_FALSE(img_rgb.empty());

        // Convert to C4
        var img = new alvision.Mat();
        alvision.cvtColor(img_rgb, img, alvision.ColorConversionCodes.COLOR_BGR2BGRA);

        var d_img = new alvision.cuda.GpuMat (img);

        // Convert train images into feature vectors (train table)
        var descriptors = new alvision.cuda.GpuMat(), descriptors_by_cols = new alvision.cuda.GpuMat ();

        this.hog.setWinStride(new alvision.Size(64, 128));

        this.hog.setDescriptorFormat(alvision.cudaobjdetect.DescriptorStorage.DESCR_FORMAT_ROW_BY_ROW);
        this.hog.compute(d_img, descriptors);

        this.hog.setDescriptorFormat(alvision.cudaobjdetect.DescriptorStorage.DESCR_FORMAT_COL_BY_COL);
        this.hog.compute(d_img, descriptors_by_cols);

        // Check size of the result train table
        this.wins_per_img_x = 3;
        this.wins_per_img_y = 2;
        this.blocks_per_win_x = 7;
        this.blocks_per_win_y = 15;
        this.block_hist_size = 36;
        var descr_size_expected = new alvision.Size(this.blocks_per_win_x.valueOf() * this.blocks_per_win_y.valueOf() * this.block_hist_size.valueOf(),
            this.wins_per_img_x.valueOf() * this.wins_per_img_y.valueOf());
        alvision.ASSERT_EQ(descr_size_expected, descriptors.size());

        // Check both formats of output descriptors are handled correctly
        var dr = new alvision.Mat(descriptors);
        var dc = new alvision.Mat(descriptors_by_cols);
        for (var i = 0; i < this.wins_per_img_x.valueOf() * this.wins_per_img_y.valueOf(); ++i)
        {
            const  l = dr.rowRange(i, i + 1).ptr<alvision.float>("float");
            const  r = dc.rowRange(i, i + 1).ptr<alvision.float>("float");
            for (var y = 0; y < this.blocks_per_win_y; ++y)
            for (var x = 0; x < this.blocks_per_win_x; ++x)
            for (var k = 0; k < this.block_hist_size ; ++k)
            alvision.ASSERT_EQ(l[(y * this.blocks_per_win_x.valueOf() + x) * this.block_hist_size.valueOf() + k],
                r[(x * this.blocks_per_win_y.valueOf() + y) * this.block_hist_size.valueOf() + k]);
        }
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_ObjDetect', 'HOG', (case_name, test_name) => { return null; },new alvision.cvtest.Combine([ alvision.ALL_DEVICES]));

//============== caltech hog tests =====================//

class CalTech extends alvision.cvtest.CUDA_TEST// extends ::testing::TestWithParam<std::tr1::tuple<alvision.cuda.DeviceInfo, std::string> >
{
    protected devInfo: alvision.cuda.DeviceInfo;
    protected img: alvision.Mat;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        alvision.cuda.setDevice(this.devInfo.deviceID());

        this.img = alvision.readImage(this.GET_PARAM<string>(1), alvision.ImreadModes.IMREAD_GRAYSCALE);
        alvision.ASSERT_FALSE(this.img.empty());
    }
};

//CUDA_TEST_P(CalTech, HOG)
class CalTech_HOG extends CalTech
{
    public TestBody(): void {
        var d_img = new alvision.cuda.GpuMat (this.img);
        var markedImage = new alvision.Mat (this.img.clone());

        var d_hog = alvision.cudaobjdetect.HOG.create();
        d_hog.setSVMDetector(d_hog.getDefaultPeopleDetector());
        d_hog.setNumLevels(d_hog.getNumLevels().valueOf() + 32);

        var found_locations = new Array<alvision.Rect>();
        d_hog.detectMultiScale(d_img, found_locations);

       // #if defined (LOG_CASCADE_STATISTIC)
    for (var i = 0; i < found_locations.length; i++)
        {
            var r = found_locations[i];

            console.log(r.x, " ", r.y, " ", r.width, " ", r.height);
            alvision.rectangle(markedImage, r, new alvision.Scalar(255, 0, 0));
        }

        alvision.imshow("Res", markedImage);
        alvision.waitKey();
     //   #endif
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('detect', 'CalTech', (case_name, test_name) => { return null; }, new alvision.cvtest.Combine([
    alvision.ALL_DEVICES,
    ["caltech/image_00000009_0.png", "caltech/image_00000032_0.png",
        "caltech/image_00000165_0.png", "caltech/image_00000261_0.png", "caltech/image_00000469_0.png",
        "caltech/image_00000527_0.png", "caltech/image_00000574_0.png"]
]));




//////////////////////////////////////////////////////////////////////////////////////////
/// LBP classifier

//PARAM_TEST_CASE(LBP_Read_classifier, alvision.cuda.DeviceInfo, int)
class LBP_Read_classifier extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;

    SetUp() : void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(LBP_Read_classifier, Accuracy)
class LBP_Read_classifier_Accuracy extends LBP_Read_classifier
{
    public TestBody(): void {
        var classifierXmlPath = alvision.cvtest.TS.ptr().get_data_path() + "lbpcascade/lbpcascade_frontalface.xml";

        var  d_cascade;

        alvision.ASSERT_NO_THROW(() => {
            d_cascade = alvision.cudaobjdetect.CascadeClassifier.create(classifierXmlPath);
        });

        alvision.ASSERT_FALSE(d_cascade.empty());
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_ObjDetect', 'LBP_Read_classifier', (case_name, test_name) => { return null; },
    new alvision.cvtest.Combine([
        alvision.ALL_DEVICES,
        [0]
    ]));


//PARAM_TEST_CASE(LBP_classify, alvision.cuda.DeviceInfo, int)
class LBP_classify extends alvision.cvtest.CUDA_TEST
{
    protected devInfo: alvision.cuda.DeviceInfo;

    SetUp(): void
    {
        this.devInfo = this.GET_PARAM<alvision.cuda.DeviceInfo>(0);
        alvision.cuda.setDevice(this.devInfo.deviceID());
    }
};

//CUDA_TEST_P(LBP_classify, Accuracy)
class LBP_classify_Accuracy extends LBP_classify
{
    public TestBody(): void {
        var classifierXmlPath = alvision.cvtest.TS.ptr().get_data_path() + "lbpcascade/lbpcascade_frontalface.xml";
        var imagePath = alvision.cvtest.TS.ptr().get_data_path() + "lbpcascade/er.png";

        var cpuClassifier = new alvision.CascadeClassifier (classifierXmlPath);
        alvision.ASSERT_FALSE(cpuClassifier.empty());

        var image = alvision.imread(imagePath);
        image = image.colRange(0, image.cols().valueOf() / 2);
        var grey = new alvision.Mat();
        alvision.cvtColor(image, grey, alvision.ColorConversionCodes.COLOR_BGR2GRAY);
        alvision.ASSERT_FALSE(image.empty());

        var rects = new Array<alvision.Rect>();
        cpuClassifier.detectMultiScale(grey, (r) => { rects = r; });
        var markedImage = image.clone();

        for (var i = 0; i < rects.length;i++)
            alvision.rectangle(markedImage,rects[i],new alvision.Scalar(255, 0, 0));

        var gpuClassifier =
        alvision.cudaobjdetect.CascadeClassifier.create(classifierXmlPath);

        var tested = new alvision.cuda.GpuMat (grey);
        var gpu_rects_buf = new alvision.cuda.GpuMat();
        gpuClassifier.detectMultiScale(tested, gpu_rects_buf);

        var gpu_rects = new Array<alvision.Rect>();
        gpuClassifier.convert(gpu_rects_buf, gpu_rects);

       // #if defined (LOG_CASCADE_STATISTIC)
    for (var i = 0; i < gpu_rects.length; i++)
        {
            var r = gpu_rects[i];

            console.log(r.x, " ", r.y, " ", r.width, " ", r.height);
            alvision.rectangle(markedImage, r, new alvision.Scalar(255, 0, 0));
        }

        alvision.imshow("Res", markedImage);
        alvision.waitKey();
     //   #endif
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('CUDA_ObjDetect', 'LBP_classify', (case_name, test_name) => { return null; },
    new alvision.cvtest.Combine([
        alvision.ALL_DEVICES,
        [0]
        ]));

//#endif // HAVE_CUDA
