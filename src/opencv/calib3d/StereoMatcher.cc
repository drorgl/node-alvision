#include "StereoMatcher.h"

auto StereoDISP = CreateNamedObject(target, "StereoDISP");
SetObjectProperty(StereoDISP, "DISP_SHIFT", 4);
SetObjectProperty(StereoDISP, "DISP_SCALE", (1 << DISP_SHIFT));


export interface StereoMatcher extends _core.Algorithm
{

	//
	/** @brief Computes disparity map for the specified stereo pair

	@param left Left 8-bit single-channel image.
	@param right Right image of the same size and the same type as the left one.
	@param disparity Output disparity map. It has the same size as the input images. Some algorithms,
	like StereoBM or StereoSGBM compute 16-bit fixed-point disparity map (where each disparity value
	has 4 fractional bits), whereas other algorithms output 32-bit floating-point disparity map.
	*/
	compute(left: _st.InputArray, right : _st.InputArray ,
	disparity : _st.OutputArray) : void;
//
//    CV_WRAP virtual int getMinDisparity() const = 0;
//    CV_WRAP virtual void setMinDisparity(int minDisparity) = 0;
//
//    CV_WRAP virtual int getNumDisparities() const = 0;
//    CV_WRAP virtual void setNumDisparities(int numDisparities) = 0;
//
//    CV_WRAP virtual int getBlockSize() const = 0;
//    CV_WRAP virtual void setBlockSize(int blockSize) = 0;
//
//    CV_WRAP virtual int getSpeckleWindowSize() const = 0;
//    CV_WRAP virtual void setSpeckleWindowSize(int speckleWindowSize) = 0;
//
//    CV_WRAP virtual int getSpeckleRange() const = 0;
//    CV_WRAP virtual void setSpeckleRange(int speckleRange) = 0;
//
//    CV_WRAP virtual int getDisp12MaxDiff() const = 0;
//    CV_WRAP virtual void setDisp12MaxDiff(int disp12MaxDiff) = 0;
};


/** @brief Class for computing stereo correspondence using the block matching algorithm, introduced and
contributed to OpenCV by K. Konolige.
*/