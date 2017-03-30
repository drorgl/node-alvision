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

import async = require("async");
import alvision = require("../../../tsbinding/alvision");
import util = require('util');
import fs = require('fs');


//#include "test_precomp.hpp"
//#include "opencv2/highgui.hpp"
//
//using namespace cv;
//using namespace std;

class CV_FindContourTest  extends alvision.cvtest.BaseTest
{
    protected NUM_IMG = 4;

     constructor() {
         super();
         

         this.test_case_count = 300;
         this.min_blob_size = 1;
         this.max_blob_size = 50;
         this.max_log_blob_count = 10;

         this.min_log_img_size = 3;
         this.max_log_img_size = 10;

         for (var i = 0; i < this.NUM_IMG; i++)
             this.img[i] = null;

         this.contours = null;
         this.hierarchy = null;
     }
     clear(): void {
         //int i;

         super.clear();

         //for (var i = 0; i < NUM_IMG; i++)
         //    cvReleaseImage( img[i]);

         //this.storage.release();
         //this.storage.length = 0;
         this.contours = null;
         this.hierarchy = null;
         //cvReleaseMemStorage( &storage);
     }

     read_params(fs: alvision.FileStorage): alvision.int{
         //int t;
         var code = super.read_params(fs);

         if (code < 0)
             return code;

         this.min_blob_size = alvision.cvReadInt(this.find_param(fs, "min_blob_size"), this.min_blob_size);
         this.max_blob_size = alvision.cvReadInt(this.find_param(fs, "max_blob_size"), this.max_blob_size);
         this.max_log_blob_count = alvision.cvReadInt(this.find_param(fs, "max_log_blob_count"), this.max_log_blob_count);
         this.min_log_img_size = alvision.cvReadInt(this.find_param(fs, "min_log_img_size"), this.min_log_img_size);
         this.max_log_img_size = alvision.cvReadInt(this.find_param(fs, "max_log_img_size"), this.max_log_img_size);

         this.min_blob_size = alvision.cvtest.clipInt(this.min_blob_size, 1, 100);
         this.max_blob_size = alvision.cvtest.clipInt(this.max_blob_size, 1, 100);

         if (this.min_blob_size > this.max_blob_size) {
             let t = this.min_blob_size; this.min_blob_size = this.max_blob_size; this.max_blob_size = t;
             //CV_SWAP(this.min_blob_size, this.max_blob_size, t);
         }

         this.max_log_blob_count = alvision.cvtest.clipInt(this.max_log_blob_count, 1, 10);

         this.min_log_img_size = alvision.cvtest.clipInt(this.min_log_img_size, 1, 10);
         this.max_log_img_size = alvision.cvtest.clipInt(this.max_log_img_size, 1, 10);

         if (this.min_log_img_size > this.max_log_img_size) {
             let t = this.min_log_img_size; this.min_log_img_size = this.max_log_img_size; this.max_log_img_size = t;
             //CV_SWAP(this.min_log_img_size, this.max_log_img_size, t);
         }

         return 0;
     }
     prepare_test_case(test_case_idx: alvision.int): alvision.int{
         var rng = this.ts.get_rng();
         const min_brightness = 0, max_brightness = 2;
         //int i,
             var code = super.prepare_test_case(test_case_idx);

         if (code < 0)
             return code;

         this.clear();

         this.blob_count = Math.round(Math.exp(alvision.cvtest.randReal(rng).valueOf() * this.max_log_blob_count.valueOf() * Math.LOG2E));

         this.img_size.width = Math.round(Math.exp((alvision.cvtest.randReal(rng).valueOf() *
             (this.max_log_img_size.valueOf() - this.min_log_img_size.valueOf()) + this.min_log_img_size.valueOf()) * Math.LOG2E));
         this.img_size.height = Math.round(Math.exp((alvision.cvtest.randReal(rng).valueOf() *
             (this.max_log_img_size.valueOf() - this.min_log_img_size.valueOf()) + this.min_log_img_size.valueOf()) * Math.LOG2E));

         this.approx_method = alvision.cvtest.randInt(rng).valueOf() % 4 + 1;
         this.retr_mode = alvision.cvtest.randInt(rng).valueOf() % 4;

         this.contours = new Array<Array<alvision.Point>>();// new alvision.FileStorage("x.xml", alvision.FileStorageMode.MEMORY);// cvCreateMemStorage(1 << 10);

         for (var i = 0; i < this.NUM_IMG; i++)
             this.img[i] = new alvision.Mat(this.img_size, alvision.MatrixType.CV_MAKETYPE(8, 1));// cvCreateImage(img_size, 8, 1);

         cvTsGenerateBlobImage(this.img[0], this.min_blob_size, this.max_blob_size,
             this.blob_count, min_brightness, max_brightness, rng);

         this.img[0].copyTo(this.img[1]);
         //cvCopy(img[0], img[1]);
         this.img[0].copyTo(this.img[2]);
         //cvCopy(img[0], img[2]);

         cvTsMarkContours(this.img[1], 255);

         return 1;
     }
     validate_test_results(test_case_idx: alvision.int): alvision.int {
         var code = alvision.cvtest.FailureCode.OK;

         alvision.compare(this.img[0],0, this.img[0], alvision.CmpTypes.CMP_GT);

         if (this.count != this.count2) {
             this.ts.printf(alvision.cvtest.TSConstants.LOG, "The number of contours retrieved with different " +
                 "approximation methods is not the same\n" +
                 "(%d contour(s) for method %d vs %d contour(s) for method %d)\n",
                 this.count, this.approx_method, this.count2);//, CV_CHAIN_CODE);
             code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
         }

         if (this.retr_mode != alvision.RetrievalModes.RETR_EXTERNAL && this.approx_method < alvision.ContourApproximationModes.CHAIN_APPROX_TC89_L1) {
             let _img = new Array < alvision.Mat>(4);
             for (var i = 0; i < 4; i++ )
                _img[i] = this.img[i];

             code = alvision.cvtest.cmpEps2(this.ts, _img[0], _img[3], 0, true, "Comparing original image with the map of filled contours");

             if (code < 0) {
                 this.ts.set_failed_test_info(code);return code;
                 //goto _exit_;
             }

             code = alvision.cvtest.cmpEps2(this.ts, _img[1], _img[2], 0, true,
                 "Comparing contour outline vs manually produced edge map");

             if (code < 0) {
                 this.ts.set_failed_test_info(code); return code;
                 //goto _exit_;
             }
         }

         if (this.contours) {
             //CvTreeNodeIterator iterator1;
             //CvTreeNodeIterator iterator2;
             //int count3;
             let count3: alvision.int;

             for (var i = 0; i < 2; i++ )
             {
                 //CvTreeNodeIterator iterator;
                 //cvInitTreeNodeIterator( &iterator, i == 0 ? contours : contours2, INT_MAX);

                 //for (count3 = 0; cvNextTreeNode( &iterator) != 0; count3++)
                 //    ;

                 if (this.contours.length != this.hierarchy.length){
                 //if (count3 != this.count) {
                     this.ts.printf(alvision.cvtest.TSConstants.LOG,
                         "The returned number of retrieved contours (using the approx_method = %d) does not match\n" + 
                    "to the actual number of contours in the tree/list (returned %d, actual %d)\n",
                         i == 0 ? this.approx_method : 0, this.count, count3);
                 code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
                 this.ts.set_failed_test_info(code); return code;
                     //goto _exit_;
                 }
             }

             //TODO: add validations for new api

             //cvInitTreeNodeIterator( &iterator1, contours, INT_MAX);
             //cvInitTreeNodeIterator( &iterator2, contours2, INT_MAX);

             //for (count3 = 0; count3 < count; count3++) {
                 //CvSeq * seq1 = (CvSeq *)cvNextTreeNode( &iterator1);
                 //CvSeq * seq2 = (CvSeq *)cvNextTreeNode( &iterator2);
                 //CvSeqReader reader1;
                 //CvSeqReader reader2;
                 //
                 //if (!seq1 || !seq2) {
                 //    this.ts.printf(alvision.cvtest.TSConstants.LOG,
                 //        "There are NULL pointers in the original contour tree or the " + 
                 //   "tree produced by cvApproxChains\n" );
                 //    code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
                 //    goto _exit_;
                 //}
                 //
                 //cvStartReadSeq(seq1, &reader1);
                 //cvStartReadSeq(seq2, &reader2);

                 //if (seq1.total != seq2.total) {
                 //    this.ts.printf(alvision.cvtest.TSConstants.LOG,
                 //        "The original contour #%d has %d points, while the corresponding contour has %d point\n",
                 //        count3, seq1.total, seq2.total);
                 //    code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
                 //    goto _exit_;
                 //}
                 //
                 //for (let i = 0; i < seq1.total; i++ )
                 //{
                 //    let pt1 = new alvision.Point();
                 //    let pt2 = new alvision.Point();
                 //
                 //    CV_READ_SEQ_ELEM(pt1, reader1);
                 //    CV_READ_SEQ_ELEM(pt2, reader2);
                 //
                 //    if (pt1.x != pt2.x || pt1.y != pt2.y) {
                 //        this.ts.printf(alvision.cvtest.TSConstants.LOG,
                 //            "The point #%d in the contour #%d is different from the corresponding point " + 
                 //   "in the approximated chain ((%d,%d) vs (%d,%d)", count3, i, pt1.x, pt1.y, pt2.x, pt2.y);
                 //        code = alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT;
                 //        goto _exit_;
                 //    }
                 //}
             //}
         }

         //_exit_:
         if (code < 0) {
             //#if 0
             //        cvNamedWindow( "test", 0 );
             //        cvShowImage( "test", img[0] );
             //        cvWaitKey();
             //#endif
             this.ts.set_failed_test_info(code);
         }

         return code;
     }
    run_func(): void {
        //this.contours = new Array<alvision.Veci>();
            //= this.contours2 = this.chain = null;
        alvision.findContours(this.img[2], this.contours, this.hierarchy, this.retr_mode, this.approx_method);
        this.count = this.contours.length;

        //cvZero(img[3]);
        this.img[3].setTo(0);

        if (this.contours && this.retr_mode != alvision.RetrievalModes.RETR_EXTERNAL && this.approx_method < alvision.ContourApproximationModes.CHAIN_APPROX_TC89_L1) {
            //cvDrawContours(img[3], contours, cvScalar(255), cvScalar(255), INT_MAX, -1);
            alvision.drawContours(this.img[3], this.contours, 0, new alvision.Scalar(255));
        }

        //cvCopy(img[0], img[2]);
        this.img[0].copyTo(this.img[2]);

        //this.count2 = alvision.findContours(this.img[2], this.storage, this.chain, sizeof(CvChain), this.retr_mode,  CV_CHAIN_CODE);
        //
        //if (this.chain) {
        //    contours2 = cvApproxChains(chain, storage, approx_method, 0, 0, 1);
        //}

        //cvZero(img[2]);
        //this.img[2].setTo(0);
        //
        //if (this.contours && this.retr_mode != alvision.RetrievalModes.RETR_EXTERNAL && this.approx_method < alvision.ContourApproximationModes.CHAIN_APPROX_TC89_L1) {
        //    //cvDrawContours(this.img[2], this.contours2, new alvision.Scalar(255), new alvision.Scalar(255), alvision.INT_MAX);
        //    alvision.drawContours(this.img[2], this.contours2, 0, new alvision.Scalar(255));
        //}
    }

