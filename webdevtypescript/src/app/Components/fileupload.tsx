//components/FileUpload.tsx
import { useCallback, useState } from 'react';

//Props interface for customizing the upload component
interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  disabled?: boolean;
}
//Functional component
const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = "image/*",
  maxSizeMB = 10,
  disabled = false
}) => {
  //Local states for drag status, image preview, and validation error
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  //Validates file type and size
  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return 'Please select an image file';
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSizeMB}MB`;
    }

    return null;
  };
  //Handles incoming file after validation
  const handleFile = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    onFileSelect(file);

    //Read file content and create base64 preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, [onFileSelect, maxSizeMB]);

  //Handling drag events to highlight drop zone
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);
 
  //Handling dropped file onto drop zone
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }, [handleFile, disabled]);

  //Handles file selection via input element
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  return (
    <div className="w-full">
      {/* Outer container with fixed height to prevent UI movement */}
      <div className="h-[400px] flex flex-col">
        {/* Upload box with reduced height to fit within container */}
        <div
          className={`relative border-2 border-dashed rounded-lg transition-colors h-[320px] ${
            dragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleInputChange}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          
          <div className="h-full flex flex-col justify-center items-center p-6">
            {preview ? (
              <div className="text-center h-full flex flex-col justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full max-h-48 mx-auto rounded-lg mb-4 object-contain"
                />
                <p className="text-sm text-gray-600">
                  Click or drag to select a different image
                </p>
              </div>
            ) : (
              <div className="text-center flex flex-col justify-center h-full">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 mb-4"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Upload a Pokemon image
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Drag and drop or click to select
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG up to {maxSizeMB}MB
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Reserved space below for spacing */}
        <div className="flex-1"></div>
      </div>

      {error && (
        <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;