import fs = require('fs')
import test = require('tape')
import path = require('path')
import chalk= require('chalk')
import async = require('async')

import * as alvision from "../tsbinding/alvision";

import * as tsnode from "ts-node";
tsnode.register();
//import tsnode = require("ts-node/register");



var level = 0;

function logger(module : string, level : number, message : string) : void {
	//if (level < 99) {
		//console.log(module, level, message);
	//}
}


function tablevel() : string {
	let retval = "";
	for (let i = 0 ; i < level; i++) {
		retval += "\t";
	}
	return retval;
}

test.createStream({ objectMode: true }).on('data', (row) => {
    //console.log(JSON.stringify(row));
    let errorColor = chalk.red.bold;
    let okColor = chalk.green.bold;

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

function showObject(tobj : any) : void {
	let objstr = JSON.stringify(tobj, null, '\t');
	let showObjectContents = false;
	if (showObjectContents) {
		console.log(objstr);
	} else {
		console.log("object size: " +  objstr.length);
	}
}

//test("name", (t) => {
//    t.ok();
//    t.end();
//});


function getFiles(dir : string, files_? : Array<string>)  : Array<string>{
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files) {
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

function testAllTsFiles() {
    let files = getFiles(__dirname);
    for (let f of files) {
        if (path.extname(f) == ".ts") {
            try {
                console.log("testing ", f);
                let testFile = require(f);

            } catch (e) {
                console.log("unable to load ", f, e)
            }
        }
    }
}

console.log("opencv node bindings tests");
testAllTsFiles();