//array.cpp
var alvision_module = require('../../lib/bindings.js');

import * as _mat from './mat'
import * as _matx from './matx'
import * as _st from './static'
import * as _types from './types'
import * as _core from './core'
import * as _base from './base'
import * as _cvdef from './cvdef'

function cvSetReal1DMat(mat: _mat.Mat, idx0: _st.int, value: _st.double): void {
    switch (_cvdef.MatrixType.CV_MAT_TYPE(mat.type())) {
        case _cvdef.MatrixType.CV_8U:
            mat.at<_st.uchar>("uchar", idx0).set(_st.saturate_cast<_st.uchar>(value, "uchar"));
            break;
        case _cvdef.MatrixType.CV_8S:
            mat.at<_st.schar>("schar", idx0).set(_st.saturate_cast<_st.schar>(value, "schar"));
            break;
        case _cvdef.MatrixType.CV_16U:
            mat.at<_st.ushort>("ushort", idx0).set(_st.saturate_cast<_st.ushort>(value, "ushort"));
            break;
        case _cvdef.MatrixType.CV_16S:
            mat.at<_st.short>("short", idx0).set(_st.saturate_cast<_st.short>(value, "short"));
            break;
        case _cvdef.MatrixType.CV_32S:
            mat.at<_st.int>("int", idx0).set(_st.saturate_cast<_st.int>(value, "int"));
            break;
        case _cvdef.MatrixType.CV_32F:
            mat.at<_st.float>("float", idx0).set(_st.saturate_cast<_st.float>(value, "float"));
            break;
        case _cvdef.MatrixType.CV_64F:
            mat.at<_st.double>("double", idx0).set(_st.saturate_cast<_st.double>(value, "double"));
            break;
    }
}

function cvSetReal1DSparseMat(sparseMat: _mat.SparseMat, idx0: _st.int, value: _st.double): void {
    switch (_cvdef.MatrixType.CV_MAT_TYPE(sparseMat.type())) {
        case _cvdef.MatrixType.CV_8U:
            sparseMat.ptr<_st.uchar>("uchar", idx0,false).set(_st.saturate_cast<_st.uchar>(value, "uchar"));
            break;
        case _cvdef.MatrixType.CV_8S:
            sparseMat.ptr<_st.schar>("schar", idx0,false).set(_st.saturate_cast<_st.schar>(value, "schar"));
            break;
        case _cvdef.MatrixType.CV_16U:
            sparseMat.ptr<_st.ushort>("ushort", idx0, false).set(_st.saturate_cast<_st.ushort>(value, "ushort"));
            break;
        case _cvdef.MatrixType.CV_16S:
            sparseMat.ptr<_st.short>("short", idx0, false).set(_st.saturate_cast<_st.short>(value, "short"));
            break;
        case _cvdef.MatrixType.CV_32S:
            sparseMat.ptr<_st.int>("int", idx0, false).set(_st.saturate_cast<_st.int>(value, "int"));
            break;
        case _cvdef.MatrixType.CV_32F:
            sparseMat.ptr<_st.float>("float", idx0, false).set(_st.saturate_cast<_st.float>(value, "float"));
            break;
        case _cvdef.MatrixType.CV_64F:
            sparseMat.ptr<_st.double>("double", idx0, false).set(_st.saturate_cast<_st.double>(value, "double"));
            break;
    }
}

export function cvSetReal1D(arr: _st.IOArray | _mat.Mat | _mat.SparseMat, idx0: _st.int, value: _st.double): void {
    if (typeof arr == typeof _mat.Mat) {
        cvSetReal1DMat(<_mat.Mat>arr, idx0, value);        
    } else if (typeof arr == typeof _mat.SparseMat) {
        cvSetReal1DSparseMat(<_mat.SparseMat>arr, idx0, value);
    } else {
        throw new Error("not implemented");
    }
}


