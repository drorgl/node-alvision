#ifndef _ALVISION_MATRIX_H_
#define _ALVISION_MATRIX_H_
//#include "OpenCV.h"
#include "../alvision.h"
#include "IOArray.h"


class Matrix : public IOArray {
public:
	static void Init(Handle<Object> target, std::shared_ptr<overload_resolution> overload);

	std::shared_ptr<cv::Mat> _mat;

	static Nan::Persistent<FunctionTemplate> constructor;

	virtual v8::Local<v8::Function> get_constructor(); 

	virtual cv::InputArray GetInputArray();
	virtual cv::InputArrayOfArrays GetInputArrayOfArrays();
	virtual cv::OutputArray GetOutputArray();
	virtual cv::OutputArrayOfArrays GetOutputArrayOfArrays();
	virtual cv::InputOutputArray GetInputOutputArray();
	virtual cv::InputOutputArrayOfArrays GetInputOutputArrayOfArrays();

	//export interface MatStatic {
		//public:
		/**
		These are various constructors that form a matrix. As noted in the AutomaticAllocation, often
		the default constructor is enough, and the proper matrix will be allocated by an OpenCV function.
		The constructed matrix can further be assigned to another matrix or matrix expression or can be
		allocated with Mat::create . In the former case, the old content is de-referenced.
		*/
		//new () : Mat;
		static POLY_METHOD(New);

		/** @overload
		@param rows Number of rows in a 2D array.
		@param cols Number of columns in a 2D array.
		@param type Array type. Use CV_8UC1, ..., CV_64FC4 to create 1-4 channel matrices, or
		CV_8UC(n), ..., CV_64FC(n) to create multi-channel (up to CV_CN_MAX channels) matrices.
		*/
		//new (rows: _st.int, cols : _st.int, type : _st.int) : Mat;
		static POLY_METHOD(New_rows_cols_type);

		/** @overload
		@param size 2D array size: Size(cols, rows) . In the Size() constructor, the number of rows and the
		number of columns go in the reverse order.
		@param type Array type. Use CV_8UC1, ..., CV_64FC4 to create 1-4 channel matrices, or
		CV_8UC(n), ..., CV_64FC(n) to create multi-channel (up to CV_CN_MAX channels) matrices.
		*/
		//new (size: _types.Size, type : _st.int) : Mat;
		static POLY_METHOD(New_size_type);

		/** @overload
		@param rows Number of rows in a 2D array.
		@param cols Number of columns in a 2D array.
		@param type Array type. Use CV_8UC1, ..., CV_64FC4 to create 1-4 channel matrices, or
		CV_8UC(n), ..., CV_64FC(n) to create multi-channel (up to CV_CN_MAX channels) matrices.
		@param s An optional value to initialize each matrix element with. To set all the matrix elements to
		the particular value after the construction, use the assignment operator
		Mat::operator=(const Scalar& value) .
		*/
		//new (rows: _st.int, cols : _st.int, type : _st.int, s : _types.Scalar) : Mat;
		static POLY_METHOD(New_rows_cols_type_scalar);

		/** @overload
		@param size 2D array size: Size(cols, rows) . In the Size() constructor, the number of rows and the
		number of columns go in the reverse order.
		@param type Array type. Use CV_8UC1, ..., CV_64FC4 to create 1-4 channel matrices, or
		CV_8UC(n), ..., CV_64FC(n) to create multi-channel (up to CV_CN_MAX channels) matrices.
		@param s An optional value to initialize each matrix element with. To set all the matrix elements to
		the particular value after the construction, use the assignment operator
		Mat::operator=(const Scalar& value) .
		*/
		//new (size: _types.Size, type : _st.int, s : _types.Scalar) : Mat;
		static POLY_METHOD(New_size_type_scalar);

		/** @overload
		@param ndims Array dimensionality.
		@param sizes Array of integers specifying an n-dimensional array shape.
		@param type Array type. Use CV_8UC1, ..., CV_64FC4 to create 1-4 channel matrices, or
		CV_8UC(n), ..., CV_64FC(n) to create multi-channel (up to CV_CN_MAX channels) matrices.
		*/
		//new (ndims: _st.int, sizes : Array<_st.int>, type : _st.int) : Mat;
		static POLY_METHOD(New_ndims_sizes_type);

		/** @overload
		@param ndims Array dimensionality.
		@param sizes Array of integers specifying an n-dimensional array shape.
		@param type Array type. Use CV_8UC1, ..., CV_64FC4 to create 1-4 channel matrices, or
		CV_8UC(n), ..., CV_64FC(n) to create multi-channel (up to CV_CN_MAX channels) matrices.
		@param s An optional value to initialize each matrix element with. To set all the matrix elements to
		the particular value after the construction, use the assignment operator
		Mat::operator=(const Scalar& value) .
		*/
		//new (ndims: _st.int, sizes : Array<_st.int>, type : _st.int, s : _types.Scalar) : Mat;
		static POLY_METHOD(New_ndims_sizes_type_scalar);

		/** @overload
		@param m Array that (as a whole or partly) is assigned to the constructed matrix. No data is copied
		by these constructors. Instead, the header pointing to m data or its sub-array is constructed and
		associated with it. The reference counter, if any, is incremented. So, when you modify the matrix
		formed using such a constructor, you also modify the corresponding elements of m . If you want to
		have an independent copy of the sub-array, use Mat::clone() .
		*/
		//new (m : Mat) : Mat;
		static POLY_METHOD(New_mat);

		/** @overload
		@param rows Number of rows in a 2D array.
		@param cols Number of columns in a 2D array.
		@param type Array type. Use CV_8UC1, ..., CV_64FC4 to create 1-4 channel matrices, or
		CV_8UC(n), ..., CV_64FC(n) to create multi-channel (up to CV_CN_MAX channels) matrices.
		@param data Pointer to the user data. Matrix constructors that take data and step parameters do not
		allocate matrix data. Instead, they just initialize the matrix header that points to the specified
		data, which means that no data is copied. This operation is very efficient and can be used to
		process external data using OpenCV functions. The external data is not automatically deallocated, so
		you should take care of it.
		@param step Number of bytes each matrix row occupies. The value should include the padding bytes at
		the end of each row, if any. If the parameter is missing (set to AUTO_STEP ), no padding is assumed
		and the actual step is calculated as cols*elemSize(). See Mat::elemSize.
		*/
		//new (int rows, int cols, int type, void* data, size_t step= AUTO_STEP) : Mat;
		//new (rows: _st.int, cols : _st.int, type : _st.int, data : Array<any>, step ? : _st.size_t) : Mat;
		static POLY_METHOD(New_rows_cols_type_data_step);

		/** @overload
		@param size 2D array size: Size(cols, rows) . In the Size() constructor, the number of rows and the
		number of columns go in the reverse order.
		@param type Array type. Use CV_8UC1, ..., CV_64FC4 to create 1-4 channel matrices, or
		CV_8UC(n), ..., CV_64FC(n) to create multi-channel (up to CV_CN_MAX channels) matrices.
		@param data Pointer to the user data. Matrix constructors that take data and step parameters do not
		allocate matrix data. Instead, they just initialize the matrix header that points to the specified
		data, which means that no data is copied. This operation is very efficient and can be used to
		process external data using OpenCV functions. The external data is not automatically deallocated, so
		you should take care of it.
		@param step Number of bytes each matrix row occupies. The value should include the padding bytes at
		the end of each row, if any. If the parameter is missing (set to AUTO_STEP ), no padding is assumed
		and the actual step is calculated as cols*elemSize(). See Mat::elemSize.
		*/
		//new (size: _types.Size, type : _cvdef.MatrixType | _st.int, data : Array<any>, step ? : _st.size_t  /*= AUTO_STEP*/) : Mat;
		static POLY_METHOD(New_size_type_data_step);

