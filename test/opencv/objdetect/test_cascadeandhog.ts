/*M///////////////////////////////////////////////////////////////////////////////////////
//
//  IMPORTANT: READ BEFORE DOWNLOADING, COPYING, INSTALLING OR USING.
//
//  By downloading, copying, installing or using the software you agree to this license.
//  If you do not agree to this license, do not download, install,
//  copy or use the software.
//
//
//                        Intel License Agreement
//                For Open Source Computer Vision Library
//
// Copyright (C) 2000, Intel Corporation, all rights reserved.
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
//   * The name of Intel Corporation may not be used to endorse or promote products
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
//#include "opencv2/imgproc.hpp"
//#include "opencv2/objdetect/objdetect_c.h"
//
//using namespace cv;
//using namespace std;

//#define GET_STAT

const DIST_E = "distE";
const S_E         =        "sE"     ;
const NO_PAIR_E   =        "noPairE";
//#define TOTAL_NO_PAIR_E     "totalNoPairE"

const DETECTOR_NAMES    =  "detector_names" ;
const DETECTORS         =  "detectors"      ;
const IMAGE_FILENAMES   =  "image_filenames";
const VALIDATION        =  "validation"     ;
const FILENAME = "fn";

const C_SCALE_CASCADE = "scale_cascade";

class CV_DetectorTest extends alvision.cvtest.BaseTest {
    constructor() {
        super();
        this.configFilename = "dummy";
        this.write_results = false;
    }

    prepareData(_fs: alvision.FileStorage): alvision.int {
        if (!_fs.isOpened())
            this.test_case_count = -1;
        else {
            var fn = _fs.getFirstTopLevelNode();

            fn[DIST_E] >> eps.dist;
            fn[S_E] >> eps.s;
            fn[NO_PAIR_E] >> eps.noPair;
            //        fn[TOTAL_NO_PAIR_E] >> eps.totalNoPair;

            // read detectors
            if (fn[DETECTOR_NAMES].size() != 0) {
                var it = fn[DETECTOR_NAMES].begin();
                for (; it != fn[DETECTOR_NAMES].end();) {
                    String _name;
                    it >> _name;
                    detectorNames.push(_name);
                    readDetector(fn[DETECTORS][_name]);
                }
            }
            this.test_case_count = this.detectorNames.length;

            // read images filenames and images
            var dataPath = this.ts.get_data_path();
            if (fn[IMAGE_FILENAMES].size() != 0) {
                for (FileNodeIterator it = fn[IMAGE_FILENAMES].begin(); it != fn[IMAGE_FILENAMES].end(); )
                {
                    String filename;
                    it >> filename;
                    imageFilenames.push(filename);
                    var img = alvision.imread(dataPath + filename, 1);
                    images.push(img);
                }
            }
        }
        return alvision.cvtest.FailureCode.OK;
    }
    run(startFrom: alvision.int): void {
        var dataPath = this.ts.get_data_path();
        var vs_filename = dataPath + getValidationFilename();

        this.write_results = !validationFS.open(vs_filename, FileStorage::READ);

        var code: alvision.int;

        if (!this.write_results) {
            code = this.prepareData(validationFS);
        }
        else {
            var fs0 = new alvision.FileStorage(dataPath + configFilename, FileStorage::READ);
            code = this.prepareData(fs0);
        }

        if (code < 0) {
            this.ts.set_failed_test_info(code);
            return;
        }

        if (this.write_results) {
            validationFS.release();
            validationFS.open(vs_filename, FileStorage::WRITE);
            validationFS << FileStorage::getDefaultObjectName(validationFilename) << "{";

            validationFS << DIST_E << eps.dist;
            validationFS << S_E << eps.s;
            validationFS << NO_PAIR_E << eps.noPair;
            //    validationFS << TOTAL_NO_PAIR_E << eps.totalNoPair;

            // write detector names
            validationFS << DETECTOR_NAMES << "[";
            Array<string>::const_iterator nit = detectorNames.begin();
            for (; nit != detectorNames.end(); ++nit) {
                validationFS << *nit;
            }
            validationFS << "]"; // DETECTOR_NAMES

            // write detectors
            validationFS << DETECTORS << "{";
            assert(detectorNames.size() == detectorFilenames.size());
            nit = detectorNames.begin();
            for (int di = 0; nit != detectorNames.end(); ++nit, di++ )
            {
                validationFS << *nit << "{";
                writeDetector(validationFS, di);
                validationFS << "}";
            }
            validationFS << "}";

            // write image filenames
            validationFS << IMAGE_FILENAMES << "[";
            Array<string>::const_iterator it = imageFilenames.begin();
            for (int ii = 0; it != imageFilenames.end(); ++it, ii++ )
            {
                char buf[10];
                sprintf(buf, "%s%d", "img_", ii);
                //cvWriteComment( validationFS.fs, buf, 0 );
                validationFS << *it;
            }
            validationFS << "]"; // IMAGE_FILENAMES

            validationFS << VALIDATION << "{";
        }

        int progress = 0;
        for (int di = 0; di < test_case_count; di++ )
        {
            progress = update_progress(progress, di, test_case_count, 0);
            if (write_results)
                validationFS << detectorNames[di] << "{";
            Array < Array < Rect > > objects;
            int temp_code = runTestCase(di, objects);

            if (!write_results && temp_code == alvision.cvtest.FailureCode.OK)
                temp_code = validate(di, objects);

            if (temp_code != alvision.cvtest.FailureCode.OK)
                code = temp_code;

            if (write_results)
                validationFS << "}"; // detectorNames[di]
        }

        if (write_results) {
            validationFS << "}"; // VALIDATION
            validationFS << "}"; // getDefaultObjectName
        }

        if (test_case_count <= 0 || imageFilenames.size() <= 0) {
            ts ->printf(alvision.cvtest.TSConstants.LOG, "validation file is not determined or not correct");
            code = alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA;
        }
        this.ts.set_failed_test_info(code);
    }
    getValidationFilename(): string {
        return this.validationFilename;
    }

    readDetector(fn: alvision.FileNode): void {
    }
    writeDetector(fs: alvision.FileStorage, di: alvision.int): void {
    }
    runTestCase(detectorIdx: alvision.int, objects: Array<Array<alvision.Rect>>): alvision.int {
        string dataPath = ts ->get_data_path(), detectorFilename;
        if (!detectorFilenames[detectorIdx].empty())
            detectorFilename = dataPath + detectorFilenames[detectorIdx];
        printf("detector %s\n", detectorFilename);

        for (int ii = 0; ii < (int)imageFilenames.size(); ++ii )
        {
            Array < Rect > imgObjects;
            Mat image = images[ii];
            if (image.empty()) {
                char msg[30];
                sprintf(msg, "%s %d %s", "image ", ii, " can not be read");
                ts ->printf(alvision.cvtest.TSConstants.LOG, msg);
                return alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA;
            }
            int code = detectMultiScale(detectorIdx, image, imgObjects);
            if (code != alvision.cvtest.FailureCode.OK)
                return code;

            objects.push(imgObjects);

            if (write_results) {
                char buf[10];
                sprintf(buf, "%s%d", "img_", ii);
                string imageIdxStr = buf;
                validationFS << imageIdxStr << "[:";
                for (Array<Rect>::const_iterator it = imgObjects.begin();
                    it != imgObjects.end(); ++it) {
                    validationFS << it ->x << it ->y << it ->width << it ->height;
                }
                validationFS << "]"; // imageIdxStr
            }
        }
        return alvision.cvtest.FailureCode.OK;
    }
    detectMultiScale(di: alvision.int, img: alvision.Mat, objects: Array<alvision.Rect>): alvision.int {
    }
    validate(detectorIdx: alvision.int, objects: Array<Array<alvision.Rect>>): alvision.int {
        assert(imageFilenames.size() == objects.size());
        int imageIdx = 0;
        int totalNoPair = 0, totalValRectCount = 0;

        for (Array<Array<Rect>>::const_iterator it = objects.begin();
            it != objects.end(); ++it, imageIdx++) // for image
        {
            Size imgSize = images[imageIdx].size();
            float dist = min(imgSize.height, imgSize.width) * eps.dist;
            float wDiff = imgSize.width * eps.s;
            float hDiff = imgSize.height * eps.s;

            int noPair = 0;

            // read validation rectangles
            char buf[10];
            sprintf(buf, "%s%d", "img_", imageIdx);
            string imageIdxStr = buf;
            FileNode node = validationFS.getFirstTopLevelNode()[VALIDATION][detectorNames[detectorIdx]][imageIdxStr];
            Array < Rect > valRects;
            if (node.size() != 0) {
                for (FileNodeIterator it2 = node.begin(); it2 != node.end(); )
                {
                    Rect r;
                    it2 >> r.x >> r.y >> r.width >> r.height;
                    valRects.push(r);
                }
            }
            totalValRectCount += (int)valRects.size();

            // compare rectangles
            Array < uchar > map(valRects.size(), 0);
            for (Array<Rect>::const_iterator cr = it ->begin();
                cr != it ->end(); ++cr) {
                // find nearest rectangle
                Point2f cp1 = Point2f(cr ->x + (float)cr->width / 2.0f, cr ->y + (float)cr->height / 2.0f );
                int minIdx = -1, vi = 0;
                float minDist = (float)norm(Point(imgSize.width, imgSize.height));
                for (Array<Rect>::const_iterator vr = valRects.begin();
                    vr != valRects.end(); ++vr, vi++) {
                    Point2f cp2 = Point2f(vr ->x + (float)vr->width / 2.0f, vr ->y + (float)vr->height / 2.0f );
                    float curDist = (float)norm(cp1 - cp2);
                    if (curDist < minDist) {
                        minIdx = vi;
                        minDist = curDist;
                    }
                }
                if (minIdx == -1) {
                    noPair++;
                }
                else {
                    Rect vr = valRects[minIdx];
                    if (map[minIdx] != 0 || (minDist > dist) || (abs(cr ->width - vr.width) > wDiff) ||
                        (abs(cr ->height - vr.height) > hDiff))
                        noPair++;
                    else
                        map[minIdx] = 1;
                }
            }
            noPair += (int)count_if(map.begin(), map.end(), isZero);
            totalNoPair += noPair;

            EXPECT_LE(noPair, Math.round(valRects.size() * eps.noPair) + 1)
                << "detector " << detectorNames[detectorIdx] << " has overrated count of rectangles without pair on "
                << imageFilenames[imageIdx] << " image";

            if (::testing::Test::HasFailure())
            break;
        }

        alvision.EXPECT_LE(totalNoPair, Math.round(totalValRectCount * eps./*total*/noPair) + 1)
            << "detector " << detectorNames[detectorIdx] << " has overrated count of rectangles without pair on all images set";

        if (::testing::Test::HasFailure())
        return alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY;

        return alvision.cvtest.FailureCode.OK;
    }

    //struct
    //{
    //    float dist;
    //    float s;
    //    float noPair;
    //    //float totalNoPair;
    //} eps;
    protected detectorNames: Array<string>;
    protected detectorFilenames: Array<string>;
    protected imageFilenames: Array<string>;
    protected images: Array<alvision.Mat>;
    protected validationFilename: string;
    protected configFilename: string;
    protected validationFS: alvision.FileStorage;
    protected write_results: boolean;
}


