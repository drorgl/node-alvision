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

import alvision_module from "../bindings";
import * as _st from './static';
import * as _matx from './Matx';

//#ifndef __OPENCV_CORE_TYPES_HPP__
//#define __OPENCV_CORE_TYPES_HPP__

//#ifndef __cplusplus
//#  error types.hpp header must be compiled as C++
//#endif

//#include < climits >
//#include < cfloat >
//#include < vector >

//#include "opencv2/core/cvdef.h"
//#include "opencv2/core/cvstd.hpp"
//#include "opencv2/core/matx.hpp"

//namespace cv {

    //! @addtogroup core_basic
    //! @{

    //////////////////////////////// Complex //////////////////////////////

    /** @brief  A complex number class.
    
      The template class is similar and compatible with std::complex, however it provides slightly
      more convenient access to the real and imaginary parts using through the simple field access, as opposite
      to std::complex::real() and std::complex::imag().
    */

export interface ComplexStatic<T> {
    new (): Complex<T>;
    new (_re: T, _im: T): Complex<T>;
}

export interface Complex<T> {
    conj(): Complex<T>;
    re: T;
    im: T;
}

//var 

//    template < typename _Tp> class Complex {
//        public:

//        //! constructors
//        Complex();
//        Complex(_Tp _re, _Tp _im = 0);

//        //! conversion to another data type
//        template<typename T2> operator Complex<T2>() const;
//        //! conjugation
//        Complex conj() const;

//        _Tp re, im; //< the real and the imaginary parts
//    };

//    typedef Complex< float > Complexf;
export interface Complexf extends Complex<_st.float> { }
export interface Complexd extends Complex<_st.double> { }

export var Complexf: ComplexStatic<_st.float> = alvision_module.Complexf;
export var Complexd: ComplexStatic<_st.double> = alvision_module.Complexd;

//    typedef Complex< double > Complexd;

//    template < typename _Tp> class DataType<Complex<_Tp > >
//        {
//            public:
//            typedef Complex<_Tp> value_type;
//            typedef value_type   work_type;
//            typedef _Tp          channel_type;

//            enum { generic_type = 0,
//                depth        = DataType<channel_type>::depth,
//                    channels = 2,
//                    fmt = DataType<channel_type>::fmt + ((channels - 1) << 8),
//                        type = CV_MAKETYPE(depth, channels) };

//            typedef Vec< channel_type, channels> vec_type;
//        };



    //////////////////////////////// Point_ ////////////////////////////////

    /** @brief Template class for 2D points specified by its coordinates `x` and `y`.
    
    An instance of the class is interchangeable with C structures, CvPoint and CvPoint2D32f . There is
    also a cast operator to convert point coordinates to the specified type. The conversion from
    floating-point coordinates to integer coordinates is done by rounding. Commonly, the conversion
    uses this operation for each of the coordinates. Besides the class members listed in the
    declaration above, the following operations on points are implemented:
    @code
        pt1 = pt2 + pt3;
        pt1 = pt2 - pt3;
        pt1 = pt2 * a;
        pt1 = a * pt2;
        pt1 = pt2 / a;
        pt1 += pt2;
        pt1 -= pt2;
        pt1 *= a;
        pt1 /= a;
        double value = norm(pt); // L2 norm
        pt1 == pt2;
        pt1 != pt2;
    @endcode
    For your convenience, the following type aliases are defined:
    @code
        typedef Point_<int> Point2i;
        typedef Point2i Point;
        typedef Point_<float> Point2f;
        typedef Point_<double> Point2d;
    @endcode
    Example:
    @code
        Point2f a(0.3f, 0.f), b(0.f, 0.4f);
        Point pt = (a + b)*10.f;
        cout << pt.x << ", " << pt.y << endl;
    @endcode
    */

export interface Point_Static<T> {
    new (): Point_<T>;
    new (_x : T, _y : T): Point_<T>;
    new (sz: Size_<T>): Point_<T>;
    new (v: _matx.Vec<T>): Point_<T>;
    new (buf: Buffer): Point_<T>; //from Buffer (deserialize)

//template< typename _Tp> static inline
//double norm(const Point_<_Tp>& pt)
//    {
//        return std::sqrt((double)pt.x*pt.x + (double)pt.y*pt.y);
//}
    norm(pt: Point_<T>): _st.double;

//template < typename _Tp> static inline
//bool operator == (const Point_<_Tp>& a, const Point_<_Tp>& b)
//    {
//        return a.x == b.x && a.y == b.y;
//}
    op_Equals(a: Point_<T>, b: Point_<T>): boolean;

//template < typename _Tp> static inline
//bool operator != (const Point_<_Tp>& a, const Point_<_Tp>& b)
//    {
//        return a.x != b.x || a.y != b.y;
//}
    op_NotEquals(a: Point_<T>, b: Point_<T>): boolean;

//template < typename _Tp> static inline
//Point_ < _Tp > operator + (const Point_<_Tp>& a, const Point_<_Tp>& b)
//    {
//        return Point_<_Tp>(saturate_cast<_Tp>(a.x + b.x), saturate_cast<_Tp>(a.y + b.y));
//}
    op_Addition(a: Point_<T>, b: Point_<T>): Point_<T>;

//template < typename _Tp> static inline
//Point_ < _Tp > operator - (const Point_<_Tp>& a, const Point_<_Tp>& b)
//    {
//        return Point_<_Tp>(saturate_cast<_Tp>(a.x - b.x), saturate_cast<_Tp>(a.y - b.y));
//}
    op_Substraction(a: Point_<T>, b: Point_<T>): Point_<T>;

//template < typename _Tp> static inline
//Point_ < _Tp > operator - (const Point_<_Tp>& a)
//    {
//        return Point_<_Tp>(saturate_cast<_Tp>(-a.x), saturate_cast<_Tp>(-a.y));
//}
    op_Substraction(a: Point_<T>): Point_<T>;

//template < typename _Tp> static inline
//Point_ < _Tp > operator * (const Point_<_Tp>& a, int b)
//    {
//        return Point_<_Tp>(saturate_cast<_Tp>(a.x * b), saturate_cast<_Tp>(a.y * b));
//}
    op_Multiplication(a: Point_<T>, b: _st.int): Point_<T>;

//template < typename _Tp> static inline
//Point_ < _Tp > operator * (int a, const Point_<_Tp>& b)
//    {
//        return Point_<_Tp>(saturate_cast<_Tp>(b.x * a), saturate_cast<_Tp>(b.y * a));
//}
    op_Multiplication(a: _st.int, b: Point_<T>): Point_<T>;

//template < typename _Tp> static inline
//Point_ < _Tp > operator * (const Point_<_Tp>& a, float b)
//    {
//        return Point_<_Tp>(saturate_cast<_Tp>(a.x * b), saturate_cast<_Tp>(a.y * b));
//}
    op_Multiplication(a: Point_<T>, b: _st.float): Point_<T>;

//template < typename _Tp> static inline
//Point_ < _Tp > operator * (float a, const Point_<_Tp>& b)
//    {
//        return Point_<_Tp>(saturate_cast<_Tp>(b.x * a), saturate_cast<_Tp>(b.y * a));
//}
    op_Multiplication(a: _st.float, b: Point_<T>): Point_<T>;

//template < typename _Tp> static inline
//Point_ < _Tp > operator * (const Point_<_Tp>& a, double b)
//    {
//        return Point_<_Tp>(saturate_cast<_Tp>(a.x * b), saturate_cast<_Tp>(a.y * b));
//}
    op_Multiplication(a: Point_<T>, b: _st.double): Point_<T>;

//template < typename _Tp> static inline
//Point_ < _Tp > operator * (double a, const Point_<_Tp>& b)
//    {
//        return Point_<_Tp>(saturate_cast<_Tp>(b.x * a), saturate_cast<_Tp>(b.y * a));
//}
    op_Multiplication(a: _st.double, b: Point_<T>): Point_<T>;

//template < typename _Tp> static inline
//Point_ < _Tp > operator * (const Matx<_Tp, 2, 2 >& a, const Point_<_Tp>& b)
//    {
//        Matx<_Tp, 2, 1> tmp = a * Vec < _Tp, 2>(b.x, b.y);
//return Point_<_Tp>(tmp.val[0], tmp.val[1]);
//}
    op_Multiplication(a: _matx.Matx<T>, b: Point_<T>): Point_<T>;



//template < typename _Tp> static inline
//Point_ < _Tp > operator / (const Point_<_Tp>& a, int b)
//    {
//        Point_<_Tp>tmp(a);
//tmp /= b;
//return tmp;
//}
    op_Division(a: Point_<T>, b: _st.int): Point_<T>;

//template < typename _Tp> static inline
//Point_ < _Tp > operator / (const Point_<_Tp>& a, float b)
//    {
//        Point_<_Tp>tmp(a);
//tmp /= b;
//return tmp;
//}
    op_Division(a: Point_<T>, b: _st.float): Point_<T>;

//template < typename _Tp> static inline
//Point_ < _Tp > operator / (const Point_<_Tp>& a, double b)
//    {
//        Point_<_Tp>tmp(a);
//tmp /= b;
//return tmp;
//}
    op_Division(a: Point_<T>, b: _st.double): Point_<T>;

}

export interface Point_<T> extends _st.IOArray {
    dot(pt: Point_<T>): T;
    //! dot product computed in double-precision arithmetics
    ddot(pt: Point_<T>): _st.double;
    //! cross-product
    cross(pt: Point_<T>): _st.double;
    //! checks whether the point is inside the specified rectangle
    inside(r: Rect_<T>): boolean;

    x: T;
    y: T;
    //_Tp x, y; //< the point coordinates

    op_Equals(other: Point_<T>): boolean;
    op_NotEquals(other: Point_<T>): boolean;
    op_Addition(other: Point_<T>): Point_<T>;
    op_Substraction(other: Point_<T>): Point_<T>;
    op_Multiplication(other: _st.int | _st.float | _st.double | number): Point_<T>;
    op_Multiplication(other: _matx.Matx<T>): Point_<T>;
    op_Division(other: _st.int | _st.float | _st.double): Point_<T>;

    toBuffer(): Buffer;

    setTo(other: Point3_<T>): void;
}

//    template < typename _Tp> class Point_ {
//        public:
//        typedef _Tp value_type;

//        // various constructors
//        Point_();
//        Point_(_Tp _x, _Tp _y);
//        Point_(const Point_& pt);
//        Point_(const Size_<_Tp>& sz);
//            Point_(const Vec< _Tp, 2>& v);

//        Point_& operator = (const Point_& pt);
//    //! conversion to another data type
//    template < typename _Tp2> operator Point_<_Tp2>() const;

//    //! conversion to the old-style C structures
//    operator Vec< _Tp, 2 > () const;

//    //! dot product
//    _Tp dot(const Point_& pt) const;
//    //! dot product computed in double-precision arithmetics
//    double ddot(const Point_& pt) const;
//    //! cross-product
//    double cross(const Point_& pt) const;
//    //! checks whether the point is inside the specified rectangle
//    bool inside(const Rect_<_Tp>& r) const;

//    _Tp x, y; //< the point coordinates
//};


export interface Point2i extends Point_<_st.int> { }
export interface Point2f extends Point_<_st.float> { }
export interface Point2d extends Point_<_st.double> { }
export interface Point extends Point2i { }


