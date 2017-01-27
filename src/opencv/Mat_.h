#ifndef _ALVISION_MAT__H_
#define _ALVISION_MAT__H_
//#include "OpenCV.h"
#include "../alvision.h"
#include "array_accessors/value_adapters.h"
#include "Matrix.h"
#include "types/Size.h"
#include "MatExpr.h"
#include "types/Scalar.h"
#include "Vec.h"

namespace mat__general_callback {
	extern std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback);
}


//typedef typename cv::Mat_<cv::Vec2i> T;
//typedef typename Vec<cv::Vec2i>* TVT;
template <typename T, typename TVT>
class Mat_ : public Matrix {
public:
	static std::string name;
	typedef typename T::value_type TVAL;
	typedef typename T::channel_type TCT;

	static void Init(Handle<Object> target, std::string name, std::string TVTname, std::shared_ptr<overload_resolution> overload) {
		mat__general_callback::overload = overload;
		Mat_<T,TVT>::name = name;
		Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(mat__general_callback::callback);
		constructor.Reset(ctor);
		ctor->InstanceTemplate()->SetInternalFieldCount(1);
		ctor->SetClassName(Nan::New(name).ToLocalChecked());
		ctor->Inherit(Nan::New(Matrix::constructor));

		overload->register_type<Mat_<T,TVT>>(ctor, "mat_", name);



//		export interface Mat_Static<T> {
//			//! default constructor
//			new () : Mat_<T>;
		overload->addOverloadConstructor("mat_", name, {}, New);
//			//! equivalent to Mat(_rows, _cols, DataType<_Tp>::type)
//			new (_rows: _st.int, _cols : _st.int) : Mat_<T>;
		overload->addOverloadConstructor("mat_", name, {
			make_param<int>("rows","int"), 
			make_param<int>("cols","int")
		}, New_rows_cols);
//			//! constructor that sets each matrix element to specified value
//			new (_rows: _st.int, _cols : _st.int, value : T) : Mat_<T>
		overload->addOverloadConstructor("mat_", name, {
			make_param<int>("rows","int"),
			make_param<int>("cols","int"),
			make_param<TCT>("value","Number")
		}, New_rows_cols_value);
//				//! equivalent to Mat(_size, DataType<_Tp>::type)
//				new (_size : _types.Size) : Mat_<T>;
		overload->addOverloadConstructor("mat_", name, {
			make_param<Size*>("size",Size::name)
		}, New_size);
//			////! constructor that sets each matrix element to specified value
//			//Mat_(Size _size, const _Tp& value);
		overload->addOverloadConstructor("mat_", name, {
			make_param<Size*>("size",Size::name),
			make_param<TCT>("value","Number")
		}, New_size_value);
//			////! n-dim array constructor
//			//Mat_(int _ndims, const int* _sizes);
//			////! n-dim array constructor that sets each matrix element to specified value
//			//Mat_(int _ndims, const int* _sizes, const _Tp& value);
//			////! copy/conversion contructor. If m is of different type, it's converted
//			//Mat_(const Mat& m);
//			////! copy constructor
//			//Mat_(const Mat_& m);
//			////! constructs a matrix on top of user-allocated data. step is in bytes(!!!), regardless of the type
//			new (_rows: _st.int, _cols : _st.int, _data : Array<T>) : Mat_<T>;
		overload->addOverloadConstructor("mat_", name, {
			make_param<int>("rows","int"),
			make_param<int>("cols","int"),
			make_param<std::shared_ptr<std::vector<TVT>>>("data","Array<"s + TVTname+  ">"s) //TODO: how to specify which array type?...
		}, New_rows_cols_data);
//			//Mat_(int _rows, int _cols, _Tp * _data, size_t _step= AUTO_STEP);
//			////! constructs n-dim matrix on top of user-allocated data. steps are in bytes(!!!), regardless of the type
//			//Mat_(int _ndims, const int* _sizes, _Tp* _data, const size_t* _steps=0);
//			////! selects a submatrix
//			//Mat_(const Mat_& m, const Range& rowRange, const Range& colRange=Range::all());
//			////! selects a submatrix
//			//Mat_(const Mat_& m, const Rect& roi);
//			////! selects a submatrix, n-dim version
//			//Mat_(const Mat_& m, const Range* ranges);
//			////! from a matrix expression
//			new (e: MatExpr) : Mat_<T>;
		overload->addOverloadConstructor("mat_", name, {
			make_param<MatExpr*>("e",MatExpr::name)
		}, New_matexpr);
//			////! makes a matrix out of Vec, std::vector, Point_ or Point3_. The matrix will have a single column
//			//explicit Mat_(const std::vector<_Tp>& vec, bool copyData= false);
//			new (vec: Array<T>, copyData ? : boolean) : Mat_<T>;
		overload->addOverloadConstructor("mat_", name, {
			make_param<std::shared_ptr<std::vector<TCT>>>("vec","Array<Number>"),
			make_param<bool>("copyData","bool", false)
		}, New_vec);
//			//template < int n> explicit Mat_(const Vec<typename DataType<_Tp>::channel_type, n >& vec, bool copyData= true);
//			//template < int m, int n> explicit Mat_(const Matx<typename DataType<_Tp>::channel_type, m, n >& mtx, bool copyData= true);
//			//explicit Mat_(const Point_<typename DataType<_Tp>::channel_type >& pt, bool copyData= true);
//			//explicit Mat_(const Point3_<typename DataType<_Tp>::channel_type >& pt, bool copyData= true);
//			//explicit Mat_(const MatCommaInitializer_<_Tp>& commaInitializer);
//			// //! overridden forms of Mat::zeros() etc. Data type is omitted, of course
//			zeros(rows: _st.int, cols : _st.int) : MatExpr;
		overload->addStaticOverload("mat_", name,"zeros", {
			make_param<int>("rows","int"),
			make_param<int>("cols","int")
		}, zeros_rows_cols);
		Nan::SetMethod(ctor, "zeros", mat__general_callback::callback);
//			zeros(size: _types.Size) : MatExpr;
		overload->addStaticOverload("mat_", name, "zeros", {
			make_param<Size*>("size",Size::name),
		}, zeros_size);
//			zeros(_ndims: _st.int, _sizes : Array<_st.int>) : MatExpr;
		overload->addStaticOverload("mat_", name, "zeros", {
			make_param<int>("ndims","int"),
			make_param<std::shared_ptr<std::vector<int>>>("sizes","Array<int>")
		}, zeros_ndims);
//			ones(rows: _st.int, cols : _st.int) : MatExpr;
		overload->addStaticOverload("mat_", name, "ones", {
			make_param<int>("rows","int"),
			make_param<int>("cols","int")
		}, ones_rows_cols);
		Nan::SetMethod(ctor, "ones", mat__general_callback::callback);
//			ones(size: _types.Size) : MatExpr;
		overload->addStaticOverload("mat_", name, "ones", {
			make_param<Size*>("size",Size::name),
		}, ones_size);
//			ones(_ndims: _st.int, _sizes : Array<_st.int>) : MatExpr;
		overload->addStaticOverload("mat_", name, "ones", {
			make_param<int>("ndims","int"),
			make_param<std::shared_ptr<std::vector<int>>>("sizes","Array<int>")
		}, ones_ndims);
//			eye(rows: _st.int, cols : _st.int) : MatExpr;
		overload->addStaticOverload("mat_", name, "eye", {
			make_param<int>("rows","int"),
			make_param<int>("cols","int")
		}, eye_rows_cols);
		Nan::SetMethod(ctor, "eye", mat__general_callback::callback);
//			eye(size: _types.Size) : MatExpr;
		overload->addStaticOverload("mat_", name, "eye", {
			make_param<Size*>("size",Size::name),
		}, eye_size);
//
//
//
//		}
//
//		//template < typename _Tp> class Mat_ : public Mat
//		export interface Mat_<T> extends Mat
//		{
//			//    public:
//			//    typedef _Tp value_type;
//			//    typedef typename DataType<_Tp>::channel_type channel_type;
//			//    typedef MatIterator_< _Tp > iterator;
//			//    typedef MatConstIterator_< _Tp > const_iterator;
//
//
//
//			//  Mat_ & operator = (const Mat& m);
//			//  Mat_ & operator = (const Mat_& m);
//			//! set all the elements to s.
//			//   Mat_ & operator = (const _Tp& s);
//			//   //! assign a matrix expression
//			//   Mat_ & operator = (const MatExpr& e);
//
//			//! iterators; they are smart enough to skip gaps in the end of rows
//			//    iterator begin();
//			//    iterator end();
//			//    const_iterator begin() const;
//			//    const_iterator end() const;
//
//			//! template methods for for operation over all matrix elements.
//			// the operations take care of skipping gaps in the end of rows (if any)
//			//    template < typename Functor> void forEach(const Functor& operation);
//			//    template < typename Functor> void forEach(const Functor& operation) const;
//
//			//   //! equivalent to Mat::create(_rows, _cols, DataType<_Tp>::type)
//
//			//dummy overloads for typescript satisfaction
//			create(_rows: _st.int, _cols : _st.int, _type : _st.int) : void;
		overload->addOverload("mat_", name, "create", {
			make_param<int>("rows","int"),
			make_param<int>("cols","int"),
			make_param<int>("type","int")
		}, create_rows_cols_type);
		Nan::SetPrototypeMethod(ctor, "create", mat__general_callback::callback);
//			create(size: _types.Size, type : _st.int) : void;
		overload->addOverload("mat_", name, "create", {
			make_param<Size*>("size",Size::name),
			make_param<int>("type","int")
		}, create_size_type);
//			create(ndims: _st.int, sizes : Array<_st.int> | MatSize, type : _st.int) : void;

		overload->addOverload("mat_", name, "create", {
			make_param<int>("ndims","int"),
			make_param<std::shared_ptr<std::vector<int>>>("sizes","Array<int>"),
			make_param<int>("type","int")
		}, create_ndims_type);

//			//end dummy
//
//			create(_rows: _st.int, _cols : _st.int) : void;
		overload->addOverload("mat_", name, "create", {
			make_param<int>("rows","int"),
			make_param<int>("cols","int")
		}, create_rows_cols);
//			//! equivalent to Mat::create(_size, DataType<_Tp>::type)
//			create(_size: _types.Size) : void;
		overload->addOverload("mat_", name, "create", {
			make_param<Size*>("size",Size::name),
		}, create_size);
//			//! equivalent to Mat::create(_ndims, _sizes, DatType<_Tp>::type)
//			create(_ndims: _st.int, _sizes : Array<_st.int>) : void;
		overload->addOverload("mat_", name, "create", {
			make_param<int>("ndims","int"),
			make_param<std::shared_ptr<std::vector<int>>>("sizes","Array<int>")
		}, create_ndims);
//			//   //! cross-product
//			//   Mat_ cross(const Mat_& m) const;
//			//   //! data type conversion
//			//   template < typename T2> operator Mat_<T2>() const;
//			//   //! overridden forms of Mat::row() etc.
//			//   Mat_ row(int y) const;
//			//   Mat_ col(int x) const;
//			//   Mat_ diag(int d= 0) const;
//			//   Mat_ clone() const;
//			//
//			//   //! overridden forms of Mat::elemSize() etc.
//			//   size_t elemSize() const;
//			//   size_t elemSize1() const;
//			//   int type() const;
//			//   int depth() const;
//			//   int channels() const;
//			//   size_t step1(int i= 0) const;
//			//   //! returns step()/sizeof(_Tp)
//			//   size_t stepT(int i= 0) const;
//
//
//			//    //! some more overriden methods
//			//    Mat_ & adjustROI(int dtop, int dbottom, int dleft, int dright );
//			//    Mat_ operator()( const Range& rowRange, const Range& colRange ) const;
//			//    Mat_ operator()( const Rect& roi ) const;
//			//    Mat_ operator()( const Range* ranges ) const;
//			//
//			//    //! more convenient forms of row and element access operators
//			//    _Tp * operator[](int y);
//			//    const _Tp* operator[](int y) const;
//			//
//			//    //! returns reference to the specified element
//			//    _Tp & operator()(const int* idx);
//			//    //! returns read-only reference to the specified element
//			//    const _Tp& operator()(const int* idx) const;
//			//
//			//    //! returns reference to the specified element
//			//    template < int n> _Tp & operator()(const Vec<int, n>& idx);
//			//    //! returns read-only reference to the specified element
//			//    template < int n> const _Tp& operator()(const Vec<int, n>& idx) const;
//			//
//			//    //! returns reference to the specified element (1D case)
//			//    _Tp & operator()(int idx0);
//			Element(idx0: _st.int) : T;
		overload->addOverload("mat_", name, "Element", {
			make_param<int>("idx0","int")
		}, Element_idx0);
		Nan::SetPrototypeMethod(ctor, "Element", mat__general_callback::callback);
//			//    //! returns read-only reference to the specified element (1D case)
//			//    const _Tp& operator()(int idx0) const;
//
//			//    //! returns reference to the specified element (2D case)
//			//    _Tp & operator()(int idx0, int idx1);
//			Element(idx0: _st.int, idx1 : _st.int) : T;
overload->addOverload("mat_", name, "Element", {
	make_param<int>("idx0","int"),
	make_param<int>("idx1","int")
}, Element_idx0_idx1);
//			//    //! returns read-only reference to the specified element (2D case)
//			//    const _Tp& operator()(int idx0, int idx1) const;
//			//    //! returns reference to the specified element (3D case)
//			//    _Tp & operator()(int idx0, int idx1, int idx2);
//			Element(idx0: _st.int, idx1 : _st.int, idx2 : _st.int) : T;
	overload->addOverload("mat_", name, "Element", {
		make_param<int>("idx0","int"),
		make_param<int>("idx1","int"),
		make_param<int>("idx2","int")
	}, Element_idx0_idx1_idx2);
//			//    //! returns read-only reference to the specified element (3D case)
//			//    const _Tp& operator()(int idx0, int idx1, int idx2) const;
//			//
//			//    _Tp & operator()(Point pt);
//			//    const _Tp& operator()(Point pt) const;
//			//
//			//    //! conversion to vector.
//			//    operator std::vector<_Tp>() const;
//			//    //! conversion to Vec
//			//    template < int n> operator Vec<typename DataType<_Tp>::channel_type, n>() const;
//			//    //! conversion to Matx
//			//    template < int m, int n> operator Matx<typename DataType<_Tp>::channel_type, m, n>() const;
//			//
//			//    #ifdef CV_CXX_MOVE_SEMANTICS
//			//    Mat_(Mat_ && m);
//			//    Mat_ & operator = (Mat_ && m);
//			//
//			//    Mat_(Mat && m);
//			//    Mat_ & operator = (Mat && m);
//			//
//			//    Mat_(MatExpr && e);
//			//    #endif
//
//			op_Addition(other: Mat_<T> | _types.Scalar | _st.double) : Mat_<T>;
	overload->addOverload("mat_", name, "op_Addition", {make_param<Mat_<T,TVT>*>("other",Mat_<T,TVT>::name)},	op_Addition_mat_ );
	overload->addOverload("mat_", name, "op_Addition", {make_param<Scalar*>("other",Scalar::name)},		op_Addition_scalar );
	overload->addOverload("mat_", name, "op_Addition", {make_param<double>("other","double")},			op_Addition_double );
	Nan::SetPrototypeMethod(ctor, "op_Addition", mat__general_callback::callback);
//
//			op_Substraction(other: Mat_<T> | _types.Scalar | _st.double) : Mat_<T>;
	overload->addOverload("mat_", name, "op_Substraction", {make_param<Mat_<T,TVT>*>("other",Mat_<T,TVT>::name)},	op_Substraction_mat_ );
	overload->addOverload("mat_", name, "op_Substraction", {make_param<Scalar*>("other",Scalar::name)},		op_Substraction_scalar );
	overload->addOverload("mat_", name, "op_Substraction", {make_param<double>("other","double")},			op_Substraction_double );
	Nan::SetPrototypeMethod(ctor, "op_Substraction", mat__general_callback::callback);

//
//			op_Multiplication(other: Mat_<T> | _types.Scalar | _st.double) : Mat_<T>;
	overload->addOverload("mat_", name, "op_Multiplication", {make_param<Mat_<T,TVT>*>("other",Mat_<T,TVT>::name)},		op_Multiplication_mat_ );
	overload->addOverload("mat_", name, "op_Multiplication", {make_param<Scalar*>("other",Scalar::name)},		op_Multiplication_scalar );
	overload->addOverload("mat_", name, "op_Multiplication", {make_param<double>("other","double")},			op_Multiplication_double );
	Nan::SetPrototypeMethod(ctor, "op_Multiplication", mat__general_callback::callback);

//
//			op_Division(other: Mat_<T> | _types.Scalar | _st.double) : Mat_<T>;
	overload->addOverload("mat_", name, "op_Division", {make_param<Mat_<T,TVT>*>("other",Mat_<T,TVT>::name)},	op_Division_mat_ );
	overload->addOverload("mat_", name, "op_Division", {make_param<Scalar*>("other",Scalar::name)},		op_Division_scalar );
	overload->addOverload("mat_", name, "op_Division", {make_param<double>("other","double")},			op_Division_double );
	Nan::SetPrototypeMethod(ctor, "op_Division", mat__general_callback::callback);

//
//			op_And(other: Mat_<T> | _types.Scalar | _st.double) : Mat_<T>;
	overload->addOverload("mat_", name, "op_And", {make_param<Mat_<T,TVT>*>("other",Mat_<T,TVT>::name)},	op_And_mat_ );
	overload->addOverload("mat_", name, "op_And", {make_param<Scalar*>("other",Scalar::name)},		op_And_scalar );
	overload->addOverload("mat_", name, "op_And", {make_param<double>("other","double")},			op_And_double );
	Nan::SetPrototypeMethod(ctor, "op_And", mat__general_callback::callback);

//
//			op_Or(other: Mat_<T> | _types.Scalar | _st.double) : Mat_<T>;
	overload->addOverload("mat_", name, "op_Or", {make_param<Mat_<T,TVT>*>("other",Mat_<T,TVT>::name)},		op_Or_mat_ );
	overload->addOverload("mat_", name, "op_Or", {make_param<Scalar*>("other",Scalar::name)},		op_Or_scalar );
	overload->addOverload("mat_", name, "op_Or", {make_param<double>("other","double")},			op_Or_double );
	Nan::SetPrototypeMethod(ctor, "op_Or", mat__general_callback::callback);

//
//			op_Xor(other: Mat_<T> | _types.Scalar | _st.double) : Mat_<T>;
	overload->addOverload("mat_", name, "op_Xor", {make_param<Mat_<T,TVT>*>("other",Mat_<T,TVT>::name)},	op_Xor_mat_ );
	overload->addOverload("mat_", name, "op_Xor", {make_param<Scalar*>("other",Scalar::name)},		op_Xor_scalar );
	overload->addOverload("mat_", name, "op_Xor", {make_param<double>("other","double")},			op_Xor_double );
	Nan::SetPrototypeMethod(ctor, "op_Xor", mat__general_callback::callback);

//
//			op_BinaryNot() : Mat_<T>;
	overload->addOverload("mat_", name, "op_BinaryNot", {}, op_BinaryNot);
	Nan::SetPrototypeMethod(ctor, "op_BinaryNot", mat__general_callback::callback);

//		};





		target->Set(Nan::New(name).ToLocalChecked(), ctor->GetFunction());

		
	}

