#include "../alvision.h"

class Constants: public Nan::ObjectWrap {
 public:
    static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	static NAN_METHOD(cvMakeType);

	static std::string fromMatType(int matType);
};