export var Point2i: Point_Static<_st.int> = alvision_module.Point2i;
export var Point2f: Point_Static<_st.float> = alvision_module.Point2f;
export var Point2d: Point_Static<_st.double> = alvision_module.Point2d;
export var Point: Point_Static<_st.int> = alvision_module.Point2i;


//typedef Point_< int > Point2i;
//typedef Point_< float > Point2f;
//typedef Point_< double > Point2d;
//typedef Point2i Point;

//template < typename _Tp> class DataType<Point_<_Tp > >
//    {
//        public:
//        typedef Point_<_Tp>                               value_type;
//        typedef Point_< typename DataType<_Tp>::work_type> work_type;
//        typedef _Tp                                       channel_type;

//        enum { generic_type = 0,
//            depth        = DataType<channel_type>::depth,
//                channels = 2,
//                fmt = DataType<channel_type>::fmt + ((channels - 1) << 8),
//                    type = CV_MAKETYPE(depth, channels)
//         };

//        typedef Vec< channel_type, channels> vec_type;
//    };



//////////////////////////////// Point3_ ////////////////////////////////

/** @brief Template class for 3D points specified by its coordinates `x`, `y` and `z`.

An instance of the class is interchangeable with the C structure CvPoint2D32f . Similarly to
Point_ , the coordinates of 3D points can be converted to another type. The vector arithmetic and
comparison operations are also supported.

The following Point3_\<\> aliases are available:
@code
    typedef Point3_<int> Point3i;
    typedef Point3_<float> Point3f;
    typedef Point3_<double> Point3d;
@endcode
@see cv::Point3i, cv::Point3f and cv::Point3d
*/

export interface Point3_Static<T> {
    new (): Point3_<T>;
    new (_x : T, _y : T, _z : T): Point3_<T>;
    new (pt : Point3_<T>): Point3_<T>;
    new (v: _matx.Vec<T>): Point3_<T>;


    //////////////////////////////// 3D Point ///////////////////////////////

//template < typename _Tp> inline
//Point3_<_Tp>::Point3_()
//    : x(0), y(0), z(0) {}

//template< typename _Tp> inline
//Point3_<_Tp>::Point3_(_Tp _x, _Tp _y, _Tp _z)
//    : x(_x), y(_y), z(_z) {}

//template< typename _Tp> inline
//Point3_<_Tp>::Point3_(const Point3_& pt)
//    : x(pt.x), y(pt.y), z(pt.z) {}

//template < typename _Tp> inline
//Point3_<_Tp>::Point3_(const Point_<_Tp>& pt)
//    : x(pt.x), y(pt.y), z(_Tp()) {}

//template < typename _Tp> inline
//Point3_<_Tp>::Point3_(const Vec<_Tp, 3>& v)
//    : x(v[0]), y(v[1]), z(v[2]) {}

//template < typename _Tp> template < typename _Tp2> inline
//Point3_<_Tp>::operator Point3_<_Tp2>() const
//    {
//        return Point3_<_Tp2>(saturate_cast<_Tp2>(x), saturate_cast<_Tp2>(y), saturate_cast<_Tp2>(z));
//}

//template < typename _Tp> inline
//Point3_<_Tp>::operator Vec< _Tp, 3 > () const
//    {
//        return Vec<_Tp, 3>(x, y, z);
//}

//template < typename _Tp> inline
//Point3_<_Tp>& Point3_<_Tp>::operator = (const Point3_& pt)
//    {
//        x = pt.x; y = pt.y; z = pt.z;
//return *this;
//}
    

//template < typename _Tp> inline
//_Tp Point3_<_Tp>::dot(const Point3_& pt) const
//    {
//        return saturate_cast<_Tp>(x * pt.x + y * pt.y + z * pt.z);
//}
    

//template < typename _Tp> inline
//double Point3_<_Tp>::ddot(const Point3_& pt) const
//    {
//        return (double)x*pt.x + (double)y*pt.y + (double)z*pt.z;
//}

//template < typename _Tp> inline
//Point3_ < _Tp > Point3_<_Tp>::cross(const Point3_<_Tp>& pt) const
//    {
//        return Point3_<_Tp>(y * pt.z - z * pt.y, z * pt.x - x * pt.z, x * pt.y - y * pt.x);
//}


//template < typename _Tp> static inline
//Point3_<_Tp>& operator += (Point3_<_Tp>& a, const Point3_<_Tp>& b)
//    {
//        a.x += b.x;
//a.y += b.y;
//a.z += b.z;
//return a;
//}


//template < typename _Tp> static inline
//Point3_<_Tp>& operator -= (Point3_<_Tp>& a, const Point3_<_Tp>& b)
//    {
//        a.x -= b.x;
//a.y -= b.y;
//a.z -= b.z;
//return a;
//}

//template < typename _Tp> static inline
//Point3_<_Tp>& operator *= (Point3_<_Tp>& a, int b)
//{
//    a.x = saturate_cast<_Tp>(a.x * b);
//    a.y = saturate_cast<_Tp>(a.y * b);
//    a.z = saturate_cast<_Tp>(a.z * b);
//    return a;
//}

//template< typename _Tp> static inline
//Point3_<_Tp>& operator *= (Point3_<_Tp>& a, float b)
//{
//        a.x = saturate_cast<_Tp>(a.x * b);
//        a.y = saturate_cast<_Tp>(a.y * b);
//        a.z = saturate_cast<_Tp>(a.z * b);
//        return a;
//    }

//template< typename _Tp> static inline
//Point3_<_Tp>& operator *= (Point3_<_Tp>& a, double b)
//{
//            a.x = saturate_cast<_Tp>(a.x * b);
//            a.y = saturate_cast<_Tp>(a.y * b);
//            a.z = saturate_cast<_Tp>(a.z * b);
//            return a;
//        }

//template< typename _Tp> static inline
//Point3_<_Tp>& operator /= (Point3_<_Tp>& a, int b)
//{
//                    a.x = saturate_cast<_Tp>(a.x / b);
//                    a.y = saturate_cast<_Tp>(a.y / b);
//                    a.z = saturate_cast<_Tp>(a.z / b);
//                    return a;
//                }

//template< typename _Tp> static inline
//Point3_<_Tp>& operator /= (Point3_<_Tp>& a, float b)
//{
//                        a.x = saturate_cast<_Tp>(a.x / b);
//                        a.y = saturate_cast<_Tp>(a.y / b);
//                        a.z = saturate_cast<_Tp>(a.z / b);
//                        return a;
//                    }

//template< typename _Tp> static inline
//Point3_<_Tp>& operator /= (Point3_<_Tp>& a, double b)
//{
//                            a.x = saturate_cast<_Tp>(a.x / b);
//                            a.y = saturate_cast<_Tp>(a.y / b);
//                            a.z = saturate_cast<_Tp>(a.z / b);
//                            return a;
//                        }

//template< typename _Tp> static inline
//double norm(const Point3_<_Tp>& pt)
//    {
//        return std::sqrt((double)pt.x*pt.x + (double)pt.y*pt.y + (double)pt.z*pt.z);
//}
    norm(pt: Point3_<T>): _st.double;

//template < typename _Tp> static inline
//bool operator == (const Point3_<_Tp>& a, const Point3_<_Tp>& b)
//    {
//        return a.x == b.x && a.y == b.y && a.z == b.z;
//}
    op_Equals(pt1: Point3_<T>, pt2: Point3_<T>): boolean;
    

//template < typename _Tp> static inline
//bool operator != (const Point3_<_Tp>& a, const Point3_<_Tp>& b)
//    {
//        return a.x != b.x || a.y != b.y || a.z != b.z;
//}
    op_NotEquals(pt1: Point3_<T>, pt2: Point3_<T>): boolean;

//template < typename _Tp> static inline
//Point3_ < _Tp > operator + (const Point3_<_Tp>& a, const Point3_<_Tp>& b)
//    {
//        return Point3_<_Tp>(saturate_cast<_Tp>(a.x + b.x), saturate_cast<_Tp>(a.y + b.y), saturate_cast<_Tp>(a.z + b.z));
//}
    op_Addition(pt1: Point3_<T>, pt2: Point3_<T>): Point3_<T>;

//template < typename _Tp> static inline
//Point3_ < _Tp > operator - (const Point3_<_Tp>& a, const Point3_<_Tp>& b)
//    {
//        return Point3_<_Tp>(saturate_cast<_Tp>(a.x - b.x), saturate_cast<_Tp>(a.y - b.y), saturate_cast<_Tp>(a.z - b.z));
//}
    op_Substraction(pt1: Point3_<T>, pt2: Point3_<T>): Point3_<T>;

//template < typename _Tp> static inline
//Point3_ < _Tp > operator - (const Point3_<_Tp>& a)
//    {
//        return Point3_<_Tp>(saturate_cast<_Tp>(-a.x), saturate_cast<_Tp>(-a.y), saturate_cast<_Tp>(-a.z));
//}
    op_Substraction(a: Point3_<T>): Point3_<T>;

//template < typename _Tp> static inline
//Point3_ < _Tp > operator * (const Point3_<_Tp>& a, int b)
//    {
//        return Point3_<_Tp>(saturate_cast<_Tp>(a.x * b), saturate_cast<_Tp>(a.y * b), saturate_cast<_Tp>(a.z * b));
//}
    op_Multiplication(pt1: Point3_<T>, b : _st.int): Point3_<T>;

//template < typename _Tp> static inline
//Point3_ < _Tp > operator * (int a, const Point3_<_Tp>& b)
//    {
//        return Point3_<_Tp>(saturate_cast<_Tp>(b.x * a), saturate_cast<_Tp>(b.y * a), saturate_cast<_Tp>(b.z * a));
//}
    op_Multiplication(a: _st.int, b: Point3_<T>): Point3_<T>;

//template < typename _Tp> static inline
//Point3_ < _Tp > operator * (const Point3_<_Tp>& a, float b)
//    {
//        return Point3_<_Tp>(saturate_cast<_Tp>(a.x * b), saturate_cast<_Tp>(a.y * b), saturate_cast<_Tp>(a.z * b));
//}
    op_Multiplication(a: Point3_<T>, b: _st.float): Point3_<T>;

//template < typename _Tp> static inline
//Point3_ < _Tp > operator * (float a, const Point3_<_Tp>& b)
//    {
//        return Point3_<_Tp>(saturate_cast<_Tp>(b.x * a), saturate_cast<_Tp>(b.y * a), saturate_cast<_Tp>(b.z * a));
//}
    op_Multiplication(a: _st.float, b: Point3_<T>): Point3_<T>;
//template < typename _Tp> static inline
//Point3_ < _Tp > operator * (const Point3_<_Tp>& a, double b)
//    {
//        return Point3_<_Tp>(saturate_cast<_Tp>(a.x * b), saturate_cast<_Tp>(a.y * b), saturate_cast<_Tp>(a.z * b));
//}
    op_Multiplication(a: Point3_<T>, b: _st.double): Point3_<T>;
//template < typename _Tp> static inline
//Point3_ < _Tp > operator * (double a, const Point3_<_Tp>& b)
//    {
//        return Point3_<_Tp>(saturate_cast<_Tp>(b.x * a), saturate_cast<_Tp>(b.y * a), saturate_cast<_Tp>(b.z * a));
//}
    op_Multiplication(a: _st.double, b: Point3_<T>): Point3_<T>;

//template < typename _Tp> static inline
//Point3_ < _Tp > operator * (const Matx<_Tp, 3, 3 >& a, const Point_<_Tp>& b)
//    {
//        Matx<_Tp, 3, 1> tmp = a * Vec < _Tp, 3>(b.x, b.y, 1);
//return Point3_<_Tp>(tmp.val[0], tmp.val[1], tmp.val[2]);
//}
    
