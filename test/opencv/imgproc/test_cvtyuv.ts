import tape = require("tape");
import path = require("path");
import colors = require("colors");
import async = require("async");
import alvision = require("../../../tsbinding/alvision");
import util = require('util');
import fs = require('fs');

//#include "test_precomp.hpp"
//
//using namespace cv;
//using namespace std;
//
//#undef RGB
//#undef YUV
//
//typedef Vec3b YUV;
interface YUV extends alvision.Vecb { }
interface RGB extends alvision.Vecb { }
//let YUV = alvision.Vecb;
//typedef Vec3b RGB;

function countOfDifferencies(gold: alvision.Mat, result: alvision.Mat, maxAllowedDifference: alvision.int  = 1): alvision.int 
{
    let diff = new alvision.Mat();
    alvision.absdiff(gold, result, diff);
    return alvision.countNonZero(alvision.MatExpr.op_GreaterThan(diff.reshape(1), maxAllowedDifference));
}

abstract class YUVreader
{
    abstract read(yuv: alvision.Mat, row: alvision.int, col: alvision.int): YUV;
    abstract channels(): alvision.int;
    abstract size(imgSize: alvision.Size): alvision.Size;

    requiresEvenHeight() : boolean { return true; }
    requiresEvenWidth() : boolean { return true; }

    static getReader(code: alvision.int): YUVreader {
        switch (code) {
            case alvision.ColorConversionCodes.COLOR_YUV2RGB_NV12:
            case alvision.ColorConversionCodes.COLOR_YUV2BGR_NV12:
            case alvision.ColorConversionCodes.COLOR_YUV2RGBA_NV12:
            case alvision.ColorConversionCodes.COLOR_YUV2BGRA_NV12:
                return new NV12Reader();
            case alvision.ColorConversionCodes.COLOR_YUV2RGB_NV21:
            case alvision.ColorConversionCodes.COLOR_YUV2BGR_NV21:
            case alvision.ColorConversionCodes.COLOR_YUV2RGBA_NV21:
            case alvision.ColorConversionCodes.COLOR_YUV2BGRA_NV21:
                return new NV21Reader();
            case alvision.ColorConversionCodes.COLOR_YUV2RGB_YV12:
            case alvision.ColorConversionCodes.COLOR_YUV2BGR_YV12:
            case alvision.ColorConversionCodes.COLOR_YUV2RGBA_YV12:
            case alvision.ColorConversionCodes.COLOR_YUV2BGRA_YV12:
                return new YV12Reader();
            case alvision.ColorConversionCodes.COLOR_YUV2RGB_IYUV:
            case alvision.ColorConversionCodes.COLOR_YUV2BGR_IYUV:
            case alvision.ColorConversionCodes.COLOR_YUV2RGBA_IYUV:
            case alvision.ColorConversionCodes.COLOR_YUV2BGRA_IYUV:
                return new IYUVReader();
            case alvision.ColorConversionCodes.COLOR_YUV2RGB_UYVY:
            case alvision.ColorConversionCodes.COLOR_YUV2BGR_UYVY:
            case alvision.ColorConversionCodes.COLOR_YUV2RGBA_UYVY:
            case alvision.ColorConversionCodes.COLOR_YUV2BGRA_UYVY:
                return new UYVYReader();
            //case CV_YUV2RGB_VYUY = 109,
            //case CV_YUV2BGR_VYUY = 110,
            //case CV_YUV2RGBA_VYUY = 113,
            //case CV_YUV2BGRA_VYUY = 114,
            //    return ??
            case alvision.ColorConversionCodes.COLOR_YUV2RGB_YUY2:
            case alvision.ColorConversionCodes.COLOR_YUV2BGR_YUY2:
            case alvision.ColorConversionCodes.COLOR_YUV2RGBA_YUY2:
            case alvision.ColorConversionCodes.COLOR_YUV2BGRA_YUY2:
                return new YUY2Reader();
            case alvision.ColorConversionCodes.COLOR_YUV2RGB_YVYU:
            case alvision.ColorConversionCodes.COLOR_YUV2BGR_YVYU:
            case alvision.ColorConversionCodes.COLOR_YUV2RGBA_YVYU:
            case alvision.ColorConversionCodes.COLOR_YUV2BGRA_YVYU:
                return new YVYUReader();
            case alvision.ColorConversionCodes.COLOR_YUV2GRAY_420:
                return new NV21Reader();
            case alvision.ColorConversionCodes.COLOR_YUV2GRAY_UYVY:
                return new UYVYReader();
            case alvision.ColorConversionCodes.COLOR_YUV2GRAY_YUY2:
                return new YUY2Reader();
            case alvision.ColorConversionCodes.COLOR_YUV2BGR:
            case alvision.ColorConversionCodes.COLOR_YUV2RGB:
                return new YUV888Reader();
            default:
                return null;
        }
    }
};

