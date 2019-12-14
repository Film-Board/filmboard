import {File} from '../../../models';

export default async (req, res) => {
  const {
    method
  } = req;

  if (method === 'GET') {
    res.json(await File.findAll({where: {userUploaded: true}, order: [['updatedAt', 'DESC']]}));
  }
};
