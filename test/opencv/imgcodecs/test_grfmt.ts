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

function remove(filename: string): void {
    fs.unlinkSync(filename);
}


//#include "test_precomp.hpp"
//
//#include < fstream >
//#include < sstream >
//
//    using namespace cv;
//using namespace std;

function mats_equal(lhs: alvision.Mat, rhs: alvision.Mat): boolean {
    if (lhs.channels() != rhs.channels() ||
        lhs.depth() != rhs.depth() ||
        lhs.size().height != rhs.size().height ||
        lhs.size().width != rhs.size().width) {
        return false;
    }

    var diff = alvision.Mat.from(alvision.MatExpr.op_NotEquals(lhs, rhs));
    //Mat diff =  (lhs != rhs);
    var s = alvision.sum(diff);
    for (var i = 0; i < s.channels; ++i) {
        if (s[i] != 0) {
            return false;
        }
    }

    return true;
}

function imread_compare(filepath: string, flags: alvision.ImreadModes = alvision.ImreadModes.IMREAD_COLOR): boolean {
    var pages = new Array<alvision.Mat>();
    if (!alvision.imreadmulti(filepath, (mats) => { pages = mats; }, flags) ||
        pages.length == 0) {
        return false;
    }

    var single = alvision.imread(filepath, flags);
    return mats_equal(single, pages[0]);
}

alvision.cvtest.TEST('Imgcodecs_imread', 'regression', () => {

    var filenames = [  
        //#ifdef HAVE_JASPER
        "Rome.jp2",
        //#endif
        "color_palette_alpha.png",
        "multipage.tif",
        "rle.hdr",
        "ordinary.bmp",
        "rle8.bmp",
        "test_1_c1.jpg"
    ];

    var folder = alvision.cvtest.TS.ptr().get_data_path() + "/readwrite/";

    for (var i = 0; i < filenames.length; ++i) {
        var path = folder + filenames[i];
        alvision.ASSERT_TRUE(imread_compare(path, alvision.ImreadModes.IMREAD_UNCHANGED));
        alvision.ASSERT_TRUE(imread_compare(path, alvision.ImreadModes.IMREAD_GRAYSCALE));
        alvision.ASSERT_TRUE(imread_compare(path, alvision.ImreadModes.IMREAD_COLOR));
        alvision.ASSERT_TRUE(imread_compare(path, alvision.ImreadModes.IMREAD_ANYDEPTH));
        alvision.ASSERT_TRUE(imread_compare(path, alvision.ImreadModes.IMREAD_ANYCOLOR));
        if (path.substr(path.length - 3) != "hdr") {
            // GDAL does not support hdr
            alvision.ASSERT_TRUE(imread_compare(path, alvision.ImreadModes.IMREAD_LOAD_GDAL));
        }
    }
});


//template < class T>
//    string to_string(T i)
//{
//    stringstream ss;
//    string s;
//    ss << i;
//    s = ss.str();

//    return s;
//}


/**
 * Test for check whether reading exif orientation tag was processed successfully or not
 * The test info is the set of 8 images named testExifRotate_{1 to 8}.jpg
 * The test image is the square 10x10 points divided by four sub-squares:
 * (R corresponds to Red, G to Green, B to Blue, W to white)
 * ---------             ---------
 * | R | G |             | G | R |
 * |-------| - (tag 1)   |-------| - (tag 2)
 * | B | W |             | W | B |
 * ---------             ---------
 *
 * ---------             ---------
 * | W | B |             | B | W |
 * |-------| - (tag 3)   |-------| - (tag 4)
 * | G | R |             | R | G |
 * ---------             ---------
 *
 * ---------             ---------
 * | R | B |             | G | W |
 * |-------| - (tag 5)   |-------| - (tag 6)
 * | G | W |             | R | B |
 * ---------             ---------
 *
 * ---------             ---------
 * | W | G |             | B | R |
 * |-------| - (tag 7)   |-------| - (tag 8)
 * | B | R |             | W | G |
 * ---------             ---------
 *
 *
 * Every image contains exif field with orientation tag (0x112)
 * After reading each image the corresponding matrix must be read as
 * ---------
 * | R | G |
 * |-------|
 * | B | W |
 * ---------
 *
 */
