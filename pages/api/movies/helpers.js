import fs from 'fs';
import path from 'path';
import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';

const downloadTrailer = (url, destination, filename) => {
  return new Promise((resolve, reject) => {
    const audioOutput = path.join(destination, `${filename}.m4a`);
    const videoOutput = path.join(destination, `${filename}.mp4`);
    const modifiedVideoOutput = path.join(destination, `${filename}-cropped.mp4`);

    // Download audio
    ytdl(url, { filter: format => format.container === 'm4a' && !format.encoding })
      .pipe(fs.createWriteStream(audioOutput))
      .on('finish', () => {
      // Download video and assemble
        ffmpeg().input(ytdl(url, { filter: format => format.container === 'mp4' && format.resolution === '1080p' }))
          .videoCodec('copy')
          .input(audioOutput)
          .audioCodec('copy')
          .save(videoOutput)
          .on('end', () => {
          // Remove black bars
            const cropCommands = [];
            ffmpeg(videoOutput)
              .seek(10) // Skip 10 seconds
              .duration(2) // Analyze 2 seconds
              .videoFilters('cropdetect')
              .format('null')
              .output('-')
              .on('stderr', stdLine => {
                const cropDimensions = /crop=.*/g.exec(stdLine);

                if (cropDimensions === null) {
                  return;
                }

                cropCommands.push(cropDimensions[0]);
              })
              .on('end', () => {
              // Crop video
                ffmpeg(videoOutput)
                  .videoFilters(mode(cropCommands))
                  .audioCodec('copy')
                  .save(modifiedVideoOutput)
                  .on('end', () => {
                    resolve();
                  });
              })
              .run();
          });
      });
  });
};

function mode(arr) {
  return arr.sort((a, b) =>
    arr.filter(v => v === a).length -
        arr.filter(v => v === b).length
  ).pop();
}

module.exports = { downloadTrailer };
