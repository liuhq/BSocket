/**
 * Bilibili websocket Proto package
 * @class
 * @method pack
 * @static unpack
 */
export default class Proto {
    #packetLen = 0       // 4 bytes
    #headerLen = 16      // 2 bytes
    #version             // 2 bytes
    #operation           // 4 bytes
    #sequenceID = 0      // 4 bytes
    #body = ""           // 2 bytes a character
    #maxBodyLen

    /**
     * @constructor
     * @param {Object} header - part of the header of Proto package
     * @param {number} header.operation - operation
     * @param {number} header.version - version
     * @param {string} body - the body content of Proto package
     */
    constructor ({ operation, version }, body) {
        this.#version = version
        this.#operation = operation
        this.#body = body
        this.#packetLen = this.#headerLen + this.#body.length

        let bodyBytesLength = Buffer.byteLength(this.#body)
        this.#maxBodyLen = bodyBytesLength ? 16 + bodyBytesLength : 2048
    }

    /**
     * pack
     * @method
     * @returns Proto package buffer
     */
    pack () {
        const arrayBuf = new ArrayBuffer(this.#maxBodyLen)
        const buf = Buffer.from(arrayBuf)

        buf.writeInt32BE(this.#packetLen, 0)    //  0 -  3, 4
        buf.writeInt16BE(this.#headerLen, 4)    //  4 -  5, 2
        buf.writeInt16BE(this.#version, 6)       //  6 -  7, 2
        buf.writeInt32BE(this.#operation, 8)     //  8 - 11, 4
        buf.writeInt32BE(this.#sequenceID, 12)  // 12 - 15, 4
        buf.write(this.#body, 16)

        return buf
    }

    /**
     * unpack
     * @method
     * @param {Buffer} buf - received Proto package
     * @param {boolean} display - display the Proto info on console, default is false
     * @returns the operation and body content of the received Proto package
     */
    static unpack (buf, display = false) {
        let packetLen = buf.readInt32BE(0, 4)
        let headerLen = buf.readInt16BE(4, 2)
        let version = buf.readInt16BE(6, 2)
        let operation = buf.readInt32BE(8, 4)
        let sequenceID = buf.readInt32BE(12, 4)
        let body = buf.toString("utf8", 16)

        if (display) {
            console.log(`
[Proto]
  + Packet Length: ${packetLen}
  + Header Length: ${headerLen}
  + Version: ${version}
  + Operation: ${operation}
  + Sequence ID: ${sequenceID}
  0++++++0+++++++1+++++++2+++++++3
  0      8       6       4       2

  `
            )
        }

        return { operation, body }
    }
}
