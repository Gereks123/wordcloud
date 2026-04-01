import { useDropzone } from 'react-dropzone';

type DropzoneReturn = ReturnType<typeof useDropzone>;

interface FileDropZoneProps {
  getRootProps: DropzoneReturn['getRootProps'];
  getInputProps: DropzoneReturn['getInputProps'];
  isDragActive: boolean;
}

export default function FileDropzone({ getRootProps, getInputProps, isDragActive }: FileDropZoneProps) {
  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
        isDragActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        {isDragActive ? (
          <p className="text-blue-600 font-medium">Drop the file here</p>
        ) : (
          <>
            <p className="text-gray-600 font-medium">Drag & drop a text file here</p>
            <p className="text-gray-400 text-sm">or click to browse</p>
          </>
        )}
        <p className="text-xs text-gray-400">Supported: .txt, .md, .csv, .log — max 100MB</p>
      </div>
    </div>
  );
}
