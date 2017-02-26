#include "BOWImgDescriptorExtractor.h"
#include "DescriptorMatcher.h"
#include "Feature2D.h"
#include "../Matrix.h"
#include "../types/KeyPoint.h"

namespace bowimgdescriptorextractor_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("bowimgdescriptorextractor_general_callback is empty");
		}
		return overload->execute("bowimgdescriptorextractor", info);
	}
}

Nan::Persistent<FunctionTemplate> BOWImgDescriptorExtractor::constructor;

void
BOWImgDescriptorExtractor::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	bowimgdescriptorextractor_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(bowimgdescriptorextractor_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("BOWImgDescriptorExtractor").ToLocalChecked());
	

	overload->register_type<BOWImgDescriptorExtractor>(ctor, "bowimgdescriptorextractor", "BOWImgDescriptorExtractor");





//	/** @brief Class to compute an image descriptor using the *bag of visual words*.
//	
//	Such a computation consists of the following steps:
//	
//	1.  Compute descriptors for a given image and its keypoints set.
//	2.  Find the nearest visual words from the vocabulary for each keypoint descriptor.
//	3.  Compute the bag-of-words image descriptor as is a normalized histogram of vocabulary words
//	encountered in the image. The i-th bin of the histogram is a frequency of i-th word of the
//	vocabulary in the given image.
//	*/
//	class CV_EXPORTS_W BOWImgDescriptorExtractor
//	{
//	public:
//		/** @brief The constructor.
//	
//		@param dextractor Descriptor extractor that is used to compute descriptors for an input image and
//		its keypoints.
//		@param dmatcher Descriptor matcher that is used to find the nearest word of the trained vocabulary
//		for each keypoint descriptor of the image.
//		*/
//		CV_WRAP BOWImgDescriptorExtractor(const Ptr<DescriptorExtractor>& dextractor,
//			const Ptr<DescriptorMatcher>& dmatcher);
	overload->addOverloadConstructor("bowimgdescriptorextractor", "BOWImgDescriptorExtractor", {
		make_param<DescriptorExtractor*>("dextractor",DescriptorExtractor::name),
		make_param<DescriptorMatcher*>("dmatcher",DescriptorMatcher::name)
	}, New);
//		/** @overload */
//		BOWImgDescriptorExtractor(const Ptr<DescriptorMatcher>& dmatcher);
	overload->addOverloadConstructor("bowimgdescriptorextractor", "BOWImgDescriptorExtractor", {
		make_param<DescriptorMatcher*>("dmatcher",DescriptorMatcher::name)
	}, New_dmatcher);
//		virtual ~BOWImgDescriptorExtractor();
//	
//		/** @brief Sets a visual vocabulary.
//	
//		@param vocabulary Vocabulary (can be trained using the inheritor of BOWTrainer ). Each row of the
//		vocabulary is a visual word (cluster center).
//		*/
//		CV_WRAP void setVocabulary(const Mat& vocabulary);
	overload->addOverload("bowimgdescriptorextractor", "BOWImgDescriptorExtractor", "setVocabulary", {make_param<Matrix*>("vocabulary",Matrix::name)}, setVocabulary);
//	
//		/** @brief Returns the set vocabulary.
//		*/
//		CV_WRAP const Mat& getVocabulary() const;
	overload->addOverload("bowimgdescriptorextractor", "BOWImgDescriptorExtractor", "getVocabulary", {}, getVocabulary);
//	
//		/** @brief Computes an image descriptor using the set visual vocabulary.
//	
//		@param image Image, for which the descriptor is computed.
//		@param keypoints Keypoints detected in the input image.
//		@param imgDescriptor Computed output image descriptor.
//		@param pointIdxsOfClusters Indices of keypoints that belong to the cluster. This means that
//		pointIdxsOfClusters[i] are keypoint indices that belong to the i -th cluster (word of vocabulary)
//		returned if it is non-zero.
//		@param descriptors Descriptors of the image keypoints that are returned if they are non-zero.
//		*/
//		void compute(InputArray image, std::vector<KeyPoint>& keypoints, OutputArray imgDescriptor,
//			std::vector<std::vector<int> >* pointIdxsOfClusters = 0, Mat* descriptors = 0);
	overload->addOverload("bowimgdescriptorextractor", "BOWImgDescriptorExtractor", "compute", {
		make_param<IOArray*>("image",IOArray::name),
		make_param<std::shared_ptr<std::vector<KeyPoint*>>>("keypoints","Array<KeyPoint>"),
		make_param<IOArray*>("imgDescriptor",IOArray::name),
		make_param<std::shared_ptr<std::vector<std::shared_ptr<std::vector<int>>>>>("pointIdxsOfClusters","Array<Array<KeyPoint>>",nullptr),
		make_param<Matrix*>("descriptors",Matrix::name,Matrix::create())
	}, compute_img);
