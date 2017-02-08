#include "DescriptorMatcher.h"
#include "../IOArray.h"
#include "../types/DMatch.h"
#include "../persistence/FileNode.h"
#include "../persistence/FileStorage.h"

namespace descriptormatcher_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("descriptormatcher_general_callback is empty");
		}
		return overload->execute("descriptormatcher", info);
	}
}

Nan::Persistent<FunctionTemplate> DescriptorMatcher::constructor;
std::string DescriptorMatcher::name;

void DescriptorMatcher::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	DescriptorMatcher::name = "DescriptorMatcher";
	descriptormatcher_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(descriptormatcher_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New(DescriptorMatcher::name).ToLocalChecked());
	ctor->Inherit(Nan::New(Algorithm::constructor));


	overload->register_type<DescriptorMatcher>(ctor, "descriptormatcher", "DescriptorMatcher");
//	
//	
//	/****************************************************************************************\
//	*                                  DescriptorMatcher                                     *
//	\****************************************************************************************/
//	
//	//! @addtogroup features2d_match
//	//! @{
//	
//	/** @brief Abstract base class for matching keypoint descriptors.
//	
//	It has two groups of match methods: for matching descriptors of an image with another image or with
//	an image set.
//	*/
//	class CV_EXPORTS_W DescriptorMatcher : public Algorithm
//	{
//	public:
//		virtual ~DescriptorMatcher();
//	
//		/** @brief Adds descriptors to train a CPU(trainDescCollectionis) or GPU(utrainDescCollectionis) descriptor
//		collection.
//	
//		If the collection is not empty, the new descriptors are added to existing train descriptors.
//	
//		@param descriptors Descriptors to add. Each descriptors[i] is a set of descriptors from the same
//		train image.
//		*/
//		CV_WRAP virtual void add(InputArrayOfArrays descriptors);
	overload->addOverload("descriptormatcher", "DescriptorMatcher", "add", {make_param<IOArray*>("descriptors","IOArray")}, add);
//	
//		/** @brief Returns a constant link to the train descriptor collection trainDescCollection .
//		*/
//		CV_WRAP const std::vector<Mat>& getTrainDescriptors() const;
	overload->addOverload("descriptormatcher", "DescriptorMatcher", "getTrainDescriptors", {}, getTrainDescriptors);
//	
//		/** @brief Clears the train descriptor collections.
//		*/
//		CV_WRAP virtual void clear();
	overload->addOverload("descriptormatcher", "DescriptorMatcher", "clear", {}, clear);
//	
//		/** @brief Returns true if there are no train descriptors in the both collections.
//		*/
//		CV_WRAP virtual bool empty() const;
	overload->addOverload("descriptormatcher", "DescriptorMatcher", "empty", {}, empty);
//	
//		/** @brief Returns true if the descriptor matcher supports masking permissible matches.
//		*/
//		CV_WRAP virtual bool isMaskSupported() const = 0;
	overload->addOverload("descriptormatcher", "DescriptorMatcher", "isMaskSupported", {}, isMaskSupported);
//	
//		/** @brief Trains a descriptor matcher
//	
//		Trains a descriptor matcher (for example, the flann index). In all methods to match, the method
//		train() is run every time before matching. Some descriptor matchers (for example, BruteForceMatcher)
//		have an empty implementation of this method. Other matchers really train their inner structures (for
//		example, FlannBasedMatcher trains flann::Index ).
//		*/
//		CV_WRAP virtual void train();
	overload->addOverload("descriptormatcher", "DescriptorMatcher", "train", {}, train);
