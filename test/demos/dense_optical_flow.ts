//import * as alvision from "../../tsbinding/alvision";
//import { BaseApp, RUN_APP, FrameSource, opencv_extra, PairFrameSource,makeGray } from "./utility";
//import path = require('path')

//const base_path = "gpu_demos_pack/demos/denoising";

//enum Method
//{
//    BROX,
//    FARNEBACK_GPU,
//    FARNEBACK_CPU,
//    PYR_LK,
//    FAST_BM_GPU,
//    METHOD_MAX
//};

//const method_str =[
//    "BROX CUDA",
//    "FARNEBACK CUDA",
//    "FARNEBACK CPU",
//    "PYR LK CUDA",
//    "FAST BM CUDA"
//];

//class App extends BaseApp
//{
//    constructor() {
//        super();
//        this.method_ = Method.BROX;
//        this.curSource_ = 0;
//        this.calcFlow_ = true;
//    }


//    protected runAppLogic(): void {
//        if (this.sources_.length > 1) {
//            for (let i = 0; (i + 1) < this.sources_.length; i += 2)
//            this.pairSources_.push(PairFrameSource.create_framesource(this.sources_[i], this.sources_[i + 1]));
//        }
//        else {
//            console.log("Using default frames source... ");

//            this.pairSources_.push(PairFrameSource.create_framesource(FrameSource.image("data/dense_optical_flow_1.jpg"),
//                FrameSource.image("data/dense_optical_flow_2.jpg")));
//        }

//        let brox_cpu = new alvision.superres.BroxOpticalFlow();
//        let brox_gpu = new alvision.cuda.BroxOpticalFlow(0.197 /*alpha*/, 50.0 /*gamma*/, 0.8 /*scale*/, 10 /*inner_iterations*/, 77 /*outer_iterations*/, 10 /*solver_iterations*/);
//        let farneback = new alvision.FarnebackOpticalFlow();
//        let pyrlk = new alvision.PyrLKOpticalFlow();
//        pyrlk.winSize = new alvision.Size(13, 13);
//        pyrlk.iters = 1;
//        let fastbm = new alvision.FastOpticalFlowBM();

//        let frame0 = new alvision.Mat(), frame1 = new alvision.Mat();
//        let frame0_32F = new alvision.Mat(), frame1_32F = new alvision.Mat();
//        let gray0 = new alvision.Mat(), gray1 = new alvision.Mat ();
//        let gray0_32F = new alvision.Mat(), gray1_32F = new alvision.Mat ();
//        let d_frame0: alvision.cuda.GpuMat, d_frame1: alvision.cuda.GpuMat ;
//        let d_frame0_32F: alvision.cuda.GpuMat, d_frame1_32F: alvision.cuda.GpuMat;

//        if (this.has_gpu) {
//            d_frame0 = new alvision.cuda.GpuMat();
//            d_frame1 = new alvision.cuda.GpuMat();
//            d_frame0_32F = new alvision.cuda.GpuMat();
//            d_frame1_32F = new alvision.cuda.GpuMat();
//        }

//        let fu = new alvision.Mat(), fv = new alvision.Mat();
//        let bu = new alvision.Mat(), bv = new alvision.Mat ();
//        let fuv = new alvision.Mat(), buv = new alvision.Mat ();


//        let d_fu: alvision.cuda.GpuMat, d_fv: alvision.cuda.GpuMat ;
//        let d_bu: alvision.cuda.GpuMat, d_bv: alvision.cuda.GpuMat;

//        if (this.has_gpu) {
//            d_fu = new alvision.cuda.GpuMat();
//            d_fv = new alvision.cuda.GpuMat();
//            d_bu = new alvision.cuda.GpuMat();
//            d_bv = new alvision.cuda.GpuMat();
//        }

//        let flowFieldForward = new alvision.Mat(), flowFieldBackward = new alvision.Mat ()

//        let channels = alvision.NewArray(3, ()=>new alvision.Mat());

