#include "AKAZE.h"

namespace akaze_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("akaze_general_callback is empty");
		}
		return overload->execute("akaze", info);
	}
}

Nan::Persistent<FunctionTemplate> AKAZE::constructor;

void
AKAZE::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	akaze_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(akaze_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("AKAZE").ToLocalChecked());
	ctor->Inherit(Nan::New(Feature2D::constructor));

	overload->register_type<AKAZE>(ctor, "akaze", "AKAZE");


	auto DescriptorType = CreateNamedObject(target, "DescriptorType");
	SetObjectProperty(DescriptorType, "DESCRIPTOR_KAZE_UPRIGHT",cv::AKAZE::DESCRIPTOR_KAZE_UPRIGHT);
	SetObjectProperty(DescriptorType, "DESCRIPTOR_KAZE",		cv::AKAZE::DESCRIPTOR_KAZE		 );
	SetObjectProperty(DescriptorType, "DESCRIPTOR_MLDB_UPRIGHT",cv::AKAZE::DESCRIPTOR_MLDB_UPRIGHT);
	SetObjectProperty(DescriptorType, "DESCRIPTOR_MLDB",		cv::AKAZE::DESCRIPTOR_MLDB		 );
	overload->add_type_alias("DescriptorType", "int");

//	/** @brief Class implementing the AKAZE keypoint detector and descriptor extractor, described in @cite ANB13 . :
//	
//	@note AKAZE descriptors can only be used with KAZE or AKAZE keypoints. Try to avoid using *extract*
//	and *detect* instead of *operator()* due to performance reasons. .. [ANB13] Fast Explicit Diffusion
//	for Accelerated Features in Nonlinear Scale Spaces. Pablo F. Alcantarilla, Jesús Nuevo and Adrien
//	Bartoli. In British Machine Vision Conference (BMVC), Bristol, UK, September 2013.
//	*/
//	class CV_EXPORTS_W AKAZE : public Feature2D
//	{
//	public:
//		// AKAZE descriptor type
//		enum DescriptorType
//		{
//			DESCRIPTOR_KAZE_UPRIGHT = 2, ///< Upright descriptors, not invariant to rotation
//			DESCRIPTOR_KAZE = 3,
//			DESCRIPTOR_MLDB_UPRIGHT = 4, ///< Upright descriptors, not invariant to rotation
//			DESCRIPTOR_MLDB = 5
//		};
//	
//		/** @brief The AKAZE constructor
//	
//		@param descriptor_type Type of the extracted descriptor: DESCRIPTOR_KAZE,
//		DESCRIPTOR_KAZE_UPRIGHT, DESCRIPTOR_MLDB or DESCRIPTOR_MLDB_UPRIGHT.
//		@param descriptor_size Size of the descriptor in bits. 0 -\> Full size
//		@param descriptor_channels Number of channels in the descriptor (1, 2, 3)
//		@param threshold Detector response threshold to accept point
//		@param nOctaves Maximum octave evolution of the image
//		@param nOctaveLayers Default number of sublevels per scale level
//		@param diffusivity Diffusivity type. DIFF_PM_G1, DIFF_PM_G2, DIFF_WEICKERT or
//		DIFF_CHARBONNIER
//		*/
//		CV_WRAP static Ptr<AKAZE> create(int descriptor_type = AKAZE::DESCRIPTOR_MLDB,
//			int descriptor_size = 0, int descriptor_channels = 3,
//			float threshold = 0.001f, int nOctaves = 4,
//			int nOctaveLayers = 4, int diffusivity = KAZE::DIFF_PM_G2);
	overload->addStaticOverload("akaze", "AKAZE", "create", {
		make_param<int>("descriptor_type","DescriptorType",cv::AKAZE::DESCRIPTOR_MLDB),
		make_param<int>("descriptor_size","int", 0),
		make_param<int>("descriptor_channels","int", 3),
		make_param<float>("threshold","float", 0.001f),
		make_param<int>("nOctaves","int", 4),
		make_param<int>("nOctaveLayers","int", 4),
		make_param<int>("diffusivity","int",cv:: KAZE::DIFF_PM_G2)
	}, create);
//	

