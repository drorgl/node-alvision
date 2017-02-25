#include "KeyPoint.h"
#include "Point.h"
#include "Size.h"

namespace keypoint_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("keypoint_general_callback is empty");
		}
		return overload->execute("keypoint", info);
	}
}

Nan::Persistent<FunctionTemplate> KeyPoint::constructor;

std::string KeyPoint::name;

void KeyPoint::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	KeyPoint::name = "KeyPoint";
	keypoint_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(keypoint_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("KeyPoint").ToLocalChecked());
	//ctor->Inherit(Nan::New(KeyPoint::constructor));

	overload->register_type<KeyPoint>(ctor, "keypoint", "KeyPoint");

	//CV_WRAP KeyPoint();
	overload->addOverloadConstructor("keypoint", "KeyPoint", {}, New_no_params);

	//KeyPoint(Point2f _pt, float _size, float _angle = -1, float _response = 0, int _octave = 0, int _class_id = -1);
	overload->addOverloadConstructor("keypoint", "KeyPoint", {
		make_param<Point2f*>("_pt", "Point2f"),
		make_param<float>("_size","float"),
		make_param<float>("_angle","float", -1),
		make_param<float>("_response","float", 0),
		make_param<int>("_octave","int", 0),
		make_param<int>("_class_id","int", -1)
	}, New_point2f);
	//CV_WRAP KeyPoint(float x, float y, float _size, float _angle = -1, float _response = 0, int _octave = 0, int _class_id = -1);
	overload->addOverloadConstructor("keypoint", "KeyPoint", {
		make_param<float>("x","float"), 
		make_param<float>("y","float"), 
		make_param<float>("_size","float"), 
		make_param<float>("_angle","float", -1),
		make_param<float>("_response","float", 0),
		make_param<int>("_octave","int", 0),
		make_param<int>("_class_id","int", -1)
	}, New_float);


	//size_t hash() const;
	overload->addOverload("keypoint", "KeyPoint", "hash", {}, hash);

	//CV_WRAP static void convert(const std::vector<KeyPoint>& keypoints,
	//	CV_OUT std::vector<Point2f>& points2f,
	//	const std::vector<int>& keypointIndexes = std::vector<int>());
	overload->addOverload("keypoint", "KeyPoint", "convert", {
		make_param<std::shared_ptr<std::vector<std::shared_ptr<KeyPoint>>>>("keypoints","Array<KeyPoint>"),
		make_param<std::shared_ptr<std::vector<std::shared_ptr<Point2f>>>>("points2f","Array<Point2f>"),
		make_param<std::shared_ptr<std::vector<int>>>("keypointIndexes","Array<int>",std::shared_ptr<std::vector<int>>())
	}, convert_keypoint);

	//CV_WRAP static void convert(const std::vector<Point2f>& points2f,
	//	CV_OUT std::vector<KeyPoint>& keypoints,
	//	float size = 1, float response = 1, int octave = 0, int class_id = -1);
	overload->addOverload("keypoint", "KeyPoint", "convert", {
		make_param<std::shared_ptr<std::vector<std::shared_ptr<Point2f>>>>("points2f","Array<Point2f>"),
		make_param<std::shared_ptr<std::vector<std::shared_ptr<KeyPoint>>>>("keypoints","Array<KeyPoint>"),
		make_param<float>("size","float", 1),
		make_param<float>("response","float", 1),
		make_param<int>("octave","int",0),
		make_param<int>("class_id","int", -1)
	}, convert_point2f);

	//CV_WRAP static float overlap(const KeyPoint& kp1, const KeyPoint& kp2);
	overload->addStaticOverload("keypoint", "KeyPoint", "overlap", {
		make_param<KeyPoint*>("kp1","KeyPoint"), 
		make_param<KeyPoint*>("kp2","KeyPoint")
	}, overlap);

	//CV_PROP_RW Point2f pt; //!< coordinates of the keypoints
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("pt").ToLocalChecked(), pt_getter, pt_setter);


	//CV_PROP_RW float size; //!< diameter of the meaningful keypoint neighborhood
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("size").ToLocalChecked(), size_getter, size_setter);
	//CV_PROP_RW float angle; //!< computed orientation of the keypoint (-1 if not applicable);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("angle").ToLocalChecked(), angle_getter, angle_setter);
	//CV_PROP_RW float response; //!< the response by which the most strong keypoints have been selected. Can be used for the further sorting or subsampling
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("response").ToLocalChecked(), response_getter, response_setter);
	//CV_PROP_RW int octave; //!< octave (pyramid layer) from which the keypoint has been extracted
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("octave").ToLocalChecked(), octave_getter, octave_setter);
	//CV_PROP_RW int class_id; //!< object class (if the keypoints need to be clustered by an object they belong to)
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("class_id").ToLocalChecked(), class_id_getter, class_id_setter);

	target->Set(Nan::New("KeyPoint").ToLocalChecked(), ctor->GetFunction());

}

v8::Local<v8::Function> KeyPoint::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}



