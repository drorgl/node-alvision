import * as alvision from "../../tsbinding/alvision";
import { BaseApp, RUN_APP, FrameSource, opencv_extra, PairFrameSource,makeGray } from "./utility";
import path = require('path')

const base_path = "gpu_demos_pack/demos/denoising";

enum Method
{
    BROX_GPU,
    DENSE_PYR_LK_GPU,
    FARNEBACK_GPU,
    DUAL_TVL1_GPU,
    SPARSE_PYR_LK_GPU,

    FARNEBACK_CPU,
    LK_CPU,

    METHOD_MAX
};

const method_str =[
    "BROX GPU",
    "DENSE PYR LK GPU",
    "FARNEBACK GPU",
    "DUAL TVL1 GPU",
    "SPARSE PYR LK GPU",

    "FARNEBACK CPU",
    "LK CPU",
];

class App extends BaseApp
{
    constructor() {
        super();
        this.method_ = Method.FARNEBACK_CPU;
        this.curSource_ = 0;
        this.calcFlow_ = true;
    }

    protected runAppLogic(): void {
        if (this.sources_.length > 1) {
            for (let i = 0; (i + 1) < this.sources_.length; i += 2)
            this.pairSources_.push(PairFrameSource.create_framesource(this.sources_[i], this.sources_[i + 1]));
        }
        else {
            console.log("Using default frames source... ");

            this.pairSources_.push(PairFrameSource.create_framesource(FrameSource.image("data/dense_optical_flow_1.jpg"),
                FrameSource.image("data/dense_optical_flow_2.jpg")));
        }


        //cpu
        //alvision.calcOpticalFlowPyrLK()
        //alvision.calcOpticalFlowFarneback()

        //gpu
        let brox: alvision.cuda.BroxOpticalFlow;
        let pyrlk: alvision.cuda.DensePyrLKOpticalFlow;
        let farneback: alvision.cuda.FarnebackOpticalFlow;
        let dual_tvl1: alvision.cuda.OpticalFlowDual_TVL1;
        let sparse_pyrlk: alvision.cuda.SparsePyrLKOpticalFlow;

        if (this.has_gpu) {
            brox = alvision.cuda.BroxOpticalFlow.create(0.197 /*alpha*/, 50.0 /*gamma*/, 0.8 /*scale*/, 10 /*inner_iterations*/, 77 /*outer_iterations*/, 10 /*solver_iterations*/);
            //brox.calc()
            pyrlk = alvision.cuda.DensePyrLKOpticalFlow.create(new alvision.Size(13, 13), 3, 1);
            //pyrlk.calc()
            farneback = alvision.cuda.FarnebackOpticalFlow.create();
            //farneback.calc()
            dual_tvl1 = alvision.cuda.OpticalFlowDual_TVL1.create();
            //dual_tvl1.calc()
            sparse_pyrlk = alvision.cuda.SparsePyrLKOpticalFlow.create();
            //sparse_pyrlk.calc()
        }



        //let brox_cpu = new alvision.superres.BroxOpticalFlow();
        //let brox_gpu = alvision.cuda.BroxOpticalFlow.create (0.197 /*alpha*/, 50.0 /*gamma*/, 0.8 /*scale*/, 10 /*inner_iterations*/, 77 /*outer_iterations*/, 10 /*solver_iterations*/);
        //let farneback_cpu = alvision.superres.createOptFlow_Farneback();// new alvision.FarnebackOpticalFlow();
        //let pyrlk_gpu = alvision.superres.createOptFlow_PyrLK_CUDA();
        //pyrlk_gpu.winSize = new alvision.Size(13, 13);
        //pyrlk_gpu.iters = 1;
        //let fastbm = new alvision.superres. .FastOpticalFlowBM();

        let frame0 = new alvision.Mat(), frame1 = new alvision.Mat();
        let frame0_32F = new alvision.Mat(), frame1_32F = new alvision.Mat();
        let gray0 = new alvision.Mat(), gray1 = new alvision.Mat ();
        let gray0_32F = new alvision.Mat(), gray1_32F = new alvision.Mat ();
        let d_frame0: alvision.cuda.GpuMat, d_frame1: alvision.cuda.GpuMat ;
        let d_frame0_32F: alvision.cuda.GpuMat, d_frame1_32F: alvision.cuda.GpuMat;

        if (this.has_gpu) {
            d_frame0 = new alvision.cuda.GpuMat();
            d_frame1 = new alvision.cuda.GpuMat();
            d_frame0_32F = new alvision.cuda.GpuMat();
            d_frame1_32F = new alvision.cuda.GpuMat();
        }


        let flow_forward = new alvision.Mat();
        let flow_backward = new alvision.Mat();
        //let fu = new alvision.Mat(), fv = new alvision.Mat();
        //let bu = new alvision.Mat(), bv = new alvision.Mat ();
        //let fuv = new alvision.Mat(), buv = new alvision.Mat ();


        //let d_fu: alvision.cuda.GpuMat, d_fv: alvision.cuda.GpuMat ;
        //let d_bu: alvision.cuda.GpuMat, d_bv: alvision.cuda.GpuMat;

        let d_flow_forward: alvision.cuda.GpuMat;
        let d_flow_backward: alvision.cuda.GpuMat;

        if (this.has_gpu) {
            //d_fu = new alvision.cuda.GpuMat();
            //d_fv = new alvision.cuda.GpuMat();
            //d_bu = new alvision.cuda.GpuMat();
            //d_bv = new alvision.cuda.GpuMat();
            d_flow_forward = new alvision.cuda.GpuMat();
            d_flow_backward = new alvision.cuda.GpuMat();
        }

        let flowFieldForward = new alvision.Mat(), flowFieldBackward = new alvision.Mat ()

        let channels = alvision.NewArray(3, ()=>new alvision.Mat());

        //let d_b0 : alvision.cuda.GpuMat, d_g0: alvision.cuda.GpuMat, d_r0: alvision.cuda.GpuMat;
        //let d_b1 : alvision.cuda.GpuMat, d_g1: alvision.cuda.GpuMat, d_r1: alvision.cuda.GpuMat;
        //
        //let d_buf: alvision.cuda.GpuMat ;
        //let d_rNew: alvision.cuda.GpuMat, d_gNew: alvision.cuda.GpuMat, d_bNew: alvision.cuda.GpuMat;
        //let d_newFrame: alvision.cuda.GpuMat;

        if (this.has_gpu) {
            //d_b0 = new alvision.cuda.GpuMat(); d_g0 = new alvision.cuda.GpuMat() ; d_r0 = new alvision.cuda.GpuMat();
            //d_b1 = new alvision.cuda.GpuMat(); d_g1 = new alvision.cuda.GpuMat() ; d_r1 = new alvision.cuda.GpuMat();
            //
            //d_buf = new alvision.cuda.GpuMat();
            //d_rNew = new alvision.cuda.GpuMat(); d_gNew = new alvision.cuda.GpuMat(); d_bNew = new alvision.cuda.GpuMat();
            //d_newFrame = new alvision.cuda.GpuMat();
        }

        let newFrame = new alvision.Mat();

        const timeStep = 0.1;
        let frames = new Array<alvision.Mat>();
        frames.length = (1.0 / timeStep) + 2;
        let currentFrame = 0;
        let forward = true;

        let framesImg = new alvision.Mat();
        let flowsImg  = new alvision.Mat();
        let outImg    = new alvision.Mat();

        let proc_fps = 0.0, total_fps = 0.0;

        while (this.isActive()) {
            if (this.calcFlow_) {
                console.log("Calculate optical flow and interpolated frames");

                const total_start = alvision.getTickCount();

                this.pairSources_[this.curSource_.valueOf()].next(frame0, frame1);

                frame0.convertTo(frame0_32F,alvision.MatrixType. CV_32F, 1.0 / 255.0);
                frame1.convertTo(frame1_32F,alvision.MatrixType. CV_32F, 1.0 / 255.0);

                switch (this.method_) {
                    case Method.BROX_GPU: {
                        makeGray(frame0_32F, gray0_32F);
                        makeGray(frame1_32F, gray1_32F);

                        d_frame0_32F.upload(gray0_32F);
                        d_frame1_32F.upload(gray1_32F);

                        let proc_start = alvision.getTickCount();

                        brox.calc(d_frame0_32F, d_frame1_32F, d_flow_forward);
                        brox.calc(d_frame1_32F, d_frame0_32F, d_flow_backward);

                        proc_fps = alvision.getTickFrequency() / (alvision.getTickCount() - proc_start);

                        d_flow_forward.download(flow_forward);
                        d_flow_backward.download(flow_backward);

                        draw_flow(flow_forward, flowFieldForward, 10, alvision.CV_RGB(0, 255, 0));
                        draw_flow(flow_backward, flowFieldForward, 10, alvision.CV_RGB(0, 255, 0));
                    }
                        break;
                    case Method.DENSE_PYR_LK_GPU: {
                        makeGray(frame0, gray0);
                        makeGray(frame1, gray1);

                        d_frame0.upload(gray0);
                        d_frame1.upload(gray1);

                        let proc_start = alvision.getTickCount();

                        pyrlk.calc(d_frame0, d_frame1, d_flow_forward);
                        pyrlk.calc(d_frame1, d_frame0, d_flow_backward);

                        proc_fps = alvision.getTickFrequency() / (alvision.getTickCount() - proc_start);

                        d_flow_forward.download(flow_forward);
                        d_flow_backward.download(flow_backward);

                        draw_flow(flow_forward, flowFieldForward, 10, alvision.CV_RGB(0, 255, 0));
                        draw_flow(flow_backward, flowFieldForward, 10, alvision.CV_RGB(0, 255, 0));

                    }
                        break;
                    case Method.FARNEBACK_GPU: {
                        makeGray(frame0, gray0);
                        makeGray(frame1, gray1);

                        d_frame0.upload(gray0);
                        d_frame1.upload(gray1);

                        let proc_start = alvision.getTickCount();

                        farneback.calc(d_frame0, d_frame1, d_flow_forward);
                        farneback.calc(d_frame1, d_frame0, d_flow_backward);

                        proc_fps = alvision.getTickFrequency() / (alvision.getTickCount() - proc_start);

                        d_flow_forward.download(flow_forward);
                        d_flow_backward.download(flow_backward);

                        draw_flow(flow_forward, flowFieldForward, 10, alvision.CV_RGB(0, 255, 0));
                        draw_flow(flow_backward, flowFieldForward, 10, alvision.CV_RGB(0, 255, 0));
                    }
                        break;
                    case Method.DUAL_TVL1_GPU: {
                        makeGray(frame0, gray0);
                        makeGray(frame1, gray1);

                        d_frame0.upload(gray0);
                        d_frame1.upload(gray1);

                        let proc_start = alvision.getTickCount();

                        dual_tvl1.calc(d_frame0, d_frame1, d_flow_forward);
                        dual_tvl1.calc(d_frame1, d_frame0, d_flow_backward);

                        proc_fps = alvision.getTickFrequency() / (alvision.getTickCount() - proc_start);

                        d_flow_forward.download(flow_forward);
                        d_flow_backward.download(flow_backward);

                        draw_flow(flow_forward, flowFieldForward,10,alvision.CV_RGB(0,255,0));
                        draw_flow(flow_backward, flowFieldForward, 10, alvision.CV_RGB(0, 255, 0));
                    }

                        break;
                    case Method.SPARSE_PYR_LK_GPU: {
                        let prev = new alvision.Mat();
                        let next = new alvision.Mat();
                        let status = new alvision.Mat();
                        let errors = new alvision.Mat();

                        makeGray(frame0, gray0);
                        makeGray(frame1, gray1);

                        d_frame0.upload(gray0);
                        d_frame1.upload(gray1);

                        let proc_start = alvision.getTickCount();

                        sparse_pyrlk.calc(d_frame0, d_frame1, prev,next,status,errors);
                        sparse_pyrlk.calc(d_frame1, d_frame0, prev, next, status, errors);

                        proc_fps = alvision.getTickFrequency() / (alvision.getTickCount() - proc_start);

                        draw_flow_field(flowFieldForward, prev, next, status, errors);
                        draw_flow_field(flowFieldBackward, next, prev, status, errors);

                        //d_flow_forward.download(flow_forward);
                        //d_flow_backward.download(flow_backward);

                    }
                        break;
                    
                    case Method.FARNEBACK_CPU:
                        makeGray(frame0, gray0);
                        makeGray(frame1, gray1);

                        const proc_start = alvision.getTickCount();

                        alvision.calcOpticalFlowFarneback(gray0, gray1, d_flow_forward, 0.5, 3, 15, 3, 5, 1.2, 0);
                        alvision.calcOpticalFlowFarneback(gray1, gray0, d_flow_backward, 0.5, 3, 15, 3, 5, 1.2, 0);

                        proc_fps = alvision.getTickFrequency() / (alvision.getTickCount() - proc_start);

                        //let uv_planes = Array<alvision.Mat>(2);
                        //uv_planes[0] = fu;
                        //uv_planes[1] = fv;
                        //alvision.split(fuv, uv_planes);
                        //uv_planes[0] = bu;
                        //uv_planes[1] = bv;
                        //alvision.split(buv, uv_planes);

                        //d_fu.upload(fu);
                        //d_fv.upload(fv);
                        //d_bu.upload(bu);
                        //d_bv.upload(bv);

                        break;

                    case Method.LK_CPU:
                        let prev = new alvision.Mat();
                        let next = new alvision.Mat();
                        let status = new alvision.Mat();
                        let errors = new alvision.Mat();

                        alvision.calcOpticalFlowPyrLK(gray0, gray1, prev, next, status, errors);

                        draw_flow_field(flowFieldForward, prev, next, status, errors);
                        draw_flow_field(flowFieldBackward, next, prev, status, errors);

                        break;
                };

                //getFlowField(fu, fv, flowFieldForward, 30);
                //getFlowField(bu, bv, flowFieldBackward, 30);
                //
                //alvision.split(frame0_32F, channels);
                //
                //d_b0.upload(channels[0]);
                //d_g0.upload(channels[1]);
                //d_r0.upload(channels[2]);
                //
                //alvision.split(frame1_32F, channels);
                //
                //d_b1.upload(channels[0]);
                //d_g1.upload(channels[1]);
                //d_r1.upload(channels[2]);

                frames.length = 0;
                frames.push(frame0_32F.clone());

                // compute interpolated frames
                //for (let timePos = timeStep; timePos < 1.0; timePos += timeStep)
                //{
                //    alvision.cuda.interpolateFrames(d_b0, d_b1, d_fu, d_fv, d_bu, d_bv, timePos, d_bNew, d_buf);
                //    alvision.cuda.interpolateFrames(d_g0, d_g1, d_fu, d_fv, d_bu, d_bv, timePos, d_gNew, d_buf);
                //    alvision.cuda.interpolateFrames(d_r0, d_r1, d_fu, d_fv, d_bu, d_bv, timePos, d_rNew, d_buf);
                //
                //    let channels = [ d_bNew, d_gNew, d_rNew ];
                //    alvision.cuda.merge(channels, d_newFrame);
                //
                //    d_newFrame.download(newFrame);
                //
                //    frames.push(newFrame.clone());
                //}

                //frames.push(frame1_32F.clone());

                currentFrame = 0;
                forward = true;
                this.calcFlow_ = false;

                total_fps = alvision.getTickFrequency() / (alvision.getTickCount() - total_start);
            }

            framesImg.create(frame0.rows(), frame0.cols().valueOf() * 2,alvision.MatrixType. CV_8UC3);
            let left = framesImg.roi( new alvision.Rect(0, 0, frame0.cols(), frame0.rows()));
            let right = framesImg.roi(new alvision.Rect(frame0.cols(), 0, frame0.cols(), frame0.rows()));
            frame0.copyTo(left);
            frame1.copyTo(right);

            flowsImg.create(frame0.rows(), frame0.cols().valueOf() * 2,alvision.MatrixType. CV_8UC3);
            left = flowsImg.roi( new alvision.Rect(0, 0, frame0.cols(), frame0.rows()));
            right = flowsImg.roi(new alvision.Rect(frame0.cols(), 0, frame0.cols(), frame0.rows()));
            flowFieldForward.copyTo(left);
            flowFieldBackward.copyTo(right);

            alvision.imshow("Frames", framesImg);
            alvision.imshow("Flows", flowsImg);

            frames[currentFrame].convertTo(outImg,alvision.MatrixType. CV_8U, 255.0);

            this.displayState(outImg, proc_fps, total_fps);

            alvision.imshow("Dense Optical Flow Demo", outImg);

            this.wait(30);

            if (forward) {
                ++currentFrame;
                if (currentFrame == (frames.length) - 1)
                    forward = false;
            }
            else {
                --currentFrame;
                if (currentFrame == 0)
                    forward = true;
            }
        }
    }
    protected processAppKey(key: alvision.int): void {
        switch (String.fromCharCode(key.valueOf() & 0xff).toUpperCase()) {
            case " " /*space*/:
                this.method_ = ((this.method_ + 1) % Method.METHOD_MAX);
                console.log("Switch method to ", method_str[this.method_.valueOf()]);
                this.calcFlow_ = true;
                break;

            case 'N':
                if (this.pairSources_.length > 1) {
                    this.curSource_ = (this.curSource_ + 1) % this.pairSources_.length;
                    this.pairSources_[this.curSource_].reset();
                    console.log("Switch source to ", this.curSource_);
                    this.calcFlow_ = true;
                }
                break;
        }
    }
    protected printAppHelp(): void {
        console.log("This sample demonstrates different Dense Optical Flow algorithms");

        console.log("Usage: demo_dense_optical_flow [options] ");
    }


