import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #374151;
`;

const Description = styled.p`
  margin-top: 1rem;
  color: #4b5563;
`;

const StudentView = () => {
  return (
    <Container>
      <Title>Student View Page</Title>
      <Description>This page will display student-specific information.</Description>
    </Container>
  );
};

export default StudentView;
