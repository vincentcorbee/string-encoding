export class StringDecoder {
  readonly encoding = 'UTF-8'

  constructor() {}

  static stringFromUTF16CharCode(charCodes: number[]): string {
    return String.fromCharCode(...charCodes)
  }

  static UTF8ToString(uint8Array: Uint8Array): string {
    const stringFromUTF16CharCode = StringDecoder.stringFromUTF16CharCode

    const charCodes: number[] = []

    for (let index = 0, length = uint8Array.byteLength; index < length; index++) {
      const charCode = uint8Array[index]

      /* Character takes one byte */
      if (charCode < 0xc0) charCodes.push(charCode)

      /* Character takes two bytes */
      else if (charCode < 0xe0) charCodes.push((charCode & 0x1f) << 6 | (uint8Array[++index] & 0x3f))

      /* Character takes three bytes */
      else if(charCode < 0xef) charCodes.push((charCode & 0xf) << 12 | ((uint8Array[++index] & 0x3f) << 6) | (uint8Array[++index] & 0x3f))

      /* Character takes four bytes */
      else {
        /* Character consists of high and low surrogate pair */
        const codePoint = ((charCode & 0x7) << 18 | ((uint8Array[++index] & 0x3f) << 12) | ((uint8Array[++index] & 0x3f) << 6) | (uint8Array[++index] & 0x3f)) - 0x10000

        charCodes.push((codePoint >>> 10) + 0xD800, (codePoint & 0x3ff) + 0xDC00)
      }
    }

    return stringFromUTF16CharCode(charCodes)
  }

  decode(typedArray: Uint8Array): string {
    return StringDecoder.UTF8ToString(typedArray)
  }
}