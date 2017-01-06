#include "MatExpr.h"
#include "Scalar.h"
#include "Matrix.h"

namespace matexpr_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("matexpr_general_callback is empty");
		}
		return overload->execute("matexpr", info);
	}
}

Nan::Persistent<FunctionTemplate> MatExpr::constructor;


void
MatExpr::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	matexpr_general_callback::overload = overload;

	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(matexpr_general_callback::callback);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("MatExpr").ToLocalChecked());

	overload->register_type<MatExpr>(ctor, "matexpr", "MatExpr");



	//constructors
	//new () : MatExpr{ }
	overload->addOverloadConstructor("matexpr", "MatExpr", {}, MatExpr::New);
	//new (m: Mat) : MatExpr{ }
	overload->addOverloadConstructor("matexpr", "MatExpr", { make_param("m","Mat") }, MatExpr::New_mat);

	//new(const MatOp* _op, int _flags, const Mat& _a = Mat(), const Mat& _b = Mat(),
	//	const Mat& _c = Mat(), double _alpha = 1, double _beta = 1, const Scalar& _s = Scalar());
	overload->addOverloadConstructor("matexpr", "MatExpr", { make_param("_op","MatOp"), make_param<int>("_flags","int"), make_param<Matrix*>("_a","Mat",Nan::Null()),make_param<Matrix*>("_b","Mat",Nan::Null()),
		make_param<Matrix*>("_c","Mat",Nan::Null()),make_param<double>("_alpha","double",1), make_param<double>("_beta","double",1), make_param<Scalar*>("_s","Scalar",Nan::Null()) }, MatExpr::New_matop_int_mat_mat);

	//new (_op: MatOp, _flags : _st.int, _a ? : Mat, _b ? : Mat) : MatExpr{ }


	//MatExpr(const MatOp* _op, int _flags, const Mat& _a = Mat(), const Mat& _b = Mat(),

	//

	//op_Addition(a: Mat | _types.Scalar | MatExpr | _st.double | _st.float | _st.int, b : Mat | _types.Scalar | MatExpr | _st.double | _st.float | _st.int) : MatExpr{ }

	overload->addStaticOverload("matexpr", "MatExpr", "op_Addition", { make_param<Matrix*>("a","Mat"),make_param<Matrix*>("b","Mat") }, MatExpr::op_Addition_static_mat_mat);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Addition", { make_param<Matrix*>("a","Mat"),make_param<Scalar*>("s","Scalar") }, MatExpr::op_Addition_static_mat_scalar);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Addition", { make_param<Matrix*>("a","Mat"),make_param<double>("b","double") }, MatExpr::op_Addition_static_mat_double);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Addition", { make_param<Matrix*>("a","Mat"),make_param<MatExpr*>("b","MatExpr") }, MatExpr::op_Addition_static_mat_matexpr);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Addition", { make_param<MatExpr*>("a","MatExpr"),make_param<Matrix*>("b","Mat") }, MatExpr::op_Addition_static_matexpr_mat);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Addition", { make_param<MatExpr*>("a","MatExpr"),make_param<Scalar*>("s","Scalar") }, MatExpr::op_Addition_static_matexpr_scalar);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Addition", { make_param<MatExpr*>("a","MatExpr"),make_param<MatExpr*>("b","MatExpr") }, MatExpr::op_Addition_static_matexpr_matexpr);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Addition", { make_param<MatExpr*>("a","MatExpr"),make_param<double>("b","double") }, MatExpr::op_Addition_static_matexpr_double);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Addition", { make_param<Scalar*>("s","Scalar"),make_param("b","MatExpr") }, MatExpr::op_Addition_static_scalar_matexpr);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Addition", { make_param<Scalar*>("s","Scalar"),make_param("b","Mat") }, MatExpr::op_Addition_static_scalar_mat);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Addition", { make_param<double>("a","double"),make_param("b","Mat") }, MatExpr::op_Addition_static_double_mat);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Addition", { make_param<double>("a","double"),make_param("b","MatExpr") }, MatExpr::op_Addition_static_double_matexpr);
	Nan::SetMethod(ctor, "op_Addition", matexpr_general_callback::callback);


	//op_Substraction(a: Mat | _types.Scalar | MatExpr | _st.double | _st.float | _st.int, b ? : Mat | _types.Scalar | MatExpr | _st.double | _st.float | _st.int) : MatExpr{ }
	overload->addStaticOverload("matexpr", "MatExpr", "op_Substraction", { make_param("a","Mat"),make_param("b","Mat") },		MatExpr::op_Substraction_static_mat_mat);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Substraction", { make_param("a","Mat"),make_param("s","Scalar") },	MatExpr::op_Substraction_static_mat_scalar);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Substraction", { make_param("a","Mat"),make_param("b","double") },	MatExpr::op_Substraction_static_mat_double);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Substraction", { make_param("a","Mat"),make_param("b","MatExpr") },	MatExpr::op_Substraction_static_mat_matexpr);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Substraction", { make_param("a","MatExpr"),make_param("b","Mat") },	MatExpr::op_Substraction_static_matexpr_mat);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Substraction", { make_param("a","MatExpr"),make_param("s","Scalar") }, MatExpr::op_Substraction_static_matexpr_scalar);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Substraction", { make_param("a","MatExpr"),make_param("b","MatExpr") }, MatExpr::op_Substraction_static_matexpr_matexpr);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Substraction", { make_param("a","MatExpr"),make_param("b","double") }, MatExpr::op_Substraction_static_matexpr_double);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Substraction", { make_param("s","Scalar"),make_param("b","MatExpr") }, MatExpr::op_Substraction_static_scalar_matexpr);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Substraction", { make_param("s","Scalar"),make_param("b","Mat") }, MatExpr::op_Substraction_static_scalar_mat);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Substraction", { make_param("a","double"),make_param("b","Mat") }, MatExpr::op_Substraction_static_double_mat);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Substraction", { make_param("a","double"),make_param("b","MatExpr") }, MatExpr::op_Substraction_static_double_matexpr);


	overload->addStaticOverload("matexpr", "MatExpr", "op_Substraction", {}, MatExpr::op_Substraction_static_mat);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Substraction", {}, MatExpr::op_Substraction_static_matexpr);

	Nan::SetMethod(ctor, "op_Substraction", matexpr_general_callback::callback);


	//op_Multiplication(a: Mat | _types.Scalar | MatExpr | _st.double | _st.float | _st.int, b : Mat | _types.Scalar | MatExpr | _st.double | _st.float | _st.int) : MatExpr{ }
	overload->addStaticOverload("matexpr", "MatExpr", "op_Multiplication", { make_param("a","Mat"),make_param("b","Mat") },			MatExpr::op_Multiplication_static_mat_mat);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Multiplication", { make_param("a","Mat"),make_param("s","Scalar") },		MatExpr::op_Multiplication_static_mat_scalar);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Multiplication", { make_param("a","Mat"),make_param("b","double") },		MatExpr::op_Multiplication_static_mat_double);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Multiplication", { make_param("a","Mat"),make_param("b","MatExpr") },		MatExpr::op_Multiplication_static_mat_matexpr);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Multiplication", { make_param("a","MatExpr"),make_param("b","Mat") },		MatExpr::op_Multiplication_static_matexpr_mat);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Multiplication", { make_param("a","MatExpr"),make_param("s","Scalar") },	MatExpr::op_Multiplication_static_matexpr_scalar);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Multiplication", { make_param("a","MatExpr"),make_param("b","MatExpr") }, MatExpr::op_Multiplication_static_matexpr_matexpr);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Multiplication", { make_param("a","MatExpr"),make_param("b","double") },	MatExpr::op_Multiplication_static_matexpr_double);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Multiplication", { make_param("s","Scalar"),make_param("b","MatExpr") },	MatExpr::op_Multiplication_static_scalar_matexpr);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Multiplication", { make_param("s","Scalar"),make_param("b","Mat") },		MatExpr::op_Multiplication_static_scalar_mat);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Multiplication", { make_param("a","double"),make_param("b","Mat") },		MatExpr::op_Multiplication_static_double_mat);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Multiplication", { make_param("a","double"),make_param("b","MatExpr") },	MatExpr::op_Multiplication_static_double_matexpr);
	Nan::SetMethod(ctor, "op_Multiplication", matexpr_general_callback::callback);

	//op_Division(a: Mat | _types.Scalar | MatExpr | _st.double | _st.float | _st.int, b : Mat | _types.Scalar | MatExpr | _st.double | _st.float | _st.int) : MatExpr{ }
	overload->addStaticOverload("matexpr", "MatExpr", "op_Division", { make_param("a","Mat"),make_param("b","Mat") },			MatExpr::op_Division_static_mat_mat);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Division", { make_param("a","Mat"),make_param("s","Scalar") },		MatExpr::op_Division_static_mat_scalar);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Division", { make_param("a","Mat"),make_param("b","double") },		MatExpr::op_Division_static_mat_double);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Division", { make_param("a","Mat"),make_param("b","MatExpr") },		MatExpr::op_Division_static_mat_matexpr);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Division", { make_param("a","MatExpr"),make_param("b","Mat") },		MatExpr::op_Division_static_matexpr_mat);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Division", { make_param("a","MatExpr"),make_param("s","Scalar") },	MatExpr::op_Division_static_matexpr_scalar);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Division", { make_param("a","MatExpr"),make_param("b","MatExpr") },	MatExpr::op_Division_static_matexpr_matexpr);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Division", { make_param("a","MatExpr"),make_param("b","double") },	MatExpr::op_Division_static_matexpr_double);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Division", { make_param("s","Scalar"),make_param("b","MatExpr") },	MatExpr::op_Division_static_scalar_matexpr);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Division", { make_param("s","Scalar"),make_param("b","Mat") },		MatExpr::op_Division_static_scalar_mat);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Division", { make_param("a","double"),make_param("b","Mat") },		MatExpr::op_Division_static_double_mat);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Division", { make_param("a","double"),make_param("b","MatExpr") },	MatExpr::op_Division_static_double_matexpr);
	Nan::SetMethod(ctor, "op_Division", matexpr_general_callback::callback);

	//op_LessThan(a: Mat, b : Mat) : MatExpr{ }
	overload->addStaticOverload("matexpr", "MatExpr", "op_LessThan", { make_param("a","Mat"),make_param("b","Mat") }, MatExpr::op_LessThan_static_mat_mat);
	//op_LessThan(a: Mat, s : _st.double) : MatExpr{ }
	overload->addStaticOverload("matexpr", "MatExpr", "op_LessThan", { make_param("a","Mat"),make_param("b","double") }, MatExpr::op_LessThan_static_mat_double);
	//op_LessThan(s: _st.double, a : Mat) : MatExpr{ }
	overload->addStaticOverload("matexpr", "MatExpr", "op_LessThan", { make_param("a","double"),make_param("b","Mat") }, MatExpr::op_LessThan_static_double_mat);
	Nan::SetMethod(ctor, "op_LessThan", matexpr_general_callback::callback);


	//op_LessThenOrEqual(a: Mat, b : Mat) : MatExpr{ }
	overload->addStaticOverload("matexpr", "MatExpr", "op_LessThenOrEqual", { make_param("a","Mat"),make_param("b","Mat") }, MatExpr::op_LessThenOrEqual_static_mat_mat);
	//op_LessThenOrEqual(a: Mat, s : _st.double) : MatExpr{ }
	overload->addStaticOverload("matexpr", "MatExpr", "op_LessThenOrEqual", { make_param("a","Mat"),make_param("b","double") }, MatExpr::op_LessThenOrEqual_static_mat_double);
	//op_LessThenOrEqual(s: _st.double, a : Mat) : MatExpr{ }
	overload->addStaticOverload("matexpr", "MatExpr", "op_LessThenOrEqual", { make_param("a","double"),make_param("b","Mat") }, MatExpr::op_LessThenOrEqual_static_double_mat);
	Nan::SetMethod(ctor, "op_LessThenOrEqual", matexpr_general_callback::callback);


	//op_Equals(a: Mat, b : Mat) : MatExpr{ }
	overload->addStaticOverload("matexpr", "MatExpr", "op_Equals", { make_param("a","Mat"),make_param("b","Mat") }, MatExpr::op_Equals_static_mat_mat);
	//op_Equals(a: Mat, s : _st.double) : MatExpr{ }
	overload->addStaticOverload("matexpr", "MatExpr", "op_Equals", { make_param("a","Mat"),make_param("b","double") }, MatExpr::op_Equals_static_mat_double);
	//op_Equals(s: _st.double, a : Mat) : MatExpr{ }
	overload->addStaticOverload("matexpr", "MatExpr", "op_Equals", { make_param("a","double"),make_param("b","Mat") }, MatExpr::op_Equals_static_double_mat);
	Nan::SetMethod(ctor, "op_Equals", matexpr_general_callback::callback);

	//op_NotEquals(a: Mat, b : Mat) : MatExpr{ }
	overload->addStaticOverload("matexpr", "MatExpr", "op_NotEquals", { make_param("a","Mat"),make_param("b","Mat") }, MatExpr::op_NotEquals_static_mat_mat);
	//op_NotEquals(a: Mat, s : _st.double) : MatExpr{ }
	overload->addStaticOverload("matexpr", "MatExpr", "op_NotEquals", { make_param("a","Mat"),make_param("b","double") }, MatExpr::op_NotEquals_static_mat_double);
	//op_NotEquals(s: _st.double, a : Mat) : MatExpr{ }
	overload->addStaticOverload("matexpr", "MatExpr", "op_NotEquals", { make_param("a","double"),make_param("b","Mat") }, MatExpr::op_NotEquals_static_double_mat);
	Nan::SetMethod(ctor, "op_NotEquals", matexpr_general_callback::callback);

	//op_GreaterThanOrEqual(a: Mat, b : Mat) : MatExpr{ }
	overload->addStaticOverload("matexpr", "MatExpr", "op_GreaterThanOrEqual", { make_param("a","Mat"),make_param("b","Mat") }, MatExpr::op_GreaterThanOrEqual_static_mat_mat);
	//op_GreaterThanOrEqual(a: Mat, s : _st.double) : MatExpr{ }
	overload->addStaticOverload("matexpr", "MatExpr", "op_GreaterThanOrEqual", { make_param("a","Mat"),make_param("b","double") }, MatExpr::op_GreaterThanOrEqual_static_mat_double);
	//op_GreaterThanOrEqual(s: _st.double, a : Mat) : MatExpr{ }
	overload->addStaticOverload("matexpr", "MatExpr", "op_GreaterThanOrEqual", { make_param("a","double"),make_param("b","Mat") }, MatExpr::op_GreaterThanOrEqual_static_double_mat);
	Nan::SetMethod(ctor, "op_GreaterThanOrEqual", matexpr_general_callback::callback);

	//op_GreaterThan(a: Mat | MatExpr | _st.double, b : Mat | MatExpr | _st.double) : MatExpr{ }
	overload->addStaticOverload("matexpr", "MatExpr", "op_GreaterThan", { make_param("a","Mat"),make_param("b","Mat") }, MatExpr::op_GreaterThan_static_mat_mat);
	overload->addStaticOverload("matexpr", "MatExpr", "op_GreaterThan", { make_param("a","Mat"),make_param("b","double") }, MatExpr::op_GreaterThan_static_mat_double);
	overload->addStaticOverload("matexpr", "MatExpr", "op_GreaterThan", { make_param("a","double"),make_param("b","Mat") }, MatExpr::op_GreaterThan_static_double_mat);
	Nan::SetMethod(ctor, "op_GreaterThan", matexpr_general_callback::callback);

	//op_And(a: Mat | MatExpr | _types.Scalar, b : Mat | MatExpr | _types.Scalar) : MatExpr{ }
	overload->addStaticOverload("matexpr", "MatExpr", "op_And", { make_param("a","Mat"),make_param("b","Mat") },    MatExpr::op_And_static_mat_mat);
	overload->addStaticOverload("matexpr", "MatExpr", "op_And", { make_param("a","Mat"),make_param("b","Scalar") }, MatExpr::op_And_static_mat_scalar);
	overload->addStaticOverload("matexpr", "MatExpr", "op_And", { make_param("a","Scalar"),make_param("b","Mat") }, MatExpr::op_And_static_scalar_mat);
	Nan::SetMethod(ctor, "op_And", matexpr_general_callback::callback);

	//op_Or(a: Mat | MatExpr | _types.Scalar, b : Mat | MatExpr | _types.Scalar) : MatExpr{ }
	overload->addStaticOverload("matexpr", "MatExpr", "op_Or", { make_param("a","Mat"),make_param("b","Mat") },		MatExpr::op_Or_static_mat_mat);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Or", { make_param("a","Mat"),make_param("b","Scalar") },	MatExpr::op_Or_static_mat_scalar);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Or", { make_param("a","Scalar"),make_param("b","Mat") },	MatExpr::op_Or_static_scalar_mat);
	Nan::SetMethod(ctor, "op_Or", matexpr_general_callback::callback);

	//op_Xor(a: Mat | MatExpr | _types.Scalar, b : Mat | MatExpr | _types.Scalar) : MatExpr{ }
	overload->addStaticOverload("matexpr", "MatExpr", "op_Xor", { make_param("a","Mat"),make_param("b","Mat") },	MatExpr::op_Xor_static_mat_mat);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Xor", { make_param("a","Mat"),make_param("b","Scalar") }, MatExpr::op_Xor_static_mat_scalar);
	overload->addStaticOverload("matexpr", "MatExpr", "op_Xor", { make_param("a","Scalar"),make_param("b","Mat") }, MatExpr::op_Xor_static_scalar_mat);
	Nan::SetMethod(ctor, "op_Xor", matexpr_general_callback::callback);


	//op_BinaryNot(m: Mat) : MatExpr{ }
	overload->addStaticOverload("matexpr", "MatExpr", "op_BinaryNot", { make_param("m","Mat") }, MatExpr::op_BinaryNot_static_mat);
	Nan::SetMethod(ctor, "op_BinaryNot", matexpr_general_callback::callback);


	//min(a: Mat | MatExpr | _types.Scalar | _st.double, b : Mat | MatExpr | _types.Scalar | _st.double) : MatExpr{ }
	overload->addStaticOverload("matexpr", "MatExpr", "min", { make_param("a","Mat"),make_param("b","Mat") }, MatExpr::min_static_mat_mat);
	overload->addStaticOverload("matexpr", "MatExpr", "min", { make_param("a","Mat"),make_param("b","double") }, MatExpr::min_static_mat_double);
	overload->addStaticOverload("matexpr", "MatExpr", "min", { make_param("a","double"),make_param("b","Mat") }, MatExpr::min_static_double_mat);
	Nan::SetMethod(ctor, "min", matexpr_general_callback::callback);


	//max(a: Mat | MatExpr | _types.Scalar | _st.double, b : Mat | MatExpr | _types.Scalar | _st.double) : MatExpr{ }
	overload->addStaticOverload("matexpr", "MatExpr", "max", { make_param("a","Mat"),make_param("b","Mat") },	 MatExpr::max_static_mat_mat);
	overload->addStaticOverload("matexpr", "MatExpr", "max", { make_param("a","Mat"),make_param("b","double") }, MatExpr::max_static_mat_double);
	overload->addStaticOverload("matexpr", "MatExpr", "max", { make_param("a","double"),make_param("b","Mat") }, MatExpr::max_static_double_mat);
	Nan::SetMethod(ctor, "max", matexpr_general_callback::callback);


	//abs(m: Mat) : MatExpr{ }
	//abs(e: MatExpr) : MatExpr{ }

	overload->addStaticOverload("matexpr", "MatExpr", "abs", { make_param("m","Mat") },		MatExpr::abs_static_mat);
	overload->addStaticOverload("matexpr", "MatExpr", "abs", { make_param("e","MatExpr") }, MatExpr::abs_static_matexpr);
	Nan::SetMethod(ctor, "abs", matexpr_general_callback::callback);


	//instance


	//    const Mat& _c = Mat(), double _alpha = 1, double _beta = 1, const Scalar& _s = Scalar()){ }

	//    operator Mat() const{ }
	//    template < typename _Tp> operator Mat_<_Tp>() const{ }

	//size() :  _types.Size{ }
	//type(): _st.int{ }

	//    MatExpr row(int y) const{ }
	//    MatExpr col(int x) const{ }
	//    MatExpr diag(int d = 0) const{ }
	//    MatExpr operator()( const Range& rowRange, const Range& colRange ) const{ }
	//    MatExpr operator()( const Rect& roi ) const{ }

	//    MatExpr t() const{ }



	//inv(method ? : _base.DecompTypes | _st.int /*= DECOMP_LU*/) : MatExpr{ }
	overload->addOverload("matexpr", "MatExpr", "inv", { make_param<int>("method","DecompTypes",(int) cv::DECOMP_LU) }, MatExpr::inv_int);
	Nan::SetPrototypeMethod(ctor, "inv", matexpr_general_callback::callback);


	//    MatExpr mul(e : MatExpr, double scale= 1) const{ }
	//    MatExpr mul(m : Mat, double scale= 1) const{ }

	//    Mat cross(m : Mat) const{ }
	//    double dot(m : Mat) const{ }

	//    const MatOp* op{ }
	//    int flags{ }

	//    Mat a, b, c{ }
	//    double alpha, beta{ }
	//    Scalar s{ }




	//toMat() : Mat{ }
	overload->addOverload("matexpr", "MatExpr", "toMat", {}, MatExpr::toMat);
	Nan::SetPrototypeMethod(ctor, "toMat", matexpr_general_callback::callback);

	//op_Addition(other: Mat | MatExpr | _types.Scalar | _st.double) : MatExpr{ }
	overload->addOverload("matexpr", "MatExpr", "op_Addition", { make_param<Matrix*>("a","Mat") }, MatExpr::op_Addition_mat);
	overload->addOverload("matexpr", "MatExpr", "op_Addition", { make_param<MatExpr*>("a","MatExpr") }, MatExpr::op_Addition_matexpr);
	overload->addOverload("matexpr", "MatExpr", "op_Addition", { make_param<Scalar*>("a","Scalar") }, MatExpr::op_Addition_scalar);
	Nan::SetPrototypeMethod(ctor, "op_Addition", matexpr_general_callback::callback);

	//op_Substraction(other: Mat | MatExpr | _types.Scalar | _st.double) : MatExpr{ }
	overload->addOverload("matexpr", "MatExpr", "op_Substraction", { make_param("a","Mat") }, MatExpr::op_Substraction_mat);
	overload->addOverload("matexpr", "MatExpr", "op_Substraction", { make_param("a","MatExpr") }, MatExpr::op_Substraction_matexpr);
	overload->addOverload("matexpr", "MatExpr", "op_Substraction", { make_param("a","Scalar") }, MatExpr::op_Substraction_scalar);
	Nan::SetPrototypeMethod(ctor, "op_Substraction", matexpr_general_callback::callback);

	//op_Multiplication(other: Mat | MatExpr | _types.Scalar | _st.double) : MatExpr{ }
	overload->addOverload("matexpr", "MatExpr", "op_Multiplication", { make_param("a","Mat") }, MatExpr::op_Multiplication_mat);
	overload->addOverload("matexpr", "MatExpr", "op_Multiplication", { make_param("a","MatExpr") }, MatExpr::op_Multiplication_matexpr);
	overload->addOverload("matexpr", "MatExpr", "op_Multiplication", { make_param("a","Scalar") }, MatExpr::op_Multiplication_scalar);
	Nan::SetPrototypeMethod(ctor, "op_Multiplication", matexpr_general_callback::callback);

	//op_Division(other: Mat | MatExpr | _types.Scalar | _st.double) : MatExpr{ }
	overload->addOverload("matexpr", "MatExpr", "op_Division", { make_param("a","Mat") }, MatExpr::op_Division_mat);
	overload->addOverload("matexpr", "MatExpr", "op_Division", { make_param("a","MatExpr") }, MatExpr::op_Division_matexpr);
	overload->addOverload("matexpr", "MatExpr", "op_Division", { make_param("a","Scalar") }, MatExpr::op_Division_scalar);
	Nan::SetPrototypeMethod(ctor, "op_Division", matexpr_general_callback::callback);

	//op_And(other: Mat | MatExpr | _types.Scalar | _st.double) : MatExpr{ }
	overload->addOverload("matexpr", "MatExpr", "op_And", { make_param("a","Mat") }, MatExpr::op_And_mat);
	overload->addOverload("matexpr", "MatExpr", "op_And", { make_param("a","MatExpr") }, MatExpr::op_And_matexpr);
	overload->addOverload("matexpr", "MatExpr", "op_And", { make_param("a","Scalar") }, MatExpr::op_And_scalar);
	Nan::SetPrototypeMethod(ctor, "op_And", matexpr_general_callback::callback);

	//op_Or(other: Mat | MatExpr | _types.Scalar | _st.double) : MatExpr{ }
	overload->addOverload("matexpr", "MatExpr", "op_Or", { make_param("a","Mat") }, MatExpr::op_Or_mat);
	overload->addOverload("matexpr", "MatExpr", "op_Or", { make_param("a","MatExpr") }, MatExpr::op_Or_matexpr);
	overload->addOverload("matexpr", "MatExpr", "op_Or", { make_param("a","Scalar") }, MatExpr::op_Or_scalar);
	Nan::SetPrototypeMethod(ctor, "op_Or", matexpr_general_callback::callback);

	//op_Xor(other: Mat | MatExpr | _types.Scalar | _st.double) : MatExpr{ }
	overload->addOverload("matexpr", "MatExpr", "op_Xor", { make_param("a","Mat") }, MatExpr::op_Xor_mat);
	overload->addOverload("matexpr", "MatExpr", "op_Xor", { make_param("a","MatExpr") }, MatExpr::op_Xor_matexpr);
	overload->addOverload("matexpr", "MatExpr", "op_Xor", { make_param("a","Scalar") }, MatExpr::op_Xor_scalar);
	Nan::SetPrototypeMethod(ctor, "op_Xor", matexpr_general_callback::callback);

	//op_BinaryNot() : MatExpr{ }
	overload->addOverload("matexpr", "MatExpr", "op_BinaryNot", {}, MatExpr::op_BinaryNot);
	Nan::SetPrototypeMethod(ctor, "op_BinaryNot", matexpr_general_callback::callback);


	target->Set(Nan::New("MatExpr").ToLocalChecked(), ctor->GetFunction());

	
}

