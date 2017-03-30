#include "TrackedElement.h"

namespace trackedelement_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(tracked_ptr_callback) {
		if (overload == nullptr) {
			throw std::runtime_error("trackedelement_general_callback is empty");
		}
		return overload->execute("tracked_element", info);
	}
}

