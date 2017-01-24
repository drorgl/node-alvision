#ifndef _ALVISION_MATEXPR_H_
#define _ALVISION_MATEXPR_H_
//#include "OpenCV.h"
#include "../alvision.h"
#include "IOArray.h"

class MatExpr : public IOArray {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	std::shared_ptr<cv::MatExpr> _matExpr;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor(); 

	virtual cv::_InputArray GetInputArray();
	virtual cv::_InputArray GetInputArrayOfArrays();
	virtual cv::_OutputArray GetOutputArray();
	virtual cv::_OutputArray GetOutputArrayOfArrays();
	virtual cv::_InputOutputArray GetInputOutputArray();
	virtual cv::_InputOutputArray GetInputOutputArrayOfArrays();


	//constructors
	//new () : MatExpr;
	static POLY_METHOD(New);
	//new (m: Mat) : MatExpr;
	static POLY_METHOD(New_mat);

	//new (_op: MatOp, _flags : _st.int, _a ? : Mat, _b ? : Mat) : MatExpr;
	static POLY_METHOD(New_matop_int_mat_mat);

	//MatExpr(const MatOp* _op, int _flags, const Mat& _a = Mat(), const Mat& _b = Mat(),

	//static

	//op_Addition(a: Mat | _types.Scalar | MatExpr | _st.double | _st.float | _st.int, b : Mat | _types.Scalar | MatExpr | _st.double | _st.float | _st.int) : MatExpr;
	static POLY_METHOD(op_Addition_static_mat_mat);
	static POLY_METHOD(op_Addition_static_mat_scalar);
	static POLY_METHOD(op_Addition_static_mat_double);
	static POLY_METHOD(op_Addition_static_mat_matexpr);
	static POLY_METHOD(op_Addition_static_matexpr_mat);
	static POLY_METHOD(op_Addition_static_matexpr_scalar);
	static POLY_METHOD(op_Addition_static_matexpr_matexpr);
	static POLY_METHOD(op_Addition_static_matexpr_double);
	static POLY_METHOD(op_Addition_static_scalar_matexpr);
	static POLY_METHOD(op_Addition_static_scalar_mat);
	static POLY_METHOD(op_Addition_static_double_mat);
	static POLY_METHOD(op_Addition_static_double_matexpr);



	//op_Substraction(a: Mat | _types.Scalar | MatExpr | _st.double | _st.float | _st.int, b ? : Mat | _types.Scalar | MatExpr | _st.double | _st.float | _st.int) : MatExpr;
	static POLY_METHOD(op_Substraction_static_mat_mat);
	static POLY_METHOD(op_Substraction_static_mat_scalar);
	static POLY_METHOD(op_Substraction_static_mat_double);
	static POLY_METHOD(op_Substraction_static_mat_matexpr);
	static POLY_METHOD(op_Substraction_static_matexpr_mat);
	static POLY_METHOD(op_Substraction_static_matexpr_scalar);
	static POLY_METHOD(op_Substraction_static_matexpr_matexpr);
	static POLY_METHOD(op_Substraction_static_matexpr_double);
	static POLY_METHOD(op_Substraction_static_scalar_matexpr);
	static POLY_METHOD(op_Substraction_static_scalar_mat);
	static POLY_METHOD(op_Substraction_static_double_mat);
	static POLY_METHOD(op_Substraction_static_double_matexpr);

	static POLY_METHOD(op_Substraction_static_mat);
	static POLY_METHOD(op_Substraction_static_matexpr);


	//op_Multiplication(a: Mat | _types.Scalar | MatExpr | _st.double | _st.float | _st.int, b : Mat | _types.Scalar | MatExpr | _st.double | _st.float | _st.int) : MatExpr;
	static POLY_METHOD(op_Multiplication_static_mat_mat);
	static POLY_METHOD(op_Multiplication_static_mat_scalar);
	static POLY_METHOD(op_Multiplication_static_mat_double);
	static POLY_METHOD(op_Multiplication_static_mat_matexpr);
	static POLY_METHOD(op_Multiplication_static_matexpr_mat);
	static POLY_METHOD(op_Multiplication_static_matexpr_scalar);
	static POLY_METHOD(op_Multiplication_static_matexpr_matexpr);
	static POLY_METHOD(op_Multiplication_static_matexpr_double);
	static POLY_METHOD(op_Multiplication_static_scalar_matexpr);
	static POLY_METHOD(op_Multiplication_static_scalar_mat);
	static POLY_METHOD(op_Multiplication_static_double_mat);
	static POLY_METHOD(op_Multiplication_static_double_matexpr);


