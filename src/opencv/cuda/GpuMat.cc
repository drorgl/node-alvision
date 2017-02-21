#include "GpuMat.h"
#include "../types/Size.h"
#include "../types/Rect.h"
#include "../types/Scalar.h"
#include "../types/Range.h"
#include "CudaStream.h"
//#ifdef HAVE_CUDA

namespace gpumat_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("gpumat_general_callback is empty");
		}
		return overload->execute("gpumat", info);
	}
}
namespace cuda {

	Nan::Persistent<FunctionTemplate> GpuMat::constructor;

	std::string GpuMat::name;

	void
		GpuMat::Register(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
		GpuMat::name = "GpuMat";
		gpumat_general_callback::overload = overload;
	}

	void
		GpuMat::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
		

		//Class
		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(gpumat_general_callback::callback);
		constructor.Reset(ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New("GpuMat").ToLocalChecked());
		ctor->Inherit(Nan::New(IOArray::constructor));

		overload->register_type<GpuMat>(ctor, "gpumat", "GpuMat");








		//! @addtogroup cudacore_struct
		//! @{

		//===================================================================================
		// GpuMat
		//===================================================================================

		/** @brief Base storage class for GPU memory with reference counting.

		Its interface matches the Mat interface with the following limitations:

		-   no arbitrary dimensions support (only 2D)
		-   no functions that return references to their data (because references on GPU are not valid for
		CPU)
		-   no expression templates technique support

		Beware that the latter limitation may lead to overloaded matrix operators that cause memory
		allocations. The GpuMat class is convertible to cuda::PtrStepSz and cuda::PtrStep so it can be
		passed directly to the kernel.

		@note In contrast with Mat, in most cases GpuMat::isContinuous() == false . This means that rows are
		aligned to a size depending on the hardware. Single-row GpuMat is always a continuous matrix.

		@note You are not recommended to leave static or global GpuMat variables allocated, that is, to rely
		on its destructor. The destruction order of such variables and CUDA context is undefined. GPU memory
		release function returns error if the CUDA context has been destroyed before.

		@sa Mat
		*/

		//interface GpuMatStatic {
			//! default constructor
			//explicit GpuMat(Allocator * allocator = defaultAllocator());

		overload->addOverloadConstructor("gpumat", "GpuMat", {}, New);
		//new () : GpuMat;

		//! constructs GpuMat of the specified size and type
		overload->addOverloadConstructor("gpumat", "GpuMat", {
			make_param<int>("rows","int"),
			make_param<int>("cols","int"),
			make_param<int>("type","int")
		}, New_rows_cols_type);
		//new (rows: _st.int, cols : _st.int, type : _st.int/*, Allocator * allocator = defaultAllocator()*/) : GpuMat;
		overload->addOverloadConstructor("gpumat", "GpuMat", {
			make_param<Size*>("size",Size::name),
			make_param<int>("type","int")
		}, New_size_type);
		//new (size: _types.Size, type : _st.int /*,Allocator * allocator = defaultAllocator()*/) : GpuMat;

		//! constucts GpuMat and fills it with the specified value _s
		overload->addOverloadConstructor("gpumat", "GpuMat", {
			make_param<int>("rows","int"),
			make_param<int>("cols","int"),
			make_param<int>("type","int"),
			make_param<Scalar*>("s",Scalar::name)
		}, New_rows_cols_type_scalar);
		//new (rows: _st.int, cols : _st.int, type : _st.int, s : _types.Scalar /*, Allocator * allocator = defaultAllocator()*/) : GpuMat;
		overload->addOverloadConstructor("gpumat", "GpuMat", {
			make_param<Size*>("size",Size::name),
			make_param<int>("type","int"),
			make_param<Scalar*>("s",Scalar::name)
		}, New_size_type_scalar);
		//new (size: _types.Size, type : _st.int, s : _types.Scalar /*, Allocator * allocator = defaultAllocator()*/) : GpuMat;

		//! copy constructor
		overload->addOverloadConstructor("gpumat", "GpuMat", {
			make_param<GpuMat*>("m",GpuMat::name)
		}, New_gpumat);
		//new (m: GpuMat) : GpuMat;

