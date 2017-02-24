import * as alvision from "../../tsbinding/alvision";
import { BaseApp, RUN_APP, FrameSource, opencv_extra } from "./utility";
import path = require('path')

const base_path = "gpu_demos_pack/demos/background_subtraction";


enum Method
{
    MOG,
    METHOD_MAX
};

const method_str = ["MOG"];

class App extends BaseApp
{
    constructor() {
        super();
        this.method_ = Method.MOG;
        this.useGpu_ = true;
        this.curSource_ = 0;
        this.fullscreen_ = false;
        this.reinitialize_ = true;
    }


    protected runAppLogic(): void {
        if (this.sources_.length == 0) {
            console.log("Using default frames source... ");
            let videoSource = FrameSource.video(path.join(opencv_extra, base_path, "data/background_subtraction.avi"));
            this.sources_.push(videoSource);
        }

        //let mog_cpu = new alvision.BackgroundSubtractorMOG();
        let mog_cpu  : alvision.BackgroundSubtractorMOG2;
        let knn_cpu  : alvision.BackgroundSubtractorKNN;
        let mog_gpu  : alvision.cuda.BackgroundSubtractorMOG;//.MOG_GPU();
        let mog_gpu2 : alvision.cuda.BackgroundSubtractorMOG2;

        let frame = new alvision.Mat(480, 640, alvision.MatrixType.CV_8UC3), fgmask1 = new alvision.Mat(480, 640, alvision.MatrixType.CV_8UC3), fgmask2 = new alvision.Mat(480, 640, alvision.MatrixType.CV_8UC3), filterBuf = new alvision.Mat(), outImg1 = new alvision.Mat(), outImg2 = new alvision.Mat();
        let d_frame: alvision.cuda.GpuMat, d_fgmask1: alvision.cuda.GpuMat, d_fgmask2: alvision.cuda.GpuMat;

        if (this.has_gpu) {
            d_frame = new alvision.cuda.GpuMat();
            d_fgmask1 = new alvision.cuda.GpuMat();
            d_fgmask2 = new alvision.cuda.GpuMat();
        }

        const wndName = "Background Subtraction Demo";

        if (this.fullscreen_) {
            alvision.namedWindow(wndName,alvision.WindowFlags. WINDOW_NORMAL);
            alvision.setWindowProperty(wndName,alvision.WindowPropertyFlags. WND_PROP_FULLSCREEN,   alvision.WindowFlags.WINDOW_FULLSCREEN);
            alvision.setWindowProperty(wndName,alvision.WindowPropertyFlags. WND_PROP_ASPECT_RATIO, alvision.WindowFlags.WINDOW_FREERATIO);
        }

        while (this.isActive()) {
            const total_start = alvision.getTickCount();

            if (this.reinitialize_) {
                mog_cpu = new alvision.BackgroundSubtractorMOG2();
                knn_cpu = new alvision.BackgroundSubtractorKNN();
                if (this.has_gpu) {
                    mog_gpu = new alvision.cuda.BackgroundSubtractorMOG();
                    mog_gpu2 = new alvision.cuda.BackgroundSubtractorMOG2();
                }

                //this.sources_[this.curSource_.valueOf()].reset();


                this.reinitialize_ = false;
            }

            this.sources_[this.curSource_.valueOf()].next(frame);

            //alvision.imshow("original", frame);

            if (this.useGpu_ && this.has_gpu)
                d_frame.upload(frame);

            const proc_start = alvision.getTickCount();

            switch (this.method_) {
                case Method.MOG:
                    {
                        if (this.useGpu_ && this.has_gpu) {
                            mog_gpu.apply(d_frame, d_fgmask1, 0.01);
                            mog_gpu2.apply(d_frame, d_fgmask2, 0.01);
                        }
                        else {
                            mog_cpu.apply(frame, fgmask1, 0.01);
                            knn_cpu.apply(frame, fgmask2, 0.01);
                        }
                        break;
                    }

                default:
                    ;
            }

            const proc_fps = alvision.getTickFrequency() / (alvision.getTickCount() - proc_start);

            if (this.useGpu_ && this.has_gpu) {
                d_fgmask1.download(fgmask1);
                d_fgmask2.download(fgmask2);
            }

            alvision.filterSpeckles(fgmask1, 0, 100, 1, filterBuf);
            alvision.filterSpeckles(fgmask2, 0, 100, 1, filterBuf);

            outImg1.create(frame.rows(), frame.cols().valueOf() * 2, alvision.MatrixType.CV_8UC3);
            outImg2.create(frame.rows(), frame.cols().valueOf() * 2, alvision.MatrixType.CV_8UC3);

            let left1 = outImg1.roi(new alvision.Rect(0, 0, frame.cols(), frame.rows()));
            let right1 = outImg1.roi(new alvision.Rect(frame.cols(), 0, frame.cols(), frame.rows()));

            let left2 = outImg2.roi(new alvision.Rect(0, 0, frame.cols(), frame.rows()));
            let right2 = outImg2.roi(new alvision.Rect(frame.cols(), 0, frame.cols(), frame.rows()));

            frame.copyTo(left1);
            alvision.add(left1, new alvision.Scalar(100, 100, 0), left1, fgmask1);

            frame.copyTo(left2);
            alvision.add(left2, new alvision.Scalar(100, 100, 0), left2, fgmask2);


            right1.setTo(0);
            frame.copyTo(right1, fgmask1);

            right2.setTo(0);
            frame.copyTo(right2, fgmask2);

            const total_fps = alvision.getTickFrequency() / (alvision.getTickCount() - total_start);

            this.displayState(outImg1, proc_fps, total_fps);
            this.displayState(outImg2, proc_fps, total_fps);

            alvision.imshow(wndName + "_1", outImg1);
            alvision.imshow(wndName + "_2", outImg2);

            this.wait(30);
        }
    }
    protected processAppKey(key: alvision.int): void {
        switch (String.fromCharCode(key.valueOf() & 0xff).toUpperCase()) {
            case ' ' /*space*/:
                {
                    this.useGpu_ = !this.useGpu_;
                    this.reinitialize_ = true;
                    console.log("Switch mode to ", (this.useGpu_ ? "CUDA" : "CPU"));
                }
                break;

            case 'N':
                if (this.sources_) {
                    this.curSource_ = (this.curSource_.valueOf() + 1) % this.sources_.length;
                    this.reinitialize_ = true;
                    console.log("Switch source to ", this.curSource_ )
                }
                break;
        }
    }
    protected printAppHelp(): void {

        console.log("This sample demonstrates different Background Subtraction algorithms ");
        console.log("Usage: demo_background_subtraction [options] ");
        console.log("Launch Options: ");
        console.log("  --fullscreen ");
        console.log("       Launch in fullscreen mode ");
    }
    protected parseAppCmdArgs(i: number, argc: alvision.int, argv: string[]): number {

        let arg = argv[i.valueOf()];

        if (arg == "--fullscreen") {
            this.fullscreen_ = true;
        }
        return i;
    }


    private displayState(outImg: alvision.Mat, proc_fps: alvision.double, total_fps: alvision.double): void {
        const fontColorRed = alvision.CV_RGB(255, 0, 0);

        console.log("Source size: ", outImg.cols().valueOf() / 2, 'x', outImg.rows());
        //printText(outImg, txt.str(), i++);

        console.log("Method: ", method_str[this.method_.valueOf()], (this.useGpu_ ? " CUDA" : " CPU"));
        //printText(outImg, txt.str(), i++);

        console.log("FPS (BG only): ", proc_fps);
        //printText(outImg, txt.str(), i++);

        console.log("FPS (Total): ", total_fps);
        //printText(outImg, txt.str(), i++);

        console.log("Space - switch CUDA / CPU mode", fontColorRed);

        if (this.sources_)
            console.log("N - switch source", fontColorRed);

    }

    private method_: Method;
    private useGpu_: boolean;
    private curSource_: alvision.int;
    private fullscreen_: boolean;
    private reinitialize_: boolean;
};


RUN_APP(new App());