abstract class RGBreader
{
    abstract read(rgb: alvision.Mat, row: alvision.int, col: alvision.int ): RGB;
    abstract channels(): alvision.int;

    static getReader(code: alvision.int): RGBreader {
        switch (code) {
            case alvision.ColorConversionCodes.COLOR_RGB2YUV_YV12:
            case alvision.ColorConversionCodes.COLOR_RGB2YUV_I420:
                return new RGB888Reader();
            case alvision.ColorConversionCodes.COLOR_BGR2YUV_YV12:
            case alvision.ColorConversionCodes.COLOR_BGR2YUV_I420:
                return new BGR888Reader();
            case alvision.ColorConversionCodes.COLOR_RGBA2YUV_I420:
            case alvision.ColorConversionCodes.COLOR_RGBA2YUV_YV12:
                return new RGBA8888Reader();
            case alvision.ColorConversionCodes.COLOR_BGRA2YUV_YV12:
            case alvision.ColorConversionCodes.COLOR_BGRA2YUV_I420:
                return new BGRA8888Reader();
            default:
                return null;
        };
    }
};

abstract class RGBwriter
{
    abstract write(rgb: alvision.Mat, row: alvision.int, col: alvision.int, val: RGB): void;
    abstract channels(): alvision.int;

    static getWriter(code: alvision.int): RGBwriter {
        switch (code) {
            case alvision.ColorConversionCodes.COLOR_YUV2RGB_NV12:
            case alvision.ColorConversionCodes.COLOR_YUV2RGB_NV21:
            case alvision.ColorConversionCodes.COLOR_YUV2RGB_YV12:
            case alvision.ColorConversionCodes.COLOR_YUV2RGB_IYUV:
            case alvision.ColorConversionCodes.COLOR_YUV2RGB_UYVY:
            //case CV_YUV2RGB_VYUY:
            case alvision.ColorConversionCodes.COLOR_YUV2RGB_YUY2:
            case alvision.ColorConversionCodes.COLOR_YUV2RGB_YVYU:
            case alvision.ColorConversionCodes.COLOR_YUV2RGB:
                return new RGB888Writer();
            case alvision.ColorConversionCodes.COLOR_YUV2BGR_NV12:
            case alvision.ColorConversionCodes.COLOR_YUV2BGR_NV21:
            case alvision.ColorConversionCodes.COLOR_YUV2BGR_YV12:
            case alvision.ColorConversionCodes.COLOR_YUV2BGR_IYUV:
            case alvision.ColorConversionCodes.COLOR_YUV2BGR_UYVY:
            //case CV_YUV2BGR_VYUY:
            case alvision.ColorConversionCodes.COLOR_YUV2BGR_YUY2:
            case alvision.ColorConversionCodes.COLOR_YUV2BGR_YVYU:
            case alvision.ColorConversionCodes.COLOR_YUV2BGR:
                return new BGR888Writer();
            case alvision.ColorConversionCodes.COLOR_YUV2RGBA_NV12:
            case alvision.ColorConversionCodes.COLOR_YUV2RGBA_NV21:
            case alvision.ColorConversionCodes.COLOR_YUV2RGBA_YV12:
            case alvision.ColorConversionCodes.COLOR_YUV2RGBA_IYUV:
            case alvision.ColorConversionCodes.COLOR_YUV2RGBA_UYVY:
            //case CV_YUV2RGBA_VYUY:
            case alvision.ColorConversionCodes.COLOR_YUV2RGBA_YUY2:
            case alvision.ColorConversionCodes.COLOR_YUV2RGBA_YVYU:
                return new RGBA8888Writer();
            case alvision.ColorConversionCodes.COLOR_YUV2BGRA_NV12:
            case alvision.ColorConversionCodes.COLOR_YUV2BGRA_NV21:
            case alvision.ColorConversionCodes.COLOR_YUV2BGRA_YV12:
            case alvision.ColorConversionCodes.COLOR_YUV2BGRA_IYUV:
            case alvision.ColorConversionCodes.COLOR_YUV2BGRA_UYVY:
            //case CV_YUV2BGRA_VYUY:
            case alvision.ColorConversionCodes.COLOR_YUV2BGRA_YUY2:
            case alvision.ColorConversionCodes.COLOR_YUV2BGRA_YVYU:
                return new BGRA8888Writer();
            default:
                return null;
        };
    }
};

