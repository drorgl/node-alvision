//TODO: implement
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

//import async = require("async");
//import alvision = require("../../../tsbinding/alvision");
//import util = require('util');
//import fs = require('fs');


////#include "test_precomp.hpp"
////#include "opencv2/imgproc.hpp"
////#include "opencv2/objdetect/objdetect_c.h"
////
////using namespace cv;
////using namespace std;

////#define GET_STAT

//const DIST_E = "distE";
//const S_E         =        "sE"     ;
//const NO_PAIR_E   =        "noPairE";
////#define TOTAL_NO_PAIR_E     "totalNoPairE"

//const DETECTOR_NAMES    =  "detector_names" ;
//const DETECTORS         =  "detectors"      ;
//const IMAGE_FILENAMES   =  "image_filenames";
//const VALIDATION        =  "validation"     ;
//const FILENAME = "fn";

//const C_SCALE_CASCADE = "scale_cascade";

//class CV_DetectorTest extends alvision.cvtest.BaseTest {
//    constructor() {
//        super();
//        this.configFilename = "dummy";
//        this.write_results = false;
//    }

//    prepareData(_fs: alvision.FileStorage): alvision.int {
//        if (!_fs.isOpened())
//            this.test_case_count = -1;
//        else {
//            var fn = _fs.getFirstTopLevelNode();

//            this.eps.dist = fn.nodes[DIST_E].readFloat();
//            this.eps.s = fn.nodes[S_E].readFloat();
//            this.eps.noPair = fn.nodes[NO_PAIR_E].readFloat();
//            //        fn[TOTAL_NO_PAIR_E] >> eps.totalNoPair;

//            // read detectors
//            if (fn[DETECTOR_NAMES].size() != 0) {
//                for (let it of fn[DETECTOR_NAMES].data) {
//                    let _name = it.readString();
//                    this.detectorNames.push(_name);
//                    this.readDetector(fn[DETECTORS][_name]);
//                }
//            }
//            this.test_case_count = this.detectorNames.length;

//            // read images filenames and images
//            var dataPath = this.ts.get_data_path();
//            if (fn[IMAGE_FILENAMES].size() != 0) {
//                for (let it of fn[IMAGE_FILENAMES].data){
//                    let filename = it.readString();
//                    this.imageFilenames.push(filename);
//                    var img = alvision.imread(dataPath + filename, 1);
//                    this.images.push(img);
//                }
//            }
//        }
//        return alvision.cvtest.FailureCode.OK;
//    }
//    run(startFrom: alvision.int): void {
//        var dataPath = this.ts.get_data_path();
//        var vs_filename = dataPath + this.getValidationFilename();

//        this.write_results = !this.validationFS.open(vs_filename, alvision.FileStorageMode.READ);

//        var code: alvision.int;

//        if (!this.write_results) {
//            code = this.prepareData(this.validationFS);
//        }
//        else {
//            var fs0 = new alvision.FileStorage(dataPath + this.configFilename, alvision.FileStorageMode.READ);
//            code = this.prepareData(fs0);
//        }

//        if (code < 0) {
//            this.ts.set_failed_test_info(code);
//            return;
//        }

//        if (this.write_results) {
//            this.validationFS.release();
//            this.validationFS.open(vs_filename, alvision.FileStorageMode.WRITE);
//            this.validationFS.writeScalarString(alvision.FileStorage.getDefaultObjectName(this.validationFilename));
//            this.validationFS.writeScalarString("{");

//            this.validationFS.writeFloat(DIST_E, this.eps.dist);
//            this.validationFS.writeFloat(S_E, this.eps.s);
//            this.validationFS.writeFloat(NO_PAIR_E, this.eps.noPair);
//            //    validationFS << TOTAL_NO_PAIR_E << eps.totalNoPair;

//            // write detector names
//            this.validationFS.writeScalarString(DETECTOR_NAMES);
//            this.validationFS.writeScalarString("[");

//            for (let nit of this.detectorNames) {
//                this.validationFS.writeScalarString(nit);
//            }
//            this.validationFS.writeScalarString( "]"); // DETECTOR_NAMES

//            // write detectors
//            this.validationFS.writeScalarString(DETECTORS);
//            this.validationFS.writeScalarString("{");
//            alvision.assert(() => this.detectorNames.length == this.detectorFilenames.length);
//            for (let nit of this.detectorNames) {
//                this.validationFS.writeScalarString(nit);
//                this.validationFS.writeScalarString("{");
//                this.writeDetector(this.validationFS, di);
//                this.validationFS.writeScalarString("}");
//            }

//            this.validationFS.writeScalarString("}");

//            // write image filenames
//            this.validationFS.writeScalarString(IMAGE_FILENAMES);
//            this.validationFS.writeScalarString("[");

//            let ii = 0;
//            for (let it of this.imageFilenames) {
//                let buf = util.format("%s%d", "img_", ii);
//                //cvWriteComment( validationFS.fs, buf, 0 );
//                this.validationFS.writeScalarString(it);
//                ii++;
//            }

//            this.validationFS.writeScalarString( "]"); // IMAGE_FILENAMES

//            this.validationFS.writeScalarString(VALIDATION);
//            this.validationFS.writeScalarString("{");
//        }

//        let progress = 0;
//        for (let di = 0; di < this.test_case_count; di++ )
//        {
//            progress = this.update_progress(progress, di, this.test_case_count, 0).valueOf();
//            if (this.write_results)
//                this.validationFS << detectorNames[di] << "{";
//            let objects : Array<Array<alvision.Rect>> = []
//            let temp_code = this.runTestCase(di, objects);

//            if (!this.write_results && temp_code == alvision.cvtest.FailureCode.OK)
//                temp_code = this.validate(di, objects);

//            if (temp_code != alvision.cvtest.FailureCode.OK)
//                code = temp_code;

//            if (this.write_results)
//                this.validationFS.writeScalarString( "}"); // detectorNames[di]
//        }

//        if (this.write_results) {
//            this.validationFS.writeScalarString( "}"); // VALIDATION
//            this.validationFS.writeScalarString( "}"); // getDefaultObjectName
//        }

//        if (this.test_case_count <= 0 || this.imageFilenames.length <= 0) {
//            this.ts.printf(alvision.cvtest.TSConstants.LOG, "validation file is not determined or not correct");
//            code = alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA;
//        }
//        this.ts.set_failed_test_info(code);
//    }
//    getValidationFilename(): string {
//        return this.validationFilename;
//    }