//class CV_GrfmtJpegExifOrientationTest extends alvision.cvtest.BaseTest
//{
//    //public:
//    run(iii : alvision.int) : void
//    {
//        try {
//            for (var i = 1; i <= 8; ++i)
//            {
//                var fileName = "readwrite/testExifOrientation_" + i + ".jpg";
//                this.m_img = alvision.imread(this.ts.get_data_path() + fileName);
//                if (!this.m_img.data) {
//                    this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISSING_TEST_DATA);
//                }
//                this.ts.printf(alvision.cvtest.TSConstants.LOG, "start  reading image\t%s\n", fileName);
//                if (!this.checkOrientation()) {
//                    this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
//                }
//            }
//
//        }
//        catch (e)
//        {
//            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_EXCEPTION);
//        }
//    }
//    //private:
//    
//    private m_img: alvision.Mat;
//
//    private checkOrientation() : boolean {
//        //Vec3b vec;
//        var red = 0;
//        var green = 0;
//        var blue = 0;
//
//        var colorThresholdHigh = 250;
//        var colorThresholdLow = 5;
//
//        //Checking the first quadrant (with supposed red)
//        var vec = this.m_img.at<Vec3b>(2, 2); //some point inside the square
//        red = vec.val[2];
//        green = vec.val[1];
//        blue = vec.val[0];
//
//        this.ts.printf(alvision.cvtest.TSConstants.LOG, "RED QUADRANT:\n");
//        this.ts.printf(alvision.cvtest.TSConstants.LOG, "Red calculated:\t\t%d\n", red);
//        this.ts.printf(alvision.cvtest.TSConstants.LOG, "Green calculated:\t%d\n", green);
//        this.ts.printf(alvision.cvtest.TSConstants.LOG, "Blue calculated:\t%d\n", blue);
//        if (red < colorThresholdHigh) return false;
//        if (blue > colorThresholdLow) return false;
//        if (green > colorThresholdLow) return false;
//
//        //Checking the second quadrant (with supposed green)
//        vec = this.m_img.at<Vec3b>(2, 7);  //some point inside the square
//        red = vec.val[2];
//        green = vec.val[1];
//        blue = vec.val[0];
//        this.ts.printf(alvision.cvtest.TSConstants.LOG, "GREEN QUADRANT:\n");
//        this.ts.printf(alvision.cvtest.TSConstants.LOG, "Red calculated:\t\t%d\n", red);
//        this.ts.printf(alvision.cvtest.TSConstants.LOG, "Green calculated:\t%d\n", green);
//        this.ts.printf(alvision.cvtest.TSConstants.LOG, "Blue calculated:\t%d\n", blue);
//        if (green < colorThresholdHigh) return false;
//        if (red > colorThresholdLow) return false;
//        if (blue > colorThresholdLow) return false;
//
//        //Checking the third quadrant (with supposed blue)
//        vec = this.m_img.at<Vec3b>(7, 2);  //some point inside the square
//        red = vec.val[2];
//        green = vec.val[1];
//        blue = vec.val[0];
//        this.ts.printf(alvision.cvtest.TSConstants.LOG, "BLUE QUADRANT:\n");
//        this.ts.printf(alvision.cvtest.TSConstants.LOG, "Red calculated:\t\t%d\n", red);
//        this.ts.printf(alvision.cvtest.TSConstants.LOG, "Green calculated:\t%d\n", green);
//        this.ts.printf(alvision.cvtest.TSConstants.LOG, "Blue calculated:\t%d\n", blue);
//        if (blue < colorThresholdHigh) return false;
//        if (red > colorThresholdLow) return false;
//        if (green > colorThresholdLow) return false;
//
//        return true;
//    }
//};




//alvision.cvtest.TEST('Imgcodecs_jpeg_exif', 'setOrientation', () => {
//
//    var test = new CV_GrfmtJpegExifOrientationTest();
//    test.safe_run();
//});

//#ifdef HAVE_JASPER
alvision.cvtest.TEST('Imgcodecs_jasper', 'regression', () => {

    var folder = alvision.cvtest.TS.ptr().get_data_path() + "/readwrite/";

    alvision.ASSERT_TRUE(imread_compare(folder + "Bretagne2.jp2", alvision.ImreadModes.IMREAD_COLOR));
    alvision.ASSERT_TRUE(imread_compare(folder + "Bretagne2.jp2", alvision.ImreadModes.IMREAD_GRAYSCALE));
    alvision.ASSERT_TRUE(imread_compare(folder + "Grey.jp2", alvision.ImreadModes.IMREAD_COLOR));
    alvision.ASSERT_TRUE(imread_compare(folder + "Grey.jp2", alvision.ImreadModes.IMREAD_GRAYSCALE));
});
//#endif

class CV_GrfmtWriteBigImageTest extends alvision.cvtest.BaseTest
{
    //public:
    public run(iii : alvision.int): void
    {
        try {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "start  reading big image\n");
            var img = alvision.imread(this.ts.get_data_path() + "readwrite/read.png");
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "finish reading big image\n");
            if (img.empty()) this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "start  writing big image\n");
            alvision.imwrite(alvision.tempfile(".png"), img);
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "finish writing big image\n");
        }
        catch(e)
        {
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_EXCEPTION);
        }
        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);
    }
};

function ext_from_int(ext : number) : string
{
    //#ifdef HAVE_PNG
    if (ext == 0) return ".png";
    //#endif
    if (ext == 1) return ".bmp";
    if (ext == 2) return ".pgm";
    //#ifdef HAVE_TIFF
    if (ext == 3) return ".tiff";
    //#endif
    return "";
}