v8::Local<v8::Function> MatExpr::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


//constructors
//new () : MatExpr{ }
POLY_METHOD(MatExpr::New) {
	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>();

	matexpr->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
//new (m: Mat) : MatExpr{ }
POLY_METHOD(MatExpr::New_mat) {
	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(*info.at<Matrix*>(0)->_mat);

	matexpr->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

//new (_op: MatOp, _flags : _st.int, _a ? : Mat, _b ? : Mat) : MatExpr{ }
POLY_METHOD(MatExpr::New_matop_int_mat_mat) {
	throw std::exception("matop not implemented");
	//auto op	= info.at<MatOp*>(0);
	//auto flags = info.at<int>(1);
	//auto a		= info.at<Matrix*>(2); 
	//auto b		= info.at<Matrix*>(3);
	//
	//auto matexpr = new MatExpr();
	//matexpr->_matExpr = std::make_shared<cv::MatExpr>(op,flags,a,b);
	//
	//matexpr->Wrap(info.Holder());
	//info.GetReturnValue().Set(info.Holder());
}

//MatExpr(const MatOp* _op, int _flags, const Mat& _a = Mat(), const Mat& _b = Mat(),

//

//op_Addition(a: Mat | _types.Scalar | MatExpr | _st.double | _st.float | _st.int, b : Mat | _types.Scalar | MatExpr | _st.double | _st.float | _st.int) : MatExpr{ }
POLY_METHOD(MatExpr::op_Addition_static_mat_mat) {
	auto a = *info.at<Matrix*>(0)->_mat;
	auto b = *info.at<Matrix*>(1)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a + b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Addition_static_mat_scalar) {
	auto a = *info.at<Matrix*>(0)->_mat;
	auto b = *info.at<Scalar*>(1)->_scalar;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a + b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Addition_static_mat_double) {
	auto a = *info.at<Matrix*>(0)->_mat;
	auto b = info.at<double>(1);

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a + b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Addition_static_mat_matexpr) {
	auto a = *info.at<Matrix*>(0)->_mat;
	auto b = *info.at<MatExpr*>(1)->_matExpr;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a + b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Addition_static_matexpr_mat) {
	auto a = *info.at<MatExpr*>(0)->_matExpr;
	auto b = *info.at<Matrix*>(1)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a + b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Addition_static_matexpr_scalar) {
	auto a = *info.at<MatExpr*>(0)->_matExpr;
	auto b = *info.at<Scalar*>(1)->_scalar;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a + b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Addition_static_matexpr_matexpr) {
	auto a = *info.at<MatExpr*>(0)->_matExpr;
	auto b = *info.at<MatExpr*>(1)->_matExpr;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a + b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Addition_static_matexpr_double) {
	auto a = *info.at<MatExpr*>(0)->_matExpr;
	auto b = info.at<double>(1);

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a + b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Addition_static_scalar_matexpr) {
	auto a = *info.at<Scalar*>(0)->_scalar;
	auto b = *info.at<MatExpr*>(1)->_matExpr;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a + b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Addition_static_scalar_mat) {
	auto a = *info.at<Scalar*>(0)->_scalar;
	auto b = *info.at<Matrix*>(1)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a + b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Addition_static_double_mat) {
	auto a = info.at<double>(0);
	auto b = *info.at<Matrix*>(1)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a + b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Addition_static_double_matexpr) {
	auto a = info.at<double>(0);
	auto b = *info.at<MatExpr*>(1)->_matExpr;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a + b);
	info.SetReturnValue(matexpr);
}



//op_Substraction(a: Mat | _types.Scalar | MatExpr | _st.double | _st.float | _st.int, b ? : Mat | _types.Scalar | MatExpr | _st.double | _st.float | _st.int) : MatExpr{ }
POLY_METHOD(MatExpr::op_Substraction_static_mat_mat) { 
	auto a = *info.at<Matrix*>(0)->_mat;
	auto b = *info.at<Matrix*>(1)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a - b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Substraction_static_mat_scalar) {
	auto a = *info.at<Matrix*>(0)->_mat;
	auto b = *info.at<Scalar*>(1)->_scalar;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a - b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Substraction_static_mat_double) {
	auto a = *info.at<Matrix*>(0)->_mat;
	auto b = info.at<double>(1);

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a - b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Substraction_static_mat_matexpr) {
	auto a = *info.at<Matrix*>(0)->_mat;
	auto b = *info.at<MatExpr*>(1)->_matExpr;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a - b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Substraction_static_matexpr_mat) { 
	auto a = *info.at<MatExpr*>(0)->_matExpr;
	auto b = *info.at<Matrix*>(1)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a - b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Substraction_static_matexpr_scalar) {
	auto a = *info.at<MatExpr*>(0)->_matExpr;
	auto b = *info.at<Scalar*>(1)->_scalar;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a - b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Substraction_static_matexpr_matexpr) {
	auto a = *info.at<MatExpr*>(0)->_matExpr;
	auto b = *info.at<MatExpr*>(1)->_matExpr;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a - b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Substraction_static_matexpr_double) { 
	auto a = *info.at<MatExpr*>(0)->_matExpr;
	auto b = info.at<double>(1);

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a - b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Substraction_static_scalar_matexpr) { 
	auto a = *info.at<Scalar*>(0)->_scalar;
	auto b = *info.at<MatExpr*>(1)->_matExpr;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a - b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Substraction_static_scalar_mat) {
	auto a = *info.at<Scalar*>(0)->_scalar;
	auto b = *info.at<Matrix*>(1)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a - b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Substraction_static_double_mat) { 
	auto a = info.at<double>(0);
	auto b = *info.at<Matrix*>(1)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a - b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Substraction_static_double_matexpr) { 
	auto a = info.at<double>(0);
	auto b = *info.at<MatExpr*>(1)->_matExpr;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a - b);
	info.SetReturnValue(matexpr);
}

