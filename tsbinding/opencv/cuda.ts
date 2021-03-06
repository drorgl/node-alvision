/*M///////////////////////////////////////////////////////////////////////////////////////
//
//  IMPORTANT: READ BEFORE DOWNLOADING, COPYING, INSTALLING OR USING.
//
//  By downloading, copying, installing or using the software you agree to this license.
//  If you do not agree to this license, do not download, install,
//  copy or use the software.
//
//
//                          License Agreement
//                For Open Source Computer Vision Library
//
// Copyright (C) 2000-2008, Intel Corporation, all rights reserved.
// Copyright (C) 2009, Willow Garage Inc., all rights reserved.
// Copyright (C) 2013, OpenCV Foundation, all rights reserved.
// Third party copyrights are property of their respective owners.
//
// Redistribution and use in source and binary forms, with or without modification,
// are permitted provided that the following conditions are met:
//
//   * Redistribution's of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//
//   * Redistribution's in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//
//   * The name of the copyright holders may not be used to endorse or promote products
//     derived from this software without specific prior written permission.
//
// This software is provided by the copyright holders and contributors "as is" and
// any express or implied warranties, including, but not limited to, the implied
// warranties of merchantability and fitness for a particular purpose are disclaimed.
// In no event shall the Intel Corporation or contributors be liable for any direct,
// indirect, incidental, special, exemplary, or consequential damages
// (including, but not limited to, procurement of substitute goods or services;
// loss of use, data, or profits; or business interruption) however caused
// and on any theory of liability, whether in contract, strict liability,
// or tort (including negligence or otherwise) arising in any way out of
// the use of this software, even if advised of the possibility of such damage.
//
//M*/

////// <reference path="Matrix.ts" />
import alvision_module from "../bindings";

//import * as _constants from './Constants'
import * as _st from './static';
import * as _mat from './mat';
import * as _types from './types';
//import * as _core from './Core';
import * as _base from './base';
//import * as _scalar from './Scalar'

//#ifndef __OPENCV_CORE_CUDA_HPP__
//#define __OPENCV_CORE_CUDA_HPP__
//
//#ifndef __cplusplus
//#  error cuda.hpp header must be compiled as C++
//#endif
//
//#include "opencv2/core.hpp"
//#include "opencv2/core/cuda_types.hpp"

/**
  @defgroup cuda CUDA-accelerated Computer Vision
  @{
    @defgroup cudacore Core part
    @{
      @defgroup cudacore_init Initalization and Information
      @defgroup cudacore_struct Data Structures
    @}
  @}
 */

export * from './cudacodec/cudacodec';
export * from './cudaarithm/cudaarithm';
export * from './cudaimgproc/cudaimgproc';
export * from './cudabgsegm/cudabgsegm';
export * from './cudaoptflow/cudaoptflow';
export * from './cudaobjdetect/cudaobjdetect';
export * from './cudawarping/cudawarping';
export * from './cudastereo/cudastereo';
export * from './cudafeatures2d/cudafeatures2d';
export * from './cudafilters/cudafilters';
export * from './photo/cuda';


