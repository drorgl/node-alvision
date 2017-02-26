#include "AlignMTB.h"
#include "../IOArray.h"
#include "../Matrix.h"
#include "../types/Point.h"

namespace alignmtb_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("alignmtb_general_callback is empty");
		}
		return overload->execute("alignmtb", info);
	}
}

Nan::Persistent<FunctionTemplate> AlignMTB::constructor;

void AlignMTB::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	alignmtb_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(alignmtb_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("AlignMTB").ToLocalChecked());
	ctor->Inherit(Nan::New(AlignExposures::constructor));

	overload->register_type<AlignMTB>(ctor, "alignmtb", "AlignMTB");


	overload->addOverloadConstructor("alignmtb", "AlignMTB", {}, New);

//	/** @brief This algorithm converts images to median threshold bitmaps (1 for pixels brighter than median
//		luminance and 0 otherwise) and than aligns the resulting bitmaps using bit operations.
//	
//		It is invariant to exposure, so exposure values and camera response are not necessary.
//	
//		In this implementation new image regions are filled with zeros.
//	
//		For more information see @cite GW03 .
//		*/
//		interface AlignMTB extends AlignExposures
//		{
//			//public:
//			process(src: _st.InputArrayOfArrays, dst : Array<_mat.Mat>,
//				times : _st.InputArray, response : _st.InputArray) : void;
	overload->addOverload("alignmtb", "AlignMTB","process", {
		make_param<IOArray*>("src","InputArrayOfArrays"),
		make_param<std::shared_ptr<std::vector<Matrix*>>>("dst","Array<Mat>"),
		make_param<IOArray*>("times","InputArray"),
		make_param<IOArray*>("response","InputArray")
	}, process_times_response);
//	
//			/** @brief Short version of process, that doesn't take extra arguments.
//	
//			@param src vector of input images
//			@param dst vector of aligned images
//			*/
//			process(src: _st.InputArrayOfArrays, dst : Array<_mat.Mat>) : void;
	overload->addOverload("alignmtb", "AlignMTB", "process", {
		make_param<IOArray*>("src","InputArrayOfArrays"),
		make_param<std::shared_ptr<std::vector<Matrix*>>>("dst","Array<Mat>")
	}, process);
//	
//			/** @brief Calculates shift between two images, i. e. how to shift the second image to correspond it with the
//			first.
//	
//			@param img0 first image
//			@param img1 second image
//			*/
//			calculateShift(img0: _st.InputArray, img1 : _st.InputArray) : _types.Point;
	overload->addOverload("alignmtb", "AlignMTB", "calculateShift", {
		make_param<IOArray*>("img0","InputArray"), 
		make_param<IOArray*>("img1","InputArray")
	}, calculateShift);
//			/** @brief Helper function, that shift Mat filling new regions with zeros.
//	
//			@param src input image
//			@param dst result image
//			@param shift shift value
//			*/
//			shiftMat(src: _st.InputArray, dst : _st.OutputArray, shift : _types.Point) : void;
	overload->addOverload("alignmtb", "AlignMTB", "shiftMat", {
		make_param<IOArray*>("src","InputArray"), 
		make_param<IOArray*>("dst","OutputArray"), 
		make_param<Point*>("shift",Point::name),
	}, shiftMat);
//			/** @brief Computes median threshold and exclude bitmaps of given image.
//	
//			@param img input image
//			@param tb median threshold bitmap
//			@param eb exclude bitmap
//			*/
//			computeBitmaps(img: _st.InputArray, tb : _st.OutputArray, eb : _st.OutputArray) : void;
	overload->addOverload("alignmtb", "AlignMTB", "computeBitmaps", {
		make_param<IOArray*>("img","InputArray"), 
		make_param<IOArray*>( "tb","OutputArray"), 
		make_param<IOArray*>( "eb","OutputArray")
	}, computeBitmaps);
//	
//			getMaxBits() : _st.int;
	overload->addOverload("alignmtb", "AlignMTB", "getMaxBits", {}, getMaxBits);
//			setMaxBits(max_bits: _st.int) : void;
	overload->addOverload("alignmtb", "AlignMTB", "setMaxBits", {make_param<int>("max_bits","int")}, setMaxBits);
//	
//			getExcludeRange() : _st.int;
	overload->addOverload("alignmtb", "AlignMTB", "getExcludeRange", {}, getExcludeRange);
//			setExcludeRange(exclude_range: _st.int) : void;
	overload->addOverload("alignmtb", "AlignMTB", "setExcludeRange", {make_param<int>("exclude_range","int")}, setExcludeRange);
//	
//			getCut() : boolean;
	overload->addOverload("alignmtb", "AlignMTB", "getCut", {}, getCut);
//			setCut(value: boolean) : void;
	overload->addOverload("alignmtb", "AlignMTB", "setCut", {make_param<bool>("value","bool")}, setCut);
//		};
//	
//		/** @brief Creates AlignMTB object
//	
//		@param max_bits logarithm to the base 2 of maximal shift in each dimension. Values of 5 and 6 are
//		usually good enough (31 and 63 pixels shift respectively).
//		@param exclude_range range for exclusion bitmap that is constructed to suppress noise around the
//		median value.
//		@param cut if true cuts images, otherwise fills the new regions with zeros.
//		*/
//	
	overload->addOverload("alignmtb", "AlignMTB", "createAlignMTB", {
		make_param<int>("max_bits","int", 6),
		make_param<int>("exclude_range","int", 4),
		make_param<bool>("cut","bool", true)
	}, createAlignMTB);
//		interface IcreateAlignMTB {
//			(max_bits ? : _st.int /* = 6*/, exclude_range ? : _st.int /* = 4*/, cut ? : boolean /*= true*/) : AlignMTB;
//		}
//	
//		export var createAlignMTB : IcreateAlignMTB = alvision_module.createAlignMTB;
//	
//		//CV_EXPORTS_W Ptr< AlignMTB > createAlignMTB(int max_bits = 6, int exclude_range = 4, bool cut = true);
//	

	target->Set(Nan::New("AlignMTB").ToLocalChecked(), ctor->GetFunction());
}

v8::Local<v8::Function> AlignMTB::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


POLY_METHOD(AlignMTB::New){throw std::runtime_error("not implemented");}
POLY_METHOD(AlignMTB::process_times_response){throw std::runtime_error("not implemented");}
POLY_METHOD(AlignMTB::process){throw std::runtime_error("not implemented");}
POLY_METHOD(AlignMTB::calculateShift){throw std::runtime_error("not implemented");}
POLY_METHOD(AlignMTB::shiftMat){throw std::runtime_error("not implemented");}
POLY_METHOD(AlignMTB::computeBitmaps){throw std::runtime_error("not implemented");}
POLY_METHOD(AlignMTB::getMaxBits){throw std::runtime_error("not implemented");}
POLY_METHOD(AlignMTB::setMaxBits){throw std::runtime_error("not implemented");}
POLY_METHOD(AlignMTB::getExcludeRange){throw std::runtime_error("not implemented");}
POLY_METHOD(AlignMTB::setExcludeRange){throw std::runtime_error("not implemented");}
POLY_METHOD(AlignMTB::getCut){throw std::runtime_error("not implemented");}
POLY_METHOD(AlignMTB::setCut){throw std::runtime_error("not implemented");}
POLY_METHOD(AlignMTB::createAlignMTB){throw std::runtime_error("not implemented");}

