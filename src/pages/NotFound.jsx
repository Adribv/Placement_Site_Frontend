import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
`;

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: #374151;
`;

const NotFound = () => {
  return (
    <Container>
      <Title>404 - Page Not Found</Title>
    </Container>
  );
};

export default NotFound;
