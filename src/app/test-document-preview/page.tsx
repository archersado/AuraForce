'use client';

import React, { useState } from 'react';
import DocumentPreview from '@/components/file-preview/DocumentPreview';
import { FileText, Upload } from 'lucide-react';

export default function DocumentPreviewTestPage() {
  const [selectedFile, setSelectedFile] = useState<{
    url: string;
    name: string;
    type: string;
  } | null>(null);

  const sampleFiles = [
    {
      name: 'Sample PDF Document',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      type: 'application/pdf',
      id: 'pdf-1'
    },
    {
      name: 'Another PDF',
      url: 'https://pdfobject.com/pdf/sample.pdf',
      type: 'application/pdf',
      id: 'pdf-2'
    },
    {
      name: 'Sample DOCX Document',
      url: '/documents/sample.docx',
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      id: 'docx-1'
    },
    {
      name: 'Legacy DOC Document',
      url: '/documents/sample.doc',
      type: 'application/msword',
      id: 'doc-1'
    }
  ];

  const handleFileSelect = (file: typeof sampleFiles[0]) => {
    setSelectedFile({
      url: file.url,
      name: file.name,
      type: file.type
    });
  };

  const handleClose = () => {
    setSelectedFile(null);
  };

  const handleLocalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setSelectedFile({
        url: objectUrl,
        name: file.name,
        type: file.type
      });
    }
  };

  const handleDownload = () => {
    if (selectedFile) {
      const link = document.createElement('a');
      link.href = selectedFile.url;
      link.download = selectedFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] bg-gray-100 dark:bg-gray-900">
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          {!selectedFile ? (
            <>
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Document Preview Test
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Test the document preview functionality with various file formats.
                </p>

                {/* Upload Local File */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Upload a Local File
                  </h2>
                  <label className="flex items-center gap-3 px-6 py-4 bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer transition-colors">
                    <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Click to upload a PDF, DOCX, or DOC file
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Supported formats: PDF, DOCX, DOC (download only)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc"
                      onChange={handleLocalFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Sample Files */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Sample Files
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {sampleFiles.map((file) => (
                      <button
                        key={file.id}
                        onClick={() => handleFileSelect(file)}
                        className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all text-left"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {file.name}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {file.type.split('/')[1]?.toUpperCase()}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
                  🧪 Test Instructions
                </h3>
                <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
                  <li>• Upload a local file or select a sample to test preview</li>
                  <li>• PDF: Full preview with page navigation and zoom</li>
                  <li>• DOCX: HTML conversion preview</li>
                  <li>• DOC: Download only (legacy format)</li>
                  <li>• Test download button and close functionality</li>
                </ul>
              </div>
            </>
          ) : (
            <DocumentPreview
              fileUrl={selectedFile.url}
              fileName={selectedFile.name}
              fileType={selectedFile.type.includes('pdf')
                ? 'pdf'
                : selectedFile.type.includes('docx')
                  ? 'docx'
                  : selectedFile.type.includes('doc')
                    ? 'doc'
                    : 'unknown'
              }
              onClose={handleClose}
              onDownload={handleDownload}
              className="rounded-lg shadow-lg"
            />
          )}
        </div>
      </div>
    </div>
  );
}
