//TODO: implement 2nd stage 
//import tape = require("tape");
//import path = require("path");
//
//import async = require("async");
//import alvision = require("../../../tsbinding/alvision");
//import util = require('util');
//import fs = require('fs');


////#include "test_precomp.hpp"
////
////using namespace cv;
////using namespace std;

//function cvTsGetRandomSparseMat(dims: alvision.int, sz: Array<alvision.int>, type: alvision.int ,
//    nzcount: alvision.int, a: alvision.double, b: alvision.double , rng : alvision.RNG) : alvision.SparseMat 
//{
//    var m = new alvision.SparseMat (dims, sz, type);
//    //int i, j;
//    alvision.CV_Assert(()=>alvision.MatrixType.CV_MAT_CN(type) == 1);
//    for (var i = 0; i < nzcount; i++) {
//        var idx = new Array<alvision.int>(alvision.CV_MAX_DIM);
//        for (var j = 0; j < dims; j++)
//            idx[j] = alvision.cvtest.randInt(rng).valueOf() % sz[j].valueOf();
//        var val = alvision.cvtest.randReal(rng).valueOf() * (b.valueOf() - a.valueOf()) + a.valueOf();
//        //uchar* ptr = m.ptr(idx, true, 0);
//        if (type == alvision.MatrixType.CV_8U) {
//            (() => {
//                var ptr = m.ptr<alvision.uchar>("uchar", idx, true, null);
//                ptr.set(alvision.saturate_cast<alvision.uchar>(val, "uchar"));
//            })();
//        }
//        else if (type == alvision.MatrixType.CV_8S) {
//            (() => {
//                var ptr = m.ptr<alvision.schar>("schar", idx, true, null);
//                ptr.set(alvision.saturate_cast<alvision.schar>(val, "schar"));
//            })();
//        }
//        else if (type == alvision.MatrixType.CV_16U) {
//            (() => {
//                var ptr = m.ptr<alvision.ushort>("ushort", idx, true, null);
//                ptr.set(alvision.saturate_cast<alvision.ushort>(val, "ushort"));
//            })();
//        }
//        else if (type == alvision.MatrixType.CV_16S) {
//            (() => {
//                var ptr = m.ptr<alvision.short>("short", idx, true, null);
//                ptr.set(alvision.saturate_cast<alvision.short>(val, "short"));
//            })();
//        }
//        else if (type == alvision.MatrixType.CV_32S) {
//            (() => {
//                var ptr = m.ptr<alvision.int>("int", idx, true, null);
//                ptr.set(alvision.saturate_cast<alvision.int>(val, "int"));
//            })();
//        }
//        else if (type == alvision.MatrixType.CV_32F) {
//            (() => {
//                var ptr = m.ptr<alvision.float>("float", idx, true, null);
//                ptr.set(alvision.saturate_cast<alvision.float>(val, "float"));
//            })();
//        }
//        else {
//            (() => {
//                var ptr = m.ptr<alvision.double>("double", idx, true, null);
//                ptr.set(alvision.saturate_cast<alvision.double>(val, "double"));
//            })();
//        }
//    }

//    return m;
//}

//function cvTsCheckSparse(m1: alvision.SparseMat, m2: alvision.SparseMat, eps : alvision.double): boolean
//{
//    //CvSparseMatIterator it1;
//    //CvSparseNode* node1;
//    var depth =alvision.MatrixType.CV_MAT_DEPTH(m1.type);

//    if( m1.heap.active_count != m2.heap.active_count ||
//       m1.dims != m2.dims || CV_MAT_TYPE(m1.type) != CV_MAT_TYPE(m2.type) )
//        return false;