class GRAYwriter
{
////public:
//    virtual ~GRAYwriter() {}

    write(gray: alvision.Mat, row: alvision.int, col: alvision.int, val: alvision.uchar ) : void
    {
        gray.at<alvision.uchar>("uchar", row, col).set(val);
    }

    channels(): alvision.int  { return 1; }

    static getWriter(code: alvision.int): GRAYwriter {
        switch (code) {
            case alvision.ColorConversionCodes.COLOR_YUV2GRAY_420:
            case alvision.ColorConversionCodes.COLOR_YUV2GRAY_UYVY:
            case alvision.ColorConversionCodes.COLOR_YUV2GRAY_YUY2:
                return new GRAYwriter();
            default:
                return null;
        }
    }
};

abstract class YUVwriter
{
    abstract write(yuv: alvision.Mat, row: alvision.int, col: alvision.int, val: YUV): void;
    abstract channels(): alvision.int;
    abstract size(imgSize: alvision.Size): alvision.Size;

    requiresEvenHeight(): boolean { return true; }
    requiresEvenWidth() : boolean{ return true; }

    static getWriter(code: alvision.int): YUVwriter {
        switch (code) {
            case alvision.ColorConversionCodes.COLOR_RGB2YUV_YV12:
            case alvision.ColorConversionCodes.COLOR_BGR2YUV_YV12:
            case alvision.ColorConversionCodes.COLOR_RGBA2YUV_YV12:
            case alvision.ColorConversionCodes.COLOR_BGRA2YUV_YV12:
                return new YV12Writer();
            case alvision.ColorConversionCodes.COLOR_RGB2YUV_I420:
            case alvision.ColorConversionCodes.COLOR_BGR2YUV_I420:
            case alvision.ColorConversionCodes.COLOR_RGBA2YUV_I420:
            case alvision.ColorConversionCodes.COLOR_BGRA2YUV_I420:
                return new I420Writer();
            default:
                return null;
        };
    }
};

class RGB888Writer extends RGBwriter
{
    write(rgb: alvision.Mat, row: alvision.int, col: alvision.int, val: RGB) : void
    {
        rgb.at<alvision.Vecb>("Vec3b", row, col).set(val);
    }

    channels(): alvision.int { return 3; }
};

class BGR888Writer extends RGBwriter
{
    write(rgb: alvision.Mat, row: alvision.int, col: alvision.int, val: RGB ): void 
    {
        let tmp = new alvision.Vecb(val[2], val[1], val[0]);
        rgb.at<alvision.Vecb>("Vec3b", row, col).set(tmp);
    }

    channels(): alvision.int { return 3; }
};

class RGBA8888Writer extends RGBwriter
{
    write(rgb: alvision.Mat, row: alvision.int, col: alvision.int, val: RGB ): void 
    {
        let tmp = new alvision.Vecb (val[0], val[1], val[2], 255);
        rgb.at<alvision.Vecb>("Vec4b", row, col).set(tmp);
    }

    channels(): alvision.int  { return 4; }
};

class BGRA8888Writer extends RGBwriter
{
    write(rgb: alvision.Mat, row: alvision.int, col: alvision.int, val: RGB ): void 
    {
        let tmp = new alvision.Vecb (val[2], val[1], val[0], 255);
        rgb.at<alvision.Vecb>("Vec4b", row, col).set(tmp);
    }

    channels() : alvision.int { return 4; }
};

abstract class YUV420pWriter extends  YUVwriter
{
    channels(): alvision.int { return 1; }
    size(imgSize: alvision.Size ): alvision.Size { return new alvision.Size(imgSize.width, imgSize.height.valueOf() + imgSize.height.valueOf()/2); }
};

class YV12Writer extends  YUV420pWriter
{
    write(yuv : alvision.Mat, row : alvision.int, col : alvision.int, val : YUV) : void
    {
        let h = yuv.rows().valueOf() * 2 / 3;

        yuv.at<alvision.uchar>("uchar", row, col).set(val[0]);
        if( row.valueOf() % 2 == 0 && col.valueOf() % 2 == 0 )
        {
            yuv.at<alvision.uchar>("uchar", h + row.valueOf() / 4, col.valueOf() / 2 + ((row.valueOf() / 2) % 2) * (yuv.cols().valueOf() / 2)).set(val[2]);
            yuv.at<alvision.uchar>("uchar", h + (row.valueOf() / 2 + h / 2) / 2, col.valueOf() / 2 + ((row.valueOf() / 2 + h / 2) % 2) * (yuv.cols().valueOf() / 2)).set(val[1]);
        }
    }
};

