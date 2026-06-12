import { PublicLayout } from "@/components/layout/PublicLayout";
import { Link } from "wouter";
import { Clock, Tag } from "lucide-react";

const categories = ["All", "Baking Tips", "Event Planning", "Food Business Advice", "Training Announcements", "Success Stories", "Foundation Updates"];

const posts = [
  {
    cat: "Success Stories",
    title: "From Learner to Business Owner: Grace's Journey",
    excerpt: "Grace enrolled in our Cake Decoration program with no prior experience. Within a year, she launched her own bakery and now employs three community members.",
    date: "March 2024",
    emoji: "🎂",
    color: "bg-pink-50 border-pink-100",
  },
  {
    cat: "Baking Tips",
    title: "5 Essential Tips for Perfect Bread Every Time",
    excerpt: "Consistent bread baking requires understanding your oven, measuring ingredients precisely, and giving dough adequate time to prove. Our lead trainer shares her top secrets.",
    date: "February 2024",
    emoji: "🍞",
    color: "bg-amber-50 border-amber-100",
  },
  {
    cat: "Training Announcements",
    title: "New Batch Applications Now Open — June 2024",
    excerpt: "We are pleased to announce that applications for our June 2024 training cohort are now open. All programs are free. Apply today and secure your place.",
    date: "April 2024",
    emoji: "📢",
    color: "bg-green-50 border-green-100",
  },
  {
    cat: "Food Business Advice",
    title: "How to Price Your Baked Goods for Profit",
    excerpt: "Many skilled bakers undercharge for their products. This guide walks through calculating cost of production, overheads, and setting a healthy profit margin for your small business.",
    date: "January 2024",
    emoji: "💰",
    color: "bg-blue-50 border-blue-100",
  },
  {
    cat: "Foundation Updates",
    title: "EEOMF Marks 5 Years of Free Vocational Training",
    excerpt: "The Foundation recently celebrated five years of transforming lives through free catering education. Over 500 participants have graduated from our programs since our founding.",
    date: "March 2024",
    emoji: "🏛️",
    color: "bg-purple-50 border-purple-100",
  },
  {
    cat: "Event Planning",
    title: "Catering a Wedding: A Complete Planner's Guide",
    excerpt: "Planning food for a wedding is both an art and a science. From estimating portions to coordinating service timing, our expert caterers share the full blueprint.",
    date: "December 2023",
    emoji: "💍",
    color: "bg-rose-50 border-rose-100",
  },
];

export default function Blog() {
  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto">
        <div className="text-center py-16 mb-12">
          <p className="text-secondary font-semibold uppercase tracking-widest text-sm mb-4">Knowledge & Stories</p>
          <h1 className="text-5xl font-serif font-bold text-primary leading-tight mb-6">Blog & Resources</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Tips, stories, and updates from the Elizabeth Onyaole Okwori Memorial Foundation — your resource centre for catering excellence.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {categories.map(cat => (
            <span key={cat} className="px-4 py-1.5 rounded-full text-xs font-medium bg-white border border-gray-200 text-gray-600 cursor-pointer hover:border-primary/30 hover:text-primary transition-colors">
              {cat}
            </span>
          ))}
        </div>

        {/* Featured post */}
        <div className="bg-primary rounded-3xl p-8 mb-10 text-white flex flex-col sm:flex-row gap-6 items-center">
          <div className="text-7xl shrink-0">📖</div>
          <div>
            <div className="text-xs font-semibold text-secondary uppercase tracking-wide mb-2">Featured</div>
            <h2 className="font-serif font-bold text-2xl mb-3">Welcome to the EEOMF Resource Centre</h2>
            <p className="text-primary-foreground/70 leading-relaxed text-sm">
              This is your home for baking tips, food business advice, success stories from our graduates, and the latest news from the Elizabeth Onyaole Okwori Memorial Foundation. Content is managed by our NGO Officers.
            </p>
          </div>
        </div>

        {/* Posts grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {posts.map((post) => (
            <div key={post.title} className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all overflow-hidden ${post.color}`}>
              <div className={`flex items-center justify-center text-5xl py-8 ${post.color}`}>
                {post.emoji}
              </div>
              <div className="p-5 bg-white">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-3 h-3 text-secondary" />
                  <span className="text-xs font-semibold text-secondary uppercase tracking-wide">{post.cat}</span>
                </div>
                <h3 className="font-serif font-bold text-gray-900 mb-2 leading-snug">{post.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" /> {post.date}
                  </div>
                  <button className="text-xs text-primary font-semibold hover:underline">Read more →</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center bg-accent/40 rounded-2xl p-8 border border-secondary/10">
          <p className="text-muted-foreground mb-4">More articles and resources are added regularly by our team.</p>
          <Link href="/sign-up" className="inline-flex bg-primary text-white font-semibold px-6 py-3 rounded-full hover:bg-primary/90 transition-colors">
            Register for Training Updates
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
