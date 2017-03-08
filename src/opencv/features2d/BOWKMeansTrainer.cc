#include "BOWKMeansTrainer.h"
#include "../types/TermCriteria.h"
#include "../Matrix.h"


namespace bowmeanstrainer_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("bowmeanstrainer_general_callback is empty");
		}
		return overload->execute("bowmeanstrainer", info);
	}
}

Nan::Persistent<FunctionTemplate> BOWKMeansTrainer::constructor;

void
BOWKMeansTrainer::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	bowmeanstrainer_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(bowmeanstrainer_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("BOWKMeansTrainer").ToLocalChecked());
	ctor->Inherit(Nan::New(BOWTrainer::constructor));

	overload->register_type<BOWKMeansTrainer>(ctor, "bowmeanstrainer", "BOWKMeansTrainer");




//	
//	/** @brief kmeans -based class to train visual vocabulary using the *bag of visual words* approach. :
//	*/
//	class CV_EXPORTS_W BOWKMeansTrainer : public BOWTrainer
//	{
//	public:
//		/** @brief The constructor.
//	
//		@see cv::kmeans
//		*/
//		CV_WRAP BOWKMeansTrainer(int clusterCount, const TermCriteria& termcrit = TermCriteria(),
//			int attempts = 3, int flags = KMEANS_PP_CENTERS);
	overload->addOverloadConstructor("bowmeanstrainer", "BOWKMeansTrainer", {
		make_param<int>("clusterCount","int"),
		make_param<TermCriteria*>("termcrit","TermCriteria", TermCriteria::create()),
		make_param<int>("attempts","int", 3),
		make_param<int>("flags","int",cv:: KMEANS_PP_CENTERS)
	}, New);
//		virtual ~BOWKMeansTrainer();
//	
//		// Returns trained vocabulary (i.e. cluster centers).
//		CV_WRAP virtual Mat cluster() const;
	overload->addOverload("bowmeanstrainer", "BOWKMeansTrainer", "cluster", {}, cluster);
//		CV_WRAP virtual Mat cluster(const Mat& descriptors) const;
	overload->addOverload("bowmeanstrainer", "BOWKMeansTrainer", "cluster", {make_param<Matrix*>("descriptors",Matrix::name)}, cluster_descriptors);
//	
//	protected:
//	
//		int clusterCount;
//		TermCriteria termcrit;
//		int attempts;
//		int flags;
//	};




	target->Set(Nan::New("BOWKMeansTrainer").ToLocalChecked(), ctor->GetFunction());


}


v8::Local<v8::Function> BOWKMeansTrainer::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


POLY_METHOD(BOWKMeansTrainer::New){throw std::runtime_error("not implemented");}
POLY_METHOD(BOWKMeansTrainer::cluster){throw std::runtime_error("not implemented");}
POLY_METHOD(BOWKMeansTrainer::cluster_descriptors){throw std::runtime_error("not implemented");}

