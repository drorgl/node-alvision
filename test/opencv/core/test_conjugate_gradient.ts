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
// Copyright (C) 2013, OpenCV Foundation, all rights reserved.
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
// In no event shall the OpenCV Foundation or contributors be liable for any direct,
// indirect, incidental, special, exemplary, or consequential damages
// (including, but not limited to, procurement of substitute goods or services;
// loss of use, data, or profits; or business interruption) however caused
// and on any theory of liability, whether in contract, strict liability,
// or tort (including negligence or otherwise) arising in any way out of
// the use of this software, even if advised of the possibility of such damage.
//
//M*/

import tape = require("tape");
import path = require("path");

import async = require("async");
import alvision = require("../../../tsbinding/alvision");
import util = require('util');
import fs = require('fs');

//#include "test_precomp.hpp"
//#include <cstdlib>

function mytest(solver: alvision.ConjGradSolver, ptr_F: alvision.MinProblemSolverFunction, x: alvision.Mat,
    etalon_x: alvision.Mat, etalon_res: alvision.double ) : void{
    solver.setFunction(ptr_F);
    //int ndim=MAX(step.cols,step.rows);
    var res=solver.minimize(x);
    console.log("res:\n\t"+ res);
    console.log("x:\n\t" + x);
    console.log("etalon_res:\n\t" + etalon_res);
    console.log("etalon_x:\n\t" + etalon_x);
    var tol = 1e-2;
    alvision.ASSERT_TRUE(Math.abs(res.valueOf()-etalon_res.valueOf())<tol);
    /*for(alvision.Matd::iterator it1=x.begin<double>(),it2=etalon_x.begin<double>();it1!=x.end<double>();it1++,it2++){
        ASSERT_TRUE(Math.abs((*it1)-(*it2))<tol);
    }*/
    
    console.log("--------------------------\n");
}

class SphereF_CG implements alvision.MinProblemSolverFunction{
    getDims(): alvision.int{ return 4; }

    calc(x: Array<alvision.double>): alvision.double {
        return x[0].valueOf()*x[0].valueOf()+x[1].valueOf()*x[1].valueOf()+x[2].valueOf()*x[2].valueOf()+x[3].valueOf()*x[3].valueOf();
    }
    // use automatically computed gradient
    /*void getGradient(const double* x,double* grad){
        for(int i=0;i<4;i++){
            grad[i]=2*x[i];
        }
    }*/
};
class RosenbrockF_CG implements alvision.MinProblemSolverFunction{
    getDims(): alvision.int { return 2; }
    calc(x: Array<alvision.double>) : alvision.double{
        return 100*(x[1].valueOf()-x[0].valueOf()*x[0].valueOf())*(x[1].valueOf()-x[0].valueOf()*x[0].valueOf())+(1-x[0].valueOf())*(1-x[0].valueOf());
    }
    getGradient(x: Array<alvision.double>, grad: Array<alvision.double>) : void{
            grad[0]=-2*(1-x[0].valueOf())-400*(x[1].valueOf()-x[0].valueOf()*x[0].valueOf())*x[0].valueOf();
            grad[1]=200*(x[1].valueOf()-x[0].valueOf()*x[0].valueOf());
    }
};

alvision.cvtest.TEST('Core_ConjGradSolver', 'regression_basic', () => {
    
    var solver=alvision.ConjGradSolver.create();
//#if 1
    (() => {
        var ptr_F = new SphereF_CG();
        var x = new alvision.Mat(new alvision.Matd(4, 1, [50.0, 10.0, 1.0, -10.0])),
            etalon_x = new alvision.Mat(new alvision.Matd(1, 4, [0.0, 0.0, 0.0, 0.0]));
        var etalon_res = 0.0;
        mytest(solver, ptr_F, x, etalon_x, etalon_res);
    })();
//#endif
//#if 1
    (() => {
        var ptr_F = new RosenbrockF_CG();
        var x = (new alvision.Matd(2, 1, [0.0, 0.0])),
            etalon_x = (new alvision.Matd(2, 1, [1.0, 1.0]));
        var etalon_res = 0.0;
        mytest(solver, ptr_F, x, etalon_x, etalon_res);
    })();
//#endif
});
