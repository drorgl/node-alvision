#include "Matx.h"
#include "MatxAndVec.h"
#include "Matx.imp.h"

#include "Matx/Matx_double.h"
#include "Matx/Matx_float.h"
#include "Matx/Matx_int.h"

#include "TrackedPtr.h"

namespace matx_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("matx_general_callback is empty");
		}
		return overload->execute("matx", info);
	}
}



void MatxInit::Register(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	MatxIntInit		::Register(target,overload);
	MatxFloatInit	::Register(target,overload);
	MatxDoubleInit	::Register(target,overload);
}

void MatxInit::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	MatxIntInit		::Init(target,overload);
	MatxFloatInit	::Init(target,overload);
	MatxDoubleInit	::Init(target,overload);
}