		//! constructor for GpuMat headers pointing to user-allocated data
		overload->addOverloadConstructor("gpumat", "GpuMat", {
			make_param<int>("rows","int"),
			make_param<int>("cols","int"),
			make_param<int>("type","int"),
			make_param("data","Array"),
			make_param<size_t>("step","size_t", cv::Mat::AUTO_STEP)
		}, New_rows_cols_type_data);
		//new (rows: _st.int, cols : _st.int, type : _st.int, data : Array<any>, step ? : _st.size_t /*= Mat::AUTO_STEP*/) : GpuMat;
		overload->addOverloadConstructor("gpumat", "GpuMat", {
			make_param<Size*>("size",Size::name),
			make_param<int>("type","int"),
			make_param("data","Array"),
			make_param<size_t>("step","size_t", cv::Mat::AUTO_STEP)
		}, New_size_type_data);
		//new (size: _types.Size, type : _st.int, data : Array<any>, step ? : _st.size_t /*= Mat::AUTO_STEP*/) : GpuMat;

		//! creates a GpuMat header for a part of the bigger matrix
		overload->addOverloadConstructor("gpumat", "GpuMat", {
			make_param<GpuMat*>("m",GpuMat::name),
			make_param<Range*>("rowRange",Range::name),
			make_param<Range*>("colRange",Range::name)
		}, New_GpuMat_range);
		//new (m: GpuMat, rowRange : _types.Range, colRange : _types.Range) : GpuMat;
		overload->addOverloadConstructor("gpumat", "GpuMat", {
			make_param<GpuMat*>("m",GpuMat::name),
			make_param<Rect*>("roi",Rect::name)
		}, New_GpuMat_Rect);
		//new (m: GpuMat, roi : _types.Rect) : GpuMat;

		//! builds GpuMat from host memory (Blocking call)
		overload->addOverloadConstructor("gpumat", "GpuMat", { make_param<IOArray*>("arr","InputArray") }, New_ioarray);
		//new (arr: _st.InputArray /*, Allocator * allocator = defaultAllocator()*/) : GpuMat;
		//
		//            //! destructor - calls release()
		//            ~GpuMat();
		//
		//            //! assignment operators
		//            GpuMat & operator =(const GpuMat& m);
	//}

	//export interface GpuMat extends _st.IOArray
	//{





		//! allocates new GpuMat data unless the GpuMat already has specified size and type
		overload->addOverload("gpumat", "GpuMat", "create", {
			make_param<int>("rows","int"),
			make_param<int>("cols","int"),
			make_param<int>("type","int")
		}, create_rows_cols);
		//create(rows: _st.int, cols : _st.int, type : _st.int) : void;
		overload->addOverload("gpumat", "GpuMat", "create", {
			make_param<Size*>("size",Size::name),
			make_param<int>("type","int")
		}, create_size_type);
		//create(size: _types.Size, type : _st.int) : void;
		//
		//            //! decreases reference counter, deallocate the data when reference counter reaches 0
		overload->addOverload("gpumat", "GpuMat", "release", {}, release);
		//            void release();
		//
		//            //! swaps with other smart pointer
		overload->addOverload("gpumat", "GpuMat", "swap", {
			make_param<GpuMat*>("mat",GpuMat::name)
		}, swap);
		//            void swap(GpuMat & mat);
		//
		//            //! pefroms upload data to GpuMat (Blocking call)
		overload->addOverload("gpumat", "GpuMat", "upload", {
			make_param<IOArray*>("arr","InputArray")
		}, upload_ioarray);
		//upload(arr: _st.InputArray) : void

			//! pefroms upload data to GpuMat (Non-Blocking call)
		overload->addOverload("gpumat", "GpuMat", "upload", {
			make_param<IOArray*>("arr","InputArray"),
			make_param<Stream*>("stream",Stream::name)
		}, upload_ioarray_stream);
		//upload(arr : _st.InputArray, stream : Stream) : void;

	//! pefroms download data from device to host memory (Blocking call)
		overload->addOverload("gpumat", "GpuMat", "download", { make_param<IOArray*>("dst","OutputArray") }, download_ioarray);
		//download(dst: _st.OutputArray) : void;

		//! pefroms download data from device to host memory (Non-Blocking call)
		overload->addOverload("gpumat", "GpuMat", "download", {
			make_param<IOArray*>("arr","OutputArray"),
			make_param<Stream*>("stream",Stream::name)
		}, download_ioarray_stream);
		//download(dst: _st.OutputArray, stream : Stream) : void;
		//
		//            //! returns deep copy of the GpuMat, i.e. the data is copied
		overload->addOverload("gpumat", "GpuMat", "clone", {}, clone);
		//            GpuMat clone() const;
		//
		//! copies the GpuMat content to device memory (Blocking call)
		overload->addOverload("gpumat", "GpuMat", "copyTo", {
			make_param<IOArray*>("dst","OutputArray")
		}, copyTo_ioarray);
		//copyTo(dst: _st.OutputArray) : void;

