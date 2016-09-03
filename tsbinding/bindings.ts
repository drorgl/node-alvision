var alvision: any = null;

(() => {

    try {
        let lib = '../build/Release/alvision.node';
        if (require.resolve(lib)) {
            alvision = require(lib);
        }

        return;
    } catch (e) {
        //release was not found, loading debug
        console.warn("unable to load alvision.node", e);
    }


    try {
        let lib = '../build/Debug/alvision.node';
        if (require.resolve(lib)) {
            alvision = require(lib);
        }
        return;
    } catch (e) {
        //debug was not found as well
        console.warn("unable to load alvision.node", e);
    }

    console.error('alvision.node module was not found, you may need to compile it');
})();

export default alvision;