class I420Writer extends  YUV420pWriter
{
    write(yuv: alvision.Mat, row: alvision.int, col: alvision.int, val: YUV): void 
    {
        let h = yuv.rows().valueOf() * 2 / 3;

        yuv.at<alvision.uchar>("uchar", row, col).set(val[0]);
        if( row.valueOf() % 2 == 0 && col.valueOf() % 2 == 0 )
        {
            yuv.at<alvision.uchar>("uchar", h + row.valueOf() / 4, col.valueOf() / 2 + ((row.valueOf() / 2) % 2) * (yuv.cols().valueOf() / 2)).set(val[1]);
            yuv.at<alvision.uchar>("uchar", h + (row.valueOf() / 2 + h / 2) / 2, col.valueOf() / 2 + ((row.valueOf() / 2 + h / 2) % 2) * (yuv.cols().valueOf() / 2)).set(val[2]);
        }
    }
};

abstract class YUV420Reader extends  YUVreader
{
    channels() : alvision.int { return 1; }
    size(imgSize: alvision.Size ): alvision.Size { return new alvision.Size(imgSize.width, imgSize.height.valueOf() * 3 / 2); }
};

abstract class YUV422Reader extends  YUVreader
{
    channels() : alvision.int { return 2; }
    size(imgSize: alvision.Size): alvision.Size  { return imgSize; }
    requiresEvenHeight() : boolean{ return false; }
};

class NV21Reader extends  YUV420Reader
{
    read(yuv : alvision.Mat, row: alvision.int, col: alvision.int): YUV 
    {
        let y = yuv.at<alvision.uchar>("uchar",row,col).get();
        let u = yuv.at<alvision.uchar>("uchar",yuv.rows().valueOf() * 2 / 3 + row.valueOf()/2,(col.valueOf()/2)*2 + 1);
        let v = yuv.at<alvision.uchar>("uchar",yuv.rows().valueOf() * 2 / 3 + row.valueOf()/2,(col.valueOf()/2)*2);

        return <YUV>new alvision.Vecb(y, u, v);
    }
};


class NV12Reader extends YUV420Reader
{
    read(yuv : alvision.Mat, row: alvision.int, col: alvision.int): YUV 
    {
        let y = yuv.at<alvision.uchar>("uchar",row,col).get();
        let u = yuv.at<alvision.uchar>("uchar",yuv.rows().valueOf() * 2 / 3 + row.valueOf()/2,(col.valueOf()/2)*2).get();
        let v = yuv.at<alvision.uchar>("uchar",yuv.rows().valueOf() * 2 / 3 + row.valueOf()/2,(col.valueOf()/2)*2 + 1).get();

        return <YUV > new alvision.Vecb(y, u, v);
    }
};

class YV12Reader extends  YUV420Reader
{
    read(yuv : alvision.Mat, row: alvision.int, col: alvision.int): YUV 
    {
        let h = yuv.rows().valueOf() * 2 / 3;
        let y = yuv.at<alvision.uchar>("uchar",row,col).get();
        let u = yuv.at<alvision.uchar>("uchar",h + (row.valueOf()/2 + h/2)/2,col.valueOf()/2 + ((row.valueOf()/2 + h/2) % 2) * (yuv.cols().valueOf()/2)).get();
        let v = yuv.at<alvision.uchar>("uchar",h +  row.valueOf()/4,col.valueOf()/2 + ((row.valueOf()/2) % 2) * (yuv.cols().valueOf()/2)).get();

        return <YUV>new alvision.Vecb(y, u, v);
    }
};

class IYUVReader extends  YUV420Reader
{
    read(yuv : alvision.Mat, row: alvision.int, col: alvision.int): YUV 
    {
        let h = yuv.rows().valueOf() * 2 / 3;
        let y = yuv.at<alvision.uchar>("uchar", row, col).get();
        let u = yuv.at<alvision.uchar>("uchar",h + row.valueOf()/4,col.valueOf()/2 + ((row.valueOf()/2) % 2) * (yuv.cols().valueOf()/2)).get();
        let v = yuv.at<alvision.uchar>("uchar",h + (row.valueOf()/2 + h/2)/2,col.valueOf()/2 + ((row.valueOf()/2 + h/2) % 2) * (yuv.cols().valueOf()/2)).get();

        return <YUV>new alvision.Vecb(y, u, v);
    }
};

class UYVYReader extends  YUV422Reader
{
    read(yuv : alvision.Mat, row: alvision.int, col: alvision.int): YUV 
    {
        let y = yuv.at<alvision.Vecb>("Vec2b",row,col).get().val[1];
        let u = yuv.at<alvision.Vecb>("Vec2b",row,(col.valueOf()/2)*2).get().val[0];
        let v = yuv.at<alvision.Vecb>("Vec2b",row,(col.valueOf()/2)*2 + 1).get().val[0];

        return <YUV>new alvision.Vecb(y, u, v);
    }
};