//	
//		/** @brief Finds the best match for each descriptor from a query set.
//	
//		@param queryDescriptors Query set of descriptors.
//		@param trainDescriptors Train set of descriptors. This set is not added to the train descriptors
//		collection stored in the class object.
//		@param matches Matches. If a query descriptor is masked out in mask , no match is added for this
//		descriptor. So, matches size may be smaller than the query descriptors count.
//		@param mask Mask specifying permissible matches between an input query and train matrices of
//		descriptors.
//	
//		In the first variant of this method, the train descriptors are passed as an input argument. In the
//		second variant of the method, train descriptors collection that was set by DescriptorMatcher::add is
//		used. Optional mask (or masks) can be passed to specify which query and training descriptors can be
//		matched. Namely, queryDescriptors[i] can be matched with trainDescriptors[j] only if
//		mask.at\<uchar\>(i,j) is non-zero.
//		*/
//		CV_WRAP void match(InputArray queryDescriptors, InputArray trainDescriptors,
//			CV_OUT std::vector<DMatch>& matches, InputArray mask = noArray()) const;
	overload->addOverload("descriptormatcher", "DescriptorMatcher", "match", {
		make_param<IOArray*>("queryDescriptors","IOArray"), 
		make_param<IOArray*>("trainDescriptors","IOArray"),
		make_param<std::shared_ptr<std::vector<DMatch*>>>("matches","Array<DMatch>"),
		make_param<IOArray*>("mask","IOArray",IOArray::noArray())
	}, match_train);
//	
//		/** @brief Finds the k best matches for each descriptor from a query set.
//	
//		@param queryDescriptors Query set of descriptors.
//		@param trainDescriptors Train set of descriptors. This set is not added to the train descriptors
//		collection stored in the class object.
//		@param mask Mask specifying permissible matches between an input query and train matrices of
//		descriptors.
//		@param matches Matches. Each matches[i] is k or less matches for the same query descriptor.
//		@param k Count of best matches found per each query descriptor or less if a query descriptor has
//		less than k possible matches in total.
//		@param compactResult Parameter used when the mask (or masks) is not empty. If compactResult is
//		false, the matches vector has the same size as queryDescriptors rows. If compactResult is true,
//		the matches vector does not contain matches for fully masked-out query descriptors.
//	
//		These extended variants of DescriptorMatcher::match methods find several best matches for each query
//		descriptor. The matches are returned in the distance increasing order. See DescriptorMatcher::match
//		for the details about query and train descriptors.
//		*/
//		CV_WRAP void knnMatch(InputArray queryDescriptors, InputArray trainDescriptors,
//			CV_OUT std::vector<std::vector<DMatch> >& matches, int k,
//			InputArray mask = noArray(), bool compactResult = false) const;
	overload->addOverload("descriptormatcher", "DescriptorMatcher", "knnMatch", {
		make_param<IOArray*>("queryDescriptors","IOArray"),
		make_param<IOArray*>("trainDescriptors","IOArray"),
		make_param<std::shared_ptr<std::vector<DMatch*>>>("matches","Array<DMatch>"),
		make_param<int>("k","int"),
		make_param<IOArray*>("mask","IOArray",IOArray:: noArray()),
		make_param<bool>("compactResult","bool", false)
	}, knnMatch_train);
//	
//		/** @brief For each query descriptor, finds the training descriptors not farther than the specified distance.
//	
//		@param queryDescriptors Query set of descriptors.
//		@param trainDescriptors Train set of descriptors. This set is not added to the train descriptors
//		collection stored in the class object.
//		@param matches Found matches.
//		@param compactResult Parameter used when the mask (or masks) is not empty. If compactResult is
//		false, the matches vector has the same size as queryDescriptors rows. If compactResult is true,
//		the matches vector does not contain matches for fully masked-out query descriptors.
//		@param maxDistance Threshold for the distance between matched descriptors. Distance means here
//		metric distance (e.g. Hamming distance), not the distance between coordinates (which is measured
//		in Pixels)!
//		@param mask Mask specifying permissible matches between an input query and train matrices of
//		descriptors.
//	
//		For each query descriptor, the methods find such training descriptors that the distance between the
//		query descriptor and the training descriptor is equal or smaller than maxDistance. Found matches are
//		returned in the distance increasing order.
//		*/
//		void radiusMatch(InputArray queryDescriptors, InputArray trainDescriptors,
//			std::vector<std::vector<DMatch> >& matches, float maxDistance,
//			InputArray mask = noArray(), bool compactResult = false) const;
	overload->addOverload("descriptormatcher", "DescriptorMatcher", "radiusMatch", {
		make_param<IOArray*>("queryDescriptors","IOArray"),
		make_param<IOArray*>("trainDescriptors","IOArray"),
		make_param<std::shared_ptr<std::vector<DMatch*>>>("matches","Array<DMatch>"),
		make_param<float>("maxDistance","float"),
		make_param<IOArray*>("mask","IOArray",IOArray::noArray()),
		make_param<bool>("compactResult","bool", false)
	}, radiusMatch_train);
