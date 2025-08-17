// src/services/socialMediaService.ts
import axios from 'axios';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY as string;
const REDDIT_CLIENT_ID = process.env.REDDIT_CLIENT_ID as string;
const REDDIT_SECRET = process.env.REDDIT_SECRET as string;
const NEWS_API_KEY = process.env.NEWS_API_KEY as string;

/**
 * Fetch latest YouTube videos for a given channel or keyword
 */
export const getYouTubeVideos = async (query = 'missing persons') => {
  try {
    const res = await axios.get(
      `https://www.googleapis.com/youtube/v3/search`,
      {
        params: {
          part: 'snippet',
          q: query,
          maxResults: 5,
          key: YOUTUBE_API_KEY,
          type: 'video',
          order: 'date'
        }
      }
    );
    return res.data.items.map((video: any) => ({
      platform: 'YouTube',
      title: video.snippet.title,
      url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
      publishedAt: video.snippet.publishedAt
    }));
  } catch (err) {
    console.error('Error fetching YouTube videos', err);
    return [];
  }
};

/**
 * Fetch latest Reddit posts from a subreddit
 */
export const getRedditPosts = async (subreddit = 'missingpeople') => {
  try {
    const tokenRes = await axios.post(
      'https://www.reddit.com/api/v1/access_token',
      `grant_type=client_credentials`,
      {
        auth: {
          username: REDDIT_CLIENT_ID,
          password: REDDIT_SECRET
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );

    const token = tokenRes.data.access_token;

    const res = await axios.get(
      `https://oauth.reddit.com/r/${subreddit}/new`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 5 }
      }
    );

    return res.data.data.children.map((post: any) => ({
      platform: 'Reddit',
      title: post.data.title,
      url: `https://reddit.com${post.data.permalink}`,
      publishedAt: new Date(post.data.created_utc * 1000).toISOString()
    }));
  } catch (err) {
    console.error('Error fetching Reddit posts', err);
    return [];
  }
};

/**
 * Fetch latest news articles
 */
export const getNewsArticles = async (query = 'missing persons') => {
  try {
    const res = await axios.get(
      `https://newsapi.org/v2/everything`,
      {
        params: {
          q: query,
          apiKey: NEWS_API_KEY,
          sortBy: 'publishedAt',
          pageSize: 5
        }
      }
    );

    return res.data.articles.map((article: any) => ({
      platform: 'News',
      title: article.title,
      url: article.url,
      publishedAt: article.publishedAt
    }));
  } catch (err) {
    console.error('Error fetching news articles', err);
    return [];
  }
};

/**
 * Combine all social media feeds
 */
export const getSocialMediaFeed = async () => {
  const [youtube, reddit, news] = await Promise.all([
    getYouTubeVideos(),
    getRedditPosts(),
    getNewsArticles()
  ]);

  return [...youtube, ...reddit, ...news];
};

// Export as an object so controller can use `socialMediaService.getSocialMediaFeed()`
export const socialMediaService = {
  getYouTubeVideos,
  getRedditPosts,
  getNewsArticles,
  getSocialMediaFeed,
  getLatestPosts: getSocialMediaFeed // alias for backwards compatibility
};
