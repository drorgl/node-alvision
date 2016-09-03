/// <reference path="../typings/index.d.ts" />
/// <reference path="alvision.ts" />
/// <reference path="ffmpeg/ffmpeg.ts" />


//var mediatype: { attachment; audio; } = { attachment: "attachment", audio: "audio" };



import tape = require("tape");
import path = require("path");
import chalk = require("chalk");
import async = require("async");

import * as alvision from './alvision'



//require('./ffmpeg/ffmpeg');



//alvision.Matrix
//import alvision = require("./alvision")
//import alvision = require('./ffmpeg/ffmpeg');




//Workaround for ts optimizations
//var redColor = colors.red;

//var alvision = null;

var   input_file = path.join(__dirname,"..\\test\\", 'HelenFisher_2008.mp4')
    , output_file = path.join(__dirname, "..\\test\\", 'HelenFisher_2008.mkv')




//alvision.ffmpeg.SetLogger((l) => logger);

function logger(module : string, level : number, message :string): void {
    //if (level < 99) {
    //console.log(module, level, message);
    //}
}

var level: number;

function tablevel() : string{
    var retval = "";
    for (var i = 0; i < level; i++) {
        retval += "\t";
    }
    return retval;
}

tape.createStream({ objectMode: true }).on('data', (row)=> {
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
			console.log(tablevel() + okColor( "%d. \t %s \t %s"), row.id, row.ok, row.name);
			if (row.operator == "throws" && row.actual != undefined) {
				console.log(tablevel() + okColor( " threw: %s"), row.actual);
			}
		} else {
            console.log(tablevel() + errorColor( "%d. \t %s \t %s"), row.id, row.ok, row.name);
			console.log(tablevel() + errorColor( "\t %s"), row.actual);
		}
	}
	//row.
	//console.log(JSON.stringify(row))
});


function showObject(tobj : any) {
    var objstr = JSON.stringify(tobj, null, '\t');
    var showObjectContents = false;
    if (showObjectContents) {
        console.log(objstr);
    } else {
        console.log("object size: " + objstr.length);
    }
}


tape("Bindings", (t)=> {
    try {
        

        //console.log(alvision
    } catch (e) {
        console.log(e);
    }
    t.ok(alvision, "binding fine");
    t.ok(alvision.version, "version is there: " + alvision.version);
    t.ok(alvision.ffmpeg, "ffmpeg is there");
    //t.ok(alvision.opencv, "opencv is there");
    t.end();
});

tape("opencv", (t)=> {
    t.ok(alvision.MatrixType, "MatrixType is there");
    t.ok(alvision.MatrixType.CV_8UC3, "CV_8UC3 is there");
    t.ok(alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_8UC3, 2), "CV_MAKETYPE(CV_8UC3,2) is working");
    t.end();
});