POLY_METHOD(MatExpr::op_Substraction_static_mat) { 
	auto a = *info.at<Matrix*>(0)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(-a);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Substraction_static_matexpr) {
	auto a = *info.at<MatExpr*>(0)->_matExpr;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(-a);
	info.SetReturnValue(matexpr);
}


//op_Multiplication(a: Mat | _types.Scalar | MatExpr | _st.double | _st.float | _st.int, b : Mat | _types.Scalar | MatExpr | _st.double | _st.float | _st.int) : MatExpr{ }
POLY_METHOD(MatExpr::op_Multiplication_static_mat_mat) {
	auto a = *info.at<Matrix*>(0)->_mat;
	auto b = *info.at<Matrix*>(1)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a * b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Multiplication_static_mat_scalar) { 
	throw std::exception("Mat and Scalar multiplication is not supported");
	//auto a = *info.at<Matrix*>(0)->_mat;
	//auto b = *info.at<Scalar*>(1)->_scalar;
	//
	//auto matexpr = new MatExpr();
	//matexpr->_matExpr = std::make_shared<cv::MatExpr>(a * b);
	//info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Multiplication_static_mat_double) { 
	auto a = *info.at<Matrix*>(0)->_mat;
	auto b = info.at<double>(1);

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a * b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Multiplication_static_mat_matexpr) { 
	auto a = *info.at<Matrix*>(0)->_mat;
	auto b = *info.at<MatExpr*>(1)->_matExpr;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a * b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Multiplication_static_matexpr_mat) { 
	auto a = *info.at<MatExpr*>(0)->_matExpr;
	auto b = *info.at<Matrix*>(1)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a * b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Multiplication_static_matexpr_scalar) {
	throw std::exception("MatExpr and Scalar multiplication is not supported");
	//auto a = *info.at<MatExpr*>(0)->_matExpr;
	//auto b = *info.at<Scalar*>(1)->_scalar;
	//
	//auto matexpr = new MatExpr();
	//matexpr->_matExpr = std::make_shared<cv::MatExpr>(a * b);
	//info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Multiplication_static_matexpr_matexpr) {
	auto a = *info.at<MatExpr*>(0)->_matExpr;
	auto b = *info.at<MatExpr*>(1)->_matExpr;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a * b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Multiplication_static_matexpr_double) {
	auto a = *info.at<MatExpr*>(0)->_matExpr;
	auto b = info.at<double>(1);

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a * b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Multiplication_static_scalar_matexpr) { 
	throw std::exception("Scalar and MatExpr multiplication is not supported");
	//auto a = *info.at<Scalar*>(0)->_scalar;
	//auto b = *info.at<MatExpr*>(1)->_matExpr;
	//
	//auto matexpr = new MatExpr();
	//matexpr->_matExpr = std::make_shared<cv::MatExpr>(a * b);
	//info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Multiplication_static_scalar_mat) { 
	throw std::exception("Scalar and Matrix multiplication is not supported");
	//auto a = *info.at<Scalar*>(0)->_scalar;
	//auto b = *info.at<Matrix*>(1)->_mat;
	//
	//auto matexpr = new MatExpr();
	//matexpr->_matExpr = std::make_shared<cv::MatExpr>(a * b);
	//info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Multiplication_static_double_mat) {
	auto a = info.at<double>(0);
	auto b = *info.at<Matrix*>(1)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a * b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Multiplication_static_double_matexpr) { 
	auto a = info.at<double>(0);
	auto b = *info.at<MatExpr*>(1)->_matExpr;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a * b);
	info.SetReturnValue(matexpr);
}