//namespace cv {
//    export namespace cuda {

        //! @addtogroup cudacore_struct
        //! @{

        //===================================================================================
        // GpuMat
        //===================================================================================

        /** @brief Base storage class for GPU memory with reference counting.
        
        Its interface matches the Mat interface with the following limitations:
        
        -   no arbitrary dimensions support (only 2D)
        -   no functions that return references to their data (because references on GPU are not valid for
            CPU)
        -   no expression templates technique support
        
        Beware that the latter limitation may lead to overloaded matrix operators that cause memory
        allocations. The GpuMat class is convertible to cuda::PtrStepSz and cuda::PtrStep so it can be
        passed directly to the kernel.
        
        @note In contrast with Mat, in most cases GpuMat::isContinuous() == false . This means that rows are
        aligned to a size depending on the hardware. Single-row GpuMat is always a continuous matrix.
        
        @note You are not recommended to leave static or global GpuMat variables allocated, that is, to rely
        on its destructor. The destruction order of such variables and CUDA context is undefined. GPU memory
        release function returns error if the CUDA context has been destroyed before.
        
        @sa Mat
         */

        interface GpuMatStatic {
            //! default constructor
            //explicit GpuMat(Allocator * allocator = defaultAllocator());
            new (): GpuMat;

            //! constructs GpuMat of the specified size and type
            new (rows: _st.int, cols: _st.int, type: _st.int/*, Allocator * allocator = defaultAllocator()*/): GpuMat;
            new (size: _types.Size, type: _st.int /*,Allocator * allocator = defaultAllocator()*/): GpuMat;

            //! constucts GpuMat and fills it with the specified value _s
            new (rows: _st.int, cols: _st.int, type: _st.int, s: _types.Scalar /*, Allocator * allocator = defaultAllocator()*/): GpuMat;
            new (size: _types.Size, type: _st.int, s: _types.Scalar /*, Allocator * allocator = defaultAllocator()*/): GpuMat;

            //! copy constructor
            new (m: GpuMat): GpuMat;

            //! constructor for GpuMat headers pointing to user-allocated data
            new (rows: _st.int, cols: _st.int, type: _st.int, data: Array<any>, step?: _st.size_t /*= Mat::AUTO_STEP*/): GpuMat;
            new (size: _types.Size, type: _st.int, data: Array<any>, step?: _st.size_t /*= Mat::AUTO_STEP*/): GpuMat;

            //! creates a GpuMat header for a part of the bigger matrix
            new (m: GpuMat, rowRange: _types.Range, colRange: _types.Range): GpuMat;
            new (m: GpuMat, roi: _types.Rect): GpuMat;

            //! builds GpuMat from host memory (Blocking call)
            new (arr: _st.InputArray /*, Allocator * allocator = defaultAllocator()*/): GpuMat;
            //
            //            //! destructor - calls release()
            //            ~GpuMat();
            //
            //            //! assignment operators
            //            GpuMat & operator =(const GpuMat& m);
        }

        export interface GpuMat extends _st.IOArray
        {

    



            //! allocates new GpuMat data unless the GpuMat already has specified size and type
            create(rows: _st.int, cols: _st.int, type: _st.int ): void;
            create(size: _types.Size, type: _st.int ): void;
//
//            //! decreases reference counter, deallocate the data when reference counter reaches 0
//            void release();
//
//            //! swaps with other smart pointer
//            void swap(GpuMat & mat);
//
//            //! pefroms upload data to GpuMat (Blocking call)
            upload(arr: _st.InputArray ) : void

            //! pefroms upload data to GpuMat (Non-Blocking call)
            upload(arr: _st.InputArray, stream: Stream): void;

            //! pefroms download data from device to host memory (Blocking call)
            download(dst: _st.OutputArray ): void;

            //! pefroms download data from device to host memory (Non-Blocking call)
            download(dst: _st.OutputArray, stream: Stream ): void;
//
//            //! returns deep copy of the GpuMat, i.e. the data is copied
//            GpuMat clone() const;
//
            //! copies the GpuMat content to device memory (Blocking call)
            copyTo(dst: _st.OutputArray ): void;

            //! copies the GpuMat content to device memory (Non-Blocking call)
            copyTo(dst: _st.OutputArray, stream: Stream ): void;

            //! copies those GpuMat elements to "m" that are marked with non-zero mask elements (Blocking call)
            copyTo(dst: _st.OutputArray, mask: _st.InputArray ): void;

            //! copies those GpuMat elements to "m" that are marked with non-zero mask elements (Non-Blocking call)
            copyTo(dst: _st.OutputArray, mask: _st.InputArray, stream: Stream): void;

            //! sets some of the GpuMat elements to s (Blocking call)
            setTo(s: _types.Scalar ): GpuMat;

            //! sets some of the GpuMat elements to s (Non-Blocking call)
            setTo(s: _types.Scalar, stream: Stream): GpuMat;

            //! sets some of the GpuMat elements to s, according to the mask (Blocking call)
            setTo(s: _types.Scalar, mask: _st.InputArray ): GpuMat;

            //! sets some of the GpuMat elements to s, according to the mask (Non-Blocking call)
            setTo(s: _types.Scalar, mask: _st.InputArray, stream: Stream): GpuMat;

            //! converts GpuMat to another datatype (Blocking call)
            convertTo(dst: _st.OutputArray, rtype: _st.int ): void;

            //! converts GpuMat to another datatype (Non-Blocking call)
            convertTo(dst: _st.OutputArray, rtype: _st.int, stream: Stream ): void;

            //! converts GpuMat to another datatype with scaling (Blocking call)
            convertTo(dst: _st.OutputArray, rtype: _st.int, alpha: _st.double, beta?: _st.double  /*= 0.0*/): void;

            //! converts GpuMat to another datatype with scaling (Non-Blocking call)
            convertTo(dst: _st.OutputArray, rtype: _st.int, alpha: _st.double, stream: Stream): void;

            //! converts GpuMat to another datatype with scaling (Non-Blocking call)
            convertTo(dst: _st.OutputArray, rtype: _st.int, alpha: _st.double, beta: _st.double, stream: Stream): void;

//            void assignTo(GpuMat & m, int type= -1) const;
//
//            //! returns pointer to y-th row
//            uchar * ptr(int y = 0);
//            const uchar* ptr(int y = 0) const;
            ptr<T>(T: string, i0?: _st.int /* = 0*/): _mat.TrackedPtr<T>;
//
//            //! template version of the above method
//            template < typename _Tp> _Tp * ptr(int y = 0);
//            template < typename _Tp> const _Tp* ptr(int y = 0) const;
//
//            template < typename _Tp> operator PtrStepSz<_Tp>() const;
//            template < typename _Tp> operator PtrStep<_Tp>() const;

            //! returns a new GpuMat header for the specified row
            row(y: _st.int ): GpuMat;

            //! returns a new GpuMat header for the specified column
            col(x: _st.int ) : GpuMat;

            //! ... for the specified row span
            rowRange(startrow: _st.int, endrow: _st.int ): GpuMat;
            rowRange(r: _types.Range ): GpuMat;

            //! ... for the specified column span
            colRange(startcol: _st.int, endcol: _st.int ): GpuMat;
            colRange(r: _types.Range ): GpuMat;

//            //! extracts a rectangular sub-GpuMat (this is a generalized form of row, rowRange etc.)
//            GpuMat operator ()(Range rowRange, Range colRange) const;
            roi(rowRange: _types.Range, colRange: _types.Range): GpuMat;
//            GpuMat operator ()(Rect roi) const;
            roi(roi: _types.Rect): GpuMat;
//
//            //! creates alternative GpuMat header for the same data, with different
//            //! number of channels and/or different number of rows
//            GpuMat reshape(int cn, int rows = 0) const;
//
//            //! locates GpuMat header within a parent GpuMat
//            void locateROI(Size & wholeSize, Point & ofs) const;
//
//            //! moves/resizes the current GpuMat ROI inside the parent GpuMat
//            GpuMat & adjustROI(int dtop, int dbottom, int dleft, int dright);
//
//            //! returns true iff the GpuMat data is continuous
//            //! (i.e. when there are no gaps between successive rows)
//            bool isContinuous() const;
//
            //! returns element size in bytes
            elemSize(): _st.size_t;

            //! returns the size of element channel in bytes
            elemSize1(): _st.size_t;

            //! returns element type
            type(): _st.int;

            //! returns element type
            depth(): _st.int;

            //! returns number of channels
            channels(): _st.int;
//
//            //! returns step/elemSize1()
//            size_t step1() const;
//
//! returns GpuMat size : width == number of columns, height == number of rows
            size(): _types.Size;
//
            //! returns true if GpuMat data is NULL
            empty(): boolean;
//
//            /*! includes several bit-fields:
//            - the magic signature
//            - continuity flag
//            - depth
//            - number of channels
//            */
//            int flags;
//
                //! the number of rows and columns
            rows(): _st.int;
            cols(): _st.int;
//
//            //! a distance between successive rows in bytes; includes the gap if any
//            size_t step;
//
//            //! pointer to the data
//            uchar * data;
//
//            //! pointer to the reference counter;
//            //! when GpuMat points to user-allocated data, the pointer is NULL
//            int * refcount;
//
//            //! helper fields used in locateROI and adjustROI
//            uchar * datastart;
//            const uchar* dataend;
//
//            //! allocator
//            Allocator * allocator;
        };

        export var GpuMat: GpuMatStatic = alvision_module.cuda.GpuMat;

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
        interface IensureSizeIsEnough {
            (rows: _st.int, cols: _st.int, type: _st.int, arr: _st.OutputArray ): void;
        }

        export var ensureSizeIsEnough: IensureSizeIsEnough = alvision_module.cuda.ensureSizeIsEnough;

