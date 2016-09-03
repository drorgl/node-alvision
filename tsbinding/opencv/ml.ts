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
// Copyright (C) 2000, Intel Corporation, all rights reserved.
// Copyright (C) 2013, OpenCV Foundation, all rights reserved.
// Copyright (C) 2014, Itseez Inc, all rights reserved.
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
////// <reference path="Matrix.ts" />
import alvision_module from "../bindings";

//import * as _constants from './Constants'
import * as _st from './static';
import * as _mat from './Mat';
import * as _matx from './Matx';
import * as _types from './Types';
import * as _core from './Core';
import * as _base from './Base';
//import * as _scalar from './Scalar'


//#ifndef __OPENCV_ML_HPP__
//#define __OPENCV_ML_HPP__
//
//#ifdef __cplusplus
//#  include "opencv2/core.hpp"
//#endif
//
//#ifdef __cplusplus
//
//#include <float.h>
//#include <map>
//#include <iostream>

/**
  @defgroup ml Machine Learning

  The Machine Learning Library (MLL) is a set of classes and functions for statistical
  classification, regression, and clustering of data.

  Most of the classification and regression algorithms are implemented as C++ classes. As the
  algorithms have different sets of features (like an ability to handle missing measurements or
  categorical input variables), there is a little common ground between the classes. This common
  ground is defined by the class cv::ml::StatModel that all the other ML classes are derived from.

  See detailed overview here: @ref ml_intro.
 */

//namespace cv
//{

export namespace ml {

    //! @addtogroup ml
    //! @{

    /** @brief Variable types */
    export enum VariableTypes {
        VAR_NUMERICAL = 0, //!< same as VAR_ORDERED
        VAR_ORDERED = 0, //!< ordered variables
        VAR_CATEGORICAL = 1  //!< categorical variables
    };

    /** @brief %Error types */
    enum ErrorTypes {
        TEST_ERROR = 0,
        TRAIN_ERROR = 1
    };

    /** @brief Sample types */
    export enum SampleTypes {
        ROW_SAMPLE = 0, //!< each training sample is a row of samples
        COL_SAMPLE = 1  //!< each training sample occupies a column of samples
    };

    /** @brief The structure represents the logarithmic grid range of statmodel parameters.
    
    It is used for optimizing statmodel accuracy by varying model parameters, the accuracy estimate
    being computed by cross-validation.
     */
    class ParamGrid {
        //public:
        //    /** @brief Default constructor */
        //    ParamGrid();
        //    /** @brief Constructor with parameters */
        //    ParamGrid(double _minVal, double _maxVal, double _logStep);
        //
        //    double minVal; //!< Minimum value of the statmodel parameter. Default value is 0.
        //    double maxVal; //!< Maximum value of the statmodel parameter. Default value is 0.
        //    /** @brief Logarithmic step for iterating the statmodel parameter.
        //
        //    The grid determines the following iteration sequence of the statmodel parameter values:
        //    \f[(minVal, minVal*step, minVal*{step}^2, \dots,  minVal*{logStep}^n),\f]
        //    where \f$n\f$ is the maximal index satisfying
        //    \f[\texttt{minVal} * \texttt{logStep} ^n <  \texttt{maxVal}\f]
        //    The grid is logarithmic, so logStep must always be greater then 1. Default value is 1.
        //    */
        //    double logStep;
    };

    /** @brief Class encapsulating training data.
    
    Please note that the class only specifies the interface of training data, but not implementation.
    All the statistical model classes in _ml_ module accepts Ptr\<TrainData\> as parameter. In other
    words, you can create your own class derived from TrainData and pass smart pointer to the instance
    of this class into StatModel::train.
    
    @sa @ref ml_intro_data
     */
   export  interface TrainDataStatic {
        /** @brief Creates training data from in-memory arrays.

  @param samples matrix of samples. It should have CV_32F type.
  @param layout see ml::SampleTypes.
  @param responses matrix of responses. If the responses are scalar, they should be stored as a
      single row or as a single column. The matrix should have type CV_32F or CV_32S (in the
      former case the responses are considered as ordered by default; in the latter case - as
      categorical)
  @param varIdx vector specifying which variables to use for training. It can be an integer vector
      (CV_32S) containing 0-based variable indices or byte vector (CV_8U) containing a mask of
      active variables.
  @param sampleIdx vector specifying which samples to use for training. It can be an integer
      vector (CV_32S) containing 0-based sample indices or byte vector (CV_8U) containing a mask
      of training samples.
  @param sampleWeights optional vector with weights for each sample. It should have CV_32F type.
  @param varType optional vector of type CV_8U and size `<number_of_variables_in_samples> +
      <number_of_variables_in_responses>`, containing types of each input and output variable. See
      ml::VariableTypes.
   */
        create(samples: _st.InputArray, layout: SampleTypes, responses: _st.InputArray,
            varIdx?: _st.InputArray /*= noArray()*/, sampleIdx?: _st.InputArray  /*= noArray()*/,
            sampleWeights?: _st.InputArray /*= noArray()*/, varType?: _st.InputArray /*= noArray()*/): TrainData

            /** @brief Reads the dataset from a .csv file and returns the ready-to-use training data.
        
            @param filename The input file name
            @param headerLineCount The number of lines in the beginning to skip; besides the header, the
                function also skips empty lines and lines staring with `#`
            @param responseStartIdx Index of the first output variable. If -1, the function considers the
                last variable as the response
            @param responseEndIdx Index of the last output variable + 1. If -1, then there is single
                response variable at responseStartIdx.
            @param varTypeSpec The optional text string that specifies the variables' types. It has the
                format `ord[n1-n2,n3,n4-n5,...]cat[n6,n7-n8,...]`. That is, variables from `n1 to n2`
                (inclusive range), `n3`, `n4 to n5` ... are considered ordered and `n6`, `n7 to n8` ... are
                considered as categorical. The range `[n1..n2] + [n3] + [n4..n5] + ... + [n6] + [n7..n8]`
                should cover all the variables. If varTypeSpec is not specified, then algorithm uses the
                following rules:
                - all input variables are considered ordered by default. If some column contains has non-
                  numerical values, e.g. 'apple', 'pear', 'apple', 'apple', 'mango', the corresponding
                  variable is considered categorical.
                - if there are several output variables, they are all considered as ordered. Error is
                  reported when non-numerical values are used.
                - if there is a single output variable, then if its values are non-numerical or are all
                  integers, then it's considered categorical. Otherwise, it's considered ordered.
            @param delimiter The character used to separate values in each line.
            @param missch The character used to specify missing measurements. It should not be a digit.
                Although it's a non-numerical value, it surely does not affect the decision of whether the
                variable ordered or categorical.
            @note If the dataset only contains input variables and no responses, use responseStartIdx = -2
                and responseEndIdx = 0. The output variables vector will just contain zeros.
             */

        loadFromCSV(filename : string,
            headerLineCount : _st.int,
            responseStartIdx? : _st.int /*= -1*/,
            responseEndIdx? : _st.int /*= -1*/,
                                    varTypeSpec? : string /*=String()*/,
            delimiter? : _st.char /*= ','*/,
            missch? : _st.char /*= '?'*/): TrainData;


        getSubVector(vec: _mat.Mat, idx: _mat.Mat): _mat.Mat;
    }

    export interface TrainData {
        //public:
        //    static inline float missingValue() { return FLT_MAX; }
        //    virtual ~TrainData();
        //
        getLayout(): SampleTypes;
          getNTrainSamples() : _st.int;
          getNTestSamples() : _st.int;
          getNSamples() : _st.int;
          getNVars() : _st.int;
          getNAllVars() : _st.int;
        
          //getSample(varIdx: _st.InputArray, sidx: _st.int , float* buf): void;
          getSamples(): _mat.Mat;
          getMissing() : _mat.Mat;
        
            /** @brief Returns matrix of train samples
        
            @param layout The requested layout. If it's different from the initial one, the matrix is
                transposed. See ml::SampleTypes.
            @param compressSamples if true, the function returns only the training samples (specified by
                sampleIdx)
            @param compressVars if true, the function returns the shorter training samples, containing only
                the active variables.
        
            In current implementation the function tries to avoid physical data copying and returns the
            matrix stored inside TrainData (unless the transposition or compression is needed).
             */
          getTrainSamples(layout?: _st.int /*= ROW_SAMPLE*/,
              compressSamples?: boolean /*= true*/,
              compressVars? : boolean /*= true*/)   : _mat.Mat;
        
