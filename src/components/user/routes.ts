import express, { Request, Response } from 'express';
import response from '../../network/response';
import controller from './controller';

const router = express.Router();

const getFollowers = async (req: Request<{ id?: string }>, res: Response) => {
  const userId = req.params.id ?? req.user?._id.toString();

  if (!userId) {
    return response.error(req, res, {
      message: 'Invalid body.',
    });
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

const getFollowing = async (req: Request<{ id?: string }>, res: Response) => {
  const userId = req.params.id ?? req.user?._id.toString();

  if (!userId) return response.error(req, res, { message: 'Invalid Body' });

  try {
    const following = await controller.getFollowing(userId);
    response.success(req, res, {
      body: following,
    });
  } catch (error: any) {
    response.error(req, res, {
      details: error.message,
    });
  }
};

const followUser = async (req: Request<{ id?: string }>, res: Response) => {
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

router.get('/following/:id?', getFollowing);
router.route('/follow/:id?').get(getFollowers).post(followUser);

export default router;
