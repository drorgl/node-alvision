#include "Buffer.h"


namespace buffer_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("buffer_general_callback is empty");
		}
		return overload->execute("buffer", info);
	}
}

Nan::Persistent<FunctionTemplate> Buffer::constructor;

std::string Buffer::name;

void
Buffer::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	name = "ogl::Buffer";
	buffer_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(buffer_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New(name).ToLocalChecked());
	ctor->Inherit(Nan::New(IOArray::constructor));

	overload->register_type<Buffer>(ctor, "buffer", name);


//	interface BufferStatic {
//		/** @brief The constructors.
//
//		Creates empty ogl::Buffer object, creates ogl::Buffer object from existed buffer ( abufId
//		parameter), allocates memory for ogl::Buffer object or copies from host/device memory.
//		*/
//		new () : Buffer;
//
//		/** @overload
//		@param arows Number of rows in a 2D array.
//		@param acols Number of columns in a 2D array.
//		@param atype Array type ( CV_8UC1, ..., CV_64FC4 ). See Mat for details.
//		@param abufId Buffer object name.
//		@param autoRelease Auto release mode (if true, release will be called in object's destructor).
//		*/
//		new (arows: _st.int, acols : _st.int, atype : _st.int, abufId : _st.uint, autoRelease ? : boolean /*= //false*/) : Buffer;
//
//		/** @overload
//		@param asize 2D array size.
//		@param atype Array type ( CV_8UC1, ..., CV_64FC4 ). See Mat for details.
//		@param abufId Buffer object name.
//		@param autoRelease Auto release mode (if true, release will be called in object's destructor).
//		*/
//		new (asize: _types.Size, atype : _st.int, abufId : _st.uint, autoRelease : boolean /*= false*/) : Buffer;
//
//		/** @overload
//		@param arows Number of rows in a 2D array.
//		@param acols Number of columns in a 2D array.
//		@param atype Array type ( CV_8UC1, ..., CV_64FC4 ). See Mat for details.
//		@param target Buffer usage. See cv::ogl::Buffer::Target .
//		@param autoRelease Auto release mode (if true, release will be called in object's destructor).
//		*/
//		new (arows: _st.int, acols : _st.int, atype : _st.int, target ? : BufferTarget  /*= ARRAY_BUFFER*/, //autoRelease ? : boolean/*= false*/) : Buffer;
//
//		/** @overload
//		@param asize 2D array size.
//		@param atype Array type ( CV_8UC1, ..., CV_64FC4 ). See Mat for details.
//		@param target Buffer usage. See cv::ogl::Buffer::Target .
//		@param autoRelease Auto release mode (if true, release will be called in object's destructor).
//		*/
//		new (asize: _types.Size, atype : _st.int, target ? : BufferTarget /*= ARRAY_BUFFER*/, autoRelease ? : //boolean /*= false*/) : Buffer;
//
//		/** @overload
//		@param arr Input array (host or device memory, it can be Mat , cuda::GpuMat or std::vector ).
//		@param target Buffer usage. See cv::ogl::Buffer::Target .
//		@param autoRelease Auto release mode (if true, release will be called in object's destructor).
//		*/
//		new (arr: _st.InputArray, target ? : BufferTarget /*= ARRAY_BUFFER*/, autoRelease ? : boolean /*= false*/) : //Buffer;
//
//	}
//
//	interface Buffer extends _st.IOArray
//	{
//		//public:
//		//    /** @brief The target defines how you intend to use the buffer object.
//		//    */
//
//		//
//		//
//		/** @brief Allocates memory for ogl::Buffer object.
//
//		@param arows Number of rows in a 2D array.
//		@param acols Number of columns in a 2D array.
//		@param atype Array type ( CV_8UC1, ..., CV_64FC4 ). See Mat for details.
//		@param target Buffer usage. See cv::ogl::Buffer::Target .
//		@param autoRelease Auto release mode (if true, release will be called in object's destructor).
//		*/
//		create(arows: _st.int, acols : _st.int, atype : _st.int, target ? : BufferTarget /*= //ARRAY_BUFFER*/,autoRelease ? : boolean /*= false*/) : void;
//
//	/** @overload
//	@param asize 2D array size.
//	@param atype Array type ( CV_8UC1, ..., CV_64FC4 ). See Mat for details.
//	@param target Buffer usage. See cv::ogl::Buffer::Target .
//	@param autoRelease Auto release mode (if true, release will be called in object's destructor).
//	*/
//	create(asize: _types.Size, atype : _st.int , target ? : BufferTarget /*= ARRAY_BUFFER*/, autoRelease ? : /boolean //*= false*/) : void;
//
//	/** @brief Decrements the reference counter and destroys the buffer object if needed.
//
//	The function will call setAutoRelease(true) .
//	*/
//	release() : void;
//
//	/** @brief Sets auto release mode.
//
//	The lifetime of the OpenGL object is tied to the lifetime of the context. If OpenGL context was
//	bound to a window it could be released at any time (user can close a window). If object's destructor
//	is called after destruction of the context it will cause an error. Thus ogl::Buffer doesn't destroy
//	OpenGL object in destructor by default (all OpenGL resources will be released with OpenGL context).
//	This function can force ogl::Buffer destructor to destroy OpenGL object.
//	@param flag Auto release mode (if true, release will be called in object's destructor).
//	*/
//	setAutoRelease(flag : boolean) : void;
//
//	/** @brief Copies from host/device memory to OpenGL buffer.
//	@param arr Input array (host or device memory, it can be Mat , cuda::GpuMat or std::vector ).
//	@param target Buffer usage. See cv::ogl::Buffer::Target .
//	@param autoRelease Auto release mode (if true, release will be called in object's destructor).
//	*/
//	copyFrom(arr: _st.InputArray, target ? : BufferTarget /*= ARRAY_BUFFER*/, autoRelease ? : boolean /*= false*/) : //void;
//
//	/** @overload */
//	//copyFrom(arr: _st.InputArray, stream: cuda::Stream& , target?: BufferTarget /*= ARRAY_BUFFER*/, autoRelease? : //boolean /*= false*/): void;
//	//
//	/** @brief Copies from OpenGL buffer to host/device memory or another OpenGL buffer object.
//
//	@param arr Destination array (host or device memory, can be Mat , cuda::GpuMat , std::vector or
//	ogl::Buffer ).
//	*/
//	copyTo(arr: _st.OutputArray) : void;
//
//	/** @overload */
//	//copyTo(arr: _st.OutputArray, stream: cuda::Stream): void;
//
//	/** @brief Creates a full copy of the buffer object and the underlying data.
//
//	@param target Buffer usage for destination buffer.
//	@param autoRelease Auto release mode for destination buffer.
//	*/
//	clone(target ? : BufferTarget /* = ARRAY_BUFFER*/, autoRelease ? : boolean/* = false*/) : Buffer;
//	//
//	//    /** @brief Binds OpenGL buffer to the specified buffer binding point.
//	//
//	//    @param target Binding point. See cv::ogl::Buffer::Target .
//	//     */
//	//    void bind(Target target) const;
//	//
//	//    /** @brief Unbind any buffers from the specified binding point.
//	//
//	//    @param target Binding point. See cv::ogl::Buffer::Target .
//	//     */
//	//    static void unbind(Target target);
//	//
//	/** @brief Maps OpenGL buffer to host memory.
//
//	mapHost maps to the client's address space the entire data store of the buffer object. The data can
//	then be directly read and/or written relative to the returned pointer, depending on the specified
//	access policy.
//
//	A mapped data store must be unmapped with ogl::Buffer::unmapHost before its buffer object is used.
//
//	This operation can lead to memory transfers between host and device.
//
//	Only one buffer object can be mapped at a time.
//	@param access Access policy, indicating whether it will be possible to read from, write to, or both
//	read from and write to the buffer object's mapped data store. The symbolic constant must be
//	ogl::Buffer::READ_ONLY , ogl::Buffer::WRITE_ONLY or ogl::Buffer::READ_WRITE .
//	*/
//	mapHost(access: BufferAccess) : _mat.Mat
//
//		/** @brief Unmaps OpenGL buffer.
//		*/
//		unmapHost() : void;
//
//	//! map to device memory (blocking)
//	mapDevice() : _cuda.cuda.GpuMat
//		unmapDevice() : void;
//	//
//	//    /** @brief Maps OpenGL buffer to CUDA device memory.
//	//
//	//    This operatation doesn't copy data. Several buffer objects can be mapped to CUDA memory at a time.
//	//
//	//    A mapped data store must be unmapped with ogl::Buffer::unmapDevice before its buffer object is used.
//	//     */
//	//    cuda::GpuMat mapDevice(cuda::Stream& stream);
//	//
//	//    /** @brief Unmaps OpenGL buffer.
//	//    */
//	//    void unmapDevice(cuda::Stream& stream);
//	//
//	rows() : _st.int;
//	cols() : _st.int;
//	size() : _types.Size;
//	empty() : boolean;
//
//	type() : _st.int;
//	depth() : _st.int;
//	channels() : _st.int;
//	elemSize() : _st.int;
//	elemSize1() : _st.int;
//
//	//! get OpenGL opject id
//	bufId() : _st.uint;
//	//
//	//    class Impl;
//	//
//	//private:
//	//    Ptr<Impl> impl_;
//	//    int rows_;
//	//    int cols_;
//	//    int type_;
//	};
//
//	export var Buffer : BufferStatic = alvision_module.Buffer;

}

v8::Local<v8::Function> Buffer::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}