/*M///////////////////////////////////////////////////////////////////////////////////////
//
//  IMPORTANT: READ BEFORE DOWNLOADING, COPYING, INSTALLING OR USING.
//
//  By downloading, copying, installing or using the software you agree to this license.
//  If you do not agree to this license, do not download, install,
//  copy or use the software.
//
//
//                           License Agreement
//                For Open Source Computer Vision Library
//
// Copyright (C) 2000-2008, Intel Corporation, all rights reserved.
// Copyright (C) 2009, Willow Garage Inc., all rights reserved.
// Third party copyrights are property of their respective owners.
//
// Redistribution and use in source and binary forms, with or without modification,
// are permitted provided that the following conditions are met:
//
//   * Redistribution's of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//
//   * Redistribution's in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//
//   * The name of the copyright holders may not be used to endorse or promote products
//     derived from this software without specific prior written permission.
//
// This software is provided by the copyright holders and contributors "as is" and
// any express or implied warranties, including, but not limited to, the implied
// warranties of merchantability and fitness for a particular purpose are disclaimed.
// In no event shall the Intel Corporation or contributors be liable for any direct,
// indirect, incidental, special, exemplary, or consequential damages
// (including, but not limited to, procurement of substitute goods or services;
// loss of use, data, or profits; or business interruption) however caused
// and on any theory of liability, whether in contract, strict liability,
// or tort (including negligence or otherwise) arising in any way out of
// the use of this software, even if advised of the possibility of such damage.
//
//M*/

var alvision_module = require('../../lib/bindings.js');

import * as _mat from './mat'
import * as _matx from './matx'
//import * as _st from './Constants'
import * as _st from './static'
import * as _types from './types'
import * as _core from './core'
import * as _base from './base'
//import * as _vec from './Vec'
//import * as _point from './Point'
//import * as _algorithm from './Algorithm'
//import * as _size from './Size'
//import * as _scalar from './Scalar'

//#ifndef _OPENCV_FLANN_HPP_
//#define _OPENCV_FLANN_HPP_
//
//#include "opencv2/core.hpp"
//#include "opencv2/flann/miniflann.hpp"
//#include "opencv2/flann/flann_base.hpp"

/**
@defgroup flann Clustering and Search in Multi-Dimensional Spaces

This section documents OpenCV's interface to the FLANN library. FLANN (Fast Library for Approximate
Nearest Neighbors) is a library that contains a collection of algorithms optimized for fast nearest
neighbor search in large datasets and for high dimensional features. More information about FLANN
can be found in @cite Muja2009 .
*/

//namespace cvflann
//{
//    CV_EXPORTS flann_distance_t flann_distance_type();
//    FLANN_DEPRECATED CV_EXPORTS void set_distance_type(flann_distance_t distance_type, int order);
//}


