#include "Algorithm.h"
#include "../persistence/FileNode.h"
#include "../persistence/FileStorage.h"

namespace algorithm_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("algorithm_general_callback is empty");
		}
		return overload->execute("algorithm", info);
	}
}

Nan::Persistent<FunctionTemplate> Algorithm::constructor;


void
Algorithm::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {


	//Class
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(algorithm_general_callback::callback);
	constructor.Reset(ctor);
	ctor->InstanceTemplate()->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("Algorithm").ToLocalChecked());

	overload->register_type<Algorithm>(ctor, "algorithm", "Algorithm");


	overload->addStaticOverload("algorithm", "Algorithm", "read", {
			make_param<std::string>("Ttype","String"),
			make_param<FileNode*>("fn","FileNode")
	}, read);
	//read<T>(Ttype: string, fn : _persistence.FileNode) : T;

	//template < typename _Tp> static Ptr< _Tp > read(const FileNode& fn)
	//    {
	//        Ptr<_Tp>obj = _Tp::create();
	//obj ->read(fn);
	//return !obj ->empty() ? obj : Ptr<_Tp>();
	//    }


	overload->addStaticOverload("algorithm", "Algorithm", "load", {
		   make_param<std::string>("Ttype","String"),
		   make_param<std::string>("filename","String"),
		   make_param<std::string>("objname","String")
	}, load);
	//load<T>(Ttype : string, filename : string, objname ? : string) : T;
	//template < typename _Tp> static Ptr< _Tp > load(const String& filename, const String& objname=String())
	//    {
	//        FileStorage fs(filename, FileStorage::READ);
	//FileNode fn = objname.empty() ? fs.getFirstTopLevelNode() : fs[objname];
	//Ptr < _Tp > obj = _Tp::create();
	//obj ->read(fn);
	//return !obj ->empty() ? obj : Ptr<_Tp>();
	//    }



	overload->addStaticOverload("algorithm", "Algorithm", "loadFromString", {
		make_param<std::string>("Ttype","String"),
		make_param<std::string>("strModel","String"),
		make_param<std::string>("objname","String")
	}, loadFromString);
	//loadFromString<T>(Ttype : string, strModel : string, objname ? : string) : T;
	//template < typename _Tp> static Ptr< _Tp > loadFromString(const String& strModel, const String& objname=String())
	//    {
	//        FileStorage fs(strModel, FileStorage::READ + FileStorage::MEMORY);
	//FileNode fn = objname.empty() ? fs.getFirstTopLevelNode() : fs[objname];
	//Ptr < _Tp > obj = _Tp::create();
	//obj ->read(fn);
	//return !obj ->empty() ? obj : Ptr<_Tp>();
	//    }
//}


	//clear() : void;
	overload->addOverload("algorithm", "Algorithm", "clear", {}, clear);


	overload->addOverload("algorithm", "Algorithm", "write", {
		make_param<FileStorage*>("fs","FileStorage")
	}, write);
	//write(fs: _persistence.FileStorage) : void;



	overload->addOverload("algorithm", "Algorithm", "read", {
		make_param<FileNode*>("fn","FileNode")
	}, read_member);
	//read(fn: _persistence.FileNode) : void;


	overload->addOverload("algorithm", "Algorithm", "empty", {}, empty);
	//empty() : boolean;




	overload->addOverload("algorithm", "Algorithm", "save", {
		make_param<std::string>("filename","String")
	}, save);
	//save(filename : string) : void;


	overload->addOverload("algorithm", "Algorithm", "getDefaultName", {}, getDefaultName);
	//getDefaultName() : string;

//struct Param {
//    enum { INT = 0, BOOLEAN = 1, REAL = 2, STRING = 3, MAT = 4, MAT_VECTOR = 5, ALGORITHM = 6, FLOAT = 7,
//        UNSIGNED_INT = 8, UINT64 = 9, UCHAR = 11
//    };
//};




	target->Set(Nan::New("Algorithm").ToLocalChecked(), ctor->GetFunction());


};

v8::Local<v8::Function> Algorithm::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}

POLY_METHOD(Algorithm::New) {
	auto algorithm = new Algorithm();

	algorithm->Wrap(info.Holder());
	info.GetReturnValue().Set(info.Holder());
}

POLY_METHOD(Algorithm::read){
	throw std::exception("not implemented");
}
POLY_METHOD(Algorithm::load){
	throw std::exception("not implemented");
}
POLY_METHOD(Algorithm::loadFromString){
	throw std::exception("not implemented");
}
POLY_METHOD(Algorithm::clear){
	throw std::exception("not implemented");
}
POLY_METHOD(Algorithm::write){
	throw std::exception("not implemented");
}
POLY_METHOD(Algorithm::read_member){
	throw std::exception("not implemented");
}
POLY_METHOD(Algorithm::empty){
	throw std::exception("not implemented");
}
POLY_METHOD(Algorithm::save){
	throw std::exception("not implemented");
}
POLY_METHOD(Algorithm::getDefaultName){
	throw std::exception("not implemented");
}