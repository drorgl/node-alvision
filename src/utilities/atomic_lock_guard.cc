#include "atomic_lock_guard.h"


#include <chrono>
#include <thread>
#include <stdexcept>

atomic_lock_guard::atomic_lock_guard(std::atomic_flag &lock_) : _lock(lock_) {
		int counter = 0;
		while (_lock.test_and_set(std::memory_order_acquire)) {
			counter++;
			if (counter > 10 && counter < 100) {
				std::this_thread::yield();
			}else 
			if (counter > 100 && counter < 110) {
				std::this_thread::sleep_for(std::chrono::nanoseconds(1));
			}else 
			if (counter > 110 && counter < 120) {
				std::this_thread::sleep_for(std::chrono::microseconds(1));
			}else 
			if (counter > 120) {
				std::this_thread::sleep_for(std::chrono::milliseconds(1));
			}

			if (counter > 1000) {
				throw std::runtime_error("lock could not be obtained, something is wrong");
			}
		}
	}

atomic_lock_guard::~atomic_lock_guard() {
		_lock.clear(std::memory_order_release);
	}
