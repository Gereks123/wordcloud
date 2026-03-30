import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSubmissionQuery } from '../hooks/useSubmissionQuery';
import WordCloudCanvas from '../components/WordCloudCanvas';
import WordCountTable from '../components/WordCountTable';
import LoadingSpinner from '../components/LoadingSpinner';
import SubmissionStatusCard from '../components/SubmissionStatusCard';
import { WordCountDto, SUBMISSION_STATUS } from '../util/types';

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const [sortBy, setSortBy] = useState<'count' | 'word'>('count');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const { data, isLoading, isError } = useSubmissionQuery(id);

  const handleSort = (column: 'count' | 'word') => {
    if (sortBy === column) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortDir(column === 'count' ? 'desc' : 'asc');
    }
  };

  const sortedWords: WordCountDto[] = data
    ? [...data.wordCounts].sort((a, b) => {
        if (sortBy === 'count') return sortDir === 'desc' ? b.count - a.count : a.count - b.count;
        return sortDir === 'asc' ? a.word.localeCompare(b.word) : b.word.localeCompare(a.word);
      })
    : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner className="w-8 h-8 text-blue-500" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 mb-4">Failed to load submission. The ID may be invalid.</p>
        <Link to="/" className="text-blue-600 hover:underline">Go back</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SubmissionStatusCard id={id!} status={data.status} />

      {data.status === SUBMISSION_STATUS.COMPLETE && data.wordCounts.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Word Cloud</h3>
          <WordCloudCanvas words={data.wordCounts} />
        </div>
      )}

      {data.wordCounts.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Word Counts
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({data.wordCounts.length.toLocaleString()} unique words)
            </span>
          </h3>
          <WordCountTable words={sortedWords} sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
        </div>
      )}

      <div className="text-center">
        <Link to="/" className="text-blue-600 hover:underline text-sm">
          Upload another file
        </Link>
      </div>
    </div>
  );
}
