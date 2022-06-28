const fetch = require('node-fetch')
const tar = require('tar-stream');
const streamifier = require('streamifier');
const { unzipSync, deflateSync } = require('zlib');

const getCompressedModule = async (URL) => {
  const response = await fetch(URL);
  const buffer = response.buffer();
  return buffer;
}

const getRemoteBuffer = async (compressedModule) => {
  const response = await processStream(compressedModule);
  return response;
}

const processStream = ({ buffer }) => new Promise((resolve, reject) => {
  // Buffer is representation of .tar.gz file uploaded to Express.js server
  // using Multer middleware with MemoryStorage
  let mainFileName = '';
  const textData = [];
  const extract = tar.extract();
  // Extract method accepts each tarred file as entry, separating header and stream of contents:
  extract.on('entry', (header, stream, next) => {
    const chunks = [];
    stream.on('data', (chunk) => {
      chunks.push(chunk);
    });
    stream.on('error', (err) => {
      reject(err);
    });
    stream.on('end', () => {
      if (header.name == 'package.json') {
        const text = Buffer.concat(chunks).toString('utf8');
        const obj = JSON.parse(text);

      }
      if (header.name.startsWith('package/dist') && header.name.endsWith('.min.js')) {
        // We concatenate chunks of the stream into string and push it to array, which holds contents of each file in .tar.gz:
        const text = Buffer.concat(chunks).toString('utf8');
        resolve(text);
      }
      next();
    });
    stream.resume();
  });
  extract.on('finish', () => {
    // We return array of tarred files's contents:
    resolve(textData);
  });
  // We unzip buffer and convert it to Readable Stream and then pass to tar-stream's extract method:
  streamifier.createReadStream(unzipSync(buffer)).pipe(extract);
});

export const getMinifiedCompressedSize = async (URL) => {
  try {
    const compressedModule = await getCompressedModule(URL);
    const minifiedJS = await getRemoteBuffer(compressedModule)
    let minifiedSize = Math.ceil(minifiedJS.length / 1024);
    let moduleSize = Math.ceil(compressedModule.length / 1024);
    let minifiedGzippedSize = Math.ceil(deflateSync(minifiedJS).length / 1024);
    return {
      moduleSize,
      minifiedSize,
      minifiedGzippedSize,
    }
  } catch (error) {
    return error;
  }
}
