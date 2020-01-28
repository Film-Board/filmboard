import fs from 'fs';
import path from 'path';
import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import hasha from 'hasha';
import {Trailer, File} from '../../../models';
import {BUCKET_PATH} from '../../../config';

const preferredQualities = [299, 137, 298, 136, 135, 134, 133];

const getItag = formats => {
  let bestIndex = 10;

  formats.forEach(format => {
    const i = preferredQualities.indexOf(format.itag);
    if (i !== -1 && i < bestIndex) {
      bestIndex = i;
    }
  });

  return preferredQualities[bestIndex];
};

export const downloadTrailer = async (url, movie) => {
  const trailerHash = hasha(url);
  const trailerPath = `${trailerHash}.mp4`;

  let trailer;

  if (fs.existsSync(path.join(BUCKET_PATH, trailerPath))) {
    const trailerFile = await File.findOne({where: {hash: trailerHash}});
    trailer = await Trailer.findOne({where: {FileId: trailerFile.id}});
  } else {
    const trailerFile = await File.create({hash: trailerHash, path: trailerPath});
    trailer = await Trailer.create({});
    await trailer.setFile(trailerFile);
  }

  await movie.setTrailer(trailer);

  if (trailer.progress === 1) {
    return;
  }

  return new Promise((resolve, reject) => {
    try {
      const audioOutput = path.join(BUCKET_PATH, `${trailerHash}.m4a`);
      const videoOutput = path.join(BUCKET_PATH, `${trailerHash}-temp.mp4`);
      const modifiedVideoOutput = path.join(BUCKET_PATH, `${trailerHash}.mp4`);

      // Download audio
      ytdl(url, {quality: 'highestaudio'})
        .on('error', reject)
        .pipe(fs.createWriteStream(audioOutput))
        .on('finish', async () => {
          // Update progress of download
          await trailer.update({progress: 0.25});

          const itag = getItag((await ytdl.getInfo(url)).formats);

          // Download video and assemble
          ffmpeg().input(ytdl(url, {quality: itag}))
            .videoCodec('copy')
            .input(audioOutput)
            .audioCodec('aac') // Must be AAC for iOS devices
            .save(videoOutput)
            .on('stderr', console.error)
            .on('start', console.log)
            .on('error', reject)
            .on('end', async () => {
              // Update progress of download
              await trailer.update({progress: 0.6});

              // Crop black bars
              try {
                await cropVideo(videoOutput, modifiedVideoOutput);
              } catch (error) {
                return reject(error);
              }

              // Update progress of download
              await trailer.update({progress: 1});

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
        .on('error', reject)
        .on('start', console.log)
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
            .videoFilters(cropCommands[cropCommands.length - 1])
            .audioCodec('copy')
            .save(out)
            .on('error', reject)
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
