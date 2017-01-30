import fs = require('fs')
import test = require('tape')
import path = require('path')
import chalk = require('chalk')
import async = require('async')

import * as alvision from "../tsbinding/alvision";



//NOTE: Careful with this section, if running with ts-node, this section is 
//redundant and will cause source map problems as it will attempt to transpile the output javascript file.

//import * as sourceMapSupport from 'source-map-support'
//sourceMapSupport.install({
//    environment: 'node'
//})


//import * as tsnode from "ts-node";
//tsnode.register();

let errorColor = chalk.red.bold;
let okColor = chalk.green.bold;



var level = 0;

function logger(module: string, level: number, message: string): void {
    //if (level < 99) {
    //console.log(module, level, message);
    //}
}


function tablevel(): string {
    let retval = "";
    for (let i = 0; i < level; i++) {
        retval += "\t";
    }
    return retval;
}

test.createStream({ objectMode: true }).on('data', (row) => {
    //console.log(JSON.stringify(row));


    if (row.type == "end") {
        console.log();
        level--;
    } else if (row.type == "test") {
        level++;
        console.log();
        console.log(tablevel() + "%d. Testing %s", row.id, row.name);
    } else {
        if (row.ok) {
            console.log(tablevel() + okColor("%d. \t %s \t %s"), row.id, row.ok, row.name);
            if (row.operator == "throws" && row.actual != undefined) {
                console.log(tablevel() + okColor(" threw: %s"), row.actual);
            }
        } else {
            console.log(tablevel() + errorColor("%d. \t %s \t %s"), row.id, row.ok, row.name);
            console.log(tablevel() + errorColor("\t %s"), row.actual);
        }
    }
    //row.
    //console.log(JSON.stringify(row))
});


var m = new alvision.Mat(500, 500, alvision.MatrixType.CV_8SC3);
alvision.circle(m, new alvision.Point(250, 250), 100, new alvision.Scalar(0, 0, 255), 3, alvision.LineTypes.FILLED);
alvision.imshow("test window", m);
alvision.waitKey(10000);