            /** @brief Returns the vector of responses
        
            The function returns ordered or the original categorical responses. Usually it's used in
            regression algorithms.
             */
            getTrainResponses() : _mat.Mat
        
            /** @brief Returns the vector of normalized categorical responses
        
            The function returns vector of responses. Each response is integer from `0` to `<number of
            classes>-1`. The actual label value can be retrieved then from the class label vector, see
            TrainData::getClassLabels.
             */
            getTrainNormCatResponses(): _mat.Mat;
            getTestResponses() : _mat.Mat;
            getTestNormCatResponses() : _mat.Mat;
            getResponses() : _mat.Mat;
            getNormCatResponses() : _mat.Mat;
            getSampleWeights() : _mat.Mat;
            getTrainSampleWeights() : _mat.Mat;
            getTestSampleWeights() : _mat.Mat;
            getVarIdx() : _mat.Mat;
            getVarType() : _mat.Mat;
            getResponseType() : _mat.Mat;
            getTrainSampleIdx() : _mat.Mat;
            getTestSampleIdx() : _mat.Mat;
            //getValues(vi: _st.int, sidx: _st.InputArray , float* values): void;
            //getNormCatValues(vi: _st.int, sidx: _st.InputArray , int* values): void;
            getDefaultSubstValues(): _mat.Mat;
        
            getCatCount(vi: _st.int ): _st.int;
        
            /** @brief Returns the vector of class labels
        
            The function returns vector of unique labels occurred in the responses.
             */
            getClassLabels() : _mat.Mat;
        
            getCatOfs() : _mat.Mat;
            getCatMap() : _mat.Mat;
        
            /** @brief Splits the training data into the training and test parts
            @sa TrainData::setTrainTestSplitRatio
             */
            setTrainTestSplit(count: _st.int , shuffle? : boolean /*= true*/): void;

            /** @brief Splits the training data into the training and test parts
        
            The function selects a subset of specified relative size and then returns it as the training
            set. If the function is not called, all the data is used for training. Please, note that for
            each of TrainData::getTrain\* there is corresponding TrainData::getTest\*, so that the test
            subset can be retrieved and processed as well.
            @sa TrainData::setTrainTestSplit
             */
            setTrainTestSplitRatio(ratio : _st.double, shuffle ? : boolean /*= true*/) : void;
            shuffleTrainTest() : void;
        
            /** @brief Returns matrix of test samples */
            getTestSamples() : _mat.Mat;
        
            
        

    };

    export var TrainData: TrainDataStatic = alvision_module.TrainData;

    export enum StatModelFlags {
        UPDATE_MODEL = 1,
        RAW_OUTPUT = 1, //!< makes the method return the raw results (the sum), not the class label
        COMPRESSED_INPUT = 2,
        PREPROCESSED_INPUT = 4
    };
    /** @brief Base class for statistical models in OpenCV ML.
     */
    export interface StatModel extends _core.Algorithm {
        //public:
            /** Predict options */
           
        
            /** @brief Returns the number of variables in training samples */
        getVarCount(): _st.int;
        
        empty(): boolean;
        
            /** @brief Returns true if the model is trained */
        isTrained(): boolean;
            /** @brief Returns true if the model is classifier */
        isClassifier(): boolean;
        
            /** @brief Trains the statistical model
        
            @param trainData training data that can be loaded from file using TrainData::loadFromCSV or
                created with TrainData::create.
            @param flags optional flags, depending on the model. Some of the models can be updated with the
                new training samples, not completely overwritten (such as NormalBayesClassifier or ANN_MLP).
             */
        train(trainData: TrainData, flags?: _st.int /*= 0*/) : boolean;
        
            /** @brief Trains the statistical model
        
            @param samples training samples
            @param layout See ml::SampleTypes.
            @param responses vector of responses associated with the training samples.
            */
        train(samples: _st.InputArray, layout: _st.int, responses: _st.InputArray ): boolean;
        
            /** @brief Computes error on the training or test dataset
        
            @param data the training data
            @param test if true, the error is computed over the test subset of the data, otherwise it's
                computed over the training subset of the data. Please note that if you loaded a completely
                different dataset to evaluate already trained classifier, you will probably want not to set
                the test subset at all with TrainData::setTrainTestSplitRatio and specify test=false, so
                that the error is computed for the whole new set. Yes, this sounds a bit confusing.
            @param resp the optional output responses.
        
            The method uses StatModel::predict to compute the error. For regression models the error is
            computed as RMS, for classifiers - as a percent of missclassified samples (0%-100%).
             */
        calcError(data: TrainData, test: boolean, resp: _st.OutputArray ) : _st.float ;
        
            /** @brief Predicts response(s) for the provided sample(s)
        
            @param samples The input samples, floating-point matrix
            @param results The optional output matrix of results.
            @param flags The optional flags, model-dependent. See cv::ml::StatModel::Flags.
             */
        predict(samples: _st.InputArray, results?: _st.OutputArray /*= noArray()*/, flags?: _st.int /*= 0*/): _st.float;
        //
        //    /** @brief Create and train model with default parameters
        //
        //    The class must implement static `create()` method with no parameters or with all default parameter values
        //    */
        //    template<typename _Tp> static Ptr<_Tp> train(const Ptr<TrainData>& data, int flags=0)
        //    {
        //        Ptr<_Tp> model = _Tp::create();
        //        return !model.empty() && model->train(data, flags) ? model : Ptr<_Tp>();
        //    }
    };

    /****************************************************************************************\
    *                                 Normal Bayes Classifier                                *
    \****************************************************************************************/

    /** @brief Bayes classifier for normally distributed data.
    
    @sa @ref ml_intro_bayes
     */
    interface NormalBayesClassifierStatic {
            /** Creates empty model
            Use StatModel::train to train the model after creation. */
        create(): NormalBayesClassifier;
    }

    export interface NormalBayesClassifier extends StatModel {
        //public:
        //    /** @brief Predicts the response for sample(s).
        //
        //    The method estimates the most probable classes for input vectors. Input vectors (one or more)
        //    are stored as rows of the matrix inputs. In case of multiple input vectors, there should be one
        //    output vector outputs. The predicted class for a single input vector is returned by the method.
        //    The vector outputProbs contains the output probabilities corresponding to each element of
        //    result.
        //     */
        //    float predictProb( InputArray inputs, OutputArray outputs,
        //                               OutputArray outputProbs, int flags=0 ) const = 0;
        //
       
    };

    export var NormalBayesClassifier: NormalBayesClassifierStatic = alvision_module.NormalBayesClassifier;

    /****************************************************************************************\
    *                          K-Nearest Neighbour Classifier                                *
    \****************************************************************************************/

    /** @brief The class implements K-Nearest Neighbors model
    
    @sa @ref ml_intro_knn
     */

     
         /** @brief Implementations of KNearest algorithm
            */
         export enum KNearestTypes
         {
             BRUTE_FORCE=1,
             KDTREE=2
         };
     

    interface KNearestStatic {
            /** @brief Creates the empty model
        
            The static method creates empty %KNearest classifier. It should be then trained using StatModel::train method.
             */
        create(): KNearest;
    }
    export interface KNearest extends StatModel {
        //public:
        
            /** Default number of neighbors to use in predict method. */
            /** @see setDefaultK */
        getDefaultK(): _st.int;
            /** @copybrief getDefaultK @see getDefaultK */
        setDefaultK(val: _st.int): void;
        
            /** Whether classification or regression model should be trained. */
            /** @see setIsClassifier */
        getIsClassifier(): boolean;
            /** @copybrief getIsClassifier @see getIsClassifier */
        setIsClassifier( val : boolean): void;
        
            /** Parameter for KDTree implementation. */
            /** @see setEmax */
        getEmax(): _st.int;
            /** @copybrief getEmax @see getEmax */
        setEmax(val: _st.int): void;
        
            /** %Algorithm type, one of KNearest::Types. */
            /** @see setAlgorithmType */
        getAlgorithmType(): _st.int;
        /** @copybrief getAlgorithmType @see getAlgorithmType */
        setAlgorithmType(val: KNearestTypes | _st.int): void;
        
