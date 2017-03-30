#ifndef _ALVISION_CUDA_DEVICEINFO_H_
#define _ALVISION_CUDA_DEVICEINFO_H_
//#include "OpenCV.h"
#include "../../alvision.h"


//#ifdef HAVE_CUDA
namespace cuda {

	class DeviceInfo : public overres::ObjectWrap{
	public:

		static void Register(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
		static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

		static Nan::Persistent<FunctionTemplate> constructor;
		virtual v8::Local<v8::Function> get_constructor();

		std::shared_ptr<cv::cuda::DeviceInfo> _deviceInfo;

		static POLY_METHOD(New);
		static POLY_METHOD(New_deviceid);
		static POLY_METHOD(deviceID);
		static POLY_METHOD(name);
		static POLY_METHOD(totalGlobalMem);
		static POLY_METHOD(sharedMemPerBlock);
		static POLY_METHOD(regsPerBlock);
		static POLY_METHOD(warpSize);
		static POLY_METHOD(memPitch);
		static POLY_METHOD(maxThreadsPerBlock);
		static POLY_METHOD(maxThreadsDim);
		static POLY_METHOD(maxGridSize);
		static POLY_METHOD(clockRate);
		static POLY_METHOD(totalConstMem);
		static POLY_METHOD(majorVersion);
		static POLY_METHOD(minorVersion);
		static POLY_METHOD(textureAlignment);
		static POLY_METHOD(texturePitchAlignment);
		static POLY_METHOD(multiProcessorCount);
		static POLY_METHOD(kernelExecTimeoutEnabled);
		static POLY_METHOD(integrated);
		static POLY_METHOD(canMapHostMemory);
		static POLY_METHOD(computeMode);
		static POLY_METHOD(maxTexture1D);
		static POLY_METHOD(maxTexture1DMipmap);
		static POLY_METHOD(maxTexture1DLinear);
		static POLY_METHOD(maxTexture2D);
		static POLY_METHOD(maxTexture2DMipmap);
		static POLY_METHOD(maxTexture2DLinear);
		static POLY_METHOD(maxTexture2DGather);
		static POLY_METHOD(maxTexture3D);
		static POLY_METHOD(maxTextureCubemap);
		static POLY_METHOD(maxTexture1DLayered);
		static POLY_METHOD(maxTexture2DLayered);
		static POLY_METHOD(maxTextureCubemapLayered);
		static POLY_METHOD(maxSurface1D);
		static POLY_METHOD(maxSurface2D);
		static POLY_METHOD(maxSurface3D);
		static POLY_METHOD(maxSurface1DLayered);
		static POLY_METHOD(maxSurface2DLayered);
		static POLY_METHOD(maxSurfaceCubemap);
		static POLY_METHOD(maxSurfaceCubemapLayered);
		static POLY_METHOD(surfaceAlignment);
		static POLY_METHOD(concurrentKernels);
		static POLY_METHOD(ECCEnabled);
		static POLY_METHOD(pciBusID);
		static POLY_METHOD(pciDeviceID);
		static POLY_METHOD(pciDomainID);
		static POLY_METHOD(tccDriver);
		static POLY_METHOD(asyncEngineCount);
		static POLY_METHOD(unifiedAddressing);
		static POLY_METHOD(memoryClockRate);
		static POLY_METHOD(memoryBusWidth);
		static POLY_METHOD(l2CacheSize);
		static POLY_METHOD(maxThreadsPerMultiProcessor);
		static POLY_METHOD(queryMemory);
		static POLY_METHOD(freeMemory);
		static POLY_METHOD(totalMemory);
		static POLY_METHOD(supports);
		static POLY_METHOD(isCompatible);

	};
};
//#endif

#endif