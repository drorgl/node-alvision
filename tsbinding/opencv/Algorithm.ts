////// <reference path="Matrix.ts" />
var alvision_module = require('../../lib/bindings.js');

import * as _constants from './Constants'
import * as _st from './static'


//module alvision {
export interface Algorithm {
    clear(): void;
    //write(fs: FileStorage): void;
    empty(): boolean;
}

export interface AlgorithmStatic {
    new (): Algorithm;
}

export var Algorithm: AlgorithmStatic = alvision_module.Algorithm;



///** @brief Reads algorithm parameters from a file storage
//*/
//virtual void read(const FileNode& fn) { (void)fn; }

///** @brief Returns true if the Algorithm is empty (e.g. in the very beginning or after unsuccessful read
// */
//virtual bool empty() const { return false; }

///** @brief Reads algorithm from the file node

// This is static template method of Algorithm. It's usage is following (in the case of SVM):
// @code
// Ptr<SVM> svm = Algorithm::read<SVM>(fn);
// @endcode
// In order to make this method work, the derived class must overwrite Algorithm::read(const
// FileNode& fn) and also have static create() method without parameters
// (or with all the optional parameters)
// */
//template < typename _Tp> static Ptr< _Tp > read(const FileNode& fn)
//    {
//        Ptr<_Tp>obj = _Tp::create();
//obj ->read(fn);
//return !obj ->empty() ? obj : Ptr<_Tp>();
//    }

///** @brief Loads algorithm from the file

// @param filename Name of the file to read.
// @param objname The optional name of the node to read (if empty, the first top-level node will be used)

// This is static template method of Algorithm. It's usage is following (in the case of SVM):
// @code
// Ptr<SVM> svm = Algorithm::load<SVM>("my_svm_model.xml");
// @endcode
// In order to make this method work, the derived class must overwrite Algorithm::read(const
// FileNode& fn).
// */
//template < typename _Tp> static Ptr< _Tp > load(const String& filename, const String& objname=String())
//    {
//        FileStorage fs(filename, FileStorage::READ);
//FileNode fn = objname.empty() ? fs.getFirstTopLevelNode() : fs[objname];
//Ptr < _Tp > obj = _Tp::create();
//obj ->read(fn);
//return !obj ->empty() ? obj : Ptr<_Tp>();
//    }

///** @brief Loads algorithm from a String

// @param strModel The string variable containing the model you want to load.
// @param objname The optional name of the node to read (if empty, the first top-level node will be used)

// This is static template method of Algorithm. It's usage is following (in the case of SVM):
// @code
// Ptr<SVM> svm = Algorithm::loadFromString<SVM>(myStringModel);
// @endcode
// */
//template < typename _Tp> static Ptr< _Tp > loadFromString(const String& strModel, const String& objname=String())
//    {
//        FileStorage fs(strModel, FileStorage::READ + FileStorage::MEMORY);
//FileNode fn = objname.empty() ? fs.getFirstTopLevelNode() : fs[objname];
//Ptr < _Tp > obj = _Tp::create();
//obj ->read(fn);
//return !obj ->empty() ? obj : Ptr<_Tp>();
//    }

///** Saves the algorithm to a file.
// In order to make this method work, the derived class must implement Algorithm::write(FileStorage& fs). */
//CV_WRAP virtual void save(const String& filename) const;

///** Returns the algorithm string identifier.
// This string is used as top level xml/yml node tag when the object is saved to a file or string. */
//CV_WRAP virtual String getDefaultName() const;
//};

//struct Param {
//    enum { INT = 0, BOOLEAN = 1, REAL = 2, STRING = 3, MAT = 4, MAT_VECTOR = 5, ALGORITHM = 6, FLOAT = 7,
//        UNSIGNED_INT = 8, UINT64 = 9, UCHAR = 11
//    };
//};
