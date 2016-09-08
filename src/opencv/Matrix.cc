#include "Matrix.h"
#include "Constants.h"

Nan::Persistent<FunctionTemplate> Matrix::constructor;


void
Matrix::Init(Handle<Object> target) {
	

	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(Matrix::New);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("Mat").ToLocalChecked());

	// Prototype
	
	Nan::SetMethod(ctor, "Zeros", Zeros);
	Nan::SetMethod(ctor, "Ones", Ones);
	Nan::SetMethod(ctor, "Eye", Eye);

	Nan::SetPrototypeMethod(ctor, "colRange", colRange);

	Nan::SetPrototypeMethod(ctor, "row", Row);
	Nan::SetPrototypeMethod(ctor, "col", Col);
	Nan::SetPrototypeMethod(ctor, "pixelRow", PixelRow);
	Nan::SetPrototypeMethod(ctor, "pixelCol", PixelCol);

	Nan::SetPrototypeMethod(ctor, "cols", Cols);

	Nan::SetPrototypeMethod(ctor, "create", create);

	target->Set(Nan::New("Mat").ToLocalChecked(), ctor->GetFunction());
};

NAN_METHOD(Matrix::New) {
	
	if (info.This()->InternalFieldCount() == 0)
		Nan::ThrowTypeError("Cannot instantiate without new");

	Matrix *mat = NULL;

	if (info.Length() == 0){
		mat = new Matrix;
	}
	else if (info.Length() == 2 && info[0]->IsInt32() && info[1]->IsInt32()){
		mat = new Matrix(info[0]->IntegerValue(), info[1]->IntegerValue());
	}
	else if (info.Length() == 3 && info[0]->IsInt32() && info[1]->IsInt32() && info[2]->IsInt32()) {
		mat = new Matrix(info[0]->IntegerValue(), info[1]->IntegerValue(), info[2]->IntegerValue());
	}
	//else { // if (info.Length() == 5) {
	//	Matrix *other = ObjectWrap::Unwrap<Matrix>(info[0]->ToObject());
	//	int x = safe_cast<int>(info[1]->IntegerValue());
	//	int y = safe_cast<int>(info[2]->IntegerValue());
	//	int w = safe_cast<int>(info[3]->IntegerValue());
	//	int h = safe_cast<int>(info[4]->IntegerValue());
	//	mat = new Matrix(other->_mat, cv::Rect(x, y, w, h));
	//}

	if (mat != NULL) {
		mat->Wrap(info.Holder());
		info.Holder()->Set(Nan::New("width").ToLocalChecked(), Nan::New(mat->_mat->cols));
		info.Holder()->Set(Nan::New("height").ToLocalChecked(), Nan::New(mat->_mat->rows));
		info.Holder()->Set(Nan::New("type").ToLocalChecked(), Nan::New(Constants::fromMatType(mat->_mat->type())).ToLocalChecked());
		info.GetReturnValue().Set(info.Holder());
	}

	//TODO: should throw an error
	info.GetReturnValue().SetUndefined();
}


Matrix::Matrix() : ObjectWrap() {
	//mat = cv::Mat();
	_mat = std::make_shared<cv::Mat>();
}


Matrix::Matrix(int64_t rows, int64_t cols) : ObjectWrap() {
	//mat = cv::Mat(rows, cols, CV_32FC3);
	_mat = std::make_shared<cv::Mat>(safe_cast<int>(rows), safe_cast<int>(cols), CV_32FC3);
}

Matrix::Matrix(int64_t rows, int64_t cols, int64_t type) : ObjectWrap() {
	//mat = cv::Mat(rows, cols, type);
	_mat = std::make_shared<cv::Mat>(safe_cast<int>(rows), safe_cast<int>(cols), safe_cast<int>(type));
}

Matrix::Matrix(std::shared_ptr<cv::Mat> m, cv::Rect roi) : ObjectWrap() {
	//mat = cv::Mat(m, roi);
	_mat = std::make_shared<cv::Mat>(*m, roi);
}



//NAN_METHOD(Matrix::Empty){
//	SETUP_FUNCTION(Matrix)
//		NanReturnValue(Nan::New<Boolean>(self->_mat->empty()));
//}

