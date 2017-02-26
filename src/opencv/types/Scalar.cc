#include "Scalar.h"

namespace scalar_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::runtime_error("scalar_general_callback is empty");
		}
		return overload->execute("scalar", info);
	}
}




void ScalarInit::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	Scalar_<cv::Scalar>::Init(target, "Scalar", overload);
}