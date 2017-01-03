#include "StereoSGBM.h"

export enum StereoSGBMMode
{
	MODE_SGBM = 0,
	MODE_HH = 1,
	MODE_SGBM_3WAY = 2
};


interface StereoSGBMStatic {
	/** @brief Creates StereoSGBM object

	@param minDisparity Minimum possible disparity value. Normally, it is zero but sometimes
	rectification algorithms can shift images, so this parameter needs to be adjusted accordingly.
	@param numDisparities Maximum disparity minus minimum disparity. The value is always greater than
	zero. In the current implementation, this parameter must be divisible by 16.
	@param blockSize Matched block size. It must be an odd number \>=1 . Normally, it should be
	somewhere in the 3..11 range.
	@param P1 The first parameter controlling the disparity smoothness. See below.
	@param P2 The second parameter controlling the disparity smoothness. The larger the values are,
	the smoother the disparity is. P1 is the penalty on the disparity change by plus or minus 1
	between neighbor pixels. P2 is the penalty on the disparity change by more than 1 between neighbor
	pixels. The algorithm requires P2 \> P1 . See stereo_match.cpp sample where some reasonably good
	P1 and P2 values are shown (like 8\*number_of_image_channels\*SADWindowSize\*SADWindowSize and
	32\*number_of_image_channels\*SADWindowSize\*SADWindowSize , respectively).
	@param disp12MaxDiff Maximum allowed difference (in integer pixel units) in the left-right
	disparity check. Set it to a non-positive value to disable the check.
	@param preFilterCap Truncation value for the prefiltered image pixels. The algorithm first
	computes x-derivative at each pixel and clips its value by [-preFilterCap, preFilterCap] interval.
	The result values are passed to the Birchfield-Tomasi pixel cost function.
	@param uniquenessRatio Margin in percentage by which the best (minimum) computed cost function
	value should "win" the second best value to consider the found match correct. Normally, a value
	within the 5-15 range is good enough.
	@param speckleWindowSize Maximum size of smooth disparity regions to consider their noise speckles
	and invalidate. Set it to 0 to disable speckle filtering. Otherwise, set it somewhere in the
	50-200 range.
	@param speckleRange Maximum disparity variation within each connected component. If you do speckle
	filtering, set the parameter to a positive value, it will be implicitly multiplied by 16.
	Normally, 1 or 2 is good enough.
	@param mode Set it to StereoSGBM::MODE_HH to run the full-scale two-pass dynamic programming
	algorithm. It will consume O(W\*H\*numDisparities) bytes, which is large for 640x480 stereo and
	huge for HD-size pictures. By default, it is set to false .

	The first constructor initializes StereoSGBM with all the default parameters. So, you only have to
	set StereoSGBM::numDisparities at minimum. The second constructor enables you to set each parameter
	to a custom value.
	*/

	create(minDisparity: _st.int, numDisparities : _st.int, blockSize : _st.int,
		P1 ? : _st.int /*= 0*/, P2 ? : _st.int /*= 0*/, disp12MaxDiff ? : _st.int /* = 0*/,
		preFilterCap ? : _st.int /*= 0*/, uniquenessRatio ? : _st.int /*= 0*/,
		speckleWindowSize ? : _st.int /*= 0*/, speckleRange ? : _st.int  /*= 0*/,
		mode ? : StereoSGBMMode | _st.int /*= StereoSGBM::MODE_SGBM*/) : StereoSGBM;
}

interface StereoSGBM extends StereoMatcher
{
	//
	//    CV_WRAP virtual int getPreFilterCap() const = 0;
	//    CV_WRAP virtual void setPreFilterCap(int preFilterCap) = 0;
	//
	//    CV_WRAP virtual int getUniquenessRatio() const = 0;
	//    CV_WRAP virtual void setUniquenessRatio(int uniquenessRatio) = 0;
	//
	//    CV_WRAP virtual int getP1() const = 0;
	//    CV_WRAP virtual void setP1(int P1) = 0;
	//
	//    CV_WRAP virtual int getP2() const = 0;
	//    CV_WRAP virtual void setP2(int P2) = 0;
	//
	//    CV_WRAP virtual int getMode() const = 0;
	//    CV_WRAP virtual void setMode(int mode) = 0;
	//

};

export var StereoSGBM : StereoSGBMStatic = alvision_module.StereoSGBM;