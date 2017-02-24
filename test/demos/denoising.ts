import * as alvision from "../../tsbinding/alvision";
import { BaseApp, RUN_APP, FrameSource, opencv_extra } from "./utility";
import path = require('path')

const base_path = "gpu_demos_pack/demos/denoising";

class App extends BaseApp
{
    constructor() {
        super();
        this.useGpu_ = true;
        this.colorInput_ = true;
        this.curSource_ = 0;
        this.fullscreen_ = false;
        this.noise_ = new alvision.Mat();
    }


    protected runAppLogic(): void {
        if (this.sources_.length == 0) {
            console.log("Using default frames source... ");
            this.sources_.push(FrameSource.image(path.join(opencv_extra, base_path,"data/denoising.jpg")));
        }

        //let d_nlm = new alvision.cudaphoto.FastNonLocalMeansDenoising();

        let frame = new alvision.Mat(), src = new alvision.Mat(), dst = new alvision.Mat (), outImg = new alvision.Mat ();
        let d_src : alvision.cuda.GpuMat, d_dst : alvision.cuda.GpuMat ;

        const wndName = "Denoising Demo";

        if (this.fullscreen_) {
            alvision.namedWindow(wndName,alvision.WindowFlags. WINDOW_NORMAL);
            alvision.setWindowProperty(wndName, alvision.WindowPropertyFlags.WND_PROP_FULLSCREEN, alvision.WindowFlags.WINDOW_FULLSCREEN);
            alvision.setWindowProperty(wndName, alvision.WindowPropertyFlags.WND_PROP_ASPECT_RATIO, alvision.WindowFlags.WINDOW_FREERATIO);
        }

        while (this.isActive()) {
            const total_start = alvision.getTickCount();

            this.sources_[this.curSource_.valueOf()].next(frame);

            if (this.colorInput_)
                frame.copyTo(src);
            else
                alvision.cvtColor(frame, src,alvision.ColorConversionCodes. COLOR_BGR2GRAY);

            this.addGaussNoise(src, 20.0);

            if (this.useGpu_ && this.has_gpu)
                d_src.upload(src);

            const proc_start = alvision.getTickCount();

            if (this.useGpu_ && this.has_gpu) {
                if (this.colorInput_) {
                    alvision.cuda.fastNlMeansDenoisingColored(d_src, d_dst);
                }
                else {
                    alvision.cuda.fastNlMeansDenoising(d_src, d_dst);
                }
            }
            else {
                if (this.colorInput_)
                    alvision.fastNlMeansDenoisingColored(src, dst, 20, 10);
                else
                    alvision.fastNlMeansDenoising(src, dst, 20);
            }

            const proc_fps = alvision.getTickFrequency() / (alvision.getTickCount() - proc_start);

            if (this.useGpu_ && this.has_gpu)
                d_dst.download(dst);

            outImg.create(frame.rows(), frame.cols().valueOf() * 2,alvision.MatrixType. CV_8UC3);

            let left = outImg.roi(new alvision.Rect(0, 0, frame.cols(), frame.rows()));
            let right = outImg.roi(new alvision.Rect(frame.cols(), 0, frame.cols(), frame.rows()));

            if (this.colorInput_) {
                src.copyTo(left);
                dst.copyTo(right);
            }
            else {
                alvision.cvtColor(src, left, alvision.ColorConversionCodes. COLOR_GRAY2BGR);
                alvision.cvtColor(dst, right, alvision.ColorConversionCodes. COLOR_GRAY2BGR);
            }

            const total_fps = alvision.getTickFrequency() / (alvision.getTickCount() - total_start);

            this.displayState(outImg, proc_fps, total_fps);

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
                this.colorInput_ = !this.colorInput_;
                console.log("Switch mode to ", (this.colorInput_ ? "Color" : "Gray"));
                break;

            case 'N':
                if (this.sources_.length > 1) {
                    this.curSource_ = (this.curSource_.valueOf() + 1) % this.sources_.length;
                    this.sources_[this.curSource_.valueOf()].reset();
                    console.log("Switch source to ", this.curSource_);
                }
                break;
        }
    }
    protected printAppHelp(): void {
        console.log("This sample demonstrates Non-Local-Means Denoising algorithm ");

        console.log("Usage: demo_denoising [options] ");

        console.log("Launch Options: ");
        console.log("  --fullscreen ");
        console.log("       Launch in fullscreen mode ");
    }
    protected parseAppCmdArgs(i: number, argc: alvision.int, argv: string[]): number {
        let arg = argv[i];

        if (arg == "--fullscreen") {
            this.fullscreen_ = true;
            return i;
        }

        return i;
    }

    private displayState(outImg: alvision.Mat, proc_fps: alvision.double, total_fps: alvision.double): void {
        const  fontColorRed = alvision.CV_RGB(255, 0, 0);

        //ostringstream txt;
        //int i = 0;

        console.log("Source size: ", outImg.cols().valueOf() / 2, 'x', outImg.rows());
        //printText(outImg, txt.str(), i++);

        console.log(this.useGpu_ ? "Mode: CUDA" : "Mode: CPU");

        console.log("FPS (Denoising only): ", proc_fps);
        //printText(outImg, txt.str(), i++);

        console.log("FPS (total): ", total_fps);
        //printText(outImg, txt.str(), i++);

        console.log("Space - switch CUDA / CPU mode");
        console.log("C - switch Color / Gray mode");
        if (this.sources_.length > 1)
            console.log("N - switch source");
    }
    private addGaussNoise(image: alvision.Mat, sigma: alvision.double): void {
        this.noise_.create(image.size(), alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_32F, image.channels()));
        alvision.theRNG().fill(this.noise_,alvision.DistType.NORMAL, 0.0, sigma);

        alvision.addWeighted(image, 1.0, this.noise_, 1.0, 0.0, image, image.depth());
    }

    private useGpu_: boolean;
    private colorInput_: boolean;
    private curSource_: alvision.int;
    private fullscreen_: boolean;

    private noise_: alvision.Mat;
};



RUN_APP(new App());
