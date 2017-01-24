#include "core.h"
#include "Matrix.h"
#include "UMatrix.h"
#include "SparseMat.h"
#include "types/TermCriteria.h"

#include "core/PCA.h"
#include "core/LDA.h"
#include "core/SVD.h"
#include "core/RNG.h"
#include "core/RNG_MT19937.h"

#include "core/opengl.h"

#include "core/Algorithm.h"

#include "core/RNG.h"
#include "core/RNG_MT19937.h"

#include "core/ConjGradSolver.h"
#include "core/DownhillSolver.h"
#include "core/MinProblemSolver.h"

#include "types/Scalar.h"

namespace core_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("core_general_callback is empty");
		}
		return overload->execute("core", info);
	}
}

//template <T, <template T1>>
//void x() {
//
//}
//
//std::function<void(typename... args)> xx ?
//
//template <typename FUNC, typename ...args>
//void call(args...ts) {
//	auto farguments;
//	void{ (farguments.push_back(ts),1)... };
//
//	FUNC({ args... });
//
//}

//template of template?


void
core::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	core_general_callback::overload = overload;

	PCA::Init(target, overload);
	LDA::Init(target, overload);
	SVD::Init(target, overload);
	Algorithm::Init(target, overload);

	RNG::Init(target, overload);
	RNG_MT19937::Init(target, overload);

	opengl::Init(target, overload);
    //export interface IException //: public std::exception
    //{
    //  
	//
    //    what(): string;
    //    //virtual const char *what() const throw();
    //    formatMessage(): void;
    //    
	//
    //    msg : string; ///< the formatted error message
	//
    //    code : _st.int; ///< error code @see CVStatus
    //    err : string; ///< error description
    //    func : string; ///< function name. Available only when the compiler supports getting it
    //    file : string; ///< source file name where the error has occured
    //    line : _st.int; ///< line number in the source file where the error has occured
    //}
	//
    //    export interface IExceptionStatic {
    //        new (_code: _st.int, _err: string, _func: string, _file: string, _line: _st.int): IException;
    //    }

    
//    export interface Ierror {
//        (exc: IException): void;
//    }

//export var error: Ierror = alvision_module.error;

    //CV_EXPORTS void error( const Exception& exc );


	auto SortFlags = CreateNamedObject(target, "SortFlags");
	SetObjectProperty(SortFlags, "SORT_EVERY_ROW", 0);
	SetObjectProperty(SortFlags, "SORT_EVERY_COLUMN",1);
	SetObjectProperty(SortFlags, "SORT_ASCENDING", 0);
	SetObjectProperty(SortFlags, "SORT_DESCENDING", 16);
	overload->add_type_alias("SortFlags", "int");


	auto CovarFlags = CreateNamedObject(target, "CovarFlags");
	SetObjectProperty(CovarFlags, "COVAR_SCRAMBLED", 0);
	SetObjectProperty(CovarFlags, "COVAR_NORMAL", 1);
	SetObjectProperty(CovarFlags, "COVAR_USE_AVG", 2);
	SetObjectProperty(CovarFlags, "COVAR_SCALE", 4);
	SetObjectProperty(CovarFlags, "COVAR_ROWS", 8);
	SetObjectProperty(CovarFlags, "COVAR_COLS", 16);
	overload->add_type_alias("CovarFlags", "int");


	auto KmeansFlags = CreateNamedObject(target, "KmeansFlags");
	SetObjectProperty(KmeansFlags, "KMEANS_RANDOM_CENTERS", 0);
	SetObjectProperty(KmeansFlags, "KMEANS_PP_CENTERS", 2);
	SetObjectProperty(KmeansFlags, "KMEANS_USE_INITIAL_LABELS", 1);
	overload->add_type_alias("KmeansFlags", "int");


	auto LineTypes = CreateNamedObject(target, "LineTypes");
	SetObjectProperty(LineTypes, "FILLED", -1);
	SetObjectProperty(LineTypes, "LINE_4", 4);
	SetObjectProperty(LineTypes, "LINE_8", 8);
	SetObjectProperty(LineTypes, "LINE_AA", 16);
	overload->add_type_alias("LineTypes", "int");

	auto HersheyFonts = CreateNamedObject(target, "HersheyFonts");
	SetObjectProperty(HersheyFonts, "FONT_HERSHEY_SIMPLEX", 0);
	SetObjectProperty(HersheyFonts, "FONT_HERSHEY_PLAIN", 1);
	SetObjectProperty(HersheyFonts, "FONT_HERSHEY_DUPLEX", 2);
	SetObjectProperty(HersheyFonts, "FONT_HERSHEY_COMPLEX", 3);
	SetObjectProperty(HersheyFonts, "FONT_HERSHEY_TRIPLEX", 4);
	SetObjectProperty(HersheyFonts, "FONT_HERSHEY_COMPLEX_SMALL", 5);
	SetObjectProperty(HersheyFonts, "FONT_HERSHEY_SCRIPT_SIMPLEX", 6);
	SetObjectProperty(HersheyFonts, "FONT_HERSHEY_SCRIPT_COMPLEX", 7);
	SetObjectProperty(HersheyFonts, "FONT_ITALIC", 16);
	overload->add_type_alias("HersheyFonts", "int");

	auto ReduceTypes = CreateNamedObject(target, "ReduceTypes");
	SetObjectProperty(ReduceTypes, "REDUCE_SUM", 0);
	SetObjectProperty(ReduceTypes, "REDUCE_AVG", 1);
	SetObjectProperty(ReduceTypes, "REDUCE_MAX", 2);
	SetObjectProperty(ReduceTypes, "REDUCE_MIN", 3);
	overload->add_type_alias("ReduceTypes", "int");


	overload->addOverload("core", "", "swap", {make_param<Matrix*>("a",Matrix::name), make_param<Matrix*>("b",Matrix::name)}, swap_mat);
	Nan::SetMethod(target, "swap", core_general_callback::callback);
	overload->addOverload("core", "", "swap", { make_param<UMatrix*>("a",UMatrix::name), make_param<UMatrix*>("b",UMatrix::name) }, swap_umat);




    /** @brief Swaps two matrices
    */
    //export interface Iswap {
    //    (a: _mat.Mat, b: _mat.Mat): void;
    //    (a: _mat.UMat, b: _mat.UMat): void;
    //}
	//
    //export var swap: Iswap = alvision_module.swap;

    //CV_EXPORTS void swap(Mat & a, Mat & b);
    /** @overload */
    //CV_EXPORTS void swap(UMat & a, UMat & b);

  

	overload->addOverload("core", "", "borderInterpolate", {make_param<int>("p","int"), make_param<int>("len","int"), make_param<int>("borderType","int")}, borderInterpolate);
	Nan::SetMethod(target, "borderInterpolate", core_general_callback::callback);
    //export interface IborderInterpolate {
    //    (p: _st.int, len: _st.int , borderType : _st.int): _st.int;
    //}
	//
    //export var borderInterpolate: IborderInterpolate = alvision_module.borderInterpolate;

    //CV_EXPORTS_W int borderInterpolate(int p, int len, int borderType);

  

	overload->addOverload("core", "", "copyMakeBorder", {
			make_param<IOArray*>("src",IOArray::name),
			make_param<IOArray*>("dst",IOArray::name),
			make_param<int>("top","int"),
			make_param<int>("bottom","int"),
			make_param<int>("left","int"),
			make_param<int>("right","int"),
			make_param<int>("borderType","BorderTypes"),
			make_param<Scalar*>("value","Scalar",Scalar::create())
	}, copyMakeBorder);
	Nan::SetMethod(target, "copyMakeBorder", core_general_callback::callback);

    //interface IcopyMakeBorder {
    //    (src: _st.InputArray, dst: _st.OutputArray,
    //        top: _st.int, bottom: _st.int, left: _st.int, right: _st.int,
    //        borderType: _base.BorderTypes, value?: _types.Scalar/* = Scalar()*/): void;
    //}
	//
    //export var copyMakeBorder: IcopyMakeBorder = alvision_module.copyMakeBorder;

    
    

	overload->addOverload("core", "", "add", {
		make_param<IOArray*>("src1","IOArray"),
		make_param<IOArray*>("src2","IOArray"),
		make_param<IOArray*>("dst","IOArray"),
		make_param<IOArray*>("mask","IOArray",IOArray::noArray()),
		make_param<int>("dtype","int", -1)
	}, add);
	Nan::SetMethod(target, "add", core_general_callback::callback);
    //interface Iadd {
    //    (src1: _st.InputArray, src2: _st.InputArray, dst: _st.OutputArray ,
    //        mask?: _st.InputArray /* = noArray()*/, dtype?: _st.int /* = -1*/): void;
    //}
	//
    //export var add: Iadd = alvision_module.add;


  

	overload->addOverload("core", "", "subtract", {
		make_param<IOArray*>("src1","IOArray"),
		make_param<IOArray*>("src2","IOArray"),
		make_param<IOArray*>("dst","IOArray"),
		make_param<IOArray*>("mask","IOArray",IOArray:: noArray()),
		make_param<int>("dtype","int",-1)
	
	}, subtract);
	Nan::SetMethod(target, "subtract", core_general_callback::callback);
//    interface Isubtract {
//        (src1: _st.InputArray, src2: _st.InputArray, dst: _st.OutputArray ,
//            mask?: _st.InputArray /* = noArray()*/, dtype?: _st.int /* = -1*/): void;
//    }
//
//export var subtract: Isubtract = alvision_module.subtract;

    

    

overload->addOverload("core", "", "multiply", {
	make_param<IOArray*>("src1","IOArray"),
	make_param<IOArray*>("src2","IOArray"),
	make_param<IOArray*>( "dst","IOArray"),
	make_param<double>("scale","double", 1),
	make_param<int>("dtype","int",-1 )
}, multiply);
Nan::SetMethod(target, "multiply", core_general_callback::callback);

//interface Imultiply {
//    (src1: _st.InputArray | Number, src2: _st.InputArray | Number,
//        dst: _st.OutputArray, scale?: _st.double /* = 1 */, dtype?: _st.int /* = -1 */): void;
//}
//
//export var multiply: Imultiply = alvision_module.multiply;

   
overload->addOverload("core", "", "divide", {

		make_param<IOArray*>("src1","IOArray"),
		make_param<IOArray*>("src2","IOArray"),
		make_param<IOArray*>( "dst","IOArray"),
		make_param<double>("scale","double", 1 ),
		make_param<int>("dtype","int",-1 )


}, divide_mat);
Nan::SetMethod(target, "divide", core_general_callback::callback);

overload->addOverload("core", "", "divide", {

		make_param < double > ("scale","double"),
		make_param<IOArray*>("src2","IOArray"),
		make_param<IOArray*>("dst","IOArray"),
		make_param<int>("dtype","int",  -1 )

}, divide_scale);


//interface Idivide {
//    (src1: _st.InputArray, src2: _st.InputArray, dst: _st.OutputArray,
//        scale?: _st.double /* = 1 */, dtype?: _st.int /* = -1 */): void;
//    (scale: _st.double, src2: _st.InputArray,
//        dst: _st.OutputArray, dtype?: _st.int /* = -1 */): void;
//}
//
//export var divide: Idivide = alvision_module.divide;

    

overload->addOverload("core", "", "scaleAdd", {
		make_param<IOArray*>("src1","IOArray"),
		make_param<double>("alpha","double"),
		make_param<IOArray*>("src2","IOArray"),
		make_param<IOArray*>("dst","IOArray")
}, scaleAdd);
Nan::SetMethod(target, "scaleAdd", core_general_callback::callback);
//interface IscaleAdd {
//    (src1: _st.InputArray, alpha: _st.double, src2: _st.InputArray, dst: _st.OutputArray): void;
//}
//
//export var scaleAdd: IscaleAdd = alvision_module.scaleAdd;

   

overload->addOverload("core", "", "addWeighted", {
		make_param<IOArray*>("src1","IOArray"),
		make_param<double>("alpha","double"),
		make_param<IOArray*>("src2","IOArray"),
		make_param<double>("beta","double"),
		make_param<double>("gamma","double"),
		make_param<IOArray*>("dst","IOArray"),
		make_param<int>("dtype","int", -1 )
}, addWeighted);
Nan::SetMethod(target, "addWeighted", core_general_callback::callback);
//interface IaddWeighted {
//    (src1: _st.InputArray, alpha: _st.double, src2: _st.InputArray,
//        beta: _st.double, gamma: _st.double, dst: _st.OutputArray, dtype?: _st.int /* = -1 */): void;
//}
//
//export var addWeighted: IaddWeighted = alvision_module.addWeighted;

  

overload->addOverload("core", "", "convertScaleAbs", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray"),
		make_param<double>("alpha","double", 1),
		make_param<double>("beta","double", 0)
}, convertScaleAbs);
Nan::SetMethod(target, "convertScaleAbs", core_general_callback::callback);
//interface IconvertScaleAbs{
//    (src: _st.InputArray, dst: _st.OutputArray,
//        alpha?: _st.double /*= 1*/, beta?: _st.double /*= 0*/): void;
//}
//
//export var convertScaleAbs: IconvertScaleAbs = alvision_module.convertScaleAbs;

  

overload->addOverload("core", "", "LUT", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("lut","IOArray"),
		make_param<IOArray*>("dst","IOArray")
}, LUT);
Nan::SetMethod(target, "LUT", core_general_callback::callback);


//interface ILUT {
//    (src: _st.InputArray, lut: _st.InputArray, dst: _st.OutputArray): void;
//}
//
//export var LUT: ILUT = alvision_module.LUT;

   

overload->addOverload("core", "", "sum", {
	make_param<IOArray*>("src","IOArray")
}, sum);
Nan::SetMethod(target, "sum", core_general_callback::callback);

//interface Isum {
//    (src: _st.InputArray): _types.Scalar;
//}
//
//export var sum: Isum = alvision_module.sum;

    //CV_EXPORTS_AS(sumElems) Scalar sum(src : _st.InputArray);

 

overload->addOverload("core", "", "countNonZero", {
	make_param<IOArray*>("src","IOArray")
}, countNonZero);
Nan::SetMethod(target, "countNonZero", core_general_callback::callback);

//interface IcountNonZero{
//    (src: _st.InputArray): _st.int;
//}
//
//export var countNonZero: IcountNonZero = alvision_module.countNonZero;

    //CV_EXPORTS_W int countNonZero(src : _st.InputArray );

   
overload->addOverload("core", "", "findNonZero", {
	make_param<IOArray*>("src","IOArray"),
	make_param<IOArray*>("idx","IOArray")
}, findNonZero);
Nan::SetMethod(target, "findNonZero", core_general_callback::callback);

//    interface IfindNonZero {
//        (src: _st.InputArray, idx: _st.OutputArray): void;
//    }
//
//export var findNonZero: IfindNonZero = alvision_module.findNonZero;

  

overload->addOverload("core", "", "mean", {
	make_param<IOArray*>( "src","IOArray"),
	make_param<IOArray*>("mask","IOArray",IOArray:: noArray())
}, mean);
Nan::SetMethod(target, "mean", core_general_callback::callback);

//interface Imean {
//    (src: _st.InputArray, mask?: _st.InputArray /* = noArray()*/): _types.Scalar;
//}
//
//export var mean: Imean = alvision_module.mean;

    //CV_EXPORTS_W Scalar mean(src : _st.InputArray, mask : _st.InputArray /* = noArray()*/);

   

overload->addOverload("core", "", "meanStdDev", {
		make_param<IOArray*>(   "src","IOArray"),
		make_param<IOArray*>(  "mean","IOArray"),
		make_param<IOArray*>("stddev","IOArray"),
		make_param<IOArray*>(  "mask","IOArray",IOArray:: noArray())
}, meanStdDev);
Nan::SetMethod(target, "meanStdDev", core_general_callback::callback);

//interface ImeanStdDev{
//    (src: _st.InputArray, mean: _st.OutputArray, stddev: _st.OutputArray,
//    mask?: _st.InputArray /* = noArray()*/): void;
//}
//
//export var meanStdDev: ImeanStdDev = alvision_module.meanStdDev;

  

overload->addOverload("core", "", "norm", {
		make_param<IOArray*>("src1","IOArray"),
		make_param<int>("normType","NormTypes",cv::NORM_L2),
		make_param<IOArray*>("mask","IOArray",IOArray::noArray())
}, norm);

Nan::SetMethod(target, "norm", core_general_callback::callback);
overload->addOverload("core", "", "norm", {
		make_param<IOArray*>("src1","IOArray"),
		make_param<IOArray*>("src2","IOArray"), 
		make_param<int>("normType","NormTypes",cv::NORM_L2),
		make_param<IOArray*>("mask","IOArray",IOArray::noArray())
}, norm_src2);

overload->addOverload("core", "", "norm", {
	make_param<SparseMat*>("src","SparseMat"),
	make_param<int>("normType","NormTypes")
}, norm_simple);



//interface Inorm {
//    (src1: _st.InputArray, normType?: _base.NormTypes /* = NORM_L2*/, mask?: _st.InputArray /* = noArray()*/): _st.double;
//    (src1: _st.InputArray, src2: _st.InputArray, normType?: _base.NormTypes /* = NORM_L2*/, mask?: _st.InputArray /* = noArray()*/): _st.double;
//    (src: _mat.SparseMat, normType: _base.NormTypes): _st.double;
//}
//
//export var norm: Inorm = alvision_module.norm;

    //CV_EXPORTS_W double norm(src1 : _st.InputArray, normType : _st.int /* = NORM_L2*/, mask : _st.InputArray /* = noArray()*/);

    //CV_EXPORTS double norm( const SparseMat& src, int normType );

    /** @brief computes PSNR image/video quality metric
    
    see http://en.wikipedia.org/wiki/Peak_signal-to-noise_ratio for details
    @todo document
      */

