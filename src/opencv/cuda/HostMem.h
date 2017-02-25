#ifndef _ALVISION_CUDA_HOSTMEM_H_
#define _ALVISION_CUDA_HOSTMEM_H_
#include "../../alvision.h"

namespace cuda {
	//#ifdef HAVE_CUDA


	class HostMem : public overres::ObjectWrap{
	public:
		static std::string name;

		static void Register(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
		static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

		static Nan::Persistent<FunctionTemplate> constructor;
		virtual v8::Local<v8::Function> get_constructor();

		std::shared_ptr<cv::cuda::HostMem> _hostmem;

		static POLY_METHOD(New_alloc_type);
		static POLY_METHOD(New_hostmem);
		static POLY_METHOD(New_rows_cols_type_alloc_type);
		static POLY_METHOD(New_size_type_alloc_type);
		static POLY_METHOD(New_ioarray_alloc_type);
		static POLY_METHOD(swap);
		static POLY_METHOD(clone);
		static POLY_METHOD(create_rows_cols_type);
		static POLY_METHOD(create_size_type);
		static POLY_METHOD(reshape);
		static POLY_METHOD(release);
		static POLY_METHOD(createMatHeader);
		static POLY_METHOD(createGpuMatHeader);
		static POLY_METHOD(isContinuous);
		static POLY_METHOD(elemSize);
		static POLY_METHOD(elemSize1);
		static POLY_METHOD(type);
		static POLY_METHOD(depth);
		static POLY_METHOD(channels);
		static POLY_METHOD(step1);
		static POLY_METHOD(size);
		static POLY_METHOD(empty);


		static NAN_GETTER(flags_getter);
		static NAN_GETTER(rows_getter);
		static NAN_GETTER(cols_getter);
		static NAN_GETTER(step_getter);
		static NAN_GETTER(alloc_type_getter);



	};
};
//#endif

#endif