#include "HighGUI.h"
#include "Matrix.h"


void
highgui::Init(Handle<Object> target) {
	Nan::SetMethod(target, "destroyAllWindows", destroyAllWindows);
};


NAN_METHOD(highgui::destroyAllWindows) {
	return Nan::ThrowError("not implemented");
}