import { SubmissionStatus } from "./types";

export const CONFIG: Record<SubmissionStatus, { label: string; classes: string; dotClass: string }> = {
    PENDING:     { label: 'Pending',     classes: 'bg-yellow-100 text-yellow-800 border-yellow-200', dotClass: 'bg-yellow-500' },
    IN_PROGRESS: { label: 'Processing', classes: 'bg-blue-100 text-blue-800 border-blue-200',       dotClass: 'bg-blue-500 animate-pulse' },
    COMPLETE:    { label: 'Complete',   classes: 'bg-green-100 text-green-800 border-green-200',    dotClass: 'bg-green-500' },
}

export const MAX_FILE_SIZE_BYTES = 104857600;
  