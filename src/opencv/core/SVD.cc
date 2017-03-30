#include "SVD.h"
#include "../IOArray.h"
#include "../persistence/FileStorage.h"
#include "../persistence/FileNode.h"
#include "../Matrix.h"

namespace svd_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("svd_general_callback is empty");
		}
		return overload->execute("svd", info);
	}
}

Nan::Persistent<FunctionTemplate> SVD::constructor;


void
SVD::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	svd_general_callback::overload = overload;
	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(svd_general_callback::callback);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("SVD").ToLocalChecked());

	overload->register_type<SVD>(ctor, "svd", "SVD");

	auto SVDFlags = CreateNamedObject(target, "SVDFlags");
	SetObjectProperty(SVDFlags, "MODIFY_A", 1);
	SetObjectProperty(SVDFlags, "NO_UV", 2);
	SetObjectProperty(SVDFlags, "FULL_UV", 4);
	overload->add_type_alias("SVDFlags", "int");


	overload->addOverloadConstructor("svd", "SVD", {}, New);
	//new () : SVD;


	/** @overload
	initializes an empty SVD structure and then calls SVD::operator()
	@param src decomposed matrix.
	@param flags operation flags (SVD::Flags)
	*/
	overload->addOverloadConstructor("svd", "SVD", {
		make_param<IOArray*>("src","IOArray"),
		make_param<int>("flags","SVDFlags", 0)
	}, New_array);
	//new (src: _st.InputArray, flags ? : SVDFlags /* = 0*/) : SVD;


	/** @brief decomposes matrix and stores the results to user-provided matrices

	The methods/functions perform SVD of matrix. Unlike SVD::SVD constructor
	and SVD::operator(), they store the results to the user-provided
	matrices:

	@code{.cpp}
	Mat A, w, u, vt;
	SVD::compute(A, w, u, vt);
	@endcode

	@param src decomposed matrix
	@param w calculated singular values
	@param u calculated left singular vectors
	@param vt transposed matrix of right singular values
	@param flags operation flags - see SVD::SVD.
	*/
	overload->addStaticOverload("svd", "SVD", "compute", {
			make_param<IOArray*>("src","IOArray"),
			make_param<IOArray*>(  "w","IOArray"),
			make_param<IOArray*>(  "u","IOArray"),
			make_param<IOArray*>( "vt","IOArray"),
			make_param<int>("flags","SVDFlags", 0)
	}, compute_u_vt);
	Nan::SetMethod(ctor, "compute", svd_general_callback::callback);
	//compute(src: _st.InputArray, w : _st.OutputArray,
	//	u : _st.OutputArray, vt : _st.OutputArray, flags ? : SVDFlags /* = 0*/) : void;

	/** @overload
	computes singular values of a matrix
	@param src decomposed matrix
	@param w calculated singular values
	@param flags operation flags - see SVD::Flags.
	*/
	overload->addStaticOverload("svd", "SVD", "compute", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("w","IOArray"),
		make_param<int>("flags","SVDFlags", 0)

	}, compute);