//        CV_EXPORTS void ensureSizeIsEnough(int rows, int cols, int type, OutputArray arr);
//
//        //! BufferPool management (must be called before Stream creation)
//        CV_EXPORTS void setBufferPoolUsage(bool on);
//        CV_EXPORTS void setBufferPoolConfig(int deviceId, size_t stackSize, int stackCount);

        //===================================================================================
        // HostMem
        //===================================================================================

        /** @brief Class with reference counting wrapping special memory type allocation functions from CUDA.
        
        Its interface is also Mat-like but with additional memory type parameters.
        
        -   **PAGE_LOCKED** sets a page locked memory type used commonly for fast and asynchronous
            uploading/downloading data from/to GPU.
        -   **SHARED** specifies a zero copy memory allocation that enables mapping the host memory to GPU
            address space, if supported.
        -   **WRITE_COMBINED** sets the write combined buffer that is not cached by CPU. Such buffers are
            used to supply GPU with data when GPU only reads it. The advantage is a better CPU cache
            utilization.
        
        @note Allocation size of such memory types is usually limited. For more details, see *CUDA 2.2
        Pinned Memory APIs* document or *CUDA C Programming Guide*.
         */

        export enum HostMemAllocType { PAGE_LOCKED = 1, SHARED = 2, WRITE_COMBINED = 4 };

        interface HostMemStatic {
            new (alloc_type?: HostMemAllocType/* = PAGE_LOCKED*/): HostMem;

            new (m: HostMem): HostMem

            new (rows: _st.int, cols: _st.int, type: _st.int, alloc_type?: HostMemAllocType /*= PAGE_LOCKED*/): HostMem;
            new (size: _types.Size, type: _st.int, alloc_type?: HostMemAllocType/*= PAGE_LOCKED*/): HostMem;

            //! creates from host memory with coping data
            new (arr: _st.InputArray, alloc_type?: HostMemAllocType/*= PAGE_LOCKED*/): HostMem;
            //
            //            ~HostMem();
            //
            //            HostMem & operator =(const HostMem& m);

        }

