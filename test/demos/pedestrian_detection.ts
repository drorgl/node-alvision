import * as alvision from "../../tsbinding/alvision";
import { BaseApp, RUN_APP, FrameSource, opencv_extra} from "./utility";
import path = require('path')

const base_path = "gpu_demos_pack/";

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
            this.sources_.push(FrameSource.video(path.join([opencv_extra,base_path, "data/pedestrian_detection.avi"])));
        }

        const scale = 1.05;
        const nlevels = 13;
        const gr_threshold = 8;

        const hit_threshold = 1.4;
        const gamma_corr = false;

        const win_size = new alvision.Size(48, 96);
        const win_stride = new alvision.Size(8, 8);

        const detector = alvision.HOGDescriptor.getDefaultPeopleDetector(); //gpu::HOGDescriptor::getPeopleDetector48x96();

        let gpu_hog = alvision.cudaobjdetect.HOG.create(win_size, new alvision.Size(16, 16),new alvision. Size(8, 8),new alvision. Size(8, 8), 9)


        //gpu::HOGDescriptor gpu_hog(win_size, Size(16, 16), Size(8, 8), Size(8, 8), 9,
        //    gpu::HOGDescriptor::DEFAULT_WIN_SIGMA, 0.2, gamma_corr,
        //    gpu::HOGDescriptor::DEFAULT_NLEVELS);

        let cpu_hog = new alvision.HOGDescriptor(win_size, new alvision.Size(16, 16), new alvision.Size(8, 8),new alvision.Size(8, 8), 9, 1, -1,
           alvision.HOGDescriptor.L2Hys, 0.2, gamma_corr,alvision.HOGDescriptor.DEFAULT_NLEVELS);
        //cv::HOGDescriptor cpu_hog(win_size, Size(16, 16), Size(8, 8), Size(8, 8), 9, 1, -1,
        //    cv::HOGDescriptor::L2Hys, 0.2, gamma_corr,
        //    cv::HOGDescriptor::DEFAULT_NLEVELS);

        gpu_hog.setSVMDetector(detector);
        cpu_hog.setSVMDetector(detector);

        gpu_hog.setNumLevels(nlevels);
        cpu_hog.nlevels = nlevels;

        let frame = new alvision.Mat(), img = new alvision.Mat(), outImg = new alvision.Mat();
        let gpu_img = new alvision.cuda.GpuMat();
        let rects = new Array<alvision.Rect>();

        const wndName = "Pedestrian Detection Demo";

        if (this.fullscreen_) {
            alvision.namedWindow(wndName,alvision.WindowFlags.WINDOW_NORMAL);
            alvision.setWindowProperty(wndName,alvision.WindowPropertyFlags. WND_PROP_FULLSCREEN,alvision.WindowFlags.WINDOW_FULLSCREEN);
            alvision.setWindowProperty(wndName,alvision.WindowPropertyFlags.WND_PROP_ASPECT_RATIO,alvision.WindowFlags.WINDOW_FREERATIO);
        }

        while (this.isActive()) {
            const total_start = alvision.getTickCount();

            this.sources_[this.curSource_.valueOf()].next(frame);

            if (!this.colorInput_)
                alvision.cvtColor(frame, img,alvision.ColorConversionCodes.COLOR_BGR2GRAY);
            else if (this.useGpu_)
                alvision.cvtColor(frame, img, alvision.ColorConversionCodes.COLOR_BGR2BGRA);
            else
                frame.copyTo(img);

            if (this.colorInput_)
                frame.copyTo(outImg);
            else
                alvision.cvtColor(img, outImg, alvision.ColorConversionCodes.COLOR_GRAY2BGR);

            if (this.useGpu_)
                gpu_img.upload(img);

            const proc_start = alvision.getTickCount();

            if (this.useGpu_)
                //gpu_hog.detectMultiScale(gpu_img, rects, hit_threshold, win_stride, Size(0, 0), scale, gr_threshold);
                gpu_hog.detectMultiScale(gpu_img, (locs) => { rects = locs; });//, hit_threshold, win_stride, Size(0, 0), scale, gr_threshold);
            else
                cpu_hog.detectMultiScale(img,(foundLocations)=> rects = foundLocations, hit_threshold, win_stride,new alvision.Size(0, 0), scale, gr_threshold);

            const  proc_fps = alvision.getTickFrequency() / (alvision.getTickCount() - proc_start);

            for (let i = 0; i < rects.length; i++)
            alvision.rectangle(outImg, rects[i], alvision.CV_RGB(0, 255, 0), 3);

            const total_fps =alvision. getTickFrequency() / (alvision.getTickCount() - total_start);

            this.displayState(outImg, proc_fps, total_fps);

            alvision.imshow(wndName, outImg);

            this.wait(30);
        }
    }
    protected processAppKey(key: alvision.int): void {
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
        const  fontColorRed = alvision.CV_RGB(255, 0, 0);

        //ostringstream txt;
        //int i = 0;
        //
        //txt.str(""); txt << "Source size: " << outImg.cols << 'x' << outImg.rows;
        console.log("Source size: " , outImg.cols() , 'x' , outImg.rows());
        //printText(outImg, txt.str(), i++);
        //
        //printText(outImg, useGpu_ ? "Mode: CUDA" : "Mode: CPU", i++);
        console.log(this.useGpu_ ? "Mode: CUDA" : "Mode: CPU");
        //
        //txt.str(""); txt << "FPS (PD only): " << fixed << setprecision(1) << proc_fps;
        console.log("FPS (PD only): "  , proc_fps);
        //printText(outImg, txt.str(), i++);
        //
        //txt.str(""); txt << "FPS (total): " << fixed << setprecision(1) << total_fps;
        console.log("FPS (total): " , total_fps);
        //printText(outImg, txt.str(), i++);
        //
        //printText(outImg, "Space - switch CUDA / CPU mode", i++, fontColorRed);
        console.log("Space - switch CUDA / CPU mode");
        //printText(outImg, "C - switch Color / Gray mode", i++, fontColorRed);
        console.log("C - switch Color / Gray mode");
        //if (sources_.size() > 1)
        //    printText(outImg, "N - switch source", i++, fontColorRed);
        if (this.sources_.length > 1)
            console.log("N - switch source");
    }

    private useGpu_: boolean;
    private colorInput_: boolean;
    private curSource_: alvision.int;
    private fullscreen_: boolean;
};


RUN_APP(new App());