//	compute(src: _st.InputArray, w : _st.OutputArray, flags ? : SVDFlags /* = 0*/) : void;

	/** @brief performs back substitution
	*/
	overload->addStaticOverload("svd", "SVD", "backSubst", {
		make_param<IOArray*>(  "w","IOArray"),
		make_param<IOArray*>(  "u","IOArray"),
		make_param<IOArray*>( "vt","IOArray"),
		make_param<IOArray*>("rhs","IOArray"),
		make_param<IOArray*>("dst","IOArray")
	}, backSubst_w_u_vt_rhs);
	Nan::SetMethod(ctor, "backSubst", svd_general_callback::callback);
	//backSubst(w: _st.InputArray, u : _st.InputArray,
	//	vt : _st.InputArray, rhs : _st.InputArray,
	//	dst : _st.OutputArray) : void;

	/** @brief solves an under-determined singular linear system

	The method finds a unit-length solution x of a singular linear system
	A\*x = 0. Depending on the rank of A, there can be no solutions, a
	single solution or an infinite number of solutions. In general, the
	algorithm solves the following problem:
	\f[dst =  \arg \min _{x:  \| x \| =1}  \| src  \cdot x  \|\f]
	@param src left-hand-side matrix.
	@param dst found solution.
	*/
	overload->addStaticOverload("svd", "SVD", "solveZ", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray")
	}, solveZ);
	Nan::SetMethod(ctor, "solveZ", svd_general_callback::callback);
	//solveZ(src: _st.InputArray, dst : _st.OutputArray) : void;
	//}
	//
	//interface SVD
	//{

		//
		//
		//   /** @brief the operator that performs SVD. The previously allocated u, w and vt are released.
		//
		//   The operator performs the singular value decomposition of the supplied
		//   matrix. The u,`vt` , and the vector of singular values w are stored in
		//   the structure. The same SVD structure can be reused many times with
		//   different matrices. Each time, if needed, the previous u,`vt` , and w
		//   are reclaimed and the new matrices are created, which is all handled by
		//   Mat::create.
		//   @param src decomposed matrix.
		//   @param flags operation flags (SVD::Flags)
		//     */
	overload->addOverload("svd", "SVD", "run", {
		make_param<IOArray*>("src","IOArray"),
		make_param<int>("flags","SVDFlags", 0)
	},run );
	Nan::SetPrototypeMethod(ctor, "run", svd_general_callback::callback);
		//   SVD & operator()(src : _st.InputArray, flags : _st.int /* = 0*/);
		//

		//
		//   /** @brief performs a singular value back substitution.
		//
		//   The method calculates a back substitution for the specified right-hand
		//   side:
		//
		//   \f[\texttt{x} =  \texttt{vt} ^T  \cdot diag( \texttt{w} )^{-1}  \cdot \texttt{u} ^T  \cdot \texttt{rhs} \sim \texttt{A} ^{-1}  \cdot \texttt{rhs}\f]
		//
		//   Using this technique you can either get a very accurate solution of the
		//   convenient linear system, or the best (in the least-squares terms)
		//   pseudo-solution of an overdetermined linear system.
		//
		//   @param rhs right-hand side of a linear system (u\*w\*v')\*dst = rhs to
		//   be solved, where A has been previously decomposed.
		//
		//   @param dst found solution of the system.
		//
		//   @note Explicit SVD with the further back substitution only makes sense
		//   if you need to solve many linear systems with the same left-hand side
		//   (for example, src ). If all you need is to solve a single system
		//   (possibly with multiple rhs immediately available), simply call solve
		//   add pass DECOMP_SVD there. It does absolutely the same thing.
		//     */
	overload->addOverload("svd", "SVD", "backSubst", {
		make_param<IOArray*>("rhs","IOArray"),
		make_param<IOArray*>("dst","IOArray")
	}, backSubst);
	Nan::SetPrototypeMethod(ctor, "backSubst", svd_general_callback::callback);
		//   void backSubst(rhs : _st.InputArray, dst : _st.OutputArray ) const;
		//
		//   /** @todo document */
	//overload->addOverload("svd", "SVD", "compute", {}, compute);
		//   template < typename _Tp, int m, int n, int nm> static
		//   void compute( const Matx<_Tp, m, n>& a, Matx<_Tp, nm, 1>& w, Matx<_Tp, m, nm>& u, Matx<_Tp, n, nm>& vt);
		//
	//overload->addOverload("svd", "SVD", "", {}, );
		//   /** @todo document */
		//   template < typename _Tp, int m, int n, int nm> static
		//   void compute( const Matx<_Tp, m, n>& a, Matx<_Tp, nm, 1>& w );
		//
	//overload->addOverload("svd", "SVD", "", {}, );
		//   /** @todo document */
		//   template < typename _Tp, int m, int n, int nm, int nb> static
		//   void backSubst( const Matx<_Tp, nm, 1>& w, const Matx<_Tp, m, nm>& u, const Matx<_Tp, n, nm>& vt, const Matx<_Tp, m, nb>& rhs, Matx<_Tp, n, nb>& dst );
		//
		//   Mat u, w, vt;
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("u").ToLocalChecked(), u_getter, u_setter);
//u: _mat.Mat;
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("w").ToLocalChecked(), w_getter, w_setter);
//w: _mat.Mat;
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("vt").ToLocalChecked(), vt_getter, vt_setter);
//vt: _mat.Mat;
	//};
	//
	//export var SVD : SVDStatic = alvision_module.SVD;

	target->Set(Nan::New("SVD").ToLocalChecked(), ctor->GetFunction());

};

