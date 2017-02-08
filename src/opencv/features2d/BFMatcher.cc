#include "BFMatcher.h"

namespace bfmatcher_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("bfmatcher_general_callback is empty");
		}
		return overload->execute("bfmatcher", info);
	}
}

Nan::Persistent<FunctionTemplate> BFMatcher::constructor;

void
BFMatcher::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	bfmatcher_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(bfmatcher_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("BFMatcher").ToLocalChecked());
	ctor->Inherit(Nan::New(DescriptorMatcher::constructor));

	overload->register_type<BFMatcher>(ctor, "bfmatcher", "BFMatcher");


//	
//	/** @brief Brute-force descriptor matcher.
//	
//	For each descriptor in the first set, this matcher finds the closest descriptor in the second set
//	by trying each one. This descriptor matcher supports masking permissible matches of descriptor
//	sets.
//	*/
//	class CV_EXPORTS_W BFMatcher : public DescriptorMatcher
//	{
//	public:
//		/** @brief Brute-force matcher constructor.
//	
//		@param normType One of NORM_L1, NORM_L2, NORM_HAMMING, NORM_HAMMING2. L1 and L2 norms are
//		preferable choices for SIFT and SURF descriptors, NORM_HAMMING should be used with ORB, BRISK and
//		BRIEF, NORM_HAMMING2 should be used with ORB when WTA_K==3 or 4 (see ORB::ORB constructor
//		description).
//		@param crossCheck If it is false, this is will be default BFMatcher behaviour when it finds the k
//		nearest neighbors for each query descriptor. If crossCheck==true, then the knnMatch() method with
//		k=1 will only return pairs (i,j) such that for i-th query descriptor the j-th descriptor in the
//		matcher's collection is the nearest and vice versa, i.e. the BFMatcher will only return consistent
//		pairs. Such technique usually produces best results with minimal number of outliers when there are
//		enough matches. This is alternative to the ratio test, used by D. Lowe in SIFT paper.
//		*/
//		CV_WRAP BFMatcher(int normType = NORM_L2, bool crossCheck = false);
	overload->addOverloadConstructor("bfmatcher", "BFMatcher", {
		make_param<int>("normType","int",cv::NORM_L2),
		make_param<bool>("crossCheck","bool",false)
	}, New);
//		virtual ~BFMatcher() {}
//	
//		virtual bool isMaskSupported() const { return true; }
	overload->addOverload("bfmatcher", "BFMatcher", "isMaskSupported", {}, isMaskSupported);
//	
//		virtual Ptr<DescriptorMatcher> clone(bool emptyTrainData = false) const;
	overload->addOverload("bfmatcher", "BFMatcher", "clone", {
		make_param<bool>("emptyTrainData","bool",false)
	}, clone);
//	protected:
//		virtual void knnMatchImpl(InputArray queryDescriptors, std::vector<std::vector<DMatch> >& matches, int k,
//			InputArrayOfArrays masks = noArray(), bool compactResult = false);
//		virtual void radiusMatchImpl(InputArray queryDescriptors, std::vector<std::vector<DMatch> >& matches, float maxDistance,
//			InputArrayOfArrays masks = noArray(), bool compactResult = false);
//	
//		int normType;
//		bool crossCheck;
//	};



target->Set(Nan::New("BFMatcher").ToLocalChecked(), ctor->GetFunction());


}


v8::Local<v8::Function> BFMatcher::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


POLY_METHOD(BFMatcher::New){throw std::exception("not implemented");}
POLY_METHOD(BFMatcher::isMaskSupported){throw std::exception("not implemented");}
POLY_METHOD(BFMatcher::clone){throw std::exception("not implemented");}

