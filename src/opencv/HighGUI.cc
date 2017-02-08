#include "HighGUI.h"

#include "types/Scalar.h"
#include "Matrix.h"
#include "types/Point.h"
#include "HighGUI/QtFont.h"
#include "core/opengl/Texture2D.h"

namespace highgui_general_callback {
	std::shared_ptr<overload_resolution> overload;
	NAN_METHOD(callback) {
		if (overload == nullptr) {
			throw std::exception("highgui_general_callback is empty");
		}
		return overload->execute("highgui", info);
	}
}

void
highgui::Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload) {
	highgui_general_callback::overload = overload;

	QtFont::Init(target, overload);

	//enum WindowFlags
	auto WindowFlags = CreateNamedObject(target, "WindowFlags");
	SetObjectProperty(WindowFlags, "WINDOW_NORMAL", (0x00000000));
	SetObjectProperty(WindowFlags, "WINDOW_AUTOSIZE", (0x00000001));
	SetObjectProperty(WindowFlags, "WINDOW_OPENGL", (0x00001000));
	SetObjectProperty(WindowFlags, "WINDOW_FULLSCREEN", (1));
	SetObjectProperty(WindowFlags, "WINDOW_FREERATIO", (0x00000100));
	SetObjectProperty(WindowFlags, "WINDOW_KEEPRATIO", (0x00000000));
	overload->add_type_alias("WindowFlags", "int");


	//enum WindowPropertyFlags
	auto WindowPropertyFlags = CreateNamedObject(target, "WindowPropertyFlags");
	SetObjectProperty(WindowPropertyFlags, "WND_PROP_FULLSCREEN", (0));
	SetObjectProperty(WindowPropertyFlags, "WND_PROP_AUTOSIZE", (1));
	SetObjectProperty(WindowPropertyFlags, "WND_PROP_ASPECT_RATIO", (2));
	SetObjectProperty(WindowPropertyFlags, "WND_PROP_OPENGL", (3));
	overload->add_type_alias("WindowPropertyFlags", "int");


	//enum MouseEventTypes {
	auto MouseEventTypes = CreateNamedObject(target, "MouseEventTypes");
	SetObjectProperty(MouseEventTypes, "EVENT_MOUSEMOVE", (0));
	SetObjectProperty(MouseEventTypes, "EVENT_LBUTTONDOWN", (1));
	SetObjectProperty(MouseEventTypes, "EVENT_RBUTTONDOWN", (2));
	SetObjectProperty(MouseEventTypes, "EVENT_MBUTTONDOWN", (3));
	SetObjectProperty(MouseEventTypes, "EVENT_LBUTTONUP", (4));
	SetObjectProperty(MouseEventTypes, "EVENT_RBUTTONUP", (5));
	SetObjectProperty(MouseEventTypes, "EVENT_MBUTTONUP", (6));
	SetObjectProperty(MouseEventTypes, "EVENT_LBUTTONDBLCLK", (7));
	SetObjectProperty(MouseEventTypes, "EVENT_RBUTTONDBLCLK", (8));
	SetObjectProperty(MouseEventTypes, "EVENT_MBUTTONDBLCLK", (9));
	SetObjectProperty(MouseEventTypes, "EVENT_MOUSEWHEEL", (10));
	SetObjectProperty(MouseEventTypes, "EVENT_MOUSEHWHEEL", (11));
	overload->add_type_alias("MouseEventTypes", "int");


	//! Mouse Event Flags see cv::MouseCallback
	//enum MouseEventFlags {
	auto MouseEventFlags = CreateNamedObject(target, "MouseEventFlags");
	SetObjectProperty(MouseEventFlags, "EVENT_FLAG_LBUTTON", (1));
	SetObjectProperty(MouseEventFlags, "EVENT_FLAG_RBUTTON", (2));
	SetObjectProperty(MouseEventFlags, "EVENT_FLAG_MBUTTON", (4));
	SetObjectProperty(MouseEventFlags, "EVENT_FLAG_CTRLKEY", (8));
	SetObjectProperty(MouseEventFlags, "EVENT_FLAG_SHIFTKEY", (16));
	SetObjectProperty(MouseEventFlags, "EVENT_FLAG_ALTKEY", (32));
	overload->add_type_alias("MouseEventFlags", "int");

	//! Qt font weight
	//enum QtFontWeights {
	auto QtFontWeights = CreateNamedObject(target, "QtFontWeights");
	SetObjectProperty(QtFontWeights, "QT_FONT_LIGHT", (25));
	SetObjectProperty(QtFontWeights, "QT_FONT_NORMAL", (50));
	SetObjectProperty(QtFontWeights, "QT_FONT_DEMIBOLD", (63));
	SetObjectProperty(QtFontWeights, "QT_FONT_BOLD", (75));
	SetObjectProperty(QtFontWeights, "QT_FONT_BLACK", (87));
	overload->add_type_alias("QtFontWeights", "int");

	//! Qt font style
	//enum QtFontStyles {
	auto QtFontStyles = CreateNamedObject(target, "QtFontStyles");
	SetObjectProperty(QtFontStyles, "QT_STYLE_NORMAL", (0));
	SetObjectProperty(QtFontStyles, "QT_STYLE_ITALIC", (1));
	SetObjectProperty(QtFontStyles, "QT_STYLE_OBLIQUE", (2));
	overload->add_type_alias("QtFontStyles", "int");

	//! Qt "button" type
	//enum QtButtonTypes {
	auto QtButtonTypes = CreateNamedObject(target, "QtButtonTypes");
	SetObjectProperty(QtButtonTypes, "QT_PUSH_BUTTON", 0);
	SetObjectProperty(QtButtonTypes, "QT_CHECKBOX", 1);
	SetObjectProperty(QtButtonTypes, "QT_RADIOBOX", 2);
	overload->add_type_alias("QtButtonTypes", "int");


	overload->addOverload("highgui", "", "namedWindow", { 
		make_param<std::string>("winname","String"),
		make_param<int>("flags","WindowFlags",cv::WINDOW_AUTOSIZE) 
	}, highgui::namedWindow);
	Nan::SetMethod(target, "namedWindow", highgui_general_callback::callback);

	overload->addOverload("highgui", "", "destroyWindow", { 
		make_param<std::string>("winname","String")
	}, highgui::destroyWindow);
	Nan::SetMethod(target, "destroyWindow", highgui_general_callback::callback);


	overload->addOverload("highgui", "", "destroyAllWindows", {}, highgui::destroyAllWindows);
	Nan::SetMethod(target, "destroyAllWindows", highgui_general_callback::callback);


	overload->addOverload("highgui", "", "startWindowThread", {}, highgui::startWindowThread);
	Nan::SetMethod(target, "startWindowThread", highgui_general_callback::callback);


	overload->addOverload("highgui", "", "waitKey", {
		make_param<int>("delay","int",0)
	}, highgui::waitKey);
	Nan::SetMethod(target, "waitKey", highgui_general_callback::callback);


	overload->addOverload("highgui", "", "resizeWindow", { 
		make_param<std::string>("winname","String"), 
		make_param<int>("width","int"), 
		make_param<int>("height","int")
	}, highgui::resizeWindow);
	Nan::SetMethod(target, "resizeWindow", highgui_general_callback::callback);


	overload->addOverload("highgui", "", "moveWindow", { 
		make_param<std::string>("winname","String"),
		make_param<int>("x","int"), 
		make_param<int>("y","int") 
	}, highgui::moveWindow);
	Nan::SetMethod(target, "moveWindow", highgui_general_callback::callback);

	overload->addOverload("highgui", "", "setWindowProperty", {
		make_param<std::string>("winname","String"),
		make_param<int>("prop_id","int"), 
		make_param<double>("prop_value","double")
	}, highgui::setWindowProperty);
	Nan::SetMethod(target, "setWindowProperty", highgui_general_callback::callback);


	overload->addOverload("highgui", "", "setWindowTitle", { 
		make_param<std::string>("winname","String"),
		make_param<std::string>("title","String")
	}, highgui::setWindowTitle);
	Nan::SetMethod(target, "setWindowTitle", highgui_general_callback::callback);


	overload->addOverload("highgui", "", "getWindowProperty", { 
		make_param<std::string>("winname","String"), 
		make_param<int>("prop_id","int") 
	}, highgui::getWindowProperty);
	Nan::SetMethod(target, "getWindowProperty", highgui_general_callback::callback);

	overload->addOverload("highgui", "", "setMouseCallback", { 
		make_param<std::string>("winname","String"), 
		make_param<std::shared_ptr<or::Callback>>("onMouse","Function"),
		make_param("userdata","Object",Nan::Null())
	}, highgui::setMouseCallback);
	Nan::SetMethod(target, "setMouseCallback", highgui_general_callback::callback);

	overload->addOverload("highgui", "", "getMouseWheelDelta", { 
		make_param<int>("flags","int") 
	}, highgui::getMouseWheelDelta);
	Nan::SetMethod(target, "getMouseWheelDelta", highgui_general_callback::callback);

	overload->addOverload("highgui", "", "createTrackbar", { 
		make_param<std::string>("trackbarname","String"),
		make_param<std::string>("winname","String"),
		make_param<int>("count","int"),
		make_param<std::shared_ptr<or::Callback>>("onChange","Function", nullptr),
		make_param<int>("value","int",0),
		make_param("userdata","Object",Nan::Null()) 
	}, highgui::createTrackbar);
	Nan::SetMethod(target, "createTrackbar", highgui_general_callback::callback);

	overload->addOverload("highgui", "", "getTrackbarPos", { 
		make_param<std::string>("trackbarname","String"),
		make_param<std::string>("winname","String")
	}, highgui::getTrackbarPos);
	Nan::SetMethod(target, "getTrackbarPos", highgui_general_callback::callback);

	overload->addOverload("highgui", "", "setTrackbarPos", { 
		make_param<std::string>("trackbarname","String"), 
		make_param<std::string>("winname","String"), 
		make_param<int>("pos","int")
	}, highgui::setTrackbarPos);
	Nan::SetMethod(target, "setTrackbarPos", highgui_general_callback::callback);

	overload->addOverload("highgui", "", "setTrackbarMax", { 
		make_param<std::string>("trackbarname","String"), 
		make_param<std::string>("winname","String"), 
		make_param<int>("maxval","int")
	}, highgui::setTrackbarMax);
	Nan::SetMethod(target, "setTrackbarMax", highgui_general_callback::callback);

	overload->addOverload("highgui", "", "setTrackbarMin", { 
		make_param<std::string>("trackbarname","String"),
		make_param<std::string>("winname","String"), 
		make_param<int>("minval","int") 
	}, highgui::setTrackbarMin);
	Nan::SetMethod(target, "setTrackbarMin", highgui_general_callback::callback);


	overload->addOverload("highgui", "", "imshow", { 
		make_param<std::string>("winname","String"),
		make_param<Texture2D*>("tex","Texture2D") 
	},  highgui::imshowTex);

	overload->addOverload("highgui", "", "imshow", {
		make_param<std::string>("winname","String"),
		make_param<IOArray*>("mat","IOArray") 
	}, highgui::imshowMat);
	Nan::SetMethod(target, "imshow", highgui_general_callback::callback);


	overload->addOverload("highgui", "", "setOpenGlDrawCallback", {
		make_param<std::string>("winname","String"), 
		make_param<std::shared_ptr<or::Callback>>("onOpenGlDraw","Function"), 
		make_param("userdata","Object",Nan::Null())
	}, highgui::setOpenGlDrawCallback);
	Nan::SetMethod(target, "setOpenGlDrawCallback", highgui_general_callback::callback);

	overload->addOverload("highgui", "", "setOpenGlContext", { 
		make_param<std::string>("winname","String") 
	}, highgui::setOpenGlContext);
	Nan::SetMethod(target, "setOpenGlContext", highgui_general_callback::callback);

	overload->addOverload("highgui", "", "updateWindow", { 
		make_param<std::string>("winname","String")
	}, highgui::updateWindow);
	Nan::SetMethod(target, "updateWindow", highgui_general_callback::callback);

	overload->addOverload("highgui", "", "fontQt", { 
		make_param<std::string>("nameFont","String"), 
		make_param<int>("pointSize","int",-1),
		make_param<Scalar*>("color",Scalar::name,Scalar::all(0)), 
		make_param<int>("weight","int",cv::QT_FONT_NORMAL),
		make_param<int>("style","int",cv::QT_STYLE_NORMAL), 
		make_param<int>("spacing","int",0) 
	}, highgui::fontQt);
	Nan::SetMethod(target, "fontQt", highgui_general_callback::callback);

	overload->addOverload("highgui", "", "addText", {
		make_param<Matrix*>("img","Mat"),
		make_param<std::string>("text","String"),
		make_param<Point*>("org",Point::name),
		make_param<QtFont*>("font","QtFont") }, highgui::addText);
	Nan::SetMethod(target, "addText", highgui_general_callback::callback);

	overload->addOverload("highgui", "", "displayOverlay", { 
		make_param<std::string>("winname","String"),
		make_param<std::string>("text","String"),
		make_param<int>("delayms","int",0)
	}, highgui::displayOverlay);
	Nan::SetMethod(target, "displayOverlay", highgui_general_callback::callback);

	overload->addOverload("highgui", "", "displayStatusBar", { 
		make_param<std::string>("winname","String"),
		make_param<std::string>("text","String"),
		make_param<int>("delayms","int",0) 
	}, highgui::displayStatusBar);
	Nan::SetMethod(target, "displayStatusBar", highgui_general_callback::callback);

	overload->addOverload("highgui", "", "saveWindowParameters", { 
		make_param<std::string>("windowName","String") 
	}, highgui::saveWindowParameters);
	Nan::SetMethod(target, "saveWindowParameters", highgui_general_callback::callback);

	overload->addOverload("highgui", "", "loadWindowParameters", { 
		make_param<std::string>("windowName","String") 
	}, highgui::loadWindowParameters);
	Nan::SetMethod(target, "loadWindowParameters", highgui_general_callback::callback);

	overload->addOverload("highgui", "", "startLoop", { 
		make_param<std::shared_ptr<or::Callback>>("pt2Func","Function")
	}, highgui::startLoop);
	Nan::SetMethod(target, "startLoop", highgui_general_callback::callback);

	overload->addOverload("highgui", "", "stopLoop", {}, highgui::stopLoop);
	Nan::SetMethod(target, "stopLoop", highgui_general_callback::callback);

	overload->addOverload("highgui", "", "createButton", {
		make_param<std::string>("bar_name","String"),
		make_param<std::shared_ptr<or::Callback>>("on_change","Function"),
		make_param("userdata","Object",Nan::Null()),
		make_param<int>("type","int",cv::QT_PUSH_BUTTON),
		make_param<bool>("initial_button_state","bool",false)
	}, highgui::createButton);
	Nan::SetMethod(target, "createButton", highgui_general_callback::callback);

};


