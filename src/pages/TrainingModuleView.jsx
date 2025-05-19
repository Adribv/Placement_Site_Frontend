import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { getModuleDetails, getStudentsByModule, updateAttendance, updateStudentsBatch } from '../services/api';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f9fafb;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #1a1a1a;
  margin: 0;
`;

const BackButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #f3f4f6;
  border: none;
  border-radius: 0.375rem;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #e5e7eb;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.$primary ? '#2563eb' : '#f3f4f6'};
  color: ${props => props.$primary ? 'white' : '#374151'};
  border: 1px solid ${props => props.$primary ? '#2563eb' : '#d1d5db'};
  border-radius: 0.375rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 150px;
  justify-content: center;

  &:hover {
    background-color: ${props => props.$primary ? '#1d4ed8' : '#e5e7eb'};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const StudentsTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background-color: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const TableHead = styled.thead`
  background-color: #f9fafb;
`;

const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
`;

const TableRow = styled.tr`
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9fafb;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #e5e7eb;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: #4b5563;
`;

const CheckboxCell = styled(TableCell)`
  width: 50px;
  text-align: center;
`;

const Checkbox = styled.input`
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #d1d5db;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;

  &:checked {
    background-color: #2563eb;
    border-color: #2563eb;
  }

  &:hover {
    border-color: #2563eb;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  font-size: 1.125rem;
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 0.375rem;
  color: #dc2626;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

const SuccessMessage = styled.div`
  padding: 1rem;
  background-color: #dcfce7;
  border: 1px solid #bbf7d0;
  border-radius: 0.375rem;
  color: #16a34a;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

const BatchSelect = styled.select`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  color: #374151;
  font-size: 0.875rem;
  min-width: 200px;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  }
`;

const SelectAllContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #374151;
`;

const TrainingModuleView = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [moduleDetails, setModuleDetails] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showAttendance, setShowAttendance] = useState(false);
  const [showPromote, setShowPromote] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');

  const batchOptions = [
    '2024',
    '2025',
    '2026',
    '2027',
    '2028'
  ];

  useEffect(() => {
    fetchModuleDetails();
  }, [moduleId]);

  const fetchModuleDetails = async () => {
    try {
      setLoading(true);
      const response = await getModuleDetails(moduleId);
      setModuleDetails(response.data);
      await fetchStudents();
    } catch (err) {
      setError('Failed to fetch module details');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await getStudentsByModule(moduleId);
      setStudents(response.data);
    } catch (err) {
      setError('Failed to fetch students');
    }
  };

  const handleAttendanceSubmit = async () => {
    try {
      const attendanceData = students.map(student => ({
        studentId: student._id,
        present: selectedStudents.includes(student._id)
      }));

      await updateAttendance(moduleId, attendanceData);
      setSuccess('Attendance updated successfully');
      setShowAttendance(false);
      setSelectedStudents([]);
      await fetchStudents();
    } catch (err) {
      setError('Failed to update attendance');
    }
  };

  const handlePromoteSubmit = async () => {
    try {
      if (selectedStudents.length === 0) {
        setError('Please select at least one student');
        return;
      }

      if (!selectedBatch) {
        setError('Please select a batch');
        return;
      }

      await updateStudentsBatch(selectedStudents, selectedBatch);
      setSuccess('Students promoted successfully');
      setShowPromote(false);
      setSelectedStudents([]);
      setSelectedBatch('');
      await fetchStudents();
    } catch (err) {
      setError('Failed to promote students');
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudents(students.map(student => student._id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleStudentSelect = (studentId) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  if (loading) {
    return (
      <Container>
        <LoadingMessage>Loading module details...</LoadingMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>{moduleDetails?.title || 'Module Details'}</Title>
        <BackButton onClick={() => navigate('/admin/dashboard')}>
          Back to Dashboard
        </BackButton>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <ActionButtons>
        <ActionButton
          $primary={showAttendance}
          onClick={() => {
            setShowAttendance(!showAttendance);
            setShowPromote(false);
            setSelectedStudents([]);
          }}
        >
          {showAttendance ? 'Cancel Attendance' : 'Mark Attendance'}
        </ActionButton>
        <ActionButton
          $primary={showPromote}
          onClick={() => {
            setShowPromote(!showPromote);
            setShowAttendance(false);
            setSelectedStudents([]);
          }}
        >
          {showPromote ? 'Cancel Promotion' : 'Promote Students'}
        </ActionButton>
      </ActionButtons>

      {(showAttendance || showPromote) && (
        <SelectAllContainer>
          <Checkbox
            type="checkbox"
            checked={selectedStudents.length === students.length}
            onChange={handleSelectAll}
          />
          <span>Select All Students</span>
        </SelectAllContainer>
      )}

      {showPromote && (
        <ActionButtons>
          <BatchSelect
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
          >
            <option value="">Select Batch</option>
            {batchOptions.map(batch => (
              <option key={batch} value={batch}>{batch}</option>
            ))}
          </BatchSelect>
          <ActionButton
            $primary
            onClick={handlePromoteSubmit}
            disabled={selectedStudents.length === 0 || !selectedBatch}
          >
            Promote Selected Students
          </ActionButton>
        </ActionButtons>
      )}

      {showAttendance && (
        <ActionButtons>
          <ActionButton
            $primary
            onClick={handleAttendanceSubmit}
            disabled={selectedStudents.length === 0}
          >
            Submit Attendance
          </ActionButton>
        </ActionButtons>
      )}

      <StudentsTable>
        <TableHead>
          <tr>
            {(showAttendance || showPromote) && <TableHeader>Select</TableHeader>}
            <TableHeader>Name</TableHeader>
            <TableHeader>Registration No</TableHeader>
            <TableHeader>Department</TableHeader>
            <TableHeader>Batch</TableHeader>
            <TableHeader>Attendance</TableHeader>
          </tr>
        </TableHead>
        <tbody>
          {students.map(student => (
            <TableRow key={student._id}>
              {(showAttendance || showPromote) && (
                <CheckboxCell>
                  <Checkbox
                    type="checkbox"
                    checked={selectedStudents.includes(student._id)}
                    onChange={() => handleStudentSelect(student._id)}
                  />
                </CheckboxCell>
              )}
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.regNo}</TableCell>
              <TableCell>{student.department}</TableCell>
              <TableCell>{student.batch}</TableCell>
              <TableCell>{student.attendance}%</TableCell>
            </TableRow>
          ))}
        </tbody>
      </StudentsTable>
    </Container>
  );
};

export default TrainingModuleView; 