#include "SparseMat.h"
#include "Constants.h"

Nan::Persistent<FunctionTemplate> SparseMat::constructor;


void
SparseMat::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	

	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(SparseMat::New);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("SparseMat").ToLocalChecked());

	overload->register_type<SparseMat>(ctor, "sparsemat", "SparseMat");

	

	target->Set(Nan::New("SparseMat").ToLocalChecked(), ctor->GetFunction());

	
};

v8::Local<v8::Function> SparseMat::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


NAN_METHOD(SparseMat::New) {
	
	if (info.This()->InternalFieldCount() == 0)
		Nan::ThrowTypeError("Cannot instantiate without new");

	SparseMat *mat = NULL;

	//if (info.Length() == 0){
		mat = new SparseMat;
	/*}
	else if (info.Length() == 2 && info[0]->IsInt32() && info[1]->IsInt32()){
		mat = new SparseMat(info[0]->IntegerValue(), info[1]->IntegerValue());
	}
	else if (info.Length() == 3 && info[0]->IsInt32() && info[1]->IsInt32() && info[2]->IsInt32()) {
		mat = new SparseMat(info[0]->IntegerValue(), info[1]->IntegerValue(), info[2]->IntegerValue());
	}*/
	//else { // if (info.Length() == 5) {
	//	SparseMat *other = ObjectWrap::Unwrap<SparseMat>(info[0]->ToObject());
	//	int x = safe_cast<int>(info[1]->IntegerValue());
	//	int y = safe_cast<int>(info[2]->IntegerValue());
	//	int w = safe_cast<int>(info[3]->IntegerValue());
	//	int h = safe_cast<int>(info[4]->IntegerValue());
	//	mat = new SparseMat(other->_mat, cv::Rect(x, y, w, h));
	//}

	if (mat != NULL) {
		mat->Wrap(info.Holder());
		/*info.Holder()->Set(Nan::New("width").ToLocalChecked(), Nan::New(mat->_mat->cols));
		info.Holder()->Set(Nan::New("height").ToLocalChecked(), Nan::New(mat->_mat->rows));
		info.Holder()->Set(Nan::New("type").ToLocalChecked(), Nan::New(Constants::fromMatType(mat->_mat->type())).ToLocalChecked());*/
		info.GetReturnValue().Set(info.Holder());
	}

	//TODO: should throw an error
	info.GetReturnValue().SetUndefined();
}

