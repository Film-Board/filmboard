import {File} from '../../../models';

export default async (request, res) => {
  const {
    method
  } = request;

  if (method === 'GET') {
    res.json(await File.findAll({where: {userUploaded: true}, order: [['updatedAt', 'DESC']]}));
  }
};
