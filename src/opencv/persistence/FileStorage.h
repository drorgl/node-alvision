#ifndef _ALVISION_FILESTORAGE_H_
#define _ALVISION_FILESTORAGE_H_

#include "../../alvision.h"


class FileStorage: public or::ObjectWrap {
public:
	static std::string name;
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	std::shared_ptr<cv::FileStorage> _fileStorage;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor();

	static POLY_METHOD(New					);
	static POLY_METHOD(New_source			);
	static POLY_METHOD(New_fs				);
	static POLY_METHOD(open					);
	static POLY_METHOD(isOpened				);
	static POLY_METHOD(release				);
	static POLY_METHOD(releaseAndGetString	);
	static POLY_METHOD(getFirstTopLevelNode	);
	static POLY_METHOD(root					);


	static NAN_GETTER(nodes_getter);
	static NAN_PROPERTY_GETTER(indexed_getter);
	static NAN_PROPERTY_SETTER(indexed_setter);


	static POLY_METHOD(write_int		 );
	static POLY_METHOD(write_float		 );
	static POLY_METHOD(write_double		 );
	static POLY_METHOD(write_string		 );
	static POLY_METHOD(write_Mat		 );
	static POLY_METHOD(write_SparseMat	 );
	static POLY_METHOD(write_KeyPoints	 );
	static POLY_METHOD(write_Dmatches	 );
	static POLY_METHOD(writeScalar_int	 );
	static POLY_METHOD(writeScalar_float );
	static POLY_METHOD(writeScalar_double);
	static POLY_METHOD(writeScalar_string);




};

#endif