overload->addOverload("core", "", "PSNR", {
	make_param<IOArray*>("src1","IOArray"), 
	make_param<IOArray*>("src2","IOArray")
}, PSNR);

Nan::SetMethod(target, "PSNR", core_general_callback::callback);
//interface IPSNR {
//    (src1: _st.InputArray, src2: _st.InputArray): _st.double;
//}
//
//export var PSNR: IPSNR = alvision_module.PSNR;
    //CV_EXPORTS_W double PSNR(src1 : _st.InputArray, src2 : _st.InputArray);

  

overload->addOverload("core", "", "batchDistance", {
			make_param<IOArray*>("src1","IOArray"),
			make_param<IOArray*>("src2","IOArray"),
			make_param<IOArray*>("dist","IOArray"),
			make_param<int>("dtype","int"),
			make_param<IOArray*>("nidx","IOArray"),
			make_param<int>("normType","int",cv:: NORM_L2),
			make_param<int>("K","int",0),
			make_param<IOArray*>("mask","IOArray",IOArray:: noArray()),
			make_param<int>("update","int", 0),
			make_param<bool>("crosscheck","bool", false)
}, batchDistance);
Nan::SetMethod(target, "batchDistance", core_general_callback::callback);

//interface IbatchDistance{
//    (src1: _st.InputArray, src2: _st.InputArray,
//    dist : _st.OutputArray, dtype : _st.int, nidx : _st.OutputArray,
//    normType: _st.int /* = NORM_L2*/, K : _st.int /* = 0*/,
//    mask: _st.InputArray /* = noArray()*/, update : _st.int /* = 0*/,
//    crosscheck : boolean /*= false*/): void;
//}
//
//export var batchDistance: IbatchDistance = alvision_module.batchDistance;

    //CV_EXPORTS_W void batchDistance(src1 : _st.InputArray, src2 : _st.InputArray,
    //    dist : _st.OutputArray, dtype : _st.int, nidx : _st.OutputArray,
    //    normType : _st.int /* = NORM_L2*/, K : _st.int /* = 0*/,
    //    mask : _st.InputArray /* = noArray()*/, int update = 0,
    //    bool crosscheck = false);

   


overload->addOverload("core", "", "normalize", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray"),
		make_param<double>("alpha","double", 1),
		make_param<double>("beta","double", 0),
		make_param<int>("norm_type","int",cv:: NORM_L2),
		make_param<int>("dtype","int", -1 ),
		make_param<IOArray*>("mask","IOArray",IOArray:: noArray())
}, normalize);
Nan::SetMethod(target, "normalize", core_general_callback::callback);

overload->addOverload("core", "", "normalize", {
		make_param<SparseMat*>("src","SparseMat"),
		make_param<SparseMat*>("dst","SparseMat"), 
		make_param<double>("alpha","double"),
		make_param<int>("normType","int")
}, normalize_sparse);


//interface Inormalize {
//    (src: _st.InputArray, dst: _st.InputOutputArray, alpha: _st.double /*= 1*/, beta: _st.double /*= 0*/,
//        norm_type: _st.int  /*= NORM_L2*/, dtype: _st.int /* = -1 */, mask: _st.InputArray /* = noArray()*/): void;
//    (src: _mat.SparseMat, dst: _mat.SparseMat, alpha: _st.double, normType: _st.int): void;
//
//    <T>(v: _matx.Vec<T>): _matx.Vec<T>;
//}
//
//export var normalize: Inormalize = alvision_module.normalize;

    //CV_EXPORTS_W void normalize(src : _st.InputArray, Inputdst : _st.OutputArray, alpha : _st.double = 1, beta : _st.double = 0,
    //    int norm_type = NORM_L2, dtype : _st.int /* = -1 */, mask : _st.InputArray /* = noArray()*/);

 


//export interface IminMaxLoc {
//    (src: _st.InputArray, cb: (minVal: _st.double,maxVal: _st.double,minLoc: Array<_types.Point>,maxLoc: Array<_types.Point>)=> void, mask? : _st.InputArray /* = noArray()*/) : void;

//}

//export var minMaxLoc : IminMaxLoc = alvision_module.minMaxLoc;

    //CV_EXPORTS_W void minMaxLoc(src : _st.InputArray, CV_OUT double* minVal,
    //    CV_OUT double* maxVal = 0, CV_OUT Point* minLoc = 0,
    //    CV_OUT Point* maxLoc = 0, mask : _st.InputArray /* = noArray()*/);


  

overload->addOverload("core", "", "minMaxIdx", {
	make_param<IOArray*>("src","IOArray"),
	make_param<std::shared_ptr<or::Callback>>("cb","Function"),
	make_param<IOArray*>("mask","IOArray",IOArray:: noArray())
}, minMaxIdx);
Nan::SetMethod(target, "minMaxIdx", core_general_callback::callback);


//interface IminMaxIdx {
//    (src: _st.InputArray, cb: (minVal: _st.double, maxVal: _st.double /* = 0*/,
//        minIdx: Array<_st.int> /* = 0*/, maxIdx: Array<_st.int> /*= 0*/) =>void, mask? : _st.InputArray /* = noArray()*/) : void;
//}
//
//export var minMaxIdx: IminMaxIdx = alvision_module.minMaxIdx;

    //CV_EXPORTS void minMaxIdx(src : _st.InputArray, double * minVal, double * maxVal = 0,
    //    int * minIdx = 0, int * maxIdx = 0, mask : _st.InputArray /* = noArray()*/);

 
//export interface IminMaxLocCallback {
//    (minVal : _st.double,maxVal : _st.double, minIdx : _st.int/* = 0*/, maxIdx : _st.int /* = 0*/): void;
//}

overload->addOverload("core", "", "minMaxLoc", {
	make_param<SparseMat*>("a","SparseMat"),
	make_param<std::shared_ptr<or::Callback>>("cb","Function"),
}, minMaxLoc_sparse);

Nan::SetMethod(target, "minMaxLoc", core_general_callback::callback);
overload->addOverload("core", "", "minMaxLoc", {
	make_param<IOArray*>("src","IOArray"),
	make_param<std::shared_ptr<or::Callback>>("cb","Function"),
	make_param<IOArray*>("mask","IOArray",IOArray::noArray())
}, minMaxLoc);

//export interface IminMaxLoc {
//    (a: _mat.SparseMat, cb: (minVal: _st.double, maxVal: _st.double, minIdx: Array<_st.int>/* = 0*/, maxIdx: Array<_st.int> /* = 0*/) => void): void;
//
//    (src: _st.InputArray, cb: (minVal: _st.double, maxVal: _st.double, minLoc: Array<_types.Point>, maxLoc: Array<_types.Point>) => void, mask?: _st.InputArray /* = noArray()*/): void;
//}
//
//export var minMaxLoc: IminMaxLoc = alvision_module.minMaxLoc;

    //CV_EXPORTS void minMaxLoc(const SparseMat& a, double* minVal,
    //    double* maxVal, int* minIdx = 0, int * maxIdx = 0);

   

overload->addOverload("core", "", "reduce", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray"),
		make_param<int>("dim","int"),
		make_param<int>("rtype","ReduceTypes"),
		make_param<int>("dtype","int", -1 )

}, reduce);
Nan::SetMethod(target, "reduce", core_general_callback::callback);
//interface Ireduce {
//    (src: _st.InputArray, dst: _st.OutputArray, dim: _st.int, rtype: ReduceTypes | _st.int, dtype?: _st.int /* = -1 */): void;
//}
//
//export var reduce: Ireduce = alvision_module.reduce;

    //CV_EXPORTS_W void reduce(src : _st.InputArray, dst : _st.OutputArray, int dim, int rtype, dtype : _st.int /* = -1 */);

   

//export interface Imerge {
//    (mv: _mat.Mat, count: _st.size_t, dst: _st.OutputArray): void;
//}

//export var merge: Imerge = alvision_module.merge;

    //CV_EXPORTS void merge(mv : _mat.Mat, count : _st.size_t, dst : _st.OutputArray);

   

overload->addOverload("core", "", "merge", {
	make_param<IOArray*>("mv","IOArray"),
	make_param<IOArray*>("dst","IOArray")
}, merge_arr);
Nan::SetMethod(target, "merge", core_general_callback::callback);

overload->addOverload("core", "", "merge", {
	make_param<Matrix*>("mv","Mat"),
	make_param<int>("count","size_t"),
	make_param<IOArray*>("dst","IOArray")
}, merge_size);

//export interface Imerge {
//    (mv: _st.InputArrayOfArrays, dst: _st.OutputArray): void;
//
//    (mv: _mat.Mat, count: _st.size_t, dst: _st.OutputArray): void;
//}
//
//export var merge: Imerge = alvision_module.merge;

    //CV_EXPORTS_W void merge(mv : _st.InputArrayOfArrays, dst : _st.OutputArray);

  

//export interface Isplit {
//    (src: _mat.Mat, mvbegin: _mat.Mat): void;
//}

//export var split: Isplit = alvision_module.split;

    //CV_EXPORTS void split(src : _mat.Mat, mvbegin : _mat.Mat);



overload->addOverload("core", "", "split", {
	make_param<IOArray*>("m","IOArray"),
	make_param<IOArray*>("mv","IOArray")
}, split_array);
Nan::SetMethod(target, "split", core_general_callback::callback);
overload->addOverload("core", "", "split", {
	 make_param<Matrix*>("src","Mat"),
	 make_param<std::shared_ptr<std::vector<Matrix*>>>("mvbegin","Array<Mat>")
}, split_mat);

//export interface Isplit{
//    (m: _st.InputArray, mv: _st.OutputArrayOfArrays): void;
//
//	//Array size must match src.channels
//    (src: _mat.Mat, mvbegin: Array<_mat.Mat>): void;
//}
//
//export var split: Isplit = alvision_module.split;

    //CV_EXPORTS_W void split(m : _st.InputArray, mv : _st.OutputArrayOfArrays);

   

//overload->addOverload("core", "", "", {}, );

//export interface MixChannelsFromTo {
//    [id: number]: number;
//}

//export interface ImixChannels {
//    (src : Array< _mat.Mat> | _mat.Mat, nsrcs : _st.size_t, dst : Array<_mat.Mat> | _mat.Mat, ndsts : _st.size_t,
//        fromTo: MixChannelsFromTo, npairs: _st.size_t): void;
//    (src: Array<_mat.Mat> | _mat.Mat, dst: Array<_mat.Mat> | _mat.Mat,fromTo: MixChannelsFromTo): void;
//}

//export var mixChannels: ImixChannels = alvision_module.mixChannels;

    //CV_EXPORTS void mixChannels(src : _mat.Mat, nsrcs : _st.size_t, dst : _mat.Mat, ndsts : _st.size_t,
    //const int* fromTo, size_t npairs);

  

overload->addOverload("core", "", "mixChannels", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray"),
		make_param<std::shared_ptr<std::vector<int>>>("fromTo","Array<int>"),
		make_param<int>("npairs","size_t")
}, mixChannels_arr_npairs);

Nan::SetMethod(target, "mixChannels", core_general_callback::callback);

overload->addOverload("core", "", "mixChannels", {
	make_param<IOArray*>("src","IOArray"),
	make_param<IOArray*>("dst","IOArray"),
	make_param<std::shared_ptr<std::vector<int>>>("fromTo","Array<int>"),
}, mixChannels_arr);


overload->addOverload("core", "", "mixChannels", {
		make_param<std::shared_ptr<std::vector<Matrix*>>>("src","Array<Mat>"),
		make_param<int>("nsrcs","size_t"),
		make_param<std::shared_ptr<std::vector<Matrix*>>>("dst","Array<Mat>"),
		make_param<int>("ndsts","size_t"),
		make_param<std::shared_ptr<std::vector<int>>>("fromTo","Array<int>"),
		make_param<int>("npairs","size_t")
}, mixChannels_mat_npairs);


overload->addOverload("core", "", "mixChannels", {
		make_param<std::shared_ptr<std::vector<Matrix*>>>("src","Array<Mat>"),
		make_param<std::shared_ptr<std::vector<Matrix*>>>("dst","Array<Mat>"),
		make_param<std::shared_ptr<std::vector<int>>>("fromTo","Array<int>")
}, mixChannels_mat);


//    export interface ImixChannels{
//(src: _st.InputArrayOfArrays, dst : _st.InputOutputArrayOfArrays, fromTo : MixChannelsFromTo, npairs : _st.size_t) : void;
//(src : _st.InputArrayOfArrays, dst : _st.InputOutputArrayOfArrays, fromTo : MixChannelsFromTo) : void;
//
//(src : Array<_mat.Mat>, nsrcs : _st.size_t, dst : Array<_mat.Mat>, ndsts : _st.size_t, fromTo : MixChannelsFromTo, npairs : _st.size_t) : void;
//(src : Array<_mat.Mat>, dst : Array<_mat.Mat>, fromTo : MixChannelsFromTo) : void;
//}
//
//export var mixChannels: ImixChannels = alvision_module.mixChannels;

    //CV_EXPORTS void mixChannels(src : _st.InputArrayOfArrays, InputOutputArrayOfArrays dst,
    //                        const int* fromTo, size_t npairs);

  

overload->addOverload("core", "", "extractChannel", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray"),
		make_param<int>("coi","int")
}, extractChannel);

Nan::SetMethod(target, "extractChannel", core_general_callback::callback);

//interface IextractChannel {
//    (src: _st.InputArray, dst: _st.OutputArray, coi: _st.int): void;
//}
//
//export var extractChannel: IextractChannel = alvision_module.extractChannel;

    //CV_EXPORTS_W void extractChannel(src : _st.InputArray, dst : _st.OutputArray, coi : _st.int);

 

overload->addOverload("core", "", "insertChannel", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray"),
		make_param<int>("coi","int")
}, insertChannel);

Nan::SetMethod(target, "insertChannel", core_general_callback::callback);

//interface IinsertChannel {
//    (src: _st.InputArray, dst: _st.InputOutputArray, coi : _st.int): void;
//}
//
//export var insertChannel: IinsertChannel = alvision_module.insertChannel;
    //CV_EXPORTS_W void insertChannel(src : _st.InputArray, Inputdst : _st.OutputArray, coi : _st.int);

   
overload->addOverload("core", "", "flip", {
	make_param<IOArray*>("src","IOArray"),
	make_param<IOArray*>("dst","IOArray"), 
	make_param<int>("flipCode","int")
}, flip);

Nan::SetMethod(target, "flip", core_general_callback::callback);

//interface Iflip {
//	(src : _st.InputArray, dst : _st.OutputArray, flipCode : _st.int) : void;
//}
//
//export var flip: Iflip = alvision_module.flip;
    //CV_EXPORTS_W void flip(src : _st.InputArray, dst : _st.OutputArray, flipCode : _st.int);


overload->addOverload("core", "", "repeat", {
		make_param<IOArray*>("src","IOArray"),
		make_param<int>("ny","int"),
		make_param<int>("nx","int"),
		make_param<IOArray*>("dst","IOArray")
}, repeat);
Nan::SetMethod(target, "repeat", core_general_callback::callback);

overload->addOverload("core", "", "repeat", {
		make_param<Matrix*>("src","Mat"),
		make_param<int>("ny","int"), 
		make_param<int>("nx","int")
}, repeat_mat);


//interface Irepeat {
//    (src: _st.InputArray, ny : _st.int, nx : _st.int, dst: _st.OutputArray): void;
//    (src : _mat.Mat , ny : _st.int, nx : _st.int): _mat.Mat;
//}
//
//export var repeat: Irepeat = alvision_module.repeat;

    //CV_EXPORTS_W void repeat(src : _st.InputArray, ny : _st.int, nx : _st.int, dst : _st.OutputArray);


overload->addOverload("core", "", "hconcat", {
		make_param<std::shared_ptr<std::vector<Matrix*>>>("src","Array<Mat>"),
		make_param<int>("nsrc","size_t"),
		make_param<IOArray*>("dst","IOArray")
}, hconcat_mat);

Nan::SetMethod(target, "hconcat", core_general_callback::callback);

overload->addOverload("core", "", "hconcat", {
		make_param<IOArray*>("src1","IOArray"),
		make_param<IOArray*>("src2","IOArray"), 
		make_param<IOArray*>( "dst","IOArray")
}, hconcat_inputarray);

overload->addOverload("core", "", "hconcat", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray")
}, hconcat_arrayorarrays);

//interface Ihconcat {
//    (src : Array<_mat.Mat>, nsrc : _st.size_t, dst: _st.OutputArray): void;
//    (src1: _st.InputArray, src2: _st.InputArray, dst: _st.OutputArray): void;
//    (src : _st.InputArrayOfArrays, dst: _st.OutputArray): void;
//}
//
//export var hconcat: Ihconcat = alvision_module.hconcat;


overload->addOverload("core", "", "vconcat", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray")
}, vconcat_array);

Nan::SetMethod(target, "vconcat", core_general_callback::callback);

overload->addOverload("core", "", "vconcat", {
		make_param<IOArray*>("src1","IOArray"),
		make_param<IOArray*>("src2","IOArray"), 
		make_param<IOArray*>( "dst","IOArray")
}, vconcat_2src);

