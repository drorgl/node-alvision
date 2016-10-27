#include "HighGUI.h"
#include "Matrix.h"


void
highgui::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Nan::SetMethod(target, "destroyAllWindows", destroyAllWindows);
};


NAN_METHOD(highgui::destroyAllWindows) {
	return Nan::ThrowError("not implemented");
}