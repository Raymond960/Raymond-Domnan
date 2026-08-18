import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Clock,
  ThumbsUp,
  Share2,
  Sparkles,
  ArrowRight,
  Check,
  Copy,
  DollarSign,
  Zap,
  Tag,
  ChevronRight,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { BLOG_POSTS, BlogPost } from '../data/blogData';
import { WHATSAPP_COMMUNITY_URL } from '../data/mockData';

interface BlogSectionProps {
  onSelectProduct?: (productId: string) => void;
  onOpenWaitlist?: () => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({
  onSelectProduct,
  onOpenWaitlist
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    BLOG_POSTS.forEach((p) => {
      initial[p.id] = p.likes;
    });
    return initial;
  });
  const [copiedPromptIndex, setCopiedPromptIndex] = useState<number | null>(null);
  const [shareSuccess, setShareSuccess] = useState(false);

  const categories = [
    'All',
    'Remote Jobs',
    'Dollar Payouts',
    'AI Prompts',
    'Client Pitching',
    'Canva & Design',
    'Mobile AI Tools'
  ];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCat = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleLike = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isLiked = likedPosts[postId];
    setLikedPosts((prev) => ({ ...prev, [postId]: !isLiked }));
    setLikeCounts((prev) => ({
      ...prev,
      [postId]: (prev[postId] || 0) + (isLiked ? -1 : 1)
    }));
  };

  const handleCopyPrompt = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptIndex(index);
    setTimeout(() => {
      setCopiedPromptIndex(null);
    }, 2000);
  };

  const handleShare = (post: BlogPost, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator
        .share({
          title: post.title,
          text: post.summary,
          url: window.location.href
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(`${post.title} - Read more at ${window.location.href}`);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    }
  };

  return (
    <div id="blog-section-container" className="space-y-10">
      {/* Blog Section Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-black border border-amber-500/30 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Tips for Nigerians &amp; Global Creators</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Practical AI Blueprints, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              Dollar Payouts &amp; Remote Careers
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl">
            Battle-tested guides to passing AI annotation exams, setting up Geegpay/Grey accounts, closing foreign clients on Upwork, and generating ₦300k–₦1.5M/mo from anywhere in Nigeria.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href={WHATSAPP_COMMUNITY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wide transition-all shadow-md cursor-pointer"
            >
              <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.301-.15-1.782-.878-2.057-.978-.276-.1-.476-.15-.677.15-.2.301-.777.978-.952 1.179-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.495-.897-.8-1.503-1.789-1.679-2.09-.175-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.151-.176.2-.301.301-.502.101-.2.05-.376-.025-.526-.075-.15-.677-1.633-.927-2.235-.244-.588-.492-.508-.677-.518-.176-.008-.376-.01-.577-.01-.2 0-.527.075-.802.376-.276.301-1.053 1.028-1.053 2.508 0 1.48 1.078 2.909 1.228 3.11.151.2 2.122 3.24 5.141 4.544.718.31 1.278.496 1.716.635.722.23 1.38.197 1.9.12.58-.087 1.782-.728 2.032-1.431.251-.703.251-1.305.176-1.431-.076-.126-.276-.201-.577-.352zm-5.464 7.618h-.002c-1.921 0-3.805-.516-5.45-1.492l-.391-.232-4.05 1.062 1.082-3.95-.255-.406c-1.074-1.708-1.641-3.69-1.641-5.724 0-5.885 4.789-10.675 10.678-10.675 2.852 0 5.533 1.111 7.55 3.128 2.017 2.018 3.128 4.699 3.128 7.552 0 5.886-4.789 10.677-10.68 10.677zm8.384-18.062c-2.24-2.241-5.218-3.476-8.384-3.476-6.531 0-11.844 5.313-11.844 11.844 0 2.088.545 4.127 1.582 5.922l-1.682 6.143 6.286-1.65c1.734.945 3.687 1.443 5.658 1.443h.005c6.53 0 11.844-5.314 11.844-11.845 0-3.166-1.233-6.144-3.475-8.381z" />
              </svg>
              <span>Join Our WhatsApp Channel</span>
            </a>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`blog-category-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-zinc-950 font-black shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search AI tips, prompts, jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-500 text-xs focus:border-amber-400 outline-none"
          />
        </div>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => {
          const isLiked = likedPosts[post.id];
          const count = likeCounts[post.id] || post.likes;

          return (
            <article
              key={post.id}
              id={`blog-card-${post.id}`}
              onClick={() => setActivePost(post)}
              className="group rounded-3xl bg-zinc-950 border border-zinc-800/80 hover:border-amber-500/50 transition-all duration-300 flex flex-col overflow-hidden shadow-lg hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] cursor-pointer"
            >
              {/* Featured Image Container */}
              <div className="relative h-48 w-full overflow-hidden bg-zinc-900">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-zinc-950/80 backdrop-blur-md border border-amber-500/40 text-amber-400 text-[11px] font-black uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>

                {/* Read Time */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-zinc-300 text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{post.readTime}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                    {post.summary}
                  </p>
                </div>

                {/* Tags & Action Bar */}
                <div className="pt-3 border-t border-zinc-900 flex items-center justify-between">
                  {/* Author Pill */}
                  <div className="flex items-center gap-2">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-6 h-6 rounded-full object-cover border border-amber-500/40"
                    />
                    <span className="text-xs text-zinc-400 font-medium">{post.author.name}</span>
                  </div>

                  {/* Likes & Share */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleLike(post.id, e)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                        isLiked
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <ThumbsUp className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
                      <span>{count}</span>
                    </button>

                    <button
                      onClick={(e) => handleShare(post, e)}
                      className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                      title="Share Article"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-16 bg-zinc-950 rounded-3xl border border-zinc-800">
          <BookOpen className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No articles found matching &quot;{searchQuery}&quot;</h3>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-3 text-xs text-amber-400 underline font-bold cursor-pointer"
          >
            Reset Filters &amp; View All Tips
          </button>
        </div>
      )}

      {/* FULL ARTICLE MODAL READER */}
      {activePost && (
        <div
          id="article-reader-modal"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={() => setActivePost(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActivePost(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 text-zinc-400 hover:text-white flex items-center justify-center font-bold text-sm transition-all cursor-pointer"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="space-y-3 pr-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase">
                  {activePost.category}
                </span>
                <span className="text-xs text-zinc-400 flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3 text-amber-400" /> {activePost.readTime}
                </span>
                <span className="text-xs text-zinc-500">• {activePost.date}</span>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-snug">
                {activePost.title}
              </h2>

              <div className="flex items-center gap-3 pt-2">
                <img
                  src={activePost.author.avatar}
                  alt={activePost.author.name}
                  className="w-10 h-10 rounded-full object-cover border border-amber-500/40"
                />
                <div>
                  <div className="text-xs font-bold text-white">{activePost.author.name}</div>
                  <div className="text-[11px] text-zinc-400">{activePost.author.role}</div>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="rounded-2xl overflow-hidden h-60 w-full bg-zinc-900 border border-zinc-800">
              <img
                src={activePost.featuredImage}
                alt={activePost.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Content Sections */}
            <div className="space-y-6 text-zinc-300 text-sm leading-relaxed">
              {activePost.contentSections.map((sec, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    {sec.heading}
                  </h3>

                  <p className="text-zinc-300">{sec.body}</p>

                  {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                    <ul className="space-y-2 pl-2">
                      {sec.bulletPoints.map((b, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300">
                          <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {sec.calloutBox && (
                    <div
                      className={`p-4 rounded-2xl border ${
                        sec.calloutBox.type === 'dollar'
                          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                          : sec.calloutBox.type === 'prompt'
                          ? 'bg-zinc-900 border-amber-500/40 text-amber-200'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-white">
                          {sec.calloutBox.type === 'dollar' && <DollarSign className="w-4 h-4 text-emerald-400" />}
                          {sec.calloutBox.type === 'prompt' && <Sparkles className="w-4 h-4 text-amber-400" />}
                          {sec.calloutBox.title}
                        </span>

                        {sec.calloutBox.type === 'prompt' && (
                          <button
                            onClick={() => handleCopyPrompt(sec.calloutBox!.text, idx)}
                            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            {copiedPromptIndex === idx ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Formula</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      <p className="text-xs leading-relaxed font-mono whitespace-pre-wrap">
                        {sec.calloutBox.text}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Related Product Promotion */}
            {activePost.relatedProductId && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-zinc-900 to-black border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-black text-amber-400 uppercase tracking-wide">
                    Featured Career Tool
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    Want the full step-by-step kit &amp; tested resume templates?
                  </h4>
                </div>

                <button
                  onClick={() => {
                    const prodId = activePost.relatedProductId;
                    setActivePost(null);
                    if (prodId && onSelectProduct) {
                      onSelectProduct(prodId);
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Get The Master Kit</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Modal Footer Actions */}
            <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
              <button
                onClick={(e) => handleLike(activePost.id, e)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs cursor-pointer"
              >
                <ThumbsUp className="w-4 h-4 text-amber-400" />
                <span>Helpful Guide ({likeCounts[activePost.id] || activePost.likes})</span>
              </button>

              <button
                onClick={() => setActivePost(null)}
                className="px-5 py-2 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white text-xs font-bold cursor-pointer"
              >
                Back to Blog List
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Toast Notification */}
      {shareSuccess && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 font-black text-xs shadow-2xl animate-bounce">
          Link copied to clipboard! Share with your friends.
        </div>
      )}
    </div>
  );
};