		/** @overload
		@param ndims Array dimensionality.
		@param sizes Array of integers specifying an n-dimensional array shape.
		@param type Array type. Use CV_8UC1, ..., CV_64FC4 to create 1-4 channel matrices, or
		CV_8UC(n), ..., CV_64FC(n) to create multi-channel (up to CV_CN_MAX channels) matrices.
		@param data Pointer to the user data. Matrix constructors that take data and step parameters do not
		allocate matrix data. Instead, they just initialize the matrix header that points to the specified
		data, which means that no data is copied. This operation is very efficient and can be used to
		process external data using OpenCV functions. The external data is not automatically deallocated, so
		you should take care of it.
		@param steps Array of ndims-1 steps in case of a multi-dimensional array (the last step is always
		set to the element size). If not specified, the matrix is assumed to be continuous.
		*/
		//new (int ndims, const int* sizes, int type, void* data, const size_t* steps=0) : Mat;

		/** @overload
		@param m Array that (as a whole or partly) is assigned to the constructed matrix. No data is copied
		by these constructors. Instead, the header pointing to m data or its sub-array is constructed and
		associated with it. The reference counter, if any, is incremented. So, when you modify the matrix
		formed using such a constructor, you also modify the corresponding elements of m . If you want to
		have an independent copy of the sub-array, use Mat::clone() .
		@param rowRange Range of the m rows to take. As usual, the range start is inclusive and the range
		end is exclusive. Use Range::all() to take all the rows.
		@param colRange Range of the m columns to take. Use Range::all() to take all the columns.
		*/
		//new (const Mat& m, const Range& rowRange, const Range& colRange=Range::all()) : Mat;

		/** @overload
		@param m Array that (as a whole or partly) is assigned to the constructed matrix. No data is copied
		by these constructors. Instead, the header pointing to m data or its sub-array is constructed and
		associated with it. The reference counter, if any, is incremented. So, when you modify the matrix
		formed using such a constructor, you also modify the corresponding elements of m . If you want to
		have an independent copy of the sub-array, use Mat::clone() .
		@param roi Region of interest.
		*/
		//new(const Mat& m, const Rect& roi) : Mat

		/** @overload
		@param m Array that (as a whole or partly) is assigned to the constructed matrix. No data is copied
		by these constructors. Instead, the header pointing to m data or its sub-array is constructed and
		associated with it. The reference counter, if any, is incremented. So, when you modify the matrix
		formed using such a constructor, you also modify the corresponding elements of m . If you want to
		have an independent copy of the sub-array, use Mat::clone() .
		@param ranges Array of selected ranges of m along each dimensionality.
		*/
		//new (const Mat& m, const Range* ranges) : Mat;

		/** @overload
		@param vec STL vector whose elements form the matrix. The matrix has a single column and the number
		of rows equal to the number of vector elements. Type of the matrix matches the type of vector
		elements. The constructor can handle arbitrary types, for which there is a properly declared
		DataType . This means that the vector elements must be primitive numbers or uni-type numerical
		tuples of numbers. Mixed-type structures are not supported. The corresponding constructor is
		explicit. Since STL vectors are not automatically converted to Mat instances, you should write
		Mat(vec) explicitly. Unless you copy the data into the matrix ( copyData=true ), no new elements
		will be added to the vector because it can potentially yield vector data reallocation, and, thus,
		the matrix data pointer will be invalid.
		@param copyData Flag to specify whether the underlying data of the STL vector should be copied
		to (true) or shared with (false) the newly constructed matrix. When the data is copied, the
		allocated buffer is managed using Mat reference counting mechanism. While the data is shared,
		the reference counter is NULL, and you should not deallocate the data until the matrix is not
		destructed.
		*/
		//template < typename _Tp> explicit Mat(const std::vector<_Tp>& vec, bool copyData= false);
		//new <T>(vec: Array<T>, copyData ? : boolean /*= false*/) : Mat;
		static POLY_METHOD(New_array_copyData);

		/** @overload
		*/
		//template < typename _Tp, int n> explicit Mat(const Vec<_Tp, n>& vec, bool copyData= true);
		//new <T>(vec: _matx.Vec<T>, copyData ? : boolean /* = true*/) : Mat;
		static POLY_METHOD(New_vec_Vec2b_copyData);
		static POLY_METHOD(New_vec_Vec3b_copyData);
		static POLY_METHOD(New_vec_Vec4b_copyData);
		static POLY_METHOD(New_vec_Vec2s_copyData);
		static POLY_METHOD(New_vec_Vec3s_copyData);
		static POLY_METHOD(New_vec_Vec4s_copyData);
		static POLY_METHOD(New_vec_Vec2w_copyData);
		static POLY_METHOD(New_vec_Vec3w_copyData);
		static POLY_METHOD(New_vec_Vec4w_copyData);
		static POLY_METHOD(New_vec_Vec2i_copyData);
		static POLY_METHOD(New_vec_Vec3i_copyData);
		static POLY_METHOD(New_vec_Vec4i_copyData);
		static POLY_METHOD(New_vec_Vec6i_copyData);
		static POLY_METHOD(New_vec_Vec8i_copyData);
		static POLY_METHOD(New_vec_Vec2f_copyData);
		static POLY_METHOD(New_vec_Vec3f_copyData);
		static POLY_METHOD(New_vec_Vec4f_copyData);
		static POLY_METHOD(New_vec_Vec6f_copyData);
		static POLY_METHOD(New_vec_Vec2d_copyData);
		static POLY_METHOD(New_vec_Vec3d_copyData);
		static POLY_METHOD(New_vec_Vec4d_copyData);
		static POLY_METHOD(New_vec_Vec6d_copyData);

		/** @overload
		*/
		//template < typename _Tp, int m, int n> explicit Mat(const Matx<_Tp, m, n>& mtx, bool copyData= true);
		//new <T>(mtx: _matx.Matx<T>, copyData ? : boolean /* = true*/) : Mat;
		static POLY_METHOD(New_matx_Matx12f_copyData);
		static POLY_METHOD(New_matx_Matx12d_copyData);
		static POLY_METHOD(New_matx_Matx13f_copyData);
		static POLY_METHOD(New_matx_Matx13d_copyData);
		static POLY_METHOD(New_matx_Matx14f_copyData);
		static POLY_METHOD(New_matx_Matx14d_copyData);
		static POLY_METHOD(New_matx_Matx16f_copyData);
		static POLY_METHOD(New_matx_Matx16d_copyData);
		static POLY_METHOD(New_matx_Matx21f_copyData);
		static POLY_METHOD(New_matx_Matx21d_copyData);
		static POLY_METHOD(New_matx_Matx31f_copyData);
		static POLY_METHOD(New_matx_Matx31d_copyData);
		static POLY_METHOD(New_matx_Matx41f_copyData);
		static POLY_METHOD(New_matx_Matx41d_copyData);
		static POLY_METHOD(New_matx_Matx61f_copyData);
		static POLY_METHOD(New_matx_Matx61d_copyData);
		static POLY_METHOD(New_matx_Matx22f_copyData);
		static POLY_METHOD(New_matx_Matx22d_copyData);
		static POLY_METHOD(New_matx_Matx23f_copyData);
		static POLY_METHOD(New_matx_Matx23d_copyData);
		static POLY_METHOD(New_matx_Matx32f_copyData);
		static POLY_METHOD(New_matx_Matx32d_copyData);
		static POLY_METHOD(New_matx_Matx33f_copyData);
		static POLY_METHOD(New_matx_Matx33d_copyData);
		static POLY_METHOD(New_matx_Matx34f_copyData);
		static POLY_METHOD(New_matx_Matx34d_copyData);
		static POLY_METHOD(New_matx_Matx43f_copyData);
		static POLY_METHOD(New_matx_Matx43d_copyData);
		static POLY_METHOD(New_matx_Matx44f_copyData);
		static POLY_METHOD(New_matx_Matx44d_copyData);
		static POLY_METHOD(New_matx_Matx66f_copyData);
		static POLY_METHOD(New_matx_Matx66d_copyData);

