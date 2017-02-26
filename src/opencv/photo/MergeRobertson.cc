#include "MergeRobertson.h"
#include "../IOArray.h"
#include "../Matrix.h"

namespace mergerobertson_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("mergerobertson_general_callback is empty");
		}
		return overload->execute("mergerobertson", info);
	}
}

Nan::Persistent<FunctionTemplate> MergeRobertson::constructor;

void MergeRobertson::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	mergerobertson_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(mergerobertson_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("MergeRobertson").ToLocalChecked());
	ctor->Inherit(Nan::New(MergeExposures::constructor));

	overload->register_type<MergeRobertson>(ctor, "mergerobertson", "MergeRobertson");



	overload->addOverloadConstructor("mergerobertson", "MergeRobertson", {}, New);






//	/** @brief The resulting HDR image is calculated as weighted average of the exposures considering exposure
//		values and camera response.
//	
//		For more information see @cite RB99 .
//		*/
//		interface MergeRobertson extends MergeExposures
//		{
//			//public:
//			process(src: _st.InputArrayOfArrays, dst : _st.OutputArray,
//				times : _st.InputArray, response : _st.InputArray) : void;
	overload->addOverload("mergerobertson", "MergeRobertson", "process", {
		make_param<IOArray*>("src","InputArrayOfArrays"),
		make_param<IOArray*>("dst","OutputArray"),
		make_param<IOArray*>("times","InputArray"), 
		make_param<IOArray*>("response","InputArray")
	}, process_response);
//			process(src: _st.InputArrayOfArrays, dst : _st.OutputArray, times : _st.InputArray) : void;
	overload->addOverload("mergerobertson", "MergeRobertson", "process", {
		make_param<IOArray*>("src","InputArrayOfArrays"),
		make_param<IOArray*>("dst","OutputArray"),
		make_param<IOArray*>("times","InputArray"),
	}, process);
//		};
//	
//		/** @brief Creates MergeRobertson object
//		*/
//	
	overload->addOverload("mergerobertson", "MergeRobertson", "createMergeRobertson", {}, createMergeRobertson);
//		interface IcreateMergeRobertson {
//			() : MergeRobertson;
//		}
//	
//		export var createMergeRobertson : IcreateMergeRobertson = alvision_module.createMergeRobertson;
//	
//		//    CV_EXPORTS_W Ptr< MergeRobertson > createMergeRobertson();


	target->Set(Nan::New("MergeRobertson").ToLocalChecked(), ctor->GetFunction());
}

v8::Local<v8::Function> MergeRobertson::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


POLY_METHOD(MergeRobertson::New){throw std::runtime_error("not implemented");}
POLY_METHOD(MergeRobertson::process_response){throw std::runtime_error("not implemented");}
POLY_METHOD(MergeRobertson::process){throw std::runtime_error("not implemented");}
POLY_METHOD(MergeRobertson::createMergeRobertson){throw std::runtime_error("not implemented");}


