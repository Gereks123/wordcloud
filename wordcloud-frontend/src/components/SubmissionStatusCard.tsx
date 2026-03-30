import StatusBadge from './StatusBadge';
import LoadingSpinner from './LoadingSpinner';
import { SubmissionStatus, SUBMISSION_STATUS } from '../util/types';

interface Props {
  id: string;
  status: SubmissionStatus;
}

export default function SubmissionStatusCard({ id, status }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-1">Analysis Results</h2>
          <p className="text-xs text-gray-400 font-mono break-all">{id}</p>
        </div>
        <StatusBadge status={status} />
      </div>
      {status !== SUBMISSION_STATUS.COMPLETE && (
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <LoadingSpinner className="w-4 h-4 text-blue-500" />
          Processing your file — this page updates automatically every 2 seconds
        </div>
      )}
    </div>
  );
}
