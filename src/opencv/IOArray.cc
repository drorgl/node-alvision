#include "IOArray.h"

#include "types/Point.h"
#include "types/Point3.h"

namespace general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(ioarray_callback) {
		if (overload == nullptr) {
			throw std::exception("ioarray_general_callback is empty");
		}
		return overload->execute("ioarray", info);
	}
}


Nan::Persistent<FunctionTemplate> IOArray::constructor;
std::string IOArray::name;

void IOArray::Register(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	general_callback::overload = overload;
	IOArray::name = "IOArray";

	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(general_callback::ioarray_callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("IOArray").ToLocalChecked());
	overload->register_type<IOArray>(ctor, "ioarray", "IOArray");

	overload->addOverloadConstructor("ioarray", "IOArray", {}, IOArray::New);
}

void IOArray::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	auto ctor = Nan::New(constructor);

	/*overload->addOverloadConstructor("ioarray", "IOArray", { make_param<std::shared_ptr<std::vector<Point2i*>>>("vec","Array<"s + Point2i::name + ">") }, IOArray::New_vector_Point2i);
	overload->addOverloadConstructor("ioarray", "IOArray", { make_param<std::shared_ptr<std::vector<Point2f*>>>("vec","Array<"s + Point2f::name + ">") }, IOArray::New_vector_Point2f);
	overload->addOverloadConstructor("ioarray", "IOArray", { make_param<std::shared_ptr<std::vector<Point2d*>>>("vec","Array<"s + Point2d::name + ">") }, IOArray::New_vector_Point2d);
									  
	overload->addOverloadConstructor("ioarray", "IOArray", { make_param<std::shared_ptr<std::vector<Point3i*>>>("vec","Array<"s + Point3i::name + ">") }, IOArray::New_vector_Point3i);
	overload->addOverloadConstructor("ioarray", "IOArray", { make_param<std::shared_ptr<std::vector<Point3f*>>>("vec","Array<"s + Point3f::name + ">") }, IOArray::New_vector_Point3f);
	overload->addOverloadConstructor("ioarray", "IOArray", { make_param<std::shared_ptr<std::vector<Point3d*>>>("vec","Array<"s + Point3d::name + ">") }, IOArray::New_vector_Point3d);
*/
	target->Set(Nan::New("IOArray").ToLocalChecked(), ctor->GetFunction());

	
}

v8::Local<v8::Function> IOArray::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}

POLY_METHOD(IOArray::New) {
	//auto instance =  
}

std::shared_ptr<IOArray> IOArray::noArray() {

	auto ret = std::make_shared<IOArray>();
	ret->_ioarray = std::make_shared<cv::_InputOutputArray>(cv::noArray());
	return ret;
}

cv::_InputArray					IOArray::GetInputArray() {
	return *_ioarray;
}
cv::_InputArray			IOArray::GetInputArrayOfArrays() {
	return *_ioarray;
}
cv::_OutputArray					IOArray::GetOutputArray() {
	return *_ioarray;
}
cv::_OutputArray			IOArray::GetOutputArrayOfArrays() {
	return *_ioarray;
}
cv::_InputOutputArray			IOArray::GetInputOutputArray() {
	return *_ioarray;
}
cv::_InputOutputArray	IOArray::GetInputOutputArrayOfArrays() {
	return *_ioarray;
}