//namespace cv
//{
export module flann
{


//! @addtogroup flann
//! @{

//template <typename T> struct CvType {};
//template <> struct CvType<unsigned char> { static int type() { return CV_8U; } };
//template <> struct CvType<char> { static int type() { return CV_8S; } };
//template <> struct CvType<unsigned short> { static int type() { return CV_16U; } };
//template <> struct CvType<short> { static int type() { return CV_16S; } };
//template <> struct CvType<int> { static int type() { return CV_32S; } };
//template <> struct CvType<float> { static int type() { return CV_32F; } };
//template <> struct CvType<double> { static int type() { return CV_64F; } };


// bring the flann parameters into this namespace
//using ::cvflann::get_param;
//using ::cvflann::print_params;
//
//// bring the flann distances into this namespace
//using ::cvflann::L2_Simple;
//using ::cvflann::L2;
//using ::cvflann::L1;
//using ::cvflann::MinkowskiDistance;
//using ::cvflann::MaxDistance;
//using ::cvflann::HammingLUT;
//using ::cvflann::Hamming;
//using ::cvflann::Hamming2;
//using ::cvflann::HistIntersectionDistance;
//using ::cvflann::HellingerDistance;
//using ::cvflann::ChiSquareDistance;
//using ::cvflann::KL_Divergence;


/** @brief The FLANN nearest neighbor index class. This class is templated with the type of elements for which
the index is built.
 */
//template <typename Distance>
    //        - **KDTreeIndexParams** When passing an object of this type the index constructed will consist of
    //        a set of randomized kd-trees which will be searched in parallel. :
    //        @code            
//    class KDTreeIndexParams extends IndexParams {
//        protected trees: _st.int = 4;
//        constructor() {
//            super();
//        };//(int trees = 4 );
//    };
//        @endcode

export class GenericIndex
{
//public:
//        typedef typename Distance::ElementType ElementType;
//        typedef typename Distance::ResultType DistanceType;
//
//        /** @brief Constructs a nearest neighbor search index for a given dataset.
//
//        @param features Matrix of containing the features(points) to index. The size of the matrix is
//        num_features x feature_dimensionality and the data type of the elements in the matrix must
//        coincide with the type of the index.
//        @param params Structure containing the index parameters. The type of index that will be
//        constructed depends on the type of this parameter. See the description.
//        @param distance
//
//        The method constructs a fast search structure from a set of features using the specified algorithm
//        with specified parameters, as defined by params. params is a reference to one of the following class
//        IndexParams descendants:
//
//        - **LinearIndexParams** When passing an object of this type, the index will perform a linear,
//        brute-force search. :
//        @code
//        struct LinearIndexParams : public IndexParams
//        {
//        };
//        @endcode

//        - **KMeansIndexParams** When passing an object of this type the index constructed will be a
//        hierarchical k-means tree. :
//        @code
//        struct KMeansIndexParams : public IndexParams
//        {
//            KMeansIndexParams(
//                int branching = 32,
//                int iterations = 11,
//                flann_centers_init_t centers_init = CENTERS_RANDOM,
//                float cb_index = 0.2 );
//        };
//        @endcode
//        - **CompositeIndexParams** When using a parameters object of this type the index created
//        combines the randomized kd-trees and the hierarchical k-means tree. :
//        @code
//        struct CompositeIndexParams : public IndexParams
//        {
//            CompositeIndexParams(
//                int trees = 4,
//                int branching = 32,
//                int iterations = 11,
//                flann_centers_init_t centers_init = CENTERS_RANDOM,
//                float cb_index = 0.2 );
//        };
//        @endcode
//        - **LshIndexParams** When using a parameters object of this type the index created uses
//        multi-probe LSH (by Multi-Probe LSH: Efficient Indexing for High-Dimensional Similarity Search
//        by Qin Lv, William Josephson, Zhe Wang, Moses Charikar, Kai Li., Proceedings of the 33rd
//        International Conference on Very Large Data Bases (VLDB). Vienna, Austria. September 2007) :
//        @code
//        struct LshIndexParams : public IndexParams
//        {
//            LshIndexParams(
//                unsigned int table_number,
//                unsigned int key_size,
//                unsigned int multi_probe_level );
//        };
//        @endcode
//        - **AutotunedIndexParams** When passing an object of this type the index created is
//        automatically tuned to offer the best performance, by choosing the optimal index type
//        (randomized kd-trees, hierarchical kmeans, linear) and parameters for the dataset provided. :
//        @code
//        struct AutotunedIndexParams : public IndexParams
//        {
//            AutotunedIndexParams(
//                float target_precision = 0.9,
//                float build_weight = 0.01,
//                float memory_weight = 0,
//                float sample_fraction = 0.1 );
//        };
//        @endcode
//        - **SavedIndexParams** This object type is used for loading a previously saved index from the
//        disk. :
//        @code
//        struct SavedIndexParams : public IndexParams
//        {
//            SavedIndexParams( String filename );
//        };
//        @endcode
//         */
//        GenericIndex(const Mat& features, const ::cvflann::IndexParams& params, Distance distance = Distance());
//
//        ~GenericIndex();
//
//        /** @brief Performs a K-nearest neighbor search for a given query point using the index.
//
//        @param query The query point
//        @param indices Vector that will contain the indices of the K-nearest neighbors found. It must have
//        at least knn size.
//        @param dists Vector that will contain the distances to the K-nearest neighbors found. It must have
//        at least knn size.
//        @param knn Number of nearest neighbors to search for.
//        @param params SearchParams
//         */
//        void knnSearch(const std::vector<ElementType>& query, std::vector<int>& indices,
//                       std::vector<DistanceType>& dists, int knn, const ::cvflann::SearchParams& params);
//        void knnSearch(const Mat& queries, Mat& indices, Mat& dists, int knn, const ::cvflann::SearchParams& params);
//
//        int radiusSearch(const std::vector<ElementType>& query, std::vector<int>& indices,
//                         std::vector<DistanceType>& dists, DistanceType radius, const ::cvflann::SearchParams& params);
//        int radiusSearch(const Mat& query, Mat& indices, Mat& dists,
//                         DistanceType radius, const ::cvflann::SearchParams& params);
//
//        void save(String filename) { nnIndex->save(filename); }
//
//        int veclen() const { return nnIndex->veclen(); }
//
//        int size() const { return nnIndex->size(); }
//
//        ::cvflann::IndexParams getParameters() { return nnIndex->getParameters(); }
//
//        FLANN_DEPRECATED const ::cvflann::IndexParams* getIndexParameters() { return nnIndex->getIndexParameters(); }
//
//private:
//        ::cvflann::Index<Distance>* nnIndex;
};

//! @cond IGNORED

//#define FLANN_DISTANCE_CHECK \
//    if ( ::cvflann::flann_distance_type() != cvflann::FLANN_DIST_L2) { \
//        printf("[WARNING] You are using cv::flann::Index (or cv::flann::GenericIndex) and have also changed "\
//        "the distance using cvflann::set_distance_type. This is no longer working as expected "\
//        "(cv::flann::Index always uses L2). You should create the index templated on the distance, "\
//        "for example for L1 distance use: GenericIndex< L1<float> > \n"); \
//    }

//
//template <typename Distance>
//GenericIndex<Distance>::GenericIndex(const Mat& dataset, const ::cvflann::IndexParams& params, Distance distance)
//{
//    CV_Assert(dataset.type() == CvType<ElementType>::type());
//    CV_Assert(dataset.isContinuous());
//    ::cvflann::Matrix<ElementType> m_dataset((ElementType*)dataset.ptr<ElementType>(0), dataset.rows, dataset.cols);
//
//    nnIndex = new ::cvflann::Index<Distance>(m_dataset, params, distance);
//
//    FLANN_DISTANCE_CHECK
//
//    nnIndex->buildIndex();
//}
//
//template <typename Distance>
//GenericIndex<Distance>::~GenericIndex()
//{
//    delete nnIndex;
//}
//
//template <typename Distance>
//void GenericIndex<Distance>::knnSearch(const std::vector<ElementType>& query, std::vector<int>& indices, std::vector<DistanceType>& dists, int knn, const ::cvflann::SearchParams& searchParams)
//{
//    ::cvflann::Matrix<ElementType> m_query((ElementType*)&query[0], 1, query.size());
//    ::cvflann::Matrix<int> m_indices(&indices[0], 1, indices.size());
//    ::cvflann::Matrix<DistanceType> m_dists(&dists[0], 1, dists.size());
//
//    FLANN_DISTANCE_CHECK
//
//    nnIndex->knnSearch(m_query,m_indices,m_dists,knn,searchParams);
//}
//
//
//template <typename Distance>
//void GenericIndex<Distance>::knnSearch(const Mat& queries, Mat& indices, Mat& dists, int knn, const ::cvflann::SearchParams& searchParams)
//{
//    CV_Assert(queries.type() == CvType<ElementType>::type());
//    CV_Assert(queries.isContinuous());
//    ::cvflann::Matrix<ElementType> m_queries((ElementType*)queries.ptr<ElementType>(0), queries.rows, queries.cols);
//
//    CV_Assert(indices.type() == CV_32S);
//    CV_Assert(indices.isContinuous());
//    ::cvflann::Matrix<int> m_indices((int*)indices.ptr<int>(0), indices.rows, indices.cols);
//
//    CV_Assert(dists.type() == CvType<DistanceType>::type());
//    CV_Assert(dists.isContinuous());
//    ::cvflann::Matrix<DistanceType> m_dists((DistanceType*)dists.ptr<DistanceType>(0), dists.rows, dists.cols);
//
//    FLANN_DISTANCE_CHECK
//
//    nnIndex->knnSearch(m_queries,m_indices,m_dists,knn, searchParams);
//}
//
//template <typename Distance>
//int GenericIndex<Distance>::radiusSearch(const std::vector<ElementType>& query, std::vector<int>& indices, std::vector<DistanceType>& dists, DistanceType radius, const ::cvflann::SearchParams& searchParams)
//{
//    ::cvflann::Matrix<ElementType> m_query((ElementType*)&query[0], 1, query.size());
//    ::cvflann::Matrix<int> m_indices(&indices[0], 1, indices.size());
//    ::cvflann::Matrix<DistanceType> m_dists(&dists[0], 1, dists.size());
//
//    FLANN_DISTANCE_CHECK
//
//    return nnIndex->radiusSearch(m_query,m_indices,m_dists,radius,searchParams);
//}
//
//template <typename Distance>
//int GenericIndex<Distance>::radiusSearch(const Mat& query, Mat& indices, Mat& dists, DistanceType radius, const ::cvflann::SearchParams& searchParams)
//{
//    CV_Assert(query.type() == CvType<ElementType>::type());
//    CV_Assert(query.isContinuous());
//    ::cvflann::Matrix<ElementType> m_query((ElementType*)query.ptr<ElementType>(0), query.rows, query.cols);
//
//    CV_Assert(indices.type() == CV_32S);
//    CV_Assert(indices.isContinuous());
//    ::cvflann::Matrix<int> m_indices((int*)indices.ptr<int>(0), indices.rows, indices.cols);
//
//    CV_Assert(dists.type() == CvType<DistanceType>::type());
//    CV_Assert(dists.isContinuous());
//    ::cvflann::Matrix<DistanceType> m_dists((DistanceType*)dists.ptr<DistanceType>(0), dists.rows, dists.cols);
//
//    FLANN_DISTANCE_CHECK
//
//    return nnIndex->radiusSearch(m_query,m_indices,m_dists,radius,searchParams);
//}

//! @endcond

/**
 * @deprecated Use GenericIndex class instead
 */
//template <typename T>
class
//#ifndef _MSC_VER
// FLANN_DEPRECATED
//#endif
 Index_ {
//public:
//        typedef typename L2<T>::ElementType ElementType;
//        typedef typename L2<T>::ResultType DistanceType;
//
//    Index_(const Mat& features, const ::cvflann::IndexParams& params);
//
//    ~Index_();
//
//    void knnSearch(const std::vector<ElementType>& query, std::vector<int>& indices, std::vector<DistanceType>& dists, int knn, const ::cvflann::SearchParams& params);
//    void knnSearch(const Mat& queries, Mat& indices, Mat& dists, int knn, const ::cvflann::SearchParams& params);
//
//    int radiusSearch(const std::vector<ElementType>& query, std::vector<int>& indices, std::vector<DistanceType>& dists, DistanceType radius, const ::cvflann::SearchParams& params);
//    int radiusSearch(const Mat& query, Mat& indices, Mat& dists, DistanceType radius, const ::cvflann::SearchParams& params);
//
//    void save(String filename)
//        {
//            if (nnIndex_L1) nnIndex_L1->save(filename);
//            if (nnIndex_L2) nnIndex_L2->save(filename);
//        }
//
//    int veclen() const
//    {
//            if (nnIndex_L1) return nnIndex_L1->veclen();
//            if (nnIndex_L2) return nnIndex_L2->veclen();
//        }
//
//    int size() const
//    {
//            if (nnIndex_L1) return nnIndex_L1->size();
//            if (nnIndex_L2) return nnIndex_L2->size();
//        }
//
//        ::cvflann::IndexParams getParameters()
//        {
//            if (nnIndex_L1) return nnIndex_L1->getParameters();
//            if (nnIndex_L2) return nnIndex_L2->getParameters();
//
//        }
//
//        FLANN_DEPRECATED const ::cvflann::IndexParams* getIndexParameters()
//        {
//            if (nnIndex_L1) return nnIndex_L1->getIndexParameters();
//            if (nnIndex_L2) return nnIndex_L2->getIndexParameters();
//        }
//
//private:
//        // providing backwards compatibility for L2 and L1 distances (most common)
//        ::cvflann::Index< L2<ElementType> >* nnIndex_L2;
//        ::cvflann::Index< L1<ElementType> >* nnIndex_L1;
};

//#ifdef _MSC_VER
//template <typename T>
//class FLANN_DEPRECATED Index_;
//#endif

//! @cond IGNORED

//template <typename T>
//Index_<T>::Index_(const Mat& dataset, const ::cvflann::IndexParams& params)
//{
//    printf("[WARNING] The cv::flann::Index_<T> class is deperecated, use cv::flann::GenericIndex<Distance> instead\n");
//
//    CV_Assert(dataset.type() == CvType<ElementType>::type());
//    CV_Assert(dataset.isContinuous());
//    ::cvflann::Matrix<ElementType> m_dataset((ElementType*)dataset.ptr<ElementType>(0), dataset.rows, dataset.cols);
//
//    if ( ::cvflann::flann_distance_type() == cvflann::FLANN_DIST_L2 ) {
//        nnIndex_L1 = NULL;
//        nnIndex_L2 = new ::cvflann::Index< L2<ElementType> >(m_dataset, params);
//    }
//    else if ( ::cvflann::flann_distance_type() == cvflann::FLANN_DIST_L1 ) {
//        nnIndex_L1 = new ::cvflann::Index< L1<ElementType> >(m_dataset, params);
//        nnIndex_L2 = NULL;
//    }
//    else {
//        printf("[ERROR] cv::flann::Index_<T> only provides backwards compatibility for the L1 and L2 distances. "
//        "For other distance types you must use cv::flann::GenericIndex<Distance>\n");
//        CV_Assert(0);
//    }
//    if (nnIndex_L1) nnIndex_L1->buildIndex();
//    if (nnIndex_L2) nnIndex_L2->buildIndex();
//}
//
//template <typename T>
//Index_<T>::~Index_()
//{
//    if (nnIndex_L1) delete nnIndex_L1;
//    if (nnIndex_L2) delete nnIndex_L2;
//}
//
//template <typename T>
//void Index_<T>::knnSearch(const std::vector<ElementType>& query, std::vector<int>& indices, std::vector<DistanceType>& dists, int knn, const ::cvflann::SearchParams& searchParams)
//{
//    ::cvflann::Matrix<ElementType> m_query((ElementType*)&query[0], 1, query.size());
//    ::cvflann::Matrix<int> m_indices(&indices[0], 1, indices.size());
//    ::cvflann::Matrix<DistanceType> m_dists(&dists[0], 1, dists.size());
//
//    if (nnIndex_L1) nnIndex_L1->knnSearch(m_query,m_indices,m_dists,knn,searchParams);
//    if (nnIndex_L2) nnIndex_L2->knnSearch(m_query,m_indices,m_dists,knn,searchParams);
//}
//
//
//template <typename T>
//void Index_<T>::knnSearch(const Mat& queries, Mat& indices, Mat& dists, int knn, const ::cvflann::SearchParams& searchParams)
//{
//    CV_Assert(queries.type() == CvType<ElementType>::type());
//    CV_Assert(queries.isContinuous());
//    ::cvflann::Matrix<ElementType> m_queries((ElementType*)queries.ptr<ElementType>(0), queries.rows, queries.cols);
//
//    CV_Assert(indices.type() == CV_32S);
//    CV_Assert(indices.isContinuous());
//    ::cvflann::Matrix<int> m_indices((int*)indices.ptr<int>(0), indices.rows, indices.cols);
//
//    CV_Assert(dists.type() == CvType<DistanceType>::type());
//    CV_Assert(dists.isContinuous());
//    ::cvflann::Matrix<DistanceType> m_dists((DistanceType*)dists.ptr<DistanceType>(0), dists.rows, dists.cols);
//
//    if (nnIndex_L1) nnIndex_L1->knnSearch(m_queries,m_indices,m_dists,knn, searchParams);
//    if (nnIndex_L2) nnIndex_L2->knnSearch(m_queries,m_indices,m_dists,knn, searchParams);
//}
//
//template <typename T>
//int Index_<T>::radiusSearch(const std::vector<ElementType>& query, std::vector<int>& indices, std::vector<DistanceType>& dists, DistanceType radius, const ::cvflann::SearchParams& searchParams)
//{
//    ::cvflann::Matrix<ElementType> m_query((ElementType*)&query[0], 1, query.size());
//    ::cvflann::Matrix<int> m_indices(&indices[0], 1, indices.size());
//    ::cvflann::Matrix<DistanceType> m_dists(&dists[0], 1, dists.size());
//
//    if (nnIndex_L1) return nnIndex_L1->radiusSearch(m_query,m_indices,m_dists,radius,searchParams);
//    if (nnIndex_L2) return nnIndex_L2->radiusSearch(m_query,m_indices,m_dists,radius,searchParams);
//}
//
//template <typename T>
//int Index_<T>::radiusSearch(const Mat& query, Mat& indices, Mat& dists, DistanceType radius, const ::cvflann::SearchParams& searchParams)
//{
//    CV_Assert(query.type() == CvType<ElementType>::type());
//    CV_Assert(query.isContinuous());
//    ::cvflann::Matrix<ElementType> m_query((ElementType*)query.ptr<ElementType>(0), query.rows, query.cols);
//
//    CV_Assert(indices.type() == CV_32S);
//    CV_Assert(indices.isContinuous());
//    ::cvflann::Matrix<int> m_indices((int*)indices.ptr<int>(0), indices.rows, indices.cols);
//
//    CV_Assert(dists.type() == CvType<DistanceType>::type());
//    CV_Assert(dists.isContinuous());
//    ::cvflann::Matrix<DistanceType> m_dists((DistanceType*)dists.ptr<DistanceType>(0), dists.rows, dists.cols);
//
//    if (nnIndex_L1) return nnIndex_L1->radiusSearch(m_query,m_indices,m_dists,radius,searchParams);
//    if (nnIndex_L2) return nnIndex_L2->radiusSearch(m_query,m_indices,m_dists,radius,searchParams);
//}

//! @endcond

/** @brief Clusters features using hierarchical k-means algorithm.

@param features The points to be clustered. The matrix must have elements of type
Distance::ElementType.
@param centers The centers of the clusters obtained. The matrix must have type
Distance::ResultType. The number of rows in this matrix represents the number of clusters desired,
however, because of the way the cut in the hierarchical tree is chosen, the number of clusters
computed will be the highest number of the form (branching-1)\*k+1 that's lower than the number of
clusters desired, where branching is the tree's branching factor (see description of the
KMeansIndexParams).
@param params Parameters used in the construction of the hierarchical k-means tree.
@param d Distance to be used for clustering.

The method clusters the given feature vectors by constructing a hierarchical k-means tree and
choosing a cut in the tree that minimizes the cluster's variance. It returns the number of clusters
found.
 */
//template <typename Distance>
//int hierarchicalClustering(const Mat& features, Mat& centers, const ::cvflann::KMeansIndexParams& params,
//                           Distance d = Distance())
//{
//    typedef typename Distance::ElementType ElementType;
//    typedef typename Distance::ResultType DistanceType;
//
//    CV_Assert(features.type() == CvType<ElementType>::type());
//    CV_Assert(features.isContinuous());
//    ::cvflann::Matrix<ElementType> m_features((ElementType*)features.ptr<ElementType>(0), features.rows, features.cols);
//
//    CV_Assert(centers.type() == CvType<DistanceType>::type());
//    CV_Assert(centers.isContinuous());
//    ::cvflann::Matrix<DistanceType> m_centers((DistanceType*)centers.ptr<DistanceType>(0), centers.rows, centers.cols);
//
//    return ::cvflann::hierarchicalClustering<Distance>(m_features, m_centers, params, d);
//}

/** @deprecated
*/
//template <typename ELEM_TYPE, typename DIST_TYPE>
//FLANN_DEPRECATED int hierarchicalClustering(const Mat& features, Mat& centers, const ::cvflann::KMeansIndexParams& params)
//{
//    printf("[WARNING] cv::flann::hierarchicalClustering<ELEM_TYPE,DIST_TYPE> is deprecated, use "
//        "cv::flann::hierarchicalClustering<Distance> instead\n");
//
//    if ( ::cvflann::flann_distance_type() == cvflann::FLANN_DIST_L2 ) {
//        return hierarchicalClustering< L2<ELEM_TYPE> >(features, centers, params);
//    }
//    else if ( ::cvflann::flann_distance_type() == cvflann::FLANN_DIST_L1 ) {
//        return hierarchicalClustering< L1<ELEM_TYPE> >(features, centers, params);
//    }
//    else {
//        printf("[ERROR] cv::flann::hierarchicalClustering<ELEM_TYPE,DIST_TYPE> only provides backwards "
//        "compatibility for the L1 and L2 distances. "
//        "For other distance types you must use cv::flann::hierarchicalClustering<Distance>\n");
//        CV_Assert(0);
//    }
//}

//! @} flann

export enum flann_algorithm {
    FLANN_INDEX_LINEAR = 0,
    FLANN_INDEX_KDTREE = 1,
    FLANN_INDEX_KMEANS = 2,
    FLANN_INDEX_COMPOSITE = 3,
    FLANN_INDEX_KDTREE_SINGLE = 4,
    FLANN_INDEX_HIERARCHICAL = 5,
    FLANN_INDEX_LSH = 6,
    FLANN_INDEX_SAVED = 254,
    FLANN_INDEX_AUTOTUNED = 255,