    protected  min_blob_size: alvision.int;
        protected max_blob_size : alvision.int;
        protected blob_count: alvision.int;
        protected max_log_blob_count: alvision.int;
        protected retr_mode: alvision.RetrievalModes ;
        protected approx_method: alvision.ContourApproximationModes ;

        protected min_log_img_size: alvision.int;
        protected max_log_img_size: alvision.int;
    protected img_size: alvision.Size;
    protected count: alvision.int;
    protected count2: alvision.int;

    protected img/*[NUM_IMG]*/ : Array<alvision.Mat>;
    protected contours: Array<Array<alvision.Point>>;

    protected hierarchy: Array<alvision.Vec4i>;
    //protected hierarchy: 
    //protected chain: any;
    //protected CvSeq * contours, 
    //    *contours2, 
    //    *chain;
};



function cvTsGenerateBlobImage( img : alvision.Mat, min_blob_size : alvision.int, max_blob_size : alvision.int,
                       blob_count : alvision.int, min_brightness : alvision.int, max_brightness : alvision.int,
                       rng  : alvision.RNG) : void
{
    //int i;
    let size = new alvision.Size();

    alvision.assert(() => img.depth() == alvision.MatrixType.CV_8U && img.channels() == 1);

    //cvZero(img);
    img.setTo(0);

    // keep the border clear
    let img_ = img.roi(new alvision.Rect(1, 1, img.size().width.valueOf() - 2, img.size().height.valueOf() - 2));
    //cvSetImageROI( img, cvRect(1,1,img.width-2,img.height-2) );
    size = img_.size(); //cvGetSize( img );

    for(let i = 0; i < blob_count; i++ )
    {
        let center = new alvision.Point();
        let axes = new alvision.Size();
        let angle = alvision.cvtest.randInt(rng).valueOf() % 180;
        let brightness = alvision.cvtest.randInt(rng).valueOf() %
                         (max_brightness.valueOf() - min_brightness.valueOf()) + min_brightness.valueOf();
        center.x = alvision.cvtest.randInt(rng).valueOf() % size.width.valueOf();
        center.y = alvision.cvtest.randInt(rng).valueOf() % size.height.valueOf();

        axes.width = (alvision.cvtest.randInt(rng).valueOf() %
                     (max_blob_size.valueOf() - min_blob_size.valueOf()) + min_blob_size.valueOf() + 1)/2;
        axes.height = (alvision.cvtest.randInt(rng).valueOf() %
                      (max_blob_size.valueOf() - min_blob_size.valueOf()) + min_blob_size.valueOf() + 1)/2;

        alvision.ellipse( img_, center, axes, angle, 0, 360, new alvision.Scalar(brightness), alvision.CV_FILLED );
    }

    //cvResetImageROI( img );
}