		//! copies the GpuMat content to device memory (Non-Blocking call)
		overload->addOverload("gpumat", "GpuMat", "copyTo", {
			make_param<IOArray*>("dst","IOArray"),
			make_param<Stream*>("stream",Stream::name)
		}, copyTo_ioarray_stream);
		//copyTo(dst: _st.OutputArray, stream : Stream) : void;

		//! copies those GpuMat elements to "m" that are marked with non-zero mask elements (Blocking call)
		overload->addOverload("gpumat", "GpuMat", "copyTo", {
			make_param<IOArray*>("dst","OutputArray"),
			make_param<IOArray*>("mask","InputArray")
		}, copyTo_ioarray_mask);
		//copyTo(dst: _st.OutputArray, mask : _st.InputArray) : void;

		//! copies those GpuMat elements to "m" that are marked with non-zero mask elements (Non-Blocking call)
		overload->addOverload("gpumat", "GpuMat", "copyTo", {
			make_param<IOArray*>("dst","OutputArray"),
			make_param<IOArray*>("mask","InputArray"),
			make_param<Stream*>("stream",Stream::name)
		}, copyTo_ioarray_mask_stream);
		//copyTo(dst: _st.OutputArray, mask : _st.InputArray, stream : Stream) : void;

		//! sets some of the GpuMat elements to s (Blocking call)
		overload->addOverload("gpumat", "GpuMat", "setTo", {
			make_param<Scalar*>("s",Scalar::name)
		}, setTo_scalar);
		//setTo(s: _types.Scalar) : GpuMat;

		//! sets some of the GpuMat elements to s (Non-Blocking call)
		overload->addOverload("gpumat", "GpuMat", "setTo", {
			make_param<Scalar*>("s",Scalar::name),
			make_param<Stream*>("stream",Stream::name)
		}, setTo_scalar_stream);
		//setTo(s: _types.Scalar, stream : Stream) : GpuMat;

		//! sets some of the GpuMat elements to s, according to the mask (Blocking call)
		overload->addOverload("gpumat", "GpuMat", "setTo", {
			make_param<Scalar*>("s",Scalar::name),
			make_param<IOArray*>("mask","InputArray")
		}, setTo_scalar_mask);
		//setTo(s: _types.Scalar, mask : _st.InputArray) : GpuMat;

		//! sets some of the GpuMat elements to s, according to the mask (Non-Blocking call)
		overload->addOverload("gpumat", "GpuMat", "setTo", {
			make_param<Scalar*>("s",Scalar::name),
			make_param<IOArray*>("mask","InputArray"),
			make_param<Stream*>("stream",Stream::name)
		}, setTo_scalar_mask_stream);
		//setTo(s: _types.Scalar, mask : _st.InputArray, stream : Stream) : GpuMat;

		//! converts GpuMat to another datatype (Blocking call)
		overload->addOverload("gpumat", "GpuMat", "convertTo", {
			make_param<IOArray*>("dst","OutputArray"),
			make_param<int>("rtype","int")
		}, convertTo_ioarray_rtype);
		//convertTo(dst: _st.OutputArray, rtype : _st.int) : void;

		//! converts GpuMat to another datatype (Non-Blocking call)
		overload->addOverload("gpumat", "GpuMat", "convertTo", {
			make_param<IOArray*>("dst","OutputArray"),
			make_param<int>("rtype","int"),
			make_param<Stream*>("stream",Stream::name)
		}, convertTo_ioarray_rtype_stream);
		//convertTo(dst: _st.OutputArray, rtype : _st.int, stream : Stream) : void;

		//! converts GpuMat to another datatype with scaling (Blocking call)
		overload->addOverload("gpumat", "GpuMat", "convertTo", {
			make_param<IOArray*>("dst","OutputArray"),
			make_param<int>("rtype","int"),
			make_param<double>("alpha","double"),
			make_param<double>("beta","double",0.0)
		}, convertTo_ioarray_rtype_alpha_beta);
		//convertTo(dst: _st.OutputArray, rtype : _st.int, alpha : _st.double, beta ? : _st.double  /*= 0.0*/) : void;

		//! converts GpuMat to another datatype with scaling (Non-Blocking call)
		overload->addOverload("gpumat", "GpuMat", "convertTo", {
			make_param<IOArray*>("dst","OutputArray"),
			make_param<int>("rtype","int"),
			make_param<double>("alpha","double"),
			make_param<Stream*>("stream",Stream::name)
		}, convertTo_ioarray_rtype_alpha_stream);
		//convertTo(dst: _st.OutputArray, rtype : _st.int, alpha : _st.double, stream : Stream) : void;

