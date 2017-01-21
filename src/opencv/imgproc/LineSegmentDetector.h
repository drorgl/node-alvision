#ifndef _ALVISION_LINESEGMENTSETECTOR_H_
#define _ALVISION_LINESEGMENTSETECTOR_H_

#include "../../alvision.h"
#include "../core/Algorithm.h"

class LineSegmentDetector : public Algorithm {
public:
	static std::string name;

	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	static POLY_METHOD(New);
	static POLY_METHOD(detect);
	static POLY_METHOD(drawSegments);
	static POLY_METHOD(compareSegments);

};

#endif




    ////! @} imgproc_subdiv2d

    ////! @addtogroup imgproc_feature
    ////! @{

    ///** @example lsd_lines.cpp
    //An example using the LineSegmentDetector
    //*/

    ///** @brief Line segment detector class
    //
    //following the algorithm described at @cite Rafael12 .
    //*/
    //interface LineSegmentDetector extends _core.Algorithm
    //{
    //    /** @brief Finds lines in the input image.
    //
    //    This is the output of the default parameters of the algorithm on the above shown image.
    //
    //    ![image](pics/building_lsd.png)
    //
    //    @param _image A grayscale (CV_8UC1) input image. If only a roi needs to be selected, use:
    //    `lsd_ptr-\>detect(image(roi), lines, ...); lines += Scalar(roi.x, roi.y, roi.x, roi.y);`
    //    @param _lines A vector of Vec4i or Vec4f elements specifying the beginning and ending point of a line. Where
    //    Vec4i/Vec4f is (x1, y1, x2, y2), point 1 is the start, point 2 - end. Returned lines are strictly
    //    oriented depending on the gradient.
    //    @param width Vector of widths of the regions, where the lines are found. E.g. Width of line.
    //    @param prec Vector of precisions with which the lines are found.
    //    @param nfa Vector containing number of false alarms in the line region, with precision of 10%. The
    //    bigger the value, logarithmically better the detection.
    //    - -1 corresponds to 10 mean false alarms
    //    - 0 corresponds to 1 mean false alarm
    //    - 1 corresponds to 0.1 mean false alarms
    //    This vector will be calculated only when the objects type is LSD_REFINE_ADV.
    //    */
    //    detect(_image: _st.InputArray, _lines: _st.OutputArray, width?: _st.OutputArray /*= noArray()*/,
    //        prec?: _st.OutputArray /*= noArray()*/, nfa?: _st.OutputArray /*= noArray()*/): void;

    //    /** @brief Draws the line segments on a given image.
    //    @param _image The image, where the liens will be drawn. Should be bigger or equal to the image,
    //    where the lines were found.
    //    @param lines A vector of the lines that needed to be drawn.
    //     */
    //    drawSegments(_image : _st.InputOutputArray , lines : _st.InputArray ) : void;

    //    /** @brief Draws two groups of lines in blue and red, counting the non overlapping (mismatching) pixels.
    //
    //    @param size The size of the image, where lines1 and lines2 were found.
    //    @param lines1 The first group of lines that needs to be drawn. It is visualized in blue color.
    //    @param lines2 The second group of lines. They visualized in red color.
    //    @param _image Optional image, where the lines will be drawn. The image should be color(3-channel)
    //    in order for lines1 and lines2 to be drawn in the above mentioned colors.
    //     */
    //    compareSegments(size: _types.Size, lines1: _st.InputArray, lines2: _st.InputArray, _image : _st.InputOutputArray /*= noArray()*/) : _st.int;
    //};