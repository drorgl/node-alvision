#ifndef _ALVISION_MATX_AND_VEC_H_
#define _ALVISION_MATX_AND_VEC_H_
#include "../alvision.h"

#include <typeinfo>
#include <class_typename.h>
#include "IOArray.h"
#include "array_accessors/Matx_array_accessor.h"

template <typename T>
class Vec;


template <typename T>
class Matx : public overres::ObjectWrap{
public:
	typedef typename T::value_type TVT;
	enum {
		TCOLS = T::cols
	};

	static void Register(Handle<Object> target, std::string name, std::shared_ptr<overload_resolution> overload);
	static void Init(Handle<Object> target, std::string name, std::shared_ptr<overload_resolution> overload);

	std::shared_ptr<T> _matx;

	static std::string Matx<T>::name;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	virtual cv::_InputArray GetInputArray();
	virtual cv::_InputArray GetInputArrayOfArrays();
	virtual cv::_OutputArray GetOutputArray();
	virtual cv::_OutputArray GetOutputArrayOfArrays();
	virtual cv::_InputOutputArray GetInputOutputArray();
	virtual cv::_InputOutputArray GetInputOutputArrayOfArrays();

	static POLY_METHOD(New_no_params);


	static POLY_METHOD(New_v0);

	static POLY_METHOD(New_v0_v1);

	static POLY_METHOD(New_v0_v1_v2);

	static POLY_METHOD(New_v0_v1_v2_v3);

	static POLY_METHOD(New_v0_v1_v2_v3_v4);

	static POLY_METHOD(New_v0_v1_v2_v3_v4_v5);

	static POLY_METHOD(New_v0_v1_v2_v3_v4_v5_v6);

	static POLY_METHOD(New_v0_v1_v2_v3_v4_v5_v6_v7);

	static POLY_METHOD(New_v0_v1_v2_v3_v4_v5_v6_v7_v8);

	static POLY_METHOD(New_v0_v1_v2_v3_v4_v5_v6_v7_v8_v9);

	static POLY_METHOD(New_v0_v1_v2_v3_v4_v5_v6_v7_v8_v9_v10_v11);

	static POLY_METHOD(New_v0_v1_v2_v3_v4_v5_v6_v7_v8_v9_v10_v11_v12_v13);

	static POLY_METHOD(New_v0_v1_v2_v3_v4_v5_v6_v7_v8_v9_v10_v11_v12_v13_v14_v15);

	static POLY_METHOD(New_vals);


	static POLY_METHOD(all);

	static POLY_METHOD(zeros);

	static POLY_METHOD(ones);

	static POLY_METHOD(eye);

	static POLY_METHOD(randu);

	static POLY_METHOD(randn);

	static POLY_METHOD(op_Addition_matx_matx);

	static POLY_METHOD(op_Substraction_matx_matx);

	static POLY_METHOD(op_Multiplication_matx_number);

	static POLY_METHOD(op_Multiplication_number_matx);

	static POLY_METHOD(op_Substraction_matx_negative);


	static POLY_METHOD(op_Multiplication_matx_matx);


	static POLY_METHOD(op_Equals_matx_matx);

	static POLY_METHOD(op_NotEquals_matx_matx);

	static POLY_METHOD(norm_matx);

	static NAN_GETTER(depth_getter);


	static POLY_METHOD(rows);

	static POLY_METHOD(cols);

	static NAN_GETTER(channels_getter);


	static POLY_METHOD(type);

	static POLY_METHOD(dot_matx);

	static POLY_METHOD(ddot_matx);


	static POLY_METHOD(inv_method);

	static NAN_GETTER(val_getter);

	static POLY_METHOD(op_addition_matx);

	static POLY_METHOD(op_addition_double);

	static POLY_METHOD(op_Substraction_matx);

	static POLY_METHOD(op_Substraction_double);


	static POLY_METHOD(op_Multiplication_matx);

	static POLY_METHOD(op_Multiplication_double);

	static POLY_METHOD(mul_matx);


};




template <typename T>
class Vec : public Matx<T> {
public:
	typedef typename T CVT;
	typedef typename Vec<T> VecT;
	typedef typename T::value_type TVT;
	typedef typename T::mat_type mat_type;