            /** @brief Finds the neighbors and predicts responses for input vectors.
        
            @param samples Input samples stored by rows. It is a single-precision floating-point matrix of
                `<number_of_samples> * k` size.
            @param k Number of used nearest neighbors. Should be greater than 1.
            @param results Vector with results of prediction (regression or classification) for each input
                sample. It is a single-precision floating-point vector with `<number_of_samples>` elements.
            @param neighborResponses Optional output values for corresponding neighbors. It is a single-
                precision floating-point matrix of `<number_of_samples> * k` size.
            @param dist Optional output distances from the input vectors to the corresponding neighbors. It
                is a single-precision floating-point matrix of `<number_of_samples> * k` size.
        
            For each input vector (a row of the matrix samples), the method finds the k nearest neighbors.
            In case of regression, the predicted result is a mean value of the particular vector's neighbor
            responses. In case of classification, the class is determined by voting.
        
            For each input vector, the neighbors are sorted by their distances to the vector.
        
            In case of C++ interface you can use output pointers to empty matrices and the function will
            allocate memory itself.
        
            If only a single input vector is passed, all output matrices are optional and the predicted
            value is returned by the method.
        
            The function is parallelized with the TBB library.
             */
        findNearest(samples: _st.InputArray, k: _st.int ,
            results: _st.OutputArray ,
            neighborResponses?: _st.OutputArray /*= noArray()*/,
            dist?: _st.OutputArray /*= noArray()*/): _st.float;
       
        
    };
    export var KNearest: KNearestStatic = alvision_module.KNearest;

    /****************************************************************************************\
    *                                   Support Vector Machines                              *
    \****************************************************************************************/

        //! %SVM type
    export enum SVMTypes {
        /** C-Support Vector Classification. n-class classification (n \f$\geq\f$ 2), allows
        imperfect separation of classes with penalty multiplier C for outliers. */
        C_SVC = 100,
        /** \f$\nu\f$-Support Vector Classification. n-class classification with possible
        imperfect separation. Parameter \f$\nu\f$ (in the range 0..1, the larger the value, the smoother
        the decision boundary) is used instead of C. */
        NU_SVC = 101,
        /** Distribution Estimation (One-class %SVM). All the training data are from
        the same class, %SVM builds a boundary that separates the class from the rest of the feature
        space. */
        ONE_CLASS = 102,
        /** \f$\epsilon\f$-Support Vector Regression. The distance between feature vectors
        from the training set and the fitting hyper-plane must be less than p. For outliers the
        penalty multiplier C is used. */
        EPS_SVR = 103,
        /** \f$\nu\f$-Support Vector Regression. \f$\nu\f$ is used instead of p.
        See @cite LibSVM for details. */
        NU_SVR = 104
    }

    
            /** @brief %SVM kernel type
        
            A comparison of different kernels on the following 2D test case with four classes. Four
            SVM::C_SVC SVMs have been trained (one against rest) with auto_train. Evaluation on three
            different kernels (SVM::CHI2, SVM::INTER, SVM::RBF). The color depicts the class with max score.
            Bright means max-score \> 0, dark means max-score \< 0.
            ![image](pics/SVM_Comparison.png)
            */
    export enum SVMKernelTypes {
        /** Returned by SVM::getKernelType in case when custom kernel has been set */
        CUSTOM = -1,
        /** Linear kernel. No mapping is done, linear discrimination (or regression) is
        done in the original feature space. It is the fastest option. \f$K(x_i, x_j) = x_i^T x_j\f$. */
        LINEAR = 0,
        /** Polynomial kernel:
        \f$K(x_i, x_j) = (\gamma x_i^T x_j + coef0)^{degree}, \gamma > 0\f$. */
        POLY = 1,
        /** Radial basis function (RBF), a good choice in most cases.
        \f$K(x_i, x_j) = e^{-\gamma ||x_i - x_j||^2}, \gamma > 0\f$. */
        RBF = 2,
        /** Sigmoid kernel: \f$K(x_i, x_j) = \tanh(\gamma x_i^T x_j + coef0)\f$. */
        SIGMOID = 3,
        /** Exponential Chi2 kernel, similar to the RBF kernel:
        \f$K(x_i, x_j) = e^{-\gamma \chi^2(x_i,x_j)}, \chi^2(x_i,x_j) = (x_i-x_j)^2/(x_i+x_j), \gamma > 0\f$. */
        CHI2 = 4,
        /** Histogram intersection kernel. A fast kernel. \f$K(x_i, x_j) = min(x_i,x_j)\f$. */
        INTER = 5
    }

            interface SVMKernel extends _core.Algorithm
            {
                getType(): _st.int;
                //calc(int vcount, int n, const float* vecs, const float* another, float* results): void;
            };
        

    /** @brief Support Vector Machines.
    
    @sa @ref ml_intro_svm
     */
    interface SVMStatic {
        /** @brief Generates a grid for %SVM parameters.
    
        @param param_id %SVM parameters IDs that must be one of the SVM::ParamTypes. The grid is
        generated for the parameter with this ID.
    
        The function generates a grid for the specified parameter of the %SVM algorithm. The grid may be
        passed to the function SVM::trainAuto.
         */
        getDefaultGrid(param_id: _st.int): ParamGrid;


        /** Creates empty model.
        Use StatModel::train to train the model. Since %SVM has several parameters, you may want to
        find the best parameters for your problem, it can be done with SVM::trainAuto. */
        create(): SVM;

        /** @brief Loads and creates a serialized svm from a file
         *
         * Use SVM::save to serialize and store an SVM to disk.
         * Load the SVM from this file again, by calling this function with the path to the file.
         *
         * @param filepath path to serialized svm
         */
        load(filepath: string): SVM;


    }

    export interface SVM extends StatModel {
        //public:
        //
        
            /** Type of a %SVM formulation.
            See SVM::Types. Default value is SVM::C_SVC. */
            /** @see setType */
        getType(): _st.int;
            /** @copybrief getType @see getType */
        setType(val: _st.int): void;
        
            /** Parameter \f$\gamma\f$ of a kernel function.
            For SVM::POLY, SVM::RBF, SVM::SIGMOID or SVM::CHI2. Default value is 1. */
            /** @see setGamma */
        getGamma(): _st.double;
            /** @copybrief getGamma @see getGamma */
        setGamma(val: _st.double): void;
        
            /** Parameter _coef0_ of a kernel function.
            For SVM::POLY or SVM::SIGMOID. Default value is 0.*/
            /** @see setCoef0 */
        getCoef0(): _st.double;
            /** @copybrief getCoef0 @see getCoef0 */
        setCoef0(val: _st.double): void;
        
            /** Parameter _degree_ of a kernel function.
            For SVM::POLY. Default value is 0. */
            /** @see setDegree */
        getDegree(): _st.double 
            /** @copybrief getDegree @see getDegree */
        setDegree(val: _st.double): void;
        
            /** Parameter _C_ of a %SVM optimization problem.
            For SVM::C_SVC, SVM::EPS_SVR or SVM::NU_SVR. Default value is 0. */
            /** @see setC */
        getC(): _st.double 
            /** @copybrief getC @see getC */
        setC(val: _st.double): void;
        
            /** Parameter \f$\nu\f$ of a %SVM optimization problem.
            For SVM::NU_SVC, SVM::ONE_CLASS or SVM::NU_SVR. Default value is 0. */
            /** @see setNu */
        getNu() : _st.double;
            /** @copybrief getNu @see getNu */
        setNu(val: _st.double ) : void ;
        
            /** Parameter \f$\epsilon\f$ of a %SVM optimization problem.
            For SVM::EPS_SVR. Default value is 0. */
            /** @see setP */
        getP() : _st.double;
            /** @copybrief getP @see getP */
        setP(val: _st.double) : void ;
        
            /** Optional weights in the SVM::C_SVC problem, assigned to particular classes.
            They are multiplied by _C_ so the parameter _C_ of class _i_ becomes `classWeights(i) * C`. Thus
            these weights affect the misclassification penalty for different classes. The larger weight,
            the larger penalty on misclassification of data from the corresponding class. Default value is
            empty Mat. */
            /** @see setClassWeights */
        getClassWeights() : _mat.Mat;
            /** @copybrief getClassWeights @see getClassWeights */
        setClassWeights(val: _mat.Mat) : void ;
        
