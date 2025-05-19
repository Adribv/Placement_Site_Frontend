import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getStudentModules } from '../services/api';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 2rem;
`;

const ModuleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ModuleCard = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
  }
`;

const ModuleTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
`;

const ModuleDescription = styled.p`
  color: #4b5563;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const ModuleDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
`;

const DetailLabel = styled.span`
  color: #6b7280;
`;

const DetailValue = styled.span`
  color: #111827;
  font-weight: 500;
`;

const ProgressBar = styled.div`
  height: 0.5rem;
  background-color: #e5e7eb;
  border-radius: 0.25rem;
  margin-top: 1rem;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: #3b82f6;
  width: ${props => props.progress}%;
  transition: width 0.3s ease-in-out;
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 0.875rem;
  text-align: center;
  padding: 1rem;
  background-color: #fee2e2;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
`;

const LoadingMessage = styled.div`
  color: #4b5563;
  font-size: 0.875rem;
  text-align: center;
  padding: 1rem;
`;

const Training = () => {
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getStudentModules();
        setModules(response.data.modules);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch training modules');
      } finally {
        setIsLoading(false);
      }
    };

    fetchModules();
  }, []);

  const calculateProgress = (module) => {
    if (!module.examScores || module.examScores.length === 0) return 0;
    const totalScore = module.examScores.reduce((sum, exam) => sum + exam.score, 0);
    const maxScore = module.examScores.length * 100;
    return Math.round((totalScore / maxScore) * 100);
  };

  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Title>My Training Modules</Title>
      
      {isLoading ? (
        <LoadingMessage>Loading training modules...</LoadingMessage>
      ) : modules.length === 0 ? (
        <LoadingMessage>No training modules assigned yet.</LoadingMessage>
      ) : (
        <ModuleGrid>
          {modules.map((module) => (
            <ModuleCard key={module._id}>
              <ModuleTitle>{module.title}</ModuleTitle>
              <ModuleDescription>{module.description}</ModuleDescription>
              
              <ModuleDetails>
                <DetailItem>
                  <DetailLabel>Duration:</DetailLabel>
                  <DetailValue>{module.durationDays} days</DetailValue>
                </DetailItem>
                
                <DetailItem>
                  <DetailLabel>Exams:</DetailLabel>
                  <DetailValue>{module.examsCount}</DetailValue>
                </DetailItem>
                
                <DetailItem>
                  <DetailLabel>Attendance:</DetailLabel>
                  <DetailValue>
                    {module.attendance?.length || 0} / {module.durationDays}
                  </DetailValue>
                </DetailItem>
                
                <DetailItem>
                  <DetailLabel>Average Score:</DetailLabel>
                  <DetailValue>{module.averageScore || 0}%</DetailValue>
                </DetailItem>
              </ModuleDetails>
              
              <ProgressBar>
                <ProgressFill progress={calculateProgress(module)} />
              </ProgressBar>
            </ModuleCard>
          ))}
        </ModuleGrid>
      )}
    </Container>
  );
};

export default Training; 