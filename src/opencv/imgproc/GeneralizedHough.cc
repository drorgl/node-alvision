#include "GeneralizedHough.h"
#include "../IOArray.h"
#include "../types/Point.h"

namespace generalizedhough_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("generalizedhough_general_callback is empty");
		}
		return overload->execute("generalizedhough", info);
	}
}

Nan::Persistent<FunctionTemplate> GeneralizedHough::constructor;

std::string GeneralizedHough::name;

void
GeneralizedHough::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	generalizedhough_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(generalizedhough_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("GeneralizedHough").ToLocalChecked());
	ctor->Inherit(Nan::New(Algorithm::constructor));

	overload->register_type<GeneralizedHough>(ctor, "generalizedhough", "GeneralizedHough");



	//! finds arbitrary template in the grayscale image using Generalized Hough Transform
	//interface GeneralizedHough extends _core.Algorithm
	//{
		//! set template to search

	overload->addOverload("generalizedhough", "", "setTemplate", {
		make_param<IOArray*>("templ","IOArray"),
		make_param<Point*>("templCenter",Point::name, Point::create(-1, -1))
	}, setTemplate);
	//setTemplate(templ: _st.InputArray,templCenter ? : _types.Point /*= Point(-1, -1)*/) : void;

	overload->addOverload("generalizedhough", "", "setTemplate", {
		make_param<IOArray*>("edges","IOArray"),
		make_param<IOArray*>("dx","IOArray"),
		make_param<IOArray*>("dy","IOArray"),
		make_param<Point*>("templCenter",Point::name,Point::create(-1, -1))
	}, setTemplate_edge);
	//setTemplate(edges : _st.InputArray, dx : _st.InputArray, dy : _st.InputArray, templCenter ? : _types.Point /*= Point(-1, -1)*/) : void;

	//! find template on image
	overload->addOverload("generalizedhough", "", "detect", {
		make_param<IOArray*>("image","IOArray"),
		make_param<IOArray*>("positions","IOArray"),
		make_param<IOArray*>("votes","IOArray", IOArray::noArray())
	}, detect);
	//detect(image : _st.InputArray, positions : _st.OutputArray, votes ? : _st.OutputArray /*= noArray()*/) : void;


	overload->addOverload("generalizedhough", "", "detect", {
		make_param<IOArray*>("edges","IOArray"),
		make_param<IOArray*>("dx","IOArray"),
		make_param<IOArray*>("dy","IOArray"),
		make_param<IOArray*>("positions","IOArray"),
		make_param<IOArray*>("votes","IOArray",IOArray::noArray())
	}, detect_edge);
	//detect(edges: _st.InputArray, dx : _st.InputArray, dy : _st.InputArray, positions : _st.OutputArray ,votes ? : _st.OutputArray /*= noArray()*/) : void;

	//! Canny low threshold.
	overload->addOverload("generalizedhough", "", "setCannyLowThresh", {
		make_param<int>("cannyLowThresh","int")
	}, setCannyLowThresh);
	//setCannyLowThresh(cannyLowThresh: _st.int) : void;

	overload->addOverload("generalizedhough", "", "getCannyLowThresh", {}, getCannyLowThresh);
	//getCannyLowThresh() : _st.int;

	//! Canny high threshold.
	overload->addOverload("generalizedhough", "", "setCannyHighThresh", {
		make_param<int>("cannyHighThresh","int")
	}, setCannyHighThresh);
	//setCannyHighThresh(cannyHighThresh: _st.int) :void;

	overload->addOverload("generalizedhough", "", "getCannyHighThresh", {}, getCannyHighThresh);
	//getCannyHighThresh() : _st.int;

	//! Minimum distance between the centers of the detected objects.
	overload->addOverload("generalizedhough", "", "setMinDist", {
		make_param<double>("minDist","double")
	}, setMinDist);
	//setMinDist(minDist: _st.double) : void;

	overload->addOverload("generalizedhough", "", "getMinDist", {}, getMinDist);
	//getMinDist() : _st.double;

	//! Inverse ratio of the accumulator resolution to the image resolution.
	overload->addOverload("generalizedhough", "", "setDp", { make_param<double>("dp","double") }, setDp);
	//setDp(dp : _st.double) : void;
	overload->addOverload("generalizedhough", "", "getDp", {}, getDp);
	//getDp() : _st.double;

	//! Maximal size of inner buffers.
	overload->addOverload("generalizedhough", "", "setMaxBufferSize", { make_param<int>("maxBufferSize","int") }, setMaxBufferSize);
	//setMaxBufferSize(maxBufferSize : _st.int) : void;
	overload->addOverload("generalizedhough", "", "getMaxBufferSize", {}, getMaxBufferSize);
	//getMaxBufferSize() : _st.int;
	//};

	target->Set(Nan::New("GeneralizedHough").ToLocalChecked(), ctor->GetFunction());
}


v8::Local<v8::Function> GeneralizedHough::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}

POLY_METHOD(GeneralizedHough::setTemplate){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHough::setTemplate_edge){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHough::detect){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHough::detect_edge){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHough::setCannyLowThresh){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHough::getCannyLowThresh){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHough::setCannyHighThresh){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHough::getCannyHighThresh){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHough::setMinDist){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHough::getMinDist){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHough::setDp){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHough::getDp){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHough::setMaxBufferSize){throw std::exception("not implemented");}
POLY_METHOD(GeneralizedHough::getMaxBufferSize){throw std::exception("not implemented");}