            /** Termination criteria of the iterative %SVM training procedure which solves a partial
            case of constrained quadratic optimization problem.
            You can specify tolerance and/or the maximum number of iterations. Default value is
            `TermCriteria( TermCriteria::MAX_ITER + TermCriteria::EPS, 1000, FLT_EPSILON )`; */
            /** @see setTermCriteria */
        getTermCriteria() : _types.TermCriteria;
            /** @copybrief getTermCriteria @see getTermCriteria */
        setTermCriteria(val : _types.TermCriteria ) : void ;
        
            /** Type of a %SVM kernel.
            See SVM::KernelTypes. Default value is SVM::RBF. */
        getKernelType() : _st.int;
        
            /** Initialize with one of predefined kernels.
            See SVM::KernelTypes. */
        setKernel(kernelType : _st.int ) : void ;
        
            /** Initialize with custom kernel.
            See SVM::Kernel class for implementation details */
        setCustomKernel(_kernel : SVMKernel) : void ;
        //
        
        
        //
        //    //! %SVM params type
        //    enum ParamTypes {
        //        C=0,
        //        GAMMA=1,
        //        P=2,
        //        NU=3,
        //        COEF=4,
        //        DEGREE=5
        //    };
        //
            /** @brief Trains an %SVM with optimal parameters.
        
            @param data the training data that can be constructed using TrainData::create or
                TrainData::loadFromCSV.
            @param kFold Cross-validation parameter. The training set is divided into kFold subsets. One
                subset is used to test the model, the others form the train set. So, the %SVM algorithm is
                executed kFold times.
            @param Cgrid grid for C
            @param gammaGrid grid for gamma
            @param pGrid grid for p
            @param nuGrid grid for nu
            @param coeffGrid grid for coeff
            @param degreeGrid grid for degree
            @param balanced If true and the problem is 2-class classification then the method creates more
                balanced cross-validation subsets that is proportions between classes in subsets are close
                to such proportion in the whole train dataset.
        
            The method trains the %SVM model automatically by choosing the optimal parameters C, gamma, p,
            nu, coef0, degree. Parameters are considered optimal when the cross-validation
            estimate of the test set error is minimal.
        
            If there is no need to optimize a parameter, the corresponding grid step should be set to any
            value less than or equal to 1. For example, to avoid optimization in gamma, set `gammaGrid.step
            = 0`, `gammaGrid.minVal`, `gamma_grid.maxVal` as arbitrary numbers. In this case, the value
            `Gamma` is taken for gamma.
        
            And, finally, if the optimization in a parameter is required but the corresponding grid is
            unknown, you may call the function SVM::getDefaultGrid. To generate a grid, for example, for
            gamma, call `SVM::getDefaultGrid(SVM::GAMMA)`.
        
            This function works for the classification (SVM::C_SVC or SVM::NU_SVC) as well as for the
            regression (SVM::EPS_SVR or SVM::NU_SVR). If it is SVM::ONE_CLASS, no optimization is made and
            the usual %SVM with parameters specified in params is executed.
             */
        trainAuto(data : TrainData, kFold? : _st.int /*= 10*/,
             Cgrid?     : ParamGrid /*= SVM.getDefaultGrid(SVM::C)     */,
             gammaGrid? : ParamGrid /*= SVM.getDefaultGrid(SVM::GAMMA) */,
             pGrid?     : ParamGrid /*= SVM.getDefaultGrid(SVM::P)     */,
             nuGrid?    : ParamGrid /*= SVM.getDefaultGrid(SVM::NU)    */,
             coeffGrid? : ParamGrid /*= SVM.getDefaultGrid(SVM::COEF)  */,
             degreeGrid?: ParamGrid /*= SVM.getDefaultGrid(SVM::DEGREE)*/,
             balanced? : boolean /*= false*/) : boolean;
        
            /** @brief Retrieves all the support vectors
        
            The method returns all the support vectors as a floating-point matrix, where support vectors are
            stored as matrix rows.
             */
        getSupportVectors(): _mat.Mat;
        
            /** @brief Retrieves all the uncompressed support vectors of a linear %SVM
        
            The method returns all the uncompressed support vectors of a linear %SVM that the compressed
            support vector, used for prediction, was derived from. They are returned in a floating-point
            matrix, where the support vectors are stored as matrix rows.
             */
        getUncompressedSupportVectors(): _mat.Mat;
        
            /** @brief Retrieves the decision function
        
            @param i the index of the decision function. If the problem solved is regression, 1-class or
                2-class classification, then there will be just one decision function and the index should
                always be 0. Otherwise, in the case of N-class classification, there will be \f$N(N-1)/2\f$
                decision functions.
            @param alpha the optional output vector for weights, corresponding to different support vectors.
                In the case of linear %SVM all the alpha's will be 1's.
            @param svidx the optional output vector of indices of support vectors within the matrix of
                support vectors (which can be retrieved by SVM::getSupportVectors). In the case of linear
                %SVM each decision function consists of a single "compressed" support vector.
        
            The method returns rho parameter of the decision function, a scalar subtracted from the weighted
            sum of kernel responses.
             */
        getDecisionFunction(i: _st.int, alpha: _st.OutputArray, svidx: _st.OutputArray ): _st.double;
        
    };

    export var SVM: SVMStatic = alvision_module.SVM;

    /****************************************************************************************\
    *                              Expectation - Maximization                                *
    \****************************************************************************************/



      //! Type of covariation matrices
           export enum EMTypes {
                /** A scaled identity matrix \f$\mu_k * I\f$. There is the only
                parameter \f$\mu_k\f$ to be estimated for each matrix. The option may be used in special cases,
                when the constraint is relevant, or as a first step in the optimization (for example in case
                when the data is preprocessed with PCA). The results of such preliminary estimation may be
                passed again to the optimization procedure, this time with
                covMatType=EM::COV_MAT_DIAGONAL. */
                COV_MAT_SPHERICAL=0,
                /** A diagonal matrix with positive diagonal elements. The number of
                free parameters is d for each matrix. This is most commonly used option yielding good
                estimation results. */
                COV_MAT_DIAGONAL=1,
                /** A symmetric positively defined matrix. The number of free
                parameters in each matrix is about \f$d^2/2\f$. It is not recommended to use this option, unless
                there is pretty accurate initial estimation of the parameters and/or a huge number of
                training samples. */
                COV_MAT_GENERIC=2,
                COV_MAT_DEFAULT=COV_MAT_DIAGONAL
            };
        
            //! Default parameters
            export enum EMDefault {DEFAULT_NCLUSTERS=5, DEFAULT_MAX_ITERS=100};
        
            //! The initial step
            export enum EMStartStep {START_E_STEP=1, START_M_STEP=2, START_AUTO_STEP=0};
        

    /** @brief The class implements the Expectation Maximization algorithm.
    
    @sa @ref ml_intro_em
     */
            interface EMStatic {
                /** Creates empty %EM model.
            The model should be trained then using StatModel::train(traindata, flags) method. Alternatively, you
            can use one of the EM::train\* methods or load it from file using Algorithm::load\<EM\>(filename).
             */
                create(): EM;
            }

            export interface EM extends StatModel {
                //public:
        
                /** The number of mixture components in the Gaussian mixture model.
                Default value of the parameter is EM::DEFAULT_NCLUSTERS=5. Some of %EM implementation could
                determine the optimal number of mixtures within a specified value range, but that is not the
                case in ML yet. */
                /** @see setClustersNumber */
                getClustersNumber(): _st.int;
                /** @copybrief getClustersNumber @see getClustersNumber */
                setClustersNumber(val: _st.int): void;
        
                /** Constraint on covariance matrices which defines type of matrices.
                See EM::Types. */
                /** @see setCovarianceMatrixType */
                getCovarianceMatrixType(): _st.int;
                /** @copybrief getCovarianceMatrixType @see getCovarianceMatrixType */
                setCovarianceMatrixType(val: _st.int): void;
        
                /** The termination criteria of the %EM algorithm.
                The %EM algorithm can be terminated by the number of iterations termCrit.maxCount (number of
                M-steps) or when relative change of likelihood logarithm is less than termCrit.epsilon. Default
                maximum number of iterations is EM::DEFAULT_MAX_ITERS=100. */
                /** @see setTermCriteria */
                getTermCriteria(): _types.TermCriteria;
                /** @copybrief getTermCriteria @see getTermCriteria */
                setTermCriteria(val: _types.TermCriteria): void;
        