    private displayState(outImg: alvision.Mat, proc_fps: alvision.double, total_fps: alvision.double): void {

        const fontColorRed =alvision. CV_RGB(255, 0, 0);

        console.log("Source size: " , outImg.cols() , 'x' , outImg.rows());

        console.log("Method: ", method_str[this.method_]);

        console.log("FPS (OptFlow only): ", proc_fps);

        console.log("FPS (total): ", total_fps);

        console.log("Space - switch method");
        if (this.pairSources_.length > 1)
            console.log("N - switch source");
    }

    private pairSources_: Array<PairFrameSource>;

    private method_: Method;
    private curSource_: number;
    private calcFlow_: boolean;

}

function isFlowCorrect(u: alvision.Point2f ): boolean
{
    return !isNaN(u.x.valueOf()) && !isNaN(u.y.valueOf()) && Math.abs(u.x.valueOf()) < 1e9 && Math.abs(u.y.valueOf()) < 1e9;
}


module computeColor_static {
    export let first = true;

    // relative lengths of color transitions:
    // these are chosen based on perceptual similarity
    // (e.g. one can distinguish more shades between red and yellow
    //  than between yellow and green)
    export const RY = 15;
    export const YG = 6;
    export const GC = 4;
    export const CB = 11;
    export const BM = 13;
    export const MR = 6;
    export const NCOLS = RY + YG + GC + CB + BM + MR;
    export let colorWheel = new Array<alvision.Vec3i>(NCOLS);
}



