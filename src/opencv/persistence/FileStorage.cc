#include "FileStorage.h"

#include "FileNode.h"

#include "../Matrix.h"
#include "../SparseMat.h"
#include "../types/DMatch.h"
#include "../types/KeyPoint.h"


namespace filestorage_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("filestorage_general_callback is empty");
		}
		return overload->execute("filestorage", info);
	}
}


Nan::Persistent<FunctionTemplate> FileStorage::constructor;
std::string FileStorage::name = "FileStorage";

void
FileStorage::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	filestorage_general_callback::overload = overload;

	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(filestorage_general_callback::callback);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("FileStorage").ToLocalChecked());

	overload->register_type<FileStorage>(ctor, "filestorage", "FileStorage");



	auto FileStorageMode = CreateNamedObject(target, "FileStorageMode");
	SetObjectProperty(FileStorageMode, "READ		",cv::FileStorage::READ			);
	SetObjectProperty(FileStorageMode, "WRITE 		",cv::FileStorage::WRITE 		);
	SetObjectProperty(FileStorageMode, "APPEND		",cv::FileStorage::APPEND		);
	SetObjectProperty(FileStorageMode, "MEMORY		",cv::FileStorage::MEMORY		);
	SetObjectProperty(FileStorageMode, "FORMAT_MASK ",cv::FileStorage::FORMAT_MASK	);
	SetObjectProperty(FileStorageMode, "FORMAT_AUTO ",cv::FileStorage::FORMAT_AUTO	);
	SetObjectProperty(FileStorageMode, "FORMAT_XML 	",cv::FileStorage::FORMAT_XML 	);
	SetObjectProperty(FileStorageMode, "FORMAT_YAML	",cv::FileStorage::FORMAT_YAML	);
	overload->add_type_alias("FileStorageMode", "int");


	//////////////////////////// XML & YAML I/O //////////////////////////

	//class CV_EXPORTS FileNode;
	//class CV_EXPORTS FileNodeIterator;

	//! file storage mode
	//export enum FileStorageMode
	//{
	//	READ = 0, //!< value, open the file for reading
	//	WRITE = 1, //!< value, open the file for writing
	//	APPEND = 2, //!< value, open the file for appending
	//	MEMORY = 4, //!< flag, read data from source or write data to the internal buffer (which is
	//				//!< returned by FileStorage::release)
	//	FORMAT_MASK = (7 << 3), //!< mask for format flags
	//	FORMAT_AUTO = 0,      //!< flag, auto format
	//	FORMAT_XML = (1 << 3), //!< flag, XML format
	//	FORMAT_YAML = (2 << 3)  //!< flag, YAML format
	//};


//		interface FileStorageStatic {
//			/** @brief The constructors.
//	
//			The full constructor opens the file. Alternatively you can use the default constructor and then
//			call FileStorage::open.
//			*/
//			new () : FileStorage;
	overload->addOverloadConstructor("filestorage", "FileStorage", {}, New);
//	
//			/** @overload
//			@param source Name of the file to open or the text string to read the data from. Extension of the
//			file (.xml or .yml/.yaml) determines its format (XML or YAML respectively). Also you can append .gz
//			to work with compressed files, for example myHugeMatrix.xml.gz. If both FileStorage::WRITE and
//			FileStorage::MEMORY flags are specified, source is used just to specify the output file format (e.g.
//			mydata.xml, .yml etc.).
//			@param flags Mode of operation. See  FileStorage::Mode
//			@param encoding Encoding of the file. Note that UTF-16 XML encoding is not supported currently and
//			you should use 8-bit encoding instead of it.
//			*/
//			new (source : string, flags : FileStorageMode, encoding ? : string) : FileStorage;
	overload->addOverloadConstructor("filestorage", "FileStorage", {
		make_param<std::string>("source","String"),
		make_param<int>("flags","FileStorageMode"),
		make_param<std::string>("encoding","String","")
	}, New_source);
//	
//			/** @overload */
//			new(fs : FileStorage, owning ? : boolean /*=true*/) : FileStorage
	overload->addOverloadConstructor("filestorage", "FileStorage", {
		make_param<FileStorage*>("fs","FileStorage"),
		make_param<bool>("owning","bool",true)
	}, New_fs);
