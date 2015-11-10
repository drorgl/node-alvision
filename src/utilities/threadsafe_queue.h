#ifndef _THREADSAFE_QUEUE_H_
#define _THREADSAFE_QUEUE_H_

#include <queue>
#include <atomic>

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
		while (_lock.test_and_set(std::memory_order_acquire));
		_queue.push(item);
		_lock.clear(std::memory_order_release);
	}
	bool dequeue(T &itemref)
	{
		bool val = false;
		while (_lock.test_and_set(std::memory_order_acquire));
		if (!_queue.empty()){
			T item = _queue.front();
			itemref = item;
			_queue.pop();
			val = true;
		}
		_lock.clear(std::memory_order_release);
		return val;
	}

};


#endif