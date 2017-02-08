

{
	'target_defaults': {

		'configurations': {
			'Debug' : {
				
				'conditions':[
					['1==1',{
						'msvs_settings': {
							# This magical incantation is necessary because VC++ will compile
							# object files to same directory... even if they have the same name!
							'VCCLCompilerTool': {
							  'WholeProgramOptimization' : 'false',
							  #'AdditionalOptions': ['/w'], #['/wd4244' ,'/wd4018','/wd4133' ,'/wd4090'] #GL- was added because the forced optimization coming from node-gyp is disturbing the weird coding style from ffmpeg
							  'RuntimeLibrary': 3, # dll debug
							  'ExceptionHandling' : 1 #/EHsc
							},
							'VCLinkerTool': {
							  'LinkTimeCodeGeneration': '0',
							},
							
							'VCLibrarianTool': {
								'AdditionalOptions!': ['/LTCG'],
								'AdditionalOptions': ['/LTCG'],
							 },
						}
				}]
				]
			},
			'Release' : {
				'conditions':[
					['1==1',{
						'msvs_settings': {
							# This magical incantation is necessary because VC++ will compile
							# object files to same directory... even if they have the same name!
							'VCCLCompilerTool': {
							  'WholeProgramOptimization' : 'false',
							   #'AdditionalOptions': ['/w'], #['/wd4244' ,'/wd4018','/wd4133' ,'/wd4090'] #GL- was added because the forced optimization coming from node-gyp is disturbing the weird coding style from ffmpeg
							  'RuntimeLibrary': 2, # dll release
							  'ExceptionHandling' : 1 #/EHsc
							},
							'VCLinkerTool': {
							  'LinkTimeCodeGeneration': '0',
							},
							
							'VCLibrarianTool': {
								'AdditionalOptions!': ['/LTCG'],
								'AdditionalOptions': ['/LTCG'],
							 },
						}
				}]
				]
			},
		}
	},

  "targets": [{
      "target_name": "alvision"
	  
      , "sources": [
		  "todo.txt"
		, "binding.gyp"
		, "test/ffmpeg.ts"
		, "test/opencv.ts"
		, "test/tmp.ts"
        , "src/init.cc"
		, "src/alvision.h"
		, "src/safecast.h"
		
		, "src/opencv/array_accessors/array_accessor_base.h"
		, "src/opencv/array_accessors/Matrix_array_accessor.h"
		, "src/opencv/array_accessors/Matrix_array_accessor.cc"
		, "src/opencv/array_accessors/Matx_array_accessor.h"
		, "src/opencv/array_accessors/Vec_array_accessor.h"
		, "src/opencv/array_accessors/value_adapters.h"
		
		, "src/opencv/imgproc.cc"
		, "src/opencv/imgproc.h"

		, "src/opencv/imgproc/CLAHE.cc"
		, "src/opencv/imgproc/CLAHE.h"
		, "src/opencv/imgproc/GeneralizedHough.cc"
		, "src/opencv/imgproc/GeneralizedHough.h"
		, "src/opencv/imgproc/GeneralizedHoughBallard.cc"
		, "src/opencv/imgproc/GeneralizedHoughBallard.h"
		, "src/opencv/imgproc/GeneralizedHoughGuil.cc"
		, "src/opencv/imgproc/GeneralizedHoughGuil.h"
		, "src/opencv/imgproc/LineIterator.cc"
		, "src/opencv/imgproc/LineIterator.h"
		, "src/opencv/imgproc/LineSegmentDetector.cc"
		, "src/opencv/imgproc/LineSegmentDetector.h"
		, "src/opencv/imgproc/Subdiv2D.cc"
		, "src/opencv/imgproc/Subdiv2D.h"
		
		
		, "src/opencv/shape.cc"
		, "src/opencv/shape.h"
		
		, "src/opencv/video.cc"
		, "src/opencv/video.h"
		
		, "src/opencv/persistence.cc"
		, "src/opencv/persistence.h"
		, "src/opencv/persistence/FileStorage.cc"
		, "src/opencv/persistence/FileStorage.h"
		, "src/opencv/persistence/FileNode.cc"
		, "src/opencv/persistence/FileNode.h"
		
		, "src/opencv/videoio.cc"
		, "src/opencv/videoio.h"
		, "src/opencv/videoio/VideoWriter.cc"
		, "src/opencv/videoio/VideoWriter.h"
		, "src/opencv/videoio/VideoCapture.cc"
		, "src/opencv/videoio/VideoCapture.h"
		
		, "src/opencv/Mat_.cc"
		, "src/opencv/Mat_.h"
		


		
		, "src/opencv/imgcodecs.cc"
		, "src/opencv/imgcodecs.h"
		, "src/opencv/imgcodecs/IimwriteParameter.cc"
		, "src/opencv/imgcodecs/IimwriteParameter.h"
		
		
		, "src/opencv/base.cc"
		, "src/opencv/base.h"
		
		, "src/opencv/core.cc"
		, "src/opencv/core.h"
		, "src/opencv/core/RNG.cc"
		, "src/opencv/core/RNG.h"
		, "src/opencv/core/RNG_MT19937.cc"
		, "src/opencv/core/RNG_MT19937.h"
		, "src/opencv/core/ConjGradSolver.cc"
		, "src/opencv/core/ConjGradSolver.h"
		, "src/opencv/core/DownhillSolver.cc"
		, "src/opencv/core/DownhillSolver.h"
		, "src/opencv/core/Algorithm.cc"
		, "src/opencv/core/Algorithm.h"
		, "src/opencv/core/MinProblemSolver.cc"
		, "src/opencv/core/MinProblemSolver.h"
		, "src/opencv/core/PCA.h"
		, "src/opencv/core/PCA.cc"
		, "src/opencv/core/LDA.h"
		, "src/opencv/core/LDA.cc"
		, "src/opencv/core/SVD.h"
		, "src/opencv/core/SVD.cc"
		
		, "src/opencv/core/opengl.h"
		, "src/opencv/core/opengl.cc"
		, "src/opencv/core/opengl/Texture2D.h"
		, "src/opencv/core/opengl/Texture2D.cc"
		, "src/opencv/core/opengl/Buffer.h"
		, "src/opencv/core/opengl/Buffer.cc"
		, "src/opencv/core/opengl/Arrays.h"
		, "src/opencv/core/opengl/Arrays.cc"
		
		, "src/opencv/Affine3.cc"
		, "src/opencv/Affine3.h"
		
		, "src/opencv/calib3d.cc"
		, "src/opencv/calib3d.h"
		
		, "src/opencv/calib3d/fisheye.cc"
		, "src/opencv/calib3d/fisheye.h"
		, "src/opencv/calib3d/StereoBM.h"
		, "src/opencv/calib3d/StereoBM.cc"
		, "src/opencv/calib3d/StereoMatcher.h"
		, "src/opencv/calib3d/StereoMatcher.cc"
		, "src/opencv/calib3d/StereoSGBM.h"
		, "src/opencv/calib3d/StereoSGBM.cc"
		
		
		, "src/opencv/features2d.h"
		, "src/opencv/features2d.cc"

		, "src/opencv/features2d/AgastFeatureDetector.cc"
		, "src/opencv/features2d/AgastFeatureDetector.h"
		, "src/opencv/features2d/AKAZE.cc"
		, "src/opencv/features2d/AKAZE.h"
		, "src/opencv/features2d/BFMatcher.cc"
		, "src/opencv/features2d/BFMatcher.h"
		, "src/opencv/features2d/BOWImgDescriptorExtractor.cc"
		, "src/opencv/features2d/BOWImgDescriptorExtractor.h"
		, "src/opencv/features2d/BOWKMeansTrainer.cc"
		, "src/opencv/features2d/BOWKMeansTrainer.h"
		, "src/opencv/features2d/BOWTrainer.cc"
		, "src/opencv/features2d/BOWTrainer.h"
		, "src/opencv/features2d/BRISK.cc"
		, "src/opencv/features2d/BRISK.h"
		, "src/opencv/features2d/DescriptorCollection.cc"
		, "src/opencv/features2d/DescriptorCollection.h"
		, "src/opencv/features2d/DescriptorMatcher.cc"
		, "src/opencv/features2d/DescriptorMatcher.h"
		, "src/opencv/features2d/FastFeatureDetector.cc"
		, "src/opencv/features2d/FastFeatureDetector.h"
		, "src/opencv/features2d/Feature2D.cc"
		, "src/opencv/features2d/Feature2D.h"
		, "src/opencv/features2d/FlannBasedMatcher.cc"
		, "src/opencv/features2d/FlannBasedMatcher.h"
		, "src/opencv/features2d/GFTTDetector.cc"
		, "src/opencv/features2d/GFTTDetector.h"
		, "src/opencv/features2d/KAZE.cc"
		, "src/opencv/features2d/KAZE.h"
		, "src/opencv/features2d/KeyPointsFilter.cc"
		, "src/opencv/features2d/KeyPointsFilter.h"
		, "src/opencv/features2d/MSER.cc"
		, "src/opencv/features2d/MSER.h"
		, "src/opencv/features2d/ORB.cc"
		, "src/opencv/features2d/ORB.h"
		, "src/opencv/features2d/SimpleBlobDetector.cc"
		, "src/opencv/features2d/SimpleBlobDetector.h"
		, "src/opencv/features2d/SimpleBlobDetectorParams.cc"
		, "src/opencv/features2d/SimpleBlobDetectorParams.h"

		
		, "src/opencv/MatExpr.cc"
		, "src/opencv/MatExpr.h"
		
		, "src/opencv/MatND.cc"
		, "src/opencv/MatND.h"
		
		, "src/opencv/SparseMat.cc"
		, "src/opencv/SparseMat.h"
		
        , "src/opencv/Matrix.cc"
		, "src/opencv/Matrix.h"
		
		, "src/opencv/MatOp.cc"
		, "src/opencv/MatOp.h"
		
        , "src/opencv/UMatrix.cc"
		, "src/opencv/UMatrix.h"

		, "src/opencv/Constants.cc"
		, "src/opencv/Constants.h"
		, "src/opencv/HighGUI.cc"
		, "src/opencv/HighGUI.h"
		, "src/opencv/HighGUI/QtFont.cc"
		, "src/opencv/HighGUI/QtFont.h"

		
		, "src/opencv/superres.cc"
		, "src/opencv/superres.h"
		, "src/opencv/superres/optical_flow.cc"
		, "src/opencv/superres/optical_flow.h"
		
		, "src/opencv/ml.cc"
		, "src/opencv/ml.h"
		, "src/opencv/ml/TrainData.cc"
		, "src/opencv/ml/TrainData.h"
		
		, "src/opencv/Cuda.cc"
		, "src/opencv/Cuda.h"
		, "src/opencv/cuda/DeviceInfo.cc"
		, "src/opencv/cuda/DeviceInfo.h"
		, "src/opencv/cuda/GpuMat.cc"
		, "src/opencv/cuda/GpuMat.h"
		
		, "src/opencv/flann.cc"
		, "src/opencv/flann.h"

		, "src/opencv/types.cc"
		, "src/opencv/types.h"

		
		, "src/opencv/types/Size.cc"
		, "src/opencv/types/Size.h"
		, "src/opencv/types/Size.imp.h"
		, "src/opencv/types/DMatch.cc"
		, "src/opencv/types/DMatch.h"
		, "src/opencv/types/Rect.cc"
		, "src/opencv/types/Rect.h"
		, "src/opencv/types/RotatedRect.cc"
		, "src/opencv/types/RotatedRect.h"
		, "src/opencv/types/Range.cc"
		, "src/opencv/types/Range.h"
		, "src/opencv/types/TermCriteria.h"
		, "src/opencv/types/TermCriteria.cc"
		, "src/opencv/types/Moments.h"
		, "src/opencv/types/Moments.cc"
		, "src/opencv/types/KeyPoint.h"
		, "src/opencv/types/KeyPoint.cc"
		, "src/opencv/types/Complex.h"		
		, "src/opencv/types/Point.h"
		, "src/opencv/types/Point.imp.h"
		, "src/opencv/types/Point.cc"
		, "src/opencv/types/SizeAndPoint.h"
		, "src/opencv/types/Point3.h"
		, "src/opencv/types/Point3.cc"
		, "src/opencv/types/Scalar.cc"
		, "src/opencv/types/Scalar.h"
		
		, "src/opencv/Vec.cc"
		, "src/opencv/Vec.h"
		, "src/opencv/Vec.imp.h"
		, "src/opencv/Matx.cc"
		, "src/opencv/Matx.h"
		, "src/opencv/Matx.imp.h"
		, "src/opencv/MatxAndVec.h"

		, "src/opencv/video/KalmanFilter.cc"
		, "src/opencv/video/KalmanFilter.h"
		
		, "src/opencv/stitching.cc"
		, "src/opencv/stitching.h"
		
		, "src/opencv/cvtest.cc"
		, "src/opencv/cvtest.h"
		
		, "src/opencv/ts/DeviceManager.cc"
		, "src/opencv/ts/DeviceManager.h"

		, "src/opencv/TrackedPtr.cc"
		, "src/opencv/TrackedPtr.h"

		, "src/opencv/TrackedElement.cc"
		, "src/opencv/TrackedElement.h"

		, "src/opencv/IOArray.cc"
		, "src/opencv/IOArray.h"
		
		
		, "src/ffmpeg/ffmpeg.cc"
		, "src/ffmpeg/ffmpeg.h"
		, "src/ffmpeg/packet.cc"
		, "src/ffmpeg/packet.h"
		, "src/ffmpeg/stream.cc"
		, "src/ffmpeg/stream.h"
		, "src/utilities/CallStack.cpp"
		, "src/utilities/CallStack.h"
		, "src/utilities/stacktrace.cpp"
		, "src/utilities/stacktrace.h"
		, "src/utilities/threadsafe_queue.h"
		, "src/utilities/threadsafe_queue.cpp"
		, "src/utilities/uvasync.h"
		, "src/utilities/uvasync.cpp"
        #, "src/OpenCV.cc"
        #, "src/CascadeClassifierWrap.cc"
        #, "src/Contours.cc"
        #, "src/Point.cc"
        #, "src/VideoCaptureWrap.cc"
        #, "src/CamShift.cc"
        #, "src/FaceRecognizer.cc"
        #, "src/BackgroundSubtractor.cc"
        
		,'typings/index.d.ts'
		#,'typings/node/node.d.ts'
		#,'typings/tape/tape.d.ts'
		
		,'tsbinding/bindings.ts'
		
		,'tsbinding/tests.ts'
		,'tsbinding/alvision.ts'

		,'tsbinding/ffmpeg/ffmpeg.ts'
		,'tsbinding/ffmpeg/packet.ts'
		,'tsbinding/ffmpeg/stream.ts'

		,'tsbinding/opencv/Affine.ts'
		,'tsbinding/opencv/base.ts'
		
		
		
		,'tsbinding/opencv/core.ts'
		,'tsbinding/opencv/core/opengl.ts'
		,'tsbinding/opencv/core/optim.ts'
		
		
		,'tsbinding/opencv/cuda.ts'
		,'tsbinding/opencv/cudacodec/cudacodec.ts'
		,'tsbinding/opencv/cudaimgproc/cudaimgproc.ts'
		,'tsbinding/opencv/cudaarithm/cudaarithm.ts'
		,'tsbinding/opencv/cudabgsegm/cudabgsegm.ts'
		,'tsbinding/opencv/cudaoptflow/cudaoptflow.ts'
		,'tsbinding/opencv/cudaobjdetect/cudaobjdetect.ts'
		,'tsbinding/opencv/cudawarping/cudawarping.ts'
		,'tsbinding/opencv/cudastereo/cudastereo.ts'
		,'tsbinding/opencv/cudafeatures2d/cudafeatures2d.ts'
		,'tsbinding/opencv/cudafilters/cudafilters.ts'
		
		,'tsbinding/opencv/array.ts'
		
		,'tsbinding/opencv/objdetect.ts'
		
		,'tsbinding/opencv/cvdef.ts'
		,'tsbinding/opencv/features2d.ts'
		,'tsbinding/opencv/flann.ts'
		,'tsbinding/opencv/HighGUI.ts'
		,'tsbinding/opencv/imgcodecs.ts'
		,'tsbinding/opencv/imgproc.ts'
		
		
		,'tsbinding/opencv/mat.ts'
		,'tsbinding/opencv/Matx.ts'
		,'tsbinding/opencv/persistence.ts'
		
		,'tsbinding/opencv/photo.ts'
		,'tsbinding/opencv/photo/cuda.ts'
		#,'tsbinding/opencv/photo/photo_c.ts'
		
		,'tsbinding/opencv/static.ts'
		,'tsbinding/opencv/videoio.ts'
		
		,'tsbinding/opencv/superres.ts'
		,'tsbinding/opencv/superres/optical_flow.ts'
		,'tsbinding/opencv/superres/input_array_utility.ts'
		
		,'tsbinding/opencv/shape/emdL1.ts'
		,'tsbinding/opencv/shape/hist_cost.ts'
		,'tsbinding/opencv/shape/shape_distance.ts'
		,'tsbinding/opencv/shape/shape_transformer.ts'
		
		
		
		
		
		,'tsbinding/opencv/test.ts'
		,'tsbinding/opencv/tiff.ts'
		
		,'tsbinding/opencv/ts.ts'
		,'tsbinding/opencv/ts/cuda_test.ts'
		,'tsbinding/opencv/ts/ts_perf.ts'
		
		
		,'tsbinding/opencv/video/background_segm.ts'
		,'tsbinding/opencv/video/tracking.ts'
		#,'tsbinding/opencv/video/tracking_c.ts'
		
		,'tsbinding/opencv/types.ts'
		
		,'tsbinding/opencv/ml.ts'
		
		,'tsbinding/opencv/viz.ts'
		,'tsbinding/opencv/viz/types.ts'
		,'tsbinding/opencv/viz/viz3d.ts'
		,'tsbinding/opencv/viz/vizcore.ts'
		,'tsbinding/opencv/viz/widget_accessor.ts'
		,'tsbinding/opencv/viz/widgets.ts'
		
		,'tsbinding/opencv/calib3d.ts'
		,'tsbinding/opencv/calib3d/circlesgrid.ts'
		,'tsbinding/opencv/calib3d/fisheye.ts'
		
		,'tsbinding/opencv/stitching.ts'
		,'tsbinding/opencv/stitching/warpers.ts'
		,'tsbinding/opencv/stitching/detail/blenders.ts'
		,'tsbinding/opencv/stitching/detail/camera.ts'
		,'tsbinding/opencv/stitching/detail/exposure_compensate.ts'
		,'tsbinding/opencv/stitching/detail/matchers.ts'
		,'tsbinding/opencv/stitching/detail/motion_estimators.ts'
		,'tsbinding/opencv/stitching/detail/seam_finders.ts'
		
		,'test/opencv/calib3d/test_affine3.ts'
		,'test/opencv/calib3d/test_affine3d_estimator.ts'
		,'test/opencv/calib3d/test_cameracalibration.ts'
		,'test/opencv/calib3d/test_cameracalibration_artificial.ts'
		,'test/opencv/calib3d/test_cameracalibration_badarg.ts'
		,'test/opencv/calib3d/test_chessboardgenerator.ts'
		,'test/opencv/calib3d/test_chesscorners.ts'
		,'test/opencv/calib3d/test_chesscorners_badarg.ts'
		,'test/opencv/calib3d/test_chesscorners_timing.ts'
		,'test/opencv/calib3d/test_compose_rt.ts'
		,'test/opencv/calib3d/test_cornerssubpix.ts'
		,'test/opencv/calib3d/test_decompose_projection.ts'
		,'test/opencv/calib3d/test_fisheye.ts'
		,'test/opencv/calib3d/test_fundam.ts'
		,'test/opencv/calib3d/test_homography.ts'
		,'test/opencv/calib3d/test_homography_decomp.ts'
		,'test/opencv/calib3d/test_modelest.ts'
		,'test/opencv/calib3d/test_posit.ts'
		,'test/opencv/calib3d/test_precomp.ts'
		,'test/opencv/calib3d/test_reproject_image_to_3d.ts'
		,'test/opencv/calib3d/test_solvepnp_ransac.ts'
		,'test/opencv/calib3d/test_stereomatching.ts'
		,'test/opencv/calib3d/test_undistort.ts'
		,'test/opencv/calib3d/test_undistort_badarg.ts'
		,'test/opencv/calib3d/test_undistort_points.ts'
		,'test/opencv/core/test_arithm.ts'
		,'test/opencv/core/test_concatenation.ts'
		,'test/opencv/core/test_conjugate_gradient.ts'
		,'test/opencv/core/test_countnonzero.ts'
		,'test/opencv/core/test_downhill_simplex.ts'
		,'test/opencv/core/test_ds.ts'
		,'test/opencv/core/test_dxt.ts'
		,'test/opencv/core/test_eigen.ts'
		,'test/opencv/core/test_io.ts'
		,'test/opencv/core/test_ippasync.ts'
		,'test/opencv/core/test_lpsolver.ts'
		,'test/opencv/core/test_mat.ts'
		,'test/opencv/core/test_math.ts'
		,'test/opencv/core/test_misc.ts'
		,'test/opencv/core/test_operations.ts'
		,'test/opencv/core/test_ptr.ts'
		,'test/opencv/core/test_rand.ts'
		,'test/opencv/core/test_rotatedrect.ts'
		,'test/opencv/core/test_umat.ts'
		,'test/opencv/cudaarithm/test_arithm.ts'
		,'test/opencv/cudaarithm/test_buffer_pool.ts'
		,'test/opencv/cudaarithm/test_core.ts'
		,'test/opencv/cudaarithm/test_element_operations.ts'
		,'test/opencv/cudaarithm/test_gpumat.ts'
		,'test/opencv/cudaarithm/test_opengl.ts'
		,'test/opencv/cudaarithm/test_reductions.ts'
		,'test/opencv/cudaarithm/test_stream.ts'
		,'test/opencv/cudabgsegm/test_bgsegm.ts'
		,'test/opencv/cudacodec/test_video.ts'
		,'test/opencv/cudafeatures2d/test_features2d.ts'
		,'test/opencv/cudafilters/test_filters.ts'
		,'test/opencv/cudaimgproc/test_bilateral_filter.ts'
		,'test/opencv/cudaimgproc/test_blend.ts'
		,'test/opencv/cudaimgproc/test_canny.ts'
		,'test/opencv/cudaimgproc/test_color.ts'
		,'test/opencv/cudaimgproc/test_corners.ts'
		,'test/opencv/cudaimgproc/test_gftt.ts'
		,'test/opencv/cudaimgproc/test_histogram.ts'
		,'test/opencv/cudaimgproc/test_hough.ts'
		,'test/opencv/cudaimgproc/test_match_template.ts'
		,'test/opencv/cudaimgproc/test_mean_shift.ts'
		,'test/opencv/cudalegacy/main_nvidia.ts'
		,'test/opencv/cudalegacy/main_test_nvidia.ts'
		,'test/opencv/cudalegacy/NCVAutoTestLister.ts'
		,'test/opencv/cudalegacy/NCVTest.ts'
		,'test/opencv/cudalegacy/NCVTestSourceProvider.ts'
		,'test/opencv/cudalegacy/TestCompact.ts'
		,'test/opencv/cudalegacy/TestDrawRects.ts'
		,'test/opencv/cudalegacy/TestHaarCascadeApplication.ts'
		,'test/opencv/cudalegacy/TestHaarCascadeLoader.ts'
		,'test/opencv/cudalegacy/TestHypothesesFilter.ts'
		,'test/opencv/cudalegacy/TestHypothesesGrow.ts'
		,'test/opencv/cudalegacy/TestIntegralImage.ts'
		,'test/opencv/cudalegacy/TestIntegralImageSquared.ts'
		,'test/opencv/cudalegacy/TestRectStdDev.ts'
		,'test/opencv/cudalegacy/TestResize.ts'
		,'test/opencv/cudalegacy/TestTranspose.ts'
		,'test/opencv/cudalegacy/test_calib3d.ts'
		,'test/opencv/cudalegacy/test_labeling.ts'
		,'test/opencv/cudalegacy/test_main.ts'
		,'test/opencv/cudalegacy/test_nvidia.ts'
		,'test/opencv/cudaobjdetect/test_objdetect.ts'
		,'test/opencv/cudaoptflow/test_optflow.ts'
		,'test/opencv/cudastereo/test_stereo.ts'
		,'test/opencv/cudawarping/interpolation.ts'
		,'test/opencv/cudawarping/test_pyramids.ts'
		,'test/opencv/cudawarping/test_remap.ts'
		,'test/opencv/cudawarping/test_resize.ts'
		,'test/opencv/cudawarping/test_warp_affine.ts'
		,'test/opencv/cudawarping/test_warp_perspective.ts'
		,'test/opencv/features2d/test_agast.ts'
		,'test/opencv/features2d/test_brisk.ts'
		,'test/opencv/features2d/test_descriptors_regression.ts'
		,'test/opencv/features2d/test_detectors_regression.ts'
		,'test/opencv/features2d/test_fast.ts'
		,'test/opencv/features2d/test_keypoints.ts'
		,'test/opencv/features2d/test_matchers_algorithmic.ts'
		,'test/opencv/features2d/test_mser.ts'
		,'test/opencv/features2d/test_nearestneighbors.ts'
		,'test/opencv/features2d/test_orb.ts'
		,'test/opencv/features2d/test_rotation_and_scale_invariance.ts'
		,'test/opencv/flann/test_lshtable_badarg.ts'
		,'test/opencv/highgui/test_gui.ts'
		,'test/opencv/imgcodecs/test_drawing.ts'
		,'test/opencv/imgcodecs/test_grfmt.ts'
		,'test/opencv/imgproc/test_approxpoly.ts'
		,'test/opencv/imgproc/test_bilateral_filter.ts'
		,'test/opencv/imgproc/test_boundingrect.ts'
		,'test/opencv/imgproc/test_canny.ts'
		,'test/opencv/imgproc/test_color.ts'
		,'test/opencv/imgproc/test_connectedcomponents.ts'
		,'test/opencv/imgproc/test_contours.ts'
		,'test/opencv/imgproc/test_convhull.ts'
		,'test/opencv/imgproc/test_cvtyuv.ts'
		,'test/opencv/imgproc/test_distancetransform.ts'
		,'test/opencv/imgproc/test_emd.ts'
		,'test/opencv/imgproc/test_filter.ts'
		,'test/opencv/imgproc/test_floodfill.ts'
		,'test/opencv/imgproc/test_grabcut.ts'
		,'test/opencv/imgproc/test_histograms.ts'
		,'test/opencv/imgproc/test_houghLines.ts'
		,'test/opencv/imgproc/test_imgproc_umat.ts'
		,'test/opencv/imgproc/test_imgwarp.ts'
		,'test/opencv/imgproc/test_imgwarp_strict.ts'
		,'test/opencv/imgproc/test_intersection.ts'
		,'test/opencv/imgproc/test_lsd.ts'
		,'test/opencv/imgproc/test_moments.ts'
		,'test/opencv/imgproc/test_pc.ts'
		,'test/opencv/imgproc/test_templmatch.ts'
		,'test/opencv/imgproc/test_thresh.ts'
		,'test/opencv/imgproc/test_watershed.ts'
		,'test/opencv/ml/test_emknearestkmeans.ts'
		,'test/opencv/ml/test_gbttest.ts'
		,'test/opencv/ml/test_lr.ts'
		,'test/opencv/ml/test_mltests.ts'
		,'test/opencv/ml/test_mltests2.ts'
		,'test/opencv/ml/test_precomp.ts'
		,'test/opencv/ml/test_save_load.ts'
		,'test/opencv/ml/test_svmtrainauto.ts'
		,'test/opencv/objdetect/test_cascadeandhog.ts'
		,'test/opencv/photo/test_cloning.ts'
		,'test/opencv/photo/test_decolor.ts'
		,'test/opencv/photo/test_denoise_tvl1.ts'
		,'test/opencv/photo/test_denoising.cuda.ts'
		,'test/opencv/photo/test_denoising.ts'
		,'test/opencv/photo/test_hdr.ts'
		,'test/opencv/photo/test_inpaint.ts'
		,'test/opencv/photo/test_npr.ts'
		,'test/opencv/shape/test_shape.ts'
		,'test/opencv/stitching/test_blenders.ts'
		,'test/opencv/stitching/test_matchers.ts'
		,'test/opencv/superres/test_superres.ts'
		,'test/opencv/video/test_accum.ts'
		,'test/opencv/video/test_camshift.ts'
		,'test/opencv/video/test_ecc.ts'
		,'test/opencv/video/test_estimaterigid.ts'
		,'test/opencv/video/test_kalman.ts'
		,'test/opencv/video/test_optflowpyrlk.ts'
		,'test/opencv/video/test_tvl1optflow.ts'
		,'test/opencv/videoio/test_basic_props.ts'
		,'test/opencv/videoio/test_ffmpeg.ts'
		,'test/opencv/videoio/test_fourcc.ts'
		,'test/opencv/videoio/test_framecount.ts'
		,'test/opencv/videoio/test_positioning.ts'
		,'test/opencv/videoio/test_video_io.ts'
		,'test/opencv/videoio/test_video_pos.ts'
		,'test/opencv/viz/tests_simple.ts'
		,'test/opencv/viz/test_precomp.ts'
		,'test/opencv/viz/test_tutorial2.ts'
		,'test/opencv/viz/test_tutorial3.ts'
		,'test/opencv/viz/test_viz3d.ts'

		
        ]
	  , 'dependencies':[
			'../ffmpegcpp.module/ffmpegcpp.gyp:ffmpegcpp',
			'../opencv.module/opencv.gyp:core',
			'../opencv.module/opencv.gyp:hal',
			'../opencv.module/opencv.gyp:imgproc',
			'../opencv.module/opencv.gyp:photo',
			'../opencv.module/opencv.gyp:video',
			'../opencv.module/opencv.gyp:features2d',
			'../opencv.module/opencv.gyp:objdetect',
			'../opencv.module/opencv.gyp:calib3d',
			'../opencv.module/opencv.gyp:imgcodecs',
			'../opencv.module/opencv.gyp:videoio',
			'../opencv.module/opencv.gyp:highgui',
			'../opencv.module/opencv.gyp:ml',
			'../opencv.module/opencv.gyp:flann',
			'../opencv.module/opencv.gyp:ts',
			'../node-overload-resolution/binding.gyp:node-overload-resolution',
			'../node-addon-tracer/binding.gyp:node-addon-tracer',
			#'../opencv.module/sources/3rdparty/3rdparty.gyp:zlib',
			#'../ffmpeg/ffmpeg.gyp:compat',
			#'../ffmpeg/ffmpeg.gyp:avcodec_p1',
			#'../ffmpeg/ffmpeg.gyp:avcodec_p2',
			#'../ffmpeg/ffmpeg.gyp:avdevice',
			#'../ffmpeg/ffmpeg.gyp:avfilter',
			#'../ffmpeg/ffmpeg.gyp:avformat',
			#'../ffmpeg/ffmpeg.gyp:avresample',
			#'../ffmpeg/ffmpeg.gyp:avutil',
			#'../ffmpeg/ffmpeg.gyp:postproc',
			#'../ffmpeg/ffmpeg.gyp:swresample',
			#'../ffmpeg/ffmpeg.gyp:swscale',
	  ]
      #, 'libraries': [
      #    '<!@(pkg-config --libs opencv64)',
		#  '<!@(pkg-config --libs ffmpegcpp64)',
		#  'dbghelp.lib'
      #  ]
      #
      ## For windows
	  
      ,'include_dirs': [
	  
      #    '<!@(pkg-config --cflags opencv64)',
		#  '<!@(pkg-config --cflags ffmpegcpp64)',
          "<!(node -e \"require('nan')\")"
          ]
      #
      #, 'cflags': [
      #      '<!@(pkg-config --cflags "opencv64 >= 2.3.1" )'
		#	'<!@(pkg-config --cflags "ffmpegcpp64 >= 1.0.0" )'
      #      , '-Wall'
      #    ]
      #, 'cflags!' : [ '-fno-exceptions']
      #, 'cflags_cc!': [ '-fno-rtti',  '-fno-exceptions']
      , "conditions": [
		['OS == "win"',{
			'libraries':[
				'dbghelp.lib'
			],
		}],
		['OS in "linux android"',{
			'cflags':['-fexceptions','-std=c++11'],
			'cflags!' : [ '-fno-exceptions'],
			'cflags_cc!': [ '-fno-rtti',  '-fno-exceptions'],
			'ldflags' : ['-Wl,--rpath=\$ORIGIN'],
			'ldflags_cc':['-Wl,--rpath=\$ORIGIN'],
		}],
        #['OS=="mac"', {
        #  # cflags on OS X are stupid and have to be defined like this
        #  'xcode_settings': {
        #    'OTHER_CFLAGS': [
        #      "-mmacosx-version-min=10.7",
        #      "-std=c++11",
        #      "-stdlib=libc++",
        #      '<!@(pkg-config --cflags opencv)'
        #    ]
        #    , "GCC_ENABLE_CPP_RTTI": "YES"
        #    , "GCC_ENABLE_CPP_EXCEPTIONS": "YES"
        #  }
        #}
		#
		#]

    ]
  }]
}
