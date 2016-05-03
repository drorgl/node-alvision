/*M///////////////////////////////////////////////////////////////////////////////////////
//
//  IMPORTANT: READ BEFORE DOWNLOADING, COPYING, INSTALLING OR USING.
//
//  By downloading, copying, installing or using the software you agree to this license.
//  If you do not agree to this license, do not download, install,
//  copy or use the software.
//
//
//                          License Agreement
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
//
//using namespace std;
//using namespace cv;

//#define DRAW_TEST_IMAGE

class CV_DrawingTest extends alvision.cvtest.BaseTest {
    //public:
    //    CV_DrawingTest(){}
    //protected:
    //    void run( int );
    public draw(img: alvision.Mat): void { }
    //    virtual void draw( Mat& img ) = 0;
    public checkLineIterator(img: alvision.Mat): alvision.int { throw new Error("Not implemented"); }
    //    virtual int checkLineIterator( Mat& img) = 0;


    public run(i: alvision.int): void {
        var testImg = new alvision.Mat();
        var valImg = new alvision.Mat();

        var fname = "drawing/image.png";
        var path = this.ts.get_data_path();
        var filename = path + fname;

        this.draw(testImg);

        valImg = alvision.imread(filename);
        if (valImg.empty()) {
            alvision.imwrite(filename, testImg);
            //ts->printf( alvision.cvtest.TSConstants.LOG, "test image can not be read");
            //this.ts.set_failed_test_info(cvtest::TS::FAIL_INVALID_TEST_DATA);
        }
        else {
            // image should match exactly
            var err = alvision.cvtest.norm(testImg, valImg, alvision.NormTypes.NORM_L1);
            var Eps = 1;
            //float Eps = 1;
            if (err > Eps) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "NORM_L1 between testImg and valImg is equal %f (larger than %f)\n", err, Eps);
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_BAD_ACCURACY);
            }
            else {
                this.ts.set_failed_test_info(this.checkLineIterator(testImg).valueOf());
            }
        }
        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.OK);
    }

}


class CV_DrawingTest_CPP extends CV_DrawingTest {
    //public:
    //    CV_DrawingTest_CPP() {}
    //protected:
    //    virtual void draw( Mat& img );
    //    virtual int checkLineIterator( Mat& img);


    public draw(img: alvision.Mat): void {
        var imgSize = new alvision.Size(600, 400);
        img.create(imgSize, alvision.MatrixType.CV_8UC3);

        var polyline = new Array<alvision.Point>();
        //vector<Point> polyline(4);
        polyline[0] = new alvision.Point(0, 0);
        polyline[1] = new alvision.Point(imgSize.width, 0);
        polyline[2] = new alvision.Point(imgSize.width, imgSize.height);
        polyline[3] = new alvision.Point(0, imgSize.height);
        //const Point* pts = &polyline[0];
        //int n = (int)polyline.size();
        alvision.fillPoly(img, polyline, 1, alvision.Scalar.all(255));
        //fillPoly( img, &pts, &n, 1, Scalar::all(255) );

        var p1 = new alvision.Point(1, 1);
        var p2 = new alvision.Point(3, 3);
        //Point p1(1,1), p2(3,3);


        if (alvision.clipLine(new alvision.Rect(0, 0, imgSize.width, imgSize.height), p1, p2) && alvision.clipLine(imgSize, p1, p2))
            alvision.circle(img, new alvision.Point(300, 100), 40, new alvision.Scalar(0, 0, 255), 3); // draw

        p2 = new alvision.Point(3, imgSize.height.valueOf() + 1000);
        if (alvision.clipLine(new alvision.Rect(0, 0, imgSize.width, imgSize.height), p1, p2) && alvision.clipLine(imgSize, p1, p2))
            alvision.circle(img, new alvision.Point(500, 300), 50, cvColorToScalar(255, CV_8UC3), 5, 8, 1); // draw

        p1 = new alvision.Point(imgSize.width, 1), p2 = new alvision.Point(imgSize.width, 3);
        if (alvision.clipLine(new alvision.Rect(0, 0, imgSize.width, imgSize.height), p1, p2) && alvision.clipLine(imgSize, p1, p2))
            alvision.circle(img, new alvision.Point(390, 100), 10, new alvision.Scalar(0, 0, 255), 3); // not draw

        p1 = new alvision.Point(imgSize.width.valueOf() - 1, 1), p2 = new alvision.Point(imgSize.width, 3);
        if (alvision.clipLine(new alvision.Rect(0, 0, imgSize.width, imgSize.height), p1, p2) && alvision.clipLine(imgSize, p1, p2))
            alvision.ellipse(img, new alvision.Point(390, 100), new alvision.Size(20, 30), 60, 0, 220.0, new alvision.Scalar(0, 200, 0), 4); //draw

        alvision.ellipse(img, new alvision.RotatedRect(new alvision.Point(100, 200), new alvision.Size(200, 100), 160), new alvision.Scalar(200, 200, 255), 5);

        polyline = [];
        alvision.ellipse2Poly(new alvision.Point(430, 180), new alvision.Size(100, 150), 30, 0, 150, 20, (pts) => { polyline = pts; });
        //pts = &polyline[0];
        //n = (int)polyline.size();
        alvision.polylines(img, polyline, 1, false, new alvision.Scalar(0, 0, 150), 4, CV_AA);
        //n = 0;
    
        for (vector<Point>::const_iterator it = polyline.begin(); n < (int)polyline.size() - 1; ++it, n++ )
        {
            alvision.line(img, *it, *(it + 1), new alvision.Scalar(50, 250, 100));
        }

        polyline = [];
        alvision.ellipse2Poly(new alvision.Point(500, 300), new alvision.Size(50, 80), 0, 0, 180, 10, (pts) => { polyline = pts; });
        //pts = &polyline[0];
        //n = (int)polyline.size();
        alvision.polylines(img, polyline, 1, true, new alvision.Scalar(100, 200, 100), 20);
        alvision.fillConvexPoly(img, polyline, new alvision. Scalar(0, 80, 0));

        polyline = [];
        // external rectengular
        polyline[0] = new alvision.Point(0, 0);
        polyline[1] = new alvision.Point(80, 0);
        polyline[2] = new alvision.Point(80, 80);
        polyline[3] = new alvision.Point(0, 80);
        // internal rectangular
        polyline[4] = new alvision.Point(20, 20);
        polyline[5] = new alvision.Point(60, 20);
        polyline[6] = new alvision.Point(60, 60);
        polyline[7] = new alvision.Point(20, 60);
        //const Point* ppts[] = {&polyline[0], &polyline[0]+4};
        //int pn[] = {4, 4};
        alvision.fillPoly(img, ppts, pn, 2, new alvision.Scalar(100, 100, 0), 8, 0, new alvision.Point(500, 20));

        alvision.rectangle(img, new alvision.Point(0, 300), new alvision.Point(50, 398), new alvision.Scalar(0, 0, 255));

        var text1 = "OpenCV";
        var baseline = 0, thickness = 3, fontFace = alvision.HersheyFonts.FONT_HERSHEY_SCRIPT_SIMPLEX;
        var fontScale = 2;
        var textSize = alvision.getTextSize(text1, fontFace, fontScale, thickness, (bl) => { baseline = bl.valueOf(); });
        baseline += thickness;
        var textOrg = new alvision.Point((img.cols.valueOf() - textSize.width.valueOf()) / 2, (img.rows.valueOf() + textSize.height.valueOf()) / 2);
        alvision.rectangle(img, textOrg + new alvision.Point(0, baseline), textOrg + new alvision.Point(textSize.width, -textSize.height), new alvision.Scalar(0, 0, 255));
        alvision.line(img, textOrg + new alvision.Point(0, thickness), textOrg + new alvision.Point(textSize.width, thickness), new alvision.Scalar(0, 0, 255));
        alvision.putText(img, text1, textOrg, fontFace, fontScale, alvision.Scalar(150, 0, 150), thickness, 8);

        var text2 = "abcdefghijklmnopqrstuvwxyz1234567890";
        var color = new alvision.Scalar(200, 0, 0);
        fontScale = 0.5, thickness = 1;
        var dist = 5;

        textSize = alvision.getTextSize(text2, alvision.HersheyFonts.FONT_HERSHEY_SIMPLEX, fontScale, thickness, (bl) => { baseline = bl; });
        textOrg = new alvision.Point(5, 5) + new alvision.Point(0, textSize.height + dist);
        alvision.putText(img, text2, textOrg, alvision.HersheyFonts.FONT_HERSHEY_SIMPLEX, fontScale, color, thickness, CV_AA);

        fontScale = 1;
        textSize = alvision.getTextSize(text2, alvision.HersheyFonts.FONT_HERSHEY_PLAIN, fontScale, thickness, (bl) => { baseline = bl; });
        textOrg += new alvision.Point(0, textSize.height + dist);
        alvision.putText(img, text2, textOrg, alvision.HersheyFonts.FONT_HERSHEY_PLAIN, fontScale, color, thickness, CV_AA);

        fontScale = 0.5;
        textSize = alvision.getTextSize(text2, alvision.HersheyFonts.FONT_HERSHEY_DUPLEX, fontScale, thickness, (bl) => { baseline = bl; });
        textOrg += new alvision.Point(0, textSize.height + dist);
        alvision.putText(img, text2, textOrg, alvision.HersheyFonts.FONT_HERSHEY_DUPLEX, fontScale, color, thickness, CV_AA);

        textSize = alvision.getTextSize(text2, alvision.HersheyFonts.FONT_HERSHEY_COMPLEX, fontScale, thickness, (bl) => { baseline = bl; });
        textOrg += new alvision.Point(0, textSize.height + dist);
        alvision.putText(img, text2, textOrg, alvision.HersheyFonts.FONT_HERSHEY_COMPLEX, fontScale, color, thickness, CV_AA);

        textSize = alvision.getTextSize(text2, FONT_HERSHEY_TRIPLEX, fontScale, thickness, (bl) => { baseline = bl; });
        textOrg += new alvision.Point(0, textSize.height + dist);
        alvision.putText(img, text2, textOrg, FONT_HERSHEY_TRIPLEX, fontScale, color, thickness, CV_AA);

        fontScale = 1;
        textSize = alvision.getTextSize(text2, FONT_HERSHEY_COMPLEX_SMALL, fontScale, thickness, (bl) => { baseline = bl; });
        textOrg += new alvision.Point(0, 180) + Point(0, textSize.height + dist);
        alvision.putText(img, text2, textOrg, FONT_HERSHEY_COMPLEX_SMALL, fontScale, color, thickness, CV_AA);

        textSize = alvision.getTextSize(text2, FONT_HERSHEY_SCRIPT_SIMPLEX, fontScale, thickness, (bl) => { baseline = bl; });
        textOrg += new alvision.Point(0, textSize.height + dist);
        alvision.putText(img, text2, textOrg, FONT_HERSHEY_SCRIPT_SIMPLEX, fontScale, color, thickness, CV_AA);

        textSize = alvision.getTextSize(text2, FONT_HERSHEY_SCRIPT_COMPLEX, fontScale, thickness, (bl) => { baseline = bl; });
        textOrg += Point(0, textSize.height + dist);
        alvision.putText(img, text2, textOrg, FONT_HERSHEY_SCRIPT_COMPLEX, fontScale, color, thickness, CV_AA);

        dist = 15, fontScale = 0.5;
        textSize = alvision.getTextSize(text2, FONT_ITALIC, fontScale, thickness, (bl) => { baseline = bl; });
        textOrg += Point(0, textSize.height + dist);
        alvision.putText(img, text2, textOrg, FONT_ITALIC, fontScale, color, thickness, CV_AA);
    }

    checkLineIterator(img: alvision.Mat): alvision.int {
        LineIterator it(img, Point(0, 300), Point(1000, 300));
        for (int i = 0; i < it.count; ++it, i++ )
        {
            Vec3b v = (Vec3b)(*(*it)) - img.at<Vec3b>(300, i);
            float err = (float)cvtest::norm(v, NORM_L2);
            if (err != 0) {
                ts ->printf(ts ->LOG, "LineIterator works incorrect");
                ts ->set_failed_test_info(cvtest::TS::FAIL_INVALID_OUTPUT);
            }
        }
        this.ts.set_failed_test_info(cvtest::TS::OK);
        return 0;
    }
}

class CV_DrawingTest_C extends CV_DrawingTest {
    //public:
    //    CV_DrawingTest_C() {}
    //protected:
    //    virtual void draw( Mat& img );
    //    virtual int checkLineIterator( Mat& img);


    draw(_img: alvision.Mat): void {
        CvSize imgSize = cvSize(600, 400);
        _img.create(imgSize, CV_8UC3);
        CvMat img = _img;

        vector < CvPoint > polyline(4);
        polyline[0] = cvPoint(0, 0);
        polyline[1] = cvPoint(imgSize.width, 0);
        polyline[2] = cvPoint(imgSize.width, imgSize.height);
        polyline[3] = cvPoint(0, imgSize.height);
        CvPoint * pts = &polyline[0];
        int n = (int)polyline.size();
        int actualSize = 0;
        cvFillPoly( &img, &pts, &n, 1, cvScalar(255, 255, 255));

        CvPoint p1 = cvPoint(1, 1), p2 = cvPoint(3, 3);
        if (cvClipLine(imgSize, &p1, &p2))
            cvCircle( &img, cvPoint(300, 100), 40, cvScalar(0, 0, 255), 3); // draw

        p1 = cvPoint(1, 1), p2 = cvPoint(3, imgSize.height + 1000);
        if (cvClipLine(imgSize, &p1, &p2))
            cvCircle( &img, cvPoint(500, 300), 50, cvScalar(255, 0, 0), 5, 8, 1); // draw

        p1 = cvPoint(imgSize.width, 1), p2 = cvPoint(imgSize.width, 3);
        if (cvClipLine(imgSize, &p1, &p2))
            cvCircle( &img, cvPoint(390, 100), 10, cvScalar(0, 0, 255), 3); // not draw

        p1 = Point(imgSize.width - 1, 1), p2 = Point(imgSize.width, 3);
        if (cvClipLine(imgSize, &p1, &p2))
            cvEllipse( &img, cvPoint(390, 100), cvSize(20, 30), 60, 0, 220.0, cvScalar(0, 200, 0), 4); //draw

        CvBox2D box;
        box.center.x = 100;
        box.center.y = 200;
        box.size.width = 200;
        box.size.height = 100;
        box.angle = 160;
        cvEllipseBox( &img, box, Scalar(200, 200, 255), 5);

        polyline.resize(9);
        pts = &polyline[0];
        n = (int)polyline.size();
        actualSize = cvEllipse2Poly(cvPoint(430, 180), cvSize(100, 150), 30, 0, 150, &polyline[0], 20);
        CV_Assert(actualSize == n);
        cvPolyLine( &img, &pts, &n, 1, false, cvScalar(0, 0, 150), 4, CV_AA);
        n = 0;
        for (vector<CvPoint>::const_iterator it = polyline.begin(); n < (int)polyline.size() - 1; ++it, n++ )
        {
            cvLine( &img, *it, *(it + 1), cvScalar(50, 250, 100));
        }

        polyline.resize(19);
        pts = &polyline[0];
        n = (int)polyline.size();
        actualSize = cvEllipse2Poly(cvPoint(500, 300), cvSize(50, 80), 0, 0, 180, &polyline[0], 10);
        CV_Assert(actualSize == n);
        cvPolyLine( &img, &pts, &n, 1, true, Scalar(100, 200, 100), 20);
        cvFillConvexPoly( &img, pts, n, cvScalar(0, 80, 0));

        polyline.resize(8);
        // external rectengular
        polyline[0] = cvPoint(500, 20);
        polyline[1] = cvPoint(580, 20);
        polyline[2] = cvPoint(580, 100);
        polyline[3] = cvPoint(500, 100);
        // internal rectangular
        polyline[4] = cvPoint(520, 40);
        polyline[5] = cvPoint(560, 40);
        polyline[6] = cvPoint(560, 80);
        polyline[7] = cvPoint(520, 80);
        CvPoint * ppts[] = {&polyline[0], &polyline[0] + 4 };
        int pn[] = { 4, 4};
        cvFillPoly( &img, ppts, pn, 2, cvScalar(100, 100, 0), 8, 0);

        cvRectangle( &img, cvPoint(0, 300), cvPoint(50, 398), cvScalar(0, 0, 255));

        string text1 = "OpenCV";
        CvFont font;
        cvInitFont( &font, FONT_HERSHEY_SCRIPT_SIMPLEX, 2, 2, 0, 3);
        int baseline = 0;
        CvSize textSize;
        cvGetTextSize(text1.c_str(), &font, &textSize, &baseline);
        baseline += font.thickness;
        CvPoint textOrg = cvPoint((imgSize.width - textSize.width) / 2, (imgSize.height + textSize.height) / 2);
        cvRectangle( &img, cvPoint(textOrg.x, textOrg.y + baseline),
            cvPoint(textOrg.x + textSize.width, textOrg.y - textSize.height), cvScalar(0, 0, 255));
        cvLine( &img, cvPoint(textOrg.x, textOrg.y + font.thickness),
            cvPoint(textOrg.x + textSize.width, textOrg.y + font.thickness), cvScalar(0, 0, 255));
        cvPutText( &img, text1.c_str(), textOrg, &font, cvScalar(150, 0, 150));

        int dist = 5;
        string text2 = "abcdefghijklmnopqrstuvwxyz1234567890";
        CvScalar color = cvScalar(200, 0, 0);
        cvInitFont( &font, FONT_HERSHEY_SIMPLEX, 0.5, 0.5, 0, 1, CV_AA);
        cvGetTextSize(text2.c_str(), &font, &textSize, &baseline);
        textOrg = cvPoint(5, 5 + textSize.height + dist);
        cvPutText(&img, text2.c_str(), textOrg, &font, color);

        cvInitFont( &font, FONT_HERSHEY_PLAIN, 1, 1, 0, 1, CV_AA);
        cvGetTextSize(text2.c_str(), &font, &textSize, &baseline);
        textOrg = cvPoint(textOrg.x, textOrg.y + textSize.height + dist);
        cvPutText(&img, text2.c_str(), textOrg, &font, color);

        cvInitFont( &font, FONT_HERSHEY_DUPLEX, 0.5, 0.5, 0, 1, CV_AA);
        cvGetTextSize(text2.c_str(), &font, &textSize, &baseline);
        textOrg = cvPoint(textOrg.x, textOrg.y + textSize.height + dist);
        cvPutText(&img, text2.c_str(), textOrg, &font, color);

        cvInitFont( &font, FONT_HERSHEY_COMPLEX, 0.5, 0.5, 0, 1, CV_AA);
        cvGetTextSize(text2.c_str(), &font, &textSize, &baseline);
        textOrg = cvPoint(textOrg.x, textOrg.y + textSize.height + dist);
        cvPutText(&img, text2.c_str(), textOrg, &font, color);

        cvInitFont( &font, FONT_HERSHEY_TRIPLEX, 0.5, 0.5, 0, 1, CV_AA);
        cvGetTextSize(text2.c_str(), &font, &textSize, &baseline);
        textOrg = cvPoint(textOrg.x, textOrg.y + textSize.height + dist);
        cvPutText(&img, text2.c_str(), textOrg, &font, color);

        cvInitFont( &font, FONT_HERSHEY_COMPLEX_SMALL, 1, 1, 0, 1, CV_AA);
        cvGetTextSize(text2.c_str(), &font, &textSize, &baseline);
        textOrg = cvPoint(textOrg.x, textOrg.y + textSize.height + dist + 180);
        cvPutText(&img, text2.c_str(), textOrg, &font, color);

        cvInitFont( &font, FONT_HERSHEY_SCRIPT_SIMPLEX, 1, 1, 0, 1, CV_AA);
        cvGetTextSize(text2.c_str(), &font, &textSize, &baseline);
        textOrg = cvPoint(textOrg.x, textOrg.y + textSize.height + dist);
        cvPutText(&img, text2.c_str(), textOrg, &font, color);

        cvInitFont( &font, FONT_HERSHEY_SCRIPT_COMPLEX, 1, 1, 0, 1, CV_AA);
        cvGetTextSize(text2.c_str(), &font, &textSize, &baseline);
        textOrg = cvPoint(textOrg.x, textOrg.y + textSize.height + dist);
        cvPutText(&img, text2.c_str(), textOrg, &font, color);

        dist = 15;
        cvInitFont( &font, FONT_ITALIC, 0.5, 0.5, 0, 1, CV_AA);
        cvGetTextSize(text2.c_str(), &font, &textSize, &baseline);
        textOrg = cvPoint(textOrg.x, textOrg.y + textSize.height + dist);
        cvPutText(&img, text2.c_str(), textOrg, &font, color);
    }

    checkLineIterator(_img: alvision.Mat): alvision.int {
        CvLineIterator it;
        CvMat img = _img;
        int count = cvInitLineIterator( &img, cvPoint(0, 300), cvPoint(1000, 300), &it);
        for (int i = 0; i < count; i++ )
        {
            Vec3b v = (Vec3b)(*(it.ptr)) - _img.at<Vec3b>(300, i);
            float err = (float)cvtest::norm(v, NORM_L2);
            if (err != 0) {
                ts ->printf(ts ->LOG, "CvLineIterator works incorrect");
                ts ->set_failed_test_info(cvtest::TS::FAIL_INVALID_OUTPUT);
            }
            CV_NEXT_LINE_POINT(it);
        }
        this.ts.set_failed_test_info(cvtest::TS::OK);
        return 0;
    }

}

//#ifdef HAVE_JPEG
alvision.cvtest.TEST('Imgcodecs_Drawing', 'cpp_regression', () => { var test = new CV_DrawingTest_CPP(); test.safe_run(); });
alvision.cvtest.TEST('Imgcodecs_Drawing', 'c_regression', () => { var test = new CV_DrawingTest_C(); test.safe_run(); });
//#endif

class CV_FillConvexPolyTest extends alvision.cvtest.BaseTest {
    //public:
    //    CV_FillConvexPolyTest() {}
    //    ~CV_FillConvexPolyTest() {}
    //protected:
    public run(iii: alvision.int): void {
        //vector < Point > line1;
        var line1 = new Array<alvision.Point>();
        //vector < Point > line2;
        var line2 = new Array<alvision.Point>();

        line1.push(new alvision.Point(1, 1));
        line1.push(new alvision.Point(5, 1));
        line1.push(new alvision.Point(5, 8));
        line1.push(new alvision.Point(1, 8));

        line2.push(new alvision.Point(2, 2));
        line2.push(new alvision.Point(10, 2));
        line2.push(new alvision.Point(10, 16));
        line2.push(new alvision.Point(2, 16));

        var gray0 = new alvision.Mat(10, 10,alvision.MatrixType. CV_8U, new alvision.Scalar(0));
        alvision.fillConvexPoly(gray0, line1,new alvision. Scalar(255), 8, 0);
        var nz1 = alvision.countNonZero(gray0);

        alvision.fillConvexPoly(gray0, line2, new alvision.Scalar(0), 8, 1);
        var nz2 = alvision.countNonZero(gray0).valueOf() / 255;

        alvision.CV_Assert(()=>nz1 == 40 && nz2 == 0);
    }
}

alvision.cvtest.TEST('Imgcodecs_Drawing', 'fillconvexpoly_clipping', () => { var test = new CV_FillConvexPolyTest(); test.safe_run(); });

class CV_DrawingTest_UTF8 extends alvision.cvtest.BaseTest {
    //public:
    //    CV_DrawingTest_UTF8() {}
    //    ~CV_DrawingTest_UTF8() {}
    //protected:
    public run(iii: alvision.int): void {
        //vector < string > lines;
        var lines = new Array<string>();

        lines.push("abcdefghijklmnopqrstuvwxyz1234567890");
        // cyrillic letters small
        lines.push("\xD0\xB0\xD0\xB1\xD0\xB2\xD0\xB3\xD0\xB4\xD0\xB5\xD1\x91\xD0\xB6\xD0\xB7" + 
                        "\xD0\xB8\xD0\xB9\xD0\xBA\xD0\xBB\xD0\xBC\xD0\xBD\xD0\xBE\xD0\xBF\xD1\x80" + 
                        "\xD1\x81\xD1\x82\xD1\x83\xD1\x84\xD1\x85\xD1\x86\xD1\x87\xD1\x88\xD1\x89" + 
                        "\xD1\x8A\xD1\x8B\xD1\x8C\xD1\x8D\xD1\x8E\xD1\x8F");
        // cyrillic letters capital
        lines.push("\xD0\x90\xD0\x91\xD0\x92\xD0\x93\xD0\x94\xD0\x95\xD0\x81\xD0\x96\xD0\x97" + 
                        "\xD0\x98\xD0\x99\xD0\x9A\xD0\x9B\xD0\x9C\xD0\x9D\xD0\x9E\xD0\x9F\xD0\xA0" + 
                        "\xD0\xA1\xD0\xA2\xD0\xA3\xD0\xA4\xD0\xA5\xD0\xA6\xD0\xA7\xD0\xA8\xD0\xA9" + 
                        "\xD0\xAA\xD0\xAB\xD0\xAC\xD0\xAD\xD0\xAE\xD0\xAF");
        // bounds
        lines.push("-\xD0\x80-\xD0\x8E-\xD0\x8F-");
        lines.push("-\xD1\x90-\xD1\x91-\xD1\xBF-");
        // bad utf8
        lines.push("-\x81-\x82-\x83-");
        lines.push("--\xF0--");
        lines.push("-\xF0");

        //vector < int > fonts;
        var fonts = new Array<number>();

        fonts.push(alvision.HersheyFonts.FONT_HERSHEY_SIMPLEX);
        fonts.push(alvision.HersheyFonts. FONT_HERSHEY_PLAIN);
        fonts.push(alvision.HersheyFonts. FONT_HERSHEY_DUPLEX);
        fonts.push(alvision.HersheyFonts. FONT_HERSHEY_COMPLEX);
        fonts.push(alvision.HersheyFonts. FONT_HERSHEY_TRIPLEX);
        fonts.push(alvision.HersheyFonts. FONT_HERSHEY_COMPLEX_SMALL);
        fonts.push(alvision.HersheyFonts. FONT_HERSHEY_SCRIPT_SIMPLEX);
        fonts.push(alvision.HersheyFonts. FONT_HERSHEY_SCRIPT_COMPLEX);

        //vector < Mat > results;
        var results = new Array<alvision.Mat>();

        var bigSize = new alvision.Size(0, 0);
        
        for (vector<int>::const_iterator font = fonts.begin(); font != fonts.end(); ++font) {
            for (int italic = 0; italic <= FONT_ITALIC; italic += FONT_ITALIC)
            {
                for (vector<string>::const_iterator line = lines.begin(); line != lines.end(); ++line) {
                    const float fontScale = 1;
                    const int thickness = 1;
                    const Scalar color(20, 20, 20);
                    int baseline = 0;

                    Size textSize = getTextSize(*line, *font | italic, fontScale, thickness, &baseline);
                    Point textOrg(0, textSize.height + 2);
                    Mat img(textSize + Size(0, baseline), CV_8UC3, Scalar(255, 255, 255));
                    putText(img, *line, textOrg, *font | italic, fontScale, color, thickness, CV_AA);

                    results.push_back(img);
                    bigSize.width = max(bigSize.width, img.size().width);
                    bigSize.height += img.size().height + 1;
                }
            }
        }

        var shift = 0;
        var  result = new alvision.Mat(bigSize, alvision.MatrixType.CV_8UC3,new alvision. Scalar(100, 100, 100));
        for (vector<Mat>::const_iterator img = results.begin(); img != results.end(); ++img) {
            var roi = new alvision.Rect(new alvision.Point(0, shift), img.size());
            var sub = new alvision.Mat(result, roi);
            img.copyTo(sub);
            shift += img.size().height + 1;
        }
        alvision.imwrite("/tmp/all_fonts.png", result);
    }
}

alvision.cvtest.TEST('Highgui_Drawing', 'utf8_support', () => { var test = new CV_DrawingTest_UTF8 (); test.safe_run(); });
