#ifndef _ALVISION_TEXTURE2D_H_
#define _ALVISION_TEXTURE2D_H_

#include "../../../alvision.h"
#include "../../IOArray.h"

class Texture2D : public IOArray {
public:
	static std::string name;

	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	std::shared_ptr<cv::ogl::Texture2D> _texture2d;

};

#endif


