////// <reference path="Matrix.ts" />
var alvision_module = require('../../lib/bindings.js');

import * as constants from './Constants'
import * as _vec from './Vec'
import * as _size from './Size'

export interface Point3<T> {
    vec(): _vec.Vec<T>;
    dot(): T;
    ddot(): constants.double;
    cross(): Point3<T>;

    x: T;
    y: T;
    z: T;
}

export interface Point3Static<T> {
    new (): Point3<T>;
    new (_x : T,_y : T, _z : T) : Point3<T>
    new (pt: Point3<T>): Point3<T>;
    new (v: _vec.Vec<T>): Point3<T>;
}

export interface Point3f extends Point3<constants.float> { }
export var Point3f: Point3Static<constants.float> = alvision_module.Point3f;


export interface Point_<T> {

}

export interface Point_Static<T> {
    new (): Point_<T>;
    new (x: T, y: T): Point_<T>;
    new (sz: _size.Size_<T>): Point_<T>;
    new (v: _vec.Vec<T>): Point_<T>;
}

export interface Point2i extends Point_<constants.int> { }
export interface Point2f extends Point_<constants.float> { }
export interface Point2d extends Point_<constants.double> { }
export interface Point extends Point2i { }

export var Point2i: Point_Static<constants.int> = alvision_module.Point2i;
export var Point2f: Point_Static<constants.float> = alvision_module.Point2f;
export var Point2d: Point_Static<constants.double> = alvision_module.Point2d;
export var Point: Point_Static<constants.int> = alvision_module.Point;

//typedef Point_< int > Point2i;
//typedef Point_< float > Point2f;
//typedef Point_< double > Point2d;
//typedef Point2i Point;

//template < typename _Tp> class Point_ {
//    public:
//    typedef _Tp value_type;

//    // various constructors
//    Point_();
//    Point_(_Tp _x, _Tp _y);
//    Point_(const Point_& pt);
//    Point_(const Size_<_Tp>& sz);
//        Point_(const Vec< _Tp, 2>& v);

//    Point_& operator = (const Point_& pt);
////! conversion to another data type
//template < typename _Tp2> operator Point_<_Tp2>() const;

////! conversion to the old-style C structures
//operator Vec< _Tp, 2 > () const;

////! dot product
//_Tp dot(const Point_& pt) const;
////! dot product computed in double-precision arithmetics
//double ddot(const Point_& pt) const;
////! cross-product
//double cross(const Point_& pt) const;
////! checks whether the point is inside the specified rectangle
//bool inside(const Rect_<_Tp>& r) const;

//_Tp x, y; //< the point coordinates
//};



//typedef Point_< int > Point2i;
//typedef Point_< float > Point2f;
//typedef Point_< double > Point2d;
//typedef Point2i Point;