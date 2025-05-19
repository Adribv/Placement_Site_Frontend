import React, { useState } from 'react';
import styled from 'styled-components';
import { bulkRegisterStudents, registerStudent } from '../../services/api';

const Container = styled.div`
  padding: 1.5rem;
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  max-width: 48rem;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #111827;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  border: 1px dashed #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 150ms;

  &:hover {
    background-color: #e5e7eb;
  }
`;

const FileName = styled.span`
  font-size: 0.875rem;
  color: #374151;
`;

const Button = styled.button`
  padding: 0.625rem 1.25rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 150ms;

  &:hover {
    background-color: #1d4ed8;
  }

  &:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const SuccessMessage = styled.div`
  color: #059669;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ModeTab = styled.button`
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  cursor: pointer;
  transition: all 200ms;
  background-color: ${props => props.$active ? '#2563eb' : '#f3f4f6'};
  color: ${props => props.$active ? 'white' : '#374151'};
  border: 1px solid ${props => props.$active ? '#2563eb' : '#d1d5db'};
  font-weight: 500;
  font-size: 0.875rem;

  &:hover {
    background-color: ${props => props.$active ? '#1d4ed8' : '#e5e7eb'};
  }

  &:first-child {
    border-top-left-radius: 0.375rem;
    border-bottom-left-radius: 0.375rem;
  }

  &:last-child {
    border-top-right-radius: 0.375rem;
    border-bottom-right-radius: 0.375rem;
  }
`;

const ModeTabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const batchTypes = ['Marquee', 'Super Dream', 'Dream', 'Service', 'General'];
const departmentOptions = ['CSE', 'IT', 'MECH', 'EEE', 'ECE', 'BIOTECH', 'CIVIL'];

const BulkUpload = () => {
  const [mode, setMode] = useState('bulk'); // 'bulk' or 'individual'
  const [selectedFile, setSelectedFile] = useState(null);
  const [batch, setBatch] = useState('');
  const [passoutYear, setPassoutYear] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [individualForm, setIndividualForm] = useState({
    name: '',
    regNo: '',
    email: '',
    batch: '',
    passoutYear: '',
    department: '',
    location: ''
  });
  const [formData, setFormData] = useState({
    batch: 'General',
    passoutYear: new Date().getFullYear() + 4,
    department: 'CSE',
    location: '',
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.name.match(/\.(xlsx|xls)$/)) {
      setError('Please upload only Excel files (.xlsx or .xls)');
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
    setError('');
  };

  const handleIndividualInputChange = (e) => {
    const { name, value } = e.target;
    setIndividualForm(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedFile) {
      setError('Please select an Excel file');
      return;
    }

    if (!batch) {
      setError('Please select a batch');
      return;
    }

    if (!passoutYear) {
      setError('Please enter passout year');
      return;
    }

    if (!department) {
      setError('Please select a department');
      return;
    }

    try {
      setIsLoading(true);
      console.log(department)
      await bulkRegisterStudents(selectedFile, batch, passoutYear, department, formData.location);
      setSuccess('Students registered successfully');
      // Reset form
      setSelectedFile(null);
      setBatch('');
      setPassoutYear('');
      setDepartment('');
      // Reset file input
      const fileInput = document.getElementById('excel-file');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register students');
    } finally {
      setIsLoading(false);
    }
  };

  const handleIndividualSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate all fields
    if (!individualForm.name || !individualForm.regNo || !individualForm.email || 
        !individualForm.batch || !individualForm.passoutYear || !individualForm.department) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      await registerStudent(individualForm);
      setSuccess('Student registered successfully');
      // Reset form
      setIndividualForm({
        name: '',
        regNo: '',
        email: '',
        batch: '',
        passoutYear: '',
        department: '',
        location: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register student');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Title>Student Registration</Title>
      
      <ModeTabsContainer>
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
      </ModeTabsContainer>

      {mode === 'bulk' ? (
        <Form onSubmit={handleBulkSubmit}>
          <FormGroup>
            <Label>Excel File</Label>
            <FileInputLabel>
              <FileInput
                type="file"
                id="excel-file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
              />
              <span>Choose file</span>
              {selectedFile && <FileName>{selectedFile.name}</FileName>}
            </FileInputLabel>
          </FormGroup>

          <FormGroup>
            <Label>Batch</Label>
            <Select
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
            >
              <option value="">Select Batch</option>
              {batchTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Department</Label>
            <Select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="">Select Department</option>
              {departmentOptions.map((dep) => (
                <option key={dep} value={dep}>
                  {dep}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Passout Year</Label>
            <Select
              value={passoutYear}
              onChange={(e) => setPassoutYear(e.target.value)}
            >
              <option value="">Select Year</option>
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              required
            />
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Uploading...' : 'Upload'}
          </Button>
        </Form>
      ) : (
        <Form onSubmit={handleIndividualSubmit}>
          <FormGrid>
            <FormGroup>
              <Label>Name</Label>
              <Input
                type="text"
                name="name"
                value={individualForm.name}
                onChange={handleIndividualInputChange}
                placeholder="Enter student name"
              />
            </FormGroup>

            <FormGroup>
              <Label>Registration Number</Label>
              <Input
                type="text"
                name="regNo"
                value={individualForm.regNo}
                onChange={handleIndividualInputChange}
                placeholder="Enter registration number"
              />
            </FormGroup>

            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={individualForm.email}
                onChange={handleIndividualInputChange}
                placeholder="Enter email address"
              />
            </FormGroup>

            <FormGroup>
              <Label>Batch</Label>
              <Select
                name="batch"
                value={individualForm.batch}
                onChange={handleIndividualInputChange}
              >
                <option value="">Select Batch</option>
                {batchTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Department</Label>
              <Select
                name="department"
                value={individualForm.department}
                onChange={handleIndividualInputChange}
              >
                <option value="">Select Department</option>
                {departmentOptions.map((dep) => (
                  <option key={dep} value={dep}>
                    {dep}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Passout Year</Label>
              <Select
                name="passoutYear"
                value={individualForm.passoutYear}
                onChange={handleIndividualInputChange}
              >
                <option value="">Select Year</option>
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                value={individualForm.location}
                onChange={handleIndividualInputChange}
                placeholder="Enter location"
              />
            </FormGroup>
          </FormGrid>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register Student'}
          </Button>
        </Form>
      )}
    </Container>
  );
};

export default BulkUpload;