class YUY2Reader extends  YUV422Reader
{
    read(yuv : alvision.Mat, row: alvision.int, col: alvision.int): YUV 
    {
        let y = yuv.at<alvision.Vecb>("Vec2b",row,col).get().val[0];
        let u = yuv.at<alvision.Vecb>("Vec2b",row,(col.valueOf()/2)*2).get().val[1];
        let v = yuv.at<alvision.Vecb>("Vec2b",row,(col.valueOf()/2)*2 + 1).get().val[1];

        return <YUV>new alvision.Vecb(y, u, v);
    }
};

class YVYUReader extends  YUV422Reader
{
    read(yuv : alvision.Mat, row: alvision.int, col: alvision.int): YUV 
    {
        let y = yuv.at<alvision.Vecb>("Vec2b",row,col).get().val[0];
        let u = yuv.at<alvision.Vecb>("Vec2b",row,(col.valueOf()/2)*2 + 1).get().val[1];
        let v = yuv.at<alvision.Vecb>("Vec2b",row,(col.valueOf()/2)*2).get().val[1];

        return <YUV>new alvision.Vecb(y, u, v);
    }
};

class YUV888Reader extends YUVreader
{
    read(yuv : alvision.Mat, row: alvision.int, col: alvision.int): YUV 
    {
        return yuv.at<YUV>("Vec2b",row, col).get();
    }

    channels() : alvision.int { return 3; }
    size(imgSize: alvision.Size ): alvision.Size  { return imgSize; }
    requiresEvenHeight() : boolean{ return false; }
    requiresEvenWidth() : boolean { return false; }
};

class RGB888Reader extends RGBreader
{
    read(rgb: alvision.Mat , row: alvision.int, col: alvision.int): RGB 
    {
        return rgb.at<RGB>("Vec2b",row, col).get();
    }

    channels() : alvision.int { return 3; }
};

class BGR888Reader extends RGBreader
{
    read(rgb: alvision.Mat , row: alvision.int, col: alvision.int): RGB 
    {
        let tmp = rgb.at<RGB>("Vec2b",row, col);
        return <RGB>new alvision.Vecb(tmp[2], tmp[1], tmp[0]);
    }

    channels() : alvision.int { return 3; }
};

class RGBA8888Reader extends RGBreader
{
    read(rgb: alvision.Mat, row: alvision.int, col: alvision.int): RGB 
    {
        let rgba = rgb.at<alvision.Vecb>("Vec4b",row, col);
        return <RGB>new alvision.Vecb(rgba[0], rgba[1], rgba[2]);
    }

    channels() : alvision.int { return 4; }
};

class BGRA8888Reader extends RGBreader
{
    read(rgb: alvision.Mat , row: alvision.int, col: alvision.int): RGB 
    {
        let rgba = rgb.at<alvision.Vecb>("Vec4b",row, col);
        return <RGB>new alvision.Vecb(rgba[2], rgba[1], rgba[0]);
    }

    channels() : alvision.int { return 4; }
};

interface IConverter<T> {
    convert(yuv: YUV): T;
}

class YUV2RGB_Converter implements IConverter<RGB>
{
//public:
    convert(yuv: YUV ): RGB 
    {
        let y = Math.max(0, yuv[0] - 16);
        let u = yuv[1] - 128;
        let v = yuv[2] - 128;
        let r = alvision.saturate_cast<alvision.uchar>(1.164 * y + 1.596 * v,"uchar");
        let g = alvision.saturate_cast<alvision.uchar>(1.164 * y - 0.813 * v - 0.391 * u,"uchar");
        let b = alvision.saturate_cast<alvision.uchar>(1.164 * y + 2.018 * u,"uchar");

        return <RGB>new alvision.Vecb(r, g, b);
    }
};

class YUV2GRAY_Converter implements IConverter< alvision.uchar >
{
//public:
    convert(yuv: YUV): alvision.uchar 
    {
        return yuv[0];
    }
};

class RGB2YUV_Converter implements IConverter<YUV>
{
convert(rgb: RGB): YUV
    {
        let r = rgb[0];
        let g = rgb[1];
        let b = rgb[2];

        let y = alvision.saturate_cast<alvision.uchar>(( 0.257*r + 0.504*g + 0.098*b + 0.5) + 16 ,"uchar");
        let u = alvision.saturate_cast<alvision.uchar>((-0.148*r - 0.291*g + 0.439*b + 0.5) + 128,"uchar");
        let v = alvision.saturate_cast<alvision.uchar>(( 0.439*r - 0.368*g - 0.071*b + 0.5) + 128,"uchar");

        return <YUV>new alvision.Vecb(y, u, v);
    }
};


