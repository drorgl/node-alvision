var alvision_module = require('../../lib/bindings.js');

/// <reference path="packet.ts" />
/// <reference path="ffmpeg.ts" />
/// <reference path="../opencv/Matrix.ts" />

import * as ffmpeg from './ffmpeg'
import * as packet from './packet'
import * as matrix from '../opencv/Mat'

//export module alvision {
    export interface stream extends ffmpeg.IStreamInfo, ffmpeg.IVideoStreamInfo, ffmpeg.IAudioStreamInfo {
        id: string;
        mediatype: ffmpeg.mediatype;
        framerate: number;
        codec: string;
        timebase: number;
        bitrate: number;
        streamindex: number;

        channelslayout: ffmpeg.channel_layout;
        channels: number;
        samplefmt: ffmpeg.sample_format;
        samplerate: number;

        width: number;
        height: number;
        gop_size: number;
        pixfmt: ffmpeg.pixel_format;

        AddFilter(filtername: string, filterParams: string): boolean;
        Decode(packet: packet.packet, streamInfo: ffmpeg.IVideoStreamInfo, mat: matrix.Mat): ffmpeg.IDecodeState;
        Decode(packet: packet.packet, streamInfo: ffmpeg.IAudioStreamInfo, mat: matrix.Mat): ffmpeg.IDecodeState;
        Encode(outputStreamInfo: ffmpeg.IAudioStreamInfo, frameInfo: ffmpeg.IFrameInfo, mat: matrix.Mat): ffmpeg.IState;
        Encode(outputStreamInfo: ffmpeg.IVideoStreamInfo, frameInfo: ffmpeg.IFrameInfo, mat: matrix.Mat): ffmpeg.IState;
    }

    var stream: stream = alvision_module.stream;
//}
//export = alvision;
