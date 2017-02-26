#include "ORB.h"

namespace orb_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("orb_general_callback is empty");
		}
		return overload->execute("orb", info);
	}
}

Nan::Persistent<FunctionTemplate> ORB::constructor;

void
ORB::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	orb_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(orb_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("ORB").ToLocalChecked());
	ctor->Inherit(Nan::New(Feature2D::constructor));

	overload->register_type<ORB>(ctor, "orb", "ORB");

	auto ORBEnum = CreateNamedObject(target, "ORBEnum");
	SetObjectProperty(ORBEnum, "kBytes", cv::ORB::kBytes);
	SetObjectProperty(ORBEnum, "HARRIS_SCORE", cv::ORB::HARRIS_SCORE);
	SetObjectProperty(ORBEnum, "FAST_SCORE", cv::ORB::FAST_SCORE);
	overload->add_type_alias("ORBEnum", "int");


//	/** @brief Class implementing the ORB (*oriented BRIEF*) keypoint detector and descriptor extractor
//	
//	described in @cite RRKB11 . The algorithm uses FAST in pyramids to detect stable keypoints, selects
//	the strongest features using FAST or Harris response, finds their orientation using first-order
//	moments and computes the descriptors using BRIEF (where the coordinates of random point pairs (or
//	k-tuples) are rotated according to the measured orientation).
//	*/
//	class CV_EXPORTS_W ORB : public Feature2D
//	{
//	public:
//		enum { kBytes = 32, HARRIS_SCORE = 0, FAST_SCORE = 1 };
//	
//		/** @brief The ORB constructor
//	
//		@param nfeatures The maximum number of features to retain.
//		@param scaleFactor Pyramid decimation ratio, greater than 1. scaleFactor==2 means the classical
//		pyramid, where each next level has 4x less pixels than the previous, but such a big scale factor
//		will degrade feature matching scores dramatically. On the other hand, too close to 1 scale factor
//		will mean that to cover certain scale range you will need more pyramid levels and so the speed
//		will suffer.
//		@param nlevels The number of pyramid levels. The smallest level will have linear size equal to
//		input_image_linear_size/pow(scaleFactor, nlevels).
//		@param edgeThreshold This is size of the border where the features are not detected. It should
//		roughly match the patchSize parameter.
//		@param firstLevel It should be 0 in the current implementation.
//		@param WTA_K The number of points that produce each element of the oriented BRIEF descriptor. The
//		default value 2 means the BRIEF where we take a random point pair and compare their brightnesses,
//		so we get 0/1 response. Other possible values are 3 and 4. For example, 3 means that we take 3
//		random points (of course, those point coordinates are random, but they are generated from the
//		pre-defined seed, so each element of BRIEF descriptor is computed deterministically from the pixel
//		rectangle), find point of maximum brightness and output index of the winner (0, 1 or 2). Such
//		output will occupy 2 bits, and therefore it will need a special variant of Hamming distance,
//		denoted as NORM_HAMMING2 (2 bits per bin). When WTA_K=4, we take 4 random points to compute each
//		bin (that will also occupy 2 bits with possible values 0, 1, 2 or 3).
//		@param scoreType The default HARRIS_SCORE means that Harris algorithm is used to rank features
//		(the score is written to KeyPoint::score and is used to retain best nfeatures features);
//		FAST_SCORE is alternative value of the parameter that produces slightly less stable keypoints,
//		but it is a little faster to compute.
//		@param patchSize size of the patch used by the oriented BRIEF descriptor. Of course, on smaller
//		pyramid layers the perceived image area covered by a feature will be larger.
//		@param fastThreshold
//		*/
//		CV_WRAP static Ptr<ORB> create(int nfeatures = 500, float scaleFactor = 1.2f, int nlevels = 8, int edgeThreshold = 31,
//			int firstLevel = 0, int WTA_K = 2, int scoreType = ORB::HARRIS_SCORE, int patchSize = 31, int fastThreshold = 20);
	overload->addStaticOverload("orb", "ORB", "create", {
		make_param<int>("nfeatures","int", 500),
		make_param<float>("scaleFactor","float", 1.2f),
		make_param<int>("nlevels","int", 8),
		make_param<int>("edgeThreshold","int",31),
		make_param<int>("firstLevel","int", 0),
		make_param<int>("WTA_K","int", 2),
		make_param<int>("scoreType","ORBEnum",cv::ORB::HARRIS_SCORE),
		make_param<int>("patchSize","int", 31),
		make_param<int>("fastThreshold","int", 20)
	}, create);
//	
//		CV_WRAP virtual void setMaxFeatures(int maxFeatures) = 0;
	overload->addOverload("orb", "ORB", "setMaxFeatures", {make_param<int>("maxFeatures","int")}, setMaxFeatures);
//		CV_WRAP virtual int getMaxFeatures() const = 0;
	overload->addOverload("orb", "ORB", "getMaxFeatures", {}, getMaxFeatures);
