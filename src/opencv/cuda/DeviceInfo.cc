#include "DeviceInfo.h"

//#ifdef HAVE_CUDA
namespace cuda {

	namespace deviceinfo_general_callback {
		std::shared_ptr<overload_resolution> overload;
		NAN_METHOD(callback) {
			if (overload == nullptr) {
				throw std::runtime_error("deviceinfo_general_callback is empty");
			}
			return overload->execute("deviceinfo", info);
		}
	}


	Nan::Persistent<FunctionTemplate> DeviceInfo::constructor;


	void
		DeviceInfo::Register(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {

		deviceinfo_general_callback::overload = overload;
	}

	void
		DeviceInfo::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
		

		//Class
		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(deviceinfo_general_callback::callback);
		constructor.Reset(ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New("DeviceInfo").ToLocalChecked());

		overload->register_type<DeviceInfo>(ctor, "deviceinfo", "DeviceInfo");








		//        };
		//
		//        /** @brief Class providing functionality for querying the specified GPU properties.
		//         */
		//export interface DeviceInfoStatic {
			//! creates DeviceInfo object for the current GPU
		overload->addOverloadConstructor("deviceinfo", "DeviceInfo", {}, New);
		//new () : DeviceInfo;

		/** @brief The constructors.

		@param device_id System index of the CUDA device starting with 0.

		Constructs the DeviceInfo object for the specified device. If device_id parameter is missed, it
		constructs an object for the current device.
		*/
		overload->addOverloadConstructor("deviceinfo", "DeviceInfo", { make_param<int>("device_id","int") }, New_deviceid);
		//new (device_id: _st.int) : DeviceInfo

	//}

	//export interface DeviceInfo
	//{
		//            public:

		/** @brief Returns system index of the CUDA device starting with 0.
		*/
		overload->addOverload("deviceinfo", "DeviceInfo", "deviceID", {}, deviceID);
		//deviceID() : _st.int;
		//
		//            //! ASCII string identifying device
		overload->addOverload("deviceinfo", "DeviceInfo", "name", {}, name);
		//name() : string;
		//
		//            //! global memory available on device in bytes
		overload->addOverload("deviceinfo", "DeviceInfo", "totalGlobalMem", {}, totalGlobalMem);
		//            size_t totalGlobalMem() const;
		//
		//            //! shared memory available per block in bytes
		overload->addOverload("deviceinfo", "DeviceInfo", "sharedMemPerBlock", {}, sharedMemPerBlock);
		//            size_t sharedMemPerBlock() const;
		//
		//            //! 32-bit registers available per block
		overload->addOverload("deviceinfo", "DeviceInfo", "regsPerBlock", {}, regsPerBlock);
		//            int regsPerBlock() const;
		//
		//            //! warp size in threads
		overload->addOverload("deviceinfo", "DeviceInfo", "warpSize", {}, warpSize);
		//            int warpSize() const;
		//
		//            //! maximum pitch in bytes allowed by memory copies
		overload->addOverload("deviceinfo", "DeviceInfo", "memPitch", {}, memPitch);
		//            size_t memPitch() const;
		//
		//            //! maximum number of threads per block
		overload->addOverload("deviceinfo", "DeviceInfo", "maxThreadsPerBlock", {}, maxThreadsPerBlock);
		//            int maxThreadsPerBlock() const;
		//
		//            //! maximum size of each dimension of a block
		overload->addOverload("deviceinfo", "DeviceInfo", "maxThreadsDim", {}, maxThreadsDim);
		//            Vec3i maxThreadsDim() const;
		//
		//            //! maximum size of each dimension of a grid
		overload->addOverload("deviceinfo", "DeviceInfo", "maxGridSize", {}, maxGridSize);
		//            Vec3i maxGridSize() const;
		//
		//            //! clock frequency in kilohertz
		overload->addOverload("deviceinfo", "DeviceInfo", "clockRate", {}, clockRate);
		//            int clockRate() const;
		//
		//            //! constant memory available on device in bytes
		overload->addOverload("deviceinfo", "DeviceInfo", "totalConstMem", {}, totalConstMem);
		//            size_t totalConstMem() const;
		//
		//! major compute capability
		overload->addOverload("deviceinfo", "DeviceInfo", "majorVersion", {}, majorVersion);
		//majorVersion() : _st.int;

		//! minor compute capability
		overload->addOverload("deviceinfo", "DeviceInfo", "minorVersion", {}, minorVersion);
		//minorVersion() : _st.int;
		//
		//            //! alignment requirement for textures
		overload->addOverload("deviceinfo", "DeviceInfo", "textureAlignment", {}, textureAlignment);
		//            size_t textureAlignment() const;
		//
		//            //! pitch alignment requirement for texture references bound to pitched memory
		overload->addOverload("deviceinfo", "DeviceInfo", "texturePitchAlignment", {}, texturePitchAlignment);
		//            size_t texturePitchAlignment() const;
		//
		//            //! number of multiprocessors on device
		overload->addOverload("deviceinfo", "DeviceInfo", "multiProcessorCount", {}, multiProcessorCount);
		//            int multiProcessorCount() const;
		//
		//            //! specified whether there is a run time limit on kernels
		overload->addOverload("deviceinfo", "DeviceInfo", "kernelExecTimeoutEnabled", {}, kernelExecTimeoutEnabled);
		//            bool kernelExecTimeoutEnabled() const;
		//
		//            //! device is integrated as opposed to discrete
		overload->addOverload("deviceinfo", "DeviceInfo", "integrated", {}, integrated);
		//            bool integrated() const;
		//
		//            //! device can map host memory with cudaHostAlloc/cudaHostGetDevicePointer
		overload->addOverload("deviceinfo", "DeviceInfo", "canMapHostMemory", {}, canMapHostMemory);
		//            bool canMapHostMemory() const;
		//

		auto ComputeMode = CreateNamedObject(target, "ComputeMode");
		SetObjectProperty(ComputeMode, "ComputeModeDefault", cv::cuda::DeviceInfo::ComputeMode::ComputeModeDefault);
		SetObjectProperty(ComputeMode, "ComputeModeExclusive", cv::cuda::DeviceInfo::ComputeMode::ComputeModeExclusive);
		SetObjectProperty(ComputeMode, "ComputeModeProhibited", cv::cuda::DeviceInfo::ComputeMode::ComputeModeProhibited);
		SetObjectProperty(ComputeMode, "ComputeModeExclusiveProcess", cv::cuda::DeviceInfo::ComputeMode::ComputeModeExclusiveProcess);

		//            enum ComputeMode {
		//                ComputeModeDefault,         /**< default compute mode (Multiple threads can use cudaSetDevice with this device) */
		//                ComputeModeExclusive,       /**< compute-exclusive-thread mode (Only one thread in one process will be able to use cudaSetDevice with this device) */
		//                ComputeModeProhibited,      /**< compute-prohibited mode (No threads can use cudaSetDevice with this device) */
		//                ComputeModeExclusiveProcess /**< compute-exclusive-process mode (Many threads in one process will be able to use cudaSetDevice with this device) */
		//            };
		//
		//            //! compute mode
		overload->addOverload("deviceinfo", "DeviceInfo", "computeMode", {}, computeMode);
		//            ComputeMode computeMode() const;
		//
		//            //! maximum 1D texture size
		overload->addOverload("deviceinfo", "DeviceInfo", "maxTexture1D", {}, maxTexture1D);
		//            int maxTexture1D() const;
		//
		//            //! maximum 1D mipmapped texture size
		overload->addOverload("deviceinfo", "DeviceInfo", "maxTexture1DMipmap", {}, maxTexture1DMipmap);
		//            int maxTexture1DMipmap() const;
		//
		//            //! maximum size for 1D textures bound to linear memory
		overload->addOverload("deviceinfo", "DeviceInfo", "maxTexture1DLinear", {}, maxTexture1DLinear);
		//            int maxTexture1DLinear() const;
		//
		//            //! maximum 2D texture dimensions
		overload->addOverload("deviceinfo", "DeviceInfo", "maxTexture2D", {}, maxTexture2D);
		//            Vec2i maxTexture2D() const;
		//
		//            //! maximum 2D mipmapped texture dimensions
		overload->addOverload("deviceinfo", "DeviceInfo", "maxTexture2DMipmap", {}, maxTexture2DMipmap);
		//            Vec2i maxTexture2DMipmap() const;
		//
		//            //! maximum dimensions (width, height, pitch) for 2D textures bound to pitched memory
		overload->addOverload("deviceinfo", "DeviceInfo", "maxTexture2DLinear", {}, maxTexture2DLinear);
		//            Vec3i maxTexture2DLinear() const;
		//
		//            //! maximum 2D texture dimensions if texture gather operations have to be performed
		overload->addOverload("deviceinfo", "DeviceInfo", "maxTexture2DGather", {}, maxTexture2DGather);
		//            Vec2i maxTexture2DGather() const;
		//
		//            //! maximum 3D texture dimensions
		overload->addOverload("deviceinfo", "DeviceInfo", "maxTexture3D", {}, maxTexture3D);
		//            Vec3i maxTexture3D() const;
		//
		//            //! maximum Cubemap texture dimensions
		overload->addOverload("deviceinfo", "DeviceInfo", "maxTextureCubemap", {}, maxTextureCubemap);
		//            int maxTextureCubemap() const;
		//
		//            //! maximum 1D layered texture dimensions
		overload->addOverload("deviceinfo", "DeviceInfo", "maxTexture1DLayered", {}, maxTexture1DLayered);
		//            Vec2i maxTexture1DLayered() const;
		//
		//            //! maximum 2D layered texture dimensions
		overload->addOverload("deviceinfo", "DeviceInfo", "maxTexture2DLayered", {}, maxTexture2DLayered);
		//            Vec3i maxTexture2DLayered() const;
		//
		//            //! maximum Cubemap layered texture dimensions
		overload->addOverload("deviceinfo", "DeviceInfo", "maxTextureCubemapLayered", {}, maxTextureCubemapLayered);
		//            Vec2i maxTextureCubemapLayered() const;
		//
		//            //! maximum 1D surface size
		overload->addOverload("deviceinfo", "DeviceInfo", "maxSurface1D", {}, maxSurface1D);
		//            int maxSurface1D() const;
		//
		//            //! maximum 2D surface dimensions
		overload->addOverload("deviceinfo", "DeviceInfo", "maxSurface2D", {}, maxSurface2D);
		//            Vec2i maxSurface2D() const;
		//
		//            //! maximum 3D surface dimensions
		overload->addOverload("deviceinfo", "DeviceInfo", "maxSurface3D", {}, maxSurface3D);
		//            Vec3i maxSurface3D() const;
		//
		//            //! maximum 1D layered surface dimensions
		overload->addOverload("deviceinfo", "DeviceInfo", "maxSurface1DLayered", {}, maxSurface1DLayered);
		//            Vec2i maxSurface1DLayered() const;
		//
		//            //! maximum 2D layered surface dimensions
		overload->addOverload("deviceinfo", "DeviceInfo", "maxSurface2DLayered", {}, maxSurface2DLayered);
		//            Vec3i maxSurface2DLayered() const;
		//
		//            //! maximum Cubemap surface dimensions
		overload->addOverload("deviceinfo", "DeviceInfo", "maxSurfaceCubemap", {}, maxSurfaceCubemap);
		//            int maxSurfaceCubemap() const;
		//
		//            //! maximum Cubemap layered surface dimensions
		overload->addOverload("deviceinfo", "DeviceInfo", "maxSurfaceCubemapLayered", {}, maxSurfaceCubemapLayered);
		//            Vec2i maxSurfaceCubemapLayered() const;
		//
		//            //! alignment requirements for surfaces
		overload->addOverload("deviceinfo", "DeviceInfo", "surfaceAlignment", {}, surfaceAlignment);
		//            size_t surfaceAlignment() const;
		//
		//            //! device can possibly execute multiple kernels concurrently
		overload->addOverload("deviceinfo", "DeviceInfo", "concurrentKernels", {}, concurrentKernels);
		//            bool concurrentKernels() const;
		//
		//            //! device has ECC support enabled
		overload->addOverload("deviceinfo", "DeviceInfo", "ECCEnabled", {}, ECCEnabled);
		//            bool ECCEnabled() const;
		//
		//            //! PCI bus ID of the device
		overload->addOverload("deviceinfo", "DeviceInfo", "pciBusID", {}, pciBusID);
		//            int pciBusID() const;
		//
		//            //! PCI device ID of the device
		overload->addOverload("deviceinfo", "DeviceInfo", "pciDeviceID", {}, pciDeviceID);
		//            int pciDeviceID() const;
		//
		//            //! PCI domain ID of the device
		overload->addOverload("deviceinfo", "DeviceInfo", "pciDomainID", {}, pciDomainID);
		//            int pciDomainID() const;
		//
		//            //! true if device is a Tesla device using TCC driver, false otherwise
		overload->addOverload("deviceinfo", "DeviceInfo", "tccDriver", {}, tccDriver);
		//            bool tccDriver() const;
		//
		//            //! number of asynchronous engines
		overload->addOverload("deviceinfo", "DeviceInfo", "asyncEngineCount", {}, asyncEngineCount);
		//            int asyncEngineCount() const;
		//
		//            //! device shares a unified address space with the host
		overload->addOverload("deviceinfo", "DeviceInfo", "unifiedAddressing", {}, unifiedAddressing);
		//            bool unifiedAddressing() const;
		//
		//            //! peak memory clock frequency in kilohertz
		overload->addOverload("deviceinfo", "DeviceInfo", "memoryClockRate", {}, memoryClockRate);
		//            int memoryClockRate() const;
		//
		//            //! global memory bus width in bits
		overload->addOverload("deviceinfo", "DeviceInfo", "memoryBusWidth", {}, memoryBusWidth);
		//            int memoryBusWidth() const;
		//
		//            //! size of L2 cache in bytes
		overload->addOverload("deviceinfo", "DeviceInfo", "l2CacheSize", {}, l2CacheSize);
		//            int l2CacheSize() const;
		//
		//            //! maximum resident threads per multiprocessor
		overload->addOverload("deviceinfo", "DeviceInfo", "maxThreadsPerMultiProcessor", {}, maxThreadsPerMultiProcessor);
		//            int maxThreadsPerMultiProcessor() const;
		//
		//            //! gets free and total device memory
		overload->addOverload("deviceinfo", "DeviceInfo", "queryMemory", {}, queryMemory);
		//            void queryMemory(size_t & totalMemory, size_t & freeMemory) const;
		overload->addOverload("deviceinfo", "DeviceInfo", "freeMemory", {}, freeMemory);
		//            size_t freeMemory() const;
		overload->addOverload("deviceinfo", "DeviceInfo", "totalMemory", {}, totalMemory);
		//            size_t totalMemory() const;
		//
		//            /** @brief Provides information on CUDA feature support.
		//        
		//            @param feature_set Features to be checked. See cuda::FeatureSet.
		//        
		//            This function returns true if the device has the specified CUDA feature. Otherwise, it returns false
		//             */
		overload->addOverload("deviceinfo", "DeviceInfo", "supports", {}, supports);
		//            bool supports(FeatureSet feature_set) const;
		//
		//            /** @brief Checks the CUDA module and device compatibility.
		//        
		//            This function returns true if the CUDA module can be run on the specified device. Otherwise, it
		//            returns false .
		//             */
		overload->addOverload("deviceinfo", "DeviceInfo", "isCompatible", {}, isCompatible);
		//isCompatible() : boolean;
		//
		//            private:
		//            int device_id_;
		//};

	//export var DeviceInfo : DeviceInfoStatic = alvision_module.cuda.DeviceInfo;














	// Prototype



		target->Set(Nan::New("DeviceInfo").ToLocalChecked(), ctor->GetFunction());

	}