tape("ffmpeg", (ffm)=> {
    ffm.ok(alvision.ffmpeg.SetLogger, "ffmpeg SetLogger is there");
    ffm.doesNotThrow(function () {
        alvision.ffmpeg.SetLogger(logger);
        alvision.ffmpeg.SetLogger(null);
        alvision.ffmpeg.SetLogger(logger);
        alvision.ffmpeg.SetLogger(null);
        process.nextTick(function () {
            alvision.ffmpeg.SetLogger(logger);
        });
    }, undefined, "SetLogger successive changes")



    //ffm.test("ffmpeg instance", (t)=> {
    //    var ffmpegInstance = new alvision.ffmpeg();
    //    t.ok(ffmpegInstance, "created new ffmpeg instance");
    //    t.end();
    //});

    ffm.test("List Input Formats",  (t)=> {
        t.ok(alvision.ffmpeg.ListInputFormats, "ListInputFormats exists on ffmpeg");

        alvision.ffmpeg.ListInputFormats((err, list)=> {
            t.ok(err == null, "error is null (got: " + err + ")");
            t.ok(list, "got list input formats");
            t.ok(list.length, "got " + list.length + " elements in list input formats");
            showObject(list);
            t.end();
        });
    });
    ffm.test("List Output Formats", (t) =>{
        t.ok(alvision.ffmpeg.ListOutputFormats, "ListOutputFormats exists on ffmpeg");

        alvision.ffmpeg.ListOutputFormats((err, list)=> {
            t.ok(err == null, "error is null (got: " + err + ")");
            t.ok(list, "got list output formats");
            t.ok(list.length, "got " + list.length + " elements in list output formats");
            showObject(list);
            t.end();
        });
    });

    ffm.test("List Codecs",  (t) => {
        t.ok(alvision.ffmpeg.ListCodecs, "ListCodecs exists on ffmpeg");

        t.doesNotThrow( () => {
            alvision.ffmpeg.ListCodecs((err, list) =>{
                t.doesNotThrow( () => {
                    t.ok(err == null, "error is null (got: " + err + ")");
                    t.ok(list, "got codec list");
                    t.ok(list.length, "got " + list.length + " elements in codec list");
                    showObject(list);
                }, "ListCodecs callback");
            });
        }, undefined, "ListCodecs")

        t.end();
    });

    ffm.test("List Devices", function (t) {
        t.ok(alvision.ffmpeg.ListDevices, "ListDevices exists on ffmpeg");

        t.doesNotThrow(function () {
            alvision.ffmpeg.ListDevices((err, list) => {
                t.doesNotThrow( () => {
                    t.ok(err == null, "error is null (got: " + err + ")");
                    t.ok(list, "got devices list");
                    t.ok(list.length, "got " + list.length + " elements in device list");
                    showObject(list);
                }, "ListDevices callback");
            });
        }, undefined, "ListDevices")

        t.end();
    });

    ffm.test("List Filters", (t) => {
        t.ok(alvision.ffmpeg.ListFilters, "ListFilters exists on ffmpeg");

        t.doesNotThrow( () => {
            alvision.ffmpeg.ListFilters((err, list)  =>{
                t.doesNotThrow( () => {
                    t.ok(err == null, "error is null (got: " + err + ")");
                    t.ok(list, "got filters list");
                    t.ok(list.length, "got " + list.length + " elements in filters list");
                    showObject(list);
                }, "ListFilters callback");
            });
        }, undefined, "ListFilters")

        t.end();
    });

    ffm.test("Testing Input",  (t) => {
        t.ok(alvision.ffmpeg.OpenAsInput, "OpenAsInput exists on ffmpeg");
        //t.throws( ()=> {
        //    alvision.ffmpeg.OpenAsInput(" ");
        //}, undefined, "OpenAsInput incorrect number of parameters")

        t.doesNotThrow( () => {
            alvision.ffmpeg.OpenAsInput(input_file, null, null, (err, ffm) => {
                ffm.Close();
            });
        }, "opening input file without format specified");

        t.doesNotThrow( () => {
            alvision.ffmpeg.OpenAsInput(input_file, "mp4", null, (err, ffm)=> {
                t.ok(ffm.GetStreams, "Has GetStreams function");
                t.doesNotThrow( () => { ffm.GetStreams() }, undefined, "Invoked GetStreams()");
                var streams = ffm.GetStreams();
                console.log(streams);
                showObject(streams);
                t.ok(streams.length, "Invoked GetStreams() length " + streams.length);

                t.throws( () => {
                    ffm.AddStream({
                        id: 'video_1',
                        codec: 'libx264',
                        timebase: 24, //fps
                        bitrate: 90000,
                        width: 320,
                        height: 240,
                        gopsize: 12,//,
                        //pixfmt : alvision.pixel_format.PIX_FMT_0BGR 
                        pixfmt: 'yuv420p'
                    });
                }, undefined, "Prevent AddStream on InputStreams");


            });
        }, undefined, "OpenAsInput open file");

        t.end();

    });

    ffm.test("Testing Output",  (t) => {
        t.ok(alvision.ffmpeg.OpenAsOutput, "OpenAsOutput exists on ffmpeg");
        //t.throws( () => {
        //    alvision.ffmpeg.OpenAsOutput(" ");
        //}, undefined, "OpenAsOutput incorrect number of parameters")



        t.doesNotThrow(function () {
            alvision.ffmpeg.OpenAsOutput(output_file, "mkv", null,  (err, ffmo) => {

                t.ok(ffmo.AddStream, "Has AddStream function");

                var videoConfig = {
                    id: 'video_1',
                    codec: 'libx264',
                    timebase: 24, //fps
                    bitrate: 90000,
                    width: 320,
                    height: 240,
                    gopsize: 12,
                    pixfmt: 'yuv420p'
                };

                var audioConfig = {
                    id: 'audio_1',
                    codec: 'libmp3lame',
                    timebase: 44100,
                    bitrate: 12800,
                    channels: 2,
                    samplerate: 44100,
                    channelslayout: 'stereo',
                    samplefmt: 's16p'
                };

                //var badConfigNoId = {
                //    codec: 'libmp3lame',
                //    timebase: 44100,
                //    bitrate: 12800,
                //    channels: 2,
                //    samplerate: 44100,
                //    channelslayout: 'stereo',
                //    samplefmt: 's16p'
                //};

                //var badConfigNoCodec = {
                //    id: "111", //no id
                //    codec: 'blabling',
                //    timebase: 44100,
                //    junk: null
                //};

                //t.throws(()  => {
                //    ffmo.AddStream(badConfigNoId);
                //}, undefined, "AddStream failed, No id specified");

                //t.throws( () => {
                //    ffmo.AddStream(badConfigNoCodec);
                //}, undefined, "AddStream failed, blabling codec not found");

                t.doesNotThrow( ()  => {
                    var stream = ffmo.AddStream(videoConfig);
                    t.ok(stream != null, "AddStream " + JSON.stringify(stream));
                    t.ok(stream.streamindex == 0, "AddStream correct stream index");
                }, undefined, "AddStream video successful")

                t.doesNotThrow( () => {
                    var stream = ffmo.AddStream(audioConfig);
                    t.ok(stream != null, "AddStream " + JSON.stringify(stream));
                    t.ok(stream.streamindex == 1, "AddStream correct stream index");
                }, undefined, "AddStream audio successful")
                t.doesNotThrow(function () {
                    ffmo.Close();
                }, undefined, "Input stream closed successfully");


            });
        }, undefined, "OpenAsOutput open file");

        t.doesNotThrow(function () {
            alvision.ffmpeg.OpenAsOutput(output_file, "mkv", null, function (err, ffmo) {
                t.doesNotThrow(function () {
                    alvision.ffmpeg.OpenAsInput(input_file, "mp4", null, function (err, ffmi) {
                        var istreams = ffmi.GetStreams();

                        var istreamdict = {}; istreams.forEach(function (item, idx) { istreamdict[item.id] = item });

                        var matchingMatrix = {};
                        var matchingStreams = {};

                        for (var i = 0; i < istreams.length; i++) {
                            var istream = istreams[i];
                            switch (istream.mediatype) {
                                case alvision.mediatype.audio:
                                    //matchingMatrix[istream.id] = new alvision.Matrix(1, 1024 * 1024 /*(int)MAX_AUDIO_LENGTH*/, alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_16U, 2)/*CV_MAKETYPE(CV_16U, 2)*/);
                                    matchingMatrix[istream.id] = new alvision.Mat(2, 1024 * 1024 /*(int)MAX_AUDIO_LENGTH*/, alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_16U, 1)/*CV_MAKETYPE(CV_16U, 2)*/);

                                    var audioConfig = {
                                        id: 'out_' + istream.id,
                                        codec: 'libmp3lame',
                                        timebase: 44100,
                                        bitrate: 12800,
                                        channels: 2,
                                        samplerate: 44100,
                                        channelslayout: 'stereo',
                                        samplefmt: 's16p'
                                    };
                                    console.log("adding stream " + JSON.stringify(audioConfig, null, '\t'));
                                    ffmo.AddStream(audioConfig);
                                    break;
                                case alvision.mediatype.video:
                                    var iaudiostream = <alvision.IVideoStreamInfo>istream;
                                    matchingMatrix[istream.id] = new alvision.Mat(iaudiostream.height, iaudiostream.width, alvision.MatrixType.CV_8UC3);

                                    var videoConfig = {
                                        id: 'out_' + istream.id,
                                        codec: 'libx264',
                                        timebase: 24, //fps
                                        bitrate: 90000,
                                        width: 320,
                                        height: 240,
                                        gopsize: 12,
                                        pixfmt: 'yuv420p'
                                    };
                                    console.log("adding stream " + JSON.stringify(videoConfig, null, '\t'));
                                    ffmo.AddStream(videoConfig);
                                    break;
                            }
                        }


                        var ostreams = ffmo.GetStreams();
                        var ostreamdict = {}; ostreams.forEach(function (item, idx) { ostreamdict[item.id] = item });

                        if (!ffmo.WriteHeader()) {
                            throw "write header failed ";
                        }


                        var limiter = 200;
                        var processedpackets = 0;

                        var packet = new alvision.packet();
                    
                        //var nwindow = new alvision.NamedWindow("test");

                        async.during(
                             (cbval) => {
                                limiter--;
                                //return (limiter > 0 && ffmi.readPacket(packet));
                                //showObject('reading packet!');
                                cbval(null, (limiter > 0 && ffmi.ReadPacket(packet) !== alvision.read_packet_status.eof));
                            }, (callback) => {
                                var streamid = packet.streamid;
                                //get the stream this packet belongs to
                                var stream = istreamdict[streamid];
                                if (stream == null) {
                                    throw "packet is not part of input, unexpected error, streamid: " + streamid;
                                }

                                var ostream = ostreamdict['out_' + streamid];
                                if (ostream == null) {
                                    throw "output stream not found, unexpected error, id: " + "out_" + streamid + " in: " + JSON.stringify(ostreamdict, null, '\t');
                                }

                                //get a matrix
                                var mat = matchingMatrix[streamid];

                                //decode will decode the packet to ostream format, into mat
                                var frameinfo = stream.Decode(packet, ostream, mat);
                                if (frameinfo != null && frameinfo.succeeded) {
                                    //test image
                                    //if (ostream.mediatype == "video") {
                                    //    nwindow.show(mat);
                                    //    nwindow.blockingWaitKey(10);
                                    //}

                                    //get frame.pts,dts, etc' for the decoded frame, otherwise it returns null

                                    //we have a valid frame/mat, lets transcode it
                                    //the ostream is a way to telling the scaler all it needs, but we can also pass a stream id with different parameters that will
                                    //tell it how the mat is constructed and it will automatically convert it to the stream id's config.

                                    //the encode automatically produces a packet and writes it to output

                                    try {
                                        var status = ostream.Encode(ostream, frameinfo, mat);
                                    } catch (e) {
                                        console.log('error ', e);
                                    }
                                    processedpackets++;

                                }

                                callback();

                            },  (err) => {
                                if (!err) {
                                    //close input/output
                                    t.doesNotThrow(function () {
                                        ffmo.Close();
                                        ffmi.Close();
                                    }, undefined, "ffmpeg io closed successfully");
                                    //report the test as success
                                } else {
                                    //report the error as failed
                                    throw err;
                                }
                            });
                        t.ok(processedpackets > 10, "At least 10 packets were processed " + processedpackets);

                    });

                }, undefined, "OpenAsOutput callback");
            });
        }, undefined, "OpenAsOutput open file");

        t.doesNotThrow(function () {
            alvision.ffmpeg.OpenAsOutput(output_file, "mpegts", null, function (err, ffmo) {
                t.doesNotThrow(function () {
                    alvision.ffmpeg.OpenAsInput(input_file, "", null, function (err, ffmi) {
                        var istreams = ffmi.GetStreams();

                        var istreamdict = {}; istreams.forEach(function (item, idx) { istreamdict[item.id] = item });

                        var matchingMatrix = {};
                        var matchingStreams = {};

                        for (var i = 0; i < istreams.length; i++) {
                            var istream = istreams[i];
                            switch (istream.mediatype) {
                                case alvision.mediatype.audio:// "audio":
                                    //matchingMatrix[istream.id] = new alvision.Matrix(1, 1024 * 1024 /*(int)MAX_AUDIO_LENGTH*/, alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_16U, 2)/*CV_MAKETYPE(CV_16U, 2)*/);
                                    matchingMatrix[istream.id] = new alvision.Mat(2, 1024 * 1024 /*(int)MAX_AUDIO_LENGTH*/, alvision.MatrixType.CV_MAKETYPE(alvision.MatrixType.CV_16U, 1)/*CV_MAKETYPE(CV_16U, 2)*/);

                                    var audioConfig = {
                                        id: 'out_' + istream.id,
                                        codec: 'libmp3lame',
                                        timebase: 44100,
                                        bitrate: 12800,
                                        channels: 2,
                                        samplerate: 44100,
                                        channelslayout: 'stereo',
                                        samplefmt: 's16p'
                                    };
                                    console.log("adding stream " + JSON.stringify(audioConfig, null, '\t'));
                                    ffmo.AddStream(audioConfig);
                                    break;
                                case alvision.mediatype.video:// "video":
                                    matchingMatrix[istream.id] = new alvision.Mat(istream.height, istream.width, alvision.MatrixType.CV_8UC3);

                                    t.ok(istream.AddFilter, "AddFilter exists");
                                    t.doesNotThrow(function () {
                                        istream.AddFilter("h264_mp4toannexb", "");
                                    }, undefined, "Adding Filter h264_mp4toannexb to stream");


                                    var videoConfig = {
                                        id: 'out_' + istream.id,
                                        codec: 'libx264',
                                        timebase: 24, //fps
                                        bitrate: 90000,
                                        width: 320,
                                        height: 240,
                                        gopsize: 12,
                                        pixfmt: 'yuv420p'
                                    };

                                    console.log("adding stream " + JSON.stringify(videoConfig, null, '\t'));
                                    ffmo.AddStream(videoConfig);



                                    break;
                            }
                        }


                        var ostreams = ffmo.GetStreams();
                        var ostreamdict = {}; ostreams.forEach(function (item, idx) { ostreamdict[item.id] = item });

                        if (!ffmo.WriteHeader()) {
                            throw "write header failed ";
                        }


                        var limiter = 200;
                        var processedpackets = 0;

                        var packet = new alvision.packet();

                        //var nwindow = new alvision.NamedWindow("test");


                        async.during(
                             (cbval)=> {
                                limiter--;
                                //return (limiter > 0 && ffmi.readPacket(packet));
                                //showObject('reading packet!');
                                cbval(null, (limiter > 0 && ffmi.ReadPacket(packet) !== alvision.read_packet_status.eof));
                            }, (callback)=> {
                                var streamid = packet.streamid;
                                //get the stream this packet belongs to
                                var stream = istreamdict[streamid];
                                if (stream == null) {
                                    throw "packet is not part of input, unexpected error, streamid: " + streamid;
                                }

                                var ostream = ostreamdict['out_' + streamid];
                                if (ostream == null) {
                                    throw "output stream not found, unexpected error, id: " + "out_" + streamid + " in: " + JSON.stringify(ostreamdict, null, '\t');
                                }

                                //get a matrix
                                var mat = matchingMatrix[streamid];

                                //decode will decode the packet to ostream format, into mat
                                var frameinfo = stream.Decode(packet, ostream, mat);
                                if (frameinfo != null && frameinfo.succeeded) {
                                    //test image
                                    //if (ostream.mediatype == "video") {
                                    //    nwindow.show(mat);
                                    //    nwindow.blockingWaitKey(10);
                                    //}

                                    //get frame.pts,dts, etc' for the decoded frame, otherwise it returns null

                                    //we have a valid frame/mat, lets transcode it
                                    //the ostream is a way to telling the scaler all it needs, but we can also pass a stream id with different parameters that will
                                    //tell it how the mat is constructed and it will automatically convert it to the stream id's config.

                                    //the encode automatically produces a packet and writes it to output

                                    try {
                                        var status = ostream.Encode(ostream, frameinfo, mat);
                                    } catch (e) {
                                        console.log('error ', e);
                                    }

                                    processedpackets++;

                                }

                                callback();

                            }, function (err) {
                                if (!err) {
                                    //close input/output
                                    t.doesNotThrow(function () {
                                        ffmo.Close();
                                        ffmi.Close();
                                    }, undefined, "ffmpeg io closed successfully");
                                    //report the test as success
                                } else {
                                    //report the error as failed
                                    throw err;
                                }
                            });

                        t.ok(processedpackets > 10, "At least 10 packets were processed " + processedpackets);
                    });


                }, undefined, "OpenAsOutput callback");
            });
        }, undefined, "OpenAsOutput open file");


        t.end();
    });


    ffm.test("Testing Buffer Output", function (t) {
        t.ok(alvision.ffmpeg.OpenAsOutputBuffer, "OpenAsOutputBuffer exists on ffmpeg");
        //t.throws(function () {
        //    alvision.ffmpeg.OpenAsOutputBuffer(" ");
        //}, undefined, "OpenAsOutputBuffer incorrect number of parameters")

        t.doesNotThrow(function () {
            alvision.ffmpeg.OpenAsOutputBuffer(null, "ffm", 1024, 1024 * 1024, null, function (err, ffmo) {
                t.doesNotThrow(function () {
                    ffmo.Close();
                }, "Close");
            });
        }, undefined, "OpenAsOutputBuffer and close without write header");

        t.doesNotThrow(function () {
            alvision.ffmpeg.OpenAsOutputBuffer(null, "ffm", 1024, 1024 * 1024, null, function (err, ffmo) {
                t.doesNotThrow(function () {
                    ffmo.Close();
                }, "Close once");
                t.doesNotThrow(function () {
                    ffmo.Close();
                }, "Close twice");
            });
        }, undefined, "OpenAsOutputBuffer and close twice without write header");

        t.doesNotThrow(function () {
            alvision.ffmpeg.OpenAsOutputBuffer(null, "rtp", 1024, 1024 * 1024, null, function (err, ffmo) {
                ffmo.AddStream({
                    id: 'video_1',
                    codec: 'libvpx',
                    timebase: 24, //fps
                    bitrate: 90000,
                    width: 320,
                    height: 240,
                    gopsize: 12,
                    pixfmt: 'yuv420p',
                    options: { "strict": "experimental" }
                });

                t.doesNotThrow(function () {
                    var sdp = ffmo.GetSDP();
                    t.ok(sdp != null, "GetSDP " + sdp);
                }, "GetSDP exists");

                t.doesNotThrow(function () {
                    ffmo.Close();
                }, "Close");
            });
        }, undefined, "OpenAsOutputBuffer, add Stream, GetSDP and close");


        t.doesNotThrow(function () {
            alvision.ffmpeg.OpenAsOutputBuffer(null, "ffm", 1024, 1024 * 1024, null, function (err, ffmo) {
                ffmo.AddStream({
                    id: 'video_1',
                    codec: 'libvpx',
                    timebase: 24, //fps
                    bitrate: 90000,
                    width: 320,
                    height: 240,
                    gopsize: 12,
                    pixfmt: 'yuv420p',
                    options: { "strict": "experimental" }
                });
                t.doesNotThrow(function () {
                    ffmo.Close();
                }, "Close");
            });
        }, undefined, "OpenAsOutputBuffer, add Stream and close without write header");



        //

        t.doesNotThrow(function () {
            alvision.ffmpeg.OpenAsOutputBuffer(null, "ffm", 1024, 1024 * 1024, null, function (err, ffmo) {
                t.throws(function () {
                    ffmo.AddStream({ "id": "0", "channels": 2, "channelslayout": "stereo", "samplefmt": "fltp", "samplerate": 44100, "codec": "aac", "timebase": 0.000022675736961451248, "bitrate": 94997 });
                }, "experimental stream");
                t.doesNotThrow(function () {
                    ffmo.Close();
                }, "Close");
            });
        }, undefined, "OpenAsOutputBuffer, add invalid (experimental without experimental option) Stream and close without write header");




        t.doesNotThrow(function () {
            var blockSize = 4096;

            var obuffer = new Buffer(blockSize);

            alvision.ffmpeg.OpenAsOutputBuffer(null, "ffm", blockSize, 1024 * 1024, null, function (err, ffmo) {

                var videoConfig = {
                    id: 'video_1',
                    codec: 'libvpx',
                    timebase: 24, //fps
                    bitrate: 90000,
                    width: 320,
                    height: 240,
                    gopsize: 12,
                    pixfmt: 'yuv420p',
                    options: { "strict": "experimental" }
                };

                var audioConfig = {
                    id: 'audio_1',
                    codec: 'vorbis',
                    timebase: 44100,
                    bitrate: 12800,
                    channels: 2,
                    samplerate: 44100,
                    channelslayout: 'stereo',
                    samplefmt: 'fltp',
                    options: { "strict": "experimental" }
                };

                t.doesNotThrow(function () {
                    ffmo.AddStream(videoConfig);
                }, undefined, "AddStream video successful")

                t.doesNotThrow(function () {
                    ffmo.AddStream(audioConfig);
                }, undefined, "AddStream audio successful")


                t.doesNotThrow(function () {
                    ffmo.WriteHeader({ "strict": "experimental" });
                }, undefined, "Writing header");


                var bufferSizes = ffmo.getNextBufferSizes();
                t.ok(bufferSizes.size > 0, "ffm buffer has data");
                t.ok(bufferSizes.blocks > 0, "ffm buffer has blocks");

                //t.throws(function () {
                //    ffmo.getNextBuffer();
                //}, undefined, "getNextBuffer should have a buffer");

                t.throws(function () {
                    var tbuf = new Buffer(blockSize - 1);
                    ffmo.getNextBuffer(tbuf);
                }, undefined, "getNextBuffer should have a buffer with minimum size of blockSize");


                var bytesRead = ffmo.getNextBuffer(obuffer);
                console.log("br", bytesRead);
                t.ok(bytesRead > 0, "ffm buffer read success");
                t.ok(obuffer.slice(0, 4).toString() == 'FFM2', "ffm buffer read got header");

                t.doesNotThrow(function () {
                    ffmo.Close();
                }, undefined, "Input stream closed successfully");


            });
        }, undefined, "OpenAsOutputBuffer open file");

        t.end();
    });



    setTimeout(function () {
        ffm.doesNotThrow(function () {
            alvision.ffmpeg.SetLogger(null);
        }, undefined, "SetLogger to null successful");
    }, 5000);

    ffm.end();
});





