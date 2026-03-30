import { SubmissionStatus, WordCountDto } from "../util/types"

export interface SubmissionResponse {
  id: string;
  status: SubmissionStatus;
  wordCounts: WordCountDto[];
}

export interface SubmissionSummaryDto {
    id: string;
    filename: string;
    status: SubmissionStatus;
    fileSizeBytes: number | null;
    createdAt: string;
    topWords: WordCountDto[];
  }