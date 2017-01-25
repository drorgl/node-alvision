#include "LineIterator.h"
#include "../Matrix.h"
#include "../types/Point.h"

namespace lineiterator_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("lineiterator_general_callback is empty");
		}
		return overload->execute("lineiterator", info);
	}
}

Nan::Persistent<FunctionTemplate> LineIterator::constructor;

std::string LineIterator::name;

void
LineIterator::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	lineiterator_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(lineiterator_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("LineIterator").ToLocalChecked());

	overload->register_type<LineIterator>(ctor, "lineiterator", "LineIterator");


	
	
	//   /** @brief Line iterator
//    
//    The class is used to iterate over all the pixels on the raster line
//    segment connecting two specified points.
//    
//    The class LineIterator is used to get each pixel of a raster line. It
//    can be treated as versatile implementation of the Bresenham algorithm
//    where you can stop at each pixel and do some extra processing, for
//    example, grab pixel values along the line or draw a line with an effect
//    (for example, with XOR operation).
//    
//    The number of pixels along the line is stored in LineIterator::count.
//    The method LineIterator::pos returns the current position in the image:
//    
//    @code{.cpp}
//    // grabs pixels along the line (pt1, pt2)
//    // from 8-bit 3-channel image to the buffer
//    LineIterator it(img, pt1, pt2, 8);
//    LineIterator it2 = it;
//    vector<Vec3b> buf(it.count);
//    
//    for(int i = 0; i < it.count; i++, ++it)
//        buf[i] = *(const Vec3b)*it;
//    
//    // alternative way of iterating through the line
//    for(int i = 0; i < it2.count; i++, ++it2)
//    {
//        Vec3b val = img.at<Vec3b>(it2.pos());
//        CV_Assert(buf[i] == val);
//    }
//    @endcode
//    */
//    //class CV_EXPORTS LineIterator
//interface LineIteratorStatic {
//           /** @brief intializes the iterator
//        
//            creates iterators for the line connecting pt1 and pt2
//            the line will be clipped on the image boundaries
//            the line is 8-connected or 4-connected
//            If leftToRight=true, then the iteration is always done
//            from the left-most point to the right most,
//            not to depend on the ordering of pt1 and pt2 parameters
//            */
//    new (img: _mat.Mat , pt1: _types.Point, pt2: _types.Point,
//        connectivity?: _st.int /* = 8*/, leftToRight?  : boolean /*= false*/): LineIterator;
	overload->addOverloadConstructor("lineiterator", "LineIterator", {
		make_param<Matrix*>("img","Mat") ,
		make_param<Point*>("pt1",Point::name),
		make_param<Point*>("pt2",Point::name),
		make_param<int>("connectivity","int", 8),
		make_param<bool>("leftToRight","bool", false)
	},New_pt );
//     
//}
//interface LineIterator
//    {
////        public:
////        /** @brief returns pointer to the current pixel
////        */
////        uchar * operator * ();
////        /** @brief prefix increment operator (++it). shifts iterator to the next pixel
////        */
////        LineIterator & operator++();
////        /** @brief postfix increment operator (it++). shifts iterator to the next pixel
////        */
////        LineIterator operator ++(int);
////        /** @brief returns coordinates of the current pixel
////        */
////        Point pos() const;
//    each(cb : (pos: _types.Point) => void);
	overload->addOverload("lineiterator", "LineIterator", "each", {make_param<std::shared_ptr<or::Callback>>("cb","Function")}, each);
////
////        uchar * ptr;
////        const uchar* ptr0;
////        int step, elemSize;
////        int err, count;
////        int minusDelta, plusDelta;
////        int minusStep, plusStep;
//};
//
//export var LineIterator: LineIteratorStatic = alvision_module.LineIterator;
//
//    //! @cond IGNORED
//
//    // === LineIterator implementation ===
//
////    inline
////    uchar * LineIterator::operator * ()
////    {
////        return ptr;
////    }
////
////    inline
////    LineIterator & LineIterator::operator++()
////{
////        int mask = err < 0 ? -1 : 0;
////        err += minusDelta + (plusDelta & mask);
////        ptr += minusStep + (plusStep & mask);
////        return *this;
////    }
////
////    inline
////    LineIterator LineIterator::operator++(int)
////{
////        LineIterator it = *this;
////        ++(*this);
////        return it;
////    }
////
////    inline
////    Point LineIterator::pos() const
////        {
////            Point p;
////    p.y = (int)((ptr - ptr0) / step);
////    p.x = (int)(((ptr - ptr0) - p.y * step) / elemSize);
////    return p;
////}
//
////! @endcond
//
////! @} imgproc_draw
//
////! @} imgproc
//
////} // cv
//
////#ifndef DISABLE_OPENCV_24_COMPATIBILITY
////#include "opencv2/imgproc/imgproc_c.h"
////#endif
//
////#endif

target->Set(Nan::New("LineIterator").ToLocalChecked(), ctor->GetFunction());

}

v8::Local<v8::Function> LineIterator::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


POLY_METHOD(LineIterator::New_pt){throw std::exception("not implemented");}
POLY_METHOD(LineIterator::each){throw std::exception("not implemented");}

