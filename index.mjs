import { postRequest } from "./lib/Authentication.mjs";
import BilibiliWebSocket from "./lib/BilibiliWebSocket.mjs";
import Signature from "./lib/Signature.mjs";

export default class BSocket {
    static appKey = ""
    static appSecret = ""
    static bodyData = {}
    static api = "/v1/common/websocketInfo"

    static async connect (
        appKey = this.appKey,
        appSecret = this.appSecret,
        bodyData = this.bodyData,
        api = this.api
    ) {
        const headers = await Signature.getEncoderHeader(appKey, appSecret, bodyData)
        const websocketInfo = await postRequest(bodyData, headers, api)
        return new BilibiliWebSocket(websocketInfo)
    }
}
