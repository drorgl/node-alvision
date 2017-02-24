
////#ifndef HAVE_OPENCV_NONFREE
////#error "Non free module is required"
////#else

//import * as alvision from "../../tsbinding/alvision";
//import { BaseApp, RUN_APP, FrameSource, opencv_extra } from "./utility";
//import path = require('path')

//const base_path = "gpu_demos_pack/demos/denoising";



//class FeatureObject
//{
//    public name: string;

//    public imgColor: alvision.Mat;
//    public imgGray: alvision.Mat;
//    public d_imgGray: alvision.cuda.GpuMat;

//    public color: alvision.Scalar;

//    public keypoints: Array<alvision.KeyPoint>;

//    public descriptors: alvision.Mat;
//    public d_descriptors: alvision.cuda.GpuMat;

//    constructor(name_: string, imgColor_: alvision.Mat, color_: alvision.Scalar ) {
        
//        this.name = name_;
//        this.imgColor = imgColor_;
//        this.color = color_;
//        alvision.cvtColor(this.imgColor, this.imgGray,alvision.ColorConversionCodes. COLOR_BGR2GRAY);
//        this.d_imgGray.upload(this.imgGray);
//    }
//};

//class App extends BaseApp
//{
//    constructor() {
//        super();
//        this.gpu_surf_ = (500);
//        this.cpu_surf_ = (500);
//        this.cpu_matcher_ = (alvision.NormTypes.NORM_L2);
//        this.gpu_matcher_ = (alvision.NormTypes.NORM_L2);
//        this.useGpu_ = true;
//        this.showCorrespondences_ = true;
//        this.curSource_ = 0;
//        this.fullscreen_ = true;

//    }


//    protected runAppLogic(): void {
//        if (this.objects_.length == 0) {
//            console.log("Loading default objects... ");

//            this.objects_.push(new FeatureObject("opengl", alvision.imread("data/features2d_opengl.jpg"), alvision.CV_RGB(0, 255, 0)));
//            this.objects_.push(new FeatureObject("java",   alvision.imread("data/features2d_java.jpg"),   alvision.CV_RGB(255, 0, 0)));
//            this.objects_.push(new FeatureObject("qt4",    alvision.imread("data/features2d_qt4.jpg"),    alvision.CV_RGB(0, 0, 255)));
//        }

//        if (this.sources_.length == 0) {
//            console.log("Loading default frames source... ");

//            this.sources_.push(FrameSource.image("data/features2d_1.jpg"));
//            this.sources_.push(FrameSource.image("data/features2d_2.jpg"));
//            this.sources_.push(FrameSource.image("data/features2d_3.jpg"));
//            this.sources_.push(FrameSource.image("data/features2d_4.jpg"));
//            this.sources_.push(FrameSource.image("data/features2d_5.jpg"));
//            this.sources_.push(FrameSource.image("data/features2d_6.jpg"));
//            this.sources_.push(FrameSource.image("data/features2d_7.jpg"));
//        }

//        let frame = new alvision.Mat(), frameGray = new alvision.Mat(), outImg = new alvision.Mat(), frameDescriptors = new alvision.Mat();
//        let d_frameGray: alvision.cuda.GpuMat, d_frameDescriptors: alvision.cuda.GpuMat;
//        if (this.has_gpu) {
//            d_frameGray = new alvision.cuda.GpuMat();
//            d_frameDescriptors = new alvision.cuda.GpuMat();
//        }

//        let frameKeypoints = new Array<alvision.KeyPoint>();

//        let matches = new Array<Array<alvision.DMatch>> (this.objects_.length);

//        const wndName = "Features2D Demo";

//        if (this.fullscreen_) {
//            alvision.namedWindow(wndName, alvision.WindowFlags.WINDOW_NORMAL);
//            alvision.setWindowProperty(wndName, alvision.WindowPropertyFlags.WND_PROP_FULLSCREEN, alvision.WindowFlags.WINDOW_FULLSCREEN);
//            alvision.setWindowProperty(wndName, alvision.WindowPropertyFlags.WND_PROP_ASPECT_RATIO, alvision.WindowFlags.WINDOW_FREERATIO);
//        }

//        while (this.isActive()) {
//            const total_start = alvision.getTickCount();

//            this.sources_[this.curSource_.valueOf()].next(frame);

//            alvision.cvtColor(frame, frameGray,alvision.ColorConversionCodes. COLOR_BGR2GRAY);
//            d_frameGray.upload(frameGray);

//            const detect_start = alvision.getTickCount();
//            {
//                for (let i = 0; i < this.objects_.length; ++i)
//                this.calcKeypoints(this.objects_[i].imgGray, this.objects_[i].d_imgGray, this.objects_[i].keypoints, this.objects_[i].descriptors, this.objects_[i].d_descriptors);

//                this.calcKeypoints(frameGray, d_frameGray, frameKeypoints, frameDescriptors, d_frameDescriptors);
//            }
//            const detect_fps = alvision.getTickFrequency() / (alvision.getTickCount() - detect_start);

