import tape = require("tape");
import path = require("path");
import colors = require("colors");
import async = require("async");
import alvision = require("../../../tsbinding/alvision");
import util = require('util');
import fs = require('fs');

//#include "test_precomp.hpp"
//
//#include <vector>
//
//using namespace cv;
//using namespace std;
//
const img_size = new alvision.Size (640, 480);
const  LSD_TEST_SEED = 0x134679;
const  EPOCHS = 20;

class LSDBase {//extends testing::Test {

    public test_image : alvision.Mat;
    public lines: Array<alvision.Vecf>;
    public rng: alvision.RNG;
    public passedtests: alvision.int;

    GenerateWhiteNoise(image: alvision.Mat): void {
        image = new alvision.Mat(img_size, alvision.MatrixType.CV_8UC1);
        this.rng.fill(image,alvision.DistType.UNIFORM, 0, 256);
    }
    GenerateConstColor(image: alvision.Mat): void {
        image = new alvision.Mat(img_size, alvision.MatrixType.CV_8UC1, alvision.Scalar.all(this.rng.uniform(0, 256)));
    }
    GenerateLines(image: alvision.Mat, numLines: alvision.uint64): void {
        image = new alvision.Mat(img_size, alvision.MatrixType.CV_8UC1, alvision.Scalar.all(this.rng.uniform(0, 128)));

        for (var i = 0; i < numLines; ++i)
        {
            var y = this.rng.uniform(10, img_size.width.valueOf() - 10);
            var p1 = new alvision.Point (y, 10);
            var p2 = new alvision.Point (y, img_size.height.valueOf() - 10);
            alvision.line(image, p1, p2, new alvision.Scalar(255), 3);
        }
    }
    GenerateRotatedRect(image: alvision.Mat): void {
        image.setTo(alvision.Mat.zeros(img_size, alvision.MatrixType.CV_8UC1));

        var center = new alvision.Point(this.rng.uniform(img_size.width.valueOf() / 4, img_size.width.valueOf() * 3 / 4),
            this.rng.uniform(img_size.height.valueOf() / 4, img_size.height.valueOf() * 3 / 4));
        var rect_size = new alvision.Size (this.rng.uniform(img_size.width.valueOf() / 8, img_size.width.valueOf() / 6),
            this.rng.uniform(img_size.height.valueOf() / 8, img_size.height.valueOf() / 6));
        var angle = this.rng.uniform(0., 360.);

        var vertices = new Array<alvision.Point2f>(4);

        var rRect = new alvision.RotatedRect(center, rect_size, angle);

        rRect.points(vertices);
        for (var i = 0; i < 4; i++)
        {
            alvision.line(image, vertices[i], vertices[(i + 1) % 4],new alvision. Scalar(255), 3);
        }
    }
    SetUp(): void {
        this.lines.length = 0;
        this.test_image = new alvision.Mat();
        this.rng = new alvision.RNG(LSD_TEST_SEED);
        this.passedtests = 0;
    }
};

class Imgproc_LSD_ADV extends LSDBase
{
};

class Imgproc_LSD_STD extends LSDBase
{
};

class Imgproc_LSD_NONE extends LSDBase
{
};




alvision.cvtest.TEST_F('Imgproc_LSD_ADV', 'whiteNoise',()=>
{
    var test = new Imgproc_LSD_ADV();
    for (var i = 0; i < EPOCHS; ++i)
    {
        test.GenerateWhiteNoise(test.test_image);
        var detector = alvision.createLineSegmentDetector(alvision.LineSegmentDetectorModes. LSD_REFINE_ADV);
        detector.detect(test.test_image, test.lines);

        if (40 >= test.lines.length)
            test.passedtests = test.passedtests.valueOf() + 1;
    }
    alvision.ASSERT_EQ(EPOCHS, test.passedtests);
});

alvision.cvtest.TEST_F('Imgproc_LSD_ADV', 'constColor',()=>
{
    var test = new Imgproc_LSD_ADV();
    for (var i = 0; i < EPOCHS; ++i)
    {
        test.GenerateConstColor(test.test_image);
        var detector = alvision.createLineSegmentDetector(alvision.LineSegmentDetectorModes. LSD_REFINE_ADV);
        detector.detect(test.test_image, test.lines);

        if (0 == test.lines.length)
            test.passedtests = test.passedtests.valueOf() + 1;
    }
    alvision.ASSERT_EQ(EPOCHS, test.passedtests);
});

alvision.cvtest.TEST_F('Imgproc_LSD_ADV', 'lines', () => {
    var test = new Imgproc_LSD_ADV();
    for (var i = 0; i < EPOCHS; ++i) {
        const numOfLines = 1;
        test.GenerateLines(test.test_image, numOfLines);
        var detector = alvision.createLineSegmentDetector(alvision.LineSegmentDetectorModes.LSD_REFINE_ADV);
        detector.detect(test.test_image, test.lines);

        if (numOfLines * 2 == test.lines.length) test.passedtests = test.passedtests.valueOf() + 1;  // * 2 because of Gibbs effect
    }
    alvision.ASSERT_EQ(EPOCHS, test.passedtests);
});

alvision.cvtest.TEST_F('Imgproc_LSD_ADV', 'rotatedRect', () => {
        var test = new Imgproc_LSD_ADV();
        for (var i = 0; i < EPOCHS; ++i) {
            test.GenerateRotatedRect(test.test_image);
            var detector = alvision.createLineSegmentDetector(alvision.LineSegmentDetectorModes.LSD_REFINE_ADV);
            detector.detect(test.test_image, test.lines);

            if (2 <= test.lines.length) test.passedtests = test.passedtests.valueOf() + 1;
        }
        alvision.ASSERT_EQ(EPOCHS, test.passedtests);
    });

