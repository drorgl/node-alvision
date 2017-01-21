#ifndef _ALVISION_HIGHGUI_H_
#define _ALVISION_HIGHGUI_H_


#include "../alvision.h"



class highgui : public or::ObjectWrap {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);
	//static NAN_METHOD(destroyAllWindows);




	


	//interface MouseCallback {
	//	(event : MouseEventTypes, x : _st.int, y : _st.int, flags : MouseEventFlags, userdata : any) : void;
	//}
	//
	//interface TrackbarCallback {
	//	(pos : _st.int, userdata : any) : void;
	//}
	//
	//interface OpenGlDrawCallback {
	//	(userdata : any) : void;
	//}
	//
	//
	//interface ButtonCallback {
	//	(state : _st.int, userdata : any) : void;
	//}



	static POLY_METHOD(namedWindow);// : InamedWindow = alvision_module.namedWindow;
	
	static POLY_METHOD(destroyWindow);// : IdestroyWindow = alvision_module.destroyWindow;

	static POLY_METHOD(destroyAllWindows);// : IdestroyAllWindows = alvision_module.destroyAllWindows;

	static POLY_METHOD(startWindowThread);// : IstartWindowThread = alvision_module.startWindowThread;

	static POLY_METHOD(waitKey);// : IwaitKey = alvision_module.waitKey;

	static POLY_METHOD(resizeWindow);// : IresizeWindow = alvision_module.resizeWindow;

	static POLY_METHOD(moveWindow);// : ImoveWindow = alvision_module.moveWindow;

	static POLY_METHOD(setWindowProperty);// : IsetWindowProperty = alvision_module.setWindowProperty;
	
	static POLY_METHOD(setWindowTitle);// : IsetWindowTitle = alvision_module.setWindowTitle;
	
	static POLY_METHOD(getWindowProperty);// : IgetWindowProperty = alvision_module.getWindowProperty;

	static POLY_METHOD(setMouseCallback);// : IsetMouseCallback = alvision_module.setMouseCallback;
	
	static POLY_METHOD(getMouseWheelDelta);// : IgetMouseWheelDelta = alvision_module.getMouseWheelDelta;
	
	static POLY_METHOD(createTrackbar);// : IcreateTrackbar = alvision_module.createTrackbar;

	static POLY_METHOD(getTrackbarPos);// : IgetTrackbarPos = alvision_module.getTrackbarPos;

	static POLY_METHOD(setTrackbarPos);// : IsetTrackbarPos = alvision_module.setTrackbarPos;

	static POLY_METHOD(setTrackbarMax);// : IsetTrackbarMax = alvision_module.setTrackbarMax;
	
	static POLY_METHOD(setTrackbarMin);// : IsetTrackbarMin = alvision_module.setTrackbarMin;

	static POLY_METHOD(imshowTex);// : Iimshow = alvision_module.imshow;
	static POLY_METHOD(imshowMat);// : Iimshow = alvision_module.imshow;
	
	static POLY_METHOD(setOpenGlDrawCallback);// : IsetOpenGlDrawCallback = alvision_module.setOpenGlDrawCallback;

	static POLY_METHOD(setOpenGlContext);// : IsetOpenGlContext = alvision_module.setOpenGlContext;

	static POLY_METHOD(updateWindow);// : IupdateWindow = alvision_module.updateWindow;
	

//	class QtFont
//	{
//		//const char* nameFont;  //!< Name of the font
//		//Scalar      color;     //!< Color of the font. Scalar(blue_component, green_component, red_component[, alpha_component])
//		//int         font_face; //!< See cv::QtFontStyles
//		//const int*  ascii;     //!< font data and metrics
//		//const int*  greek;
//		//const int*  cyrillic;
//		//float       hscale, vscale;
//		//float       shear;     //!< slope coefficient: 0 - normal, >0 - italic
//		//int         thickness; //!< See cv::QtFontWeights
//		//float       dx;        //!< horizontal interval between letters
//		//int         line_type; //!< PointSize
//	};

	
	static POLY_METHOD(fontQt);// : IfontQt = alvision_module.fontQt;

	static POLY_METHOD(addText);// : IaddText = alvision_module.addText;
	
	static POLY_METHOD(displayOverlay);// : IdisplayOverlay = alvision_module.displayOverlay;
	
	static POLY_METHOD(displayStatusBar);// : IdisplayStatusBar = alvision_module.displayStatusBar;

	static POLY_METHOD(saveWindowParameters);// : IsaveWindowParameters = alvision_module.saveWindowParameters;

	static POLY_METHOD(loadWindowParameters);// : IloadWindowParameters = alvision_module.loadWindowParameters;

	//interface IstartLoop {
	//	(pt2Func : (argc: _st.int, argv : Array<string>) = > _st.int, argc: _st.int, argv : Array<string>) : _st.int;
	//}
	static POLY_METHOD(startLoop);// : IstartLoop = alvision_module.startLoop;

	static POLY_METHOD(stopLoop);// : IstopLoop = alvision_module.stopLoop;


	static POLY_METHOD(createButton);// : IcreateButton = alvision_module.createButton;

};


#endif