		//! converts GpuMat to another datatype with scaling (Non-Blocking call)
		overload->addOverload("gpumat", "GpuMat", "convertTo", {
			make_param<IOArray*>("dst","OutputArray"),
			make_param<int>("rtype","int"),
			make_param<double>("alpha","double"),
			make_param<double>("beta","double"),
			make_param<Stream*>("stream",Stream::name)
		}, convertTo_ioarray_rtype_alpha_beta_stream);
		//convertTo(dst: _st.OutputArray, rtype : _st.int, alpha : _st.double, beta : _st.double, stream : Stream) : void;

		overload->addOverload("gpumat", "GpuMat", "assignTo", {
			make_param<GpuMat*>("m",GpuMat::name),
			make_param<int>("type","int",-1)
		}, assignTo);
		//            void assignTo(GpuMat & m, int type= -1) const;
		//
		//            //! returns pointer to y-th row
		//            uchar * ptr(int y = 0);
		//            const uchar* ptr(int y = 0) const;

		overload->addOverload("gpumat", "GpuMat", "ptr", { make_param<std::string>("type","String"),make_param<int>("i0","int",0),make_param<int>("i1","int",0),make_param<int>("i2","int",0) }, ptr);
		Nan::SetPrototypeMethod(ctor, "ptr", gpumat_general_callback::callback);
		//ptr<T>(T: string, i0 ? : _st.int /* = 0*/) : _mat.TrackedPtr<T>;
		//
		//            //! template version of the above method
		//            template < typename _Tp> _Tp * ptr(int y = 0);
		//            template < typename _Tp> const _Tp* ptr(int y = 0) const;
		//
		//            template < typename _Tp> operator PtrStepSz<_Tp>() const;
		//            template < typename _Tp> operator PtrStep<_Tp>() const;

		//! returns a new GpuMat header for the specified row
		overload->addOverload("gpumat", "GpuMat", "row", { make_param<int>("y","int") }, row);
		//row(y: _st.int) : GpuMat;

		//! returns a new GpuMat header for the specified column
		overload->addOverload("gpumat", "GpuMat", "col", { make_param<int>("x","int") }, col);
		//col(x: _st.int) : GpuMat;

		//! ... for the specified row span
		overload->addOverload("gpumat", "GpuMat", "rowRange", {
			make_param<int>("startRow","int"),
			make_param<int>("endRow","int")
		}, rowRange_rows);
		//rowRange(startrow: _st.int, endrow : _st.int) : GpuMat;

		overload->addOverload("gpumat", "GpuMat", "rowRange", {
			make_param<Range*>("r",Range::name)
		}, rowRange_range);
		//rowRange(r: _types.Range) : GpuMat;

		//! ... for the specified column span
		overload->addOverload("gpumat", "GpuMat", "colRange", {
			make_param<int>("startCol","int"),
			make_param<int>("endCol","int")
		}, colRange_cols);
		//colRange(startcol: _st.int, endcol : _st.int) : GpuMat;
		overload->addOverload("gpumat", "GpuMat", "colRange", {
			make_param<Range*>("r",Range::name)
		}, colRange_range);
		//colRange(r: _types.Range) : GpuMat;

		//            //! extracts a rectangular sub-GpuMat (this is a generalized form of row, rowRange etc.)
		//            GpuMat operator ()(Range rowRange, Range colRange) const;
		overload->addOverload("gpumat", "GpuMat", "", {
			make_param<Range*>("rowRange",Range::name),
			make_param<Range*>("colRange",Range::name)
		}, roi_range);
		//roi(rowRange: _types.Range, colRange : _types.Range) : GpuMat;
		//            GpuMat operator ()(Rect roi) const;
		overload->addOverload("gpumat", "GpuMat", "roi", {
			make_param<Rect*>("roi",Rect::name)
		}, roi_rect);
		//roi(roi: _types.Rect) : GpuMat;
		//
		//            //! creates alternative GpuMat header for the same data, with different
		//            //! number of channels and/or different number of rows
		//            GpuMat reshape(int cn, int rows = 0) const;
		//
		//            //! locates GpuMat header within a parent GpuMat
		//            void locateROI(Size & wholeSize, Point & ofs) const;
		//
		//            //! moves/resizes the current GpuMat ROI inside the parent GpuMat
		//            GpuMat & adjustROI(int dtop, int dbottom, int dleft, int dright);
		//
		//            //! returns true iff the GpuMat data is continuous
		//            //! (i.e. when there are no gaps between successive rows)
		//            bool isContinuous() const;
		//
		//! returns element size in bytes
		overload->addOverload("gpumat", "GpuMat", "elemSize", {}, elemSize);
		//elemSize() : _st.size_t;

