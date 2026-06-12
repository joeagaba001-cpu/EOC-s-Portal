import { PublicLayout } from "@/components/layout/PublicLayout";
import { useState } from "react";

const categories = ["All", "Training Activities", "Graduation Events", "Products", "Cake Designs", "Community Outreach", "Foundation Activities"];

const gallery = [
  { cat: "Training Activities", emoji: "👩‍🍳", title: "Baking Workshop", color: "bg-amber-100" },
  { cat: "Cake Designs", emoji: "🎂", title: "Wedding Cake Design", color: "bg-pink-100" },
  { cat: "Training Activities", emoji: "🥐", title: "Pastry Class", color: "bg-yellow-100" },
  { cat: "Graduation Events", emoji: "🎓", title: "Class of 2024 Ceremony", color: "bg-green-100" },
  { cat: "Products", emoji: "🍰", title: "Celebration Cakes", color: "bg-rose-100" },
  { cat: "Community Outreach", emoji: "🤝", title: "Community Food Drive", color: "bg-blue-100" },
  { cat: "Cake Designs", emoji: "🧁", title: "Cupcake Collection", color: "bg-purple-100" },
  { cat: "Foundation Activities", emoji: "🏛️", title: "Foundation Annual Meeting", color: "bg-teal-100" },
  { cat: "Training Activities", emoji: "📦", title: "Food Packaging Session", color: "bg-orange-100" },
  { cat: "Products", emoji: "🍞", title: "Artisan Bread Collection", color: "bg-amber-100" },
  { cat: "Graduation Events", emoji: "🎉", title: "Graduation Celebration", color: "bg-lime-100" },
  { cat: "Community Outreach", emoji: "❤️", title: "Charity Feeding Program", color: "bg-red-100" },
];

export default function Gallery() {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? gallery : gallery.filter(g => g.cat === active);

  return (
    <PublicLayout>
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-16 mb-8">
          <p className="text-secondary font-semibold uppercase tracking-widest text-sm mb-4">Captured Moments</p>
          <h1 className="text-5xl font-serif font-bold text-primary leading-tight mb-6">Our Gallery</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A glimpse into the lives transformed, skills learned, and community built by the Elizabeth Onyaole Okwori Memorial Foundation.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                active === cat
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-primary/30 hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry-style grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4 mb-12">
          {filtered.map((item, i) => (
            <div
              key={i}
              className={`break-inside-avoid rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer ${item.color}`}
            >
              <div className={`flex items-center justify-center text-7xl p-12 ${i % 3 === 0 ? "py-16" : i % 3 === 1 ? "py-12" : "py-10"}`}>
                {item.emoji}
              </div>
              <div className="bg-white px-5 py-4 border-t border-gray-100">
                <div className="text-xs font-semibold text-secondary uppercase tracking-wide mb-1">{item.cat}</div>
                <div className="font-medium text-gray-900 text-sm">{item.title}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center bg-accent/40 rounded-2xl p-8 border border-secondary/10">
          <p className="text-muted-foreground mb-4">More photos coming soon as we continue to document our journey.</p>
          <a href="https://wa.me/2348122990636?text=Hello! I'd like to learn more about the Foundation's activities." target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-full hover:bg-primary/90 transition-colors">
            Stay Updated on WhatsApp
          </a>
        </div>
      </div>
    </PublicLayout>
  );
}
