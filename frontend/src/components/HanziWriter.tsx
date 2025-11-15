import React, { useEffect, useRef, useState } from 'react';
import HanziWriterLib from 'hanzi-writer';
import { Play, Pause, RotateCcw, Eye, EyeOff } from 'lucide-react';

interface HanziWriterProps {
  character: string;
  width?: number;
  height?: number;
  className?: string;
  showOutline?: boolean;
  quiz?: boolean;
  onComplete?: (writer: HanziWriterLib) => void;
}

const HanziWriter: React.FC<HanziWriterProps> = ({ 
  character, 
  width = 150, 
  height = 150,
  className = '',
  showOutline: showOutlineProp = true,
  quiz = false,
  onComplete
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriterLib | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOutline, setShowOutline] = useState(showOutlineProp);

  useEffect(() => {
    if (!containerRef.current || !character) return;

    // Cleanup previous instance
    if (writerRef.current) {
      writerRef.current = null;
    }

    // Create new instance
    const options: any = {
      width,
      height,
      padding: 5,
      strokeColor: '#2563eb',
      radicalColor: '#dc2626',
      outlineColor: showOutline ? '#94a3b8' : 'transparent',
      drawingColor: '#2563eb',
      drawingWidth: 2,
      showCharacter: false,
      showOutline: showOutline,
      showHint: false,
    };

    if (quiz) {
      options.quiz = true;
    }

    writerRef.current = HanziWriterLib.create(containerRef.current, character, options);

    // Call onComplete callback
    if (onComplete && writerRef.current) {
      onComplete(writerRef.current);
    }

    return () => {
      if (writerRef.current) {
        writerRef.current = null;
      }
    };
  }, [character, width, height, showOutline]);

  const handlePlay = () => {
    if (writerRef.current) {
      setIsPlaying(true);
      writerRef.current.animateCharacter({
        onComplete: () => setIsPlaying(false),
      });
    }
  };

  const handlePause = () => {
    if (writerRef.current) {
      writerRef.current.pauseAnimation();
      setIsPlaying(false);
    }
  };

  const handleReset = () => {
    if (writerRef.current) {
      if (quiz && typeof (writerRef.current as any).quiz === 'function') {
        (writerRef.current as any).quiz();
      } else {
        writerRef.current.hideCharacter();
      }
      setIsPlaying(false);
    }
  };

  const toggleOutline = () => {
    setShowOutline(!showOutline);
  };

  if (!character) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <p className="text-gray-500 dark:text-gray-400">Chọn một từ để xem thứ tự nét</p>
      </div>
    );
  }

  return (
    <div className={`${!quiz ? 'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4' : ''} ${className}`}>
      <div className="flex justify-center mb-4">
        <div ref={containerRef} className={`${!quiz ? 'border border-gray-300 dark:border-gray-600 rounded' : ''}`} />
      </div>
      
      {!quiz && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={isPlaying ? handlePause : handlePlay}
            className="p-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            aria-label={isPlaying ? 'Tạm dừng' : 'Phát'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
          
          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors"
            aria-label="Làm lại"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <button
            onClick={toggleOutline}
            className={`p-2 rounded-lg transition-colors ${
              showOutline 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
            aria-label={showOutline ? 'Ẩn nét mờ' : 'Hiện nét mờ'}
          >
            {showOutline ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default HanziWriter;