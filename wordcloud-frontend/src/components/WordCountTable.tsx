import { WordCountDto } from '../util/types';

interface WordCountTableProps {
  words: WordCountDto[];
  sortBy: 'count' | 'word';
  sortDir: 'asc' | 'desc';
  onSort: (col: 'count' | 'word') => void;
}

function SortIcon({ active, dir }: { active: boolean; dir: 'asc' | 'desc' }) {
  return (
    <svg
      className={`w-3.5 h-3.5 inline-block ml-1 ${active ? 'text-blue-600' : 'text-gray-300'}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {active && dir === 'asc' ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      )}
    </svg>
  );
}

export default function WordCountTable({ words, sortBy, sortDir, onSort }: WordCountTableProps) {
  return (
    <div className="overflow-auto max-h-96 rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
          <tr>
            <th
              className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer hover:text-gray-900 select-none"
              onClick={() => onSort('word')}
            >
              Word <SortIcon active={sortBy === 'word'} dir={sortDir} />
            </th>
            <th
              className="text-right px-4 py-3 font-medium text-gray-600 cursor-pointer hover:text-gray-900 select-none"
              onClick={() => onSort('count')}
            >
              Count <SortIcon active={sortBy === 'count'} dir={sortDir} />
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {words.slice(0, 500).map(({ word, count }) => (
            <tr key={word} className="hover:bg-gray-50">
              <td className="px-4 py-2 font-mono text-gray-800">{word}</td>
              <td className="px-4 py-2 text-right text-gray-600 tabular-nums">{count.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
