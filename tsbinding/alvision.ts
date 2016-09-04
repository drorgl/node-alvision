//var alvision_module = require('../lib/bindings.js');
import alvision_module from "./bindings";

export * from './ffmpeg/ffmpeg';
export * from './ffmpeg/packet';
export * from './ffmpeg/stream';

//export * from './opencv/Constants';
//export * from './opencv/HighGui';
//export * from './opencv/Matrix';
//export * from './opencv/Vec';
//export * from './opencv/Scalar';
//export * from './opencv/Matx';
//export * from './opencv/MatExpr';
//export * from './opencv/Affine';
//export * from './opencv/RNG';
//export * from './opencv/SVD';
//export * from './opencv/Point3';
//export * from './opencv/Size';
//export * from './opencv/Algorithm';

export * from './opencv/array';
export * from './opencv/Affine';
export * from './opencv/base';

export * from './opencv/core';
export * from './opencv/core/opengl';
export * from './opencv/core/optim';

export * from './opencv/video/background_segm';
export * from './opencv/video/tracking';

//import * as cuda1 from './opencv/cuda';
//import * as cuda2 from './opencv/photo/cuda';
//export var cuda = {};
export * from './opencv/cuda';
export * from './opencv/cudacodec/cudacodec';
export * from './opencv/cudaarithm/cudaarithm';
export * from './opencv/cudaimgproc/cudaimgproc';
export * from './opencv/cudabgsegm/cudabgsegm';
export * from './opencv/cudaoptflow/cudaoptflow';
export * from './opencv/cudaobjdetect/cudaobjdetect';
export * from './opencv/cudawarping/cudawarping';
export * from './opencv/cudastereo/cudastereo';
export * from './opencv/cudafeatures2d/cudafeatures2d';
export * from './opencv/cudafilters/cudafilters';

export * from './opencv/photo/cuda';

export * from './opencv/objdetect';

//import * as c1 from './opencv/cuda';
//import * as c2 from './opencv/photo/cuda';
//export module x { }

//export module cuda {
//    //export import cuda = c2
//    //export import cuda = c2;
//}



//export cuda1.cuda;// + cuda2.cuda;
//cuda = cuda2.cuda;
//cuda = cuda2.cuda;

//export module cuda { };


//export import xxxx = {xx, xxx }};

//import xxxxx = module("./opencv/cuda");
//export * from module('./opencv/cuda');


//export import cuda = xx = xxx;
//export import cuda = xxx;

//export namespace cuda {
//    export * from  xx;
//    //export * from module('./opencv/cuda');
//    //export * from './opencv/photo/cuda';
//    //export * from './opencv/photo/cuda';
//}


export * from './opencv/cvdef';
export * from './opencv/HighGUI';
export * from './opencv/imgproc';
export * from './opencv/imgcodecs';
export * from './opencv/features2d';
export * from './opencv/flann';
//export * from './opencv/miniflann';
export * from './opencv/mat';
export * from './opencv/Matx';
export * from './opencv/static';
export * from './opencv/types';

export * from './opencv/ts';
export * from './opencv/ts/cuda_test';

export * from './opencv/persistence';
export * from './opencv/photo';


export * from './opencv/tiff';

export * from './opencv/calib3d';
export * from './opencv/calib3d/circlesgrid';
export * from './opencv/calib3d/fisheye';

export * from './opencv/ml';

export * from './opencv/stitching';
export * from './opencv/superres';
export * from './opencv/superres/optical_flow';
export * from "./opencv/superres/input_array_utility";


export * from './opencv/viz';


export * from './opencv/shape/emdL1';
export * from './opencv/shape/hist_cost';
export * from './opencv/shape/shape_distance';
export * from './opencv/shape/shape_transformer';


export * from './opencv/videoio';

export * from './opencv/static';
//export * from './opencv/test';

export var version: string = alvision_module.version;