//		CV_WRAP virtual void setDescriptorType(int dtype) = 0;
	overload->addOverload("akaze", "AKAZE", "setDescriptorType", {make_param<int>("dtype","int")}, setDescriptorType);
//		CV_WRAP virtual int getDescriptorType() const = 0;
	overload->addOverload("akaze", "AKAZE", "getDescriptorType", {}, getDescriptorType);
//	
//		CV_WRAP virtual void setDescriptorSize(int dsize) = 0;
	overload->addOverload("akaze", "AKAZE", "setDescriptorSize", {make_param<int>("dsize","int")}, setDescriptorSize);
//		CV_WRAP virtual int getDescriptorSize() const = 0;
	overload->addOverload("akaze", "AKAZE", "getDescriptorSize", {}, getDescriptorSize);
//	
//		CV_WRAP virtual void setDescriptorChannels(int dch) = 0;
	overload->addOverload("akaze", "AKAZE", "setDescriptorChannels", {make_param<int>("dch","int")}, setDescriptorChannels);
//		CV_WRAP virtual int getDescriptorChannels() const = 0;
	overload->addOverload("akaze", "AKAZE", "getDescriptorChannels", {}, getDescriptorChannels);
//	
//		CV_WRAP virtual void setThreshold(double threshold) = 0;
	overload->addOverload("akaze", "AKAZE", "setThreshold", {make_param<double>("threshold","double")}, setThreshold);
//		CV_WRAP virtual double getThreshold() const = 0;
	overload->addOverload("akaze", "AKAZE", "getThreshold", {}, getThreshold);
//	
//		CV_WRAP virtual void setNOctaves(int octaves) = 0;
	overload->addOverload("akaze", "AKAZE", "setNOctaves", {make_param<int>("octaves","int")}, setNOctaves);
//		CV_WRAP virtual int getNOctaves() const = 0;
	overload->addOverload("akaze", "AKAZE", "getNOctaves", {}, getNOctaves);
//	
//		CV_WRAP virtual void setNOctaveLayers(int octaveLayers) = 0;
	overload->addOverload("akaze", "AKAZE", "setNOctaveLayers", {make_param<int>("octaveLayers","int")}, setNOctaveLayers);
//		CV_WRAP virtual int getNOctaveLayers() const = 0;
	overload->addOverload("akaze", "AKAZE", "getNOctaveLayers", {}, getNOctaveLayers);
//	
//		CV_WRAP virtual void setDiffusivity(int diff) = 0;
	overload->addOverload("akaze", "AKAZE", "setDiffusivity", {make_param<int>("diff","int")}, setDiffusivity);
//		CV_WRAP virtual int getDiffusivity() const = 0;
	overload->addOverload("akaze", "AKAZE", "getDiffusivity", {}, getDiffusivity);
//	};


	target->Set(Nan::New("AKAZE").ToLocalChecked(), ctor->GetFunction());


}


v8::Local<v8::Function> AKAZE::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


POLY_METHOD(AKAZE::create){throw std::exception("not implemented");}
POLY_METHOD(AKAZE::setDescriptorType){throw std::exception("not implemented");}
POLY_METHOD(AKAZE::getDescriptorType){throw std::exception("not implemented");}
POLY_METHOD(AKAZE::setDescriptorSize){throw std::exception("not implemented");}
POLY_METHOD(AKAZE::getDescriptorSize){throw std::exception("not implemented");}
POLY_METHOD(AKAZE::setDescriptorChannels){throw std::exception("not implemented");}
POLY_METHOD(AKAZE::getDescriptorChannels){throw std::exception("not implemented");}
POLY_METHOD(AKAZE::setThreshold){throw std::exception("not implemented");}
POLY_METHOD(AKAZE::getThreshold){throw std::exception("not implemented");}
POLY_METHOD(AKAZE::setNOctaves){throw std::exception("not implemented");}
POLY_METHOD(AKAZE::getNOctaves){throw std::exception("not implemented");}
POLY_METHOD(AKAZE::setNOctaveLayers){throw std::exception("not implemented");}
POLY_METHOD(AKAZE::getNOctaveLayers){throw std::exception("not implemented");}
POLY_METHOD(AKAZE::setDiffusivity){throw std::exception("not implemented");}
POLY_METHOD(AKAZE::getDiffusivity){throw std::exception("not implemented");}