//op_Division(a: Mat | _types.Scalar | MatExpr | _st.double | _st.float | _st.int, b : Mat | _types.Scalar | MatExpr | _st.double | _st.float | _st.int) : MatExpr{ }
POLY_METHOD(MatExpr::op_Division_static_mat_mat) {
	auto a = *info.at<Matrix*>(0)->_mat;
	auto b = *info.at<Matrix*>(1)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a / b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Division_static_mat_scalar) { 
	throw std::exception("Mat and Scalar division is not supported");
	//auto a = *info.at<Matrix*>(0)->_mat;
	//auto b = *info.at<Scalar*>(1)->_scalar;
	//
	//auto matexpr = new MatExpr();
	//matexpr->_matExpr = std::make_shared<cv::MatExpr>(a / b);
	//info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Division_static_mat_double) { 
	auto a = *info.at<Matrix*>(0)->_mat;
	auto b = info.at<double>(1);

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a / b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Division_static_mat_matexpr) { 
	auto a = *info.at<Matrix*>(0)->_mat;
	auto b = *info.at<MatExpr*>(1)->_matExpr;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a / b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Division_static_matexpr_mat) { 
	auto a = *info.at<MatExpr*>(0)->_matExpr;
	auto b = *info.at<Matrix*>(1)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a / b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Division_static_matexpr_scalar) {
	throw std::exception("MatExpr and Scalar division is not supported");
	//auto a = *info.at<MatExpr*>(0)->_matExpr;
	//auto b = *info.at<Scalar*>(1)->_scalar;
	//
	//auto matexpr = new MatExpr();
	//matexpr->_matExpr = std::make_shared<cv::MatExpr>(a / b);
	//info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Division_static_matexpr_matexpr) { 
	auto a = *info.at<MatExpr*>(0)->_matExpr;
	auto b = *info.at<MatExpr*>(1)->_matExpr;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a / b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Division_static_matexpr_double) { 
	auto a = *info.at<MatExpr*>(0)->_matExpr;
	auto b = info.at<double>(1);

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a / b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Division_static_scalar_matexpr) {
	throw std::exception("Scalar and MatExpr division is not supported");
	//auto a = *info.at<Scalar*>(0)->_scalar;
	//auto b = *info.at<MatExpr*>(1)->_matExpr;
	//
	//auto matexpr = new MatExpr();
	//matexpr->_matExpr = std::make_shared<cv::MatExpr>(a / b);
	//info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Division_static_scalar_mat) { 
	throw std::exception("Scalar and Mat division is not supported");
	//auto a = *info.at<Scalar*>(0)->_scalar;
	//auto b = *info.at<Matrix*>(1)->_mat;
	//
	//auto matexpr = new MatExpr();
	//matexpr->_matExpr = std::make_shared<cv::MatExpr>(a / b);
	//info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Division_static_double_mat) { 
	auto a = info.at<double>(0);
	auto b = *info.at<Matrix*>(1)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a / b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Division_static_double_matexpr) {
	auto a = info.at<double>(0);
	auto b = *info.at<MatExpr*>(1)->_matExpr;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a / b);
	info.SetReturnValue(matexpr);
}


