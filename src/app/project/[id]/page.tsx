'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Upload, FileText, Eye, Loader2, Trash2 } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  clientName: string;
  programType: string;
  featureType: string;
  uploadTime: string;
  size: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  documents: Document[];
}

export default function ProjectPage() {
  const [project, setProject] = useState<Project | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [analysisData, setAnalysisData] = useState<{
    body?: {
      data?: {
        client_info?: {
          client_name?: string;
          program_type?: string;
          feature_type?: string;
          match_score?: string;
        };
        analysis_results?: {
          summary?: string;
          citations?: Array<{
            document_name: string;
            extract: string;
          }>;
        };
      };
    };
  } | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{show: boolean, docId: string, docName: string}>({show: false, docId: '', docName: ''});
  const router = useRouter();
  const params = useParams();

  const [uploadForm, setUploadForm] = useState({
    clientName: '',
    programType: 'well_v2',
    featureType: 'A01',
    file: null as File | null
  });

  const programTypes = [
    { value: 'well_v2', label: 'WELL v2' },
    { value: 'well_v2p', label: 'WELL v2 Pilot' },
    { value: 'well_health_safety', label: 'WELL Health Safety' }
  ];

  const featureTypes = [
    { value: 'A01', label: 'A01 Air Quality' },
    { value: 'A02', label: 'A02 Smoke-Free Environment' },
    { value: 'A03', label: 'A03 Ventilation' },
    { value: 'W01', label: 'W01 Water Quality' },
    { value: 'L01', label: 'L01 Light Exposure' }
  ];

  const fetchProject = useCallback(async () => {
    try {
      const response = await fetch('/api/projects');
      const projects = await response.json();
      const currentProject = projects.find((p: Project) => p.id === params.id);
      setProject(currentProject || null);
    } catch (error) {
      console.error('Failed to fetch project:', error);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      fetchProject();
    }
  }, [params.id, fetchProject]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('clientName', uploadForm.clientName);
      formData.append('programType', uploadForm.programType);
      formData.append('featureType', uploadForm.featureType);
      formData.append('projectId', params.id as string);
      formData.append('file', uploadForm.file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        fetchProject();
        setShowUploadForm(false);
        setUploadForm({ clientName: '', programType: 'well_v2', featureType: 'A01', file: null });
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDocumentClick = async (document: Document) => {
    console.log('Clicked document:', document);
    console.log('Document ID:', document.id);
    setSelectedDocument(document);
    setLoadingAnalysis(true);
    try {
      const response = await fetch(`/api/analysis?upload_id=${document.id}`);
      const data = await response.json();
      console.log('Analysis response:', data);
      setAnalysisData(data);
    } catch (error) {
      console.error('Failed to fetch analysis:', error);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const handleDeleteDocument = async () => {
    console.log('Deleting document:', deleteConfirm.docId);
    try {
      const response = await fetch(`/api/documents?projectId=${params.id}&documentId=${deleteConfirm.docId}`, {
        method: 'DELETE'
      });
      console.log('Delete response:', response.status);
      if (response.ok) {
        fetchProject();
        if (selectedDocument?.id === deleteConfirm.docId) {
          setSelectedDocument(null);
          setAnalysisData(null);
        }
        setDeleteConfirm({show: false, docId: '', docName: ''});
      }
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };

  const showDeleteConfirm = (docId: string, docName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Delete clicked for:', docId, docName);
    setDeleteConfirm({show: true, docId, docName});
  };

  if (!project) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all cursor-pointer"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {project.name}
            </h1>
            <p className="text-gray-300 mt-1">{project.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className={`w-2 h-2 rounded-full ${project.status === 'active' ? 'bg-green-500' : project.status === 'completed' ? 'bg-blue-500' : 'bg-yellow-500'}`}></div>
              <span className="text-sm text-gray-300 capitalize">{project.status}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Documents</h2>
                <button
                  onClick={() => setShowUploadForm(true)}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg hover:from-purple-700 hover:to-cyan-700 transition-all duration-200 cursor-pointer"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </button>
              </div>

              {showUploadForm && (
                <div className="bg-white/5 rounded-xl p-6 mb-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Upload New Document</h3>
                  <form onSubmit={handleUpload} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Client Name"
                      value={uploadForm.clientName}
                      onChange={(e) => setUploadForm({...uploadForm, clientName: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                      required
                    />
                    <select
                      value={uploadForm.programType}
                      onChange={(e) => setUploadForm({...uploadForm, programType: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                    >
                      {programTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                    <select
                      value={uploadForm.featureType}
                      onChange={(e) => setUploadForm({...uploadForm, featureType: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                    >
                      {featureTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                    <input
                      type="file"
                      onChange={(e) => setUploadForm({...uploadForm, file: e.target.files?.[0] || null})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                      required
                    />
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={uploading}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 cursor-pointer"
                      >
                        {uploading ? 'Uploading...' : 'Upload'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowUploadForm(false)}
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-4">
                {project.documents.filter(doc => doc.id).map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                    onClick={() => handleDocumentClick(doc)}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-purple-400" />
                      <div>
                        <h4 className="text-white font-medium">{doc.name}</h4>
                        <p className="text-gray-400 text-sm">{doc.clientName} • {doc.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-gray-400" />
                      <button
                        onClick={(e) => showDeleteConfirm(doc.id, doc.name, e)}
                        className="p-1 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded transition-all cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            {selectedDocument && (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4">Document Analysis</h3>
                {loadingAnalysis ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
                  </div>
) : analysisData ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-medium mb-2">Client Info</h4>
                      <div className="text-sm text-gray-300 space-y-1">
                        <p>Name: {analysisData.body?.data?.client_info?.client_name}</p>
                        <p>Program: {analysisData.body?.data?.client_info?.program_type}</p>
                        <p>Feature: {analysisData.body?.data?.client_info?.feature_type}</p>
                        <p>Match Score: {analysisData.body?.data?.client_info?.match_score}</p>
                      </div>
                    </div>
                    
                    {analysisData.body?.data?.analysis_results?.summary && (
                      <div>
                        <h4 className="text-white font-medium mb-2">Summary</h4>
                        <p className="text-sm text-gray-300">{analysisData.body.data.analysis_results.summary}</p>
                      </div>
                    )}

                    {analysisData.body?.data?.analysis_results?.citations && (
                      <div>
                        <h4 className="text-white font-medium mb-2">Citations</h4>
                        <div className="space-y-2">
                          {analysisData.body.data.analysis_results.citations.map((citation, index: number) => (
                            <div key={`citation-${index}`} className="text-sm text-gray-300 bg-white/5 p-3 rounded-lg">
                              <p className="font-medium">{citation.document_name}</p>
                              <p className="text-xs text-gray-400 mt-1">&ldquo;{citation.extract}&rdquo;</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">Click on a document to view analysis</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-white mb-4">Delete Document</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete "{deleteConfirm.docName}"? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleDeleteDocument}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm({show: false, docId: '', docName: ''})}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}