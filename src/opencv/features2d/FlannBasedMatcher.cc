#include "FlannBasedMatcher.h"
#include "../IOArray.h"
#include "../persistence/FileNode.h"
#include "../persistence/FileStorage.h"


namespace flannbasedmatcher_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("flannbasedmatcher_general_callback is empty");
		}
		return overload->execute("flannbasedmatcher", info);
	}
}

Nan::Persistent<FunctionTemplate> FlannBasedMatcher::constructor;

void
FlannBasedMatcher::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	flannbasedmatcher_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(flannbasedmatcher_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("FlannBasedMatcher").ToLocalChecked());
	ctor->Inherit(Nan::New(DescriptorMatcher::constructor));

	overload->register_type<FlannBasedMatcher>(ctor, "flannbasedmatcher", "FlannBasedMatcher");


//	/** @brief Flann-based descriptor matcher.
//	
//	This matcher trains flann::Index_ on a train descriptor collection and calls its nearest search
//	methods to find the best matches. So, this matcher may be faster when matching a large train
//	collection than the brute force matcher. FlannBasedMatcher does not support masking permissible
//	matches of descriptor sets because flann::Index does not support this. :
//	*/
//	class CV_EXPORTS_W FlannBasedMatcher : public DescriptorMatcher
//	{
//	public:
//		CV_WRAP FlannBasedMatcher(const Ptr<flann::IndexParams>& indexParams = makePtr<flann::KDTreeIndexParams>(),
//			const Ptr<flann::SearchParams>& searchParams = makePtr<flann::SearchParams>());


//	overload->addOverloadConstructor("flannbasedmatcher", "FlannBasedMatcher", {
//		make_param<flann::IndexParams*> ("indexParams","IndexParams",flann:KDTreeIndexParams::New()),
//		make_param<flann::SearchParams*>("searchParams","SearchParams",flann::SearchParams())
//	}, New);


//	
//		virtual void add(InputArrayOfArrays descriptors);
	overload->addOverload("flannbasedmatcher", "FlannBasedMatcher", "add", {make_param<IOArray*>("descriptors","IOArray")}, add);
//		virtual void clear();
	overload->addOverload("flannbasedmatcher", "FlannBasedMatcher", "clear", {}, clear);
//	
//		// Reads matcher object from a file node
//		virtual void read(const FileNode&);
	overload->addOverload("flannbasedmatcher", "FlannBasedMatcher", "read", {make_param<FileNode*>("fn","FileNode")}, read);
//		// Writes matcher object to a file storage
//		virtual void write(FileStorage&) const;
	overload->addOverload("flannbasedmatcher", "FlannBasedMatcher", "write", {make_param<FileStorage*>("fs","FileStorage")}, write);
//	
//		virtual void train();
	overload->addOverload("flannbasedmatcher", "FlannBasedMatcher", "train", {}, train);
//		virtual bool isMaskSupported() const;
	overload->addOverload("flannbasedmatcher", "FlannBasedMatcher", "isMaskSupported", {}, isMaskSupported);
//	
//		virtual Ptr<DescriptorMatcher> clone(bool emptyTrainData = false) const;
	overload->addOverload("flannbasedmatcher", "FlannBasedMatcher", "clone", {make_param<bool>("emptyTrainData","bool")}, clone);
//	protected:
//		static void convertToDMatches(const DescriptorCollection& descriptors,
//			const Mat& indices, const Mat& distances,
//			std::vector<std::vector<DMatch> >& matches);
//	
//		virtual void knnMatchImpl(InputArray queryDescriptors, std::vector<std::vector<DMatch> >& matches, int k,
//			InputArrayOfArrays masks = noArray(), bool compactResult = false);
//		virtual void radiusMatchImpl(InputArray queryDescriptors, std::vector<std::vector<DMatch> >& matches, float maxDistance,
//			InputArrayOfArrays masks = noArray(), bool compactResult = false);
//	
//		Ptr<flann::IndexParams> indexParams;
//		Ptr<flann::SearchParams> searchParams;
//		Ptr<flann::Index> flannIndex;
//	
//		DescriptorCollection mergedDescriptors;
//		int addedDescCount;
//	};
//	



target->Set(Nan::New("FlannBasedMatcher").ToLocalChecked(), ctor->GetFunction());


}


v8::Local<v8::Function> FlannBasedMatcher::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


POLY_METHOD(FlannBasedMatcher::New){throw std::exception("not implemented");}
POLY_METHOD(FlannBasedMatcher::add){throw std::exception("not implemented");}
POLY_METHOD(FlannBasedMatcher::clear){throw std::exception("not implemented");}
POLY_METHOD(FlannBasedMatcher::read){throw std::exception("not implemented");}
POLY_METHOD(FlannBasedMatcher::write){throw std::exception("not implemented");}
POLY_METHOD(FlannBasedMatcher::train){throw std::exception("not implemented");}
POLY_METHOD(FlannBasedMatcher::isMaskSupported){throw std::exception("not implemented");}
POLY_METHOD(FlannBasedMatcher::clone){throw std::exception("not implemented");}