function isZero(i: alvision.uchar): boolean { return i == 0; }


//----------------------------------------------- CascadeDetectorTest -----------------------------------
class CV_CascadeDetectorTest extends CV_DetectorTest
{
public:
    CV_CascadeDetectorTest();
protected:
    virtual void readDetector( const FileNode& fn );
    virtual void writeDetector( FileStorage& fs, int di );
    virtual int detectMultiScale( int di, const Mat& img, Array<Rect>& objects );
    virtual int detectMultiScale_C( const string& filename, int di, const Mat& img, Array<Rect>& objects );
    Array<int> flags;
};

CV_CascadeDetectorTest::CV_CascadeDetectorTest()
{
    validationFilename = "cascadeandhog/cascade.xml";
    configFilename = "cascadeandhog/_cascade.xml";
}

void CV_CascadeDetectorTest::readDetector( const FileNode& fn )
{
    String filename;
    int flag;
    fn[FILENAME] >> filename;
    detectorFilenames.push(filename);
    fn[C_SCALE_CASCADE] >> flag;
    if( flag )
        flags.push( 0 );
    else
        flags.push( CASCADE_SCALE_IMAGE );
}

void CV_CascadeDetectorTest::writeDetector( FileStorage& fs, int di )
{
    int sc = flags[di] & CASCADE_SCALE_IMAGE ? 0 : 1;
    fs << FILENAME << detectorFilenames[di];
    fs << C_SCALE_CASCADE << sc;
}