v8::Local<v8::Function> SVD::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


POLY_METHOD(SVD::New){
	auto svd = new SVD();
	svd->_svd = std::make_shared<cv::SVD>();

	svd->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(SVD::New_array){
	auto svd = new SVD();
	svd->_svd = std::make_shared<cv::SVD>(info.at<IOArray*>(0)->GetInputArray(), info.at<int>(1));

	svd->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(SVD::compute_u_vt){
	auto src	= info.at<IOArray*>(0)->GetInputArray(); 
	auto w		= info.at<IOArray*>(1)->GetOutputArray();
	auto u		= info.at<IOArray*>(2)->GetOutputArray();
	auto vt		= info.at<IOArray*>(3)->GetOutputArray();
	auto flags  = info.at<int>(4);

	cv::SVD::compute(src, w, u, vt, flags);
}
POLY_METHOD(SVD::compute){
	auto src = info.at<IOArray*>(0)->GetInputArray();
	auto w = info.at<IOArray*>(1)->GetOutputArray();
	auto flags = info.at<int>(2);

	cv::SVD::compute(src, w, flags);
}
POLY_METHOD(SVD::backSubst_w_u_vt_rhs){
	auto w		= info.at<IOArray*>(0)->GetInputArray (); 
	auto u		= info.at<IOArray*>(1)->GetInputArray ();
	auto vt		= info.at<IOArray*>(2)->GetInputArray ();
	auto rhs	= info.at<IOArray*>(3)->GetInputArray ();
	auto dst	= info.at<IOArray*>(4)->GetOutputArray();
	cv::SVD::backSubst(w, u, vt, rhs, dst);
}
POLY_METHOD(SVD::solveZ){
	auto src = info.at<IOArray*>(0)->GetInputArray ();
	auto dst = info.at<IOArray*>(1)->GetOutputArray();
	cv::SVD::solveZ(src, dst);
}
POLY_METHOD(SVD::run){
	auto this_ = *info.This<SVD*>()->_svd;
	auto src = info.at<IOArray*>(0)->GetInputArray();
	auto flags = info.at<int>(1);
	auto ret = this_(src, flags);;

	auto svd = new SVD();
	svd->_svd = std::make_shared<cv::SVD>(ret);
	info.SetReturnValue(svd);
}
POLY_METHOD(SVD::backSubst){
	//auto this_ = *info.This<SVD*>()->_svd;
	//auto rhs  = info.at<IOArray*>(0)->GetInputArray (); 
	//auto dst  = info.at<IOArray*>(1)->GetOutputArray();
	//
	//this_.backSubst()
	throw std::runtime_error("not implemented");
}


NAN_GETTER(SVD::u_getter){
	auto this_ = overres::ObjectWrap::Unwrap<SVD>(info.This())->_svd;
	auto ret = new Matrix();
	ret->_mat = std::make_shared<cv::Mat>(this_->u);
	info.GetReturnValue().Set(ret->Wrap());

}
NAN_SETTER(SVD::u_setter){
	throw std::runtime_error("not implemented");
}

NAN_GETTER(SVD::w_getter){
	auto this_ = overres::ObjectWrap::Unwrap<SVD>(info.This())->_svd;
	auto ret = new Matrix();
	ret->_mat = std::make_shared<cv::Mat>(this_->w);
	info.GetReturnValue().Set(ret->Wrap());
}
NAN_SETTER(SVD::w_setter){
	throw std::runtime_error("not implemented");
}

NAN_GETTER(SVD::vt_getter){
	auto this_ = overres::ObjectWrap::Unwrap<SVD>(info.This())->_svd;
	auto ret = new Matrix();
	ret->_mat = std::make_shared<cv::Mat>(this_->vt);
	info.GetReturnValue().Set(ret->Wrap());
}
NAN_SETTER(SVD::vt_setter){
	throw std::runtime_error("not implemented");
}