//	
//				//    //! the destructor. calls release()
//				//    virtual ~FileStorage();
//	
//		}
//	
//		///** @brief XML/YAML file storage class that encapsulates all the information necessary for writing or reading
//		//data to/from a file.
//		// */
//		export interface FileStorage
//		{
//			//public:
//			//    enum
//			//    {
//			//        UNDEFINED      = 0,
//			//        VALUE_EXPECTED = 1,
//			//        NAME_EXPECTED  = 2,
//			//        INSIDE_MAP     = 4
//			//    };
//	
//	
//			/** @brief Opens a file.
//	
//			See description of parameters in FileStorage::FileStorage. The method calls FileStorage::release
//			before opening the file.
//			@param filename Name of the file to open or the text string to read the data from.
//			Extension of the file (.xml or .yml/.yaml) determines its format (XML or YAML respectively).
//			Also you can append .gz to work with compressed files, for example myHugeMatrix.xml.gz. If both
//			FileStorage::WRITE and FileStorage::MEMORY flags are specified, source is used just to specify
//			the output file format (e.g. mydata.xml, .yml etc.).
//			@param flags Mode of operation. One of FileStorage::Mode
//			@param encoding Encoding of the file. Note that UTF-16 XML encoding is not supported currently and
//			you should use 8-bit encoding instead of it.
//			*/
//			open(filename : string, flags : FileStorageMode, encoding ? : string /*=String()*/) : boolean;
	overload->addOverload("filestorage", "FileStorage", "open", {
		make_param<std::string>("filename","String"),
		make_param<int>("flags","FileStorageMode"),
		make_param<std::string>("encoding","String","")
	}, open);
	Nan::SetPrototypeMethod(ctor, "open", filestorage_general_callback::callback);
//	
//			/** @brief Checks whether the file is opened.
//	
//			@returns true if the object is associated with the current file and false otherwise. It is a
//			good practice to call this method after you tried to open a file.
//			*/
//			isOpened() : boolean;
	overload->addOverload("filestorage", "FileStorage", "isOpened", {}, isOpened);
	Nan::SetPrototypeMethod(ctor, "isOpened", filestorage_general_callback::callback);
//	
//			/** @brief Closes the file and releases all the memory buffers.
//	
//			Call this method after all I/O operations with the storage are finished.
//			*/
//			release() : void;
	overload->addOverload("filestorage", "FileStorage", "release", {}, release);
	Nan::SetPrototypeMethod(ctor, "release", filestorage_general_callback::callback);
//	
//			/** @brief Closes the file and releases all the memory buffers.
//	
//			Call this method after all I/O operations with the storage are finished. If the storage was
//			opened for writing data and FileStorage::WRITE was specified
//			*/
//			releaseAndGetString() : string;
	overload->addOverload("filestorage", "FileStorage", "releaseAndGetString", {}, releaseAndGetString);
	Nan::SetPrototypeMethod(ctor, "releaseAndGetString", filestorage_general_callback::callback);
//	
//			/** @brief Returns the first element of the top-level mapping.
//			@returns The first element of the top-level mapping.
//			*/
//			getFirstTopLevelNode() : FileNode;
	overload->addOverload("filestorage", "FileStorage", "getFirstTopLevelNode", {}, getFirstTopLevelNode);
	Nan::SetPrototypeMethod(ctor, "getFirstTopLevelNode", filestorage_general_callback::callback);
//	
//			/** @brief Returns the top-level mapping
//			@param streamidx Zero-based index of the stream. In most cases there is only one stream in the file.
//			However, YAML supports multiple streams and so there can be several.
//			@returns The top-level mapping.
//			*/
//			root(streamidx ? : _st.int/* = 0*/) : FileNode;
	overload->addOverload("filestorage", "FileStorage", "root", {
		make_param<int>("streamidx","int",0)
	}, root);
	Nan::SetPrototypeMethod(ctor, "root", filestorage_general_callback::callback);