function cvSetReal2DMat(mat: _mat.Mat, idx0: _st.int,idx1 : _st.int, value: _st.double): void {
    switch (_cvdef.MatrixType.CV_MAT_TYPE(mat.type())) {
        case _cvdef.MatrixType.CV_8U:
            mat.at<_st.uchar>("uchar", idx0,idx1).set(_st.saturate_cast<_st.uchar>(value, "uchar"));
            break;
        case _cvdef.MatrixType.CV_8S:
            mat.at<_st.schar>("schar", idx0, idx1).set(_st.saturate_cast<_st.schar>(value, "schar"));
            break;
        case _cvdef.MatrixType.CV_16U:
            mat.at<_st.ushort>("ushort", idx0, idx1).set(_st.saturate_cast<_st.ushort>(value, "ushort"));
            break;
        case _cvdef.MatrixType.CV_16S:
            mat.at<_st.short>("short", idx0, idx1).set(_st.saturate_cast<_st.short>(value, "short"));
            break;
        case _cvdef.MatrixType.CV_32S:
            mat.at<_st.int>("int", idx0, idx1).set(_st.saturate_cast<_st.int>(value, "int"));
            break;
        case _cvdef.MatrixType.CV_32F:
            mat.at<_st.float>("float", idx0, idx1).set(_st.saturate_cast<_st.float>(value, "float"));
            break;
        case _cvdef.MatrixType.CV_64F:
            mat.at<_st.double>("double", idx0, idx1).set(_st.saturate_cast<_st.double>(value, "double"));
            break;
    }
}

function cvSetReal2DSparseMat(sparseMat: _mat.SparseMat, idx0: _st.int, idx1:_st.int, value: _st.double): void {
    switch (_cvdef.MatrixType.CV_MAT_TYPE(sparseMat.type())) {
        case _cvdef.MatrixType.CV_8U:
            sparseMat.ptr<_st.uchar>("uchar", idx0, idx1, false).set(_st.saturate_cast<_st.uchar>(value, "uchar"));
            break;
        case _cvdef.MatrixType.CV_8S:
            sparseMat.ptr<_st.schar>("schar", idx0, idx1, false).set(_st.saturate_cast<_st.schar>(value, "schar"));
            break;
        case _cvdef.MatrixType.CV_16U:
            sparseMat.ptr<_st.ushort>("ushort", idx0, idx1, false).set(_st.saturate_cast<_st.ushort>(value, "ushort"));
            break;
        case _cvdef.MatrixType.CV_16S:
            sparseMat.ptr<_st.short>("short", idx0, idx1, false).set(_st.saturate_cast<_st.short>(value, "short"));
            break;
        case _cvdef.MatrixType.CV_32S:
            sparseMat.ptr<_st.int>("int", idx0, idx1, false).set(_st.saturate_cast<_st.int>(value, "int"));
            break;
        case _cvdef.MatrixType.CV_32F:
            sparseMat.ptr<_st.float>("float", idx0, idx1, false).set(_st.saturate_cast<_st.float>(value, "float"));
            break;
        case _cvdef.MatrixType.CV_64F:
            sparseMat.ptr<_st.double>("double", idx0, idx1, false).set(_st.saturate_cast<_st.double>(value, "double"));
            break;
    }
}

export function cvSetReal2D(arr: _st.IOArray | _mat.Mat | _mat.SparseMat, idx0: _st.int, idx1: _st.int, value: _st.double): void {
    if (typeof arr == typeof _mat.Mat) {
        cvSetReal2DMat(<_mat.Mat>arr, idx0, idx1, value);
    } else if (typeof arr == typeof _mat.SparseMat) {
        cvSetReal2DSparseMat(<_mat.SparseMat>arr, idx0, idx1, value);
    } else {
        throw new Error("not implemented");
    }
}


function cvSetReal3DMat(mat: _mat.Mat, idx0: _st.int, idx1: _st.int,idx2 : _st.int, value: _st.double): void {
    switch (_cvdef.MatrixType.CV_MAT_TYPE(mat.type())) {
        case _cvdef.MatrixType.CV_8U:
            mat.at<_st.uchar>("uchar", idx0, idx1,idx2).set(_st.saturate_cast<_st.uchar>(value, "uchar"));
            break;
        case _cvdef.MatrixType.CV_8S:
            mat.at<_st.schar>("schar", idx0, idx1, idx2).set(_st.saturate_cast<_st.schar>(value, "schar"));
            break;
        case _cvdef.MatrixType.CV_16U:
            mat.at<_st.ushort>("ushort", idx0, idx1, idx2).set(_st.saturate_cast<_st.ushort>(value, "ushort"));
            break;
        case _cvdef.MatrixType.CV_16S:
            mat.at<_st.short>("short", idx0, idx1, idx2).set(_st.saturate_cast<_st.short>(value, "short"));
            break;
        case _cvdef.MatrixType.CV_32S:
            mat.at<_st.int>("int", idx0, idx1, idx2).set(_st.saturate_cast<_st.int>(value, "int"));
            break;
        case _cvdef.MatrixType.CV_32F:
            mat.at<_st.float>("float", idx0, idx1, idx2).set(_st.saturate_cast<_st.float>(value, "float"));
            break;
        case _cvdef.MatrixType.CV_64F:
            mat.at<_st.double>("double", idx0, idx1, idx2).set(_st.saturate_cast<_st.double>(value, "double"));
            break;
    }
}