//    for( node1 = cvInitSparseMatIterator( m1, &it1 );
//        node1 != 0; node1 = cvGetNextSparseNode( &it1 ))
//    {
//        uchar* v1 = (uchar*)CV_NODE_VAL(m1,node1);
//        uchar* v2 = cvPtrND( m2, CV_NODE_IDX(m1,node1), 0, 0, &node1.hashval );
//        if( !v2 )
//            return false;
//        if (depth == alvision.MatrixType.CV_8U || depth == alvision.MatrixType.CV_8S )
//        {
//            if( *v1 != *v2 )
//                return false;
//        }
//        else if (depth == alvision.MatrixType.CV_16U || depth == alvision.MatrixType.CV_16S )
//        {
//            if( *(ushort*)v1 != *(ushort*)v2 )
//                return false;
//        }
//        else if (depth == alvision.MatrixType.CV_32S )
//        {
//            if( *(int*)v1 != *(int*)v2 )
//                return false;
//        }
//        else if (depth == alvision.MatrixType.CV_32F )
//        {
//            if( Math.abs(*(float*)v1 - *(float*)v2) > eps*(Math.abs(*(float*)v2) + 1) )
//                return false;
//        }
//        else if( Math.abs(*(double*)v1 - *(double*)v2) > eps*(Math.abs(*(double*)v2) + 1) )
//            return false;
//    }

//    return true;
//}


//class Core_IOTest  extends alvision.cvtest.BaseTest
//{
//    run(iii: alvision.int) : void
//    {
//        var ranges = [[0, 256], [-128, 128], [0, 65536], [-32768, 32768],
//            [-1000000, 1000000], [-10, 10], [-10, 10]];
//        var rng = this.ts.get_rng();
//        var rng0 = new alvision.RNG();
//        this.test_case_count = 4;
//        var progress = 0;
//        var storage = new MemStorage(cvCreateMemStorage(0));

//        for( var idx = 0; idx < this.test_case_count; idx++ )
//        {
//            this.ts.update_context( this, idx, false );
//            progress = this.update_progress( progress, idx, this.test_case_count, 0 );

//            cvClearMemStorage(storage);

//            var mem = (idx % 4) >= 2;
//            var filename = alvision.tempfile(idx % 2 ? ".yml" : ".xml");

//            var fs = new alvision.FileStorage(filename, alvision.FileStorageMode.WRITE + (mem ? alvision.FileStorageMode.MEMORY : 0));

//            var test_int = alvision.cvtest.randInt(rng);
//            var test_real = (alvision.cvtest.randInt(rng).valueOf() %2?1:-1)*exp(alvision.cvtest.randReal(rng).valueOf()*18-9);
//            var test_string = "vw wv23424rt\"&amp;&lt;&gt;&amp;&apos;@#$@$%$%&%IJUKYILFD@#$@%$&*&() ";

//            var depth = alvision.cvtest.randInt(rng).valueOf() % (alvision.MatrixType.CV_64F+1);
//            var cn = alvision.cvtest.randInt(rng).valueOf() % 4 + 1;
//            var test_mat = new alvision.Mat(alvision.cvtest.randInt(rng).valueOf() % 30 + 1, alvision.cvtest.randInt(rng).valueOf() % 30 + 1, alvision.MatrixType.CV_MAKETYPE(depth, cn));

//            rng0.fill(test_mat, alvision.DistType.UNIFORM, alvision.Scalar.all(ranges[depth][0]), alvision.Scalar.all(ranges[depth][1]));
//            if (depth >= alvision.MatrixType.CV_32F )
//            {
//                alvision.exp(test_mat, test_mat);
//                var test_mat_scale = new alvision.Mat(test_mat.size(), test_mat.type());
//                rng0.fill(test_mat_scale, alvision.DistType.UNIFORM,alvision. Scalar.all(-1), alvision.Scalar.all(1));
//                alvision.multiply(test_mat, test_mat_scale, test_mat);
//            }

//            CvSeq* seq = cvCreateSeq(test_mat.type(), (int)sizeof(CvSeq),
//                                     (int)test_mat.elemSize(), storage);
//            cvSeqPushMulti(seq, test_mat.ptr(), test_mat.cols*test_mat.rows);

