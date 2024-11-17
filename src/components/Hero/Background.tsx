import React from 'react';

export function Background() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute w-96 h-96 -top-10 -right-10 bg-purple-200/30 rounded-full blur-3xl" />
      <div className="absolute w-96 h-96 top-1/3 -left-10 bg-indigo-200/30 rounded-full blur-3xl" />
      <div className="absolute w-96 h-96 bottom-0 right-1/3 bg-violet-200/30 rounded-full blur-3xl" />
    </div>
  );
}