    op_Multiplication(a: _matx.Matx<T>, b: Point_<T>): Point3_<T>;

//template < typename _Tp> static inline
//Point3_ < _Tp > operator * (const Matx<_Tp, 3, 3 >& a, const Point3_<_Tp>& b)
//    {
//        Matx<_Tp, 3, 1> tmp = a * Vec < _Tp, 3>(b.x, b.y, b.z);
//return Point3_<_Tp>(tmp.val[0], tmp.val[1], tmp.val[2]);
//}
    op_Multiplication(a: _matx.Matx<T>, b: Point3_<T>): Point3_<T>;

//template < typename _Tp> static inline
//Matx < _Tp, 4, 1 > operator * (const Matx<_Tp, 4, 4 >& a, const Point3_<_Tp>& b)
//    {
//        return a * Matx < _Tp, 4, 1>(b.x, b.y, b.z, 1);
//}

//template < typename _Tp> static inline
//Point3_ < _Tp > operator / (const Point3_<_Tp>& a, int b)
//    {
//        Point3_<_Tp>tmp(a);
//tmp /= b;
//return tmp;
//}
    op_Division(a: Point3_<T>, b: _st.int): Point3_<T>;


//template < typename _Tp> static inline
//Point3_ < _Tp > operator / (const Point3_<_Tp>& a, float b)
//    {
//        Point3_<_Tp>tmp(a);
//tmp /= b;
//return tmp;
//}
    op_Division(a: Point3_<T>, b: _st.float): Point3_<T>;

//template < typename _Tp> static inline
//Point3_ < _Tp > operator / (const Point3_<_Tp>& a, double b)
//    {
//        Point3_<_Tp>tmp(a);
//tmp /= b;
//return tmp;
//}
    op_Division(a: Point3_<T>, b: _st.double): Point3_<T>;


}

export interface Point3_<T> {
    //! dot product
    dot(pt : Point3_<T>): T;
//! dot product computed in double-precision arithmetics
    ddot(pt : Point3_<T>): _st.double;
//! cross product of the 2 3D points
    cross(pt : Point3_<T>): Point3_<T>;

    x: T;
    y: T;
    z: T;
//_Tp x, y, z; //< the point coordinates

    norm(): _st.double;


    op_Equals(other: Point3_<T>): boolean;
    op_NotEquals(other: Point3_<T>): boolean;
    op_Addition(other: Point3_<T>): Point3_<T>;
    op_Substraction(other: Point3_<T>): Point3_<T>;
    op_Multiplication(other: _st.int | _st.float | _st.double | number): Point3_<T>;
    op_Multiplication(other: _matx.Matx<T>): Point3_<T>;
    op_Division(other: _st.int | _st.float | _st.double): Point3_<T>;

    setTo(other: Point3_<T>): void;

}

//template < typename _Tp> class Point3_ {
//    public:
//    typedef _Tp value_type;

//    // various constructors
//    Point3_();
//    Point3_(_Tp _x, _Tp _y, _Tp _z);
//    Point3_(const Point3_& pt);
//    explicit Point3_(const Point_<_Tp>& pt);
//    Point3_(const Vec< _Tp, 3>& v);

//    Point3_& operator = (const Point3_& pt);
////! conversion to another data type
//template < typename _Tp2> operator Point3_<_Tp2>() const;
////! conversion to cv::Vec<>
//operator Vec< _Tp, 3 > () const;

////! dot product
//_Tp dot(const Point3_& pt) const;
////! dot product computed in double-precision arithmetics
//double ddot(const Point3_& pt) const;
////! cross product of the 2 3D points
//Point3_ cross(const Point3_& pt) const;

//_Tp x, y, z; //< the point coordinates
//};

export interface Point3i extends Point3_<_st.int> { }
export interface Point3f extends Point3_<_st.float> { }
export interface Point3d extends Point3_<_st.double> { }

export var Point3i: Point3_Static<_st.int> = alvision_module.Point3i;
export var Point3f: Point3_Static<_st.float> = alvision_module.Point3f;
export var Point3d: Point3_Static<_st.double> = alvision_module.Point3d;

//typedef Point3_< int > Point3i;
//typedef Point3_< float > Point3f;
//typedef Point3_< double > Point3d;

//template < typename _Tp> class DataType<Point3_<_Tp > >
//    {
//        public:
//        typedef Point3_<_Tp>                               value_type;
//        typedef Point3_< typename DataType<_Tp>::work_type> work_type;
//        typedef _Tp                                        channel_type;

//        enum { generic_type = 0,
//            depth        = DataType<channel_type>::depth,
//                channels = 3,
//                fmt = DataType<channel_type>::fmt + ((channels - 1) << 8),
//                    type = CV_MAKETYPE(depth, channels)
//         };

//        typedef Vec< channel_type, channels> vec_type;
//    };



//////////////////////////////// Size_ ////////////////////////////////

/** @brief Template class for specifying the size of an image or rectangle.

The class includes two members called width and height. The structure can be converted to and from
the old OpenCV structures CvSize and CvSize2D32f . The same set of arithmetic and comparison
operations as for Point_ is available.

OpenCV defines the following Size_\<\> aliases:
@code
    typedef Size_<int> Size2i;
    typedef Size2i Size;
    typedef Size_<float> Size2f;
@endcode
*/

export interface Size_Static<T> {
    new (): Size_<T>;
    new (_width : T, _height : T): Size_<T>;
    new (sz : Size_<T>): Size_<T>;
    new (pt: Point_<T>): Size_<T>;


    ////////////////////////////////// Size /////////////////////////////////

//template < typename _Tp> inline
//Size_<_Tp>::Size_()
//    : width(0), height(0) {}

//template< typename _Tp> inline
//Size_<_Tp>::Size_(_Tp _width, _Tp _height)
//    : width(_width), height(_height) {}

//template< typename _Tp> inline
//Size_<_Tp>::Size_(const Size_& sz)
//    : width(sz.width), height(sz.height) {}

//template < typename _Tp> inline
//Size_<_Tp>::Size_(const Point_<_Tp>& pt)
//    : width(pt.x), height(pt.y) {}

//template < typename _Tp> template < typename _Tp2> inline
//Size_<_Tp>::operator Size_<_Tp2>() const
//    {
//        return Size_<_Tp2>(saturate_cast<_Tp2>(width), saturate_cast<_Tp2>(height));
//}

//template < typename _Tp> inline
//Size_<_Tp>& Size_<_Tp>::operator = (const Size_<_Tp>& sz)
//    {
//        width = sz.width; height = sz.height;
//return *this;
//}

//template < typename _Tp> inline
//_Tp Size_<_Tp>::area() const
//    {
//        return width * height;
//}

//template < typename _Tp> static inline
//Size_<_Tp>& operator *= (Size_<_Tp>& a, _Tp b)
//{
//    a.width *= b;
//    a.height *= b;
//    return a;
//}

//template< typename _Tp> static inline
//Size_< _Tp > operator * (const Size_<_Tp>& a, _Tp b)
//    {
//        Size_<_Tp>tmp(a);
//tmp *= b;
//return tmp;
//}
    op_Multiplication(a: Size_<T>, b: T): Size_<T>;

//template < typename _Tp> static inline
//Size_<_Tp>& operator /= (Size_<_Tp>& a, _Tp b)
//{
//        a.width /= b;
//        a.height /= b;
//        return a;
//    }

//template< typename _Tp> static inline
//Size_< _Tp > operator / (const Size_<_Tp>& a, _Tp b)
//    {
//        Size_<_Tp>tmp(a);
//tmp /= b;
//return tmp;
//}
    op_Division(a: Size_<T>, b: T): Size_<T>;

//template < typename _Tp> static inline
//Size_<_Tp>& operator += (Size_<_Tp>& a, const Size_<_Tp>& b)
//    {
//        a.width += b.width;
//a.height += b.height;
//return a;
//}

//template < typename _Tp> static inline
//Size_ < _Tp > operator + (const Size_<_Tp>& a, const Size_<_Tp>& b)
//    {
//        Size_<_Tp>tmp(a);
//tmp += b;
//return tmp;
//}
    op_Addition(a: Size_<T>, b: Size_<T>): Size_<T>;

//template < typename _Tp> static inline
//Size_<_Tp>& operator -= (Size_<_Tp>& a, const Size_<_Tp>& b)
//    {
//        a.width -= b.width;
//a.height -= b.height;
//return a;
//}

//template < typename _Tp> static inline
//Size_ < _Tp > operator - (const Size_<_Tp>& a, const Size_<_Tp>& b)
//    {
//        Size_<_Tp>tmp(a);
//tmp -= b;
//return tmp;
//}
    op_Substraction(a: Size_<T>, b: Size_<T>): Size_<T>;

//template < typename _Tp> static inline
//bool operator == (const Size_<_Tp>& a, const Size_<_Tp>& b)
//    {
//        return a.width == b.width && a.height == b.height;
//}


//template < typename _Tp> static inline
//bool operator != (const Size_<_Tp>& a, const Size_<_Tp>& b)
//    {
//        return !(a == b);
//}
}

export interface Size_<T> {
    //! the area (width*height)
    area(): T;

    width: T;
    height: T;
}

//template < typename _Tp> class Size_ {
//    public:
//    typedef _Tp value_type;

//    //! various constructors
//    Size_();
//    Size_(_Tp _width, _Tp _height);
//    Size_(const Size_& sz);
//    Size_(const Point_<_Tp>& pt);

//        Size_& operator = (const Size_& sz);
////! the area (width*height)
//_Tp area() const;

////! conversion of another data type.
//template < typename _Tp2> operator Size_<_Tp2>() const;

//_Tp width, height; // the width and the height
//};

export interface Size2i extends Size_<_st.int> { }
export interface Size2f extends Size_<_st.float> { }
export interface Size2d extends Size_<_st.double> { }
export interface Size extends Size2i { }

export var Size2i : Size_Static<_st.int> = alvision_module.Size2i
export var Size2f : Size_Static<_st.float> = alvision_module.Size2f
export var Size2d : Size_Static<_st.double> = alvision_module.Size2d
export var Size: Size_Static<_st.int> = alvision_module.Size2i;


//typedef Size_< int > Size2i;
//typedef Size_< float > Size2f;
//typedef Size_< double > Size2d;
//typedef Size2i Size;

//template < typename _Tp> class DataType<Size_<_Tp > >
//    {
//        public:
//        typedef Size_<_Tp>                               value_type;
//        typedef Size_< typename DataType<_Tp>::work_type> work_type;
//        typedef _Tp                                      channel_type;

//        enum { generic_type = 0,
//            depth        = DataType<channel_type>::depth,
//                channels = 2,
//                fmt = DataType<channel_type>::fmt + ((channels - 1) << 8),
//                    type = CV_MAKETYPE(depth, channels)
//         };

//        typedef Vec< channel_type, channels> vec_type;
//    };



