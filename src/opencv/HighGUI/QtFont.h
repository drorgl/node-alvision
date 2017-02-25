#ifndef _ALVISION_QTFONT_H_
#define _ALVISION_QTFONT_H_

#include "../../alvision.h"

class QtFont : public overres::ObjectWrap{
public:
	static std::string name;

	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	std::shared_ptr<cv::QtFont> _qtfont;

	virtual v8::Local<v8::Function> get_constructor();

	template<typename... Args>
	static std::shared_ptr<QtFont> create(Args&&... args) {
		auto val = std::make_shared<QtFont>();
		val->_qtfont = std::shared_ptr<cv::QtFont>(new cv::QtFont(std::forward<Args>(args)...));
		return val;
	}


	static NAN_GETTER(nameFont_getter);	
	static NAN_SETTER(nameFont_setter);
	static NAN_GETTER(color_getter);		
	static NAN_SETTER(color_setter);
	static NAN_GETTER(font_face_getter);	
	static NAN_SETTER(font_face_setter);
	static NAN_GETTER(ascii_getter);		
	static NAN_SETTER(ascii_setter);
	static NAN_GETTER(greek_getter);		
	static NAN_SETTER(greek_setter);
	static NAN_GETTER(cyrillic_getter);	
	static NAN_SETTER(cyrillic_setter);
	static NAN_GETTER(hscale_getter);	
	static NAN_SETTER(hscale_setter);
	static NAN_GETTER(vscale_getter);	
	static NAN_SETTER(vscale_setter);
	static NAN_GETTER(shear_getter);		
	static NAN_SETTER(shear_setter);
	static NAN_GETTER(thickness_getter);	
	static NAN_SETTER(thickness_setter);
	static NAN_GETTER(dx_getter);		
	static NAN_SETTER(dx_setter);
	static NAN_GETTER(line_type_getter);	
	static NAN_SETTER(line_type_setter);

};

#endif
