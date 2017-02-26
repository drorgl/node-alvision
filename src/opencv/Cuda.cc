#include "Cuda.h"
#include "IOArray.h"
#include "Matrix.h"
#include "cuda/GpuMat.h"
#include "cuda/HostMem.h"
#include "cuda/DeviceInfo.h"
#include "cuda/CudaEvent.h"
#include "cuda/CudaStream.h"

namespace cuda_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("cuda_general_callback is empty");
		}
		return overload->execute("cuda", info);
	}
}



Nan::Persistent<Object> Cuda::cudaObject;


void
Cuda::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	cuda_general_callback::overload = overload;

	Local<Object> cuda = Nan::New<Object>();

	cudaObject.Reset(cuda);

	target->Set(Nan::New("cuda").ToLocalChecked(), cuda);

	cuda::GpuMat::Register(cuda, overload);
	cuda::DeviceInfo::Register(cuda, overload);
	cuda::Event::Register(cuda, overload);
	cuda::HostMem::Register(cuda, overload);
	cuda::Stream::Register(cuda, overload);





	cuda::GpuMat::Init(cuda, overload);





		

		/** @brief Creates a continuous matrix.

		@param rows Row count.
		@param cols Column count.
		@param type Type of the matrix.
		@param arr Destination matrix. This parameter changes only if it has a proper type and area (
		\f$\texttt{rows} \times \texttt{cols}\f$ ).

		Matrix is called continuous if its elements are stored continuously, that is, without gaps at the
		end of each row.
		*/
		//        CV_EXPORTS void createContinuous(int rows, int cols, int type, OutputArray arr);

		/** @brief Ensures that the size of a matrix is big enough and the matrix has a proper type.

		@param rows Minimum desired number of rows.
		@param cols Minimum desired number of columns.
		@param type Desired matrix type.
		@param arr Destination matrix.

		The function does not reallocate memory if the matrix has proper attributes already.
		*/
	overload->addOverload("cuda", "", "ensureSizeIsEnough", {
		make_param<int>("rows","int"), 
		make_param<int>("cols","int"), 
		make_param<int>("type","int"), 
		make_param<IOArray*>("arr","OutputArray")
	}, ensureSizeIsEnough);
		//interface IensureSizeIsEnough {
		//	(rows : _st.int, cols : _st.int, type : _st.int, arr : _st.OutputArray) : void;
		//}
		//
		//export var ensureSizeIsEnough : IensureSizeIsEnough = alvision_module.ensureSizeIsEnough;

		//        CV_EXPORTS void ensureSizeIsEnough(int rows, int cols, int type, OutputArray arr);
		//
		//        //! BufferPool management (must be called before Stream creation)
		overload->addOverload("cuda", "", "setBufferPoolUsage", {make_param<bool>("on","bool")}, setBufferPoolUsage);
		//        CV_EXPORTS void setBufferPoolUsage(bool on);
		overload->addOverload("cuda", "", "setBufferPoolConfig", {
			make_param<int >("deviceId","int"),
			make_param<size_t>("stackSize","size_t"),
			make_param<int>("stackCount","int")
		}, setBufferPoolConfig);
		//        CV_EXPORTS void setBufferPoolConfig(int deviceId, size_t stackSize, int stackCount);

		cuda::HostMem::Init(cuda, overload);


		//
		//        /** @brief Page-locks the memory of matrix and maps it for the device(s).
		//        
		//        @param m Input matrix.
		//         */
		overload->addOverload("cuda", "", "registerPageLocked", {make_param<Matrix*>("m",Matrix::name)}, registerPageLocked);
		//        CV_EXPORTS void registerPageLocked(Mat & m);
		//
		//        /** @brief Unmaps the memory of matrix and makes it pageable again.
		//        
		//        @param m Input matrix.
		//         */
		overload->addOverload("cuda", "", "unregisterPageLocked", { make_param<Matrix*>("m",Matrix::name) }, unregisterPageLocked);
		//        CV_EXPORTS void unregisterPageLocked(Mat & m);
		//
		cuda::Stream::Init(cuda, overload);

		cuda::Event::Init(cuda, overload);


		//
		//        //! @} cudacore_struct
		//
		//        //===================================================================================
		//        // Initialization & Info
		//        //===================================================================================
		//
		//        //! @addtogroup cudacore_init
		//        //! @{
		//
		//        /** @brief Returns the number of installed CUDA-enabled devices.
		//        
		//        Use this function before any other CUDA functions calls. If OpenCV is compiled without CUDA support,
		//        this function returns 0.
		//         */
		overload->addOverload("cuda", "", "getCudaEnabledDeviceCount", {}, getCudaEnabledDeviceCount);
		Nan::SetMethod(cuda, "getCudaEnabledDeviceCount", cuda_general_callback::callback);
		//interface IgetCudaEnabledDeviceCount {
		//	() : _st.int;
		//}
		//export var getCudaEnabledDeviceCount : IgetCudaEnabledDeviceCount = alvision_module.getCudaEnabledDeviceCount;
		//        CV_EXPORTS int getCudaEnabledDeviceCount();
		//
		//        /** @brief Sets a device and initializes it for the current thread.
		//        
		//        @param device System index of a CUDA device starting with 0.
		//        
		//        If the call of this function is omitted, a default device is initialized at the fist CUDA usage.
		//         */
		overload->addOverload("cuda", "", "setDevice", {make_param<int>("device","int")}, setDevice);
		//interface IsetDevice {
		//	(device : _st.int) : void;
		//}
		//export var setDevice : IsetDevice = alvision_module.setDevice;
		//        CV_EXPORTS void setDevice(int device);
		//
		//        /** @brief Returns the current device index set by cuda::setDevice or initialized by default.
		//         */
		overload->addOverload("cuda", "", "getDevice", {}, getDevice);
		//        CV_EXPORTS int getDevice();
		//
		//        /** @brief Explicitly destroys and cleans up all resources associated with the current device in the current
		//        process.
		//        
		//        Any subsequent API call to this device will reinitialize the device.
		//         */
		overload->addOverload("cuda", "", "resetDevice", {}, resetDevice);
		//        CV_EXPORTS void resetDevice();
		//
		//        /** @brief Enumeration providing CUDA computing features.
		//         */

		auto FeatureSet = CreateNamedObject(cuda, "FeatureSet");
		SetObjectProperty(FeatureSet, "FEATURE_SET_COMPUTE_10",cv::cuda::FeatureSet::FEATURE_SET_COMPUTE_10);
		SetObjectProperty(FeatureSet, "FEATURE_SET_COMPUTE_11",cv::cuda::FeatureSet::FEATURE_SET_COMPUTE_11);
		SetObjectProperty(FeatureSet, "FEATURE_SET_COMPUTE_12",cv::cuda::FeatureSet::FEATURE_SET_COMPUTE_12);
		SetObjectProperty(FeatureSet, "FEATURE_SET_COMPUTE_13",cv::cuda::FeatureSet::FEATURE_SET_COMPUTE_13);
		SetObjectProperty(FeatureSet, "FEATURE_SET_COMPUTE_20",cv::cuda::FeatureSet::FEATURE_SET_COMPUTE_20);
		SetObjectProperty(FeatureSet, "FEATURE_SET_COMPUTE_21",cv::cuda::FeatureSet::FEATURE_SET_COMPUTE_21);
		SetObjectProperty(FeatureSet, "FEATURE_SET_COMPUTE_30",cv::cuda::FeatureSet::FEATURE_SET_COMPUTE_30);
		SetObjectProperty(FeatureSet, "FEATURE_SET_COMPUTE_32",cv::cuda::FeatureSet::FEATURE_SET_COMPUTE_32);
		SetObjectProperty(FeatureSet, "FEATURE_SET_COMPUTE_35",cv::cuda::FeatureSet::FEATURE_SET_COMPUTE_35);
		SetObjectProperty(FeatureSet, "FEATURE_SET_COMPUTE_50",cv::cuda::FeatureSet::FEATURE_SET_COMPUTE_50);
		SetObjectProperty(FeatureSet, "GLOBAL_ATOMICS",cv::cuda::FeatureSet::GLOBAL_ATOMICS		   );
		SetObjectProperty(FeatureSet, "SHARED_ATOMICS",cv::cuda::FeatureSet::SHARED_ATOMICS		   );
		SetObjectProperty(FeatureSet, "NATIVE_DOUBLE",cv::cuda::FeatureSet::NATIVE_DOUBLE 		   );
		SetObjectProperty(FeatureSet, "WARP_SHUFFLE_FUNCTIONS",cv::cuda::FeatureSet::WARP_SHUFFLE_FUNCTIONS);
		SetObjectProperty(FeatureSet, "DYNAMIC_PARALLELISM",cv::cuda::FeatureSet::DYNAMIC_PARALLELISM   );
		overload->add_type_alias("FeatureSet", "int");


		//
		//        //! checks whether current device supports the given feature
		overload->addOverload("cuda", "", "deviceSupports", {make_param<int>("feature_set","FeatureSet")}, deviceSupports);
		//        CV_EXPORTS bool deviceSupports(FeatureSet feature_set);
		//
		//        /** @brief Class providing a set of static methods to check what NVIDIA\* card architecture the CUDA module was
		//        built for.
		//        
		//        According to the CUDA C Programming Guide Version 3.2: "PTX code produced for some specific compute
		//        capability can always be compiled to binary code of greater or equal compute capability".
		//         */
		//        class CV_EXPORTS TargetArchs
		//        {
		//            public:
		//            /** @brief The following method checks whether the module was built with the support of the given feature:
		//        
		//            @param feature_set Features to be checked. See :ocvcuda::FeatureSet.
		//             */
		//            static bool builtWith(FeatureSet feature_set);
		//
		//    /** @brief There is a set of methods to check whether the module contains intermediate (PTX) or binary CUDA
		//    code for the given architecture(s):
		//
		//    @param major Major compute capability version.
		//    @param minor Minor compute capability version.
		//     */
		//    static bool has(int major, int minor);
		//    static bool hasPtx(int major, int minor);
		//    static bool hasBin(int major, int minor);
		//
		//    static bool hasEqualOrLessPtx(int major, int minor);
		//    static bool hasEqualOrGreater(int major, int minor);
		//    static bool hasEqualOrGreaterPtx(int major, int minor);
		//    static bool hasEqualOrGreaterBin(int major, int minor);
		cuda::DeviceInfo::Init(cuda, overload);
		//
		overload->addOverload("cuda", "", "printCudaDeviceInfo", {make_param<int>("device","int")}, printCudaDeviceInfo);
		//interface IprintCudaDeviceInfo {
		//	(device : _st.int) : void;
		//}
		//
		//export var printCudaDeviceInfo : IprintCudaDeviceInfo = alvision_module.printCudaDeviceInfo;
		//        CV_EXPORTS void printCudaDeviceInfo(int device);


		overload->addOverload("cuda", "", "printShortCudaDeviceInfo", { make_param<int>("device","int") }, printShortCudaDeviceInfo);
		//interface IprintShortCudaDeviceInfo {
		//	(device : _st.int) : void;
		//}
		//export var printShortCudaDeviceInfo : IprintShortCudaDeviceInfo = alvision_module.printShortCudaDeviceInfo;
		//        CV_EXPORTS void printShortCudaDeviceInfo(int device);

		//
		//        //! @} cudacore_init
		//
		//    }
	//} // namespace cv { namespace cuda {
	  //
	  //
	  //#include "opencv2/core/cuda.inl.hpp"
	  //
	  //#endif /* __OPENCV_CORE_CUDA_HPP__ */

};