overload->addOverload("core", "", "vconcat", {
		make_param<std::shared_ptr<std::vector<IOArray*>>>("src", "Array<Mat>"),
		make_param<int>("nsrc","size_t"),
		make_param<IOArray*>("dst","IOArray")
}, vconcat_matrix_array);

//export interface Ivconcat {
//    (src: _st.InputArrayOfArrays, dst: _st.OutputArray): void;
//
//    (src1: _st.InputArray, src2: _st.InputArray, dst: _st.OutputArray): void;
//
//    (src: Array<_mat.Mat>, nsrc: _st.size_t, dst: _st.OutputArray): void;
//}
//
//export var vconcat: Ivconcat = alvision_module.vconcat;

    //CV_EXPORTS_W void vconcat(src : _st.InputArrayOfArrays, dst : _st.OutputArray);

    /** @brief computes bitwise conjunction of the two arrays (dst = src1 & src2)
    Calculates the per-element bit-wise conjunction of two arrays or an
    array and a scalar.
    
    The function calculates the per-element bit-wise logical conjunction for:
    *   Two arrays when src1 and src2 have the same size:
        \f[\texttt{dst} (I) =  \texttt{src1} (I)  \wedge \texttt{src2} (I) \quad \texttt{if mask} (I) \ne0\f]
    *   An array and a scalar when src2 is constructed from Scalar or has
        the same number of elements as `src1.channels()`:
        \f[\texttt{dst} (I) =  \texttt{src1} (I)  \wedge \texttt{src2} \quad \texttt{if mask} (I) \ne0\f]
    *   A scalar and an array when src1 is constructed from Scalar or has
        the same number of elements as `src2.channels()`:
        \f[\texttt{dst} (I) =  \texttt{src1}  \wedge \texttt{src2} (I) \quad \texttt{if mask} (I) \ne0\f]
    In case of floating-point arrays, their machine-specific bit
    representations (usually IEEE754-compliant) are used for the operation.
    In case of multi-channel arrays, each channel is processed
    independently. In the second and third cases above, the scalar is first
    converted to the array type.
    @param src1 first input array or a scalar.
    @param src2 second input array or a scalar.
    @param dst output array that has the same size and type as the input
    arrays.
    @param mask optional operation mask, 8-bit single channel array, that
    specifies elements of the output array to be changed.
    */

overload->addOverload("core", "", "bitwise_and", {
		make_param<IOArray*>("src1","IOArray"),
		make_param<IOArray*>("src2","IOArray"),
		make_param<IOArray*>( "dst","IOArray"), 
		make_param<IOArray*>("mask","IOArray",IOArray:: noArray())
}, bitwise_and);

Nan::SetMethod(target, "bitwise_and", core_general_callback::callback);

//export interface Ibitwise_and{
//    (src1: _st.InputArray, src2: _st.InputArray, dst: _st.OutputArray, mask?: _st.InputArray /* = noArray()*/): void;
//}
//
//export var bitwise_and: Ibitwise_and = alvision_module.bitwise_and;

    //CV_EXPORTS_W void bitwise_and(src1 : _st.InputArray, src2 : _st.InputArray,
    //    dst : _st.OutputArray, mask : _st.InputArray /* = noArray()*/);

    /** @brief Calculates the per-element bit-wise disjunction of two arrays or an
    array and a scalar.
    
    The function calculates the per-element bit-wise logical disjunction for:
    *   Two arrays when src1 and src2 have the same size:
        \f[\texttt{dst} (I) =  \texttt{src1} (I)  \vee \texttt{src2} (I) \quad \texttt{if mask} (I) \ne0\f]
    *   An array and a scalar when src2 is constructed from Scalar or has
        the same number of elements as `src1.channels()`:
        \f[\texttt{dst} (I) =  \texttt{src1} (I)  \vee \texttt{src2} \quad \texttt{if mask} (I) \ne0\f]
    *   A scalar and an array when src1 is constructed from Scalar or has
        the same number of elements as `src2.channels()`:
        \f[\texttt{dst} (I) =  \texttt{src1}  \vee \texttt{src2} (I) \quad \texttt{if mask} (I) \ne0\f]
    In case of floating-point arrays, their machine-specific bit
    representations (usually IEEE754-compliant) are used for the operation.
    In case of multi-channel arrays, each channel is processed
    independently. In the second and third cases above, the scalar is first
    converted to the array type.
    @param src1 first input array or a scalar.
    @param src2 second input array or a scalar.
    @param dst output array that has the same size and type as the input
    arrays.
    @param mask optional operation mask, 8-bit single channel array, that
    specifies elements of the output array to be changed.
    */

overload->addOverload("core", "", "bitwise_or", {
	make_param<IOArray*>("src1","IOArray"),
	make_param<IOArray*>("src2","IOArray"),
	make_param<IOArray*>("dst","IOArray"),
	make_param<IOArray*>("mask","IOArray",IOArray::noArray())
}, bitwise_or);
Nan::SetMethod(target, "bitwise_or", core_general_callback::callback);


//export interface Ibitwise_or {
//    (src1: _st.InputArray, src2: _st.InputArray,dst: _st.OutputArray, mask?: _st.InputArray /* = noArray()*/): void;
//}
//
//export var bitwise_or: Ibitwise_or = alvision_module.bitwise_or;

    //CV_EXPORTS_W void bitwise_or(src1 : _st.InputArray, src2 : _st.InputArray,
    //    dst : _st.OutputArray, mask : _st.InputArray /* = noArray()*/);

    /** @brief Calculates the per-element bit-wise "exclusive or" operation on two
    arrays or an array and a scalar.
    
    The function calculates the per-element bit-wise logical "exclusive-or"
    operation for:
    *   Two arrays when src1 and src2 have the same size:
        \f[\texttt{dst} (I) =  \texttt{src1} (I)  \oplus \texttt{src2} (I) \quad \texttt{if mask} (I) \ne0\f]
    *   An array and a scalar when src2 is constructed from Scalar or has
        the same number of elements as `src1.channels()`:
        \f[\texttt{dst} (I) =  \texttt{src1} (I)  \oplus \texttt{src2} \quad \texttt{if mask} (I) \ne0\f]
    *   A scalar and an array when src1 is constructed from Scalar or has
        the same number of elements as `src2.channels()`:
        \f[\texttt{dst} (I) =  \texttt{src1}  \oplus \texttt{src2} (I) \quad \texttt{if mask} (I) \ne0\f]
    In case of floating-point arrays, their machine-specific bit
    representations (usually IEEE754-compliant) are used for the operation.
    In case of multi-channel arrays, each channel is processed
    independently. In the 2nd and 3rd cases above, the scalar is first
    converted to the array type.
    @param src1 first input array or a scalar.
    @param src2 second input array or a scalar.
    @param dst output array that has the same size and type as the input
    arrays.
    @param mask optional operation mask, 8-bit single channel array, that
    specifies elements of the output array to be changed.
    */

overload->addOverload("core", "", "bitwise_xor", {
	make_param<IOArray*>("src1","IOArray"),
	make_param<IOArray*>("src2","IOArray"),
	make_param<IOArray*>("dst","IOArray"),
	make_param<IOArray*>("mask","IOArray",IOArray::noArray())
}, bitwise_xor);
Nan::SetMethod(target, "bitwise_xor", core_general_callback::callback);
//export interface Ibitwise_xor {
//    (src1: _st.InputArray, src2: _st.InputArray,
//        dst: _st.OutputArray, mask?: _st.InputArray /* = noArray()*/): void;
//}
//
//export var bitwise_xor: Ibitwise_xor = alvision_module.bitwise_xor;

    //CV_EXPORTS_W void bitwise_xor(src1 : _st.InputArray, src2 : _st.InputArray,
    //    dst : _st.OutputArray, mask : _st.InputArray /* = noArray()*/);

    /** @brief  Inverts every bit of an array.
    
    The function calculates per-element bit-wise inversion of the input
    array:
    \f[\texttt{dst} (I) =  \neg \texttt{src} (I)\f]
    In case of a floating-point input array, its machine-specific bit
    representation (usually IEEE754-compliant) is used for the operation. In
    case of multi-channel arrays, each channel is processed independently.
    @param src input array.
    @param dst output array that has the same size and type as the input
    array.
    @param mask optional operation mask, 8-bit single channel array, that
    specifies elements of the output array to be changed.
    */

overload->addOverload("core", "", "bitwise_not", {
	make_param<IOArray*>("src","IOArray"),
	make_param<IOArray*>("dst","IOArray"),
	make_param<IOArray*>("mask","IOArray",IOArray::noArray())
}, bitwise_not);
Nan::SetMethod(target, "bitwise_not", core_general_callback::callback);

//export interface Ibitwise_not {
//    (src: _st.InputArray, dst: _st.OutputArray,
//        mask?: _st.InputArray /* = noArray()*/): void;
//}
//
//export var bitwise_not: Ibitwise_not = alvision_module.bitwise_not;

    //CV_EXPORTS_W void bitwise_not(src : _st.InputArray, dst : _st.OutputArray,
    //    mask : _st.InputArray /* = noArray()*/);

    /** @brief Calculates the per-element absolute difference between two arrays or between an array and a scalar.
    
    The function absdiff calculates:
    *   Absolute difference between two arrays when they have the same
        size and type:
        \f[\texttt{dst}(I) =  \texttt{saturate} (| \texttt{src1}(I) -  \texttt{src2}(I)|)\f]
    *   Absolute difference between an array and a scalar when the second
        array is constructed from Scalar or has as many elements as the
        number of channels in `src1`:
        \f[\texttt{dst}(I) =  \texttt{saturate} (| \texttt{src1}(I) -  \texttt{src2} |)\f]
    *   Absolute difference between a scalar and an array when the first
        array is constructed from Scalar or has as many elements as the
        number of channels in `src2`:
        \f[\texttt{dst}(I) =  \texttt{saturate} (| \texttt{src1} -  \texttt{src2}(I) |)\f]
        where I is a multi-dimensional index of array elements. In case of
        multi-channel arrays, each channel is processed independently.
    @note Saturation is not applied when the arrays have the depth CV_32S.
    You may even get a negative value in the case of overflow.
    @param src1 first input array or a scalar.
    @param src2 second input array or a scalar.
    @param dst output array that has the same size and type as input arrays.
    @sa cv::abs(const Mat&)
    */

overload->addOverload("core", "", "absdiff", {
	make_param<IOArray*>("src1","IOArray"),
	make_param<IOArray*>("src2","IOArray"),
	make_param<IOArray*>("dst","IOArray")
}, absdiff);

Nan::SetMethod(target, "absdiff", core_general_callback::callback);

//export interface Iabsdiff {
//    (src1: _st.InputArray, src2: _st.InputArray, dst: _st.OutputArray): void;
//}
//
//export var absdiff: Iabsdiff = alvision_module.absdiff;

    //CV_EXPORTS_W void absdiff(src1 : _st.InputArray, src2 : _st.InputArray, dst : _st.OutputArray);

    /** @brief  Checks if array elements lie between the elements of two other arrays.
    
    The function checks the range as follows:
    -   For every element of a single-channel input array:
        \f[\texttt{dst} (I)= \texttt{lowerb} (I)_0  \leq \texttt{src} (I)_0 \leq  \texttt{upperb} (I)_0\f]
    -   For two-channel arrays:
        \f[\texttt{dst} (I)= \texttt{lowerb} (I)_0  \leq \texttt{src} (I)_0 \leq  \texttt{upperb} (I)_0  \land \texttt{lowerb} (I)_1  \leq \texttt{src} (I)_1 \leq  \texttt{upperb} (I)_1\f]
    -   and so forth.
    
    That is, dst (I) is set to 255 (all 1 -bits) if src (I) is within the
    specified 1D, 2D, 3D, ... box and 0 otherwise.
    
    When the lower and/or upper boundary parameters are scalars, the indexes
    (I) at lowerb and upperb in the above formulas should be omitted.
    @param src first input array.
    @param lowerb inclusive lower boundary array or a scalar.
    @param upperb inclusive upper boundary array or a scalar.
    @param dst output array of the same size as src and CV_8U type.
    */

overload->addOverload("core", "", "inRange", {
		make_param<IOArray*>(   "src","IOArray"),
		make_param<IOArray*>("lowerb","IOArray"),
		make_param<IOArray*>("upperb","IOArray"),
		make_param<IOArray*>(   "dst","IOArray")
}, inRange);
Nan::SetMethod(target, "inRange", core_general_callback::callback);

//    interface IinRange {
//        (src: _st.InputArray, lowerb : _st.InputArray,
//            upperb : _st.InputArray, dst: _st.OutputArray): void;
//    }
//export var inRange: IinRange = alvision_module.inRange;
    //CV_EXPORTS_W void inRange(src : _st.InputArray, lowerb : _st.InputArray,
    //    upperb : _st.InputArray, dst : _st.OutputArray);

    /** @brief Performs the per-element comparison of two arrays or an array and scalar value.
    
    The function compares:
    *   Elements of two arrays when src1 and src2 have the same size:
        \f[\texttt{dst} (I) =  \texttt{src1} (I)  \,\texttt{cmpop}\, \texttt{src2} (I)\f]
    *   Elements of src1 with a scalar src2 when src2 is constructed from
        Scalar or has a single element:
        \f[\texttt{dst} (I) =  \texttt{src1}(I) \,\texttt{cmpop}\,  \texttt{src2}\f]
    *   src1 with elements of src2 when src1 is constructed from Scalar or
        has a single element:
        \f[\texttt{dst} (I) =  \texttt{src1}  \,\texttt{cmpop}\, \texttt{src2} (I)\f]
    When the comparison result is true, the corresponding element of output
    array is set to 255. The comparison operations can be replaced with the
    equivalent matrix expressions:
    @code{.cpp}
        Mat dst1 = src1 >= src2;
        Mat dst2 = src1 < 8;
        ...
    @endcode
    @param src1 first input array or a scalar; when it is an array, it must have a single channel.
    @param src2 second input array or a scalar; when it is an array, it must have a single channel.
    @param dst output array of type ref CV_8U that has the same size and the same number of channels as
        the input arrays.
    @param cmpop a flag, that specifies correspondence between the arrays (cv::CmpTypes)
    @sa checkRange, min, max, threshold
    */


overload->addOverload("core", "", "compare", {
		make_param<IOArray*>("src1","IOArray"),
		make_param<IOArray*>("src2","IOArray"),
		make_param<IOArray*>( "dst","IOArray"),
		make_param<int>("cmpop","CmpTypes")
}, compare);

Nan::SetMethod(target, "compare", core_general_callback::callback);

overload->addOverload("core", "", "compare", {
		make_param<IOArray*>("src1","IOArray"),
		make_param<double>("src2","Number"),
		make_param<IOArray*>("dst","IOArray"),
		make_param<int>("cmpop","CmpTypes")
}, compare_number);

//interface Icompare {
//    (src1: _st.InputArray, src2: _st.InputArray | Number, dst: _st.OutputArray, cmpop: _base.CmpTypes | _st.int): void;
//}
//
//export var compare: Icompare = alvision_module.compare;

    //CV_EXPORTS_W void compare(src1 : _st.InputArray, src2 : _st.InputArray, dst : _st.OutputArray, int cmpop);

    /** @brief Calculates per-element minimum of two arrays or an array and a scalar.
    
    The functions min calculate the per-element minimum of two arrays:
    \f[\texttt{dst} (I)= \min ( \texttt{src1} (I), \texttt{src2} (I))\f]
    or array and a scalar:
    \f[\texttt{dst} (I)= \min ( \texttt{src1} (I), \texttt{value} )\f]
    @param src1 first input array.
    @param src2 second input array of the same size and type as src1.
    @param dst output array of the same size and type as src1.
    @sa max, compare, inRange, minMaxLoc
    */

overload->addOverload("core", "", "min", {
		make_param<IOArray*>("src1","IOArray"),
		make_param<IOArray*>("src2","IOArray"), 
		make_param<IOArray*>( "dst","IOArray")
}, min_array);

Nan::SetMethod(target, "min", core_general_callback::callback);

overload->addOverload("core", "", "min", {
		make_param<Matrix*>("src1","Mat"),
		make_param<Matrix*>("src2","Mat"),
		make_param<Matrix*>( "dst","Mat")
}, min_mat);

overload->addOverload("core", "", "min", {
		make_param<UMatrix*>("src1","UMat"),
		make_param<UMatrix*>("src2","UMat"),
		make_param<UMatrix*>( "dst","UMat")
}, min_umat);


//interface Imin {
//    (src1: _st.InputArray, src2: _st.InputArray, dst: _st.OutputArray): void;
//    (src1 : _mat.Mat, src2 : _mat.Mat, dst :_mat.Mat): void;
//    (src1 : _mat.UMat, src2 : _mat.UMat, dst :_mat.UMat): void;
//}
//
//export var min: Imin = alvision_module.min;


    //CV_EXPORTS_W void min(src1 : _st.InputArray, src2 : _st.InputArray, dst : _st.OutputArray);
    /** @overload
    needed to avoid conflicts with const _Tp& std::min(const _Tp&, const _Tp&, _Compare)
    */
    //CV_EXPORTS void min(src : _mat.Mat1, src : _mat.Mat2, dst :_mat.Mat);
    /** @overload
    needed to avoid conflicts with const _Tp& std::min(const _Tp&, const _Tp&, _Compare)
    */
    //CV_EXPORTS void min(src1 : _mat.UMat, src2 : _mat.UMat, Udst :_mat.Mat);

    /** @brief Calculates per-element maximum of two arrays or an array and a scalar.
    
    The functions max calculate the per-element maximum of two arrays:
    \f[\texttt{dst} (I)= \max ( \texttt{src1} (I), \texttt{src2} (I))\f]
    or array and a scalar:
    \f[\texttt{dst} (I)= \max ( \texttt{src1} (I), \texttt{value} )\f]
    @param src1 first input array.
    @param src2 second input array of the same size and type as src1 .
    @param dst output array of the same size and type as src1.
    @sa  min, compare, inRange, minMaxLoc, @ref MatrixExpressions
    */