function cvTsMarkContours(  img : alvision.Mat, val  : alvision.int) : void
{
    //int i, j;
    let step = img.step;// .widthStep;

    alvision.assert(()=>img.depth() == alvision.MatrixType.CV_8U && img.channels() == 1 && (val.valueOf() & 1) != 0);

    for(let i = 1; i < img.size().height.valueOf() - 1; i++ )
        for(let j = 1; j < img.size().width.valueOf() - 1; j++ )
        {
            let ptr = img.ptr<alvision.uchar>("uchar");
            let t = ptr[step * i + j];
            if (ptr[step * i + j] == 1 && (ptr[(step * i + j) - step] == 0 || ptr[(step * i + j) - 1] == 0 || t[(step * i + j) + 1] == 0 || t[(step * i + j) + step] == 0))
                ptr[step * i + j] = val;
        }

    alvision.threshold( img, img, val.valueOf() - 2, val, alvision.ThresholdTypes.THRESH_BINARY );
}





alvision.cvtest.TEST('Imgproc_FindContours', 'accuracy', () => { let test = new CV_FindContourTest(); test.safe_run(); });

alvision.cvtest.TEST('Core_Drawing', '_914', () => {
    const  rows = 256;
    const  cols = 256;

    let img = new alvision.Mat(rows, cols, alvision.MatrixType.CV_8UC1,new  alvision.Scalar(255));

    alvision.line(img, new alvision.Point(0, 10),  new alvision.Point(255, 10), new alvision.Scalar(0), 2, 4);
    alvision.line(img, new alvision.Point(-5, 20), new alvision.Point(260, 20), new alvision.Scalar(0), 2, 4);
    alvision.line(img, new alvision.Point(10, 0),  new alvision.Point(10, 255), new alvision.Scalar(0), 2, 4);

    let x0 = 0.0 /   Math.pow(2.0, -2.0);
    let x1 = 255.0 / Math.pow(2.0, -2.0);
    let y = 30.5 /   Math.pow(2.0, -2.0);

    alvision.line(img, new alvision.Point(x0, y), new alvision.Point(x1,y), new alvision.Scalar(0), 2, 4, 2);

    let pixelsDrawn = rows * cols - alvision.countNonZero(img).valueOf();
    alvision.ASSERT_EQ((3 * rows + cols) * 3 - 3 * 9, pixelsDrawn);
});

