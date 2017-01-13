#include "LDA.h"
#include "../IOArray.h"
#include "../persistence/FileStorage.h"

namespace lda_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("lda_general_callback is empty");
		}
		return overload->execute("lda", info);
	}
}

Nan::Persistent<FunctionTemplate> LDA::constructor;


void
LDA::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(lda_general_callback::callback);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("LDA").ToLocalChecked());

	overload->register_type<LDA>(ctor, "lda", "LDA");


	//        public:
	//        /** @brief constructor
	//        Initializes a LDA with num_components (default 0).
	//        */
	//        explicit LDA(int num_components = 0);
	overload->addOverloadConstructor("lda", "LDA", { make_param<int>("num_components","int",0) }, New_num);
	//
	//        /** Initializes and performs a Discriminant Analysis with Fisher's
	//         Optimization Criterion on given data in src and corresponding labels
	//         in labels. If 0 (or less) number of components are given, they are
	//         automatically determined for given data in computation.
	//        */
	overload->addOverloadConstructor("lda", "LDA", {
			make_param<IOArray*>("src","IOArray"),
			make_param<IOArray*>("labels","IOArray"),
			make_param<int>("num_components","int", 0)
	}, New_array);
	//        LDA(src: _st.InputArrayOfArrays, InputArray labels, int num_components = 0);

	overload->addStaticOverload("lda", "LDA", "subspaceProject", {
		make_param<IOArray*>(   "W","IOArray"),
		make_param<IOArray*>("mean","IOArray"), 
		make_param<IOArray*>( "src","IOArray")
	}, subspaceProject);
	//    static Mat subspaceProject(InputArray W, mean : _st.InputArray, src : _st.InputArray);
	overload->addStaticOverload("lda", "LDA", "subspaceReconstruct", {
		make_param<IOArray*>("W","IOArray"),
		make_param<IOArray*>("mean","IOArray"),
		make_param<IOArray*>("src","IOArray")
	}, subspaceReconstruct);
	//    static Mat subspaceReconstruct(InputArray W, mean : _st.InputArray, src : _st.InputArray);

	
//}

//interface LDA
//{
	//        
	//
	//        /** Serializes this object to a given filename.
	//          */
	overload->addOverload("lda", "LDA", "save", {make_param<std::string>("filename","String")}, save);
	//        void save(const String& filename) const;
	//
	//        /** Deserializes this object from a given filename.
	//          */
	overload->addOverload("lda", "LDA", "load", {make_param<std::string>("filename","String")}, load);
	//        void load(const String& filename);
	//
	//        /** Serializes this object to a given cv::FileStorage.
	//          */
	overload->addOverload("lda", "LDA", "save", {make_param<FileStorage*>("fs","FileStorage")}, save_filestorage);
	//        void save(FileStorage & fs) const;
	//
	//        /** Deserializes this object from a given cv::FileStorage.
	//          */
	overload->addOverload("lda", "LDA", "load", { make_param<FileStorage*>("fs","FileStorage") }, load_filestorage);
	//        void load(const FileStorage& node);
	//
	//        /** destructor
	//          */
	//        ~LDA();
	//
	//        /** Compute the discriminants for data in src (row aligned) and labels.
	//          */
	overload->addOverload("lda", "LDA", "compute", {
		 make_param<IOArray*>(   "src","IOArray"),
		 make_param<IOArray*>("labels","IOArray")
	}, compute);
	//        void compute(src : _st.InputArrayOfArrays, InputArray labels);
	//
	//        /** Projects samples into the LDA subspace.
	//            src may be one or more row aligned samples.
	//          */
	overload->addOverload("lda", "LDA", "project", { make_param<IOArray*>("src","IOArray") }, project);
	//        Mat project(src : _st.InputArray);
	//
	//        /** Reconstructs projections from the LDA subspace.
	//            src may be one or more row aligned projections.
	//          */
	overload->addOverload("lda", "LDA", "reconstruct", { make_param<IOArray*>("src","IOArray") }, reconstruct);
	//        Mat reconstruct(src : _st.InputArray);
	//
	//        /** Returns the eigenvectors of this LDA.
	//          */
	overload->addOverload("lda", "LDA", "eigenvectors", {}, eigenvectors);
	//        Mat eigenvectors() const { return _eigenvectors; }
	//
	//    /** Returns the eigenvalues of this LDA.
	//      */
	overload->addOverload("lda", "LDA", "eigenvalues", {}, eigenvalues);
	//    Mat eigenvalues() const { return _eigenvalues; }
	//
//
	//protected:
	//bool _dataAsRow; // unused, but needed for 3.0 ABI compatibility.
	//int _num_components;
	//Mat _eigenvectors;
	//Mat _eigenvalues;
	//void lda(src : _st.InputArrayOfArrays, InputArray labels);

	target->Set(Nan::New("LDA").ToLocalChecked(), ctor->GetFunction());

};

v8::Local<v8::Function> LDA::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


POLY_METHOD(LDA::New_num) {
	auto lda = new LDA();

	lda->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

 POLY_METHOD(LDA::New_array){
	 throw std::exception("not implemented");
 }

 POLY_METHOD(LDA::subspaceProject){
	 throw std::exception("not implemented");
 }
 POLY_METHOD(LDA::subspaceReconstruct){
	 throw std::exception("not implemented");
 }
 POLY_METHOD(LDA::save){
	 throw std::exception("not implemented");
 }
 POLY_METHOD(LDA::load){
	 throw std::exception("not implemented");
 }
 POLY_METHOD(LDA::save_filestorage){
	 throw std::exception("not implemented");
 }
 POLY_METHOD(LDA::load_filestorage){
	 throw std::exception("not implemented");
 }
 POLY_METHOD(LDA::compute){
	 throw std::exception("not implemented");
 }
 POLY_METHOD(LDA::project){
	 throw std::exception("not implemented");
 }
 POLY_METHOD(LDA::reconstruct){
	 throw std::exception("not implemented");
 }
 POLY_METHOD(LDA::eigenvectors){
	 throw std::exception("not implemented");
 }
 POLY_METHOD(LDA::eigenvalues){
	 throw std::exception("not implemented");
 }

