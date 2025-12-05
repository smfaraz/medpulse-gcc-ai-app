import React, { useState } from 'react';
import { Article } from '../types';
import { fetchGCCMedicalNews } from '../services/geminiService';
import { RefreshCw, Sparkles, MapPin, Calendar, Globe } from 'lucide-react';

interface NewsFeedProps {
  articles: Article[];
  setArticles: (articles: Article[]) => void;
  onGenerateDraft: (article: Article) => void;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ articles, setArticles, onGenerateDraft }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const news = await fetchGCCMedicalNews();
      setArticles(news);
    } catch (err) {
      setError("Failed to fetch news. Please check your connection or API Key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Medical News Feed</h1>
          <p className="text-slate-500">Curated GCC healthcare updates powered by Gemini AI</p>
        </div>
        <button
          onClick={handleFetchNews}
          disabled={loading}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? <RefreshCw className="animate-spin" size={18} /> : <RefreshCw size={18} />}
          {loading ? 'Analyzing Web...' : 'Fetch Latest News'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-center gap-2">
           <span>⚠️ {error}</span>
        </div>
      )}

      {articles.length === 0 && !loading && !error && (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe size={32} />
          </div>
          <h3 className="text-lg font-medium text-slate-900">No news articles yet</h3>
          <p className="text-slate-500 max-w-sm mx-auto mt-2">
            Click the "Fetch Latest News" button to search for real-time medical updates from the GCC region.
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {articles.map((article) => (
          <div key={article.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="flex items-start justify-between mb-3">
               <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-100">
                 <MapPin size={12} /> {article.region}
               </span>
               <span className="text-xs text-slate-400 flex items-center gap-1">
                 <Calendar size={12} /> {article.date}
               </span>
            </div>
            
            <h3 className="text-lg font-semibold text-slate-900 mb-2 leading-tight">
              {article.title}
            </h3>
            
            <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-1">
              {article.summary}
            </p>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                {article.source}
              </span>
              <button
                onClick={() => onGenerateDraft(article)}
                className="flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-800 transition-colors"
              >
                <Sparkles size={16} />
                Generate Post
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;