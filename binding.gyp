

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
							  'AdditionalOptions': ['/GL-','/w'], #['/wd4244' ,'/wd4018','/wd4133' ,'/wd4090'] #GL- was added because the forced optimization coming from node-gyp is disturbing the weird coding style from ffmpeg.
							  'RuntimeLibrary': 3, # dll debug
							},
							'VCLinkerTool': {
							  'LinkTimeCodeGeneration': '0',
							},
							
							'VCLibrarianTool': {
								'AdditionalOptions!': ['/LTCG'],
							 },
						}
				}]
				]
			},
			'Release' : {
				'conditions':[
					['1==0',{
						'msvs_settings': {
							# This magical incantation is necessary because VC++ will compile
							# object files to same directory... even if they have the same name!
							'VCCLCompilerTool': {
							  'WholeProgramOptimization' : 'false',
							  'AdditionalOptions': ['/GL-','/w'], #['/wd4244' ,'/wd4018','/wd4133' ,'/wd4090'] #GL- was added because the forced optimization coming from node-gyp is disturbing the weird coding style from ffmpeg.
							  'RuntimeLibrary': 2, # dll release
							},
							'VCLinkerTool': {
							  'LinkTimeCodeGeneration': '0',
							},
							
							'VCLibrarianTool': {
								'AdditionalOptions!': ['/LTCG'],
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
		, "test/unit.js"
        , "src/init.cc"
		, "src/alvision.h"
		, "src/safecast.h"
		
        , "src/opencv/Matrix.cc"
		, "src/opencv/Matrix.h"
		, "src/opencv/Constants.cc"
		, "src/opencv/Constants.h"
		, "src/opencv/HighGUI.cc"
		, "src/opencv/HighGUI.h"
		
		, "src/opencv/vec.cc"
		, "src/opencv/vec.h"
		
		
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
        
		,'typings/tsd.d.ts'
		,'typings/node/node.d.ts'
		,'typings/tape/tape.d.ts'
		
		
		
		,'tsbinding/tests.ts'
		,'tsbinding/alvision.ts'

		,'tsbinding/ffmpeg/ffmpeg.ts'
		,'tsbinding/ffmpeg/packet.ts'
		,'tsbinding/ffmpeg/stream.ts'

		,'tsbinding/opencv/Affine.ts'
		,'tsbinding/opencv/base.ts'
		,'tsbinding/opencv/core.ts'
		,'tsbinding/opencv/cvdef.ts'
		,'tsbinding/opencv/HighGUI.ts'
		,'tsbinding/opencv/imgproc.ts'
		,'tsbinding/opencv/mat.ts'
		,'tsbinding/opencv/Matx.ts'
		,'tsbinding/opencv/persistence.ts'
		,'tsbinding/opencv/static.ts'
		,'tsbinding/opencv/test.ts'
		,'tsbinding/opencv/ts.ts'
		,'tsbinding/opencv/types.ts'
		
		,'test/opencv/imgproc/test_approxpoly.ts'
		,'test/opencv/imgproc/test_bilateral_filter.ts'
		#,'test/opencv/imgproc/test_boundingrect.ts'
		#,'test/opencv/imgproc/test_canny.ts'
		#,'test/opencv/imgproc/test_color.ts'
		#,'test/opencv/imgproc/test_connectedcomponents.ts'
		#,'test/opencv/imgproc/test_contours.ts'
		#,'test/opencv/imgproc/test_convhull.ts'
		#,'test/opencv/imgproc/test_cvtyuv.ts'
		#,'test/opencv/imgproc/test_distancetransform.ts'
		#,'test/opencv/imgproc/test_emd.ts'
		#,'test/opencv/imgproc/test_filter.ts'
		#,'test/opencv/imgproc/test_floodfill.ts'
		#,'test/opencv/imgproc/test_grabcut.ts'
		#,'test/opencv/imgproc/test_histograms.ts'
		#,'test/opencv/imgproc/test_houghLines.ts'
		#,'test/opencv/imgproc/test_imgproc_umat.ts'
		#,'test/opencv/imgproc/test_imgwarp.ts'
		#,'test/opencv/imgproc/test_imgwarp_strict.ts'
		#,'test/opencv/imgproc/test_intersection.ts'
		#,'test/opencv/imgproc/test_lsd.ts'
		#,'test/opencv/imgproc/test_main.ts'
		#,'test/opencv/imgproc/test_moments.ts'
		#,'test/opencv/imgproc/test_pc.ts'
		#,'test/opencv/imgproc/test_precomp.ts'
		#,'test/opencv/imgproc/test_templmatch.ts'
		#,'test/opencv/imgproc/test_thresh.ts'
		#,'test/opencv/imgproc/test_watershed.ts'
		
		
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
