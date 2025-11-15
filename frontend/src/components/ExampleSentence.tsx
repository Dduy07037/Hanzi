import React from 'react';
import { ExampleSentence as ExampleSentenceType } from '../types';

interface ExampleSentenceProps {
  example: ExampleSentenceType;
}

const ExampleSentence: React.FC<ExampleSentenceProps> = ({ example }) => {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 space-y-2">
      <div className="text-lg font-semibold text-gray-900 dark:text-white">
        {example.chinese}
      </div>
      <div className="text-sm text-primary-600 dark:text-primary-400">
        {example.pinyin}
      </div>
      {example.vietnamese && (
        <div className="text-sm text-green-600 dark:text-green-400 font-medium">
          {example.vietnamese}
        </div>
      )}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {example.english}
      </div>
    </div>
  );
};

export default ExampleSentence;

