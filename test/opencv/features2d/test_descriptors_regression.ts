//TODO: implement 2nd stage
///*M///////////////////////////////////////////////////////////////////////////////////////
////
////  IMPORTANT: READ BEFORE DOWNLOADING, COPYING, INSTALLING OR USING.
////
////  By downloading, copying, installing or using the software you agree to this license.
////  If you do not agree to this license, do not download, install,
////  copy or use the software.
////
////
////                        Intel License Agreement
////                For Open Source Computer Vision Library
////
//// Copyright (C) 2000, Intel Corporation, all rights reserved.
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
////   * The name of Intel Corporation may not be used to endorse or promote products
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

////#include "test_precomp.hpp"
////
////using namespace std;
////using namespace cv;

//const FEATURES2D_DIR = "features2d";
//const IMAGE_FILENAME = "tsukuba.png";
//const DESCRIPTOR_DIR = FEATURES2D_DIR + "/descriptor_extractors";

///****************************************************************************************\
//*                     Regression tests for descriptor extractors.                        *
//\****************************************************************************************/
//function writeMatInBin(mat: alvision.Mat, filename :string ) : void
//{
//    //TODO: implement using node fs
//    //FILE* f = fopen( filename, "wb");
//    //if( f )
//    //{
//    //    let type = mat.type();
//    //    fwrite( (void*)&mat.rows, sizeof(int), 1, f );
//    //    fwrite( (void*)&mat.cols, sizeof(int), 1, f );
//    //    fwrite( (void*)&type, sizeof(int), 1, f );
//    //    int dataSize = (int)(mat.step * mat.rows * mat.channels());
//    //    fwrite( (void*)&dataSize, sizeof(int), 1, f );
//    //    fwrite( (void*)mat.ptr(), 1, dataSize, f );
//    //    fclose(f);
//    //}
//}

//function readMatFromBin(filename  : string) : alvision.Mat
//{
//    //TODO: implement using node fs

//    //FILE* f = fopen( filename, "rb" );
//    //if( f )
//    //{
//    //    int rows, cols, type, dataSize;
//    //    size_t elements_read1 = fread( (void*)&rows, sizeof(int), 1, f );
//    //    size_t elements_read2 = fread( (void*)&cols, sizeof(int), 1, f );
//    //    size_t elements_read3 = fread( (void*)&type, sizeof(int), 1, f );
//    //    size_t elements_read4 = fread( (void*)&dataSize, sizeof(int), 1, f );
//    //    CV_Assert(elements_read1 == 1 && elements_read2 == 1 && elements_read3 == 1 && elements_read4 == 1);
//    //
//    //    int step = dataSize / rows / CV_ELEM_SIZE(type);
//    //    CV_Assert(step >= cols);
//    //
//    //    Mat m = Mat(rows, step, type).colRange(0, cols);
//    //
//    //    size_t elements_read = fread( m.ptr(), 1, dataSize, f );
//    //    CV_Assert(elements_read == (size_t)(dataSize));
//    //    fclose(f);
//    //
//    //    return m;
//    //}
//    //return new alvision. Mat();
//}

////template<class Distance>
//class CV_DescriptorExtractorTest<Distance> extends alvision.cvtest.BaseTest {
//    //typedef typename Distance::ValueType ValueType;
//    //typedef typename Distance::ResultType DistanceType;

//    constructor(_name: string, _maxDist: Distance, _dextractor: alvision.DescriptorExtractor,
//        d: Distance = new Distance(), _detector: alvision.FeatureDetector /*= Ptr<FeatureDetector>()*/) {
//        super();
//        this.name = (_name);
//        this.maxDist = (_maxDist);
//        this.dextractor = (_dextractor);
//        this.distance = (d);
//        this.detector = (_detector);
//    }

//    createDescriptorExtractor(): void { }

//    compareDescriptors(validDescriptors: alvision.Mat, calcDescriptors: alvision.Mat): void {
//        if (validDescriptors.size != calcDescriptors.size || validDescriptors.type() != calcDescriptors.type()) {
//            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Valid and computed descriptors matrices must have the same size and type.\n");
//            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
//            return;
//        }