//
// POLY_METHOD(IOArray::New_vector_Point2i) {
//	typedef typename Point2i PointCV;
//	auto ioarr = new IOArray();
//
//	auto vec = *info.at < std::shared_ptr<std::vector<PointCV*>>>(0);
//	auto vec_cv = std::make_shared<std::vector<PointCV::CVT>>();
//	std::transform(std::begin(vec), std::end(vec), std::back_inserter(*vec_cv), [](const PointCV* pt) {return *pt->_point; });
//
//	ioarr->_references.push_back(vec_cv);
//	ioarr->_ioarray = std::make_shared<cv::_InputOutputArray>(*vec_cv);
//	ioarr->Wrap(info.Holder());
//	info.GetReturnValue().Set(info.Holder());
//}
// POLY_METHOD(IOArray::New_vector_Point2f) {
//	typedef typename Point2f PointCV;
//	auto ioarr = new IOArray();
//
//	auto vec = *info.at < std::shared_ptr<std::vector<PointCV*>>>(0);
//	auto vec_cv = std::make_shared<std::vector<PointCV::CVT>>();
//	std::transform(std::begin(vec), std::end(vec), std::back_inserter(*vec_cv), [](const PointCV* pt) {return *pt->_point; });
//
//	ioarr->_references.push_back(vec_cv);
//	ioarr->_ioarray = std::make_shared<cv::_InputOutputArray>(*vec_cv);
//	ioarr->Wrap(info.Holder());
//	info.GetReturnValue().Set(info.Holder());
//}
// POLY_METHOD(IOArray::New_vector_Point2d) {
//	typedef typename Point2d PointCV;
//	auto ioarr = new IOArray();
//
//	auto vec = *info.at < std::shared_ptr<std::vector<PointCV*>>>(0);
//	auto vec_cv = std::make_shared<std::vector<PointCV::CVT>>();
//	std::transform(std::begin(vec), std::end(vec), std::back_inserter(*vec_cv), [](const PointCV* pt) {return *pt->_point; });
//
//	ioarr->_references.push_back(vec_cv);
//	ioarr->_ioarray = std::make_shared<cv::_InputOutputArray>(*vec_cv);
//	ioarr->Wrap(info.Holder());
//	info.GetReturnValue().Set(info.Holder());
//}
//
// POLY_METHOD(IOArray::New_vector_Point3i) {
//	typedef typename Point3i PointCV;
//	auto ioarr = new IOArray();
//
//	auto vec = *info.at < std::shared_ptr<std::vector<PointCV*>>>(0);
//	auto vec_cv = std::make_shared<std::vector<PointCV::CVT>>();
//	std::transform(std::begin(vec), std::end(vec), std::back_inserter(*vec_cv), [](const PointCV* pt) {return *pt->_point3; });
//
//	ioarr->_references.push_back(vec_cv);
//	ioarr->_ioarray = std::make_shared<cv::_InputOutputArray>(*vec_cv);
//	ioarr->Wrap(info.Holder());
//	info.GetReturnValue().Set(info.Holder());
//}
// POLY_METHOD(IOArray::New_vector_Point3f) {
//	typedef typename Point3f PointCV;
//	auto ioarr = new IOArray();
//
//	auto vec = *info.at < std::shared_ptr<std::vector<PointCV*>>>(0);
//	auto vec_cv = std::make_shared<std::vector<PointCV::CVT>>();
//	std::transform(std::begin(vec), std::end(vec), std::back_inserter(*vec_cv), [](const PointCV* pt) {return *pt->_point3; });
//
//	ioarr->_references.push_back(vec_cv);
//	ioarr->_ioarray = std::make_shared<cv::_InputOutputArray>(*vec_cv);
//	ioarr->Wrap(info.Holder());
//	info.GetReturnValue().Set(info.Holder());
//}
// POLY_METHOD(IOArray::New_vector_Point3d) {
//	typedef typename Point3d PointCV;
//	auto ioarr = new IOArray();
//
//	auto vec = *info.at < std::shared_ptr<std::vector<PointCV*>>>(0);
//	auto vec_cv = std::make_shared<std::vector<PointCV::CVT>>();
//	std::transform(std::begin(vec), std::end(vec), std::back_inserter(*vec_cv), [](const PointCV* pt) {return *pt->_point3; });
//
//	ioarr->_references.push_back(vec_cv);
//	ioarr->_ioarray = std::make_shared<cv::_InputOutputArray>(*vec_cv);
//	ioarr->Wrap(info.Holder());
//	info.GetReturnValue().Set(info.Holder());
//}