double
Matrix::DblGet(cv::Mat mat, int i, int j){

	double val = 0;
	cv::Vec3b pix;
	unsigned int pint = 0;

	switch (mat.type()){
	case CV_32FC3:
		pix = mat.at<cv::Vec3b>(i, j);
		pint |= (uchar)pix.val[2];
		pint |= ((uchar)pix.val[1]) << 8;
		pint |= ((uchar)pix.val[0]) << 16;
		val = (double)pint;
		break;

	case CV_64FC1:
		val = mat.at<double>(i, j);
		break;

	default:
		val = mat.at<double>(i, j);
		break;
	}

	return val;
}

NAN_METHOD(Matrix::create) {
	return Nan::ThrowError("not implemented");
}

//NAN_METHOD(Matrix::Pixel){
//	SETUP_FUNCTION(Matrix)
//
//		int y = info[0]->IntegerValue();
//	int x = info[1]->IntegerValue();
//
//	//cv::Scalar scal = self->mat.at<uchar>(y, x);
//
//
//	if (info.Length() == 3){
//
//		Local<Object> objColor = info[2]->ToObject();
//
//		if (self->_mat->channels() == 3){
//			self->_mat->at<cv::Vec3b>(y, x)[0] = (uchar)objColor->Get(0)->IntegerValue();
//			self->_mat->at<cv::Vec3b>(y, x)[1] = (uchar)objColor->Get(1)->IntegerValue();
//			self->_mat->at<cv::Vec3b>(y, x)[2] = (uchar)objColor->Get(2)->IntegerValue();
//		}
//		else if (self->_mat->channels() == 1)
//			self->_mat->at<uchar>(y, x) = (uchar)objColor->Get(0)->IntegerValue();
//
//		NanReturnValue(info[2]->ToObject());
//	}
//	else{
//
//		if (self->_mat->channels() == 3){
//			cv::Vec3b intensity = self->_mat->at<cv::Vec3b>(y, x);
//
//			v8::Local<v8::Array> arr = Nan::New<v8::Array>(3);
//			arr->Set(0, Nan::New<Number>(intensity[0]));
//			arr->Set(1, Nan::New<Number>(intensity[1]));
//			arr->Set(2, Nan::New<Number>(intensity[2]));
//			NanReturnValue(arr);
//		}
//		else if (self->_mat->channels() == 1){
//
//			uchar intensity = self->_mat->at<uchar>(y, x);
//			NanReturnValue(Nan::New<Number>(intensity));
//		}
//	}
//	NanReturnUndefined();
//	//double val = Matrix::DblGet(t, i, j);
//	//NanReturnValue(Nan::New<Number>(val));
//}


//NAN_METHOD(Matrix::Size){
//	SETUP_FUNCTION(Matrix)
//
//		v8::Local<v8::Array> arr = Nan::New<Array>(2);
//	arr->Set(0, Nan::New<Number>(self->_mat->size().height));
//	arr->Set(1, Nan::New<Number>(self->_mat->size().width));
//
//	NanReturnValue(arr);
//}
//
//
//NAN_METHOD(Matrix::Clone){
//	SETUP_FUNCTION(Matrix)
//
//		Local<Object> im_h = Nan::New(Matrix::constructor)->GetFunction()->NewInstance();
//
//	Matrix *m = ObjectWrap::Unwrap<Matrix>(im_h);
//	m->_mat = self->_mat->clone();
//
//	NanReturnValue(im_h);
//}
//
//NAN_METHOD(Matrix::Crop){
//
//	SETUP_FUNCTION(Matrix)
//
//	if ((info.Length() == 4) && (info[0]->IsNumber()) && (info[1]->IsNumber()) && (info[2]->IsNumber()) && (info[3]->IsNumber())){
//
//		int x = info[0]->IntegerValue();
//		int y = info[1]->IntegerValue();
//		int width = info[2]->IntegerValue();
//		int height = info[3]->IntegerValue();
//
//		cv::Rect roi(x, y, width, height);
//
//		Local<Object> im_h = Nan::New(Matrix::constructor)->GetFunction()->NewInstance();
//		Matrix *m = ObjectWrap::Unwrap<Matrix>(im_h);
//		m->_mat = self->_mat.get()(roi);
//
//		NanReturnValue(im_h);
//	}
//	else{
//		NanReturnValue(Nan::New("Insufficient or wrong arguments"));
//	}
//}

