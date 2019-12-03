import fs from 'fs';
import path from 'path';
import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';

export const downloadTrailer = (model, url, destination, filename) => {
  return new Promise((resolve, reject) => {
    try {
      const audioOutput = path.join(destination, `${filename}.m4a`);
      const videoOutput = path.join(destination, `${filename}-temp.mp4`);
      const modifiedVideoOutput = path.join(destination, `${filename}.mp4`);

      // Download audio
      ytdl(url, {quality: 'highestaudio'})
        .pipe(fs.createWriteStream(audioOutput))
        .on('finish', () => {
        // Update progress of download
          model.update({progress: 0.25});

          // Download video and assemble
          ffmpeg().input(ytdl(url, {quality: 'highestvideo', filter: format => format.container === 'mp4'}))
            .videoCodec('copy')
            .input(audioOutput)
            .audioCodec('copy')
            .save(videoOutput)
            .on('end', async () => {
            // Update progress of download
              model.update({progress: 0.6});

              // Crop black bars
              await cropVideo(videoOutput, modifiedVideoOutput);

              // Update progress of download
              await model.update({progress: 1});

              resolve();
            });
        });
    } catch (error) {
      reject(error);
    }
  });
};

const cropVideo = (input, out) => {
  return new Promise((resolve, reject) => {
    try {
      // Remove black bars
      const cropCommands = [];
      ffmpeg(input)
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
          ffmpeg(input)
            .videoFilters(mode(cropCommands))
            .audioCodec('copy')
            .save(out)
            .on('end', () => {
              resolve();
            });
        })
        .run();
    } catch (error) {
      reject(error);
    }
  });
};

function mode(arr) {
  return arr.sort((a, b) =>
    arr.filter(v => v === a).length -
        arr.filter(v => v === b).length
  ).pop();
}