//        alvision.CV_Assert(() => DataType<ValueType>::type == validDescriptors.type());

//        var dimension = validDescriptors.cols;
//        DistanceType curMaxDist = std::numeric_limits<DistanceType>::min();
//        for (var y = 0; y < validDescriptors.rows; y++) {
//            DistanceType dist = distance(validDescriptors.ptr<ValueType>(y), calcDescriptors.ptr<ValueType>(y), dimension);
//            if (dist > curMaxDist)
//                curMaxDist = dist;
//        }

//        //stringstream ss;
//        var ss = "";
//        ss += "Max distance between valid and computed descriptors " + curMaxDist;
//        if (curMaxDist <= this.maxDist)
//            ss += "." + "\r\n";
//        else {
//            ss += ">" + maxDist + " - bad accuracy! \r\n";
//            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
//        }
//        this.ts.printf(alvision.cvtest.TSConstants.LOG, ss);
//    }

//    emptyDataTest(): void {
//        alvision.assert(()=>this.dextractor != null);

//        // One image.
//        var image = new alvision.Mat();
//        var keypoints = new Array<alvision.KeyPoint>();
//        var descriptors = new alvision.Mat();

//        try {
//            this.dextractor.compute(image, keypoints, descriptors);
//        }
//        catch (e) {
//            this.ts.printf(alvision.cvtest.TSConstants.LOG, "compute() on empty image and empty keypoints must not generate exception (1).\n");
//            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
//        }

//        image.create(50, 50,alvision.MatrixType. CV_8UC3);
//        try {
//            this.dextractor.compute(image, keypoints, descriptors);
//        }
//        catch (e) {
//            this.ts.printf(alvision.cvtest.TSConstants.LOG, "compute() on nonempty image and empty keypoints must not generate exception (1).\n");
//            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
//        }

//        // Several images.
//        var images = new Array<alvision.Mat>();
//        var keypointsCollection = new Array<Array<alvision.KeyPoint>>();
//        var descriptorsCollection = new Array<alvision.Mat>();
//        try {
//            this.dextractor.compute(images, keypointsCollection, descriptorsCollection);
//        }
//        catch (e) {
//            this.ts.printf(alvision.cvtest.TSConstants.LOG, "compute() on empty images and empty keypoints collection must not generate exception (2).\n");
//            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
//        }
//    }

//    regressionTest(): void {
//        alvision.assert(()=>this.dextractor != null);

//        // Read the test image.
//        var imgFilename = this.ts.get_data_path() + FEATURES2D_DIR + "/" + IMAGE_FILENAME;
//        var img = alvision.imread(imgFilename);
//        if (img.empty()) {
//            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Image %s can not be read.\n", imgFilename);
//            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
//            return;
//        }
//        var keypoints = new Array<alvision.KeyPoint>();
//        var fs = new alvision.FileStorage (this.ts.get_data_path() + FEATURES2D_DIR + "/keypoints.xml.gz", alvision.FileStorageMode.READ);
//        if (!this.detector.empty()) {
//            this.detector.detect(img, (kp) => { keypoints = kp; });
//        } else {
//            read(fs.getFirstTopLevelNode(), keypoints);
//        }
//        if (!keypoints.length) {
//            var calcDescriptors = new alvision.Mat();
//            var t = getTickCount();
//            this.dextractor.compute(img, keypoints, calcDescriptors);
//            t = getTickCount() - t;
//            this.ts.printf(alvision.cvtest.TSConstants.LOG, "\nAverage time of computing one descriptor = %g ms.\n", t / (getTickFrequency() * 1000.) / calcDescriptors.rows);

//            if (calcDescriptors.rows != keypoints.length )
//            {
//                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Count of computed descriptors and keypoints count must be equal.\n");
//                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Count of keypoints is            %d.\n", keypoints.length);
//                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Count of computed descriptors is %d.\n", calcDescriptors.rows);
//                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
//                return;
//            }

//            if (calcDescriptors.cols != this.dextractor.descriptorSize() || calcDescriptors.type() != this.dextractor.descriptorType()) {
//                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Incorrect descriptor size or descriptor type.\n");
//                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Expected size is   %d.\n", this.dextractor.descriptorSize());
//                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Calculated size is %d.\n", calcDescriptors.cols);
//                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Expected type is   %d.\n", this.dextractor.descriptorType());
//                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Calculated type is %d.\n", calcDescriptors.type());
//                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
//                return;
//            }

