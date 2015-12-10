try{
	var lib = '../build/Release/alvision.node';
	if (require.resolve(lib)){
		module.exports = require(lib);
	}
	
	return;
}catch (e){
	//release was not found, loading debug
	console.error("unable to load alvision.node",e);
}


try{
	var lib = '../build/Debug/alvision.node';
	if (require.resolve(lib)){
		module.exports = require(lib);
	}
	return;
}catch (e){
	//debug was not found as well
	console.error("unable to load alvision.node",e);
}

console.error('alvision.node module was not found, you may need to compile it');