	std::shared_ptr<T> _Mat_;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor() {
		assert(!constructor.IsEmpty() && "constructor is empty");
		return Nan::New(constructor)->GetFunction();
	}


	virtual cv::_InputArray GetInputArray() {
		return *_mat;
	}
	virtual cv::_InputArray GetInputArrayOfArrays() {
		return *_mat;
	}
	virtual cv::_OutputArray GetOutputArray() {
		return *_mat;
	}
	virtual cv::_OutputArray GetOutputArrayOfArrays() {
		return *_mat;
	}
	virtual cv::_InputOutputArray GetInputOutputArray() {
		return *_mat;
	}
	virtual cv::_InputOutputArray GetInputOutputArrayOfArrays() {
		return *_mat;
	}



		static POLY_METHOD(New						){
			auto mat = new Mat_<T,TVT>();
			mat->_mat = std::make_shared<T>();

			mat->Wrap(info.Holder());
			info.GetReturnValue().Set(info.Holder());
		}
		static POLY_METHOD(New_rows_cols			){
			auto mat = new Mat_<T,TVT>();
			mat->_mat = std::make_shared<T>(info.at<int>(0), info.at<int>(1));

			mat->Wrap(info.Holder());
			info.GetReturnValue().Set(info.Holder());
		}
		static POLY_METHOD(New_rows_cols_value		){
			auto mat = new Mat_<T,TVT>();
			mat->_mat = std::make_shared<T>(info.at<int>(0), info.at<int>(1), info.at<TCT>(2));

			mat->Wrap(info.Holder());
			info.GetReturnValue().Set(info.Holder());
		}
		static POLY_METHOD(New_size					){
			auto mat = new Mat_<T,TVT>();
			mat->_mat = std::make_shared<T>(*info.at<Size*>(0)->_size);

			mat->Wrap(info.Holder());
			info.GetReturnValue().Set(info.Holder());
		}
		static POLY_METHOD(New_size_value			){
			auto mat = new Mat_<T,TVT>();
			auto size = *info.at<Size*>(0)->_size;
			auto value = *value_adapter<std::remove_reference< TVT>::type,std::remove_reference<TVAL>::type>::from(info.at<TVT>(1));
			mat->_mat = std::make_shared<T>(size,value );

			mat->Wrap(info.Holder());
			info.GetReturnValue().Set(info.Holder());
		}
		static POLY_METHOD(New_rows_cols_data		){
			auto mat = new Mat_<T,TVT>();

			auto srcdata = *info.at<std::shared_ptr<std::vector<TVT>>>(2);

			mat->_mat = std::make_shared<T>(info.at<int>(0), info.at<int>(1));

			for (auto i = 0; i < srcdata.size(); i++) {
				auto value = *value_adapter<std::remove_reference< TVT>::type, TVAL>::from(srcdata[i]);
				mat->_mat->at<TVAL>(i) = value;
			}


			mat->Wrap(info.Holder());
			info.GetReturnValue().Set(info.Holder());
		}
		static POLY_METHOD(New_matexpr				){

			auto mat = new Mat_<T, TVT>();
			mat->_mat = std::make_shared<T>(*info.at<MatExpr*>(0)->_matExpr);

			mat->Wrap(info.Holder());
			info.GetReturnValue().Set(info.Holder());
		}
		static POLY_METHOD(New_vec					){throw std::exception("not implemented");}
		static POLY_METHOD(zeros_rows_cols			){
			auto mat = new Mat_<T, TVT>();
			mat->_mat = std::make_shared<T>(T::zeros(info.at<int>(0), info.at<int>(1)));
			
			info.SetReturnValue(mat);
		}
		static POLY_METHOD(zeros_size				){
			auto mat = new Mat_<T, TVT>();
			mat->_mat = std::make_shared<T>(T::zeros(*info.at<Size*>(0)->_size));

			info.SetReturnValue(mat);
		}
		static POLY_METHOD(zeros_ndims				){throw std::exception("not implemented");}
		static POLY_METHOD(ones_rows_cols			){
			auto mat = new Mat_<T, TVT>();
			mat->_mat = std::make_shared<T>(T::ones(info.at<int>(0), info.at<int>(1)));

			info.SetReturnValue(mat);

		}
		static POLY_METHOD(ones_size				){
			auto mat = new Mat_<T, TVT>();
			mat->_mat = std::make_shared<T>(T::ones(*info.at<Size*>(0)->_size));

			info.SetReturnValue(mat);
		}
		static POLY_METHOD(ones_ndims				){throw std::exception("not implemented");}
		static POLY_METHOD(eye_rows_cols			){
			auto mat = new Mat_<T, TVT>();
			mat->_mat = std::make_shared<T>(T::eye(info.at<int>(0), info.at<int>(1)));

			info.SetReturnValue(mat);
		}
		static POLY_METHOD(eye_size					){
			auto mat = new Mat_<T, TVT>();
			mat->_mat = std::make_shared<T>(T::eye(*info.at<Size*>(0)->_size));

			info.SetReturnValue(mat);
		}
		static POLY_METHOD(create_rows_cols_type	){throw std::exception("not implemented");}
		static POLY_METHOD(create_size_type			){throw std::exception("not implemented");}
		static POLY_METHOD(create_ndims_type		){throw std::exception("not implemented");}
		static POLY_METHOD(create_rows_cols			){throw std::exception("not implemented");}
		static POLY_METHOD(create_size				){throw std::exception("not implemented");}
		static POLY_METHOD(create_ndims				){throw std::exception("not implemented");}
		static POLY_METHOD(Element_idx0				){throw std::exception("not implemented");}
		static POLY_METHOD(Element_idx0_idx1		){throw std::exception("not implemented");}
		static POLY_METHOD(Element_idx0_idx1_idx2	){throw std::exception("not implemented");}
		static POLY_METHOD(op_Addition_mat_ 		){throw std::exception("not implemented");}
		static POLY_METHOD(op_Addition_scalar		){throw std::exception("not implemented");}
		static POLY_METHOD(op_Addition_double		){throw std::exception("not implemented");}
		static POLY_METHOD(op_Substraction_mat_ 	){throw std::exception("not implemented");}
		static POLY_METHOD(op_Substraction_scalar	){throw std::exception("not implemented");}
		static POLY_METHOD(op_Substraction_double	){throw std::exception("not implemented");}
		static POLY_METHOD(op_Multiplication_mat_ 	){throw std::exception("not implemented");}
		static POLY_METHOD(op_Multiplication_scalar	){throw std::exception("not implemented");}
		static POLY_METHOD(op_Multiplication_double	){throw std::exception("not implemented");}
		static POLY_METHOD(op_Division_mat_ 		){throw std::exception("not implemented");}
		static POLY_METHOD(op_Division_scalar		){throw std::exception("not implemented");}
		static POLY_METHOD(op_Division_double		){throw std::exception("not implemented");}
		static POLY_METHOD(op_And_mat_ 				){throw std::exception("not implemented");}
		static POLY_METHOD(op_And_scalar			){throw std::exception("not implemented");}
		static POLY_METHOD(op_And_double			){throw std::exception("not implemented");}
		static POLY_METHOD(op_Or_mat_ 				){throw std::exception("not implemented");}
		static POLY_METHOD(op_Or_scalar				){throw std::exception("not implemented");}
		static POLY_METHOD(op_Or_double				){throw std::exception("not implemented");}
		static POLY_METHOD(op_Xor_mat_ 				){throw std::exception("not implemented");}
		static POLY_METHOD(op_Xor_scalar			){throw std::exception("not implemented");}
		static POLY_METHOD(op_Xor_double			){throw std::exception("not implemented");}
		static POLY_METHOD(op_BinaryNot				){throw std::exception("not implemented");}






};


//declare variables
template <typename T, typename TVT>
Nan::Persistent<FunctionTemplate> Mat_<T,TVT>::constructor;

template <typename T, typename TVT>
std::string Mat_<T, TVT>::name;

namespace Mat_Init {
	void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
}

#endif