//test("Smoke tests / Can Import", function(t){
//  cv = require('../lib/opencv')
//  t.ok(cv, "imported fine")
//  t.ok(cv.version, "version is there:" + cv.version)
//  t.ok(cv.Point, "point is there")
//  t.ok(cv.Matrix, "matrix is there")
//  t.end()
//})


//test('importing library multiple times is ok', function(t){
//  var cv1 = require('../lib/opencv')
//    , cv2 = require('../lib/opencv')
//    cv1.readImage('./examples/files/mona.png', function(err, im){
//      t.error(err)
//      cv2.readImage('./examples/files/mona.png', function(err, im){
//        t.error(err)
//        t.end();
//      });
//    });
//})


//test('Point', function(t){

//  t.ok(new cv.Point(1, 2))
//  t.throws(function () { cv.Point(1, 2)}, TypeError, "cannot call without new")

//  t.equal(new cv.Point(1, 2).x, 1)
//  t.equal(new cv.Point(1, 2).y, 2)
//  t.equal(Math.round(new cv.Point(1.1, 2).x * 100), 110)
//  t.equal(Math.round(new cv.Point(1.2, 2.75).y *100), 275)

//  t.throws(function () {new cv.Point(1.1, 2).x = 5}, Error, "Points are immutable")
//  t.throws(function () {new cv.Point(1.1, 2).y = 5}, Error, "Points are immutable")