function computeColor(fx: number, fy: number ): alvision.Vec3b 
{
    if (computeColor_static.first)
    {
        let k = 0;

        for (let i = 0; i < computeColor_static.RY; ++i, ++k)
            computeColor_static.colorWheel[k] = new alvision.Vec3i(255, 255 * i / computeColor_static.RY, 0);

        for (let i = 0; i < computeColor_static.YG; ++i, ++k)
            computeColor_static.colorWheel[k] = new alvision.Vec3i(255 - 255 * i / computeColor_static.YG, 255, 0);

        for (let i = 0; i < computeColor_static.GC; ++i, ++k)
            computeColor_static.colorWheel[k] = new alvision.Vec3i(0, 255, 255 * i / computeColor_static.GC);

        for (let i = 0; i < computeColor_static.CB; ++i, ++k)
            computeColor_static.colorWheel[k] = new alvision.Vec3i(0, 255 - 255 * i / computeColor_static.CB, 255);

        for (let i = 0; i < computeColor_static.BM; ++i, ++k)
            computeColor_static.colorWheel[k] = new alvision.Vec3i(255 * i / computeColor_static.BM, 0, 255);

        for (let i = 0; i < computeColor_static.MR; ++i, ++k)
            computeColor_static.colorWheel[k] = new alvision.Vec3i(255, 0, 255 - 255 * i / computeColor_static.MR);

        computeColor_static.first = false;
    }

    const  rad = Math.sqrt(fx * fx + fy * fy);
    const  a = Math.atan2(-fy, -fx) / Math.PI;

    const fk = (a + 1.0) / 2.0 * (computeColor_static.NCOLS - 1);
    const k0 = (fk);
    const k1 = (k0 + 1) % computeColor_static.NCOLS;
    const f = fk - k0;

    let pix = new alvision.Vec3b();

    for (let b = 0; b < 3; b++)
    {
        const col0 = computeColor_static.colorWheel[k0][b] / 255.0;
        const col1 = computeColor_static.colorWheel[k1][b] / 255.0;

        let col = (1 - f) * col0 + f * col1;

        if (rad <= 1)
            col = 1 - rad * (1 - col); // increase saturation with radius
        else
            col *= .75; // out of range

        pix[2 - b] = (255.0 * col);
    }

    return pix;
}

