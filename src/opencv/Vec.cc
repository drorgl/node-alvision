#include "Vec.imp.h"
#include "Vec/Vec_double.h"
#include "Vec/Vec_float.h"
#include "Vec/Vec_int.h"
#include "Vec/Vec_short.h"
#include "Vec/Vec_uchar.h"
#include "Vec/Vec_ushort.h"

namespace vec_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("vec_general_callback is empty");
		}
		return overload->execute("vec", info);
	}
}




void VecInit::Register(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	VecDoubleInit::Register(target,overload);
	VecFloatInit ::Register(target,overload);
	VecIntInit	 ::Register(target,overload);
	VecShortInit ::Register(target,overload);
	VecUCharInit ::Register(target,overload);
	VecUShortInit::Register(target,overload);
}

void VecInit::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	VecDoubleInit::	Init(target, overload);
	VecFloatInit::	Init(target, overload);
	VecIntInit::	Init(target, overload);
	VecShortInit::	Init(target, overload);
	VecUCharInit::	Init(target, overload);
	VecUShortInit::	Init(target, overload);
}