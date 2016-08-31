import tape = require("tape");
import path = require("path");
import colors = require("colors");
import async = require("async");
import alvision = require("../../../tsbinding/alvision");
import util = require('util');
import fs = require('fs');

//#include "test_precomp.hpp"
//
//using namespace cv;
//using namespace std;

class Core_RandTest  extends alvision.cvtest.BaseTest
{
    run(iii: alvision.int): void {
        var _ranges =
            [[0, 256], [-128, 128], [0, 65536], [-32768, 32768],
                [-1000000, 1000000], [-1000, 1000], [-1000, 1000]];

        const MAX_SDIM = 10;
        const N = 2000000;
        const maxSlice = 1000;
        const MAX_HIST_SIZE = 1000;
        var progress = 0;

        var rng = this.ts.get_rng();
        var tested_rng = alvision.theRNG();
        this.test_case_count = 200;

        for (var idx = 0; idx < this.test_case_count; idx++) {
            progress = this.update_progress(progress, idx, this.test_case_count, 0).valueOf();
            this.ts.update_context(this, idx, false);

            var depth = alvision.cvtest.randInt(rng).valueOf() % (alvision.MatrixType.CV_64F + 1);
            var  cn = (alvision.cvtest.randInt(rng).valueOf() % 4) + 1;
            var type = alvision.MatrixType.CV_MAKETYPE(depth, cn);
            var dist_type = alvision.cvtest.randInt(rng).valueOf() % (alvision.DistType.NORMAL  + 1);
            var  SZ = N / cn;

            var A = new alvision.Scalar();
            var B = new alvision.Scalar();

            var eps = 1.e-4;
            if (depth == alvision.MatrixType.CV_64F)
                eps = 1.e-7;

            var do_sphere_test = dist_type == alvision.DistType.UNIFORM;
            var arr = new Array<alvision.Mat>(2);
            var hist = new Array<alvision.Mat>(4);
            var W = [ 0,0,0,0];

            arr[0].create(1, SZ, type);
            arr[1].create(1, SZ, type);
            var fast_algo = dist_type == alvision.DistType.UNIFORM && depth < alvision.MatrixType.CV_32F;

            for (var c = 0; c < cn; c++) {
                var a, b, hsz;
                if (dist_type == alvision.DistType.UNIFORM) {
                    a = (alvision.cvtest.randInt(rng).valueOf() % (_ranges[depth][1] -
                        _ranges[depth][0])) + _ranges[depth][0];
                    do {
                        b = (alvision.cvtest.randInt(rng).valueOf() % (_ranges[depth][1] -
                            _ranges[depth][0])) + _ranges[depth][0];
                    }
                    while (Math.abs(a - b) <= 1);
                    if (a > b) {
                        var tmp = a; a = b; b = tmp;
                        //std::swap(a, b);
                    }

                    var r = (b - a);
                    fast_algo = fast_algo && r <= 256 && (r & (r - 1)) == 0;
                    hsz = Math.min((b - a), MAX_HIST_SIZE);
                    do_sphere_test = do_sphere_test && b - a >= 100;
                }
                else {
                    var vrange = _ranges[depth][1] - _ranges[depth][0];
                    var meanrange = vrange / 16;
                    var mindiv = Math.max(vrange / 20, 5);
                    var maxdiv = Math.min(vrange / 8, 10000);

                    a = alvision.cvtest.randInt(rng).valueOf() % meanrange - meanrange / 2 +
                        (_ranges[depth][0] + _ranges[depth][1]) / 2;
                    b = alvision.cvtest.randInt(rng).valueOf() % (maxdiv - mindiv) + mindiv;
                    hsz = Math.min(b* 9, MAX_HIST_SIZE);
                }
                A[c] = a;
                B[c] = b;
                hist[c].create(1, hsz,alvision.MatrixType. CV_32S);
            }

            var saved_rng = tested_rng;
            var maxk = fast_algo ? 0 : 1;
            for (var k = 0; k <= maxk; k++) {
                tested_rng = saved_rng;
                var sz = 0, dsz = 0, slice;
                for (slice = 0; slice < maxSlice; slice++ , sz += dsz) {
                    dsz = slice + 1 < maxSlice ? (alvision.cvtest.randInt(rng).valueOf() % (SZ - sz + 1)) : SZ - sz;
                    var aslice = arr[k].colRange(sz, sz + dsz);
                    tested_rng.fill(aslice, dist_type, A, B);
                }
            }

            if (maxk >= 1 && alvision.cvtest.norm(arr[0], arr[1], alvision.NormTypes. NORM_INF) > eps) {
                this.ts.printf(alvision.cvtest.TSConstants.LOG, "RNG output depends on the array lengths (some generated numbers get lost?)");
                this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
                return;
            }

            for (c = 0; c < cn; c++) {
                (() => {
                    //const data = arr[0].ptr<alvision.uchar>("uchar");
                    var H = hist[c].ptr<alvision.int>("int");
                    var HSZ = hist[c].cols();
                    var minVal = dist_type == alvision.DistType.UNIFORM ? A[c] : A[c] - B[c] * 4;
                    var maxVal = dist_type == alvision.DistType.UNIFORM ? B[c] : A[c] + B[c] * 4;
                    var scale = HSZ.valueOf() / (maxVal - minVal);
                    var delta = -minVal * scale;

                    hist[c].setTo(alvision.Scalar.all(0));

                    for (var i = c; i < SZ * cn; i += cn) {
                        var val = depth == alvision.MatrixType.CV_8U ? arr[0].ptr<alvision.uchar>("uchar")[i] :
                            depth == alvision.MatrixType.CV_8S ? arr[0].ptr<alvision.schar>("schar")[i] :
                                depth == alvision.MatrixType.CV_16U ? arr[0].ptr<alvision.ushort>("ushort")[i] :
                                    depth == alvision.MatrixType.CV_16S ? arr[0].ptr<alvision.short>("short")[i] :
                                        depth == alvision.MatrixType.CV_32S ? arr[0].ptr<alvision.int>("int")[i] :
                                            depth == alvision.MatrixType.CV_32F ? arr[0].ptr<alvision.float>("float")[i] :
                                                arr[0].ptr<alvision.double>("double")[i];
                        var ival = Math.floor(<any>val * scale + delta);
                        if (ival < HSZ) {
                            H[ival] = H[ival].valueOf() + 1;
                            W[c]++;
                        }
                        else if (dist_type == alvision.DistType.UNIFORM) {
                            if ((minVal <= val && val < maxVal) || (depth >= alvision.MatrixType.CV_32F && val == maxVal)) {
                                H[ival < 0 ? 0 : HSZ.valueOf() - 1] = H[ival < 0 ? 0 : HSZ.valueOf() - 1].valueOf() + 1;
                                W[c]++;
                            }
                            else {
                                console.log("^");
                                //putchar('^');
                            }
                        }
                    }

                    if (dist_type == alvision.DistType.UNIFORM && W[c] != SZ) {
                        this.ts.printf(alvision.cvtest.TSConstants.LOG, "Uniform RNG gave values out of the range [%g,%g) on channel %d/%d\n",
                            A[c], B[c], c, cn);
                        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
                        return;
                    }
                    if (dist_type == alvision.DistType.NORMAL && W[c] < SZ * .90) {
                        this.ts.printf(alvision.cvtest.TSConstants.LOG, "Normal RNG gave too many values out of the range (%g+4*%g,%g+4*%g) on channel %d/%d\n",
                            A[c], B[c], A[c], B[c], c, cn);
                        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
                        return;
                    }
                    var refval = 0, realval = 0;

                    if (!this.check_pdf(hist[c], 1. / W[c], dist_type, refval, realval)) {
                        this.ts.printf(alvision.cvtest.TSConstants.LOG, "RNG failed Chi-square test (got %g vs probable maximum %g) on channel %d/%d\n",
                            realval, refval, c, cn);
                        this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
                        return;
                    }
                })();
            }

            // Monte-Carlo test. Compute volume of SDIM-dimensional sphere
            // inscribed in [-1,1]^SDIM cube.
            if (do_sphere_test) {
                var SDIM = alvision.cvtest.randInt(rng).valueOf() % (MAX_SDIM - 1) + 2;
                var N0 = (SZ * cn / SDIM), n = 0;
                var r2 = 0;
                //const  data = arr[0].ptr<alvision.uchar>("uchar");
                var scale = new Array<alvision.double>(4), delta = new Array<alvision.double>(4);
                for (c = 0; c < cn; c++) {
                    scale[c] = 2. / (B[c] - A[c]);
                    delta[c] = -A[c] * scale[c].valueOf() - 1;
                }

                for (var i = k = c = 0; i <= SZ * cn - SDIM; i++ , k++ , c++) {
                    var val = depth == alvision.MatrixType.CV_8U ? arr[0].ptr<alvision.uchar>("uchar")[i]:
                        depth == alvision.MatrixType.CV_8S ? arr[0].ptr<alvision.schar>("schar")[i]:
                            depth == alvision.MatrixType.CV_16U ? arr[0].ptr<alvision.ushort>("ushort")[i]:
                                depth == alvision.MatrixType.CV_16S ? arr[0].ptr<alvision.short>("short")[i]:
                                    depth == alvision.MatrixType.CV_32S ? arr[0].ptr<alvision.int>("int")[i]:
                                        depth == alvision.MatrixType.CV_32F ? arr[0].ptr<alvision.float>("float")[i] : arr[0].ptr<alvision.double>("double")[i];
                    c &= c < cn ? -1 : 0;
                    val = <any>val * scale[c].valueOf() + delta[c].valueOf();
                    r2 += <any>val * <any>val;
                    if (k == SDIM - 1) {
                        n += (r2 <= 1) ? 1 : 0;
                        r2 = 0;
                        k = -1;
                    }
                }

                var V = (n/ N0)*(1 << SDIM);

                // the theoretically computed volume
                var sdim = SDIM % 2;
                var V0 = sdim + 1;
                for (sdim += 2; sdim <= SDIM; sdim += 2)
                    V0 *= 2 * Math.PI / sdim;

                if (Math.abs(V - V0) > 0.3 * Math.abs(V0)) {
                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "RNG failed %d-dim sphere volume test (got %g instead of %g)\n",
                        SDIM, V, V0);
                    this.ts.printf(alvision.cvtest.TSConstants.LOG, "depth = %d, N0 = %d\n", depth, N0);
                    this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT);
                    return;
                }
            }
        }

    }
    check_pdf(hist: alvision.Mat, scale: alvision.double, dist_type : alvision.int,
        refval: alvision.double, realval: alvision.double): boolean {
        var hist0 = new alvision.Mat(hist.size(), alvision.MatrixType.CV_32F);
        const  H = hist.ptr<alvision.int>("int");
        var  H0 = hist0.ptr<alvision.float>("float");
        var hsz = hist.cols().valueOf();

        var sum = 0;
        for (var i = 0; i < hsz; i++)
            sum += H[i].valueOf();
        alvision.CV_Assert(()=>Math.abs(1. / sum - scale.valueOf()) < alvision.FLT_EPSILON);

        if (dist_type == alvision.DistType.UNIFORM) {
            var scale0 = (1. / hsz);
            for (i = 0; i < hsz; i++)
                H0[i] = scale0;
        }
        else {
            var sum2 = 0, r = (hsz - 1.) / 2;
            var alpha = 2 * Math.sqrt(2.) / r, beta = -alpha * r;
            for (i = 0; i < hsz; i++) {
                var x = i * alpha + beta;
                H0[i] = Math.exp(-x * x);
                sum2 += H0[i].valueOf();
            }
            sum2 = 1. / sum2;
            for (i = 0; i < hsz; i++)
                H0[i] = (H0[i].valueOf() * sum2);
        }

        var chi2 = 0;
        for (i = 0; i < hsz; i++) {
            var a = H0[i];
            var b = H[i].valueOf() * scale.valueOf();
            if (a > alvision.DBL_EPSILON)
                chi2 += (a.valueOf() - b.valueOf()) * (a.valueOf() - b.valueOf()) / (a.valueOf() + b.valueOf());
        }
        realval = chi2;

        var chi2_pval = chi2_p95(hsz.valueOf() - 1 - (dist_type == alvision.DistType.NORMAL ? 2 : 0));
        refval = chi2_pval.valueOf() * 0.01;
        return realval <= refval;
    }
};