overload->addOverload("core", "", "max", {
	make_param<IOArray*>("src1","IOArray"),
	make_param<IOArray*>("src2","IOArray"),
	make_param<IOArray*>("dst","IOArray")
}, max_array);
Nan::SetMethod(target, "max", core_general_callback::callback);

overload->addOverload("core", "", "max", {
	make_param<Matrix*>("src1","Mat"),
	make_param<Matrix*>("src2","Mat"),
	make_param<Matrix*>("dst","Mat")
}, max_mat);

overload->addOverload("core", "", "max", {
	make_param<UMatrix*>("src1","UMat"),
	make_param<UMatrix*>("src2","UMat"),
	make_param<UMatrix*>("dst","UMat")
}, max_umat);


//interface Imax {
//    (src1: _st.InputArray, src2: _st.InputArray, dst: _st.OutputArray): void;
//    (src1 : _mat.Mat, src2 : _mat.Mat, dst :_mat.Mat): void;
//    (src1 : _mat.UMat, src2 : _mat.UMat, Udst :_mat.Mat): void;
//}
//
//export var max: Imax = alvision_module.max;

    //CV_EXPORTS_W void max(src1 : _st.InputArray, src2 : _st.InputArray, dst : _st.OutputArray);
    /** @overload
    needed to avoid conflicts with const _Tp& std::min(const _Tp&, const _Tp&, _Compare)
    */
    //CV_EXPORTS void max(src : _mat.Mat1, src : _mat.Mat2, dst :_mat.Mat);
    /** @overload
    needed to avoid conflicts with const _Tp& std::min(const _Tp&, const _Tp&, _Compare)
    */
    //CV_EXPORTS void max(src1 : _mat.UMat, src2 : _mat.UMat, Udst :_mat.Mat);

    /** @brief Calculates a square root of array elements.
    
    The functions sqrt calculate a square root of each input array element.
    In case of multi-channel arrays, each channel is processed
    independently. The accuracy is approximately the same as of the built-in
    std::sqrt .
    @param src input floating-point array.
    @param dst output array of the same size and type as src.
    */
overload->addOverload("core", "", "sqrt", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray")
}, sqrt);
Nan::SetMethod(target, "sqrt", core_general_callback::callback);
//interface Isqrt {
//    (src: _st.InputArray, dst: _st.OutputArray): void;
//}
//
//export var sqrt: Isqrt = alvision_module.sqrt;
    //CV_EXPORTS_W void sqrt(src : _st.InputArray, dst : _st.OutputArray);

    /** @brief Raises every array element to a power.
    
    The function pow raises every element of the input array to power :
    \f[\texttt{dst} (I) =  \fork{\texttt{src}(I)^{power}}{if \(\texttt{power}\) is integer}{|\texttt{src}(I)|^{power}}{otherwise}\f]
    
    So, for a non-integer power exponent, the absolute values of input array
    elements are used. However, it is possible to get true values for
    negative values using some extra operations. In the example below,
    computing the 5th root of array src shows:
    @code{.cpp}
        Mat mask = src < 0;
        pow(src, 1./5, dst);
        subtract(Scalar::all(0), dst, dst, mask);
    @endcode
    For some values of power, such as integer values, 0.5 and -0.5,
    specialized faster algorithms are used.
    
    Special values (NaN, Inf) are not handled.
    @param src input array.
    @param power exponent of power.
    @param dst output array of the same size and type as src.
    @sa sqrt, exp, log, cartToPolar, polarToCart
    */

overload->addOverload("core", "", "pow", {
		make_param<IOArray*>("src","IOArray"),
		make_param<double>("power","double"),
		make_param<IOArray*>("dst","IOArray")
}, pow);
Nan::SetMethod(target, "pow", core_general_callback::callback);


//interface Ipow {
//    (src: _st.InputArray, power : _st.double, dst: _st.OutputArray): void;
//}
//
//export var pow: Ipow = alvision_module.pow;
    //CV_EXPORTS_W void pow(src : _st.InputArray, power : _st.double, dst : _st.OutputArray);

    /** @brief Calculates the exponent of every array element.
    
    The function exp calculates the exponent of every element of the input
    array:
    \f[\texttt{dst} [I] = e^{ src(I) }\f]
    
    The maximum relative error is about 7e-6 for single-precision input and
    less than 1e-10 for double-precision input. Currently, the function
    converts denormalized values to zeros on output. Special values (NaN,
    Inf) are not handled.
    @param src input array.
    @param dst output array of the same size and type as src.
    @sa log , cartToPolar , polarToCart , phase , pow , sqrt , magnitude
    */

overload->addOverload("core", "", "exp", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray")
}, exp);
Nan::SetMethod(target, "exp", core_general_callback::callback);
//interface Iexp {
//    (src: _st.InputArray, dst: _st.OutputArray): void;
//}
//export var exp: Iexp = alvision_module.exp;
//CV_EXPORTS_W void exp(src : _st.InputArray, dst : _st.OutputArray);

    /** @brief Calculates the natural logarithm of every array element.
    
    The function log calculates the natural logarithm of the absolute value
    of every element of the input array:
    \f[\texttt{dst} (I) =  \fork{\log |\texttt{src}(I)|}{if \(\texttt{src}(I) \ne 0\) }{\texttt{C}}{otherwise}\f]
    
    where C is a large negative number (about -700 in the current
    implementation). The maximum relative error is about 7e-6 for
    single-precision input and less than 1e-10 for double-precision input.
    Special values (NaN, Inf) are not handled.
    @param src input array.
    @param dst output array of the same size and type as src .
    @sa exp, cartToPolar, polarToCart, phase, pow, sqrt, magnitude
    */

overload->addOverload("core", "", "log", {
	make_param<IOArray*>("src","IOArray"),
	make_param<IOArray*>("dst","IOArray")
}, log);
Nan::SetMethod(target, "log", core_general_callback::callback);

//export interface Ilog {
//    (src: _st.InputArray, dst: _st.OutputArray): void;
//}
//
//export var log: Ilog = alvision_module.log;

    //CV_EXPORTS_W void log(src : _st.InputArray, dst : _st.OutputArray);

    /** @brief Calculates x and y coordinates of 2D vectors from their magnitude and angle.
    
    The function polarToCart calculates the Cartesian coordinates of each 2D
    vector represented by the corresponding elements of magnitude and angle:
    \f[\begin{array}{l} \texttt{x} (I) =  \texttt{magnitude} (I) \cos ( \texttt{angle} (I)) \\ \texttt{y} (I) =  \texttt{magnitude} (I) \sin ( \texttt{angle} (I)) \\ \end{array}\f]
    
    The relative accuracy of the estimated coordinates is about 1e-6.
    @param magnitude input floating-point array of magnitudes of 2D vectors;
    it can be an empty matrix (=Mat()), in this case, the function assumes
    that all the magnitudes are =1; if it is not empty, it must have the
    same size and type as angle.
    @param angle input floating-point array of angles of 2D vectors.
    @param x output array of x-coordinates of 2D vectors; it has the same
    size and type as angle.
    @param y output array of y-coordinates of 2D vectors; it has the same
    size and type as angle.
    @param angleInDegrees when true, the input angles are measured in
    degrees, otherwise, they are measured in radians.
    @sa cartToPolar, magnitude, phase, exp, log, pow, sqrt
    */

overload->addOverload("core", "", "polarToCart", {
		make_param<IOArray*>("magnitude","IOArray"),
		make_param<IOArray*>("angle","IOArray"),
		make_param<IOArray*>("x","IOArray"),
		make_param<IOArray*>("y","IOArray"),
		make_param<bool>("angleInDegrees","bool", false)

}, polarToCart);
Nan::SetMethod(target, "polarToCart", core_general_callback::callback);
//    interface IpolarToCart {
//        (magnitude: _st.InputArray, angle: _st.InputArray ,
//            x : _st.OutputArray ,y : _st.OutputArray, angleInDegrees: boolean /*= false*/): void;
//    }
//    export var polarToCart: IpolarToCart = alvision_module.polarToCart;

    //CV_EXPORTS_W void polarToCart(m : _st.InputArrayagnitude, a : _st.InputArrayngle,
    //    OutputArray x, OutputArray y, bool angleInDegrees = false);

    /** @brief Calculates the magnitude and angle of 2D vectors.
    
    The function cartToPolar calculates either the magnitude, angle, or both
    for every 2D vector (x(I),y(I)):
    \f[\begin{array}{l} \texttt{magnitude} (I)= \sqrt{\texttt{x}(I)^2+\texttt{y}(I)^2} , \\ \texttt{angle} (I)= \texttt{atan2} ( \texttt{y} (I), \texttt{x} (I))[ \cdot180 / \pi ] \end{array}\f]
    
    The angles are calculated with accuracy about 0.3 degrees. For the point
    (0,0), the angle is set to 0.
    @param x array of x-coordinates; this must be a single-precision or
    double-precision floating-point array.
    @param y array of y-coordinates, that must have the same size and same type as x.
    @param magnitude output array of magnitudes of the same size and type as x.
    @param angle output array of angles that has the same size and type as
    x; the angles are measured in radians (from 0 to 2\*Pi) or in degrees (0 to 360 degrees).
    @param angleInDegrees a flag, indicating whether the angles are measured
    in radians (which is by default), or in degrees.
    @sa Sobel, Scharr
    */

	overload->addOverload("core", "", "cartToPolar", {
			make_param<IOArray*>("x","IOArray"),
			make_param<IOArray*>("y","IOArray"),
			make_param<IOArray*>("magnitude","IOArray"),
			make_param<IOArray*>("angle","IOArray"),
			make_param<bool>("angleInDegrees","bool", false)
	}, cartToPolar);
	Nan::SetMethod(target, "cartToPolar", core_general_callback::callback);
//    interface IcartToPolar{
//        (x: _st.InputArray, y: _st.InputArray,
//        magnitude: _st.OutputArray, angle: _st.OutputArray,
//        angleInDegrees: boolean /*= false*/): void;
//}
//
//    export var cartToPolar: IcartToPolar = alvision_module.cartToPolar;

    //CV_EXPORTS_W void cartToPolar(x : _st.InputArray, y: _st.InputArray,
    //    magnitude : _st.OutputArray, angle : _st.OutputArray,
    //    angleInDegrees : boolean  = false);

    /** @brief Calculates the rotation angle of 2D vectors.
    
    The function phase calculates the rotation angle of each 2D vector that
    is formed from the corresponding elements of x and y :
    \f[\texttt{angle} (I) =  \texttt{atan2} ( \texttt{y} (I), \texttt{x} (I))\f]
    
    The angle estimation accuracy is about 0.3 degrees. When x(I)=y(I)=0 ,
    the corresponding angle(I) is set to 0.
    @param x input floating-point array of x-coordinates of 2D vectors.
    @param y input array of y-coordinates of 2D vectors; it must have the
    same size and the same type as x.
    @param angle output array of vector angles; it has the same size and
    same type as x .
    @param angleInDegrees when true, the function calculates the angle in
    degrees, otherwise, they are measured in radians.
    */

	overload->addOverload("core", "", "phase", {
			make_param<IOArray*>("x","IOArray"),
			make_param<IOArray*>("y","IOArray"), 
			make_param<IOArray*>("angle","IOArray"),
			make_param<bool>("angleInDegrees","bool", false)
	}, phase);
	Nan::SetMethod(target, "phase", core_general_callback::callback);

//    interface Iphase {
//        (x: _st.InputArray, y: _st.InputArray, angle: _st.OutputArray,
//            angleInDegrees : boolean /* = false*/): void;
//    }
//
//    export var phase: Iphase = alvision_module.phase;

    //CV_EXPORTS_W void phase(x : _st.InputArray, y: _st.InputArray, angle : _st.OutputArray,
    //    bool angleInDegrees = false);

    /** @brief Calculates the magnitude of 2D vectors.
    
    The function magnitude calculates the magnitude of 2D vectors formed
    from the corresponding elements of x and y arrays:
    \f[\texttt{dst} (I) =  \sqrt{\texttt{x}(I)^2 + \texttt{y}(I)^2}\f]
    @param x floating-point array of x-coordinates of the vectors.
    @param y floating-point array of y-coordinates of the vectors; it must
    have the same size as x.
    @param magnitude output array of the same size and type as x.
    @sa cartToPolar, polarToCart, phase, sqrt
    */
	overload->addOverload("core", "", "magnitude", {
			make_param<IOArray*>("x","IOArray"),
			make_param<IOArray*>("y","IOArray"),
			make_param<IOArray*>("magnitude","IOArray")
	}, magnitude);
	Nan::SetMethod(target, "magnitude", core_general_callback::callback);


//    interface Imagnitude {
//        (x: _st.InputArray, y: _st.InputArray, magnitude: _st.OutputArray): void;
//    }
//
//    export var magnitude: Imagnitude = alvision_module.magnitude;

    //CV_EXPORTS_W void magnitude(x : _st.InputArray, y: _st.InputArray, magnitude : _st.OutputArray);

    /** @brief Checks every element of an input array for invalid values.
    
    The functions checkRange check that every array element is neither NaN nor infinite. When minVal \>
    -DBL_MAX and maxVal \< DBL_MAX, the functions also check that each value is between minVal and
    maxVal. In case of multi-channel arrays, each channel is processed independently. If some values
    are out of range, position of the first outlier is stored in pos (when pos != NULL). Then, the
    functions either return false (when quiet=true) or throw an exception.
    @param a input array.
    @param quiet a flag, indicating whether the functions quietly return false when the array elements
    are out of range or they throw an exception.
    @param pos optional output parameter, when not NULL, must be a pointer to array of src.dims
    elements.
    @param minVal inclusive lower boundary of valid values range.
    @param maxVal exclusive upper boundary of valid values range.
    */

	overload->addOverload("core", "", "checkRange", {
			make_param<IOArray*>("a","IOArray"),
			make_param<bool>("quiet","bool", true),
			make_param<std::shared_ptr<or::Callback>>("cb","Function"),
			make_param<double>("minVal","double",-DBL_MAX), 
			make_param<double>("maxVal","double", DBL_MAX)
	}, checkRange);
	Nan::SetMethod(target, "checkRange", core_general_callback::callback);

//    interface IcheckRangeCallback {
//        (pos: _types.Point): void;
//    }
//
//    interface IcheckRange {
//        (a: _st.InputArray, quiet?: boolean/* = true*/, cb?: IcheckRangeCallback,
//            minVal?: _st.double  /*= -DBL_MAX*/, maxVal?: _st.double /* = DBL_MAX*/) : boolean;
//    }
//
//export var checkRange: IcheckRange = alvision_module.checkRange;

    //CV_EXPORTS_W bool checkRange(a : _st.InputArray, bool quiet = true, CV_OUT Point* pos = 0,
    //    double minVal = -DBL_MAX, double maxVal = DBL_MAX);

    /** @brief converts NaN's to the given number
    */

overload->addOverload("core", "", "patchNaNs", {
		make_param<IOArray*>("a","IOArray"),
		make_param<double>("val","double", 0)
}, patchNaNs);
Nan::SetMethod(target, "patchNaNs", core_general_callback::callback);

//interface IpatchNaNs {
//    (a: _st.InputOutputArray, val?: _st.double /* = 0*/): void;
//}
//
//export var patchNaNs: IpatchNaNs = alvision_module.patchNaNs;

//    CV_EXPORTS_W void patchNaNs(InputOutputArray a, double val = 0);

    /** @brief Performs generalized matrix multiplication.
    
    The function performs generalized matrix multiplication similar to the
    gemm functions in BLAS level 3. For example,
    `gemm(src1, src2, alpha, src3, beta, dst, GEMM_1_T + GEMM_3_T)`
    corresponds to
    \f[\texttt{dst} =  \texttt{alpha} \cdot \texttt{src1} ^T  \cdot \texttt{src2} +  \texttt{beta} \cdot \texttt{src3} ^T\f]
    
    In case of complex (two-channel) data, performed a complex matrix
    multiplication.
    
    The function can be replaced with a matrix expression. For example, the
    above call can be replaced with:
    @code{.cpp}
        dst = alpha*src1.t()*src2 + beta*src3.t();
    @endcode
    @param src1 first multiplied input matrix that could be real(CV_32FC1,
    CV_64FC1) or complex(CV_32FC2, CV_64FC2).
    @param src2 second multiplied input matrix of the same type as src1.
    @param alpha weight of the matrix product.
    @param src3 third optional delta matrix added to the matrix product; it
    should have the same type as src1 and src2.
    @param beta weight of src3.
    @param dst output matrix; it has the proper size and the same type as
    input matrices.
    @param flags operation flags (cv::GemmFlags)
    @sa mulTransposed , transform
    */

overload->addOverload("core", "", "gemm", {
		make_param<IOArray*>("src1","IOArray"),
		make_param<IOArray*>("src2","IOArray"),
		make_param<double>("alpha","double"),
		make_param<IOArray*>("src3","IOArray"),
		make_param<double>("beta","double"),
		make_param<IOArray*>("dst","IOArray"),
		make_param<int>("flags","GemmFlags", 0)
}, gemm);
Nan::SetMethod(target, "gemm", core_general_callback::callback);