		//! returns the size of element channel in bytes
		overload->addOverload("gpumat", "GpuMat", "elemSize1", {}, elemSize1);
		//elemSize1() : _st.size_t;

		//! returns element type
		overload->addOverload("gpumat", "GpuMat", "type", {}, type);
		//type() : _st.int;

		//! returns element type
		overload->addOverload("gpumat", "GpuMat", "depth", {}, depth);
		//depth() : _st.int;

		//! returns number of channels
		overload->addOverload("gpumat", "GpuMat", "channels", {}, channels);
		//channels() : _st.int;
		//
		//            //! returns step/elemSize1()
		overload->addOverload("gpumat", "GpuMat", "step1", {}, step1);
		//            size_t step1() const;
		//
		//! returns GpuMat size : width == number of columns, height == number of rows
		overload->addOverload("gpumat", "GpuMat", "size", {}, size);
		//size() : _types.Size;
		//
		//! returns true if GpuMat data is NULL
		overload->addOverload("gpumat", "GpuMat", "empty", {}, empty);
		//empty() : boolean;
		//
		//            /*! includes several bit-fields:
		//            - the magic signature
		//            - continuity flag
		//            - depth
		//            - number of channels
		//            */
		//            int flags;
		//
		//! the number of rows and columns
		overload->addOverload("gpumat", "GpuMat", "rows", {}, rows);
		//rows() : _st.int;
		overload->addOverload("gpumat", "GpuMat", "cols", {}, cols);
		//cols() : _st.int;
		//
		//            //! a distance between successive rows in bytes; includes the gap if any
		Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("step").ToLocalChecked(), step_getter);
		//            size_t step;
		//
		//            //! pointer to the data
		//            uchar * data;
		//
		//            //! pointer to the reference counter;
		//            //! when GpuMat points to user-allocated data, the pointer is NULL
		//            int * refcount;
		//
		//            //! helper fields used in locateROI and adjustROI
		//            uchar * datastart;
		//            const uchar* dataend;
		//
		//            //! allocator
		//            Allocator * allocator;
		//};

		//export var GpuMat : GpuMatStatic = alvision_module.GpuMat;


		target->Set(Nan::New("GpuMat").ToLocalChecked(), ctor->GetFunction());

	}

	v8::Local<v8::Function> GpuMat::get_constructor() {
		assert(!constructor.IsEmpty() && "constructor is empty");
		return Nan::New(constructor)->GetFunction();
	}


	POLY_METHOD(GpuMat::New) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::New_rows_cols_type) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::New_size_type) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::New_rows_cols_type_scalar) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::New_size_type_scalar) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::New_gpumat) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::New_rows_cols_type_data) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::New_size_type_data) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::New_GpuMat_range) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::New_GpuMat_Rect) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::New_ioarray) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::create_rows_cols) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::create_size_type) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::release) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::swap) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::upload_ioarray) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::upload_ioarray_stream) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::download_ioarray) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::download_ioarray_stream) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::clone) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::copyTo_ioarray) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::copyTo_ioarray_stream) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::copyTo_ioarray_mask) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::copyTo_ioarray_mask_stream) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::setTo_scalar) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::setTo_scalar_stream) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::setTo_scalar_mask) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::setTo_scalar_mask_stream) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::convertTo_ioarray_rtype) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::convertTo_ioarray_rtype_stream) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::convertTo_ioarray_rtype_alpha_beta) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::convertTo_ioarray_rtype_alpha_stream) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::convertTo_ioarray_rtype_alpha_beta_stream) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::assignTo) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::ptr) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::row) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::col) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::rowRange_rows) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::rowRange_range) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::colRange_cols) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::colRange_range) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::roi_range) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::roi_rect) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::elemSize) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::elemSize1) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::type) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::depth) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::channels) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::step1) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::size) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::empty) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::rows) { throw std::exception("not implemented"); }
	POLY_METHOD(GpuMat::cols) { throw std::exception("not implemented"); }


	NAN_GETTER(GpuMat::step_getter) { return Nan::ThrowError("not implemented"); }

};
//#endif