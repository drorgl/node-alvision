#include "StereoBM.h"

interface StereoBMStatic {
	/** @brief Creates StereoBM object

	@param numDisparities the disparity search range. For each pixel algorithm will find the best
	disparity from 0 (default minimum disparity) to numDisparities. The search range can then be
	shifted by changing the minimum disparity.
	@param blockSize the linear size of the blocks compared by the algorithm. The size should be odd
	(as the block is centered at the current pixel). Larger block size implies smoother, though less
	accurate disparity map. Smaller block size gives more detailed disparity map, but there is higher
	chance for algorithm to find a wrong correspondence.

	The function create StereoBM object. You can then call StereoBM::compute() to compute disparity for
	a specific stereo pair.
	*/
	create(numDisparities ? : _st.int /*= 0*/, blockSize ? : _st.int /*= 21*/) : StereoBM;
}

export interface StereoBM extends StereoMatcher
{
	//public:
	//    enum { PREFILTER_NORMALIZED_RESPONSE = 0,
	//           PREFILTER_XSOBEL              = 1
	//         };
	//
	//    CV_WRAP virtual int getPreFilterType() const = 0;
	//    CV_WRAP virtual void setPreFilterType(int preFilterType) = 0;
	//
	//    CV_WRAP virtual int getPreFilterSize() const = 0;
	//    CV_WRAP virtual void setPreFilterSize(int preFilterSize) = 0;
	//
	//    CV_WRAP virtual int getPreFilterCap() const = 0;
	//    CV_WRAP virtual void setPreFilterCap(int preFilterCap) = 0;
	//
	//    CV_WRAP virtual int getTextureThreshold() const = 0;
	//    CV_WRAP virtual void setTextureThreshold(int textureThreshold) = 0;
	//
	//    CV_WRAP virtual int getUniquenessRatio() const = 0;
	//    CV_WRAP virtual void setUniquenessRatio(int uniquenessRatio) = 0;
	//
	//    CV_WRAP virtual int getSmallerBlockSize() const = 0;
	//    CV_WRAP virtual void setSmallerBlockSize(int blockSize) = 0;
	//
	//    CV_WRAP virtual Rect getROI1() const = 0;
	//    CV_WRAP virtual void setROI1(Rect roi1) = 0;
	//
	//    CV_WRAP virtual Rect getROI2() const = 0;
	//    CV_WRAP virtual void setROI2(Rect roi2) = 0;
	//

};

export var StereoBM : StereoBMStatic = alvision_module.StereoBM;
