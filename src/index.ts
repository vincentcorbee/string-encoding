// const str = `💩🇬🇧abcee\u0301é𐐷€🫱🏿‍🫲🏻`

const input = '💩🇬🇧abcee\u0301é𐐷€'

class StringReader {
  private position: number

  constructor(public source: string) {
    this.position = 0
  }

  private isInRange(position: number) {
    if (position > -1 && position < this.source.length) return true

    return false
  }

  next() {
    if (!this.isInRange(this.position)) return null

    return this.source[this.position++].charCodeAt(0)

  }

  previous() {
    if (!this.isInRange(this.position)) return null

    return this.source[this.position--].charCodeAt(0)
  }

  peak() {
    const oldPosition = this.position

    const character = this.next()

    this.position = oldPosition

    return character
  }

  seek(position: number) {
    if (!this.isInRange(position)) throw RangeError()

    this.position = position

    return this
  }

  getPosition() {
    return this.position
  }
}

class StringEncoder {
  readonly encoding = 'UTF-8'

  constructor() {}

  encode(source: string) {
    return StringEncoder.stringToUtf8(source)
  }

  static stringToUtf8(source: string) {
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
      else if (charCode >= 0xD800 && charCode <= 0xDBFF)  {
        const high = charCode

        /* Low surrogate */
        const low = stringReader.peak()

        if (low && low >= 0xDC00 && low <= 0xDFFF) {
          /* Surrogate pairs takes four bytes in UTF-8 */
          const codePoint  = ((high - 0xd800) * 0x400) + (low - 0xDC00) + 0x10000

          const firstByte = 0xf0 | (codePoint >>> 18)
          const secondByte = 0x80 | (codePoint >>> 12 & 0x3f)
          const thirdByte = 0x80 | (codePoint >>> 6 & 0x3f)
          const fourthByte = 0x80 | (codePoint & 0x3f)

          utf8codes.push(firstByte, secondByte, thirdByte, fourthByte)

          stringReader.seek(stringReader.getPosition() + 1)
        }
      }

      /* Low surrogate */
      else if (charCode >= 0xDC00 && charCode <= 0xDFFF) { /* Isolated low surrogate */ }

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

const stringEncoder = new StringEncoder()


console.log(stringEncoder.encode(input))

