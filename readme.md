# node alvision project

### *** Experimental ***

node-alvision is a computer vision/video processing module for node js.

for some time computer vision was a thing for uber geeks, since node js became a popular platform for developing practically anything I felt I could use this plaform to develop dynamic computer vision applications.

This project is based on Peter Braden's [node-opencv](https://peterbraden.github.io/node-opencv/), the API is substantially different though, so don't expect anything that worked with node-opencv to work with node-alvision.

At the moment no documentation is available but the code is pretty self explanatory, the biggest issue is actually building the binaries which could take about ~70MB and close to 30 minutes in some instances not including the time needed to set up the build environment.

You can find some usage in the test/unit.js.

This library has been tested with NDK/Linux32/Linux64/Win32/Win64 platforms and appears to work but with no guarantees.

#### building instructions

Please note that this project doesn't use the standard node-gyp but a slightly modified version in my repos ([node-gyp](https://github.com/drorgl/node-gyp)), the change is designed to pass parameters along, so attempting this command on a regular node-gyp will fail since no parameters can be passed to gyp from the standard node-gyp.

```
Depending on your file system:

npm install
or
npm install --no-bin-links


You must get node-gyp from this location:
https://github.com/drorgl/node-gyp

And then define an environment variable:
export NODE_GYP_PATH=/mnt/node-gyp/node-gyp
or
set NODE_GYP_PATH=C:\node-gyp/node-gyp.cmd

And then execute the appropriate npm run-script:

Windows
npm run-script windows

Arm
To compile node-alvision for arm its a bit more complicated, you need to have the nodejs sources you build node executable from since the headers downloaded automatically by node-gyp cannot be used. The arm build script uses the --nodedir=... argument to point to the right folder.
npm run-script arm

Linux
npm run-script linux

To Run tests
npm tests

```

#### Dependencies
node-alvision uses the following modules and their dependencies, in addition you might need nodejs source code if you plan to build for arm. 
node-alvision build scripts uses a modified [node-gyp](https://github.com/drorgl/node-gyp).

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

### credits
Most of the credit goes to ffmpeg, opencv and other major open source projects I've used but also to Peter Braden for giving me a good start, while almost none of his original code is left in this project, I've learned a lot from node-opencv project on how to write node addons.

#### Tests
Tests are in test/unit.js, the tests should cover most if not all of the exposed api.


#### Troubleshooting
Object #<Object> has no method '_extend'
You have an old version of node or npm, which are probably not supported.

try to update npm:

sudo npm install npm -g

and node:

curl -sL https://deb.nodesource.com/setup | sudo bash -

