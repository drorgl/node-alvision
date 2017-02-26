#include "DescriptorCollection.h"
#include "../Matrix.h"

namespace descriptorcollection_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("descriptorcollection_general_callback is empty");
		}
		return overload->execute("descriptorcollection", info);
	}
}

Nan::Persistent<FunctionTemplate> DescriptorCollection::constructor;

void
DescriptorCollection::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	descriptorcollection_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(descriptorcollection_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("DescriptorCollection").ToLocalChecked());

	overload->register_type<DescriptorCollection>(ctor, "descriptorcollection", "DescriptorCollection");






//	/**
//	* Class to work with descriptors from several images as with one merged matrix.
//	* It is used e.g. in FlannBasedMatcher.
//	*/
//	class CV_EXPORTS DescriptorCollection
//	{
//	public:
//		DescriptorCollection();
	overload->addOverloadConstructor("descriptorcollection", "DescriptorCollection", {make_param<DescriptorCollection*>("collection","DescriptorCollection") }, New_collection);
//		DescriptorCollection(const DescriptorCollection& collection);
	overload->addOverloadConstructor("descriptorcollection", "DescriptorCollection", {}, New);
//		virtual ~DescriptorCollection();
//	
//		// Vector of matrices "descriptors" will be merged to one matrix "mergedDescriptors" here.
//		void set(const std::vector<Mat>& descriptors);
	overload->addOverload("descriptorcollection", "DescriptorCollection", "set", {make_param<std::shared_ptr<std::vector<Matrix*>>>("descriptors","Array<Matrix>")}, set);
//		virtual void clear();
	overload->addOverload("descriptorcollection", "DescriptorCollection", "clear", {}, clear);
//	

//		const Mat& getDescriptors() const;
	overload->addOverload("descriptorcollection", "DescriptorCollection", "getDescriptors", {}, getDescriptors);
//		const Mat getDescriptor(int imgIdx, int localDescIdx) const;
	overload->addOverload("descriptorcollection", "DescriptorCollection", "getDescriptor", {
		make_param<int>("imgIdx","int"),
		make_param<int>("localDescIdx","int"),
	}, getDescriptor_local);
//		const Mat getDescriptor(int globalDescIdx) const;
	overload->addOverload("descriptorcollection", "DescriptorCollection", "getDescriptor", {
		make_param<int>("globalDescIdx","int")
	}, getDescriptor);
//		void getLocalIdx(int globalDescIdx, int& imgIdx, int& localDescIdx) const;
	overload->addOverload("descriptorcollection", "DescriptorCollection", "getLocalIdx", {
		make_param<int>("globalDescIdx","int"),
		make_param<std::shared_ptr<overres::Callback>>("cb","Function") //int& imgIdx, 	int& localDescIdx
	}, getLocalIdx);
//	
//		int size() const;
	overload->addOverload("descriptorcollection", "DescriptorCollection", "size", {}, size);
//	
//	protected:
//		Mat mergedDescriptors;
//		std::vector<int> startIdxs;
//	};




	target->Set(Nan::New("DescriptorCollection").ToLocalChecked(), ctor->GetFunction());


}


v8::Local<v8::Function> DescriptorCollection::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


POLY_METHOD(DescriptorCollection::New_collection){throw std::runtime_error("not implemented");}
POLY_METHOD(DescriptorCollection::New){throw std::runtime_error("not implemented");}
POLY_METHOD(DescriptorCollection::set){throw std::runtime_error("not implemented");}
POLY_METHOD(DescriptorCollection::clear){throw std::runtime_error("not implemented");}
POLY_METHOD(DescriptorCollection::getDescriptors){throw std::runtime_error("not implemented");}
POLY_METHOD(DescriptorCollection::getDescriptor_local){throw std::runtime_error("not implemented");}
POLY_METHOD(DescriptorCollection::getDescriptor){throw std::runtime_error("not implemented");}
POLY_METHOD(DescriptorCollection::getLocalIdx){throw std::runtime_error("not implemented");}
POLY_METHOD(DescriptorCollection::size){throw std::runtime_error("not implemented");}

