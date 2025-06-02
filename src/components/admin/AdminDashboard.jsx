import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import StudentAttendanceDetails from './StudentAttendanceDetails';

const Container = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #1a1a1a;
  margin-bottom: 2rem;
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
`;

const StudentList = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StudentItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }

  ${props => props.selected && `
    background-color: #f1f5f9;
    border-left: 4px solid #3b82f6;
  `}
`;

const StudentName = styled.div`
  font-weight: 600;
  color: #1a1a1a;
`;

const StudentRoll = styled.div`
  font-size: 0.875rem;
  color: #64748b;
`;

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.ADMIN.STUDENTS, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      setStudents(response.data.students);
      setError(null);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Admin Dashboard</Title>
      <ContentContainer>
        <StudentList>
          {loading ? (
            <div>Loading students...</div>
          ) : error ? (
            <div style={{ color: 'red' }}>{error}</div>
          ) : (
            students.map(student => (
              <StudentItem
                key={student._id}
                selected={selectedStudentId === student._id}
                onClick={() => setSelectedStudentId(student._id)}
              >
                <StudentName>{student.name}</StudentName>
                <StudentRoll>{student.rollNumber}</StudentRoll>
              </StudentItem>
            ))
          )}
        </StudentList>
        {selectedStudentId && (
          <StudentAttendanceDetails studentId={selectedStudentId} />
        )}
      </ContentContainer>
    </Container>
  );
};

export default AdminDashboard; 