		/** @overload
		*/
		//template < typename _Tp> explicit Mat(const Point_<_Tp>& pt, bool copyData= true);
		//new <T>(pt: _types.Point_<T>, copyData ? : boolean /* = true*/) : Mat;
		//static POLY_METHOD(New_point_copyData);
		static POLY_METHOD(New_point_Point2i_copyData);
		static POLY_METHOD(New_point_Point2f_copyData);
		static POLY_METHOD(New_point_Point2d_copyData);
		static POLY_METHOD(New_point_Point_copyData  );

		/** @overload
		*/
		//template < typename _Tp> explicit Mat(const Point3_<_Tp>& pt, bool copyData= true);
		//new <T>(pt: _types.Point3_<T>, copyData ? : boolean /* = true*/) : Mat;
		//static POLY_METHOD(New_point3_copyData);
		static POLY_METHOD(New_point3_Point3i_copyData);
		static POLY_METHOD(New_point3_Point3f_copyData);
		static POLY_METHOD(New_point3_Point3d_copyData);

		/** @overload
		*/
		//template < typename _Tp> explicit Mat(const MatCommaInitializer_<_Tp>& commaInitializer);

		//! download data from GpuMat
		//explicit Mat(const cuda::GpuMat& m);
		//new (m: _cuda.cuda.GpuMat) : Mat;
#ifdef HAVE_CUDA
		static POLY_METHOD(New_gpuMat);
#endif

		//new (buf: Buffer) : Mat;
		static POLY_METHOD(New_buffer);

		//! destructor - calls release()
		//~Mat();

		/** @brief Returns a zero array of the specified size and type.

		The method returns a Matlab-style zero array initializer. It can be used to quickly form a constant
		array as a function parameter, part of a matrix expression, or as a matrix initializer. :
		@code
		Mat A;
		A = Mat::zeros(3, 3, CV_32F);
		@endcode
		In the example above, a new matrix is allocated only if A is not a 3x3 floating-point matrix.
		Otherwise, the existing matrix A is filled with zeros.
		@param rows Number of rows.
		@param cols Number of columns.
		@param type Created matrix type.
		*/
		//zeros(rows : _st.int, cols : _st.int, type : _st.int) : MatExpr;
		static POLY_METHOD(zeros_rows_cols_type);

		/** @overload
		@param size Alternative to the matrix size specification Size(cols, rows) .
		@param type Created matrix type.
		*/
		//zeros(size : _types.Size, type : _st.int) : MatExpr;
		static POLY_METHOD(zeros_size_type);

		/** @overload
		@param ndims Array dimensionality.
		@param sz Array of integers specifying the array shape.
		@param type Created matrix type.
		*/
		//zeros(ndims : _st.int, sz : Array<_st.int>, type : _st.int) : MatExpr;
		static POLY_METHOD(zeros_ndims_sz_type);

		/** @brief Returns an array of all 1's of the specified size and type.

		The method returns a Matlab-style 1's array initializer, similarly to Mat::zeros. Note that using
		this method you can initialize an array with an arbitrary value, using the following Matlab idiom:
		@code
		Mat A = Mat::ones(100, 100, CV_8U)*3; // make 100x100 matrix filled with 3.
		@endcode
		The above operation does not form a 100x100 matrix of 1's and then multiply it by 3. Instead, it
		just remembers the scale factor (3 in this case) and use it when actually invoking the matrix
		initializer.
		@param rows Number of rows.
		@param cols Number of columns.
		@param type Created matrix type.
		*/
		//ones(rows : _st.int, cols : _st.int, type : _st.int) : MatExpr;
		static POLY_METHOD(ones_rows_cols_type);

		/** @overload
		@param size Alternative to the matrix size specification Size(cols, rows) .
		@param type Created matrix type.
		*/
		//ones(size : _types.Size, type : _st.int) : MatExpr;
		static POLY_METHOD(ones_size_type);

		/** @overload
		@param ndims Array dimensionality.
		@param sz Array of integers specifying the array shape.
		@param type Created matrix type.
		*/
		//ones(ndims : _st.int, sz : Array<_st.int>, type : _cvdef.MatrixType | _st.int) : MatExpr;
		static POLY_METHOD(ones_ndims_sz_type);

		/** @brief Returns an identity matrix of the specified size and type.

		The method returns a Matlab-style identity matrix initializer, similarly to Mat::zeros. Similarly to
		Mat::ones, you can use a scale operation to create a scaled identity matrix efficiently:
		@code
		// make a 4x4 diagonal matrix with 0.1's on the diagonal.
		Mat A = Mat::eye(4, 4, CV_32F)*0.1;
		@endcode
		@param rows Number of rows.
		@param cols Number of columns.
		@param type Created matrix type.
		*/
		//eye(rows : _st.int, cols : _st.int, type : _st.int) : MatExpr;
		static POLY_METHOD(eye_rows_cols_type);

		/** @overload
		@param size Alternative matrix size specification as Size(cols, rows) .
		@param type Created matrix type.
		*/
		//eye(size : _types.Size, type : _st.int) : MatExpr;
		static POLY_METHOD(eye_size_type);



		/** @brief assignment operators

		These are available assignment operators. Since they all are very different, make sure to read the
		operator parameters description.
		@param m Assigned, right-hand-side matrix. Matrix assignment is an O(1) operation. This means that
		no data is copied but the data is shared and the reference counter, if any, is incremented. Before
		assigning new data, the old data is de-referenced via Mat::release .
		*/
		//Mat & operator = (const Mat& m);
		//from(m: Mat) : Mat;
		static POLY_METHOD(from_mat);

		/** @overload
		@param expr Assigned matrix expression object. As opposite to the first form of the assignment
		operation, the second form can reuse already allocated matrix if it has the right size and type to
		fit the matrix expression result. It is automatically handled by the real function that the matrix
		expressions is expanded to. For example, C=A+B is expanded to add(A, B, C), and add takes care of
		automatic C reallocation.
		*/
		//Mat & operator = (const MatExpr& expr);
		//from(expr: MatExpr) : Mat;
		static POLY_METHOD(from_matexpr);

	//}

	//export interface TrackedPtr<T> extends Array<T> {
	//	[i:number]: T;
	//}

	//export interface TrackedElement<T> {
	//	get() : T;
	//	set(val: T) : T;
	//}
	//export interface Mat extends _st.IOArray
	//{


		//! retrieve UMat from Mat
		//getUMat(accessFlags: ACCESS, usageFlags ? : UMatUsageFlags /* = USAGE_DEFAULT*/) : UMat;
		static POLY_METHOD(getUMat);
	//overload->

