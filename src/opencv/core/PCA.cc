#include "PCA.h"
#include "../IOArray.h"
#include "../persistence/FileStorage.h"
#include "../persistence/FileNode.h"

namespace pca_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("pca_general_callback is empty");
		}
		return overload->execute("pca", info);
	}
}

Nan::Persistent<FunctionTemplate> PCA::constructor;


void
PCA::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	pca_general_callback::overload = overload;
	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(pca_general_callback::callback);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("PCA").ToLocalChecked());

	overload->register_type<PCA>(ctor, "pca", "PCA");

	auto PCAFlags = CreateNamedObject(target, "PCAFlags");
	SetObjectProperty(PCAFlags, "DATA_AS_ROW", 0);
	SetObjectProperty(PCAFlags, "DATA_AS_COL", 1);
	SetObjectProperty(PCAFlags, "USE_AVG", 2);
	overload->add_type_alias("PCAFlags", "int");

	//interface PCAStatic {
		/** @brief default constructor

		The default constructor initializes an empty %PCA structure. The other
		constructors initialize the structure and call PCA::operator()().
		*/
	overload->addOverloadConstructor("pca", "PCA", {}, New);
	//new () : PCA;

	/** @overload
	@param data input samples stored as matrix rows or matrix columns.
	@param mean optional mean value; if the matrix is empty (@c noArray()),
	the mean is computed from the data.
	@param flags operation flags; currently the parameter is only used to
	specify the data layout (PCA::Flags)
	@param maxComponents maximum number of components that %PCA should
	retain; by default, all the components are retained.
	*/

	//TODO: possible bug, maxComponents/retainedVariance are both valid!
	overload->addOverloadConstructor("pca", "PCA", {
		make_param<IOArray*>("data","IOArray"),
		make_param<IOArray*>("mean","IOArray"),
		make_param<int>("flags","PCAFlags"),
		make_param<int>("maxComponents","int", 0)
	}, New_maxComponents);
	//new (data: _st.InputArray, mean : _st.InputArray, flags : PCAFlags | _st.int, maxComponents ? : _st.int /*= 0*/) : PCA;

	/** @overload
	@param data input samples stored as matrix rows or matrix columns.
	@param mean optional mean value; if the matrix is empty (noArray()),
	the mean is computed from the data.
	@param flags operation flags; currently the parameter is only used to
	specify the data layout (PCA::Flags)
	@param retainedVariance Percentage of variance that PCA should retain.
	Using this parameter will let the PCA decided how many components to
	retain but it will always keep at least 2.
	*/
	overload->addOverloadConstructor("pca", "PCA", {
		make_param<IOArray*>("data","IOArray"),
		make_param<IOArray*>("mean","IOArray"),
		make_param<int>("flags","PCAFlags"),
		make_param<double>("retainedVariance","double")

	}, New_retainedVariance);
	//new (data: _st.InputArray, mean : _st.InputArray, flags : PCAFlags | _st.int, retainedVariance : _st.double) : PCA;

