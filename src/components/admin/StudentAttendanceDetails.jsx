import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import AttendanceTable from '../shared/AttendanceTable';

const Container = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
`;

const StudentInfo = styled.div`
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
`;

const InfoRow = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 0.5rem;
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: #475569;
  min-width: 120px;
`;

const InfoValue = styled.span`
  color: #1a1a1a;
`;

const StudentAttendanceDetails = ({ studentId }) => {
  const [student, setStudent] = useState(null);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (studentId) {
      fetchStudentDetails();
      fetchAttendanceLogs();
    }
  }, [studentId]);

  const fetchStudentDetails = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.ADMIN.STUDENTS}/${studentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      setStudent(response.data.data);
    } catch (err) {
      console.error('Error fetching student details:', err);
      setError('Failed to fetch student details');
    }
  };

  const fetchAttendanceLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_ENDPOINTS.ADMIN.ATTENDANCE}/student/${studentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.data?.data) {
        const sortedLogs = response.data.data.sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        setAttendanceLogs(sortedLogs);
      } else {
        setAttendanceLogs([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching attendance logs:', err);
      setError(err.response?.data?.message || 'Failed to fetch attendance logs');
      setAttendanceLogs([]);
    } finally {
      setLoading(false);
    }
  };

  if (!studentId) {
    return <Container>Please select a student to view attendance details.</Container>;
  }

  return (
    <Container>
      <Title>Student Attendance Details</Title>
      
      {student && (
        <StudentInfo>
          <InfoRow>
            <InfoLabel>Name:</InfoLabel>
            <InfoValue>{student.name}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Roll Number:</InfoLabel>
            <InfoValue>{student.rollNumber}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Email:</InfoLabel>
            <InfoValue>{student.email}</InfoValue>
          </InfoRow>
        </StudentInfo>
      )}

      <AttendanceTable 
        attendanceLogs={attendanceLogs}
        loading={loading}
        error={error}
        showStudentName={false}
        showModuleTitle={true}
        showDate={true}
        showRemarks={true}
      />
    </Container>
  );
};

export default StudentAttendanceDetails; 