//            // TODO read and write descriptor extractor parameters and check them
//            var validDescriptors = this.readDescriptors();
//            if (!validDescriptors.empty())
//                this.compareDescriptors(validDescriptors, calcDescriptors);
//            else {
//                if (!this.writeDescriptors(calcDescriptors)) {
//                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "Descriptors can not be written.\n");
//                    this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
//                    return;
//                }
//            }
//        }
//        if (!fs.isOpened()) {
//            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Compute and write keypoints.\n");
//            fs.open(this.ts.get_data_path() + FEATURES2D_DIR + "/keypoints.xml.gz", alvision.FileStorageMode.WRITE);
//            if (fs.isOpened()) {
//                var fd = alvision.ORB.create();
//                fd.detect(img, (kp) => { keypoints = kp; });
//                write(fs, "keypoints", keypoints);
//            }
//            else {
//                this.ts.printf(alvision.cvtest.TSConstants.LOG, "File for writting keypoints can not be opened.\n");
//                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
//                return;
//            }
//        }
//    }

//    run(iii: alvision.int): void {
//        this.createDescriptorExtractor();
//        if (!this.dextractor) {
//            this.ts.printf(alvision.cvtest.TSConstants.LOG, "Descriptor extractor is empty.\n");
//            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA);
//            return;
//        }

//        this.emptyDataTest();
//        this.regressionTest();

//        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);
//    }

//    readDescriptors(): alvision.Mat {
//        var res = readMatFromBin(this.ts.get_data_path() + DESCRIPTOR_DIR + "/" + this.name);
//        return res;
//    }

//    writeDescriptors(descs: alvision.Mat): boolean {
//        writeMatInBin(descs, this.ts.get_data_path() + DESCRIPTOR_DIR + "/" + this.name);
//        return true;
//    }

//    protected name: string;
//    protected maxDist: DistanceType;
//    protected dextractor: alvision.DescriptorExtractor;
//    protected distance: Distance;
//    protected detector: alvision.FeatureDetector;

//    //CV_DescriptorExtractorTest& operator=(const CV_DescriptorExtractorTest&) { return *this; }
//}

///****************************************************************************************\
//*                                Tests registrations                                     *
//\****************************************************************************************/

//alvision.cvtest.TEST('Features2d_DescriptorExtractor_BRISK', 'regression', () => {
//    var test = new CV_DescriptorExtractorTest<alvision.Hamming>("descriptor-brisk",
//        2.,
//        alvision.BRISK.create());
//    test.safe_run();
//});

//alvision.cvtest.TEST('Features2d_DescriptorExtractor_ORB', 'regression', () => {
//    // TODO adjust the parameters below
//    var test = new CV_DescriptorExtractorTest<alvision.Hamming>("descriptor-orb",
//        //#if CV_NEON
//        25.,
//        //#else
//        //                                              (CV_DescriptorExtractorTest<Hamming>::DistanceType)12.f,
//        //#endif
//        alvision.ORB.create());
//    test.safe_run();

//    var test = new CV_DescriptorExtractorTest<alvision.Hamming>("descriptor-orb",
//        (CV_DescriptorExtractorTest<alvision.Hamming>::DistanceType)12.,
//        alvision.ORB.create());
//    test.safe_run();
//});

//alvision.cvtest.TEST('Features2d_DescriptorExtractor_KAZE', 'regression', () => {
//    var test = new CV_DescriptorExtractorTest<alvision.L2<alvision.float>> ("descriptor-kaze", 0.03,
//        alvision.KAZE.create(),
//        L2<float>(), alvision.KAZE.create());
//    test.safe_run();
//});

//alvision.cvtest.TEST('Features2d_DescriptorExtractor_AKAZE', 'regression', () => {
//    var test = new CV_DescriptorExtractorTest<alvision.Hamming> ("descriptor-akaze",
//        12.,
//        alvision.AKAZE.create(),
//        alvision.Hamming(), alvision.AKAZE.create());
//    test.safe_run();
//);

