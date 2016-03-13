#include "Constants.h"

#define CONST(obj,C) \
  obj->Set(Nan::New<String>(#C).ToLocalChecked(), Nan::New<Integer>(C));

void
Constants::Init(Handle<Object> target) {
  Nan::Persistent<Object> inner;
  Local<Object> matrixTypeObj = Nan::New<Object>();
  inner.Reset(matrixTypeObj);

  CONST(matrixTypeObj,CV_8U);
  CONST(matrixTypeObj,CV_8S);
  CONST(matrixTypeObj,CV_16U);
  CONST(matrixTypeObj,CV_16S);
  CONST(matrixTypeObj,CV_32S);
  CONST(matrixTypeObj,CV_32F);
  CONST(matrixTypeObj,CV_64F);
  CONST(matrixTypeObj,CV_USRTYPE1);

  CONST(matrixTypeObj,CV_8UC1);
  CONST(matrixTypeObj,CV_8UC2);
  CONST(matrixTypeObj,CV_8UC3);
  CONST(matrixTypeObj,CV_8UC4);

  CONST(matrixTypeObj,CV_8SC1);
  CONST(matrixTypeObj,CV_8SC2);
  CONST(matrixTypeObj,CV_8SC3);
  CONST(matrixTypeObj,CV_8SC4);

  CONST(matrixTypeObj,CV_16UC1);
  CONST(matrixTypeObj,CV_16UC2);
  CONST(matrixTypeObj,CV_16UC3);
  CONST(matrixTypeObj,CV_16UC4);

  CONST(matrixTypeObj,CV_16SC1);
  CONST(matrixTypeObj,CV_16SC2);
  CONST(matrixTypeObj,CV_16SC3);
  CONST(matrixTypeObj,CV_16SC4);

  CONST(matrixTypeObj,CV_32SC1);
  CONST(matrixTypeObj,CV_32SC2);
  CONST(matrixTypeObj,CV_32SC3);
  CONST(matrixTypeObj,CV_32SC4);

  CONST(matrixTypeObj,CV_32FC1);
  CONST(matrixTypeObj,CV_32FC2);
  CONST(matrixTypeObj,CV_32FC3);
  CONST(matrixTypeObj,CV_32FC4);

  CONST(matrixTypeObj,CV_64FC1);
  CONST(matrixTypeObj,CV_64FC2);
  CONST(matrixTypeObj,CV_64FC3);
  CONST(matrixTypeObj,CV_64FC4);

  Nan::SetMethod(matrixTypeObj, "CV_MAKETYPE", cvMakeType);

  target->Set(Nan::New("MatrixType").ToLocalChecked(), matrixTypeObj);
}

NAN_METHOD(Constants::cvMakeType){
	

	if (info.Length() < 2){
		return Nan::ThrowError("MatrixType.CV_MAKETYPE(depth,channels);");
	}

	auto depth = info[0]->Int32Value();
	auto channels = info[1]->Int32Value();

	auto result = CV_MAKETYPE(depth, channels);

	info.GetReturnValue().Set(Nan::New(result));
}

#undef CONST

std::string Constants::fromMatType(int number)
{
	int imgTypeInt = number % 8;
	std::string imgTypeString;

	switch (imgTypeInt)
	{
	case 0:
		imgTypeString = "8U";
		break;
	case 1:
		imgTypeString = "8S";
		break;
	case 2:
		imgTypeString = "16U";
		break;
	case 3:
		imgTypeString = "16S";
		break;
	case 4:
		imgTypeString = "32S";
		break;
	case 5:
		imgTypeString = "32F";
		break;
	case 6:
		imgTypeString = "64F";
		break;
	default:
		break;
	}

	// find channel
	int channel = (number / 8) + 1;

	std::stringstream type;
	type << "CV_" << imgTypeString << "C" << channel;

	return type.str();
}