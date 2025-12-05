import React, { useState, useEffect } from 'react';
import DashboardLayout from './components/DashboardLayout';
import NewsFeed from './components/NewsFeed';
import PostManager from './components/PostManager';
import EditorModal from './components/EditorModal';
import { Article, GeneratedPost, AppView, LinkedInPostPayload } from './types';
import { StorageService } from './services/storageService';
import { generateLinkedInPost } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('news');
  const [articles, setArticles] = useState<Article[]>([]);
  const [posts, setPosts] = useState<GeneratedPost[]>([]);
  
  // Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<GeneratedPost | null>(null);
  
  // Loading State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Load data on mount
  useEffect(() => {
    const loadedArticles = StorageService.getArticles();
    const loadedPosts = StorageService.getPosts();
    setArticles(loadedArticles);
    setPosts(loadedPosts);
  }, []);

  // Save data on change
  useEffect(() => {
    StorageService.saveArticles(articles);
  }, [articles]);

  useEffect(() => {
    StorageService.savePosts(posts);
  }, [posts]);

  // Handlers
  const handleGenerateDraft = async (article: Article) => {
    setIsGenerating(true);
    try {
        const content = await generateLinkedInPost(article);
        const newPost: GeneratedPost = {
            id: `post-${Date.now()}`,
            articleId: article.id,
            originalArticleTitle: article.title,
            content: content,
            status: 'draft',
            createdAt: Date.now(),
            lastEditedAt: Date.now(),
        };
        
        setPosts(prev => [newPost, ...prev]);
        
        // Switch to drafts and open editor immediately
        setCurrentView('drafts');
        setEditingPost(newPost);
        setIsEditorOpen(true);
    } catch (error) {
        alert("Failed to generate post. Please check console.");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleSavePost = (id: string, newContent: string) => {
    setPosts(prev => prev.map(p => {
        if (p.id === id) {
            return { ...p, content: newContent, lastEditedAt: Date.now() };
        }
        return p;
    }));
  };

  const handlePublishPost = async (id: string) => {
    const postToPublish = posts.find(p => p.id === id);
    if (!postToPublish) return;

    setIsPublishing(true);

    // 1. Construct the LinkedIn API Payload
    // This demonstrates the structure we would send to a real backend proxying the LinkedIn API
    const linkedInPayload: LinkedInPostPayload = {
      author: "urn:li:person:UNKNOWN_USER", // In a real app, this comes from auth
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: postToPublish.content
          },
          shareMediaCategory: "NONE"
        }
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
      }
    };

    try {
      // 2. Call the POST endpoint (Manual Publish Mode requirement)
      // Using jsonplaceholder to simulate a successful backend request
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify(linkedInPayload),
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
      });

      if (!response.ok) throw new Error("Backend publish failed");

      console.log("Successfully published to backend endpoint. Response:", await response.json());

      // 3. Update local state
      setPosts(prev => prev.map(p => {
          if (p.id === id) {
              return { ...p, status: 'published' };
          }
          return p;
      }));

      // 4. "User Manually Posts" - Open LinkedIn Share Intent
      // Since we don't have a real verified LinkedIn App ID for OAuth, we use the share URL
      // This satisfies the "user manually posts" part of the request.
      const shareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(postToPublish.content)}`;
      window.open(shareUrl, '_blank', 'width=600,height=600');
      
      setIsEditorOpen(false);

    } catch (error) {
      console.error("Publish error:", error);
      alert("Failed to publish to endpoint. Check console for details.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <DashboardLayout currentView={currentView} onChangeView={setCurrentView}>
        {/* Loading Overlay */}
        {(isGenerating || isPublishing) && (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-4"></div>
                <h3 className="text-xl font-semibold text-teal-800">
                  {isGenerating ? 'Gemini is Writing...' : 'Publishing to System...'}
                </h3>
                <p className="text-slate-500">
                  {isGenerating ? 'Crafting your LinkedIn post' : 'Sending data to endpoint'}
                </p>
            </div>
        )}

        {currentView === 'news' && (
            <NewsFeed 
                articles={articles} 
                setArticles={setArticles} 
                onGenerateDraft={handleGenerateDraft} 
            />
        )}

        {currentView === 'drafts' && (
            <PostManager 
                posts={posts} 
                view="drafts" 
                onEdit={(post) => {
                    setEditingPost(post);
                    setIsEditorOpen(true);
                }}
                onPublish={handlePublishPost}
            />
        )}

        {currentView === 'published' && (
            <PostManager 
                posts={posts} 
                view="published" 
                onEdit={() => {}} 
                onPublish={handlePublishPost} // Allow re-publishing/sharing
            />
        )}

        <EditorModal 
            isOpen={isEditorOpen}
            onClose={() => setIsEditorOpen(false)}
            post={editingPost}
            onSave={handleSavePost}
            onPublish={handlePublishPost}
        />
    </DashboardLayout>
  );
};

export default App;