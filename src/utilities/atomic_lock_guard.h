#ifndef _ALVISION_ATOMIC_LOCK_GUARD_H_
#define _ALVISION_ATOMIC_LOCK_GUARD_H_

#include <atomic>

class atomic_lock_guard {
private:
	std::atomic_flag &_lock;

public:
	atomic_lock_guard(std::atomic_flag &lock_);
	~atomic_lock_guard();
};

#endif