int CV_CascadeDetectorTest::detectMultiScale_C( const string& filename,
                                                int di, const Mat& img,
                                                Array<Rect>& objects )
{
    Ptr<CvHaarClassifierCascade> c_cascade(cvLoadHaarClassifierCascade(filename, cvSize(0,0)));
    Ptr<CvMemStorage> storage(cvCreateMemStorage());

    if( !c_cascade )
    {
        ts->printf( alvision.cvtest.TSConstants.LOG, "cascade %s can not be opened");
        return alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA;
    }
    Mat grayImg;
    cvtColor( img, grayImg, COLOR_BGR2GRAY );
    equalizeHist( grayImg, grayImg );

    CvMat c_gray = grayImg;
    CvSeq* rs = cvHaarDetectObjects(&c_gray, c_cascade, storage, 1.1, 3, flags[di] );

    objects.clear();
    for( int i = 0; i < rs->total; i++ )
    {
        Rect r = *(Rect*)cvGetSeqElem(rs, i);
        objects.push(r);
    }

    return alvision.cvtest.FailureCode.OK;
}

int CV_CascadeDetectorTest::detectMultiScale( int di, const Mat& img,
                                              Array<Rect>& objects)
{
    string dataPath = ts->get_data_path(), filename;
    filename = dataPath + detectorFilenames[di];
    const string pattern = "haarcascade_frontalface_default.xml";

    if( filename.size() >= pattern.size() &&
        strcmp(filename + (filename.size() - pattern.size()),
              pattern) == 0 )
        return detectMultiScale_C(filename, di, img, objects);

    CascadeClassifier cascade( filename );
    if( cascade.empty() )
    {
        ts->printf( alvision.cvtest.TSConstants.LOG, "cascade %s can not be opened");
        return alvision.cvtest.FailureCode.FAIL_INVALID_TEST_DATA;
    }
    Mat grayImg;
    cvtColor( img, grayImg, COLOR_BGR2GRAY );
    equalizeHist( grayImg, grayImg );
    cascade.detectMultiScale( grayImg, objects, 1.1, 3, flags[di] );
    return alvision.cvtest.FailureCode.OK;
}

//----------------------------------------------- HOGDetectorTest -----------------------------------
class CV_HOGDetectorTest : public CV_DetectorTest
{
public:
    CV_HOGDetectorTest();
protected:
    virtual void readDetector( const FileNode& fn );
    virtual void writeDetector( FileStorage& fs, int di );
    virtual int detectMultiScale( int di, const Mat& img, Array<Rect>& objects );
};

CV_HOGDetectorTest::CV_HOGDetectorTest()
{
    validationFilename = "cascadeandhog/hog.xml";
}

void CV_HOGDetectorTest::readDetector( const FileNode& fn )
{
    String filename;
    if( fn[FILENAME].size() != 0 )
        fn[FILENAME] >> filename;
    detectorFilenames.push( filename);
}

void CV_HOGDetectorTest::writeDetector( FileStorage& fs, int di )
{
    fs << FILENAME << detectorFilenames[di];
}

int CV_HOGDetectorTest::detectMultiScale( int di, const Mat& img,
                                              Array<Rect>& objects)
{
    HOGDescriptor hog;
    if( detectorFilenames[di].empty() )
        hog.setSVMDetector(HOGDescriptor::getDefaultPeopleDetector());
    else
        assert(0);
    hog.detectMultiScale(img, objects);
    return alvision.cvtest.FailureCode.OK;
}

//----------------------------------------------- HOGDetectorReadWriteTest -----------------------------------
TEST(Objdetect_HOGDetectorReadWrite, regression)
{
    // Inspired by bug #2607
    Mat img;
    img = imread(alvision.cvtest.TS.ptr().get_data_path() + "/cascadeandhog/images/karen-and-rob.png");
    ASSERT_FALSE(img.empty());

    HOGDescriptor hog;
    hog.setSVMDetector(HOGDescriptor::getDefaultPeopleDetector());

    string tempfilename = alvision.tempfile(".xml");
    FileStorage fs(tempfilename, FileStorage::WRITE);
    hog.write(fs, "myHOG");

    fs.open(tempfilename, FileStorage::READ);
    remove(tempfilename);

    FileNode n = fs["opencv_storage"]["myHOG"];

    ASSERT_NO_THROW(hog.read(n));
}



TEST(Objdetect_CascadeDetector, regression) { CV_CascadeDetectorTest test; test.safe_run(); }
TEST(Objdetect_HOGDetector, regression) { CV_HOGDetectorTest test; test.safe_run(); }


//----------------------------------------------- HOG SSE2 compatible test -----------------------------------

class HOGDescriptorTester :
    public alvision.HOGDescriptor
{
    HOGDescriptor* actual_hog;
    alvision.cvtest.TS* ts;
    mutable bool failed;

public:
    HOGDescriptorTester(HOGDescriptor& instance) :
        alvision.HOGDescriptor(instance), actual_hog(&instance),
        ts(alvision.cvtest.TS::ptr()), failed(false)
    { }

    virtual void computeGradient(const Mat& img, Mat& grad, Mat& qangle,
        Size paddingTL, Size paddingBR) const;

    virtual void detect(const Mat& img,
        Array<Point>& hits, Array<double>& weights, double hitThreshold = 0.0,
        Size winStride = Size(), Size padding = Size(),
        const Array<Point>& locations = Array<Point>()) const;

    virtual void detect(const Mat& img, Array<Point>& hits, double hitThreshold = 0.0,
        Size winStride = Size(), Size padding = Size(),
        const Array<Point>& locations = Array<Point>()) const;

    virtual void compute(InputArray img, Array<float>& descriptors,
        Size winStride = Size(), Size padding = Size(),
        const Array<Point>& locations = Array<Point>()) const;

    bool is_failed() const;
};

