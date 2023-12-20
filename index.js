const { Transform, pipeline } = require("stream");
const fs = require("fs");

/**
 * createReadStream
 */
const readable = fs.createReadStream("./my-file.txt", { highWaterMark: 20 });

let chunkCount = 0;
readable.on("data", (chunk) => {
  if (chunkCount == 2) {
    readable.pause(); //used to pause the stream
    setTimeout(
      () => readable.resume(), //used to resume the stream after 3 seconds
      3000
    );
  }
  console.log(`Latest Chunk : ${chunk.toString()}`);
  chunkCount++;
});

/**
 * createWriteStream
 */

fs.createWriteStream("my-new-file.txt")
  .write("Hello ")
  .end("Finish!!", () => console.log("end"))

/**
 *duplex with transform & pipeline
 */

const readableDuplex = fs.createReadStream("./my-file.txt", {
  highWaterMark: 20,
});
const writableDuplex = fs.createWriteStream("./duplex.txt");
const upperCase = Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  },
});

/**
 * using pipe we can transform the streams but it
 * may cause memory leak if any pipe fails or we have to write
 * error handler with every pipe to hanle the error
 */
readableDuplex.pipe(upperCase).pipe(writableDuplex); //it may raise memory leaks

/**
 * using pipeline we can use transform and single error
 * handler will be used for all errors
 */
pipeline(readableDuplex, upperCase, writableDuplex, (err) => {
  if (err) console.log(err);
});
