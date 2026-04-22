
import React from 'react';

const Card = ({ 
  title, 
  subtitle, 
  children, 
  className = '', 
  actions,
  loading = false,
  error = null
}) => {
  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${className}`}>
      {(title || subtitle || actions) && (
        <div className="px-6 py-5 border-b border-gray-800 flex justify-between items-start">
          <div className="flex-1">
            {title && (
              <h3 className="text-lg font-semibold text-white">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex gap-2">
              {actions}
            </div>
          )}
        </div>
      )}
      
      <div className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-400">Loading...</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default Card;