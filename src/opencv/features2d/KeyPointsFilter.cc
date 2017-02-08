#include "KeyPointsFilter.h"
#include "../types/KeyPoint.h"
#include "../types/Size.h"

namespace keypointsfilter_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("keypointsfilter_general_callback is empty");
		}
		return overload->execute("keypointsfilter", info);
	}
}

Nan::Persistent<FunctionTemplate> KeyPointsFilter::constructor;

void
KeyPointsFilter::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	keypointsfilter_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(keypointsfilter_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("KeyPointsFilter").ToLocalChecked());
	

	overload->register_type<KeyPointsFilter>(ctor, "keypointsfilter", "KeyPointsFilter");

//class CV_EXPORTS KeyPointsFilter
//{
//public:
//	KeyPointsFilter() {}
	overload->addOverloadConstructor("keypointsfilter", "KeyPointsFilter", {},New);
//
//	/*
//	* Remove keypoints within borderPixels of an image edge.
//	*/
//	static void runByImageBorder(std::vector<KeyPoint>& keypoints, Size imageSize, int borderSize);
	overload->addStaticOverload("keypointsfilter", "KeyPointsFilter", "runByImageBorder", {
		make_param<std::shared_ptr<std::vector<KeyPoint*>>>("keypoints","Array<KeyPoint>"), 
		make_param<Size*>("imageSize",Size::name), 
		make_param<int>("borderSize","int")
	}, runByImageBorder);
	Nan::SetMethod(ctor, "runByImageBorder", keypointsfilter_general_callback::callback);
//	/*
//	* Remove keypoints of sizes out of range.
//	*/
//	static void runByKeypointSize(std::vector<KeyPoint>& keypoints, float minSize,
//		float maxSize = FLT_MAX);
	overload->addStaticOverload("keypointsfilter", "KeyPointsFilter", "runByKeypointSize", {
		make_param<std::shared_ptr<std::vector<KeyPoint*>>>("keypoints","Array<KeyPoint>"),
		make_param<float>("minSize","float"),
		make_param<float>("maxSize","float", FLT_MAX)
	}, runByKeypointSize);
	Nan::SetMethod(ctor, "runByKeypointSize", keypointsfilter_general_callback::callback);
//	/*
//	* Remove keypoints from some image by mask for pixels of this image.
//	*/
//	static void runByPixelsMask(std::vector<KeyPoint>& keypoints, const Mat& mask);
	overload->addStaticOverload("keypointsfilter", "KeyPointsFilter", "runByPixelsMask", {
		make_param<std::shared_ptr<std::vector<KeyPoint*>>>("keypoints","Array<KeyPoint>"),
		make_param<Matrix*>("mask",Matrix::name)
	}, runByPixelsMask);
	Nan::SetMethod(ctor, "runByPixelsMask", keypointsfilter_general_callback::callback);
//	/*
//	* Remove duplicated keypoints.
//	*/
//	static void removeDuplicated(std::vector<KeyPoint>& keypoints);
	overload->addStaticOverload("keypointsfilter", "KeyPointsFilter", "removeDuplicated", {
		make_param<std::shared_ptr<std::vector<KeyPoint*>>>("keypoints","Array<KeyPoint>")
	}, removeDuplicated);
	Nan::SetMethod(ctor, "removeDuplicated", keypointsfilter_general_callback::callback);
//
//	/*
//	* Retain the specified number of the best keypoints (according to the response)
//	*/
//	static void retainBest(std::vector<KeyPoint>& keypoints, int npoints);
	overload->addStaticOverload("keypointsfilter", "KeyPointsFilter", "retainBest", {
		make_param<std::shared_ptr<std::vector<KeyPoint*>>>("keypoints","Array<KeyPoint>"),
		make_param<int>("npoints","int")
	}, retainBest);
	Nan::SetMethod(ctor, "retainBest", keypointsfilter_general_callback::callback);
//};






target->Set(Nan::New("KeyPointsFilter").ToLocalChecked(), ctor->GetFunction());


}


v8::Local<v8::Function> KeyPointsFilter::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}



POLY_METHOD(KeyPointsFilter::New){throw std::exception("not implemented");}
POLY_METHOD(KeyPointsFilter::runByImageBorder){throw std::exception("not implemented");}
POLY_METHOD(KeyPointsFilter::runByKeypointSize){throw std::exception("not implemented");}
POLY_METHOD(KeyPointsFilter::runByPixelsMask){throw std::exception("not implemented");}
POLY_METHOD(KeyPointsFilter::removeDuplicated){throw std::exception("not implemented");}
POLY_METHOD(KeyPointsFilter::retainBest){throw std::exception("not implemented");}

