var alvision: any = null;

(() => {
    let debugError: any = null;
    let releaseError: any = null;


    try {
        let lib = '../build/Release/alvision.node';
        if (require.resolve(lib)) {
            alvision = require(lib);
        }

        return;
    } catch (e) {
        releaseError = e;
        //release was not found, loading debug
    }


    try {
        let lib = '../build/Debug/alvision.node';
        if (require.resolve(lib)) {
            alvision = require(lib);
        }
        return;
    } catch (e) {
        //debug was not found as well
        debugError = e;
    }

    if (!debugError && !releaseError) {
        console.error('alvision.node module was not found, you may need to compile it');
        console.error("debug:", debugError);
        console.error("release:", releaseError);
    }
})();

export default alvision;