	static void Register(Handle<Object> target, std::string name, std::shared_ptr<overload_resolution> overload);
	static void Init(Handle<Object> target, std::string name, std::shared_ptr<overload_resolution> overload);

	std::shared_ptr<T> _vec;

	//static std::string VecT::name;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	static VecT* from(T &vec_) {
		auto vec = new VecT();
		vec->_vec = std::make_shared<T>(vec_);
		vec->_matx = vec->_vec;
		return vec;
	}

	static std::shared_ptr<VecT> all(TVT value);

	virtual cv::_InputArray GetInputArray();
	virtual cv::_InputArray GetInputArrayOfArrays();
	virtual cv::_OutputArray GetOutputArray();
	virtual cv::_OutputArray GetOutputArrayOfArrays();
	virtual cv::_InputOutputArray GetInputOutputArray();
	virtual cv::_InputOutputArray GetInputOutputArrayOfArrays();


	static POLY_METHOD(New_no_parameters);


	static POLY_METHOD(New_v0);
	static POLY_METHOD(New_v0_v1);
	static POLY_METHOD(New_v0_v1_v2);
	static POLY_METHOD(New_v0_v1_v2_v3);
	static POLY_METHOD(New_v0_v1_v2_v3_v4);
	static POLY_METHOD(New_v0_v1_v2_v3_v4_v5);
	static POLY_METHOD(New_v0_v1_v2_v3_v4_v5_v6);
	static POLY_METHOD(New_v0_v1_v2_v3_v4_v5_v6_v7);
	static POLY_METHOD(New_v0_v1_v2_v3_v4_v5_v6_v7_v8);
	static POLY_METHOD(New_v0_v1_v2_v3_v4_v5_v6_v7_v8_v9);
	static POLY_METHOD(New_v0_v1_v2_v3_v4_v5_v6_v7_v8_v9_v10_v11_v12_v13);
	static POLY_METHOD(New_values);
	static POLY_METHOD(New_vec);
	static POLY_METHOD(all_T);
	static POLY_METHOD(mul_vec);
	static POLY_METHOD(conj);

	static POLY_METHOD(cross_vec);

	//static POLY_METHOD(ptr) {
	//	auto this_ = info.This<VecT*>();

	//	auto tptr = new TrackedPtr<VecT>();
	//	tptr->_from = std::make_shared<Vec_array_accessor<T>>(this_->_vec, info.at<std::string>(0), info.at<int>(1), info.at<int>(2), info.at<int>(3));
	//	info.SetReturnValue(tptr);
	//}
	static POLY_METHOD(at);
	static POLY_METHOD(op_Addition_vec_vec);
	static POLY_METHOD(op_Addition_num_vec);
	static POLY_METHOD(op_Addition_vec_num);


	/*static POLY_METHOD(op_Multiplication_vec_vec) {
	auto vec = new VecT();
	vec->_vec = std::make_shared<T>((*info.at<VecT*>(0)->_vec) * (*info.at<VecT*>(0)->_vec));
	info.SetReturnValue(vec);
	}
	static POLY_METHOD(op_Multiplication_num_vec) {
	auto vec = new VecT();
	vec->_vec = std::make_shared<T>((info.at<double>(0)) * (*info.at<VecT*>(0)->_vec));
	info.SetReturnValue(vec);
	}*/
	static POLY_METHOD(op_Multiplication_vec_num);


	/*static POLY_METHOD(op_Division_vec_vec) {
	auto vec = new VecT();
	vec->_vec = std::make_shared<T>((*info.at<VecT*>(0)->_vec) / (*info.at<VecT*>(0)->_vec));
	info.SetReturnValue(vec);
	}*/
	/*static POLY_METHOD(op_Division_num_vec) {
	auto vec = new VecT();
	vec->_vec = std::make_shared<T>(T::all(info.at<double>(0)) / (*info.at<VecT*>(0)->_vec));
	info.SetReturnValue(vec);
	}*/
	static POLY_METHOD(op_Division_vec_num);
	static POLY_METHOD(op_Substraction_vec_vec);
	static POLY_METHOD(op_Substraction_num_vec);
	static POLY_METHOD(op_Substraction_vec_num);
	static POLY_METHOD(norm_vec);

	static POLY_METHOD(op_Multiplication_matx_vec);

	static NAN_GETTER(data_getter);

};


#endif