	/** @brief Creates a matrix header for the specified matrix row.

	The method makes a new header for the specified matrix row and returns it. This is an O(1)
	operation, regardless of the matrix size. The underlying data of the new matrix is shared with the
	original matrix. Here is the example of one of the classical basic matrix processing operations,
	axpy, used by LU and many other algorithms:
	@code
	inline void matrix_axpy(Mat& A, int i, int j, double alpha)
	{
	A.row(i) += A.row(j)*alpha;
	}
	@endcode
	@note In the current implementation, the following code does not work as expected:
	@code
	Mat A;
	...
	A.row(i) = A.row(j); // will not work
	@endcode
	This happens because A.row(i) forms a temporary header that is further assigned to another header.
	Remember that each of these operations is O(1), that is, no data is copied. Thus, the above
	assignment is not true if you may have expected the j-th row to be copied to the i-th row. To
	achieve that, you should either turn this simple assignment into an expression or use the
	Mat::copyTo method:
	@code
	Mat A;
	...
	// works, but looks a bit obscure.
	A.row(i) = A.row(j) + 0;
	// this is a bit longer, but the recommended method.
	A.row(j).copyTo(A.row(i));
	@endcode
	@param y A 0-based row index.
	*/
	//row(y: _st.int) : Mat;
	static POLY_METHOD(row);

	/** @brief Creates a matrix header for the specified matrix column.

	The method makes a new header for the specified matrix column and returns it. This is an O(1)
	operation, regardless of the matrix size. The underlying data of the new matrix is shared with the
	original matrix. See also the Mat::row description.
	@param x A 0-based column index.
	*/
	//col(x: _st.int) : Mat;
	static POLY_METHOD(col);

	/** @brief Creates a matrix header for the specified row span.

	The method makes a new header for the specified row span of the matrix. Similarly to Mat::row and
	Mat::col , this is an O(1) operation.
	@param startrow An inclusive 0-based start index of the row span.
	@param endrow An exclusive 0-based ending index of the row span.
	*/
	//rowRange(startrow : _st.int, endrow : _st.int) : Mat
		static POLY_METHOD(rowRange_startRow);

		/** @overload
		@param r Range structure containing both the start and the end indices.
		*/
		//rowRange(r : _types.Range) : Mat;
		static POLY_METHOD(rowRange_range);

	/** @brief Creates a matrix header for the specified column span.

	The method makes a new header for the specified column span of the matrix. Similarly to Mat::row and
	Mat::col , this is an O(1) operation.
	@param startcol An inclusive 0-based start index of the column span.
	@param endcol An exclusive 0-based ending index of the column span.
	*/
	//colRange(startcol : _st.int, endcol : _st.int) : Mat;
	static POLY_METHOD(colRange_startcol);

	/** @overload
	@param r Range structure containing both the start and the end indices.
	*/
	//colRange(r : _types.Range) : Mat;
	static POLY_METHOD(colRange_range);

	/** @brief Extracts a diagonal from a matrix

	The method makes a new header for the specified matrix diagonal. The new matrix is represented as a
	single-column matrix. Similarly to Mat::row and Mat::col, this is an O(1) operation.
	@param d index of the diagonal, with the following values:
	- `d=0` is the main diagonal.
	- `d>0` is a diagonal from the lower half. For example, d=1 means the diagonal is set
	immediately below the main one.
	- `d<0` is a diagonal from the upper half. For example, d=-1 means the diagonal is set
	immediately above the main one.
	*/
	//Mat diag(int d= 0) const;

	/** @brief creates a diagonal matrix

	The method makes a new header for the specified matrix diagonal. The new matrix is represented as a
	single-column matrix. Similarly to Mat::row and Mat::col, this is an O(1) operation.
	@param d Single-column matrix that forms a diagonal matrix
	*/
	//static Mat diag(const Mat& d);

	/** @brief Creates a full copy of the array and the underlying data.

	The method creates a full copy of the array. The original step[] is not taken into account. So, the
	array copy is a continuous array occupying total()*elemSize() bytes.
	*/
	//clone() : Mat;
	static POLY_METHOD(clone);

	/** @brief Copies the matrix to another one.

	The method copies the matrix data to another matrix. Before copying the data, the method invokes :
	@code
	m.create(this->size(), this->type());
	@endcode
	so that the destination matrix is reallocated if needed. While m.copyTo(m); works flawlessly, the
	function does not handle the case of a partial overlap between the source and the destination
	matrices.

	When the operation mask is specified, if the Mat::create call shown above reallocates the matrix,
	the newly allocated matrix is initialized with all zeros before copying the data.
	@param m Destination matrix. If it does not have a proper size or type before the operation, it is
	reallocated.
	*/
	//copyTo(m: _st.OutputArray) : void;
	static POLY_METHOD(copyTo_outputArray);

	/** @overload
	@param m Destination matrix. If it does not have a proper size or type before the operation, it is
	reallocated.
	@param mask Operation mask. Its non-zero elements indicate which matrix elements need to be copied.
	The mask has to be of type CV_8U and can have 1 or multiple channels.
	*/
	//copyTo(m: _st.OutputArray, mask : _st.InputArray) : void;
	static POLY_METHOD(copyTo_masked);

	/** @brief Converts an array to another data type with optional scaling.

	The method converts source pixel values to the target data type. saturate_cast\<\> is applied at
	the end to avoid possible overflows:

	\f[m(x,y) = saturate \_ cast<rType>( \alpha (*this)(x,y) +  \beta )\f]
	@param m output matrix; if it does not have a proper size or type before the operation, it is
	reallocated.
	@param rtype desired output matrix type or, rather, the depth since the number of channels are the
	same as the input has; if rtype is negative, the output matrix will have the same type as the input.
	@param alpha optional scale factor.
	@param beta optional delta added to the scaled values.
	*/
	//convertTo(m: _st.OutputArray, rtype : _st.int, alpha ? : _st.double  /*= 1*/, beta ? : _st.double /*= 0*/) : void;
	static POLY_METHOD(convertTo);

	/** @brief Provides a functional form of convertTo.

	This is an internally used method called by the @ref MatrixExpressions engine.
	@param m Destination array.
	@param type Desired destination array depth (or -1 if it should be the same as the source type).
	*/
	//void assignTo(Mat & m, int type= -1) const;

	/** @brief Sets all or some of the array elements to the specified value.
	@param s Assigned scalar converted to the actual array type.
	*/
	//Mat & operator = (const Scalar& s);

	/** @brief Sets all or some of the array elements to the specified value.

	This is an advanced variant of the Mat::operator=(const Scalar& s) operator.
	@param value Assigned scalar converted to the actual array type.
	@param mask Operation mask of the same size as \*this.
	*/
	//setTo(value: _st.InputArray | _types.Scalar | _st.int, mask ? : _st.InputArray /*= noArray()*/) : Mat;
	static POLY_METHOD(setTo_inputArray);
	static POLY_METHOD(setTo_scalar);
	static POLY_METHOD(setTo_int);

	/** @brief Changes the shape and/or the number of channels of a 2D matrix without copying the data.

	The method makes a new matrix header for \*this elements. The new matrix may have a different size
	and/or different number of channels. Any combination is possible if:
	-   No extra elements are included into the new matrix and no elements are excluded. Consequently,
	the product rows\*cols\*channels() must stay the same after the transformation.
	-   No data is copied. That is, this is an O(1) operation. Consequently, if you change the number of
	rows, or the operation changes the indices of elements row in some other way, the matrix must be
	continuous. See Mat::isContinuous .

	For example, if there is a set of 3D points stored as an STL vector, and you want to represent the
	points as a 3xN matrix, do the following:
	@code
	std::vector<Point3f> vec;
	...
	Mat pointMat = Mat(vec). // convert vector to Mat, O(1) operation
	reshape(1). // make Nx3 1-channel matrix out of Nx1 3-channel.
	// Also, an O(1) operation
	t(); // finally, transpose the Nx3 matrix.
	// This involves copying all the elements
	@endcode
	@param cn New number of channels. If the parameter is 0, the number of channels remains the same.
	@param rows New number of rows. If the parameter is 0, the number of rows remains the same.
	*/
	//reshape(cn: _st.int, rows ? : _st.int /*= 0*/) : Mat;
	static POLY_METHOD(reshape);