class CV_GrfmtWriteSequenceImageTest extends alvision.cvtest.BaseTest
{
    //public:
    public run(iii: alvision.int) : void
    {
        try {
            var img_r = 640;
            var img_c = 480;

            for (var k = 1; k <= 5; ++k)
            {
                for (var ext = 0; ext < 4; ++ext) // 0 - png, 1 - bmp, 2 - pgm, 3 - tiff
                {
                    if (ext_from_int(ext) == "")
                        continue;
                    for (var num_channels = 1; num_channels <= 4; num_channels++)
                    {
                        if (num_channels == 2) continue;
                        if (num_channels == 4 && ext != 3 /*TIFF*/) continue;

                        this.ts.printf(alvision.cvtest.TSConstants.LOG, "image type depth:%d   channels:%d   ext: %s\n", alvision.MatrixType.CV_8U, num_channels, ext_from_int(ext));
                        var img = new alvision.Mat(img_r * k, img_c * k, alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_8U, num_channels), alvision.Scalar.all(0));
                        alvision.circle(img, new alvision.Point2i((img_c * k) / 2, (img_r * k) / 2), Math.min((img_r * k), (img_c * k)) / 4, alvision.Scalar.all(255));

                        var img_path = alvision.tempfile(ext_from_int(ext));
                        this.ts.printf(alvision.cvtest.TSConstants.LOG, "writing      image : %s\n", img_path);
                        alvision.imwrite(img_path, img);

                        this.ts.printf(alvision.cvtest.TSConstants.LOG, "reading test image : %s\n", img_path);
                        var img_test = alvision.imread(img_path,alvision.ImreadModes.IMREAD_UNCHANGED);

                        if (img_test.empty()) this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);

                        alvision.CV_Assert(()=>img.size() == img_test.size());
                        alvision.CV_Assert(()=>img.type() == img_test.type());
                        alvision.CV_Assert(()=>num_channels == img_test.channels());

                        var n = alvision.cvtest.norm(img, img_test,alvision.NormTypes.NORM_L2);
                        if (n > 1.0) {
                            this.ts.printf(alvision.cvtest.TSConstants.LOG, "norm = %f \n", n);
                            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
                        }
                    }
                }

                //#ifdef HAVE_JPEG
                for (var num_channels = 1; num_channels <= 3; num_channels += 2)
                {
                    // jpeg
                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "image type depth:%d   channels:%d   ext: %s\n", alvision.MatrixType.CV_8U, num_channels, ".jpg");
                    var img = new alvision.Mat(img_r * k, img_c * k,alvision.MatrixType. CV_MAKETYPE(alvision.MatrixType.CV_8U, num_channels), alvision.Scalar.all(0));
                    alvision.circle(img, new alvision.Point2i((img_c * k) / 2, (img_r * k) / 2), Math.min((img_r * k), (img_c * k)) / 4, alvision.Scalar.all(255));

                    var filename = alvision.tempfile(".jpg");
                    alvision.imwrite(filename, img);
                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "reading test image : %s\n", filename);
                    var img_test = alvision.imread(filename,alvision.ImreadModes.IMREAD_UNCHANGED);

                    if (img_test.empty()) this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);

                    alvision.CV_Assert(()=>img.size() == img_test.size());
                    alvision.CV_Assert(()=>img.type() == img_test.type());

                    // JPEG format does not provide 100% accuracy
                    // using fuzzy image comparison
                    var n = alvision.cvtest.norm(img, img_test,alvision.NormTypes. NORM_L1);
                    var expected = 0.05 * img.size().area().valueOf();
                    if (n > expected) {
                        this.ts.printf(alvision.cvtest.TSConstants.LOG, "norm = %f > expected = %f \n", n, expected);
                        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
                    }
                }
                //#endif

                //#ifdef HAVE_TIFF
                for (var num_channels = 1; num_channels <= 4; num_channels++)
                {
                    if (num_channels == 2) continue;
                    // tiff
                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "image type depth:%d   channels:%d   ext: %s\n",alvision.MatrixType. CV_16U, num_channels, ".tiff");
                    var img = new alvision.Mat(img_r * k, img_c * k,alvision.MatrixType. CV_MAKETYPE(alvision.MatrixType.CV_16U, num_channels), alvision.Scalar.all(0));
                    alvision.circle(img,new alvision. Point2i((img_c * k) / 2, (img_r * k) / 2), Math.min((img_r * k), (img_c * k)) / 4, alvision.Scalar.all(255));

                    var filename = alvision.tempfile(".tiff");
                    alvision.imwrite(filename, img);
                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "reading test image : %s\n", filename);
                    var img_test = alvision.imread(filename, alvision.ImreadModes. IMREAD_UNCHANGED);

                    if (img_test.empty()) this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);

                    alvision.CV_Assert(()=>img.size() == img_test.size());

                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "img      : %d ; %d \n", img.channels(), img.depth());
                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "img_test : %d ; %d \n", img_test.channels(), img_test.depth());

                    alvision.CV_Assert(()=>img.type() == img_test.type());


                    var n = alvision.cvtest.norm(img, img_test,alvision.NormTypes.NORM_L2);
                    if (n > 1.0) {
                        this.ts.printf(alvision.cvtest.TSConstants.LOG, "norm = %f \n", n);
                        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
                    }
                }
                //#endif
            }
        }
        catch (e)
            {
            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Exception: %s\n", e);
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
    }
}
};

class CV_GrfmtReadBMPRLE8Test extends alvision.cvtest.BaseTest
{
    //public:
    public run(iii: alvision.int) : void
    {
        try {
            var rle = alvision.imread(this.ts.get_data_path() + "readwrite/rle8.bmp");
            var bmp = alvision.imread(this.ts.get_data_path() + "readwrite/ordinary.bmp");
            if (alvision.cvtest.norm(alvision.MatExpr.op_Substraction( rle, bmp),alvision.NormTypes.NORM_L2) > 1.e-10)
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
        }
        catch (e)
        {
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_EXCEPTION);
        }
        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);
    }
};


//#ifdef HAVE_PNG
alvision.cvtest.TEST('Imgcodecs_Image', 'write_big', () => { var test = new CV_GrfmtWriteBigImageTest(); test.safe_run(); });
//#endif

