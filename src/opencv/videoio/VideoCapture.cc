#include "VideoCapture.h"

#include "../IOArray.h"


namespace videocapture_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("videocapture_general_callback is empty");
		}
		return overload->execute("videocapture", info);
	}
}


Nan::Persistent<FunctionTemplate> VideoCapture::constructor;


void
VideoCapture::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	videocapture_general_callback::overload = overload;

	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(videocapture_general_callback::callback);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("VideoCapture").ToLocalChecked());

	overload->register_type<VideoCapture>(ctor, "videocapture", "VideoCapture");







	//enum {

	//class IVideoCapture;

	/** @brief Class for video capturing from video files, image sequences or cameras. The class provides C++ API
	for capturing video from cameras or for reading video files and image sequences. Here is how the
	class can be used: :
	@code
	#include "opencv2/opencv.hpp"

	using namespace cv;

	int main(int, char**)
	{
	VideoCapture cap(0); // open the default camera
	if(!cap.isOpened())  // check if we succeeded
	return -1;

	Mat edges;
	namedWindow("edges",1);
	for(;;)
	{
	Mat frame;
	cap >> frame; // get a new frame from camera
	cvtColor(frame, edges, COLOR_BGR2GRAY);
	GaussianBlur(edges, edges, Size(7,7), 1.5, 1.5);
	Canny(edges, edges, 0, 30, 3);
	imshow("edges", edges);
	if(waitKey(30) >= 0) break;
	}
	// the camera will be deinitialized automatically in VideoCapture destructor
	return 0;
	}
	@endcode
	@note In C API the black-box structure CvCapture is used instead of VideoCapture.

	@note
	-   A basic sample on using the VideoCapture interface can be found at
	opencv_source_code/samples/cpp/starter_video.cpp
	-   Another basic video processing sample can be found at
	opencv_source_code/samples/cpp/video_dmtx.cpp
	-   (Python) A basic sample on using the VideoCapture interface can be found at
	opencv_source_code/samples/python/video.py
	-   (Python) Another basic video processing sample can be found at
	opencv_source_code/samples/python/video_dmtx.py
	-   (Python) A multi threaded video processing sample can be found at
	opencv_source_code/samples/python/video_threaded.py
	*/

	//interface VideoCaptureStatic {
		/** @brief
		@note In C API, when you finished working with video, release CvCapture structure with
		cvReleaseCapture(), or use Ptr\<CvCapture\> that calls cvReleaseCapture() automatically in the
		destructor.
		*/
	overload->addOverloadConstructor("videocapture", "VideoCapture", {}, New);
		//new() : VideoCapture


			/** @overload
			@param filename name of the opened video file (eg. video.avi) or image sequence (eg.
			img_%02d.jpg, which will read samples like img_00.jpg, img_01.jpg, img_02.jpg, ...)
			*/
	overload->addOverloadConstructor("videocapture", "VideoCapture", {
		make_param<std::string>("filename","String")
	}, New_filename);
			//new (filename : string) : VideoCapture

			/** @overload
			@param filename name of the opened video file (eg. video.avi) or image sequence (eg.
			img_%02d.jpg, which will read samples like img_00.jpg, img_01.jpg, img_02.jpg, ...)

			@param apiPreference preferred Capture API to use. Can be used to enforce a specific reader
			implementation if multiple are available: e.g. CAP_FFMPEG or CAP_IMAGES
			*/
	overload->addOverloadConstructor("videocapture", "VideoCapture", {
		make_param<std::string>("filename","String"),
		make_param<int>("apiPreference","int")
	}, New_filename_apiPreference);

			//new (filename : string, apiPreference : _st.int) : VideoCapture;

		/** @overload
		@param index = camera_id + domain_offset (CAP_*). id of the video capturing device to open. If there is a single
		camera connected, just pass 0. Advanced Usage: to open Camera 1 using the MS Media Foundation API: index = 1 + CAP_MSMF
		*/
	overload->addOverloadConstructor("videocapture", "VideoCapture", {
		make_param<int>("index","int")
	}, New_index);

		//new (index : _st.int) : VideoCapture;

		//virtual ~VideoCapture();
	//}

	//export interface VideoCapture
	//{
		//public:


		/** @brief Open video file or a capturing device for video capturing

		@param filename name of the opened video file (eg. video.avi) or image sequence (eg.
		img_%02d.jpg, which will read samples like img_00.jpg, img_01.jpg, img_02.jpg, ...)

		The methods first call VideoCapture::release to close the already opened file or camera.
		*/
	overload->addOverload("videocapture", "VideoCapture", "open", {
		make_param<std::string>("filename","String")
	}, open_filename);
	Nan::SetPrototypeMethod(ctor, "open", videocapture_general_callback::callback);
		//open(filename : string) : boolean;

		/** @overload
		@param index = camera_id + domain_offset (CAP_*). id of the video capturing device to open. If there is a single
		camera connected, just pass 0. Advanced Usage: to open Camera 1 using the MS Media Foundation API: index = 1 + CAP_MSMF
		*/
		overload->addOverload("videocapture", "VideoCapture", "open", {
			make_param<int>("index","int")
		},open_index );
		Nan::SetPrototypeMethod(ctor, "open", videocapture_general_callback::callback);
		//open(index: _st.int) : boolean;

		/** @brief Returns true if video capturing has been initialized already.

		If the previous call to VideoCapture constructor or VideoCapture::open succeeded, the method returns
		true.
		*/
		overload->addOverload("videocapture", "VideoCapture", "isOpened", {}, isOpened);
		Nan::SetPrototypeMethod(ctor, "isOpened", videocapture_general_callback::callback);
		//isOpened() : boolean;

		/** @brief Closes video file or capturing device.

		The methods are automatically called by subsequent VideoCapture::open and by VideoCapture
		destructor.

		The C function also deallocates memory and clears \*capture pointer.
		*/
		overload->addOverload("videocapture", "VideoCapture", "release", {}, release);
		Nan::SetPrototypeMethod(ctor, "release", videocapture_general_callback::callback);
		//release() : void;

		/** @brief Grabs the next frame from video file or capturing device.

		The methods/functions grab the next frame from video file or camera and return true (non-zero) in
		the case of success.

		The primary use of the function is in multi-camera environments, especially when the cameras do not
		have hardware synchronization. That is, you call VideoCapture::grab() for each camera and after that
		call the slower method VideoCapture::retrieve() to decode and get frame from each camera. This way
		the overhead on demosaicing or motion jpeg decompression etc. is eliminated and the retrieved frames
		from different cameras will be closer in time.

		Also, when a connected camera is multi-head (for example, a stereo camera or a Kinect device), the
		correct way of retrieving data from it is to call VideoCapture::grab first and then call
		VideoCapture::retrieve one or more times with different values of the channel parameter. See
		<https://github.com/Itseez/opencv/tree/master/samples/cpp/openni_capture.cpp>
		*/
		overload->addOverload("videocapture", "VideoCapture", "grab", {}, grab);
		Nan::SetPrototypeMethod(ctor, "grab", videocapture_general_callback::callback);
		//grab() : boolean;

		/** @brief Decodes and returns the grabbed video frame.

		The methods/functions decode and return the just grabbed frame. If no frames has been grabbed
		(camera has been disconnected, or there are no more frames in video file), the methods return false
		and the functions return NULL pointer.

		@note OpenCV 1.x functions cvRetrieveFrame and cv.RetrieveFrame return image stored inside the video
		capturing structure. It is not allowed to modify or release the image! You can copy the frame using
		:ocvcvCloneImage and then do whatever you want with the copy.
		*/
		overload->addOverload("videocapture", "VideoCapture", "retrieve", {
			make_param<IOArray*>("image","IOArray"),
			make_param<int>("flag","int",0)
		}, retrieve);
		Nan::SetPrototypeMethod(ctor, "retrieve", videocapture_general_callback::callback);
		//retrieve(image: _st.OutputArray, flag ? : _st.int /* = 0*/) : boolean;
		//virtual VideoCapture& operator >> (CV_OUT Mat& image);
		//virtual VideoCapture& operator >> (CV_OUT UMat& image);

		/** @brief Grabs, decodes and returns the next video frame.

		The methods/functions combine VideoCapture::grab and VideoCapture::retrieve in one call. This is the
		most convenient method for reading video files or capturing data from decode and return the just
		grabbed frame. If no frames has been grabbed (camera has been disconnected, or there are no more
		frames in video file), the methods return false and the functions return NULL pointer.

		@note OpenCV 1.x functions cvRetrieveFrame and cv.RetrieveFrame return image stored inside the video
		capturing structure. It is not allowed to modify or release the image! You can copy the frame using
		:ocvcvCloneImage and then do whatever you want with the copy.
		*/
		overload->addOverload("videocapture", "VideoCapture", "read", {
			make_param<IOArray*>("image","IOArray")
		}, read);
		Nan::SetPrototypeMethod(ctor, "read", videocapture_general_callback::callback);
		//read(image: _st.OutputArray) : boolean;

		/** @brief Sets a property in the VideoCapture.

		@param propId Property identifier. It can be one of the following:
		-   **CAP_PROP_POS_MSEC** Current position of the video file in milliseconds.
		-   **CAP_PROP_POS_FRAMES** 0-based index of the frame to be decoded/captured next.
		-   **CAP_PROP_POS_AVI_RATIO** Relative position of the video file: 0 - start of the
		film, 1 - end of the film.
		-   **CAP_PROP_FRAME_WIDTH** Width of the frames in the video stream.
		-   **CAP_PROP_FRAME_HEIGHT** Height of the frames in the video stream.
		-   **CAP_PROP_FPS** Frame rate.
		-   **CAP_PROP_FOURCC** 4-character code of codec.
		-   **CAP_PROP_FRAME_COUNT** Number of frames in the video file.
		-   **CAP_PROP_FORMAT** Format of the Mat objects returned by retrieve() .
		-   **CAP_PROP_MODE** Backend-specific value indicating the current capture mode.
		-   **CAP_PROP_BRIGHTNESS** Brightness of the image (only for cameras).
		-   **CAP_PROP_CONTRAST** Contrast of the image (only for cameras).
		-   **CAP_PROP_SATURATION** Saturation of the image (only for cameras).
		-   **CAP_PROP_HUE** Hue of the image (only for cameras).
		-   **CAP_PROP_GAIN** Gain of the image (only for cameras).
		-   **CAP_PROP_EXPOSURE** Exposure (only for cameras).
		-   **CAP_PROP_CONVERT_RGB** Boolean flags indicating whether images should be converted
		to RGB.
		-   **CAP_PROP_WHITE_BALANCE** Currently unsupported
		-   **CAP_PROP_RECTIFICATION** Rectification flag for stereo cameras (note: only supported
		by DC1394 v 2.x backend currently)
		@param value Value of the property.
		*/
		overload->addOverload("videocapture", "VideoCapture", "set", {
			make_param<int>("propId","CAP_PROP"),
			make_param<double>("value","double")
		}, set);
		Nan::SetPrototypeMethod(ctor, "set", videocapture_general_callback::callback);
		//set(propId: CAP_PROP | _st.int, value : _st.double) : boolean;

		/** @brief Returns the specified VideoCapture property

		@param propId Property identifier. It can be one of the following:
		-   **CAP_PROP_POS_MSEC** Current position of the video file in milliseconds or video
		capture timestamp.
		-   **CAP_PROP_POS_FRAMES** 0-based index of the frame to be decoded/captured next.
		-   **CAP_PROP_POS_AVI_RATIO** Relative position of the video file: 0 - start of the
		film, 1 - end of the film.
		-   **CAP_PROP_FRAME_WIDTH** Width of the frames in the video stream.
		-   **CAP_PROP_FRAME_HEIGHT** Height of the frames in the video stream.
		-   **CAP_PROP_FPS** Frame rate.
		-   **CAP_PROP_FOURCC** 4-character code of codec.
		-   **CAP_PROP_FRAME_COUNT** Number of frames in the video file.
		-   **CAP_PROP_FORMAT** Format of the Mat objects returned by retrieve() .
		-   **CAP_PROP_MODE** Backend-specific value indicating the current capture mode.
		-   **CAP_PROP_BRIGHTNESS** Brightness of the image (only for cameras).
		-   **CAP_PROP_CONTRAST** Contrast of the image (only for cameras).
		-   **CAP_PROP_SATURATION** Saturation of the image (only for cameras).
		-   **CAP_PROP_HUE** Hue of the image (only for cameras).
		-   **CAP_PROP_GAIN** Gain of the image (only for cameras).
		-   **CAP_PROP_EXPOSURE** Exposure (only for cameras).
		-   **CAP_PROP_CONVERT_RGB** Boolean flags indicating whether images should be converted
		to RGB.
		-   **CAP_PROP_WHITE_BALANCE** Currently not supported
		-   **CAP_PROP_RECTIFICATION** Rectification flag for stereo cameras (note: only supported
		by DC1394 v 2.x backend currently)

		@note When querying a property that is not supported by the backend used by the VideoCapture
		class, value 0 is returned.
		*/
		overload->addOverload("videocapture", "VideoCapture", "get", {
			make_param<int>("propId","CAP_PROP")
		}, get);
		Nan::SetPrototypeMethod(ctor, "get", videocapture_general_callback::callback);
		//get(propId: _st.int | CAP_PROP) : _st.double;

		/** @overload

		@param filename name of the opened video file (eg. video.avi) or image sequence (eg.
		img_%02d.jpg, which will read samples like img_00.jpg, img_01.jpg, img_02.jpg, ...)

		@param apiPreference preferred Capture API to use. Can be used to enforce a specific reader
		implementation if multiple are available: e.g. CAP_FFMPEG or CAP_IMAGES

		The methods first call VideoCapture::release to close the already opened file or camera.
		*/
		overload->addOverload("videocapture", "VideoCapture", "open", {
			make_param<std::string>("filename","String"),
			make_param<int>("apiPreference","int")
		}, open);
		Nan::SetPrototypeMethod(ctor, "open", videocapture_general_callback::callback);
		//open(filename: string, apiPreference : _st.int) : boolean;

		//protected:
		//    Ptr<CvCapture> cap;
		//    Ptr<IVideoCapture> icap;
	//};

	//export var VideoCapture : VideoCaptureStatic = alvision_module.VideoCapture;








	target->Set(Nan::New("VideoCapture").ToLocalChecked(), ctor->GetFunction());

	
};

