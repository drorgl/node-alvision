#include "background_segm.h"
#include "background_segm/BackgroundSubtractor.h"
#include "background_segm/BackgroundSubtractorMOG2.h"
#include "background_segm/BackgroundSubtractorKNN.h"


void background_segm::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	BackgroundSubtractor::Init(target, overload);
	BackgroundSubtractorKNN::Init(target, overload);
	BackgroundSubtractorMOG2::Init(target, overload);
}