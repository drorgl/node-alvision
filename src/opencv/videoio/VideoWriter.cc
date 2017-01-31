#include "VideoWriter.h"
#include "../types/Size.h"

namespace videowriter_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("videowriter_general_callback is empty");
		}
		return overload->execute("videowriter", info);
	}
}


Nan::Persistent<FunctionTemplate> VideoWriter::constructor;


void
VideoWriter::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	

	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(videowriter_general_callback::callback);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("VideoWriter").ToLocalChecked());

	overload->register_type<VideoWriter>(ctor, "videowriter", "VideoWriter");




	//class IVideoWriter;

	/** @brief Video writer class.
	*/

	//interface VideoWriterStatic {
		//    /** @brief VideoWriter constructors
		//
		//    The constructors/functions initialize video writers. On Linux FFMPEG is used to write videos; on
		//    Windows FFMPEG or VFW is used; on MacOSX QTKit is used.
		//     */
	overload->addOverloadConstructor("videowriter", "VideoWriter", {},New );
		//new () : VideoWriter;
		//
		//    /** @overload
		//    @param filename Name of the output video file.
		//    @param fourcc 4-character code of codec used to compress the frames. For example,
		//    VideoWriter::fourcc('P','I','M','1') is a MPEG-1 codec, VideoWriter::fourcc('M','J','P','G') is a
		//    motion-jpeg codec etc. List of codes can be obtained at [Video Codecs by
		//    FOURCC](http://www.fourcc.org/codecs.php) page. FFMPEG backend with MP4 container natively uses
		//    other values as fourcc code: see [ObjectType](http://www.mp4ra.org/codecs.html),
		//    so you may receive a warning message from OpenCV about fourcc code conversion.
		//    @param fps Framerate of the created video stream.
		//    @param frameSize Size of the video frames.
		//    @param isColor If it is not zero, the encoder will expect and encode color frames, otherwise it
		//    will work with grayscale frames (the flag is currently supported on Windows only).
		//    */
		overload->addOverloadConstructor("videowriter", "VideoWriter", {
			make_param<std::string>("filename","String"),
			make_param<int>("fourcc","int"),
			make_param<double>("fps","double"),
			make_param<Size*>("frameSize",Size::name),
			make_param<bool>("isColor","bool", true)
		},New_filename );
		//new (filename : string, fourcc : _st.int, fps : _st.double,
		//	frameSize : _types.Size, isColor ? : boolean /* = true*/) : VideoWriter;
		//
		//    virtual ~VideoWriter();
		//    /** @brief Concatenates 4 chars to a fourcc code
		//
		//    This static method constructs the fourcc code of the codec to be used in the constructor
		//    VideoWriter::VideoWriter or VideoWriter::open.
		//     */
		overload->addStaticOverload("videowriter", "VideoWriter","fourcc", {
			make_param<std::string>("c1","char"),
			make_param<std::string>("c2","char"),
			make_param<std::string>("c3","char"),
			make_param<std::string>("c4","char")
		}, fourcc);
		Nan::SetMethod(ctor, "fourcc", videowriter_general_callback::callback);
		//fourcc(c1: _st.char, c2 : _st.char,
		//	c3 : _st.char, c4 : _st.char) : _st.int;
		//    static Ptr<IVideoWriter> create(const String& filename, int fourcc, double fps,
		//                                    Size frameSize, bool isColor = true);

	//}

	//interface VideoWriter
	//{
		//public:

		//
		//    /** @brief Initializes or reinitializes video writer.
		//
		//    The method opens video writer. Parameters are the same as in the constructor
		//    VideoWriter::VideoWriter.
		//     */
		//    CV_WRAP virtual bool open(const String& filename, int fourcc, double fps,
		//                      Size frameSize, bool isColor = true);
		//
		/** @brief Returns true if video writer has been successfully initialized.
		*/
		overload->addOverload("videowriter", "VideoWriter", "isOpened", {}, isOpened);
		Nan::SetPrototypeMethod(ctor, "isOpened", videowriter_general_callback::callback);
		//isOpened() : boolean;

		/** @brief Closes the video writer.

		The methods are automatically called by subsequent VideoWriter::open and by the VideoWriter
		destructor.
		*/
		overload->addOverload("videowriter", "VideoWriter", "release", {}, release);
		Nan::SetPrototypeMethod(ctor, "release", videowriter_general_callback::callback);
		//release() : void;
		//    virtual VideoWriter& operator << (const Mat& image);
		//
		/** @brief Writes the next video frame

		@param image The written frame

		The functions/methods write the specified image to video file. It must have the same size as has
		been specified when opening the video writer.
		*/
		overload->addOverload("videowriter", "VideoWriter", "write", {
			make_param<Matrix*>("image","Mat")
		}, write);
		Nan::SetPrototypeMethod(ctor, "write", videowriter_general_callback::callback);
		//write(image : _mat.Mat) : void;
		//
		//    /** @brief Sets a property in the VideoWriter.
		//
		//     @param propId Property identifier. It can be one of the following:
		//     -   **VIDEOWRITER_PROP_QUALITY** Quality (0..100%) of the videostream encoded. Can be adjusted dynamically in some codecs.
		//     -   **VIDEOWRITER_PROP_NSTRIPES** Number of stripes for parallel encoding
		//     @param value Value of the property.
		//     */
		overload->addOverload("videowriter", "VideoWriter", "set", {
			make_param<int>("propId","int"),
			make_param<double>("value","double")
		}, set);
		Nan::SetPrototypeMethod(ctor, "set", videowriter_general_callback::callback);
		//    CV_WRAP virtual bool set(int propId, double value);
		//
		//    /** @brief Returns the specified VideoWriter property
		//
		//     @param propId Property identifier. It can be one of the following:
		//     -   **VIDEOWRITER_PROP_QUALITY** Current quality of the encoded videostream.
		//     -   **VIDEOWRITER_PROP_FRAMEBYTES** (Read-only) Size of just encoded video frame; note that the encoding order may be different from representation order.
		//     -   **VIDEOWRITER_PROP_NSTRIPES** Number of stripes for parallel encoding
		//
		//     @note When querying a property that is not supported by the backend used by the VideoWriter
		//     class, value 0 is returned.
		//     */
		overload->addOverload("videowriter", "VideoWriter", "get", {
			make_param<int>("propId","int")
		}, get);
		Nan::SetPrototypeMethod(ctor, "get", videowriter_general_callback::callback);
		//    CV_WRAP virtual double get(int propId) const;
		//
		//
		//protected:
		//    Ptr<CvVideoWriter> writer;
		//    Ptr<IVideoWriter> iwriter;
		//
	//};
	//
	//
	//export var VideoWriter : VideoWriterStatic = alvision_module.VideoWriter;

	//template<> CV_EXPORTS void DefaultDeleter<CvCapture>::operator ()(CvCapture* obj) const;
	//template<> CV_EXPORTS void DefaultDeleter<CvVideoWriter>::operator ()(CvVideoWriter* obj) const;

	//! @} videoio

	//} // cv
	//
	//#endif //__OPENCV_VIDEOIO_HPP__


	

	target->Set(Nan::New("VideoWriter").ToLocalChecked(), ctor->GetFunction());

	
};

