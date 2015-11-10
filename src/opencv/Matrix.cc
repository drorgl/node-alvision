#include "Matrix.h"
#include "Constants.h"

v8::Persistent<FunctionTemplate> Matrix::constructor;


void
Matrix::Init(Handle<Object> target) {
	NanScope();

	//Class
	Local<FunctionTemplate> ctor = NanNew<FunctionTemplate>(Matrix::New);
	NanAssignPersistent(constructor, ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(NanNew("Matrix"));

	// Prototype
	NODE_SET_METHOD(ctor, "Zeros", Zeros);
	NODE_SET_METHOD(ctor, "Ones", Ones);
	NODE_SET_METHOD(ctor, "Eye", Eye);

	NODE_SET_PROTOTYPE_METHOD(ctor, "row", Row);
	NODE_SET_PROTOTYPE_METHOD(ctor, "col", Col);
	NODE_SET_PROTOTYPE_METHOD(ctor, "pixelRow", PixelRow);
	NODE_SET_PROTOTYPE_METHOD(ctor, "pixelCol", PixelCol);

	target->Set(NanNew("Matrix"), ctor->GetFunction());
};

NAN_METHOD(Matrix::New) {
	NanScope();
	if (args.This()->InternalFieldCount() == 0)
		NanThrowTypeError("Cannot instantiate without new");

	Matrix *mat;

	if (args.Length() == 0){
		mat = new Matrix;
	}
	else if (args.Length() == 2 && args[0]->IsInt32() && args[1]->IsInt32()){
		mat = new Matrix(args[0]->IntegerValue(), args[1]->IntegerValue());
	}
	else if (args.Length() == 3 && args[0]->IsInt32() && args[1]->IsInt32() && args[2]->IsInt32()) {
		mat = new Matrix(args[0]->IntegerValue(), args[1]->IntegerValue(), args[2]->IntegerValue());
	}
	else { // if (args.Length() == 5) {
		Matrix *other = ObjectWrap::Unwrap<Matrix>(args[0]->ToObject());
		int x = safe_cast<int>(args[1]->IntegerValue());
		int y = safe_cast<int>(args[2]->IntegerValue());
		int w = safe_cast<int>(args[3]->IntegerValue());
		int h = safe_cast<int>(args[4]->IntegerValue());
		mat = new Matrix(other->_mat, cv::Rect(x, y, w, h));
	}

	mat->Wrap(args.Holder());
	args.Holder()->Set(NanNew("width"), NanNew(mat->_mat->cols));
	args.Holder()->Set(NanNew("height"), NanNew(mat->_mat->rows));
	args.Holder()->Set(NanNew("type"), NanNew(Constants::fromMatType(mat->_mat->type())));
	NanReturnValue(args.Holder());
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
//		NanReturnValue(NanNew<Boolean>(self->_mat->empty()));
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



//NAN_METHOD(Matrix::Pixel){
//	SETUP_FUNCTION(Matrix)
//
//		int y = args[0]->IntegerValue();
//	int x = args[1]->IntegerValue();
//
//	//cv::Scalar scal = self->mat.at<uchar>(y, x);
//
//
//	if (args.Length() == 3){
//
//		Local<Object> objColor = args[2]->ToObject();
//
//		if (self->_mat->channels() == 3){
//			self->_mat->at<cv::Vec3b>(y, x)[0] = (uchar)objColor->Get(0)->IntegerValue();
//			self->_mat->at<cv::Vec3b>(y, x)[1] = (uchar)objColor->Get(1)->IntegerValue();
//			self->_mat->at<cv::Vec3b>(y, x)[2] = (uchar)objColor->Get(2)->IntegerValue();
//		}
//		else if (self->_mat->channels() == 1)
//			self->_mat->at<uchar>(y, x) = (uchar)objColor->Get(0)->IntegerValue();
//
//		NanReturnValue(args[2]->ToObject());
//	}
//	else{
//
//		if (self->_mat->channels() == 3){
//			cv::Vec3b intensity = self->_mat->at<cv::Vec3b>(y, x);
//
//			v8::Local<v8::Array> arr = NanNew<v8::Array>(3);
//			arr->Set(0, NanNew<Number>(intensity[0]));
//			arr->Set(1, NanNew<Number>(intensity[1]));
//			arr->Set(2, NanNew<Number>(intensity[2]));
//			NanReturnValue(arr);
//		}
//		else if (self->_mat->channels() == 1){
//
//			uchar intensity = self->_mat->at<uchar>(y, x);
//			NanReturnValue(NanNew<Number>(intensity));
//		}
//	}
//	NanReturnUndefined();
//	//double val = Matrix::DblGet(t, i, j);
//	//NanReturnValue(NanNew<Number>(val));
//}


//NAN_METHOD(Matrix::Size){
//	SETUP_FUNCTION(Matrix)
//
//		v8::Local<v8::Array> arr = NanNew<Array>(2);
//	arr->Set(0, NanNew<Number>(self->_mat->size().height));
//	arr->Set(1, NanNew<Number>(self->_mat->size().width));
//
//	NanReturnValue(arr);
//}
//
//
//NAN_METHOD(Matrix::Clone){
//	SETUP_FUNCTION(Matrix)
//
//		Local<Object> im_h = NanNew(Matrix::constructor)->GetFunction()->NewInstance();
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
//	if ((args.Length() == 4) && (args[0]->IsNumber()) && (args[1]->IsNumber()) && (args[2]->IsNumber()) && (args[3]->IsNumber())){
//
//		int x = args[0]->IntegerValue();
//		int y = args[1]->IntegerValue();
//		int width = args[2]->IntegerValue();
//		int height = args[3]->IntegerValue();
//
//		cv::Rect roi(x, y, width, height);
//
//		Local<Object> im_h = NanNew(Matrix::constructor)->GetFunction()->NewInstance();
//		Matrix *m = ObjectWrap::Unwrap<Matrix>(im_h);
//		m->_mat = self->_mat.get()(roi);
//
//		NanReturnValue(im_h);
//	}
//	else{
//		NanReturnValue(NanNew("Insufficient or wrong arguments"));
//	}
//}

NAN_METHOD(Matrix::Zeros){
	NanScope();

	int w = args[0]->Uint32Value();
	int h = args[1]->Uint32Value();
	int type = (args.Length() > 2) ? safe_cast<int>(args[2]->IntegerValue()) : CV_64FC1;

	Local<Object> im_h = NanNew(Matrix::constructor)->GetFunction()->NewInstance();
	Matrix *img = ObjectWrap::Unwrap<Matrix>(im_h);
	
	img->_mat = std::make_shared<cv::Mat>(cv::Mat::zeros(w, h, type));
	NanReturnValue(im_h);
}

NAN_METHOD(Matrix::Ones){
	NanScope();

	int w = args[0]->Uint32Value();
	int h = args[1]->Uint32Value();
	int type = (args.Length() > 2) ? safe_cast<int>(args[2]->IntegerValue()) : CV_64FC1;

	Local<Object> im_h = NanNew(Matrix::constructor)->GetFunction()->NewInstance();
	Matrix *img = ObjectWrap::Unwrap<Matrix>(im_h);
	
	img->_mat = std::make_shared<cv::Mat>(cv::Mat::ones(w, h, type));
	NanReturnValue(im_h);
}

NAN_METHOD(Matrix::Eye){
	NanScope();

	int w = args[0]->Uint32Value();
	int h = args[1]->Uint32Value();
	int type = (args.Length() > 2) ? safe_cast<int>(args[2]->IntegerValue()) : CV_64FC1;

	Local<Object> im_h = NanNew(Matrix::constructor)->GetFunction()->NewInstance();
	Matrix *img = ObjectWrap::Unwrap<Matrix>(im_h);
	
	img->_mat = std::make_shared<cv::Mat>(cv::Mat::eye(w, h, type));
	NanReturnValue(im_h);
}



NAN_METHOD(Matrix::Row){
	SETUP_FUNCTION(Matrix)

		int width = self->_mat->size().width;
	int y = safe_cast<int>(args[0]->IntegerValue());
	v8::Local<v8::Array> arr = NanNew<Array>(width);

	for (int x = 0; x<width; x++){
		double v = Matrix::DblGet(*self->_mat, y, x);
		arr->Set(x, NanNew<Number>(v));
	}

	NanReturnValue(arr);
}


NAN_METHOD(Matrix::PixelRow){
	SETUP_FUNCTION(Matrix)

		int width = self->_mat->size().width;
	int y = safe_cast<int>(args[0]->IntegerValue());
	v8::Local<v8::Array> arr = NanNew<Array>(width * 3);

	for (int x = 0; x<width; x++){
		cv::Vec3b pixel = self->_mat->at<cv::Vec3b>(y, x);
		int offset = x * 3;
		arr->Set(offset, NanNew<Number>((double)pixel.val[0]));
		arr->Set(offset + 1, NanNew<Number>((double)pixel.val[1]));
		arr->Set(offset + 2, NanNew<Number>((double)pixel.val[2]));
	}

	NanReturnValue(arr);
}


NAN_METHOD(Matrix::Col){
	SETUP_FUNCTION(Matrix)

		int height = self->_mat->size().height;
	int x = safe_cast<int>(args[0]->IntegerValue());
	v8::Local<v8::Array> arr = NanNew<Array>(height);

	for (int y = 0; y<height; y++){
		double v = Matrix::DblGet(*self->_mat, y, x);
		arr->Set(y, NanNew<Number>(v));
	}
	NanReturnValue(arr);
}


NAN_METHOD(Matrix::PixelCol){
	SETUP_FUNCTION(Matrix)

		int height = self->_mat->size().height;
	int x = safe_cast<int>(args[0]->IntegerValue());
	v8::Local<v8::Array> arr = NanNew<Array>(height * 3);

	for (int y = 0; y<height; y++){
		cv::Vec3b pixel = self->_mat->at<cv::Vec3b>(y, x);
		int offset = y * 3;
		arr->Set(offset, NanNew<Number>((double)pixel.val[0]));
		arr->Set(offset + 1, NanNew<Number>((double)pixel.val[1]));
		arr->Set(offset + 2, NanNew<Number>((double)pixel.val[2]));
	}
	NanReturnValue(arr);
}