//        let d_b0 : alvision.cuda.GpuMat, d_g0: alvision.cuda.GpuMat, d_r0: alvision.cuda.GpuMat;
//        let d_b1 : alvision.cuda.GpuMat, d_g1: alvision.cuda.GpuMat, d_r1: alvision.cuda.GpuMat;

//        let d_buf: alvision.cuda.GpuMat ;
//        let d_rNew: alvision.cuda.GpuMat, d_gNew: alvision.cuda.GpuMat, d_bNew: alvision.cuda.GpuMat;
//        let d_newFrame: alvision.cuda.GpuMat;

//        if (this.has_gpu) {
//            d_b0 = new alvision.cuda.GpuMat(); d_g0 = new alvision.cuda.GpuMat() ; d_r0 = new alvision.cuda.GpuMat();
//            d_b1 = new alvision.cuda.GpuMat(); d_g1 = new alvision.cuda.GpuMat() ; d_r1 = new alvision.cuda.GpuMat();

//            d_buf = new alvision.cuda.GpuMat();
//            d_rNew = new alvision.cuda.GpuMat(); d_gNew = new alvision.cuda.GpuMat(); d_bNew = new alvision.cuda.GpuMat();
//            d_newFrame = new alvision.cuda.GpuMat();
//        }

//        let newFrame = new alvision.Mat();

//        const timeStep = 0.1;
//        let frames = new Array<alvision.Mat>();
//        frames.length = (1.0 / timeStep) + 2);
//        let currentFrame = 0;
//        let forward = true;

//        let framesImg = new alvision.Mat();
//        let flowsImg  = new alvision.Mat();
//        let outImg    = new alvision.Mat();

//        let proc_fps = 0.0, total_fps = 0.0;

//        while (this.isActive()) {
//            if (this.calcFlow_) {
//                console.log("Calculate optical flow and interpolated frames");

//                const total_start = alvision.getTickCount();

//                this.pairSources_[this.curSource_.valueOf()].next(frame0, frame1);

//                frame0.convertTo(frame0_32F,alvision.MatrixType. CV_32F, 1.0 / 255.0);
//                frame1.convertTo(frame1_32F,alvision.MatrixType. CV_32F, 1.0 / 255.0);

//                switch (this.method_) {
//                    case Method. BROX:
//                        {
//                            makeGray(frame0_32F, gray0_32F);
//                            makeGray(frame1_32F, gray1_32F);

//                            d_frame0_32F.upload(gray0_32F);
//                            d_frame1_32F.upload(gray1_32F);

//                            const  proc_start = alvision.getTickCount();

//                            brox(d_frame0_32F, d_frame1_32F, d_fu, d_fv);
//                            brox(d_frame1_32F, d_frame0_32F, d_bu, d_bv);

//                            proc_fps = alvision.getTickFrequency() / (alvision.getTickCount() - proc_start);

//                            d_fu.download(fu);
//                            d_fv.download(fv);
//                            d_bu.download(bu);
//                            d_bv.download(bv);

//                            break;
//                        }

//                    case Method.FARNEBACK_GPU:
//                        {
//                            makeGray(frame0, gray0);
//                            makeGray(frame1, gray1);

//                            d_frame0.upload(gray0);
//                            d_frame1.upload(gray1);

//                            const proc_start = alvision.getTickCount();

//                            farneback(d_frame0, d_frame1, d_fu, d_fv);
//                            farneback(d_frame1, d_frame0, d_bu, d_bv);

//                            proc_fps = alvision.getTickFrequency() / (alvision.getTickCount() - proc_start);

//                            d_fu.download(fu);
//                            d_fv.download(fv);
//                            d_bu.download(bu);
//                            d_bv.download(bv);

//                            break;
//                        }

//                    case Method.FARNEBACK_CPU:
//                        {
//                            makeGray(frame0, gray0);
//                            makeGray(frame1, gray1);

//                            const proc_start =alvision. getTickCount();