function draw_flow_field(flowField: alvision.Mat, prev: alvision.Mat, next: alvision.Mat, status: alvision.Mat, error: alvision.Mat) :void{
    let prevPos = prev.ptr<alvision.Point2f>("Point2f");
    let nextPos = next.ptr<alvision.Point2f>("Point2f");
    let found = status.ptr<alvision.uchar>("uchar");

    for (let i= 0; i < nextPos.length; i++){
        if (found[i]) {
            alvision.line(flowField, prevPos[i], nextPos[i], new alvision.Scalar(0, 0, 255));
        }
    }
}

function draw_flow(flow: alvision.Mat, cflowmap: alvision.Mat, step: alvision.int, color: alvision.Scalar): void {
    for (let y = 0; y < cflowmap.rows(); y += step.valueOf())
        for (let x = 0; x < cflowmap.cols(); x += step.valueOf()) {
            const fxy = flow.at<alvision.Point2f>("Point2f", y, x).get();
            alvision.line(cflowmap, new alvision.Point(x, y), new alvision.Point((x + fxy.x.valueOf()), (y + fxy.y.valueOf())), color);
            alvision.circle(cflowmap, new alvision.Point((x + fxy.x.valueOf()), (y + fxy.y.valueOf())), 1, color, -1);
        }
}