//	
//			//    /** @brief Returns the specified element of the top-level mapping.
//			//    @param nodename Name of the file node.
//			//    @returns Node with the given name.
//			//     */
//			//    FileNode operator[](const String& nodename) const;
//	
//			//    /** @overload */
//			//    CV_WRAP FileNode operator[](const char* nodename) const;
//	
//			//    /** @brief Returns the obsolete C FileStorage structure.
//			//    @returns Pointer to the underlying C FileStorage structure
//			//     */
//			//    CvFileStorage* operator *() { return fs.get(); }
//	
//			//    /** @overload */
//			//    const CvFileStorage* operator *() const { return fs.get(); }
//	
//			//    /** @brief Writes multiple numbers.
//	
//			//    Writes one or more numbers of the specified format to the currently written structure. Usually it is
//			//    more convenient to use operator `<<` instead of this method.
//			//    @param fmt Specification of each array element, see @ref format_spec "format specification"
//			//    @param vec Pointer to the written array.
//			//    @param len Number of the uchar elements to write.
//			//     */
//			//    void writeRaw( const String& fmt, const uchar* vec, size_t len );
//	
//			//    /** @brief Writes the registered C structure (CvMat, CvMatND, CvSeq).
//			//    @param name Name of the written object.
//			//    @param obj Pointer to the object.
//			//    @see ocvWrite for details.
//			//     */
//			//    void writeObj( const String& name, const void* obj );
//	
//			//    /** @brief Returns the normalized object name for the specified name of a file.
//			//    @param filename Name of a file
//			//    @returns The normalized object name.
//			//     */
//			//    static String getDefaultObjectName(const String& filename);
//	
//			//    Ptr<CvFileStorage> fs; //!< the underlying C FileStorage structure
//			//    String elname; //!< the currently written element
//			//    std::vector<char> structs; //!< the stack of written structures
//			//    int state; //!< the writer state
//	
//		nodes: { [i:string]: FileNode };
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("nodes").ToLocalChecked(), nodes_getter);
	Nan::SetNamedPropertyHandler(ctor->InstanceTemplate(), indexed_getter, indexed_setter);
//	
//	
//	
//			write(name: string, value : _st.int) : void;
	overload->addOverload("filestorage", "FileStorage", "writeInt", {
		make_param<std::string>("name","String"),
		make_param<int>("value","int")
	}, write_int);
	Nan::SetPrototypeMethod(ctor, "writeInt", filestorage_general_callback::callback);
//			write(name: string, value : _st.float) : void;
	overload->addOverload("filestorage", "FileStorage", "writeFloat", {
		make_param<std::string>("name","String"),
		make_param<float>("value","float")
	}, write_float);
	Nan::SetPrototypeMethod(ctor, "writeFloat", filestorage_general_callback::callback);
//			write(name: string, value : _st.double) : void;
	overload->addOverload("filestorage", "FileStorage", "writeDouble", {
		make_param<std::string>("name","String"),
		make_param<double>("value","double")
	}, write_double);
	Nan::SetPrototypeMethod(ctor, "writeDouble", filestorage_general_callback::callback);
//			write(name : string, value : string) : void;
	overload->addOverload("filestorage", "FileStorage", "writeString", {
		make_param<std::string>("name","String"),
		make_param<std::string>("value","String")
	}, write_string);
	Nan::SetPrototypeMethod(ctor, "writeString", filestorage_general_callback::callback);
//			write(name : string, value : _mat.Mat) : void;
	overload->addOverload("filestorage", "FileStorage", "writeMat", {
		make_param<std::string>("name","String"),
		make_param<Matrix*>("value",Matrix::name)
	}, write_Mat);
	Nan::SetPrototypeMethod(ctor, "writeMat", filestorage_general_callback::callback);
//			write(name : string, value : _mat.SparseMat) : void;
	overload->addOverload("filestorage", "FileStorage", "writeSparseMat", {
		make_param<std::string>("name","String"),
		make_param<SparseMat*>("value",SparseMat::name)
	}, write_SparseMat);
	Nan::SetPrototypeMethod(ctor, "writeSparseMat", filestorage_general_callback::callback);
//			write(name: string, value : Array<_types.KeyPoint>) : void;
	overload->addOverload("filestorage", "FileStorage", "writeKeyPoints", {
		make_param<std::string>("name","String"),
		make_param<std::shared_ptr<std::vector<KeyPoint*>>>("value","Array<KeyPoint>")
	}, write_KeyPoints);
	Nan::SetPrototypeMethod(ctor, "writeKeyPoints", filestorage_general_callback::callback);
//			write(name: string, value : Array<_types.DMatch>) : void;
	overload->addOverload("filestorage", "FileStorage", "writeDmatches", {
		make_param<std::string>("name","String"),
		make_param<std::shared_ptr<std::vector<DMatch*>>>("value","Array<DMatch>")
	}, write_Dmatches);
	Nan::SetPrototypeMethod(ctor, "writeDmatches", filestorage_general_callback::callback);