//                            alvision.calcOpticalFlowFarneback(gray0, gray1, fuv, farneback.pyrScale, farneback.numLevels, farneback.winSize, farneback.numIters, farneback.polyN, farneback.polySigma, farneback.flags);
//                            alvision.calcOpticalFlowFarneback(gray1, gray0, buv, farneback.pyrScale, farneback.numLevels, farneback.winSize, farneback.numIters, farneback.polyN, farneback.polySigma, farneback.flags);

//                            proc_fps = alvision.getTickFrequency() / (alvision.getTickCount() - proc_start);

//                            let uv_planes = Array<alvision.Mat>(2);
//                            uv_planes[0] = fu;
//                            uv_planes[1] = fv;
//                            alvision.split(fuv, uv_planes);
//                            uv_planes[0] = bu;
//                            uv_planes[1] = bv;
//                            alvision.split(buv, uv_planes);

//                            d_fu.upload(fu);
//                            d_fv.upload(fv);
//                            d_bu.upload(bu);
//                            d_bv.upload(bv);

//                            break;
//                        }

//                    case Method. PYR_LK:
//                        {
//                            makeGray(frame0, gray0);
//                            makeGray(frame1, gray1);

//                            d_frame0.upload(gray0);
//                            d_frame1.upload(gray1);

//                            const proc_start = alvision.getTickCount();

//                            pyrlk.dense(d_frame0, d_frame1, d_fu, d_fv);
//                            pyrlk.dense(d_frame1, d_frame0, d_bu, d_bv);

//                            proc_fps = alvision.getTickFrequency() / (alvision.getTickCount() - proc_start);

//                            d_fu.download(fu);
//                            d_fv.download(fv);
//                            d_bu.download(bu);
//                            d_bv.download(bv);

//                            break;
//                        }

//                    case Method. FAST_BM_GPU:
//                        {
//                            makeGray(frame0, gray0);
//                            makeGray(frame1, gray1);

//                            d_frame0.upload(gray0);
//                            d_frame1.upload(gray1);

//                            const proc_start = alvision.getTickCount();

//                            fastbm(d_frame0, d_frame1, d_fu, d_fv);
//                            fastbm(d_frame1, d_frame0, d_bu, d_bv);

//                            proc_fps = alvision.getTickFrequency() / (alvision.getTickCount() - proc_start);

//                            d_fu.download(fu);
//                            d_fv.download(fv);
//                            d_bu.download(bu);
//                            d_bv.download(bv);

//                            break;
//                        }

//                    default:
//                        ;
//                };

//                getFlowField(fu, fv, flowFieldForward, 30);
//                getFlowField(bu, bv, flowFieldBackward, 30);

//                alvision.split(frame0_32F, channels);

//                d_b0.upload(channels[0]);
//                d_g0.upload(channels[1]);
//                d_r0.upload(channels[2]);

//                alvision.split(frame1_32F, channels);

//                d_b1.upload(channels[0]);
//                d_g1.upload(channels[1]);
//                d_r1.upload(channels[2]);

//                frames.length = 0;
//                frames.push(frame0_32F.clone());

//                // compute interpolated frames
//                for (let timePos = timeStep; timePos < 1.0; timePos += timeStep)
//                {
//                    alvision.cudaoptflow.interpolateFrames(d_b0, d_b1, d_fu, d_fv, d_bu, d_bv, timePos, d_bNew, d_buf);
//                    alvision.cudaoptflow.interpolateFrames(d_g0, d_g1, d_fu, d_fv, d_bu, d_bv, timePos, d_gNew, d_buf);
//                    alvision.cudaoptflow.interpolateFrames(d_r0, d_r1, d_fu, d_fv, d_bu, d_bv, timePos, d_rNew, d_buf);

//                    let channels = [ d_bNew, d_gNew, d_rNew ];
//                    alvision.cudaarithm.merge(channels, 3, d_newFrame);

//                    d_newFrame.download(newFrame);

//                    frames.push(newFrame.clone());
//                }

//                frames.push(frame1_32F.clone());