//    readDetector(fn: alvision.FileNode): void {
//    }
//    writeDetector(fs: alvision.FileStorage, di: alvision.int): void {
//    }
//    runTestCase(detectorIdx: alvision.int, objects: Array<Array<alvision.Rect>>): alvision.int {
//        let dataPath = this.ts .get_data_path(), detectorFilename : string;
//        if (this.detectorFilenames[detectorIdx.valueOf()])
//            detectorFilename = dataPath + this.detectorFilenames[detectorIdx.valueOf()];
//        console.log(util.format("detector %s\n", detectorFilename));

//        for (let ii = 0; ii < this.imageFilenames.length; ++ii )
//        {
//            let imgObjects: Array<alvision.Rect>;
//            let image = this.images[ii];
//            if (image.empty()) {
//                let msg =util.format("%s %d %s", "image ", ii, " can not be read");
//                this.ts.printf(alvision.cvtest.TSConstants.LOG, msg);
//                return alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA;
//            }
//            let code = this.detectMultiScale(detectorIdx, image, imgObjects);
//            if (code != alvision.cvtest.FailureCode.OK)
//                return code;

//            objects.push(imgObjects);

//            if (this.write_results) {
//                let buf = util.format( "%s%d", "img_", ii);
//                let imageIdxStr = buf;
//                this.validationFS.writeScalarString(imageIdxStr)
//                this.validationFS.writeScalarString("[:");
//                for (let it of imgObjects){
//                    this.validationFS.writeScalarInt(it.x);
//                    this.validationFS.writeScalarInt(it.y);
//                    this.validationFS.writeScalarInt(it.width);
//                    this.validationFS.writeScalarInt(it.height);
//                }
//                this.validationFS.writeScalarString( "]"); // imageIdxStr
//            }
//        }
//        return alvision.cvtest.FailureCode.OK;
//    }
//    detectMultiScale(di: alvision.int, img: alvision.Mat, objects: Array<alvision.Rect>): alvision.int {
//    }
//    validate(detectorIdx: alvision.int, objects: Array<Array<alvision.Rect>>): alvision.int {
//        alvision.assert(() => this.imageFilenames.length == objects.length);
//        let imageIdx = 0;
//        let totalNoPair = 0, totalValRectCount = 0;

//        for (let it of objects) {
//            let imgSize = this.images[imageIdx].size();
//            let dist = Math.min(imgSize.height.valueOf(), imgSize.width) * this.eps.dist.valueOf();
//            let wDiff = imgSize.width.valueOf() * this.eps.s.valueOf();
//            let hDiff = imgSize.height.valueOf() * this.eps.s.valueOf();

//            let noPair = 0;

//            // read validation rectangles
//            let buf = util.format("%s%d", "img_", imageIdx);
//            let imageIdxStr = buf;
//            let node = this.validationFS.getFirstTopLevelNode()[VALIDATION][this.detectorNames[detectorIdx.valueOf()]][imageIdxStr];
//            let valRects: Array<alvision.Rect> = [];
//            if (node.size() != 0) {
//                for (FileNodeIterator it2 = node.begin(); it2 != node.end(); )
//                {
//                    Rect r;
//                    it2 >> r.x >> r.y >> r.width >> r.height;
//                    valRects.push(r);
//                }
//            }
//            totalValRectCount += valRects.length;

//            // compare rectangles
//            let map = alvision.NewArray<alvision.uchar>(valRects.length, ()=>0);
//            for (let cr of it){
//                // find nearest rectangle
//                let cp1 =new alvision. Point2f(cr.x.valueOf() + cr.width.valueOf() / 2.0, cr.y.valueOf() + cr.height.valueOf() / 2.0 );
//                let minIdx = -1, vi = 0;
//                let minDist = alvision.norm(new alvision.Point(imgSize.width, imgSize.height));
//                for (let vr of valRects){
//                    let cp2 = new alvision.Point2f(vr.x + vr.width / 2.0, vr.y + vr.height / 2.0 );
//                    let curDist = alvision.norm(cp1.op_Substraction(cp2));
//                    if (curDist < minDist) {
//                        minIdx = vi;
//                        minDist = curDist;
//                    }
//                    vi++;
//                }
//                if (minIdx == -1) {
//                    noPair++;
//                }
//                else {
//                    let vr = valRects[minIdx];
//                    if (map[minIdx] != 0 || (minDist > dist) || (Math.abs(cr.width.valueOf() - vr.width.valueOf()) > wDiff) ||
//                        (Math.abs(cr.height.valueOf() - vr.height.valueOf()) > hDiff))
//                        noPair++;
//                    else
//                        map[minIdx] = 1;
//                }


//                imageIdx++

//            }
//            noPair += (int)count_if(map.begin(), map.end(), isZero);
//            totalNoPair += noPair;

//            alvision.EXPECT_LE(noPair, Math.round(valRects.size() * eps.noPair) + 1)
//                << "detector " << detectorNames[detectorIdx] << " has overrated count of rectangles without pair on "
//                << imageFilenames[imageIdx] << " image";

//            if (::testing::Test::HasFailure())
//            break;


//        }

//        alvision.EXPECT_LE(totalNoPair, Math.round(totalValRectCount * eps./*total*/noPair) + 1)
//            << "detector " << detectorNames[detectorIdx] << " has overrated count of rectangles without pair on all images set";

//        if (::testing::Test::HasFailure())
//        return alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;

//        return alvision.cvtest.FailureCode.OK;
//    }

//    //struct
//    //{
//    //    float dist;
//    //    float s;
//    //    float noPair;
//    //    //float totalNoPair;
//    //} eps;

//    protected eps: {
//        dist: alvision.float;
//        s: alvision.float;
//        noPair: alvision.float;
//        totalNoPair: alvision.float;
//    };

//    protected detectorNames: Array<string>;
//    protected detectorFilenames: Array<string>;
//    protected imageFilenames: Array<string>;
//    protected images: Array<alvision.Mat>;
//    protected validationFilename: string;
//    protected configFilename: string;
//    protected validationFS: alvision.FileStorage;
//    protected write_results: boolean;
//}


//function isZero(i: alvision.uchar): boolean { return i == 0; }


