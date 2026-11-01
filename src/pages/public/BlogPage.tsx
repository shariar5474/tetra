import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowRight, Tag } from 'lucide-react';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
}

export const initialBlogPosts: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'rise-of-agentic-ai-workflows-2026',
    title: 'The Rise of Agentic AI Workflows in 2026: Why Businesses are Automating with n8n & LLMs',
    excerpt:
      'Autonomous AI agents are transitioning from research labs to enterprise production. Learn how modern companies orchestrate multi-step autonomous pipelines.',
    content: `
      # The Rise of Agentic AI Workflows in 2026
      
      The landscape of automation has fundamentally shifted from rigid rule-based triggers to dynamic, autonomous reasoning loops. By coupling visual orchestration engines like n8n with advanced reasoning models, developers and businesses can deploy intelligent agents that understand natural language goals, execute API calls, self-correct errors, and summarize critical business outcomes.

      ## Key Architectural Tenets:
      1. **Decoupled Tool Definitions:** Exposing clear schema-driven tools to the LLM.
      2. **Deterministic Fallbacks:** Using structured output validation to guarantee payload formats.
      3. **State Persistence:** Preserving multi-turn context across asynchronous webhook boundaries.

      At TETRA, our AI Automation curriculum trains students directly on production-scale multi-agent deployments.
    `,
    author: 'Shariar Islam Sohel',
    authorRole: 'AI Automation Specialist',
    authorAvatar: '/assets/extracted/trainer-1.png',
    date: 'October 24, 2026',
    readTime: '6 min read',
    category: 'AI & Automation',
    image: '/assets/extracted/course-ai.png',
  },
  {
    id: 'post-2',
    slug: 'complete-digital-marketing-freelancing-roadmap',
    title: 'From Complete Beginner to First Upwork Client: The 2026 Performance Marketing Blueprint',
    excerpt:
      'Step-by-step methodology to master Meta Ads, high-ROAS campaign structures, and landing your first high-ticket international client.',
    content: `
      # Digital Marketing Roadmap in 2026

      Winning international freelance clients requires moving beyond surface-level vanity metrics (clicks, impressions) and delivering verifiable bottom-line revenue.

      ## The 4 Pillars of Modern Marketing:
      - **Algorithmic Meta Advantage:** Creative diversity is the new targeting.
      - **Attribution & Server-Side Tracking:** Overcoming browser cookie restrictions with CAPI.
      - **High-Converting Video Hooks:** Hook rates in the first 3 seconds dictate ad spend profitability.
      - **Client Reporting Transparency:** Clear dashboards showing CPA, ROAS, and customer lifetime value.
    `,
    author: 'Tanvir Ahmed',
    authorRole: 'Growth Marketing Lead',
    authorAvatar: '/assets/extracted/trainer-4.png',
    date: 'October 18, 2026',
    readTime: '8 min read',
    category: 'Digital Marketing',
    image: '/assets/extracted/course-dm.png',
  },
  {
    id: 'post-3',
    slug: 'full-stack-web-architecture-react-typescript',
    title: 'Enterprise Web Development in 2026: React 19, TypeScript & Scalable Backend Microservices',
    excerpt:
      'Deep dive into modern web architecture: Server actions, optimistic UI, state synchronization, and zero-downtime deployment pipelines.',
    content: `
      # Enterprise Web Architecture in 2026

      Building software for high-growth startups demands exceptional performance and type safety. With React 19 and modern bundlers, frontend applications achieve instant sub-second page loads.

      ## What Every Senior Developer Must Know:
      - Strict TypeScript typing across entire database models and API contracts.
      - Optimistic UI updates with instant user feedback.
      - Robust authentication boundaries and role-based access control.
    `,
    author: 'Omar Faruque Razib',
    authorRole: 'Lead Software Architect',
    authorAvatar: '/assets/extracted/trainer-2.png',
    date: 'October 10, 2026',
    readTime: '7 min read',
    category: 'Web Engineering',
    image: '/assets/extracted/course-web.png',
  },
];

export const BlogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'AI & Automation', 'Digital Marketing', 'Web Engineering'];

  const filteredPosts =
    selectedCategory === 'All'
      ? initialBlogPosts
      : initialBlogPosts.filter((p) => p.category === selectedCategory);

  return (
    <div className="bg-[#F5F7FC] min-h-screen py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-[#00A9FF] text-xs font-bold uppercase tracking-wider mb-3">
            Insights &amp; Tutorials
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#071426] tracking-tight">
            TETRA Tech <span className="text-[#00A9FF]">Journal</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-2">
            Actionable strategies, deep dives, and industry roadmaps from our instructors and engineers.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#00A9FF] text-white shadow'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="aspect-[16/10] overflow-hidden bg-slate-900 relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#071426]/80 backdrop-blur-sm text-white text-[11px] font-bold">
                    {post.category}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </span>
                  </div>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="block font-bold text-lg text-[#071426] group-hover:text-[#00A9FF] transition line-clamp-2 leading-snug"
                  >
                    {post.title}
                  </Link>

                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={post.authorAvatar}
                    alt={post.author}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-50"
                  />
                  <div>
                    <div className="font-bold text-xs text-[#071426]">{post.author}</div>
                    <div className="text-[10px] text-slate-400">{post.authorRole}</div>
                  </div>
                </div>

                <Link
                  to={`/blog/${post.slug}`}
                  className="p-2 rounded-xl bg-slate-50 group-hover:bg-[#00A9FF] group-hover:text-white transition text-slate-600"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
