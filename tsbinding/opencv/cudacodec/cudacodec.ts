/*M///////////////////////////////////////////////////////////////////////////////////////
//
//  IMPORTANT: READ BEFORE DOWNLOADING, COPYING, INSTALLING OR USING.
//
//  By downloading, copying, installing or using the software you agree to this license.
//  If you do not agree to this license, do not download, install,
//  copy or use the software.
//
//
//                          License Agreement
//                For Open Source Computer Vision Library
//
// Copyright (C) 2000-2008, Intel Corporation, all rights reserved.
// Copyright (C) 2009, Willow Garage Inc., all rights reserved.
// Copyright (C) 2013, OpenCV Foundation, all rights reserved.
// Third party copyrights are property of their respective owners.
//
// Redistribution and use in source and binary forms, with or without modification,
// are permitted provided that the following conditions are met:
//
//   * Redistribution's of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//
//   * Redistribution's in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//
//   * The name of the copyright holders may not be used to endorse or promote products
//     derived from this software without specific prior written permission.
//
// This software is provided by the copyright holders and contributors "as is" and
// any express or implied warranties, including, but not limited to, the implied
// warranties of merchantability and fitness for a particular purpose are disclaimed.
// In no event shall the Intel Corporation or contributors be liable for any direct,
// indirect, incidental, special, exemplary, or consequential damages
// (including, but not limited to, procurement of substitute goods or services;
// loss of use, data, or profits; or business interruption) however caused
// and on any theory of liability, whether in contract, strict liability,
// or tort (including negligence or otherwise) arising in any way out of
// the use of this software, even if advised of the possibility of such damage.
//
//M*/

var alvision_module = require('../../../lib/bindings.js');

import * as _mat from './../mat'
import * as _matx from './../matx'
//import * as _st from './Constants'
import * as _st from './../static'
import * as _types from './../types'
import * as _core from './../core'
import * as _base from './../base'
import * as _affine from './../Affine'
import * as _features2d from './../features2d'

//#ifndef __OPENCV_CUDACODEC_HPP__
//#define __OPENCV_CUDACODEC_HPP__
//
//#ifndef __cplusplus
//#  error cudacodec.hpp header must be compiled as C++
//#endif
//
//#include "opencv2/core/cuda.hpp"

/**
  @addtogroup cuda
  @{
    @defgroup cudacodec Video Encoding/Decoding
  @}
 */

