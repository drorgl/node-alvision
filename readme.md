# node alvision project

### *** Experimental ***

node-alvision is a computer vision/video processing module for node js.

for some time computer vision was a thing for uber geeks, since node js became a popular platform for developing practically anything I felt I could use this plaform to develop dynamic computer vision applications with a minimum skill set.

This project is based on Peter Braden's [node-opencv](https://peterbraden.github.io/node-opencv/), the API is substantially different though, so don't expect anything that worked with node-opencv to work with node-alvision.

At the moment no documentation is available but the code is pretty self explanatory, the biggest issue is actually building the binaries which could take about ~70MB and close to 30 minutes in some instances.

You can find some usage in the test/unit.js.

This library has been tested with NDK/Linux32/Linux64/Win32/Win64 platforms and appears to work but no guarantees.

#### building instructions

Please note that this project doesn't use the standard node-gyp but a slightly modified version in my repos ([node-gyp](https://github.com/drorgl/node-gyp)), the change is designed to pass parameters along, so attempting this command on a regular node-gyp will fail since no parameters can be passed to gyp from the standard node-gyp.

```
npm install

Windows
node-gyp configure -Dos_posix=0 -Dmsan=0 -Dclang=0 -Duse_system_yasm=0 -Dbuildtype=debug

Arm
node-gyp configure --make=make clean configure  -f make-linux -DOS=android -Dtarget_arch=arm

Linux
node-gyp configure

Ninja
node-gyp --make=ninja --arch=arm configure  -f ninja-linux -DOS=android -Dtarget_arch=arm build 

Ninja Linux
node-gyp --loglevel=silly --make=ninja --arch=x64 configure  -f ninja-linux -DOS=linux -Dtarget_arch=x64 build 

```

#### Dependencies

##### ffmpegcpp.module
>
>[https://github.com/drorgl/ffmpegcpp.module](https://github.com/drorgl/ffmpegcpp.module)
>

##### opencv.module
>
>[https://github.com/drorgl/opencv.module](https://github.com/drorgl/opencv.module)
>

### node alvision license
node-alvision is copyrighted by Dror Gluska and licensed under the 3-clause BSD license, however, its dependent upon multiple software projects with various licenses, hire a lawyer if you have any questions.

#### Tests
Tests are in test/unit.js, the tests should cover most if not all of the exposed api.