//            CvGraph* graph = cvCreateGraph( CV_ORIENTED_GRAPH,
//                                           sizeof(CvGraph), sizeof(CvGraphVtx),
//                                           sizeof(CvGraphEdge), storage );
//            var edges = [[0,1],[1,2],[2,0],[0,3],[3,4],[4,1]];
//            var vcount = 5, ecount = 6;
//            for(var i = 0; i < vcount; i++ )
//                cvGraphAddVtx(graph);
//            for(var i = 0; i < ecount; i++ )
//            {
//                CvGraphEdge* edge;
//                cvGraphAddEdge(graph, edges[i][0], edges[i][1], 0, &edge);
//                edge.weight = (float)(i+1);
//            }

//            depth = alvision.cvtest.randInt(rng).valueOf() % (alvision.MatrixType.CV_64F+1);
//            cn = alvision.cvtest.randInt(rng).valueOf() % 4 + 1;
//            var sz = [
//                (alvision.cvtest.randInt(rng).valueOf()%10+1),
//                (alvision.cvtest.randInt(rng).valueOf()%10+1),
//                (alvision.cvtest.randInt(rng).valueOf()%10+1),
//            ];
//            var test_mat_nd = new alvision.MatND (3, sz, alvision.MatrixType.CV_MAKETYPE(depth, cn));

//            rng0.fill(test_mat_nd, alvision.DistType.UNIFORM, Scalar.all(ranges[depth][0]), Scalar.all(ranges[depth][1]));
//            if (depth >= alvision.MatrixType.CV_32F )
//            {
//                alvision.exp(test_mat_nd, test_mat_nd);
//                var test_mat_scale = new alvision.MatND (test_mat_nd.dims, test_mat_nd.size, test_mat_nd.type());
//                rng0.fill(test_mat_scale, alvision.DistType.UNIFORM, Scalar.all(-1), Scalar.all(1));
//                alvision.multiply(test_mat_nd, test_mat_scale, test_mat_nd);
//            }

//            int ssz = [
//                (alvision.cvtest.randInt(rng).valueOf()%10+1),
//                (alvision.cvtest.randInt(rng).valueOf()%10+1),
//                (alvision.cvtest.randInt(rng).valueOf()%10+1),
//                (alvision.cvtest.randInt(rng).valueOf()%10+1),
//            ];
//            var test_sparse_mat = cvTsGetRandomSparseMat(4, ssz, alvision.cvtest.randInt(rng).valueOf() % (alvision.MatrixType.CV_64F+1),
//                                                               alvision.cvtest.randInt(rng).valueOf() % 10000, 0, 100, rng);

//            fs.write("test_int", test_int);
//            fs.write("test_real", test_real);
//            fs.write("test_string", test_string);
//            fs.write("test_mat", test_mat);
//            fs.write("test_mat_nd", test_mat_nd);
//            fs.write("test_sparse_mat", test_sparse_mat);

//            fs << "test_list" << "[" << 0.0000000000001 << 2 << Math.PI << -3435345 << "2-502 2-029 3egegeg" <<
//            "{:" << "month" << 12 << "day" << 31 << "year" << 1969 << "}" << "]";
//            fs << "test_map" << "{" << "x" << 1 << "y" << 2 << "width" << 100 << "height" << 200 << "lbp" << "[:";

//            const arr = [0, 1, 1, 0, 1, 1, 0, 1];
//            fs.writeRaw("u", arr, (int)(sizeof(arr)/sizeof(arr[0])));

//            fs << "]" << "}";
//            cvWriteComment(*fs, "test comment", 0);

//            fs.writeObj("test_seq", seq);
//            fs.writeObj("test_graph",graph);
//            CvGraph* graph2 = (CvGraph*)cvClone(graph);

//            string content = fs.releaseAndGetString();

//            if(!fs.open(mem ? content : filename, alvision.FileStorageMode.READ + (mem ? FileStorage::MEMORY : 0)))
//            {
//                this.ts.printf(util.format( alvision.cvtest.TSConstants.LOG, "filename %s can not be read\n", !mem ? filename : content);
//                this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_MISSING_TEST_DATA );
//                return;
//            }

//            var real_int = fs["test_int"];
//            var real_real = fs["test_real"];
//            var real_string = fs["test_string"];