export interface HostMem extends _st.IOArray
{
//            public:

//
//    static MatAllocator * getAllocator(AllocType alloc_type = PAGE_LOCKED);
//
//
//            //! swaps with other smart pointer
//            void swap(HostMem & b);
//
//            //! returns deep copy of the matrix, i.e. the data is copied
//            HostMem clone() const;
//
//            //! allocates new matrix data unless the matrix already has specified size and type.
//            void create(int rows, int cols, int type);
//            void create(Size size, int type);
//
//            //! creates alternative HostMem header for the same data, with different
//            //! number of channels and/or different number of rows
//            HostMem reshape(int cn, int rows = 0) const;
//
//            //! decrements reference counter and released memory if needed.
//            void release();
//
            //! returns matrix header with disabled reference counting for HostMem data.
    createMatHeader(): _mat.Mat;
//
//            /** @brief Maps CPU memory to GPU address space and creates the cuda::GpuMat header without reference counting
//            for it.
//        
//            This can be done only if memory was allocated with the SHARED flag and if it is supported by the
//            hardware. Laptops often share video and CPU memory, so address spaces can be mapped, which
//            eliminates an extra copy.
//             */
//            GpuMat createGpuMatHeader() const;
//
//            // Please see cv::Mat for descriptions
//            bool isContinuous() const;
    elemSize(): _st.size_t;
            elemSize1(): _st.size_t;
            type(): _st.int;
//            int depth() const;
//            int channels() const;
//            size_t step1() const;
            size(): _types.Size;
//            bool empty() const;
//
//            // Please see cv::Mat for descriptions
//            int flags;
//            int rows, cols;
//            size_t step;
//
//            uchar * data;
//            int * refcount;
//
//            uchar * datastart;
//            const uchar* dataend;
//
//            AllocType alloc_type;
        };

        export var HostMem: HostMemStatic = alvision_module.cuda.HostMem;

