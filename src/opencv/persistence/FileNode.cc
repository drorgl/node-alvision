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
			throw std::runtime_error("filenode_general_callback is empty");
		}
		return overload->execute("filenode", info);
	}
}


Nan::Persistent<FunctionTemplate> FileNode::constructor;
std::string FileNode::name;


void
FileNode::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	filenode_general_callback::overload = overload;
	FileNode::name = "FileNode";

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
	overload->addOverloadConstructor("filenode", "FileNode", {make_param<FileNode*>("node",FileNode::name)},New_node );
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
	Nan::SetPrototypeMethod(ctor, "type", filenode_general_callback::callback);
//	
//			//! returns true if the node is empty
//			empty() : boolean;
	overload->addOverload("filenode", "FileNode", "empty", {}, empty);
	Nan::SetPrototypeMethod(ctor, "empty", filenode_general_callback::callback);
//			//! returns true if the node is a "none" object
//			isNone() : boolean;
	overload->addOverload("filenode", "FileNode", "isNone", {}, isNone);
	Nan::SetPrototypeMethod(ctor, "isNone", filenode_general_callback::callback);
//			//! returns true if the node is a sequence
//			isSeq() : boolean;
	overload->addOverload("filenode", "FileNode", "isSeq", {}, isSeq);
	Nan::SetPrototypeMethod(ctor, "isSeq", filenode_general_callback::callback);
//			//! returns true if the node is a mapping
//			isMap() : boolean;
	overload->addOverload("filenode", "FileNode", "isMap", {}, isMap);
	Nan::SetPrototypeMethod(ctor, "isMap", filenode_general_callback::callback);
//			//! returns true if the node is an integer
//			isInt() : boolean;
	overload->addOverload("filenode", "FileNode", "isInt", {}, isInt);
	Nan::SetPrototypeMethod(ctor, "isInt", filenode_general_callback::callback);
//			//! returns true if the node is a floating-point number
//			isReal() : boolean;
	overload->addOverload("filenode", "FileNode", "isReal", {}, isReal);
	Nan::SetPrototypeMethod(ctor, "isReal", filenode_general_callback::callback);
//			//! returns true if the node is a text string
//			isString() : boolean;
	overload->addOverload("filenode", "FileNode", "isString", {}, isString);
	Nan::SetPrototypeMethod(ctor, "isString", filenode_general_callback::callback);
//			//! returns true if the node has a name
//			isNamed() : boolean;
	overload->addOverload("filenode", "FileNode", "isNamed", {}, isNamed);
	Nan::SetPrototypeMethod(ctor, "isNamed", filenode_general_callback::callback);
//			//! returns the node name or an empty string if the node is nameless
//			name() : string;
	overload->addOverload("filenode", "FileNode", "name", {}, get_name);
	Nan::SetPrototypeMethod(ctor, "name", filenode_general_callback::callback);
//			//! returns the number of elements in the node, if it is a sequence or mapping, or 1 otherwise.
//			size() : _st.size_t;
	overload->addOverload("filenode", "FileNode", "size", {}, size);
	Nan::SetPrototypeMethod(ctor, "size", filenode_general_callback::callback);
//			//! returns the node content as an integer. If the node stores floating-point number, it is rounded.
//			int() : _st.int;
	overload->addOverload("filenode", "FileNode", "int", {}, get_int);
	Nan::SetPrototypeMethod(ctor, "int", filenode_general_callback::callback);
//			//! returns the node content as float
//			float() : _st.float;
	overload->addOverload("filenode", "FileNode", "float", {}, get_float);
	Nan::SetPrototypeMethod(ctor, "float", filenode_general_callback::callback);
//			//! returns the node content as double
//			double() : _st.double;
	overload->addOverload("filenode", "FileNode", "double", {}, get_double);
	Nan::SetPrototypeMethod(ctor, "double", filenode_general_callback::callback);
//			//! returns the node content as text string
//			String() : string;
	overload->addOverload("filenode", "FileNode", "String", {}, get_string);
	Nan::SetPrototypeMethod(ctor, "String", filenode_general_callback::callback);
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
	overload->addOverload("filenode", "FileNode", "readInt", {make_param<int>("default_value","int",0)}, readInt);
	Nan::SetPrototypeMethod(ctor, "readInt", filenode_general_callback::callback);
//			readFloat(default_value ? : _st.float) : _st.float;
	overload->addOverload("filenode", "FileNode", "readFloat", { make_param<float>("default_value","float",0) }, readFloat);
	Nan::SetPrototypeMethod(ctor, "readFloat", filenode_general_callback::callback);
