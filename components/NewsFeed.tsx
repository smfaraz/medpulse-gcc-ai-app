import React, { useState } from 'react';
import { Article } from '../types';
import { fetchGCCIndustryNews } from '../services/geminiService';
import { RefreshCw, Sparkles, MapPin, Calendar, Globe, Cpu, Flame, Target } from 'lucide-react';

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
      const news = await fetchGCCIndustryNews();
      setArticles(news);
    } catch (err) {
      setError("Failed to fetch industry news.");
    } finally {
      setLoading(false);
    }
  };

  const getSectorStyles = (sector: string) => {
    switch(sector) {
        case 'IT': return 'border-t-indigo-600 bg-indigo-50 text-indigo-700 border-indigo-100';
        case 'Oil & Gas': return 'border-t-amber-600 bg-amber-50 text-amber-800 border-amber-100';
        case 'Vision 2030': return 'border-t-emerald-600 bg-emerald-50 text-emerald-800 border-emerald-100';
        default: return 'border-t-slate-600 bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">GCC Industry & Vision Feed</h1>
          <p className="text-slate-500">IT, Energy, and Vision 2030 updates powered by Gemini AI</p>
        </div>
        <button
          onClick={handleFetchNews}
          disabled={loading}
          className="bg-indigo-900 hover:bg-indigo-950 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all"
        >
          {loading ? <RefreshCw className="animate-spin" size={18} /> : <RefreshCw size={18} />}
          {loading ? 'Analyzing...' : 'Fetch Latest Updates'}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {articles.map((article) => {
          const styles = getSectorStyles(article.sector);
          const borderClass = styles.split(' ')[0];
          const badgeClass = styles.split(' ').slice(1).join(' ');

          return (
            <div key={article.id} className={`bg-white rounded-xl border-t-4 p-6 shadow-sm hover:shadow-md transition-all flex flex-col ${borderClass}`}>
              <div className="flex items-start justify-between mb-3">
                 <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${badgeClass}`}>
                   {article.sector === 'IT' && <Cpu size={12} />}
                   {article.sector === 'Oil & Gas' && <Flame size={12} />}
                   {article.sector === 'Vision 2030' && <Target size={12} />}
                   {article.sector}
                 </span>
                 <span className="text-xs text-slate-400 flex items-center gap-1">
                   <Calendar size={12} /> {article.date}
                 </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-2">{article.title}</h3>
              <p className="text-slate-600 text-sm mb-4 flex-1">{article.summary}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <MapPin size={12}/> {article.region}
                </span>
                <button
                  onClick={() => onGenerateDraft(article)}
                  className="flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800"
                >
                  <Sparkles size={16} /> Generate Post
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewsFeed;