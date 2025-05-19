import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getAllModules, uploadBulkScores, uploadIndividualScore, getModuleStudents } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const requiredColumns = ['regNo', 'name', 'mark'];

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const Select = styled.select`
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  color: #111827;
  font-size: 0.875rem;
  transition: all 200ms ease-in-out;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

const ModeSelector = styled.div`
  margin-bottom: 2rem;
`;

const ModeTab = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem 0.375rem 0 0;
  cursor: pointer;
  transition: all 150ms ease-in-out;
  background-color: ${props => props.$active ? 'white' : 'transparent'};
  color: ${props => props.$active ? '#2563eb' : '#4b5563'};
  box-shadow: ${props => props.$active ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none'};
  font-weight: 500;
  font-size: 0.875rem;
  color: ${props => props.$active ? '#2563eb' : '#111827'};
  border-top: 2px solid ${props => props.$active ? '#2563eb' : 'transparent'};
  
  &:focus {
    outline: none;
  }
`;

const Input = styled.input`
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  color: #111827;
  font-size: 0.875rem;
  transition: all 200ms ease-in-out;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }

  &::file-selector-button {
    margin-right: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    border: none;
    font-size: 0.875rem;
    font-weight: 600;
    background-color: #eff6ff;
    color: #1d4ed8;
    cursor: pointer;
    transition: background-color 150ms ease-in-out;

    &:hover {
      background-color: #dbeafe;
    }
  }
`;

const HelperText = styled.p`
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  background-color: ${props => props.variant === 'success' ? '#059669' : '#2563eb'};
  border: none;
  cursor: pointer;
  transition: all 200ms ease-in-out;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  &:hover {
    background-color: ${props => props.variant === 'success' ? '#047857' : '#1d4ed8'};
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.variant === 'success' ? 'rgba(5, 150, 105, 0.5)' : 'rgba(59, 130, 246, 0.5)'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #fef2f2;
  border: 1px solid #fee2e2;
  border-radius: 0.375rem;
  color: #dc2626;
  font-size: 0.875rem;
`;

const SuccessMessage = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #f0fdf4;
  border: 1px solid #dcfce7;
  border-radius: 0.375rem;
  color: #059669;
  font-size: 0.875rem;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1.5rem;
`;

const ScoreUpload = () => {
  const [mode, setMode] = useState('bulk');
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState('');
  const [examNumber, setExamNumber] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [studentId, setStudentId] = useState('');
  const [score, setScore] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingModules, setIsFetchingModules] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setIsFetchingModules(true);
        setError('');
        const response = await getAllModules();
        if (response.data?.modules) {
          setModules(response.data.modules);
        } else {
          setError('No modules found');
        }
      } catch (err) {
        setError('Failed to fetch modules');
        setModules([]);
      } finally {
        setIsFetchingModules(false);
      }
    };

    fetchModules();
  }, []);

  useEffect(() => {
    if (mode === 'individual' && selectedModule) {
      setStudents([]);
      setSelectedStudentId('');
      getModuleStudents(selectedModule)
        .then(res => {
          if (res.data?.students) {
            setStudents(res.data.students);
          }
        })
        .catch(() => setStudents([]));
    }
  }, [mode, selectedModule]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          file.type === 'application/vnd.ms-excel') {
        setSelectedFile(file);
        setError('');
      } else {
        setError('Please upload an Excel file (.xlsx or .xls)');
        setSelectedFile(null);
      }
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!selectedModule || !examNumber || !selectedFile) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    try {
      const response = await uploadBulkScores(selectedFile, selectedModule, parseInt(examNumber));
      if (response.data) {
        setSuccess(`Successfully updated ${response.data.successfulUpdates} scores`);
        setSelectedFile(null);
        setSelectedModule('');
        setExamNumber('');
        document.getElementById('file-upload').value = '';
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload scores');
    } finally {
      setIsLoading(false);
    }
  };

  const handleIndividualSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!selectedModule || !examNumber || !selectedStudentId || !score) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    const payload = {
      studentId: selectedStudentId,
      moduleId: selectedModule,
      examNumber: Number(examNumber),
      score: Number(score)
    };

    try {
      const response = await uploadIndividualScore(
        payload.studentId,
        payload.moduleId,
        payload.examNumber,
        payload.score
      );
      if (response) {
        setSuccess(
          `Score updated successfully. New average: ${response.progress?.averageScore ?? 'N/A'}`
        );
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1200);
      }
    } catch (err) {
      setError(err.response?.message || 'Failed to update score');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Title>Upload Scores</Title>
        
        <ModeSelector>
          <TabsContainer>
            <ModeTab 
              onClick={() => setMode('bulk')} 
              $active={mode === 'bulk'}
            >
              Bulk Upload
            </ModeTab>
            <ModeTab 
              onClick={() => setMode('individual')} 
              $active={mode === 'individual'}
            >
              Individual Upload
            </ModeTab>
          </TabsContainer>
        </ModeSelector>

        {isFetchingModules ? (
          <div>Loading modules...</div>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : (
          <>
            {mode === 'bulk' ? (
              <form onSubmit={handleBulkSubmit}>
                <FormGroup>
                  <Label>Select Module</Label>
                  <Select 
                    value={selectedModule} 
                    onChange={(e) => setSelectedModule(e.target.value)}
                    required
                  >
                    <option value="">Select a module</option>
                    {modules.map(module => (
                      <option key={module._id} value={module._id}>
                        {module.title}
                      </option>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Exam Number</Label>
                  <Select 
                    value={examNumber} 
                    onChange={(e) => setExamNumber(e.target.value)}
                    required
                  >
                    <option value="">Select exam number</option>
                    <option value="1">Exam 1</option>
                    <option value="2">Exam 2</option>
                    <option value="3">Exam 3</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Upload Excel File</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    required
                  />
                  <HelperText>
                    File must contain columns: regNo, name, mark
                  </HelperText>
                </FormGroup>

                <ButtonGroup>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Uploading...' : 'Upload Scores'}
                  </Button>
                </ButtonGroup>
              </form>
            ) : (
              <form onSubmit={handleIndividualSubmit}>
                <FormGroup>
                  <Label>Select Module</Label>
                  <Select 
                    value={selectedModule} 
                    onChange={(e) => setSelectedModule(e.target.value)}
                    required
                  >
                    <option value="">Select a module</option>
                    {modules.map(module => (
                      <option key={module._id} value={module._id}>
                        {module.title}
                      </option>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Exam Number</Label>
                  <Select 
                    value={examNumber} 
                    onChange={(e) => setExamNumber(e.target.value)}
                    required
                  >
                    <option value="">Select exam number</option>
                    <option value="1">Exam 1</option>
                    <option value="2">Exam 2</option>
                    <option value="3">Exam 3</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Select Student</Label>
                  <Select
                    value={selectedStudentId}
                    onChange={e => setSelectedStudentId(e.target.value)}
                    required
                    disabled={!students.length}
                  >
                    <option value="">{students.length ? 'Select a student' : 'No students found'}</option>
                    {students.map(student => (
                      <option key={student._id} value={student._id}>
                        {student.name} ({student.regNo})
                      </option>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Score (0-100)</Label>
                  <Input
                    type="number"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    placeholder="Enter score"
                    min="0"
                    max="100"
                    required
                  />
                </FormGroup>

                <ButtonGroup>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Update Score'}
                  </Button>
                </ButtonGroup>
              </form>
            )}
          </>
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
      </Card>
    </Container>
  );
};

export default ScoreUpload;
