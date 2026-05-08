import React from "react";
import Header from "./Header";

interface MemphisLayoutProps {
  children: React.ReactNode;
  showDecorations?: boolean;
  showHeader?: boolean;
}

export const MemphisLayout: React.FC<MemphisLayoutProps> = ({
  children,
  showDecorations = true,
  showHeader = true,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-peach-100 via-peach-50 to-peach-100 relative overflow-hidden">
      {/* Header */}
      {showHeader && <Header />}

      <div className="p-4 md:p-8">
      {/* Decorative Memphis elements */}
      {showDecorations && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {/* Large circles */}
          <div className="absolute top-10 left-10 w-24 h-24 bg-mint-200 rounded-full opacity-30"></div>
          <div className="absolute top-1/3 right-20 w-32 h-32 bg-lilac-200 rounded-full opacity-20"></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-yellow-200 rounded-full opacity-25"></div>

          {/* Geometric shapes */}
          <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-mint-300 transform rotate-45 opacity-20"></div>
          <div className="absolute bottom-1/3 right-10 w-12 h-12 bg-lilac-300 transform rotate-12 opacity-25"></div>

          {/* Small dots */}
          <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-black rounded-full opacity-20"></div>
          <div className="absolute top-2/3 left-10 w-3 h-3 bg-black rounded-full opacity-15"></div>
          <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-black rounded-full opacity-20"></div>

          {/* Lines */}
          <div className="absolute top-1/3 left-1/2 w-32 h-1 bg-black opacity-10 transform -rotate-12"></div>
          <div className="absolute bottom-1/3 right-1/3 w-24 h-1 bg-black opacity-10 transform rotate-6"></div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      </div>
    </div>
  );
};

export default MemphisLayout;
