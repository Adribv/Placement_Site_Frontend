import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import StaffStudentAttendance from '../../components/staff/StaffStudentAttendance';

const Container = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #1a1a1a;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: #2563eb;
  }
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 2rem;
  color: #64748b;
`;

const ErrorText = styled.div`
  text-align: center;
  padding: 2rem;
  color: #ef4444;
`;

const StaffStudentLogs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('studentId');
    
    if (!id) {
      navigate('/staff/dashboard');
      return;
    }

    setStudentId(id);
    setLoading(false);
  }, [location.search, navigate]);

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  if (loading) {
    return <LoadingText>Loading...</LoadingText>;
  }

  return (
    <Container>
      <BackButton onClick={handleBack}>
        ← Back
      </BackButton>
      
      <Title>Student Attendance Records</Title>
      
      {studentId && (
        <StaffStudentAttendance studentId={studentId} />
      )}
    </Container>
  );
};

export default StaffStudentLogs; 