////----------------------------------------------- HOGDetectorTest -----------------------------------
//class CV_HOGDetectorTest extends CV_DetectorTest
//{
//    constructor() {
//        super();
//        this.validationFilename = "cascadeandhog/hog.xml";
//    }
//    readDetector(fn: alvision.FileNode ) : void {
//        let filename = "";
//        if (fn[FILENAME].size() != 0)
//            filename = fn.nodes[FILENAME].readString();
//        this.detectorFilenames.push(filename);
//}
//    writeDetector(fs: alvision.FileStorage, di: alvision.int): void {
//        fs.writeString(FILENAME,this.detectorFilenames[di.valueOf()])
//    }
//    detectMultiScale(di: alvision.int, img: alvision.Mat, objects: Array<alvision.Rect>): alvision.int {
//        let hog = new alvision.HOGDescriptor();
//        if (this.detectorFilenames[di.valueOf()].empty())
//            hog.setSVMDetector(alvision.HOGDescriptor.getDefaultPeopleDetector());
//        else
//            alvision.assert(()=>false);
//        hog.detectMultiScale(img,(locs)=> objects = locs);
//        return alvision.cvtest.FailureCode.OK;
//    }
//};



////----------------------------------------------- HOGDetectorReadWriteTest -----------------------------------
//alvision.cvtest.TEST('Objdetect_HOGDetectorReadWrite', 'regression', () => {
//    // Inspired by bug #2607
//    let img = new alvision.Mat();
//    img = alvision.imread(alvision.cvtest.TS.ptr().get_data_path() + "/cascadeandhog/images/karen-and-rob.png");
//    alvision.ASSERT_FALSE(img.empty());

//    let hog = new alvision.HOGDescriptor();
//    hog.setSVMDetector(alvision.HOGDescriptor.getDefaultPeopleDetector());

//    let tempfilename = alvision.tempfile(".xml");
//    let fs = new alvision.FileStorage (tempfilename, alvision.FileStorageMode.WRITE);
//    hog.write(fs, "myHOG");

//    fs.open(tempfilename, alvision.FileStorageMode.READ);
//    alvision.remove(tempfilename);

//    let n = fs.nodes["opencv_storage"].nodes["myHOG"];

//    alvision.ASSERT_NO_THROW(()=>hog.read(n));
//});



//alvision.cvtest.TEST('Objdetect_HOGDetector', 'regression', () => { let test = new CV_HOGDetectorTest (); test.safe_run(); });


////----------------------------------------------- HOG SSE2 compatible test -----------------------------------

//class HOGDescriptorTester extends alvision.HOGDescriptor
//{
//    public actual_hog: alvision.HOGDescriptor;
//    public ts: alvision.cvtest.TS;
//    public failed: boolean;

//    constructor(instance: alvision.HOGDescriptor) {
//        super(instance);
//        this.actual_hog = instance;
//        this.ts = alvision.cvtest.TS.ptr();
//        this.failed = false;
//    }

//    computeGradient(img: alvision.Mat, grad: alvision.Mat, qangle: alvision.Mat,
//        paddingTL: alvision.Size, paddingBR: alvision.Size ): void {
//        alvision.CV_Assert(()=>img.type() == alvision.MatrixType.CV_8U || img.type() == alvision.MatrixType.CV_8UC3);

//        let gradsize = new alvision.Size (img.cols().valueOf() + paddingTL.width.valueOf() + paddingBR.width.valueOf(),
//            img.rows().valueOf() + paddingTL.height.valueOf() + paddingBR.height.valueOf());
//        grad.create(gradsize, alvision.MatrixType.CV_32FC2);  // <magnitude*(1-alpha), magnitude*alpha>
//        qangle.create(gradsize, alvision.MatrixType.CV_8UC2); // [0..nbins-1] - quantized gradient orientation
//        let wholeSize = new alvision.Size();
//        let roiofs = new alvision.Point();
//        img.locateROI(wholeSize, roiofs);

//        //int i, x, y;
//        let cn = img.channels();

//        let _lut = new alvision.Matf_<float> (1, 256);
//        const float* lut = &_lut(0, 0);

//        if (this.gammaCorrection)
//            for (let i = 0; i < 256; i++)
//                _lut(0, i) = Math.sqrt(i);
//        else
//            for (let i = 0; i < 256; i++)
//                _lut(0, i) = i;

//        AutoBuffer < int > mapbuf(gradsize.width + gradsize.height + 4);
//        int * xmap = (int *)mapbuf + 1;
//        int * ymap = xmap + gradsize.width + 2;

//        const  borderType =alvision.BorderTypes. BORDER_REFLECT_101;

//        for (let x = -1; x < gradsize.width.valueOf() + 1; x++)
//            xmap[x] = borderInterpolate(x - paddingTL.width + roiofs.x,
//                wholeSize.width, borderType) - roiofs.x;
//        for (y = -1; y < gradsize.height + 1; y++)
//            ymap[y] = borderInterpolate(y - paddingTL.height + roiofs.y,
//                wholeSize.height, borderType) - roiofs.y;

//        // x- & y- derivatives for the whole row
//        let width = gradsize.width;
//        AutoBuffer < float > _dbuf(width * 4);
//        float * dbuf = _dbuf;
//        let Dx      = new alvision.Mat(1, width, alvision.MatrixType.CV_32F, dbuf);
//        let Dy      = new alvision.Mat(1, width, alvision.MatrixType.CV_32F, dbuf + width);
//        let Mag     = new alvision.Mat(1, width, alvision.MatrixType.CV_32F, dbuf + width * 2);
//        let Angle   = new alvision.Mat(1, width, alvision.MatrixType.CV_32F, dbuf + width * 3);

//        let _nbins = nbins;
//        let angleScale = (_nbins / Math.PI);
//        for (let y = 0; y < gradsize.height; y++) {
//            const imgPtr  = img.ptr<alvision.uchar>("uchar",ymap[y]);
//            const prevPtr = img.ptr<alvision.uchar>("uchar",ymap[y - 1]);
//            const nextPtr = img.ptr<alvision.uchar>("uchar",ymap[y + 1]);
//            let gradPtr = grad.ptr<alvision.float>("float",y);
//            let qanglePtr = qangle.ptr<alvision.uchar>("uchar",y);

