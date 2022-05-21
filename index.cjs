class BSocket {
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
        const Signature = (await import("./lib/Signature.mjs")).default
        const { postRequest } = await import("./lib/Authentication.mjs")
        const BilibiliWebSocket = (await import("./lib/BilibiliWebSocket.mjs")).default

        const headers = await Signature.getEncoderHeader(appKey, appSecret, bodyData)
        const websocketInfo = await postRequest(bodyData, headers, api)
        return new BilibiliWebSocket(websocketInfo)
    }
}


module.exports = BSocket
