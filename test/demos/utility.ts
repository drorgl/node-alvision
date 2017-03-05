import * as alvision from "../../tsbinding/alvision";

export const opencv_extra = "../opencv_extra/";

////////////////////////////////////
// FrameSource

export class FrameSource {

    next(frame: alvision.Mat): boolean {
        return false;
    }

    reset(): void {

    }

    static image(fileName: string, flags: alvision.int = 1): FrameSource {
        return new ImageSource(fileName, flags);
    }
    static video(fileName: string): FrameSource {
        return new FFMPEGSource(fileName);
    }
    static camera(device: alvision.int, width: alvision.int = -1, height: alvision.int = -1): FrameSource {
        return new CameraSource(device, width, height);
    }
    static imagesPattern(pattern: string): FrameSource {
        return new ImagesPatternSource(pattern);
    }
};

export class PairFrameSource {
    next(frame0: alvision.Mat, frame1: alvision.Mat): void { }

    reset(): void { }

    static create_framesource(source0: FrameSource, source1: FrameSource): PairFrameSource {
        return new PairFrameSource_2(source0, source1);
    }
    static create_offset(source: FrameSource, offset: alvision.int): PairFrameSource {
        return new PairFrameSource_1(source, offset);
    }
};

////////////////////////////////////
// Auxiliary functions







export function THROW_EXCEPTION(msg) {
    //throw new Error(msg);
    console.error(msg);
}

////////////////////////////////////
// BaseApp

export class BaseApp {
    constructor() {
        this.frame_width_ = -1;
        this.frame_height_ = -1;
        this.device_ = 0;
        this.active_ = true;
    }

    run(argc: alvision.int, argv: string[]): void {
        for (let i = 1; i < argc; ++i) {
            i = this.parseAppCmdArgs(i, argc, argv);

            i = this.parseFrameSourcesCmdArgs(i, argc, argv);

            i = this.parseGpuDeviceCmdArgs(i, argc, argv);

            i = this.parseHelpCmdArg(i, argc, argv);

            //THROW_EXCEPTION("Unknown command line argument: " + argv[i]);
        }

        const num_devices = alvision.cuda.getCudaEnabledDeviceCount();
        if (num_devices <= 0) {
            this.has_gpu = false;
            THROW_EXCEPTION("No GPU found or the OpenCV library was compiled without CUDA support");
        }else{
            if (this.device_ < 0 || this.device_ >= num_devices)
                THROW_EXCEPTION("Incorrect device ID : " + this.device_);

            let dev_info = new alvision.cuda.DeviceInfo(this.device_);
            if (!dev_info.isCompatible())
                THROW_EXCEPTION("GPU module wasn't built for GPU #" + this.device_ + " " + dev_info.name() + ", CC " + dev_info.majorVersion() + '.' + dev_info.minorVersion());


            console.log("Initializing device... ");
            alvision.cuda.setDevice(this.device_);
            alvision.cuda.printShortCudaDeviceInfo(this.device_);
            this.has_gpu = true;
        } 


        this.runAppLogic();
    }

    isActive(): boolean { return this.active_; }
    wait(delay: alvision.int = 0): void {
        const key = alvision.waitKey(delay);
        if ((key.valueOf() & 0xff) == 27 /*escape*/) {
            this.active_ = false;
            return;
        }

        this.processAppKey(key);
    }

    protected runAppLogic(): void { }
    protected processAppKey(key: alvision.int): void {}
    protected printAppHelp(): void { }
    protected parseAppCmdArgs(i: number, argc: alvision.int, argv: string[]): number {
        return i;
    }

    protected sources_: Array<FrameSource> = [];
    protected has_gpu: boolean;

