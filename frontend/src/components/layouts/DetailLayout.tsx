import { ReactNode } from 'react';

interface DetailLayoutProps {
  leftColumn: ReactNode;
  rightColumn: ReactNode;
}

export const DetailLayout = ({ leftColumn, rightColumn }: DetailLayoutProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 transition-layout">
      {/* Left column - Ticket details (2/3 width on large screens) */}
      <div className="lg:col-span-2 space-y-4 sm:space-y-6 stable-layout">
        {leftColumn}
      </div>
      
      {/* Right column - AI panel (1/3 width on large screens) */}
      <div className="lg:col-span-1 space-y-4 sm:space-y-6 stable-layout">
        {rightColumn}
      </div>
    </div>
  );
};
