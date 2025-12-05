export interface Article {
  id: string;
  title: string;
  summary: string;
  source: string;
  url?: string;
  date: string;
  region: string; // e.g., "UAE", "Saudi Arabia", "GCC"
}

export interface GeneratedPost {
  id: string;
  articleId: string;
  originalArticleTitle: string;
  content: string; // The LinkedIn post text
  status: 'draft' | 'published';
  createdAt: number;
  lastEditedAt: number;
}

export type AppView = 'news' | 'drafts' | 'published';

export interface SearchFilters {
  daysAgo: number;
  specificRegion?: string;
}

// LinkedIn API Structure Types
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