function cvSetReal3DSparseMat(sparseMat: _mat.SparseMat, idx0: _st.int, idx1: _st.int,idx2:_st.int, value: _st.double): void {
    switch (_cvdef.MatrixType.CV_MAT_TYPE(sparseMat.type())) {
        case _cvdef.MatrixType.CV_8U:
            sparseMat.ptr<_st.uchar>("uchar", idx0, idx1, idx2, false).set(_st.saturate_cast<_st.uchar>(value, "uchar"));
            break;
        case _cvdef.MatrixType.CV_8S:
            sparseMat.ptr<_st.schar>("schar", idx0, idx1, idx2, false).set(_st.saturate_cast<_st.schar>(value, "schar"));
            break;
        case _cvdef.MatrixType.CV_16U:
            sparseMat.ptr<_st.ushort>("ushort", idx0, idx1, idx2, false).set(_st.saturate_cast<_st.ushort>(value, "ushort"));
            break;
        case _cvdef.MatrixType.CV_16S:
            sparseMat.ptr<_st.short>("short", idx0, idx1, idx2, false).set(_st.saturate_cast<_st.short>(value, "short"));
            break;
        case _cvdef.MatrixType.CV_32S:
            sparseMat.ptr<_st.int>("int", idx0, idx1, idx2, false).set(_st.saturate_cast<_st.int>(value, "int"));
            break;
        case _cvdef.MatrixType.CV_32F:
            sparseMat.ptr<_st.float>("float", idx0, idx1, idx2, false).set(_st.saturate_cast<_st.float>(value, "float"));
            break;
        case _cvdef.MatrixType.CV_64F:
            sparseMat.ptr<_st.double>("double", idx0, idx1, idx2, false).set(_st.saturate_cast<_st.double>(value, "double"));
            break;
    }
}

export function cvSetReal3D(arr: _st.IOArray | _mat.Mat | _mat.SparseMat, idx0: _st.int, idx1: _st.int, idx2: _st.int, value: _st.double): void {
    if (typeof arr == typeof _mat.Mat) {
        cvSetReal3DMat(<_mat.Mat>arr, idx0, idx1,idx2, value);
    } else if (typeof arr == typeof _mat.SparseMat) {
        cvSetReal3DSparseMat(<_mat.SparseMat>arr, idx0, idx1,idx2, value);
    } else {
        throw new Error("not implemented");
    }
}
























function cvGetReal1DMat(mat: _mat.Mat, idx0: _st.int): number {
    switch (_cvdef.MatrixType.CV_MAT_TYPE(mat.type())) {
        case _cvdef.MatrixType.CV_8U:
            return <number> mat.at<_st.uchar>("uchar", idx0).get();
        case _cvdef.MatrixType.CV_8S:
            return <number> mat.at<_st.schar>("schar", idx0).get();
        case _cvdef.MatrixType.CV_16U:
            return <number> mat.at<_st.ushort>("ushort", idx0).get();
        case _cvdef.MatrixType.CV_16S:
            return <number> mat.at<_st.short>("short", idx0).get();
        case _cvdef.MatrixType.CV_32S:
            return <number> mat.at<_st.int>("int", idx0).get();
        case _cvdef.MatrixType.CV_32F:
            return <number> mat.at<_st.float>("float", idx0).get()
        case _cvdef.MatrixType.CV_64F:
            return <number> mat.at<_st.double>("double", idx0).get();
    }
    throw new Error("not implemented");
}

