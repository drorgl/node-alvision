#include "QtFont.h"

namespace qtfont_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("qtfont_general_callback is empty");
		}
		return overload->execute("qtfont", info);
	}
}

Nan::Persistent<FunctionTemplate> QtFont::constructor;

std::string QtFont::name;

void
QtFont::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	qtfont_general_callback::overload = overload;
	Local<FunctionTemplate> ctor = Nan::New<FunctionTemplate>(qtfont_general_callback::callback);
	constructor.Reset(ctor);
	auto itpl = ctor->InstanceTemplate();
	itpl->SetInternalFieldCount(1);
	ctor->SetClassName(Nan::New("QtFont").ToLocalChecked());

	overload->register_type<QtFont>(ctor, "qtfont", "QtFont");

//	class QtFont
//	{
		//const char* nameFont;  //!< Name of the font
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("nameFont").ToLocalChecked(), nameFont_getter, nameFont_setter);
		//Scalar      color;     //!< Color of the font. Scalar(blue_component, green_component, red_component[, alpha_component])
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("color").ToLocalChecked(), color_getter, color_setter);
		//int         font_face; //!< See cv::QtFontStyles
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("font_face").ToLocalChecked(), font_face_getter, font_face_setter);
		//const int*  ascii;     //!< font data and metrics
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("ascii").ToLocalChecked(), ascii_getter, ascii_setter);
		//const int*  greek;
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("greek").ToLocalChecked(), greek_getter, greek_setter);
		//const int*  cyrillic;
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("cyrillic").ToLocalChecked(), cyrillic_getter, cyrillic_setter);
		//float       hscale, vscale;
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("hscale").ToLocalChecked(), hscale_getter, hscale_setter);
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("vscale").ToLocalChecked(), vscale_getter, vscale_setter);
		//float       shear;     //!< slope coefficient: 0 - normal, >0 - italic
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("shear").ToLocalChecked(), shear_getter, shear_setter);
		//int         thickness; //!< See cv::QtFontWeights
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("thickness").ToLocalChecked(), thickness_getter, thickness_setter);
		//float       dx;        //!< horizontal interval between letters
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("dx").ToLocalChecked(), dx_getter, dx_setter);
		//int         line_type; //!< PointSize
	Nan::SetAccessor(ctor->InstanceTemplate(), Nan::New("line_type").ToLocalChecked(), line_type_getter, line_type_setter);
//	};





	target->Set(Nan::New("QtFont").ToLocalChecked(), ctor->GetFunction());

}

v8::Local<v8::Function> QtFont::get_constructor() {
	assert(!constructor.IsEmpty() && "constructor is empty");
	return Nan::New(constructor)->GetFunction();
}


NAN_GETTER(QtFont::nameFont_getter){throw std::exception("not implemented");}
NAN_SETTER(QtFont::nameFont_setter){throw std::exception("not implemented");}
NAN_GETTER(QtFont::color_getter){throw std::exception("not implemented");}
NAN_SETTER(QtFont::color_setter){throw std::exception("not implemented");}
NAN_GETTER(QtFont::font_face_getter){throw std::exception("not implemented");}
NAN_SETTER(QtFont::font_face_setter){throw std::exception("not implemented");}
NAN_GETTER(QtFont::ascii_getter){throw std::exception("not implemented");}
NAN_SETTER(QtFont::ascii_setter){throw std::exception("not implemented");}
NAN_GETTER(QtFont::greek_getter){throw std::exception("not implemented");}
NAN_SETTER(QtFont::greek_setter){throw std::exception("not implemented");}
NAN_GETTER(QtFont::cyrillic_getter){throw std::exception("not implemented");}
NAN_SETTER(QtFont::cyrillic_setter){throw std::exception("not implemented");}
NAN_GETTER(QtFont::hscale_getter){throw std::exception("not implemented");}
NAN_SETTER(QtFont::hscale_setter){throw std::exception("not implemented");}
NAN_GETTER(QtFont::vscale_getter){throw std::exception("not implemented");}
NAN_SETTER(QtFont::vscale_setter){throw std::exception("not implemented");}
NAN_GETTER(QtFont::shear_getter){throw std::exception("not implemented");}
NAN_SETTER(QtFont::shear_setter){throw std::exception("not implemented");}
NAN_GETTER(QtFont::thickness_getter){throw std::exception("not implemented");}
NAN_SETTER(QtFont::thickness_setter){throw std::exception("not implemented");}
NAN_GETTER(QtFont::dx_getter){throw std::exception("not implemented");}
NAN_SETTER(QtFont::dx_setter){throw std::exception("not implemented");}
NAN_GETTER(QtFont::line_type_getter){throw std::exception("not implemented");}
NAN_SETTER(QtFont::line_type_setter){throw std::exception("not implemented");}


