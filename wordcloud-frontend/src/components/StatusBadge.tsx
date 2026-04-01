import { CONFIG } from '../util/constants';
import { SubmissionStatus } from '../util/types';

interface StatusBadgeProps {
  status: SubmissionStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { label, classes, dotClass } = CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${classes}`}>
      <span className={`w-2 h-2 rounded-full ${dotClass}`} />
      {label}
    </span>
  );
}