POLY_METHOD(highgui::namedWindow) {
	cv::namedWindow(info.at<std::string>(0), info.at<int>(1));
}

POLY_METHOD(highgui::destroyWindow) {
	cv::destroyWindow(info.at<std::string>(0));
}

POLY_METHOD(highgui::destroyAllWindows) {
	cv::destroyAllWindows();
}

POLY_METHOD(highgui::startWindowThread) {
	auto retval = cv::startWindowThread();
	info.GetReturnValue().Set(retval);
}

POLY_METHOD(highgui::waitKey) {
	auto retval = cv::waitKey(info.at<int>(0));
	info.GetReturnValue().Set(retval);
}

POLY_METHOD(highgui::resizeWindow) {
	cv::resizeWindow(info.at<std::string>(0), info.at<int>(1), info.at<int>(2));
}

POLY_METHOD(highgui::moveWindow) {
	cv::moveWindow(info.at<std::string>(0), info.at<int>(1), info.at<int>(2));
}

POLY_METHOD(highgui::setWindowProperty) {
	cv::setWindowProperty(info.at<std::string>(0), info.at<int>(1), info.at<double>(2));
}

POLY_METHOD(highgui::setWindowTitle) {
	cv::setWindowTitle(info.at<std::string>(0), info.at<std::string>(1));
}