//op_LessThan(a: Mat, b : Mat) : MatExpr{ }
POLY_METHOD(MatExpr::op_LessThan_static_mat_mat) {
	auto a = *info.at<Matrix*>(0)->_mat;
	auto b = *info.at<Matrix*>(1)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a < b);
	info.SetReturnValue(matexpr);
}
//op_LessThan(a: Mat, s : _st.double) : MatExpr{ }
POLY_METHOD(MatExpr::op_LessThan_static_mat_double) {
	auto a = *info.at<Matrix*>(0)->_mat;
	auto b = info.at<double>(1);

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a < b);
	info.SetReturnValue(matexpr);
}
//op_LessThan(s: _st.double, a : Mat) : MatExpr{ }
POLY_METHOD(MatExpr::op_LessThan_static_double_mat) {
	auto a = info.at<double>(0);
	auto b = *info.at<Matrix*>(1)->_mat;
	
	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a < b);
	info.SetReturnValue(matexpr);
}

//op_LessThenOrEqual(a: Mat, b : Mat) : MatExpr{ }
POLY_METHOD(MatExpr::op_LessThenOrEqual_static_mat_mat) { 
	auto a = *info.at<Matrix*>(0)->_mat;
	auto b = *info.at<Matrix*>(1)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a <= b);
	info.SetReturnValue(matexpr);
}
//op_LessThenOrEqual(a: Mat, s : _st.double) : MatExpr{ }
POLY_METHOD(MatExpr::op_LessThenOrEqual_static_mat_double) { 
	auto a = *info.at<Matrix*>(0)->_mat;
	auto b = info.at<double>(1);

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a <= b);
	info.SetReturnValue(matexpr);
}
//op_LessThenOrEqual(s: _st.double, a : Mat) : MatExpr{ }
POLY_METHOD(MatExpr::op_LessThenOrEqual_static_double_mat) {
	auto a = info.at<double>(0);
	auto b = *info.at<Matrix*>(1)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a <= b);
	info.SetReturnValue(matexpr);
}

