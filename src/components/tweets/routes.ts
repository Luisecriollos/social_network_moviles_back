import express, { Request, Response } from 'express';
import { Types } from 'mongoose';
import { ITweet, TTimeline } from '../../interfaces/tweets';
import { multer } from '../../middlewares/multer';
import response from '../../network/response';
import { uploadMultipleFiles } from '../../utils/uploadFile';
import followersController from '../user/controller';
import controller from './controller';

const router = express.Router();

const getTweets = async (req: Request<any, unknown, unknown, { type: TTimeline }>, res: Response) => {
  let type = req.query.type;
  const userId = req.user?._id.toString();

  if (!userId)
    return response.error(req, res, {
      message: 'Unathorized',
      status: 401,
    });

  if (!type) type = 'all';
  try {
    let following: string[] = [];
    if (type === 'followers') following = (await followersController.getFollowing(userId)).map((user) => user._id.toString());

    const tweets = await controller.getTweets(type, [userId, ...following]);
    const retweets = await controller.getRetweets(type, [userId, ...following]);

    response.success(req, res, {
      message: 'Tweets retrieved successfully!',
      body: {
        tweets,
        retweets,
      },
    });
  } catch (error: any) {
    return response.error(req, res, {
      details: error.message,
    });
  }
};

const addTweet = async (req: Request, res: Response) => {
  const tweet: ITweet = req.body;
  if (!tweet.content) {
    return response.error(req, res, {
      message: 'Invalid tweet content',
      status: 400,
      details: 'Ivalid tweet content',
    });
  }
  try {
    if (!req.user?._id) return;
    tweet.owner = new Types.ObjectId(req.user._id);
    const resData = await controller.addTweet(tweet);
    response.success(req, res, {
      message: 'Tweet added sucessfully!',
      body: resData,
    });
  } catch (error: any) {
    return response.error(req, res, {
      details: error.message,
    });
  }
};

const deleteTweet = async (req: Request, res: Response) => {
  const data: ITweet = req.body;
  try {
    const tweet = await controller.getSingleTweet(data._id as string);
    if (!tweet) {
      return response.error(req, res, {
        message: "This tweet doesn't exist.",
        status: 404,
        details: 'Invalid tweet id.',
      });
    }
    if (!req.user?._id.equals(tweet.owner as Types.ObjectId)) {
      return response.error(req, res, {
        message: 'Unauthorized to delete this tweet.',
        status: 400,
        details: 'User is not the owner of the tweet',
      });
    }
    await controller.deleteTweet(tweet._id as string);
    response.success(req, res, {
      message: 'Tweet deleted sucessfully!',
      status: 204,
    });
  } catch (error: any) {
    return response.error(req, res, {
      details: error.message,
    });
  }
};

const retweet = async (req: Request<{ tweetId: string }>, res: Response) => {
  const userId = req.user?._id.toString();
  const tweetId: string = req.params.tweetId;

  if (!userId || !tweetId)
    return response.error(req, res, {
      message: 'Unathorized',
      status: 401,
    });
  try {
    const retweet = await controller.retweet(tweetId, userId);
    response.success(req, res, {
      body: retweet,
      message: `Tweet ${retweet ? 'retweeted' : 'unretweeted'} successfully!`,
      status: 200,
    });
  } catch (error: any) {
    return response.error(req, res, {
      details: error.message,
    });
  }
};

const toggleLikeTweet = async (req: Request, res: Response) => {
  if (!req.user?._id) return;
  try {
    const tweetId: string = req.params['tweetId'];
    await controller.toggleLikeTweet(req.user._id, tweetId);
    response.success(req, res, {
      message: 'Tweet liked/disliked successfully!',
      status: 200,
    });
  } catch (error: any) {
    return response.error(req, res, {
      details: error.message,
    });
  }
};

const uploadTweetAttachments = async (req: Request, res: Response) => {
  const twId = req.params['tweetId'];
  const urls = await uploadMultipleFiles(req.files as Express.Multer.File[], twId);
  const tweet = await controller.setTweetAttachments(twId, urls);
  res.status(201).json(tweet);
};

router.route('/').get(getTweets).post(addTweet).delete(deleteTweet);
router.post('/retweet/:tweetId', retweet);
router.post('/:tweetId/files', multer.array('files', 4), uploadTweetAttachments);
router.route('/toggleLike/:tweetId').patch(toggleLikeTweet);

export default router;