//		/** @overload
//		@param keypointDescriptors Computed descriptors to match with vocabulary.
//		@param imgDescriptor Computed output image descriptor.
//		@param pointIdxsOfClusters Indices of keypoints that belong to the cluster. This means that
//		pointIdxsOfClusters[i] are keypoint indices that belong to the i -th cluster (word of vocabulary)
//		returned if it is non-zero.
//		*/
//		void compute(InputArray keypointDescriptors, OutputArray imgDescriptor,
//			std::vector<std::vector<int> >* pointIdxsOfClusters = 0);
	overload->addOverload("bowimgdescriptorextractor", "BOWImgDescriptorExtractor", "compute", {
		make_param<IOArray*>("keypointDescriptors",IOArray::name),
		make_param<IOArray*>("imgDescriptor",IOArray::name),
		make_param<std::shared_ptr<std::vector<std::shared_ptr<std::vector<int>>>>>("pointIdxsOfClusters","Array<Array<KeyPoint>>",nullptr),
	}, compute_kp);
//		// compute() is not constant because DescriptorMatcher::match is not constant
//	
//		CV_WRAP_AS(compute) void compute2(const Mat& image, std::vector<KeyPoint>& keypoints, CV_OUT Mat& imgDescriptor)
//		{
//			compute(image, keypoints, imgDescriptor);
//		}
	overload->addOverload("bowimgdescriptorextractor", "BOWImgDescriptorExtractor", "compute2", {
		make_param<Matrix*>("image",Matrix::name),
		make_param<std::shared_ptr<std::vector<KeyPoint*>>>("keypoints","Array<KeyPoint>"),
		make_param<Matrix*>("imgDescriptor",Matrix::name)
	}, compute2);
//	
//		/** @brief Returns an image descriptor size if the vocabulary is set. Otherwise, it returns 0.
//		*/
//		CV_WRAP int descriptorSize() const;
	overload->addOverload("bowimgdescriptorextractor", "BOWImgDescriptorExtractor", "descriptorSize", {}, descriptorSize);
//	
//		/** @brief Returns an image descriptor type.
//		*/
//		CV_WRAP int descriptorType() const;
	overload->addOverload("bowimgdescriptorextractor", "BOWImgDescriptorExtractor", "descriptorType", {}, descriptorType);
//	
//	protected:
//		Mat vocabulary;
//		Ptr<DescriptorExtractor> dextractor;
//		Ptr<DescriptorMatcher> dmatcher;
//	};
//	
//	


target->Set(Nan::New("BOWImgDescriptorExtractor").ToLocalChecked(), ctor->GetFunction());


}


v8::Local<v8::Function> BOWImgDescriptorExtractor::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


POLY_METHOD(BOWImgDescriptorExtractor::New){throw std::runtime_error("not implemented");}
POLY_METHOD(BOWImgDescriptorExtractor::New_dmatcher){throw std::runtime_error("not implemented");}
POLY_METHOD(BOWImgDescriptorExtractor::setVocabulary){throw std::runtime_error("not implemented");}
POLY_METHOD(BOWImgDescriptorExtractor::getVocabulary){throw std::runtime_error("not implemented");}
POLY_METHOD(BOWImgDescriptorExtractor::compute_img){throw std::runtime_error("not implemented");}
POLY_METHOD(BOWImgDescriptorExtractor::compute_kp){throw std::runtime_error("not implemented");}
POLY_METHOD(BOWImgDescriptorExtractor::compute2){throw std::runtime_error("not implemented");}
POLY_METHOD(BOWImgDescriptorExtractor::descriptorSize){throw std::runtime_error("not implemented");}
POLY_METHOD(BOWImgDescriptorExtractor::descriptorType){throw std::runtime_error("not implemented");}