alvision.cvtest.TEST('Imgcodecs_Image', 'write_imageseq', () => { var test = new CV_GrfmtWriteSequenceImageTest(); test.safe_run(); });

alvision.cvtest.TEST('Imgcodecs_Image', 'read_bmp_rle8', () => { var test = new CV_GrfmtReadBMPRLE8Test(); test.safe_run(); });

//#ifdef HAVE_PNG
class CV_GrfmtPNGEncodeTest extends alvision.cvtest.BaseTest
{
    //public:
    public run(iii : alvision.int) : void
    {
        try {
            var buff = new Buffer(0);
            //vector < uchar > buff;
            var im = alvision.Mat.zeros(1000, 1000, alvision.MatrixType.CV_8U);
            //randu(im, 0, 256);
            //vector < int > param;
            var param = new Array<alvision.IimwriteParameter>();
            param.push({ flag : alvision.ImwriteFlags.IMWRITE_PNG_COMPRESSION, value : 3});
            alvision.imencode(".png", im, buff, param);

            // hangs
            var im2 = alvision.imdecode(buff,alvision.ImreadModes. IMREAD_ANYDEPTH);
        }
        catch (e)
        {
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_EXCEPTION);
        }
        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);
    }
};

alvision.cvtest.TEST('Imgcodecs_Image', 'encode_png', () => { var test = new CV_GrfmtPNGEncodeTest(); test.safe_run(); });

alvision.cvtest.TEST('Imgcodecs_ImreadVSCvtColor', 'regression', () => {
    var ts = alvision.cvtest.TS.ptr();

    var MAX_MEAN_DIFF = 1;
    var MAX_ABS_DIFF = 10;

    var imgName = ts.get_data_path() + "/../cv/shared/lena.png";
    var original_image = alvision.imread(imgName);
    var gray_by_codec = alvision.imread(imgName, 0);
    var gray_by_cvt = new alvision.Mat();

    alvision.cvtColor(original_image, gray_by_cvt, alvision.ColorConversionCodes.COLOR_BGR2GRAY/* CV_BGR2GRAY*/);

    var diff = new alvision.Mat();
    alvision.absdiff(gray_by_codec, gray_by_cvt, diff);

    var actual_avg_diff = alvision.mean(diff);
    var actual_maxval : alvision.double;
    var actual_minval : alvision.double;
    alvision.minMaxLoc(diff, (minVal, maxVal, minIdx, maxIdx) => { actual_minval = minVal; actual_maxval = maxVal;});
    //printf("actual avg = %g, actual maxdiff = %g, npixels = %d\n", actual_avg_diff, actual_maxval, (int)diff.total());

    alvision.EXPECT_LT(actual_avg_diff.val(0).valueOf(), MAX_MEAN_DIFF);
    alvision.EXPECT_LT(actual_maxval.valueOf(), MAX_ABS_DIFF);
});

//Test OpenCV issue 3075 is solved
class CV_GrfmtReadPNGColorPaletteWithAlphaTest extends alvision.cvtest.BaseTest
{
    //public:
    public run(iii : alvision.int) : void
    {
        try {
            // First Test : Read PNG with alpha, imread flag -1
            var img = alvision.imread(this.ts.get_data_path() + "readwrite/color_palette_alpha.png", -1);
            if (img.empty()) this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);

            alvision.ASSERT_TRUE(img.channels() == 4);

            var img_data = img.data();//.ptr();

            // Verification first pixel is red in BGRA
            alvision.ASSERT_TRUE(img_data [0] == 0x00);
            alvision.ASSERT_TRUE(img_data[1] == 0x00);
            alvision.ASSERT_TRUE(img_data[2] == 0xFF);
            alvision.ASSERT_TRUE(img_data[3] == 0xFF);

            // Verification second pixel is red in BGRA
            alvision.ASSERT_TRUE(img_data[4] == 0x00);
            alvision.ASSERT_TRUE(img_data[5] == 0x00);
            alvision.ASSERT_TRUE(img_data[6] == 0xFF);
            alvision.ASSERT_TRUE(img_data[7] == 0xFF);

            // Second Test : Read PNG without alpha, imread flag -1
            img = alvision.imread(this.ts.get_data_path() + "readwrite/color_palette_no_alpha.png", -1);
            if (img.empty()) this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);

            alvision.ASSERT_TRUE(img.channels() == 3);

            img_data = img.data();//.ptr();

            // Verification first pixel is red in BGR
            alvision.ASSERT_TRUE(img_data[0] == 0x00);
            alvision.ASSERT_TRUE(img_data[1] == 0x00);
            alvision.ASSERT_TRUE(img_data[2] == 0xFF);

            // Verification second pixel is red in BGR
            alvision.ASSERT_TRUE(img_data[3] == 0x00);
            alvision.ASSERT_TRUE(img_data[4] == 0x00);
            alvision.ASSERT_TRUE(img_data[5] == 0xFF);