	/** @overload */
	//reshape(cn: _st.int, newndims: _st.int , const int* newsz) : Mat;

	/** @brief Transposes a matrix.

	The method performs matrix transposition by means of matrix expressions. It does not perform the
	actual transposition but returns a temporary matrix transposition object that can be further used as
	a part of more complex matrix expressions or can be assigned to a matrix:
	@code
	Mat A1 = A + Mat::eye(A.size(), A.type())*lambda;
	Mat C = A1.t()*A1; // compute (A + lambda*I)^t * (A + lamda*I)
	@endcode
	*/
	//t() : MatExpr;
	static POLY_METHOD(t);

	/** @brief Inverses a matrix.

	The method performs a matrix inversion by means of matrix expressions. This means that a temporary
	matrix inversion object is returned by the method and can be used further as a part of more complex
	matrix expressions or can be assigned to a matrix.
	@param method Matrix inversion method. One of cv::DecompTypes
	*/
	//inv(method ? : _base.DecompTypes | _st.int /*= DECOMP_LU*/) : MatExpr;
	static POLY_METHOD(inv);

		/** @brief Performs an element-wise multiplication or division of the two matrices.

		The method returns a temporary object encoding per-element array multiplication, with optional
		scale. Note that this is not a matrix multiplication that corresponds to a simpler "\*" operator.

		Example:
		@code
		Mat C = A.mul(5/B); // equivalent to divide(A, B, C, 5)
		@endcode
		@param m Another array of the same type and the same size as \*this, or a matrix expression.
		@param scale Optional scale factor.
		*/
		//mul(m: _st.InputArray, scale ? : _st.double /*= 1*/) : MatExpr;
		static POLY_METHOD(mul);

	/** @brief Computes a cross-product of two 3-element vectors.

	The method computes a cross-product of two 3-element vectors. The vectors must be 3-element
	floating-point vectors of the same shape and size. The result is another 3-element vector of the
	same shape and type as operands.
	@param m Another cross-product operand.
	*/
	//Mat cross(InputArray m) const;
	//cross(m: _st.InputArray) : Mat;
	static POLY_METHOD(cross);

	/** @brief Computes a dot-product of two vectors.

	The method computes a dot-product of two matrices. If the matrices are not single-column or
	single-row vectors, the top-to-bottom left-to-right scan ordering is used to treat them as 1D
	vectors. The vectors must have the same size and type. If the matrices have more than one channel,
	the dot products from all the channels are summed together.
	@param m another dot-product operand.
	*/
	//dot(m: _st.InputArray) : _st.double;
	static POLY_METHOD(dot);



	/** @brief Allocates new array data if needed.

	This is one of the key Mat methods. Most new-style OpenCV functions and methods that produce arrays
	call this method for each output array. The method uses the following algorithm:

	-# If the current array shape and the type match the new ones, return immediately. Otherwise,
	de-reference the previous data by calling Mat::release.
	-# Initialize the new header.
	-# Allocate the new data of total()\*elemSize() bytes.
	-# Allocate the new, associated with the data, reference counter and set it to 1.

	Such a scheme makes the memory management robust and efficient at the same time and helps avoid
	extra typing for you. This means that usually there is no need to explicitly allocate output arrays.
	That is, instead of writing:
	@code
	Mat color;
	...
	Mat gray(color.rows, color.cols, color.depth());
	cvtColor(color, gray, COLOR_BGR2GRAY);
	@endcode
	you can simply write:
	@code
	Mat color;
	...
	Mat gray;
	cvtColor(color, gray, COLOR_BGR2GRAY);
	@endcode
	because cvtColor, as well as the most of OpenCV functions, calls Mat::create() for the output array
	internally.
	@param rows New number of rows.
	@param cols New number of columns.
	@param type New matrix type.
	*/
	//create(rows : _st.int, cols : _st.int, type : _st.int) : void;
	static POLY_METHOD(create_rows_cols_type);

	/** @overload
	@param size Alternative new matrix size specification: Size(cols, rows)
	@param type New matrix type.
	*/
	//create(size : _types.Size | MatSize, type : _st.int) : void;
	static POLY_METHOD(create_size);
	static POLY_METHOD(create_matsize);

	/** @overload
	@param ndims New array dimensionality.
	@param sizes Array of integers specifying a new array shape.
	@param type New matrix type.
	*/
	//create(ndims: _st.int, sizes : Array<_st.int> | MatSize, type : _st.int) : void;
	static POLY_METHOD(create_ndims_size);
	static POLY_METHOD(create_ndims_matsize);

	/** @brief Increments the reference counter.

	The method increments the reference counter associated with the matrix data. If the matrix header
	points to an external data set (see Mat::Mat ), the reference counter is NULL, and the method has no
	effect in this case. Normally, to avoid memory leaks, the method should not be called explicitly. It
	is called implicitly by the matrix assignment operator. The reference counter increment is an atomic
	operation on the platforms that support it. Thus, it is safe to operate on the same matrices
	asynchronously in different threads.
	*/
	//void addref();

	/** @brief Decrements the reference counter and deallocates the matrix if needed.

	The method decrements the reference counter associated with the matrix data. When the reference
	counter reaches 0, the matrix data is deallocated and the data and the reference counter pointers
	are set to NULL's. If the matrix header points to an external data set (see Mat::Mat ), the
	reference counter is NULL, and the method has no effect in this case.

	This method can be called manually to force the matrix data deallocation. But since this method is
	automatically called in the destructor, or by any other method that changes the data pointer, it is
	usually not needed. The reference counter decrement and check for 0 is an atomic operation on the
	platforms that support it. Thus, it is safe to operate on the same matrices asynchronously in
	different threads.
	*/
	//void release();

	//! deallocates the matrix data
	//void deallocate();
	//! internal use function; properly re-allocates _size, _step arrays
	//void copySize(const Mat& m);

	/** @brief Reserves space for the certain number of rows.

	The method reserves space for sz rows. If the matrix already has enough space to store sz rows,
	nothing happens. If the matrix is reallocated, the first Mat::rows rows are preserved. The method
	emulates the corresponding method of the STL vector class.
	@param sz Number of rows.
	*/
	//void reserve(size_t sz);

	/** @brief Changes the number of matrix rows.

	The methods change the number of matrix rows. If the matrix is reallocated, the first
	min(Mat::rows, sz) rows are preserved. The methods emulate the corresponding methods of the STL
	vector class.
	@param sz New number of rows.
	*/
	//resize(sz: _st.size_t) : void;
	static POLY_METHOD(resize);

	/** @overload
	@param sz New number of rows.
	@param s Value assigned to the newly added elements.
	*/
	//resize(sz: _st.size_t, s : _types.Scalar) : void;

	//! internal function
	//void push_back_(const void* elem);

	/** @brief Adds elements to the bottom of the matrix.

	The methods add one or more elements to the bottom of the matrix. They emulate the corresponding
	method of the STL vector class. When elem is Mat , its type and the number of columns must be the
	same as in the container matrix.
	@param elem Added element(s).
	*/
	//template < typename _Tp> void push_back(const _Tp& elem);

	/** @overload
	@param elem Added element(s).
	*/
	//template < typename _Tp> void push_back(const Mat_<_Tp>& elem);

