import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getAllModules, uploadBulkScores, uploadIndividualScore } from '../services/api';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #333;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid #ddd;
`;

const ModeTab = styled.div`
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  border-bottom: 2px solid ${props => props.$active ? '#007bff' : 'transparent'};
  color: ${props => props.$active ? '#007bff' : '#666'};
  font-weight: 500;
  transition: all 0.2s;
`;

const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  display: block;
  padding: 1rem;
  border: 2px dashed #ddd;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #007bff;
    color: #007bff;
  }
`;

const FileName = styled.div`
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  margin-top: 1rem;
  padding: 0.75rem;
  border: 1px solid #dc3545;
  border-radius: 4px;
  background-color: #f8d7da;
`;

const SuccessMessage = styled.div`
  color: #28a745;
  margin-top: 1rem;
  padding: 0.75rem;
  border: 1px solid #28a745;
  border-radius: 4px;
  background-color: #d4edda;
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

    if (!selectedModule || !examNumber || !studentId || !score) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    const scoreNum = parseFloat(score);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
      setError('Score must be a number between 0 and 100');
      setIsLoading(false);
      return;
    }

    try {
      const response = await uploadIndividualScore(studentId, selectedModule, parseInt(examNumber), scoreNum);
      if (response.data) {
        setSuccess('Score updated successfully');
        setStudentId('');
        setScore('');
        setSelectedModule('');
        setExamNumber('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update score');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Title>Upload Scores</Title>
      
      <TabContainer>
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
      </TabContainer>

      {isFetchingModules ? (
        <div>Loading modules...</div>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <>
          {mode === 'bulk' ? (
            <Form onSubmit={handleBulkSubmit}>
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
                      {module.name}
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
                <FileInputLabel>
                  {selectedFile ? selectedFile.name : 'Choose Excel file (.xlsx)'}
                  <FileInput
                    id="file-upload"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    required
                  />
                </FileInputLabel>
                <FileName>
                  File must contain columns: regNo, name, mark
                </FileName>
              </FormGroup>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Uploading...' : 'Upload Scores'}
              </Button>
            </Form>
          ) : (
            <Form onSubmit={handleIndividualSubmit}>
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
                      {module.name}
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
                <Label>Student ID</Label>
                <Input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="Enter student ID"
                  required
                />
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

              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Score'}
              </Button>
            </Form>
          )}
        </>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
    </Container>
  );
};

export default ScoreUpload; 