function chi2_p95(n: alvision.int ) : alvision.double
{
    var chi2_tab95 = [
        3.841, 5.991, 7.815, 9.488, 11.07, 12.59, 14.07, 15.51,
        16.92, 18.31, 19.68, 21.03, 21.03, 22.36, 23.69, 25.00,
        26.30, 27.59, 28.87, 30.14, 31.41, 32.67, 33.92, 35.17,
        36.42, 37.65, 38.89, 40.11, 41.34, 42.56, 43.77 ];
    const xp = 1.64;
    alvision.CV_Assert(()=>n >= 1);

    if( n <= 30 )
        return chi2_tab95[n.valueOf()-1];
    return n.valueOf() + Math.sqrt(2*n.valueOf())*xp + 0.6666666666666*(xp*xp - 1);
}


alvision.cvtest.TEST('Core_Rand', 'quality', () => { var test = new Core_RandTest(); test.safe_run(); });


class Core_RandRangeTest  extends alvision.cvtest.BaseTest
{
    run(iii : alvision.int) : void
    {
        var a = new alvision.Mat(new alvision.Size(1280, 720),alvision.MatrixType. CV_8U,new alvision.Scalar(20));
        var af = new alvision.Mat (new alvision.Size(1280, 720),alvision.MatrixType. CV_32F,new alvision.Scalar(20));
        alvision.theRNG().fill(a, alvision.DistType.UNIFORM,  -alvision.DBL_MAX, alvision.DBL_MAX);
        alvision.theRNG().fill(af, alvision.DistType.UNIFORM, -alvision.DBL_MAX, alvision.DBL_MAX);
        var n0 = 0, n255 = 0, nx = 0;
        var nfmin = 0, nfmax = 0, nfx = 0;

        for( var i = 0; i < a.rows(); i++ )
            for( var j = 0; j < a.cols(); j++ )
            {
                var v = a.at<alvision.uchar>("uchar",i,j).get();
                var vf = af.at<alvision.float>("float",i,j).get();
                if( v == 0 ) n0++;
                else if( v == 255 ) n255++;
                else nx++;
                if( vf < alvision.FLT_MAX*-0.999 ) nfmin++;
                else if( vf > alvision.FLT_MAX*0.999 ) nfmax++;
                else nfx++;
            }
        alvision.CV_Assert(()=> n0 > nx*2 && n255 > nx*2 );
        alvision.CV_Assert(()=> nfmin > nfx*2 && nfmax > nfx*2 );
    }
};

alvision.cvtest.TEST('Core_Rand', 'range', () => { var test = new Core_RandRangeTest(); test.safe_run(); });


alvision.cvtest.TEST('Core_RNG_MT19937', 'regression',()=>
{
    var rng = new alvision.RNG_MT19937();
    var actual = alvision.NewArray(61, () => 0);// = {0, };
    const length = actual.length;//(sizeof(actual) / sizeof(actual[0]));
    for (var i = 0; i < 10000; ++i )
    {
        actual[(rng.next().valueOf() ^ i) % length]++;
    }

    var expected = [
        177, 158, 180, 177,  160, 179, 143, 162,
        177, 144, 170, 174,  165, 168, 168, 156,
        177, 157, 159, 169,  177, 182, 166, 154,
        144, 180, 168, 152,  170, 187, 160, 145,
        139, 164, 157, 179,  148, 183, 159, 160,
        196, 184, 149, 142,  162, 148, 163, 152,
        168, 173, 160, 181,  172, 181, 155, 153,
        158, 171, 138, 150,  150 ];

    for (var i = 0; i < length; ++i)
    {
        alvision.ASSERT_EQ(expected[i], actual[i]);
    }
});
