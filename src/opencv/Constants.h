#include "../alvision.h"

class Constants: public Nan::ObjectWrap {
 public:
    static void Init(Handle<Object> target);

	static NAN_METHOD(cvMakeType);

	static std::string fromMatType(int matType);
};
