#ifndef _ALVISION_IMGPROC_H_
#define _ALVISION_IMGPROC_H_

#include "../alvision.h"

class imgproc : public overres::ObjectWrap{
 public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	

	static POLY_METHOD(createLineSegmentDetector);
	static POLY_METHOD(getGaussianKernel);
	static POLY_METHOD(getDerivKernels);
	static POLY_METHOD(getGaborKernel);
	static POLY_METHOD(morphologyDefaultBorderValue);
	static POLY_METHOD(getStructuringElement);
	static POLY_METHOD(medianBlur);
	static POLY_METHOD(GaussianBlur);
	static POLY_METHOD(bilateralFilter);
	static POLY_METHOD(boxFilter);
	static POLY_METHOD(sqrBoxFilter);
	static POLY_METHOD(blur);
	static POLY_METHOD(filter2D);
	static POLY_METHOD(sepFilter2D);
	static POLY_METHOD(Sobel);
	static POLY_METHOD(spatialGradient);
	static POLY_METHOD(Scharr);
	static POLY_METHOD(Laplacian);
	static POLY_METHOD(Canny);
	static POLY_METHOD(cornerMinEigenVal);
	static POLY_METHOD(cornerHarris);
	static POLY_METHOD(cornerEigenValsAndVecs);
	static POLY_METHOD(preCornerDetect);
	static POLY_METHOD(cornerSubPix);
	static POLY_METHOD(goodFeaturesToTrack);
	static POLY_METHOD(HoughLines);
	static POLY_METHOD(HoughLinesP);
	static POLY_METHOD(HoughCircles);
	static POLY_METHOD(erode);
	static POLY_METHOD(dilate);
	static POLY_METHOD(morphologyEx);
	static POLY_METHOD(resize);
	static POLY_METHOD(warpAffine);
	static POLY_METHOD(warpPerspective);
	static POLY_METHOD(remap);
	static POLY_METHOD(convertMaps);
	static POLY_METHOD(getRotationMatrix2D);
	static POLY_METHOD(invertAffineTransform);
	static POLY_METHOD(getPerspectiveTransform_mat);
	static POLY_METHOD(getPerspectiveTransform_point);
	static POLY_METHOD(getAffineTransform_mat);
	static POLY_METHOD(getAffineTransform_point);
	static POLY_METHOD(getRectSubPix);
	static POLY_METHOD(logPolar);
	static POLY_METHOD(linearPolar);
	static POLY_METHOD(integral_tilted);
	static POLY_METHOD(integral_squared);
	static POLY_METHOD(integral);
	static POLY_METHOD(accumulate);
	static POLY_METHOD(accumulateSquare);
	static POLY_METHOD(accumulateProduct);
	static POLY_METHOD(accumulateWeighted);
	static POLY_METHOD(phaseCorrelate);
	static POLY_METHOD(createHanningWindow);
	static POLY_METHOD(threshold);
	static POLY_METHOD(adaptiveThreshold);
	static POLY_METHOD(pyrDown);
	static POLY_METHOD(pyrUp);
	static POLY_METHOD(buildPyramid);
	static POLY_METHOD(undistort);
	static POLY_METHOD(initUndistortRectifyMap);
	static POLY_METHOD(initWideAngleProjMap);
	static POLY_METHOD(getDefaultNewCameraMatrix);
	static POLY_METHOD(undistortPoints);
	static POLY_METHOD(calcHist_array);
	static POLY_METHOD(calcHist_sparsemat);
	static POLY_METHOD(calcHist_mat);
	static POLY_METHOD(calcBackProject);
	static POLY_METHOD(calcBackProject_sparsemat);
	static POLY_METHOD(calcBackProject_arrayofarrays);
	static POLY_METHOD(compareHist);
	static POLY_METHOD(compareHist_sparsemat);
	static POLY_METHOD(equalizeHist);
	static POLY_METHOD(EMD);
	static POLY_METHOD(watershed);
	static POLY_METHOD(pyrMeanShiftFiltering);
	static POLY_METHOD(grabCut);
	static POLY_METHOD(distanceTransform);
	static POLY_METHOD(distanceTransform_labels);
	static POLY_METHOD(floodFill_mask);
	static POLY_METHOD(floodFill);
	static POLY_METHOD(cvtColor);
	static POLY_METHOD(demosaicing);
	static POLY_METHOD(moments);
	static POLY_METHOD(HuMoments_array);
	static POLY_METHOD(HuMoments);
	static POLY_METHOD(matchTemplate);
	static POLY_METHOD(connectedComponents);
	static POLY_METHOD(connectedComponentsWithStats);
	static POLY_METHOD(findContours_hierarchy);
	static POLY_METHOD(findContours);
	static POLY_METHOD(approxPolyDP);
	static POLY_METHOD(arcLength);
	static POLY_METHOD(boundingRect);
	static POLY_METHOD(contourArea);
	static POLY_METHOD(minAreaRect);
	static POLY_METHOD(boxPoints);
	static POLY_METHOD(minEnclosingCircle);
	static POLY_METHOD(minEnclosingTriangle);
	static POLY_METHOD(matchShapes);
	static POLY_METHOD(convexHull);
	static POLY_METHOD(convexityDefects);
	static POLY_METHOD(isContourConvex);
	static POLY_METHOD(intersectConvexConvex);
	static POLY_METHOD(fitEllipse);
	static POLY_METHOD(fitLine);
	static POLY_METHOD(pointPolygonTest);
	static POLY_METHOD(rotatedRectangleIntersection);
	static POLY_METHOD(createCLAHE);
	static POLY_METHOD(createGeneralizedHoughBallard);
	static POLY_METHOD(createGeneralizedHoughGuil);
	static POLY_METHOD(blendLinear);
	static POLY_METHOD(applyColorMap);
	static POLY_METHOD(line);
	static POLY_METHOD(arrowedLine);
	static POLY_METHOD(rectangle);
	static POLY_METHOD(rectangle_points);
	static POLY_METHOD(circle);
	static POLY_METHOD(ellipse);
	static POLY_METHOD(ellipse_center);
	static POLY_METHOD(drawMarker);
	static POLY_METHOD(fillConvexPoly);
	static POLY_METHOD(fillConvexPoly_mat);
	static POLY_METHOD(fillPoly);
	static POLY_METHOD(fillPoly_mat);
	static POLY_METHOD(polylines);
	static POLY_METHOD(polylines_mat);
	static POLY_METHOD(drawContours);
	static POLY_METHOD(clipLine_size);
	static POLY_METHOD(clipLine_rect);
	static POLY_METHOD(ellipse2Poly);
	static POLY_METHOD(putText);
	static POLY_METHOD(getTextSize);







};


#endif