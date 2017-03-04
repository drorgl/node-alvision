import * as alvision from "../../tsbinding/alvision";
import { BaseApp, RUN_APP, FrameSource, opencv_extra, makeGray } from "./utility";
import path = require('path')

const base_path = "gpu_demos_pack/demos/denoising";



enum Method
{
    HAAR,
    LBP,
    METHOD_MAX
};

const method_str =
[
    "HAAR",
    "LBP"
];

class App extends BaseApp
{
    constructor() {
        super();
        this.haarCascadeName_ = "data/face_detection_haar.xml";
        this.lbpCascadeName_ = "data/face_detection_lbp.xml";

        this.method_ = Method. HAAR;
        this.useGpu_ = true;
        this.curSource_ = 0;
        this.fullscreen_ = false;
        this.reloadCascade_ = true;
    }


    protected runAppLogic(): void {
        if (this.sources_.length == 0) {
            console.log("Using default frames source... ");
            this.sources_.push(FrameSource.video("data/face_detection.avi"));
        }

        let cascade_cpu: alvision.CascadeClassifier;
        let cascade_gpu: alvision.cuda.CascadeClassifier;

        let frame_cpu = new alvision.Mat(), gray_cpu = new alvision.Mat(), outImg = new alvision.Mat ();
        let frame_gpu: alvision.cuda.GpuMat, gray_gpu: alvision.cuda.GpuMat, facesBuf_gpu: alvision.cuda.GpuMat;
        if (this.has_gpu) {
            frame_gpu    = new  alvision.cuda.GpuMat();
            gray_gpu     = new  alvision.cuda.GpuMat();
            facesBuf_gpu = new  alvision.cuda.GpuMat();
        }

        let faces = new Array<alvision.Rect>();

        const wndName = "Face Detection Demo";

        if (this.fullscreen_) {
            alvision.namedWindow(wndName, alvision.WindowFlags.WINDOW_NORMAL);
            alvision.setWindowProperty(wndName, alvision.WindowPropertyFlags.WND_PROP_FULLSCREEN, alvision.WindowFlags.WINDOW_FULLSCREEN);
            alvision.setWindowProperty(wndName, alvision.WindowPropertyFlags.WND_PROP_ASPECT_RATIO, alvision.WindowFlags.WINDOW_FREERATIO);
        }

        while (this.isActive()) {
            if (this.reloadCascade_) {
                const cascadeName = this.method_ == Method.HAAR ? this.haarCascadeName_ : this.lbpCascadeName_;
                cascade_gpu  = alvision.cuda.CascadeClassifier.create(cascadeName);
                cascade_cpu = new alvision.CascadeClassifier(cascadeName);
                this.reloadCascade_ = false;
            }

            const  total_start =alvision. getTickCount();

            this.sources_[this.curSource_.valueOf()].next(frame_cpu);

            let proc_fps = 0.0;

            if (this.useGpu_ && this.has_gpu) {
                frame_gpu.upload(frame_cpu);
                makeGray(frame_gpu, gray_gpu);

                //cascade_gpu .visualizeInPlace = false;
                cascade_gpu.setFindLargestObject(false);// .findLargestObject = false;

                const proc_start = alvision.getTickCount();

                cascade_gpu.setScaleFactor(1.2);
                cascade_gpu.setMinNeighbors(4);

                const detections_num = cascade_gpu.detectMultiScale(gray_gpu, facesBuf_gpu);

                proc_fps = alvision.getTickFrequency() / (alvision.getTickCount() - proc_start);

                //if (detections_num == 0)
                //    faces.length = 0;
                //else {
                //    faces.length = detections_num;
                //    let facesMat = new alvision.Mat (1, detections_num,/* DataType<Rect>::type,*/ faces);
                //    facesBuf_gpu.colRange(0, detections_num).download(facesMat);
                //}
            }
            else {
                makeGray(frame_cpu, gray_cpu);

                const minSize = cascade_gpu.getClassifierSize();

                const proc_start = alvision.getTickCount();

                cascade_cpu.detectMultiScale(gray_cpu, (objs) => faces = objs, 1.2, 4, alvision.HAAR_FLAGS.SCALE_IMAGE, minSize);

                proc_fps = alvision.getTickFrequency() / (alvision.getTickCount() - proc_start);
            }

            frame_cpu.copyTo(outImg);

            for (let i = 0; i < faces.length; i++)
            alvision.rectangle(outImg, faces[i], alvision.CV_RGB(0, 255, 0), 3);

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
                console.log("Switch mode to " , (this.useGpu_ ? "CUDA" : "CPU"));
                break;

            case 'M':
                this.method_ = ((this.method_ + 1) % Method.METHOD_MAX);
                this.reloadCascade_ = true;
                console.log("Switch method to ", method_str[this.method_.valueOf()]);
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
        console.log("This sample demonstrates different Face Detection algorithms ");

        console.log("Usage: demo_face_detection [options] ");

        console.log("Launch Options: ");
        console.log("  --fullscreen ");
        console.log("       Launch in fullscreen mode ");
    }
    protected parseAppCmdArgs(i: number, argc: alvision.int, argv: string[]): number {
        let arg =argv[i];

        if (arg == "--fullscreen") {
            this.fullscreen_ = true;
            return i;
        }

        return i;
    }


    private displayState(outImg: alvision.Mat, proc_fps: alvision.double, total_fps: alvision.double): void {
        const fontColorRed = alvision.CV_RGB(255, 0, 0);


        console.log("Source size: " , outImg.cols() , 'x' , outImg.rows());
        

        console.log("Method: ", method_str[this.method_.valueOf()], (this.useGpu_ ? " CUDA" : " CPU"));

        console.log("FPS (FD only): ", proc_fps);

        console.log("FPS (total): ", total_fps);

        console.log("Space - switch CUDA / CPU mode");
        console.log("M - switch method");
        if (this.sources_.length > 1)
            console.log("N - switch source");
    }

    private haarCascadeName_: string;
    private lbpCascadeName_: string;

    private method_: Method;
    private useGpu_: boolean;
    private curSource_ : alvision.int
    private fullscreen_: boolean;
    private reloadCascade_: boolean;
};



RUN_APP(new App());