//op_Equals(a: Mat, b : Mat) : MatExpr{ }
POLY_METHOD(MatExpr::op_Equals_static_mat_mat) {
	auto a = *info.at<Matrix*>(0)->_mat;
	auto b = *info.at<Matrix*>(1)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a == b);
	info.SetReturnValue(matexpr);
}
//op_Equals(a: Mat, s : _st.double) : MatExpr{ }
POLY_METHOD(MatExpr::op_Equals_static_mat_double) { 
	auto a = *info.at<Matrix*>(0)->_mat;
	auto b = info.at<double>(1);

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a == b);
	info.SetReturnValue(matexpr);
}
//op_Equals(s: _st.double, a : Mat) : MatExpr{ }
POLY_METHOD(MatExpr::op_Equals_static_double_mat) { 
	auto a = info.at<double>(0);
	auto b = *info.at<Matrix*>(1)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a == b);
	info.SetReturnValue(matexpr);
}

//op_NotEquals(a: Mat, b : Mat) : MatExpr{ }
POLY_METHOD(MatExpr::op_NotEquals_static_mat_mat) {
	auto a = *info.at<Matrix*>(0)->_mat;
	auto b = *info.at<Matrix*>(1)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a != b);
	info.SetReturnValue(matexpr);
}
//op_NotEquals(a: Mat, s : _st.double) : MatExpr{ }
POLY_METHOD(MatExpr::op_NotEquals_static_mat_double) { 
	auto a = *info.at<Matrix*>(0)->_mat;
	auto b = info.at<double>(1);

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a != b);
	info.SetReturnValue(matexpr);
}
//op_NotEquals(s: _st.double, a : Mat) : MatExpr{ }
POLY_METHOD(MatExpr::op_NotEquals_static_double_mat) {
	auto a = info.at<double>(0);
	auto b = *info.at<Matrix*>(1)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a != b);
	info.SetReturnValue(matexpr);
}

//op_GreaterThanOrEqual(a: Mat, b : Mat) : MatExpr{ }
POLY_METHOD(MatExpr::op_GreaterThanOrEqual_static_mat_mat) { 
	auto a = *info.at<Matrix*>(0)->_mat;
	auto b = *info.at<Matrix*>(1)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a >= b);
	info.SetReturnValue(matexpr);
}
//op_GreaterThanOrEqual(a: Mat, s : _st.double) : MatExpr{ }
POLY_METHOD(MatExpr::op_GreaterThanOrEqual_static_mat_double) { 
	auto a = *info.at<Matrix*>(0)->_mat;
	auto b = info.at<double>(1);

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a >= b);
	info.SetReturnValue(matexpr);
}
//op_GreaterThanOrEqual(s: _st.double, a : Mat) : MatExpr{ }
POLY_METHOD(MatExpr::op_GreaterThanOrEqual_static_double_mat) {
	auto a = info.at<double>(0);
	auto b = *info.at<Matrix*>(1)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a >= b);
	info.SetReturnValue(matexpr);
}


