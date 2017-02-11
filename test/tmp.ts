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


//var m = new alvision.Mat(500, 500, alvision.MatrixType.CV_8SC3);
//alvision.circle(m, new alvision.Point(250, 250), 100, new alvision.Scalar(0, 0, 255), 3, alvision.LineTypes.FILLED);
//alvision.imshow("test window", m);
//alvision.waitKey(10000);





//const input_file = path.join(__dirname, 'HelenFisher_2008.mp4')
//alvision.ffmpeg.OpenAsInput(input_file, "", null, function (err, ffmi) {
//    console.log("opened as input", err, ffmi);
//
//    var istreams = ffmi.GetStreams();
//
//    console.log("streams" ,istreams);
//
//    var istreamdict: { [id: string]: alvision.stream } = {}; istreams.forEach(function (item, idx) { istreamdict[item.id] = item });
//
//    var matchingMatrix: {[id:string] : alvision.Mat}= {};
//    var matchingStreams = {};
//
//    for (var i = 0; i < istreams.length; i++) {
//        var istream = istreams[i];
//        switch (istream.mediatype) {
//            case alvision.mediatype.audio:// "audio":
//                matchingMatrix[istream.id] = new alvision.Mat(2, 1024 * 1024 /*(int)MAX_AUDIO_LENGTH*/, alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_16U, 1)/*CV_MAKETYPE(CV_16U, 2)*/);
//                break;
//            case alvision.mediatype.video:// "video":
//                matchingMatrix[istream.id] = new alvision.Mat(istream.height, istream.width, alvision.MatrixType.CV_8UC3);
//
//                istream.AddFilter("h264_mp4toannexb", "");
//                break;
//        }
//    }
//
//
//    var limiter = 20000;
//    var processedpackets = 0;
//
//    let brisk = alvision.BRISK.create(60, 4, 1.0);
//
//    var packet = new alvision.packet();
//
//    while (limiter > 0 && ffmi.ReadPacket(packet)) {
//        console.log("reading packet", packet);
//        limiter--;
//
//        let streamid = packet.streamid;
//        var stream = istreamdict[streamid];
//        if (stream == null) {
//            throw "packet is not part of input, unexpected error, streamid: " + streamid;
//        }
//
//        var mat = matchingMatrix[streamid];
//        let streaminf = istreamdict[streamid];
//        var frameinfo = stream.Decode(packet, streaminf, mat);
//        if (frameinfo != null && frameinfo.succeeded) {
//            if (stream.mediatype == alvision.mediatype.video) {
//                alvision.imshow("test window", mat);
//
//                let mat_canny = mat.clone();
//                alvision.Canny(mat, mat_canny, 100, 3);
//
//                alvision.imshow("canny", mat_canny);
//
//                
//                let kp = [new alvision.KeyPoint()];
//                brisk.detect(mat, kp, (kpi) => { kp = kpi; });
//
//                let mat_kp = mat.clone();
//
//                //console.log("trying", mat, kp, mat_kp);
//                console.log("kp", kp.length, kp[0]);
//
//                if (kp.length > 0) {
//                    alvision.drawKeypoints(mat, kp, mat_kp);
//
//                    alvision.imshow("brisk", mat_kp);
//                }
//
//
//                alvision.waitKey(1);
//            }
//        }
//    }
//
//    console.log("closing");
//    ffmi.Close();
//});

  
let afs = new alvision.FileStorage();
console.log(afs);
console.log("isOpened", afs.isOpened);
console.log(Object.getOwnPropertyNames(afs));
for (let pn of Object.getOwnPropertyNames(afs)) {
    console.log(pn, ":", typeof afs[pn]);
}