//
//        /** @brief Page-locks the memory of matrix and maps it for the device(s).
//        
//        @param m Input matrix.
//         */
//        CV_EXPORTS void registerPageLocked(Mat & m);
//
//        /** @brief Unmaps the memory of matrix and makes it pageable again.
//        
//        @param m Input matrix.
//         */
//        CV_EXPORTS void unregisterPageLocked(Mat & m);
//
//        //===================================================================================
//        // Stream
//        //===================================================================================
//
//        /** @brief This class encapsulates a queue of asynchronous calls.
//        
//        @note Currently, you may face problems if an operation is enqueued twice with different data. Some
//        functions use the constant GPU memory, and next call may update the memory before the previous one
//        has been finished. But calling different operations asynchronously is safe because each operation
//        has its own constant buffer. Memory copy/upload/download/set operations to the buffers you hold are
//        also safe. :
//         */
        interface StreamStatic {
            //! creates a new asynchronous stream
            new (): Stream;

        }


        export interface Stream {
            //            typedef void (Stream::*bool_type)() const;
            //            void this_type_does_not_support_comparisons() const {}
            //
            //            public:
            //            typedef void (*StreamCallback)(int status, void* userData);
            //
            //
            /** @brief Returns true if the current stream queue is finished. Otherwise, it returns false.
            */
            queryIfComplete(): boolean;

            /** @brief Blocks the current CPU thread until all operations in the stream are complete.
            */
            waitForCompletion(cb: () => void): void;

            /** @brief Makes a compute stream wait on an event.
            */
            waitEvent(event: Event): void;

            /** @brief Adds a callback to be called on the host after all currently enqueued items in the stream have
            completed.
        
            @note Callbacks must not make any CUDA API calls. Callbacks must not perform any synchronization
            that may depend on outstanding device work or other callbacks that are not mandated to run earlier.
            Callbacks without a mandated order (in independent streams) execute in undefined order and may be
            serialized.
             */
            enqueueHostCallback(callback: (status: _st.int, userData: any) => void, userData: any): void;
            //
            //    //! return Stream object for default CUDA stream
            //    static Stream & Null();
            //
            //            //! returns true if stream object is not default (!= 0)
            //            operator bool_type() const;
            //
            //            class Impl;
            //
            //            private:
            //            Ptr < Impl > impl_;
            //            Stream(const Ptr<Impl>& impl);
            //
            //            friend struct StreamAccessor;
            //            friend class BufferPool;
            //            friend class DefaultDeviceInitializer;
        }

        export var Stream: StreamStatic = alvision_module.cuda.Stream;

//
interface Event
{
//            public:
//            enum CreateFlags {
//                DEFAULT = 0x00,  /**< Default event flag */
//                BLOCKING_SYNC = 0x01,  /**< Event uses blocking synchronization */
//                DISABLE_TIMING = 0x02,  /**< Event will not record timing data */
//                INTERPROCESS = 0x04   /**< Event is suitable for interprocess use. DisableTiming must be set */
//            };
//
//            explicit Event(CreateFlags flags = DEFAULT);
//
//            //! records an event
//            void record(Stream & stream = Stream::Null());
//
//            //! queries an event's status
//            bool queryIfComplete() const;
//
//            //! waits for an event to complete
//            void waitForCompletion();
//
//    //! computes the elapsed time between events
//    static float elapsedTime(const Event& start, const Event& end);
//
//            class Impl;
//
//            private:
//            Ptr < Impl > impl_;
//            Event(const Ptr<Impl>& impl);
//
//            friend struct EventAccessor;
        };


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
        interface IgetCudaEnabledDeviceCount {
            (): _st.int;
        }
        export var getCudaEnabledDeviceCount: IgetCudaEnabledDeviceCount = alvision_module.cuda.getCudaEnabledDeviceCount;
//        CV_EXPORTS int getCudaEnabledDeviceCount();
//
//        /** @brief Sets a device and initializes it for the current thread.
//        
//        @param device System index of a CUDA device starting with 0.
//        
//        If the call of this function is omitted, a default device is initialized at the fist CUDA usage.
//         */
        interface IsetDevice {
            (device: _st.int): void;
        }
        export var setDevice: IsetDevice = alvision_module.cuda.setDevice;