//interface Igemm {
//    (src1: _st.InputArray, src2: _st.InputArray, alpha: _st.double,
//        src3: _st.InputArray, beta: _st.double, dst: _st.OutputArray, flags?: _base.GemmFlags | _st.int /* = 0*/): void;
//}
//
//export var gemm: Igemm = alvision_module.gemm;

    //CV_EXPORTS_W void gemm(src1 : _st.InputArray, src2 : _st.InputArray, alpha : _st.double,
    //    src : _st.InputArray3, beta : _st.double, dst : _st.OutputArray, flags : _st.int /* = 0*/);

   
overload->addOverload("core", "", "mulTransposed", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray"),
		make_param<bool>("aTa","bool"),
		make_param<IOArray*>("delta","IOArray",IOArray::noArray()),
		make_param<double>("scale","double", 1 ),
		make_param<int>("dtype","int", -1 )
}, mulTransposed);
Nan::SetMethod(target, "mulTransposed", core_general_callback::callback);
//interface ImulTransposed{
//    (src: _st.InputArray, dst: _st.OutputArray,  aTa : boolean,
//        delta?: _st.InputArray  /*= noArray()*/,
//    scale?: _st.double /* = 1 */, dtype?: _st.int /* = -1 */): void;
//}
//
//export var mulTransposed: ImulTransposed = alvision_module.mulTransposed;

    //CV_EXPORTS_W void mulTransposed(src : _st.InputArray, dst : _st.OutputArray, bool aTa,
    //    InputArray delta = noArray(),
    //    scale : _st.double /* = 1 */, dtype : _st.int /* = -1 */);

    /** @brief Transposes a matrix.
    
    The function transpose transposes the matrix src :
    \f[\texttt{dst} (i,j) =  \texttt{src} (j,i)\f]
    @note No complex conjugation is done in case of a complex matrix. It it
    should be done separately if needed.
    @param src input array.
    @param dst output array of the same type as src.
    */

overload->addOverload("core", "", "transpose", {
	make_param<IOArray*>("src","IOArray"),
	make_param<IOArray*>("dst","IOArray")
}, transpose);
Nan::SetMethod(target, "transpose", core_general_callback::callback);

//interface Itranspose {
//    (src: _st.InputArray, dst: _st.OutputArray): void;
//}
//
//export var transpose: Itranspose = alvision_module.transpose;

    //CV_EXPORTS_W void transpose(src : _st.InputArray, dst : _st.OutputArray);

    /** @brief Performs the matrix transformation of every array element.
    
    The function transform performs the matrix transformation of every
    element of the array src and stores the results in dst :
    \f[\texttt{dst} (I) =  \texttt{m} \cdot \texttt{src} (I)\f]
    (when m.cols=src.channels() ), or
    \f[\texttt{dst} (I) =  \texttt{m} \cdot [ \texttt{src} (I); 1]\f]
    (when m.cols=src.channels()+1 )
    
    Every element of the N -channel array src is interpreted as N -element
    vector that is transformed using the M x N or M x (N+1) matrix m to
    M-element vector - the corresponding element of the output array dst .
    
    The function may be used for geometrical transformation of
    N -dimensional points, arbitrary linear color space transformation (such
    as various kinds of RGB to YUV transforms), shuffling the image
    channels, and so forth.
    @param src input array that must have as many channels (1 to 4) as
    m.cols or m.cols-1.
    @param dst output array of the same size and depth as src; it has as
    many channels as m.rows.
    @param m transformation 2x2 or 2x3 floating-point matrix.
    @sa perspectiveTransform, getAffineTransform, estimateRigidTransform, warpAffine, warpPerspective
    */

overload->addOverload("core", "", "transform", {
	make_param<IOArray*>("src","IOArray"),
	make_param<IOArray*>("dst","IOArray"),
	make_param<IOArray*>(  "m","IOArray")
}, transform);
Nan::SetMethod(target, "transform", core_general_callback::callback);

//interface Itransform {
//    (src: _st.InputArray, dst: _st.OutputArray, m : _st.InputArray ): void;
//}
//
//export var transform: Itransform = alvision_module.transform;

    //CV_EXPORTS_W void transform(src : _st.InputArray, dst : _st.OutputArray, m : _st.InputArray );

    /** @brief Performs the perspective matrix transformation of vectors.
    
    The function perspectiveTransform transforms every element of src by
    treating it as a 2D or 3D vector, in the following way:
    \f[(x, y, z)  \rightarrow (x'/w, y'/w, z'/w)\f]
    where
    \f[(x', y', z', w') =  \texttt{mat} \cdot \begin{bmatrix} x & y & z & 1  \end{bmatrix}\f]
    and
    \f[w =  \fork{w'}{if \(w' \ne 0\)}{\infty}{otherwise}\f]
    
    Here a 3D vector transformation is shown. In case of a 2D vector
    transformation, the z component is omitted.
    
    @note The function transforms a sparse set of 2D or 3D vectors. If you
    want to transform an image using perspective transformation, use
    warpPerspective . If you have an inverse problem, that is, you want to
    compute the most probable perspective transformation out of several
    pairs of corresponding points, you can use getPerspectiveTransform or
    findHomography .
    @param src input two-channel or three-channel floating-point array; each
    element is a 2D/3D vector to be transformed.
    @param dst output array of the same size and type as src.
    @param m 3x3 or 4x4 floating-point transformation matrix.
    @sa  transform, warpPerspective, getPerspectiveTransform, findHomography
    */
overload->addOverload("core", "", "perspectiveTransform", {
	make_param<IOArray*>("src","IOArray"),
	make_param<IOArray*>("dst","IOArray"),
	make_param<IOArray*>(  "m","IOArray")
}, perspectiveTransform);
Nan::SetMethod(target, "perspectiveTransform", core_general_callback::callback);

//interface IperspectiveTransform{
//    (src: _st.InputArray, dst: _st.OutputArray, m: _st.InputArray): void;
//}
//
//export var perspectiveTransform: IperspectiveTransform = alvision_module.perspectiveTransform;

    //CV_EXPORTS_W void perspectiveTransform(src : _st.InputArray, dst : _st.OutputArray, m : _st.InputArray );

    /** @brief Copies the lower or the upper half of a square matrix to another half.
    
    The function completeSymm copies the lower half of a square matrix to
    its another half. The matrix diagonal remains unchanged:
    *   \f$\texttt{mtx}_{ij}=\texttt{mtx}_{ji}\f$ for \f$i > j\f$ if
        lowerToUpper=false
    *   \f$\texttt{mtx}_{ij}=\texttt{mtx}_{ji}\f$ for \f$i < j\f$ if
        lowerToUpper=true
    @param mtx input-output floating-point square matrix.
    @param lowerToUpper operation flag; if true, the lower half is copied to
    the upper half. Otherwise, the upper half is copied to the lower half.
    @sa flip, transpose
    */

overload->addOverload("core", "", "completeSymm", {
		make_param<IOArray*>("mtx","IOArray"),
		make_param<bool>("lowerToUpper","bool", false)
}, completeSymm);

Nan::SetMethod(target, "completeSymm", core_general_callback::callback);
//interface IcompleteSymm {
//    (mtx : _st.InputOutputArray, lowerToUpper : boolean /* = false*/);
//}
//
//export var completeSymm: IcompleteSymm = alvision_module.completeSymm;

//    CV_EXPORTS_W void completeSymm(mtx : _st.InputOutputArray, lowerToUpper : boolean /* = false*/);

    /** @brief Initializes a scaled identity matrix.
    
    The function setIdentity initializes a scaled identity matrix:
    \f[\texttt{mtx} (i,j)= \fork{\texttt{value}}{ if \(i=j\)}{0}{otherwise}\f]
    
    The function can also be emulated using the matrix initializers and the
    matrix expressions:
    @code
        Mat A = Mat::eye(4, 3, CV_32F)*5;
        // A will be set to [[5, 0, 0], [0, 5, 0], [0, 0, 5], [0, 0, 0]]
    @endcode
    @param mtx matrix to initialize (not necessarily square).
    @param s value to assign to diagonal elements.
    @sa Mat::zeros, Mat::ones, Mat::setTo, Mat::operator=
    */

overload->addOverload("core", "", "setIdentity", {
	make_param<IOArray*>("mtx","IOArray"),
	make_param<Scalar*>("s","Scalar",Scalar::all(1))
}, setIdentity);
Nan::SetMethod(target, "setIdentity", core_general_callback::callback);

//interface IsetIdentity {
//    (mtx: _st.InputOutputArray, s? : _types.Scalar /* = new _scalar.Scalar(1)*/): void;
//}
//
//export var setIdentity: IsetIdentity = alvision_module.setIdentity;

    //CV_EXPORTS_W void setIdentity(mtx : _st.InputOutputArray, s : _scalar.Scalar /* = new _scalar.Scalar(1)*/);

    /** @brief Returns the determinant of a square floating-point matrix.
    
    The function determinant calculates and returns the determinant of the
    specified matrix. For small matrices ( mtx.cols=mtx.rows\<=3 ), the
    direct method is used. For larger matrices, the function uses LU
    factorization with partial pivoting.
    
    For symmetric positively-determined matrices, it is also possible to use
    eigen decomposition to calculate the determinant.
    @param mtx input matrix that must have CV_32FC1 or CV_64FC1 type and
    square size.
    @sa trace, invert, solve, eigen, @ref MatrixExpressions
    */

overload->addOverload("core", "", "determinant", {
	make_param<IOArray*>("mtx","IOArray")
}, determinant);
Nan::SetMethod(target, "determinant", core_general_callback::callback);

//interface Ideterminant {
//    (mtx: _st.InputArray): _st.double;
//}
//
//export var determinant: Ideterminant = alvision_module.determinant;

    //CV_EXPORTS_W double determinant(m : _st.InputArraytx);

    /** @brief Returns the trace of a matrix.
    
    The function trace returns the sum of the diagonal elements of the
    matrix mtx .
    \f[\mathrm{tr} ( \texttt{mtx} ) =  \sum _i  \texttt{mtx} (i,i)\f]
    @param mtx input matrix.
    */

overload->addOverload("core", "", "trace", {
	make_param<IOArray*>("mtx","IOArray")
}, trace);
Nan::SetMethod(target, "trace", core_general_callback::callback);

//export interface Itrace {
//    (mtx: _st.InputArray): _types.Scalar;
//}
//
//export var trace: Itrace = alvision_module.trace;

    //CV_EXPORTS_W Scalar trace(mtx : _st.InputArray);

    /** @brief Finds the inverse or pseudo-inverse of a matrix.
    
    The function invert inverts the matrix src and stores the result in dst
    . When the matrix src is singular or non-square, the function calculates
    the pseudo-inverse matrix (the dst matrix) so that norm(src\*dst - I) is
    minimal, where I is an identity matrix.
    
    In case of the DECOMP_LU method, the function returns non-zero value if
    the inverse has been successfully calculated and 0 if src is singular.
    
    In case of the DECOMP_SVD method, the function returns the inverse
    condition number of src (the ratio of the smallest singular value to the
    largest singular value) and 0 if src is singular. The SVD method
    calculates a pseudo-inverse matrix if src is singular.
    
    Similarly to DECOMP_LU, the method DECOMP_CHOLESKY works only with
    non-singular square matrices that should also be symmetrical and
    positively defined. In this case, the function stores the inverted
    matrix in dst and returns non-zero. Otherwise, it returns 0.
    
    @param src input floating-point M x N matrix.
    @param dst output matrix of N x M size and the same type as src.
    @param flags inversion method (cv::DecompTypes)
    @sa solve, SVD
    */

overload->addOverload("core", "", "invert", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray"),
		make_param<int>("flags","DecompTypes",cv::DECOMP_LU)
}, invert);
Nan::SetMethod(target, "invert", core_general_callback::callback);

//export interface Iinvert {
//    (src: _st.InputArray, dst: _st.OutputArray, flags? : _base.DecompTypes |  _st.int /*= DECOMP_LU*/): _st.double;
//}
//
//export var invert: Iinvert = alvision_module.invert;

    //CV_EXPORTS_W double invert(src : _st.InputArray, dst : _st.OutputArray, int flags = DECOMP_LU);

    /** @brief Solves one or more linear systems or least-squares problems.
    
    The function solve solves a linear system or least-squares problem (the
    latter is possible with SVD or QR methods, or by specifying the flag
    DECOMP_NORMAL ):
    \f[\texttt{dst} =  \arg \min _X \| \texttt{src1} \cdot \texttt{X} -  \texttt{src2} \|\f]
    
    If DECOMP_LU or DECOMP_CHOLESKY method is used, the function returns 1
    if src1 (or \f$\texttt{src1}^T\texttt{src1}\f$ ) is non-singular. Otherwise,
    it returns 0. In the latter case, dst is not valid. Other methods find a
    pseudo-solution in case of a singular left-hand side part.
    
    @note If you want to find a unity-norm solution of an under-defined
    singular system \f$\texttt{src1}\cdot\texttt{dst}=0\f$ , the function solve
    will not do the work. Use SVD::solveZ instead.
    
    @param src1 input matrix on the left-hand side of the system.
    @param src2 input matrix on the right-hand side of the system.
    @param dst output solution.
    @param flags solution (matrix inversion) method (cv::DecompTypes)
    @sa invert, SVD, eigen
    */

overload->addOverload("core", "", "solve", {
	make_param<IOArray*>("src1","IOArray"),
	make_param<IOArray*>("src2","IOArray"),
	make_param<IOArray*>( "dst","IOArray"),
	make_param<int>("flags","DecompTypes",cv::DECOMP_LU)
}, solve);
Nan::SetMethod(target, "solve", core_general_callback::callback);

//export interface Isolve {
//    (src1: _st.InputArray, src2: _st.InputArray,
//        dst: _st.OutputArray, flags: _base.DecompTypes /* = DECOMP_LU*/): boolean;
//}
//
//export var solve: Isolve = alvision_module.solve;

    //CV_EXPORTS_W bool solve(src1 : _st.InputArray, src2 : _st.InputArray,
    //    dst : _st.OutputArray, int flags = DECOMP_LU);

    /** @brief Sorts each row or each column of a matrix.
    
    The function sort sorts each matrix row or each matrix column in
    ascending or descending order. So you should pass two operation flags to
    get desired behaviour. If you want to sort matrix rows or columns
    lexicographically, you can use STL std::sort generic function with the
    proper comparison predicate.
    
    @param src input single-channel array.
    @param dst output array of the same size and type as src.
    @param flags operation flags, a combination of cv::SortFlags
    @sa sortIdx, randShuffle
    */

overload->addOverload("core", "", "sort", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray"),
		make_param<int>("flags","SortFlags")
}, sort);
Nan::SetMethod(target, "sort", core_general_callback::callback);

//export interface Isort {
//    (src: _st.InputArray, dst: _st.OutputArray, flags: SortFlags): void;
//}
//
//export var sort: Isort = alvision_module.sort;

    //CV_EXPORTS_W void sort(src : _st.InputArray, dst : _st.OutputArray, int flags);

    /** @brief Sorts each row or each column of a matrix.
    
    The function sortIdx sorts each matrix row or each matrix column in the
    ascending or descending order. So you should pass two operation flags to
    get desired behaviour. Instead of reordering the elements themselves, it
    stores the indices of sorted elements in the output array. For example:
    @code
        Mat A = Mat::eye(3,3,CV_32F), B;
        sortIdx(A, B, SORT_EVERY_ROW + SORT_ASCENDING);
        // B will probably contain
        // (because of equal elements in A some permutations are possible):
        // [[1, 2, 0], [0, 2, 1], [0, 1, 2]]
    @endcode
    @param src input single-channel array.
    @param dst output integer array of the same size as src.
    @param flags operation flags that could be a combination of cv::SortFlags
    @sa sort, randShuffle
    */

overload->addOverload("core", "", "sortIdx", {
	make_param<IOArray*>("src","IOArray"),
	make_param<IOArray*>("dst","IOArray"),
	make_param<int>("flags","int"),
}, sortIdx);
Nan::SetMethod(target, "sortIdx", core_general_callback::callback);

//export interface IsortIdx {
//    (src: _st.InputArray, dst: _st.OutputArray, flags : _st.int): void;
//}
//
//export var sortIdx: IsortIdx = alvision_module.sortIdx;

    //CV_EXPORTS_W void sortIdx(src : _st.InputArray, dst : _st.OutputArray, int flags);

    /** @brief Finds the real roots of a cubic equation.
    
    The function solveCubic finds the real roots of a cubic equation:
    -   if coeffs is a 4-element vector:
    \f[\texttt{coeffs} [0] x^3 +  \texttt{coeffs} [1] x^2 +  \texttt{coeffs} [2] x +  \texttt{coeffs} [3] = 0\f]
    -   if coeffs is a 3-element vector:
    \f[x^3 +  \texttt{coeffs} [0] x^2 +  \texttt{coeffs} [1] x +  \texttt{coeffs} [2] = 0\f]
    
    The roots are stored in the roots array.
    @param coeffs equation coefficients, an array of 3 or 4 elements.
    @param roots output array of real roots that has 1 or 3 elements.
    */
overload->addOverload("core", "", "solveCubic", {
	make_param<IOArray*>("coeffs","IOArray"),
	make_param<IOArray*>( "roots","IOArray")
}, solveCubic);
Nan::SetMethod(target, "solveCubic", core_general_callback::callback);