    // deprecated constants, should use the FLANN_INDEX_* ones instead
    LINEAR = 0,
    KDTREE = 1,
    KMEANS = 2,
    COMPOSITE = 3,
    KDTREE_SINGLE = 4,
    SAVED = 254,
    AUTOTUNED = 255
};

enum flann_centers_init {
    FLANN_CENTERS_RANDOM = 0,
    FLANN_CENTERS_GONZALES = 1,
    FLANN_CENTERS_KMEANSPP = 2,
    FLANN_CENTERS_GROUPWISE = 3,

    // deprecated constants, should use the FLANN_CENTERS_* ones instead
    CENTERS_RANDOM = 0,
    CENTERS_GONZALES = 1,
    CENTERS_KMEANSPP = 2
};

enum flann_distance {
    FLANN_DIST_EUCLIDEAN = 1,
    FLANN_DIST_L2 = 1,
    FLANN_DIST_MANHATTAN = 2,
    FLANN_DIST_L1 = 2,
    FLANN_DIST_MINKOWSKI = 3,
    FLANN_DIST_MAX = 4,
    FLANN_DIST_HIST_INTERSECT = 5,
    FLANN_DIST_HELLINGER = 6,
    FLANN_DIST_CHI_SQUARE = 7,
    FLANN_DIST_CS = 7,
    FLANN_DIST_KULLBACK_LEIBLER = 8,
    FLANN_DIST_KL = 8,
    FLANN_DIST_HAMMING = 9,