            // Third Test : Read PNG with alpha, imread flag 1
            img = alvision.imread(this.ts.get_data_path() + "readwrite/color_palette_alpha.png", 1);
            if (img.empty()) this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);

            alvision.ASSERT_TRUE(img.channels() == 3);

            img_data = img.data();//.ptr();

            // Verification first pixel is red in BGR
            alvision.ASSERT_TRUE(img_data[0] == 0x00);
            alvision.ASSERT_TRUE(img_data[1] == 0x00);
            alvision.ASSERT_TRUE(img_data[2] == 0xFF);

            // Verification second pixel is red in BGR
            alvision.ASSERT_TRUE(img_data[3] == 0x00);
            alvision.ASSERT_TRUE(img_data[4] == 0x00);
            alvision.ASSERT_TRUE(img_data[5] == 0xFF);

            // Fourth Test : Read PNG without alpha, imread flag 1
            img = alvision.imread(this.ts.get_data_path() + "readwrite/color_palette_no_alpha.png", 1);
            if (img.empty()) this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);

            alvision.ASSERT_TRUE(img.channels() == 3);

            img_data = img.data();//.ptr();

            // Verification first pixel is red in BGR
            alvision.ASSERT_TRUE(img_data[0] == 0x00);
            alvision.ASSERT_TRUE(img_data[1] == 0x00);
            alvision.ASSERT_TRUE(img_data[2] == 0xFF);

            // Verification second pixel is red in BGR
            alvision.ASSERT_TRUE(img_data[3] == 0x00);
            alvision.ASSERT_TRUE(img_data[4] == 0x00);
            alvision.ASSERT_TRUE(img_data[5] == 0xFF);
        }
        catch (e)
        {
            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_EXCEPTION);
        }
        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);
    }
};

alvision.cvtest.TEST('Imgcodecs_Image', 'read_png_color_palette_with_alpha', () => { var test = new CV_GrfmtReadPNGColorPaletteWithAlphaTest(); test.safe_run(); });
//#endif

//#ifdef HAVE_JPEG
alvision.cvtest.TEST('Imgcodecs_Jpeg', 'encode_empty', () => {
    var img = new alvision.Mat();
    //std::vector < uchar > jpegImg;
    var jpegImg = new Buffer(0);

    alvision.ASSERT_THROW(() => { alvision.imencode(".jpg", img, jpegImg) }, new Error("encode empty"));
});

alvision.cvtest.TEST('Imgcodecs_Jpeg', 'encode_decode_progressive_jpeg', () => {
    var ts = alvision.cvtest.TS.ptr();
    //cvtest::TS & ts = *cvtest::TS::ptr();
    var input = ts.get_data_path() + "../cv/shared/lena.png";
    var img = alvision.imread(input);
    alvision.ASSERT_FALSE(img.empty());

    var params = new Array<alvision.IimwriteParameter>();
    params.push({ flag: alvision.ImwriteFlags.IMWRITE_JPEG_PROGRESSIVE, value : 1 });

    var output_progressive = alvision.tempfile(".jpg");
    alvision.EXPECT_NO_THROW(()=>alvision.imwrite(output_progressive, img, params));
    var img_jpg_progressive = alvision.imread(output_progressive);

    var output_normal = alvision.tempfile(".jpg");
    alvision.EXPECT_NO_THROW(()=>alvision.imwrite(output_normal, img));
    var img_jpg_normal = alvision.imread(output_normal);

    alvision.EXPECT_EQ(0, alvision.cvtest.norm(img_jpg_progressive, img_jpg_normal,alvision.NormTypes. NORM_INF));

    remove(output_progressive);
});

alvision.cvtest.TEST('Imgcodecs_Jpeg', 'encode_decode_optimize_jpeg', () => {
    var ts = alvision.cvtest.TS.ptr();
    var input = ts.get_data_path() + "../cv/shared/lena.png";
    var img = alvision.imread(input);
    alvision.ASSERT_FALSE(img.empty());

    var params = new Array<alvision.IimwriteParameter>();
    params.push({ flag: alvision.ImwriteFlags.IMWRITE_JPEG_OPTIMIZE, value:1 });

    var output_optimized = alvision.tempfile(".jpg");
    alvision.EXPECT_NO_THROW(()=>alvision.imwrite(output_optimized, img, params));
    var img_jpg_optimized = alvision.imread(output_optimized);

    var output_normal = alvision.tempfile(".jpg");
    alvision.EXPECT_NO_THROW(()=>alvision.imwrite(output_normal, img));
    var img_jpg_normal = alvision.imread(output_normal);

    alvision.EXPECT_EQ(0, alvision.cvtest.norm(img_jpg_optimized, img_jpg_normal,alvision.NormTypes. NORM_INF));

    remove(output_optimized);
});

alvision.cvtest.TEST('Imgcodecs_Jpeg', 'encode_decode_rst_jpeg', () => {
    var ts = alvision.cvtest.TS.ptr();
    var input = ts.get_data_path() + "../cv/shared/lena.png";
    var img = alvision.imread(input);
    alvision.ASSERT_FALSE(img.empty());

    var params = new Array<alvision.IimwriteParameter>();
    params.push({ flag: alvision.ImwriteFlags.IMWRITE_JPEG_RST_INTERVAL, value: 1 });

    var output_rst = alvision.tempfile(".jpg");
    alvision.EXPECT_NO_THROW(()=>alvision.imwrite(output_rst, img, params));
    var img_jpg_rst = alvision.imread(output_rst);

    var output_normal = alvision.tempfile(".jpg");
    alvision.EXPECT_NO_THROW(()=>alvision.imwrite(output_normal, img));
    var img_jpg_normal = alvision.imread(output_normal);

    alvision.EXPECT_EQ(0, alvision.cvtest.norm(img_jpg_rst, img_jpg_normal,alvision.NormTypes.NORM_INF));

    remove(output_rst);
});

//#endif


//#ifdef HAVE_TIFF

