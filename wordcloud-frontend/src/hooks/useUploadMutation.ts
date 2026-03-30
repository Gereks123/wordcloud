import { useMutation } from '@tanstack/react-query';
import { uploadFile } from '../api/submissionApi';
import { SubmissionResponse } from '../api/types';

interface Options {
  onSuccess?: (data: SubmissionResponse) => void;
  onError?: () => void;
}

export function useUploadMutation({ onSuccess, onError }: Options = {}) {
  return useMutation({
    mutationFn: uploadFile,
    onSuccess,
    onError,
  });
}
