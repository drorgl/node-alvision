#include "Rect.h"

void RectInit::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Rect2i::Init(target, "Rect2i", overload);
	Rect2f::Init(target, "Rect2f", overload);
	Rect2d::Init(target, "Rect2d", overload);
	Rect::Init(target, "Rect", overload);

}