v8::Local<v8::Function> VideoWriter::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}




POLY_METHOD(VideoWriter::New) {
	auto videowriter = new VideoWriter();
	videowriter->_videoWriter = std::make_shared<cv::VideoWriter>();

	videowriter->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(VideoWriter::New_filename) {

	auto filename = info.at<std::string>(0);
	auto fourcc = info.at<int>(1);
	auto fps = info.at<double>(2);
	auto frameSize = info.at<Size*>(3)->_size;
	auto isColor = info.at<bool>(4);


	auto videowriter = new VideoWriter();
	videowriter->_videoWriter = std::make_shared<cv::VideoWriter>(filename, fourcc, fps, *frameSize, isColor);

	videowriter->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(VideoWriter::fourcc) {
	auto c1 = info.at<std::string>(0);
	auto c2 = info.at<std::string>(1);
	auto c3 = info.at<std::string>(2);
	auto c4 = info.at<std::string>(3);

	if (c1.size() != 1 || c2.size() != 1 || c3.size() != 1 || c4.size() != 1) {
		throw std::exception("c1-c4 must be one character");
	}

	auto res = cv::VideoWriter::fourcc(c1[0], c2[0], c3[0], c4[0]);

	info.SetReturnValue(res);
}
POLY_METHOD(VideoWriter::isOpened) {
	auto this_ = info.This<VideoWriter*>();

	info.SetReturnValue(this_->_videoWriter->isOpened());

}
POLY_METHOD(VideoWriter::release) {
	auto this_ = info.This<VideoWriter*>();
	this_->_videoWriter->release();
}
POLY_METHOD(VideoWriter::write) {
	auto this_ = info.This<VideoWriter*>();

	auto mat = info.at<Matrix*>(0)->_mat;

	this_->_videoWriter->write(*mat);
}
POLY_METHOD(VideoWriter::set) {
	auto this_ = info.This<VideoWriter*>();

	auto propId = info.at<int>(0);
	auto value = info.at<double>(1);

	auto res = this_->_videoWriter->set(propId, value);
	info.SetReturnValue(res);
}
POLY_METHOD(VideoWriter::get) {
	auto this_ = info.This<VideoWriter*>();

	auto propId = info.at<int>(0);

	auto res = this_->_videoWriter->get(propId);
	info.SetReturnValue(res);
}