    // deprecated constants, should use the FLANN_DIST_* ones instead
    EUCLIDEAN = 1,
    MANHATTAN = 2,
    MINKOWSKI = 3,
    MAX_DIST = 4,
    HIST_INTERSECT = 5,
    HELLINGER = 6,
    CS = 7,
    KL = 8,
    KULLBACK_LEIBLER = 8
};


//
export class IndexParams {
    public params: { [key: string]: any; } = {};
    //    IndexParams();
    //    ~IndexParams();
    //
    //    String getString(const String& key, const String& defaultVal=String()) const;
    //    int getInt(const String& key, int defaultVal=-1) const;
    //    double getDouble(const String& key, double defaultVal=-1) const;
    //
    //    void setString(const String& key, const String& value);
    //    void setInt(const String& key, int value);
    //    void setDouble(const String& key, double value);
    //    void setFloat(const String& key, float value);
    //    void setBool(const String& key, bool value);
    //    void setAlgorithm(int value);
    //
    //    void getAll(std::vector<String>& names,
    //                std::vector<int>& types,
    //                std::vector<String>& strValues,
    //                std::vector<double>& numValues) const;
    //
    //    void* params;
};

export class KDTreeIndexParams extends IndexParams {


    constructor(trees: _st.int = 4) {
        super();
        this.params["algorithm"] = flann_algorithm.FLANN_INDEX_KDTREE;
        this.params["trees"] = trees;
    }
}


export class LinearIndexParams extends IndexParams {
    constructor() {
        super();
        this.params["algorithm"] = flann_algorithm.FLANN_INDEX_LINEAR;
    }
};

export class CompositeIndexParams extends IndexParams {
    constructor(trees: _st.int = 4, branching: _st.int = 32, iterations: _st.int = 11,
        centers_init: flann_centers_init = flann_centers_init.FLANN_CENTERS_RANDOM, cb_index: _st.float = 0.2) {
        super();
        this.params["algorithm"] = flann_algorithm.FLANN_INDEX_KMEANS;
        // number of randomized trees to use (for kdtree)
        this.params["trees"] = trees;
        // branching factor
        this.params["branching"] = branching;
        // max iterations to perform in one kmeans clustering (kmeans tree)
        this.params["iterations"] = iterations;
        // algorithm used for picking the initial cluster centers for kmeans tree
        this.params["centers_init"] = centers_init;
        // cluster boundary index. Used when searching the kmeans tree
        this.params["cb_index"] = cb_index;
    }
};

export class AutotunedIndexParams extends IndexParams {
    constructor(target_precision: _st.float  = 0.8, build_weight: _st.float  = 0.01,
        memory_weight: _st.float  = 0, sample_fraction: _st.float  = 0.1) {
        super();
        this.params["algorithm"] = flann_algorithm.FLANN_INDEX_AUTOTUNED;
        // precision desired (used for autotuning, -1 otherwise)
        this.params["target_precision"] = target_precision;
        // build tree time weighting factor
        this.params["build_weight"] = build_weight;
        // index memory weighting factor
        this.params["memory_weight"] = memory_weight;
        // what fraction of the dataset to use for autotuning
        this.params["sample_fraction"] = sample_fraction;

    }
};

export class HierarchicalClusteringIndexParams extends IndexParams {
    constructor(branching: _st.int = 32,
        centers_init: flann_centers_init /*= cvflann::FLANN_CENTERS_RANDOM*/, trees: _st.int /* = 4*/, leaf_size: _st.int /* = 100*/) {
        super();
        this.params["algorithm"] = flann_algorithm.FLANN_INDEX_HIERARCHICAL;
        // The branching factor used in the hierarchical clustering
        this.params["branching"] = branching;
        // Algorithm used for picking the initial cluster centers
        this.params["centers_init"] = centers_init;
        // number of parallel trees to build
        this.params["trees"] = trees;
        // maximum leaf size
        this.params["leaf_size"] = leaf_size;
    }
};

export class KMeansIndexParams extends IndexParams {
    constructor(branching: _st.int  = 32, iterations: _st.int  = 11,
        centers_init: flann_centers_init   = flann_centers_init.FLANN_CENTERS_RANDOM, cb_index: _st.float  = 0.2) {
        super();
        this.params["algorithm"] = flann_algorithm.FLANN_INDEX_KMEANS;
        // branching factor
        this.params["branching"] = branching;
        // max iterations to perform in one kmeans clustering (kmeans tree)
        this.params["iterations"] = iterations;
        // algorithm used for picking the initial cluster centers for kmeans tree
        this.params["centers_init"] = centers_init;
        // cluster boundary index. Used when searching the kmeans tree
        this.params["cb_index"] = cb_index;

    }
};

export class LshIndexParams extends IndexParams {
    constructor(table_number: _st.int, key_size: _st.int, multi_probe_level: _st.int) {
        super();

        this.params["algorithm"] = flann_algorithm.FLANN_INDEX_LSH;
        // The number of hash tables to use
        this.params["table_number"] = table_number;
        // The length of the key in the hash tables
        this.params["key_size"] = key_size;
        // Number of levels to use in multi-probe (0 for standard LSH)
        this.params["multi_probe_level"] = multi_probe_level;
    }
};

export class SavedIndexParams extends IndexParams {
    constructor(filename: string) {
        super();

        this.params["algorithm"] = flann_algorithm.FLANN_INDEX_SAVED;
        this.params["filename"] = filename;
    }
};

export class SearchParams extends IndexParams {
    constructor(checks: _st.int = 32, eps: _st.float = 0, sorted: boolean = true) {
        super();
        // how many leafs to visit when searching for neighbours (-1 for unlimited)
        this.params["checks"] = checks;
        // search for eps-approximate neighbours (default: 0)
        this.params["eps"] = eps;
        // only for radius search, require neighbours sorted by distance (default: true)
        this.params["sorted"] = sorted;
    }
};




enum flann_distance_t {
    FLANN_DIST_EUCLIDEAN = 1,
    FLANN_DIST_L2 = 1,
    FLANN_DIST_MANHATTAN = 2,
    FLANN_DIST_L1 = 2,
    FLANN_DIST_MINKOWSKI = 3,
    FLANN_DIST_MAX = 4,
    FLANN_DIST_HIST_INTERSECT = 5,
    FLANN_DIST_HELLINGER = 6,
    FLANN_DIST_CHI_SQUARE = 7,
    FLANN_DIST_CS = 7,
    FLANN_DIST_KULLBACK_LEIBLER = 8,
    FLANN_DIST_KL = 8,
    FLANN_DIST_HAMMING = 9,