//                currentFrame = 0;
//                forward = true;
//                this.calcFlow_ = false;

//                total_fps = alvision.getTickFrequency() / (alvision.getTickCount() - total_start);
//            }

//            framesImg.create(frame0.rows(), frame0.cols().valueOf() * 2,alvision.MatrixType. CV_8UC3);
//            let left = framesImg.roi( new alvision.Rect(0, 0, frame0.cols(), frame0.rows()));
//            let right = framesImg.roi(new alvision.Rect(frame0.cols(), 0, frame0.cols(), frame0.rows()));
//            frame0.copyTo(left);
//            frame1.copyTo(right);

//            flowsImg.create(frame0.rows(), frame0.cols().valueOf() * 2,alvision.MatrixType. CV_8UC3);
//            left = flowsImg.roi( new alvision.Rect(0, 0, frame0.cols(), frame0.rows()));
//            right = flowsImg.roi(new alvision.Rect(frame0.cols(), 0, frame0.cols(), frame0.rows()));
//            flowFieldForward.copyTo(left);
//            flowFieldBackward.copyTo(right);

//            alvision.imshow("Frames", framesImg);
//            alvision.imshow("Flows", flowsImg);

//            frames[currentFrame].convertTo(outImg,alvision.MatrixType. CV_8U, 255.0);

//            this.displayState(outImg, proc_fps, total_fps);

//            alvision.imshow("Dense Optical Flow Demo", outImg);

//            this.wait(30);

//            if (forward) {
//                ++currentFrame;
//                if (currentFrame == frames.length) - 1)
//                    forward = false;
//            }
//            else {
//                --currentFrame;
//                if (currentFrame == 0)
//                    forward = true;
//            }
//        }
//    }
//    protected processAppKey(key: alvision.int): void {
//        switch (toupper(key & 0xff)) {
//            case 32 /*space*/:
//                method_ = static_cast<Method>((method_ + 1) % METHOD_MAX);
//                cout << "Switch method to " << method_str[method_] << endl;
//                calcFlow_ = true;
//                break;

//            case 'N':
//                if (pairSources_.size() > 1) {
//                    curSource_ = (curSource_ + 1) % pairSources_.size();
//                    pairSources_[curSource_] ->reset();
//                    cout << "Switch source to " << curSource_ << endl;
//                    calcFlow_ = true;
//                }
//                break;
//        }
//    }
//    protected printAppHelp(): void {
//        console.log("This sample demonstrates different Dense Optical Flow algorithms");

//        console.log("Usage: demo_dense_optical_flow [options] ");
//    }


//    private displayState(outImg: alvision.Mat, proc_fps: alvision.double, total_fps: alvision.double): void {

//        const fontColorRed =alvision. CV_RGB(255, 0, 0);

//        ostringstream txt;
//        int i = 0;

//        txt.str(""); txt << "Source size: " << outImg.cols << 'x' << outImg.rows;
//        printText(outImg, txt.str(), i++);

//        txt.str(""); txt << "Method: " << method_str[method_];
//        printText(outImg, txt.str(), i++);

//        txt.str(""); txt << "FPS (OptFlow only): " << fixed << setprecision(1) << proc_fps;
//        printText(outImg, txt.str(), i++);

//        txt.str(""); txt << "FPS (total): " << fixed << setprecision(1) << total_fps;
//        printText(outImg, txt.str(), i++);

//        printText(outImg, "Space - switch method", i++, fontColorRed);
//        if (pairSources_.size() > 1)
//            printText(outImg, "N - switch source", i++, fontColorRed);
//    }

//    private pairSources_: Array<PairFrameSource>;

//    private method_: Method;
//    private curSource_: alvision.int;
//    private calcFlow_: boolean;

//}

//function isFlowCorrect(u: alvision.Point2f ): boolean
//{
//    return !isNaN(u.x.valueOf()) && !isNaN(u.y.valueOf()) && Math.abs(u.x.valueOf()) < 1e9 && Math.abs(u.y.valueOf()) < 1e9;
//}

