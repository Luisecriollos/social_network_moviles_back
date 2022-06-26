import express, { Request, Response } from 'express';
import response from '../../network/response';
import controller from './controller';

const router = express.Router();

const searchTerm = async (req: Request, res: Response) => {
  const term = req.query['q'] as string;
  if (!term) {
    return response.error(req, res, {
      status: 400,
      message: 'Must have a query.',
    });
  }
  try {
    const result = await controller.searchTerm(term);
    response.success(req, res, {
      message: 'Search successfully!',
      body: result,
    });
  } catch (error: any) {
    return response.error(req, res, {
      details: error.message,
    });
  }
};

router.get('/', searchTerm);

export default router;