	v8::Local<v8::Function> DeviceInfo::get_constructor() {
		assert(!constructor.IsEmpty() && "constructor is empty");
		return Nan::New(constructor)->GetFunction();
	}


	POLY_METHOD(DeviceInfo::New) {
		auto ret = new DeviceInfo();
		ret->_deviceInfo = std::make_shared<cv::cuda::DeviceInfo>();

		ret->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}

	POLY_METHOD(DeviceInfo::New_deviceid) { 
		auto ret = new DeviceInfo();
		ret->_deviceInfo = std::make_shared<cv::cuda::DeviceInfo>(info.at<int>(0));

		ret->Wrap(info.Holder());
		info.GetReturnValue().Set(info.Holder());
	}
	POLY_METHOD(DeviceInfo::deviceID) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::name) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::totalGlobalMem) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::sharedMemPerBlock) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::regsPerBlock) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::warpSize) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::memPitch) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::maxThreadsPerBlock) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::maxThreadsDim) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::maxGridSize) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::clockRate) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::totalConstMem) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::majorVersion) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::minorVersion) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::textureAlignment) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::texturePitchAlignment) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::multiProcessorCount) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::kernelExecTimeoutEnabled) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::integrated) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::canMapHostMemory) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::computeMode) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::maxTexture1D) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::maxTexture1DMipmap) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::maxTexture1DLinear) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::maxTexture2D) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::maxTexture2DMipmap) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::maxTexture2DLinear) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::maxTexture2DGather) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::maxTexture3D) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::maxTextureCubemap) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::maxTexture1DLayered) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::maxTexture2DLayered) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::maxTextureCubemapLayered) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::maxSurface1D) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::maxSurface2D) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::maxSurface3D) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::maxSurface1DLayered) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::maxSurface2DLayered) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::maxSurfaceCubemap) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::maxSurfaceCubemapLayered) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::surfaceAlignment) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::concurrentKernels) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::ECCEnabled) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::pciBusID) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::pciDeviceID) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::pciDomainID) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::tccDriver) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::asyncEngineCount) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::unifiedAddressing) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::memoryClockRate) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::memoryBusWidth) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::l2CacheSize) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::maxThreadsPerMultiProcessor) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::queryMemory) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::freeMemory) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::totalMemory) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::supports) { throw std::runtime_error("not implemented"); }
	POLY_METHOD(DeviceInfo::isCompatible) { throw std::runtime_error("not implemented"); }

};
//#endif