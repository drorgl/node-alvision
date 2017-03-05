//import * as alvision from "../../tsbinding/alvision";
//import { BaseApp, RUN_APP, FrameSource, opencv_extra, PairFrameSource, makeGray, printText } from "./utility";
//import path = require('path')

//const base_path = "gpu_demos_pack/demos/denoising";

//class App extends BaseApp
//{
//    constructor() {
//        super();
//        this.useGpu_ = true;
//        this.curSource_ = 0;
//        this.fullscreen_ = true;
//    }


//    protected runAppLogic(): void {
//        if (this.sources_.length) {
//            console.log("Loading default frames source... ");

//            this.sources_.push(FrameSource.video("data/sparse_optical_flow.avi"));
//        }

//        for (let i = 0; i < this. sources_.length; ++i)
//        this.pairSources_.push(PairFrameSource.create(this.sources_[i], 2));

//        let detector = new alvision.GoodFeaturesToTrackDetector_GPU (8000, 0.01, 10.0);
//        let lk = new alvision.PyrLKOpticalFlow();

//        Mat frame0, frame1;
//        Mat gray;
//        GpuMat d_frame0, d_frame1;
//        GpuMat d_gray;

//        GpuMat d_prevPts;
//        GpuMat d_nextPts;
//        GpuMat d_status;

//        Array<alvision.Point2f > prevPts;
//        Array<alvision.Point2f > nextPts;
//        Array<alvision.uchar > status;

//        let outImg = new alvision.Mat();

//        const wndName = "Sparse Optical Flow Demo";

//        if (this.fullscreen_) {
//            namedWindow(wndName, WINDOW_NORMAL);
//            setWindowProperty(wndName, WND_PROP_FULLSCREEN, CV_WINDOW_FULLSCREEN);
//            setWindowProperty(wndName, WND_PROP_ASPECT_RATIO, CV_WINDOW_FREERATIO);
//        }

//        while (this.isActive()) {
//            const total_start = getTickCount();

//            this.pairSources_[curSource_] ->next(frame0, frame1);

//            let proc_fps = 0.0;

//            if (this.useGpu_) {
//                d_frame0.upload(frame0);
//                d_frame1.upload(frame1);

//                cvtColor(d_frame0, d_gray, COLOR_BGR2GRAY);

//                const int64 proc_start = getTickCount();

//                detector(d_gray, d_prevPts);
//                lk.sparse(d_frame0, d_frame1, d_prevPts, d_nextPts, d_status);

//                proc_fps = getTickFrequency() / (getTickCount() - proc_start);

//                download(d_prevPts, prevPts);
//                download(d_nextPts, nextPts);
//                download(d_status, status);
//            }
//            else {
//                cvtColor(frame0, gray, COLOR_BGR2GRAY);

//                const int64 proc_start = getTickCount();

//                goodFeaturesToTrack(gray, prevPts, detector.maxCorners, detector.qualityLevel, detector.minDistance);
//                calcOpticalFlowPyrLK(frame0, frame1, prevPts, nextPts, status, noArray());

//                proc_fps = getTickFrequency() / (getTickCount() - proc_start);
//            }

//            frame0.copyTo(outImg);
//            alvision.drawArrows(outImg, prevPts, nextPts, status, Scalar(255, 0, 0));

//            const total_fps = alvision.getTickFrequency() / (alvision.getTickCount() - total_start);

//            this.displayState(outImg, proc_fps, total_fps);

//            alvision.imshow(wndName, outImg);

//            this.wait(30);
//        }
//    }
//    protected processAppKey(key: alvision.int): void {
//        switch (toupper(key & 0xff)) {
//            case 32 /*space*/:
//                useGpu_ = !useGpu_;
//                cout << "Switch mode to " << (useGpu_ ? "CUDA" : "CPU") << endl;
//                break;

//            case 'N':
//                if (pairSources_.size() > 1) {
//                    curSource_ = (curSource_ + 1) % pairSources_.size();
//                    pairSources_[curSource_] ->reset();
//                    cout << "Switch source to " << curSource_ << endl;
//                }
//                break;
//        }
//    }
//    protected printAppHelp(): void {
//        console.log("This sample demonstrates different Sparse Optical Flow algorithms ");

