import { createHash, createHmac } from "crypto";

/**
 * Signature Util
 * @class
 * @static getEncoderHeader
 * @static getMD5Content
 */
export default class Signature {

    /**
     * encoder header
     * @method
     * @param {string} appKey - access key id
     * @param {string} appSecret - access key secret
     * @param {Object?} data  - signature body
     * @returns {Object} header
     */
    static getEncoderHeader (
        appKey,
        appSecret,
        data = {}
    ) {
        const timestamp = parseInt(Date.now() / 1000 + "")
        const nonce = parseInt(Math.random() * 100000 + "") + timestamp
        const header = {
            "x-bili-accesskeyid": appKey,
            "x-bili-content-md5": this.getMD5Content(JSON.stringify(data)),
            "x-bili-signature-method": "HMAC-SHA256",
            "x-bili-signature-nonce": nonce + "",
            "x-bili-signature-version": "1.0",
            "x-bili-timestamp": timestamp
        }

        const strHeader = []
        for (const key in header)
            strHeader.push(`${key}:${header[key]}`)

        const signature = createHmac("sha256", appSecret)
            .update(strHeader.join("\n"))
            .digest("hex")

        return {
            "Accept": "application/json",
            "Content-Type": "application/json",
            ...header,
            "Authorization": signature
        }
    }

    /**
     * MD5 encoder
     * @method
     * @param {string} str - content
     * @returns {string} cipher text
     */
    static getMD5Content (str) {
        return createHash("md5")
            .update(str)
            .digest("hex")
    }
}