//			readDouble(default_value ? : _st.double) : _st.double;
	overload->addOverload("filenode", "FileNode", "readDouble", { make_param<double>("default_value","double",0) }, readDouble);
	Nan::SetPrototypeMethod(ctor, "readDouble", filenode_general_callback::callback);
//			readString(default_value ? : string) : string;
	overload->addOverload("filenode", "FileNode", "readString", { make_param<std::string>("default_value","String","") }, readString);
	Nan::SetPrototypeMethod(ctor, "readString", filenode_general_callback::callback);
//			readMat(default_mat ? : _mat.Mat) : _mat.Mat;
	overload->addOverload("filenode", "FileNode", "readMat", { make_param<Matrix*>("default_value",Matrix::name,Matrix::create()) }, readMat);
	Nan::SetPrototypeMethod(ctor, "readMat", filenode_general_callback::callback);
//			readSparseMat(default_mat ? : _mat.SparseMat) : _mat.SparseMat;
	overload->addOverload("filenode", "FileNode", "readSparseMat", { make_param<SparseMat*>("default_value",SparseMat::name, SparseMat::create()) }, readSparseMat);
	Nan::SetPrototypeMethod(ctor, "readSparseMat", filenode_general_callback::callback);
//			readKeyPoint(keypoints: Array<_types.KeyPoint>);
	overload->addOverload("filenode", "FileNode", "readKeyPoint", { make_param<KeyPoint*>("default_value",KeyPoint::name,KeyPoint::create()) }, readKeyPoint);
	Nan::SetPrototypeMethod(ctor, "readKeyPoint", filenode_general_callback::callback);
//			readDMatch(matches: Array<_types.DMatch>);
	overload->addOverload("filenode", "FileNode", "readDMatch", { make_param<DMatch*>("default_value",DMatch::name,DMatch::create()) }, readDMatch);
	Nan::SetPrototypeMethod(ctor, "readDMatch", filenode_general_callback::callback);
//			readPoint2d(points: Array<_types.Point2d>);
	overload->addOverload("filenode", "FileNode", "readPoint2d", { make_param<Point2d*>("default_value",Point2d::name, Point2d::create()) }, readPoint2d);
	Nan::SetPrototypeMethod(ctor, "readPoint2d", filenode_general_callback::callback);
//			readPoint3d(points: Array<_types.Point3d>);
	overload->addOverload("filenode", "FileNode", "readPoint3d", { make_param<Point3d*>("default_value",Point3d::name,Point3d::create()) }, readPoint3d);
	Nan::SetPrototypeMethod(ctor, "readPoint3d", filenode_general_callback::callback);
//			readArray<T>(Ttype: string) : Array<T>;
	overload->addOverload("filenode", "FileNode", "readArray", { make_param<std::string>("Ttype", "String") }, readArray);
//		};











	target->Set(Nan::New("FileNode").ToLocalChecked(), ctor->GetFunction());

	
};

v8::Local<v8::Function> FileNode::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}



POLY_METHOD(FileNode::New){
	auto fileNode=new FileNode();

	fileNode->_fileNode = std::make_shared<cv::FileNode>();

	fileNode->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}
POLY_METHOD(FileNode::New_node){
	auto fileNode = new FileNode();

	fileNode->_fileNode = std::make_shared<cv::FileNode>(*info.at<FileNode*>(0)->_fileNode);

	fileNode->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());

}
			
NAN_GETTER(FileNode::nodes_getter){
	auto this_ = overres::ObjectWrap::Unwrap<FileNode>(info.This());

	auto arr = Nan::New<v8::Object>();
	
	for (auto n = this_->_fileNode->begin(); n != this_->_fileNode->end(); n++) {
		if ((*n).isNamed()) {
			std::string node_name = (*n).name();

			auto fn = new FileNode();
			fn->_fileNode = std::make_shared<cv::FileNode>(*n);
			arr->Set(Nan::New(node_name).ToLocalChecked(), fn->Wrap());
		}
	}

	info.GetReturnValue().Set(arr);
}
NAN_GETTER(FileNode::data_getter){
	auto this_ = overres::ObjectWrap::Unwrap<FileNode>(info.This());

	auto arr = Nan::New<v8::Array>();
	int i = 0;
	for (auto n = this_->_fileNode->begin(); n != this_->_fileNode->end(); n++) {
		auto fn = new FileNode();
		fn->_fileNode = std::make_shared<cv::FileNode>(*n);
		arr->Set(i, fn->Wrap());
	}

	info.GetReturnValue().Set(arr);
}
			
