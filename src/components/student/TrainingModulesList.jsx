import React, { useState } from 'react';
import styled from 'styled-components';
import { getStudentModuleDetails } from '../../services/api';
import ModuleDetailsModal from './ModuleDetailsModal';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  margin-top: 2rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
`;

const ModulesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ModuleCard = styled.div`
  background-color: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const ModuleTitle = styled.h3`
  font-size: 1.25rem;
  color: #1a1a1a;
  margin-bottom: 1rem;
`;

const ProgressSection = styled.div`
  margin-bottom: 1rem;
`;

const ProgressLabel = styled.div`
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.5rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 0.5rem;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
  margin-top: 0.5rem;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: ${props => {
    const percentage = props.$progress;
    if (percentage >= 90) return '#059669';
    if (percentage >= 80) return '#2563eb';
    if (percentage >= 70) return '#d97706';
    return '#dc2626';
  }};
  width: ${props => props.$progress}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
  text-align: right;
`;

const ScoreSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

const ScoreLabel = styled.div`
  font-size: 0.875rem;
  color: #4b5563;
`;

const ScoreValue = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
`;

const StatusBadge = styled.div`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => props.$completed ? '#dcfce7' : '#fef3c7'};
  color: ${props => props.$completed ? '#059669' : '#d97706'};
`;

const ModuleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const TrainingModulesList = ({ modules }) => {
  console.log("hello: ",modules)
  const [selectedModule, setSelectedModule] = useState(null);
  const [moduleDetails, setModuleDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleModuleClick = async (module) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getStudentModuleDetails(module._id);
      setModuleDetails(response.data.data);
      setSelectedModule(module);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load module details');
    } finally {
      setLoading(false);
    }
  };

  const calculateAttendanceProgress = (module) => {
    console.log(module)
    if (!module.attendance || !module.attendance.length) return 0;
    const totalDays = module.durationDays || 10;
    if (totalDays === 0) return 0;
    const attendanceCount = module.attendance.length;
    return Math.round((attendanceCount / totalDays) * 100);
  };

  const calculateAverageScore = (module) => {
    if (!module.examScores || !module.examScores.length) return 0;
    const sum = module.examScores.reduce((acc, score) => acc + score.score, 0);
    return Math.round(sum / module.examScores.length);
  };

  return (
    <Container>
      <Title>Your Training Modules</Title>
      <ModulesGrid>
        {modules.map((module) => {
          const attendanceProgress = calculateAttendanceProgress(module);
          const averageScore = calculateAverageScore(module);
          
          return (
            <ModuleCard 
              key={module._id}
              onClick={() => handleModuleClick(module)}
            >
              <ModuleHeader>
                <ModuleTitle>{module.title}</ModuleTitle>
                <StatusBadge $completed={module.isCompleted}>
                  {module.isCompleted ? 'Completed' : 'In Progress'}
                </StatusBadge>
              </ModuleHeader>
              <ProgressSection>
                <ProgressLabel>Attendance Progress</ProgressLabel>
                <ProgressBar>
                  <ProgressFill $progress={attendanceProgress} />
                </ProgressBar>
                <ProgressText>{attendanceProgress}% ({module.attendance?.length || 0}/{module.durationDays || 0} days)</ProgressText>
              </ProgressSection>
              <ScoreSection>
                <ScoreLabel>Average Score</ScoreLabel>
                <ScoreValue>{averageScore ?? 'NA'}</ScoreValue>
              </ScoreSection>
            </ModuleCard>
          );
        })}
      </ModulesGrid>

      {selectedModule && (
        <ModuleDetailsModal
          module={selectedModule}
          details={moduleDetails}
          onClose={() => {
            setSelectedModule(null);
            setModuleDetails(null);
          }}
          loading={loading}
          error={error}
        />
      )}
    </Container>
  );
};

export default TrainingModulesList; 