//            if( real_int != test_int ||
//               Math.abs(real_real - test_real) > alvision.DBL_EPSILON*(Math.abs(test_real)+1) ||
//               real_string != test_string )
//            {
//                this.ts.printf( alvision.cvtest.TSConstants.LOG, "the read scalars are not correct\n" );
//                this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT );
//                return;
//            }

//            CvMat* m = (CvMat*)fs["test_mat"].readObj();
//            CvMat _test_mat = test_mat;
//            double max_diff = 0;
//            CvMat stub1, _test_stub1;
//            cvReshape(m, &stub1, 1, 0);
//            cvReshape(&_test_mat, &_test_stub1, 1, 0);
//            var pt = new Array<alvision.int>();

//            if( !m || !CV_IS_MAT(m) || m.rows != test_mat.rows || m.cols != test_mat.cols ||
//               alvision.cvtest.cmpEps( alvision.cvarrToMat(&stub1), alvision.cvarrToMat(&_test_stub1), &max_diff, 0, &pt, true) < 0 )
//            {
//                this.ts.printf( alvision.cvtest.TSConstants.LOG, "the read matrix is not correct: (%.20g vs %.20g) at (%d,%d)\n",
//                            cvGetReal2D(&stub1, pt[0], pt[1]), cvGetReal2D(&_test_stub1, pt[0], pt[1]),
//                            pt[0], pt[1] );
//                this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT );
//                return;
//            }
//            if( m && CV_IS_MAT(m))
//                cvReleaseMat(&m);

//            CvMatND* m_nd = (CvMatND*)fs["test_mat_nd"].readObj();
//            CvMatND _test_mat_nd = test_mat_nd;

//            if( !m_nd || !CV_IS_MATND(m_nd) )
//            {
//                this.ts.printf(alvision.cvtest.TSConstants.LOG, "the read nd-matrix is not correct\n" );
//                this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT );
//                return;
//            }

//            CvMat stub, _test_stub;
//            cvGetMat(m_nd, &stub, 0, 1);
//            cvGetMat(&_test_mat_nd, &_test_stub, 0, 1);
//            cvReshape(&stub, &stub1, 1, 0);
//            cvReshape(&_test_stub, &_test_stub1, 1, 0);

//            if( !CV_ARE_TYPES_EQ(&stub, &_test_stub) ||
//               !CV_ARE_SIZES_EQ(&stub, &_test_stub) ||
//               //cvNorm(&stub, &_test_stub, CV_L2) != 0 )
//               alvision.cvtest.cmpEps( alvision.cvarrToMat(&stub1), alvision.cvarrToMat(&_test_stub1), &max_diff, 0, &pt, true) < 0 )
//            {
//                this.ts.printf( alvision.cvtest.TSConstants.LOG, "readObj method: the read nd matrix is not correct: (%.20g vs %.20g) vs at (%d,%d)\n",
//                           cvGetReal2D(&stub1, pt[0], pt[1]), cvGetReal2D(&_test_stub1, pt[0], pt[1]),
//                           pt[0], pt[1] );
//                this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT );
//                return;
//            }

//            var mat_nd2 = new alvision.MatND();
//            fs["test_mat_nd"] >> mat_nd2;
//            CvMatND m_nd2 = mat_nd2;
//            cvGetMat(&m_nd2, &stub, 0, 1);
//            cvReshape(&stub, &stub1, 1, 0);

//            if( !CV_ARE_TYPES_EQ(&stub, &_test_stub) ||
//               !CV_ARE_SIZES_EQ(&stub, &_test_stub) ||
//               //cvNorm(&stub, &_test_stub, CV_L2) != 0 )
//               alvision.cvtest.cmpEps( alvision.cvarrToMat(&stub1), alvision.cvarrToMat(&_test_stub1), &max_diff, 0, &pt, true) < 0 )
//            {
//                this.ts.printf( alvision.cvtest.TSConstants.LOG, "C++ method: the read nd matrix is not correct: (%.20g vs %.20g) vs at (%d,%d)\n",
//                           cvGetReal2D(&stub1, pt[0], pt[1]), cvGetReal2D(&_test_stub1, pt[1], pt[0]),
//                           pt[0], pt[1] );
//                this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT );
//                return;
//            }