//            if (cn == 1) {
//                for (let x = 0; x < width; x++) {
//                    let x1 = xmap[x];
//                    dbuf[x] = (lut[imgPtr[xmap[x + 1]]] - lut[imgPtr[xmap[x - 1]]]);
//                    dbuf[width + x] = (lut[nextPtr[x1]] - lut[prevPtr[x1]]);
//                }
//            }
//            else {
//                for (let x = 0; x < width; x++) {
//                    let  x1 = xmap[x] * 3;
//                    // dx0, dy0, dx, dy, mag0, mag;
//                    const uchar* p2 = imgPtr + xmap[x + 1] * 3;
//                    const uchar* p0 = imgPtr + xmap[x - 1] * 3;

//                    let dx0 = lut[p2[2]] - lut[p0[2]];
//                    let dy0 = lut[nextPtr[x1 + 2]] - lut[prevPtr[x1 + 2]];
//                    let mag0 = dx0 * dx0 + dy0 * dy0;

//                    let dx = lut[p2[1]] - lut[p0[1]];
//                    let dy = lut[nextPtr[x1 + 1]] - lut[prevPtr[x1 + 1]];
//                    let mag = dx * dx + dy * dy;

//                    if (mag0 < mag) {
//                        dx0 = dx;
//                        dy0 = dy;
//                        mag0 = mag;
//                    }

//                    dx = lut[p2[0]] - lut[p0[0]];
//                    dy = lut[nextPtr[x1]] - lut[prevPtr[x1]];
//                    mag = dx * dx + dy * dy;

//                    if (mag0 < mag) {
//                        dx0 = dx;
//                        dy0 = dy;
//                        mag0 = mag;
//                    }

//                    dbuf[x] = dx0;
//                    dbuf[x + width] = dy0;
//                }
//            }

//            alvision.cartToPolar(Dx, Dy, Mag, Angle, false);
//            for (let x = 0; x < width; x++) {
//                let mag = dbuf[x + width * 2], angle = dbuf[x + width * 3] * angleScale - 0.5f;
//                let hidx = Math.floor(angle);
//                angle -= hidx;
//                gradPtr[x * 2] = mag * (1.f - angle);
//                gradPtr[x * 2 + 1] = mag * angle;
//                if (hidx < 0)
//                    hidx += _nbins;
//                else if (hidx >= _nbins)
//                    hidx -= _nbins;
//                alvision.assert(()=>hidx < _nbins );

//                qanglePtr[x * 2] = (uchar)hidx;
//                hidx++;
//                hidx &= hidx < _nbins ? -1 : 0;
//                qanglePtr[x * 2 + 1] = (uchar)hidx;
//            }
//        }

//        // validation
//        let actual_mats = alvision.NewArray(2, () => new alvision.Mat());
//        let reference_mats = [ grad, qangle ];
//        const args = ["Gradient's", "Qangles's"];
//        this.actual_hog.computeGradient(img, (grad_, angles_) => { actual_mats[0] = grad_; actual_mats[1] = angles_;}, paddingTL, paddingBR);

//        const  eps = 0.0;
//        for (let i = 0; i < 2; ++i) {
//            let diff_norm = alvision.cvtest.norm(reference_mats[i], actual_mats[i], alvision.NormTypes.NORM_L2);
//            if (diff_norm > eps) {
//                this.ts.printf(alvision.cvtest.TSConstants.LOG, "%s matrices are not equal\nNorm of the difference is %lf\n", args[i], diff_norm);
//                this.ts.printf(alvision.cvtest.TSConstants.LOG, "Channels: %d\n", img.channels());
//                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
//                this.ts.set_gtest_status();
//                this.failed = true;
//                return;
//            }
//        }
//    }

//    detect1(img: alvision.Mat,
//        hits: Array<alvision.Point>, weights: Array<alvision.double>, hitThreshold: alvision.double ,
//        winStride: alvision.Size, padding: alvision.Size, locations: Array<alvision.Point> ) : void
//        {
//            if (this.failed)
//        return;

//        hits.length = 0;
//if (!this.svmDetector)
//    return;

//if (winStride == Size())
//    winStride = cellSize;
//        let cacheStride = new alvision.Size (gcd(winStride.width, blockStride.width),
//    gcd(winStride.height, blockStride.height));
//        let nwindows = locations.length;
//padding.width =  alignSize(Math.max(padding.width, 0), cacheStride.width);
//padding.height = alignSize(Math.max(padding.height, 0), cacheStride.height);
//        let paddedImgSize = new alvision.Size (img.cols + padding.width * 2, img.rows + padding.height * 2);

//        let cache = new HOGCacheTester (this, img, padding, padding, nwindows == 0, cacheStride);

//if (!nwindows)
//    nwindows = cache.windowsInImage(paddedImgSize, winStride).area();

//const HOGCacheTester::BlockData* blockData = &cache.blockData[0];

//let nblocks = cache.nblocks.area();
//let blockHistogramSize = cache.blockHistogramSize;
//let dsize = getDescriptorSize();

//let rho = svmDetector.size() > dsize ? svmDetector[dsize] : 0;
//Array < float > blockHist(blockHistogramSize);

//for (let i = 0; i < nwindows; i++ )
//{
//    let pt0 = new alvision.Point();
//    if (!locations.empty()) {
//        pt0 = locations[i];
//        if (pt0.x < -padding.width || pt0.x > img.cols + padding.width - winSize.width ||
//            pt0.y < -padding.height || pt0.y > img.rows + padding.height - winSize.height)
//            continue;
//    }
//    else {
//        pt0 = cache.getWindow(paddedImgSize, winStride, (int)i).tl() - Point(padding);
//        alvision.CV_Assert(pt0.x % cacheStride.width == 0 && pt0.y % cacheStride.height == 0);
//    }
//    let s = rho;
//    const float* svmVec = &svmDetector[0];
//    //int j, k;
//    for (let j = 0; j < nblocks; j++ , svmVec += blockHistogramSize) {
//        const  bj = blockData[j];
//        let pt = pt0.op_Addition(bj.imgOffset);

//        const float* vec = cache.getBlock(pt, &blockHist[0]);
//        for (let k = 0; k <= blockHistogramSize - 4; k += 4)
//            s += vec[k] * svmVec[k] + vec[k + 1] * svmVec[k + 1] +
//                vec[k + 2] * svmVec[k + 2] + vec[k + 3] * svmVec[k + 3];
//        for (; k < blockHistogramSize; k++)
//            s += vec[k] * svmVec[k];
//    }
//    if (s >= hitThreshold) {
//        hits.push(pt0);
//        weights.push(s);
//    }
//}

