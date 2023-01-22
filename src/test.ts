import { StringDecoder, StringEncoder } from "."

const stringA = '💩'
const stringB = '🇬🇧'
const stringC = 'abce'
const stringD = 'e\u0301'
const stringE = 'é'
const stringF = '𐐷€'
const stringG = '🫱🏿‍🫲🏻'
const stringH = 'Привет, мир!'

const input = stringB

const stringEncoder = new StringEncoder()
const stringDecoder = new StringDecoder()

const uint8Array = stringEncoder.encode(input)

console.log(StringEncoder.typedArraytoString(uint8Array))

const decoded = stringDecoder.decode(uint8Array)

console.log(decoded)