POLY_METHOD(highgui::getWindowProperty) {
	auto retval = cv::getWindowProperty(info.at<std::string>(0), info.at<int>(1));
	info.GetReturnValue().Set(retval);
}

POLY_METHOD(highgui::setMouseCallback) {
	return Nan::ThrowError("not implemented");
	//cv::setMouseCallback(info.at<std::string>(0), ..., ...);
}

POLY_METHOD(highgui::getMouseWheelDelta){
	auto retval = cv::getMouseWheelDelta(info.at<int>(0));
	info.GetReturnValue().Set(retval);
}

POLY_METHOD(highgui::createTrackbar) {
	int val;
	//auto retval = cv::createTrackbar(info.at<std::string>(0),info.at<std::string>(1),&val,)
	return Nan::ThrowError("not implemented");
}

POLY_METHOD(highgui::getTrackbarPos) {
	auto retval = cv::getTrackbarPos(info.at<std::string>(0), info.at<std::string>(1));
	info.GetReturnValue().Set(retval);
}

POLY_METHOD(highgui::setTrackbarPos) {
	cv::setTrackbarPos(info.at<std::string>(0), info.at<std::string>(1), info.at<int>(2));
}

POLY_METHOD(highgui::setTrackbarMax) {
	cv::setTrackbarMax(info.at<std::string>(0), info.at<std::string>(1), info.at<int>(2));
}