	//op_Division(a: Mat | _types.Scalar | MatExpr | _st.double | _st.float | _st.int, b : Mat | _types.Scalar | MatExpr | _st.double | _st.float | _st.int) : MatExpr;
	static POLY_METHOD(op_Division_static_mat_mat);
	static POLY_METHOD(op_Division_static_mat_scalar);
	static POLY_METHOD(op_Division_static_mat_double);
	static POLY_METHOD(op_Division_static_mat_matexpr);
	static POLY_METHOD(op_Division_static_matexpr_mat);
	static POLY_METHOD(op_Division_static_matexpr_scalar);
	static POLY_METHOD(op_Division_static_matexpr_matexpr);
	static POLY_METHOD(op_Division_static_matexpr_double);
	static POLY_METHOD(op_Division_static_scalar_matexpr);
	static POLY_METHOD(op_Division_static_scalar_mat);
	static POLY_METHOD(op_Division_static_double_mat);
	static POLY_METHOD(op_Division_static_double_matexpr);


	//op_LessThan(a: Mat, b : Mat) : MatExpr;
	static POLY_METHOD(op_LessThan_static_mat_mat);
	//op_LessThan(a: Mat, s : _st.double) : MatExpr;
	static POLY_METHOD(op_LessThan_static_mat_double);
	//op_LessThan(s: _st.double, a : Mat) : MatExpr;
	static POLY_METHOD(op_LessThan_static_double_mat);

	//op_LessThenOrEqual(a: Mat, b : Mat) : MatExpr;
	static POLY_METHOD(op_LessThenOrEqual_static_mat_mat);
	//op_LessThenOrEqual(a: Mat, s : _st.double) : MatExpr;
	static POLY_METHOD(op_LessThenOrEqual_static_mat_double);
	//op_LessThenOrEqual(s: _st.double, a : Mat) : MatExpr;
	static POLY_METHOD(op_LessThenOrEqual_static_double_mat);

	//op_Equals(a: Mat, b : Mat) : MatExpr;
	static POLY_METHOD(op_Equals_static_mat_mat);
	//op_Equals(a: Mat, s : _st.double) : MatExpr;
	static POLY_METHOD(op_Equals_static_mat_double);
	//op_Equals(s: _st.double, a : Mat) : MatExpr;
	static POLY_METHOD(op_Equals_static_double_mat);

	//op_NotEquals(a: Mat, b : Mat) : MatExpr;
	static POLY_METHOD(op_NotEquals_static_mat_mat);
	//op_NotEquals(a: Mat, s : _st.double) : MatExpr;
	static POLY_METHOD(op_NotEquals_static_mat_double);
	//op_NotEquals(s: _st.double, a : Mat) : MatExpr;
	static POLY_METHOD(op_NotEquals_static_double_mat);

	//op_GreaterThanOrEqual(a: Mat, b : Mat) : MatExpr;
	static POLY_METHOD(op_GreaterThanOrEqual_static_mat_mat);
	//op_GreaterThanOrEqual(a: Mat, s : _st.double) : MatExpr;
	static POLY_METHOD(op_GreaterThanOrEqual_static_mat_double);
	//op_GreaterThanOrEqual(s: _st.double, a : Mat) : MatExpr;
	static POLY_METHOD(op_GreaterThanOrEqual_static_double_mat);


	//op_GreaterThan(a: Mat | MatExpr | _st.double, b : Mat | MatExpr | _st.double) : MatExpr;
	static POLY_METHOD(op_GreaterThan_static_mat_mat);
	static POLY_METHOD(op_GreaterThan_static_mat_double);
	static POLY_METHOD(op_GreaterThan_static_double_mat);

	//op_And(a: Mat | MatExpr | _types.Scalar, b : Mat | MatExpr | _types.Scalar) : MatExpr;
	static POLY_METHOD(op_And_static_mat_mat);
	static POLY_METHOD(op_And_static_mat_scalar);
	static POLY_METHOD(op_And_static_scalar_mat);

	//op_Or(a: Mat | MatExpr | _types.Scalar, b : Mat | MatExpr | _types.Scalar) : MatExpr;
	static POLY_METHOD(op_Or_static_mat_mat);
	static POLY_METHOD(op_Or_static_mat_scalar);
	static POLY_METHOD(op_Or_static_scalar_mat);

