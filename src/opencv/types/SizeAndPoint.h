#ifndef _ALVISION_SIZE_AND_POINT_H_
#define _ALVISION_SIZE_AND_POINT_H_

#include "../../alvision.h"
#include "Rect.h"
#include "../Vec.h"

template <typename T>
class Point_;


template <typename T>
class Size_ : public or ::ObjectWrap{
public:
	typedef typename T::value_type TVT;
	typedef typename Point_<cv::Point_<TVT>> PointT;


	static std::string name;

	static void Register(Handle<Object> target, std::string name, std::shared_ptr<overload_resolution> overload);
	static void Init(Handle<Object> target, std::string name, std::shared_ptr<overload_resolution> overload);

	std::shared_ptr<T> _size;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	template<typename... Args>
	static std::shared_ptr<Size_<T>> create(Args&&... args) {
		auto val = std::make_shared<Size_<T>>();
		val->_size = std::shared_ptr<T>(new T(std::forward<Args>(args)...));
		return val;
	}

	static std::shared_ptr<Size_<T>> Empty();

	static POLY_METHOD(New);

	static POLY_METHOD(New_width_height);

	static POLY_METHOD(New_size);

	static POLY_METHOD(New_point);

	static POLY_METHOD(op_Multiplication);

	static POLY_METHOD(op_Division);

	static POLY_METHOD(op_Addition);

	static POLY_METHOD(op_Substraction);

	static POLY_METHOD(area);

	static NAN_GETTER(width_getter);

	static NAN_SETTER(width_setter);


	static NAN_GETTER(height_getter);
	static NAN_SETTER(height_setter);

};



template <typename T>
class Point_ : public or ::ObjectWrap{
public:
	typedef typename T CVT;
	typedef typename T::value_type value_type;
	typedef typename Size_<cv::Size_<value_type>> SizeT;
	typedef typename Vec<cv::Vec<value_type, 2>> VecT;
	typedef typename Matx<cv::Matx<value_type, 2, 2>> MatxT;
	typedef typename Rect_<cv::Rect_<value_type>> RectT;

	static std::string Point_<T>::name;
	static void Register(Handle<Object> target, std::string name, std::shared_ptr<overload_resolution> overload);
	static void Init(Handle<Object> target, std::string name, std::shared_ptr<overload_resolution> overload);

	std::shared_ptr<T> _point;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();


	template<typename... Args>
	static std::shared_ptr<Point_<T>> create(Args&&... args) {
		auto val = std::make_shared<Point_<T>>();
		val->_point = std::shared_ptr<T>(new T(std::forward<Args>(args)...));
		return val;
	}

	static Point_<T>* from(T point) {
		auto pt = new Point_<T>();
		pt->_point = std::make_shared<T>(std::move(point));
		return pt;
	}

	static POLY_METHOD(New);

	static POLY_METHOD(New_x_y);

	static POLY_METHOD(New_size);

	static POLY_METHOD(New_vec);

	static POLY_METHOD(New_buf);


	static POLY_METHOD(norm);
	static POLY_METHOD(op_Equals);
	static POLY_METHOD(op_NotEquals);
	static POLY_METHOD(op_Addition);
	static POLY_METHOD(op_Substraction);
	static POLY_METHOD(op_Substraction_a);
	static POLY_METHOD(op_Multiplication_t_number);
	static POLY_METHOD(op_Multiplication_number_t);
	static POLY_METHOD(op_Multiplication_vec_point);
	static POLY_METHOD(op_Division);
	static POLY_METHOD(dot);
	static POLY_METHOD(ddot);
	static POLY_METHOD(cross);
	static POLY_METHOD(inside);

	static NAN_GETTER(x_getter);
	static NAN_SETTER(x_setter);
	static NAN_GETTER(y_getter);
	static NAN_SETTER(y_setter);


	static POLY_METHOD(op_Equals_other);
	static POLY_METHOD(op_NotEquals_other);
	static POLY_METHOD(op_Addition_other);
	static POLY_METHOD(op_Substraction_other);
	static POLY_METHOD(op_Multiplication_other_number);
	static POLY_METHOD(op_Multiplication_other_matx);
	static POLY_METHOD(op_Division_other_number);
	static POLY_METHOD(toBuffer);
	static POLY_METHOD(setTo);


};

#endif