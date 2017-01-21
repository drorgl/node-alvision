#include "MatOp.h"

namespace matop_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("matop_general_callback is empty");
		}
		return overload->execute("matop", info);
	}
}

Nan::Persistent<FunctionTemplate> MatOp::constructor;


void MatOp::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	matop_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(matop_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("MatOp").ToLocalChecked());

	overload->register_type<MatOp>(ctor, "matop", "MatOp");





//	///////////////////////////////// Matrix Expressions /////////////////////////////////
//	interface MatOpStatic {
//		//    public:
//		//    MatOp();
//		//    virtual ~MatOp();
//		new () : MatOp;
//	}
//
//
//	interface MatOp
//	{
//
//		//    virtual bool elementWise(const MatExpr& expr) const;
//		//    virtual void assign(const MatExpr& expr, Mat& m, int type= -1) const = 0;
//		//    virtual void roi(const MatExpr& expr, const Range& rowRange,
//		//    const Range& colRange, MatExpr& res) const;
//		//    virtual void diag(const MatExpr& expr, int d, MatExpr& res) const;
//		//    virtual void augAssignAdd(const MatExpr& expr, Mat& m) const;
//		//    virtual void augAssignSubtract(const MatExpr& expr, Mat& m) const;
//		//    virtual void augAssignMultiply(const MatExpr& expr, Mat& m) const;
//		//    virtual void augAssignDivide(const MatExpr& expr, Mat& m) const;
//		//    virtual void augAssignAnd(const MatExpr& expr, Mat& m) const;
//		//    virtual void augAssignOr(const MatExpr& expr, Mat& m) const;
//		//    virtual void augAssignXor(const MatExpr& expr, Mat& m) const;
//
//		//    virtual void add(const MatExpr& expr1, const MatExpr& expr2, MatExpr& res) const;
//		//    virtual void add(const MatExpr& expr1, const Scalar& s, MatExpr& res) const;
//
//		//    virtual void subtract(const MatExpr& expr1, const MatExpr& expr2, MatExpr& res) const;
//		//    virtual void subtract(const Scalar& s, const MatExpr& expr, MatExpr& res) const;
//
//		//    virtual void multiply(const MatExpr& expr1, const MatExpr& expr2, MatExpr& res, double scale= 1) const;
//		//    virtual void multiply(const MatExpr& expr1, double s, MatExpr& res) const;
//
//		//    virtual void divide(const MatExpr& expr1, const MatExpr& expr2, MatExpr& res, double scale= 1) const;
//		//    virtual void divide(double s, const MatExpr& expr, MatExpr& res) const;
//
//		abs(expr: MatExpr, res : MatExpr) : void;
//
//		//    virtual void transpose(const MatExpr& expr, MatExpr& res) const;
//		//    virtual void matmul(const MatExpr& expr1, const MatExpr& expr2, MatExpr& res) const;
//		//    virtual void invert(const MatExpr& expr, int method, MatExpr& res) const;
//
//		//    virtual Size size(const MatExpr& expr) const;
//		//    virtual int type(const MatExpr& expr) const;
//	};
//
//	export var MatOp : MatOpStatic = alvision_module.MatOp;




	target->Set(Nan::New("MatOp").ToLocalChecked(), ctor->GetFunction());
}

v8::Local<v8::Function> MatOp::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}