struct HOGCacheTester
{
    struct BlockData
    {
        BlockData() : histOfs(0), imgOffset() {}
        int histOfs;
        Point imgOffset;
    };

    struct PixData
    {
        size_t gradOfs, qangleOfs;
        int histOfs[4];
        float histWeights[4];
        float gradWeight;
    };

    HOGCacheTester();
    HOGCacheTester(const HOGDescriptorTester* descriptor,
        const Mat& img, Size paddingTL, Size paddingBR,
        bool useCache, Size cacheStride);
    virtual ~HOGCacheTester() { }
    virtual void init(const HOGDescriptorTester* descriptor,
        const Mat& img, Size paddingTL, Size paddingBR,
        bool useCache, Size cacheStride);

    Size windowsInImage(Size imageSize, Size winStride) const;
    Rect getWindow(Size imageSize, Size winStride, int idx) const;

    const float* getBlock(Point pt, float* buf);
    virtual void normalizeBlockHistogram(float* histogram) const;

    Array<PixData> pixData;
    Array<BlockData> blockData;

    bool useCache;
    Array<int> ymaxCached;
    Size winSize, cacheStride;
    Size nblocks, ncells;
    int blockHistogramSize;
    int count1, count2, count4;
    Point imgoffset;
    Mat_<float> blockCache;
    Mat_<uchar> blockCacheFlags;

    Mat grad, qangle;
    const HOGDescriptorTester* descriptor;
};

HOGCacheTester::HOGCacheTester()
{
    useCache = false;
    blockHistogramSize = count1 = count2 = count4 = 0;
    descriptor = 0;
}

HOGCacheTester::HOGCacheTester(const HOGDescriptorTester* _descriptor,
    const Mat& _img, Size _paddingTL, Size _paddingBR,
    bool _useCache, Size _cacheStride)
{
    init(_descriptor, _img, _paddingTL, _paddingBR, _useCache, _cacheStride);
}

void HOGCacheTester::init(const HOGDescriptorTester* _descriptor,
    const Mat& _img, Size _paddingTL, Size _paddingBR,
    bool _useCache, Size _cacheStride)
{
    descriptor = _descriptor;
    cacheStride = _cacheStride;
    useCache = _useCache;

    descriptor->computeGradient(_img, grad, qangle, _paddingTL, _paddingBR);
    imgoffset = _paddingTL;

    winSize = descriptor->winSize;
    Size blockSize = descriptor->blockSize;
    Size blockStride = descriptor->blockStride;
    Size cellSize = descriptor->cellSize;
    int i, j, nbins = descriptor->nbins;
    int rawBlockSize = blockSize.width*blockSize.height;

    nblocks = Size((winSize.width - blockSize.width)/blockStride.width + 1,
                   (winSize.height - blockSize.height)/blockStride.height + 1);
    ncells = Size(blockSize.width/cellSize.width, blockSize.height/cellSize.height);
    blockHistogramSize = ncells.width*ncells.height*nbins;

    if( useCache )
    {
        Size cacheSize((grad.cols - blockSize.width)/cacheStride.width+1,
                       (winSize.height/cacheStride.height)+1);
        blockCache.create(cacheSize.height, cacheSize.width*blockHistogramSize);
        blockCacheFlags.create(cacheSize);
        size_t cacheRows = blockCache.rows;
        ymaxCached.resize(cacheRows);
        for(size_t ii = 0; ii < cacheRows; ii++ )
            ymaxCached[ii] = -1;
    }

    Mat_<float> weights(blockSize);
    float sigma = (float)descriptor->getWinSigma();
    float scale = 1.f/(sigma*sigma*2);

    for(i = 0; i < blockSize.height; i++)
        for(j = 0; j < blockSize.width; j++)
        {
            float di = i - blockSize.height*0.5f;
            float dj = j - blockSize.width*0.5f;
            weights(i,j) = std::exp(-(di*di + dj*dj)*scale);
        }

    blockData.resize(nblocks.width*nblocks.height);
    pixData.resize(rawBlockSize*3);

    // Initialize 2 lookup tables, pixData & blockData.
    // Here is why:
    //
    // The detection algorithm runs in 4 nested loops (at each pyramid layer):
    //  loop over the windows within the input image
    //    loop over the blocks within each window
    //      loop over the cells within each block
    //        loop over the pixels in each cell
    //
    // As each of the loops runs over a 2-dimensional array,
    // we could get 8(!) nested loops in total, which is very-very slow.
    //
    // To speed the things up, we do the following:
    //   1. loop over windows is unrolled in the HOGDescriptor::{compute|detect} methods;
    //         inside we compute the current search window using getWindow() method.
    //         Yes, it involves some overhead (function call + couple of divisions),
    //         but it's tiny in fact.
    //   2. loop over the blocks is also unrolled. Inside we use pre-computed blockData[j]
    //         to set up gradient and histogram pointers.
    //   3. loops over cells and pixels in each cell are merged
    //       (since there is no overlap between cells, each pixel in the block is processed once)
    //      and also unrolled. Inside we use PixData[k] to access the gradient values and
    //      update the histogram
    //
    count1 = count2 = count4 = 0;
    for( j = 0; j < blockSize.width; j++ )
        for( i = 0; i < blockSize.height; i++ )
        {
            PixData* data = 0;
            float cellX = (j+0.5f)/cellSize.width - 0.5f;
            float cellY = (i+0.5f)/cellSize.height - 0.5f;
            int icellX0 = Math.floor(cellX);
            int icellY0 = Math.floor(cellY);
            int icellX1 = icellX0 + 1, icellY1 = icellY0 + 1;
            cellX -= icellX0;
            cellY -= icellY0;

            if( (unsigned)icellX0 < (unsigned)ncells.width &&
                (unsigned)icellX1 < (unsigned)ncells.width )
            {
                if( (unsigned)icellY0 < (unsigned)ncells.height &&
                    (unsigned)icellY1 < (unsigned)ncells.height )
                {
                    data = &pixData[rawBlockSize*2 + (count4++)];
                    data->histOfs[0] = (icellX0*ncells.height + icellY0)*nbins;
                    data->histWeights[0] = (1.f - cellX)*(1.f - cellY);
                    data->histOfs[1] = (icellX1*ncells.height + icellY0)*nbins;
                    data->histWeights[1] = cellX*(1.f - cellY);
                    data->histOfs[2] = (icellX0*ncells.height + icellY1)*nbins;
                    data->histWeights[2] = (1.f - cellX)*cellY;
                    data->histOfs[3] = (icellX1*ncells.height + icellY1)*nbins;
                    data->histWeights[3] = cellX*cellY;
                }
                else
                {
                    data = &pixData[rawBlockSize + (count2++)];
                    if( (unsigned)icellY0 < (unsigned)ncells.height )
                    {
                        icellY1 = icellY0;
                        cellY = 1.f - cellY;
                    }
                    data->histOfs[0] = (icellX0*ncells.height + icellY1)*nbins;
                    data->histWeights[0] = (1.f - cellX)*cellY;
                    data->histOfs[1] = (icellX1*ncells.height + icellY1)*nbins;
                    data->histWeights[1] = cellX*cellY;
                    data->histOfs[2] = data->histOfs[3] = 0;
                    data->histWeights[2] = data->histWeights[3] = 0;
                }
            }
            else
            {
                if( (unsigned)icellX0 < (unsigned)ncells.width )
                {
                    icellX1 = icellX0;
                    cellX = 1.f - cellX;
                }

                if( (unsigned)icellY0 < (unsigned)ncells.height &&
                    (unsigned)icellY1 < (unsigned)ncells.height )
                {
                    data = &pixData[rawBlockSize + (count2++)];
                    data->histOfs[0] = (icellX1*ncells.height + icellY0)*nbins;
                    data->histWeights[0] = cellX*(1.f - cellY);
                    data->histOfs[1] = (icellX1*ncells.height + icellY1)*nbins;
                    data->histWeights[1] = cellX*cellY;
                    data->histOfs[2] = data->histOfs[3] = 0;
                    data->histWeights[2] = data->histWeights[3] = 0;
                }
                else
                {
                    data = &pixData[count1++];
                    if( (unsigned)icellY0 < (unsigned)ncells.height )
                    {
                        icellY1 = icellY0;
                        cellY = 1.f - cellY;
                    }
                    data->histOfs[0] = (icellX1*ncells.height + icellY1)*nbins;
                    data->histWeights[0] = cellX*cellY;
                    data->histOfs[1] = data->histOfs[2] = data->histOfs[3] = 0;
                    data->histWeights[1] = data->histWeights[2] = data->histWeights[3] = 0;
                }
            }
            data->gradOfs = (grad.cols*i + j)*2;
            data->qangleOfs = (qangle.cols*i + j)*2;
            data->gradWeight = weights(i,j);
        }

    assert( count1 + count2 + count4 == rawBlockSize );
    // defragment pixData
    for( j = 0; j < count2; j++ )
        pixData[j + count1] = pixData[j + rawBlockSize];
    for( j = 0; j < count4; j++ )
        pixData[j + count1 + count2] = pixData[j + rawBlockSize*2];
    count2 += count1;
    count4 += count2;

    // initialize blockData
    for( j = 0; j < nblocks.width; j++ )
        for( i = 0; i < nblocks.height; i++ )
        {
            BlockData& data = blockData[j*nblocks.height + i];
            data.histOfs = (j*nblocks.height + i)*blockHistogramSize;
            data.imgOffset = Point(j*blockStride.width,i*blockStride.height);
        }
}

