/// <reference path="packet.ts" />
/// <reference path="stream.ts" />


var alvision_module = require('../../lib/bindings.js');

import * as stream from './stream'
import * as packet from './packet'
//import alvision from './stream'
//import {alvision as alvisionx} from './stream';
//import alviio from './stream';

//export module alvision {
    

    export interface ffmpeg {
        getNextBufferSizes(): IBufferSize;
        getNextBuffer(buffer: Buffer): number;
        WriteHeader(options?: Object, metadata?: Object): boolean;
        GetSDP(): string;
        Close(): boolean;
        GetStreams(): Array<stream.stream>;
        AddStream(config: IVideoStreamConfig | IAudioStreamConfig): stream.stream;
        WritePacket(packet: packet.packet, interleaved?: boolean): void;
        ReadPacket(packet: packet.packet): read_packet_status;
    }

    export interface ffmpegStatic {
        ListInputFormats(cb: (err: string, formats: IIOFormat[]) => void): void;
        ListOutputFormats(cb: (err: string, formats: IIOFormat[]) => void): void;
        SetLogger(cb: (module: string, level: number, message: string) => void): void;
        ListCodecs(cb: (err: string, codecs: ICodecDetail[]) => void): void;
        ListDevices(cb: (err: string, devices: IDeviceInfo[]) => void): void;
        ListFilters(cb: (err: string, filters: string[]) => void): void;
        OpenAsInput(filename: string, format: string, options: Object, callback: (err: string, ffmpegInstance: ffmpeg) => void): void;
        OpenAsOutputBuffer(filename: string, format: string, packetSize: number, totalSize: number, options: Object, callback: (err: string, ffmpegInstance: ffmpeg) => void): void;
        OpenAsOutput(filename: string, format: string, options: Object, callback: (err: string, ffmpegInstance: ffmpeg) => void): void;
    }

    export var ffmpeg: ffmpegStatic = alvision_module.ffmpeg;

    export interface IIOFormat {
        name: string;
        long_name: string;
        extensions: string;
        mime_type: string;
        flags: component_flags;
        options: any;
    }

    export enum mediatype {
        "attachment" = <any>"attachment",
        "audio" = <any>"audio",
        "data" = <any>"data",
        "nb" = <any>"nb",
        "subtitle" = <any>"subtitle",
        "unknown" = <any>"unknown",
        "video" = <any>"video"
    }

    export interface ILogItem {
        module: string;
        level: number;
        message: string;
    }


    export interface IProfile {
        id: number;
        name: string;
    }

    export interface ICodecDetail {
        name: string;
        long_name: string;
        is_encoder: boolean;
        is_decoder: boolean;
        media_type: mediatype;
        max_lowres: number;
        frame_rates: number[];
        pixel_formats: pixel_format[];
        sample_rates: number[];
        channel_layouts: channel_layout[];
        codec_profiles: IProfile[];
        capabilities: codec_capabilties[];
    }



    export interface IDeviceInfo {
        pin: string;
        type: DeviceType;
    };

    export interface IVideoDeviceInfo extends IDeviceDetail {
        pixelFormat: pixel_format;
        codec: string;
        minWidth: number;
        minHeight: number;
        minFPS: number;
        maxWidth: number;
        maxHeight: number;
        maxFPS: number;
    }

    export interface IAudioDeviceInfo extends IDeviceInfo {
        minChannels: number;
        minBits: number;
        minRate: number;
        maxChannels: number;
        maxBits: number;
        maxRate: number;
    }

    export interface IDeviceDetail {
        name: string;
        full_name: string;
        format: string;
        device_infos: IDeviceInfo[];
    }

    export interface IBufferSize {
        size: number;
        blocks: number;
    }



    export interface IStreamConfig {
        id: string;
        codec: string;
        timebase: number;
        bitrate: number;
        options?: Object;
    }

    export interface IAudioStreamConfig extends IStreamConfig {
        channels: number;
        samplerate: number;
        channelslayout?: channel_layout | string;
        samplefmt?: sample_format | string;
    }

    export interface IVideoStreamConfig extends IStreamConfig {
        width: number;
        height: number;
        gopsize?: number;
        pixfmt?: pixel_format | string;

    }

    

    export interface IStreamInfo {
        id: string;
        mediatype: mediatype;
        framerate: number;
        codec: string;
        timebase: number;
        bitrate: number;
        streamindex: number;
    }

    export interface IVideoStreamInfo extends IStreamInfo {
        width: number;
        height: number;
        gop_size: number;
        pixfmt: pixel_format;
    }

    export interface IAudioStreamInfo extends IStreamInfo {
        channelslayout: channel_layout;
        channels: number;
        samplefmt: sample_format;
        samplerate: number;
    }

    export interface IFrameInfo {
        SamplesRead: number;
    }


    export interface IState {
        succeeded: boolean;
    }

    export interface IDecodeState extends IState {
        SamplesRead: number;
    }

    export enum component_flags {
        nofile = 0x0001,
        /*Needs '%d' in filename*/
        neednumber = 0x0002,
        /*Show format stream IDs numbers*/
        show_ids = 0x0008,
        /*Format wants AVPicture structure for raw picture data.*/
        rawpicture = 0x0020,
        /*Format wants global header*/
        globalheader = 0x0040,
        /*Format does not need / have any timestamps*/
        notimestamps = 0x0080,
        /*Use generic index building code*/
        generic_index = 0x0100,
        /*Format allows timestamp discontinuities. Note, muxers always require valid (monotone) timestamps*/
        ts_discont = 0x0200,
        /*Format allows variable fps*/
        variable_fps = 0x0400,
        /*Format does not need width/height*/
        nodimensions = 0x0800,
        /*Format does not require any streams*/
        nostreams = 0x1000,
        /*Format does not allow to fall back on binary search via read_timestamp*/
        nobinsearch = 0x2000,
        /*Format does not allow to fall back on generic search*/
        nogensearch = 0x4000,
        /*Format does not allow seeking by bytes*/
        no_byte_seek = 0x8000,
        /*Format allows flushing. If not set, the muxer will not receive a NULL packet in the write_packet function.*/
        allow_flush = 0x10000,
        /*Format does not require strictly increasing timestamps, but they must still be monotonic*/
        ts_nonstrict = 0x20000,
        //    Format allows muxing negative
        //    timestamps. If not set the timestamp
        //    will be shifted in av_write_frame and
        //    av_interleaved_write_frame so they
        //    start from 0.
        //    The user or muxer can override this through
        //    AVFormatContext.avoid_negative_ts
        ts_negative = 0x40000,
        /*Seeking is based on PTS*/
        seek_to_pts = 0x4000000
    }




    export enum pixel_format {
        PIX_FMT_NONE = <any>"none",
        PIX_FMT_YUV420P = <any>"yuv420p",
        PIX_FMT_YUYV422 = <any>"yuyv422",
        PIX_FMT_RGB24 = <any>"rgb24",
        PIX_FMT_BGR24 = <any>"bgr24",
        PIX_FMT_YUV422P = <any>"yuv422p",
        PIX_FMT_YUV444P = <any>"yuv444p",
        PIX_FMT_YUV410P = <any>"yuv410p",
        PIX_FMT_YUV411P = <any>"yuv411p",
        PIX_FMT_GRAY8 = <any>"gray8",
        PIX_FMT_MONOWHITE = <any>"monowhite",
        PIX_FMT_MONOBLACK = <any>"monoblack",
        PIX_FMT_PAL8 = <any>"pal8",
        PIX_FMT_YUVJ420P = <any>"yuvj420p",
        PIX_FMT_YUVJ422P = <any>"yuvj422p",
        PIX_FMT_YUVJ444P = <any>"yuvj444p",
        PIX_FMT_XVMC_MPEG2_MC = <any>"xvmc_mpeg2_mc",
        PIX_FMT_XVMC_MPEG2_IDCT = <any>"xvmc_mpeg2_idct",
        PIX_FMT_UYVY422 = <any>"uyvy422",
        PIX_FMT_UYYVYY411 = <any>"uyyvyy411",
        PIX_FMT_BGR8 = <any>"bgr8",
        PIX_FMT_BGR4 = <any>"bgr4",
        PIX_FMT_BGR4_BYTE = <any>"bgr4_byte",
        PIX_FMT_RGB8 = <any>"rgb8",
        PIX_FMT_RGB4 = <any>"rgb4",
        PIX_FMT_RGB4_BYTE = <any>"rgb4_byte",
        PIX_FMT_NV12 = <any>"nv12",
        PIX_FMT_NV16 = <any>"nv16",
        PIX_FMT_NV21 = <any>"nv21",
        PIX_FMT_ARGB = <any>"argb",
        PIX_FMT_RGBA = <any>"rgba",
        PIX_FMT_ABGR = <any>"abgr",
        PIX_FMT_BGRA = <any>"bgra",
        PIX_FMT_GRAY16BE = <any>"gray16be",
        PIX_FMT_GRAY16LE = <any>"gray16le",
        PIX_FMT_YUV440P = <any>"yuv440p",
        PIX_FMT_YUVJ440P = <any>"yuvj440p",
        PIX_FMT_YUVA420P = <any>"yuva420p",
        PIX_FMT_VDPAU_H264 = <any>"vdpau_h264",
        PIX_FMT_VDPAU_MPEG1 = <any>"vdpau_mpeg1",
        PIX_FMT_VDPAU_MPEG2 = <any>"vdpau_mpeg2",
        PIX_FMT_VDPAU_WMV3 = <any>"vdpau_wmv3",
        PIX_FMT_VDPAU_VC1 = <any>"vdpau_vc1",
        PIX_FMT_RGB48BE = <any>"rgb48be",
        PIX_FMT_RGB48LE = <any>"rgb48le",
        PIX_FMT_RGB565BE = <any>"rgb565be",
        PIX_FMT_RGB565LE = <any>"rgb565le",
        PIX_FMT_RGB555BE = <any>"rgb555be",
        PIX_FMT_RGB555LE = <any>"rgb555le",
        PIX_FMT_BGR565BE = <any>"bgr565be",
        PIX_FMT_BGR565LE = <any>"bgr565le",
        PIX_FMT_BGR555BE = <any>"bgr555be",
        PIX_FMT_BGR555LE = <any>"bgr555le",
        PIX_FMT_VAAPI_MOCO = <any>"vaapi_moco",
        PIX_FMT_VAAPI_IDCT = <any>"vaapi_idct",
        PIX_FMT_VAAPI_VLD = <any>"vaapi_vld",
        PIX_FMT_YUV420P16LE = <any>"yuv420p16le",
        PIX_FMT_YUV420P16BE = <any>"yuv420p16be",
        PIX_FMT_YUV422P16LE = <any>"yuv422p16le",
        PIX_FMT_YUV422P16BE = <any>"yuv422p16be",
        PIX_FMT_YUV444P16LE = <any>"yuv444p16le",
        PIX_FMT_YUV444P16BE = <any>"yuv444p16be",
        PIX_FMT_VDPAU_MPEG4 = <any>"vdpau_mpeg4",
        PIX_FMT_DXVA2_VLD = <any>"dxva2_vld",
        PIX_FMT_RGB444LE = <any>"rgb444le",
        PIX_FMT_RGB444BE = <any>"rgb444be",
        PIX_FMT_BGR444LE = <any>"bgr444le",
        PIX_FMT_BGR444BE = <any>"bgr444be",
        PIX_FMT_GRAY8A = <any>"gray8a",
        PIX_FMT_BGR48BE = <any>"bgr48be",
        PIX_FMT_BGR48LE = <any>"bgr48le",
        PIX_FMT_YUV420P9BE = <any>"yuv420p9be",
        PIX_FMT_YUV420P9LE = <any>"yuv420p9le",
        PIX_FMT_YUV420P10BE = <any>"yuv420p10be",
        PIX_FMT_YUV420P10LE = <any>"yuv420p10le",
        PIX_FMT_YUV422P10BE = <any>"yuv422p10be",
        PIX_FMT_YUV422P10LE = <any>"yuv422p10le",
        PIX_FMT_YUV444P9BE = <any>"yuv444p9be",
        PIX_FMT_YUV444P9LE = <any>"yuv444p9le",
        PIX_FMT_YUV444P10BE = <any>"yuv444p10be",
        PIX_FMT_YUV444P10LE = <any>"yuv444p10le",
        PIX_FMT_YUV422P9BE = <any>"yuv422p9be",
        PIX_FMT_YUV422P9LE = <any>"yuv422p9le",
        PIX_FMT_VDA_VLD = <any>"vda_vld",
        PIX_FMT_RGBA64BE = <any>"rgba64be",
        PIX_FMT_RGBA64LE = <any>"rgba64le",
        PIX_FMT_BGRA64BE = <any>"bgra64be",
        PIX_FMT_BGRA64LE = <any>"bgra64le",
        PIX_FMT_GBRP = <any>"gbrp",
        PIX_FMT_GBRP9BE = <any>"gbrp9be",
        PIX_FMT_GBRP9LE = <any>"gbrp9le",
        PIX_FMT_GBRP10BE = <any>"gbrp10be",
        PIX_FMT_GBRP10LE = <any>"gbrp10le",
        PIX_FMT_GBRP16BE = <any>"gbrp16be",
        PIX_FMT_GBRP16LE = <any>"gbrp16le",  
        //PIX_FMT_YUVA422P_LIBAV = <any>"yuva422p_libav"      , 
        //PIX_FMT_YUVA444P_LIBAV = <any>"yuva444p_libav"      , 
        PIX_FMT_YUVA420P9BE = <any>"yuva420p9be",
        PIX_FMT_YUVA420P9LE = <any>"yuva420p9le",
        PIX_FMT_YUVA422P9BE = <any>"yuva422p9be",
        PIX_FMT_YUVA422P9LE = <any>"yuva422p9le",
        PIX_FMT_YUVA444P9BE = <any>"yuva444p9be",
        PIX_FMT_YUVA444P9LE = <any>"yuva444p9le",
        PIX_FMT_YUVA420P10BE = <any>"yuva420p10be",
        PIX_FMT_YUVA420P10LE = <any>"yuva420p10le",
        PIX_FMT_YUVA422P10BE = <any>"yuva422p10be",
        PIX_FMT_YUVA422P10LE = <any>"yuva422p10le",
        PIX_FMT_YUVA444P10BE = <any>"yuva444p10be",
        PIX_FMT_YUVA444P10LE = <any>"yuva444p10le",
        PIX_FMT_YUVA420P16BE = <any>"yuva420p16be",
        PIX_FMT_YUVA420P16LE = <any>"yuva420p16le",
        PIX_FMT_YUVA422P16BE = <any>"yuva422p16be",
        PIX_FMT_YUVA422P16LE = <any>"yuva422p16le",
        PIX_FMT_YUVA444P16BE = <any>"yuva444p16be",
        PIX_FMT_YUVA444P16LE = <any>"yuva444p16le",
        PIX_FMT_VDPAU = <any>"vdpau",
        PIX_FMT_XYZ12LE = <any>"xyz12le",
        PIX_FMT_XYZ12BE = <any>"xyz12be", 
        //PIX_FMT_RGBA64BE       = <any>"rgba64be"            , 
        //PIX_FMT_RGBA64LE       = <any>"rgba64le"            ,
        //PIX_FMT_BGRA64BE       = <any>"bgra64be"            ,
        //PIX_FMT_BGRA64LE       = <any>"bgra64le"            ,
        PIX_FMT_0RGB = <any>"0rgb",
        PIX_FMT_RGB0 = <any>"rgb0",
        PIX_FMT_0BGR = <any>"0bgr",
        PIX_FMT_BGR0 = <any>"bgr0",
        PIX_FMT_YUVA444P = <any>"yuva444p",
        PIX_FMT_YUVA422P = <any>"yuva422p",
        PIX_FMT_YUV420P12BE = <any>"yuv420p12be",
        PIX_FMT_YUV420P12LE = <any>"yuv420p12le",
        PIX_FMT_YUV420P14BE = <any>"yuv420p14be",
        PIX_FMT_YUV420P14LE = <any>"yuv420p14le",
        PIX_FMT_YUV422P12BE = <any>"yuv422p12be",
        PIX_FMT_YUV422P12LE = <any>"yuv422p12le",
        PIX_FMT_YUV422P14BE = <any>"yuv422p14be",
        PIX_FMT_YUV422P14LE = <any>"yuv422p14le",
        PIX_FMT_YUV444P12BE = <any>"yuv444p12be",
        PIX_FMT_YUV444P12LE = <any>"yuv444p12le",
        PIX_FMT_YUV444P14BE = <any>"yuv444p14be",
        PIX_FMT_YUV444P14LE = <any>"yuv444p14le",
        PIX_FMT_GBRP12BE = <any>"gbrp12be",
        PIX_FMT_GBRP12LE = <any>"gbrp12le",
        PIX_FMT_GBRP14BE = <any>"gbrp14be",
        PIX_FMT_GBRP14LE = <any>"gbrp14le",    
        //PIX_FMT_GBRAP          = <any>"gbrap"               ,       
        //PIX_FMT_GBRAP16BE      = <any>"gbrap16be"           ,   
        //PIX_FMT_GBRAP16LE      = <any>"gbrap16le"           ,   
        PIX_FMT_YUVJ411P = <any>"yuvj411p",
        PIX_FMT_NB = <any>"nb",
        PIX_FMT_YA16BE = <any>"ya16be",
        PIX_FMT_YA16LE = <any>"ya16le"
    }

    export enum channels {
        FRONT_LEFT = 0x00000001,
        FRONT_RIGHT = 0x00000002,
        FRONT_CENTER = 0x00000004,
        LOW_FREQUENCY = 0x00000008,
        BACK_LEFT = 0x00000010,
        BACK_RIGHT = 0x00000020,
        FRONT_LEFT_OF_CENTER = 0x00000040,
        FRONT_RIGHT_OF_CENTER = 0x00000080,
        BACK_CENTER = 0x00000100,
        SIDE_LEFT = 0x00000200,
        SIDE_RIGHT = 0x00000400,
        TOP_CENTER = 0x00000800,
        TOP_FRONT_LEFT = 0x00001000,
        TOP_FRONT_CENTER = 0x00002000,
        TOP_FRONT_RIGHT = 0x00004000,
        TOP_BACK_LEFT = 0x00008000,
        TOP_BACK_CENTER = 0x00010000,
        TOP_BACK_RIGHT = 0x00020000,
        STEREO_LEFT = 0x20000000,
        STEREO_RIGHT = 0x40000000,
        WIDE_LEFT = 0x0000000080000000,
        WIDE_RIGHT = 0x0000000100000000,
        SURROUND_DIRECT_LEFT = 0x0000000200000000,
        SURROUND_DIRECT_RIGHT = 0x0000000400000000,
        LOW_FREQUENCY_2 = 0x0000000800000000,
        LAYOUT_NATIVE = 0x8000000000000000,
    };

    export enum channel_layout {
        MONO = (channels.FRONT_CENTER),
        STEREO = (channels.FRONT_LEFT | channels.FRONT_RIGHT),
        L2POINT1 = (channel_layout.STEREO | channels.LOW_FREQUENCY),
        L2_1 = (channel_layout.STEREO | channels.BACK_CENTER),
        SURROUND = (channel_layout.STEREO | channels.FRONT_CENTER),
        L3POINT1 = (channel_layout.SURROUND | channels.LOW_FREQUENCY),
        L4POINT0 = (channel_layout.SURROUND | channels.BACK_CENTER),
        L4POINT1 = (channel_layout.L4POINT0 | channels.LOW_FREQUENCY),
        L2_2 = (channel_layout.STEREO | channels.SIDE_LEFT | channels.SIDE_RIGHT),
        QUAD = (channel_layout.STEREO | channels.BACK_LEFT | channels.BACK_RIGHT),
        L5POINT0 = (channel_layout.SURROUND | channels.SIDE_LEFT | channels.SIDE_RIGHT),
        L5POINT1 = (channel_layout.L5POINT0 | channels.LOW_FREQUENCY),
        L5POINT0_BACK = (channel_layout.SURROUND | channels.BACK_LEFT | channels.BACK_RIGHT),
        L5POINT1_BACK = (channel_layout.L5POINT0_BACK | channels.LOW_FREQUENCY),
        L6POINT0 = (channel_layout.L5POINT0 | channels.BACK_CENTER),
        L6POINT0_FRONT = (channel_layout.L2_2 | channels.FRONT_LEFT_OF_CENTER | channels.FRONT_RIGHT_OF_CENTER),
        HEXAGONAL = (channel_layout.L5POINT0_BACK | channels.BACK_CENTER),
        L6POINT1 = (channel_layout.L5POINT1 | channels.BACK_CENTER),
        L6POINT1_BACK = (channel_layout.L5POINT1_BACK | channels.BACK_CENTER),
        L6POINT1_FRONT = (channel_layout.L6POINT0_FRONT | channels.LOW_FREQUENCY),
        L7POINT0 = (channel_layout.L5POINT0 | channels.BACK_LEFT | channels.BACK_RIGHT),
        L7POINT0_FRONT = (channel_layout.L5POINT0 | channels.FRONT_LEFT_OF_CENTER | channels.FRONT_RIGHT_OF_CENTER),
        L7POINT1 = (channel_layout.L5POINT1 | channels.BACK_LEFT | channels.BACK_RIGHT),
        L7POINT1_WIDE = (channel_layout.L5POINT1 | channels.FRONT_LEFT_OF_CENTER | channels.FRONT_RIGHT_OF_CENTER),
        L7POINT1_WIDE_BACK = (channel_layout.L5POINT1_BACK | channels.FRONT_LEFT_OF_CENTER | channels.FRONT_RIGHT_OF_CENTER),
        OCTAGONAL = (channel_layout.L5POINT0 | channels.BACK_LEFT | channels.BACK_CENTER | channels.BACK_RIGHT),
        STEREO_DOWNMIX = (channels.STEREO_LEFT | channels.STEREO_RIGHT)
    }

    export enum codec_capabilties {
        auto_threads = <any>"auto_threads",
        channel_conf = <any>"channel_conf",
        delay = <any>"delay",
        dr1 = <any>"dr1",
        draw_horiz_band = <any>"draw_horiz_band",
        experimental = <any>"experimental",
        frame_threads = <any>"frame_threads",
        hwaccel = <any>"hwaccel",
        hwaccel_vdpau = <any>"hwaccel_vdpau",
        intra_only = <any>"intra_only",
        lossless = <any>"lossless",
        neg_linesizes = <any>"neg_linesizes",
        param_change = <any>"param_change",
        slice_threads = <any>"slice_threads",
        small_last_frame = <any>"small_last_frame",
        subframes = <any>"subframes",
        truncated = <any>"truncated",
        variable_frame_size = <any>"variable_frame_size"
    }



    export enum DeviceType {
        audio,
        video
    }


    export enum sample_format {
        none = <any>"none",
        u8 = <any>"u8",   // unsigned 8 bits
        s16 = <any>"s16",  // signed 16 bits
        s32 = <any>"s32",  // signed 32 bits
        flt = <any>"flt",  // float
        dbl = <any>"dbl",  // double

        u8p = <any>"u8p",  // unsigned 8 bits, planar
        s16p = <any>"s16p", // signed 16 bits, planar
        s32p = <any>"s32p", // signed 32 bits, planar
        fltp = <any>"fltp", // float, planar
        dblp = <any>"dblp"  // double, planar
    }

    export enum read_packet_status {
        "success" = <any>"success",
        "again" = <any>"again",
        "eof" = <any>"eof",
        "unknown" = <any>"unknown"
    }


  
//}
//export = alvision;
