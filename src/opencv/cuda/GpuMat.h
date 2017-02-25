#ifndef _ALVISION_CUDA_GPUMAT_H_
#define _ALVISION_CUDA_GPUMAT_H_
//#include "OpenCV.h"
#include "../../alvision.h"


//#ifdef HAVE_CUDA
namespace cuda {

	class GpuMat : public overres::ObjectWrap{
	public:
		static std::string name;

		static void Register(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
		static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

		static Nan::Persistent<FunctionTemplate> constructor;
		virtual v8::Local<v8::Function> get_constructor();

		std::shared_ptr<cv::cuda::GpuMat> _gpumat;

		static POLY_METHOD(New);
		static POLY_METHOD(New_rows_cols_type);
		static POLY_METHOD(New_size_type);
		static POLY_METHOD(New_rows_cols_type_scalar);
		static POLY_METHOD(New_size_type_scalar);
		static POLY_METHOD(New_gpumat);
		static POLY_METHOD(New_rows_cols_type_data);
		static POLY_METHOD(New_size_type_data);
		static POLY_METHOD(New_GpuMat_range);
		static POLY_METHOD(New_GpuMat_Rect);
		static POLY_METHOD(New_ioarray);
		static POLY_METHOD(create_rows_cols);
		static POLY_METHOD(create_size_type);
		static POLY_METHOD(release);
		static POLY_METHOD(swap);
		static POLY_METHOD(upload_ioarray);
		static POLY_METHOD(upload_ioarray_stream);
		static POLY_METHOD(download_ioarray);
		static POLY_METHOD(download_ioarray_stream);
		static POLY_METHOD(clone);
		static POLY_METHOD(copyTo_ioarray);
		static POLY_METHOD(copyTo_ioarray_stream);
		static POLY_METHOD(copyTo_ioarray_mask);
		static POLY_METHOD(copyTo_ioarray_mask_stream);
		static POLY_METHOD(setTo_scalar);
		static POLY_METHOD(setTo_scalar_stream);
		static POLY_METHOD(setTo_scalar_mask);
		static POLY_METHOD(setTo_scalar_mask_stream);
		static POLY_METHOD(convertTo_ioarray_rtype);
		static POLY_METHOD(convertTo_ioarray_rtype_stream);
		static POLY_METHOD(convertTo_ioarray_rtype_alpha_beta);
		static POLY_METHOD(convertTo_ioarray_rtype_alpha_stream);
		static POLY_METHOD(convertTo_ioarray_rtype_alpha_beta_stream);
		static POLY_METHOD(assignTo);
		static POLY_METHOD(ptr);
		static POLY_METHOD(row);
		static POLY_METHOD(col);
		static POLY_METHOD(rowRange_rows);
		static POLY_METHOD(rowRange_range);
		static POLY_METHOD(colRange_cols);
		static POLY_METHOD(colRange_range);
		static POLY_METHOD(roi_range);
		static POLY_METHOD(roi_rect);
		static POLY_METHOD(elemSize);
		static POLY_METHOD(elemSize1);
		static POLY_METHOD(type);
		static POLY_METHOD(depth);
		static POLY_METHOD(channels);
		static POLY_METHOD(step1);
		static POLY_METHOD(size);
		static POLY_METHOD(empty);
		static POLY_METHOD(rows);
		static POLY_METHOD(cols);


		static NAN_GETTER(step_getter);




	};
};

//#endif

#endif