const float* HOGCacheTester::getBlock(Point pt, float* buf)
{
    float* blockHist = buf;
    assert(descriptor != 0);

    Size blockSize = descriptor->blockSize;
    pt += imgoffset;

    CV_Assert( (unsigned)pt.x <= (unsigned)(grad.cols - blockSize.width) &&
               (unsigned)pt.y <= (unsigned)(grad.rows - blockSize.height) );

    if( useCache )
    {
        CV_Assert( pt.x % cacheStride.width == 0 &&
                   pt.y % cacheStride.height == 0 );
        Point cacheIdx(pt.x/cacheStride.width,
                      (pt.y/cacheStride.height) % blockCache.rows);
        if( pt.y != ymaxCached[cacheIdx.y] )
        {
            Mat_<uchar> cacheRow = blockCacheFlags.row(cacheIdx.y);
            cacheRow = (uchar)0;
            ymaxCached[cacheIdx.y] = pt.y;
        }

        blockHist = &blockCache[cacheIdx.y][cacheIdx.x*blockHistogramSize];
        uchar& computedFlag = blockCacheFlags(cacheIdx.y, cacheIdx.x);
        if( computedFlag != 0 )
            return blockHist;
        computedFlag = (uchar)1; // set it at once, before actual computing
    }

    int k, C1 = count1, C2 = count2, C4 = count4;
    const float* gradPtr = grad.ptr<float>(pt.y) + pt.x*2;
    const uchar* qanglePtr = qangle.ptr(pt.y) + pt.x*2;

    CV_Assert( blockHist != 0 );
    for( k = 0; k < blockHistogramSize; k++ )
        blockHist[k] = 0.f;

    const PixData* _pixData = &pixData[0];

    for( k = 0; k < C1; k++ )
    {
        const PixData& pk = _pixData[k];
        const float* a = gradPtr + pk.gradOfs;
        float w = pk.gradWeight*pk.histWeights[0];
        const uchar* h = qanglePtr + pk.qangleOfs;
        int h0 = h[0], h1 = h[1];
        float* hist = blockHist + pk.histOfs[0];
        float t0 = hist[h0] + a[0]*w;
        float t1 = hist[h1] + a[1]*w;
        hist[h0] = t0; hist[h1] = t1;
    }

    for( ; k < C2; k++ )
    {
        const PixData& pk = _pixData[k];
        const float* a = gradPtr + pk.gradOfs;
        float w, t0, t1, a0 = a[0], a1 = a[1];
        const uchar* h = qanglePtr + pk.qangleOfs;
        int h0 = h[0], h1 = h[1];

        float* hist = blockHist + pk.histOfs[0];
        w = pk.gradWeight*pk.histWeights[0];
        t0 = hist[h0] + a0*w;
        t1 = hist[h1] + a1*w;
        hist[h0] = t0; hist[h1] = t1;

        hist = blockHist + pk.histOfs[1];
        w = pk.gradWeight*pk.histWeights[1];
        t0 = hist[h0] + a0*w;
        t1 = hist[h1] + a1*w;
        hist[h0] = t0; hist[h1] = t1;
    }

    for( ; k < C4; k++ )
    {
        const PixData& pk = _pixData[k];
        const float* a = gradPtr + pk.gradOfs;
        float w, t0, t1, a0 = a[0], a1 = a[1];
        const uchar* h = qanglePtr + pk.qangleOfs;
        int h0 = h[0], h1 = h[1];

        float* hist = blockHist + pk.histOfs[0];
        w = pk.gradWeight*pk.histWeights[0];
        t0 = hist[h0] + a0*w;
        t1 = hist[h1] + a1*w;
        hist[h0] = t0; hist[h1] = t1;

        hist = blockHist + pk.histOfs[1];
        w = pk.gradWeight*pk.histWeights[1];
        t0 = hist[h0] + a0*w;
        t1 = hist[h1] + a1*w;
        hist[h0] = t0; hist[h1] = t1;

        hist = blockHist + pk.histOfs[2];
        w = pk.gradWeight*pk.histWeights[2];
        t0 = hist[h0] + a0*w;
        t1 = hist[h1] + a1*w;
        hist[h0] = t0; hist[h1] = t1;

        hist = blockHist + pk.histOfs[3];
        w = pk.gradWeight*pk.histWeights[3];
        t0 = hist[h0] + a0*w;
        t1 = hist[h1] + a1*w;
        hist[h0] = t0; hist[h1] = t1;
    }

    normalizeBlockHistogram(blockHist);

    return blockHist;
}