	/** @overload
	@param m Added line(s).
	*/
	//void push_back(const Mat& m);

	/** @brief Removes elements from the bottom of the matrix.

	The method removes one or more rows from the bottom of the matrix.
	@param nelems Number of removed rows. If it is greater than the total number of rows, an exception
	is thrown.
	*/
	//void pop_back(size_t nelems= 1);

	/** @brief Locates the matrix header within a parent matrix.

	After you extracted a submatrix from a matrix using Mat::row, Mat::col, Mat::rowRange,
	Mat::colRange, and others, the resultant submatrix points just to the part of the original big
	matrix. However, each submatrix contains information (represented by datastart and dataend
	fields) that helps reconstruct the original matrix size and the position of the extracted
	submatrix within the original matrix. The method locateROI does exactly that.
	@param wholeSize Output parameter that contains the size of the whole matrix containing *this*
	as a part.
	@param ofs Output parameter that contains an offset of *this* inside the whole matrix.
	*/
	//void locateROI(Size & wholeSize, Point & ofs) const;

	/** @brief Adjusts a submatrix size and position within the parent matrix.

	The method is complimentary to Mat::locateROI . The typical use of these functions is to determine
	the submatrix position within the parent matrix and then shift the position somehow. Typically, it
	can be required for filtering operations when pixels outside of the ROI should be taken into
	account. When all the method parameters are positive, the ROI needs to grow in all directions by the
	specified amount, for example:
	@code
	A.adjustROI(2, 2, 2, 2);
	@endcode
	In this example, the matrix size is increased by 4 elements in each direction. The matrix is shifted
	by 2 elements to the left and 2 elements up, which brings in all the necessary pixels for the
	filtering with the 5x5 kernel.

	adjustROI forces the adjusted ROI to be inside of the parent matrix that is boundaries of the
	adjusted ROI are constrained by boundaries of the parent matrix. For example, if the submatrix A is
	located in the first row of a parent matrix and you called A.adjustROI(2, 2, 2, 2) then A will not
	be increased in the upward direction.

	The function is used internally by the OpenCV filtering functions, like filter2D , morphological
	operations, and so on.
	@param dtop Shift of the top submatrix boundary upwards.
	@param dbottom Shift of the bottom submatrix boundary downwards.
	@param dleft Shift of the left submatrix boundary to the left.
	@param dright Shift of the right submatrix boundary to the right.
	@sa copyMakeBorder
	*/
	//Mat & adjustROI(int dtop, int dbottom, int dleft, int dright );

	/** @brief Extracts a rectangular submatrix.

	The operators make a new header for the specified sub-array of \*this . They are the most
	generalized forms of Mat::row, Mat::col, Mat::rowRange, and Mat::colRange . For example,
	`A(Range(0, 10), Range::all())` is equivalent to `A.rowRange(0, 10)`. Similarly to all of the above,
	the operators are O(1) operations, that is, no matrix data is copied.
	@param rowRange Start and end row of the extracted submatrix. The upper boundary is not included. To
	select all the rows, use Range::all().
	@param colRange Start and end column of the extracted submatrix. The upper boundary is not included.
	To select all the columns, use Range::all().
	*/
	//Mat operator()(Range rowRange, Range colRange ) const;

	/** @overload
	@param roi Extracted submatrix specified as a rectangle.
	*/
	//Mat operator()( const Rect& roi ) const;
	//roi(roi : _types.Rect) : Mat;
	static POLY_METHOD(roi_rect);

	/** @overload
	@param ranges Array of selected ranges along each array dimension.
	*/
	//roi(ranges: Array<_types.Range>) : Mat;
	static POLY_METHOD(roi_ranges);

	// //! converts header to CvMat; no data is copied
	// operator CvMat() const;
	// //! converts header to CvMatND; no data is copied
	// operator CvMatND() const;
	// //! converts header to IplImage; no data is copied
	// operator IplImage() const;

	//template < typename _Tp> operator std::vector<_Tp>() const;
	//template < typename _Tp, int n> operator Vec<_Tp, n>() const;
	//template < typename _Tp, int m, int n> operator Matx<_Tp, m, n>() const;

	/** @brief Reports whether the matrix is continuous or not.

	The method returns true if the matrix elements are stored continuously without gaps at the end of
	each row. Otherwise, it returns false. Obviously, 1x1 or 1xN matrices are always continuous.
	Matrices created with Mat::create are always continuous. But if you extract a part of the matrix
	using Mat::col, Mat::diag, and so on, or constructed a matrix header for externally allocated data,
	such matrices may no longer have this property.

	The continuity flag is stored as a bit in the Mat::flags field and is computed automatically when
	you construct a matrix header. Thus, the continuity check is a very fast operation, though
	theoretically it could be done as follows:
	@code
	// alternative implementation of Mat::isContinuous()
	bool myCheckMatContinuity(const Mat& m)
	{
	//return (m.flags & Mat::CONTINUOUS_FLAG) != 0;
	return m.rows == 1 || m.step == m.cols*m.elemSize();
	}
	@endcode
	The method is used in quite a few of OpenCV functions. The point is that element-wise operations
	(such as arithmetic and logical operations, math functions, alpha blending, color space
	transformations, and others) do not depend on the image geometry. Thus, if all the input and output
	arrays are continuous, the functions can process them as very long single-row vectors. The example
	below illustrates how an alpha-blending function can be implemented:
	@code
	template<typename T>
	void alphaBlendRGBA(const Mat& src1, const Mat& src2, Mat& dst)
	{
	const float alpha_scale = (float)std::numeric_limits<T>::max(),
	inv_scale = 1.f/alpha_scale;

	CV_Assert( src1.type() == src2.type() &&
	src1.type() == CV_MAKETYPE(DataType<T>::depth, 4) &&
	src1.size() == src2.size());
	Size size = src1.size();
	dst.create(size, src1.type());

	// here is the idiom: check the arrays for continuity and,
	// if this is the case,
	// treat the arrays as 1D vectors
	if( src1.isContinuous() && src2.isContinuous() && dst.isContinuous() )
	{
	size.width *= size.height;
	size.height = 1;
	}
	size.width *= 4;

	for( int i = 0; i < size.height; i++ )
	{
	// when the arrays are continuous,
	// the outer loop is executed only once
	const T* ptr1 = src1.ptr<T>(i);
	const T* ptr2 = src2.ptr<T>(i);
	T* dptr = dst.ptr<T>(i);

	for( int j = 0; j < size.width; j += 4 )
	{
	float alpha = ptr1[j+3]*inv_scale, beta = ptr2[j+3]*inv_scale;
	dptr[j] = saturate_cast<T>(ptr1[j]*alpha + ptr2[j]*beta);
	dptr[j+1] = saturate_cast<T>(ptr1[j+1]*alpha + ptr2[j+1]*beta);
	dptr[j+2] = saturate_cast<T>(ptr1[j+2]*alpha + ptr2[j+2]*beta);
	dptr[j+3] = saturate_cast<T>((1 - (1-alpha)*(1-beta))*alpha_scale);
	}
	}
	}
	@endcode
	This approach, while being very simple, can boost the performance of a simple element-operation by
	10-20 percents, especially if the image is rather small and the operation is quite simple.

	Another OpenCV idiom in this function, a call of Mat::create for the destination array, that
	allocates the destination array unless it already has the proper size and type. And while the newly
	allocated arrays are always continuous, you still need to check the destination array because
	Mat::create does not always allocate a new matrix.
	*/
	//isContinuous() : boolean;
	static POLY_METHOD(isContinuous);

	//! returns true if the matrix is a submatrix of another matrix
	//bool isSubmatrix() const;

