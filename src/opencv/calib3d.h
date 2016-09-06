#include "../alvision.h"

class calib3d: public Nan::ObjectWrap {
 public:
    static void Init(Handle<Object> target);

	static NAN_METHOD(Rodrigues);
	static NAN_METHOD(calibrateCamera);
};