//export interface IsolveCubic {
//    (coeffs: _st.InputArray, roots: _st.OutputArray): _st.int;
//}
//
//export var solveCubic: IsolveCubic = alvision_module.solveCubic;

    //CV_EXPORTS_W int solveCubic(coeffs : _st.InputArray, roots: st_OutputArray);

    /** @brief Finds the real or complex roots of a polynomial equation.
    
    The function solvePoly finds real and complex roots of a polynomial equation:
    \f[\texttt{coeffs} [n] x^{n} +  \texttt{coeffs} [n-1] x^{n-1} + ... +  \texttt{coeffs} [1] x +  \texttt{coeffs} [0] = 0\f]
    @param coeffs array of polynomial coefficients.
    @param roots output (complex) array of roots.
    @param maxIters maximum number of iterations the algorithm does.
    */

overload->addOverload("core", "", "solvePoly", {
	make_param<IOArray*>("coeffs","IOArray"),
	make_param<IOArray*>( "roots","IOArray"),
	make_param<int>("maxIters","int", 300)
}, solvePoly);
Nan::SetMethod(target, "solvePoly", core_general_callback::callback);
//export interface IsolvePoly {
//    (coeffs: _st.InputArray, roots: _st.OutputArray, maxIters : _st.int /* = 300*/): _st.double;
//}
//
//export var solvePoly: IsolvePoly = alvision_module.solvePoly;

    //CV_EXPORTS_W double solvePoly(coeffs : _st.InputArray, roots: st_OutputArray, int maxIters = 300);

    /** @brief Calculates eigenvalues and eigenvectors of a symmetric matrix.
    
    The functions eigen calculate just eigenvalues, or eigenvalues and eigenvectors of the symmetric
    matrix src:
    @code
        src*eigenvectors.row(i).t() = eigenvalues.at<srcType>(i)*eigenvectors.row(i).t()
    @endcode
    @note in the new and the old interfaces different ordering of eigenvalues and eigenvectors
    parameters is used.
    @param src input matrix that must have CV_32FC1 or CV_64FC1 type, square size and be symmetrical
    (src ^T^ == src).
    @param eigenvalues output vector of eigenvalues of the same type as src; the eigenvalues are stored
    in the descending order.
    @param eigenvectors output matrix of eigenvectors; it has the same size and type as src; the
    eigenvectors are stored as subsequent matrix rows, in the same order as the corresponding
    eigenvalues.
    @sa completeSymm , PCA
    */
overload->addOverload("core", "", "eigen", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("eigenvalues","IOArray"),
		make_param<IOArray*>("eigenvectors","IOArray",IOArray::noArray())
}, eigen);
Nan::SetMethod(target, "eigen", core_general_callback::callback);

//export interface Ieigen {
//    (src: _st.InputArray, eigenvalues: _st.OutputArray ,
//        eigenvectors?: _st.OutputArray /* = noArray()*/): boolean;
//}
//
//export var eigen: Ieigen = alvision_module.eigen;

    //CV_EXPORTS_W bool eigen(src : _st.InputArray, OutputArray eigenvalues,
    //    OutputArray eigenvectors = noArray());

    /** @brief Calculates the covariance matrix of a set of vectors.
    
    The functions calcCovarMatrix calculate the covariance matrix and, optionally, the mean vector of
    the set of input vectors.
    @param samples samples stored as separate matrices
    @param nsamples number of samples
    @param covar output covariance matrix of the type ctype and square size.
    @param mean input or output (depending on the flags) array as the average value of the input vectors.
    @param flags operation flags as a combination of cv::CovarFlags
    @param ctype type of the matrixl; it equals 'CV_64F' by default.
    @sa PCA, mulTransposed, Mahalanobis
    @todo InputArrayOfArrays
    */

//export interface IcalcCovarMatrix {
//    (samples: Array<_mat.Mat>, covar: _mat.Mat, mean: _mat.Mat,
//        flags: _st.int, ctype?: _st.int /* = CV_64F*/): void;
//}

//export var calcCovarMatrix: IcalcCovarMatrix = alvision_module.calcCovarMatrix;

    //CV_EXPORTS void calcCovarMatrix( const Mat* samples, int nsamples, Mat& covar, Mat& mean,
    //    int flags, int ctype = CV_64F);

    /** @overload
    @note use cv::COVAR_ROWS or cv::COVAR_COLS flag
    @param samples samples stored as rows/columns of a single matrix.
    @param covar output covariance matrix of the type ctype and square size.
    @param mean input or output (depending on the flags) array as the average value of the input vectors.
    @param flags operation flags as a combination of cv::CovarFlags
    @param ctype type of the matrixl; it equals 'CV_64F' by default.
    */

overload->addOverload("core", "", "calcCovarMatrix", {
		make_param<IOArray*>("samples","IOArray"),
		make_param<IOArray*>(  "covar","IOArray"),
		make_param<IOArray*>(   "mean","IOArray"),
		make_param<int>("flags","int"),
		make_param<int>("ctype","int",CV_64F)

}, calcCovarMatrix_array);
Nan::SetMethod(target, "calcCovarMatrix", core_general_callback::callback);

overload->addOverload("core", "", "calcCovarMatrix", {
		make_param<std::shared_ptr<std::vector<Matrix*>>>("samples","Array<Mat>"),
		make_param<Matrix*>("covar","Mat"), 
		make_param<Matrix*>( "mean","Mat"),
		make_param<int>("flags","int"),
		make_param<int>("ctype","int",CV_64F)

}, calcCovarMatrix_mat);

//export interface IcalcCovarMatrix {
//    (samples: _st.InputArray , covar: _st.OutputArray,
//        Inputmean: _st.OutputArray, flags: _st.int, ctype?: _st.int /* = CV_64F*/): void;
//    (samples: Array<_mat.Mat>, covar: _mat.Mat, mean: _mat.Mat,
//        flags: _st.int, ctype?: _st.int /* = CV_64F*/): void;
//}
//
//export var calcCovarMatrix: IcalcCovarMatrix = alvision_module.calcCovarMatrix;

    //CV_EXPORTS_W void calcCovarMatrix(InputArray samples, c : _st.OutputArrayovar,
    //    Inputmean : _st.OutputArray, int flags, int ctype = CV_64F);

//export interface IPCACompute {
//    PCACompute(data: _st.InputArray, mean: _st.InputOutputArray,
//        eigenvectors: _st.OutputArray, maxComponents: _st.int  /* = 0*/): void;
//}

//export var PCACompute: IPCACompute = alvision_module.PCACompute;

    /** wrap PCA::operator() */
    //CV_EXPORTS_W void PCACompute(data : _st.InputArray, mean : _st.InputOutputArray,
        //OutputArray eigenvectors, int maxComponents = 0);

overload->addOverload("core", "", "PCACompute_variance", {
		make_param<IOArray*>("data","IOArray"),
		make_param<IOArray*>("mean","IOArray"),
		make_param<IOArray*>("eigenvectors","IOArray"),
		make_param<double>("retainedVariance","double")

}, PCACompute_variance);
Nan::SetMethod(target, "PCACompute_variance", core_general_callback::callback);

overload->addOverload("core", "", "PCACompute_maxComponents", {
		make_param<IOArray*>("data","IOArray"),
		make_param<IOArray*>("mean","IOArray"),
		make_param<IOArray*>("eigenvectors","IOArray"),
		make_param<int>("maxComponents","int", 0)

}, PCACompute_maxComponents);
Nan::SetMethod(target, "PCACompute_maxComponents", core_general_callback::callback);

//export interface IPCACompute_variance {
//	(data : _st.InputArray, mean : _st.InputOutputArray,
//		eigenvectors : _st.OutputArray, retainedVariance : _st.double) : void;
//
//}
//export var PCACompute_variance : IPCACompute_variance = alvision_module.PCACompute_variance;
//
//export interface IPCACompute_maxComponents {
//	(data : _st.InputArray, mean : _st.InputOutputArray,
//		eigenvectors : _st.OutputArray, maxComponents : _st.int  /* = 0*/) : void;
//}
//export var PCACompute_maxComponents : IPCACompute_maxComponents = alvision_module.PCACompute_maxComponents;


    /** wrap PCA::operator() */
    //CV_EXPORTS_W void PCACompute(data : _st.InputArray, Inputmean : _st.OutputArray,
    //    OutputArray eigenvectors, double retainedVariance);

overload->addOverload("core", "", "PCAProject", {
		make_param<IOArray*>("data","IOArray"),
		make_param<IOArray*>("mean","IOArray"),
		make_param<IOArray*>("eigenvectors","IOArray"),
		make_param<IOArray*>("result","IOArray")
}, PCAProject);
Nan::SetMethod(target, "PCAProject", core_general_callback::callback);

//export interface IPCAProject {
//    (data: _st.InputArray, mean: _st.InputArray,
//        eigenvectors: _st.InputArray, result: _st.OutputArray): void;
//}
//
//export var PCAProject: IPCAProject = alvision_module.PCAProject;

    /** wrap PCA::project */
    //CV_EXPORTS_W void PCAProject(data : _st.InputArray, mean : _st.InputArray,
    //    eigenvectors : _st.InputArray, result : _st.OutputArray);

overload->addOverload("core", "", "PCABackProject", {
		make_param<IOArray*>("data","IOArray"),
		make_param<IOArray*>("mean","IOArray"),
		make_param<IOArray*>("eigenvectors","IOArray"),
		make_param<IOArray*>("result","IOArray")

}, PCABackProject);
Nan::SetMethod(target, "PCABackProject", core_general_callback::callback);

//export interface IPCABackProject {
//    (data: _st.InputArray, mean: _st.InputArray,
//        eigenvectors: _st.InputArray, result: _st.OutputArray) : void
//}
//
//export var PCABackProject: IPCABackProject = alvision_module.PCABackProject;

    /** wrap PCA::backProject */
//    CV_EXPORTS_W void PCABackProject(data : _st.InputArray, mean : _st.InputArray,
//        eigenvectors : _st.InputArray, result : _st.OutputArray);

overload->addOverload("core", "", "SVDecomp", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>(  "w","IOArray"),
		make_param<IOArray*>(  "u","IOArray"),
		make_param<IOArray*>( "vt","IOArray"),
		make_param<int>("flags","int", 0)
}, SVDecomp);
Nan::SetMethod(target, "SVDecomp", core_general_callback::callback);

//export interface ISVDecomp{
//    (src: _st.InputArray, w : _st.OutputArray, u : _st.OutputArray, vt : _st.OutputArray, flags : _st.int /* = 0*/): void;
//}
//
//export var SVDecomp: ISVDecomp = alvision_module.SVDecomp;


    /** wrap SVD::compute */
    //CV_EXPORTS_W void SVDecomp(src : _st.InputArray, w : _st.OutputArray, u : _st.OutputArray, vt : _st.OutputArray, flags : _st.int /* = 0*/);
overload->addOverload("core", "", "SVBackSubst", {
	make_param<IOArray*>(  "w","IOArray"),
	make_param<IOArray*>(  "u","IOArray"),
	make_param<IOArray*>( "vt","IOArray"),
	make_param<IOArray*>("rhs","IOArray"),
	make_param<IOArray*>("dst","IOArray")
}, SVBackSubst);
Nan::SetMethod(target, "SVBackSubst", core_general_callback::callback);

//export interface ISVBackSubst{
//    (w: _st.InputArray, u: _st.InputArray, vt: _st.InputArray,
//        rhs: _st.InputArray, dst: _st.OutputArray): void;
//}
//
//export var SVBackSubst: ISVBackSubst = alvision_module.SVBackSubst;

    /** wrap SVD::backSubst */
    //CV_EXPORTS_W void SVBackSubst(w : _st.InputArray, u : _st.InputArray, vt : _st.InputArray,
    //    rhs : _st.InputArray, dst : _st.OutputArray );

    /** @brief Calculates the Mahalanobis distance between two vectors.
    
    The function Mahalanobis calculates and returns the weighted distance between two vectors:
    \f[d( \texttt{vec1} , \texttt{vec2} )= \sqrt{\sum_{i,j}{\texttt{icovar(i,j)}\cdot(\texttt{vec1}(I)-\texttt{vec2}(I))\cdot(\texttt{vec1(j)}-\texttt{vec2(j)})} }\f]
    The covariance matrix may be calculated using the cv::calcCovarMatrix function and then inverted using
    the invert function (preferably using the cv::DECOMP_SVD method, as the most accurate).
    @param v1 first 1D input vector.
    @param v2 second 1D input vector.
    @param icovar inverse covariance matrix.
    */

overload->addOverload("core", "", "Mahalanobis", {
	make_param<IOArray*>(	 "v1","IOArray"),
	make_param<IOArray*>(	 "v2","IOArray"), 
	make_param<IOArray*>("icovar","IOArray")
}, Mahalanobis);
Nan::SetMethod(target, "Mahalanobis", core_general_callback::callback);

//export interface IMahalanobis{
//    (v1: _st.InputArray, v2: _st.InputArray, icovar: _st.InputArray): _st.double;
//}
//
//export var Mahalanobis: IMahalanobis = alvision_module.Mahalanobis;

    //CV_EXPORTS_W double Mahalanobis(InputArray v1, InputArray v2, InputArray icovar);

    /** @brief Performs a forward or inverse Discrete Fourier transform of a 1D or 2D floating-point array.
    
    The function performs one of the following:
    -   Forward the Fourier transform of a 1D vector of N elements:
        \f[Y = F^{(N)}  \cdot X,\f]
        where \f$F^{(N)}_{jk}=\exp(-2\pi i j k/N)\f$ and \f$i=\sqrt{-1}\f$
    -   Inverse the Fourier transform of a 1D vector of N elements:
        \f[\begin{array}{l} X'=  \left (F^{(N)} \right )^{-1}  \cdot Y =  \left (F^{(N)} \right )^*  \cdot y  \\ X = (1/N)  \cdot X, \end{array}\f]
        where \f$F^*=\left(\textrm{Re}(F^{(N)})-\textrm{Im}(F^{(N)})\right)^T\f$
    -   Forward the 2D Fourier transform of a M x N matrix:
        \f[Y = F^{(M)}  \cdot X  \cdot F^{(N)}\f]
    -   Inverse the 2D Fourier transform of a M x N matrix:
        \f[\begin{array}{l} X'=  \left (F^{(M)} \right )^*  \cdot Y  \cdot \left (F^{(N)} \right )^* \\ X =  \frac{1}{M \cdot N} \cdot X' \end{array}\f]
    
    In case of real (single-channel) data, the output spectrum of the forward Fourier transform or input
    spectrum of the inverse Fourier transform can be represented in a packed format called *CCS*
    (complex-conjugate-symmetrical). It was borrowed from IPL (Intel\* Image Processing Library). Here
    is how 2D *CCS* spectrum looks:
    \f[\begin{bmatrix} Re Y_{0,0} & Re Y_{0,1} & Im Y_{0,1} & Re Y_{0,2} & Im Y_{0,2} &  \cdots & Re Y_{0,N/2-1} & Im Y_{0,N/2-1} & Re Y_{0,N/2}  \\ Re Y_{1,0} & Re Y_{1,1} & Im Y_{1,1} & Re Y_{1,2} & Im Y_{1,2} &  \cdots & Re Y_{1,N/2-1} & Im Y_{1,N/2-1} & Re Y_{1,N/2}  \\ Im Y_{1,0} & Re Y_{2,1} & Im Y_{2,1} & Re Y_{2,2} & Im Y_{2,2} &  \cdots & Re Y_{2,N/2-1} & Im Y_{2,N/2-1} & Im Y_{1,N/2}  \\ \hdotsfor{9} \\ Re Y_{M/2-1,0} &  Re Y_{M-3,1}  & Im Y_{M-3,1} &  \hdotsfor{3} & Re Y_{M-3,N/2-1} & Im Y_{M-3,N/2-1}& Re Y_{M/2-1,N/2}  \\ Im Y_{M/2-1,0} &  Re Y_{M-2,1}  & Im Y_{M-2,1} &  \hdotsfor{3} & Re Y_{M-2,N/2-1} & Im Y_{M-2,N/2-1}& Im Y_{M/2-1,N/2}  \\ Re Y_{M/2,0}  &  Re Y_{M-1,1} &  Im Y_{M-1,1} &  \hdotsfor{3} & Re Y_{M-1,N/2-1} & Im Y_{M-1,N/2-1}& Re Y_{M/2,N/2} \end{bmatrix}\f]
    
    In case of 1D transform of a real vector, the output looks like the first row of the matrix above.
    
    So, the function chooses an operation mode depending on the flags and size of the input array:
    -   If DFT_ROWS is set or the input array has a single row or single column, the function
        performs a 1D forward or inverse transform of each row of a matrix when DFT_ROWS is set.
        Otherwise, it performs a 2D transform.
    -   If the input array is real and DFT_INVERSE is not set, the function performs a forward 1D or
        2D transform:
        -   When DFT_COMPLEX_OUTPUT is set, the output is a complex matrix of the same size as
            input.
        -   When DFT_COMPLEX_OUTPUT is not set, the output is a real matrix of the same size as
            input. In case of 2D transform, it uses the packed format as shown above. In case of a
            single 1D transform, it looks like the first row of the matrix above. In case of
            multiple 1D transforms (when using the DFT_ROWS flag), each row of the output matrix
            looks like the first row of the matrix above.
    -   If the input array is complex and either DFT_INVERSE or DFT_REAL_OUTPUT are not set, the
        output is a complex array of the same size as input. The function performs a forward or
        inverse 1D or 2D transform of the whole input array or each row of the input array
        independently, depending on the flags DFT_INVERSE and DFT_ROWS.
    -   When DFT_INVERSE is set and the input array is real, or it is complex but DFT_REAL_OUTPUT
        is set, the output is a real array of the same size as input. The function performs a 1D or 2D
        inverse transformation of the whole input array or each individual row, depending on the flags
        DFT_INVERSE and DFT_ROWS.
    
    If DFT_SCALE is set, the scaling is done after the transformation.
    
    Unlike dct , the function supports arrays of arbitrary size. But only those arrays are processed
    efficiently, whose sizes can be factorized in a product of small prime numbers (2, 3, and 5 in the
    current implementation). Such an efficient DFT size can be calculated using the getOptimalDFTSize
    method.
    
    The sample below illustrates how to calculate a DFT-based convolution of two 2D real arrays:
    @code
        void convolveDFT(InputArray A, InputArray B, OutputArray C)
        {
            // reallocate the output array if needed
            C.create(abs(A.rows - B.rows)+1, abs(A.cols - B.cols)+1, A.type());
            Size dftSize;
            // calculate the size of DFT transform
            dftSize.width = getOptimalDFTSize(A.cols + B.cols - 1);
            dftSize.height = getOptimalDFTSize(A.rows + B.rows - 1);
    
            // allocate temporary buffers and initialize them with 0's
            Mat tempA(dftSize, A.type(), Scalar::all(0));
            Mat tempB(dftSize, B.type(), Scalar::all(0));
    
            // copy A and B to the top-left corners of tempA and tempB, respectively
            Mat roiA(tempA, Rect(0,0,A.cols,A.rows));
            A.copyTo(roiA);
            Mat roiB(tempB, Rect(0,0,B.cols,B.rows));
            B.copyTo(roiB);
    
            // now transform the padded A & B in-place;
            // use "nonzeroRows" hint for faster processing
            dft(tempA, tempA, 0, A.rows);
            dft(tempB, tempB, 0, B.rows);
    
            // multiply the spectrums;
            // the function handles packed spectrum representations well
            mulSpectrums(tempA, tempB, tempA);
    
            // transform the product back from the frequency domain.
            // Even though all the result rows will be non-zero,
            // you need only the first C.rows of them, and thus you
            // pass nonzeroRows == C.rows
            dft(tempA, tempA, DFT_INVERSE + DFT_SCALE, C.rows);
    
            // now copy the result back to C.
            tempA(Rect(0, 0, C.cols, C.rows)).copyTo(C);
    
            // all the temporary buffers will be deallocated automatically
        }
    @endcode
    To optimize this sample, consider the following approaches:
    -   Since nonzeroRows != 0 is passed to the forward transform calls and since A and B are copied to
        the top-left corners of tempA and tempB, respectively, it is not necessary to clear the whole
        tempA and tempB. It is only necessary to clear the tempA.cols - A.cols ( tempB.cols - B.cols)
        rightmost columns of the matrices.
    -   This DFT-based convolution does not have to be applied to the whole big arrays, especially if B
        is significantly smaller than A or vice versa. Instead, you can calculate convolution by parts.
        To do this, you need to split the output array C into multiple tiles. For each tile, estimate
        which parts of A and B are required to calculate convolution in this tile. If the tiles in C are
        too small, the speed will decrease a lot because of repeated work. In the ultimate case, when
        each tile in C is a single pixel, the algorithm becomes equivalent to the naive convolution
        algorithm. If the tiles are too big, the temporary arrays tempA and tempB become too big and
        there is also a slowdown because of bad cache locality. So, there is an optimal tile size
        somewhere in the middle.
    -   If different tiles in C can be calculated in parallel and, thus, the convolution is done by
        parts, the loop can be threaded.
    
    All of the above improvements have been implemented in matchTemplate and filter2D . Therefore, by
    using them, you can get the performance even better than with the above theoretically optimal
    implementation. Though, those two functions actually calculate cross-correlation, not convolution,
    so you need to "flip" the second convolution operand B vertically and horizontally using flip .
    @note
    -   An example using the discrete fourier transform can be found at
        opencv_source_code/samples/cpp/dft.cpp
    -   (Python) An example using the dft functionality to perform Wiener deconvolution can be found
        at opencv_source/samples/python/deconvolution.py
    -   (Python) An example rearranging the quadrants of a Fourier image can be found at
        opencv_source/samples/python/dft.py
    @param src input array that could be real or complex.
    @param dst output array whose size and type depends on the flags .
    @param flags transformation flags, representing a combination of the cv::DftFlags
    @param nonzeroRows when the parameter is not zero, the function assumes that only the first
    nonzeroRows rows of the input array (DFT_INVERSE is not set) or only the first nonzeroRows of the
    output array (DFT_INVERSE is set) contain non-zeros, thus, the function can handle the rest of the
    rows more efficiently and save some time; this technique is very useful for calculating array
    cross-correlation or convolution using DFT.
    @sa dct , getOptimalDFTSize , mulSpectrums, filter2D , matchTemplate , flip , cartToPolar ,
    magnitude , phase
    */