    private parseFrameSourcesCmdArgs(i: number, argc: alvision.int, argv: string[]): number {
        let arg = argv[i.valueOf()];

        if (arg == "--image") {
            ++i;

            if (i >= argc)
                THROW_EXCEPTION("Missing file name after " + arg);

            this.sources_.push(FrameSource.image(argv[i]));
        }
        else if (arg == "--video") {
            ++i;

            if (i >= argc)
                THROW_EXCEPTION("Missing file name after " + arg);

            this.sources_.push(FrameSource.video(argv[i]));
        }
        else if (arg == "--frame-width") {
            ++i;

            if (i >= argc)
                THROW_EXCEPTION("Missing value after " + arg);

            this.frame_width_ = parseInt(argv[i]);
        }
        else if (arg == "--frame-height") {
            ++i;

            if (i >= argc)
                THROW_EXCEPTION("Missing value after " + arg);

            this.frame_height_ = parseInt(argv[i]);
        }
        else if (arg == "--camera") {
            ++i;

            if (i >= argc)
                THROW_EXCEPTION("Missing value after " + arg);

            this.sources_.push(FrameSource.camera(parseInt(argv[i]), this.frame_width_, this.frame_height_));
        }

        return i;
    }
    private parseGpuDeviceCmdArgs(i: number, argc: alvision.int, argv: string[]): number {
        let arg = argv[i];

        if (arg == "--device") {
            ++i;

            if (i >= argc)
                THROW_EXCEPTION("Missing value after " + arg);

            this.device_ = parseInt(argv[i]);
        }

        return i;
    }
    private parseHelpCmdArg(i: number, argc: alvision.int, argv: string[]): number {
        let arg = argv[i];

        if (arg == "-h" || arg == "--help") {
            this.printHelp();
        }

        return i;
    }
    private printHelp(): void {
        this.printAppHelp();

        console.log("Source Options: ");
        console.log("  --image <img_path> ");
        console.log("       Image source path. ");
        console.log("  --video <video_path> ");
        console.log("       Video source path. ");
        console.log("  --camera <device_ID> ");
        console.log("       Camera device ID ");
        console.log("  --frame-width <camera_frame_width> ");
        console.log("       Camera frame width ");
        console.log("  --frame-height <camera_frame_height> ");
        console.log("       Camera frame height ");

        console.log("Device Options: ");
        console.log("  --device <device_id> ");
        console.log("       Device ID");
    }

    private device_: alvision.int;
    private frame_width_: alvision.int;
    private frame_height_: alvision.int;
    private active_: boolean;
};

export function RUN_APP(app: BaseApp) {
    try {
        app.run(process.argv.length, process.argv);
    } catch (e) {
        console.error("Error executing application", e, e.stack);
    }
}



////////////////////////////////////

class ImageSource extends FrameSource {
    constructor(fileName: string, flags: alvision.int = 1) {
        super();
        this.img_ = alvision.imread(fileName, <alvision.ImreadModes>flags);

        if (this.img_.empty())
            THROW_EXCEPTION("Can't open " + fileName + " image");
    }

    next(frame: alvision.Mat): boolean {
        //frame = img_;
        this.img_.copyTo(frame);
        return true;
    }

    reset(): void {

    }

    private img_: alvision.Mat;
};




class VideoSource extends FrameSource {
    constructor(fileName: string) {
        super();
        this.fileName_ = fileName;
        if (!this.vc_.open(fileName))
            THROW_EXCEPTION("Can't open " + fileName + " video");
    }

    next(frame: alvision.Mat): boolean {
        this.vc_.read(frame);

        if (frame.empty()) {
            this.reset();
            this.vc_.read(frame);
            return true;
        }
        return false;
    }


    reset(): void {
        this.vc_.release();
        this.vc_.open(this.fileName_);

    }

    protected fileName_: string;
    protected vc_: alvision.VideoCapture = new alvision.VideoCapture();
};


class FFMPEGSource extends FrameSource {
    constructor(fileName: string) {
        super();
        this.fileName_ = fileName;
        alvision.ffmpeg.OpenAsInput(fileName, null, null, (err, ffmi) => {
            if (err) {
                THROW_EXCEPTION("Can't open " + fileName + err);
                return;
            }
            this.ffm = ffmi;
            let streams = ffmi.GetStreams();
            this.ffstreams = {}
            console.log(streams);
            streams.forEach((item, idx) => {
                this.ffstreams[item.id] = item;
            });

        });
    }

    next(frame: alvision.Mat): boolean {
        while (this.ffm.ReadPacket(this.ffpacket)) {
            let stream = this.ffstreams[this.ffpacket.streamid];
            if (stream.mediatype == alvision.mediatype.video) {
                if (stream.width != frame.cols() || stream.height != frame.rows()) {
                    frame.create(stream.height, stream.width, alvision.MatrixType.CV_8UC3);
                }

                if (stream.Decode(this.ffpacket, stream, frame)) {
                    return true;
                }
            }
        }
        return false;
    }


    reset(): void {
        this.ffm.Close();
        this.ffm = null;
        this.ffpacket = null;
        this.ffstreams = {};

    }

    protected fileName_: string;
    protected ffm: alvision.ffmpeg;
    protected ffpacket: alvision.packet = new alvision.packet();
    protected ffstreams: { [id: string]: alvision.stream } ;
};


////////////////////////////////////
// CameraSource

class CameraSource extends FrameSource {
    constructor(device: alvision.int, width: alvision.int = -1, height: alvision.int = -1) {
        super();
        if (!this.vc_.open(device))
            THROW_EXCEPTION("Can't open camera with ID = " + device);

        if (width > 0)
            this.vc_.set(alvision.CAP_PROP_GENERIC.CAP_PROP_FRAME_WIDTH, width);

        if (height > 0)
            this.vc_.set(alvision.CAP_PROP_GENERIC.CAP_PROP_FRAME_HEIGHT, height);
    }