	//op_Xor(a: Mat | MatExpr | _types.Scalar, b : Mat | MatExpr | _types.Scalar) : MatExpr;
	static POLY_METHOD(op_Xor_static_mat_mat);
	static POLY_METHOD(op_Xor_static_mat_scalar);
	static POLY_METHOD(op_Xor_static_scalar_mat);


	//op_BinaryNot(m: Mat) : MatExpr;
	static POLY_METHOD(op_BinaryNot_static_mat);


	//min(a: Mat | MatExpr | _types.Scalar | _st.double, b : Mat | MatExpr | _types.Scalar | _st.double) : MatExpr;
	static POLY_METHOD(min_static_mat_mat);
	static POLY_METHOD(min_static_mat_double);
	static POLY_METHOD(min_static_double_mat);


	//max(a: Mat | MatExpr | _types.Scalar | _st.double, b : Mat | MatExpr | _types.Scalar | _st.double) : MatExpr;
	static POLY_METHOD(max_static_mat_mat);
	static POLY_METHOD(max_static_mat_double);
	static POLY_METHOD(max_static_double_mat);


	//abs(m: Mat) : MatExpr;
	//abs(e: MatExpr) : MatExpr;

	static POLY_METHOD(abs_static_mat);
	static POLY_METHOD(abs_static_matexpr);


	//instance


	//    const Mat& _c = Mat(), double _alpha = 1, double _beta = 1, const Scalar& _s = Scalar());

	//    operator Mat() const;
	//    template < typename _Tp> operator Mat_<_Tp>() const;

	//size() :  _types.Size;
	//type(): _st.int;

	//    MatExpr row(int y) const;
	//    MatExpr col(int x) const;
	//    MatExpr diag(int d = 0) const;
	//    MatExpr operator()( const Range& rowRange, const Range& colRange ) const;
	//    MatExpr operator()( const Rect& roi ) const;

	//    MatExpr t() const;



	//inv(method ? : _base.DecompTypes | _st.int /*= DECOMP_LU*/) : MatExpr;
	static POLY_METHOD(inv_int);



	//    MatExpr mul(e : MatExpr, double scale= 1) const;
	//    MatExpr mul(m : Mat, double scale= 1) const;

	//    Mat cross(m : Mat) const;
	//    double dot(m : Mat) const;

	//    const MatOp* op;
	//    int flags;

	//    Mat a, b, c;
	//    double alpha, beta;
	//    Scalar s;




	//toMat() : Mat;
	static POLY_METHOD(toMat);

	//op_Addition(other: Mat | MatExpr | _types.Scalar | _st.double) : MatExpr;
	static POLY_METHOD(op_Addition_mat);
	static POLY_METHOD(op_Addition_matexpr);
	static POLY_METHOD(op_Addition_scalar);

	//op_Substraction(other: Mat | MatExpr | _types.Scalar | _st.double) : MatExpr;
	static POLY_METHOD(op_Substraction_mat);
	static POLY_METHOD(op_Substraction_matexpr);
	static POLY_METHOD(op_Substraction_scalar);

	//op_Multiplication(other: Mat | MatExpr | _types.Scalar | _st.double) : MatExpr;
	static POLY_METHOD(op_Multiplication_mat);
	static POLY_METHOD(op_Multiplication_matexpr);
	static POLY_METHOD(op_Multiplication_scalar);

	//op_Division(other: Mat | MatExpr | _types.Scalar | _st.double) : MatExpr;
	static POLY_METHOD(op_Division_mat);
	static POLY_METHOD(op_Division_matexpr);
	static POLY_METHOD(op_Division_scalar);

	//op_And(other: Mat | MatExpr | _types.Scalar | _st.double) : MatExpr;
	static POLY_METHOD(op_And_mat);
	static POLY_METHOD(op_And_matexpr);
	static POLY_METHOD(op_And_scalar);

	//op_Or(other: Mat | MatExpr | _types.Scalar | _st.double) : MatExpr;
	static POLY_METHOD(op_Or_mat);
	static POLY_METHOD(op_Or_matexpr);
	static POLY_METHOD(op_Or_scalar);

	//op_Xor(other: Mat | MatExpr | _types.Scalar | _st.double) : MatExpr;
	static POLY_METHOD(op_Xor_mat);
	static POLY_METHOD(op_Xor_matexpr);
	static POLY_METHOD(op_Xor_scalar);

	//op_BinaryNot() : MatExpr;
	static POLY_METHOD(op_BinaryNot);


};

#endif