import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Share2, Bookmark } from 'lucide-react';
import { initialBlogPosts } from './BlogPage';

export const BlogDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = initialBlogPosts.find((p) => p.slug === slug) || initialBlogPosts[0];

  return (
    <div className="bg-[#F5F7FC] min-h-screen py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00A9FF] hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Journal</span>
        </Link>

        <article className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200/80 shadow-md space-y-8">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#00A9FF] text-xs font-bold uppercase tracking-wider">
              {post.category}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#071426] leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-3">
                <img
                  src={post.authorAvatar}
                  alt={post.author}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-100"
                />
                <div>
                  <div className="font-bold text-sm text-[#071426]">{post.author}</div>
                  <div className="text-xs text-slate-400">{post.authorRole}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </span>
              </div>
            </div>
          </div>

          <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-900">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-4">
            <p className="font-medium text-slate-800 text-base leading-relaxed">
              {post.excerpt}
            </p>
            <div className="whitespace-pre-line text-slate-600">
              {post.content}
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Published by <strong>TETRA Institute Technology Research Cell</strong>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('Article link copied to clipboard!')}
                className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-[#00A9FF] hover:bg-slate-50 transition"
                title="Share Article"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};