    next(frame: alvision.Mat): boolean {
        this.vc_.read(frame);
        return true;
    }

    reset(): void { }

    private vc_: alvision.VideoCapture;
};



////////////////////////////////////
// ImagesVideoSource

class ImagesPatternSource extends FrameSource {

    constructor(pattern: string) {
        super();
        this.pattern_ = pattern;
        if (!this.vc_.open(pattern))
            THROW_EXCEPTION("Can't open " + pattern + " pattern");
    }

    next(frame: alvision.Mat): boolean {
        if (!this.looped_) {
            this.vc_.read(frame);

            if (frame.empty()) {
                this.reset();
                this.vc_.read(frame);
            }
        }

        if (this.prev_ >= 1)
            this.looped_ = true;

        this.prev_ = this.vc_.get(alvision.CAP_PROP_GENERIC.CAP_PROP_POS_AVI_RATIO);

        return true;
    }

    reset(): void {
        this.vc_.release();
        this.vc_.open(this.pattern_);
    }


    private pattern_: string;
    private vc_: alvision.VideoCapture;
    private looped_: boolean;
    private prev_: alvision.double;
};



////////////////////////////////////
// PairFrameSource


class PairFrameSource_2 extends PairFrameSource {
    constructor(source0: FrameSource, source1: FrameSource) {
        super();
        this.source0_ = source0;
        this.source1_ = source1;
        alvision.CV_Assert(() => this.source0_ != null);
        alvision.CV_Assert(() => this.source1_ != null);
    }

    next(frame0: alvision.Mat, frame1: alvision.Mat): void {
        this.source0_.next(frame0);
        this.source1_.next(frame1);
    }

    reset(): void {
        this.source0_.reset();
        this.source1_.reset();
    }

    private source0_: FrameSource;
    private source1_: FrameSource;
};






class PairFrameSource_1 extends PairFrameSource {
    constructor(source: FrameSource, offset: alvision.int) {
        super();
        this.source_ = this.source_;
        this.offset_ = offset;
        alvision.CV_Assert(() => this.source_ != null);

        this.reset();
    }

    next(frame0: alvision.Mat, frame1: alvision.Mat): void {
        this.source_.next(frame1);
        this.frames_.push(frame1.clone());
        let deq = this.frames_.shift();
        deq.copyTo(frame0);
    }

    reset(): void {
        this.source_.reset();

        this.frames_.length = 0;
        let temp = new alvision.Mat();
        for (let i = 0; i < this.offset_; ++i) {
            this.source_.next(temp);
            this.frames_.push(temp.clone());
        }
    }


    protected source_: FrameSource;
    protected offset_: alvision.int;
    protected frames_: Array<alvision.Mat>;
};




////////////////////////////////////
// Auxiliary functions

export function makeGray(src: alvision.InputArray, dst: alvision.OutputArray): void {
    const scn = (<any>src).channels();

    alvision.CV_DbgAssert(() => scn == 1 || scn == 3 || scn == 4);

    if (src.kind() == alvision.IOArrayKind.CUDA_GPU_MAT) {
        if (scn == 1)
            dst.setTo(src.getGpuMat());
        else if (scn == 3)
            alvision.cuda.cvtColor(src.getGpuMat(), dst.getGpuMatRef(), alvision.ColorConversionCodes.COLOR_BGR2GRAY);
        else
            alvision.cuda.cvtColor(src.getGpuMat(), dst.getGpuMatRef(), alvision.ColorConversionCodes.COLOR_BGRA2GRAY);
    }
    else {
        if (scn == 1)
            dst.setTo(src.getMat());
        else if (scn == 3)
            alvision.cvtColor(src, dst, alvision.ColorConversionCodes.COLOR_BGR2GRAY);
        else
            alvision.cvtColor(src, dst, alvision.ColorConversionCodes.COLOR_BGRA2GRAY);
    }
}

export function printText(img: alvision.Mat, msg: string, lineOffsY: alvision.int, fontColor: alvision.Scalar = alvision.CV_RGB(118, 185, 0), fontScale: alvision.double = 0.5): void {
    const fontFace = alvision.HersheyFonts.FONT_HERSHEY_DUPLEX;
    const fontThickness = 1;

    const fontSize = alvision.getTextSize("T[]", fontFace, fontScale, fontThickness, null);

    let org = new alvision.Point();
    org.x = 1;
    org.y = 3 * fontSize.height.valueOf() * (lineOffsY.valueOf() + 1) / 2;

    alvision.putText(img, msg, org, fontFace, fontScale, new alvision.Scalar(0, 0, 0, 255), 5 * fontThickness / 2, 16);
    alvision.putText(img, msg, org, fontFace, fontScale, fontColor, fontThickness, 16);
}

    ////////////////////////////////////
    // BaseApp




