import * as alvision from "../../tsbinding/alvision";
import { BaseApp, RUN_APP, FrameSource, opencv_extra, PairFrameSource, makeGray, printText } from "./utility";
import path = require('path')

const base_path = "gpu_demos_pack/demos/stereo_matching";

class App extends BaseApp
{
    constructor() {
        super();
        this.useGpu_ = true;
        this.colorOutput_ = true;
        this.showSource_ = true;
        this.curSource_ = 0;
        this.fullscreen_ = true;
        this.pairSources_ = [];
    }


    protected runAppLogic(): void {
        if (this.sources_.length > 1) {
            for (let i = 0; (i + 1) < this.sources_.length; i += 2)
                this.pairSources_.push(PairFrameSource.create_framesource(this.sources_[i], this.sources_[i + 1]));
        }
        else {
            console.log("Using default frames source... ");

            this.pairSources_.push(PairFrameSource.create_framesource(FrameSource.video(path.join(opencv_extra, base_path, "data/stereo_matching_L.avi")),
                FrameSource.video(path.join(opencv_extra, base_path, "data/stereo_matching_R.avi"))));
        }

        let ndisp = 160;
        const blockSize = 9;

        //TODO: add more algorithms.
        //TODO: add scrollbar for ndisp
        //TODO: add scollbar for blockSize
        //TODO: http://docs.opencv.org/trunk/d3/d14/tutorial_ximgproc_disparity_filtering.html
        //TODO: add http://docs.opencv.org/trunk/d9/d51/classcv_1_1ximgproc_1_1DisparityWLSFilter.html

        let bm_gpu: alvision.cuda.StereoBM;

        if (this.has_gpu) {
            bm_gpu = alvision.cuda.createStereoBM(ndisp,blockSize);
            bm_gpu.setNumDisparities(ndisp);
        }

        

        let bm_cpu = alvision.StereoBM.create(ndisp,blockSize);
        //bm_cpu.init(StereoBM::BASIC_PRESET, bm_gpu.ndisp, bm_gpu.winSize);

        let left_src = new alvision.Mat(), right_src = new alvision.Mat();
        let left = new alvision.Mat(), right = new alvision.Mat();
        let d_left: alvision.cuda.GpuMat, d_right: alvision.cuda.GpuMat;

        if (this.has_gpu) {
            d_left = new alvision.cuda.GpuMat();
            d_right = new alvision.cuda.GpuMat();
        }

        let small_image = new alvision.Mat();

        let disp = new alvision.Mat(), disp_16s = new alvision.Mat();
        let d_disp: alvision.cuda.GpuMat, d_img_to_show: alvision.cuda.GpuMat;
        if (this.has_gpu) {
            d_disp = new alvision.cuda.GpuMat();
            d_img_to_show = new alvision.cuda.GpuMat();
        }

        let outImg = new alvision.Mat();

        const wndName = "Stereo Matching Demo";
        const tbName = "TrackBarDisp";

        //if (this.fullscreen_) {
        //    alvision.namedWindow(wndName, alvision.WindowFlags.WINDOW_NORMAL);
        //    alvision.setWindowProperty(wndName, alvision.WindowPropertyFlags.WND_PROP_FULLSCREEN, alvision.WindowFlags.WINDOW_FULLSCREEN);
        //    alvision.setWindowProperty(wndName, alvision.WindowPropertyFlags.WND_PROP_ASPECT_RATIO, alvision.WindowFlags.WINDOW_FREERATIO);
        //}

        alvision.namedWindow(wndName, alvision.WindowFlags.WINDOW_NORMAL);
        alvision.createTrackbar(tbName, wndName, 256, (val) => {
            ndisp = val.valueOf();
            if (ndisp % 16 != 0) {
                ndisp += 16 - (ndisp % 16);
            }
            bm_cpu.setNumDisparities(ndisp);
        }, 0);

        while (this.isActive()) {
            const total_start = alvision.getTickCount();

            let tmp_left = new alvision.Mat();
            let tmp_right = new alvision.Mat();
            this.pairSources_[this.curSource_].next(tmp_left, tmp_right);

            //tmp_left.copyTo(left_src);
            //tmp_right.copyTo(right_src);
            alvision.resize(tmp_left, left_src, new alvision.Size(), 0.25, 0.25, alvision.InterpolationFlags.INTER_NEAREST);
            alvision.resize(tmp_right, right_src, new alvision.Size(), 0.25, 0.25, alvision.InterpolationFlags.INTER_NEAREST);

            
            makeGray(left_src, left);
            makeGray(right_src, right);

            //alvision.imshow("left", left);
            //alvision.imshow("right", right);


            if (this.useGpu_ && this.has_gpu) {
                d_left.upload(left);
                d_right.upload(right);
            }

            const proc_start = alvision.getTickCount();

            if (this.useGpu_ && this.has_gpu)
                bm_gpu.compute(d_left, d_right, d_disp);
            else
                bm_cpu.compute(left, right, disp_16s);

            //alvision.imshow("disp_16s", disp_16s);

            const proc_fps = alvision.getTickFrequency() / (alvision.getTickCount() - proc_start);

            if (this.colorOutput_) {
                if (this.has_gpu) {
                    if (!this.useGpu_) {
                        disp_16s.convertTo(disp, alvision.MatrixType.CV_8U, 1.0 / 16.0);
                        d_disp.upload(disp);
                    }

                    alvision.cuda.drawColorDisp(d_disp, d_img_to_show, bm_gpu.getMinDisparity());
                    d_img_to_show.download(outImg);
                } else {
                    disp_16s.convertTo(disp, alvision.MatrixType.CV_8U, 1.0 / 16.0);
                    alvision.cvtColor(disp, outImg, alvision.ColorConversionCodes.COLOR_GRAY2BGR);
                }
            }
            else {
                if (this.has_gpu) {
                    if (!this.useGpu_) {
                        disp_16s.convertTo(disp, alvision.MatrixType.CV_8U, 255.0 / (16.0 * bm_gpu.getMinDisparity().valueOf()));
                        alvision.cvtColor(disp, outImg, alvision.ColorConversionCodes.COLOR_GRAY2BGR);
                    }
                    else {
                        d_disp.convertTo(d_disp, d_disp.depth(), 255.0 / bm_gpu.getMinDisparity().valueOf());
                        alvision.cuda.cvtColor(d_disp, d_img_to_show, alvision.ColorConversionCodes.COLOR_GRAY2BGR);
                        d_img_to_show.download(outImg);
                    }
                } else {
                    disp_16s.convertTo(disp, alvision.MatrixType.CV_8U, 255.0 / (16.0 * bm_cpu.getMinDisparity().valueOf()));
                    alvision.cvtColor(disp, outImg, alvision.ColorConversionCodes.COLOR_GRAY2BGR);
                }
            }

            if (this.showSource_) {
                alvision.resize(left_src, small_image,new alvision.Size(), 0.25, 0.25);
                let roi = outImg.roi (new alvision.Rect(outImg.cols().valueOf() - small_image.cols().valueOf(), 0, small_image.cols().valueOf(), small_image.rows().valueOf()));

                if (this.colorOutput_)
                    alvision.cvtColor(small_image, roi,alvision.ColorConversionCodes.COLOR_BGR2BGRA);
                else
                    small_image.copyTo(roi);
            }

            const total_fps = alvision.getTickFrequency() / (alvision.getTickCount() - total_start);

            console.log(outImg.cols(), outImg.rows());

            if (this.showMenu_) {
                this.displayState(outImg, proc_fps, total_fps);
            }

            alvision.imshow(wndName, outImg);

            this.wait(30);
        }
    }
    protected processAppKey(key: alvision.int): void {
        switch (String.fromCharCode(key.valueOf() & 0xff).toUpperCase()) {
            case ' ' /*space*/:
                this.useGpu_ = !this.useGpu_;
                console.log("Switch mode to ", (this.useGpu_ ? "CUDA" : "CPU"));
                break;

            case 'C':
                this.colorOutput_ = !this.colorOutput_;
                console.log("Switch mode to ", (this.colorOutput_ ? "Color" : "Gray"));
                break;

            case 'S':
                this.showSource_ = !this.showSource_;
                console.log((this.showSource_ ? "Show source" : "Hide source"));
                break;
            case 'M':
                this.showMenu_ = !this.showMenu_;
                console.log((this.showMenu_ ? "Show menu" : "Hide menu"));
                break;
            case 'N':
                if (this.pairSources_.length > 1) {
                    this.curSource_ = (this.curSource_ + 1) % this.pairSources_.length;
                    this.pairSources_[this.curSource_].reset();
                    console.log("Switch source to ", this.curSource_);
                }
                break;
        }
    }
    protected printAppHelp(): void {
        console.log("This sample demonstrates Stereo Matching algorithm ");

        console.log("Usage: demo_stereo_matching [options] ");

        console.log("Launch Options: ");
        console.log("  --windowed ");
        console.log("       Launch in windowed mode");
    }
    protected parseAppCmdArgs(i: number, argc: alvision.int, argv: Array<string>): number {
        let arg = argv[i];

        if (arg == "--windowed") {
            this.fullscreen_ = false;
            return i + 1;
        }
        else
            return i;

        //return i + 1;
    }


