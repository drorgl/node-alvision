import * as alvision from "../../tsbinding/alvision";
import { BaseApp, RUN_APP, FrameSource, opencv_extra, PairFrameSource, makeGray, printText } from "./utility";
import path = require('path')

const base_path = "gpu_demos_pack/demos/pedestrian_detection";

class App extends BaseApp
{
    constructor() {
        super();
        this.useGpu_ = true;
        this.colorInput_ = true;
        this.curSource_ = 0;
        this.fullscreen_ = false;
    }


    protected runAppLogic(): void {
        if (this.sources_.length == 0) {
            console.log("Loading default frames source... ");
            this.sources_.push(FrameSource.video(path.join(opencv_extra,base_path, "data/pedestrian_detection.avi")));
        }

        const scale = 1.10;
        const nlevels = 5;
        const gr_threshold = 0;

        const hit_threshold = 0;
        const gamma_corr = false;

        const win_size = new alvision.Size(48, 96);
        const win_stride = new alvision.Size(8, 8);

        const detector = alvision.HOGDescriptor.getDefaultPeopleDetector(); //gpu::HOGDescriptor::getPeopleDetector48x96();

        let gpu_hog: alvision.cuda.HOG;
        if (this.has_gpu && this.useGpu_) {
            gpu_hog = alvision.cuda.HOG.create(win_size, new alvision.Size(16, 16), new alvision.Size(8, 8), new alvision.Size(8, 8), 9)
        }

        //gpu::HOGDescriptor gpu_hog(win_size, Size(16, 16), Size(8, 8), Size(8, 8), 9,
        //    gpu::HOGDescriptor::DEFAULT_WIN_SIGMA, 0.2, gamma_corr,
        //    gpu::HOGDescriptor::DEFAULT_NLEVELS);

        //let cpu_hog = new alvision.HOGDescriptor(win_size, new alvision.Size(16, 16), new alvision.Size(8, 8),new alvision.Size(8, 8), 9, 1, -1,
        //   alvision.HOGDescriptor.L2Hys, 0.2, gamma_corr,alvision.HOGDescriptor.DEFAULT_NLEVELS);
        let cpu_hog = new alvision.HOGDescriptor();
        //cv::HOGDescriptor cpu_hog(win_size, Size(16, 16), Size(8, 8), Size(8, 8), 9, 1, -1,
        //    cv::HOGDescriptor::L2Hys, 0.2, gamma_corr,
        //    cv::HOGDescriptor::DEFAULT_NLEVELS);

        if (this.has_gpu) {
            gpu_hog.setSVMDetector(detector);
        }
        cpu_hog.setSVMDetector(detector);

        if (this.has_gpu) {
            gpu_hog.setNumLevels(nlevels);
        }
        cpu_hog.nlevels = nlevels;

        let orig_frame = new alvision.Mat(800, 1280, alvision.MatrixType.CV_8UC3), frame = new alvision.Mat(), img = new alvision.Mat(), outImg = new alvision.Mat();

        let gpu_img: alvision.cuda.GpuMat = null;
        if (this.has_gpu) {
            gpu_img = new alvision.cuda.GpuMat();
        }

        let rects = new Array<alvision.Rect>();

        const wndName = "Pedestrian Detection Demo";

        if (this.fullscreen_) {
            alvision.namedWindow(wndName,alvision.WindowFlags.WINDOW_NORMAL);
            alvision.setWindowProperty(wndName,alvision.WindowPropertyFlags. WND_PROP_FULLSCREEN,alvision.WindowFlags.WINDOW_FULLSCREEN);
            alvision.setWindowProperty(wndName,alvision.WindowPropertyFlags.WND_PROP_ASPECT_RATIO,alvision.WindowFlags.WINDOW_FREERATIO);
        }

        while (this.isActive()) {
            const total_start = alvision.getTickCount();

            if (!this.sources_[this.curSource_.valueOf()].next(orig_frame)) {
                console.log("done");
                return;
            }
            alvision.imshow("original", orig_frame);
            alvision.resize(orig_frame, frame, new alvision.Size(500, 400), 1, 1, alvision.InterpolationFlags.INTER_NEAREST);

            //if (!this.colorInput_)
                alvision.cvtColor(frame, img,alvision.ColorConversionCodes.COLOR_BGR2GRAY);
            //else if (this.useGpu_ && this.has_gpu)
            //    alvision.cvtColor(frame, img, alvision.ColorConversionCodes.COLOR_BGR2BGRA);
            //else
            //    frame.copyTo(img);

                alvision.imshow("gray", img);

            if (this.colorInput_)
                frame.copyTo(outImg);
            else
                alvision.cvtColor(img, outImg, alvision.ColorConversionCodes.COLOR_GRAY2BGR);

            if (this.useGpu_ && this.has_gpu)
                gpu_img.upload(img);

            const proc_start = alvision.getTickCount();

            if (this.useGpu_ && this.has_gpu)
                //gpu_hog.detectMultiScale(gpu_img, rects, hit_threshold, win_stride, Size(0, 0), scale, gr_threshold);
                gpu_hog.detectMultiScale(gpu_img, (locs) => { rects = locs; });//, hit_threshold, win_stride, Size(0, 0), scale, gr_threshold);
            else
                cpu_hog.detectMultiScale(img,(foundLocations)=> rects = foundLocations, hit_threshold, win_stride,new alvision.Size(0, 0), scale, gr_threshold);

            const  proc_fps = alvision.getTickFrequency() / (alvision.getTickCount() - proc_start);
            console.log("rects", rects.length);
            for (let i = 0; i < rects.length; i++)
            alvision.rectangle(outImg, rects[i], alvision.CV_RGB(0, 255, 0), 3);

            const total_fps =alvision. getTickFrequency() / (alvision.getTickCount() - total_start);

            this.displayState(outImg, proc_fps, total_fps);

            alvision.imshow(wndName, outImg);

            this.wait(30);
        }
    }

