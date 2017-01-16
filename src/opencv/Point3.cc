#include "Point3.h"

namespace point3_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("point3_general_callback is empty");
		}
		return overload->execute("point3", info);
	}
}

void Point3Init::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Point3i::Init(target, "Point3i", overload);
	Point3f::Init(target, "Point3f", overload);
	Point3d::Init(target, "Point3d", overload);

}