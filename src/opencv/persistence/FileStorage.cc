#include "FileStorage.h"

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


void
FileStorage::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	

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
		make_param<bool>("owning","boolean",true)
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
//	
//			/** @brief Checks whether the file is opened.
//	
//			@returns true if the object is associated with the current file and false otherwise. It is a
//			good practice to call this method after you tried to open a file.
//			*/
//			isOpened() : boolean;
	overload->addOverload("filestorage", "FileStorage", "isOpened", {}, isOpened);
//	
//			/** @brief Closes the file and releases all the memory buffers.
//	
//			Call this method after all I/O operations with the storage are finished.
//			*/
//			release() : void;
	overload->addOverload("filestorage", "FileStorage", "release", {}, release);
//	
//			/** @brief Closes the file and releases all the memory buffers.
//	
//			Call this method after all I/O operations with the storage are finished. If the storage was
//			opened for writing data and FileStorage::WRITE was specified
//			*/
//			releaseAndGetString() : string;
	overload->addOverload("filestorage", "FileStorage", "releaseAndGetString", {}, releaseAndGetString);
//	
//			/** @brief Returns the first element of the top-level mapping.
//			@returns The first element of the top-level mapping.
//			*/
//			getFirstTopLevelNode() : FileNode;
	overload->addOverload("filestorage", "FileStorage", "getFirstTopLevelNode", {}, getFirstTopLevelNode);
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
//	
//	
//	
//			write(name: string, value : _st.int) : void;
	overload->addOverload("filestorage", "FileStorage", "writeInt", {
		make_param<std::string>("name","String"),
		make_param<int>("value","int")
	}, write_int);
//			write(name: string, value : _st.float) : void;
	overload->addOverload("filestorage", "FileStorage", "writeFloat", {
		make_param<std::string>("name","String"),
		make_param<float>("value","float")
	}, write_float);
//			write(name: string, value : _st.double) : void;
	overload->addOverload("filestorage", "FileStorage", "writeDouble", {
		make_param<std::string>("name","String"),
		make_param<double>("value","double")
	}, write_double);
//			write(name : string, value : string) : void;
	overload->addOverload("filestorage", "FileStorage", "writeString", {
		make_param<std::string>("name","String"),
		make_param<std::string>("value","String")
	}, write_string);
//			write(name : string, value : _mat.Mat) : void;
	overload->addOverload("filestorage", "FileStorage", "writeMat", {
		make_param<std::string>("name","String"),
		make_param<Matrix*>("value",Matrix::name)
	}, write_Mat);
//			write(name : string, value : _mat.SparseMat) : void;
	overload->addOverload("filestorage", "FileStorage", "writeSparseMat", {
		make_param<std::string>("name","String"),
		make_param<SparseMat*>("value",SparseMat::name)
	}, write_SparseMat);
//			write(name: string, value : Array<_types.KeyPoint>) : void;
	overload->addOverload("filestorage", "FileStorage", "writeKeyPoints", {
		make_param<std::string>("name","String"),
		make_param<std::shared_ptr<std::vector<KeyPoint*>>>("value","Array<KeyPoint>")
	}, write_KeyPoints);
//			write(name: string, value : Array<_types.DMatch>) : void;
	overload->addOverload("filestorage", "FileStorage", "writeDmatches", {
		make_param<std::string>("name","String"),
		make_param<std::shared_ptr<std::vector<DMatch*>>>("value","Array<DMatch>")
	}, write_Dmatches);
//	
//			writeScalar(value: _st.int) : void;
	overload->addOverload("filestorage", "FileStorage", "writeScalarInt", {make_param<int>("value","int")}, writeScalar_int);
//			writeScalar(value: _st.float) : void;
	overload->addOverload("filestorage", "FileStorage", "writeScalarFloat", {make_param<float>("value","float")}, writeScalar_float);
//			writeScalar(value: _st.double) : void;
	overload->addOverload("filestorage", "FileStorage", "writeScalarDouble", {make_param<double>("value","double")}, writeScalar_double);
//			writeScalar(value : string) : void;
	overload->addOverload("filestorage", "FileStorage", "writeScalarString", {make_param<std::string>("value","String")}, writeScalar_string);
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


 POLY_METHOD(FileStorage::New){throw std::exception("not implemented");}
 POLY_METHOD(FileStorage::New_source){throw std::exception("not implemented");}
 POLY_METHOD(FileStorage::New_fs){throw std::exception("not implemented");}
 POLY_METHOD(FileStorage::open){throw std::exception("not implemented");}
 POLY_METHOD(FileStorage::isOpened){throw std::exception("not implemented");}
 POLY_METHOD(FileStorage::release){throw std::exception("not implemented");}
 POLY_METHOD(FileStorage::releaseAndGetString){throw std::exception("not implemented");}
 POLY_METHOD(FileStorage::getFirstTopLevelNode){throw std::exception("not implemented");}
 POLY_METHOD(FileStorage::root){throw std::exception("not implemented");}


 NAN_GETTER(FileStorage::nodes_getter){throw std::exception("not implemented");}


 POLY_METHOD(FileStorage::write_int){throw std::exception("not implemented");}
 POLY_METHOD(FileStorage::write_float){throw std::exception("not implemented");}
 POLY_METHOD(FileStorage::write_double){throw std::exception("not implemented");}
 POLY_METHOD(FileStorage::write_string){throw std::exception("not implemented");}
 POLY_METHOD(FileStorage::write_Mat){throw std::exception("not implemented");}
 POLY_METHOD(FileStorage::write_SparseMat){throw std::exception("not implemented");}
 POLY_METHOD(FileStorage::write_KeyPoints){throw std::exception("not implemented");}
 POLY_METHOD(FileStorage::write_Dmatches){throw std::exception("not implemented");}
 POLY_METHOD(FileStorage::writeScalar_int){throw std::exception("not implemented");}
 POLY_METHOD(FileStorage::writeScalar_float){throw std::exception("not implemented");}
 POLY_METHOD(FileStorage::writeScalar_double){throw std::exception("not implemented");}
 POLY_METHOD(FileStorage::writeScalar_string){throw std::exception("not implemented");}