function cvGetReal1DSparseMat(sparseMat: _mat.SparseMat, idx0: _st.int): number {
    switch (_cvdef.MatrixType.CV_MAT_TYPE(sparseMat.type())) {
        case _cvdef.MatrixType.CV_8U:
            return <number>sparseMat.ptr<_st.uchar>("uchar", idx0, false).get();
        case _cvdef.MatrixType.CV_8S:
            return <number>sparseMat.ptr<_st.schar>("schar", idx0, false).get();
        case _cvdef.MatrixType.CV_16U:
            return <number>sparseMat.ptr<_st.ushort>("ushort", idx0, false).get();
        case _cvdef.MatrixType.CV_16S:
            return <number>sparseMat.ptr<_st.short>("short", idx0, false).get();
        case _cvdef.MatrixType.CV_32S:
            return <number>sparseMat.ptr<_st.int>("int", idx0, false).get();
        case _cvdef.MatrixType.CV_32F:
            return <number>sparseMat.ptr<_st.float>("float", idx0, false).get();
        case _cvdef.MatrixType.CV_64F:
            return <number>sparseMat.ptr<_st.double>("double", idx0, false).get();
    }
}

export function cvGetReal1D(arr: _st.IOArray | _mat.Mat | _mat.SparseMat, idx0: _st.int): number {
    if (typeof arr == typeof _mat.Mat) {
        return cvGetReal1DMat(<_mat.Mat>arr, idx0);
    } else if (typeof arr == typeof _mat.SparseMat) {
        return cvGetReal1DSparseMat(<_mat.SparseMat>arr, idx0);
    } else {
        throw new Error("not implemented");
    }
}


function cvGetReal2DMat(mat: _mat.Mat, idx0: _st.int, idx1: _st.int): number {
    switch (_cvdef.MatrixType.CV_MAT_TYPE(mat.type())) {
        case _cvdef.MatrixType.CV_8U:
            return <number>mat.at<_st.uchar>("uchar", idx0, idx1).get();
        case _cvdef.MatrixType.CV_8S:
            return <number>mat.at<_st.schar>("schar", idx0, idx1).get();
        case _cvdef.MatrixType.CV_16U:
            return <number>mat.at<_st.ushort>("ushort", idx0, idx1).get();
        case _cvdef.MatrixType.CV_16S:
            return <number>mat.at<_st.short>("short", idx0, idx1).get();
        case _cvdef.MatrixType.CV_32S:
            return <number>mat.at<_st.int>("int", idx0, idx1).get();
        case _cvdef.MatrixType.CV_32F:
            return <number>mat.at<_st.float>("float", idx0, idx1).get();
        case _cvdef.MatrixType.CV_64F:
            return <number>mat.at<_st.double>("double", idx0, idx1).get();
    }
}

function cvGetReal2DSparseMat(sparseMat: _mat.SparseMat, idx0: _st.int, idx1: _st.int): number {
    switch (_cvdef.MatrixType.CV_MAT_TYPE(sparseMat.type())) {
        case _cvdef.MatrixType.CV_8U:
            return <number>sparseMat.ptr<_st.uchar>("uchar", idx0, idx1, false).get();
        case _cvdef.MatrixType.CV_8S:
            return <number>sparseMat.ptr<_st.schar>("schar", idx0, idx1, false).get();
        case _cvdef.MatrixType.CV_16U:
            return <number>sparseMat.ptr<_st.ushort>("ushort", idx0, idx1, false).get();
        case _cvdef.MatrixType.CV_16S:
            return <number>sparseMat.ptr<_st.short>("short", idx0, idx1, false).get();
        case _cvdef.MatrixType.CV_32S:
            return <number>sparseMat.ptr<_st.int>("int", idx0, idx1, false).get();
        case _cvdef.MatrixType.CV_32F:
            return <number>sparseMat.ptr<_st.float>("float", idx0, idx1, false).get();
        case _cvdef.MatrixType.CV_64F:
            return <number>sparseMat.ptr<_st.double>("double", idx0, idx1, false).get();
    }
}

export function cvGetReal2D(arr: _st.IOArray | _mat.Mat | _mat.SparseMat, idx0: _st.int, idx1: _st.int): number {
    if (typeof arr == typeof _mat.Mat) {
        return cvGetReal2DMat(<_mat.Mat>arr, idx0, idx1);
    } else if (typeof arr == typeof _mat.SparseMat) {
        return cvGetReal2DSparseMat(<_mat.SparseMat>arr, idx0, idx1);
    } else {
        throw new Error("not implemented");
    }
}


