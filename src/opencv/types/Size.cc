#include "Size.h"
#include "Size.imp.h"


namespace size_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("size_general_callback is empty");
		}
		return overload->execute("size", info);
	}
}


void SizeInit::Register(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Size2i::Register(target, "Size2i", overload);
	Size2f::Register(target, "Size2f", overload);
	Size2d::Register(target, "Size2d", overload);
	overload->add_type_alias("Size", Size_<cv::Size>::name);
	//Size::Init(target, "Size", overload);

}

void SizeInit::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Size2i::Init(target, "Size2i", overload);
	Size2f::Init(target, "Size2f", overload);
	Size2d::Init(target, "Size2d", overload);
	//Size::Init(target, "Size", overload);

}