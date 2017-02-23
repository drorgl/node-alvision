#include "MergeDebevec.h"
#include "../IOArray.h"
#include "../Matrix.h"

namespace mergedebevec_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("mergedebevec_general_callback is empty");
		}
		return overload->execute("mergedebevec", info);
	}
}

Nan::Persistent<FunctionTemplate> MergeDebevec::constructor;

void MergeDebevec::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	mergedebevec_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(mergedebevec_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("MergeDebevec").ToLocalChecked());
	ctor->Inherit(Nan::New(MergeExposures::constructor));

	overload->register_type<MergeDebevec>(ctor, "mergedebevec", "MergeDebevec");



	overload->addOverloadConstructor("mergedebevec", "MergeDebevec", {}, New);




//	/** @brief The resulting HDR image is calculated as weighted average of the exposures considering exposure
//		values and camera response.
//	
//		For more information see @cite DM97 .
//		*/
//		interface MergeDebevec extends MergeExposures
//		{
//			//public:
//			//CV_WRAP virtual void process(InputArrayOfArrays src, OutputArray dst,
//			//    InputArray times, InputArray response) = 0;
	overload->addOverload("mergedebevec", "MergeDebevec", "process", {
		make_param<IOArray*>("src","InputArrayOfArrays"),
		make_param<IOArray*>("dst","OutputArray"),
		make_param<IOArray*>("times","InputArray"),
		make_param<IOArray*>("response","InputArray")
	}, process_response);
//			//CV_WRAP virtual void process(InputArrayOfArrays src, OutputArray dst, InputArray times) = 0;
	overload->addOverload("mergedebevec", "MergeDebevec", "process", {
		make_param<IOArray*>("src","InputArrayOfArrays"),
		make_param<IOArray*>("dst","OutputArray"),
		make_param<IOArray*>("times","InputArray")
	}, process);
//		};
//		
//		
//		/** @brief Creates MergeDebevec object
//		*/
	overload->addOverload("mergedebevec", "MergeDebevec", "createMergeDebevec", {}, createMergeDebevec);
//		interface IcreateMergeDebevec {
//			() : MergeDebevec;
//		}
//	
//		export var createMergeDebevec : IcreateMergeDebevec = alvision_module.createMergeDebevec;
//	
//		//CV_EXPORTS_W Ptr< MergeDebevec > createMergeDebevec();
//	



	target->Set(Nan::New("MergeDebevec").ToLocalChecked(), ctor->GetFunction());
}

v8::Local<v8::Function> MergeDebevec::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


POLY_METHOD(MergeDebevec::New){throw std::exception("not implemented");}
POLY_METHOD(MergeDebevec::process_response){throw std::exception("not implemented");}
POLY_METHOD(MergeDebevec::process){throw std::exception("not implemented");}
POLY_METHOD(MergeDebevec::createMergeDebevec){throw std::exception("not implemented");}