//            cvRelease((void**)&m_nd);

//            Ptr<CvSparseMat> m_s((CvSparseMat*)fs["test_sparse_mat"].readObj());
//            Ptr<CvSparseMat> _test_sparse_(cvCreateSparseMat(test_sparse_mat));
//            Ptr<CvSparseMat> _test_sparse((CvSparseMat*)cvClone(_test_sparse_));
//            SparseMat m_s2;
//            fs["test_sparse_mat"] >> m_s2;
//            Ptr<CvSparseMat> _m_s2(cvCreateSparseMat(m_s2));

//            if( !m_s || !CV_IS_SPARSE_MAT(m_s) ||
//               !cvTsCheckSparse(m_s, _test_sparse, 0) ||
//               !cvTsCheckSparse(_m_s2, _test_sparse, 0))
//            {
//                this.ts.printf( alvision.cvtest.TSConstants.LOG, "the read sparse matrix is not correct\n" );
//                this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT );
//                return;
//            }

//            FileNode tl = fs["test_list"];
//            if( tl.type() != FileNode::SEQ || tl.size() != 6 ||
//               Math.abs((double)tl[0] - 0.0000000000001) >= DBL_EPSILON ||
//               (int)tl[1] != 2 ||
//               Math.abs((double)tl[2] - Math.PI) >= DBL_EPSILON ||
//               (int)tl[3] != -3435345 ||
//               (String)tl[4] != "2-502 2-029 3egegeg" ||
//               tl[5].type() != FileNode::MAP || tl[5].size() != 3 ||
//               (int)tl[5]["month"] != 12 ||
//               (int)tl[5]["day"] != 31 ||
//               (int)tl[5]["year"] != 1969 )
//            {
//                ts.printf( alvision.cvtest.TSConstants.LOG, "the test list is incorrect\n" );
//                this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT );
//                return;
//            }

//            FileNode tm = fs["test_map"];
//            FileNode tm_lbp = tm["lbp"];

//            var real_x = tm["x"];
//            var real_y = tm["y"];
//            var real_width = tm["width"];
//            var real_height =tm["height"];

//            var real_lbp_val = 0;
//            FileNodeIterator it;
//            it = tm_lbp.begin();
//            real_lbp_val |= (int)*it << 0;
//            ++it;
//            real_lbp_val |= (int)*it << 1;
//            it++;
//            real_lbp_val |= (int)*it << 2;
//            it += 1;
//            real_lbp_val |= (int)*it << 3;
//            FileNodeIterator it2(it);
//            it2 += 4;
//            real_lbp_val |= (int)*it2 << 7;
//            --it2;
//            real_lbp_val |= (int)*it2 << 6;
//            it2--;
//            real_lbp_val |= (int)*it2 << 5;
//            it2 -= 1;
//            real_lbp_val |= (int)*it2 << 4;
//            it2 += -1;
//            alvision.CV_Assert(()=> it == it2 );

//            if( tm.type() != FileNode::MAP || tm.size() != 5 ||
//               real_x != 1 ||
//               real_y != 2 ||
//               real_width != 100 ||
//               real_height != 200 ||
//               tm_lbp.type() != FileNode::SEQ ||
//               tm_lbp.size() != 8 ||
//               real_lbp_val != 0xb6 )
//            {
//                ts.printf( alvision.cvtest.TSConstants.LOG, "the test map is incorrect\n" );
//                this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT );
//                return;
//            }

//            CvGraph* graph3 = (CvGraph*)fs["test_graph"].readObj();
//            if(graph2.active_count != vcount || graph3.active_count != vcount ||
//               graph2.edges.active_count != ecount || graph3.edges.active_count != ecount)
//            {
//                ts.printf( alvision.cvtest.TSConstants.LOG, "the cloned or read graph have wrong number of vertices or edges\n" );
//                this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT );
//                return;
//            }

