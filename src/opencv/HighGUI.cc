#include "HighGUI.h"
#include "Matrix.h"
#include "Point.h"

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

	//enum WindowFlags
	auto WindowFlags = CreateNamedObject(target, "WindowFlags");
	SetObjectProperty(WindowFlags, "WINDOW_NORMAL", (0x00000000));
	SetObjectProperty(WindowFlags, "WINDOW_AUTOSIZE", (0x00000001));
	SetObjectProperty(WindowFlags, "WINDOW_OPENGL", (0x00001000));
	SetObjectProperty(WindowFlags, "WINDOW_FULLSCREEN", (1));
	SetObjectProperty(WindowFlags, "WINDOW_FREERATIO", (0x00000100));
	SetObjectProperty(WindowFlags, "WINDOW_KEEPRATIO", (0x00000000));


	//enum WindowPropertyFlags
	auto WindowPropertyFlags = CreateNamedObject(target, "WindowPropertyFlags ");
	SetObjectProperty(WindowPropertyFlags, "WND_PROP_FULLSCREEN", (0));
	SetObjectProperty(WindowPropertyFlags, "WND_PROP_AUTOSIZE", (1));
	SetObjectProperty(WindowPropertyFlags, "WND_PROP_ASPECT_RATIO", (2));
	SetObjectProperty(WindowPropertyFlags, "WND_PROP_OPENGL", (3));


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


	//! Mouse Event Flags see cv::MouseCallback
	//enum MouseEventFlags {
	auto MouseEventFlags = CreateNamedObject(target, "MouseEventFlags ");
	SetObjectProperty(MouseEventFlags, "EVENT_FLAG_LBUTTON", (1));
	SetObjectProperty(MouseEventFlags, "EVENT_FLAG_RBUTTON", (2));
	SetObjectProperty(MouseEventFlags, "EVENT_FLAG_MBUTTON", (4));
	SetObjectProperty(MouseEventFlags, "EVENT_FLAG_CTRLKEY", (8));
	SetObjectProperty(MouseEventFlags, "EVENT_FLAG_SHIFTKEY", (16));
	SetObjectProperty(MouseEventFlags, "EVENT_FLAG_ALTKEY", (32));

	//! Qt font weight
	//enum QtFontWeights {
	auto QtFontWeights = CreateNamedObject(target, "QtFontWeights");
	SetObjectProperty(QtFontWeights, "QT_FONT_LIGHT", (25));
	SetObjectProperty(QtFontWeights, "QT_FONT_NORMAL", (50));
	SetObjectProperty(QtFontWeights, "QT_FONT_DEMIBOLD", (63));
	SetObjectProperty(QtFontWeights, "QT_FONT_BOLD", (75));
	SetObjectProperty(QtFontWeights, "QT_FONT_BLACK", (87));

	//! Qt font style
	//enum QtFontStyles {
	auto QtFontStyles = CreateNamedObject(target, "QtFontStyles");
	SetObjectProperty(QtFontStyles, "QT_STYLE_NORMAL", (0));
	SetObjectProperty(QtFontStyles, "QT_STYLE_ITALIC", (1));
	SetObjectProperty(QtFontStyles, "QT_STYLE_OBLIQUE", (2));

	//! Qt "button" type
	//enum QtButtonTypes {
	auto QtButtonTypes = CreateNamedObject(target, "QtButtonTypes ");
	SetObjectProperty(QtButtonTypes, "QT_PUSH_BUTTON", 0);
	SetObjectProperty(QtButtonTypes, "QT_CHECKBOX", 1);
	SetObjectProperty(QtButtonTypes, "QT_RADIOBOX", 2);


	overload->addStaticOverload("highgui", "", "namedWindow", { make_param<std::string>("winname","String"),make_param<int>("flags","int",cv::WINDOW_AUTOSIZE) }, highgui::namedWindow);
	Nan::SetMethod(target, "namedWindow", highgui_general_callback::callback);

	overload->addStaticOverload("highgui", "", "destroyWindow", { make_param<std::string>("winname","String") }, highgui::destroyWindow);
	Nan::SetMethod(target, "destroyWindow", highgui_general_callback::callback);


	overload->addStaticOverload("highgui", "", "destroyAllWindows", {}, highgui::destroyAllWindows);
	Nan::SetMethod(target, "destroyAllWindows", highgui_general_callback::callback);


	overload->addStaticOverload("highgui", "", "startWindowThread", {}, highgui::startWindowThread);
	Nan::SetMethod(target, "startWindowThread", highgui_general_callback::callback);


	overload->addStaticOverload("highgui", "", "waitKey", {make_param<>("delay","Number",0)}, highgui::waitKey);
	Nan::SetMethod(target, "waitKey", highgui_general_callback::callback);


	overload->addStaticOverload("highgui", "", "resizeWindow", { make_param<std::string>("winname","String"), make_param<int>("width","int"), make_param<int>("height","int") }, highgui::resizeWindow);
	Nan::SetMethod(target, "resizeWindow", highgui_general_callback::callback);


	overload->addStaticOverload("highgui", "", "moveWindow", { make_param<std::string>("winname","String"), make_param<int>("x","int"), make_param<int>("y","int") }, highgui::moveWindow);
	Nan::SetMethod(target, "moveWindow", highgui_general_callback::callback);

	overload->addStaticOverload("highgui", "", "setWindowProperty", { make_param<std::string>("winname","String"), make_param<int>("prop_id","int"), make_param<double>("prop_value","double") }, highgui::setWindowProperty);
	Nan::SetMethod(target, "setWindowProperty", highgui_general_callback::callback);


	overload->addStaticOverload("highgui", "", "setWindowTitle", { make_param<std::string>("winname","String"), make_param<std::string>("title","String")}, highgui::setWindowTitle);
	Nan::SetMethod(target, "setWindowTitle", highgui_general_callback::callback);


	overload->addStaticOverload("highgui", "", "getWindowProperty", { make_param<std::string>("winname","String"), make_param<int>("prop_id","int") }, highgui::getWindowProperty);
	Nan::SetMethod(target, "getWindowProperty", highgui_general_callback::callback);

	overload->addStaticOverload("highgui", "", "setMouseCallback", { make_param<std::string>("winname","String"), make_param("onMouse","Function"),make_param("userdata","Object",Nan::Null()) }, highgui::setMouseCallback);
	Nan::SetMethod(target, "setMouseCallback", highgui_general_callback::callback);

	overload->addStaticOverload("highgui", "", "getMouseWheelDelta", { make_param<int>("flags","int") }, highgui::getMouseWheelDelta);
	Nan::SetMethod(target, "getMouseWheelDelta", highgui_general_callback::callback);

	overload->addStaticOverload("highgui", "", "createTrackbar", { make_param<std::string>("trackbarname","String"),make_param<std::string>("winname","String"),
		make_param("count","Number"),make_param("onChange","Function", Nan::Null()),
		make_param("value","Number",0),make_param("userdata","Object",Nan::Null()) }, highgui::createTrackbar);
	Nan::SetMethod(target, "createTrackbar", highgui_general_callback::callback);

	overload->addStaticOverload("highgui", "", "getTrackbarPos", { make_param<std::string>("trackbarname","String"), make_param<std::string>("winname","String") }, highgui::getTrackbarPos);
	Nan::SetMethod(target, "getTrackbarPos", highgui_general_callback::callback);

	overload->addStaticOverload("highgui", "", "setTrackbarPos", { make_param<std::string>("trackbarname","String"), make_param<std::string>("winname","String"), make_param<int>("pos","int") }, highgui::setTrackbarPos);
	Nan::SetMethod(target, "setTrackbarPos", highgui_general_callback::callback);

	overload->addStaticOverload("highgui", "", "setTrackbarMax", { make_param<std::string>("trackbarname","String"), make_param<std::string>("winname","String"), make_param<int>("maxval","int") }, highgui::setTrackbarMax);
	Nan::SetMethod(target, "setTrackbarMax", highgui_general_callback::callback);

	overload->addStaticOverload("highgui", "", "setTrackbarMin", { make_param<std::string>("trackbarname","String"), make_param<std::string>("winname","String"), make_param<int>("minval","int") }, highgui::setTrackbarMin);
	Nan::SetMethod(target, "setTrackbarMin", highgui_general_callback::callback);


	overload->addStaticOverload("highgui", "", "imshow", { make_param<std::string>("winname","String"), make_param("tex","Texture2D") },  highgui::imshowTex);
	overload->addStaticOverload("highgui", "", "imshow", { make_param<std::string>("winname","String"), make_param("tex","InputArray") }, highgui::imshowMat);
	Nan::SetMethod(target, "imshow", highgui_general_callback::callback);


	overload->addStaticOverload("highgui", "", "setOpenGlDrawCallback", { make_param<std::string>("winname","String"), make_param("onOpenGlDraw","Function"), make_param("userdata","Object",Nan::Null()) }, highgui::setOpenGlDrawCallback);
	Nan::SetMethod(target, "setOpenGlDrawCallback", highgui_general_callback::callback);

	overload->addStaticOverload("highgui", "", "setOpenGlContext", { make_param<std::string>("winname","String") }, highgui::setOpenGlContext);
	Nan::SetMethod(target, "setOpenGlContext", highgui_general_callback::callback);

	overload->addStaticOverload("highgui", "", "updateWindow", { make_param<std::string>("winname","String") }, highgui::updateWindow);
	Nan::SetMethod(target, "updateWindow", highgui_general_callback::callback);

	overload->addStaticOverload("highgui", "", "fontQt", { 
		make_param<std::string>("nameFont","String"), 
		make_param<int>("pointSize","int",-1),
		make_param<Scalar*>("color",Scalar::name,Scalar::all(0)), 
		make_param<int>("weight","int",cv::QT_FONT_NORMAL),
		make_param<int>("style","int",cv::QT_STYLE_NORMAL), 
		make_param<int>("spacing","int",0) 
	}, highgui::fontQt);
	Nan::SetMethod(target, "fontQt", highgui_general_callback::callback);

	overload->addStaticOverload("highgui", "", "addText", { make_param<Matrix*>("img","Mat"),make_param<std::string>("text","String"),make_param<Point*>("org",Point::name),make_param("font","QtFont") }, highgui::addText);
	Nan::SetMethod(target, "addText", highgui_general_callback::callback);

	overload->addStaticOverload("highgui", "", "displayOverlay", { make_param<std::string>("winname","String"),make_param<std::string>("text","String"),make_param<>("delayms","Number",0)}, highgui::displayOverlay);
	Nan::SetMethod(target, "displayOverlay", highgui_general_callback::callback);

	overload->addStaticOverload("highgui", "", "displayStatusBar", { make_param<std::string>("winname","String"),make_param<std::string>("text","String"),make_param<>("delayms","Number",0) }, highgui::displayStatusBar);
	Nan::SetMethod(target, "displayStatusBar", highgui_general_callback::callback);

	overload->addStaticOverload("highgui", "", "saveWindowParameters", { make_param<std::string>("windowName","String") }, highgui::saveWindowParameters);
	Nan::SetMethod(target, "saveWindowParameters", highgui_general_callback::callback);

	overload->addStaticOverload("highgui", "", "loadWindowParameters", { make_param<std::string>("windowName","String") }, highgui::loadWindowParameters);
	Nan::SetMethod(target, "loadWindowParameters", highgui_general_callback::callback);

	overload->addStaticOverload("highgui", "", "startLoop", { make_param("pt2Func","Function") }, highgui::startLoop);
	Nan::SetMethod(target, "startLoop", highgui_general_callback::callback);

	overload->addStaticOverload("highgui", "", "stopLoop", {}, highgui::stopLoop);
	Nan::SetMethod(target, "stopLoop", highgui_general_callback::callback);

	overload->addStaticOverload("highgui", "", "createButton", {make_param<std::string>("bar_name","String"),make_param("on_change","Function"),
		make_param("userdata","Object",Nan::Null()),make_param<int>("type","int",cv::QT_PUSH_BUTTON),make_param<>("initial_button_state","Boolean",false) }, highgui::createButton);
	Nan::SetMethod(target, "createButton", highgui_general_callback::callback);

};


