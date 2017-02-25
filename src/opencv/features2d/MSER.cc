#include "MSER.h"
#include "../types/Rect.h"
#include "../IOArray.h"

namespace mser_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("mser_general_callback is empty");
		}
		return overload->execute("mser", info);
	}
}

Nan::Persistent<FunctionTemplate> MSER::constructor;

void
MSER::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	mser_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(mser_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("MSER").ToLocalChecked());
	ctor->Inherit(Nan::New(Feature2D::constructor));

	overload->register_type<MSER>(ctor, "mser", "MSER");

//	
//	/** @brief Maximally stable extremal region extractor
//	
//	The class encapsulates all the parameters of the %MSER extraction algorithm (see [wiki
//	article](http://en.wikipedia.org/wiki/Maximally_stable_extremal_regions)).
//	
//	- there are two different implementation of %MSER: one for grey image, one for color image
//	
//	- the grey image algorithm is taken from: @cite nister2008linear ;  the paper claims to be faster
//	than union-find method; it actually get 1.5~2m/s on my centrino L7200 1.2GHz laptop.
//	
//	- the color image algorithm is taken from: @cite forssen2007maximally ; it should be much slower
//	than grey image method ( 3~4 times ); the chi_table.h file is taken directly from paper's source
//	code which is distributed under GPL.
//	
//	- (Python) A complete example showing the use of the %MSER detector can be found at samples/python/mser.py
//	*/
//	class CV_EXPORTS_W MSER : public Feature2D
//	{
//	public:
//		/** @brief Full consturctor for %MSER detector
//	
//		@param _delta it compares \f$(size_{i}-size_{i-delta})/size_{i-delta}\f$
//		@param _min_area prune the area which smaller than minArea
//		@param _max_area prune the area which bigger than maxArea
//		@param _max_variation prune the area have simliar size to its children
//		@param _min_diversity for color image, trace back to cut off mser with diversity less than min_diversity
//		@param _max_evolution  for color image, the evolution steps
//		@param _area_threshold for color image, the area threshold to cause re-initialize
//		@param _min_margin for color image, ignore too small margin
//		@param _edge_blur_size for color image, the aperture size for edge blur
//		*/
//		CV_WRAP static Ptr<MSER> create(int _delta = 5, int _min_area = 60, int _max_area = 14400,
//			double _max_variation = 0.25, double _min_diversity = .2,
//			int _max_evolution = 200, double _area_threshold = 1.01,
//			double _min_margin = 0.003, int _edge_blur_size = 5);
	overload->addStaticOverload("mser", "MSER", "create", {
		make_param<int>("delta","int", 5),
		make_param<int>("min_area","int", 60),
		make_param<int>("max_area","int", 14400),
		make_param<double>("max_variation","double", 0.25),
		make_param<double>("min_diversity","double", .2),
		make_param<int>("max_evolution","int", 200),
		make_param<double>("area_threshold","double",1.01),
		make_param<double>("min_margin","double", 0.003),
		make_param<int>("edge_blur_size","int", 5)
	}, create);

//	
//		/** @brief Detect %MSER regions
//	
//		@param image input image (8UC1, 8UC3 or 8UC4)
//		@param msers resulting list of point sets
//		@param bboxes resulting bounding boxes
//		*/
//		CV_WRAP virtual void detectRegions(InputArray image,
//			CV_OUT std::vector<std::vector<Point> >& msers,
//			std::vector<Rect>& bboxes) = 0;
	overload->addOverload("mser", "MSER", "detectRegions", {
		make_param<IOArray*>("image","IOArray"),
		make_param<std::shared_ptr<overres::Callback>>("cb","Function"),// : (msers : Array<Array<_types.Point>>) = > void,
		make_param<std::shared_ptr<std::vector<Rect*>>>("bboxes","Array<Rect>")
	}, detectRegions);
//	
//		CV_WRAP virtual void setDelta(int delta) = 0;
	overload->addOverload("mser", "MSER", "setDelta", {make_param<int>("delta","int")}, setDelta);
//		CV_WRAP virtual int getDelta() const = 0;
	overload->addOverload("mser", "MSER", "getDelta", {}, getDelta);
//	
//		CV_WRAP virtual void setMinArea(int minArea) = 0;
	overload->addOverload("mser", "MSER", "setMinArea", {make_param<int>("minArea","int")}, setMinArea);
//		CV_WRAP virtual int getMinArea() const = 0;
	overload->addOverload("mser", "MSER", "getMinArea", {}, getMinArea);
//	
//		CV_WRAP virtual void setMaxArea(int maxArea) = 0;
	overload->addOverload("mser", "MSER", "setMaxArea", {make_param<int>("maxArea","int")}, setMaxArea);
//		CV_WRAP virtual int getMaxArea() const = 0;
	overload->addOverload("mser", "MSER", "getMaxArea", {}, getMaxArea);
//	
//		CV_WRAP virtual void setPass2Only(bool f) = 0;
	overload->addOverload("mser", "MSER", "setPass2Only", {make_param<bool>("f","bool")}, setPass2Only);
//		CV_WRAP virtual bool getPass2Only() const = 0;
	overload->addOverload("mser", "MSER", "getPass2Only", {}, getPass2Only);
//	};





target->Set(Nan::New("MSER").ToLocalChecked(), ctor->GetFunction());


}


v8::Local<v8::Function> MSER::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


POLY_METHOD(MSER::create){throw std::exception("not implemented");}
POLY_METHOD(MSER::detectRegions){throw std::exception("not implemented");}
POLY_METHOD(MSER::setDelta){throw std::exception("not implemented");}
POLY_METHOD(MSER::getDelta){throw std::exception("not implemented");}
POLY_METHOD(MSER::setMinArea){throw std::exception("not implemented");}
POLY_METHOD(MSER::getMinArea){throw std::exception("not implemented");}
POLY_METHOD(MSER::setMaxArea){throw std::exception("not implemented");}
POLY_METHOD(MSER::getMaxArea){throw std::exception("not implemented");}
POLY_METHOD(MSER::setPass2Only){throw std::exception("not implemented");}
POLY_METHOD(MSER::getPass2Only){throw std::exception("not implemented");}