//            const match_start = alvision.getTickCount();
//            {
//                for (let i = 0; i < this.objects_.length; ++i)
//                this.match(this.objects_[i].descriptors, this.objects_[i].d_descriptors, frameDescriptors, d_frameDescriptors, matches[i]);
//            }
//            const match_fps = alvision.getTickFrequency() / (alvision.getTickCount() - match_start);

//            const offset = 350;
////
////            let outSize = frame.size();
////            let max_height = 0;
////            let sum_width = offset;
////            for (let i = 0; i < this.objects_.length; ++i)
////            {
////                sum_width += this.objects_[i].imgColor.cols;
////                max_height = Math.max(max_height, objects_[i].imgColor.rows);
////            }
////            outSize.height += max_height;
////            outSize.width = std::max(outSize.width, sum_width);
////
////            outImg.create(outSize,alvision.MatrixType. CV_8UC3);
////            outImg.setTo(0);
////            frame.copyTo(outImg.roi(new alvision.Rect(0, max_height, frame.cols, frame.rows)));
////
////            let objX = offset;
////            for (let i = 0; i < this.objects_.length; ++i)
////            {
////                objects_[i].imgColor.copyTo(outImg.roi(new alvision.Rect(objX, 0, objects_[i].imgColor.cols, objects_[i].imgColor.rows)));
////
////                alvision.putText(outImg, objects_[i].name, Point(objX, 15), FONT_HERSHEY_DUPLEX, 0.8, objects_[i].color);
////
////                if (matches[i].size() >= 10)
////                {
////                    static vector<Point2f> pt1;
////                    static vector<Point2f> pt2;
////
////                    pt1.resize(matches[i].size());
////                    pt2.resize(matches[i].size());
////
////                    for(let j = 0; j < matches[i].size(); ++j)
////                {
////                    DMatch m = matches[i][j];
////
////                    KeyPoint objKp = objects_[i].keypoints[m.queryIdx];
////                    KeyPoint frameKp = frameKeypoints[m.trainIdx];
////
////                    pt1[j] = objKp.pt;
////                    pt2[j] = frameKp.pt;
////
////                    if (showCorrespondences_) {
////                        Point objCenter(cvRound(objKp.pt.x) + objX, cvRound(objKp.pt.y));
////                        Point frameCenter(cvRound(frameKp.pt.x), cvRound(frameKp.pt.y) + max_height);
////
////                        circle(outImg, objCenter, 3, objects_[i].color);
////                        circle(outImg, frameCenter, 3, objects_[i].color);
////                        line(outImg, objCenter, frameCenter, objects_[i].color);
////                    }
////                }
////
////                let H = alvision.findHomography(pt1, pt2, RANSAC);
////
////                if (H.empty())
////                    continue;
////
////                let src_corners =
////                    [
////                        new alvision.Point(0, 0),
////                        new alvision.Point(this.objects_[i].imgColor.cols, 0),
////                        new alvision.Point(this.objects_[i].imgColor.cols, this.objects_[i].imgColor.rows),
////                        new alvision.Point(0, this.objects_[i].imgColor.rows)
////                    ];
////                let dst_corners = new Array <alvision. Point >(5);
////
////                for (let j = 0; j < 4; ++j)
////                {
////                    let x = src_corners[j].x;
////                    let y = src_corners[j].y;
////
////                    let Z = 1.0 / (H.at<double>(2, 0) * x + H.at<double>(2, 1) * y + H.at<double>(2, 2));
////                    let X = (H.at<double>(0, 0) * x + H.at<double>(0, 1) * y + H.at<double>(0, 2)) * Z;
////                    let Y = (H.at<double>(1, 0) * x + H.at<double>(1, 1) * y + H.at<double>(1, 2)) * Z;
////
////                    dst_corners[j] = new alvision.Point(Math.round(X), Math.round(Y));
////                }
////
////                for (let j = 0; j < 4; ++j)
////                {
////                    Point r1 = dst_corners[j % 4];
////                    Point r2 = dst_corners[(j + 1) % 4];
////
////                    alvision.line(outImg, new alvision.Point(r1.x, r1.y + max_height),new alvision. Point(r2.x, r2.y + max_height), objects_[i].color, 3);
////                }
////
////                alvision.putText(outImg, objects_[i].name, Point(dst_corners[0].x, dst_corners[0].y + max_height), FONT_HERSHEY_DUPLEX, 0.8, objects_[i].color);
////                            }
////
////                objX += objects_[i].imgColor.cols;
////                        }
////
////                let total_fps = alvision.getTickFrequency() / (alvision.getTickCount() - total_start);
////
////                this.displayState(outImg, frame.size(), detect_fps, match_fps, total_fps);
////
////                alvision.imshow(wndName, outImg);
////
////                this.wait(30);
//        }
//    }
//    protected processAppKey(key: alvision.int): void {
//        switch (String.fromCharCode(key.valueOf() & 0xff).toUpperCase()) {
//            case ' ' /*space*/:
//                this.useGpu_ = !this.useGpu_;
//                console.log("Switch mode to ", (this.useGpu_ ? "CUDA" : "CPU"));
//                break;