//        CV_EXPORTS void setDevice(int device);
//
//        /** @brief Returns the current device index set by cuda::setDevice or initialized by default.
//         */
//        CV_EXPORTS int getDevice();
//
//        /** @brief Explicitly destroys and cleans up all resources associated with the current device in the current
//        process.
//        
//        Any subsequent API call to this device will reinitialize the device.
//         */
//        CV_EXPORTS void resetDevice();
//
//        /** @brief Enumeration providing CUDA computing features.
//         */
        export enum FeatureSet {
            FEATURE_SET_COMPUTE_10 = 10,
            FEATURE_SET_COMPUTE_11 = 11,
            FEATURE_SET_COMPUTE_12 = 12,
            FEATURE_SET_COMPUTE_13 = 13,
            FEATURE_SET_COMPUTE_20 = 20,
            FEATURE_SET_COMPUTE_21 = 21,
            FEATURE_SET_COMPUTE_30 = 30,
            FEATURE_SET_COMPUTE_32 = 32,
            FEATURE_SET_COMPUTE_35 = 35,
            FEATURE_SET_COMPUTE_50 = 50,

            GLOBAL_ATOMICS = FEATURE_SET_COMPUTE_11,
            SHARED_ATOMICS = FEATURE_SET_COMPUTE_12,
            NATIVE_DOUBLE = FEATURE_SET_COMPUTE_13,
            WARP_SHUFFLE_FUNCTIONS = FEATURE_SET_COMPUTE_30,
            DYNAMIC_PARALLELISM = FEATURE_SET_COMPUTE_35
        };
//
//        //! checks whether current device supports the given feature
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
//        };
//
//        /** @brief Class providing functionality for querying the specified GPU properties.
//         */
        export interface DeviceInfoStatic {
            //! creates DeviceInfo object for the current GPU
            new (): DeviceInfo;

            /** @brief The constructors.
            
            @param device_id System index of the CUDA device starting with 0.
            
            Constructs the DeviceInfo object for the specified device. If device_id parameter is missed, it
            constructs an object for the current device.
             */
            new (device_id: _st.int ): DeviceInfo

        }

export interface DeviceInfo
{
//            public:

    /** @brief Returns system index of the CUDA device starting with 0.
    */
    deviceID(): _st.int;
//
//            //! ASCII string identifying device
    name(): string;
//
//            //! global memory available on device in bytes
//            size_t totalGlobalMem() const;
//
//            //! shared memory available per block in bytes
//            size_t sharedMemPerBlock() const;
//
//            //! 32-bit registers available per block
//            int regsPerBlock() const;
//
//            //! warp size in threads
//            int warpSize() const;
//
//            //! maximum pitch in bytes allowed by memory copies
//            size_t memPitch() const;
//
//            //! maximum number of threads per block
//            int maxThreadsPerBlock() const;
//
//            //! maximum size of each dimension of a block
//            Vec3i maxThreadsDim() const;
//
//            //! maximum size of each dimension of a grid
//            Vec3i maxGridSize() const;
//
//            //! clock frequency in kilohertz
//            int clockRate() const;
//
//            //! constant memory available on device in bytes
//            size_t totalConstMem() const;
//
            //! major compute capability
    majorVersion(): _st.int;

