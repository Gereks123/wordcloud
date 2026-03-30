import { useQuery } from '@tanstack/react-query';
import { listSubmissions } from '../api/submissionApi';

export function useSubmissionsQuery() {
  return useQuery({
    queryKey: ['submissions'],
    queryFn: listSubmissions,
  });
}