POLY_METHOD(FileNode::type){
	auto this_ = info.This<FileNode*>();
	auto ret = this_->_fileNode->type();
	info.SetReturnValue(ret);
}
POLY_METHOD(FileNode::empty){
	auto this_ = info.This<FileNode*>();
	auto ret = this_->_fileNode->empty();
	info.SetReturnValue(ret);
}
POLY_METHOD(FileNode::isNone){
	auto this_ = info.This<FileNode*>();
	auto ret = this_->_fileNode->isNone();
	info.SetReturnValue(ret);
}
POLY_METHOD(FileNode::isSeq){
	auto this_ = info.This<FileNode*>();
	auto ret = this_->_fileNode->isSeq();
	info.SetReturnValue(ret);
}
POLY_METHOD(FileNode::isMap){
	auto this_ = info.This<FileNode*>();
	auto ret = this_->_fileNode->isMap();
	info.SetReturnValue(ret);
}
POLY_METHOD(FileNode::isInt){
	auto this_ = info.This<FileNode*>();
	auto ret = this_->_fileNode->isInt();
	info.SetReturnValue(ret);
}
POLY_METHOD(FileNode::isReal){
	auto this_ = info.This<FileNode*>();
	auto ret = this_->_fileNode->isReal();
	info.SetReturnValue(ret);
}
POLY_METHOD(FileNode::isString){
	auto this_ = info.This<FileNode*>();
	auto ret = this_->_fileNode->isString();
	info.SetReturnValue(ret);
}
POLY_METHOD(FileNode::isNamed){
	auto this_ = info.This<FileNode*>();
	auto ret = this_->_fileNode->isNamed();
	info.SetReturnValue(ret);
}
POLY_METHOD(FileNode::get_name){
	auto this_ = info.This<FileNode*>();
	std::string ret = this_->_fileNode->name();
	info.SetReturnValue(ret);
}
POLY_METHOD(FileNode::size){
	auto this_ = info.This<FileNode*>();
	auto ret = this_->_fileNode->size();
	info.SetReturnValue(ret);
}
POLY_METHOD(FileNode::get_int){
	auto this_ = info.This<FileNode*>();
	int i;
	*this_->_fileNode >> i;
	info.SetReturnValue(i);
}
POLY_METHOD(FileNode::get_float){
	auto this_ = info.This<FileNode*>();
	float f;
	*this_->_fileNode >> f;
	info.SetReturnValue(f);
}
POLY_METHOD(FileNode::get_double){
	auto this_ = info.This<FileNode*>();
	double d;
	*this_->_fileNode >> d;
	info.SetReturnValue(d);
}
POLY_METHOD(FileNode::get_string){
	auto this_ = info.This<FileNode*>();
	std::string s;
	*this_->_fileNode >> s;
	info.SetReturnValue(s);
}
POLY_METHOD(FileNode::readInt){
	auto this_ = info.This<FileNode*>();
	int i;
	cv::read(*this_->_fileNode, i, info.at<int>(0));
	info.SetReturnValue(i);
}
POLY_METHOD(FileNode::readFloat){
	auto this_ = info.This<FileNode*>();
	float i;
	cv::read(*this_->_fileNode, i, info.at<float>(0));
	info.SetReturnValue(i);
}
POLY_METHOD(FileNode::readDouble){
	auto this_ = info.This<FileNode*>();
	double i;
	cv::read(*this_->_fileNode, i, info.at<double>(0));
	info.SetReturnValue(i);
}
POLY_METHOD(FileNode::readString){
	auto this_ = info.This<FileNode*>();
	cv::String i;
	cv::read(*this_->_fileNode, i, info.at<std::string>(0));
	info.SetReturnValue(std::string(i));
}
POLY_METHOD(FileNode::readMat){
	auto this_ = info.This<FileNode*>();
	cv::Mat i;
	cv::read(*this_->_fileNode, i, *info.at<Matrix*>(0)->_mat);
	
	auto ret = new Matrix();
	ret->_mat = std::make_shared<cv::Mat>(i);
	
	info.SetReturnValue(ret);
}
POLY_METHOD(FileNode::readSparseMat){
	auto this_ = info.This<FileNode*>();
	cv::SparseMat i;
	cv::read(*this_->_fileNode, i, *info.at<SparseMat*>(0)->_sparseMat);

	auto ret = new SparseMat();
	ret->_sparseMat = std::make_shared<cv::SparseMat>(i);
	info.SetReturnValue(ret);
}
POLY_METHOD(FileNode::readKeyPoint){throw std::runtime_error("not implemented");}
POLY_METHOD(FileNode::readDMatch){throw std::runtime_error("not implemented");}
POLY_METHOD(FileNode::readPoint2d){throw std::runtime_error("not implemented");}
POLY_METHOD(FileNode::readPoint3d){throw std::runtime_error("not implemented");}
POLY_METHOD(FileNode::readArray){throw std::runtime_error("not implemented");}

