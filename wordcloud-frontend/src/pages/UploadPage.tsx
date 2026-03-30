import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone, FileRejection } from 'react-dropzone';
import { MAX_FILE_SIZE_BYTES } from '../util/constants';
import { useUploadMutation } from '../hooks/useUploadMutation';
import FileDropzone from '../components/FileDropzone';
import SelectedFilePreview from '../components/SelectedFilePreview';
import LoadingSpinner from '../components/LoadingSpinner';

export default function UploadPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const uploadMutation = useUploadMutation({
    onSuccess: (data) => navigate(`/results/${data.id}`),
    onError: () => setError('Upload failed. Please try again.'),
  });

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setError(null);
      if (rejectedFiles.length > 0) {
        if (rejectedFiles[0].errors.some((e) => e.code === 'file-too-large')) {
          setError('File is too large. Maximum size is 100MB.');
        } else {
          setError('Please upload a plain text file.');
        }
        return;
      }
      if (acceptedFiles.length > 0) setSelectedFile(acceptedFiles[0]);
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/*': ['.txt', '.text', '.md', '.csv', '.log'] },
    maxSize: MAX_FILE_SIZE_BYTES,
    multiple: false,
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Upload Text File</h2>
        <FileDropzone getRootProps={getRootProps} getInputProps={getInputProps} isDragActive={isDragActive} />
        {selectedFile && (
          <SelectedFilePreview file={selectedFile} onRemove={() => setSelectedFile(null)} />
        )}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        <button
          onClick={() => selectedFile && uploadMutation.mutate(selectedFile)}
          disabled={!selectedFile || uploadMutation.isPending}
          className="mt-6 w-full py-3 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {uploadMutation.isPending ? (
            <span className="flex items-center justify-center gap-2">
              <LoadingSpinner className="w-4 h-4" />
              Uploading...
            </span>
          ) : (
            'Upload & Analyze'
          )}
        </button>
      </div>
    </div>
  );
}
