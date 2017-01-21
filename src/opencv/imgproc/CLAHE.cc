#include "CLAHE.h"
#include "../IOArray.h"
#include "../Size.h"

namespace clahe_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("clahe_general_callback is empty");
		}
		return overload->execute("clahe", info);
	}
}

void
CLAHE::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	clahe_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(clahe_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("CLAHE").ToLocalChecked());
	ctor->Inherit(Nan::New(Algorithm::constructor));

	overload->register_type<CLAHE>(ctor, "generalizedhough", "CLAHE");

	//export interface CLAHE extends Algorithm
	//{
	//	apply(src : _st.InputArray, dst : _st.OutputArray) : void;
	overload->addOverload("clahe", "CLAHE", "apply", {
		make_param<IOArray*>("src","IOArray"),
		make_param<IOArray*>("dst","IOArray")
	}, apply);
	//
	//	setClipLimit(clipLimit : _st.double) : void;
	overload->addOverload("clahe", "CLAHE", "setClipLimit", {make_param<double>("clipLimit","double")}, setClipLimit);
	//	getClipLimit() : _st.double;
	overload->addOverload("clahe", "CLAHE", "getClipLimit", {}, getClipLimit);
	//
	//	setTilesGridSize(tileGridSize : _types.Size) : void;
	overload->addOverload("clahe", "CLAHE", "setTilesGridSize", {make_param<Size*>("tileGridSize",Size::name)}, setTilesGridSize);
	//	getTilesGridSize() : _types.Size;
	overload->addOverload("clahe", "CLAHE", "getTilesGridSize", {}, getTilesGridSize);
	//
	//	collectGarbage() : void;
	overload->addOverload("clahe", "CLAHE", "collectGarbage", {}, collectGarbage);
	//};

	target->Set(Nan::New("CLAHE").ToLocalChecked(), ctor->GetFunction());

}


POLY_METHOD(CLAHE::apply){throw std::exception("not implemented");}
POLY_METHOD(CLAHE::setClipLimit){throw std::exception("not implemented");}
POLY_METHOD(CLAHE::getClipLimit){throw std::exception("not implemented");}
POLY_METHOD(CLAHE::setTilesGridSize){throw std::exception("not implemented");}
POLY_METHOD(CLAHE::getTilesGridSize){throw std::exception("not implemented");}
POLY_METHOD(CLAHE::collectGarbage){throw std::exception("not implemented");}