//	
//			writeScalar(value: _st.int) : void;
	overload->addOverload("filestorage", "FileStorage", "writeScalarInt", {make_param<int>("value","int")}, writeScalar_int);
	Nan::SetPrototypeMethod(ctor, "writeScalarInt", filestorage_general_callback::callback);
//			writeScalar(value: _st.float) : void;
	overload->addOverload("filestorage", "FileStorage", "writeScalarFloat", {make_param<float>("value","float")}, writeScalar_float);
	Nan::SetPrototypeMethod(ctor, "writeScalarFloat", filestorage_general_callback::callback);
//			writeScalar(value: _st.double) : void;
	overload->addOverload("filestorage", "FileStorage", "writeScalarDouble", {make_param<double>("value","double")}, writeScalar_double);
	Nan::SetPrototypeMethod(ctor, "writeScalarDouble", filestorage_general_callback::callback);
//			writeScalar(value : string) : void;
	overload->addOverload("filestorage", "FileStorage", "writeScalarString", {make_param<std::string>("value","String")}, writeScalar_string);
	Nan::SetPrototypeMethod(ctor, "writeScalarString", filestorage_general_callback::callback);
//	
//		};
//	
//		export var FileStorage : FileStorageStatic = alvision_module.FileStorage;

	//template<> CV_EXPORTS void DefaultDeleter<CvFileStorage>::operator ()(CvFileStorage* obj) const;

	target->Set(Nan::New("FileStorage").ToLocalChecked(), ctor->GetFunction());
};

v8::Local<v8::Function> FileStorage::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}

//
//NAN_METHOD(FileStorage::New) {
//	
//	if (info.This()->InternalFieldCount() == 0)
//		Nan::ThrowTypeError("Cannot instantiate without new");
//
//	FileStorage *fileStorage;
//
//	//if (info.Length() == 0){
//		fileStorage = new FileStorage();
//	//}
//
//	fileStorage->Wrap(info.Holder());
//	info.GetReturnValue().Set(info.Holder());
//}
//
//NAN_METHOD(FileStorage::isOpened) {
//	return Nan::ThrowError("not implemented");
//}


