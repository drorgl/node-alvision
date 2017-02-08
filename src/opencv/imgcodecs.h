#ifndef _ALVISION_IMGCODECS_H_
#define _ALVISION_IMGCODECS_H_

#include "../alvision.h"

class imgcodecs: public or::ObjectWrap {
 public:
    static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);


	static POLY_METHOD(imread			);
	static POLY_METHOD(imreadmulti		);
	static POLY_METHOD(imwrite			);
	static POLY_METHOD(imdecode_dst		);
	static POLY_METHOD(imdecode			);
	static POLY_METHOD(imencode			);



};


#endif