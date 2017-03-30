#include "Point.h"
#include "Point.imp.h"

namespace point_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("point_general_callback is empty");
		}
		return overload->execute("point", info);
	}
}

void PointInit::Register(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Point2i::Register(target, "Point2i", overload);
	Point2f::Register(target, "Point2f", overload);
	Point2d::Register(target, "Point2d", overload);
	overload->add_type_alias("Point", "Point2i");
	//Point::Init(target, "Point", overload);
}

void PointInit::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Point2i::Init(target, "Point2i", overload);
	Point2f::Init(target, "Point2f", overload);
	Point2d::Init(target, "Point2d", overload);
	//Point::Init(target, "Point", overload);
}