//template<class convertor>
function referenceYUV2RGB(yuv: alvision.Mat, rgb: alvision.Mat, yuvReader: YUVreader, rgbWriter: RGBwriter, cvt : IConverter<RGB>) : void
{
    for(let row = 0; row < rgb.rows(); ++row)
        for(let col = 0; col < rgb.cols(); ++col)
            rgbWriter.write(rgb, row, col, cvt.convert(yuvReader.read(yuv, row, col)));
}

//template<class convertor>
function referenceYUV2GRAY(yuv: alvision.Mat, rgb: alvision.Mat, yuvReader: YUVreader, grayWriter: GRAYwriter, cvt : IConverter<alvision.uchar>) : void 
{
    for(let row  = 0; row < rgb.rows(); ++row)
        for(let col = 0; col < rgb.cols(); ++col)
            grayWriter.write(rgb, row, col, cvt.convert(yuvReader.read(yuv, row, col)));
}

//template<class convertor>
function referenceRGB2YUV(rgb: alvision.Mat, yuv: alvision.Mat, rgbReader: RGBreader, yuvWriter: YUVwriter, cvt : IConverter<YUV>): void 
{
    for(let row = 0; row < rgb.rows(); ++row)
        for(let col = 0; col < rgb.cols(); ++col)
            yuvWriter.write(yuv, row, col, cvt.convert(rgbReader.read(rgb, row, col)));
}

class ConversionYUV {
    constructor(code: alvision.int) {
        this.yuvReader_ = YUVreader.getReader(code);
        this.yuvWriter_ = YUVwriter.getWriter(code);
        this.rgbReader_ = RGBreader.getReader(code);
        this.rgbWriter_ = RGBwriter.getWriter(code);
        this.grayWriter_ = GRAYwriter.getWriter(code);
    }

    getDcn(): alvision.int {
        return (this.rgbWriter_ != null) ? this.rgbWriter_.channels() : ((this.grayWriter_ != null) ? this.grayWriter_.channels() : this.yuvWriter_.channels());
    }

    getScn(): alvision.int {
        return (this.yuvReader_ != null) ? this.yuvReader_.channels() : this.rgbReader_.channels();
    }

    getSrcSize(imgSize: alvision.Size): alvision.Size {
        return (this.yuvReader_ != null) ? this.yuvReader_.size(imgSize) : imgSize;
    }

    getDstSize(imgSize: alvision.Size): alvision.Size {
        return (this.yuvWriter_ != null) ? this.yuvWriter_.size(imgSize) : imgSize;
    }

    requiresEvenHeight(): boolean {
        return (this.yuvReader_ != null) ? this.yuvReader_.requiresEvenHeight() : ((this.yuvWriter_ != null) ? this.yuvWriter_.requiresEvenHeight() : false);
    }

    requiresEvenWidth(): boolean {
        return (this.yuvReader_ != null) ? this.yuvReader_.requiresEvenWidth() : ((this.yuvWriter_ != null) ? this.yuvWriter_.requiresEvenWidth() : false);
    }

    public yuvReader_: YUVreader;
    public yuvWriter_: YUVwriter;
    public rgbReader_: RGBreader;
    public rgbWriter_: RGBwriter;
    public grayWriter_: GRAYwriter;
}

enum YUVCVTS {
    CV_YUV2RGB_NV12, CV_YUV2BGR_NV12, CV_YUV2RGB_NV21, CV_YUV2BGR_NV21,
    CV_YUV2RGBA_NV12, CV_YUV2BGRA_NV12, CV_YUV2RGBA_NV21, CV_YUV2BGRA_NV21,
    CV_YUV2RGB_YV12, CV_YUV2BGR_YV12, CV_YUV2RGB_IYUV, CV_YUV2BGR_IYUV,
    CV_YUV2RGBA_YV12, CV_YUV2BGRA_YV12, CV_YUV2RGBA_IYUV, CV_YUV2BGRA_IYUV,
    CV_YUV2RGB_UYVY, CV_YUV2BGR_UYVY, CV_YUV2RGBA_UYVY, CV_YUV2BGRA_UYVY,
    CV_YUV2RGB_YUY2, CV_YUV2BGR_YUY2, CV_YUV2RGB_YVYU, CV_YUV2BGR_YVYU,
    CV_YUV2RGBA_YUY2, CV_YUV2BGRA_YUY2, CV_YUV2RGBA_YVYU, CV_YUV2BGRA_YVYU,
    CV_YUV2GRAY_420, CV_YUV2GRAY_UYVY, CV_YUV2GRAY_YUY2,
    CV_YUV2BGR, CV_YUV2RGB, CV_RGB2YUV_YV12, CV_BGR2YUV_YV12, CV_RGBA2YUV_YV12,
    CV_BGRA2YUV_YV12, CV_RGB2YUV_I420, CV_BGR2YUV_I420, CV_RGBA2YUV_I420, CV_BGRA2YUV_I420
}

