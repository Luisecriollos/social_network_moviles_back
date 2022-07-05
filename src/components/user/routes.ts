import express, { Request, Response } from 'express';
import response from '../../network/response';
import controller from './controller';

const router = express.Router();

const getFollowers = async (req: Request<{ id: string }>, res: Response) => {
  let userId = req.params.id;

  if (!userId && !req.user?._id) {
    return response.error(req, res, {
      message: 'Invalid body.',
    });
  }
  if (!userId && req.user?._id) {
    userId = req.user._id.toString();
  }

  try {
    const followers = await controller.getFollowers(userId);
    response.success(req, res, {
      body: followers,
    });
  } catch (error: any) {
    response.error(req, res, {
      details: error.message,
    });
  }
};

const followUser = async (req: Request<{ id: string }>, res: Response) => {
  const followedId = req.params.id;
  const followerId = req.user?._id;

  if (!followerId || !followedId) {
    return response.error(req, res, {
      message: 'Invalid request',
    });
  }

  try {
    const record = await controller.toggleFollowUser(followerId.toString(), followedId);
    if (record) {
      return response.success(req, res, {
        body: record,
        message: 'User followed successfully!',
      });
    } else {
      return response.success(req, res, {
        message: 'User unfollowed successfully!',
      });
    }
  } catch (error: any) {
    response.error(req, res, {
      details: error.message,
    });
  }
};

router.route('/:id?').get(getFollowers).post(followUser);

export default router;