// these defines are used to resolve conflict between tiff.h and opencv2/core/types_c.h
//#define uint64 uint64_hack_
//#define int64 int64_hack_
//#include "tiff.h"
//
//#ifdef ANDROID
// Test disabled as it uses a lot of memory.
// It is killed with SIGKILL by out of memory killer.
//TEST(Imgcodecs_Tiff, DISABLED_decode_tile16384x16384)
//#else
alvision.cvtest.TEST('Imgcodecs_Tiff', 'decode_tile16384x16384',()=>{
//#endif
//{
    // see issue #2161
    var big = new alvision.Mat(16384, 16384,alvision.MatrixType. CV_8UC1, alvision.Scalar.all(0));
    var file3 = alvision.tempfile(".tiff");
    var file4 = alvision.tempfile(".tiff");

    var params = new Array<alvision.IimwriteParameter>();
    params.push({ flag: alvision.tiff.TIFFTAG_ROWSPERSTRIP,value : big.rows});

    
    alvision.imwrite(file4, big, params);
    alvision.imwrite(file3, big.colRange(0, big.cols.valueOf() - 1), params);
    big = null;

    try {
        alvision.imread(file3,alvision.ImreadModes.IMREAD_UNCHANGED);
        alvision.EXPECT_NO_THROW(()=>alvision.imread(file4, alvision.ImreadModes.IMREAD_UNCHANGED));
    }
    catch (e)
        {
            // have no enough memory
        }

    remove(file3);
    remove(file4);
});

alvision.cvtest.TEST('Imgcodecs_Tiff', 'write_read_16bit_big_little_endian', () => {
    // see issue #2601 "16-bit Grayscale TIFF Load Failures Due to Buffer Underflow and Endianness"

    // Setup data for two minimal 16-bit grayscale TIFF files in both endian formats
    var tiff_sample_data = [[
        // Little endian
        0x49, 0x49, 0x2a, 0x00, 0x0c, 0x00, 0x00, 0x00, 0xad, 0xde, 0xef, 0xbe, 0x06, 0x00, 0x00, 0x01,
        0x03, 0x00, 0x01, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x01, 0x01, 0x03, 0x00, 0x01, 0x00,
        0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x02, 0x01, 0x03, 0x00, 0x01, 0x00, 0x00, 0x00, 0x10, 0x00,
        0x00, 0x00, 0x06, 0x01, 0x03, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x11, 0x01,
        0x04, 0x00, 0x01, 0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x17, 0x01, 0x04, 0x00, 0x01, 0x00,
        0x00, 0x00, 0x04, 0x00, 0x00, 0x00
    ], [
            // Big endian
            0x4d, 0x4d, 0x00, 0x2a, 0x00, 0x00, 0x00, 0x0c, 0xde, 0xad, 0xbe, 0xef, 0x00, 0x06, 0x01, 0x00,
            0x00, 0x03, 0x00, 0x00, 0x00, 0x01, 0x00, 0x02, 0x00, 0x00, 0x01, 0x01, 0x00, 0x03, 0x00, 0x00,
            0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x01, 0x02, 0x00, 0x03, 0x00, 0x00, 0x00, 0x01, 0x00, 0x10,
            0x00, 0x00, 0x01, 0x06, 0x00, 0x03, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x01, 0x11,
            0x00, 0x04, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x08, 0x01, 0x17, 0x00, 0x04, 0x00, 0x00,
            0x00, 0x01, 0x00, 0x00, 0x00, 0x04
        ]
    ];

// Test imread() for both a little endian TIFF and big endian TIFF
for (var i = 0; i < 2; i++)
{
    var filename = alvision.tempfile(".tiff");

    // Write sample TIFF file
    //var fp = fs.openSync(filename, "wb");
    fs.writeFileSync(filename, tiff_sample_data);

    //FILE * fp = fopen(filename, "wb");
    //ASSERT_TRUE(fp != NULL);
    //ASSERT_EQ((size_t)1, fwrite(tiff_sample_data, 86, 1, fp));
    //fclose(fp);

    var img = alvision.imread(filename,alvision.ImreadModes. IMREAD_UNCHANGED);

    alvision.EXPECT_EQ(1, img.rows);
    alvision.EXPECT_EQ(2, img.cols);
    alvision.EXPECT_EQ(alvision.MatrixType.CV_16U, img.type());
    //alvision.EXPECT_EQ(sizeof(ushort), img.elemSize());
    alvision.EXPECT_EQ(1, img.channels());
    alvision.EXPECT_EQ(0xDEAD, img.data().readUInt16BE(0));//.at<ushort>(0, 0));
    alvision.EXPECT_EQ(0xBEEF, img.data().readUInt16BE(1));//.at<ushort>(0, 1));

    remove(filename);
}
});