//////////////////////////////// Rect_ ////////////////////////////////

/** @brief Template class for 2D rectangles

described by the following parameters:
-   Coordinates of the top-left corner. This is a default interpretation of Rect_::x and Rect_::y
    in OpenCV. Though, in your algorithms you may count x and y from the bottom-left corner.
-   Rectangle width and height.

OpenCV typically assumes that the top and left boundary of the rectangle are inclusive, while the
right and bottom boundaries are not. For example, the method Rect_::contains returns true if

\f[x  \leq pt.x < x+width,
      y  \leq pt.y < y+height\f]

Virtually every loop over an image ROI in OpenCV (where ROI is specified by Rect_\<int\> ) is
implemented as:
@code
    for(int y = roi.y; y < roi.y + roi.height; y++)
        for(int x = roi.x; x < roi.x + roi.width; x++)
        {
            // ...
        }
@endcode
In addition to the class members, the following operations on rectangles are implemented:
-   \f$\texttt{rect} = \texttt{rect} \pm \texttt{point}\f$ (shifting a rectangle by a certain offset)
-   \f$\texttt{rect} = \texttt{rect} \pm \texttt{size}\f$ (expanding or shrinking a rectangle by a
    certain amount)
-   rect += point, rect -= point, rect += size, rect -= size (augmenting operations)
-   rect = rect1 & rect2 (rectangle intersection)
-   rect = rect1 | rect2 (minimum area rectangle containing rect1 and rect2 )
-   rect &= rect1, rect |= rect1 (and the corresponding augmenting operations)
-   rect == rect1, rect != rect1 (rectangle comparison)

This is an example how the partial ordering on rectangles can be established (rect1 \f$\subseteq\f$
rect2):
@code
    template<typename _Tp> inline bool
    operator <= (const Rect_<_Tp>& r1, const Rect_<_Tp>& r2)
    {
        return (r1 & r2) == r1;
    }
@endcode
For your convenience, the Rect_\<\> alias is available: cv::Rect
*/

export interface Rect_Static<T> {
    new (): Rect_<T>;
    new (_x : T, _y : T, _width : T, _height : T): Rect_<T>;
    new (r : Rect_<T>): Rect_<T>;
    new (org: Point_<T>, sz: Size_<T>): Rect_<T>;
    new (pt1: Point_<T>, pt2: Point_<T>): Rect_<T>;

    op_And(a: Rect_<T>, b: Rect_<T>): Rect_<T>;
}

export interface Rect_<T> {
    //! the top-left corner
    tl(): Point_<T>;
    //! the bottom-right corner
    br(): Point_<T>;

    //! size (width, height) of the rectangle
    size(): Size_<T>;
    //! area (width*height) of the rectangle
    area(): T;

    //! conversion to another data type
    //template < typename _Tp2> operator Rect_<_Tp2>() const;

    //! checks whether the rectangle contains the point
    contains(pt : Point_<T>) : boolean;

    x: T;
    y: T;
    width: T;
    height: T;

    //_Tp x, y, width, height; //< the top-left corner, as well as width and height of the rectangle
}

//template < typename _Tp> class Rect_ {
//    public:
//    typedef _Tp value_type;

//    //! various constructors
//    Rect_();
//    Rect_(_Tp _x, _Tp _y, _Tp _width, _Tp _height);
//    Rect_(const Rect_& r);
//    Rect_(const Point_<_Tp>& org, const Size_<_Tp>& sz);
//        Rect_(const Point_<_Tp>& pt1, const Point_<_Tp>& pt2);

//        Rect_& operator = ( const Rect_& r );
////! the top-left corner
//Point_ < _Tp > tl() const;
////! the bottom-right corner
//Point_ < _Tp > br() const;

////! size (width, height) of the rectangle
//Size_ < _Tp > size() const;
////! area (width*height) of the rectangle
//_Tp area() const;

////! conversion to another data type
//template < typename _Tp2> operator Rect_<_Tp2>() const;

////! checks whether the rectangle contains the point
//bool contains(const Point_<_Tp>& pt) const;

//_Tp x, y, width, height; //< the top-left corner, as well as width and height of the rectangle
//};

export interface Rect2i extends Rect_<_st.int> { }
export interface Rect2f extends Rect_<_st.float> { }
export interface Rect2d extends Rect_<_st.double> { }
export interface Rect extends Rect2i { }

export var Rect: Rect_Static<_st.int> = alvision_module.Rect2i;
export var Rect2i: Rect_Static<_st.int> = alvision_module.Rect2i;
export var Rect2f: Rect_Static<_st.float> = alvision_module.Rect2f;
export var Rect2d: Rect_Static<_st.double> = alvision_module.Rect2d;

//typedef Rect_< int > Rect2i;
//typedef Rect_< float > Rect2f;
//typedef Rect_< double > Rect2d;
//typedef Rect2i Rect;

//template < typename _Tp> class DataType<Rect_<_Tp > >
//    {
//        public:
//        typedef Rect_<_Tp>                               value_type;
//        typedef Rect_< typename DataType<_Tp>::work_type> work_type;
//        typedef _Tp                                      channel_type;

//        enum { generic_type = 0,
//            depth        = DataType<channel_type>::depth,
//                channels = 4,
//                fmt = DataType<channel_type>::fmt + ((channels - 1) << 8),
//                    type = CV_MAKETYPE(depth, channels)
//         };

//        typedef Vec< channel_type, channels> vec_type;
//    };



///////////////////////////// RotatedRect /////////////////////////////

/** @brief The class represents rotated (i.e. not up-right) rectangles on a plane.

Each rectangle is specified by the center point (mass center), length of each side (represented by
cv::Size2f structure) and the rotation angle in degrees.

The sample below demonstrates how to use RotatedRect:
@code
    Mat image(200, 200, CV_8UC3, Scalar(0));
    RotatedRect rRect = RotatedRect(Point2f(100,100), Size2f(100,50), 30);

    Point2f vertices[4];
    rRect.points(vertices);
    for (int i = 0; i < 4; i++)
        line(image, vertices[i], vertices[(i+1)%4], Scalar(0,255,0));

    Rect brect = rRect.boundingRect();
    rectangle(image, brect, Scalar(255,0,0));

    imshow("rectangles", image);
    waitKey(0);
@endcode
![image](pics/rotatedrect.png)

@sa CamShift, fitEllipse, minAreaRect, CvBox2D
*/

interface RotatedRectStatic{
    //! various constructors
    new (): RotatedRect;
    /**
    @param center The rectangle mass center.
    @param size Width and height of the rectangle.
    @param angle The rotation angle in a clockwise direction. When the angle is 0, 90, 180, 270 etc.,
    the rectangle becomes an up-right rectangle.
    */
    new (center: Point2f, size: Size2f, angle : _st.float): RotatedRect;
    /**
    Any 3 end points of the RotatedRect. They must be given in order (either clockwise or
    anticlockwise).
     */
    new (point1: Point2f, point2: Point2f, point3: Point2f): RotatedRect;
}

export interface RotatedRect
{

    /** returns 4 vertices of the rectangle
    @param pts The points array for storing rectangle vertices.
    */
    points(pts : Array<Point2f>) : void;
    //! returns the minimal up-right rectangle containing the rotated rectangle
    boundingRect(): Rect;

    center: Point2f; //< the rectangle mass center
    size: Size2f ;    //< width and height of the rectangle
    angle: _st.float ;    //< the rotation angle. When the angle is 0, 90, 180, 270 etc., the rectangle becomes an up-right rectangle.
};

export var RotatedRect: RotatedRectStatic = alvision_module.RotatedRect;

//template <> class DataType<RotatedRect>
//{
//    public:
//    typedef RotatedRect  value_type;
//    typedef value_type   work_type;
//    typedef float        channel_type;

//    enum { generic_type = 0,
//    depth = DataType<channel_type>::depth,
//        channels = (int)sizeof(value_type) / sizeof(channel_type), // 5
//        fmt = DataType<channel_type>::fmt + ((channels - 1) << 8),
//            type = CV_MAKETYPE(depth, channels)
//         };

//typedef Vec< channel_type, channels > vec_type;
//};



//////////////////////////////// Range /////////////////////////////////

/** @brief Template class specifying a continuous subsequence (slice) of a sequence.

The class is used to specify a row or a column span in a matrix ( Mat ) and for many other purposes.
Range(a,b) is basically the same as a:b in Matlab or a..b in Python. As in Python, start is an
inclusive left boundary of the range and end is an exclusive right boundary of the range. Such a
half-opened interval is usually denoted as \f$[start,end)\f$ .

The static method Range::all() returns a special variable that means "the whole sequence" or "the
whole range", just like " : " in Matlab or " ... " in Python. All the methods and functions in
OpenCV that take Range support this special Range::all() value. But, of course, in case of your own
custom processing, you will probably have to check and handle it explicitly:
@code
    void my_function(..., const Range& r, ....)
    {
        if(r == Range::all()) {
            // process all the data
        }
        else {
            // process [r.start, r.end)
        }
    }
@endcode
*/

interface RangeStatic {
    new(): Range;
    new (_start: _st.int, _end: _st.int ): Range;
    all() : Range;
}

export interface Range
{
    //public:
   
    size() : _st.int;
    empty(): boolean;
    
    start: _st.int;
    end: _st.int;
};

export var Range: RangeStatic = alvision_module.Range;

//template <> class DataType<Range>
//{
//    public:
//    typedef Range      value_type;
//    typedef value_type work_type;
//    typedef int        channel_type;

//    enum { generic_type = 0,
//    depth = DataType<channel_type>::depth,
//        channels = 2,
//        fmt = DataType<channel_type>::fmt + ((channels - 1) << 8),
//            type = CV_MAKETYPE(depth, channels)
//         };

//typedef Vec< channel_type, channels > vec_type;
//};



//////////////////////////////// Scalar_ ///////////////////////////////

/** @brief Template class for a 4-element vector derived from Vec.

Being derived from Vec\<_Tp, 4\> , Scalar_ and Scalar can be used just as typical 4-element
vectors. In addition, they can be converted to/from CvScalar . The type Scalar is widely used in
OpenCV to pass pixel values.
*/

export interface Scalar_Static<T> {
    new (): Scalar_<T>;
    new (v0: T, v1: T, v2?: T /*= 0*/, v3?: T /*= 0*/): Scalar_<T>;
    new (v0: T): Scalar_<T>;
    new (v: _matx.Vec<T>): Scalar_<T>;

        //! returns a scalar with all elements set to v0
    all(v0: T): Scalar_<T>;


