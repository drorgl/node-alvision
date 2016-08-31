//TODO: pending

//import tape = require("tape");
//import path = require("path");
//import colors = require("colors");
//import async = require("async");
//import alvision = require("../../../tsbinding/alvision");
//import util = require('util');
//import fs = require('fs');

////#include "test_precomp.hpp"
////
////using namespace cv;
////using namespace std;

///**
// * @function main
// */
//function tutorial3(camera_pov : boolean) : void
//{
//    /// Create a window
//    var myWindow = new alvision.viz.Viz3d("Coordinate Frame");

//    /// Add coordinate axes
//    myWindow.showWidget("Coordinate Widget", viz::WCoordinateSystem());

//    /// Let's assume camera has the following properties
//    var cam_origin = new alvision.Point3d(3.0, 3.0, 3.0), cam_focal_point = new alvision.Point3d(3.0, 3.0, 2.0), cam_y_dir = new alvision.Point3d(-1.0, 0.0, 0.0);

//    /// We can get the pose of the cam using makeCameraPose
//    var camera_pose = alvision.viz.makeCameraPose(cam_origin, cam_focal_point, cam_y_dir);

//    /// We can get the transformation matrix from camera coordinate system to global using
//    /// - makeTransformToGlobal. We need the axes of the camera
//    var transform = alvision.viz.makeTransformToGlobal(new alvision.Vecd(0.0, -1.0, 0.0), new alvision.Vecd(-1.0, 0.0, 0.0), new alvision.Vecd(0.0, 0.0, -1.0), cam_origin);

//    /// Create a cloud widget.
//    var dragon_cloud = alvisino.viz.readCloud(get_dragon_ply_file_path());
//    viz::WCloud cloud_widget(dragon_cloud, viz::Color::green());

//    /// Pose of the widget in camera frame
//    Affine3d cloud_pose = Affine3d().rotate(Vec3d(0.0, Math.PI/2, 0.0)).rotate(Vec3d(0.0, 0.0, Math.PI)).translate(Vec3d(0.0, 0.0, 3.0));
//    /// Pose of the widget in global frame
//    Affine3d cloud_pose_global = transform * cloud_pose;

//    /// Visualize camera frame
//    myWindow.showWidget("CPW_FRUSTUM", viz::WCameraPosition(Vec2f(0.889484f, 0.523599f)), camera_pose);
//    if (!camera_pov)
//        myWindow.showWidget("CPW", viz::WCameraPosition(0.5), camera_pose);

//    /// Visualize widget
//    myWindow.showWidget("bunny", cloud_widget, cloud_pose_global);

//    /// Set the viewer pose to that of camera
//    if (camera_pov)
//        myWindow.setViewerPose(camera_pose);

//    /// Start event loop.
//    myWindow.spin();
//}

//alvision.cvtest.TEST('Viz', 'tutorial3_global_view', () => {
//    tutorial3(false);
//});

//alvision.cvtest.TEST('Viz', 'tutorial3_camera_view', () => {
//    tutorial3(true);
//});