//  var p1 = new cv.Point(3, 6)
//    , p2 = new cv.Point(5, 7)

//  t.ok(p1.dot);
//  t.equal(p1.dot(p2), 57);

//  t.end()
//})


//test('Matrix constructor', function(assert){
//  assert.ok(cv.Matrix);
//  assert.ok(new cv.Matrix);
//  assert.ok(new cv.Matrix(1,2));
//  assert.end()
//})

//test('Matrix accessors', function(assert){
//  var mat = new cv.Matrix(1, 2);
//  mat.set(0,0,3)
//  mat.set(0,1,5000)
//  assert.deepEqual(mat.row(0), [3,5000]);

//  mat = new cv.Matrix(1,2);
//  assert.equal(mat.set(0,0,3), undefined);
//  assert.equal(mat.get(0,0), 3);

//  mat = new cv.Matrix(6,7);
//  assert.equal(mat.width(), 7);

//  mat = new cv.Matrix(6,7);
//  assert.equal(mat.height(), 6);

//  mat = new cv.Matrix(6,7);
//  assert.deepEqual(mat.size(), [6, 7]);

//  mat = new cv.Matrix(6,7);
//  assert.equal(mat.width(), 7);
//  mat.resize(8,9);
//  assert.equal(mat.width(), 8);

