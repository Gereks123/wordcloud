import { Link } from 'react-router-dom';
import { useSubmissionsQuery } from '../hooks/useSubmissionsQuery';
import StatusBadge from '../components/StatusBadge';
import TopWordsList from '../components/TopWordsList';
import { SUBMISSION_STATUS } from '../util/types';

function formatBytes(bytes: number | null): string {
  if (bytes === null) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function HistoryPage() {
  const { data, isLoading, isError } = useSubmissionsQuery();

  if (isLoading) {
    return <p className="text-gray-500 text-sm text-center py-16">Loading history…</p>;
  }

  if (isError) {
    return <p className="text-red-500 text-sm text-center py-16">Failed to load history.</p>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg font-medium">No uploads yet</p>
        <p className="text-sm mt-1">
          <Link to="/" className="text-indigo-600 hover:underline">Upload a file</Link> to get started.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload History</h2>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-5 py-3 font-medium text-gray-600">File</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Status</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Size</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Top 3 Words</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Uploaded</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 font-medium text-gray-800 max-w-[200px] truncate">
                  {entry.filename}
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={entry.status} />
                </td>
                <td className="px-5 py-3 text-gray-500 whitespace-nowrap">
                  {formatBytes(entry.fileSizeBytes)}
                </td>
                <td className="px-5 py-3">
                  <TopWordsList words={entry.topWords} />
                </td>
                <td className="px-5 py-3 text-gray-400 whitespace-nowrap text-xs">
                  {formatDate(entry.createdAt)}
                </td>
                <td className="px-5 py-3 text-right">
                  {entry.status === SUBMISSION_STATUS.COMPLETE && (
                    <Link
                      to={`/results/${entry.id}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium text-xs"
                    >
                      View →
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
