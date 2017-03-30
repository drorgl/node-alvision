#ifndef _THREADSAFE_UNORDERED_MAP_H_
#define _THREADSAFE_UNORDERED_MAP_H_

#include <unordered_map>
#include <atomic>

#include "atomic_lock_guard.h"

template<typename K, typename T>
class threadsafe_unordered_map
{
private:
	std::unordered_map<K, T> _unordered_map;
	std::atomic_flag _lock;// = ATOMIC_FLAG_INIT;

public:
	threadsafe_unordered_map()
	{
		_lock.clear();
	}

	void set(K key, T value) {
		atomic_lock_guard lock(_lock);
		_unordered_map[key] = value;
	}

	bool get(K key, T &value) {
		atomic_lock_guard lock(_lock);

		auto res = _unordered_map.find(key);

		if (res == std::end(_unordered_map)) {
			return false;
		}
		value = res->second;
		return true;
	}

	void remove(K key) {
		atomic_lock_guard lock(_lock);

		_unordered_map.erase(key);
	}

	void clear() {
		atomic_lock_guard lock(_lock);
		_unordered_map.clear();
	}

};


#endif