POLY_METHOD(highgui::setTrackbarMin) {
	cv::setTrackbarMin(info.at<std::string>(0), info.at<std::string>(1), info.at<int>(2));
}

POLY_METHOD(highgui::imshowTex){
	auto winname = info.at<std::string>(0);
	auto tex = info.at<Texture2D*>(1);
	cv::imshow(info.at<std::string>(0), *tex->_texture2d);
}

POLY_METHOD(highgui::imshowMat){
	auto winname = info.at<std::string>(0);
	auto mat = info.at<IOArray*>(1)->GetInputArray();
	cv::imshow(info.at<std::string>(0), mat);
}


POLY_METHOD(highgui::setOpenGlDrawCallback) {
	return Nan::ThrowError("not implemented");
	//cv::setOpenGlDrawCallback(info.at<std::string>(0), ..., ...);
}

POLY_METHOD(highgui::setOpenGlContext) {
	cv::setOpenGlContext(info.at<std::string>(0));
}

POLY_METHOD(highgui::updateWindow) {
	cv::updateWindow(info.at<std::string>(0));
}

POLY_METHOD(highgui::fontQt) {
	auto nameFont	= info.at<std::string>(0);
	auto pointSize	= info.at<int>(1);
	auto color		= info.at<Scalar*>(2)->_scalar;
	auto weight		= info.at<int>(3);
	auto style		= info.at<int>(4);
	auto spacing	= info.at<int>(5);

	auto font = new QtFont();
	font->_qtfont = std::make_shared<cv::QtFont>(cv::fontQt(nameFont, pointSize, *color, weight, style, spacing));
	info.SetReturnValue(font);
}