//	
//		/** @overload
//		@param queryDescriptors Query set of descriptors.
//		@param matches Matches. If a query descriptor is masked out in mask , no match is added for this
//		descriptor. So, matches size may be smaller than the query descriptors count.
//		@param masks Set of masks. Each masks[i] specifies permissible matches between the input query
//		descriptors and stored train descriptors from the i-th image trainDescCollection[i].
//		*/
//		CV_WRAP void match(InputArray queryDescriptors, CV_OUT std::vector<DMatch>& matches,
//			InputArrayOfArrays masks = noArray());
	overload->addOverload("descriptormatcher", "DescriptorMatcher", "match", {
		make_param<IOArray*>("queryDescriptors","IOArray"),
		make_param<std::shared_ptr<std::vector<DMatch*>>>("matches","Array<DMatch>"),
		make_param<IOArray*>("mask","IOArray",IOArray::noArray())
	}, match);
//		/** @overload
//		@param queryDescriptors Query set of descriptors.
//		@param matches Matches. Each matches[i] is k or less matches for the same query descriptor.
//		@param k Count of best matches found per each query descriptor or less if a query descriptor has
//		less than k possible matches in total.
//		@param masks Set of masks. Each masks[i] specifies permissible matches between the input query
//		descriptors and stored train descriptors from the i-th image trainDescCollection[i].
//		@param compactResult Parameter used when the mask (or masks) is not empty. If compactResult is
//		false, the matches vector has the same size as queryDescriptors rows. If compactResult is true,
//		the matches vector does not contain matches for fully masked-out query descriptors.
//		*/
//		CV_WRAP void knnMatch(InputArray queryDescriptors, CV_OUT std::vector<std::vector<DMatch> >& matches, int k,
//			InputArrayOfArrays masks = noArray(), bool compactResult = false);
	overload->addOverload("descriptormatcher", "DescriptorMatcher", "knnMatch", {
		make_param<IOArray*>("queryDescriptors","IOArray"),
		make_param<std::shared_ptr<std::vector<DMatch*>>>("matches","Array<DMatch>"),
		make_param<int>("k","int"),
		make_param<IOArray*>("mask","IOArray",IOArray::noArray()),
		make_param<bool>("compactResult","bool", false)
	}, knnMatch);
//		/** @overload
//		@param queryDescriptors Query set of descriptors.
//		@param matches Found matches.
//		@param maxDistance Threshold for the distance between matched descriptors. Distance means here
//		metric distance (e.g. Hamming distance), not the distance between coordinates (which is measured
//		in Pixels)!
//		@param masks Set of masks. Each masks[i] specifies permissible matches between the input query
//		descriptors and stored train descriptors from the i-th image trainDescCollection[i].
//		@param compactResult Parameter used when the mask (or masks) is not empty. If compactResult is
//		false, the matches vector has the same size as queryDescriptors rows. If compactResult is true,
//		the matches vector does not contain matches for fully masked-out query descriptors.
//		*/
//		void radiusMatch(InputArray queryDescriptors, std::vector<std::vector<DMatch> >& matches, float maxDistance,
//			InputArrayOfArrays masks = noArray(), bool compactResult = false);
	overload->addOverload("descriptormatcher", "DescriptorMatcher", "radiusMatch", {
		make_param<IOArray*>("queryDescriptors","IOArray"),
		make_param<std::shared_ptr<std::vector<DMatch*>>>("matches","Array<DMatch>"),
		make_param<float>("maxDistance","float"),
		make_param<IOArray*>("mask","IOArray",IOArray::noArray()),
		make_param<bool>("compactResult","bool", false)
	}, radiusMatch);
//	
//		// Reads matcher object from a file node
//		virtual void read(const FileNode&);
	overload->addOverload("descriptormatcher", "DescriptorMatcher", "read", {make_param<FileNode*>("fn","FileNode")}, read);
//		// Writes matcher object to a file storage
//		virtual void write(FileStorage&) const;
	overload->addOverload("descriptormatcher", "DescriptorMatcher", "write", {make_param<FileStorage*>("fs","FileStorage")}, write);