//class CV_GrfmtReadTifTiledWithNotFullTiles extends alvision.cvtest.BaseTest
//{
//    //public:
//    public run(iii: alvision.int) : void
//    {
//        try {
//            /* see issue #3472 - dealing with tiled images where the tile size is
//             * not a multiple of image size.
//             * The tiled images were created with 'convert' from ImageMagick,
//             * using the command 'convert <input> -define tiff:tile-geometry=128x128 -depth [8|16] <output>
//             * Note that the conversion to 16 bits expands the range from 0-255 to 0-255*255,
//             * so the test converts back but rounding errors cause small differences.
//             */
//            var img = alvision.imread(this.ts.get_data_path() + "readwrite/non_tiled.tif", -1);
//            if (img.empty()) this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
//            alvision.ASSERT_TRUE(img.channels() == 3);
//            var tiled8 = alvision.imread(this.ts.get_data_path() + "readwrite/tiled_8.tif", -1);
//            if (tiled8.empty()) this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
//            alvision.ASSERT_PRED_FORMAT2(alvision.cvtest.MatComparator(0, 0), img, tiled8);
//
//            var tiled16 = alvision.imread(this.ts.get_data_path()) + "readwrite/tiled_16.tif", -1);
//            if (tiled16 == null) this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
//            alvision.ASSERT_TRUE(tiled16.elemSize() == 6);
//            tiled16.convertTo(tiled8, alvision.MatrixType. CV_8UC3, 1. / 256.);
//            alvision.ASSERT_PRED_FORMAT2(alvision.cvtest.MatComparator(2, 0), img, tiled8);
//            // What about 32, 64 bit?
//        }
//        catch (e)
//        {
//            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_EXCEPTION);
//        }
//        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);
//    }
//};
//
//alvision.cvtest.TEST('Imgcodecs_Tiff', 'decode_tile_remainder', () => {
//    var test = new CV_GrfmtReadTifTiledWithNotFullTiles (); test.safe_run();
//});

//alvision.cvtest.TEST('Imgcodecs_Tiff', 'decode_infinite_rowsperstrip',()=>{
//
//    var sample_data = [
//        0x49, 0x49, 0x2a, 0x00, 0x10, 0x00, 0x00, 0x00, 0x56, 0x54,
//        0x56, 0x5a, 0x59, 0x55, 0x5a, 0x00, 0x0a, 0x00, 0x00, 0x01,
//        0x03, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00,
//        0x01, 0x01, 0x03, 0x00, 0x01, 0x00, 0x00, 0x00, 0x07, 0x00,
//        0x00, 0x00, 0x02, 0x01, 0x03, 0x00, 0x01, 0x00, 0x00, 0x00,
//        0x08, 0x00, 0x00, 0x00, 0x03, 0x01, 0x03, 0x00, 0x01, 0x00,
//        0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x06, 0x01, 0x03, 0x00,
//        0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x11, 0x01,
//        0x04, 0x00, 0x01, 0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00,
//        0x15, 0x01, 0x03, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00,
//        0x00, 0x00, 0x16, 0x01, 0x04, 0x00, 0x01, 0x00, 0x00, 0x00,
//        0xff, 0xff, 0xff, 0xff, 0x17, 0x01, 0x04, 0x00, 0x01, 0x00,
//        0x00, 0x00, 0x07, 0x00, 0x00, 0x00, 0x1c, 0x01, 0x03, 0x00,
//        0x01, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00,
//        0x00, 0x00
//    ];
//
//    var filename = alvision.tempfile(".tiff");
//    std::ofstream outfile(filename.c_str(), std::ofstream::binary);
//    outfile.write(reinterpret_cast <const char *>(sample_data), sizeof sample_data);
//    outfile.close();
//
//    alvision.EXPECT_NO_THROW(alvision.imread(filename,alvision.ImreadModes. IMREAD_UNCHANGED));
//
//    remove(filename);
//});

class CV_GrfmtReadTifMultiPage extends alvision.cvtest.BaseTest
{
    
    private compare(flags: alvision.ImreadModes ) : void
    {
        var folder = alvision.cvtest.TS.ptr().get_data_path() + "/readwrite/";
        var page_count = 6;

        var pages = new Array<alvision.Mat>();

        var res = alvision.imreadmulti(folder + "multipage.tif", (mats) => { pages = mats }, flags);
        alvision.ASSERT_TRUE(res == true);
        alvision.ASSERT_EQ(page_count, pages.length);

        for (var i = 0; i < page_count; i++)
        {
            //char buffer[256];
            //sprintf(buffer, "%smultipage_p%d.tif", folder.c_str(), i + 1);
            //const string filepath(buffer);

            var filepath = util.format("%smultipage_p%d.tif", folder, i + 1);

            var page = alvision.imread(filepath, flags);
            alvision.ASSERT_TRUE(mats_equal(page, pages[i]));
        }
    }

    
    public run(iii : alvision.int) : void
    {
        this.compare(alvision.ImreadModes.IMREAD_UNCHANGED);
        this.compare(alvision.ImreadModes.IMREAD_GRAYSCALE);
        this.compare(alvision.ImreadModes.IMREAD_COLOR);
        this.compare(alvision.ImreadModes.IMREAD_ANYDEPTH);
        this.compare(alvision.ImreadModes.IMREAD_ANYCOLOR);
        // compare(alvision.ImreadModes.IMREAD_LOAD_GDAL); // GDAL does not support multi-page TIFFs
    }
};

alvision.cvtest.TEST('Imgcodecs_Tiff', 'decode_multipage', () => {

    var test = new CV_GrfmtReadTifMultiPage(); test.safe_run();
});

//#endif

//#ifdef HAVE_WEBP

