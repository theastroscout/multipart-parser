/*

Multipart Data Processing

*/

const multipart = buf => {

	let data = {};

	/*

	Delimiters

	*/

	const _R = Buffer.from("\r");
	const _N = Buffer.from("\n");
	
	let lineBreakIndex = buf.indexOf(Buffer.from("\n"));
	const lineBreak = buf[lineBreakIndex-1] === _R ? Buffer.concat([_R,_N], 2) : _N;
	const lineBreakLength = lineBreak.length;

	const endBuf = Buffer.concat([Buffer.from("--"), lineBreak], 2+lineBreakLength);

	const contentDisposition = Buffer.from("Content-Disposition:");
	const contentType = Buffer.from("Content-Type:");

	/*

	Get Boundary

	*/

	const boundaryBreakIndex = buf.indexOf(lineBreak);
	const boundary = buf.slice(0, boundaryBreakIndex);

	/*

	Get Files Index

	*/

	let index, offset = 0;
	let chunksIndex = [];

	do {
		index = buf.indexOf(boundary, offset);

		if(index > -1){
			chunksIndex.push(index);
			offset = index + boundary.length;
		}

	} while(index > -1);

	/*

	Parse Files

	*/

	for(let i=0, len=chunksIndex.length; i<len; i++){

		/*

		Get File

		*/

		let start = chunksIndex[i] + boundary.length;
		let end = chunksIndex[i+1] || buf.length;
		let fileBuf = buf.slice(start, end);

		if(!fileBuf.length || fileBuf.equals(endBuf)){
			continue;
		}

		let isArray = false,
			name = false,
			file = {};

		
		/*

		Parse Lines

		*/

		let newLineIndex, newLineOffset = 0;

		for(let l=0; l < 3; l++){
			let nextLine = fileBuf.indexOf(lineBreak, newLineOffset);
			newLineOffset = nextLine + lineBreakLength;
			
			/*

			Get Line

			*/

			let [lineStart, lineEnd] = [newLineIndex + lineBreakLength, nextLine];
			let line = fileBuf.slice(lineStart, lineEnd);
			
			/*

			Headers: If Line is not Empty and is not Line Break

			*/

			if(line.length && !line.equals(lineBreak)){

				// console.log("Line:", l, line.toString())
				
				if(line.indexOf(contentDisposition) > -1){

					/*

					Content Disposition

					*/

					name = line.toString().match(/name\=\"([^"]+)\"/)
					name = name ? name[1] : "";

					isArray = /\[\]/.test(name);
					name = name.replace("[]","");

					if(isArray && !data[name]){
						data[name] = [];
					}

					let fileName = line.toString().match(/filename\=\"([^"]+)\"/);
					if(fileName){
						file.fileName = fileName[1];
					}

				} else if(line.indexOf(contentType) > -1){

					/*

					Content Type

					*/

					file.mime = line.toString().replace("Content-Type: ","");

				}

			}

			/*

			File Buffer

			*/

			if(l === 2){
				lineEnd = fileBuf.length - lineBreakLength;
				lineStart = file.mime ? nextLine + lineBreakLength*2 : lineStart + lineBreakLength;

				line = fileBuf.slice(lineStart, lineEnd);

				if(!file.mime){

					file.type = "string";
					file.value = line.toString();

				} else if(file.mime === "text/plain"){

					file.type = "plain";
					file.value = line.toString();

				} else if(file.mime === "application/json"){

					file.type = "json";

					try {
						file.json = JSON.parse(line.toString());
					} catch(e){
						file.json = {};
					}

				} else {

					file.type = "file";
					
				}

				file.buffer = line;
				file.size = Math.round(line.length / 1024 * 100) / 100;

				break;
			}

			newLineIndex = nextLine;
		}

		/*

		Put File Data

		*/
		
		if(isArray){
			data[name].push(file);
		} else {
			data[name] = file;
		}
	}

	
	
	return data;
};

export default multipart;