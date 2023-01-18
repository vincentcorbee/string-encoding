UTF-16

Code points from U+010000 to U+10FFFF surrogate pairs

high surrogates (0xD800–0xDBFF), low surrogates (0xDC00–0xDFFF)

range 0xD800 – 0xDFFF

Encode

Subtract 0x10000 from the code point

high surrogate remainder >>> 10 +  0xD800

low surrogate (remainder & 0x3ff) + 0xDC00


Decode

high surrogate (surrogate value - 0xd800) * 0x400

low surrogate surrogate value - 0xDC00

result hight + result low + 0x10000


Code point ↔ UTF-8 conversion

First code point	Last code point	Byte 1	  Byte 2	  Byte 3	   Byte 4	    Code points
U+0000	          U+007F	        0xxxxxxx		                              128
U+0080	          U+07FF          110xxxxx	10xxxxxx		                    1920
U+0800	          U+FFFF          1110xxxx	10xxxxxx	10xxxxxx		          61440
U+10000	          U+10FFFF	      11110xxx	10xxxxxx	10xxxxxx   10xxxxxx	  1048576


Combining Diacritical Marks: U+0300–U+036F

Combining Diacritical Marks Extended: U+1AB0–U+1AFF

Combining Diacritical Marks Supplement: U+1DC0–U+1DFF

Combining Diacritical Marks for Symbols: U+20D0–U+20FF

Combining Half Marks: U+FE20–U+FE2F
