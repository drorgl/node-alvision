#include "uvasync.h"

std::unordered_set<uv_async_t*> uvasync::_inuseasyncs;

uvasync::uvasync(uv_async_cb callback)
{
	_is_active = false;
	_async_inst = new uv_async_t();
	uv_async_init(uv_default_loop(), _async_inst, callback);

	uv_unref(reinterpret_cast<uv_handle_t*>(_async_inst));

	_is_active = true;
}

bool uvasync::isActive(){
	if (_is_active == false){
		return false;
	}
	return (uv_is_active((uv_handle_t*)_async_inst) == 1);
}

void uvasync::signal(){
	if (_is_active == true){
		uv_async_send(_async_inst);
	}
}

uvasync::~uvasync(){
	_is_active = false;
	uv_close(reinterpret_cast<uv_handle_t*>(_async_inst), close_handler);
}

void uvasync::close_handler(uv_handle_t* handle)
{
	_inuseasyncs.erase((uv_async_t*)handle);
	delete (uv_async_t*)handle;
}

