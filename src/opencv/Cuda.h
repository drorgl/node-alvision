#ifndef _ALVISION_CUDA_H_
#define _ALVISION_CUDA_H_
#include "../alvision.h"

class Cuda : public or::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
	static Nan::Persistent<Object> cudaObject;

	static POLY_METHOD(ensureSizeIsEnough );
	static POLY_METHOD(setBufferPoolConfig);
		
	static POLY_METHOD(setBufferPoolUsage		);
	static POLY_METHOD(registerPageLocked		);
	static POLY_METHOD(unregisterPageLocked		);
	static POLY_METHOD(getCudaEnabledDeviceCount);
	static POLY_METHOD(setDevice				);
	static POLY_METHOD(getDevice				);
	static POLY_METHOD(resetDevice				);
	static POLY_METHOD(deviceSupports			);
	static POLY_METHOD(printCudaDeviceInfo		);
	static POLY_METHOD(printShortCudaDeviceInfo	);


};

#endif