    protected processAppKey(key: alvision.int): void {
        let keychar = String.fromCharCode(key.valueOf() & 0xff).toUpperCase();
        switch (String.fromCharCode(key.valueOf() & 0xff).toUpperCase()) {
            case " " /*space*/:
                this.useGpu_ = !this.useGpu_;
                console.log("Switch mode to ", (this.useGpu_ ? "CUDA" : "CPU"));
                break;

            case 'C':
                this.colorInput_ = !this.colorInput_;
                console.log("Switch mode to ", (this.colorInput_ ? "Color" : "Gray"));
                break;

            case 'N':
                if (this.sources_.length > 1) {
                    this.curSource_ = (this.curSource_.valueOf() + 1) % this.sources_.length
                    this.sources_[this.curSource_.valueOf()].reset();
                    console.log("Switch source to ", this.curSource_);
                }
                break;
        }
    }
    protected printAppHelp(): void {
        console.log("This sample demonstrates Pedestrian Detection algorithm");

        console.log("Usage: demo_pedestrian_detection [options] ");

        console.log("Launch Options: ");
        console.log("  --fullscreen ");
        console.log("       Launch in fullscreen mode ");
    }
    protected parseAppCmdArgs(i: number, argc: alvision.int, argv: string[]): number {
        let arg = argv[i];

        if (arg == "--fullscreen") {
            this.fullscreen_ = true;
        }
        return i;
    }

    private displayState(outImg: alvision.Mat, proc_fps: alvision.double, total_fps: alvision.double): void {
        const fontColorRed = alvision.CV_RGB(255, 0, 0);

        let txt: string;
        let i = 0;

        txt = "Source size: " + outImg.cols() + 'x' + outImg.rows();
        printText(outImg, txt, i++);

        printText(outImg, this.useGpu_ ? "Mode: CUDA" : "Mode: CPU", i++);

        txt = "FPS (PD only): " + proc_fps;
        printText(outImg, txt, i++);

        txt = "FPS (total): " + total_fps;
        printText(outImg, txt, i++);

        printText(outImg, "Space - switch CUDA / CPU mode", i++, fontColorRed);
        printText(outImg, "C - switch Color / Gray mode", i++, fontColorRed);
        if (this.sources_.length > 1)
            printText(outImg, "N - switch source", i++, fontColorRed);
    }

    private useGpu_: boolean;
    private colorInput_: boolean;
    private curSource_: alvision.int;
    private fullscreen_: boolean;
};


RUN_APP(new App());