//            case 'S':
//                this.showCorrespondences_ = !this.showCorrespondences_;
//                if (this.showCorrespondences_)
//                    console.log("Show correspondences");
//                else
//                    console.log("Hide correspondences");
//                break;

//            case 'N':
//                if (this.sources_.length > 1) {
//                    this.curSource_ = (this.curSource_.valueOf() + 1) % this.sources_.length;
//                    this.sources_[this.curSource_.valueOf()] .reset();
//                    console.log("Switch source to " , this.curSource_);
//                }
//                break;
//        }
//    }
//    protected printAppHelp(): void {
//        console.log("This sample demonstrates Object Detection via keypoints matching ");

//        console.log("Usage: demo_features2d [options] ");

//        console.log("Demo Options: ");
//        console.log("  --object <path to image> ");
//        console.log("       Object image ");

//        console.log("Launch Options: ");
//        console.log("  --windowed ");
//        console.log("       Launch in windowed mode");
//    }
//    protected parseAppCmdArgs(i: number, argc: alvision.int, argv: string[]): number {
//        let arg = argv[i];

//        if (arg == "--object") {
//            ++i;

//            if (i >= argc)
//                THROW_EXCEPTION("Missing file name after " << arg);

//            let rng = alvision.theRNG();
//            this.objects_.push(new FeatureObject(argv[i], alvision.imread(argv[i]), alvision.CV_RGB(rng.uniform(0, 255), rng.uniform(0, 255), rng.uniform(0, 255))));
//        }
//        else if (arg == "--windowed") {
//            this.fullscreen_ = false;
//            return i + 1;
//        }
//        else
//            return i;

//        return i + 1;
//    }


//    private calcKeypoints(img: alvision.Mat, d_img: alvision.cuda.GpuMat, keypoints: Array<alvision.KeyPoint>, descriptors: alvision.Mat, d_descriptors: alvision.cuda.GpuMat): void {
//        keypoints.length = 0;

//        if (this/useGpu_)
//            gpu_surf_(d_img, new alvision.cuda.GpuMat(), keypoints, d_descriptors);
//        else
//            cpu_surf_(img, noArray(), keypoints, descriptors);
//    }

//    private match(descriptors1: alvision.Mat, d_descriptors1: alvision.cuda.GpuMat ,
//        descriptors2: alvision.Mat, d_descriptors2: alvision.cuda.GpuMat  ,
//        matches: Array<alvision.DMatch>): void {
//        matches.length =0;

//        if (this.useGpu_) {
//            this.gpu_matcher_.knnMatchSingle(d_descriptors1, d_descriptors2, this.trainIdx_, this.distance_, this.allDist_, 2);
//            this.gpu_matcher_.knnMatchDownload(this.trainIdx_, this.distance_, this.matchesTbl_);
//        }
//        else {
//            this.cpu_matcher_.knnMatch(descriptors1, descriptors2, this.matchesTbl_, 2);
//        }

//        for (let i = 0; i < this.matchesTbl_.length; ++i)
//        {
//            if (this.matchesTbl_[i].length != 2)
//                continue;

//            let m1 = this.matchesTbl_[i][0];
//            let m2 = this.matchesTbl_[i][1];

//            if (m1.distance < 0.55 * m2.distance.valueOf())
//                matches.push(m1);
//        }

//        if (this.useGpu_)
//            sort(matches.begin(), matches.end(), DMatchCmp());
//    }

//    private displayState(outImg: alvision.Mat, size: alvision.Size, detect_fps: alvision.double, match_fps: alvision.double, total_fps: alvision.double): void {
//        const  fontColorRed = alvision.CV_RGB(255, 0, 0);

        
//        console.log("Source size: ");

//        console.log(this.useGpu_ ? "Mode: CUDA" : "Mode: CPU");

//        console.log("FPS (Detect only): ", detect_fps);

//        console.log("FPS (Match only): ", match_fps);

//        console.log("FPS (Total): ", total_fps);

//        console.log("Space - switch CUDA / CPU mode");
//        console.log("S - show / hide correspondences");
//        if (this.sources_.length > 1)
//            console.log("N - switch source");
//    }

//    private objects_: Array<FeatureObject>;

//    private useGpu_: boolean;
//    private showCorrespondences_: boolean;
//    private curSource_: alvision.int;
//    private fullscreen_: boolean;

//    private cpu_surf_: alvision.SURF;
//    private gpu_surf_: alvision.SURF_GPU;

//    private cpu_matcher_: alvision.BFMatcher;
//    private gpu_matcher_: alvision.BFMatcher_GPU;
//    private trainIdx_: alvision.cuda.GpuMat, distance_: alvision.cuda.GpuMat, allDist_: alvision.cuda.GpuMat;

//    private matchesTbl_: Array<Array<alvision.DMatch>>;
//};


//class DMatchCmp
//{
//    run(m1: alvision.DMatch, m2: alvision.DMatch) : boolean
//    {
//        return m1.distance < m2.distance;
//    }
//};





//RUN_APP(new App());

////#endif