//            for( i = 0; i < ecount; i++ )
//            {
//                CvGraphEdge* edge2 = cvFindGraphEdge(graph2, edges[i][0], edges[i][1]);
//                CvGraphEdge* edge3 = cvFindGraphEdge(graph3, edges[i][0], edges[i][1]);
//                if( !edge2 || edge2.weight != (float)(i+1) ||
//                   !edge3 || edge3.weight != (float)(i+1) )
//                {
//                    ts.printf( alvision.cvtest.TSConstants.LOG, "the cloned or read graph do not have the edge (%d, %d)\n", edges[i][0], edges[i][1] );
//                    this.ts.set_failed_test_info( alvision.cvtest.FailureCode.FAIL_INVALID_OUTPUT );
//                    return;
//                }
//            }

//            fs.release();
//            if( !mem )
//                remove(filename);
//        }
//    }
//}

//alvision.cvtest.TEST('Core_InputOutput', 'write_read_consistency', () => { var test = new Core_IOTest(); test.safe_run(); });

////extern void testFormatter();


//class UserDefinedType
//{
//    public a: alvision.int;
//    public b: alvision.float;

//    static op_Equals(x: UserDefinedType, y: UserDefinedType) {
//        return (x.a == y.a) && (x.b == y.b);
//    }
//};

//function write(fs: alvision.FileStorage,
//                         x: string,
//                         value: UserDefinedType) : void
//{
//    fs.writeScalar("{:");
//    fs.writeScalar("a");
//    fs.writeScalar(value.a);
//    fs.writeScalar("b");
//    fs.writeScalar(value.b);
//    fs.writeScalar( "}");
//}

//function read(node: alvision.FileNode ,
//    value: UserDefinedType ,
//    default_value: UserDefinedType  = new UserDefinedType()) : void {
//    if(node == null)
//    {
//        value = default_value;
//    }
//    else
//    {
//        node["a"] >> value.a;
//        node["b"] >> value.b;
//    }
//}

//class CV_MiscIOTest  extends alvision.cvtest.BaseTest
//{
//    run(iii : alvision.int): void 
//    {
//        try
//        {
//            var fname = alvision.tempfile(".xml");
//            var mi = new Array < alvision.int >() , mi2 = new Array <alvision. int >() , mi3 = new Array < alvision.int >() , mi4 = new Array<alvision.int>() ;
//            Array<Mat> mv, mv2, mv3, mv4;
//            Array<UserDefinedType> vudt, vudt2, vudt3, vudt4;
//            Mat m(10, 9, alvision.MatrixType.CV_32F);
//            Mat empty;
//            UserDefinedType udt = { 8, 3.3 };
//            randu(m, 0, 1);
//            mi3.push(5);
//            mv3.push(m);
//            vudt3.push(udt);
//            Point_<float> p1(1.1f, 2.2f), op1;
//            Point3i p2(3, 4, 5), op2;
//            Size s1(6, 7), os1;
//            Complex<int> c1(9, 10), oc1;
//            Rect r1(11, 12, 13, 14), or1;
//            Vec<int, 5> v1(15, 16, 17, 18, 19), ov1;
//            Scalar sc1(20.0, 21.1, 22.2, 23.3), osc1;
//            Range g1(7, 8), og1;

//            var fs = new alvision.FileStorage(fname, alvision.FileStorageMode.WRITE);
//            fs.write("mi", mi);
//            fs.write("mv", mv);
//            fs.write("mi3", mi3);
//            fs.write("mv3", mv3);
//            fs.write("vudt", vudt);
//            fs.write("vudt3", vudt3);
//            fs.write("empty", empty);
//            fs .write( "p1"         , p1);
//            fs .write( "p2"         , p2);
//            fs .write( "s1"         , s1);
//            fs .write( "c1"         , c1);
//            fs .write( "r1"         , r1);
//            fs.write("v1", v1);
//            fs.write("sc1", sc1);
//            fs.write("g1", g1);
//            fs.release();

