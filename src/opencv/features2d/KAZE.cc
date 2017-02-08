#include "KAZE.h"


namespace kaze_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("kaze_callback is empty");
		}
		return overload->execute("kaze", info);
	}
}

Nan::Persistent<FunctionTemplate> KAZE::constructor;

void
KAZE::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	kaze_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(kaze_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("KAZE").ToLocalChecked());
	ctor->Inherit(Nan::New(Feature2D::constructor));

	overload->register_type<KAZE>(ctor, "kaze", "KAZE");

	auto Diffusivity = CreateNamedObject(target, "Diffusivity");
	SetObjectProperty(Diffusivity, "DIFF_PM_G1",cv::KAZE::DIFF_PM_G1		 );
	SetObjectProperty(Diffusivity, "DIFF_PM_G2",cv::KAZE::DIFF_PM_G2		 );
	SetObjectProperty(Diffusivity, "DIFF_WEICKERT",cv::KAZE::DIFF_WEICKERT	 );
	SetObjectProperty(Diffusivity, "DIFF_CHARBONNIER",cv::KAZE::DIFF_CHARBONNIER );
	overload->add_type_alias("Diffusivity", "int");


//	//! @} features2d_main
//	
//	//! @addtogroup features2d_main
//	//! @{
//	
//	/** @brief Class implementing the KAZE keypoint detector and descriptor extractor, described in @cite ABD12 .
//	
//	@note AKAZE descriptor can only be used with KAZE or AKAZE keypoints .. [ABD12] KAZE Features. Pablo
//	F. Alcantarilla, Adrien Bartoli and Andrew J. Davison. In European Conference on Computer Vision
//	(ECCV), Fiorenze, Italy, October 2012.
//	*/
//	class CV_EXPORTS_W KAZE : public Feature2D
//	{
//	public:
//		enum Diffusivity
//		{
//			DIFF_PM_G1 = 0,
//			DIFF_PM_G2 = 1,
//			DIFF_WEICKERT = 2,
//			DIFF_CHARBONNIER = 3
//		};
//	
//		/** @brief The KAZE constructor
//	
//		@param extended Set to enable extraction of extended (128-byte) descriptor.
//		@param upright Set to enable use of upright descriptors (non rotation-invariant).
//		@param threshold Detector response threshold to accept point
//		@param nOctaves Maximum octave evolution of the image
//		@param nOctaveLayers Default number of sublevels per scale level
//		@param diffusivity Diffusivity type. DIFF_PM_G1, DIFF_PM_G2, DIFF_WEICKERT or
//		DIFF_CHARBONNIER
//		*/
//		CV_WRAP static Ptr<KAZE> create(bool extended = false, bool upright = false,
//			float threshold = 0.001f,
//			int nOctaves = 4, int nOctaveLayers = 4,
//			int diffusivity = KAZE::DIFF_PM_G2);
	overload->addStaticOverload("kaze", "KAZE", "create", {
		make_param<bool>("extended","bool", false),
		make_param<bool>("upright","bool", false),
		make_param<float>("threshold","float", 0.001f),
		make_param<int>("nOctaves","int", 4),
		make_param<int>("nOctaveLayers","int", 4),
		make_param<int>("diffusivity","int",cv:: KAZE::DIFF_PM_G2)
	}, create);

//	
//		CV_WRAP virtual void setExtended(bool extended) = 0;
	overload->addOverload("kaze", "KAZE", "setExtended", {make_param<bool>("extended","bool")}, setExtended);
//		CV_WRAP virtual bool getExtended() const = 0;
	overload->addOverload("kaze", "KAZE", "getExtended", {}, getExtended);
//	
//		CV_WRAP virtual void setUpright(bool upright) = 0;
	overload->addOverload("kaze", "KAZE", "setUpright", {make_param<bool>("upright","bool")}, setUpright);
//		CV_WRAP virtual bool getUpright() const = 0;
	overload->addOverload("kaze", "KAZE", "getUpright", {}, getUpright);
//	
//		CV_WRAP virtual void setThreshold(double threshold) = 0;
	overload->addOverload("kaze", "KAZE", "setThreshold", {make_param<double>("threshold","double")}, setThreshold);
//		CV_WRAP virtual double getThreshold() const = 0;
	overload->addOverload("kaze", "KAZE", "getThreshold", {}, getThreshold);
//	
//		CV_WRAP virtual void setNOctaves(int octaves) = 0;
	overload->addOverload("kaze", "KAZE", "setNOctaves", {make_param<int>("octaves","int")}, setNOctaves);
//		CV_WRAP virtual int getNOctaves() const = 0;
	overload->addOverload("kaze", "KAZE", "getNOctaves", {}, getNOctaves);
//	
//		CV_WRAP virtual void setNOctaveLayers(int octaveLayers) = 0;
	overload->addOverload("kaze", "KAZE", "setNOctaveLayers", {make_param<int>("octaveLayers","int")}, setNOctaveLayers);
//		CV_WRAP virtual int getNOctaveLayers() const = 0;
	overload->addOverload("kaze", "KAZE", "getNOctaveLayers", {}, getNOctaveLayers);
//	
//		CV_WRAP virtual void setDiffusivity(int diff) = 0;
	overload->addOverload("kaze", "KAZE", "setDiffusivity", {make_param<int>("diff","int")}, setDiffusivity);
//		CV_WRAP virtual int getDiffusivity() const = 0;
	overload->addOverload("kaze", "KAZE", "getDiffusivity", {}, getDiffusivity);
//	};
//	



target->Set(Nan::New("KAZE").ToLocalChecked(), ctor->GetFunction());


}


v8::Local<v8::Function> KAZE::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


POLY_METHOD(KAZE::create){throw std::exception("not implemented");}
POLY_METHOD(KAZE::setExtended){throw std::exception("not implemented");}
POLY_METHOD(KAZE::getExtended){throw std::exception("not implemented");}
POLY_METHOD(KAZE::setUpright){throw std::exception("not implemented");}
POLY_METHOD(KAZE::getUpright){throw std::exception("not implemented");}
POLY_METHOD(KAZE::setThreshold){throw std::exception("not implemented");}
POLY_METHOD(KAZE::getThreshold){throw std::exception("not implemented");}
POLY_METHOD(KAZE::setNOctaves){throw std::exception("not implemented");}
POLY_METHOD(KAZE::getNOctaves){throw std::exception("not implemented");}
POLY_METHOD(KAZE::setNOctaveLayers){throw std::exception("not implemented");}
POLY_METHOD(KAZE::getNOctaveLayers){throw std::exception("not implemented");}
POLY_METHOD(KAZE::setDiffusivity){throw std::exception("not implemented");}
POLY_METHOD(KAZE::getDiffusivity){throw std::exception("not implemented");}