overload->addOverload("core", "", "dft", {
	make_param<IOArray*>("src","IOArray"),
	make_param<IOArray*>("dst","IOArray"),
	make_param<int>("flags","DftFlags",0),
	make_param<int>("nonzeroRows","int",0)
}, dft);
Nan::SetMethod(target, "dft", core_general_callback::callback);

//    interface Idft{
//        (src: _st.InputArray, dst: _st.OutputArray, flags?: _base.DftFlags | _st.int /* = 0*/, nonzeroRows? : _st.int /* = 0*/): void;
//    }
//
//    export var dft: Idft = alvision_module.dft;


    //CV_EXPORTS_W void dft(src : _st.InputArray, dst : _st.OutputArray, flags : _st.int /* = 0*/, int nonzeroRows = 0);

    /** @brief Calculates the inverse Discrete Fourier Transform of a 1D or 2D array.
    
    idft(src, dst, flags) is equivalent to dft(src, dst, flags | DFT_INVERSE) .
    @note None of dft and idft scales the result by default. So, you should pass DFT_SCALE to one of
    dft or idft explicitly to make these transforms mutually inverse.
    @sa dft, dct, idct, mulSpectrums, getOptimalDFTSize
    @param src input floating-point real or complex array.
    @param dst output array whose size and type depend on the flags.
    @param flags operation flags (see dft and cv::DftFlags).
    @param nonzeroRows number of dst rows to process; the rest of the rows have undefined content (see
    the convolution sample in dft description.
    */

	overload->addOverload("core", "", "idft", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray"),
		make_param<int>("flags","DftFlags", 0),
		make_param<int>("nonzeroRows","int", 0)
	}, idft);
	Nan::SetMethod(target, "idft", core_general_callback::callback);


//    interface Iidft{
//        (src: _st.InputArray, dst: _st.OutputArray, flags?: _base.DftFlags | _st.int /* = 0*/, nonzeroRows?: _st.int /* = 0*/): void;
//    }
//
//    export var idft: Iidft = alvision_module.idft;

    //CV_EXPORTS_W void idft(src : _st.InputArray, dst : _st.OutputArray, flags : _st.int /* = 0*/, int nonzeroRows = 0);

    /** @brief Performs a forward or inverse discrete Cosine transform of 1D or 2D array.
    
    The function dct performs a forward or inverse discrete Cosine transform (DCT) of a 1D or 2D
    floating-point array:
    -   Forward Cosine transform of a 1D vector of N elements:
        \f[Y = C^{(N)}  \cdot X\f]
        where
        \f[C^{(N)}_{jk}= \sqrt{\alpha_j/N} \cos \left ( \frac{\pi(2k+1)j}{2N} \right )\f]
        and
        \f$\alpha_0=1\f$, \f$\alpha_j=2\f$ for *j \> 0*.
    -   Inverse Cosine transform of a 1D vector of N elements:
        \f[X =  \left (C^{(N)} \right )^{-1}  \cdot Y =  \left (C^{(N)} \right )^T  \cdot Y\f]
        (since \f$C^{(N)}\f$ is an orthogonal matrix, \f$C^{(N)} \cdot \left(C^{(N)}\right)^T = I\f$ )
    -   Forward 2D Cosine transform of M x N matrix:
        \f[Y = C^{(N)}  \cdot X  \cdot \left (C^{(N)} \right )^T\f]
    -   Inverse 2D Cosine transform of M x N matrix:
        \f[X =  \left (C^{(N)} \right )^T  \cdot X  \cdot C^{(N)}\f]
    
    The function chooses the mode of operation by looking at the flags and size of the input array:
    -   If (flags & DCT_INVERSE) == 0 , the function does a forward 1D or 2D transform. Otherwise, it
        is an inverse 1D or 2D transform.
    -   If (flags & DCT_ROWS) != 0 , the function performs a 1D transform of each row.
    -   If the array is a single column or a single row, the function performs a 1D transform.
    -   If none of the above is true, the function performs a 2D transform.
    
    @note Currently dct supports even-size arrays (2, 4, 6 ...). For data analysis and approximation, you
    can pad the array when necessary.
    Also, the function performance depends very much, and not monotonically, on the array size (see
    getOptimalDFTSize ). In the current implementation DCT of a vector of size N is calculated via DFT
    of a vector of size N/2 . Thus, the optimal DCT size N1 \>= N can be calculated as:
    @code
        size_t getOptimalDCTSize(size_t N) { return 2*getOptimalDFTSize((N+1)/2); }
        N1 = getOptimalDCTSize(N);
    @endcode
    @param src input floating-point array.
    @param dst output array of the same size and type as src .
    @param flags transformation flags as a combination of cv::DftFlags (DCT_*)
    @sa dft , getOptimalDFTSize , idct
    */

	overload->addOverload("core", "", "dct", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray"),
		make_param<int>("flags","int", 0)
	}, dct);
	Nan::SetMethod(target, "dct", core_general_callback::callback);

    
//    interface Idct {
//        (src: _st.InputArray, dst: _st.OutputArray, flags: _st.int /* = 0*/): void;
//    }
//
//    export var dct: Idct = alvision_module.dct;

    //CV_EXPORTS_W void dct(src : _st.InputArray, dst : _st.OutputArray, flags : _st.int /* = 0*/);

    /** @brief Calculates the inverse Discrete Cosine Transform of a 1D or 2D array.
    
    idct(src, dst, flags) is equivalent to dct(src, dst, flags | DCT_INVERSE).
    @param src input floating-point single-channel array.
    @param dst output array of the same size and type as src.
    @param flags operation flags.
    @sa  dct, dft, idft, getOptimalDFTSize
    */

	overload->addOverload("core", "", "idct", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray"),
		make_param<int>("flags","int",0)
	}, idct);
	Nan::SetMethod(target, "idct", core_general_callback::callback);

    //interface Iidct {
    //    (src: _st.InputArray, dst: _st.OutputArray, flags : _st.int /*= 0*/): void;
    //}
	//
    //export var idct: Idct = alvision_module.idct;
    //CV_EXPORTS_W void idct(src : _st.InputArray, dst : _st.OutputArray, flags : _st.int /* = 0*/);

    /** @brief Performs the per-element multiplication of two Fourier spectrums.
    
    The function mulSpectrums performs the per-element multiplication of the two CCS-packed or complex
    matrices that are results of a real or complex Fourier transform.
    
    The function, together with dft and idft , may be used to calculate convolution (pass conjB=false )
    or correlation (pass conjB=true ) of two arrays rapidly. When the arrays are complex, they are
    simply multiplied (per element) with an optional conjugation of the second-array elements. When the
    arrays are real, they are assumed to be CCS-packed (see dft for details).
    @param a first input array.
    @param b second input array of the same size and type as src1 .
    @param c output array of the same size and type as src1 .
    @param flags operation flags; currently, the only supported flag is cv::DFT_ROWS, which indicates that
    each row of src1 and src2 is an independent 1D Fourier spectrum. If you do not want to use this flag, then simply add a `0` as value.
    @param conjB optional flag that conjugates the second input array before the multiplication (true)
    or not (false).
    */

	overload->addOverload("core", "", "mulSpectrums", {
		make_param<IOArray*>("a","IOArray"),
		make_param<IOArray*>("b","IOArray"),
		make_param<IOArray*>("c","IOArray"),
		make_param<int>("flags","int"),
		make_param<bool>("conjB","bool", false)
	}, mulSpectrums);
	Nan::SetMethod(target, "mulSpectrums", core_general_callback::callback);


//    interface ImulSpectrums{
//        (a : _st.InputArray, b : _st.InputArray, c : _st.OutputArray,
//            flags: _st.int, conjB : boolean /*= false*/);
//}
//
//    export var mulSpectrums: ImulSpectrums = alvision_module.mulSpectrums;
    //CV_EXPORTS_W void mulSpectrums(a : _st.InputArray, b : _st.InputArray, c : _st.OutputArray,
    //    int flags, bool conjB = false);

    /** @brief Returns the optimal DFT size for a given vector size.
    
    DFT performance is not a monotonic function of a vector size. Therefore, when you calculate
    convolution of two arrays or perform the spectral analysis of an array, it usually makes sense to
    pad the input data with zeros to get a bit larger array that can be transformed much faster than the
    original one. Arrays whose size is a power-of-two (2, 4, 8, 16, 32, ...) are the fastest to process.
    Though, the arrays whose size is a product of 2's, 3's, and 5's (for example, 300 = 5\*5\*3\*2\*2)
    are also processed quite efficiently.
    
    The function getOptimalDFTSize returns the minimum number N that is greater than or equal to vecsize
    so that the DFT of a vector of size N can be processed efficiently. In the current implementation N
    = 2 ^p^ \* 3 ^q^ \* 5 ^r^ for some integer p, q, r.
    
    The function returns a negative number if vecsize is too large (very close to INT_MAX ).
    
    While the function cannot be used directly to estimate the optimal vector size for DCT transform
    (since the current DCT implementation supports only even-size vectors), it can be easily processed
    as getOptimalDFTSize((vecsize+1)/2)\*2.
    @param vecsize vector size.
    @sa dft , dct , idft , idct , mulSpectrums
    */

	overload->addOverload("core", "", "getOptimalDFTSize", {
		make_param<int>("vecsize","int"),
	}, getOptimalDFTSize);
	Nan::SetMethod(target, "getOptimalDFTSize", core_general_callback::callback);

//    interface IgetOptimalDFTSize {
//        (vecsize: _st.int): _st.int;
//    }
//
//    export var getOptimalDFTSize: IgetOptimalDFTSize = alvision_module.getOptimalDFTSize;

    //CV_EXPORTS_W int getOptimalDFTSize(int vecsize);

    /** @brief Returns the default random number generator.
    
    The function theRNG returns the default random number generator. For each thread, there is a
    separate random number generator, so you can use the function safely in multi-thread environments.
    If you just need to get a single random number using this generator or initialize an array, you can
    use randu or randn instead. But if you are going to generate many random numbers inside a loop, it
    is much faster to use this function to retrieve the generator and then use RNG::operator _Tp() .
    @sa RNG, randu, randn
    */

	overload->addOverload("core", "", "theRNG", {}, theRNG);
	Nan::SetMethod(target, "theRNG", core_general_callback::callback);

   // interface ItheRNG {
   //     (): RNG;
   // }
   //
   // export var theRNG: ItheRNG = alvision_module.theRNG;

    //CV_EXPORTS RNG& theRNG();

    /** @brief Generates a single uniformly-distributed random number or an array of random numbers.
    
    Non-template variant of the function fills the matrix dst with uniformly-distributed
    random numbers from the specified range:
    \f[\texttt{low} _c  \leq \texttt{dst} (I)_c <  \texttt{high} _c\f]
    @param dst output array of random numbers; the array must be pre-allocated.
    @param low inclusive lower boundary of the generated random numbers.
    @param high exclusive upper boundary of the generated random numbers.
    @sa RNG, randn, theRNG
    */

	overload->addOverload("core", "", "randu", {
		make_param<IOArray*>( "dst","IOArray"),
		make_param<IOArray*>( "low","IOArray"),
		make_param<IOArray*>("high","IOArray")
	}, randu);
	Nan::SetMethod(target, "randu", core_general_callback::callback);

	overload->addOverload("core", "", "randu", {
		make_param<IOArray*>("dst","IOArray"),
		make_param<double>( "low","double"),
		make_param<double>("high","double")
	}, randu_number);

    //interface Irandu {
    //    (dst: _st.InputOutputArray, low : _st.InputArray | Number, high : _st.InputArray | Number): void;
    //}
    //
    //export var randu: Irandu = alvision_module.randu;

    //CV_EXPORTS_W void randu(Inputdst : _st.OutputArray, low : _st.InputArray, high : _st.InputArray);

    /** @brief Fills the array with normally distributed random numbers.
    
    The function randn fills the matrix dst with normally distributed random numbers with the specified
    mean vector and the standard deviation matrix. The generated random numbers are clipped to fit the
    value range of the output array data type.
    @param dst output array of random numbers; the array must be pre-allocated and have 1 to 4 channels.
    @param mean mean value (expectation) of the generated random numbers.
    @param stddev standard deviation of the generated random numbers; it can be either a vector (in
    which case a diagonal standard deviation matrix is assumed) or a square matrix.
    @sa RNG, randu
    */

	overload->addOverload("core", "", "randn", {
		make_param<IOArray*>(   "dst","IOArray"),
		make_param<IOArray*>(  "mean","IOArray"),
		make_param<IOArray*>("stddev","IOArray")
	}, randn);
	Nan::SetMethod(target, "randn", core_general_callback::callback);
    
    //interface Irandn{
    //    (dst: _st.InputOutputArray, mean: _st.InputArray, stddev : _st.InputArray): void;
    //}
	//
    //export var randn: Irandn = alvision_module.randn;

    //CV_EXPORTS_W void randn(Inputdst : _st.OutputArray, mean : _st.InputArray, stddev : _st.InputArray);

    /** @brief Shuffles the array elements randomly.
    
    The function randShuffle shuffles the specified 1D array by randomly choosing pairs of elements and
    swapping them. The number of such swap operations will be dst.rows\*dst.cols\*iterFactor .
    @param dst input/output numerical 1D array.
    @param iterFactor scale factor that determines the number of random swap operations (see the details
    below).
    @param rng optional random number generator used for shuffling; if it is zero, theRNG () is used
    instead.
    @sa RNG, sort
    */

	overload->addOverload("core", "", "randShuffle", {
		make_param<IOArray*>("dst","IOArray"),
		make_param<double>("iterFactor","double", 1.),
		make_param<RNG*>("rng","RNG",RNG::create(0))
	}, randShuffle);
	Nan::SetMethod(target, "randShuffle", core_general_callback::callback);
    