                /** @brief Returns weights of the mixtures
            
                Returns vector with the number of elements equal to the number of mixtures.
                 */
                getWeights(): _mat.Mat;
                /** @brief Returns the cluster centers (means of the Gaussian mixture)
            
                Returns matrix with the number of rows equal to the number of mixtures and number of columns
                equal to the space dimensionality.
                 */
                getMeans(): _mat.Mat;
                /** @brief Returns covariation matrices
            
                Returns vector of covariation matrices. Number of matrices is the number of gaussian mixtures,
                each matrix is a square floating-point matrix NxN, where N is the space dimensionality.
                 */
                getCovs(cb: (covs: Array<_mat.Mat>) => void): void;
        
                /** @brief Returns a likelihood logarithm value and an index of the most probable mixture component
                for the given sample.
            
                @param sample A sample for classification. It should be a one-channel matrix of
                    \f$1 \times dims\f$ or \f$dims \times 1\f$ size.
                @param probs Optional output matrix that contains posterior probabilities of each component
                    given the sample. It has \f$1 \times nclusters\f$ size and CV_64FC1 type.
            
                The method returns a two-element double vector. Zero element is a likelihood logarithm value for
                the sample. First element is an index of the most probable mixture component for the given
                sample.
                 */
                predict2(sample: _st.InputArray, probs: _st.OutputArray): _matx.Vecd;
        
                /** @brief Estimate the Gaussian mixture parameters from a samples set.
            
                This variation starts with Expectation step. Initial values of the model parameters will be
                estimated by the k-means algorithm.
            
                Unlike many of the ML models, %EM is an unsupervised learning algorithm and it does not take
                responses (class labels or function values) as input. Instead, it computes the *Maximum
                Likelihood Estimate* of the Gaussian mixture parameters from an input sample set, stores all the
                parameters inside the structure: \f$p_{i,k}\f$ in probs, \f$a_k\f$ in means , \f$S_k\f$ in
                covs[k], \f$\pi_k\f$ in weights , and optionally computes the output "class label" for each
                sample: \f$\texttt{labels}_i=\texttt{arg max}_k(p_{i,k}), i=1..N\f$ (indices of the most
                probable mixture component for each sample).
            
                The trained model can be used further for prediction, just like any other classifier. The
                trained model is similar to the NormalBayesClassifier.
            
                @param samples Samples from which the Gaussian mixture model will be estimated. It should be a
                    one-channel matrix, each row of which is a sample. If the matrix does not have CV_64F type
                    it will be converted to the inner matrix of such type for the further computing.
                @param logLikelihoods The optional output matrix that contains a likelihood logarithm value for
                    each sample. It has \f$nsamples \times 1\f$ size and CV_64FC1 type.
                @param labels The optional output "class label" for each sample:
                    \f$\texttt{labels}_i=\texttt{arg max}_k(p_{i,k}), i=1..N\f$ (indices of the most probable
                    mixture component for each sample). It has \f$nsamples \times 1\f$ size and CV_32SC1 type.
                @param probs The optional output matrix that contains posterior probabilities of each Gaussian
                    mixture component given the each sample. It has \f$nsamples \times nclusters\f$ size and
                    CV_64FC1 type.
                 */
                trainEM(samples: _st.InputArray,
                    logLikelihoods?: _st.OutputArray /*= noArray()*/,
                    labels?: _st.OutputArray /*= noArray()*/,
                    probs?: _st.OutputArray /*= noArray()*/): boolean;
        
                /** @brief Estimate the Gaussian mixture parameters from a samples set.
            
                This variation starts with Expectation step. You need to provide initial means \f$a_k\f$ of
                mixture components. Optionally you can pass initial weights \f$\pi_k\f$ and covariance matrices
                \f$S_k\f$ of mixture components.
            
                @param samples Samples from which the Gaussian mixture model will be estimated. It should be a
                    one-channel matrix, each row of which is a sample. If the matrix does not have CV_64F type
                    it will be converted to the inner matrix of such type for the further computing.
                @param means0 Initial means \f$a_k\f$ of mixture components. It is a one-channel matrix of
                    \f$nclusters \times dims\f$ size. If the matrix does not have CV_64F type it will be
                    converted to the inner matrix of such type for the further computing.
                @param covs0 The vector of initial covariance matrices \f$S_k\f$ of mixture components. Each of
                    covariance matrices is a one-channel matrix of \f$dims \times dims\f$ size. If the matrices
                    do not have CV_64F type they will be converted to the inner matrices of such type for the
                    further computing.
                @param weights0 Initial weights \f$\pi_k\f$ of mixture components. It should be a one-channel
                    floating-point matrix with \f$1 \times nclusters\f$ or \f$nclusters \times 1\f$ size.
                @param logLikelihoods The optional output matrix that contains a likelihood logarithm value for
                    each sample. It has \f$nsamples \times 1\f$ size and CV_64FC1 type.
                @param labels The optional output "class label" for each sample:
                    \f$\texttt{labels}_i=\texttt{arg max}_k(p_{i,k}), i=1..N\f$ (indices of the most probable
                    mixture component for each sample). It has \f$nsamples \times 1\f$ size and CV_32SC1 type.
                @param probs The optional output matrix that contains posterior probabilities of each Gaussian
                    mixture component given the each sample. It has \f$nsamples \times nclusters\f$ size and
                    CV_64FC1 type.
                */
                trainE(samples: _st.InputArray, means0: _st.InputArray,
                    covs0?: _st.InputArray /*= noArray()*/,
                    weights0?: _st.InputArray /*= noArray()*/,
                    logLikelihoods?: _st.OutputArray /*= noArray()*/,
                    labels?: _st.OutputArray /*= noArray()*/,
                    probs?: _st.OutputArray /*= noArray()*/): boolean;
        
                /** @brief Estimate the Gaussian mixture parameters from a samples set.
            
                This variation starts with Maximization step. You need to provide initial probabilities
                \f$p_{i,k}\f$ to use this option.
            
                @param samples Samples from which the Gaussian mixture model will be estimated. It should be a
                    one-channel matrix, each row of which is a sample. If the matrix does not have CV_64F type
                    it will be converted to the inner matrix of such type for the further computing.
                @param probs0
                @param logLikelihoods The optional output matrix that contains a likelihood logarithm value for
                    each sample. It has \f$nsamples \times 1\f$ size and CV_64FC1 type.
                @param labels The optional output "class label" for each sample:
                    \f$\texttt{labels}_i=\texttt{arg max}_k(p_{i,k}), i=1..N\f$ (indices of the most probable
                    mixture component for each sample). It has \f$nsamples \times 1\f$ size and CV_32SC1 type.
                @param probs The optional output matrix that contains posterior probabilities of each Gaussian
                    mixture component given the each sample. It has \f$nsamples \times nclusters\f$ size and
                    CV_64FC1 type.
                */
                trainM(samples: _st.InputArray, probs0: _st.InputArray,
                    logLikelihoods?: _st.OutputArray /*= noArray()*/,
                    labels?: _st.OutputArray /*= noArray()*/,
                    probs?: _st.OutputArray /*= noArray()*/): boolean;


            };

            export var EM: EMStatic = alvision_module.ml.EM;

    /****************************************************************************************\
    *                                      Decision Tree                                     *
    \****************************************************************************************/

    /** @brief The class represents a single decision tree or a collection of decision trees.
    
    The current public interface of the class allows user to train only a single decision tree, however
    the class is capable of storing multiple decision trees and using them for prediction (by summing
    responses or using a voting schemes), and the derived from DTrees classes (such as RTrees and Boost)
    use this capability to implement decision tree ensembles.
    
    @sa @ref ml_intro_trees
    */
    /** Predict options */
            export enum DTreesFlags { PREDICT_AUTO = 0, PREDICT_SUM = (1 << 8), PREDICT_MAX_VOTE = (2 << 8), PREDICT_MASK = (3 << 8) };