v8::Local<v8::Function> VideoCapture::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}



POLY_METHOD(VideoCapture::New) {
	auto videocap = new VideoCapture();
	videocap->_VideoCapture = std::make_shared<cv::VideoCapture>();

	videocap->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(VideoCapture::New_filename) {
	auto filename = info.at<std::string>(0);

	auto videocap = new VideoCapture();
	videocap->_VideoCapture = std::make_shared<cv::VideoCapture>(filename);

	videocap->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(VideoCapture::New_filename_apiPreference) {
	auto filename = info.at<std::string>(0);
	auto apiPreference = info.at<int>(1);

	auto videocap = new VideoCapture();
	videocap->_VideoCapture = std::make_shared<cv::VideoCapture>(filename,apiPreference);

	videocap->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(VideoCapture::New_index) {
	auto index = info.at<int>(0);

	auto videocap = new VideoCapture();
	videocap->_VideoCapture = std::make_shared<cv::VideoCapture>(index);

	videocap->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(VideoCapture::open_filename) {
	auto filename = info.at<std::string>(0);

	auto this_ = info.This<VideoCapture*>();
	auto result = this_->_VideoCapture->open(filename);

	info.SetReturnValue(result);
}
POLY_METHOD(VideoCapture::open_index) {
	auto index = info.at<int>(0);

	auto this_ = info.This<VideoCapture*>();
	auto result = this_->_VideoCapture->open(index);

	info.SetReturnValue(result);
}
POLY_METHOD(VideoCapture::isOpened) {
	auto this_ = info.This<VideoCapture*>();
	auto result = this_->_VideoCapture->isOpened();

	info.SetReturnValue(result);
}
POLY_METHOD(VideoCapture::release) {
	auto this_ = info.This<VideoCapture*>();
	this_->_VideoCapture->release();
}
POLY_METHOD(VideoCapture::grab) {
	auto this_ = info.This<VideoCapture*>();
	auto result = this_->_VideoCapture->grab();

	info.SetReturnValue(result);
}
POLY_METHOD(VideoCapture::retrieve) {
	auto image = info.at<IOArray*>(0)->GetOutputArray();
	auto flag = info.at<int>(1);

	auto this_ = info.This<VideoCapture*>();
	auto result = this_->_VideoCapture->retrieve(image,flag);

	info.SetReturnValue(result);
}
POLY_METHOD(VideoCapture::read) {
	auto image = info.at<IOArray*>(0)->GetOutputArray();

	auto this_ = info.This<VideoCapture*>();
	auto result = this_->_VideoCapture->read(image);

	info.SetReturnValue(result);
}
POLY_METHOD(VideoCapture::set) {
	auto propId = info.at<int>(0);
	auto value = info.at<double>(1);

	auto this_ = info.This<VideoCapture*>();
	auto result = this_->_VideoCapture->set(propId,value);

	info.SetReturnValue(result);
}
POLY_METHOD(VideoCapture::get) {
	auto propId = info.at<int>(0);

	auto this_ = info.This<VideoCapture*>();
	auto result = this_->_VideoCapture->get(propId);

	info.SetReturnValue(result);
}
POLY_METHOD(VideoCapture::open) {
	auto filename = info.at<std::string>(0);
	auto apiPreference = info.at<int>(1);

	auto this_ = info.This<VideoCapture*>();
	auto result = this_->_VideoCapture->open(filename, apiPreference);

	info.SetReturnValue(result);
}

