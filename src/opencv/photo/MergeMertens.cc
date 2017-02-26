#include "MergeMertens.h"
#include "../IOArray.h"
#include "../Matrix.h"

namespace mergemertens_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("mergemertens_general_callback is empty");
		}
		return overload->execute("mergemertens", info);
	}
}

Nan::Persistent<FunctionTemplate> MergeMertens::constructor;

void MergeMertens::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	mergemertens_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(mergemertens_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("MergeMertens").ToLocalChecked());
	ctor->Inherit(Nan::New(MergeExposures::constructor));

	overload->register_type<MergeMertens>(ctor, "mergemertens", "MergeMertens");



	overload->addOverloadConstructor("mergemertens", "MergeMertens", {}, New);





//	/** @brief Pixels are weighted using contrast, saturation and well-exposedness measures, than images are
//		combined using laplacian pyramids.
//	
//		The resulting image weight is constructed as weighted average of contrast, saturation and
//		well-exposedness measures.
//	
//		The resulting image doesn't require tonemapping and can be converted to 8-bit image by multiplying
//		by 255, but it's recommended to apply gamma correction and/or linear tonemapping.
//	
//		For more information see @cite MK07 .
//		*/
//		interface MergeMertens extends MergeExposures
//		{
//			//public:
//			//CV_WRAP virtual void process(InputArrayOfArrays src, OutputArray dst,
//			//    InputArray times, InputArray response) = 0;
	overload->addOverload("mergemertens", "MergeMertens", "process", {
		make_param<IOArray*>("src","InputArrayOfArrays"),
		make_param<IOArray*>("dst","OutputArray"),
		make_param<IOArray*>("times","InputArray"),
		make_param<IOArray*>("response","InputArray")
	}, process_times_response);
//			///** @brief Short version of process, that doesn't take extra arguments.
//			//
//			//@param src vector of input images
//			//@param dst result image
//			// */
//			//CV_WRAP virtual void process(InputArrayOfArrays src, OutputArray dst) = 0;
	overload->addOverload("mergemertens", "MergeMertens", "process", {
		make_param<IOArray*>("src","InputArrayOfArrays"),
		make_param<IOArray*>("dst","OutputArray"),
	}, process);
//			//
//			//CV_WRAP virtual float getContrastWeight() const = 0;
	overload->addOverload("mergemertens", "MergeMertens", "getContrastWeight", {}, getContrastWeight);
//			//CV_WRAP virtual void setContrastWeight(float contrast_weiht) = 0;
	overload->addOverload("mergemertens", "MergeMertens", "setContrastWeight", {make_param<float>("contrast_weiht","float")}, setContrastWeight);
//			//
//			//CV_WRAP virtual float getSaturationWeight() const = 0;
	overload->addOverload("mergemertens", "MergeMertens", "getSaturationWeight", {}, getSaturationWeight);
//			//CV_WRAP virtual void setSaturationWeight(float saturation_weight) = 0;
	overload->addOverload("mergemertens", "MergeMertens", "setSaturationWeight", {make_param<float>("saturation_weight","float")}, setSaturationWeight);
//			//
//			//CV_WRAP virtual float getExposureWeight() const = 0;
	overload->addOverload("mergemertens", "MergeMertens", "getExposureWeight", {}, getExposureWeight);
//			//CV_WRAP virtual void setExposureWeight(float exposure_weight) = 0;
	overload->addOverload("mergemertens", "MergeMertens", "setExposureWeight", {make_param<float>("exposure_weight","float")}, setExposureWeight);
//		};
//	
//		/** @brief Creates MergeMertens object
//	
//		@param contrast_weight contrast measure weight. See MergeMertens.
//		@param saturation_weight saturation measure weight
//		@param exposure_weight well-exposedness measure weight
//		*/
//	
	overload->addOverload("mergemertens", "MergeMertens", "createMergeMertens", {
		make_param<float>("contrast_weight","float", 1.0f),
		make_param<float>("saturation_weight","float", 1.0f),
		make_param<float>("exposure_weight","float", 0.0f)
	
	}, createMergeMertens);
//		interface IcreateMergeMertens {
//			(contrast_weight ? : _st.float /*= 1.0f*/, saturation_weight ? : _st.float  /*= 1.0f*/, exposure_weight ? : _st.float  /* = 0.0f*/);
//		}
//		export var createMergeMertens : IcreateMergeMertens = alvision_module.createMergeMertens;
//	
//		//    CV_EXPORTS_W Ptr< MergeMertens >
//		//        createMergeMertens(float contrast_weight = 1.0f, float saturation_weight = 1.0f, float exposure_weight = 0.0f);
//	


	target->Set(Nan::New("MergeMertens").ToLocalChecked(), ctor->GetFunction());
}

v8::Local<v8::Function> MergeMertens::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


POLY_METHOD(MergeMertens::New){throw std::runtime_error("not implemented");}
POLY_METHOD(MergeMertens::process_times_response){throw std::runtime_error("not implemented");}
POLY_METHOD(MergeMertens::process){throw std::runtime_error("not implemented");}
POLY_METHOD(MergeMertens::getContrastWeight){throw std::runtime_error("not implemented");}
POLY_METHOD(MergeMertens::setContrastWeight){throw std::runtime_error("not implemented");}
POLY_METHOD(MergeMertens::getSaturationWeight){throw std::runtime_error("not implemented");}
POLY_METHOD(MergeMertens::setSaturationWeight){throw std::runtime_error("not implemented");}
POLY_METHOD(MergeMertens::getExposureWeight){throw std::runtime_error("not implemented");}
POLY_METHOD(MergeMertens::setExposureWeight){throw std::runtime_error("not implemented");}
POLY_METHOD(MergeMertens::createMergeMertens){throw std::runtime_error("not implemented");}