            interface DTreesStatic {
                /** @brief Creates the empty model
        
        The static method creates empty decision tree with the specified parameters. It should be then
        trained using train method (see StatModel::train). Alternatively, you can load the model from
        file using Algorithm::load\<DTrees\>(filename).
         */
                create(): DTrees;
            }

    export interface DTrees extends StatModel {
        //public:
        
        
        
        /** Cluster possible values of a categorical variable into K\<=maxCategories clusters to
        find a suboptimal split.
        If a discrete variable, on which the training procedure tries to make a split, takes more than
        maxCategories values, the precise best subset estimation may take a very long time because the
        algorithm is exponential. Instead, many decision trees engines (including our implementation)
        try to find sub-optimal split in this case by clustering all the samples into maxCategories
        clusters that is some categories are merged together. The clustering is applied only in n \>
        2-class classification problems for categorical variables with N \> max_categories possible
        values. In case of regression and 2-class classification the optimal split can be found
        efficiently without employing clustering, thus the parameter is not used in these cases.
        Default value is 10.*/
        /** @see setMaxCategories */
        getMaxCategories(): _st.int;
        /** @copybrief getMaxCategories @see getMaxCategories */
        setMaxCategories(val: _st.int): void;
        
        /** The maximum possible depth of the tree.
        That is the training algorithms attempts to split a node while its depth is less than maxDepth.
        The root node has zero depth. The actual depth may be smaller if the other termination criteria
        are met (see the outline of the training procedure @ref ml_intro_trees "here"), and/or if the
        tree is pruned. Default value is INT_MAX.*/
        /** @see setMaxDepth */
        getMaxDepth(): _st.int;
        /** @copybrief getMaxDepth @see getMaxDepth */
        setMaxDepth(val: _st.int ): void;
        
        /** If the number of samples in a node is less than this parameter then the node will not be split.
        
        Default value is 10.*/
        /** @see setMinSampleCount */
        getMinSampleCount(): _st.int;
        /** @copybrief getMinSampleCount @see getMinSampleCount */
        setMinSampleCount(val: _st.int ): void;
        
        /** If CVFolds \> 1 then algorithms prunes the built decision tree using K-fold
        cross-validation procedure where K is equal to CVFolds.
        Default value is 10.*/
        /** @see setCVFolds */
        getCVFolds(): _st.int 
        /** @copybrief getCVFolds @see getCVFolds */
        setCVFolds(val: _st.int): void;
        
        /** If true then surrogate splits will be built.
        These splits allow to work with missing data and compute variable importance correctly.
        Default value is false.
        @note currently it's not implemented.*/
        /** @see setUseSurrogates */
        getUseSurrogates(): boolean;
        /** @copybrief getUseSurrogates @see getUseSurrogates */
        setUseSurrogates(val: boolean): void;
        
        /** If true then a pruning will be harsher.
        This will make a tree more compact and more resistant to the training data noise but a bit less
        accurate. Default value is true.*/
        /** @see setUse1SERule */
        getUse1SERule(): boolean;
        /** @copybrief getUse1SERule @see getUse1SERule */
        setUse1SERule(val : boolean): void;
        
        /** If true then pruned branches are physically removed from the tree.
        Otherwise they are retained and it is possible to get results from the original unpruned (or
        pruned less aggressively) tree. Default value is true.*/
        /** @see setTruncatePrunedTree */
        getTruncatePrunedTree(): boolean;
        /** @copybrief getTruncatePrunedTree @see getTruncatePrunedTree */
        setTruncatePrunedTree(val: boolean): void;
        
        /** Termination criteria for regression trees.
        If all absolute differences between an estimated value in a node and values of train samples
        in this node are less than this parameter then the node will not be split further. Default
        value is 0.01f*/
        /** @see setRegressionAccuracy */
        getRegressionAccuracy(): _st.float;
        /** @copybrief getRegressionAccuracy @see getRegressionAccuracy */
        setRegressionAccuracy(val: _st.float ): void;
        
        /** @brief The array of a priori class probabilities, sorted by the class label value.
        
        The parameter can be used to tune the decision tree preferences toward a certain class. For
        example, if you want to detect some rare anomaly occurrence, the training base will likely
        contain much more normal cases than anomalies, so a very good classification performance
        will be achieved just by considering every case as normal. To avoid this, the priors can be
        specified, where the anomaly probability is artificially increased (up to 0.5 or even
        greater), so the weight of the misclassified anomalies becomes much bigger, and the tree is
        adjusted properly.
        
        You can also think about this parameter as weights of prediction categories which determine
        relative weights that you give to misclassification. That is, if the weight of the first
        category is 1 and the weight of the second category is 10, then each mistake in predicting
        the second category is equivalent to making 10 mistakes in predicting the first category.
        Default value is empty Mat.*/
        /** @see setPriors */
        getPriors(): _mat.Mat;
        /** @copybrief getPriors @see getPriors */
        setPriors(val: _mat.Mat ): void;
        
        /** @brief The class represents a decision tree node.
         */
        //class CV_EXPORTS Node
        //{
        //public:
        //    Node();
        //    double value; //!< Value at the node: a class label in case of classification or estimated
        //                  //!< function value in case of regression.
        //    int classIdx; //!< Class index normalized to 0..class_count-1 range and assigned to the
        //                  //!< node. It is used internally in classification trees and tree ensembles.
        //    int parent; //!< Index of the parent node
        //    int left; //!< Index of the left child node
        //    int right; //!< Index of right child node
        //    int defaultDir; //!< Default direction where to go (-1: left or +1: right). It helps in the
        //                    //!< case of missing values.
        //    int split; //!< Index of the first split
        //};
        //
        ///** @brief The class represents split in a decision tree.
        // */
        //class CV_EXPORTS Split
        //{
        //public:
        //    Split();
        //    int varIdx; //!< Index of variable on which the split is created.
        //    bool inversed; //!< If true, then the inverse split rule is used (i.e. left and right
        //                   //!< branches are exchanged in the rule expressions below).
        //    float quality; //!< The split quality, a positive number. It is used to choose the best split.
        //    int next; //!< Index of the next split in the list of splits for the node
        //    float c; /**< The threshold value in case of split on an ordered variable.
        //                  The rule is:
        //                  @code{.none}
        //                  if var_value < c
        //                    then next_node <- left
        //                    else next_node <- right
        //                  @endcode */
        //    int subsetOfs; /**< Offset of the bitset used by the split on a categorical variable.
        //                        The rule is:
        //                        @code{.none}
        //                        if bitset[var_value] == 1
        //                            then next_node <- left
        //                            else next_node <- right
        //                        @endcode */
        //};
        
        /** @brief Returns indices of root nodes
        */
        getRoots(): Array<_st.int> ;
        /** @brief Returns all the nodes
        
        //all the node indices are indices in the returned vector
        // */
        // Array<Node>& getNodes() const = 0;
        ///** @brief Returns all the splits
        //
        //all the split indices are indices in the returned vector
        // */
        // Array<Split>& getSplits() const = 0;
        ///** @brief Returns all the bitsets for categorical splits
        //
        //Split::subsetOfs is an offset in the returned vector
        // */
        // Array<int>& getSubsets() const = 0;
        
        
            };

            export var DTrees: DTreesStatic = alvision_module.DTrees;

    /****************************************************************************************\
    *                                   Random Trees Classifier                              *
    \****************************************************************************************/

    /** @brief The class implements the random forest predictor.
    
    @sa @ref ml_intro_rtrees
     */
    interface RTreesStatic {
           /** Creates the empty model.
          Use StatModel::train to train the model, StatModel::train to create and train the model,
          Algorithm::load to load the pre-trained model.
           */
        create(): RTrees;
    }

export    interface RTrees extends DTrees {
        //public:
        
            /** If true then variable importance will be calculated and then it can be retrieved by RTrees::getVarImportance.
            Default value is false.*/
            /** @see setCalculateVarImportance */
        getCalculateVarImportance(): boolean;
            /** @copybrief getCalculateVarImportance @see getCalculateVarImportance */
        setCalculateVarImportance(val : boolean): void;
        
            /** The size of the randomly selected subset of features at each tree node and that are used
            to find the best split(s).
            If you set it to 0 then the size will be set to the square root of the total number of
            features. Default value is 0.*/
            /** @see setActiveVarCount */
        getActiveVarCount(): _st.int;
            /** @copybrief getActiveVarCount @see getActiveVarCount */
        setActiveVarCount(val: _st.int ): void;
        