POLY_METHOD(FileStorage::New) {
	auto fileStorage = new FileStorage();

	fileStorage->_fileStorage = std::make_shared<cv::FileStorage>();

	fileStorage->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
 POLY_METHOD(FileStorage::New_source){
	 auto fileStorage = new FileStorage();

	 fileStorage->_fileStorage = std::make_shared<cv::FileStorage>(info.at<std::string>(0), info.at<int>(1), info.at<std::string>(2));

	 fileStorage->Wrap(info.Holder());
	 info.GetReturnValue().Set(info.Holder());
 }
 POLY_METHOD(FileStorage::New_fs){
	 auto fileStorage = new FileStorage();

	 fileStorage->_fileStorage = info.at<FileStorage*>(0)->_fileStorage;

	 fileStorage->Wrap(info.Holder());
	 info.GetReturnValue().Set(info.Holder());
 }
 POLY_METHOD(FileStorage::open){
	 auto this_ = info.This<FileStorage*>();
	 auto ret = this_->_fileStorage->open(info.at<std::string>(0), info.at<int>(1), info.at<std::string>(2));
	 info.SetReturnValue(ret);
 }
 POLY_METHOD(FileStorage::isOpened){
	 auto this_ = info.This<FileStorage*>();
	 auto ret = this_->_fileStorage->isOpened();
	 info.SetReturnValue(ret);
 }
 POLY_METHOD(FileStorage::release){
	 auto this_ = info.This<FileStorage*>();
	 this_->_fileStorage->release();
 }
 POLY_METHOD(FileStorage::releaseAndGetString){
	 auto this_ = info.This<FileStorage*>();
	 this_->_fileStorage->releaseAndGetString();
 }
 POLY_METHOD(FileStorage::getFirstTopLevelNode){
	 auto this_ = info.This<FileStorage*>();
	 
	 auto fileNode = new FileNode();
	 fileNode->_fileNode = std::make_shared<cv::FileNode>(this_->_fileStorage->getFirstTopLevelNode());
	 info.SetReturnValue(fileNode);
 }

 POLY_METHOD(FileStorage::root){
	 auto this_ = info.This<FileStorage*>();

	 auto fileNode = new FileNode();
	 fileNode->_fileNode = std::make_shared<cv::FileNode>(this_->_fileStorage->root(info.at<int>(0)));
	 info.SetReturnValue(fileNode);
 }


 NAN_GETTER(FileStorage::nodes_getter){
	 auto this_ = or ::ObjectWrap::Unwrap<FileStorage>(info.This());
	 auto ret = new FileNode();
	 ret->_fileNode = std::make_shared<cv::FileNode>(this_->_fileStorage->root());

	 info.GetReturnValue().Set(ret->Wrap());
 }

 NAN_PROPERTY_GETTER(FileStorage::indexed_getter){
	 try {
		 auto this_ = or ::ObjectWrap::Unwrap<FileStorage>(info.This());
		 if (property->IsString()) {
			auto property_name = *Nan::Utf8String(property);

			 if (!(*this_->_fileStorage)[property_name].empty()) {

				  auto ret = new FileNode();
				  ret->_fileNode = std::make_shared<cv::FileNode>((*this_->_fileStorage)[*Nan::Utf8String(property)]);

				  info.GetReturnValue().Set(ret->Wrap());
				  return;
			 }
		 }
	 }
	 catch (std::exception &ex) {
		 return Nan::ThrowError(ex.what());
	 }
	 info.GetReturnValue().Set(info.This()->GetPrototype()->ToObject()->Get(property));
 }
 NAN_PROPERTY_SETTER(FileStorage::indexed_setter){
	 auto this_ = or ::ObjectWrap::Unwrap<FileStorage>(info.This());
	 
	 if (filestorage_general_callback::overload->get_type(value) != "FileNode") {
		 return Nan::ThrowTypeError("only FileNode is valid");
	 }
	 
	 auto alvision_value = or ::ObjectWrap::Unwrap<FileNode>(value.As<v8::Object>());
	 (*this_->_fileStorage)[*Nan::Utf8String(property)] = *alvision_value->_fileNode;
 }


 POLY_METHOD(FileStorage::write_int){
	 auto this_ = info.This<FileStorage*>();
	 *this_->_fileStorage << info.at<std::string>(0) << info.at<int>(1);
 
 }
 POLY_METHOD(FileStorage::write_float){
	 auto this_ = info.This<FileStorage*>();
	 *this_->_fileStorage << info.at<std::string>(0) << info.at<float>(1);
 }
 POLY_METHOD(FileStorage::write_double){
	 auto this_ = info.This<FileStorage*>();
	 *this_->_fileStorage << info.at<std::string>(0) << info.at<double>(1);

 }
 POLY_METHOD(FileStorage::write_string){
	 auto this_ = info.This<FileStorage*>();
	 *this_->_fileStorage << info.at<std::string>(0) << info.at<std::string>(1);
 }
 POLY_METHOD(FileStorage::write_Mat){
	 auto this_ = info.This<FileStorage*>();
	 *this_->_fileStorage << info.at<std::string>(0) << *info.at<Matrix*>(1)->_mat;
 }
 POLY_METHOD(FileStorage::write_SparseMat){
	 auto this_ = info.This<FileStorage*>();
	 *this_->_fileStorage << info.at<std::string>(0) << *info.at<SparseMat*>(1)->_sparseMat;
 }
 POLY_METHOD(FileStorage::write_KeyPoints){throw std::exception("not implemented");}
 POLY_METHOD(FileStorage::write_Dmatches){throw std::exception("not implemented");}
 POLY_METHOD(FileStorage::writeScalar_int){
	 auto this_ = info.This<FileStorage*>();
	 *this_->_fileStorage << info.at<int>(0);
 }
 POLY_METHOD(FileStorage::writeScalar_float){
	 auto this_ = info.This<FileStorage*>();
	 *this_->_fileStorage << info.at<float>(0);
 }
 POLY_METHOD(FileStorage::writeScalar_double){
	 auto this_ = info.This<FileStorage*>();
	 *this_->_fileStorage << info.at<double>(0);
 }
 POLY_METHOD(FileStorage::writeScalar_string){
	 auto this_ = info.This<FileStorage*>();
	 *this_->_fileStorage << info.at<std::string>(0);
 }


