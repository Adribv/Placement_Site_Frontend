import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getAllStudents, addModule } from '../../services/api';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 32rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  padding: 0.625rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

const Select = styled.select`
  padding: 0.625rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

const TextArea = styled.textarea`
  padding: 0.625rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  min-height: 6rem;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const CancelButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms;
  background-color: white;
  border: 1px solid #d1d5db;
  color: #374151;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const SubmitButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms;
  background-color: #2563eb;
  border: none;
  color: white;

  &:hover {
    background-color: #1d4ed8;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const StudentsList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  margin-top: 0.5rem;
`;

const StudentItem = styled.div`
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

const StudentCount = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.5rem;
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
`;

const CreateModuleModal = ({ isOpen, onClose, batchName }) => {
  const [moduleData, setModuleData] = useState({
    title: '',
    description: '',
    durationDays: 1,
    examsCount: 1,
    location: '',
    isCompleted: false,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [allStudents, setAllStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    if (isOpen && batchName) {
      fetchStudentsData();
    }
  }, [isOpen, batchName]);

  const fetchStudentsData = async () => {
    try {
      setIsLoading(true);
      const response = await getAllStudents();
      const students = response.data.students;
      setAllStudents(students);
      
      // Filter students by batch
      const batchStudents = students.filter(student => student.batch === batchName);
      
      // Extract unique locations
      const uniqueLocations = [...new Set(batchStudents
        .filter(student => student.location)
        .map(student => student.location))];
      
      setLocations(uniqueLocations);
      
      // Set default location if available
      if (uniqueLocations.length > 0) {
        setModuleData(prev => ({
          ...prev,
          location: uniqueLocations[0]
        }));
        
        // Filter students by default location
        const filteredByLocation = batchStudents.filter(
          student => student.location === uniqueLocations[0]
        );
        setFilteredStudents(filteredByLocation);
        setSelectedStudents(filteredByLocation.map(student => student._id));
      } else {
        setFilteredStudents([]);
      }
    } catch (error) {
      console.error('Error fetching students data:', error);
      setError('Failed to fetch student data');
    } finally {
      setIsLoading(false);
    }
  };
  
  const filterStudentsByLocation = (location) => {
    const filtered = allStudents.filter(
      student => student.batch === batchName && student.location === location
    );
    setFilteredStudents(filtered);
    setSelectedStudents(filtered.map(student => student._id));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'location') {
      filterStudentsByLocation(value);
    }
    
    // Handle numeric inputs to prevent NaN
    if (name === 'durationDays' || name === 'examsCount') {
      const numValue = parseInt(value);
      setModuleData({
        ...moduleData,
        [name]: isNaN(numValue) ? 1 : Math.max(1, numValue),
      });
    } else {
      setModuleData({
        ...moduleData,
        [name]: value,
      });
    }
  };

  const handleStudentToggle = (studentId) => {
    setSelectedStudents(prevSelected => {
      if (prevSelected.includes(studentId)) {
        return prevSelected.filter(id => id !== studentId);
      } else {
        return [...prevSelected, studentId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate
      if (!moduleData.title.trim()) {
        setError('Title is required');
        setIsLoading(false);
        return;
      }
      
      if (!moduleData.location.trim()) {
        setError('Location is required');
        setIsLoading(false);
        return;
      }
      
      if (selectedStudents.length === 0) {
        setError('At least one student must be selected');
        setIsLoading(false);
        return;
      }
      
      const moduleToSend = {
        ...moduleData,
        studentIds: selectedStudents
      };

      await addModule(moduleToSend);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create training module');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Title>Create Training Module for {batchName}</Title>
        <p style={{ marginBottom: '1.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
          This will create a new training module for students in the {batchName} batch. 
          Students will be filtered by the selected location.
        </p>
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">Module Title</Label>
            <Input
              id="title"
              name="title"
              value={moduleData.title}
              onChange={handleChange}
              required
              placeholder="Enter module title"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="description">Description</Label>
            <TextArea
              id="description"
              name="description"
              value={moduleData.description}
              onChange={handleChange}
              required
              placeholder="Enter module description"
              rows={3}
            />
          </FormGroup>

          <TwoColumnGrid>
            <FormGroup>
              <Label htmlFor="durationDays">Duration (days)</Label>
              <Input
                id="durationDays"
                name="durationDays"
                type="number"
                min="1"
                value={moduleData.durationDays}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="examsCount">Number of Exams</Label>
              <Input
                id="examsCount"
                name="examsCount"
                type="number"
                min="1"
                value={moduleData.examsCount}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </TwoColumnGrid>

          <FormGroup>
            <Label htmlFor="location">Location</Label>
            <Select
              id="location"
              name="location"
              value={moduleData.location}
              onChange={handleChange}
              required
            >
              <option value="">Select a location</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </Select>
          </FormGroup>
          
          {moduleData.location && (
            <FormGroup>
              <Label>Students in this location ({filteredStudents.length})</Label>
              <StudentsList>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map(student => (
                    <StudentItem key={student._id}>
                      <Checkbox
                        type="checkbox"
                        checked={selectedStudents.includes(student._id)}
                        onChange={() => handleStudentToggle(student._id)}
                        id={`student-${student._id}`}
                      />
                      <label htmlFor={`student-${student._id}`}>
                        {student.name} ({student.regNo})
                      </label>
                    </StudentItem>
                  ))
                ) : (
                  <StudentItem>No students found in this location</StudentItem>
                )}
              </StudentsList>
              <StudentCount>
                Selected: {selectedStudents.length} of {filteredStudents.length} students
              </StudentCount>
            </FormGroup>
          )}

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <ButtonGroup>
            <CancelButton type="button" onClick={onClose}>
              Cancel
            </CancelButton>
            <SubmitButton type="submit" disabled={isLoading || selectedStudents.length === 0}>
              {isLoading ? 'Creating...' : 'Create Module'}
            </SubmitButton>
          </ButtonGroup>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CreateModuleModal; 