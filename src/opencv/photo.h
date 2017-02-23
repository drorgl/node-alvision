#ifndef _ALVISION_PHOTO_H_
#define _ALVISION_PHOTO_H_

#include "../alvision.h"

class photo : public or ::ObjectWrap{
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static POLY_METHOD(inpaint);
	static POLY_METHOD(fastNlMeansDenoising_h_arr);
	static POLY_METHOD(fastNlMeansDenoising);
	static POLY_METHOD(fastNlMeansDenoisingColored);
	static POLY_METHOD(fastNlMeansDenoisingMulti_h_array);
	static POLY_METHOD(fastNlMeansDenoisingMulti);
	static POLY_METHOD(fastNlMeansDenoisingColoredMulti);
	static POLY_METHOD(denoise_TVL1);
	static POLY_METHOD(decolor);
	static POLY_METHOD(seamlessClone);
	static POLY_METHOD(colorChange);
	static POLY_METHOD(illuminationChange);
	static POLY_METHOD(textureFlattening);
	static POLY_METHOD(edgePreservingFilter);
	static POLY_METHOD(detailEnhance);
	static POLY_METHOD(pencilSketch);
	static POLY_METHOD(stylization);


};


#endif