//    interface IrandShuffle{
//        (dst: _st.InputOutputArray, iterFactor: _st.double /* = 1.*/, rng: RNG /*= 0*/): void;
//    }
//
//    export var randShuffle: IrandShuffle = alvision_module.randShuffle;

    //CV_EXPORTS_W void randShuffle(Inputdst : _st.OutputArray, double iterFactor = 1., RNG * rng = 0);


	//PCA::Init(target, overload);
	//LDA::Init(target, overload);
	//SVD::Init(target, overload);
	//RNG::Init(target, overload);
	//RNG_MT19937::Init(target, overload);


//! @} core_array

//! @addtogroup core_cluster
//!  @{

/** @example kmeans.cpp
  An example on K-means clustering
*/

/** @brief Finds centers of clusters and groups input samples around the clusters.

The function kmeans implements a k-means algorithm that finds the centers of cluster_count clusters
and groups the input samples around the clusters. As an output, \f$\texttt{labels}_i\f$ contains a
0-based cluster index for the sample stored in the \f$i^{th}\f$ row of the samples matrix.

@note
-   (Python) An example on K-means clustering can be found at
    opencv_source_code/samples/python/kmeans.py
@param data Data for clustering. An array of N-Dimensional points with float coordinates is needed.
Examples of this array can be:
-   Mat points(count, 2, CV_32F);
-   Mat points(count, 1, CV_32FC2);
-   Mat points(1, count, CV_32FC2);
-   std::vector\<cv::Point2f\> points(sampleCount);
@param K Number of clusters to split the set by.
@param bestLabels Input/output integer array that stores the cluster indices for every sample.
@param criteria The algorithm termination criteria, that is, the maximum number of iterations and/or
the desired accuracy. The accuracy is specified as criteria.epsilon. As soon as each of the cluster
centers moves by less than criteria.epsilon on some iteration, the algorithm stops.
@param attempts Flag to specify the number of times the algorithm is executed using different
initial labellings. The algorithm returns the labels that yield the best compactness (see the last
function parameter).
@param flags Flag that can take values of cv::KmeansFlags
@param centers Output matrix of the cluster centers, one row per each cluster center.
@return The function returns the compactness measure that is computed as
\f[\sum _i  \| \texttt{samples} _i -  \texttt{centers} _{ \texttt{labels} _i} \| ^2\f]
after every attempt. The best (minimum) value is chosen and the corresponding labels and the
compactness value are returned by the function. Basically, you can use only the core of the
function, set the number of attempts to 1, initialize labels each time using a custom algorithm,
pass them with the ( flags = KMEANS_USE_INITIAL_LABELS ) flag, and then choose the best
(most-compact) clustering.
*/


	overload->addOverload("core", "", "kmeans", {
			make_param<IOArray*>("data","IOArray"),
			make_param<int>("K","int"),
			make_param<IOArray*>("bestLabels","IOArray"),
			make_param<TermCriteria*>("criteria","TermCriteria"),
			make_param<int>("attempts","int"),
			make_param<int>("flags","int"),
			make_param<IOArray*>("centers","IOArray",IOArray:: noArray())
	}, kmeans);
	Nan::SetMethod(target, "kmeans", core_general_callback::callback);

//interface Ikmeans {
//    (data: _st.InputArray, K: _st.int, bestLabels: _st.InputOutputArray ,
//        criteria: _types.TermCriteria, attempts: _st.int ,
//        flags: _st.int, centers: _st.OutputArray /* = noArray()*/): _st.double;
//}
//
//export var kmeans: Ikmeans = alvision_module.kmeans;

//! @} core_cluster

//! @addtogroup core_basic
//! @{

/////////////////////////////// Formatted output of cv::Mat ///////////////////////////

/** @todo document */
interface Formatted
{
 //   public:
 //   virtual const char* next() = 0;
 //   virtual void reset() = 0;
 //   virtual ~Formatted();
};

/** @todo document */
interface Formatter
{
 //   public:
 //   enum { FMT_DEFAULT = 0,
 //       FMT_MATLAB = 1,
 //       FMT_CSV = 2,
 //       FMT_PYTHON = 3,
 //       FMT_NUMPY = 4,
 //       FMT_C = 5
 //   };
 //
 //   virtual ~Formatter();
 //
 //   virtual Ptr< Formatted > format(const Mat& mtx) const = 0;
 //
 //   virtual void set32fPrecision(int p = 8) = 0;
 //   virtual void set64fPrecision(int p = 16) = 0;
 //   virtual void setMultiline(bool ml = true) = 0;
 //
 //   static Ptr < Formatter > get(int fmt = FMT_DEFAULT);

};

//static inline
//String & operator << (String & out, Ptr < Formatted > fmtd)
//{
//    fmtd ->reset();
//    for (const char* str = fmtd->next(); str; str = fmtd ->next())
//        out += cv::String(str);
//    return out;
//}
//
//static inline
//String & operator << (String & out, const Mat& mtx)
//    {
//        return out << Formatter::get()->format(mtx);
//}




//template <> struct ParamType< bool >
//    {
//        typedef bool const_param_type;
//        typedef bool member_type;
//
//        enum { type = Param::BOOLEAN };
//    };
//
//template <> struct ParamType< int >
//    {
//        typedef int const_param_type;
//        typedef int member_type;
//
//        enum { type = Param::INT };
//    };
//
//template <> struct ParamType< double >
//    {
//        typedef double const_param_type;
//        typedef double member_type;
//
//        enum { type = Param::REAL };
//    };
//
//template <> struct ParamType< String >
//    {
//        typedef const String& const_param_type;
//        typedef String member_type;
//
//        enum { type = Param::STRING };
//    };
//
//template <> struct ParamType< Mat >
//    {
//        typedef const Mat& const_param_type;
//        typedef Mat member_type;
//
//        enum { type = Param::MAT };
//    };
//
//template <> struct ParamType< std::vector < Mat > >
//    {
//        typedef const std::vector<Mat>& const_param_type;
//typedef std::vector < Mat > member_type;
//
//enum { type = Param::MAT_VECTOR };
//};
//
//template <> struct ParamType< Algorithm >
//    {
//        typedef const Ptr<Algorithm>& const_param_type;
//        typedef Ptr< Algorithm > member_type;
//
//        enum { type = Param::ALGORITHM };
//    };
//
//template <> struct ParamType< float >
//    {
//        typedef float const_param_type;
//        typedef float member_type;
//
//        enum { type = Param::FLOAT };
//    };
//
//template <> struct ParamType< unsigned >
//    {
//        typedef unsigned const_param_type;
//        typedef unsigned member_type;
//
//        enum { type = Param::UNSIGNED_INT };
//    };
//
//template <> struct ParamType< uint64 >
//    {
//        typedef uint64 const_param_type;
//        typedef uint64 member_type;
//
//        enum { type = Param::UINT64 };
//    };
//
//template <> struct ParamType< uchar >
//    {
//        typedef uchar const_param_type;
//        typedef uchar member_type;
//
//        enum { type = Param::UCHAR };
//    };

//! @} core_basic

//} //namespace cv

//#include "opencv2/core/operations.hpp"
//#include "opencv2/core/cvstd.inl.hpp"
//#include "opencv2/core/utility.hpp"
//#include "opencv2/core/optim.hpp"

//#endif /*__OPENCV_CORE_HPP__*/











































	//RNG::Init(target, overload);
	//RNG_MT19937::Init(target, overload);
	//
	//ConjGradSolver::Init(target, overload);
	//DownhillSolver::Init(target, overload);
	//MinProblemSolver::Init(target, overload);
	//Algorithm::Init(target, overload);
	//DMatch::Init(target, overload);














};




POLY_METHOD(core::swap_mat){throw std::exception("not implemented");}
POLY_METHOD(core::swap_umat){throw std::exception("not implemented");}
POLY_METHOD(core::borderInterpolate){throw std::exception("not implemented");}
POLY_METHOD(core::copyMakeBorder){throw std::exception("not implemented");}
POLY_METHOD(core::add){throw std::exception("not implemented");}
POLY_METHOD(core::subtract){throw std::exception("not implemented");}
POLY_METHOD(core::multiply){throw std::exception("not implemented");}
POLY_METHOD(core::divide_mat){throw std::exception("not implemented");}
POLY_METHOD(core::divide_scale){throw std::exception("not implemented");}
POLY_METHOD(core::scaleAdd){throw std::exception("not implemented");}
POLY_METHOD(core::addWeighted){throw std::exception("not implemented");}
POLY_METHOD(core::convertScaleAbs){throw std::exception("not implemented");}
POLY_METHOD(core::LUT){throw std::exception("not implemented");}
POLY_METHOD(core::sum){throw std::exception("not implemented");}
POLY_METHOD(core::countNonZero){throw std::exception("not implemented");}
POLY_METHOD(core::findNonZero){throw std::exception("not implemented");}
POLY_METHOD(core::mean){throw std::exception("not implemented");}
POLY_METHOD(core::meanStdDev){throw std::exception("not implemented");}
POLY_METHOD(core::norm){throw std::exception("not implemented");}
POLY_METHOD(core::norm_src2){throw std::exception("not implemented");}
POLY_METHOD(core::norm_simple){throw std::exception("not implemented");}
POLY_METHOD(core::PSNR){throw std::exception("not implemented");}
POLY_METHOD(core::batchDistance){throw std::exception("not implemented");}
POLY_METHOD(core::normalize){throw std::exception("not implemented");}
POLY_METHOD(core::normalize_sparse){throw std::exception("not implemented");}
POLY_METHOD(core::minMaxIdx){throw std::exception("not implemented");}
POLY_METHOD(core::minMaxLoc_sparse){throw std::exception("not implemented");}
POLY_METHOD(core::minMaxLoc){throw std::exception("not implemented");}
POLY_METHOD(core::reduce){throw std::exception("not implemented");}
POLY_METHOD(core::merge_arr){throw std::exception("not implemented");}
POLY_METHOD(core::merge_size){throw std::exception("not implemented");}
POLY_METHOD(core::split_array){throw std::exception("not implemented");}
POLY_METHOD(core::split_mat){throw std::exception("not implemented");}
POLY_METHOD(core::mixChannels_arr_npairs){throw std::exception("not implemented");}
POLY_METHOD(core::mixChannels_arr){throw std::exception("not implemented");}
POLY_METHOD(core::mixChannels_mat_npairs){throw std::exception("not implemented");}
POLY_METHOD(core::mixChannels_mat){throw std::exception("not implemented");}
POLY_METHOD(core::extractChannel){throw std::exception("not implemented");}
POLY_METHOD(core::insertChannel){throw std::exception("not implemented");}
POLY_METHOD(core::flip){throw std::exception("not implemented");}
POLY_METHOD(core::repeat){throw std::exception("not implemented");}
POLY_METHOD(core::repeat_mat){throw std::exception("not implemented");}
POLY_METHOD(core::hconcat_mat){throw std::exception("not implemented");}
POLY_METHOD(core::hconcat_inputarray){throw std::exception("not implemented");}
POLY_METHOD(core::hconcat_arrayorarrays){throw std::exception("not implemented");}
POLY_METHOD(core::vconcat_array){throw std::exception("not implemented");}
POLY_METHOD(core::vconcat_2src){throw std::exception("not implemented");}
POLY_METHOD(core::vconcat_matrix_array){throw std::exception("not implemented");}
POLY_METHOD(core::bitwise_and){throw std::exception("not implemented");}
POLY_METHOD(core::bitwise_or){throw std::exception("not implemented");}
POLY_METHOD(core::bitwise_xor){throw std::exception("not implemented");}
POLY_METHOD(core::bitwise_not){throw std::exception("not implemented");}
POLY_METHOD(core::absdiff){
	auto src1 = info.at<IOArray*>(0)->GetInputArray();
	auto src2 = info.at<IOArray*>(1)->GetInputArray();
	auto dst = info.at<IOArray*>(2)->GetOutputArray();
	cv::absdiff(src1, src2, dst);

}
POLY_METHOD(core::inRange){throw std::exception("not implemented");}
POLY_METHOD(core::compare){throw std::exception("not implemented");}
POLY_METHOD(core::compare_number){throw std::exception("not implemented");}
POLY_METHOD(core::min_array){throw std::exception("not implemented");}
POLY_METHOD(core::min_mat){throw std::exception("not implemented");}
POLY_METHOD(core::min_umat){throw std::exception("not implemented");}
POLY_METHOD(core::max_array){throw std::exception("not implemented");}
POLY_METHOD(core::max_mat){throw std::exception("not implemented");}
POLY_METHOD(core::max_umat){throw std::exception("not implemented");}
POLY_METHOD(core::sqrt){throw std::exception("not implemented");}
POLY_METHOD(core::pow){throw std::exception("not implemented");}
POLY_METHOD(core::exp){throw std::exception("not implemented");}
POLY_METHOD(core::log){throw std::exception("not implemented");}
POLY_METHOD(core::polarToCart){throw std::exception("not implemented");}
POLY_METHOD(core::cartToPolar){throw std::exception("not implemented");}
POLY_METHOD(core::phase){throw std::exception("not implemented");}
POLY_METHOD(core::magnitude){throw std::exception("not implemented");}
POLY_METHOD(core::checkRange){throw std::exception("not implemented");}
POLY_METHOD(core::patchNaNs){throw std::exception("not implemented");}
POLY_METHOD(core::gemm){throw std::exception("not implemented");}
POLY_METHOD(core::mulTransposed){throw std::exception("not implemented");}
POLY_METHOD(core::transpose){throw std::exception("not implemented");}
POLY_METHOD(core::transform){throw std::exception("not implemented");}
POLY_METHOD(core::perspectiveTransform){throw std::exception("not implemented");}
POLY_METHOD(core::completeSymm){throw std::exception("not implemented");}
POLY_METHOD(core::setIdentity){throw std::exception("not implemented");}
POLY_METHOD(core::determinant){throw std::exception("not implemented");}
POLY_METHOD(core::trace){throw std::exception("not implemented");}
POLY_METHOD(core::invert){throw std::exception("not implemented");}
POLY_METHOD(core::solve){throw std::exception("not implemented");}
POLY_METHOD(core::sort){throw std::exception("not implemented");}
POLY_METHOD(core::sortIdx){throw std::exception("not implemented");}
POLY_METHOD(core::solveCubic){throw std::exception("not implemented");}
POLY_METHOD(core::solvePoly){throw std::exception("not implemented");}
POLY_METHOD(core::eigen){throw std::exception("not implemented");}
POLY_METHOD(core::calcCovarMatrix_array){throw std::exception("not implemented");}
POLY_METHOD(core::calcCovarMatrix_mat){throw std::exception("not implemented");}
POLY_METHOD(core::PCACompute_variance){throw std::exception("not implemented");}
POLY_METHOD(core::PCACompute_maxComponents){throw std::exception("not implemented");}
POLY_METHOD(core::PCAProject){throw std::exception("not implemented");}
POLY_METHOD(core::PCABackProject){throw std::exception("not implemented");}
POLY_METHOD(core::SVDecomp){throw std::exception("not implemented");}
POLY_METHOD(core::SVBackSubst){throw std::exception("not implemented");}
POLY_METHOD(core::Mahalanobis){throw std::exception("not implemented");}
POLY_METHOD(core::dft){throw std::exception("not implemented");}
POLY_METHOD(core::idft){throw std::exception("not implemented");}
POLY_METHOD(core::dct){throw std::exception("not implemented");}
POLY_METHOD(core::idct){throw std::exception("not implemented");}
POLY_METHOD(core::mulSpectrums){throw std::exception("not implemented");}
POLY_METHOD(core::getOptimalDFTSize){throw std::exception("not implemented");}
POLY_METHOD(core::theRNG){
	auto rng = new RNG();
	rng->_rng = std::make_shared<cv::RNG>(cv::theRNG());

	info.SetReturnValue(rng);
}
POLY_METHOD(core::randu){
	auto dst = info.at<IOArray*>(0)->GetInputOutputArray();
	auto low = info.at<IOArray*>(1)->GetInputArray();
	auto high = info.at<IOArray*>(2)->GetInputArray();

	cv::randu(dst, low, high);
}
POLY_METHOD(core::randu_number){
	auto dst = info.at<IOArray*>(0)->GetInputOutputArray();
	auto low  = info.at<double>(1);
	auto high = info.at<double>(2);
	cv::randu(dst, low, high);
}
POLY_METHOD(core::randn){throw std::exception("not implemented");}
POLY_METHOD(core::randShuffle){throw std::exception("not implemented");}
POLY_METHOD(core::kmeans){throw std::exception("not implemented");}

