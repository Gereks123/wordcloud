import axios from 'axios'
import { SubmissionResponse, SubmissionSummaryDto } from './types'

export async function uploadFile(file: File): Promise<SubmissionResponse> {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await axios.post<SubmissionResponse>(
    '/api/submissions',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  return data
}

export async function getSubmission(id: string): Promise<SubmissionResponse> {
  const { data } = await axios.get<SubmissionResponse>(`/api/submissions/${id}`);
  return data;
}

export async function listSubmissions(): Promise<SubmissionSummaryDto[]> {
  const { data } = await axios.get<SubmissionSummaryDto[]>('/api/submissions')
  return data
}