    //template < typename _Tp> static inline
//Scalar_<_Tp>& operator += (Scalar_<_Tp>& a, const Scalar_<_Tp>& b)
//    {
//        a.val[0] += b.val[0];
//a.val[1] += b.val[1];
//a.val[2] += b.val[2];
//a.val[3] += b.val[3];
//return a;
//}

//template < typename _Tp> static inline
//Scalar_<_Tp>& operator -= (Scalar_<_Tp>& a, const Scalar_<_Tp>& b)
//    {
//        a.val[0] -= b.val[0];
//a.val[1] -= b.val[1];
//a.val[2] -= b.val[2];
//a.val[3] -= b.val[3];
//return a;
//}

//template < typename _Tp> static inline
//Scalar_<_Tp>& operator *= (Scalar_<_Tp>& a, _Tp v )
//{
//    a.val[0] *= v;
//    a.val[1] *= v;
//    a.val[2] *= v;
//    a.val[3] *= v;
//    return a;
//}

//template< typename _Tp> static inline
//bool operator == ( const Scalar_<_Tp>& a, const Scalar_<_Tp>& b )
//    {
//        return a.val[0] == b.val[0] && a.val[1] == b.val[1] &&
//        a.val[2] == b.val[2] && a.val[3] == b.val[3];
//}
    op_Equals(a: Scalar_<T>, b: Scalar_<T>): boolean;

//template < typename _Tp> static inline
//bool operator != ( const Scalar_<_Tp>& a, const Scalar_<_Tp>& b )
//    {
//        return a.val[0] != b.val[0] || a.val[1] != b.val[1] ||
//        a.val[2] != b.val[2] || a.val[3] != b.val[3];
//}
    op_NotEquals(a: Scalar_<T>, b: Scalar_<T>): boolean;

//template < typename _Tp> static inline
//Scalar_ < _Tp > operator + (const Scalar_<_Tp>& a, const Scalar_<_Tp>& b)
//    {
//        return Scalar_<_Tp>(a.val[0] + b.val[0],
//            a.val[1] + b.val[1],
//            a.val[2] + b.val[2],
//            a.val[3] + b.val[3]);
//}
    op_Addition(a: Scalar_<T>, b: Scalar_<T>): Scalar_<T>;

//template < typename _Tp> static inline
//Scalar_ < _Tp > operator - (const Scalar_<_Tp>& a, const Scalar_<_Tp>& b)
//    {
//        return Scalar_<_Tp>(saturate_cast<_Tp>(a.val[0] - b.val[0]),
//            saturate_cast<_Tp>(a.val[1] - b.val[1]),
//            saturate_cast<_Tp>(a.val[2] - b.val[2]),
//            saturate_cast<_Tp>(a.val[3] - b.val[3]));
//}
    op_Substraction(a: Scalar_<T>, b: Scalar_<T>): Scalar_<T>;

//template < typename _Tp> static inline
//Scalar_ < _Tp > operator * (const Scalar_<_Tp>& a, _Tp alpha)
//    {
//        return Scalar_<_Tp>(a.val[0] * alpha,
//            a.val[1] * alpha,
//            a.val[2] * alpha,
//            a.val[3] * alpha);
//}
    op_Multiplication(a: Scalar_<T> | _matx.Matx<T>, b: Scalar_<T> | T): Scalar_<T>;

//template < typename _Tp> static inline
//Scalar_ < _Tp > operator * (_Tp alpha, const Scalar_<_Tp>& a)
//    {
//        return a*alpha;
//}

//template < typename _Tp> static inline
//Scalar_ < _Tp > operator - (const Scalar_<_Tp>& a)
//    {
//        return Scalar_<_Tp>(saturate_cast<_Tp>(-a.val[0]),
//            saturate_cast<_Tp>(-a.val[1]),
//            saturate_cast<_Tp>(-a.val[2]),
//            saturate_cast<_Tp>(-a.val[3]));
//}
    op_Substraction(a: Scalar_<T>): Scalar_<T>;


//template < typename _Tp> static inline
//Scalar_ < _Tp > operator * (const Scalar_<_Tp>& a, const Scalar_<_Tp>& b)
//    {
//        return Scalar_<_Tp>(saturate_cast<_Tp>(a[0] * b[0] - a[1] * b[1] - a[2] * b[2] - a[3] * b[3]),
//            saturate_cast<_Tp>(a[0] * b[1] + a[1] * b[0] + a[2] * b[3] - a[3] * b[2]),
//            saturate_cast<_Tp>(a[0] * b[2] - a[1] * b[3] + a[2] * b[0] + a[3] * b[1]),
//            saturate_cast<_Tp>(a[0] * b[3] + a[1] * b[2] - a[2] * b[1] + a[3] * b[0]));
//}

//template < typename _Tp> static inline
//Scalar_<_Tp>& operator *= (Scalar_<_Tp>& a, const Scalar_<_Tp>& b)
//    {
//        a = a * b;
//return a;
//}

//template < typename _Tp> static inline
//Scalar_ < _Tp > operator / (const Scalar_<_Tp>& a, _Tp alpha)
//    {
//        return Scalar_<_Tp>(a.val[0] / alpha,
//            a.val[1] / alpha,
//            a.val[2] / alpha,
//            a.val[3] / alpha);
//}
    op_Division(a: Scalar_<T> | T, b: Scalar_<T> | T | _st.float | _st.double): Scalar_<T>;

//template < typename _Tp> static inline
//Scalar_ < float > operator / (const Scalar_<float>& a, float alpha)
//    {
//        float s = 1 / alpha;
//return Scalar_<float>(a.val[0] * s, a.val[1] * s, a.val[2] * s, a.val[3] * s);
//}

//template < typename _Tp> static inline
//Scalar_ < double > operator / (const Scalar_<double>& a, double alpha)
//    {
//        double s = 1 / alpha;
//return Scalar_<double>(a.val[0] * s, a.val[1] * s, a.val[2] * s, a.val[3] * s);
//}

//template < typename _Tp> static inline
//Scalar_<_Tp>& operator /= (Scalar_<_Tp>& a, _Tp alpha)
//{
//        a = a / alpha;
//        return a;
//    }

//template< typename _Tp> static inline
//Scalar_< _Tp > operator / (_Tp a, const Scalar_<_Tp>& b)
//    {
//        _Tp s = a / (b[0] * b[0] + b[1] * b[1] + b[2] * b[2] + b[3] * b[3]);
//return b.conj() * s;
//}

//template < typename _Tp> static inline
//Scalar_ < _Tp > operator / (const Scalar_<_Tp>& a, const Scalar_<_Tp>& b)
//    {
//        return a * ((_Tp)1 / b);
//    }

//template < typename _Tp> static inline
//Scalar_<_Tp>& operator /= (Scalar_<_Tp>& a, const Scalar_<_Tp>& b)
//{
//        a = a / b;
//        return a;
//    }

//template< typename _Tp> static inline
//Scalar operator * (const Matx<_Tp, 4, 4 >& a, const Scalar& b)
//    {
//        Matx<double, 4, 1> c((Matx < double, 4, 4 >)a, b, Matx_MatMulOp());
//return reinterpret_cast <const Scalar&>(c);
//}

//template <> inline
//Scalar operator * (const Matx<double, 4, 4 >& a, const Scalar& b)
//    {
//        Matx<double, 4, 1> c(a, b, Matx_MatMulOp());
//return reinterpret_cast <const Scalar&>(c);
//}


}

//template < typename _Tp> class Scalar_ : public Vec < _Tp, 4 >
export interface Scalar_<T> extends _matx.Vec<T>
    {
        //public:
        //! various constructors
        

            //! conversion to another data type
            //template<typename T2> operator Scalar_<T2>() const;

            //! per-element product
            //Scalar_<_Tp>mul(const Scalar_<_Tp>& a, double scale= 1) const;

            // returns (v0, -v1, -v2, -v3)
            //Scalar_<_Tp>conj() const;

            // returns true iff v1 == v2 == v3 == 0
            //bool isReal() const;
};

export interface Scalar extends Scalar_<_st.double> { }
export var Scalar: Scalar_Static<_st.double> = alvision_module.Scalar;


//typedef Scalar_< double > Scalar;

//template < typename _Tp> class DataType<Scalar_<_Tp > >
//    {
//        public:
//        typedef Scalar_<_Tp>                               value_type;
//        typedef Scalar_< typename DataType<_Tp>::work_type> work_type;
//        typedef _Tp                                        channel_type;

//        enum { generic_type = 0,
//            depth        = DataType<channel_type>::depth,
//                channels = 4,
//                fmt = DataType<channel_type>::fmt + ((channels - 1) << 8),
//                    type = CV_MAKETYPE(depth, channels)
//         };

//        typedef Vec< channel_type, channels> vec_type;
//    };



/////////////////////////////// KeyPoint ////////////////////////////////

/** @brief Data structure for salient point detectors.

The class instance stores a keypoint, i.e. a point feature found by one of many available keypoint
detectors, such as Harris corner detector, cv::FAST, cv::StarDetector, cv::SURF, cv::SIFT,
cv::LDetector etc.

The keypoint is characterized by the 2D position, scale (proportional to the diameter of the
neighborhood that needs to be taken into account), orientation and some other parameters. The
keypoint neighborhood is then analyzed by another algorithm that builds a descriptor (usually
represented as a feature vector). The keypoints representing the same object in different images
can then be matched using cv::KDTree or another method.
*/

export interface KeyPointStatic {
    //public:
    //! the default constructor
    new (): KeyPoint;
/**
@param _pt x & y coordinates of the keypoint
@param _size keypoint diameter
@param _angle keypoint orientation
@param _response keypoint detector response on the keypoint (that is, strength of the keypoint)
@param _octave pyramid octave in which the keypoint has been detected
@param _class_id object id
 */
    new (_pt: Point2f, _size: _st.float, _angle?: _st.float /*= -1*/, _response?: _st.float  /*= 0*/, _octave?: _st.int /*= 0*/, _class_id?: _st.int /*= -1*/): KeyPoint;
/**
@param x x-coordinate of the keypoint
@param y y-coordinate of the keypoint
@param _size keypoint diameter
@param _angle keypoint orientation
@param _response keypoint detector response on the keypoint (that is, strength of the keypoint)
@param _octave pyramid octave in which the keypoint has been detected
@param _class_id object id
 */
    new (x: _st.float, y: _st.float, _size: _st.float, _angle?: _st.float /*= -1*/, _response?: _st.float  /*= 0*/, _octave?: _st.int  /*= 0*/, _class_id?: _st.int /*= -1*/): KeyPoint;

      /**
    This method converts vector of keypoints to vector of points or the reverse, where each keypoint is
    assigned the same size and the same orientation.

    @param keypoints Keypoints obtained from any feature detection algorithm like SIFT/SURF/ORB
    @param points2f Array of (x,y) coordinates of each keypoint
    @param keypointIndexes Array of indexes of keypoints to be converted to points. (Acts like a mask to
    convert only specified keypoints)
    */
    convert(keypoints: Array<KeyPoint>,
        cb: (points2f: Array<Point2f> )=>void,
        keypointIndexes?: Array<_st.int>/* =Array<int>()*/) : void;
    /** @overload
    @param points2f Array of (x,y) coordinates of each keypoint
    @param keypoints Keypoints obtained from any feature detection algorithm like SIFT/SURF/ORB
    @param size keypoint diameter
    @param response keypoint detector response on the keypoint (that is, strength of the keypoint)
    @param octave pyramid octave in which the keypoint has been detected
    @param class_id object id
    */
    convert(points2f: Array<Point2f> ,
        cb: (keypoints: Array<KeyPoint> )=>void,
        size?: _st.float /*= 1*/, response?: _st.float /*= 1*/, octave?: _st.int /*= 0*/, class_id?: _st.int /*= -1*/) : void;

    /** 
        c++ structure size of
    */
    sizeof(): _st.int;
}

//class CV_EXPORTS_W_SIMPLE KeyPoint
export interface KeyPoint
{
    

