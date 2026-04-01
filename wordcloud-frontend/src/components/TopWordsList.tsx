import { WordCountDto } from '../util/types';

interface TopWordsListProps {
  words: WordCountDto[];
}

export default function TopWordsList({ words }: TopWordsListProps) {
  if (words.length === 0) {
    return <span className="text-gray-400">—</span>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {words.map((w) => (
        <span
          key={w.word}
          className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full px-2.5 py-0.5 text-xs font-medium"
        >
          {w.word}
          <span className="text-indigo-400">×{w.count}</span>
        </span>
      ))}
    </div>
  );
}