POLY_METHOD(KeyPoint::New_no_params) {
	auto ret = new KeyPoint();
	ret->_keyPoint = std::make_shared<cv::KeyPoint>();

	ret->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(KeyPoint::New_point2f) {
	auto   _pt		= info.at<Point2f*>(0)->_point;
	auto  _size		= info.at<float>(1);
	auto  _angle	= info.at<float>(2);
	auto  _response = info.at<float>(3);
	auto  _octave	= info.at<int>(4);
	auto  _class_id = info.at<int>(5);

	auto ret = new KeyPoint();
	ret->_keyPoint = std::make_shared<cv::KeyPoint>(
		*_pt			,
		_size		,
		_angle		,
		_response	,
		_octave		,
		_class_id);

	info.SetReturnValue(ret);
}
POLY_METHOD(KeyPoint::New_float) {
	auto x         = info.at<float>(0);  
	auto y         = info.at<float>(1);  
	auto _size     = info.at<float>(2);  
	auto _angle    = info.at<float>(3);  
	auto _response = info.at<float>(4);  
	auto _octave   = info.at<int>(5);	
	auto _class_id = info.at<int>(6);	


	auto ret = new KeyPoint();
	ret->_keyPoint = std::make_shared<cv::KeyPoint>(
		x			,
		y			,
		_size		,
		_angle		,
		_response	,
		_octave		,
		_class_id
		);
	info.SetReturnValue(ret);
}
POLY_METHOD(KeyPoint::hash) {
	auto this_ = info.This<KeyPoint*>();
	info.SetReturnValue((int)this_->_keyPoint->hash());
}
POLY_METHOD(KeyPoint::convert_keypoint) {
	throw std::exception("not implemented");
	//TODO: the conversio is for reference, so current overload does not fulfil the conditions....
	//auto keypoints = info.at<std::shared_ptr<std::vector<KeyPoint>>>(0);
	//auto points2f = info.at<std::shared_ptr<std::vector<Point2f>>>(1);
	//auto keypointIndexes = info.at<std::shared_ptr<std::vector<int>>>(2);
	//
	//cv::KeyPoint::convert(...)
}
POLY_METHOD(KeyPoint::convert_point2f) {
	throw std::exception("not implemented");
	//TODO: the conversio is for reference, so current overload does not fulfil the conditions....
	//auto  points2f = info.at<std::shared_ptr<std::vector<std::shared_ptr<Point2f>>>>(0);
	//auto  keypoints = info.at<std::shared_ptr<std::vector<std::shared_ptr<KeyPoint>>>>(1);
	//auto  size       = info.at<float>(2);
	//auto  response   = info.at<float>(3);
	//auto  octave     = info.at<int>(4);
	//auto  class_id   = info.at<int>(5); 
	//cv::KeyPoint::convert(...)

}
POLY_METHOD(KeyPoint::overlap) {
	auto kp1 = info.at<KeyPoint*>(0)->_keyPoint;
	auto kp2 = info.at<KeyPoint*>(1)->_keyPoint;

	auto ret = cv::KeyPoint::overlap(*kp1, *kp2);
	info.SetReturnValue(ret);
}

NAN_GETTER(KeyPoint::pt_getter) {
	auto this_ = overres::ObjectWrap::Unwrap<KeyPoint>(info.This());

	auto newpt = new Point2f();
	newpt->_point = std::make_shared<cv::Point2f>(this_->_keyPoint->pt);

	info.GetReturnValue().Set(newpt->Wrap());
 }
NAN_SETTER(KeyPoint::pt_setter) {
	auto this_ = overres::ObjectWrap::Unwrap<KeyPoint>(info.This());

	auto pt = overres::ObjectWrap::Unwrap<Point2f>(value.As<v8::Object>());

	this_->_keyPoint->pt = *pt->_point;
 }


NAN_GETTER(KeyPoint::size_getter) {
	auto this_ = overres::ObjectWrap::Unwrap<KeyPoint>(info.This());
	info.GetReturnValue().Set(this_->_keyPoint->size);
 }
NAN_SETTER(KeyPoint::size_setter) {
	auto this_ = overres::ObjectWrap::Unwrap<KeyPoint>(info.This());

	this_->_keyPoint->size = value->NumberValue();
 }

 NAN_GETTER(KeyPoint::angle_getter) {
	 auto this_ = overres::ObjectWrap::Unwrap<KeyPoint>(info.This());

	 info.GetReturnValue().Set(this_->_keyPoint->angle);
 }
 NAN_SETTER(KeyPoint::angle_setter) {
	 auto this_ = overres::ObjectWrap::Unwrap<KeyPoint>(info.This());
	 this_->_keyPoint->angle = value->NumberValue();
 }


 NAN_GETTER(KeyPoint::response_getter) {
	 auto this_ = overres::ObjectWrap::Unwrap<KeyPoint>(info.This());

	 info.GetReturnValue().Set(this_->_keyPoint->response);
 }
 NAN_SETTER(KeyPoint::response_setter) {
	 auto this_ = overres::ObjectWrap::Unwrap<KeyPoint>(info.This());
	 this_->_keyPoint->response = value->NumberValue();
 }

 NAN_GETTER(KeyPoint::octave_getter) {
	 auto this_ = overres::ObjectWrap::Unwrap<KeyPoint>(info.This());

	 info.GetReturnValue().Set(this_->_keyPoint->octave);
 }
 NAN_SETTER(KeyPoint::octave_setter) {
	 auto this_ = overres::ObjectWrap::Unwrap<KeyPoint>(info.This());
	 this_->_keyPoint->octave = value->IntegerValue();
 }

 NAN_GETTER(KeyPoint::class_id_getter) {
	 auto this_ = overres::ObjectWrap::Unwrap<KeyPoint>(info.This());

	 info.GetReturnValue().Set(this_->_keyPoint->class_id);
 }
 NAN_SETTER(KeyPoint::class_id_setter) {
	 auto this_ = overres::ObjectWrap::Unwrap<KeyPoint>(info.This());
	 this_->_keyPoint->class_id = value->IntegerValue();
 }
