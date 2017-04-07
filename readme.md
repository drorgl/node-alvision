# opencv GYP Module

** Experimental **

expose opencv through gyp
http://opencv.org/

source: https://github.com/Itseez/opencv

- can be used stand alone to compile opencv as static/shared libraries ( / dll) 
	static/shared library can be changed in the variables section of opencv.gyp
- can be used as part of a bigger gyp project (which was the original intent):

```
'dependencies':[
	'opencv.module/opencv.gyp:core',
	'opencv.module/opencv.gyp:calib3d',
	'opencv.module/opencv.gyp:cudaarithm',
	'opencv.module/opencv.gyp:cudabgsegm',
	'opencv.module/opencv.gyp:cudafeatures2d',
	'opencv.module/opencv.gyp:cudafilters',
	'opencv.module/opencv.gyp:cudaimgproc',
	'opencv.module/opencv.gyp:cudaobjdetect',
	'opencv.module/opencv.gyp:cudastereo',
	'opencv.module/opencv.gyp:cudawarping',
	'opencv.module/opencv.gyp:cudev',
	'opencv.module/opencv.gyp:features2d',
	'opencv.module/opencv.gyp:flann',
	'opencv.module/opencv.gyp:highgui',
	'opencv.module/opencv.gyp:imgcodecs',
	'opencv.module/opencv.gyp:imgproc',
	'opencv.module/opencv.gyp:ml',
	'opencv.module/opencv.gyp:objdetect',
	'opencv.module/opencv.gyp:photo',
	'opencv.module/opencv.gyp:shape',
	'opencv.module/opencv.gyp:stitching',
	'opencv.module/opencv.gyp:superres',
	'opencv.module/opencv.gyp:ts',
	'opencv.module/opencv.gyp:video',
	'opencv.module/opencv.gyp:videoio',
	'opencv.module/opencv.gyp:videostab',
	'opencv.module/opencv.gyp:world',
	'opencv.module/opencv.gyp:cudalegacy',
	'opencv.module/opencv.gyp:cudaoptflow',
	'opencv.module/opencv.gyp:viz',
]
```



```
gyp opencv.gyp -DOS=win -Dtarget_arch=ia32 --depth=. -f msvs -G msvs_version=2013 --generator-output=./build.vs2013/

gyp opencv.gyp -DOS=win -Dtarget_arch=x64 --depth=. -f msvs -G msvs_version=2013 --generator-output=./build.vs2013/

gyp opencv.gyp -DOS=linux -Dtarget_arch=ia32 --depth=. -f make --generator-output=./build.linux32/

gyp opencv.gyp -DOS=linux -Dtarget_arch=x64 --depth=. -f make --generator-output=./build.linux64/

gyp opencv.gyp -DOS=android -Dtarget_arch=arm --depth=. -f make --generator-output=./build.android/
```