POLY_METHOD(highgui::addText) {
	auto img	= info.at<Matrix*>(0)->_mat;
	auto text	= info.at<std::string>(1);
	auto org	= info.at<Point*>(2)->_point;
	auto font	= info.at<QtFont*>(3)->_qtfont;

	cv::addText(*img, text, *org, *font);
}

POLY_METHOD(highgui::displayOverlay) {
	cv::displayOverlay(info.at<std::string>(0), info.at<std::string>(1), info.at<int>(2));
}

POLY_METHOD(highgui::displayStatusBar) {
	cv::displayStatusBar(info.at<std::string>(0), info.at<std::string>(1), info.at<int>(2));
}

POLY_METHOD(highgui::saveWindowParameters) {
	cv::saveWindowParameters(info.at<std::string>(0));
}

POLY_METHOD(highgui::loadWindowParameters) {
	cv::loadWindowParameters(info.at<std::string>(0));
}

POLY_METHOD(highgui::startLoop) {
	throw std::exception("not implemented");
}

POLY_METHOD(highgui::stopLoop) {
	cv::stopLoop();
}

POLY_METHOD(highgui::createButton) {
	//auto bar_name				= info.at<std::string>(0);
	//auto on_change				= info.at<std::shared_ptr<or::Callback>>(1);
	//auto userData				= info.at<????>(2);
	//auto type					= info.at<int>(3);
	//auto initial_button_state	= info.at<bool>(4);
	//
	//auto ret = cv::createButton(bar_name, on_change, userData, type, initial_button_state);
	//info.SetReturnValue(ret);

	throw std::exception("not implemented");
}

