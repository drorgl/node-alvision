#include "FileNode.h"

#include "../Matrix.h"
#include "../SparseMat.h"
#include "../types/KeyPoint.h"
#include "../types/DMatch.h"
#include "../types/Point.h"
#include "../types/Point3.h"

namespace filenode_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("filenode_general_callback is empty");
		}
		return overload->execute("filenode", info);
	}
}


Nan::Persistent<FunctionTemplate> FileNode::constructor;


void
FileNode::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	filenode_general_callback::overload = overload;

	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(filenode_general_callback::callback);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("FileNode").ToLocalChecked());

	overload->register_type<FileNode>(ctor, "filenode", "FileNode");


	auto FileNodeType = CreateNamedObject(target, "FileNodeType");
	SetObjectProperty(FileNodeType, "NONE",cv::FileNode::NONE		);
	SetObjectProperty(FileNodeType, "INT",cv::FileNode::INT			);
	SetObjectProperty(FileNodeType, "REAL",cv::FileNode::REAL		);
	SetObjectProperty(FileNodeType, "FLOAT",cv::FileNode::FLOAT		);
	SetObjectProperty(FileNodeType, "STR",cv::FileNode::STR			);
	SetObjectProperty(FileNodeType, "STRING",cv::FileNode::STRING		);
	SetObjectProperty(FileNodeType, "REF",cv::FileNode::REF			);
	SetObjectProperty(FileNodeType, "SEQ",cv::FileNode::SEQ			);
	SetObjectProperty(FileNodeType, "MAP",cv::FileNode::MAP			);
	SetObjectProperty(FileNodeType, "TYPE_MASK",cv::FileNode::TYPE_MASK	);
	SetObjectProperty(FileNodeType, "FLOW",cv::FileNode::FLOW		);
	SetObjectProperty(FileNodeType, "USER",cv::FileNode::USER		);
	SetObjectProperty(FileNodeType, "EMPTY",cv::FileNode::EMPTY		);
	SetObjectProperty(FileNodeType, "NAMED",cv::FileNode::NAMED		);
	overload->add_type_alias("FileNodeType", "int");



//		///** @brief File Storage Node class.
//	
//		//The node is used to store each and every element of the file storage opened for reading. When
//		//XML/YAML file is read, it is first parsed and stored in the memory as a hierarchical collection of
//		//nodes. Each node can be a “leaf” that is contain a single number or a string, or be a collection of
//		//other nodes. There can be named collections (mappings) where each element has a name and it is
//		//accessed by a name, and ordered collections (sequences) where elements do not have names but rather
//		//accessed by index. Type of the file node can be determined using FileNode::type method.
//	
//		//Note that file nodes are only used for navigating file storages opened for reading. When a file
//		//storage is opened for writing, no data is stored in memory after it is written.
//		// */
//	
//		export enum FileNodeType
//		{
//			NONE = 0, //!< empty node
//			INT = 1, //!< an integer
//			REAL = 2, //!< floating-point number
//			FLOAT = REAL, //!< synonym or REAL
//			STR = 3, //!< text string in UTF-8 encoding
//			STRING = STR, //!< synonym for STR
//			REF = 4, //!< integer of size size_t. Typically used for storing complex dynamic structures where some elements reference the others
//			SEQ = 5, //!< sequence
//			MAP = 6, //!< mapping
//			TYPE_MASK = 7,
//			FLOW = 8,  //!< compact representation of a sequence or mapping. Used only by YAML writer
//			USER = 16, //!< a registered object (e.g. a matrix)
//			EMPTY = 32, //!< empty structure (sequence or mapping)
//			NAMED = 64  //!< the node has a name (i.e. it is element of a mapping)
//		};
//	
//	
//		export interface FileNode
//		{
//			//public:
//			//    //! type of the file storage node
//	
//			//    /** @brief The constructors.
//	
//			//    These constructors are used to create a default file node, construct it from obsolete structures or
//			//    from the another file node.
//			//     */
//			//    CV_WRAP FileNode();
	overload->addOverloadConstructor("filenode", "FileNode", {}, New);
//	
//			//    /** @overload
//			//    @param fs Pointer to the obsolete file storage structure.
//			//    @param node File node to be used as initialization for the created file node.
//			//    */
//			//    FileNode(const CvFileStorage* fs, const CvFileNode* node);
//	
//			//    /** @overload
//			//    @param node File node to be used as initialization for the created file node.
//			//    */
//			//    FileNode(const FileNode& node);
	overload->addOverloadConstructor("filenode", "FileNode", {},New_node );