//alvision.cvtest.TEST('Features2d_DescriptorExtractor', 'batch', () => {
//    var path =  alvision.cvtest.TS.ptr().get_data_path() + "detectors_descriptors_evaluation/images_datasets/graf";
//    var imgs = new Array<alvision.Mat>(), descriptors = new Array<alvision.Mat>();
//    var keypoints = new Array<Array<alvision.KeyPoint>>();
//    var n = 6;
//    var orb = alvision.ORB.create();

//    for (var i = 0; i < n; i++) {
//        var imgname = util.format("%s/img%d.png", path, i + 1);
//        var img = alvision.imread(imgname, 0);
//        imgs.push(img);
//    }

//    orb.detect(imgs, keypoints);
//    orb.compute(imgs, keypoints, descriptors);

//    alvision.ASSERT_EQ(keypoints.length, n);
//    alvision.ASSERT_EQ(descriptors.length, n);

//    for (var i = 0; i < n; i++) {
//        alvision.EXPECT_GT(keypoints[i].length, 100);
//        alvision.EXPECT_GT(descriptors[i].rows, 100);
//    }
//});

//alvision.cvtest.TEST('Features2d_Feature2d', 'no_crash', () => {
//    const pattern = alvision.cvtest.TS.ptr().get_data_path() + "shared/*.png";
//    var fnames = new Array<string>();
//    glob(pattern, fnames, false);
//    sort(fnames.begin(), fnames.end());

//    var akaze = alvision.AKAZE.create();
//    var orb = alvision.ORB.create();
//    var kaze = alvision.KAZE.create();
//    var brisk = alvision.BRISK.create();
//    var n = fnames.length;
//    var keypoints = new Array<alvision.KeyPoint>();
//    var descriptors = new alvision.Mat();
//    orb.setMaxFeatures(5000);

//    for (var i = 0; i < n; i++) {
//        console.log(util.format("%d. image: %s:\n", i, fnames[i]));
//        if (fnames[i].indexOf( "MP.png") != -1)
//            continue;
//        var checkCount = fnames[i].indexOf("templ.png") != -1;

//        var img = alvision.imread(fnames[i], -1);
//        console.log(util.format("\tAKAZE ... "));// fflush(stdout);
//        akaze.detectAndCompute(img, null, (kp) => { keypoints = kp; }, descriptors);
//        console.log(util.format("(%d keypoints) ", keypoints.length)); //fflush(stdout);
//        if (checkCount) {
//            alvision.EXPECT_GT(keypoints.length, 0);
//        }
//        alvision.ASSERT_EQ(descriptors.rows, keypoints.length);
//        console.log(util.format("ok\n"));

//        console.log(util.format("\tKAZE ... ")); //fflush(stdout);
//        kaze.detectAndCompute(img, null, (kp) => { keypoints = kp; }, descriptors);
//        console.log(util.format("(%d keypoints) ", keypoints.length)); //fflush(stdout);
//        if (checkCount) {
//            alvision.EXPECT_GT(keypoints.length, 0);
//        }
//        alvision.ASSERT_EQ(descriptors.rows, keypoints.length);
//        console.log(util.format("ok\n"));

//        console.log(util.format("\tORB ... ")); //fflush(stdout);
//        orb.detectAndCompute(img, null, (kp) => { keypoints = kp; }, descriptors);
//        console.log(util.format("(%d keypoints) ", keypoints.length)); //fflush(stdout);
//        if (checkCount) {
//            alvision.EXPECT_GT(keypoints.length, 0);
//        }
//        alvision.ASSERT_EQ(descriptors.rows, keypoints.length);
//        console.log(util.format("ok\n"));

//        console.log(util.format("\tBRISK ... ")); //fflush(stdout);
//        brisk.detectAndCompute(img, null, (kp) => { keypoints = kp; }, descriptors);
//        console.log(util.format("(%d keypoints) ", keypoints.length)); //fflush(stdout);
//        if (checkCount) {
//            alvision.EXPECT_GT(keypoints.length, 0);
//        }
//        alvision.ASSERT_EQ(descriptors.rows, keypoints.length);
//        console.log(util.format("ok\n"));
//    }
//});