//// validation
//Array < Point > actual_find_locations;
//Array < double > actual_weights;
//actual_hog.detect(img, actual_find_locations, actual_weights,
//    hitThreshold, winStride, padding, locations);

//if (!std::equal(hits.begin(), hits.end(),
//    actual_find_locations.begin()))
//{
//    this.ts.printf(alvision.cvtest.TSConstants.SUMMARY, "Found locations are not equal (see detect function)\n");
//    this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
//    this.ts.set_gtest_status();
//    this.failed = true;
//    return;
//}

//const eps = 0.0;
//let diff_norm = alvision.cvtest.norm(actual_weights, weights, alvision.NormTypes.NORM_L2);
//if (diff_norm > eps) {
//    this.ts.printf(alvision.cvtest.TSConstants.SUMMARY, "Weights for found locations aren't equal.\nNorm of the difference is %lf\n", diff_norm);
//    this.ts.printf(alvision.cvtest.TSConstants.LOG, "Channels: %d\n", img.channels());
//    this.failed = true;
//    this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
//    this.ts.set_gtest_status();
//    return;
//}
//}

//    detect2(img: alvision.Mat, hits: Array<alvision.Point>, hitThreshold: alvision.double,
//        winStride: alvision.Size, padding: alvision.Size, locations: Array<alvision.Point>): void {
//        let weightsV: Array<alvision.double>;
//        this.detect1(img, hits, weightsV, hitThreshold, winStride, padding, locations);
//    }

//    compute(_img: alvision.InputArray, descriptors: Array<alvision.float> ,
//        winStride: alvision.Size, padding: alvision.Size, locations: Array<alvision.Point>  ) : void 
//        {
//            let img = _img.getMat();

//if (winStride == Size())
//    winStride = cellSize;
//        let cacheStride = new alvision.Size(gcd(winStride.width, blockStride.width),
//    gcd(winStride.height, blockStride.height));
//let nwindows = locations.size();
//padding.width = (int)alignSize(Math.max(padding.width, 0), cacheStride.width);
//padding.height = (int)alignSize(Math.max(padding.height, 0), cacheStride.height);
//        let paddedImgSize = new alvision.Size (img.cols + padding.width * 2, img.rows + padding.height * 2);

//        let cache = new HOGCacheTester (this, img, padding, padding, nwindows == 0, cacheStride);

//if (!nwindows)
//    nwindows = cache.windowsInImage(paddedImgSize, winStride).area();

//const HOGCacheTester::BlockData* blockData = &cache.blockData[0];

//let nblocks = cache.nblocks.area();
//let blockHistogramSize = cache.blockHistogramSize;
//let dsize = getDescriptorSize();
//descriptors.resize(dsize * nwindows);

//        for (let i = 0; i < nwindows; i++) {
//            float * descriptor = &descriptors[i * dsize];

//            let pt0 = new alvision.Point();
//            if (!locations.empty()) {
//                pt0 = locations[i];
//                if (pt0.x < -padding.width || pt0.x > img.cols + padding.width - winSize.width ||
//                    pt0.y < -padding.height || pt0.y > img.rows + padding.height - winSize.height)
//                    continue;
//            }
//            else {
//                pt0 = cache.getWindow(paddedImgSize, winStride, i).tl() - Point(padding);
//                alvision.CV_Assert(pt0.x % cacheStride.width == 0 && pt0.y % cacheStride.height == 0);
//            }

//            for (let j = 0; j < nblocks; j++) {
//                const bj = blockData[j];
//                Point pt = pt0 + bj.imgOffset;

//                float * dst = descriptor + bj.histOfs;
//                const float* src = cache.getBlock(pt, dst);
//                if (src != dst)
//                    for (let k = 0; k < blockHistogramSize; k++)
//                        dst[k] = src[k];
//            }
//        }

//// validation
//        let actual_descriptors: Array<alvision.float>;
//actual_hog.compute(img, actual_descriptors, winStride, padding, locations);

//let diff_norm = alvision.cvtest.norm(actual_descriptors, descriptors, alvision.NormTypes.NORM_L2);
//const eps = 0.0;
//if (diff_norm > eps) {
//    this.ts.printf(alvision.cvtest.TSConstants.SUMMARY, "Norm of the difference: %lf\n", diff_norm);
//    this.ts.printf(alvision.cvtest.TSConstants.SUMMARY, "Found descriptors are not equal (see compute function)\n");
//    this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
//    this.ts.printf(alvision.cvtest.TSConstants.LOG, "Channels: %d\n", img.channels());
//    this.ts.set_gtest_status();
//    this.failed = true;
//    return;
//}
//}

//    is_failed(): boolean {
//        return this.failed;
//    }
//};

//interface HOGCacheTester_BlockData
//{
//    //BlockData() : histOfs(0), imgOffset() {}
//    histOfs: alvision.int;
//    imgOffset: alvision.Point;
//};

//interface HOGCacheTester_PixData
//{
//    gradOfs: alvision.size_t;
//    qangleOfs: alvision.size_t;
//    histOfs/*[4]*/ : Array<alvision.int>;
//    histWeights/*[4]*/: Array<alvision.float>;
//    gradWeight: alvision.float;
//};

//class HOGCacheTester {
//    constructor(descriptor?: HOGDescriptorTester,
//        img?: alvision.Mat, paddingTL?: alvision.Size, paddingBR?: alvision.Size,
//        useCache?: boolean, cacheStride?: alvision.Size) {

//        this.useCache = false;
//        this.blockHistogramSize = this.count1 = this.count2 = this.count4 = 0;
//        this.descriptor = null;

//        if (descriptor) {

//            this.init(descriptor, img, paddingTL, paddingBR, useCache, cacheStride);
//        }

//    }
//    //virtual ~HOGCacheTester() { }

//    init(_descriptor: HOGDescriptorTester,
//        _img: alvision.Mat, _paddingTL: alvision.Size, _paddingBR: alvision.Size,
//        _useCache: boolean, _cacheStride: alvision.Size): void {
//        this.descriptor = _descriptor;
//        this.cacheStride = _cacheStride;
//        this.useCache = _useCache;