//typedef ::testing::TestWithParam<YUVCVTS> Imgproc_ColorYUV;

//TEST_P(Imgproc_ColorYUV, accuracy)
class Imgproc_ColorYUV_accuracy extends alvision.cvtest.CUDA_TEST
{
    TestBody(): void {
        let code = this.GET_PARAM<alvision.int>(0);// GetParam();
        let random = alvision.theRNG();

        let cvt = new ConversionYUV(code);

        const scn = cvt.getScn();
        const dcn = cvt.getDcn();
        for (let iter = 0; iter < 30; ++iter) {
            let sz = new alvision.Size(random.uniform(1, 641), random.uniform(1, 481));

            if (cvt.requiresEvenWidth()) {
                sz.width = sz.width.valueOf()  + sz.width.valueOf() % 2;
            }
            if (cvt.requiresEvenHeight()) {
                sz.height = sz.height.valueOf()  + sz.height.valueOf() % 2;
            }

            let srcSize = cvt.getSrcSize(sz);
            let src = new alvision.Mat(srcSize.height, srcSize.width.valueOf() * scn.valueOf(), alvision.MatrixType.CV_8UC1).reshape(scn);

            let dstSize = cvt.getDstSize(sz);
            let dst = new alvision.Mat(dstSize.height, dstSize.width.valueOf() * dcn.valueOf(), alvision.MatrixType.CV_8UC1).reshape(dcn);
            let gold = new alvision.Mat(dstSize, alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_8U, dcn));//  CV_8UC(dcn));

            random.fill(src, alvision.DistType.UNIFORM, 0, 256);

            if (cvt.rgbWriter_)
                referenceYUV2RGB(src, gold, cvt.yuvReader_, cvt.rgbWriter_, new YUV2RGB_Converter());
            else if (cvt.grayWriter_)
                referenceYUV2GRAY(src, gold, cvt.yuvReader_, cvt.grayWriter_, new YUV2GRAY_Converter());
            else if (cvt.yuvWriter_)
                referenceRGB2YUV(src, gold, cvt.rgbReader_, cvt.yuvWriter_, new RGB2YUV_Converter());

            alvision.cvtColor(src, dst, code, -1);

            alvision.EXPECT_EQ(0, countOfDifferencies(gold, dst));
        }
    }
}