void HOGCacheTester::normalizeBlockHistogram(float* _hist) const
{
    float* hist = &_hist[0], partSum[4] = { 0.0f, 0.0f, 0.0f, 0.0f };
    size_t i, sz = blockHistogramSize;

    for (i = 0; i <= sz - 4; i += 4)
    {
        partSum[0] += hist[i] * hist[i];
        partSum[1] += hist[i+1] * hist[i+1];
        partSum[2] += hist[i+2] * hist[i+2];
        partSum[3] += hist[i+3] * hist[i+3];
    }
    float t0 = partSum[0] + partSum[1];
    float t1 = partSum[2] + partSum[3];
    float sum = t0 + t1;
    for( ; i < sz; i++ )
        sum += hist[i]*hist[i];

    float scale = 1.f/(Math.sqrt(sum)+sz*0.1f), thresh = (float)descriptor->L2HysThreshold;
    partSum[0] = partSum[1] = partSum[2] = partSum[3] = 0.0f;
    for(i = 0; i <= sz - 4; i += 4)
    {
        hist[i] = std::min(hist[i]*scale, thresh);
        hist[i+1] = std::min(hist[i+1]*scale, thresh);
        hist[i+2] = std::min(hist[i+2]*scale, thresh);
        hist[i+3] = std::min(hist[i+3]*scale, thresh);
        partSum[0] += hist[i]*hist[i];
        partSum[1] += hist[i+1]*hist[i+1];
        partSum[2] += hist[i+2]*hist[i+2];
        partSum[3] += hist[i+3]*hist[i+3];
    }
    t0 = partSum[0] + partSum[1];
    t1 = partSum[2] + partSum[3];
    sum = t0 + t1;
    for( ; i < sz; i++ )
    {
        hist[i] = std::min(hist[i]*scale, thresh);
        sum += hist[i]*hist[i];
    }

    scale = 1.f/(Math.sqrt(sum)+1e-3f);
    for( i = 0; i < sz; i++ )
        hist[i] *= scale;
}

Size HOGCacheTester::windowsInImage(Size imageSize, Size winStride) const
{
    return Size((imageSize.width - winSize.width)/winStride.width + 1,
                (imageSize.height - winSize.height)/winStride.height + 1);
}

Rect HOGCacheTester::getWindow(Size imageSize, Size winStride, int idx) const
{
    int nwindowsX = (imageSize.width - winSize.width)/winStride.width + 1;
    int y = idx / nwindowsX;
    int x = idx - nwindowsX*y;
    return Rect( x*winStride.width, y*winStride.height, winSize.width, winSize.height );
}

inline bool HOGDescriptorTester::is_failed() const
{
    return failed;
}

static inline int gcd(int a, int b) { return (a % b == 0) ? b : gcd (b, a % b); }

