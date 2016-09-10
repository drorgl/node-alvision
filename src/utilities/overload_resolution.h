#include <v8.h>
#include <node.h>
#include <node_object_wrap.h>
#include <node_version.h>
#include <node_buffer.h>
#include <string.h>
#include <nan.h>

#include <functional>

//overload resolution module

//on constructor, register each function signature and c++ function that implements it
//supply global callback for all functions

//when called, get the function name callback
//parse the registered functions, find possible matches:
//1. by name
//2. by passed parameters, give higher weight to passed parameters, lower weight to default parameters, even lower weight to convertible parameters
//3. discard non-matching options
//4. sort by highest score
//5. execute


//TODO:
//1. figure out a way to check the exact parameter types passed and their convertible options
//2. figure out a way to identify exposed types, Mat or Vec for example, and their parents/convertibles/interfaces
//3. figure out a way to identify arrays of types and objects

//two ways to get the type
//functiontemplate->HasInstance
//name each class with className
//GetConstructorName()


//how to handle generic types? two options,
//1. register each overload as different type, for example 
//   register Matx<int> and Matx<double> as two different overloads, the problem will be with combined values as Cartesian product.
//2. register as strings where T is replacable in comparison

//null or undefined are considered missing values

//how to handle inheritance, for example, is function expects Algorithm but MinProblemSolver instance was passed.


//to distinguish between integer and double:
//int64_t ival = val->IntegerValue();
//double dval = val->NumberValue();
//
//if (ival != 0 && ival == dval) return ival;
//
//if (dval > std::numeric_limits<uint64_t>::max()
//	|| dval < std::numeric_limits<uint64_t>::min())
//	throw ML::Exception("Cannot fit " + cstr(val) + " into an integer");


//https://image.slidesharecdn.com/howtowritenodejsmodule-120415103400-phpapp01/95/how-to-write-nodejs-module-78-728.jpg?cb=1334486513
//v8 type checking
//IsArray()
//IsBoolean()
//IsDate()
//IsExternal()
//IsFalse()
//IsFunction()
//IsInt32()
//IsNull()
//IsNumber()
//IsObject()
//IsString()
//IsTrue()
//IsUint32()
//IsUndefined()

//v8 type conversion
//bool BooleanValue()
//int32_t Int32Value()
//int64_t IntegerValue()
//double NumberValue()
//Local<Boolean> ToBoolean()
//Utf8Value / AsciiValue Local<String> ToString()
//Local<Int32> ToInt32()
//Local<Integer> ToInteger()
//Local<Number> ToNumber()
//Get/Set/Has/Delete Local<Object> ToObject()
//Local<Uint32> ToUint32()

struct overload_info {
	const char * parameterName;
	const char * type;
	Nan::Persistent<v8::Object> defaultValue;
};

//function should be registerType
//should add to it all the basics, string, number, integer, boolean, array, object(?), buffer (?), function (is it possible to know the function signature?), promises(?)
//in case of array, which type is inside it, what to do if multiple types are in the array?
void register_type(Nan::Persistent<v8::FunctionTemplate> functionTemplate, const char * name) {

}

class overload_resolution {
	//new() : Affine3<T>;
	//new (affine: _matx.Matx<T>) : Affine3<T>;
	//new (data: _mat.Mat, t ? : _matx.Vec<T> /*= Vec3::all(0)*/) : Affine3<T>;
	//new (R: _matx.Matx<T>, t ? : _matx.Vec<T> /* = Vec3::all(0)*/) : Affine3<T>;
	//new (rvec: _matx.Vec<T>, t ? : _matx.Vec<T> /* = Vec3::all(0)*/) : Affine3<T>;
	//new (vals: Array<T>) : Affine3<T>;

	overload_resolution(const char * name) {

	}

	void addOverload(const char * name, std::vector<overload_info> arguments, std::function<void()> callback) {
		
	}

	void executeBestOverload() {
		//log the best one
		//if none found, throw an exception that no overload satisfies the supplied parameters and the best overloaded candidate
	}


};