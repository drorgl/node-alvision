#include "Point.h"

void PointInit::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Point2i::Init(target, "Point2i", overload);
	Point2f::Init(target, "Point2f", overload);
	Point2d::Init(target, "Point2d", overload);
	Point::Init(target, "Point", overload);
}