void HOGDescriptorTester::detect(const Mat& img,
    Array<Point>& hits, Array<double>& weights, double hitThreshold,
    Size winStride, Size padding, const Array<Point>& locations) const
{
    if (failed)
        return;

    hits.clear();
    if( svmDetector.empty() )
        return;

    if( winStride == Size() )
        winStride = cellSize;
    Size cacheStride(gcd(winStride.width, blockStride.width),
                     gcd(winStride.height, blockStride.height));
    size_t nwindows = locations.size();
    padding.width = (int)alignSize(std::max(padding.width, 0), cacheStride.width);
    padding.height = (int)alignSize(std::max(padding.height, 0), cacheStride.height);
    Size paddedImgSize(img.cols + padding.width*2, img.rows + padding.height*2);

    HOGCacheTester cache(this, img, padding, padding, nwindows == 0, cacheStride);

    if( !nwindows )
        nwindows = cache.windowsInImage(paddedImgSize, winStride).area();

    const HOGCacheTester::BlockData* blockData = &cache.blockData[0];

    int nblocks = cache.nblocks.area();
    int blockHistogramSize = cache.blockHistogramSize;
    size_t dsize = getDescriptorSize();

    double rho = svmDetector.size() > dsize ? svmDetector[dsize] : 0;
    Array<float> blockHist(blockHistogramSize);

    for( size_t i = 0; i < nwindows; i++ )
    {
        Point pt0;
        if( !locations.empty() )
        {
            pt0 = locations[i];
            if( pt0.x < -padding.width || pt0.x > img.cols + padding.width - winSize.width ||
                pt0.y < -padding.height || pt0.y > img.rows + padding.height - winSize.height )
                continue;
        }
        else
        {
            pt0 = cache.getWindow(paddedImgSize, winStride, (int)i).tl() - Point(padding);
            CV_Assert(pt0.x % cacheStride.width == 0 && pt0.y % cacheStride.height == 0);
        }
        double s = rho;
        const float* svmVec = &svmDetector[0];
        int j, k;
        for( j = 0; j < nblocks; j++, svmVec += blockHistogramSize )
        {
            const HOGCacheTester::BlockData& bj = blockData[j];
            Point pt = pt0 + bj.imgOffset;

            const float* vec = cache.getBlock(pt, &blockHist[0]);
            for( k = 0; k <= blockHistogramSize - 4; k += 4 )
                s += vec[k]*svmVec[k] + vec[k+1]*svmVec[k+1] +
                    vec[k+2]*svmVec[k+2] + vec[k+3]*svmVec[k+3];
            for( ; k < blockHistogramSize; k++ )
                s += vec[k]*svmVec[k];
        }
        if( s >= hitThreshold )
        {
            hits.push(pt0);
            weights.push(s);
        }
    }

    // validation
    std::Array<Point> actual_find_locations;
    std::Array<double> actual_weights;
    actual_hog->detect(img, actual_find_locations, actual_weights,
        hitThreshold, winStride, padding, locations);

    if (!std::equal(hits.begin(), hits.end(),
        actual_find_locations.begin()))
    {
        ts->printf(alvision.cvtest.TS::SUMMARY, "Found locations are not equal (see detect function)\n");
        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
        ts->set_gtest_status();
        failed = true;
        return;
    }

    const double eps = 0.0;
    double diff_norm = alvision.cvtest.norm(actual_weights, weights,alvision.NormTypes. NORM_L2);
    if (diff_norm > eps)
    {
        ts->printf(alvision.cvtest.TS::SUMMARY, "Weights for found locations aren't equal.\n"
            "Norm of the difference is %lf\n", diff_norm);
        ts->printf(alvision.cvtest.TSConstants.LOG, "Channels: %d\n", img.channels());
        failed = true;
        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
        ts->set_gtest_status();
        return;
    }
}

void HOGDescriptorTester::detect(const Mat& img, Array<Point>& hits, double hitThreshold,
    Size winStride, Size padding, const Array<Point>& locations) const
{
    Array<double> weightsV;
    detect(img, hits, weightsV, hitThreshold, winStride, padding, locations);
}

void HOGDescriptorTester::compute(InputArray _img, Array<float>& descriptors,
    Size winStride, Size padding, const Array<Point>& locations) const
{
    Mat img = _img.getMat();

    if( winStride == Size() )
        winStride = cellSize;
    Size cacheStride(gcd(winStride.width, blockStride.width),
        gcd(winStride.height, blockStride.height));
    size_t nwindows = locations.size();
    padding.width = (int)alignSize(std::max(padding.width, 0), cacheStride.width);
    padding.height = (int)alignSize(std::max(padding.height, 0), cacheStride.height);
    Size paddedImgSize(img.cols + padding.width*2, img.rows + padding.height*2);

    HOGCacheTester cache(this, img, padding, padding, nwindows == 0, cacheStride);

    if( !nwindows )
        nwindows = cache.windowsInImage(paddedImgSize, winStride).area();

    const HOGCacheTester::BlockData* blockData = &cache.blockData[0];

    int nblocks = cache.nblocks.area();
    int blockHistogramSize = cache.blockHistogramSize;
    size_t dsize = getDescriptorSize();
    descriptors.resize(dsize*nwindows);

    for( size_t i = 0; i < nwindows; i++ )
    {
        float* descriptor = &descriptors[i*dsize];

        Point pt0;
        if( !locations.empty() )
        {
            pt0 = locations[i];
            if( pt0.x < -padding.width || pt0.x > img.cols + padding.width - winSize.width ||
                pt0.y < -padding.height || pt0.y > img.rows + padding.height - winSize.height )
                continue;
        }
        else
        {
            pt0 = cache.getWindow(paddedImgSize, winStride, (int)i).tl() - Point(padding);
            CV_Assert(pt0.x % cacheStride.width == 0 && pt0.y % cacheStride.height == 0);
        }

        for( int j = 0; j < nblocks; j++ )
        {
            const HOGCacheTester::BlockData& bj = blockData[j];
            Point pt = pt0 + bj.imgOffset;

            float* dst = descriptor + bj.histOfs;
            const float* src = cache.getBlock(pt, dst);
            if( src != dst )
                for( int k = 0; k < blockHistogramSize; k++ )
                    dst[k] = src[k];
        }
    }

    // validation
    std::Array<float> actual_descriptors;
    actual_hog->compute(img, actual_descriptors, winStride, padding, locations);

    double diff_norm = alvision.cvtest.norm(actual_descriptors, descriptors,alvision.NormTypes. NORM_L2);
    const double eps = 0.0;
    if (diff_norm > eps)
    {
        ts->printf(alvision.cvtest.TS::SUMMARY, "Norm of the difference: %lf\n", diff_norm);
        ts->printf(alvision.cvtest.TS::SUMMARY, "Found descriptors are not equal (see compute function)\n");
        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
        ts->printf(alvision.cvtest.TSConstants.LOG, "Channels: %d\n", img.channels());
        ts->set_gtest_status();
        failed = true;
        return;
    }
}

