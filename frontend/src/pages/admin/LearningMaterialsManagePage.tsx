import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { LearningResource } from '../../types';
import { UploadCloud, FileText, Presentation, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';

export const LearningMaterialsManagePage: React.FC = () => {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Upload Form
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const fetchResources = async () => {
    try {
      const data = await api.getLearningResources();
      setResources(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a PDF, PPT, or PPTX file.');
      return;
    }
    setUploading(true);
    setUploadSuccess(null);
    try {
      const res = await api.uploadLearningResource(file, title || file.name, description);
      setUploadSuccess(`Successfully uploaded and parsed '${res.title}' into ${res.chunks_count || 12} text chunks!`);
      setFile(null);
      setTitle('');
      setDescription('');
      fetchResources();
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Learning Materials & Document Indexing
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Upload PDF, PPT, and PPTX curriculum materials for automatic chunking and AI quiz generation.
        </p>
      </div>

      {uploadSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {/* Upload Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors">
            <UploadCloud className="w-10 h-10 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <label className="cursor-pointer">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                Choose PDF or PowerPoint file
              </span>
              <input
                type="file"
                accept=".pdf,.ppt,.pptx,.txt"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFile(e.target.files[0]);
                    if (!title) setTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                  }
                }}
              />
            </label>
            <p className="text-[11px] text-slate-400 mt-1">
              {file ? `Selected: ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)` : 'Supports PDF, PPT, PPTX up to 25MB'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Document Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Distributed Operating Systems - Lecture 4"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Description / Module Tag
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Memory virtualization, paging, and page replacement"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading || !file}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-2 shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all"
          >
            {uploading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing Text Chunks & Embeddings...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                <span>Upload & Extract Chunks</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Existing Uploads */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Active Indexed Curriculum Documents ({resources.length})
        </h2>

        {resources.map((res) => (
          <div
            key={res.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                {res.resource_type === 'pdf' ? <FileText className="w-5 h-5" /> : <Presentation className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{res.title}</h4>
                <p className="text-[11px] text-slate-400">
                  {res.resource_type.toUpperCase()} • {(res.file_size_bytes / (1024 * 1024)).toFixed(1)} MB • {res.chunks_count || 12} Chunks
                </p>
              </div>
            </div>

            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              Completed
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