//        this.descriptor.computeGradient(_img, this.grad, this.qangle, _paddingTL, _paddingBR);
//        this.imgoffset = _paddingTL;

//        this.winSize = this.descriptor.winSize;
//        let blockSize = this.descriptor.blockSize;
//        let blockStride = this.descriptor.blockStride;
//        let cellSize = this.descriptor.cellSize;
//        //int i, j,
//        let nbins = this.descriptor.nbins;
//        let rawBlockSize = blockSize.width.valueOf() * blockSize.height.valueOf();

//        this.nblocks = new alvision.Size((this.winSize.width.valueOf() - blockSize.width.valueOf()) / blockStride.width.valueOf() + 1,
//            (this.winSize.height.valueOf() - blockSize.height.valueOf()) / blockStride.height.valueOf() + 1);
//        this.ncells =new alvision. Size(blockSize.width.valueOf() / cellSize.width.valueOf(), blockSize.height.valueOf() / cellSize.height.valueOf());
//        this.blockHistogramSize = this.ncells.width.valueOf() * this.ncells.height.valueOf() * nbins.valueOf();

//        if (this.useCache) {
//            let cacheSize = new alvision.Size((this.grad.cols - blockSize.width) / cacheStride.width + 1,
//                (this.winSize.height.valueOf() / this.cacheStride.height) + 1);
//            this.blockCache.create(cacheSize.height, cacheSize.width.valueOf() * blockHistogramSize);
//            this.blockCacheFlags.create(cacheSize);
//            let cacheRows = this.blockCache.rows();
//            this.ymaxCached.length = cacheRows.valueOf();
//            for (let ii = 0; ii < cacheRows; ii++)
//                this.ymaxCached[ii] = -1;
//        }

//        let weights = new alvision.Mat_<float>(blockSize);
//        let sigma = this.descriptor.getWinSigma();
//        let scale = 1. / (sigma.valueOf() * sigma.valueOf() * 2);

//        for (let i = 0; i < blockSize.height; i++)
//            for (let j = 0; j < blockSize.width; j++) {
//                let di = i - blockSize.height.valueOf() * 0.5;
//                let dj = j - blockSize.width.valueOf() * 0.5;
//                weights(i, j) = Math.exp(-(di * di + dj * dj) * scale);
//            }

//        this.blockData.resize(nblocks.width * nblocks.height);
//        this.pixData.resize(rawBlockSize * 3);

//        // Initialize 2 lookup tables, pixData & blockData.
//        // Here is why:
//        //
//        // The detection algorithm runs in 4 nested loops (at each pyramid layer):
//        //  loop over the windows within the input image
//        //    loop over the blocks within each window
//        //      loop over the cells within each block
//        //        loop over the pixels in each cell
//        //
//        // As each of the loops runs over a 2-dimensional array,
//        // we could get 8(!) nested loops in total, which is very-very slow.
//        //
//        // To speed the things up, we do the following:
//        //   1. loop over windows is unrolled in the HOGDescriptor::{compute|detect} methods;
//        //         inside we compute the current search window using getWindow() method.
//        //         Yes, it involves some overhead (function call + couple of divisions),
//        //         but it's tiny in fact.
//        //   2. loop over the blocks is also unrolled. Inside we use pre-computed blockData[j]
//        //         to set up gradient and histogram pointers.
//        //   3. loops over cells and pixels in each cell are merged
//        //       (since there is no overlap between cells, each pixel in the block is processed once)
//        //      and also unrolled. Inside we use PixData[k] to access the gradient values and
//        //      update the histogram
//        //
//        this.count1 = this.count2 = this.count4 = 0;
//        for (let j = 0; j < blockSize.width; j++)
//            for (let i = 0; i < blockSize.height; i++) {
//                let data: HOGCacheTester_PixData;
//                let cellX = (j + 0.5) / cellSize.width.valueOf() - 0.5;
//                let cellY = (i + 0.5) / cellSize.height.valueOf() - 0.5;
//                let icellX0 = Math.floor(cellX);
//                let icellY0 = Math.floor(cellY);
//                let icellX1 = icellX0 + 1, icellY1 = icellY0 + 1;
//                cellX -= icellX0;
//                cellY -= icellY0;

//                if (icellX0 < this.ncells.width &&
//                    icellX1 < this.ncells.width) {
//                    if (icellY0 < this.ncells.height &&
//                        icellY1 < this.ncells.height) {
//                        data = this.pixData[rawBlockSize * 2 + (this.count4++)];
//                        data.histOfs[0] = (icellX0 * this.ncells.height.valueOf() + icellY0) * nbins.valueOf();
//                        data.histWeights[0] = (1. - cellX) * (1. - cellY);
//                        data.histOfs[1] = (icellX1 * this.ncells.height.valueOf() + icellY0) * nbins.valueOf();
//                        data.histWeights[1] = cellX * (1. - cellY);
//                        data.histOfs[2] = (icellX0 * this.ncells.height.valueOf() + icellY1) * nbins.valueOf();
//                        data.histWeights[2] = (1. - cellX) * cellY;
//                        data.histOfs[3] = (icellX1 * this.ncells.height.valueOf() + icellY1) * nbins.valueOf();
//                        data.histWeights[3] = cellX * cellY;
//                    }
//                    else {
//                        data = this.pixData[rawBlockSize + (this.count2++)];
//                        if (icellY0 < this.ncells.height) {
//                            icellY1 = icellY0;
//                            cellY = 1. - cellY;
//                        }
//                        data.histOfs[0] = (icellX0 * this.ncells.height.valueOf() + icellY1) * nbins.valueOf();
//                        data.histWeights[0] = (1. - cellX)*cellY;
//                        data.histOfs[1] = (icellX1 * this.ncells.height.valueOf() + icellY1) * nbins.valueOf();
//                        data.histWeights[1] = cellX * cellY;
//                        data.histOfs[2] = data.histOfs[3] = 0;
//                        data.histWeights[2] = data.histWeights[3] = 0;
//                    }
//                }
//                else {
//                    if (icellX0 < this.ncells.width) {
//                        icellX1 = icellX0;
//                        cellX = 1. - cellX;
//                    }

