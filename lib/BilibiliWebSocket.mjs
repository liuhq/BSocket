import WebSocket from "ws"
import Proto from './Proto.mjs'

/**
 * Bilibili WebSocket
 * @class
 * @member websocketInfo
 * @method open
 * @method close
 * @method getGeneralMsgs
 * @method getReadyState
 * @method getWSURL
 * @method listenMsgs
 */
export default class BilibiliWebSocket {
    websocketInfo
    #ws
    #protoAuth
    #protoHeart
    #generalMessages
    #timer

    /**
     * @constructor
     * @param {Object} websocketInfo - signature auth_body
     */
    constructor (websocketInfo) {
        this.websocketInfo = websocketInfo
        this.#protoAuth = new Proto(
            { operation: 7, version: 0 },
            this.websocketInfo.data.auth_body
        )
        this.#protoHeart = new Proto(
            { operation: 2, version: 0 },
            ""
        )
        this.#generalMessages = []

console.log("[SR] BSocket is built.")
    }

    /**
     * Open WebSocket
     * @method
     * @param {string?} host - hostname, get from websocketInfo.data.host[2] by default
     * @param {number?} port - port, get from websocketInfo.data.ws_port[0] by default
     */
    open (host = "", port = 0) {
        this.#ws = new WebSocket(
            `ws://${host || this.websocketInfo.data.host[2]}:${port || this.websocketInfo.data.ws_port[0]}/sub`
        )
        // send AUTH package & set heart beat
        this.#ws.onopen = et => {
            this.#ws.send(this.#protoAuth.pack())
            this.#sendHeart(this.#protoHeart)

console.log("[SR] BSocket is connected.")
        }
        this.#ws.onerror = err => console.error("WebSocket error observed:", err)
    }

    close () {
        clearInterval(this.#timer)
        this.#ws.close()

console.log("[SR] BSocket is closed.")
    }

    getGeneralMsgs () { return this.#generalMessages }
    getReadyState () { return this.#ws.readyState }
    getWSURL () { return this.#ws.url }

    /**
     * listening for messages
     * @method
     * @param {Function?} callback be used to process the danmu messages
     */
    listenMsgs (callback) {
        this.#ws.onmessage = e => {
            let { operation, body } = Proto.unpack(e.data)

            switch (operation) {
                case 5:                             // OP_SEND_SMS_REPLY
                    callback(JSON.parse(body))
                    break;
                case 3:                             // OP_HEARTBEAT_REPLY
                    if (4 < this.#generalMessages.push("HEARTBEAT_REPLY"))     // the maximum length of array is 4
                        this.#generalMessages.shift()
                    break;
                case 8:                             // OP_AUTH_REPLY
                    if (4 < this.#generalMessages.push("AUTH_REPLY"))
                        this.#generalMessages.shift()
                    break;
                default:
                    break;
            }
        }
    }

    #sendHeart (protoHeart) {
        this.#timer = setInterval(() => {
            this.#ws.send(protoHeart.pack())
            if (WebSocket.CLOSING == this.#ws.readyState
                || WebSocket.CLOSED == this.#ws.readyState)
                clearInterval(this.#timer)
        }, 30000)
    }
}