//	
//		CV_WRAP virtual void setScaleFactor(double scaleFactor) = 0;
	overload->addOverload("orb", "ORB", "setScaleFactor", {make_param<double>("scaleFactor","double")}, setScaleFactor);
//		CV_WRAP virtual double getScaleFactor() const = 0;
	overload->addOverload("orb", "ORB", "getScaleFactor", {}, getScaleFactor);
//	
//		CV_WRAP virtual void setNLevels(int nlevels) = 0;
	overload->addOverload("orb", "ORB", "setNLevels", {make_param<int>("nlevels","int")}, setNLevels);
//		CV_WRAP virtual int getNLevels() const = 0;
	overload->addOverload("orb", "ORB", "getNLevels", {}, getNLevels);
//	
//		CV_WRAP virtual void setEdgeThreshold(int edgeThreshold) = 0;
	overload->addOverload("orb", "ORB", "setEdgeThreshold", {make_param<int>("edgeThreshold","int")}, setEdgeThreshold);
//		CV_WRAP virtual int getEdgeThreshold() const = 0;
	overload->addOverload("orb", "ORB", "getEdgeThreshold", {}, getEdgeThreshold);
//	
//		CV_WRAP virtual void setFirstLevel(int firstLevel) = 0;
	overload->addOverload("orb", "ORB", "setFirstLevel", {make_param<int>("firstLevel","int")}, setFirstLevel);
//		CV_WRAP virtual int getFirstLevel() const = 0;
	overload->addOverload("orb", "ORB", "getFirstLevel", {}, getFirstLevel);
//	
//		CV_WRAP virtual void setWTA_K(int wta_k) = 0;
	overload->addOverload("orb", "ORB", "setWTA_K", {make_param<int>("wta_k","int")}, setWTA_K);
//		CV_WRAP virtual int getWTA_K() const = 0;
	overload->addOverload("orb", "ORB", "getWTA_K", {}, getWTA_K);
//	
//		CV_WRAP virtual void setScoreType(int scoreType) = 0;
	overload->addOverload("orb", "ORB", "setScoreType", {make_param<int>("scoreType","int")}, setScoreType);
//		CV_WRAP virtual int getScoreType() const = 0;
	overload->addOverload("orb", "ORB", "getScoreType", {}, getScoreType);
//	
//		CV_WRAP virtual void setPatchSize(int patchSize) = 0;
	overload->addOverload("orb", "ORB", "setPatchSize", {make_param<int>("patchSize","int")}, setPatchSize);
//		CV_WRAP virtual int getPatchSize() const = 0;
	overload->addOverload("orb", "ORB", "getPatchSize", {}, getPatchSize);
//	
//		CV_WRAP virtual void setFastThreshold(int fastThreshold) = 0;
	overload->addOverload("orb", "ORB", "setFastThreshold", {make_param<int>("fastThreshold","int")}, setFastThreshold);
//		CV_WRAP virtual int getFastThreshold() const = 0;
	overload->addOverload("orb", "ORB", "getFastThreshold", {}, getFastThreshold);
//	};







target->Set(Nan::New("ORB").ToLocalChecked(), ctor->GetFunction());


}


v8::Local<v8::Function> ORB::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


POLY_METHOD(ORB::create){throw std::runtime_error("not implemented");}
POLY_METHOD(ORB::setMaxFeatures){throw std::runtime_error("not implemented");}
POLY_METHOD(ORB::getMaxFeatures){throw std::runtime_error("not implemented");}
POLY_METHOD(ORB::setScaleFactor){throw std::runtime_error("not implemented");}
POLY_METHOD(ORB::getScaleFactor){throw std::runtime_error("not implemented");}
POLY_METHOD(ORB::setNLevels){throw std::runtime_error("not implemented");}
POLY_METHOD(ORB::getNLevels){throw std::runtime_error("not implemented");}
POLY_METHOD(ORB::setEdgeThreshold){throw std::runtime_error("not implemented");}
POLY_METHOD(ORB::getEdgeThreshold){throw std::runtime_error("not implemented");}
POLY_METHOD(ORB::setFirstLevel){throw std::runtime_error("not implemented");}
POLY_METHOD(ORB::getFirstLevel){throw std::runtime_error("not implemented");}
POLY_METHOD(ORB::setWTA_K){throw std::runtime_error("not implemented");}
POLY_METHOD(ORB::getWTA_K){throw std::runtime_error("not implemented");}
POLY_METHOD(ORB::setScoreType){throw std::runtime_error("not implemented");}
POLY_METHOD(ORB::getScoreType){throw std::runtime_error("not implemented");}
POLY_METHOD(ORB::setPatchSize){throw std::runtime_error("not implemented");}
POLY_METHOD(ORB::getPatchSize){throw std::runtime_error("not implemented");}
POLY_METHOD(ORB::setFastThreshold){throw std::runtime_error("not implemented");}
POLY_METHOD(ORB::getFastThreshold){throw std::runtime_error("not implemented");}