//	
//		/** @brief Clones the matcher.
//	
//		@param emptyTrainData If emptyTrainData is false, the method creates a deep copy of the object,
//		that is, copies both parameters and train data. If emptyTrainData is true, the method creates an
//		object copy with the current parameters but with empty train data.
//		*/
//		virtual Ptr<DescriptorMatcher> clone(bool emptyTrainData = false) const = 0;
	overload->addOverload("descriptormatcher", "DescriptorMatcher", "clone", { make_param<bool>("emptyTrainData","bool", false) }, clone);
//	
//		/** @brief Creates a descriptor matcher of a given type with the default parameters (using default
//		constructor).
//	
//		@param descriptorMatcherType Descriptor matcher type. Now the following matcher types are
//		supported:
//		-   `BruteForce` (it uses L2 )
//		-   `BruteForce-L1`
//		-   `BruteForce-Hamming`
//		-   `BruteForce-Hamming(2)`
//		-   `FlannBased`
//		*/
//		CV_WRAP static Ptr<DescriptorMatcher> create(const String& descriptorMatcherType);
	overload->addStaticOverload("descriptormatcher", "DescriptorMatcher", "create", {make_param<std::string>("descriptorMatcherType","String")}, create);
//	protected:
//		/**
//		* Class to work with descriptors from several images as with one merged matrix.
//		* It is used e.g. in FlannBasedMatcher.
//		*/
//		
//		//! In fact the matching is implemented only by the following two methods. These methods suppose
//		//! that the class object has been trained already. Public match methods call these methods
//		//! after calling train().
//		virtual void knnMatchImpl(InputArray queryDescriptors, std::vector<std::vector<DMatch> >& matches, int k,
//			InputArrayOfArrays masks = noArray(), bool compactResult = false) = 0;
//		virtual void radiusMatchImpl(InputArray queryDescriptors, std::vector<std::vector<DMatch> >& matches, float maxDistance,
//			InputArrayOfArrays masks = noArray(), bool compactResult = false) = 0;
//	
//		static bool isPossibleMatch(InputArray mask, int queryIdx, int trainIdx);
//		static bool isMaskedOut(InputArrayOfArrays masks, int queryIdx);
//	
//		static Mat clone_op(Mat m) { return m.clone(); }
//		void checkMasks(InputArrayOfArrays masks, int queryDescriptorsCount) const;
//	
//		//! Collection of descriptors from train images.
//		std::vector<Mat> trainDescCollection;
//		std::vector<UMat> utrainDescCollection;
//	};



target->Set(Nan::New("DescriptorMatcher").ToLocalChecked(), ctor->GetFunction());

}

v8::Local<v8::Function> DescriptorMatcher::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


POLY_METHOD(DescriptorMatcher::add){throw std::exception("not implemented");}
POLY_METHOD(DescriptorMatcher::getTrainDescriptors){throw std::exception("not implemented");}
POLY_METHOD(DescriptorMatcher::clear){throw std::exception("not implemented");}
POLY_METHOD(DescriptorMatcher::empty){throw std::exception("not implemented");}
POLY_METHOD(DescriptorMatcher::isMaskSupported){throw std::exception("not implemented");}
POLY_METHOD(DescriptorMatcher::train){throw std::exception("not implemented");}
POLY_METHOD(DescriptorMatcher::match_train){throw std::exception("not implemented");}
POLY_METHOD(DescriptorMatcher::knnMatch_train){throw std::exception("not implemented");}
POLY_METHOD(DescriptorMatcher::radiusMatch_train){throw std::exception("not implemented");}
POLY_METHOD(DescriptorMatcher::match){throw std::exception("not implemented");}
POLY_METHOD(DescriptorMatcher::knnMatch){throw std::exception("not implemented");}
POLY_METHOD(DescriptorMatcher::radiusMatch){throw std::exception("not implemented");}
POLY_METHOD(DescriptorMatcher::read){throw std::exception("not implemented");}
POLY_METHOD(DescriptorMatcher::write){throw std::exception("not implemented");}
POLY_METHOD(DescriptorMatcher::clone){throw std::exception("not implemented");}
POLY_METHOD(DescriptorMatcher::create){throw std::exception("not implemented");}

