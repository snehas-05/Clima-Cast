import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 mesh-gradient overflow-hidden">
      <div className="relative glass-card max-w-lg w-full p-12 text-center rounded-[3rem] animate-fade-in">
        {/* Animated Background Elements */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-700" />

        <div className="relative z-10">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <span className="material-symbols-outlined text-[120px] text-primary/20">cloud</span>
              <span className="material-symbols-outlined text-4xl text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce">
                question_mark
              </span>
            </div>
          </div>

          <h1 className="text-h1-hero text-on-surface mb-4">404</h1>
          <h2 className="text-h2-dashboard text-on-surface-variant mb-6">Lost in the clouds</h2>
          
          <p className="text-body-lg text-on-surface-variant/80 mb-10 leading-relaxed">
            The page you're looking for seems to have been carried away by a strong current. Let's get you back to familiar coordinates.
          </p>

          <Link to="/">
            <Button className="px-10 py-4 rounded-2xl shadow-xl shadow-primary/20">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