void HOGDescriptorTester::computeGradient(const Mat& img, Mat& grad, Mat& qangle,
   Size paddingTL, Size paddingBR) const
{
    CV_Assert( img.type() == CV_8U || img.type() == CV_8UC3 );

    Size gradsize(img.cols + paddingTL.width + paddingBR.width,
       img.rows + paddingTL.height + paddingBR.height);
    grad.create(gradsize, CV_32FC2);  // <magnitude*(1-alpha), magnitude*alpha>
    qangle.create(gradsize, CV_8UC2); // [0..nbins-1] - quantized gradient orientation
    Size wholeSize;
    Point roiofs;
    img.locateROI(wholeSize, roiofs);

    int i, x, y;
    int cn = img.channels();

    Mat_<float> _lut(1, 256);
    const float* lut = &_lut(0,0);

    if( gammaCorrection )
       for( i = 0; i < 256; i++ )
           _lut(0,i) = Math.sqrt((float)i);
    else
       for( i = 0; i < 256; i++ )
           _lut(0,i) = (float)i;

    AutoBuffer<int> mapbuf(gradsize.width + gradsize.height + 4);
    int* xmap = (int*)mapbuf + 1;
    int* ymap = xmap + gradsize.width + 2;

    const int borderType = (int)BORDER_REFLECT_101;

    for( x = -1; x < gradsize.width + 1; x++ )
       xmap[x] = borderInterpolate(x - paddingTL.width + roiofs.x,
           wholeSize.width, borderType) - roiofs.x;
    for( y = -1; y < gradsize.height + 1; y++ )
       ymap[y] = borderInterpolate(y - paddingTL.height + roiofs.y,
           wholeSize.height, borderType) - roiofs.y;

    // x- & y- derivatives for the whole row
    int width = gradsize.width;
    AutoBuffer<float> _dbuf(width*4);
    float* dbuf = _dbuf;
    Mat Dx(1, width, CV_32F, dbuf);
    Mat Dy(1, width, CV_32F, dbuf + width);
    Mat Mag(1, width, CV_32F, dbuf + width*2);
    Mat Angle(1, width, CV_32F, dbuf + width*3);

    int _nbins = nbins;
    float angleScale = (float)(_nbins/Math.PI);
    for( y = 0; y < gradsize.height; y++ )
    {
       const uchar* imgPtr  = img.ptr(ymap[y]);
       const uchar* prevPtr = img.ptr(ymap[y-1]);
       const uchar* nextPtr = img.ptr(ymap[y+1]);
       float* gradPtr = (float*)grad.ptr(y);
       uchar* qanglePtr = (uchar*)qangle.ptr(y);

       if( cn == 1 )
       {
           for( x = 0; x < width; x++ )
           {
               int x1 = xmap[x];
               dbuf[x] = (float)(lut[imgPtr[xmap[x+1]]] - lut[imgPtr[xmap[x-1]]]);
               dbuf[width + x] = (float)(lut[nextPtr[x1]] - lut[prevPtr[x1]]);
           }
       }
       else
       {
           for( x = 0; x < width; x++ )
           {
               int x1 = xmap[x]*3;
               float dx0, dy0, dx, dy, mag0, mag;
                const uchar* p2 = imgPtr + xmap[x+1]*3;
               const uchar* p0 = imgPtr + xmap[x-1]*3;

               dx0 = lut[p2[2]] - lut[p0[2]];
               dy0 = lut[nextPtr[x1+2]] - lut[prevPtr[x1+2]];
               mag0 = dx0*dx0 + dy0*dy0;

               dx = lut[p2[1]] - lut[p0[1]];
               dy = lut[nextPtr[x1+1]] - lut[prevPtr[x1+1]];
               mag = dx*dx + dy*dy;

               if( mag0 < mag )
               {
                   dx0 = dx;
                   dy0 = dy;
                   mag0 = mag;
               }

               dx = lut[p2[0]] - lut[p0[0]];
               dy = lut[nextPtr[x1]] - lut[prevPtr[x1]];
               mag = dx*dx + dy*dy;

               if( mag0 < mag )
               {
                   dx0 = dx;
                   dy0 = dy;
                   mag0 = mag;
               }

               dbuf[x] = dx0;
               dbuf[x+width] = dy0;
           }
       }

       cartToPolar( Dx, Dy, Mag, Angle, false );
       for( x = 0; x < width; x++ )
       {
           float mag = dbuf[x+width*2], angle = dbuf[x+width*3]*angleScale - 0.5f;
           int hidx = Math.floor(angle);
           angle -= hidx;
           gradPtr[x*2] = mag*(1.f - angle);
           gradPtr[x*2+1] = mag*angle;
           if( hidx < 0 )
               hidx += _nbins;
           else if( hidx >= _nbins )
               hidx -= _nbins;
           assert( (unsigned)hidx < (unsigned)_nbins );

           qanglePtr[x*2] = (uchar)hidx;
           hidx++;
           hidx &= hidx < _nbins ? -1 : 0;
           qanglePtr[x*2+1] = (uchar)hidx;
       }
    }

    // validation
    Mat actual_mats[2], reference_mats[2] = { grad, qangle };
    const char* args[] = { "Gradient's", "Qangles's" };
    actual_hog->computeGradient(img, actual_mats[0], actual_mats[1], paddingTL, paddingBR);

    const double eps = 0.0;
    for (i = 0; i < 2; ++i)
    {
       double diff_norm = alvision.cvtest.norm(reference_mats[i], actual_mats[i],alvision.NormTypes. NORM_L2);
       if (diff_norm > eps)
       {
           ts->printf(alvision.cvtest.TSConstants.LOG, "%s matrices are not equal\n"
               "Norm of the difference is %lf\n", args[i], diff_norm);
           ts->printf(alvision.cvtest.TSConstants.LOG, "Channels: %d\n", img.channels());
           this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
           ts->set_gtest_status();
           failed = true;
           return;
       }
    }
}

TEST(Objdetect_HOGDetector_Strict, accuracy)
{
    alvision.cvtest.TS* ts = alvision.cvtest.TS::ptr();
    RNG& rng = ts->get_rng();

    HOGDescriptor actual_hog;
    actual_hog.setSVMDetector(HOGDescriptor::getDefaultPeopleDetector());
    HOGDescriptorTester reference_hog(actual_hog);

    const unsigned int test_case_count = 5;
    for (unsigned int i = 0; i < test_case_count && !reference_hog.is_failed(); ++i)
    {
        // creating a matrix
        Size ssize(rng.uniform(1, 10) * actual_hog.winSize.width,
            rng.uniform(1, 10) * actual_hog.winSize.height);
        int type = rng.uniform(0, 1) > 0 ? CV_8UC1 : CV_8UC3;
        Mat image(ssize, type);
        rng.fill(image, RNG::UNIFORM, 0, 256, true);

        // checking detect
        std::Array<Point> hits;
        std::Array<double> weights;
        reference_hog.detect(image, hits, weights);

        // checking compute
        std::Array<float> descriptors;
        reference_hog.compute(image, descriptors);
    }
 }