//	
//			//    /** @brief Returns element of a mapping node or a sequence node.
//			//    @param nodename Name of an element in the mapping node.
//			//    @returns Returns the element with the given identifier.
//			//     */
//			//    FileNode operator[](const String& nodename) const;
//	
//			//    /** @overload
//			//    @param nodename Name of an element in the mapping node.
//			//    */
//			//    CV_WRAP FileNode operator[](const char* nodename) const;
//		nodes: { [i:string]: FileNode };
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("nodes").ToLocalChecked(), nodes_getter);
//		data: FileNode[];
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("data").ToLocalChecked(), data_getter);
//	
//			//    /** @overload
//			//    @param i Index of an element in the sequence node.
//			//    */
//			//    CV_WRAP FileNode operator[](int i) const;
//	
//			//    /** @brief Returns type of the node.
//			//    @returns Type of the node. See FileNode::Type
//			//     */
//			type() : FileNodeType;
	
	overload->addOverload("filenode", "FileNode", "type", {}, type);
//	
//			//! returns true if the node is empty
//			empty() : boolean;
	overload->addOverload("filenode", "FileNode", "empty", {}, empty);
//			//! returns true if the node is a "none" object
//			isNone() : boolean;
	overload->addOverload("filenode", "FileNode", "isNone", {}, isNone);
//			//! returns true if the node is a sequence
//			isSeq() : boolean;
	overload->addOverload("filenode", "FileNode", "isSeq", {}, isSeq);
//			//! returns true if the node is a mapping
//			isMap() : boolean;
	overload->addOverload("filenode", "FileNode", "isMap", {}, isMap);
//			//! returns true if the node is an integer
//			isInt() : boolean;
	overload->addOverload("filenode", "FileNode", "isInt", {}, isInt);
//			//! returns true if the node is a floating-point number
//			isReal() : boolean;
	overload->addOverload("filenode", "FileNode", "isReal", {}, isReal);
//			//! returns true if the node is a text string
//			isString() : boolean;
	overload->addOverload("filenode", "FileNode", "isString", {}, isString);
//			//! returns true if the node has a name
//			isNamed() : boolean;
	overload->addOverload("filenode", "FileNode", "isNamed", {}, isNamed);
//			//! returns the node name or an empty string if the node is nameless
//			name() : string;
	overload->addOverload("filenode", "FileNode", "name", {}, name);
//			//! returns the number of elements in the node, if it is a sequence or mapping, or 1 otherwise.
//			size() : _st.size_t;
	overload->addOverload("filenode", "FileNode", "size", {}, size);
//			//! returns the node content as an integer. If the node stores floating-point number, it is rounded.
//			int() : _st.int;
	overload->addOverload("filenode", "FileNode", "int", {}, get_int);
//			//! returns the node content as float
//			float() : _st.float;
	overload->addOverload("filenode", "FileNode", "float", {}, get_float);
//			//! returns the node content as double
//			double() : _st.double;
	overload->addOverload("filenode", "FileNode", "double", {}, get_double);
//			//! returns the node content as text string
//			String() : string;
	overload->addOverload("filenode", "FileNode", "String", {}, get_string);
//			//#ifndef OPENCV_NOSTL
//			//    operator std::string() const;
//			//#endif
//	
//			//    //! returns pointer to the underlying file node
//			//    CvFileNode* operator *();
//			//    //! returns pointer to the underlying file node
//			//    const CvFileNode* operator* () const;
//	
//			//    //! returns iterator pointing to the first node element
//			//    FileNodeIterator begin() const;
//			//    //! returns iterator pointing to the element following the last node element
//			//    FileNodeIterator end() const;
//	
//			//    /** @brief Reads node elements to the buffer with the specified format.
//	
//			//    Usually it is more convenient to use operator `>>` instead of this method.
//			//    @param fmt Specification of each array element. See @ref format_spec "format specification"
//			//    @param vec Pointer to the destination array.
//			//    @param len Number of elements to read. If it is greater than number of remaining elements then all
//			//    of them will be read.
//			//     */
//			//    void readRaw( const String& fmt, uchar* vec, size_t len ) const;
//	
//			//    //! reads the registered object and returns pointer to it
//			//    void* readObj() const;
//	
//			//    // do not use wrapper pointer classes for better efficiency
//			//    const CvFileStorage* fs;
//			//    const CvFileNode* node;
//	
//			readInt(default_value ? : _st.int) : _st.int;
	overload->addOverload("filenode", "FileNode", "readInt", {make_param<int>("default_value",0)}, readInt);
//			readFloat(default_value ? : _st.float) : _st.float;
	overload->addOverload("filenode", "FileNode", "readFloat", { make_param<float>("default_value",0) }, readFloat);
