import React from 'react';

export function HeroImage() {
  return (
    <div className="relative mt-12 lg:mt-0">
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl transform lg:translate-x-10">
        <img
          className="w-full h-full object-cover object-center scale-105 hover:scale-110 transition-transform duration-700"
          src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"
          alt="Fashion model in elegant outfit"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      <div className="absolute -bottom-4 -left-4 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute -top-4 -right-4 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-50" />
    </div>
  );
}