import { useQuery } from '@tanstack/react-query';
import { getSubmission } from '../api/submissionApi';
import { SUBMISSION_STATUS } from '../util/types';

export function useSubmissionQuery(id: string | undefined) {
  return useQuery({
    queryKey: ['submission', id],
    queryFn: () => getSubmission(id!),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === SUBMISSION_STATUS.COMPLETE ? false : 2000;
    },
    enabled: !!id,
  });
}