	/** @brief Returns the matrix element size in bytes.

	The method returns the matrix element size in bytes. For example, if the matrix type is CV_16SC3 ,
	the method returns 3\*sizeof(short) or 6.
	*/
	//elemSize() : _st.size_t;
	static POLY_METHOD(elemSize);

	/** @brief Returns the size of each matrix element channel in bytes.

	The method returns the matrix element channel size in bytes, that is, it ignores the number of
	channels. For example, if the matrix type is CV_16SC3 , the method returns sizeof(short) or 2.
	*/
	//elemSize1() : _st.size_t;
	static POLY_METHOD(elemSize1);

	/** @brief Returns the type of a matrix element.

	The method returns a matrix element type. This is an identifier compatible with the CvMat type
	system, like CV_16SC3 or 16-bit signed 3-channel array, and so on.
	*/
	//type() : _st.int;
	static POLY_METHOD(type);

	/** @brief Returns the depth of a matrix element.

	The method returns the identifier of the matrix element depth (the type of each individual channel).
	For example, for a 16-bit signed element array, the method returns CV_16S . A complete list of
	matrix types contains the following values:
	-   CV_8U - 8-bit unsigned integers ( 0..255 )
	-   CV_8S - 8-bit signed integers ( -128..127 )
	-   CV_16U - 16-bit unsigned integers ( 0..65535 )
	-   CV_16S - 16-bit signed integers ( -32768..32767 )
	-   CV_32S - 32-bit signed integers ( -2147483648..2147483647 )
	-   CV_32F - 32-bit floating-point numbers ( -FLT_MAX..FLT_MAX, INF, NAN )
	-   CV_64F - 64-bit floating-point numbers ( -DBL_MAX..DBL_MAX, INF, NAN )
	*/
	//depth() : _st.int;
	static POLY_METHOD(depth);

	/** @brief Returns the number of matrix channels.

	The method returns the number of matrix channels.
	*/
	//channels() : _st.int;
	static POLY_METHOD(channels);

	/** @brief Returns a normalized step.

	The method returns a matrix step divided by Mat::elemSize1() . It can be useful to quickly access an
	arbitrary matrix element.
	*/
	//size_t step1(int i= 0) const;

	/** @brief Returns true if the array has no elements.

	The method returns true if Mat::total() is 0 or if Mat::data is NULL. Because of pop_back() and
	resize() methods `M.total() == 0` does not imply that `M.data == NULL`.
	*/
	//empty() : boolean;
	static POLY_METHOD(empty);

	/** @brief Returns the total number of array elements.

	The method returns the number of array elements (a number of pixels if the array represents an
	image).
	*/
	//total() :_st.size_t
	static POLY_METHOD(total);
		

		//! returns N if the matrix is 1-channel (N x ptdim) or ptdim-channel (1 x N) or (N x 1); negative number otherwise
		//int checkVector(int elemChannels, int depth= -1, bool requireContinuous= true) const;

		/** @brief Returns a pointer to the specified matrix row.

		The methods return `uchar*` or typed pointer to the specified matrix row. See the sample in
		Mat::isContinuous to know how to use these methods.
		@param i0 A 0-based row index.
		*/

		//ptr<T>(T: string, i0 ? : _st.int /* = 0*/) : TrackedPtr<T>;
	static POLY_METHOD(ptr);

	//uchar * ptr(int i0= 0);
	/** @overload */
	//const uchar* ptr(int i0= 0) const;

	/** @overload */
	//uchar * ptr(int i0, int i1);
	/** @overload */
	//const uchar* ptr(int i0, int i1) const;

	/** @overload */
	//uchar * ptr(int i0, int i1, int i2);
	/** @overload */
	//const uchar* ptr(int i0, int i1, int i2) const;

	/** @overload */
	//uchar * ptr(const int* idx);
	/** @overload */
	//const uchar* ptr(const int* idx) const;
	/** @overload */
	//template < int n> uchar * ptr(const Vec<int, n>& idx);
	/** @overload */
	//template < int n> const uchar* ptr(const Vec<int, n>& idx) const;

	/** @overload */
	//template < typename _Tp> _Tp * ptr(int i0= 0);
	/** @overload */
	//template < typename _Tp> const _Tp* ptr(int i0= 0) const;
	/** @overload */
	//template < typename _Tp> _Tp * ptr(int i0, int i1);
	/** @overload */
	//template < typename _Tp> const _Tp* ptr(int i0, int i1) const;
	/** @overload */
	//template < typename _Tp> _Tp * ptr(int i0, int i1, int i2);
	/** @overload */
	//template < typename _Tp> const _Tp* ptr(int i0, int i1, int i2) const;
	/** @overload */
	//template < typename _Tp> _Tp * ptr(const int* idx);
	/** @overload */
	//template < typename _Tp> const _Tp* ptr(const int* idx) const;
	/** @overload */
	//template < typename _Tp, int n> _Tp * ptr(const Vec<int, n>& idx);
	/** @overload */
	//template < typename _Tp, int n> const _Tp* ptr(const Vec<int, n>& idx) const;

	/** @brief Returns a reference to the specified array element.

	The template methods return a reference to the specified array element. For the sake of higher
	performance, the index range checks are only performed in the Debug configuration.

	Note that the variants with a single index (i) can be used to access elements of single-row or
	single-column 2-dimensional arrays. That is, if, for example, A is a 1 x N floating-point matrix and
	B is an M x 1 integer matrix, you can simply write `A.at<float>(k+4)` and `B.at<int>(2*i+1)`
	instead of `A.at<float>(0,k+4)` and `B.at<int>(2*i+1,0)`, respectively.

	The example below initializes a Hilbert matrix:
	@code
	Mat H(100, 100, CV_64F);
	for(int i = 0; i < H.rows; i++)
	for(int j = 0; j < H.cols; j++)
	H.at<double>(i,j)=1./(i+j+1);
	@endcode

	Keep in mind that the size identifier used in the at operator cannot be chosen at random. It depends
	on the image from which you are trying to retrieve the data. The table below gives a better insight in this:
	- If matrix is of type `CV_8U` then use `Mat.at<uchar>(y,x)`.
	- If matrix is of type `CV_8S` then use `Mat.at<schar>(y,x)`.
	- If matrix is of type `CV_16U` then use `Mat.at<ushort>(y,x)`.
	- If matrix is of type `CV_16S` then use `Mat.at<short>(y,x)`.
	- If matrix is of type `CV_32S`  then use `Mat.at<int>(y,x)`.
	- If matrix is of type `CV_32F`  then use `Mat.at<float>(y,x)`.
	- If matrix is of type `CV_64F` then use `Mat.at<double>(y,x)`.

	@param i0 Index along the dimension 0
	*/

	//atGet<T>(T: string, i0: _st.int, i1?: _st.int, i2?: _st.int): T;
	//atSet<T>(T: string, value: T, i0: _st.int, i1?: _st.int, i2?: _st.int): void;
	//at<T>(T: string, i0 : _st.int, i1 ? : _st.int, i2 ? : _st.int) : TrackedElement<T>;
	static POLY_METHOD(at);

	//template < typename _Tp> _Tp & at(int i0= 0);
	/** @overload
	@param i0 Index along the dimension 0
	*/
	//template < typename _Tp> const _Tp& at(int i0= 0) const;
	/** @overload
	@param i0 Index along the dimension 0
	@param i1 Index along the dimension 1
	*/
	//template < typename _Tp> _Tp & at(int i0, int i1);
	/** @overload
	@param i0 Index along the dimension 0
	@param i1 Index along the dimension 1
	*/
	//template < typename _Tp> const _Tp& at(int i0, int i1) const;