//function computeColor(fx: alvision.float, fy: alvision.float ): alvision.Vec3b 
//{
//    static bool first = true;

//    // relative lengths of color transitions:
//    // these are chosen based on perceptual similarity
//    // (e.g. one can distinguish more shades between red and yellow
//    //  than between yellow and green)
//    const  RY = 15;
//    const  YG = 6;
//    const  GC = 4;
//    const  CB = 11;
//    const  BM = 13;
//    const  MR = 6;
//    const  NCOLS = RY + YG + GC + CB + BM + MR;
//    static Vec3i colorWheel[NCOLS];

//    if (first)
//    {
//        let k = 0;

//        for (let i = 0; i < RY; ++i, ++k)
//            colorWheel[k] = Vec3i(255, 255 * i / RY, 0);

//        for (let i = 0; i < YG; ++i, ++k)
//            colorWheel[k] = Vec3i(255 - 255 * i / YG, 255, 0);

//        for (let i = 0; i < GC; ++i, ++k)
//            colorWheel[k] = Vec3i(0, 255, 255 * i / GC);

//        for (let i = 0; i < CB; ++i, ++k)
//            colorWheel[k] = Vec3i(0, 255 - 255 * i / CB, 255);

//        for (let i = 0; i < BM; ++i, ++k)
//            colorWheel[k] = Vec3i(255 * i / BM, 0, 255);

//        for (let i = 0; i < MR; ++i, ++k)
//            colorWheel[k] = Vec3i(255, 0, 255 - 255 * i / MR);

//        first = false;
//    }

//    const  rad = Math.sqrt(fx * fx + fy * fy);
//    const  a = Math.atan2(-fy, -fx) / Math.PI;

//    const fk = (a + 1.0) / 2.0 * (NCOLS - 1);
//    const k0 = static_cast<int>(fk);
//    const k1 = (k0 + 1) % NCOLS;
//    const f = fk - k0;

//    let pix = new alvision.Vec3b();

//    for (let b = 0; b < 3; b++)
//    {
//        const col0 = colorWheel[k0][b] / 255.0;
//        const col1 = colorWheel[k1][b] / 255.0;

//        let col = (1 - f) * col0 + f * col1;

//        if (rad <= 1)
//            col = 1 - rad * (1 - col); // increase saturation with radius
//        else
//            col *= .75; // out of range

//        pix[2 - b] = static_cast<int>(255.0 * col);
//    }

//    return pix;
//}

//function getFlowField(u: alvision.Mat, v: alvision.Mat, flowField: alvision.Mat, maxrad  : alvision.float= -1) :  void 
//{
//    flowField.create(u.size(),alvision.MatrixType. CV_8UC3);
//    flowField.setTo(Scalar::all(0));

//    // determine motion range:
//    if (maxrad < 0)
//    {
//        maxrad = 1;
//        for (let y = 0; y < u.rows; ++y)
//        {
//            const float* uPtr = u.ptr<float>(y);
//            const float* vPtr = v.ptr<float>(y);

//            for (let x = 0; x < u.cols; ++x)
//            {
//                Point2f flow(uPtr[x], vPtr[x]);

//                if (!isFlowCorrect(flow))
//                    continue;

//                maxrad = max(maxrad, sqrt(flow.x * flow.x + flow.y * flow.y));
//            }
//        }
//    }

//    for (let y = 0; y < u.rows; ++y)
//    {
//        const float* uPtr = u.ptr<float>(y);
//        const float* vPtr = v.ptr<float>(y);
//        Vec3b* dstPtr = flowField.ptr<Vec3b>(y);

//        for (let x = 0; x < u.cols; ++x)
//        {
//            Point2f flow(uPtr[x], vPtr[x]);

//            if (isFlowCorrect(flow))
//                dstPtr[x] = computeColor(flow.x / maxrad, flow.y / maxrad);
//        }
//    }
//}




//RUN_APP(new App());
