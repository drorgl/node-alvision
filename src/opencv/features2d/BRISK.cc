#include "BRISK.h"

namespace brisk_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("brisk_general_callback is empty");
		}
		return overload->execute("brisk", info);
	}
}

Nan::Persistent<FunctionTemplate> BRISK::constructor;

void
BRISK::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	brisk_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(brisk_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("BRISK").ToLocalChecked());
	ctor->Inherit(Nan::New(Feature2D::constructor));

	overload->register_type<BRISK>(ctor, "brisk", "BRISK");





//	//! @addtogroup features2d_main
//	//! @{
//	
//	/** @brief Class implementing the BRISK keypoint detector and descriptor extractor, described in @cite LCS11 .
//	*/
//	class CV_EXPORTS_W BRISK : public Feature2D
//	{
//	public:
//		/** @brief The BRISK constructor
//	
//		@param thresh AGAST detection threshold score.
//		@param octaves detection octaves. Use 0 to do single scale.
//		@param patternScale apply this scale to the pattern used for sampling the neighbourhood of a
//		keypoint.
//		*/
//		CV_WRAP static Ptr<BRISK> create(int thresh = 30, int octaves = 3, float patternScale = 1.0f);
	overload->addStaticOverload("brisk", "BRISK", "create", {
		make_param<int>("thresh","int", 30),
		make_param<int>("octaves","int", 3),
		make_param<float>("patternScale","float", 1.0f)
	}, create_a);
//	
//		/** @brief The BRISK constructor for a custom pattern
//	
//		@param radiusList defines the radii (in pixels) where the samples around a keypoint are taken (for
//		keypoint scale 1).
//		@param numberList defines the number of sampling points on the sampling circle. Must be the same
//		size as radiusList..
//		@param dMax threshold for the short pairings used for descriptor formation (in pixels for keypoint
//		scale 1).
//		@param dMin threshold for the long pairings used for orientation determination (in pixels for
//		keypoint scale 1).
//		@param indexChange index remapping of the bits. */
//		CV_WRAP static Ptr<BRISK> create(const std::vector<float> &radiusList, const std::vector<int> &numberList,
//			float dMax = 5.85f, float dMin = 8.2f, const std::vector<int>& indexChange = std::vector<int>());
	overload->addStaticOverload("brisk", "BRISK", "", {
		make_param<std::shared_ptr<std::vector<float>>>("radiusList","Array<float>"),
		make_param<std::shared_ptr<std::vector<int>>>("numberList","Array<int>"),
		make_param<float>("dMax","float", 5.85f), 
		make_param<float>("dMin","float", 8.2f), 
		make_param<std::shared_ptr<std::vector<int>>>("indexChange","Array<int>",nullptr)
	}, create_b);
//	};






target->Set(Nan::New("BRISK").ToLocalChecked(), ctor->GetFunction());


}


v8::Local<v8::Function> BRISK::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


POLY_METHOD(BRISK::create_a){throw std::exception("not implemented");}
POLY_METHOD(BRISK::create_b){throw std::exception("not implemented");}