//                    if (icellY0 < this.ncells.height &&
//                        icellY1 < this.ncells.height) {
//                        data = this.pixData[rawBlockSize + (this.count2++)];
//                        data.histOfs[0] = (icellX1 * this.ncells.height.valueOf() + icellY0) * nbins.valueOf();
//                        data.histWeights[0] = cellX * (1. - cellY);
//                        data.histOfs[1] = (icellX1 * this.ncells.height.valueOf() + icellY1) * nbins.valueOf();
//                        data.histWeights[1] = cellX * cellY;
//                        data.histOfs[2] = data.histOfs[3] = 0;
//                        data.histWeights[2] = data.histWeights[3] = 0;
//                    }
//                    else {
//                        data = this.pixData[this.count1++];
//                        if (icellY0 < this.ncells.height) {
//                            icellY1 = icellY0;
//                            cellY = 1. - cellY;
//                        }
//                        data.histOfs[0] = (icellX1 * this.ncells.height.valueOf() + icellY1) * nbins.valueOf();
//                        data.histWeights[0] = cellX * cellY;
//                        data.histOfs[1] = data.histOfs[2] = data.histOfs[3] = 0;
//                        data.histWeights[1] = data.histWeights[2] = data.histWeights[3] = 0;
//                    }
//                }
//                data.gradOfs = (grad.cols * i + j) * 2;
//                data.qangleOfs = (qangle.cols * i + j) * 2;
//                data.gradWeight = weights(i, j);
//            }

//        alvision.assert(()=>(this.count1.valueOf() + this.count2.valueOf() + this.count4.valueOf()) == rawBlockSize);
//        // defragment pixData
//        for (let j = 0; j < this.count2; j++)
//            this.pixData[j + this.count1.valueOf()] = this.pixData[j + rawBlockSize];
//        for (let j = 0; j < this.count4; j++)
//            this.pixData[j + this.count1.valueOf() + this.count2] = this.pixData[j + rawBlockSize * 2];
//        this.count2 += this.count1.valueOf();
//        this.count4 += this.count2.valueOf();

//        // initialize blockData
//        for (let j = 0; j < this.nblocks.width; j++)
//            for (let i = 0; i < this.nblocks.height; i++) {
//                let data = this.blockData[j * this.nblocks.height + i];
//                data.histOfs = (j * this.nblocks.height + i) * blockHistogramSize;
//                data.imgOffset = new alvision.Point(j * blockStride.width, i * blockStride.height);
//            }
//    }

//    windowsInImage(imageSize: alvision.Size, winStride: alvision.Size): alvision.Size {

//        return new alvision.Size((imageSize.width.valueOf() - this.winSize.width.valueOf()) / winStride.width.valueOf() + 1,
//            (imageSize.height.valueOf() - this.winSize.height.valueOf()) / winStride.height.valueOf() + 1);

//    }
//    getWindow(imageSize: alvision.Size, winStride: alvision.Size, idx: alvision.int): alvision.Rect {


//        let nwindowsX = (imageSize.width.valueOf() - this.winSize.width.valueOf()) / winStride.width.valueOf() + 1;
//        let y = idx.valueOf() / nwindowsX;
//        let x = idx.valueOf() - nwindowsX * y;
//        return new alvision.Rect(x * winStride.width.valueOf(), y * winStride.height.valueOf(), this.winSize.width.valueOf(), this.winSize.height.valueOf());

//    }

//    getBlock(pt: alvision.Point, buf: Array<alvision.float>): Array<alvision.float> {
//        let blockHist = buf;
//        alvision.assert(() => this.descriptor != 0);

//        let blockSize = this.descriptor.blockSize;
//        pt += this.imgoffset;

//        alvision.CV_Assert(() => pt.x <= (grad.cols - blockSize.width.valueOf()) &&
//            pt.y <= (grad.rows - blockSize.height.valueOf()));

//        if (useCache) {
//            alvision.CV_Assert(() => pt.x % cacheStride.width == 0 &&
//                pt.y % cacheStride.height == 0);
//            let cacheIdx = new alvision.Point(pt.x / cacheStride.width,
//                (pt.y / cacheStride.height) % blockCache.rows);
//            if (pt.y != ymaxCached[cacheIdx.y]) {
//                Mat_ < uchar > cacheRow = blockCacheFlags.row(cacheIdx.y);
//                cacheRow = (uchar)0;
//                ymaxCached[cacheIdx.y] = pt.y;
//            }

//            blockHist = &blockCache[cacheIdx.y][cacheIdx.x * blockHistogramSize];
//            uchar & computedFlag = blockCacheFlags(cacheIdx.y, cacheIdx.x);
//            if (computedFlag != 0)
//                return blockHist;
//            computedFlag = (uchar)1; // set it at once, before actual computing
//        }

//        //int k,
//        let C1 = this.count1, C2 = this.count2, C4 = this.count4;
//        const gradPtr = this.grad.ptr<alvision.float>("float", pt.y) + pt.x * 2;
//        const qanglePtr = qangle.ptr(pt.y) + pt.x * 2;

//        alvision.CV_Assert(() => blockHist != 0);
//        for (k = 0; k < blockHistogramSize; k++)
//            blockHist[k] = 0.f;

//        const PixData* _pixData = &pixData[0];

//        for (let k = 0; k < C1; k++) {
//            const PixData& pk = _pixData[k];
//            const float* a = gradPtr + pk.gradOfs;
//            let w = pk.gradWeight * pk.histWeights[0];
//            const uchar* h = qanglePtr + pk.qangleOfs;
//            let h0 = h[0], h1 = h[1];
//            float * hist = blockHist + pk.histOfs[0];
//            let t0 = hist[h0] + a[0] * w;
//            let t1 = hist[h1] + a[1] * w;
//            hist[h0] = t0; hist[h1] = t1;
//        }

//        for (; k < C2; k++) {
//            const PixData& pk = _pixData[k];
//            const float* a = gradPtr + pk.gradOfs;
//            let w, t0, t1, a0 = a[0], a1 = a[1];
//            const uchar* h = qanglePtr + pk.qangleOfs;
//            let h0 = h[0], h1 = h[1];

//            float * hist = blockHist + pk.histOfs[0];
//            w = pk.gradWeight * pk.histWeights[0];
//            t0 = hist[h0] + a0 * w;
//            t1 = hist[h1] + a1 * w;
//            hist[h0] = t0; hist[h1] = t1;

