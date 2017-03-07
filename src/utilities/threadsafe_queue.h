#ifndef _THREADSAFE_QUEUE_H_
#define _THREADSAFE_QUEUE_H_

#include <queue>
#include <atomic>

#include "atomic_lock_guard.h"

template<typename T>
class threadsafe_queue
{
private:
	std::queue<T> _queue;
	std::atomic_flag _lock;// = ATOMIC_FLAG_INIT;

public:
	threadsafe_queue()
	{
		_lock.clear();
	}

	void enqueue(T item)
	{
		atomic_lock_guard lock(_lock);

		_queue.push(item);
	}
	bool dequeue(T &itemref)
	{
		bool val = false;
		
		atomic_lock_guard lock(_lock);

		if (!_queue.empty()){
			T item = _queue.front();
			itemref = item;
			_queue.pop();
			val = true;
		}
		

		return val;
	}

};


#endif