//			readDouble(default_value ? : _st.double) : _st.double;
	overload->addOverload("filenode", "FileNode", "readDouble", { make_param<double>("default_value",0) }, readDouble);
//			readString(default_value ? : string) : string;
	overload->addOverload("filenode", "FileNode", "readString", { make_param<std::string>("default_value","") }, readString);
//			readMat(default_mat ? : _mat.Mat) : _mat.Mat;
	overload->addOverload("filenode", "FileNode", "readMat", { make_param<Matrix*>("default_value",Matrix::name,Matrix::create()) }, readMat);
//			readSparseMat(default_mat ? : _mat.SparseMat) : _mat.SparseMat;
	overload->addOverload("filenode", "FileNode", "readSparseMat", { make_param<SparseMat*>("default_value",SparseMat::name, SparseMat::create()) }, readSparseMat);
//			readKeyPoint(keypoints: Array<_types.KeyPoint>);
	overload->addOverload("filenode", "FileNode", "readKeyPoint", { make_param<KeyPoint*>("default_value",KeyPoint::name,KeyPoint::create()) }, readKeyPoint);
//			readDMatch(matches: Array<_types.DMatch>);
	overload->addOverload("filenode", "FileNode", "readDMatch", { make_param<DMatch*>("default_value",DMatch::name,DMatch::create()) }, readDMatch);
//			readPoint2d(points: Array<_types.Point2d>);
	overload->addOverload("filenode", "FileNode", "readPoint2d", { make_param<Point2d*>("default_value",Point2d::name, Point2d::create()) }, readPoint2d);
//			readPoint3d(points: Array<_types.Point3d>);
	overload->addOverload("filenode", "FileNode", "readPoint3d", { make_param<Point3d*>("default_value",Point3d::name,Point3d::create()) }, readPoint3d);
//			readArray<T>(Ttype: string) : Array<T>;
	overload->addOverload("filenode", "FileNode", "readArray", { make_param<std::string>("Ttype", "string",0) }, readArray);
//		};











	target->Set(Nan::New("FileNode").ToLocalChecked(), ctor->GetFunction());

	
};

v8::Local<v8::Function> FileNode::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}



POLY_METHOD(FileNode::New){
	auto fileNode=new FileNode();

	fileNode->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(FileNode::New_node){
	auto fileNode = new FileNode();

	fileNode->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());

}
			
NAN_GETTER(FileNode::nodes_getter){throw std::exception("not implemented");}
NAN_GETTER(FileNode::data_getter){throw std::exception("not implemented");}
			
POLY_METHOD(FileNode::type){throw std::exception("not implemented");}
POLY_METHOD(FileNode::empty){throw std::exception("not implemented");}
POLY_METHOD(FileNode::isNone){throw std::exception("not implemented");}
POLY_METHOD(FileNode::isSeq){throw std::exception("not implemented");}
POLY_METHOD(FileNode::isMap){throw std::exception("not implemented");}
POLY_METHOD(FileNode::isInt){throw std::exception("not implemented");}
POLY_METHOD(FileNode::isReal){throw std::exception("not implemented");}
POLY_METHOD(FileNode::isString){throw std::exception("not implemented");}
POLY_METHOD(FileNode::isNamed){throw std::exception("not implemented");}
POLY_METHOD(FileNode::name){throw std::exception("not implemented");}
POLY_METHOD(FileNode::size){throw std::exception("not implemented");}
POLY_METHOD(FileNode::get_int){throw std::exception("not implemented");}
POLY_METHOD(FileNode::get_float){throw std::exception("not implemented");}
POLY_METHOD(FileNode::get_double){throw std::exception("not implemented");}
POLY_METHOD(FileNode::get_string){throw std::exception("not implemented");}
POLY_METHOD(FileNode::readInt){throw std::exception("not implemented");}
POLY_METHOD(FileNode::readFloat){throw std::exception("not implemented");}
POLY_METHOD(FileNode::readDouble){throw std::exception("not implemented");}
POLY_METHOD(FileNode::readString){throw std::exception("not implemented");}
POLY_METHOD(FileNode::readMat){throw std::exception("not implemented");}
POLY_METHOD(FileNode::readSparseMat){throw std::exception("not implemented");}
POLY_METHOD(FileNode::readKeyPoint){throw std::exception("not implemented");}
POLY_METHOD(FileNode::readDMatch){throw std::exception("not implemented");}
POLY_METHOD(FileNode::readPoint2d){throw std::exception("not implemented");}
POLY_METHOD(FileNode::readPoint3d){throw std::exception("not implemented");}
POLY_METHOD(FileNode::readArray){throw std::exception("not implemented");}

