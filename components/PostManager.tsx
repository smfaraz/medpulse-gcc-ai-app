import React from 'react';
import { GeneratedPost } from '../types';
import { Edit3, Clock, CheckCircle2, MoreHorizontal, Send, Linkedin, ExternalLink, BarChart3 } from 'lucide-react';

interface PostManagerProps {
  posts: GeneratedPost[];
  view: 'drafts' | 'published';
  onEdit: (post: GeneratedPost) => void;
  onPublish: (id: string) => void;
}

const PostManager: React.FC<PostManagerProps> = ({ posts, view, onEdit, onPublish }) => {
  const filteredPosts = posts.filter(p => p.status === (view === 'drafts' ? 'draft' : 'published'));
  filteredPosts.sort((a, b) => b.createdAt - a.createdAt);

  if (filteredPosts.length === 0) {
     return (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                {view === 'drafts' ? <Edit3 size={32} /> : <BarChart3 size={32} />}
            </div>
            <h2 className="text-lg font-bold text-slate-900">No {view} found</h2>
            <p className="text-slate-500 mt-1">
                {view === 'drafts' 
                    ? "Generate an industrial update from the News Feed to see it here." 
                    : "Your published industry insights will appear here."}
            </p>
        </div>
     );
  }

  const handleManualShare = (content: string) => {
    const shareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(content)}`;
    window.open(shareUrl, '_blank', 'width=600,height=600');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 capitalize">{view}</h1>
        <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{filteredPosts.length} Items</span>
      </div>

      <div className="grid gap-4">
        {filteredPosts.map((post) => (
          <div key={post.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors group">
            <div className="flex justify-between items-start mb-3">
               <div>
                  <h3 className="font-bold text-slate-900 mb-1">{post.originalArticleTitle}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                        {post.status}
                    </span>
                  </div>
               </div>
               <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                   <button className="p-1 hover:bg-slate-100 rounded text-slate-400">
                       <MoreHorizontal size={20} />
                   </button>
               </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg text-slate-700 text-sm whitespace-pre-wrap mb-4 font-normal leading-relaxed border border-slate-100">
                {post.content.length > 300 ? `${post.content.slice(0, 300)}...` : post.content}
            </div>

            <div className="flex items-center justify-end gap-3">
               {post.status === 'draft' && (
                   <>
                    <button 
                        onClick={() => onEdit(post)}
                        className="px-4 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                        <Edit3 size={16} /> Edit
                    </button>
                    <button 
                        onClick={() => onPublish(post.id)}
                        className="px-4 py-2 text-sm font-bold text-white bg-indigo-900 rounded-lg hover:bg-indigo-950 transition-colors shadow-md flex items-center gap-2"
                    >
                        <Send size={16} /> Publish
                    </button>
                   </>
               )}
               {post.status === 'published' && (
                   <button 
                        onClick={() => handleManualShare(post.content)}
                        className="px-4 py-2 text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center gap-2 hover:bg-indigo-100 transition-colors"
                   >
                        <Linkedin size={16} /> 
                        Share on LinkedIn
                        <ExternalLink size={12} className="ml-1 opacity-50"/>
                   </button>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostManager;