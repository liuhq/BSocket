import { postRequest } from "./lib/Authentication.mjs";
import BilibiliWebSocket from "./lib/BilibiliWebSocket.mjs";
import Signature from "./lib/Signature.mjs";

export default class BSocket {
    static appKey = ""
    static appSecret = ""
    static bodyData = {}
    static api = "/v1/common/websocketInfo"
    static #bs

    static async build (
        appKey = this.appKey,
        appSecret = this.appSecret,
        bodyData = this.bodyData,
        api = this.api
    ) {
        const headers = await Signature.getEncoderHeader(appKey, appSecret, bodyData)
        const websocketInfo = await postRequest(bodyData, headers, api)

        return new BilibiliWebSocket(websocketInfo)
    }

    static async oneStepOpen (callback) {
        const headers = await Signature.getEncoderHeader(this.appKey, this.appSecret, this.bodyData)
        const websocketInfo = await postRequest(this.bodyData, headers, this.api)

        this.#bs = new BilibiliWebSocket(websocketInfo)
        this.#bs.open()
        this.#bs.listenMsgs(callback)
    }

    static oneStepClose (callback = null, ...args) {
        callback(args)
        this.#bs.close()
    }
}