//        console.log("Usage: demo_sparse_optical_flow [options] ");

//        console.log("Launch Options: ");
//        console.log("  --windowed ");
//        console.log("       Launch in windowed mode");
//    }
//    protected parseAppCmdArgs(i: number, argc: alvision.int, argv: string[]): number {
//        let arg = argv[i];

//        if (arg == "--windowed") {
//            this.fullscreen_ = false;
//            return i+1;
//        }
//        else
//            return i;

//        return i;
//    }


//    private displayState(outImg: alvision.Mat, proc_fps: alvision.double, total_fps: alvision.double): void {
//const Scalar fontColorRed = CV_RGB(255, 0, 0);
//
//ostringstream txt;
//int i = 0;
//
//txt.str(""); txt << "Source size: " << outImg.cols << 'x' << outImg.rows;
//printText(outImg, txt.str(), i++);
//
//printText(outImg, useGpu_ ? "Mode: CUDA" : "Mode: CPU", i++);
//
//txt.str(""); txt << "FPS (OptFlow only): " << fixed << setprecision(1) << proc_fps;
//printText(outImg, txt.str(), i++);
//
//txt.str(""); txt << "FPS (total): " << fixed << setprecision(1) << total_fps;
//printText(outImg, txt.str(), i++);
//
//printText(outImg, "Space - switch CUDA / CPU mode", i++, fontColorRed);
//if (pairSources_.size() > 1)
//    printText(outImg, "N - next source", i++, fontColorRed);
//    }

//    private pairSources_: Array<PairFrameSource>;

//    private useGpu_: boolean;
//    private curSource_: number;
//    private fullscreen_: boolean;
//};




//function download_Point2f(d_mat: alvision.cuda.GpuMat, vec: Array<alvision.Point2f>): void 
//{
//    vec.length = d_mat.cols().valueOf();
//    let mat = new alvision.Mat (1, d_mat.cols,alvision.MatrixType. CV_32FC2, vec);
//    d_mat.download(mat);
//}

//function download_uchar(d_mat: alvision.cuda.GpuMat, vec: Array<alvision.uchar> ): void 
//{
//    vec.length = d_mat.cols().valueOf();
//    let mat = new alvision.Mat (1, d_mat.cols,alvision.MatrixType. CV_8UC1, vec);
//    d_mat.download(mat);
//}

//function drawArrows(frame: alvision.Mat, prevPts: Array<alvision.Point2f>, nextPts: Array<alvision.Point2f>, status: Array<alvision.uchar>, line_color: alvision.Scalar = new alvision.Scalar(0, 0, 255)) : void 
//{
//    for (let i = 0; i < prevPts.length; ++i)
//    {
//        if (status[i])
//        {
//            let line_thickness = 1;

//            let p = prevPts[i];
//            let q = nextPts[i];

//            let angle = Math.atan2(p.y - q.y,  p.x - q.x);

//            let hypotenuse = Math.sqrt( (p.y - q.y)*(p.y - q.y) + (p.x - q.x)*(p.x - q.x) );

//            if (hypotenuse < 3.0 || hypotenuse > 50.0)
//                continue;

//            // Here we lengthen the arrow by a factor of three.
//            q.x =  (p.x - hypotenuse * Math.cos(angle));
//            q.y =  (p.y - hypotenuse * Math.sin(angle));

//            // Now we draw the main line of the arrow.
//            alvision.line(frame, p, q, line_color, line_thickness);

//            // Now draw the tips of the arrow. I do some scaling so that the
//            // tips look proportional to the main line of the arrow.

//            let tips_length = 9.0 * hypotenuse / 50.0 + 5.0;

//            p.x =  (q.x + tips_length * Math.cos(angle + CV_PI / 6));
//            p.y =  (q.y + tips_length * Math.sin(angle + CV_PI / 6));
//            alvision.line(frame, p, q, line_color, line_thickness);

//            p.x =  (q.x + tips_length * Math.cos(angle - CV_PI / 6));
//            p.y =  (q.y + tips_length * Math.sin(angle - CV_PI / 6));
//            alvision.line(frame, p, q, line_color, line_thickness);
//        }
//    }
//}



//RUN_APP(new App());