	/** @overload
	@param i0 Index along the dimension 0
	@param i1 Index along the dimension 1
	@param i2 Index along the dimension 2
	*/
	//template < typename _Tp> _Tp & at(int i0, int i1, int i2);
	/** @overload
	@param i0 Index along the dimension 0
	@param i1 Index along the dimension 1
	@param i2 Index along the dimension 2
	*/
	//template < typename _Tp> const _Tp& at(int i0, int i1, int i2) const;

	/** @overload
	@param idx Array of Mat::dims indices.
	*/
	//template < typename _Tp> _Tp & at(const int* idx);
	/** @overload
	@param idx Array of Mat::dims indices.
	*/
	//template < typename _Tp> const _Tp& at(const int* idx) const;

	/** @overload */
	//template < typename _Tp, int n> _Tp & at(const Vec<int, n>& idx);
	/** @overload */
	//template < typename _Tp, int n> const _Tp& at(const Vec<int, n>& idx) const;

	/** @overload
	special versions for 2D arrays (especially convenient for referencing image pixels)
	@param pt Element position specified as Point(j,i) .
	*/
	//template < typename _Tp> _Tp & at(Point pt);
	/** @overload
	special versions for 2D arrays (especially convenient for referencing image pixels)
	@param pt Element position specified as Point(j,i) .
	*/
	//template < typename _Tp> const _Tp& at(Point pt) const;

	/** @brief Returns the matrix iterator and sets it to the first matrix element.

	The methods return the matrix read-only or read-write iterators. The use of matrix iterators is very
	similar to the use of bi-directional STL iterators. In the example below, the alpha blending
	function is rewritten using the matrix iterators:
	@code
	template<typename T>
	void alphaBlendRGBA(const Mat& src1, const Mat& src2, Mat& dst)
	{
	typedef Vec<T, 4> VT;

	const float alpha_scale = (float)std::numeric_limits<T>::max(),
	inv_scale = 1.f/alpha_scale;

	CV_Assert( src1.type() == src2.type() &&
	src1.type() == DataType<VT>::type &&
	src1.size() == src2.size());
	Size size = src1.size();
	dst.create(size, src1.type());

	MatConstIterator_<VT> it1 = src1.begin<VT>(), it1_end = src1.end<VT>();
	MatConstIterator_<VT> it2 = src2.begin<VT>();
	MatIterator_<VT> dst_it = dst.begin<VT>();

	for( ; it1 != it1_end; ++it1, ++it2, ++dst_it )
	{
	VT pix1 = *it1, pix2 = *it2;
	float alpha = pix1[3]*inv_scale, beta = pix2[3]*inv_scale;
	*dst_it = VT(saturate_cast<T>(pix1[0]*alpha + pix2[0]*beta),
	saturate_cast<T>(pix1[1]*alpha + pix2[1]*beta),
	saturate_cast<T>(pix1[2]*alpha + pix2[2]*beta),
	saturate_cast<T>((1 - (1-alpha)*(1-beta))*alpha_scale));
	}
	}
	@endcode
	*/
	//template < typename _Tp> MatIterator_ < _Tp > begin();
	//template < typename _Tp> MatConstIterator_ < _Tp > begin() const;

	/** @brief Returns the matrix iterator and sets it to the after-last matrix element.

	The methods return the matrix read-only or read-write iterators, set to the point following the last
	matrix element.
	*/
	//template < typename _Tp> MatIterator_ < _Tp > end();
	//template < typename _Tp> MatConstIterator_ < _Tp > end() const;

	/** @brief Invoke with arguments functor, and runs the functor over all matrix element.

	The methods runs operation in parallel. Operation is passed by arguments. Operation have to be a
	function pointer, a function object or a lambda(C++11).

	All of below operation is equal. Put 0xFF to first channel of all matrix elements:
	@code
	Mat image(1920, 1080, CV_8UC3);
	typedef cv::Point3_<uint8_t> Pixel;

	// first. raw pointer access.
	for (int r = 0; r < image.rows; ++r) {
	Pixel* ptr = image.ptr<Pixel>(0, r);
	const Pixel* ptr_end = ptr + image.cols;
	for (; ptr != ptr_end; ++ptr) {
	ptr->x = 255;
	}
	}

	// Using MatIterator. (Simple but there are a Iterator's overhead)
	for (Pixel &p : cv::Mat_<Pixel>(image)) {
	p.x = 255;
	}

	// Parallel execution with function object.
	struct Operator {
	void operator ()(Pixel &pixel, const int * position) {
	pixel.x = 255;
	}
	};
	image.forEach<Pixel>(Operator());

	// Parallel execution using C++11 lambda.
	image.forEach<Pixel>([](Pixel &p, const int * position) -> void {
	p.x = 255;
	});
	@endcode
	position parameter is index of current pixel:
	@code
	// Creating 3D matrix (255 x 255 x 255) typed uint8_t,
	//  and initialize all elements by the value which equals elements position.
	//  i.e. pixels (x,y,z) = (1,2,3) is (b,g,r) = (1,2,3).

	int sizes[] = { 255, 255, 255 };
	typedef cv::Point3_<uint8_t> Pixel;

	Mat_<Pixel> image = Mat::zeros(3, sizes, CV_8UC3);

	image.forEachWithPosition([&](Pixel& pixel, const int position[]) -> void{
	pixel.x = position[0];
	pixel.y = position[1];
	pixel.z = position[2];
	});
	@endcode
	*/
	//template < typename _Tp, typename Functor> void forEach(const Functor& operation);
	/** @overload */
	//template < typename _Tp, typename Functor> void forEach(const Functor& operation) const;

	//#ifdef CV_CXX_MOVE_SEMANTICS
	//Mat(Mat && m);
	//Mat & operator = (Mat && m);
	//#endif

	//enum { MAGIC_VAL = 0x42FF0000, AUTO_STEP = 0, CONTINUOUS_FLAG = CV_MAT_CONT_FLAG, SUBMATRIX_FLAG = CV_SUBMAT_FLAG };
	//enum { MAGIC_MASK = 0xFFFF0000, TYPE_MASK = 0x00000FFF, DEPTH_MASK = 7 };

	/*! includes several bit-fields:
	- the magic signature
	- continuity flag
	- depth
	- number of channels
	*/
	//int flags;
	//! the matrix dimensionality, >= 2
//dims: _st.int;
static NAN_PROPERTY_GETTER(dims);
	
	//! the number of rows and columns or (-1, -1) when the matrix has more than 2 dimensions
	//int rows, cols;
	//rows() : _st.int;
	static POLY_METHOD(rows);

	//cols() : _st.int;
	static POLY_METHOD(cols);
	//! pointer to the data
	//uchar * data;

	//data() : Buffer;
	static POLY_METHOD(data);

	//! helper fields used in locateROI and adjustROI
	//const uchar* datastart;
	//const uchar* dataend;
	//const uchar* datalimit;

	//! custom allocator
	//MatAllocator * allocator;
	//! and the standard allocator
	//static MatAllocator * getStdAllocator();
	//static MatAllocator * getDefaultAllocator();
	//static void setDefaultAllocator(MatAllocator * allocator);

	//! interaction with UMat
	//UMatData * u;

	//MatSize size;
	//size() : MatSize;// _types.Size;
	static POLY_METHOD(size);

					 //row length in number of elements
//step: number;
	static NAN_PROPERTY_GETTER(step);
	//MatStep step;

	//protected:
	//template < typename _Tp, typename Functor> void forEach_impl(const Functor& operation);


};

#endif