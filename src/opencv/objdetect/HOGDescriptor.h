#ifndef _ALVISION_HOGDESCRIPTOR_H_
#define _ALVISION_HOGDESCRIPTOR_H_

#include "../../alvision.h"

class HOGDescriptor : public overres::ObjectWrap{
public:
	static std::string name;
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	std::shared_ptr<cv::HOGDescriptor> _hogDescriptor;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	static POLY_METHOD(New					   );
	static POLY_METHOD(New_full				   );
	static POLY_METHOD(New_file				   );
	static POLY_METHOD(getDescriptorSize	   );
	static POLY_METHOD(checkDetectorSize	   );
	static POLY_METHOD(getWinSigma			   );
	static POLY_METHOD(setSVMDetector_ioarray);
	static POLY_METHOD(setSVMDetector_float);
	static POLY_METHOD(read					   );
	static POLY_METHOD(write				   );
	static POLY_METHOD(load					   );
	static POLY_METHOD(save					   );
	static POLY_METHOD(copyTo				   );
	static POLY_METHOD(compute				   );
	static POLY_METHOD(detect				   );
	static POLY_METHOD(detectMultiScale		   );
	static POLY_METHOD(computeGradient		   );
	static POLY_METHOD(getDefaultPeopleDetector);
	static POLY_METHOD(getDaimlerPeopleDetector);

	static NAN_GETTER(winSize_getter			);
	static NAN_SETTER(winSize_setter			);
	static NAN_GETTER(blockSize_getter			);
	static NAN_SETTER(blockSize_setter			);
	static NAN_GETTER(blockStride_getter		);
	static NAN_SETTER(blockStride_setter		);
	static NAN_GETTER(cellSize_getter			);
	static NAN_SETTER(cellSize_setter			);
	static NAN_GETTER(nbins_getter				);
	static NAN_SETTER(nbins_setter				);
	static NAN_GETTER(derivAperture_getter		);
	static NAN_SETTER(derivAperture_setter		);
	static NAN_GETTER(winSigma_getter			);
	static NAN_SETTER(winSigma_setter			);
	static NAN_GETTER(histogramNormType_getter	);
	static NAN_SETTER(histogramNormType_setter	);
	static NAN_GETTER(L2HysThreshold_getter		);
	static NAN_SETTER(L2HysThreshold_setter		);
	static NAN_GETTER(gammaCorrection_getter	);
	static NAN_SETTER(gammaCorrection_setter	);
	static NAN_GETTER(svmDetector_getter		);
	static NAN_SETTER(svmDetector_setter		);
	static NAN_GETTER(oclSvmDetector_getter		);
	static NAN_SETTER(oclSvmDetector_setter		);
	static NAN_GETTER(free_coef_getter			);
	static NAN_SETTER(free_coef_setter			);
	static NAN_GETTER(nlevels_getter			);
	static NAN_SETTER(nlevels_setter			);
	static NAN_GETTER(signedGradient_getter		);
	static NAN_SETTER(signedGradient_setter		);

	static POLY_METHOD(detectROI				);
	static POLY_METHOD(detectMultiScaleROI		);
	static POLY_METHOD(readALTModel				);
	static POLY_METHOD(groupRectangles			);



};

#endif