//TEST_P(Imgproc_ColorYUV, roi_accuracy)
class Imgproc_ColorYUV_roi_accuracy extends alvision.cvtest.CUDA_TEST
{
    TestBody() {
        let code = this.GET_PARAM<alvision.int>(0);// GetParam();
        let random = alvision.theRNG();

        let cvt = new ConversionYUV (code);

        const  scn = cvt.getScn();
        const  dcn = cvt.getDcn();
        for (let iter = 0; iter < 30; ++iter)
        {
            let sz = new alvision.Size(random.uniform(1, 641), random.uniform(1, 481));

            if (cvt.requiresEvenWidth()) {
                sz.width = sz.width.valueOf()  + sz.width.valueOf() % 2;
            }
            if (cvt.requiresEvenHeight()) {
                sz.height = sz.height.valueOf()  + sz.height.valueOf() % 2;
            }

            let roi_offset_top = random.uniform(0, 6);
            let roi_offset_bottom = random.uniform(0, 6);
            let roi_offset_left = random.uniform(0, 6);
            let roi_offset_right = random.uniform(0, 6);

            let srcSize = cvt.getSrcSize(sz);
            let src_full = new alvision.Mat(srcSize.height.valueOf() + roi_offset_top.valueOf() + roi_offset_bottom.valueOf(), srcSize.width.valueOf() + roi_offset_left.valueOf() + roi_offset_right.valueOf(), alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_8U, scn));// CV_8UC(scn));

            let dstSize = cvt.getDstSize(sz);
            let dst_full = new alvision.Mat(dstSize.height.valueOf() + roi_offset_left.valueOf() + roi_offset_right.valueOf(), dstSize.width.valueOf() + roi_offset_top.valueOf() + roi_offset_bottom.valueOf(), alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_8U, dcn), alvision.Scalar.all(0)); // CV_8UC(dcn), 
            let gold_full = new alvision.Mat(dst_full.size(), alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_8U, dcn)/* CV_8UC(dcn)*/, alvision.Scalar.all(0));

            random.fill(src_full, alvision.DistType.UNIFORM, 0, 256);

            let src = src_full.roi([new alvision.Range(roi_offset_top, roi_offset_top.valueOf() + srcSize.height.valueOf()),     new alvision.Range(roi_offset_left, roi_offset_left.valueOf() + srcSize.width.valueOf())]);
            let dst = dst_full.roi([new alvision.Range(roi_offset_left, roi_offset_left.valueOf() + dstSize.height.valueOf()),   new alvision.Range(roi_offset_top,  roi_offset_top .valueOf()+  dstSize.width.valueOf())]);
            let gold = gold_full.roi([new alvision.Range(roi_offset_left, roi_offset_left.valueOf() + dstSize.height.valueOf()), new alvision.Range(roi_offset_top,  roi_offset_top .valueOf()+  dstSize.width.valueOf())]);

            if (cvt.rgbWriter_)
                referenceYUV2RGB(src, gold, cvt.yuvReader_, cvt.rgbWriter_, new YUV2RGB_Converter());
            else if (cvt.grayWriter_)
                referenceYUV2GRAY(src, gold, cvt.yuvReader_, cvt.grayWriter_, new YUV2GRAY_Converter());
            else if (cvt.yuvWriter_)
                referenceRGB2YUV(src, gold, cvt.rgbReader_, cvt.yuvWriter_, new RGB2YUV_Converter());

            alvision.cvtColor(src, dst, code, -1);

            alvision.EXPECT_EQ(0, countOfDifferencies(gold_full, dst_full));
        }
    }
}

alvision.cvtest.INSTANTIATE_TEST_CASE_P('cvt420', 'Imgproc_ColorYUV', (case_name, test_name) => { return null },
    new alvision.cvtest.Combine([
        [YUVCVTS.CV_YUV2RGB_NV12, YUVCVTS.CV_YUV2BGR_NV12, YUVCVTS.CV_YUV2RGB_NV21, YUVCVTS.CV_YUV2BGR_NV21,
            YUVCVTS.CV_YUV2RGBA_NV12, YUVCVTS.CV_YUV2BGRA_NV12, YUVCVTS.CV_YUV2RGBA_NV21, YUVCVTS.CV_YUV2BGRA_NV21,
            YUVCVTS.CV_YUV2RGB_YV12, YUVCVTS.CV_YUV2BGR_YV12, YUVCVTS.CV_YUV2RGB_IYUV, YUVCVTS.CV_YUV2BGR_IYUV,
            YUVCVTS.CV_YUV2RGBA_YV12, YUVCVTS.CV_YUV2BGRA_YV12, YUVCVTS.CV_YUV2RGBA_IYUV, YUVCVTS.CV_YUV2BGRA_IYUV,
            YUVCVTS.CV_YUV2GRAY_420, YUVCVTS.CV_RGB2YUV_YV12, YUVCVTS.CV_BGR2YUV_YV12, YUVCVTS.CV_RGBA2YUV_YV12,
            YUVCVTS.CV_BGRA2YUV_YV12, YUVCVTS.CV_RGB2YUV_I420, YUVCVTS.CV_BGR2YUV_I420, YUVCVTS.CV_RGBA2YUV_I420,
            YUVCVTS.CV_BGRA2YUV_I420]
    ]));

alvision.cvtest.INSTANTIATE_TEST_CASE_P('cvt422', 'Imgproc_ColorYUV', (case_name, test_name) => { return null },
    new alvision.cvtest.Combine([
        [YUVCVTS.CV_YUV2RGB_UYVY, YUVCVTS.CV_YUV2BGR_UYVY, YUVCVTS.CV_YUV2RGBA_UYVY, YUVCVTS.CV_YUV2BGRA_UYVY,
            YUVCVTS.CV_YUV2RGB_YUY2, YUVCVTS.CV_YUV2BGR_YUY2, YUVCVTS.CV_YUV2RGB_YVYU, YUVCVTS.CV_YUV2BGR_YVYU,
            YUVCVTS.CV_YUV2RGBA_YUY2, YUVCVTS.CV_YUV2BGRA_YUY2, YUVCVTS.CV_YUV2RGBA_YVYU, YUVCVTS.CV_YUV2BGRA_YVYU,
            YUVCVTS.CV_YUV2GRAY_UYVY, YUVCVTS.CV_YUV2GRAY_YUY2]
    ]));