//op_GreaterThan(a: Mat | MatExpr | _st.double, b : Mat | MatExpr | _st.double) : MatExpr{ }
POLY_METHOD(MatExpr::op_GreaterThan_static_mat_mat) { 
	auto a = *info.at<Matrix*>(0)->_mat;
	auto b = *info.at<Matrix*>(1)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a > b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_GreaterThan_static_mat_double) { 
	auto a = *info.at<Matrix*>(0)->_mat;
	auto b = info.at<double>(1);

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a > b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_GreaterThan_static_double_mat) { 
	auto a = info.at<double>(0);
	auto b = *info.at<Matrix*>(1)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a > b);
	info.SetReturnValue(matexpr);
}

//op_And(a: Mat | MatExpr | _types.Scalar, b : Mat | MatExpr | _types.Scalar) : MatExpr{ }
POLY_METHOD(MatExpr::op_And_static_mat_mat) { 
	auto a = *info.at<Matrix*>(0)->_mat;
	auto b = *info.at<Matrix*>(1)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a & b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_And_static_mat_scalar) { 
	auto a = *info.at<Matrix*>(0)->_mat;
	auto b = *info.at<Scalar*>(1)->_scalar;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a & b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_And_static_scalar_mat) { 
	auto a = *info.at<Scalar*>(0)->_scalar;
	auto b = *info.at<Matrix*>(1)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a & b);
	info.SetReturnValue(matexpr);
}

//op_Or(a: Mat | MatExpr | _types.Scalar, b : Mat | MatExpr | _types.Scalar) : MatExpr{ }
POLY_METHOD(MatExpr::op_Or_static_mat_mat) { 
	auto a = *info.at<Matrix*>(0)->_mat;
	auto b = *info.at<Matrix*>(1)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a | b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Or_static_mat_scalar) { 
	auto a = *info.at<Matrix*>(0)->_mat;
	auto b = *info.at<Scalar*>(1)->_scalar;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a | b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Or_static_scalar_mat) { 
	auto a = *info.at<Scalar*>(0)->_scalar;
	auto b = *info.at<Matrix*>(1)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a | b);
	info.SetReturnValue(matexpr);
}

//op_Xor(a: Mat | MatExpr | _types.Scalar, b : Mat | MatExpr | _types.Scalar) : MatExpr{ }
POLY_METHOD(MatExpr::op_Xor_static_mat_mat) {
	auto a = *info.at<Matrix*>(0)->_mat;
	auto b = *info.at<Matrix*>(1)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a ^ b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Xor_static_mat_scalar) {
	auto a = *info.at<Matrix*>(0)->_mat;
	auto b = *info.at<Scalar*>(1)->_scalar;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a ^ b);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Xor_static_scalar_mat) { 
	auto a = *info.at<Scalar*>(0)->_scalar;
	auto b = *info.at<Matrix*>(1)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(a ^ b);
	info.SetReturnValue(matexpr);
}


//op_BinaryNot(m: Mat) : MatExpr{ }
POLY_METHOD(MatExpr::op_BinaryNot_static_mat) { 
	auto a = *info.at<Matrix*>(0)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(~a);
	info.SetReturnValue(matexpr);
}


//min(a: Mat | MatExpr | _types.Scalar | _st.double, b : Mat | MatExpr | _types.Scalar | _st.double) : MatExpr{ }
POLY_METHOD(MatExpr::min_static_mat_mat) { 
	auto a = *info.at<Matrix*>(0)->_mat;
	auto b = *info.at<Matrix*>(1)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(cv::min( a , b));
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::min_static_mat_double) {
	auto a = *info.at<Matrix*>(0)->_mat;
	auto b = info.at<double>(1);

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(cv::min(a , b));
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::min_static_double_mat) {
	auto a = info.at<double>(0);
	auto b = *info.at<Matrix*>(1)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(cv::min(a , b));
	info.SetReturnValue(matexpr);
}


//max(a: Mat | MatExpr | _types.Scalar | _st.double, b : Mat | MatExpr | _types.Scalar | _st.double) : MatExpr{ }
POLY_METHOD(MatExpr::max_static_mat_mat) {
	auto a = *info.at<Matrix*>(0)->_mat;
	auto b = *info.at<Matrix*>(1)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(cv::max(a, b));
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::max_static_mat_double) {
	auto a = *info.at<Matrix*>(0)->_mat;
	auto b = info.at<double>(1);

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(cv::max(a, b));
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::max_static_double_mat) { 
	auto a = info.at<double>(0);
	auto b = *info.at<Matrix*>(1)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(cv::max(a, b));
	info.SetReturnValue(matexpr);
}


//abs(m: Mat) : MatExpr{ }
//abs(e: MatExpr) : MatExpr{ }

POLY_METHOD(MatExpr::abs_static_mat) {
	auto a = *info.at<Matrix*>(0)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(cv::abs( a));
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::abs_static_matexpr) { 
	auto a = *info.at<MatExpr*>(0)->_matExpr;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(cv::abs(a));
	info.SetReturnValue(matexpr);
}


//instance


//    const Mat& _c = Mat(), double _alpha = 1, double _beta = 1, const Scalar& _s = Scalar()){ }

//    operator Mat() const{ }
//    template < typename _Tp> operator Mat_<_Tp>() const{ }

//size() :  _types.Size{ }
//type(): _st.int{ }

//    MatExpr row(int y) const{ }
//    MatExpr col(int x) const{ }
//    MatExpr diag(int d = 0) const{ }
//    MatExpr operator()( const Range& rowRange, const Range& colRange ) const{ }
//    MatExpr operator()( const Rect& roi ) const{ }

//    MatExpr t() const{ }



//inv(method ? : _base.DecompTypes | _st.int /*= DECOMP_LU*/) : MatExpr{ }
POLY_METHOD(MatExpr::inv_int) { 
	auto this_ = info.This<MatExpr*>()->_matExpr;
	auto method = info.at<int>(0);

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(this_->inv(method));
	info.SetReturnValue(matexpr);
}



//    MatExpr mul(e : MatExpr, double scale= 1) const{ }
//    MatExpr mul(m : Mat, double scale= 1) const{ }

//    Mat cross(m : Mat) const{ }
//    double dot(m : Mat) const{ }

//    const MatOp* op{ }
//    int flags{ }

//    Mat a, b, c{ }
//    double alpha, beta{ }
//    Scalar s{ }




//toMat() : Mat{ }
POLY_METHOD(MatExpr::toMat) { 
	auto this_ = info.This<MatExpr*>()->_matExpr;

	auto mat = new Matrix();
	mat->_mat = std::make_shared<cv::Mat>(*this_);
	info.SetReturnValue(mat);
}

//op_Addition(other: Mat | MatExpr | _types.Scalar | _st.double) : MatExpr{ }
POLY_METHOD(MatExpr::op_Addition_mat) { 
	auto this_ = *info.This<MatExpr*>()->_matExpr;
	auto mat = *info.at<Matrix*>(0)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(this_ + mat);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Addition_matexpr) { 
	auto this_ = *info.This<MatExpr*>()->_matExpr;
	auto matexpr = *info.at<MatExpr*>(0)->_matExpr;

	auto ret = new MatExpr();
	ret->_matExpr = std::make_shared<cv::MatExpr>(this_ + matexpr);
	info.SetReturnValue(ret);
}
POLY_METHOD(MatExpr::op_Addition_scalar) {
	auto this_ = *info.This<MatExpr*>()->_matExpr;
	auto scalar = *info.at<Scalar*>(0)->_scalar;

	auto ret = new MatExpr();
	ret->_matExpr = std::make_shared<cv::MatExpr>(this_ + scalar);
	info.SetReturnValue(ret);
}