function cvGetReal3DMat(mat: _mat.Mat, idx0: _st.int, idx1: _st.int, idx2: _st.int): number {
    switch (_cvdef.MatrixType.CV_MAT_TYPE(mat.type())) {
        case _cvdef.MatrixType.CV_8U:
            return <number>mat.at<_st.uchar>("uchar", idx0, idx1, idx2).get();
        case _cvdef.MatrixType.CV_8S:
            return <number>mat.at<_st.schar>("schar", idx0, idx1, idx2).get();
        case _cvdef.MatrixType.CV_16U:
            return <number>mat.at<_st.ushort>("ushort", idx0, idx1, idx2).get();
        case _cvdef.MatrixType.CV_16S:
            return <number>mat.at<_st.short>("short", idx0, idx1, idx2).get();
        case _cvdef.MatrixType.CV_32S:
            return <number>mat.at<_st.int>("int", idx0, idx1, idx2).get();
        case _cvdef.MatrixType.CV_32F:
            return <number>mat.at<_st.float>("float", idx0, idx1, idx2).get();
        case _cvdef.MatrixType.CV_64F:
            return <number>mat.at<_st.double>("double", idx0, idx1, idx2).get();
    }
}

function cvGetReal3DSparseMat(sparseMat: _mat.SparseMat, idx0: _st.int, idx1: _st.int, idx2: _st.int): number {
    switch (_cvdef.MatrixType.CV_MAT_TYPE(sparseMat.type())) {
        case _cvdef.MatrixType.CV_8U:
            return <number>sparseMat.ptr<_st.uchar>("uchar", idx0, idx1, idx2, false).get();
        case _cvdef.MatrixType.CV_8S:
            return <number>sparseMat.ptr<_st.schar>("schar", idx0, idx1, idx2, false).get();
        case _cvdef.MatrixType.CV_16U:
            return <number>sparseMat.ptr<_st.ushort>("ushort", idx0, idx1, idx2, false).get();
        case _cvdef.MatrixType.CV_16S:
            return <number>sparseMat.ptr<_st.short>("short", idx0, idx1, idx2, false).get();
        case _cvdef.MatrixType.CV_32S:
            return <number>sparseMat.ptr<_st.int>("int", idx0, idx1, idx2, false).get();
        case _cvdef.MatrixType.CV_32F:
            return <number>sparseMat.ptr<_st.float>("float", idx0, idx1, idx2, false).get();
        case _cvdef.MatrixType.CV_64F:
            return <number>sparseMat.ptr<_st.double>("double", idx0, idx1, idx2, false).get();
    }
}

export function cvGetReal3D(arr: _st.IOArray | _mat.Mat | _mat.SparseMat, idx0: _st.int, idx1: _st.int, idx2: _st.int): number {
    if (typeof arr == typeof _mat.Mat) {
        return cvGetReal3DMat(<_mat.Mat>arr, idx0, idx1, idx2);
    } else if (typeof arr == typeof _mat.SparseMat) {
        return cvGetReal3DSparseMat(<_mat.SparseMat>arr, idx0, idx1, idx2);
    } else {
        throw new Error("not implemented");
    }
}

//function cvSetReal1D(arr: _st.IOArray, idx: _st.int, value: _st.double ) : void
//{
//    //let type = 0;
//    //uchar * ptr;

//    if (typeof arr == typeof _mat.Mat)
//    //if (CV_IS_MAT(arr) && CV_IS_MAT_CONT(((CvMat *)arr) ->type))
//    {
//        //CvMat * mat = (CvMat *)arr;
//        let mat = <_mat.Mat>arr;

//        let type = _cvdef.MatrixType.CV_MAT_TYPE(mat.type());
//        let pix_size = _cvdef.MatrixType. CV_ELEM_SIZE(type);

//        // the first part is mul-free sufficient check
//        // that the index is within the matrix
//        if (idx >= (mat.rows.valueOf() + mat.cols.valueOf() - 1) &&
//            idx >= (mat.rows.valueOf() * mat.cols.valueOf()))
//        _base.CV_Error(_base.cv.Error.Code.StsOutOfRange, "index is out of range");

//        ptr = mat ->data.ptr + (size_t)idx* pix_size;
//    }
//    else if (!CV_IS_SPARSE_MAT(arr) || ((CvSparseMat *)arr)->dims > 1 )
//    ptr = cvPtr1D(arr, idx, &type);
//    else
//    ptr = icvGetNodePtr((CvSparseMat *)arr, &idx, &type, -1, 0);

//    if (CV_MAT_CN(type) > 1)
//        CV_Error(CV_BadNumChannels, "cvSetReal* support only single-channel arrays");

//    if (ptr)
//        icvSetReal(value, ptr, type);
//}