# Multipart Data Processing

## Installation

```
npm install @surfy/multipart-parser
```

## Usage

```js

import mp from "@surfy/multipart-parser";

const incomeData = `------cb6762ec1a35a74a
Content-Disposition: form-data; name="jsonFile"
Content-Type: application/json

{"key": "value"}
------cb6762ec1a35a74a
Content-Disposition: form-data; name="variable"

value
------cb6762ec1a35a74a
Content-Disposition: form-data; name="image"; filename="filename.jpg"
Content-Type: image/jpeg

Exif....
------cb6762ec1a35a74a
Content-Disposition: form-data; name="images[]"; filename="filename1.jpg"
Content-Type: image/jpeg

Exif....
------cb6762ec1a35a74a
Content-Disposition: form-data; name="images[]"; filename="filename2.jpg"
Content-Type: image/jpeg

Exif....
------cb6762ec1a35a74a
Content-Disposition: form-data; name="binFile"; filename="bin.dat"
Content-Type: application/octet-stream

Binary data
------cb6762ec1a35a74a
Content-Disposition: form-data; name="textFile"; filename="text.txt"
Content-Type: text/plain

Plain Text
------cb6762ec1a35a74a--
`;

const multipartBuffer = Buffer.from(incomeData);
let data = mp(multipartBuffer);

```

## Output
```
{
	jsonFile: {
		mime: 'application/json',
		type: 'json',
		json: { key: 'value' },
		buffer: <Buffer 7b 22 6b 65 79 22 3a 20 22 76 61 6c 75 65 22 7d>,
		size: 0.02
	},
	variable: {
		type: 'string',
		value: 'value',
		buffer: <Buffer 76 61 6c 75 65>,
		size: 0
	},
	image: {
		fileName: 'filename.jpg',
		mime: 'image/jpeg',
		type: 'file',
		buffer: <Buffer 03 53 45 78 69 66 00 2e 2e 2e 2e>,
		size: 0.01
	},
	images: [
		{
			fileName: 'filename1.jpg',
			mime: 'image/jpeg',
			type: 'file',
			buffer: <Buffer 03 53 45 78 69 66 00 2e 2e 2e 2e>,
			size: 0.01
		},
		{
			fileName: 'filename2.jpg',
			mime: 'image/jpeg',
			type: 'file',
			buffer: <Buffer 03 53 45 78 69 66 00 2e 2e 2e 2e>,
			size: 0.01
		}
	],
	binFile: {
		fileName: 'bin.dat',
		mime: 'application/octet-stream',
		type: 'file',
		buffer: <Buffer 42 69 6e 61 72 79 20 64 61 74 61>,
		size: 0.01
	},
	textFile: {
		fileName: 'text.txt',
		mime: 'text/plain',
		type: 'plain',
		value: 'Plain Text',
		buffer: <Buffer 50 6c 61 69 6e 20 54 65 78 74>,
		size: 0.01
	}
}
```

<br />
<br />

## MIT License

Copyright (c) Alexander Yermolenko • [surfy.one](https://surfy.one)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.