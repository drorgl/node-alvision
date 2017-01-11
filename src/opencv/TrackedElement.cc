#include "TrackedElement.h"

namespace trackedelement_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(tracked_ptr_callback) {
		if (overload == nullptr) {
			throw std::exception("trackedelement_general_callback is empty");
		}
		return overload->execute("tracked_element", info);
	}
}