POLY_METHOD(highgui::namedWindow) {
	cv::namedWindow(*Nan::Utf8String(info[0]), info[1]->IntegerValue());
}

POLY_METHOD(highgui::destroyWindow) {
	cv::destroyWindow(*Nan::Utf8String(info[0]));
}

POLY_METHOD(highgui::destroyAllWindows) {
	cv::destroyAllWindows();
}

POLY_METHOD(highgui::startWindowThread) {
	auto retval = cv::startWindowThread();
	info.GetReturnValue().Set(retval);
}

POLY_METHOD(highgui::waitKey) {
	auto retval = cv::waitKey(info[0]->IntegerValue());
	info.GetReturnValue().Set(retval);
}

POLY_METHOD(highgui::resizeWindow) {
	cv::resizeWindow(*Nan::Utf8String(info[0]), info[1]->IntegerValue(), info[2]->IntegerValue());
}

POLY_METHOD(highgui::moveWindow) {
	cv::moveWindow(*Nan::Utf8String(info[0]), info[1]->IntegerValue(), info[2]->IntegerValue());
}

POLY_METHOD(highgui::setWindowProperty) {
	cv::setWindowProperty(*Nan::Utf8String(info[0]), info[1]->IntegerValue(), info[2]->NumberValue());
}

POLY_METHOD(highgui::setWindowTitle) {
	cv::setWindowTitle(*Nan::Utf8String(info[0]), *Nan::Utf8String(info[1]));
}