    //size_t hash() const;

  
    /**
    This method computes overlap for pair of keypoints. Overlap is the ratio between area of keypoint
    regions' intersection and area of keypoint regions' union (considering keypoint region as circle).
    If they don't overlap, we get zero. If they coincide at same location with same size, we get 1.
    @param kp1 First keypoint
    @param kp2 Second keypoint
    */
    //CV_WRAP static float overlap(const KeyPoint& kp1, const KeyPoint& kp2);

    pt: Point2f; //!< coordinates of the keypoints
    size: _st.float; //!< diameter of the meaningful keypoint neighborhood
    angle : _st.float; //!< computed orientation of the keypoint (-1 if not applicable);
    ////!< it's in [0,360) degrees and measured relative to
    ////!< image coordinate system, ie in clockwise.
    response: _st.float ; //!< the response by which the most strong keypoints have been selected. Can be used for the further sorting or subsampling
    octave: _st.int ; //!< octave (pyramid layer) from which the keypoint has been extracted
    class_id: _st.int ; //!< object class (if the keypoints need to be clustered by an object they belong to)
};

export var KeyPoint: KeyPointStatic = alvision_module.KeyPoint;

//template <> class DataType<KeyPoint>
//{
//    public:
//    typedef KeyPoint      value_type;
//    typedef float         work_type;
//    typedef float         channel_type;

//    enum { generic_type = 0,
//    depth = DataType<channel_type>::depth,
//        channels = (int)(sizeof(value_type) / sizeof(channel_type)), // 7
//        fmt = DataType<channel_type>::fmt + ((channels - 1) << 8),
//            type = CV_MAKETYPE(depth, channels)
//         };

//typedef Vec< channel_type, channels > vec_type;
//};



//////////////////////////////// DMatch /////////////////////////////////

/** @brief Class for matching keypoint descriptors

query descriptor index, train descriptor index, train image index, and distance between
descriptors.
*/

export interface DMatchStatic {
//    public:
    new (): DMatch;
    new (_queryIdx: _st.int, _trainIdx: _st.int, _distance: _st.float ): DMatch;
    new (_queryIdx: _st.int, _trainIdx: _st.int, _imgIdx: _st.int, _distance: _st.float ): DMatch;
}

//class CV_EXPORTS_W_SIMPLE DMatch
export interface DMatch
{
    

    queryIdx: _st.int ; // query descriptor index
    trainIdx: _st.int ; // train descriptor index
    imgIdx: _st.int ;   // train image index

    distance: _st.float;

    //// less is better
    ////bool operator< (const DMatch &m) const;
};

export var DMatch: DMatchStatic = alvision_module.DMatch;

//template <> class DataType<DMatch>
//{
//    public:
//    typedef DMatch      value_type;
//    typedef int         work_type;
//    typedef int         channel_type;

//    enum { generic_type = 0,
//    depth = DataType<channel_type>::depth,
//        channels = (int)(sizeof(value_type) / sizeof(channel_type)), // 4
//        fmt = DataType<channel_type>::fmt + ((channels - 1) << 8),
//            type = CV_MAKETYPE(depth, channels)
//         };

//typedef Vec< channel_type, channels > vec_type;
//};



///////////////////////////// TermCriteria //////////////////////////////

/** @brief The class defining termination criteria for iterative algorithms.

You can initialize it by default constructor and then override any parameters, or the structure may
be fully initialized using the advanced variant of the constructor.
*/

    //public:
    /**
      Criteria type, can be one of: COUNT, EPS or COUNT + EPS
    */
    export enum TermCriteriaType {
        COUNT = 1, //!< the maximum number of iterations or elements to compute
        MAX_ITER = COUNT, //!< ditto
        EPS = 2 //!< the desired accuracy or change in parameters at which the iterative algorithm stops
    };


export interface TermCriteriaStatic {
    //! default constructor
    //TermCriteria();
    /**
    @param type The type of termination criteria, one of TermCriteria::Type
    @param maxCount The maximum number of iterations or elements to compute.
    @param epsilon The desired accuracy or change in parameters at which the iterative algorithm stops.
    */
    new (type: TermCriteriaType, maxCount: _st.int, epsilon: _st.double ): TermCriteria;
}

//class CV_EXPORTS TermCriteria
export interface TermCriteria
{

    

    //int type; //!< the type of termination criteria: COUNT, EPS or COUNT + EPS
    //int maxCount; // the maximum number of iterations/elements
    //double epsilon; // the desired accuracy
};

export var TermCriteria: TermCriteriaStatic = alvision_module.TermCriteria;


//! @} core_basic

///////////////////////// raster image moments //////////////////////////

//! @addtogroup imgproc_shape
//! @{

/** @brief struct returned by cv::moments

The spatial moments \f$\texttt{Moments::m}_{ji}\f$ are computed as:

\f[\texttt{m} _{ji}= \sum _{x,y}  \left ( \texttt{array} (x,y)  \cdot x^j  \cdot y^i \right )\f]

The central moments \f$\texttt{Moments::mu}_{ji}\f$ are computed as:

\f[\texttt{mu} _{ji}= \sum _{x,y}  \left ( \texttt{array} (x,y)  \cdot (x -  \bar{x} )^j  \cdot (y -  \bar{y} )^i \right )\f]

where \f$(\bar{x}, \bar{y})\f$ is the mass center:

\f[\bar{x} = \frac{\texttt{m}_{10}}{\texttt{m}_{00}} , \; \bar{y} = \frac{\texttt{m}_{01}}{\texttt{m}_{00}}\f]

The normalized central moments \f$\texttt{Moments::nu}_{ij}\f$ are computed as:

\f[\texttt{nu} _{ji}= \frac{\texttt{mu}_{ji}}{\texttt{m}_{00}^{(i+j)/2+1}} .\f]

@note
\f$\texttt{mu}_{00}=\texttt{m}_{00}\f$, \f$\texttt{nu}_{00}=1\f$
\f$\texttt{nu}_{10}=\texttt{mu}_{10}=\texttt{mu}_{01}=\texttt{mu}_{10}=0\f$ , hence the values are not
stored.

The moments of a contour are defined in the same way but computed using the Green's formula (see
<http://en.wikipedia.org/wiki/Green_theorem>). So, due to a limited raster resolution, the moments
computed for a contour are slightly different from the moments computed for the same rasterized
contour.

@note
Since the contour moments are computed using Green formula, you may get seemingly odd results for
contours with self-intersections, e.g. a zero area (m00) for butterfly-shaped contours.
 */

export interface MomentsStatic {
    //public:
    //! the default constructor
    new (): Moments;
    //! the full constructor
    new (m00: _st.double, m10: _st.double, m01: _st.double, m20: _st.double, m11: _st.double ,
        m02: _st.double, m30: _st.double, m21: _st.double, m12: _st.double, m03: _st.double): Moments;

        ////! the conversion from CvMoments
    //Moments( const CvMoments& moments );
    ////! the conversion to CvMoments
    //operator CvMoments() const;

}
//class CV_EXPORTS_W_MAP Moments
export interface Moments
{
    //! @name spatial moments
    //! @{
    //CV_PROP_RW double  m00, m10, m01, m20, m11, m02, m30, m21, m12, m03;
    m00: _st.double, m10: _st.double, m01: _st.double, m20: _st.double, m11: _st.double, m02: _st.double, m30: _st.double, m21: _st.double, m12: _st.double, m03: _st.double;

    //! @}

    //! @name central moments
    //! @{
    //CV_PROP_RW double  mu20, mu11, mu02, mu30, mu21, mu12, mu03;
    mu20: _st.double, mu11: _st.double, mu02: _st.double, mu30: _st.double, mu21: _st.double, mu12: _st.double, mu03: _st.double;
    //! @}

    //! @name central normalized moments
    //! @{
    //CV_PROP_RW double  nu20, nu11, nu02, nu30, nu21, nu12, nu03;
    nu20: _st.double, nu11: _st.double, nu02: _st.double, nu30: _st.double, nu21: _st.double, nu12: _st.double, nu03: _st.double;
    //! @}
};

export var Moments: MomentsStatic = alvision_module.Moments;

//template <> class DataType<Moments>
//{
//    public:
//    typedef Moments     value_type;
//    typedef double      work_type;
//    typedef double      channel_type;

//    enum { generic_type = 0,
//    depth = DataType<channel_type>::depth,
//        channels = (int)(sizeof(value_type) / sizeof(channel_type)), // 24
//        fmt = DataType<channel_type>::fmt + ((channels - 1) << 8),
//            type = CV_MAKETYPE(depth, channels)
//         };

//typedef Vec< channel_type, channels > vec_type;
//};

//! @} imgproc_shape

//! @cond IGNORED

/////////////////////////////////////////////////////////////////////////
///////////////////////////// Implementation ////////////////////////////
/////////////////////////////////////////////////////////////////////////

//////////////////////////////// Complex ////////////////////////////////

//template < typename _Tp> inline
//Complex<_Tp>::Complex()
//    : re(0), im(0) {}

//template< typename _Tp> inline
//Complex<_Tp>::Complex(_Tp _re, _Tp _im )
//    : re(_re), im(_im) {}

//template< typename _Tp> template < typename T2> inline
//Complex<_Tp>::operator Complex<T2>() const
//    {
//        return Complex<T2>(saturate_cast<T2>(re), saturate_cast<T2>(im));
//}

//template < typename _Tp> inline
//Complex < _Tp > Complex<_Tp>::conj() const
//    {
//        return Complex<_Tp>(re, -im);
//}


//template < typename _Tp> static inline
//bool operator == (const Complex<_Tp>& a, const Complex<_Tp>& b)
//    {
//        return a.re == b.re && a.im == b.im;
//}

//template < typename _Tp> static inline
//bool operator != (const Complex<_Tp>& a, const Complex<_Tp>& b)
//    {
//        return a.re != b.re || a.im != b.im;
//}

//template < typename _Tp> static inline
//Complex < _Tp > operator + (const Complex<_Tp>& a, const Complex<_Tp>& b)
//    {
//        return Complex<_Tp>(a.re + b.re, a.im + b.im);
//}

//template < typename _Tp> static inline
//Complex<_Tp>& operator += (Complex<_Tp>& a, const Complex<_Tp>& b)
//    {
//        a.re += b.re; a.im += b.im;
//return a;
//}

//template < typename _Tp> static inline
//Complex < _Tp > operator - (const Complex<_Tp>& a, const Complex<_Tp>& b)
//    {
//        return Complex<_Tp>(a.re - b.re, a.im - b.im);
//}

//template < typename _Tp> static inline
//Complex<_Tp>& operator -= (Complex<_Tp>& a, const Complex<_Tp>& b)
//    {
//        a.re -= b.re; a.im -= b.im;
//return a;
//}

//template < typename _Tp> static inline
//Complex < _Tp > operator - (const Complex<_Tp>& a)
//    {
//        return Complex<_Tp>(-a.re, -a.im);
//}

//template < typename _Tp> static inline
//Complex < _Tp > operator * (const Complex<_Tp>& a, const Complex<_Tp>& b)
//    {
//        return Complex<_Tp>(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
//}

//template < typename _Tp> static inline
//Complex < _Tp > operator * (const Complex<_Tp>& a, _Tp b)
//    {
//        return Complex<_Tp>(a.re * b, a.im * b);
//}

