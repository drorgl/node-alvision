#include "calib3d.h"


void
calib3d::Init(Handle<Object> target) {
  Nan::SetMethod(target, "Rodrigues", Rodrigues);

}

NAN_METHOD(calib3d::Rodrigues){
	
	info.GetReturnValue().Set(Nan::New("not implemented").ToLocalChecked());
}