//  mat = new cv.Matrix.Eye(4,4)
//  assert.deepEqual(mat.row(1), [0,1,0,0])
//  assert.deepEqual(mat.row(2), [0,0,1,0])

//  mat = new cv.Matrix.Eye(4,4);
//  assert.deepEqual(mat.col(1), [0,1,0,0])
//  assert.deepEqual(mat.col(2), [0,0,1,0])

//  assert.equal(new cv.Matrix().empty(), true);

//  assert.end()
//})


//test("Matrix toBuffer", function(assert){
//  var buf = fs.readFileSync('./examples/files/mona.png')

//  cv.readImage(buf.slice(0), function(err, mat){
//    var buf0 = mat.toBuffer()
//    assert.ok(buf0);
//    assert.end()
//  })
//})



//test("Matrix toBuffer Async", function(assert){
//  var buf = fs.readFileSync('./examples/files/mona.png')

//  cv.readImage(buf.slice(0), function(err, mat){
//    mat.toBuffer(function(err, buff){
//      assert.error(err)
//      assert.ok(buf)
//      assert.ok(buf.length > 100)

//      assert.end()
//    })
//  })
//})


//test("detectObject", function(assert){
//  cv.readImage("./examples/files/mona.png", function(err, im){
//    im.detectObject(cv.FACE_CASCADE, {}, function(err, faces){
//      assert.error(err)
//      assert.ok(faces)
//      assert.equal(faces.length, 1)
//      assert.end()
//    })
//  })
//})

