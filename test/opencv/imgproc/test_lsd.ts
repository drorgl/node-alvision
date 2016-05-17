
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
//const Size img_size(640, 480);
//const int LSD_TEST_SEED = 0x134679;
//const int EPOCHS = 20;

class LSDBase extends testing::Test {

    protected test_image : alvision.Mat;
    protected lines: Array<alvision.Vecf>;
    protected rng: alvision.RNG;
    protected passedtests: alvision.int;

    GenerateWhiteNoise(image: alvision.Mat): void {
        image = Mat(img_size, CV_8UC1);
        rng.fill(image, RNG::UNIFORM, 0, 256);
    }
    GenerateConstColor(image: alvision.Mat): void {
        image = Mat(img_size, CV_8UC1, Scalar::all(rng.uniform(0, 256)));
    }
    GenerateLines(image: alvision.Mat, numLines: alvision.uint64): void {
        image = Mat(img_size, CV_8UC1, Scalar::all(rng.uniform(0, 128)));

        for (unsigned int i = 0; i < numLines; ++i)
        {
            int y = rng.uniform(10, img_size.width - 10);
            Point p1(y, 10);
            Point p2(y, img_size.height - 10);
            line(image, p1, p2, Scalar(255), 3);
        }
    }
    GenerateRotatedRect(image: alvision.Mat): void {
        image = Mat::zeros(img_size, CV_8UC1);

        Point center(rng.uniform(img_size.width / 4, img_size.width * 3 / 4),
            rng.uniform(img_size.height / 4, img_size.height * 3 / 4));
        Size rect_size(rng.uniform(img_size.width / 8, img_size.width / 6),
            rng.uniform(img_size.height / 8, img_size.height / 6));
        float angle = rng.uniform(0.f, 360.f);

        Point2f vertices[4];

        RotatedRect rRect = RotatedRect(center, rect_size, angle);

        rRect.points(vertices);
        for (int i = 0; i < 4; i++)
        {
            line(image, vertices[i], vertices[(i + 1) % 4], Scalar(255), 3);
        }
    }
    SetUp(): void {
        lines.clear();
        test_image = Mat();
        rng = RNG(LSD_TEST_SEED);
        passedtests = 0;
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




TEST_F(Imgproc_LSD_ADV, whiteNoise)
{
    for (int i = 0; i < EPOCHS; ++i)
    {
        GenerateWhiteNoise(test_image);
        Ptr<LineSegmentDetector> detector = createLineSegmentDetector(LSD_REFINE_ADV);
        detector.detect(test_image, lines);

        if(40u >= lines.size()) ++passedtests;
    }
    ASSERT_EQ(EPOCHS, passedtests);
}

TEST_F(Imgproc_LSD_ADV, constColor)
{
    for (int i = 0; i < EPOCHS; ++i)
    {
        GenerateConstColor(test_image);
        Ptr<LineSegmentDetector> detector = createLineSegmentDetector(LSD_REFINE_ADV);
        detector.detect(test_image, lines);

        if(0u == lines.size()) ++passedtests;
    }
    ASSERT_EQ(EPOCHS, passedtests);
}

TEST_F(Imgproc_LSD_ADV, lines)
{
    for (int i = 0; i < EPOCHS; ++i)
    {
        const unsigned int numOfLines = 1;
        GenerateLines(test_image, numOfLines);
        Ptr<LineSegmentDetector> detector = createLineSegmentDetector(LSD_REFINE_ADV);
        detector.detect(test_image, lines);

        if(numOfLines * 2 == lines.size()) ++passedtests;  // * 2 because of Gibbs effect
    }
    ASSERT_EQ(EPOCHS, passedtests);
}

TEST_F(Imgproc_LSD_ADV, rotatedRect)
{
    for (int i = 0; i < EPOCHS; ++i)
    {
        GenerateRotatedRect(test_image);
        Ptr<LineSegmentDetector> detector = createLineSegmentDetector(LSD_REFINE_ADV);
        detector.detect(test_image, lines);

        if(2u <= lines.size())  ++passedtests;
    }
    ASSERT_EQ(EPOCHS, passedtests);
}

TEST_F(Imgproc_LSD_STD, whiteNoise)
{
    for (int i = 0; i < EPOCHS; ++i)
    {
        GenerateWhiteNoise(test_image);
        Ptr<LineSegmentDetector> detector = createLineSegmentDetector(LSD_REFINE_STD);
        detector.detect(test_image, lines);

        if(50u >= lines.size()) ++passedtests;
    }
    ASSERT_EQ(EPOCHS, passedtests);
}

TEST_F(Imgproc_LSD_STD, constColor)
{
    for (int i = 0; i < EPOCHS; ++i)
    {
        GenerateConstColor(test_image);
        Ptr<LineSegmentDetector> detector = createLineSegmentDetector(LSD_REFINE_STD);
        detector.detect(test_image, lines);

        if(0u == lines.size()) ++passedtests;
    }
    ASSERT_EQ(EPOCHS, passedtests);
}

TEST_F(Imgproc_LSD_STD, lines)
{
    for (int i = 0; i < EPOCHS; ++i)
    {
        const unsigned int numOfLines = 1;
        GenerateLines(test_image, numOfLines);
        Ptr<LineSegmentDetector> detector = createLineSegmentDetector(LSD_REFINE_STD);
        detector.detect(test_image, lines);

        if(numOfLines * 2 == lines.size()) ++passedtests;  // * 2 because of Gibbs effect
    }
    ASSERT_EQ(EPOCHS, passedtests);
}

TEST_F(Imgproc_LSD_STD, rotatedRect)
{
    for (int i = 0; i < EPOCHS; ++i)
    {
        GenerateRotatedRect(test_image);
        Ptr<LineSegmentDetector> detector = createLineSegmentDetector(LSD_REFINE_STD);
        detector.detect(test_image, lines);

        if(4u <= lines.size()) ++passedtests;
    }
    ASSERT_EQ(EPOCHS, passedtests);
}

TEST_F(Imgproc_LSD_NONE, whiteNoise)
{
    for (int i = 0; i < EPOCHS; ++i)
    {
        GenerateWhiteNoise(test_image);
        Ptr<LineSegmentDetector> detector = createLineSegmentDetector(LSD_REFINE_STD);
        detector.detect(test_image, lines);

        if(50u >= lines.size()) ++passedtests;
    }
    ASSERT_EQ(EPOCHS, passedtests);
}

TEST_F(Imgproc_LSD_NONE, constColor)
{
    for (int i = 0; i < EPOCHS; ++i)
    {
        GenerateConstColor(test_image);
        Ptr<LineSegmentDetector> detector = createLineSegmentDetector(LSD_REFINE_NONE);
        detector.detect(test_image, lines);

        if(0u == lines.size()) ++passedtests;
    }
    ASSERT_EQ(EPOCHS, passedtests);
}

TEST_F(Imgproc_LSD_NONE, lines)
{
    for (int i = 0; i < EPOCHS; ++i)
    {
        const unsigned int numOfLines = 1;
        GenerateLines(test_image, numOfLines);
        Ptr<LineSegmentDetector> detector = createLineSegmentDetector(LSD_REFINE_NONE);
        detector.detect(test_image, lines);

        if(numOfLines * 2 == lines.size()) ++passedtests;  // * 2 because of Gibbs effect
    }
    ASSERT_EQ(EPOCHS, passedtests);
}

TEST_F(Imgproc_LSD_NONE, rotatedRect)
{
    for (int i = 0; i < EPOCHS; ++i)
    {
        GenerateRotatedRect(test_image);
        Ptr<LineSegmentDetector> detector = createLineSegmentDetector(LSD_REFINE_NONE);
        detector.detect(test_image, lines);

        if(8u <= lines.size()) ++passedtests;
    }
    ASSERT_EQ(EPOCHS, passedtests);
}
