#include "BOWTrainer.h"
#include "../Matrix.h"

namespace bowtrainer_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("bowtrainer_general_callback is empty");
		}
		return overload->execute("bowtrainer", info);
	}
}

Nan::Persistent<FunctionTemplate> BOWTrainer::constructor;

void
BOWTrainer::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	bowtrainer_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(bowtrainer_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("BOWTrainer").ToLocalChecked());
	

	overload->register_type<BOWTrainer>(ctor, "bowtrainer", "BOWTrainer");







//	/****************************************************************************************\
//	*                                     Bag of visual words                                *
//	\****************************************************************************************/
//	
//	//! @addtogroup features2d_category
//	//! @{
//	
//	/** @brief Abstract base class for training the *bag of visual words* vocabulary from a set of descriptors.
//	
//	For details, see, for example, *Visual Categorization with Bags of Keypoints* by Gabriella Csurka,
//	Christopher R. Dance, Lixin Fan, Jutta Willamowski, Cedric Bray, 2004. :
//	*/
//	class CV_EXPORTS_W BOWTrainer
//	{
//	public:
//		BOWTrainer();
	overload->addOverloadConstructor("bowtrainer", "BOWTrainer", {}, New);
//		virtual ~BOWTrainer();
//	
//		/** @brief Adds descriptors to a training set.
//	
//		@param descriptors Descriptors to add to a training set. Each row of the descriptors matrix is a
//		descriptor.
//	
//		The training set is clustered using clustermethod to construct the vocabulary.
//		*/
//		CV_WRAP void add(const Mat& descriptors);
	overload->addOverload("bowtrainer", "BOWTrainer", "add", {make_param<Matrix*>("descriptors",Matrix::name)}, add);
//	
//		/** @brief Returns a training set of descriptors.
//		*/
//		CV_WRAP const std::vector<Mat>& getDescriptors() const;
	overload->addOverload("bowtrainer", "BOWTrainer", "getDescriptors", {}, getDescriptors);
//	
//		/** @brief Returns the count of all descriptors stored in the training set.
//		*/
//		CV_WRAP int descriptorsCount() const;
	overload->addOverload("bowtrainer", "BOWTrainer", "descriptorsCount", {}, descriptorsCount);
//	
//		CV_WRAP virtual void clear();
	overload->addOverload("bowtrainer", "BOWTrainer", "clear", {}, clear);
//	
//		/** @overload */
//		CV_WRAP virtual Mat cluster() const = 0;
	overload->addOverload("bowtrainer", "BOWTrainer", "cluster", {}, cluster);
//	
//		/** @brief Clusters train descriptors.
//	
//		@param descriptors Descriptors to cluster. Each row of the descriptors matrix is a descriptor.
//		Descriptors are not added to the inner train descriptor set.
//	
//		The vocabulary consists of cluster centers. So, this method returns the vocabulary. In the first
//		variant of the method, train descriptors stored in the object are clustered. In the second variant,
//		input descriptors are clustered.
//		*/
//		CV_WRAP virtual Mat cluster(const Mat& descriptors) const = 0;
	overload->addOverload("bowtrainer", "BOWTrainer", "", {}, cluster_descriptors);
//	
//	protected:
//		std::vector<Mat> descriptors;
//		int size;
//	};
//	



target->Set(Nan::New("BOWTrainer").ToLocalChecked(), ctor->GetFunction());


}


v8::Local<v8::Function> BOWTrainer::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}



POLY_METHOD(BOWTrainer::New){throw std::exception("not implemented");}
POLY_METHOD(BOWTrainer::add){throw std::exception("not implemented");}
POLY_METHOD(BOWTrainer::getDescriptors){throw std::exception("not implemented");}
POLY_METHOD(BOWTrainer::descriptorsCount){throw std::exception("not implemented");}
POLY_METHOD(BOWTrainer::clear){throw std::exception("not implemented");}
POLY_METHOD(BOWTrainer::cluster){throw std::exception("not implemented");}
POLY_METHOD(BOWTrainer::cluster_descriptors){throw std::exception("not implemented");}

