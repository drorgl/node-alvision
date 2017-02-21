
#include "Rect.imp.h"
#include "Rect.h"
namespace rect_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("rect_general_callback is empty");
		}
		return overload->execute("rect", info);
	}
}

void RectInit::Register(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Rect2i::Register(target, "Rect2i", overload);
	Rect2f::Register(target, "Rect2f", overload);
	Rect2d::Register(target, "Rect2d", overload);
	overload->add_type_alias("Rect", "Rect2i");

}


void RectInit::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Rect2i::Init(target, "Rect2i", overload);
	Rect2f::Init(target, "Rect2f", overload);
	Rect2d::Init(target, "Rect2d", overload);
}