POLY_METHOD(Cuda::ensureSizeIsEnough) { throw std::runtime_error("not implemented"); }
POLY_METHOD(Cuda::setBufferPoolConfig) { throw std::runtime_error("not implemented"); }
POLY_METHOD(Cuda::setBufferPoolUsage){throw std::runtime_error("not implemented");}
POLY_METHOD(Cuda::registerPageLocked){throw std::runtime_error("not implemented");}
POLY_METHOD(Cuda::unregisterPageLocked){throw std::runtime_error("not implemented");}
POLY_METHOD(Cuda::getCudaEnabledDeviceCount){
	auto res = cv::cuda::getCudaEnabledDeviceCount();
	info.SetReturnValue(res);
}
POLY_METHOD(Cuda::setDevice){throw std::runtime_error("not implemented");}
POLY_METHOD(Cuda::getDevice){throw std::runtime_error("not implemented");}
POLY_METHOD(Cuda::resetDevice){throw std::runtime_error("not implemented");}
POLY_METHOD(Cuda::deviceSupports){throw std::runtime_error("not implemented");}
POLY_METHOD(Cuda::printCudaDeviceInfo){throw std::runtime_error("not implemented");}
POLY_METHOD(Cuda::printShortCudaDeviceInfo){throw std::runtime_error("not implemented");}

