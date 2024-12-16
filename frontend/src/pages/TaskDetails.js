import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import DashboardLayout from '../components/DashboardLayout.js';
import { Editor } from '@tinymce/tinymce-react';
import { API_URL } from '../config/api.js';
import { useAuth } from '../context/AuthProvider.js';
import { 
  Play, 
  Upload, 
  Save,
  Check,
  X,
} from 'lucide-react';

// Base styled components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: #3b82f6;
  font-size: 16px;
`;

const TaskHeader = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
`;

const TaskTitle = styled.h1`
  font-size: 32px;
  color: #1a202c;
  margin: 0 0 20px 0;
`;

const StatusBadge = styled.span`
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
  background: ${props => {
    switch (props.status?.toLowerCase()) {
      case 'assigned': return '#dbeafe';
      case 'in progress': return '#BEE3F8';
      case 'pending': return '#FEEBC8';
      case 'completed': return '#C6F6D5';
      default: return '#E2E8F0';
    }
  }};
  color: ${props => {
    switch (props.status?.toLowerCase()) {
      case 'assigned': return '#1e40af';
      case 'in progress': return '#2B6CB0';
      case 'pending': return '#C05621';
      case 'completed': return '#2F855A';
      default: return '#4A5568';
    }
  }};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const InfoCard = styled.div`
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;

  h3 {
    font-size: 14px;
    color: #64748b;
    margin: 0 0 8px 0;
  }

  p {
    font-size: 16px;
    color: #1e293b;
    margin: 0;
    font-weight: 500;
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const TaskDescription = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;

  h2 {
    margin: 0 0 16px 0;
    color: #1a202c;
    font-size: 24px;
  }

  p {
    color: #4a5568;
    line-height: 1.6;
    margin: 0;
  }
`;

const ProgressTracker = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;

  h2 {
    margin: 0 0 16px 0;
    color: #1a202c;
    font-size: 24px;
  }

  p {
    color: #4a5568;
    margin: 8px 0;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  margin: 16px 0;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  width: ${props => props.progress}%;
  height: 100%;
  background: #3b82f6;
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const EditorContainer = styled.div`
  margin-top: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.primary && `
    background: #3b82f6;
    color: white;
    border: none;
    &:hover {
      background: #2563eb;
    }
  `}
  
  ${props => props.success && `
    background: #10b981;
    color: white;
    border: none;
    &:hover {
      background: #059669;
    }
  `}

  ${props => props.danger && `
    background: #ef4444;
    color: white;
    border: none;
    &:hover {
      background: #dc2626;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;

const FileUploadContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  border: 2px dashed #e2e8f0;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
    background: #f8fafc;
  }
`;

const FileUploadProgress = styled.div`
  width: 100%;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;
`;

const FileUploadProgressBar = styled.div`
  width: ${props => props.progress}%;
  height: 100%;
  background: #3b82f6;
  transition: width 0.3s ease;
`;

const UploadedFile = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  margin-top: 12px;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  width: 90%;
  max-width: 500px;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

// eslint-disable-next-line
const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #991b1b;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

function TaskDetails() {
  const { taskId } = useParams();
  // eslint-disable-next-line
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line
  const [error, setError] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchTask();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
    // eslint-disable-next-line
  }, [taskId]);

  const fetchTask = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`);
      if (!response.ok) throw new Error('Failed to fetch task');
      const data = await response.json();
      setTask(data);
      setEditorContent(data.content || '');
      if (data.files) {
        setUploadedFiles(data.files);
      }
      setTimeSpent(data.timeSpent || 0);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleStartTask = () => {
    setShowEditor(true);
    updateTaskStatus('In Progress');
    // Start timer
    timerRef.current = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
  };

  const updateTaskStatus = async (status) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}/status`, {

        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Failed to update task status');
      const updatedTask = await response.json();
      setTask(updatedTask);
    } catch (err) {
      setError('Failed to update task status');
    }
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    setIsUploading(true);
    setUploadProgress(0);

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('taskId', taskId);

      try {
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            setUploadProgress(progress);
          }
        });

        const response = await fetch(`${API_URL}/upload`, {

          method: 'POST',
          body: formData
        });

        if (!response.ok) throw new Error('Failed to upload file');

        const uploadedFile = await response.json();
        setUploadedFiles(prev => [...prev, uploadedFile]);
      } catch (err) {
        setError(`Failed to upload ${file.name}`);
      }
    }

    setIsUploading(false);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = async (fileId) => {
    try {
      const response = await fetch(`${API_URL}/files/${fileId}`, {

        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete file');
      
      setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    } catch (err) {
      setError('Failed to remove file');
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}/save`, {

        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: editorContent,
          timeSpent,
          files: uploadedFiles
        })
      });

      if (!response.ok) throw new Error('Failed to save task');
      const updatedTask = await response.json();
      setTask(updatedTask);
    } catch (err) {
      setError('Failed to save task. Please try again.');
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}/submit`, {

        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: editorContent,
          status: 'Completed',
          timeSpent,
          files: uploadedFiles
        })
      });

      if (!response.ok) throw new Error('Failed to submit task');
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      const updatedTask = await response.json();
      setTask(updatedTask);
      setShowSubmitModal(false);
      setShowEditor(false);
    } catch (err) {
      setError('Failed to submit task. Please try again.');
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner>Loading task details...</LoadingSpinner>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageContainer>
        <TaskHeader>
          <TaskTitle>{task?.name}</TaskTitle>
          <StatusBadge status={task?.status}>{task?.status}</StatusBadge>
          
          <InfoGrid>
            <InfoCard>
              <h3>Deadline</h3>
              <p>{new Date(task?.deadline).toLocaleDateString()}</p>
            </InfoCard>
            <InfoCard>
              <h3>Assigned To</h3>
              <p>{task?.assignedOfficer}</p>
            </InfoCard>
            <InfoCard>
              <h3>Time Spent</h3>
              <p>{formatTime(timeSpent)}</p>
            </InfoCard>
            <InfoCard>
              <h3>Progress</h3>
              <p>{task?.progress || 0}%</p>
            </InfoCard>
          </InfoGrid>
        </TaskHeader>

        <MainContent>
          <TaskDescription>
            <h2>Task Description</h2>
            <p>{task?.description}</p>

            {!showEditor && task?.status !== 'Completed' && (
              <ButtonGroup>
                <Button primary onClick={handleStartTask}>
                  <Play size={18} />
                  Start Task
                </Button>
              </ButtonGroup>
            )}

            {showEditor && (
              <>
                <ButtonGroup>
                  <Button primary onClick={handleSave}>
                    <Save size={18} />
                    Save Progress
                  </Button>
                  <Button success onClick={() => setShowSubmitModal(true)}>
                    <Check size={18} />
                    Submit Task
                  </Button>
                </ButtonGroup>

                <EditorContainer>
                  <Editor
                    apiKey="your-api-key-here"
                    value={editorContent}
                    onEditorChange={setEditorContent}
                    init={{
                      height: 400,
                      menubar: true,
                      plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                      ],
                      toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
                    }}
                  />
                </EditorContainer>

                <FileUploadContainer>
                  <input
                    type="file"
                    ref={fileInputRef}
                    id="file-upload"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                    multiple
                  />
                  <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                    <Upload size={24} style={{ marginBottom: '8px' }} />
                    <p>Click to upload or drag and drop files here</p>
                  </label>
                  
                  {isUploading && (
                    <FileUploadProgress>
                      <FileUploadProgressBar progress={uploadProgress} />
                    </FileUploadProgress>
                  )}

                  {uploadedFiles.map(file => (
                    <UploadedFile key={file.id}>
                      <span>{file.name}</span>
                      <X
                        size={18}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleRemoveFile(file.id)}
                      />
                    </UploadedFile>
                  ))}
                </FileUploadContainer>
              </>
            )}
          </TaskDescription>

          <ProgressTracker>
            <h2>Progress Tracker</h2>
            <ProgressBar>
              <ProgressFill progress={task?.progress || 0} />
            </ProgressBar>
            <p>{task?.progress || 0}% Complete</p>
          </ProgressTracker>
        </MainContent>

        {showSubmitModal && (
          <>
            <Overlay onClick={() => setShowSubmitModal(false)} />
            <Modal>
              <h2 style={{ marginTop: 0 }}>Submit Task</h2>
              <p>Are you sure you want to submit this task? This action cannot be undone.</p>
              <ButtonGroup>
                <Button danger onClick={() => setShowSubmitModal(false)}>
                  <X size={18} />
                  Cancel
                </Button>
                <Button success onClick={handleSubmit}>
                  <Check size={18} />
                  Confirm Submission
                </Button>
              </ButtonGroup>
            </Modal>
          </>
        )}
      </PageContainer>
    </DashboardLayout>
  );
}

export default TaskDetails;