//function getFlowField(u: alvision.Mat, v: alvision.Mat, flowField: alvision.Mat, maxrad  : alvision.float= -1) :  void 
//{
//    flowField.create(u.size(),alvision.MatrixType. CV_8UC3);
//    flowField.setTo(alvision.Scalar.all(0));

//    // determine motion range:
//    if (maxrad < 0)
//    {
//        maxrad = 1;
//        for (let y = 0; y < u.rows(); ++y)
//        {
//            const uPtr = u.ptr<alvision.float>("float",y);
//            const vPtr = v.ptr<alvision.float>("float",y);

//            for (let x = 0; x < u.cols(); ++x)
//            {
//                let flow = new alvision.Point2f(uPtr[x], vPtr[x]);

//                if (!isFlowCorrect(flow))
//                    continue;

//                maxrad = Math.max(maxrad.valueOf(), Math.sqrt(flow.x.valueOf() * flow.x.valueOf() + flow.y.valueOf() * flow.y.valueOf()));
//            }
//        }
//    }

//    for (let y = 0; y < u.rows(); ++y)
//    {
//        const  uPtr = u.ptr<alvision.float>("float",y);
//        const  vPtr = v.ptr<alvision.float>("float",y);
//        let dstPtr = flowField.ptr<alvision.Vec3b>("Vec3b",y);

//        for (let x = 0; x < u.cols(); ++x)
//        {
//            let flow = new alvision.Point2f (uPtr[x], vPtr[x]);

//            if (isFlowCorrect(flow))
//                dstPtr[x] = computeColor(flow.x.valueOf() / maxrad.valueOf(), flow.y.valueOf() / maxrad.valueOf());
//        }
//    }
//}



RUN_APP(new App());