//}
//
//interface PCA
//{
	//public:



	/** @brief performs %PCA

	The operator performs %PCA of the supplied dataset. It is safe to reuse
	the same PCA structure for multiple datasets. That is, if the structure
	has been previously used with another dataset, the existing internal
	data is reclaimed and the new eigenvalues, @ref eigenvectors , and @ref
	mean are allocated and computed.

	The computed eigenvalues are sorted from the largest to the smallest and
	the corresponding eigenvectors are stored as eigenvectors rows.

	@param data input samples stored as the matrix rows or as the matrix
	columns.
	@param mean optional mean value; if the matrix is empty (noArray()),
	the mean is computed from the data.
	@param flags operation flags; currently the parameter is only used to
	specify the data layout. (Flags)
	@param maxComponents maximum number of components that PCA should
	retain; by default, all the components are retained.
	*/

	//TODO: possible bug, maxComponents/retainedVariance are both valid!
	overload->addOverload("pca", "PCA", "pca", {
		make_param<IOArray*>("data","IOArray"),
		make_param<IOArray*>("mean","IOArray"),
		make_param<int>("flags","PCAFlags"),
		make_param<int>("maxComponents","int", 0)
	}, pca_maxComponents);
	//pca(data: _st.InputArray, mean : _st.InputArray, flags : PCAFlags | _st.int, maxComponents ? : _st.int /* = 0*/) : PCA;

	/** @overload
	@param data input samples stored as the matrix rows or as the matrix
	columns.
	@param mean optional mean value; if the matrix is empty (noArray()),
	the mean is computed from the data.
	@param flags operation flags; currently the parameter is only used to
	specify the data layout. (PCA::Flags)
	@param retainedVariance Percentage of variance that %PCA should retain.
	Using this parameter will let the %PCA decided how many components to
	retain but it will always keep at least 2.
	*/
	//TODO: dangerous overload!
	overload->addOverload("pca", "PCA", "pca", {
		make_param<IOArray*>("data","IOArray"),
		make_param<IOArray*>("mean","IOArray"),
		make_param<int>("flags","PCAFlags"),
		make_param<double>("retainedVariance","double")
	}, pca_retainedVariance);
	//pca(data: _st.InputArray, mean : _st.InputArray, flags : PCAFlags | _st.int, retainedVariance : _st.double) : PCA;

	/** @brief Projects vector(s) to the principal component subspace.

	The methods project one or more vectors to the principal component
	subspace, where each vector projection is represented by coefficients in
	the principal component basis. The first form of the method returns the
	matrix that the second form writes to the result. So the first form can
	be used as a part of expression while the second form can be more
	efficient in a processing loop.
	@param vec input vector(s); must have the same dimensionality and the
	same layout as the input data used at %PCA phase, that is, if
	DATA_AS_ROW are specified, then `vec.cols==data.cols`
	(vector dimensionality) and `vec.rows` is the number of vectors to
	project, and the same is true for the PCA::DATA_AS_COL case.
	*/
	overload->addOverload("pca", "PCA", "project", { make_param<IOArray*>("vec","IOArray") }, project);
	//project(vec: _st.InputArray) : _mat.Mat;

	/** @overload
	@param vec input vector(s); must have the same dimensionality and the
	same layout as the input data used at PCA phase, that is, if
	DATA_AS_ROW are specified, then `vec.cols==data.cols`
	(vector dimensionality) and `vec.rows` is the number of vectors to
	project, and the same is true for the PCA::DATA_AS_COL case.
	@param result output vectors; in case of PCA::DATA_AS_COL, the
	output matrix has as many columns as the number of input vectors, this
	means that `result.cols==vec.cols` and the number of rows match the
	number of principal components (for example, `maxComponents` parameter
	passed to the constructor).
	*/
	overload->addOverload("pca", "PCA", "project", {
		make_param<IOArray*>("vec","IOArray"),
		make_param<IOArray*>("result","IOArray")
	}, project_result);
	//project(vec: _st.InputArray, result : _st.OutputArray) : void;

	/** @brief Reconstructs vectors from their PC projections.

	The methods are inverse operations to PCA::project. They take PC
	coordinates of projected vectors and reconstruct the original vectors.
	Unless all the principal components have been retained, the
	reconstructed vectors are different from the originals. But typically,
	the difference is small if the number of components is large enough (but
	still much smaller than the original vector dimensionality). As a
	result, PCA is used.
	@param vec coordinates of the vectors in the principal component
	subspace, the layout and size are the same as of PCA::project output
	vectors.
	*/
	overload->addOverload("pca", "PCA", "backProject", { make_param<IOArray*>("vec","IOArray") }, backProject);
	//backProject(vec: _st.InputArray) : _mat.Mat;

	/** @overload
	@param vec coordinates of the vectors in the principal component
	subspace, the layout and size are the same as of PCA::project output
	vectors.
	@param result reconstructed vectors; the layout and size are the same as
	of PCA::project input vectors.
	*/
	overload->addOverload("pca", "PCA", "backProject", {
		make_param<IOArray*>("vec","IOArray"),
		make_param<IOArray*>("result","IOArray")
	}, backProject_result);
	//backProject(vec: _st.InputArray, result : _st.OutputArray) : void;

	/** @brief write and load PCA matrix

	*/
	overload->addOverload("pca", "PCA", "write", { make_param<FileStorage*>("fs","FileStorage") }, write);
	//write(fs: _persistence.FileStorage) : void;
	overload->addOverload("pca", "PCA", "read", { make_param<FileNode*>("fs","FileNode") }, read);
	//read(fs: _persistence.FileNode) : void;


	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("eigenvectors").ToLocalChecked(), eigenvectors_getter, eigenvectors_setter);
	//eigenvectors: _mat.Mat; //!< eigenvectors of the covariation matrix
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("eigenvalues").ToLocalChecked(), eigenvalues_getter, eigenvalues_setter);
	//eigenvalues: _mat.Mat; //!< eigenvalues of the covariation matrix
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("mean").ToLocalChecked(), mean_getter, mean_setter);
	//mean: _mat.Mat; //!< mean value subtracted before the projection and added after the back projection
	//};

	//export var PCA : PCAStatic = alvision_module.PCA;

	/** @example pca.cpp
	An example using %PCA for dimensionality reduction while maintaining an amount of variance
	*/

	target->Set(Nan::New("PCA").ToLocalChecked(), ctor->GetFunction());

};

v8::Local<v8::Function> PCA::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


POLY_METHOD(PCA::New){
	auto pca = new PCA();

	pca->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(PCA::New_maxComponents){
	throw std::runtime_error("not implemented");
}
POLY_METHOD(PCA::New_retainedVariance){
	throw std::runtime_error("not implemented");
}
POLY_METHOD(PCA::pca_maxComponents){
	throw std::runtime_error("not implemented");
}
POLY_METHOD(PCA::pca_retainedVariance){
	throw std::runtime_error("not implemented");
}
POLY_METHOD(PCA::project){
	throw std::runtime_error("not implemented");
}
POLY_METHOD(PCA::project_result){
	throw std::runtime_error("not implemented");
}
POLY_METHOD(PCA::backProject){
	throw std::runtime_error("not implemented");
}
POLY_METHOD(PCA::backProject_result){
	throw std::runtime_error("not implemented");
}
POLY_METHOD(PCA::write){
	throw std::runtime_error("not implemented");
}
POLY_METHOD(PCA::read){
	throw std::runtime_error("not implemented");
}

NAN_GETTER(PCA::eigenvectors_getter){
	throw std::runtime_error("not implemented");
}
NAN_SETTER(PCA::eigenvectors_setter){
	throw std::runtime_error("not implemented");
}

NAN_GETTER(PCA::eigenvalues_getter){
	throw std::runtime_error("not implemented");
}
NAN_SETTER(PCA::eigenvalues_setter){
	throw std::runtime_error("not implemented");
}

NAN_GETTER(PCA::mean_getter){
	throw std::runtime_error("not implemented");
}
NAN_SETTER(PCA::mean_setter){
	throw std::runtime_error("not implemented");
}