alvision.cvtest.TEST('Core_Drawing', 'polylines_empty', () => {
    let img = new alvision.Mat(100, 100, alvision.MatrixType.CV_8UC1, new alvision.Scalar(0));
    let pts = new Array<alvision.Point> (); // empty
    alvision.polylines(img, pts, false, new alvision.Scalar(255));
    let cnt = alvision.countNonZero(img);
    alvision.ASSERT_EQ(cnt, 0);
});

alvision.cvtest.TEST('Core_Drawing', 'polylines', () => {
    let img = new alvision.Mat(100, 100, alvision.MatrixType.CV_8UC1, new alvision.Scalar(0));
    let pts = new Array<alvision.Point> ();
    pts.push(new alvision.Point(0, 0));
    pts.push(new alvision.Point(20, 0));
    alvision.polylines(img, pts, false, new alvision.Scalar(255));
    let cnt = alvision.countNonZero(img);
    alvision.ASSERT_EQ(cnt, 21);
});

//rotate/flip a quadrant appropriately
function rot(n: alvision.int, x : alvision.int, y : alvision.int, rx: alvision.int , ry: alvision.int, cbout:(x_ : alvision.int, y_ : alvision.int)=>void ) : void
{
    if (ry == 0) {
        if (rx == 1) {
            x = n.valueOf()-1 - x.valueOf();
            y = n.valueOf()-1 - y.valueOf();
        }

        //Swap x and y
        let t  = x;
        x = y;
        y = t;
    }

    cbout(x, y);
}