alvision.cvtest.TEST_F('Imgproc_LSD_STD', 'whiteNoise', () => {
    var test = new Imgproc_LSD_STD();
    for (var i = 0; i < EPOCHS; ++i) {
        test.GenerateWhiteNoise(test.test_image);
        var detector = alvision.createLineSegmentDetector(alvision.LineSegmentDetectorModes.LSD_REFINE_STD);
        detector.detect(test.test_image, test.lines);

        if (50 >= test.lines.length) test.passedtests = test.passedtests.valueOf() + 1;
    }
    alvision.ASSERT_EQ(EPOCHS, test.passedtests);
});

alvision.cvtest.TEST_F('Imgproc_LSD_STD', 'constColor', () => {
    var test = new Imgproc_LSD_STD();
    for (var i = 0; i < EPOCHS; ++i) {
        test.GenerateConstColor(test.test_image);
        var detector = alvision.createLineSegmentDetector(alvision.LineSegmentDetectorModes.LSD_REFINE_STD);
        detector.detect(test.test_image, test.lines);

        if (0 == test.lines.length) test.passedtests = test.passedtests.valueOf() + 1;
    }
    alvision.ASSERT_EQ(EPOCHS, test.passedtests);
});

alvision.cvtest.TEST_F('Imgproc_LSD_STD', 'lines',()=>
{
    var test = new Imgproc_LSD_STD();
    for (var i = 0; i < EPOCHS; ++i)
    {
        const numOfLines = 1;
        test.GenerateLines(test.test_image, numOfLines);
        var detector = alvision.createLineSegmentDetector(alvision.LineSegmentDetectorModes.LSD_REFINE_STD);
        detector.detect(test.test_image, test.lines);

        if (numOfLines * 2 == test.lines.length) test.passedtests = test.passedtests.valueOf() + 1; // * 2 because of Gibbs effect
    }
    alvision.ASSERT_EQ(EPOCHS, test.passedtests);
});

alvision.cvtest.TEST_F('Imgproc_LSD_STD', 'rotatedRect',()=>
{
    var test = new Imgproc_LSD_STD();
    for (var i = 0; i < EPOCHS; ++i)
    {
        test.GenerateRotatedRect(test.test_image);
        var detector = alvision.createLineSegmentDetector(alvision.LineSegmentDetectorModes.LSD_REFINE_STD);
        detector.detect(test.test_image, test.lines);

        if (4 <= test.lines.length) test.passedtests = test.passedtests.valueOf() + 1;
    }
    alvision.ASSERT_EQ(EPOCHS, test.passedtests);
});

alvision.cvtest.TEST_F('Imgproc_LSD_NONE', 'whiteNoise',()=>
{
    var test = new Imgproc_LSD_NONE();
    for (var i = 0; i < EPOCHS; ++i)
    {
        test.GenerateWhiteNoise(test.test_image);
        var detector = alvision.createLineSegmentDetector(alvision.LineSegmentDetectorModes.LSD_REFINE_STD);
        detector.detect(test.test_image, test.lines);

        if (50 >= test.lines.length) test.passedtests = test.passedtests.valueOf() + 1;
    }
    alvision.ASSERT_EQ(EPOCHS, test.passedtests);
});

alvision.cvtest.TEST_F('Imgproc_LSD_NONE', 'constColor',()=>
{
    var test = new Imgproc_LSD_NONE();
    for (var i = 0; i < EPOCHS; ++i)
    {
        test.GenerateConstColor(test.test_image);
        var detector = alvision.createLineSegmentDetector(alvision.LineSegmentDetectorModes.LSD_REFINE_NONE);
        detector.detect(test.test_image,test. lines);

        if (0 == test.lines.length) test.passedtests = test.passedtests.valueOf() + 1;
    }
    alvision.ASSERT_EQ(EPOCHS, test.passedtests);
});

alvision.cvtest.TEST_F('Imgproc_LSD_NONE', 'lines',()=>
{
    var test = new Imgproc_LSD_NONE();
    for (var i = 0; i < EPOCHS; ++i)
    {
        const numOfLines = 1;
        test.GenerateLines(test.test_image, numOfLines);
        var detector = alvision.createLineSegmentDetector(alvision.LineSegmentDetectorModes.LSD_REFINE_NONE);
        detector.detect(test.test_image, test.lines);

        if (numOfLines * 2 == test.lines.length)
            test.passedtests = test.passedtests.valueOf() + 1;// * 2 because of Gibbs effect
    }
    alvision.ASSERT_EQ(EPOCHS, test.passedtests);
});

alvision.cvtest.TEST_F('Imgproc_LSD_NONE', 'rotatedRect',()=>
{
    var test = new Imgproc_LSD_NONE();
    for (var i = 0; i < EPOCHS; ++i)
    {
        test.GenerateRotatedRect(test.test_image);
        var detector = alvision.createLineSegmentDetector(alvision.LineSegmentDetectorModes.LSD_REFINE_NONE);
        detector.detect(test.test_image, test.lines);

        if (8 <= test.lines.length)
            test.passedtests = test.passedtests.valueOf() + 1;
    }
    alvision.ASSERT_EQ(EPOCHS, test.passedtests);
});
