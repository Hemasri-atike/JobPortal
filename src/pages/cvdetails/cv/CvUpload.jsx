import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Link } from 'react-router-dom';
import { Upload, Trash, Eye, CheckCircle } from 'lucide-react';
import Header from '../../navbar/Header';
import Sidebar from '../layout/Sidebar';

const CvUpload = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cvs, setCvs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [defaultCvId, setDefaultCvId] = useState(null);

  // Mock data (replace with API call)
  useEffect(() => {
    setIsLoading(true);
    // Simulate API fetch: axios.get('/api/candidate/cvs')
    setTimeout(() => {
      setCvs([
        {
          id: 1,
          fileName: 'resume_johndoe_2025.pdf',
          uploadDate: '2025-08-10',
          size: '1.2 MB',
        },
        {
          id: 2,
          fileName: 'resume_johndoe_tech.docx',
          uploadDate: '2025-08-08',
          size: '0.8 MB',
        },
      ]);
      setDefaultCvId(1); // Set first CV as default
      setIsLoading(false);
    }, 1000);
  }, []);

  // Handle file drop/upload
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      setUploadStatus({ type: 'error', message: 'Only PDF, DOC, or DOCX files are allowed.' });
      return;
    }
    const file = acceptedFiles[0];
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus({ type: 'error', message: 'File size exceeds 5MB limit.' });
      return;
    }
    setIsLoading(true);
    // Simulate API upload: axios.post('/api/candidate/cvs', formData)
    setTimeout(() => {
      const newCv = {
        id: cvs.length + 1,
        fileName: file.name,
        uploadDate: new Date().toISOString().split('T')[0],
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      };
      setCvs([...cvs, newCv]);
      setUploadStatus({ type: 'success', message: 'CV uploaded successfully!' });
      setIsLoading(false);
    }, 1000);
  }, [cvs]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    onDrop,
  });

  // Handle delete CV
  const handleDelete = (id) => {
    setIsLoading(true);
    // Simulate API delete: axios.delete(`/api/candidate/cvs/${id}`)
    setTimeout(() => {
      setCvs(cvs.filter((cv) => cv.id !== id));
      if (defaultCvId === id) {
        setDefaultCvId(cvs[0]?.id || null);
      }
      setIsLoading(false);
    }, 1000);
  };

  // Handle set default CV
  const handleSetDefault = (id) => {
    setIsLoading(true);
    // Simulate API update: axios.put(`/api/candidate/cvs/${id}/default`)
    setTimeout(() => {
      setDefaultCvId(id);
      setIsLoading(false);
    }, 1000);
  };

  // Handle preview CV (PDF only)
  const handlePreview = (fileName) => {
    if (fileName.endsWith('.pdf')) {
      alert('Preview CV (implement with PDF viewer)');
      // Implement with react-pdf or open in new tab
    } else {
      alert('Preview only available for PDF files.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex flex-1">
        {/* Sidebar - collapses on small screens */}
        <div className="hidden md:block w-64 bg-gray-900">
          <Sidebar />
        </div>

        {/* Sidebar for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <div
              className="absolute left-0 top-0 h-full w-64 bg-gray-900 text-white z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">CV Upload</h2>

          {/* Upload Section */}
          <div className="bg-white p-6 rounded-lg shadow-md border mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload New CV</h3>
            <p className="mb-4 text-gray-600">Upload your CV (PDF, DOC, DOCX, max 5MB) to apply for jobs quickly.</p>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'
              }`}
              aria-label="Drag and drop CV file"
            >
              <input {...getInputProps()} aria-label="Upload CV file" />
              <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                {isDragActive ? 'Drop the file here' : 'Drag & drop your CV or click to browse'}
              </p>
            </div>
            {uploadStatus && (
              <p
                className={`mt-2 text-sm ${
                  uploadStatus.type === 'success' ? 'text-green-600' : 'text-red-600'
                }`}
                aria-live="polite"
              >
                {uploadStatus.message}
              </p>
            )}
          </div>

          {/* CV List */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Uploaded CVs</h3>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
              </div>
            ) : cvs.length > 0 ? (
              <div className="space-y-4">
                {cvs.map((cv) => (
                  <div
                    key={cv.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      {cv.id === defaultCvId && (
                        <CheckCircle className="w-5 h-5 text-green-500" aria-label="Default CV" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-800">{cv.fileName}</p>
                        <p className="text-xs text-gray-600">
                          Uploaded: {cv.uploadDate} | Size: {cv.size}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      {cv.fileName.endsWith('.pdf') && (
                        <button
                          onClick={() => handlePreview(cv.fileName)}
                          className="text-blue-600 hover:text-blue-700"
                          aria-label={`Preview CV ${cv.fileName}`}
                        >
                          <Eye size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(cv.id)}
                        className="text-red-600 hover:text-red-700"
                        aria-label={`Delete CV ${cv.fileName}`}
                      >
                        <Trash size={16} />
                      </button>
                      {cv.id !== defaultCvId && (
                        <button
                          onClick={() => handleSetDefault(cv.id)}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                          aria-label={`Set ${cv.fileName} as default CV`}
                        >
                          Set as Default
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center">No CVs uploaded yet.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CvUpload;