            //! minor compute capability
    minorVersion(): _st.int;
//
//            //! alignment requirement for textures
//            size_t textureAlignment() const;
//
//            //! pitch alignment requirement for texture references bound to pitched memory
//            size_t texturePitchAlignment() const;
//
//            //! number of multiprocessors on device
//            int multiProcessorCount() const;
//
//            //! specified whether there is a run time limit on kernels
//            bool kernelExecTimeoutEnabled() const;
//
//            //! device is integrated as opposed to discrete
//            bool integrated() const;
//
//            //! device can map host memory with cudaHostAlloc/cudaHostGetDevicePointer
//            bool canMapHostMemory() const;
//
//            enum ComputeMode {
//                ComputeModeDefault,         /**< default compute mode (Multiple threads can use cudaSetDevice with this device) */
//                ComputeModeExclusive,       /**< compute-exclusive-thread mode (Only one thread in one process will be able to use cudaSetDevice with this device) */
//                ComputeModeProhibited,      /**< compute-prohibited mode (No threads can use cudaSetDevice with this device) */
//                ComputeModeExclusiveProcess /**< compute-exclusive-process mode (Many threads in one process will be able to use cudaSetDevice with this device) */
//            };
//
//            //! compute mode
//            ComputeMode computeMode() const;
//
//            //! maximum 1D texture size
//            int maxTexture1D() const;
//
//            //! maximum 1D mipmapped texture size
//            int maxTexture1DMipmap() const;
//
//            //! maximum size for 1D textures bound to linear memory
//            int maxTexture1DLinear() const;
//
//            //! maximum 2D texture dimensions
//            Vec2i maxTexture2D() const;
//
//            //! maximum 2D mipmapped texture dimensions
//            Vec2i maxTexture2DMipmap() const;
//
//            //! maximum dimensions (width, height, pitch) for 2D textures bound to pitched memory
//            Vec3i maxTexture2DLinear() const;
//
//            //! maximum 2D texture dimensions if texture gather operations have to be performed
//            Vec2i maxTexture2DGather() const;
//
//            //! maximum 3D texture dimensions
//            Vec3i maxTexture3D() const;
//
//            //! maximum Cubemap texture dimensions
//            int maxTextureCubemap() const;
//
//            //! maximum 1D layered texture dimensions
//            Vec2i maxTexture1DLayered() const;
//
//            //! maximum 2D layered texture dimensions
//            Vec3i maxTexture2DLayered() const;
//
//            //! maximum Cubemap layered texture dimensions
//            Vec2i maxTextureCubemapLayered() const;
//
//            //! maximum 1D surface size
//            int maxSurface1D() const;
//
//            //! maximum 2D surface dimensions
//            Vec2i maxSurface2D() const;
//
//            //! maximum 3D surface dimensions
//            Vec3i maxSurface3D() const;
//
//            //! maximum 1D layered surface dimensions
//            Vec2i maxSurface1DLayered() const;
//
//            //! maximum 2D layered surface dimensions
//            Vec3i maxSurface2DLayered() const;
//
//            //! maximum Cubemap surface dimensions
//            int maxSurfaceCubemap() const;
//
//            //! maximum Cubemap layered surface dimensions
//            Vec2i maxSurfaceCubemapLayered() const;
//
//            //! alignment requirements for surfaces
//            size_t surfaceAlignment() const;
//
//            //! device can possibly execute multiple kernels concurrently
//            bool concurrentKernels() const;
//
//            //! device has ECC support enabled
//            bool ECCEnabled() const;
//
//            //! PCI bus ID of the device
//            int pciBusID() const;
//
//            //! PCI device ID of the device
//            int pciDeviceID() const;
//
//            //! PCI domain ID of the device
//            int pciDomainID() const;
//
//            //! true if device is a Tesla device using TCC driver, false otherwise
//            bool tccDriver() const;
//
//            //! number of asynchronous engines
//            int asyncEngineCount() const;
//
//            //! device shares a unified address space with the host
//            bool unifiedAddressing() const;
//
//            //! peak memory clock frequency in kilohertz
//            int memoryClockRate() const;
//
//            //! global memory bus width in bits
//            int memoryBusWidth() const;
//
//            //! size of L2 cache in bytes
//            int l2CacheSize() const;
//
//            //! maximum resident threads per multiprocessor
//            int maxThreadsPerMultiProcessor() const;
//
//            //! gets free and total device memory
//            void queryMemory(size_t & totalMemory, size_t & freeMemory) const;
//            size_t freeMemory() const;
//            size_t totalMemory() const;
//
//            /** @brief Provides information on CUDA feature support.
//        
//            @param feature_set Features to be checked. See cuda::FeatureSet.
//        
//            This function returns true if the device has the specified CUDA feature. Otherwise, it returns false
//             */
//            bool supports(FeatureSet feature_set) const;
//
//            /** @brief Checks the CUDA module and device compatibility.
//        
//            This function returns true if the CUDA module can be run on the specified device. Otherwise, it
//            returns false .
//             */
    isCompatible(): boolean;
//
//            private:
//            int device_id_;
        };

        export var DeviceInfo: DeviceInfoStatic = alvision_module.cuda.DeviceInfo;
//
        interface IprintCudaDeviceInfo {
            (device: _st.int): void;
        }

        export var printCudaDeviceInfo: IprintCudaDeviceInfo = alvision_module.cuda.printCudaDeviceInfo;
//        CV_EXPORTS void printCudaDeviceInfo(int device);
        interface IprintShortCudaDeviceInfo {
            (device: _st.int): void;
        }
        export var printShortCudaDeviceInfo: IprintShortCudaDeviceInfo = alvision_module.cuda.printShortCudaDeviceInfo;
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
