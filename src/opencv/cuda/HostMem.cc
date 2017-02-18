#include "HostMem.h"
#include "../IOArray.h"
#include "../types/Size.h"

//#ifdef HAVE_CUDA

namespace hostmem_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("hostmem_general_callback is empty");
		}
		return overload->execute("hostmem", info);
	}
}
namespace cuda {

	Nan::Persistent<FunctionTemplate> HostMem::constructor;
	std::string HostMem::name;

	void
		HostMem::Register(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
		HostMem::name = "HostMem";
		hostmem_general_callback::overload = overload;
	}
	void
		HostMem::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
		

		//Class
		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(hostmem_general_callback::callback);
		constructor.Reset(ctor);
		auto itpl = ctor->InstanceTemplate();
		itpl->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New("HostMem").ToLocalChecked());
		ctor->Inherit(Nan::New(IOArray::constructor));

		overload->register_type<HostMem>(ctor, "hostmem", "HostMem");




		//===================================================================================
		// HostMem
		//===================================================================================

		/** @brief Class with reference counting wrapping special memory type allocation functions from CUDA.

		Its interface is also Mat-like but with additional memory type parameters.

		-   **PAGE_LOCKED** sets a page locked memory type used commonly for fast and asynchronous
		uploading/downloading data from/to GPU.
		-   **SHARED** specifies a zero copy memory allocation that enables mapping the host memory to GPU
		address space, if supported.
		-   **WRITE_COMBINED** sets the write combined buffer that is not cached by CPU. Such buffers are
		used to supply GPU with data when GPU only reads it. The advantage is a better CPU cache
		utilization.

		@note Allocation size of such memory types is usually limited. For more details, see *CUDA 2.2
		Pinned Memory APIs* document or *CUDA C Programming Guide*.
		*/
		auto HostMemAllocType = CreateNamedObject(target, "HostMemAllocType");
		SetObjectProperty(HostMemAllocType, "PAGE_LOCKED", cv::cuda::HostMem::AllocType::PAGE_LOCKED);
		SetObjectProperty(HostMemAllocType, "SHARED", cv::cuda::HostMem::AllocType::SHARED);
		SetObjectProperty(HostMemAllocType, "WRITE_COMBINED", cv::cuda::HostMem::AllocType::WRITE_COMBINED);
		overload->add_type_alias("HostMemAllocType", "int");


		//interface HostMemStatic {
		overload->addOverloadConstructor("hostmem", "HostMem", {
			make_param<int>("alloc_type","HostMemAllocType")
		}, New_alloc_type);
		//new (alloc_type ? : HostMemAllocType/* = PAGE_LOCKED*/) : HostMem;

		overload->addOverloadConstructor("hostmem", "HostMem", {
			make_param<HostMem*>("m",HostMem::name)
		}, New_hostmem);
		//new (m: HostMem) : HostMem

		overload->addOverloadConstructor("hostmem", "HostMem", {
			make_param<int>("rows","int"),
			make_param<int>("cols","int"),
			make_param<int>("type","int"),
			make_param<int>("alloc_type","HostMemAllocType", cv::cuda::HostMem::AllocType::PAGE_LOCKED),
		}, New_rows_cols_type_alloc_type);
		//new (rows : _st.int, cols : _st.int, type : _st.int, alloc_type ? : HostMemAllocType /*= PAGE_LOCKED*/) : HostMem;

		overload->addOverloadConstructor("hostmem", "HostMem", {
			make_param<Size*>("size",Size::name),
			make_param<int>("type","int"),
			make_param<int>("alloc_type","HostMemAllocType", cv::cuda::HostMem::AllocType::PAGE_LOCKED),
		}, New_size_type_alloc_type);
		//new (size: _types.Size, type : _st.int, alloc_type ? : HostMemAllocType/*= PAGE_LOCKED*/) : HostMem;

		//! creates from host memory with coping data
		overload->addOverloadConstructor("hostmem", "HostMem", {
			make_param<IOArray*>("arr","InputArray"),
			make_param<int>("alloc_type","HostMemAllocType", cv::cuda::HostMem::AllocType::PAGE_LOCKED),
		}, New_ioarray_alloc_type);
		//new (arr: _st.InputArray, alloc_type ? : HostMemAllocType/*= PAGE_LOCKED*/) : HostMem;
		//
		//            ~HostMem();
		//
		//            HostMem & operator =(const HostMem& m);

	//}

	//export interface HostMem extends _st.IOArray
	//{
		//            public:

		//
		//    static MatAllocator * getAllocator(AllocType alloc_type = PAGE_LOCKED);
		//
		//
		//            //! swaps with other smart pointer
		overload->addOverload("hostmem", "HostMem", "swap", { make_param<HostMem*>("b",HostMem::name) }, swap);
		//            void swap(HostMem & b);
		//
		//            //! returns deep copy of the matrix, i.e. the data is copied
		overload->addOverload("hostmem", "HostMem", "clone", {}, clone);
		//            HostMem clone() const;
		//
		//            //! allocates new matrix data unless the matrix already has specified size and type.
		overload->addOverload("hostmem", "HostMem", "create", {
			make_param<int>("rows","int"),
			make_param<int>("cols","int"),
			make_param<int>("type","int")
		}, create_rows_cols_type);
		//            void create(int rows, int cols, int type);

		overload->addOverload("hostmem", "HostMem", "create", {
			make_param<Size*>("size",Size::name),
			make_param<int>("type","int")
		}, create_size_type);
		//            void create(Size size, int type);
		//
		//            //! creates alternative HostMem header for the same data, with different
		//            //! number of channels and/or different number of rows

		overload->addOverload("hostmem", "HostMem", "reshape", {
			make_param<int>("cn","int"),
			make_param<int>("rows","int",0)
		}, reshape);
		//            HostMem reshape(int cn, int rows = 0) const;
		//
		//            //! decrements reference counter and released memory if needed.

		overload->addOverload("hostmem", "HostMem", "release", {}, release);
		//            void release();
		//
		//! returns matrix header with disabled reference counting for HostMem data.

		overload->addOverload("hostmem", "HostMem", "createMatHeader", {}, createMatHeader);
		//createMatHeader() : _mat.Mat;
	//
	//            /** @brief Maps CPU memory to GPU address space and creates the cuda::GpuMat header without reference counting
	//            for it.
	//        
	//            This can be done only if memory was allocated with the SHARED flag and if it is supported by the
	//            hardware. Laptops often share video and CPU memory, so address spaces can be mapped, which
	//            eliminates an extra copy.
	//             */
		overload->addOverload("hostmem", "HostMem", "createGpuMatHeader", {}, createGpuMatHeader);
		////            GpuMat createGpuMatHeader() const;
		//
		//            // Please see cv::Mat for descriptions
		overload->addOverload("hostmem", "HostMem", "isContinuous", {}, isContinuous);
		//            bool isContinuous() const;
		overload->addOverload("hostmem", "HostMem", "elemSize", {}, elemSize);
		//elemSize() : _st.size_t;
		overload->addOverload("hostmem", "HostMem", "elemSize1", {}, elemSize1);
		//elemSize1() : _st.size_t;
		overload->addOverload("hostmem", "HostMem", "type", {}, type);
		//type() : _st.int;

		overload->addOverload("hostmem", "HostMem", "depth", {}, depth);
		//            int depth() const;

		overload->addOverload("hostmem", "HostMem", "channels", {}, channels);
		//            int channels() const;

		overload->addOverload("hostmem", "HostMem", "step1", {}, step1);
		//            size_t step1() const;

		overload->addOverload("hostmem", "HostMem", "size", {}, size);
		//size() : _types.Size;

		overload->addOverload("hostmem", "HostMem", "empty", {}, empty);
		//            bool empty() const;
		//
		//            // Please see cv::Mat for descriptions

		Nan::SetAccessor(itpl, Nan::New("flags").ToLocalChecked(), flags_getter);
		//            int flags;

		Nan::SetAccessor(itpl, Nan::New("rows").ToLocalChecked(), rows_getter);
		Nan::SetAccessor(itpl, Nan::New("cols").ToLocalChecked(), cols_getter);
		//            int rows, cols;

		Nan::SetAccessor(itpl, Nan::New("step").ToLocalChecked(), step_getter);
		//            size_t step;
		//
		//            uchar * data;
		//            int * refcount;
		//
		//            uchar * datastart;
		//            const uchar* dataend;
		//
		Nan::SetAccessor(itpl, Nan::New("alloc_type").ToLocalChecked(), alloc_type_getter);
		//            AllocType alloc_type;
		//};

		//export var HostMem : HostMemStatic = alvision_module.HostMem;

		target->Set(Nan::New("HostMem").ToLocalChecked(), ctor->GetFunction());

	}

	v8::Local<v8::Function> HostMem::get_constructor() {
		assert(!constructor.IsEmpty() && "constructor is empty");
		return Nan::New(constructor)->GetFunction();
	}




	POLY_METHOD(HostMem::New_alloc_type) { throw std::exception("not implemented"); }
	POLY_METHOD(HostMem::New_hostmem) { throw std::exception("not implemented"); }
	POLY_METHOD(HostMem::New_rows_cols_type_alloc_type) { throw std::exception("not implemented"); }
	POLY_METHOD(HostMem::New_size_type_alloc_type) { throw std::exception("not implemented"); }
	POLY_METHOD(HostMem::New_ioarray_alloc_type) { throw std::exception("not implemented"); }
	POLY_METHOD(HostMem::swap) { throw std::exception("not implemented"); }
	POLY_METHOD(HostMem::clone) { throw std::exception("not implemented"); }
	POLY_METHOD(HostMem::create_rows_cols_type) { throw std::exception("not implemented"); }
	POLY_METHOD(HostMem::create_size_type) { throw std::exception("not implemented"); }
	POLY_METHOD(HostMem::reshape) { throw std::exception("not implemented"); }
	POLY_METHOD(HostMem::release) { throw std::exception("not implemented"); }
	POLY_METHOD(HostMem::createMatHeader) { throw std::exception("not implemented"); }
	POLY_METHOD(HostMem::createGpuMatHeader) { throw std::exception("not implemented"); }
	POLY_METHOD(HostMem::isContinuous) { throw std::exception("not implemented"); }
	POLY_METHOD(HostMem::elemSize) { throw std::exception("not implemented"); }
	POLY_METHOD(HostMem::elemSize1) { throw std::exception("not implemented"); }
	POLY_METHOD(HostMem::type) { throw std::exception("not implemented"); }
	POLY_METHOD(HostMem::depth) { throw std::exception("not implemented"); }
	POLY_METHOD(HostMem::channels) { throw std::exception("not implemented"); }
	POLY_METHOD(HostMem::step1) { throw std::exception("not implemented"); }
	POLY_METHOD(HostMem::size) { throw std::exception("not implemented"); }
	POLY_METHOD(HostMem::empty) { throw std::exception("not implemented"); }


	NAN_GETTER(HostMem::flags_getter) { return Nan::ThrowError("not implemented"); }
	NAN_GETTER(HostMem::rows_getter) { return Nan::ThrowError("not implemented"); }
	NAN_GETTER(HostMem::cols_getter) { return Nan::ThrowError("not implemented"); }
	NAN_GETTER(HostMem::step_getter) { return Nan::ThrowError("not implemented"); }
	NAN_GETTER(HostMem::alloc_type_getter) { return Nan::ThrowError("not implemented"); }




};