//template < typename _Tp> static inline
//Complex < _Tp > operator * (_Tp b, const Complex<_Tp>& a)
//    {
//        return Complex<_Tp>(a.re * b, a.im * b);
//}

//template < typename _Tp> static inline
//Complex < _Tp > operator + (const Complex<_Tp>& a, _Tp b)
//    {
//        return Complex<_Tp>(a.re + b, a.im);
//}

//template < typename _Tp> static inline
//Complex < _Tp > operator - (const Complex<_Tp>& a, _Tp b)
//    { return Complex<_Tp>(a.re - b, a.im); }

//template < typename _Tp> static inline
//Complex < _Tp > operator + (_Tp b, const Complex<_Tp>& a)
//    {
//        return Complex<_Tp>(a.re + b, a.im);
//}

//template < typename _Tp> static inline
//Complex < _Tp > operator - (_Tp b, const Complex<_Tp>& a)
//    {
//        return Complex<_Tp>(b - a.re, -a.im);
//}

//template < typename _Tp> static inline
//Complex<_Tp>& operator += (Complex<_Tp>& a, _Tp b)
//{
//    a.re += b; return a;
//}

//template< typename _Tp> static inline
//Complex<_Tp>& operator -= (Complex<_Tp>& a, _Tp b)
//{
//        a.re -= b; return a;
//    }

//template< typename _Tp> static inline
//Complex<_Tp>& operator *= (Complex<_Tp>& a, _Tp b)
//{
//            a.re *= b; a.im *= b; return a;
//        }

//template< typename _Tp> static inline
//double abs(const Complex<_Tp>& a)
//    {
//        return std::sqrt( (double)a.re*a.re + (double)a.im*a.im);
//}

//template < typename _Tp> static inline
//Complex < _Tp > operator / (const Complex<_Tp>& a, const Complex<_Tp>& b)
//    {
//        double t = 1. / ((double)b.re*b.re + (double)b.im*b.im);
//return Complex<_Tp>((_Tp)((a.re * b.re + a.im * b.im) * t),
//    (_Tp)((-a.re * b.im + a.im * b.re) * t));
//}

//template < typename _Tp> static inline
//Complex<_Tp>& operator /= (Complex<_Tp>& a, const Complex<_Tp>& b)
//{
//        return(a = a / b);
//    }

//template< typename _Tp> static inline
//Complex< _Tp > operator / (const Complex<_Tp>& a, _Tp b)
//    {
//        _Tp t = (_Tp)1/b;
//    return Complex<_Tp>(a.re * t, a.im * t);
//}

//template < typename _Tp> static inline
//Complex < _Tp > operator / (_Tp b, const Complex<_Tp>& a)
//    {
//        return Complex<_Tp>(b) / a;
//}

//template < typename _Tp> static inline
//Complex < _Tp > operator /= (const Complex<_Tp>& a, _Tp b)
//{
//    _Tp t = (_Tp)1/ b;
//    a.re *= t; a.im *= t; return a;
//}



//////////////////////////////// 2D Point ///////////////////////////////

//template < typename _Tp> inline
//Point_<_Tp>::Point_()
//    : x(0), y(0) {}

//template< typename _Tp> inline
//Point_<_Tp>::Point_(_Tp _x, _Tp _y)
//    : x(_x), y(_y) {}

//template< typename _Tp> inline
//Point_<_Tp>::Point_(const Point_& pt)
//    : x(pt.x), y(pt.y) {}

//template < typename _Tp> inline
//Point_<_Tp>::Point_(const Size_<_Tp>& sz)
//    : x(sz.width), y(sz.height) {}

//template < typename _Tp> inline
//Point_<_Tp>::Point_(const Vec<_Tp,2>& v)
//    : x(v[0]), y(v[1]) {}

//template < typename _Tp> inline
//Point_<_Tp>& Point_<_Tp>::operator = (const Point_& pt)
//    {
//        x = pt.x; y = pt.y;
//return *this;
//}

//template < typename _Tp> template < typename _Tp2> inline
//Point_<_Tp>::operator Point_<_Tp2>() const
//    {
//        return Point_<_Tp2>(saturate_cast<_Tp2>(x), saturate_cast<_Tp2>(y));
//}

//template < typename _Tp> inline
//Point_<_Tp>::operator Vec< _Tp, 2 > () const
//    {
//        return Vec<_Tp, 2>(x, y);
//}

//template < typename _Tp> inline
//_Tp Point_<_Tp>::dot(const Point_& pt) const
//    {
//        return saturate_cast<_Tp>(x * pt.x + y * pt.y);
//}

//template < typename _Tp> inline
//double Point_<_Tp>::ddot(const Point_& pt) const
//    {
//        return (double)x*pt.x + (double)y*pt.y;
//}

//template < typename _Tp> inline
//double Point_<_Tp>::cross(const Point_& pt) const
//    {
//        return (double)x*pt.y - (double)y*pt.x;
//}

//template < typename _Tp> inline bool
//Point_<_Tp>::inside( const Rect_<_Tp>& r ) const
//    {
//        return r.contains(*this);
//}


//template < typename _Tp> static inline
//Point_<_Tp>& operator += (Point_<_Tp>& a, const Point_<_Tp>& b)
//    {
//        a.x += b.x;
//a.y += b.y;
//return a;
//}

//template < typename _Tp> static inline
//Point_<_Tp>& operator -= (Point_<_Tp>& a, const Point_<_Tp>& b)
//    {
//        a.x -= b.x;
//a.y -= b.y;
//return a;
//}

//template < typename _Tp> static inline
//Point_<_Tp>& operator *= (Point_<_Tp>& a, int b)
//{
//    a.x = saturate_cast<_Tp>(a.x * b);
//    a.y = saturate_cast<_Tp>(a.y * b);
//    return a;
//}

//template< typename _Tp> static inline
//Point_<_Tp>& operator *= (Point_<_Tp>& a, float b)
//{
//        a.x = saturate_cast<_Tp>(a.x * b);
//        a.y = saturate_cast<_Tp>(a.y * b);
//        return a;
//    }

//template< typename _Tp> static inline
//Point_<_Tp>& operator *= (Point_<_Tp>& a, double b)
//{
//            a.x = saturate_cast<_Tp>(a.x * b);
//            a.y = saturate_cast<_Tp>(a.y * b);
//            return a;
//        }

//template< typename _Tp> static inline
//Point_<_Tp>& operator /= (Point_<_Tp>& a, int b)
//{
//                    a.x = saturate_cast<_Tp>(a.x / b);
//                    a.y = saturate_cast<_Tp>(a.y / b);
//                    return a;
//                }

//template< typename _Tp> static inline
//Point_<_Tp>& operator /= (Point_<_Tp>& a, float b)
//{
//                        a.x = saturate_cast<_Tp>(a.x / b);
//                        a.y = saturate_cast<_Tp>(a.y / b);
//                        return a;
//                    }

//template< typename _Tp> static inline
//Point_<_Tp>& operator /= (Point_<_Tp>& a, double b)
//{
//                            a.x = saturate_cast<_Tp>(a.x / b);
//                            a.y = saturate_cast<_Tp>(a.y / b);
//                            return a;
//                        }












////////////////////////////////// Rect /////////////////////////////////

//template < typename _Tp> inline
//Rect_<_Tp>::Rect_()
//    : x(0), y(0), width(0), height(0) {}

//template< typename _Tp> inline
//Rect_<_Tp>::Rect_(_Tp _x, _Tp _y, _Tp _width, _Tp _height)
//    : x(_x), y(_y), width(_width), height(_height) {}

//template< typename _Tp> inline
//Rect_<_Tp>::Rect_(const Rect_<_Tp>& r)
//    : x(r.x), y(r.y), width(r.width), height(r.height) {}

//template < typename _Tp> inline
//Rect_<_Tp>::Rect_(const Point_<_Tp>& org, const Size_<_Tp>& sz)
//    : x(org.x), y(org.y), width(sz.width), height(sz.height) {}

//template < typename _Tp> inline
//Rect_<_Tp>::Rect_(const Point_<_Tp>& pt1, const Point_<_Tp>& pt2)
//    {
//        x = std::min(pt1.x, pt2.x);
//y = std::min(pt1.y, pt2.y);
//width = std::max(pt1.x, pt2.x) - x;
//height = std::max(pt1.y, pt2.y) - y;
//}

//template < typename _Tp> inline
//Rect_<_Tp>& Rect_<_Tp>::operator = ( const Rect_<_Tp>& r )
//    {
//        x = r.x;
//y = r.y;
//width = r.width;
//height = r.height;
//return *this;
//}

//template < typename _Tp> inline
//Point_ < _Tp > Rect_<_Tp>::tl() const
//    {
//        return Point_<_Tp>(x, y);
//}

//template < typename _Tp> inline
//Point_ < _Tp > Rect_<_Tp>::br() const
//    {
//        return Point_<_Tp>(x + width, y + height);
//}

//template < typename _Tp> inline
//Size_ < _Tp > Rect_<_Tp>::size() const
//    {
//        return Size_<_Tp>(width, height);
//}

//template < typename _Tp> inline
//_Tp Rect_<_Tp>::area() const
//    {
//        return width * height;
//}

//template < typename _Tp> template < typename _Tp2> inline
//Rect_<_Tp>::operator Rect_<_Tp2>() const
//    {
//        return Rect_<_Tp2>(saturate_cast<_Tp2>(x), saturate_cast<_Tp2>(y), saturate_cast<_Tp2>(width), saturate_cast<_Tp2>(height));
//}

//template < typename _Tp> inline
//bool Rect_<_Tp>::contains(const Point_<_Tp>& pt) const
//    {
//        return x <= pt.x && pt.x < x + width && y <= pt.y && pt.y < y + height;
//}


//template < typename _Tp> static inline
//Rect_<_Tp>& operator += (Rect_<_Tp>& a, const Point_<_Tp>& b )
//    {
//        a.x += b.x;
//a.y += b.y;
//return a;
//}

//template < typename _Tp> static inline
//Rect_<_Tp>& operator -= (Rect_<_Tp>& a, const Point_<_Tp>& b )
//    {
//        a.x -= b.x;
//a.y -= b.y;
//return a;
//}

//template < typename _Tp> static inline
//Rect_<_Tp>& operator += (Rect_<_Tp>& a, const Size_<_Tp>& b )
//    {
//        a.width += b.width;
//a.height += b.height;
//return a;
//}

//template < typename _Tp> static inline
//Rect_<_Tp>& operator -= (Rect_<_Tp>& a, const Size_<_Tp>& b )
//    {
//        a.width -= b.width;
//a.height -= b.height;
//return a;
//}

//template < typename _Tp> static inline
//Rect_<_Tp>& operator &= (Rect_<_Tp>& a, const Rect_<_Tp>& b )
//    {
//        _Tp x1 = std::max(a.x, b.x);
//_Tp y1 = std::max(a.y, b.y);
//a.width = std::min(a.x + a.width, b.x + b.width) - x1;
//a.height = std::min(a.y + a.height, b.y + b.height) - y1;
//a.x = x1;
//a.y = y1;
//if (a.width <= 0 || a.height <= 0)
//    a = Rect();
//return a;
//}