NAN_METHOD(Matrix::Zeros){
	

	int w = info[0]->Uint32Value();
	int h = info[1]->Uint32Value();
	int type = (info.Length() > 2) ? safe_cast<int>(info[2]->IntegerValue()) : CV_64FC1;

	Local<Object> im_h = Nan::New(Matrix::constructor)->GetFunction()->NewInstance();
	Matrix *img = ObjectWrap::Unwrap<Matrix>(im_h);
	
	img->_mat = std::make_shared<cv::Mat>(cv::Mat::zeros(w, h, type));
		info.GetReturnValue().Set(im_h);
}

NAN_METHOD(Matrix::Ones){
	

	int w = info[0]->Uint32Value();
	int h = info[1]->Uint32Value();
	int type = (info.Length() > 2) ? safe_cast<int>(info[2]->IntegerValue()) : CV_64FC1;

	Local<Object> im_h = Nan::New(Matrix::constructor)->GetFunction()->NewInstance();
	Matrix *img = ObjectWrap::Unwrap<Matrix>(im_h);
	
	img->_mat = std::make_shared<cv::Mat>(cv::Mat::ones(w, h, type));
	info.GetReturnValue().Set(im_h);
}

NAN_METHOD(Matrix::Eye){
	

	int w = info[0]->Uint32Value();
	int h = info[1]->Uint32Value();
	int type = (info.Length() > 2) ? safe_cast<int>(info[2]->IntegerValue()) : CV_64FC1;

	Local<Object> im_h = Nan::New(Matrix::constructor)->GetFunction()->NewInstance();
	Matrix *img = ObjectWrap::Unwrap<Matrix>(im_h);
	
	img->_mat = std::make_shared<cv::Mat>(cv::Mat::eye(w, h, type));
	info.GetReturnValue().Set(im_h);
}



NAN_METHOD(Matrix::Row){
	SETUP_FUNCTION(Matrix)

		int width = self->_mat->size().width;
	int y = safe_cast<int>(info[0]->IntegerValue());
	v8::Local<v8::Array> arr = Nan::New<Array>(width);

	for (int x = 0; x<width; x++){
		double v = Matrix::DblGet(*self->_mat, y, x);
		arr->Set(x, Nan::New<Number>(v));
	}

	info.GetReturnValue().Set(arr);
}


NAN_METHOD(Matrix::PixelRow){
	SETUP_FUNCTION(Matrix)

		int width = self->_mat->size().width;
	int y = safe_cast<int>(info[0]->IntegerValue());
	v8::Local<v8::Array> arr = Nan::New<Array>(width * 3);

	for (int x = 0; x<width; x++){
		cv::Vec3b pixel = self->_mat->at<cv::Vec3b>(y, x);
		int offset = x * 3;
		arr->Set(offset, Nan::New<Number>((double)pixel.val[0]));
		arr->Set(offset + 1, Nan::New<Number>((double)pixel.val[1]));
		arr->Set(offset + 2, Nan::New<Number>((double)pixel.val[2]));
	}

	info.GetReturnValue().Set(arr);
}

NAN_METHOD(Matrix::colRange) {
	SETUP_FUNCTION(Matrix)

		return Nan::ThrowError("not implemented");
}


NAN_METHOD(Matrix::Col){
	SETUP_FUNCTION(Matrix)

		int height = self->_mat->size().height;
	int x = safe_cast<int>(info[0]->IntegerValue());
	v8::Local<v8::Array> arr = Nan::New<Array>(height);

	for (int y = 0; y<height; y++){
		double v = Matrix::DblGet(*self->_mat, y, x);
		arr->Set(y, Nan::New<Number>(v));
	}
	info.GetReturnValue().Set(arr);
}


NAN_METHOD(Matrix::PixelCol){
	SETUP_FUNCTION(Matrix)

		int height = self->_mat->size().height;
	int x = safe_cast<int>(info[0]->IntegerValue());
	v8::Local<v8::Array> arr = Nan::New<Array>(height * 3);

	for (int y = 0; y<height; y++){
		cv::Vec3b pixel = self->_mat->at<cv::Vec3b>(y, x);
		int offset = y * 3;
		arr->Set(offset, Nan::New<Number>((double)pixel.val[0]));
		arr->Set(offset + 1, Nan::New<Number>((double)pixel.val[1]));
		arr->Set(offset + 2, Nan::New<Number>((double)pixel.val[2]));
	}
	info.GetReturnValue().Set(arr);
}


NAN_METHOD(Matrix::Cols) {
	return Nan::ThrowError("not implemented");
}