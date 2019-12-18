import {renameSync, createReadStream, createWriteStream} from 'fs';
import {join} from 'path';
import formidable from 'formidable';
import sharp from 'sharp';
import {protect} from '../util/auth';
import {hash} from '../util/random';
import {BUCKET_PATH} from '../../../config';
import {File} from '../../../models';

export default async (req, res) => {
  const {
    query: {type}
  } = req;

  await protect(req, res, {permissions: ['canEditPages']});

  const form = new formidable.IncomingForm();

  form.parse(req, async (error, _, files) => {
    if (error) {
      res.statusCode = 500;
      res.end();
    }

    const file = files[Object.keys(files)[0]];

    let filename = '';
    let extension = '';

    if (file.name.includes('.')) {
      const i = file.name.indexOf('.');

      filename = file.name.slice(0, i);
      extension = file.name.slice(i);
    }

    const h = hash();

    if (type === 'poster') {
      await new Promise(resolve => createReadStream(file.path).pipe(
        sharp()
          .resize(440, 720, {fit: 'inside'})
          .jpeg()).pipe(createWriteStream(join(BUCKET_PATH, `${h}${extension}`))).on('finish', resolve));
    } else {
      // Move to bucket
      renameSync(file.path, join(BUCKET_PATH, `${h}${extension}`));
    }

    // Add to database
    const savedFile = await File.create({
      path: `${h}${extension}`,
      hash: h,
      name: filename,
      userUploaded: type !== 'poster'
    });

    res.json(savedFile);
  });
};

export const config = {
  api: {
    bodyParser: false
  }
};