//template < typename _Tp> static inline
//Rect_<_Tp>& operator |= (Rect_<_Tp>& a, const Rect_<_Tp>& b )
//    {
//        _Tp x1 = std::min(a.x, b.x);
//_Tp y1 = std::min(a.y, b.y);
//a.width = std::max(a.x + a.width, b.x + b.width) - x1;
//a.height = std::max(a.y + a.height, b.y + b.height) - y1;
//a.x = x1;
//a.y = y1;
//return a;
//}

//template < typename _Tp> static inline
//bool operator == (const Rect_<_Tp>& a, const Rect_<_Tp>& b)
//    {
//        return a.x == b.x && a.y == b.y && a.width == b.width && a.height == b.height;
//}

//template < typename _Tp> static inline
//bool operator != (const Rect_<_Tp>& a, const Rect_<_Tp>& b)
//    {
//        return a.x != b.x || a.y != b.y || a.width != b.width || a.height != b.height;
//}

//template < typename _Tp> static inline
//Rect_ < _Tp > operator + (const Rect_<_Tp>& a, const Point_<_Tp>& b)
//    {
//        return Rect_<_Tp>(a.x + b.x, a.y + b.y, a.width, a.height);
//}

//template < typename _Tp> static inline
//Rect_ < _Tp > operator - (const Rect_<_Tp>& a, const Point_<_Tp>& b)
//    {
//        return Rect_<_Tp>(a.x - b.x, a.y - b.y, a.width, a.height);
//}

//template < typename _Tp> static inline
//Rect_ < _Tp > operator + (const Rect_<_Tp>& a, const Size_<_Tp>& b)
//    {
//        return Rect_<_Tp>(a.x, a.y, a.width + b.width, a.height + b.height);
//}

//template < typename _Tp> static inline
//Rect_ < _Tp > operator & (const Rect_<_Tp>& a, const Rect_<_Tp>& b)
//    {
//        Rect_<_Tp>c = a;
//return c &= b;
//}

//template < typename _Tp> static inline
//Rect_ < _Tp > operator | (const Rect_<_Tp>& a, const Rect_<_Tp>& b)
//    {
//        Rect_<_Tp>c = a;
//return c |= b;
//}



//////////////////////////////// RotatedRect //////////////////////////////

//inline
//RotatedRect::RotatedRect()
//    : center(), size(), angle(0) {}

//inline
//RotatedRect::RotatedRect(const Point2f& _center, const Size2f& _size, float _angle)
//    : center(_center), size(_size), angle(_angle) {}



/////////////////////////////////// Range /////////////////////////////////

//inline
//Range::Range()
//    : start(0), end(0) {}

//inline
//Range::Range(int _start, int _end)
//    : start(_start), end(_end) {}

//inline
//int Range::size() const
//    {
//        return end - start;
//}

//inline
//bool Range::empty() const
//    {
//        return start == end;
//}

//inline
//Range Range::all()
//{
//    return Range(INT_MIN, INT_MAX);
//}


//static inline
//bool operator == (const Range& r1, const Range& r2)
//    {
//        return r1.start == r2.start && r1.end == r2.end;
//}

//static inline
//bool operator != (const Range& r1, const Range& r2)
//    {
//        return !(r1 == r2);
//}

//static inline
//bool operator !(const Range& r)
//    {
//        return r.start == r.end;
//}

//static inline
//Range operator & (const Range& r1, const Range& r2)
//    {
//        Range r(std::max(r1.start, r2.start), std::min(r1.end, r2.end));
//r.end = std::max(r.end, r.start);
//return r;
//}

//static inline
//Range & operator &= (Range& r1, const Range& r2)
//{
//    r1 = r1 & r2;
//    return r1;
//}

//static inline
//Range operator + (const Range& r1, int delta)
//    {
//        return Range(r1.start + delta, r1.end + delta);
//}

//static inline
//Range operator + (int delta, const Range& r1)
//    {
//        return Range(r1.start + delta, r1.end + delta);
//}

//static inline
//Range operator - (const Range& r1, int delta)
//    {
//        return r1 + (-delta);
//}



/////////////////////////////////// Scalar ////////////////////////////////

//template < typename _Tp> inline
//Scalar_<_Tp>::Scalar_()
//{
//        this->val[0] = this->val[1] = this->val[2] = this->val[3] = 0;
//    }

//template< typename _Tp> inline
//Scalar_<_Tp>::Scalar_(_Tp v0, _Tp v1, _Tp v2, _Tp v3)
//{
//            this->val[0] = v0;
//            this->val[1] = v1;
//            this->val[2] = v2;
//            this->val[3] = v3;
//        }

//template< typename _Tp> template < typename _Tp2, int cn> inline
//Scalar_<_Tp>::Scalar_(const Vec<_Tp2, cn>& v)
//    {
//        int i;
//for (i = 0; i < (cn < 4 ? cn : 4); i++)
//    this ->val[i] = cv::saturate_cast<_Tp>(v.val[i]);
//for (; i < 4; i++)
//    this ->val[i] = 0;
//}

//template < typename _Tp> inline
//Scalar_<_Tp>::Scalar_(_Tp v0)
//{
//        this->val[0] = v0;
//        this->val[1] = this->val[2] = this->val[3] = 0;
//    }

//template< typename _Tp> inline
//Scalar_< _Tp > Scalar_<_Tp>::all(_Tp v0)
//{
//            return Scalar_<_Tp>(v0, v0, v0, v0);
//        }


//template< typename _Tp> inline
//Scalar_< _Tp > Scalar_<_Tp>::mul(const Scalar_<_Tp>& a, double scale ) const
//    {
//        return Scalar_<_Tp>(saturate_cast<_Tp>(this ->val[0] * a.val[0] * scale),
//            saturate_cast<_Tp>(this ->val[1] * a.val[1] * scale),
//            saturate_cast<_Tp>(this ->val[2] * a.val[2] * scale),
//            saturate_cast<_Tp>(this ->val[3] * a.val[3] * scale));
//}

//template < typename _Tp> inline
//Scalar_ < _Tp > Scalar_<_Tp>::conj() const
//    {
//        return Scalar_<_Tp>(saturate_cast<_Tp>(this ->val[0]),
//            saturate_cast<_Tp>(-this ->val[1]),
//            saturate_cast<_Tp>(-this ->val[2]),
//            saturate_cast<_Tp>(-this ->val[3]));
//}

//template < typename _Tp> inline
//bool Scalar_<_Tp>::isReal() const
//    {
//        return this->val[1] == 0 && this ->val[2] == 0 && this ->val[3] == 0;
//}


//template < typename _Tp> template < typename T2> inline
//Scalar_<_Tp>::operator Scalar_<T2>() const
//    {
//        return Scalar_<T2>(saturate_cast<T2>(this ->val[0]),
//            saturate_cast<T2>(this ->val[1]),
//            saturate_cast<T2>(this ->val[2]),
//            saturate_cast<T2>(this ->val[3]));
//}




////////////////////////////////// KeyPoint ///////////////////////////////

//inline
//KeyPoint::KeyPoint()
//    : pt(0, 0), size(0), angle(-1), response(0), octave(0), class_id(-1) {}

//inline
//KeyPoint::KeyPoint(Point2f _pt, float _size, float _angle, float _response, int _octave, int _class_id)
//    : pt(_pt), size(_size), angle(_angle), response(_response), octave(_octave), class_id(_class_id) {}

//inline
//KeyPoint::KeyPoint(float x, float y, float _size, float _angle, float _response, int _octave, int _class_id)
//    : pt(x, y), size(_size), angle(_angle), response(_response), octave(_octave), class_id(_class_id) {}



/////////////////////////////////// DMatch ////////////////////////////////

//inline
//DMatch::DMatch()
//    : queryIdx(-1), trainIdx(-1), imgIdx(-1), distance(FLT_MAX) {}

//inline
//DMatch::DMatch(int _queryIdx, int _trainIdx, float _distance)
//    : queryIdx(_queryIdx), trainIdx(_trainIdx), imgIdx(-1), distance(_distance) {}

//inline
//DMatch::DMatch(int _queryIdx, int _trainIdx, int _imgIdx, float _distance)
//    : queryIdx(_queryIdx), trainIdx(_trainIdx), imgIdx(_imgIdx), distance(_distance) {}

//inline
//bool DMatch::operator < (const DMatch &m) const
//    {
//        return distance < m.distance;
//}



//////////////////////////////// TermCriteria /////////////////////////////

//inline
//TermCriteria::TermCriteria()
//    : type(0), maxCount(0), epsilon(0) {}

//inline
//TermCriteria::TermCriteria(int _type, int _maxCount, double _epsilon)
//    : type(_type), maxCount(_maxCount), epsilon(_epsilon) {}

//! @endcond

//} // cv

//#endif //__OPENCV_CORE_TYPES_HPP__


/** @brief Shape matching methods

\f$A\f$ denotes object1,\f$B\f$ denotes object2

\f$\begin{array}{l} m^A_i =  \mathrm{sign} (h^A_i)  \cdot \log{h^A_i} \\ m^B_i =  \mathrm{sign} (h^B_i)  \cdot \log{h^B_i} \end{array}\f$

and \f$h^A_i, h^B_i\f$ are the Hu moments of \f$A\f$ and \f$B\f$ , respectively.
*/
export enum ShapeMatchModes {
    CV_CONTOURS_MATCH_I1 = 1, //!< \f[I_1(A,B) =  \sum _{i=1...7}  \left |  \frac{1}{m^A_i} -  \frac{1}{m^B_i} \right |\f]
    CV_CONTOURS_MATCH_I2 = 2, //!< \f[I_2(A,B) =  \sum _{i=1...7}  \left | m^A_i - m^B_i  \right |\f]
    CV_CONTOURS_MATCH_I3 = 3  //!< \f[I_3(A,B) =  \max _{i=1...7}  \frac{ \left| m^A_i - m^B_i \right| }{ \left| m^A_i \right| }\f]
};


//export interface CvPoint2D64f {
//    x: _st.double;
//    y: _st.double;
//}


//export interface CvPoint3D64f {
//    x: _st.double;
//    y: _st.double;
//    z: _st.double;
//}

//export interface CvPoint3D32f {
//    x: _st.float;
//    y: _st.float;
//    z: _st.float;

//    //#ifdef __cplusplus
//    //CvPoint3D32f(float _x = 0, float _y = 0, float _z = 0): x(_x), y(_y), z(_z) {}
//    //template < typename _Tp>
//    //    CvPoint3D32f(const cv::Point3_<_Tp>& pt): x((float)pt.x), y((float)pt.y), z((float)pt.z) {}
//    //template < typename _Tp>
//    //    operator cv::Point3_<_Tp>() const { return cv::Point3_<_Tp>(cv::saturate_cast<_Tp>(x), cv::saturate_cast<_Tp>(y), cv::saturate_cast<_Tp>(z)); }
//    //#endif
//}


//export interface CvPoint2D32f {
//    x: _st.float;
//    y: _st.float;

//    //    #ifdef __cplusplus
//    //    CvPoint2D32f(float _x = 0, float _y = 0): x(_x), y(_y) {}
//    //    template < typename _Tp>
//    //        CvPoint2D32f(const cv::Point_<_Tp>& pt): x((float)pt.x), y((float)pt.y) {}
//    //    template < typename _Tp>
//    //        operator cv::Point_<_Tp>() const { return cv::Point_<_Tp>(cv::saturate_cast<_Tp>(x), cv::saturate_cast<_Tp>(y)); }
//    //#endif
//}