function d2xy(n: alvision.int, d: alvision.int, x: alvision.int, y: alvision.int, cbout:(x_:alvision.int, y_:alvision.int)=>void) : void
{
    //int rx, ry, s,
    let rx: alvision.int; let ry: alvision.int;
    let t = d;

    x = y = 0;
    for (let s=1; s<n; s*=2)
    {
        rx = 1 & (t.valueOf()/2);
        ry = 1 & (t.valueOf() ^ rx.valueOf());
        rot(s, x, y, rx, ry, (x_, y_) => { x = x_; y = y_; });
        x =x.valueOf() + s * rx.valueOf();
        y =y.valueOf() + s * ry.valueOf();
        t = t.valueOf()/ 4;
    }

    cbout(x, y);
}

alvision.cvtest.TEST('Imgproc_FindContours', 'hilbert',()=>
{
    let n = 64, n2 = n*n, scale = 10, w = (n + 2)*scale;
    let ofs = new alvision.Point (scale, scale);
    let img = new alvision.Mat (w, w,alvision.MatrixType. CV_8U);
    img.setTo(alvision.Scalar.all(0));

    let p = new alvision.Point (0,0);
    for( let i = 0; i < n2; i++ )
    {
        var q = new alvision.Point (0,0);
        d2xy(n2, i, q.x, q.y, (x_, y_) => { q.x = x_; q.y = y_; });
        alvision.line(img, p.op_Multiplication( scale).op_Addition( ofs), q.op_Multiplication( scale).op_Addition( ofs), alvision.Scalar.all(255));
        p = q;
    }
    alvision.dilate(img, img, new alvision.Mat());
    let contours = new Array<Array<alvision.Point>>();
    alvision.findContours(img, contours, null, alvision.RetrievalModes.RETR_LIST, alvision.ContourApproximationModes. CHAIN_APPROX_SIMPLE);
    console.log(util.format("ncontours = %d, contour[0].npoints=%d\n", contours.length, contours[0].length));
    img.setTo(alvision.Scalar.all(0));

    alvision.drawContours(img, contours, 0, alvision.Scalar.all(255), 1);
    //imshow("hilbert", img);
    //waitKey();
    alvision.ASSERT_EQ(1, contours.length);
    alvision.ASSERT_EQ(9832, contours[0].length);
});

/* End of file. */