            /** The termination criteria that specifies when the training algorithm stops.
            Either when the specified number of trees is trained and added to the ensemble or when
            sufficient accuracy (measured as OOB error) is achieved. Typically the more trees you have the
            better the accuracy. However, the improvement in accuracy generally diminishes and asymptotes
            pass a certain number of trees. Also to keep in mind, the number of tree increases the
            prediction time linearly. Default value is TermCriteria(TermCriteria::MAX_ITERS +
            TermCriteria::EPS, 50, 0.1)*/
            /** @see setTermCriteria */
        getTermCriteria(): _types.TermCriteria;
            /** @copybrief getTermCriteria @see getTermCriteria */
        setTermCriteria(val: _types.TermCriteria): void;
        
            /** Returns the variable importance array.
            The method returns the variable importance vector, computed at the training stage when
            CalculateVarImportance is set to true. If this flag was set to false, the empty matrix is
            returned.
             */
        getVarImportance(): _mat.Mat;
        
       
    };
    export var RTrees: RTreesStatic = alvision_module.RTrees;

    /****************************************************************************************\
    *                                   Boosted tree classifier                              *
    \****************************************************************************************/

    /** @brief Boosted tree classifier derived from DTrees
    
    @sa @ref ml_intro_boost
     */

        /** Boosting type.
        Gentle AdaBoost and Real AdaBoost are often the preferable choices. */
        export enum BoostTypes {
            DISCRETE=0, //!< Discrete AdaBoost.
            REAL=1, //!< Real AdaBoost. It is a technique that utilizes confidence-rated predictions
                    //!< and works well with categorical data.
            LOGIT=2, //!< LogitBoost. It can produce good regression fits.
            GENTLE=3 //!< Gentle AdaBoost. It puts less weight on outlier data points and for that
                     //!<reason is often good with regression data.
        };
    

    interface BoostStatic {
            /** Creates the empty model.
           Use StatModel::train to train the model, Algorithm::load\<Boost\>(filename) to load the pre-trained model. */
        create(): Boost;
    }

    export interface Boost extends DTrees {
        //public:
        /** Type of the boosting algorithm.
        See Boost::Types. Default value is Boost::REAL. */
        /** @see setBoostType */
        getBoostType(): _st.int;
        /** @copybrief getBoostType @see getBoostType */
        setBoostType(val: _st.int): void;
        
        /** The number of weak classifiers.
        Default value is 100. */
        /** @see setWeakCount */
        getWeakCount(): _st.int;
        /** @copybrief getWeakCount @see getWeakCount */
        setWeakCount(val: _st.int): void;
        
        /** A threshold between 0 and 1 used to save computational time.
        Samples with summary weight \f$\leq 1 - weight_trim_rate\f$ do not participate in the *next*
        iteration of training. Set this parameter to 0 to turn off this functionality. Default value is 0.95.*/
        /** @see setWeightTrimRate */
        getWeightTrimRate(): _st.double;
        /** @copybrief getWeightTrimRate @see getWeightTrimRate */
        setWeightTrimRate(val: _st.double): void;



    }
    export var Boost: BoostStatic = alvision_module.Boost;

    /****************************************************************************************\
    *                                   Gradient Boosted Trees                               *
    \****************************************************************************************/

    export enum GBTrees{SQUARED_LOSS = 0, ABSOLUTE_LOSS, HUBER_LOSS = 3, DEVIANCE_LOSS };

    /*class CV_EXPORTS_W GBTrees : public DTrees
    {
    public:
        struct CV_EXPORTS_W_MAP Params : public DTrees::Params
        {
            CV_PROP_RW int weakCount;
            CV_PROP_RW int lossFunctionType;
            CV_PROP_RW float subsamplePortion;
            CV_PROP_RW float shrinkage;
    
            Params();
            Params( int lossFunctionType, int weakCount, float shrinkage,
                    float subsamplePortion, int maxDepth, bool useSurrogates );
        };
    
        
    
        virtual void setK(int k) = 0;
    
        virtual float predictSerial( InputArray samples,
                                     OutputArray weakResponses, int flags) const = 0;
    
        static Ptr<GBTrees> create(const Params& p);
    };*/

    /****************************************************************************************\
    *                              Artificial Neural Networks (ANN)                          *
    \****************************************************************************************/

    /////////////////////////////////// Multi-Layer Perceptrons //////////////////////////////

      export  enum TrainingMethods {
            BACKPROP=0, //!< The back-propagation algorithm.
            RPROP=1 //!< The RPROP algorithm. See @cite RPROP93 for details.
        };

    /** @brief Artificial Neural Networks - Multi-Layer Perceptrons.
    
    Unlike many other models in ML that are constructed and trained at once, in the MLP model these
    steps are separated. First, a network with the specified topology is created using the non-default
    constructor or the method ANN_MLP::create. All the weights are set to zeros. Then, the network is
    trained using a set of input and output vectors. The training procedure can be repeated more than
    once, that is, the weights can be adjusted based on the new training data.
    
    Additional flags for StatModel::train are available: ANN_MLP::TrainFlags.
    
    @sa @ref ml_intro_ann
     */

    /** possible activation functions */
        export enum ANN_MLP_ActivationFunctions {
        /** Identity function: \f$f(x)=x\f$ */
        IDENTITY = 0,
        /** Symmetrical sigmoid: \f$f(x)=\beta*(1-e^{-\alpha x})/(1+e^{-\alpha x}\f$
        @note
        If you are using the default sigmoid activation function with the default parameter values
        fparam1=0 and fparam2=0 then the function used is y = 1.7159\*tanh(2/3 \* x), so the output
        will range from [-1.7159, 1.7159], instead of [0,1].*/
        SIGMOID_SYM = 1,
        /** Gaussian function: \f$f(x)=\beta e^{-\alpha x*x}\f$ */
        GAUSSIAN = 2
    };
      
    /** Train options */
    export enum ANN_MLP_TrainFlags {
        /** Update the network weights, rather than compute them from scratch. In the latter case
        the weights are initialized using the Nguyen-Widrow algorithm. */
        UPDATE_WEIGHTS = 1,
        /** Do not normalize the input vectors. If this flag is not set, the training algorithm
        normalizes each input feature independently, shifting its mean value to 0 and making the
        standard deviation equal to 1. If the network is assumed to be updated frequently, the new
        training data could be much different from original one. In this case, you should take care
        of proper normalization. */
        NO_INPUT_SCALE = 2,
        /** Do not normalize the output vectors. If the flag is not set, the training algorithm
        normalizes each output feature independently, by transforming it to the certain range
        depending on the used activation function. */
        NO_OUTPUT_SCALE = 4
    };

        interface ANN_MLPStatic {
            /** @brief Creates empty model
        
            Use StatModel::train to train the model, Algorithm::load\<ANN_MLP\>(filename) to load the pre-trained model.
            Note that the train method has optional flags: ANN_MLP::TrainFlags.
             */
            create(): ANN_MLP;
        
            /** @brief Loads and creates a serialized ANN from a file
             *
             * Use ANN::save to serialize and store an ANN to disk.
             * Load the ANN from this file again, by calling this function with the path to the file.
             *
             * @param filepath path to serialized ANN
             */
            load(filepath : string): ANN_MLP;
        
        }

    export interface ANN_MLP extends StatModel {
        //public:
            /** Available training methods */
        
        
            /** Sets training method and common parameters.
            @param method Default value is ANN_MLP::RPROP. See ANN_MLP::TrainingMethods.
            @param param1 passed to setRpropDW0 for ANN_MLP::RPROP and to setBackpropWeightScale for ANN_MLP::BACKPROP
            @param param2 passed to setRpropDWMin for ANN_MLP::RPROP and to setBackpropMomentumScale for ANN_MLP::BACKPROP.
            */
        setTrainMethod(method: _st.int, param1?: _st.double /* = 0*/, param2?: _st.double /* = 0*/): void;
        
            /** Returns current training method */
        getTrainMethod() : _st.int;
        