//test(".absDiff and .countNonZero", function(assert){
//  cv.readImage("./examples/files/mona.png", function(err, im) {
//    cv.readImage("./examples/files/mona.png", function(err, im2){
//      assert.ok(im);
//      assert.ok(im2);

//      var diff = new cv.Matrix(im.width(), im.height());
//      diff.absDiff(im, im2);

//      diff.convertGrayscale();
//      assert.equal(diff.countNonZero(), 0);
//      assert.end()
//    });
//  });
//})


//test(".bitwiseXor", function(assert){
//  var mat1 = new cv.Matrix(1,1);
//  mat1.set(0,0, 1);

//  var mat2 = new cv.Matrix(1,1);
//  mat2.set(0,0, 1);

//  var xored = new cv.Matrix(1,1);
//  xored.bitwiseXor(mat1, mat2);

//  assert.equal(xored.get(0,0), 0);

//  assert.end()
//})


//test("Image read from file", function(assert){
//  cv.readImage("./examples/files/mona.png", function(err, im){
//    assert.ok(im);
//    assert.equal(im.width(), 500);
//    assert.equal(im.height(), 756)
//    assert.equal(im.empty(), false)
//    assert.end()
//  })
//})


//test("read Image from buffer", function(assert){
//  cv.readImage(fs.readFileSync('./examples/files/mona.png'), function(err, im){
//    assert.ok(im);
//    assert.equal(im.width(), 500);
//    assert.equal(im.height(), 756)
//    assert.equal(im.empty(), false)
//    assert.end()
//  })
//})