//            fs.open(fname, alvision.FileStorageMode.READ);
//            fs["mi"] >> mi2;
//            fs["mv"] >> mv2;
//            fs["mi3"] >> mi4;
//            fs["mv3"] >> mv4;
//            fs["vudt"] >> vudt2;
//            fs["vudt3"] >> vudt4;
//            fs["empty"] >> empty;
//            fs["p1"] >> op1;
//            fs["p2"] >> op2;
//            fs["s1"] >> os1;
//            fs["c1"] >> oc1;
//            fs["r1"] >> or1;
//            fs["v1"] >> ov1;
//            fs["sc1"] >> osc1;
//            fs["g1"] >> og1;
//            alvision.CV_Assert(()=> mi2.empty() );
//            alvision.CV_Assert(()=> mv2.empty() );
//            alvision.CV_Assert(()=> alvision.cvtest.norm(Mat(mi3), Mat(mi4), CV_C) == 0 );
//            alvision.CV_Assert(()=> mv4.size() == 1 );
//            var n = alvision.cvtest.norm(mv3[0], mv4[0], CV_C);
//            alvision.CV_Assert(()=> vudt2.empty() );
//            alvision.CV_Assert(()=> vudt3 == vudt4 );
//            alvision.CV_Assert(()=> n == 0 );
//            alvision.CV_Assert(()=> op1 == p1 );
//            alvision.CV_Assert(()=> op2 == p2 );
//            alvision.CV_Assert(()=> os1 == s1 );
//            alvision.CV_Assert(()=> oc1 == c1 );
//            alvision.CV_Assert(()=> or1 == r1 );
//            alvision.CV_Assert(()=> ov1 == v1 );
//            alvision.CV_Assert(()=> osc1 == sc1 );
//            alvision.CV_Assert(()=> og1 == g1 );
//        }
//        catch(e)
//        {
//            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
//        }
//    }
//};

//alvision.cvtest.TEST('Core_InputOutput', 'misc', () => { var test = new CV_MiscIOTest(); test.safe_run(); });

///*class CV_BigMatrixIOTest  extends alvision.cvtest.BaseTest
//{
//public:
//    CV_BigMatrixIOTest() {}
//    ~CV_BigMatrixIOTest() {}
//protected:
//    void run(int)
//    {
//        try
//        {
//            var rng = alvision.theRNG();
//            int N = 1000, M = 1200000;
//            Mat mat(M, N, CV_32F);
//            rng.fill(mat, alvision.DistType.UNIFORM, 0, 1);
//            FileStorage fs(alvision.tempfile(".xml"), alvision.FileStorageMode.WRITE);
//            fs << "mat" << mat;
//            fs.release();
//        }
//        catch(e)
//        {
//            this.ts.set_failed_test_info(alvision.cvtest.FailureCode.FAIL_MISMATCH);
//        }
//    }
//};

//TEST(Core_InputOutput, huge) { CV_BigMatrixIOTest test; test.safe_run(); }
//*/

//alvision.cvtest.TEST('Core_globbing', 'accuracy',()=>
//{
//    var patternLena    = alvision.cvtest.TS.ptr().get_data_path() + "lena*.*";
//    var patternLenaPng = alvision.cvtest.TS.ptr().get_data_path() + "lena.png";

//        var lenas    = new Array<string>();
//        var pngLenas = new Array<string>();
//    alvision.glob(patternLena, lenas, true);
//    alvision.glob(patternLenaPng, pngLenas, true);

//    alvision.ASSERT_GT(lenas.length, pngLenas.length);

//    for (var i = 0; i < pngLenas.length; ++i)
//    {
//        alvision.ASSERT_NE(lenas.indexOf(pngLenas[i], -1);// std::find(lenas.begin(), lenas.end(), pngLenas[i]), lenas.end());
//    }
//});

//alvision.cvtest.TEST('Core_InputOutput', 'FileStorage', () => {
//    var file = alvision.tempfile(".xml");
//    var f = new alvision.FileStorage(file, alvision.FileStorageMode.WRITE);

//    var arr = util.format("sprintf is hell %d", 666);
//    alvision.EXPECT_NO_THROW(()=>f.writeScalar(arr));
//});