            /** Initialize the activation function for each neuron.
            Currently the default and the only fully supported activation function is ANN_MLP::SIGMOID_SYM.
            @param type The type of activation function. See ANN_MLP::ActivationFunctions.
            @param param1 The first parameter of the activation function, \f$\alpha\f$. Default value is 0.
            @param param2 The second parameter of the activation function, \f$\beta\f$. Default value is 0.
            */
        setActivationFunction(type : _st.int, param1 ? : _st.double /* = 0*/, param2 ? : _st.double /* = 0*/) : void ;
        
            /**  Integer vector specifying the number of neurons in each layer including the input and output layers.
            The very first element specifies the number of elements in the input layer.
            The last element - number of elements in the output layer. Default value is empty Mat.
            @sa getLayerSizes */
        setLayerSizes(_layer_sizes : _st.InputArray ) : void ;
        
            /**  Integer vector specifying the number of neurons in each layer including the input and output layers.
            The very first element specifies the number of elements in the input layer.
            The last element - number of elements in the output layer.
            @sa setLayerSizes */
        getLayerSizes(): _mat.Mat;
        
            /** Termination criteria of the training algorithm.
            You can specify the maximum number of iterations (maxCount) and/or how much the error could
            change between the iterations to make the algorithm continue (epsilon). Default value is
            TermCriteria(TermCriteria::MAX_ITER + TermCriteria::EPS, 1000, 0.01).*/
            /** @see setTermCriteria */
        getTermCriteria(): _types.TermCriteria;
            /** @copybrief getTermCriteria @see getTermCriteria */
        setTermCriteria(val: _types.TermCriteria): void;
        
            /** BPROP: Strength of the weight gradient term.
            The recommended value is about 0.1. Default value is 0.1.*/
            /** @see setBackpropWeightScale */
        getBackpropWeightScale(): _st.double;
            /** @copybrief getBackpropWeightScale @see getBackpropWeightScale */
        setBackpropWeightScale(val: _st.double ): void;
        
            /** BPROP: Strength of the momentum term (the difference between weights on the 2 previous iterations).
            This parameter provides some inertia to smooth the random fluctuations of the weights. It can
            vary from 0 (the feature is disabled) to 1 and beyond. The value 0.1 or so is good enough.
            Default value is 0.1.*/
            /** @see setBackpropMomentumScale */
        getBackpropMomentumScale(): _st.double;
            /** @copybrief getBackpropMomentumScale @see getBackpropMomentumScale */
        setBackpropMomentumScale(val: _st.double ): void;
        
            /** RPROP: Initial value \f$\Delta_0\f$ of update-values \f$\Delta_{ij}\f$.
            Default value is 0.1.*/
            /** @see setRpropDW0 */
        getRpropDW0(): _st.double;
            /** @copybrief getRpropDW0 @see getRpropDW0 */
        setRpropDW0(val: _st.double ): void;
        
            /** RPROP: Increase factor \f$\eta^+\f$.
            It must be \>1. Default value is 1.2.*/
            /** @see setRpropDWPlus */
        getRpropDWPlus(): _st.double;
            /** @copybrief getRpropDWPlus @see getRpropDWPlus */
        setRpropDWPlus(val: _st.double ): void;
        
            /** RPROP: Decrease factor \f$\eta^-\f$.
            It must be \<1. Default value is 0.5.*/
            /** @see setRpropDWMinus */
        getRpropDWMinus(): _st.double;
            /** @copybrief getRpropDWMinus @see getRpropDWMinus */
        setRpropDWMinus(val: _st.double): void;
        
            /** RPROP: Update-values lower limit \f$\Delta_{min}\f$.
            It must be positive. Default value is FLT_EPSILON.*/
            /** @see setRpropDWMin */
        getRpropDWMin(): _st.double;
            /** @copybrief getRpropDWMin @see getRpropDWMin */
        setRpropDWMin(val: _st.double): void;
        
            /** RPROP: Update-values upper limit \f$\Delta_{max}\f$.
            It must be \>1. Default value is 50.*/
            /** @see setRpropDWMax */
        getRpropDWMax(): _st.double;
            /** @copybrief getRpropDWMax @see getRpropDWMax */
        setRpropDWMax(val: _st.double ): void;
        
            
        
            getWeights(layerIdx : _st.int ) : _mat.Mat;
        
       
        };

        export var ANN_MLP: ANN_MLPStatic = alvision_module.ANN_MLP;

    /****************************************************************************************\
    *                           Logistic Regression                                          *
    \****************************************************************************************/

    /** @brief Implements Logistic Regression classifier.
    
    @sa @ref ml_intro_lr
     */
    interface LogisticRegression extends StatModel {
        //public:
        //
        //    /** Learning rate. */
        //    /** @see setLearningRate */
        //    double getLearningRate() const = 0;
        //    /** @copybrief getLearningRate @see getLearningRate */
        //    void setLearningRate(double val) = 0;
        //
        //    /** Number of iterations. */
        //    /** @see setIterations */
        //    int getIterations() const = 0;
        //    /** @copybrief getIterations @see getIterations */
        //    void setIterations(int val) = 0;
        //
        //    /** Kind of regularization to be applied. See LogisticRegression::RegKinds. */
        //    /** @see setRegularization */
        //    int getRegularization() const = 0;
        //    /** @copybrief getRegularization @see getRegularization */
        //    void setRegularization(int val) = 0;
        //
        //    /** Kind of training method used. See LogisticRegression::Methods. */
        //    /** @see setTrainMethod */
        //    int getTrainMethod() const = 0;
        //    /** @copybrief getTrainMethod @see getTrainMethod */
        //    void setTrainMethod(int val) = 0;
        //
        //    /** Specifies the number of training samples taken in each step of Mini-Batch Gradient
        //    Descent. Will only be used if using LogisticRegression::MINI_BATCH training algorithm. It
        //    has to take values less than the total number of training samples. */
        //    /** @see setMiniBatchSize */
        //    int getMiniBatchSize() const = 0;
        //    /** @copybrief getMiniBatchSize @see getMiniBatchSize */
        //    void setMiniBatchSize(int val) = 0;
        //
        //    /** Termination criteria of the algorithm. */
        //    /** @see setTermCriteria */
        //    TermCriteria getTermCriteria() const = 0;
        //    /** @copybrief getTermCriteria @see getTermCriteria */
        //    void setTermCriteria(TermCriteria val) = 0;
        //
        //    //! Regularization kinds
        //    enum RegKinds {
        //        REG_DISABLE = -1, //!< Regularization disabled
        //        REG_L1 = 0, //!< %L1 norm
        //        REG_L2 = 1 //!< %L2 norm
        //    };
        //
        //    //! Training methods
        //    enum Methods {
        //        BATCH = 0,
        //        MINI_BATCH = 1 //!< Set MiniBatchSize to a positive integer when using this method.
        //    };
        //
        //    /** @brief Predicts responses for input samples and returns a float type.
        //
        //    @param samples The input data for the prediction algorithm. Matrix [m x n], where each row
        //        contains variables (features) of one object being classified. Should have data type CV_32F.
        //    @param results Predicted labels as a column matrix of type CV_32S.
        //    @param flags Not used.
        //     */
        //    float predict( InputArray samples, OutputArray results=noArray(), int flags=0 ) const = 0;
        //
        //    /** @brief This function returns the trained paramters arranged across rows.
        //
        //    For a two class classifcation problem, it returns a row matrix. It returns learnt paramters of
        //    the Logistic Regression as a matrix of type CV_32F.
        //     */
        //    Mat get_learnt_thetas() const = 0;
        //
        //    /** @brief Creates empty model.
        //
        //    Creates Logistic Regression model with parameters given.
        //     */
        //    CV_WRAP static Ptr<LogisticRegression> create();
    };

    /****************************************************************************************\
    *                           Auxilary functions declarations                              *
    \****************************************************************************************/

    /** @brief Generates _sample_ from multivariate normal distribution
    
    @param mean an average row vector
    @param cov symmetric covariation matrix
    @param nsamples returned samples count
    @param samples returned samples array
    */
    //CV_EXPORTS void randMVNormal( InputArray mean, InputArray cov, int nsamples, OutputArray samples);
    //
    ///** @brief Creates test set */
    //CV_EXPORTS void createConcentricSpheresTestSet( int nsamples, int nfeatures, int nclasses,
    //                                                OutputArray samples, OutputArray responses);

    //! @} ml

}
//}

//#endif // __cplusplus
//#endif // __OPENCV_ML_HPP__

/* End of file. */
