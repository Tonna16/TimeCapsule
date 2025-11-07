import  React from 'react';

interface QuickDateButtonsProps {
  onSelectDate: (date: string, time: string) => void;
}

export const QuickDateButtons = ({ onSelectDate }: QuickDateButtonsProps) => {
  const getQuickDates = () => {
    const now = new Date();
    return [
      {
        label: 'Tomorrow',
        date: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '09:00'
      },
      {
        label: 'Next Week',
        date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '09:00'
      },
      {
        label: 'Next Month',
        date: new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()).toISOString().split('T')[0],
        time: '09:00'
      },
      {
        label: '1 Year',
        date: new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()).toISOString().split('T')[0],
        time: '09:00'
      }
    ];
  };

  return (
    <div className="mb-4">
      <p className="text-sm text-gray-600 mb-2">Quick select:</p>
      <div className="flex flex-wrap gap-2">
        {getQuickDates().map(({ label, date, time }, index) => (
          <button
            key={label}
            type="button"
            onClick={() => onSelectDate(date, time)}
            className="px-3 py-1 text-xs bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-full transition-all duration-200 hover:scale-110 transform hover:shadow-md"
            style={{animationDelay: `${index * 0.1}s`}}
          >
            <span className="flex items-center gap-1">
              <span className="animate-pulse">⏰</span>
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
 