POLY_METHOD(highgui::getWindowProperty) {
	auto retval = cv::getWindowProperty(*Nan::Utf8String(info[0]), info[1]->IntegerValue());
	info.GetReturnValue().Set(retval);
}

POLY_METHOD(highgui::setMouseCallback) {
	return Nan::ThrowError("not implemented");
	//cv::setMouseCallback(*Nan::Utf8String(info[0]), ..., ...);
}

POLY_METHOD(highgui::getMouseWheelDelta){
	auto retval = cv::getMouseWheelDelta(info[0]->IntegerValue());
	info.GetReturnValue().Set(retval);
}

POLY_METHOD(highgui::createTrackbar) {
	int val;
	//auto retval = cv::createTrackbar(*Nan::Utf8String(info[0]),*Nan::Utf8String(info[1]),&val,)
	return Nan::ThrowError("not implemented");
}

POLY_METHOD(highgui::getTrackbarPos) {
	auto retval = cv::getTrackbarPos(*Nan::Utf8String(info[0]), *Nan::Utf8String(info[1]));
	info.GetReturnValue().Set(retval);
}

POLY_METHOD(highgui::setTrackbarPos) {
	cv::setTrackbarPos(*Nan::Utf8String(info[0]), *Nan::Utf8String(info[1]), info[2]->IntegerValue());
}

