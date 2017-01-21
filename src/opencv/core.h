#ifndef _ALVISION_CORE_H_
#define _ALVISION_CORE_H_
//#include "OpenCV.h"
#include "../alvision.h"




class core : public or ::ObjectWrap{
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static POLY_METHOD(swap_mat);
	static POLY_METHOD(swap_umat);
	static POLY_METHOD(borderInterpolate);
	static POLY_METHOD(copyMakeBorder);
	static POLY_METHOD(add);
	static POLY_METHOD(subtract);
	static POLY_METHOD(multiply);
	static POLY_METHOD(divide_mat);
	static POLY_METHOD(divide_scale);
	static POLY_METHOD(scaleAdd);
	static POLY_METHOD(addWeighted);
	static POLY_METHOD(convertScaleAbs);
	static POLY_METHOD(LUT);
	static POLY_METHOD(sum);
	static POLY_METHOD(countNonZero);
	static POLY_METHOD(findNonZero);
	static POLY_METHOD(mean);
	static POLY_METHOD(meanStdDev);
	static POLY_METHOD(norm);
	static POLY_METHOD(norm_src2);
	static POLY_METHOD(norm_simple);
	static POLY_METHOD(PSNR);
	static POLY_METHOD(batchDistance);
	static POLY_METHOD(normalize);
	static POLY_METHOD(normalize_sparse);
	static POLY_METHOD(minMaxIdx);
	static POLY_METHOD(minMaxLoc_sparse);
	static POLY_METHOD(minMaxLoc);
	static POLY_METHOD(reduce);
	static POLY_METHOD(merge_arr);
	static POLY_METHOD(merge_size);

	static POLY_METHOD(split_array);
	static POLY_METHOD(split_mat);

	static POLY_METHOD(mixChannels_arr_npairs);
	static POLY_METHOD(mixChannels_arr);
	static POLY_METHOD(mixChannels_mat_npairs);
	static POLY_METHOD(mixChannels_mat);

	static POLY_METHOD(extractChannel);
	static POLY_METHOD(insertChannel);
	static POLY_METHOD(flip);
	static POLY_METHOD(repeat);
	static POLY_METHOD(repeat_mat);

	static POLY_METHOD(hconcat_mat);
	static POLY_METHOD(hconcat_inputarray);
	static POLY_METHOD(hconcat_arrayorarrays);


	static POLY_METHOD(vconcat_array);
	static POLY_METHOD(vconcat_2src);
	static POLY_METHOD(vconcat_matrix_array);

	static POLY_METHOD(bitwise_and);
	static POLY_METHOD(bitwise_or);
	static POLY_METHOD(bitwise_xor);
	static POLY_METHOD(bitwise_not);
	static POLY_METHOD(absdiff);
	static POLY_METHOD(inRange);
	static POLY_METHOD(compare);
	static POLY_METHOD(compare_number);

	static POLY_METHOD(min_array);
	static POLY_METHOD(min_mat);
	static POLY_METHOD(min_umat);

	static POLY_METHOD(max_array);
	static POLY_METHOD(max_mat);
	static POLY_METHOD(max_umat);

	static POLY_METHOD(sqrt);
	static POLY_METHOD(pow);
	static POLY_METHOD(exp);
	static POLY_METHOD(log);
	static POLY_METHOD(polarToCart);
	static POLY_METHOD(cartToPolar);
	static POLY_METHOD(phase);
	static POLY_METHOD(magnitude);
	static POLY_METHOD(checkRange);
	static POLY_METHOD(patchNaNs);
	static POLY_METHOD(gemm);
	static POLY_METHOD(mulTransposed);
	static POLY_METHOD(transpose);
	static POLY_METHOD(transform);
	static POLY_METHOD(perspectiveTransform);
	static POLY_METHOD(completeSymm);
	static POLY_METHOD(setIdentity);
	static POLY_METHOD(determinant);
	static POLY_METHOD(trace);
	static POLY_METHOD(invert);
	static POLY_METHOD(solve);
	static POLY_METHOD(sort);
	static POLY_METHOD(sortIdx);
	static POLY_METHOD(solveCubic);
	static POLY_METHOD(solvePoly);
	static POLY_METHOD(eigen);
	static POLY_METHOD(calcCovarMatrix_array);
	static POLY_METHOD(calcCovarMatrix_mat	);

	static POLY_METHOD(PCACompute_variance);
	static POLY_METHOD(PCACompute_maxComponents);
	static POLY_METHOD(PCAProject);
	static POLY_METHOD(PCABackProject);
	static POLY_METHOD(SVDecomp);
	static POLY_METHOD(SVBackSubst);
	static POLY_METHOD(Mahalanobis);

	static POLY_METHOD(dft);
	static POLY_METHOD(idft);
	static POLY_METHOD(dct);
	static POLY_METHOD(idct);
	static POLY_METHOD(mulSpectrums);
	static POLY_METHOD(getOptimalDFTSize);

	static POLY_METHOD(theRNG);

	static POLY_METHOD(randu);
	static POLY_METHOD(randu_number);
	static POLY_METHOD(randn);
	static POLY_METHOD(randShuffle);
	static POLY_METHOD(kmeans);



};

#endif