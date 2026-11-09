import React from 'react';
import { Star, ExternalLink, Quote } from 'lucide-react';
import { testimonials, googleReviewUrl } from '../data/testimonials';

export const ReviewsSection: React.FC = () => {
  return (
    <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/5">
      {/* Top Banner: Google Rating Trust Badge */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#17171a] via-[#1b1b20] to-[#17171a] border border-white/10 mb-16 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 p-2.5 flex items-center justify-center flex-shrink-0">
            {/* Google G icon */}
            <svg className="w-full h-full" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>

          <div>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#FBBC05] text-[#FBBC05]" />
              ))}
              <span className="text-sm font-bold text-white ml-2">4.9 / 5.0 Rating</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              Verified Client Feedback on Google Reviews
            </h3>
            <p className="text-xs text-white/50">
              Trusted by leading property developers, private villa clients, and corporate brand managers.
            </p>
          </div>
        </div>

        <a
          href={googleReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-full bg-white text-black font-semibold text-xs flex items-center gap-2 hover:bg-white/90 transition-all flex-shrink-0 shadow-lg"
        >
          <span>Write a Google Review</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((item) => (
          <div
            key={item.id}
            className="p-8 rounded-3xl bg-[#141417] border border-white/5 flex flex-col justify-between hover:border-white/10 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#e45d36] text-[#e45d36]" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-white/20" />
              </div>

              <p className="text-sm text-white/80 leading-relaxed mb-6 italic">
                "{item.comment}"
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
              <div>
                <h4 className="font-semibold text-white">{item.name}</h4>
                <p className="text-white/40">{item.role}{item.company ? ` • ${item.company}` : ''}</p>
              </div>
              <span className="text-white/40">{item.location}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

