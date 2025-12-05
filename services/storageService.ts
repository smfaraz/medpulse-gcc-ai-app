import { Article, GeneratedPost } from '../types';

const KEYS = {
  ARTICLES: 'medpulse_articles',
  POSTS: 'medpulse_posts',
};

export const StorageService = {
  saveArticles: (articles: Article[]) => {
    localStorage.setItem(KEYS.ARTICLES, JSON.stringify(articles));
  },

  getArticles: (): Article[] => {
    const data = localStorage.getItem(KEYS.ARTICLES);
    return data ? JSON.parse(data) : [];
  },

  savePosts: (posts: GeneratedPost[]) => {
    localStorage.setItem(KEYS.POSTS, JSON.stringify(posts));
  },

  getPosts: (): GeneratedPost[] => {
    const data = localStorage.getItem(KEYS.POSTS);
    return data ? JSON.parse(data) : [];
  },

  clearAll: () => {
    localStorage.removeItem(KEYS.ARTICLES);
    localStorage.removeItem(KEYS.POSTS);
  }
};