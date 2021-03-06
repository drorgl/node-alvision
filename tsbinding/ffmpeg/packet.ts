import alvision_module from "../bindings";

//export module alvision {
    export interface packet {
        streamid: number;
        RescaleRound(fromTimeBase: number, toTimeBase: number): boolean;
    }

    export interface packetStatic {
        new (): packet
    }

    export var packet: packetStatic = alvision_module.packet;
//}

//export = alvision;