POLY_METHOD(highgui::setTrackbarMax) {
	cv::setTrackbarMax(*Nan::Utf8String(info[0]), *Nan::Utf8String(info[1]), info[2]->IntegerValue());
}

POLY_METHOD(highgui::setTrackbarMin) {
	cv::setTrackbarMin(*Nan::Utf8String(info[0]), *Nan::Utf8String(info[1]), info[2]->IntegerValue());
}

POLY_METHOD(highgui::imshowTex){
	return Nan::ThrowError("not implemented");
	//auto tex = info.at<Texture2D*>(1);
	//cv::imshow(*Nan::Utf8String(info[0]), tex._tex);
}

POLY_METHOD(highgui::imshowMat){
	return Nan::ThrowError("not implemented");
	//auto mat = info.at<Matrix*>(1);
	//auto winname = info.at<std::string>(0);
	//cv::imshow(winname, mat->_mat.get());
}


POLY_METHOD(highgui::setOpenGlDrawCallback) {
	return Nan::ThrowError("not implemented");
	//cv::setOpenGlDrawCallback(*Nan::Utf8String(info[0]), ..., ...);
}

POLY_METHOD(highgui::setOpenGlContext) {
	cv::setOpenGlContext(*Nan::Utf8String(info[0]));
}

POLY_METHOD(highgui::updateWindow) {
	cv::updateWindow(*Nan::Utf8String(info[0]));
}

POLY_METHOD(highgui::fontQt) {
	return Nan::ThrowError("not implemented");
	//auto color = Nan::ObjectWrap::Unwrap<Scalar>(info[2]);
	//auto retval = cv::fontQt(*Nan::Utf8String(info[0]), info[1]->IntegerValue(), color._scalar, info[3]->IntegerValue(), info[4]->IntegerValue(), info[5]->IntegerValue());
	//QtFont font(retval);
	//return font.Wrap();
}

POLY_METHOD(highgui::addText) {
	return Nan::ThrowError("not implemented");
	//interface IaddText {
	//	(img : _mat.Mat, text : string, org : _types.Point, font : QtFont) : void;
	//}
	//auto mat = Nan::ObjectWrap::Unwrap<Matrix>(info[0]);
	//auto point = Nan::ObjectWrap::Unwrap<Point>(info[2]);
	//auto qtfont= Nan::ObjectWrap::Unwrap<QtFont>(info[3]);
	//cv::addText(mat._mat, *Nan::Utf8String(info[1]), point._point, qtfont._qtfont);
}

POLY_METHOD(highgui::displayOverlay) {
	cv::displayOverlay(*Nan::Utf8String(info[0]), *Nan::Utf8String(info[1]), info[2]->IntegerValue());
}

POLY_METHOD(highgui::displayStatusBar) {
	cv::displayStatusBar(*Nan::Utf8String(info[0]), *Nan::Utf8String(info[1]), info[2]->IntegerValue());
}

POLY_METHOD(highgui::saveWindowParameters) {
	cv::saveWindowParameters(*Nan::Utf8String(info[0]));
}

POLY_METHOD(highgui::loadWindowParameters) {
	cv::loadWindowParameters(*Nan::Utf8String(info[0]));
}

POLY_METHOD(highgui::startLoop) {
	//cv::startLoop(...)

}

POLY_METHOD(highgui::stopLoop) {
	cv::stopLoop();
}

POLY_METHOD(highgui::createButton) {
	return Nan::ThrowError("not implemented");
	//auto retval = cv::createButton(*Nan::Utf8String(info[0]), ..., ..., info[3]->IntegerValue(), info[4]->BooleanValue());
	//info.GetReturnValue().Set(retval);
}