//op_Substraction(other: Mat | MatExpr | _types.Scalar | _st.double) : MatExpr{ }
POLY_METHOD(MatExpr::op_Substraction_mat) { 
	auto this_ = *info.This<MatExpr*>()->_matExpr;
	auto mat = *info.at<Matrix*>(0)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(this_ - mat);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Substraction_matexpr) { 
	auto this_ = *info.This<MatExpr*>()->_matExpr;
	auto matexpr = *info.at<MatExpr*>(0)->_matExpr;

	auto ret = new MatExpr();
	ret->_matExpr = std::make_shared<cv::MatExpr>(this_ - matexpr);
	info.SetReturnValue(ret);
}
POLY_METHOD(MatExpr::op_Substraction_scalar) {
	auto this_ = *info.This<MatExpr*>()->_matExpr;
	auto scalar = *info.at<Scalar*>(0)->_scalar;

	auto ret = new MatExpr();
	ret->_matExpr = std::make_shared<cv::MatExpr>(this_ - scalar);
	info.SetReturnValue(ret);
}

//op_Multiplication(other: Mat | MatExpr | _types.Scalar | _st.double) : MatExpr{ }
POLY_METHOD(MatExpr::op_Multiplication_mat) {
	auto this_ = *info.This<MatExpr*>()->_matExpr;
	auto mat = *info.at<Matrix*>(0)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(this_ * mat);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Multiplication_matexpr) { 
	auto this_ = *info.This<MatExpr*>()->_matExpr;
	auto matexpr = *info.at<MatExpr*>(0)->_matExpr;

	auto ret = new MatExpr();
	ret->_matExpr = std::make_shared<cv::MatExpr>(this_ * matexpr);
	info.SetReturnValue(ret);
}
POLY_METHOD(MatExpr::op_Multiplication_scalar) { 
	throw std::exception("Scalar multiplication is not supported");
	//auto this_ = *info.This<MatExpr*>()->_matExpr;
	//auto scalar = *info.at<Scalar*>(0)->_scalar;
	//
	//auto ret = new MatExpr();
	//ret->_matExpr = std::make_shared<cv::MatExpr>(this_ * scalar);
	//info.SetReturnValue(ret);
}

//op_Division(other: Mat | MatExpr | _types.Scalar | _st.double) : MatExpr{ }
POLY_METHOD(MatExpr::op_Division_mat) {
	auto this_ = *info.This<MatExpr*>()->_matExpr;
	auto mat = *info.at<Matrix*>(0)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(this_ / mat);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Division_matexpr) {
	auto this_ = *info.This<MatExpr*>()->_matExpr;
	auto matexpr = *info.at<MatExpr*>(0)->_matExpr;

	auto ret = new MatExpr();
	ret->_matExpr = std::make_shared<cv::MatExpr>(this_ / matexpr);
	info.SetReturnValue(ret);
}
POLY_METHOD(MatExpr::op_Division_scalar) {
	throw std::exception("Scalar division is not supported");
	//auto this_ = *info.This<MatExpr*>()->_matExpr;
	//auto scalar = *info.at<Scalar*>(0)->_scalar;
	//
	//auto ret = new MatExpr();
	//ret->_matExpr = std::make_shared<cv::MatExpr>(this_ / scalar);
	//info.SetReturnValue(ret);
}

//op_And(other: Mat | MatExpr | _types.Scalar | _st.double) : MatExpr{ }
POLY_METHOD(MatExpr::op_And_mat) { 
	auto this_ = *info.This<MatExpr*>()->_matExpr;
	auto mat = *info.at<Matrix*>(0)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(this_ & mat);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_And_matexpr) { 
	auto this_ = *info.This<MatExpr*>()->_matExpr;
	auto matexpr = *info.at<MatExpr*>(0)->_matExpr;

	auto ret = new MatExpr();
	ret->_matExpr = std::make_shared<cv::MatExpr>(this_ & matexpr);
	info.SetReturnValue(ret);
}
POLY_METHOD(MatExpr::op_And_scalar) { 
	auto this_ = *info.This<MatExpr*>()->_matExpr;
	auto scalar = *info.at<Scalar*>(0)->_scalar;

	auto ret = new MatExpr();
	ret->_matExpr = std::make_shared<cv::MatExpr>(this_ & scalar);
	info.SetReturnValue(ret);
}

//op_Or(other: Mat | MatExpr | _types.Scalar | _st.double) : MatExpr{ }
POLY_METHOD(MatExpr::op_Or_mat) { 
	auto this_ = *info.This<MatExpr*>()->_matExpr;
	auto mat = *info.at<Matrix*>(0)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(this_ | mat);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Or_matexpr) {
	auto this_ = *info.This<MatExpr*>()->_matExpr;
	auto matexpr = *info.at<MatExpr*>(0)->_matExpr;

	auto ret = new MatExpr();
	ret->_matExpr = std::make_shared<cv::MatExpr>(this_ | matexpr);
	info.SetReturnValue(ret);
}
POLY_METHOD(MatExpr::op_Or_scalar) { 
	auto this_ = *info.This<MatExpr*>()->_matExpr;
	auto scalar = *info.at<Scalar*>(0)->_scalar;

	auto ret = new MatExpr();
	ret->_matExpr = std::make_shared<cv::MatExpr>(this_ | scalar);
	info.SetReturnValue(ret);
}

//op_Xor(other: Mat | MatExpr | _types.Scalar | _st.double) : MatExpr{ }
POLY_METHOD(MatExpr::op_Xor_mat) { 
	auto this_ = *info.This<MatExpr*>()->_matExpr;
	auto mat = *info.at<Matrix*>(0)->_mat;

	auto matexpr = new MatExpr();
	matexpr->_matExpr = std::make_shared<cv::MatExpr>(this_ ^ mat);
	info.SetReturnValue(matexpr);
}
POLY_METHOD(MatExpr::op_Xor_matexpr) { 
	auto this_ = *info.This<MatExpr*>()->_matExpr;
	auto matexpr = *info.at<MatExpr*>(0)->_matExpr;

	auto ret = new MatExpr();
	ret->_matExpr = std::make_shared<cv::MatExpr>(this_ ^ matexpr);
	info.SetReturnValue(ret);
}
POLY_METHOD(MatExpr::op_Xor_scalar) { 
	auto this_ = *info.This<MatExpr*>()->_matExpr;
	auto scalar = *info.at<Scalar*>(0)->_scalar;

	auto ret = new MatExpr();
	ret->_matExpr = std::make_shared<cv::MatExpr>(this_ ^ scalar);
	info.SetReturnValue(ret);
}

//op_BinaryNot() : MatExpr{ }
POLY_METHOD(MatExpr::op_BinaryNot) {
	auto this_ = *info.This<MatExpr*>()->_matExpr;

	auto ret = new MatExpr();
	ret->_matExpr = std::make_shared<cv::MatExpr>(~this_);
	info.SetReturnValue(ret);
}