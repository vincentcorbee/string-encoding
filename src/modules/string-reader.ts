export class StringReader {
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
    if (!this.isInRange(position)) throw RangeError(`Offset: ${position} is out of range`)

    this.position = position

    return this
  }

  advance() {
    const position = this.position + 1

    if (!this.isInRange(position)) this.position = -1
    else this.position++

    return this
  }

  getPosition() {
    return this.position
  }
}