#ifndef _ALVISION_VALUE_ADAPTERS_H_
#define _ALVISION_VALUE_ADAPTERS_H_

#include "../../alvision.h"
#include "../Vec.h"
#include "../Matrix.h"

template <typename TAL, typename TCV>
class value_adapter {
public:
	static TCV* from(TAL value) {
		return &value;
	}
};


template <typename T>
class value_adapter<Vec<T>*,T> {
public:
	static T* from(Vec<T>* value) {
		return value->_vec.get();
	}
};



#endif