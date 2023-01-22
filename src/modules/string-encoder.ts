import { isLeadingSurrogate, isTrailingSurrogate } from "../lib"
import { StringReader } from "./string-reader"

export class StringEncoder {
  readonly encoding = 'UTF-8'

  constructor() {}

  encode(source: string): Uint8Array {
    return StringEncoder.stringToUtf8(source)
  }

  static UTF16SurrogatePairToCodePoint(leading: number, trailing: number): number {
    return ((leading - 0xd800) * 0x400) + (trailing - 0xDC00) + 0x10000
  }

  static stringToUtf8(source: string): Uint8Array {
    const utf8codes: number[] = []

    const stringReader = new StringReader(source)

    let charCode: number | null

    while((charCode = stringReader.next()) !== null) {
      /* Character takes one byte in UTF-8 */
      if (charCode >= 0x0000&& charCode <= 0x007F) utf8codes.push(charCode)

      /* Character takes two bytes in UTF-8 */
      else if (charCode >= 0x0080 && charCode <=0x07FF) {
        const firstByte = 0xc0 | (charCode >>> 6)
        const secondByte = 0x80 | (charCode & 0x3f)

        utf8codes.push(firstByte, secondByte)
      }

      /* High surrogate */
      else if (isLeadingSurrogate(charCode))  {
        const leading = charCode

        /* Low surrogate */
        const trailing = stringReader.peak()

        if (trailing && isTrailingSurrogate(trailing)) {
          /* Surrogate pairs takes four bytes in UTF-8 */
          const codePoint  = StringEncoder.UTF16SurrogatePairToCodePoint(leading, trailing)

          const firstByte = 0xf0 | (codePoint >>> 18)
          const secondByte = 0x80 | (codePoint >>> 12 & 0x3f)
          const thirdByte = 0x80 | (codePoint >>> 6 & 0x3f)
          const fourthByte = 0x80 | (codePoint & 0x3f)

          utf8codes.push(firstByte, secondByte, thirdByte, fourthByte)

          stringReader.advance()
        }
      }

      /* Low surrogate */
      else if (isTrailingSurrogate(charCode)) { /* Isolated low surrogate */ }

      /* Character takes three bytes in UTF-8 */
      else if (charCode >= 0x0800 && 0xFFFF) {
        const firstByte = 0xe0 | (charCode >>> 12)
        const secondByte = 0x80 | (charCode >>> 6 & 0x3f)
        const thirdByte = 0x80 | (charCode & 0x3f)

        utf8codes.push(firstByte, secondByte, thirdByte)
      }
    }

    return new Uint8Array(utf8codes)
  }

  static typedArraytoString(typedArray: Uint8Array, radix = 16) {
    return `<${typedArray.reduce((acc: string, number: number, index: number) => {
      if (index > 0) acc += ', '

      acc += number.toString(radix)

      return acc
    }, '')}>`
  }
}