//alvision.cvtest.TEST('Imgcodecs_WebP', 'encode_decode_lossless_webp', () => {
//    var ts = alvision.cvtest.TS.ptr();
//    var input = ts.get_data_path() + "../cv/shared/lena.png";
//    var img = alvision.imread(input);
//    alvision.ASSERT_FALSE(img.empty());
//
//    var output = alvision.tempfile(".webp");
//    alvision.EXPECT_NO_THROW(()=>alvision.imwrite(output, img)); // lossless
//
//    var img_webp = alvision.imread(output);
//
//
//    std::vector < unsigned char> buf;
//
//    FILE * wfile = NULL;
//
//    wfile = fopen(output.c_str(), "rb");
//    if (wfile != NULL) {
//        fseek(wfile, 0, SEEK_END);
//        size_t wfile_size = ftell(wfile);
//        fseek(wfile, 0, SEEK_SET);
//
//        buf.resize(wfile_size);
//
//        size_t data_size = fread(&buf[0], 1, wfile_size, wfile);
//
//        if (wfile) {
//            fclose(wfile);
//        }
//
//        if (data_size != wfile_size) {
//            EXPECT_TRUE(false);
//        }
//    }
//
//    remove(output);
//
//    var decode = alvision.imdecode(buf,alvision.ImreadModes. IMREAD_COLOR);
//    alvision.ASSERT_FALSE(decode.empty());
//    alvision.EXPECT_TRUE(alvision.cvtest.norm(decode, img_webp, alvision.NormTypes.NORM_INF) == 0);
//
//    alvision.ASSERT_FALSE(img_webp.empty());
//
//    alvision.EXPECT_TRUE(alvision.cvtest.norm(img, img_webp, alvision.NormTypes. NORM_INF) == 0);
//});

alvision.cvtest.TEST('Imgcodecs_WebP', 'encode_decode_lossy_webp',()=>{
    var ts = alvision.cvtest.TS.ptr();
    var input = ts.get_data_path() + "../cv/shared/lena.png";
    var img = alvision.imread(input);
    alvision.ASSERT_FALSE(img.empty());

    for (var q = 100; q >= 0; q -= 20)
    {
        var params = new Array<alvision.IimwriteParameter>();
        params.push({ flag: alvision.ImwriteFlags.IMWRITE_WEBP_QUALITY,value: q });

        var output = alvision.tempfile(".webp");

        alvision.EXPECT_NO_THROW(()=>alvision.imwrite(output, img, params));
        var img_webp = alvision.imread(output);
        remove(output);
        alvision.EXPECT_FALSE(img_webp == null);
        alvision.EXPECT_EQ(3, img_webp.channels());
        alvision.EXPECT_EQ(512, img_webp.cols);
        alvision.EXPECT_EQ(512, img_webp.rows);
    }
});

alvision.cvtest.TEST('Imgcodecs_WebP', 'encode_decode_with_alpha_webp', () => {
    var ts = alvision.cvtest.TS.ptr();
    var input = ts.get_data_path() + "../cv/shared/lena.png";
    var img = alvision.imread(input);
    alvision.ASSERT_FALSE(img.empty());

    
    var imgs = new Array<alvision.IOArray>();
    alvision.split(img, imgs);
    imgs.push(new alvision.Mat(<any>imgs[0]));
    imgs[imgs.length - 1] = alvision.Scalar.all(128);
    alvision.merge(imgs, img);

    var output = alvision.tempfile(".webp");

    alvision.EXPECT_NO_THROW(()=>alvision.imwrite(output, img));
    var img_webp = alvision.imread(output);
    remove(output);
    alvision.EXPECT_FALSE(img_webp.empty());
    alvision.EXPECT_EQ(4, img_webp.channels());
    alvision.EXPECT_EQ(512, img_webp.cols);
    alvision.EXPECT_EQ(512, img_webp.rows);
});

//#endif

alvision.cvtest.TEST('Imgcodecs_Hdr', 'regression',()=>{
    var folder = alvision.cvtest.TS.ptr().get_data_path() + "/readwrite/";
    var name_rle = folder + "rle.hdr";
    var name_no_rle = folder + "no_rle.hdr";
    var img_rle = alvision.imread(name_rle, -1);
    alvision.ASSERT_FALSE(img_rle == null,"Could not open " + name_rle);
    var img_no_rle = alvision.imread(name_no_rle, -1);
    alvision.ASSERT_FALSE(img_no_rle == null, "Could not open " + name_no_rle);

    var min = 0.0;
    var max = 1.0;

    alvision.minMaxLoc(alvision.MatExpr.abs(alvision.MatExpr.op_Substraction(img_rle, img_no_rle)), (minVal, maxVal, minIdx, maxIdx) => { min = minVal.valueOf(); max = maxVal.valueOf();});
    alvision.ASSERT_FALSE(max > alvision.DBL_EPSILON);
    var tmp_file_name = alvision.tempfile(".hdr");
    //vector < int > param(1);
    //doesn't make sense!
    var param = new Array<alvision.IimwriteParameter>();
    for (var i = 0; i < 2; i++) {
        param = [];
        param.push({ flag : i, value : 0 });
        //param[0] = i;
        alvision.imwrite(tmp_file_name, img_rle, param);
        var written_img = alvision.imread(tmp_file_name, -1);
        alvision.ASSERT_FALSE(written_img == null, "Could not open " + tmp_file_name);
        alvision.minMaxLoc(alvision.MatExpr.abs(alvision.MatExpr.op_Substraction(img_rle, written_img)), (minVal, maxVal) => { min = minVal.valueOf(); max = maxVal.valueOf(); });
        alvision.ASSERT_FALSE(max > alvision.DBL_EPSILON);
    }
});