//            hist = blockHist + pk.histOfs[1];
//            w = pk.gradWeight * pk.histWeights[1];
//            t0 = hist[h0] + a0 * w;
//            t1 = hist[h1] + a1 * w;
//            hist[h0] = t0; hist[h1] = t1;
//        }

//        for (; k < C4; k++) {
//            const PixData& pk = _pixData[k];
//            const float* a = gradPtr + pk.gradOfs;
//            let w, t0, t1, a0 = a[0], a1 = a[1];
//            const uchar* h = qanglePtr + pk.qangleOfs;
//            let h0 = h[0], h1 = h[1];

//            float * hist = blockHist + pk.histOfs[0];
//            w = pk.gradWeight * pk.histWeights[0];
//            t0 = hist[h0] + a0 * w;
//            t1 = hist[h1] + a1 * w;
//            hist[h0] = t0; hist[h1] = t1;

//            hist = blockHist + pk.histOfs[1];
//            w = pk.gradWeight * pk.histWeights[1];
//            t0 = hist[h0] + a0 * w;
//            t1 = hist[h1] + a1 * w;
//            hist[h0] = t0; hist[h1] = t1;

//            hist = blockHist + pk.histOfs[2];
//            w = pk.gradWeight * pk.histWeights[2];
//            t0 = hist[h0] + a0 * w;
//            t1 = hist[h1] + a1 * w;
//            hist[h0] = t0; hist[h1] = t1;

//            hist = blockHist + pk.histOfs[3];
//            w = pk.gradWeight * pk.histWeights[3];
//            t0 = hist[h0] + a0 * w;
//            t1 = hist[h1] + a1 * w;
//            hist[h0] = t0; hist[h1] = t1;
//        }

//        this.normalizeBlockHistogram(blockHist);

//        return blockHist;
//    }
//    normalizeBlockHistogram(histogram: float *)  : void {

//        float * hist = &_hist[0];

//        let partSum = [0.0, 0.0, 0.0, 0.0];
//        let sz = this.blockHistogramSize;

//        for (let i = 0; i <= sz - 4; i += 4) {
//            partSum[0] += hist[i] * hist[i];
//            partSum[1] += hist[i + 1] * hist[i + 1];
//            partSum[2] += hist[i + 2] * hist[i + 2];
//            partSum[3] += hist[i + 3] * hist[i + 3];
//        }
//        let t0 = partSum[0] + partSum[1];
//        let t1 = partSum[2] + partSum[3];
//        let sum = t0 + t1;
//        for (; i < sz; i++)
//            sum += hist[i] * hist[i];

//        let scale = 1. / (Math.sqrt(sum) + sz * 0.1), thresh = this.descriptor.L2HysThreshold;
//        partSum[0] = partSum[1] = partSum[2] = partSum[3] = 0.0;
//        for (let i = 0; i <= sz - 4; i += 4) {
//            hist[i] = Math.min(hist[i] * scale, thresh);
//            hist[i + 1] = Math.min(hist[i + 1] * scale, thresh);
//            hist[i + 2] = Math.min(hist[i + 2] * scale, thresh);
//            hist[i + 3] = Math.min(hist[i + 3] * scale, thresh);
//            partSum[0] += hist[i] * hist[i];
//            partSum[1] += hist[i + 1] * hist[i + 1];
//            partSum[2] += hist[i + 2] * hist[i + 2];
//            partSum[3] += hist[i + 3] * hist[i + 3];
//        }
//        t0 = partSum[0] + partSum[1];
//        t1 = partSum[2] + partSum[3];
//        sum = t0 + t1;
//        for (; i < sz; i++) {
//            hist[i] = Math.min(hist[i] * scale, thresh);
//            sum += hist[i] * hist[i];
//        }

//        scale = 1. / (Math.sqrt(sum) + 1e-3);
//        for (let i = 0; i < sz; i++)
//            hist[i] *= scale;

//    }

//    public pixData: Array<HOGCacheTester_PixData>;
//    public blockData: Array<HOGCacheTester_BlockData>;

//    public useCache: boolean;
//    public ymaxCached: Array<alvision.int>;
//    public winSize: alvision.Size;
//    public cacheStride: alvision.Size;
//    public nblocks: alvision.Size;
//    public ncells: alvision.Size;
//    public blockHistogramSize: alvision.int;
//    public count1: alvision.int;
//    public count2: alvision.int;
//    public count4: alvision.int;
//    public imgoffset: alvision.Point;
//    public blockCache: alvision.Mat_<alvision.float>;
//    public blockCacheFlags: alvision.Mat_<alvision.uchar>;

//    public grad: alvision.Mat;
//    public qangle: alvision.Mat;
//    public descriptor: HOGDescriptorTester;
//};




//function gcd(a: alvision.int, b: alvision.int ) :alvision.int  { return (a.valueOf() % b.valueOf() == 0) ? b : gcd (b, a.valueOf() % b.valueOf()); }




//alvision.cvtest.TEST('Objdetect_HOGDetector_Strict', 'accuracy',()=>
//{
//    var ts = alvision.cvtest.TS.ptr();
//    var rng = this.ts.get_rng();

//    let actual_hog = new alvision.HOGDescriptor();
//    actual_hog.setSVMDetector(alvision.HOGDescriptor.getDefaultPeopleDetector());
//    let reference_hog = new HOGDescriptorTester (actual_hog);

//    const test_case_count = 5;
//    for (let i = 0; i < test_case_count && !reference_hog.is_failed(); ++i)
//    {
//        // creating a matrix
//        let ssize = new alvision.Size (rng.uniform(1, 10) * actual_hog.winSize.width.valueOf(),
//            rng.uniform(1, 10) * actual_hog.winSize.height.valueOf());
//        let type = rng.uniform(0, 1) > 0 ? alvision.MatrixType.CV_8UC1 : alvision.MatrixType.CV_8UC3;
//        let image = new alvision.Mat (ssize, type);
//        rng.fill(image, alvision.DistType.UNIFORM, 0, 256, true);

//        // checking detect
//        let hits: Array<alvision.Point>;
//        let weights: Array<alvision.double>;
//        reference_hog.detect(image, (locs, wts) => { hits = locs; weights = wts; });

//        // checking compute
//        let descriptors: Array<alvision.float>;
//        reference_hog.compute(image,(descs)=> descriptors = descs);
//    }
// }
//);