export interface Article {
  id: string;
  title: string;
  summary: string;
  source: string;
  url?: string;
  date: string;
  region: string; 
  sector: 'IT' | 'Oil & Gas'| 'Vision 2030'; // New field for categorization
}

export interface GeneratedPost {
  id: string;
  articleId: string;
  originalArticleTitle: string;
  content: string; 
  status: 'draft' | 'published';
  createdAt: number;
  lastEditedAt: number;
}

export type AppView = 'news' | 'drafts' | 'published';

export interface LinkedInPostPayload {
  author: string;
  lifecycleState: 'PUBLISHED';
  specificContent: {
    'com.linkedin.ugc.ShareContent': {
      shareCommentary: {
        text: string;
      };
      shareMediaCategory: 'NONE' | 'ARTICLE';
    };
  };
  visibility: {
    'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' | 'CONNECTIONS';
  };
}