//namespace cv {
  export  namespace cudacodec {

//! @addtogroup cudacodec
//! @{

////////////////////////////////// Video Encoding //////////////////////////////////

// Works only under Windows.
// Supports olny H264 video codec and AVI files.

export enum SurfaceFormat
{
    SF_UYVY = 0,
    SF_YUY2,
    SF_YV12,
    SF_NV12,
    SF_IYUV,
    SF_BGR,
    SF_GRAY = SF_BGR
};

/** @brief Different parameters for CUDA video encoder.
 */

interface EncoderParamsStatic {
          /** @brief Constructors.

    @param configFile Config file name.

    Creates default parameters or reads parameters from config file.
     */
    //explicit EncoderParams(const String& configFile);
          new (): EncoderParams;
          new (configFile : string): EncoderParams;
      }

interface EncoderParams
{
    P_Interval : _st.int;      //!< NVVE_P_INTERVAL,
    IDR_Period: _st.int;      //!< NVVE_IDR_PERIOD,
    DynamicGOP: _st.int;      //!< NVVE_DYNAMIC_GOP,
    RCType: _st.int;          //!< NVVE_RC_TYPE,
    AvgBitrate: _st.int;      //!< NVVE_AVG_BITRATE,
    PeakBitrate: _st.int;     //!< NVVE_PEAK_BITRATE,
    QP_Level_Intra: _st.int;  //!< NVVE_QP_LEVEL_INTRA,
    QP_Level_InterP: _st.int; //!< NVVE_QP_LEVEL_INTER_P,
    QP_Level_InterB: _st.int; //!< NVVE_QP_LEVEL_INTER_B,
    DeblockMode: _st.int;     //!< NVVE_DEBLOCK_MODE,
    ProfileLevel: _st.int;    //!< NVVE_PROFILE_LEVEL,
    ForceIntra: _st.int;      //!< NVVE_FORCE_INTRA,
    ForceIDR: _st.int;        //!< NVVE_FORCE_IDR,
    ClearStat: _st.int;       //!< NVVE_CLEAR_STAT,
    DIMode: _st.int;          //!< NVVE_SET_DEINTERLACE,
    Presets: _st.int;         //!< NVVE_PRESETS,
    DisableCabac: _st.int;    //!< NVVE_DISABLE_CABAC,
    NaluFramingType: _st.int; //!< NVVE_CONFIGURE_NALU_FRAMING_TYPE
    DisableSPSPPS: _st.int;   //!< NVVE_DISABLE_SPS_PPS

    
    

    /** @brief Reads parameters from config file.

    @param configFile Config file name.
     */
    load(configFile : string): void;
    /** @brief Saves parameters to config file.

    @param configFile Config file name.
     */
    save(configFile : string): void;
};

      export var EncoderParams: EncoderParamsStatic = alvision_module.EncoderParams;

/** @brief Callbacks for CUDA video encoder.
 */
      enum PicType {
          IFRAME = 1,
          PFRAME = 2,
          BFRAME = 3
      };

interface EncoderCallBack
{
    

//    //virtual ~EncoderCallBack() {}
//
//    /** @brief Callback function to signal the start of bitstream that is to be encoded.
//
//    Callback must allocate buffer for CUDA encoder and return pointer to it and it's size.
//     */
//    virtual uchar* acquireBitStream(int* bufferSize) = 0;
//
//    /** @brief Callback function to signal that the encoded bitstream is ready to be written to file.
//    */
//    virtual void releaseBitStream(unsigned char* data, int size) = 0;
//
//    /** @brief Callback function to signal that the encoding operation on the frame has started.
//
//    @param frameNumber
//    @param picType Specify frame type (I-Frame, P-Frame or B-Frame).
//     */
//    virtual void onBeginFrame(int frameNumber, PicType picType) = 0;
//
//    /** @brief Callback function signals that the encoding operation on the frame has finished.
//
//    @param frameNumber
//    @param picType Specify frame type (I-Frame, P-Frame or B-Frame).
//     */
//    virtual void onEndFrame(int frameNumber, PicType picType) = 0;
};

/** @brief Video writer interface.

The implementation uses H264 video codec.

@note Currently only Windows platform is supported.

@note
   -   An example on how to use the videoWriter class can be found at
        opencv_source_code/samples/gpu/video_writer.cpp
 */
export interface VideoWriter
{
//public:
//    virtual ~VideoWriter() {}

    /** @brief Writes the next video frame.

    @param frame The written frame.
    @param lastFrame Indicates that it is end of stream. The parameter can be ignored.

    The method write the specified image to video file. The image must have the same size and the same
    surface format as has been specified when opening the video writer.
     */
    write(frame: _st.InputArray , lastFrame?  : boolean /*= false*/): void;
//
//    virtual EncoderParams getEncoderParams() const = 0;
};

/** @brief Creates video writer.

@param fileName Name of the output video file. Only AVI file format is supported.
@param frameSize Size of the input video frames.
@param fps Framerate of the created video stream.
@param format Surface format of input frames ( SF_UYVY , SF_YUY2 , SF_YV12 , SF_NV12 ,
SF_IYUV , SF_BGR or SF_GRAY). BGR or gray frames will be converted to YV12 format before
encoding, frames with other formats will be used as is.

The constructors initialize video writer. FFMPEG is used to write videos. User can implement own
multiplexing with cudacodec::EncoderCallBack .
 */


interface IcreateVideoWriter{
    (fileName: string, frameSize: _types.Size, fps: _st.double, format?: SurfaceFormat /*= SF_BGR*/): VideoWriter
}

export var createVideoWriter: IcreateVideoWriter = alvision_module.createVideoWriter;

//CV_EXPORTS Ptr<VideoWriter> createVideoWriter(const String& fileName, Size frameSize, double fps, SurfaceFormat format = SF_BGR);
/** @overload
@param fileName Name of the output video file. Only AVI file format is supported.
@param frameSize Size of the input video frames.
@param fps Framerate of the created video stream.
@param params Encoder parameters. See cudacodec::EncoderParams .
@param format Surface format of input frames ( SF_UYVY , SF_YUY2 , SF_YV12 , SF_NV12 ,
SF_IYUV , SF_BGR or SF_GRAY). BGR or gray frames will be converted to YV12 format before
encoding, frames with other formats will be used as is.
*/

interface IcreateVideoWriter{
    (fileName: string, frameSize: _types.Size, fps: _st.double, params: EncoderParams, format?: SurfaceFormat /*= SF_BGR*/): VideoWriter;
}

export var createVideoWriter: IcreateVideoWriter = alvision_module.createVideoWriter;

//CV_EXPORTS Ptr<VideoWriter> createVideoWriter(const String& fileName, Size frameSize, double fps, const EncoderParams& params, SurfaceFormat format = SF_BGR);

/** @overload
@param encoderCallback Callbacks for video encoder. See cudacodec::EncoderCallBack . Use it if you
want to work with raw video stream.
@param frameSize Size of the input video frames.
@param fps Framerate of the created video stream.
@param format Surface format of input frames ( SF_UYVY , SF_YUY2 , SF_YV12 , SF_NV12 ,
SF_IYUV , SF_BGR or SF_GRAY). BGR or gray frames will be converted to YV12 format before
encoding, frames with other formats will be used as is.
*/

interface IcreateVideoWriter{
    (encoderCallback: EncoderCallBack, frameSize: _types.Size, fps: _st.double, format?: SurfaceFormat /*= SF_BGR*/) : VideoWriter;
}

export var createVideoWriter: IcreateVideoWriter = alvision_module.createVideoWriter;

//CV_EXPORTS Ptr<VideoWriter> createVideoWriter(const Ptr<EncoderCallBack>& encoderCallback, Size frameSize, double fps, SurfaceFormat format = SF_BGR);
/** @overload
@param encoderCallback Callbacks for video encoder. See cudacodec::EncoderCallBack . Use it if you
want to work with raw video stream.
@param frameSize Size of the input video frames.
@param fps Framerate of the created video stream.
@param params Encoder parameters. See cudacodec::EncoderParams .
@param format Surface format of input frames ( SF_UYVY , SF_YUY2 , SF_YV12 , SF_NV12 ,
SF_IYUV , SF_BGR or SF_GRAY). BGR or gray frames will be converted to YV12 format before
encoding, frames with other formats will be used as is.
*/

interface IcreateVideoWriter{
    (encoderCallback: EncoderCallBack, frameSize: _types.Size, fps: _st.double, params: EncoderParams, format?: SurfaceFormat /*= SF_BGR*/): VideoWriter;
}
export var createVideoWriter: IcreateVideoWriter = alvision_module.createVideoWriter;

//CV_EXPORTS Ptr<VideoWriter> createVideoWriter(const Ptr<EncoderCallBack>& encoderCallback, Size frameSize, double fps, const EncoderParams& params, SurfaceFormat format = SF_BGR);

////////////////////////////////// Video Decoding //////////////////////////////////////////

/** @brief Video codecs supported by cudacodec::VideoReader .
 */
enum Codec
{
    MPEG1 = 0,
    MPEG2,
    MPEG4,
    VC1,
    H264,
    JPEG,
    H264_SVC,
    H264_MVC,

    Uncompressed_YUV420 = (('I'.charCodeAt(0)<<24)|('Y'.charCodeAt(0)<<16)|('U'.charCodeAt(0)<<8)|('V'.charCodeAt(0))),   //!< Y,U,V (4:2:0)
    Uncompressed_YV12   = (('Y'.charCodeAt(0)<<24)|('V'.charCodeAt(0)<<16)|('1'.charCodeAt(0)<<8)|('2'.charCodeAt(0))),   //!< Y,V,U (4:2:0)
    Uncompressed_NV12   = (('N'.charCodeAt(0)<<24)|('V'.charCodeAt(0)<<16)|('1'.charCodeAt(0)<<8)|('2'.charCodeAt(0))),   //!< Y,UV  (4:2:0)
    Uncompressed_YUYV   = (('Y'.charCodeAt(0)<<24)|('U'.charCodeAt(0)<<16)|('Y'.charCodeAt(0)<<8)|('V'.charCodeAt(0))),   //!< YUYV/YUY2 (4:2:2)
    Uncompressed_UYVY   = (('U'.charCodeAt(0)<<24)|('Y'.charCodeAt(0)<<16)|('V'.charCodeAt(0)<<8)|('Y'.charCodeAt(0)))    //!< UYVY (4:2:2)
};

/** @brief Chroma formats supported by cudacodec::VideoReader .
 */
enum ChromaFormat
{
    Monochrome = 0,
    YUV420,
    YUV422,
    YUV444
};

/** @brief Struct providing information about video file format. :
 */
class FormatInfo
{
    public codec: Codec ;
    public chromaFormat: ChromaFormat ;
    public width: _st.int ;
    public height: _st.int ;
};

/** @brief Video reader interface.

@note
   -   An example on how to use the videoReader class can be found at
        opencv_source_code/samples/gpu/video_reader.cpp
 */
interface VideoReader
{
    //virtual ~VideoReader() {}

    /** @brief Grabs, decodes and returns the next video frame.

    If no frames has been grabbed (there are no more frames in video file), the methods return false .
    The method throws Exception if error occurs.
     */
    nextFrame(frame: _st.OutputArray ) : boolean
//
//    /** @brief Returns information about video file format.
//    */
//    virtual FormatInfo format() const = 0;
};

/** @brief Interface for video demultiplexing. :

User can implement own demultiplexing by implementing this interface.
 */
interface RawVideoSource
{
//public:
//    virtual ~RawVideoSource() {}

    /** @brief Returns next packet with RAW video frame.

    @param data Pointer to frame data.
    @param size Size in bytes of current frame.
    @param endOfFile Indicates that it is end of stream.
     */
//    virtual bool getNextPacket(unsigned char** data, int* size, bool* endOfFile) = 0;
//
//    /** @brief Returns information about video file format.
//    */
//    virtual FormatInfo format() const = 0;
};

/** @brief Creates video reader.

@param filename Name of the input video file.

FFMPEG is used to read videos. User can implement own demultiplexing with cudacodec::RawVideoSource
 */

interface IcreateVideoReader {
    (filename: string): VideoReader;
}

export var createVideoReader: IcreateVideoReader = alvision_module.createVideoReader;

//CV_EXPORTS Ptr<VideoReader> createVideoReader(const String& filename);
/** @overload
@param source RAW video source implemented by user.
*/

interface IcreateVideoReader{
    (source: RawVideoSource) : VideoReader;
}

export var createVideoReader: IcreateVideoReader = alvision_module.createVideoReader;
//CV_EXPORTS Ptr<VideoReader> createVideoReader(const Ptr<RawVideoSource>& source);

//! @}

}
//} // namespace cv { namespace cudacodec {

//#endif /* __OPENCV_CUDACODEC_HPP__ */