//test("Cascade Classifier", function(assert){
//  assert.ok(new cv.CascadeClassifier("./data/haarcascade_frontalface_alt.xml"), 'test constructor')

//  cv.readImage("./examples/files/mona.png", function(err, im){
//    cascade = new cv.CascadeClassifier("./data/haarcascade_frontalface_alt.xml");
//    cascade.detectMultiScale(im, function(err, faces){//, 1.1, 2, [30, 30]);
//      assert.error(err);
//      assert.equal(typeof faces, typeof []);
//      assert.equal(faces.length, 1)
//      assert.end()
//    })
//  })
//})


//test("ImageDataStream", function(assert){
//  var s = new cv.ImageDataStream()
//  s.on('load', function(im){ 
//    assert.ok(im)
//    assert.equal(im.empty(), false);
//    assert.end()
//  })

//  fs.createReadStream('./examples/files/mona.png').pipe(s);

//})

//test("ImageStream", function(assert){
//  var s = new cv.ImageStream()
//    , im = fs.readFileSync('./examples/files/mona.png')

//  s.on('data', function(mat){
//    assert.deepEqual(mat.size(), [756,500])
//    assert.end()
//  })
//  s.write(im);
//})


//test("CamShift", function(assert){
//  cv.readImage('./examples/files/coin1.jpg', function(e, im){
//    cv.readImage('./examples/files/coin2.jpg', function(e, im2){
//      var tracked = new cv.TrackedObject(im, [420, 110, 490, 170], {channel: 'v'});
//      assert.ok(tracked);
//      var res = tracked.track(im2)
//      assert.ok(res);
//      assert.ok(res[0]  < 396)
//      assert.ok(res[0]  > 376)
//      assert.ok(res[1]  < 122)
//      assert.ok(res[1]  > 102)
//      assert.ok(res[2]  < 469)
//      assert.ok(res[2]  > 449)
//      assert.ok(res[3]  < 176)
//      assert.ok(res[3]  > 156)
//      assert.end()
//    })
//  })
//})

//test("fonts", function(t) {

//  function rnd() {
//    return Math.round(Math.random() * 255);
//  };

//  cv.readImage('./examples/files/coin1.jpg', function(e, im){
//    var y = 0;

//    ([
//      "HERSEY_SIMPLEX",
//      "HERSEY_PLAIN",
//      "HERSEY_DUPLEX",
//      "HERSEY_COMPLEX",
//      "HERSEY_TRIPLEX",
//      "HERSEY_COMPLEX_SMALL",
//      "HERSEY_SCRIPT_SIMPLEX",
//      "HERSEY_SCRIPT_COMPLEX",
//      "HERSEY_SCRIPT_SIMPLEX"
//    ]).forEach(function(font) {
//      im.putText("Some text", 0, y += 20, font, [rnd(), rnd(), rnd()]);
//    });

//    t.ok(im, "image is ok")
//    //im.save("./examples/tmp/coin1-with-text.jpg");
//    t.end();
//  });
//})