    private displayState(outImg: alvision.Mat, proc_fps: alvision.double, total_fps: alvision.double): void {
        const fontColorRed = alvision.CV_RGB(255, 0, 0);

        let txt: string;
        let i = 0;

        txt = ""; txt = "Source size: " + outImg.cols().toString() + 'x'  + outImg.rows().toString();
        printText(outImg, txt, i++);

        printText(outImg, this.useGpu_ ? "Mode: CUDA" : "Mode: CPU", i++);

        txt = ""; txt = "FPS (Stereo only): " + proc_fps.toString();
        printText(outImg, txt, i++);

        txt = ""; txt = "FPS (total): " +  total_fps.toString();
        printText(outImg, txt, i++);

        printText(outImg, "Space - switch CUDA / CPU mode", i++, fontColorRed);
        printText(outImg, "C - switch Color / Gray mode", i++, fontColorRed);
        printText(outImg, "S - show / hide source frame", i++, fontColorRed);
        printText(outImg, "M - show / hide menu", i++, fontColorRed);
        if (this.pairSources_.length > 1)
            printText(outImg, "N - switch source", i++, fontColorRed);
    }

    private pairSources_: Array<PairFrameSource>;

    private useGpu_: boolean;
    private colorOutput_: boolean;
    private showSource_: boolean;
    private showMenu_: boolean;
    private curSource_: number;
    private fullscreen_: boolean;
};






RUN_APP(new App());