    // deprecated constants, should use the FLANN_DIST_* ones instead
    EUCLIDEAN = 1,
    MANHATTAN = 2,
    MINKOWSKI = 3,
    MAX_DIST = 4,
    HIST_INTERSECT = 5,
    HELLINGER = 6,
    CS = 7,
    KL = 8,
    KULLBACK_LEIBLER = 8
};

enum flann_algorithm_t {
    FLANN_INDEX_LINEAR = 0,
    FLANN_INDEX_KDTREE = 1,
    FLANN_INDEX_KMEANS = 2,
    FLANN_INDEX_COMPOSITE = 3,
    FLANN_INDEX_KDTREE_SINGLE = 4,
    FLANN_INDEX_HIERARCHICAL = 5,
    FLANN_INDEX_LSH = 6,
    FLANN_INDEX_SAVED = 254,
    FLANN_INDEX_AUTOTUNED = 255,

    // deprecated constants, should use the FLANN_INDEX_* ones instead
    LINEAR = 0,
    KDTREE = 1,
    KMEANS = 2,
    COMPOSITE = 3,
    KDTREE_SINGLE = 4,
    SAVED = 254,
    AUTOTUNED = 255
};


    interface IndexStatic {
        new (): Index;
        new (features: _st.InputArray, params: IndexParams, distType?: flann_distance /* = cvflann::FLANN_DIST_L2*/): Index;
    }




export interface Index
{
//public:


    build(features: _st.InputArray, params: IndexParams, distType?: flann_distance_t /*= cvflann::FLANN_DIST_L2*/): void;
    knnSearch(query: _st.InputArray, indices: _st.OutputArray ,
        dists: _st.OutputArray, knn: _st.int, params?: SearchParams /*=SearchParams()*/): void;

    radiusSearch(query: _st.InputArray, indices: _st.OutputArray ,
        dists: _st.OutputArray, radius: _st.double, maxResults: _st.int ,
        params?: SearchParams /*=SearchParams()*/): _st.int;

    save(filename : string): void;
    load(features: _st.InputArray , filename : string): boolean;
    release(): void;
    getDistance() : flann_distance_t;
    getAlgorithm() :flann_algorithm_t;
//
//protected:
//    cvflann::flann_distance_t distType;
//    cvflann::flann_algorithm_t algo;
//    int featureType;
//    void* index;
};

    export var Index: IndexStatic = alvision_module.flann.Index;

} 
//} // namespace cv::flann
//
//#endif
