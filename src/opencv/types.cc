#include "types.h"
#include "types/Complex.h"
#include "types/Point.h"
#include "types/Point3.h"
#include "types/Size.h"
#include "types/Rect.h"
#include "types/RotatedRect.h"
#include "types/Range.h"
#include "types/Scalar.h"
#include "types/KeyPoint.h"
#include "types/DMatch.h"
#include "types/TermCriteria.h"
#include "types/Moments.h"

namespace types_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("types_general_callback is empty");
		}
		return overload->execute("types", info);
	}
}



void
types::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	types_general_callback::overload = overload;


	Complexd::Init(target, "Complexd", overload);
	Complexf::Init(target, "Complexf", overload);
	
	PointInit::Register(target, overload);
	SizeInit::Register(target, overload);
	RectInit::Init(target, overload);

	PointInit::Init(target, overload);

	Point3Init::Init(target, overload);

	SizeInit::Init(target, overload);

	

	RotatedRect::Init(target, overload);

	Range::Init(target, "Range", overload);

	ScalarInit::Init(target, overload);

	KeyPoint::Init(target, overload);

	DMatch::Init(target, overload);

	TermCriteria::Init(target, overload);

	Moments::Init(target, overload);

	auto ShapeMatchModes = CreateNamedObject(target, "ShapeMatchModes");
	SetObjectProperty(ShapeMatchModes, "CV_CONTOURS_MATCH_I1", 1);
	SetObjectProperty(ShapeMatchModes, "CV_CONTOURS_MATCH_I2", 2);
	SetObjectProperty(ShapeMatchModes, "CV_CONTOURS_MATCH_I3", 3);
	overload->add_type_alias("ShapeMatchModes", "int");


}