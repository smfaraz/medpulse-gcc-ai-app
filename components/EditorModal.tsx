import React, { useState, useEffect } from 'react';
import { GeneratedPost } from '../types';
import { X, Save, Send, Copy, Check, Linkedin } from 'lucide-react';

interface EditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: GeneratedPost | null;
  onSave: (id: string, newContent: string) => void;
  onPublish: (id: string) => void;
}

const EditorModal: React.FC<EditorModalProps> = ({ isOpen, onClose, post, onSave, onPublish }) => {
  const [content, setContent] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (post) {
      setContent(post.content);
    }
  }, [post]);

  if (!isOpen || !post) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePublishClick = () => {
    onSave(post.id, content);
    onPublish(post.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Edit Post</h2>
            <p className="text-sm text-slate-500 truncate max-w-md">Ref: {post.originalArticleTitle}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          <label className="block text-sm font-medium text-slate-700 mb-2">Post Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-80 p-4 rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none resize-none font-sans text-base leading-relaxed"
            placeholder="Write your post here..."
          />
          <div className="mt-2 text-xs text-slate-400 flex justify-end">
            {content.length} characters
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-xl flex items-center justify-between">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-medium px-3 py-2 rounded-lg hover:bg-slate-200 transition-colors"
            >
              {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
              {copied ? 'Copied' : 'Copy Text'}
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  onSave(post.id, content);
                  onClose();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 shadow-sm"
              >
                <Save size={18} />
                Save Draft
              </button>
              
              <button
                onClick={handlePublishClick}
                className="flex items-center gap-2 px-6 py-2 bg-[#0077b5] hover:bg-[#006097] text-white rounded-lg font-medium shadow-sm transition-colors"
              >
                <Linkedin size={18} />
                Publish & Post
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EditorModal;