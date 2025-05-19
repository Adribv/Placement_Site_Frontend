import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 1rem;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #1a1a1a;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;

  &:hover {
    color: #1a1a1a;
  }
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  color: #1a1a1a;
  margin-bottom: 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const StatCard = styled.div`
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  padding: 1rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.25rem;
`;

const StatValue = styled.div`
  font-size: 1.25rem;
  color: #1a1a1a;
  font-weight: 500;
`;

const ScoreValue = styled.span`
  color: ${props => {
    if (props.score === null) return '#6b7280';
    if (props.score >= 80) return '#166534';
    if (props.score >= 60) return '#92400e';
    return '#991b1b';
  }};
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #666;
  padding: 2rem;
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  text-align: center;
  padding: 2rem;
`;

const AttendanceList = styled.div`
  margin-top: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  overflow: hidden;
`;

const AttendanceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: white;

  &:last-child {
    border-bottom: none;
  }
`;

const AttendanceDate = styled.span`
  color: #374151;
  font-weight: 500;
`;

const AttendanceStatus = styled.span`
  color: ${props => props.present ? '#059669' : '#dc2626'};
  font-weight: 500;
`;

const ModuleDetailsModal = ({ module, details, onClose, loading, error }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <ModalOverlay>
        <ModalContent>
          <LoadingMessage>Loading module details...</LoadingMessage>
        </ModalContent>
      </ModalOverlay>
    );
  }

  if (error) {
    return (
      <ModalOverlay>
        <ModalContent>
          <ErrorMessage>{error}</ErrorMessage>
        </ModalContent>
      </ModalOverlay>
    );
  }

  if (!details) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <Title>{module.title}</Title>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        <Section>
          <SectionTitle>Module Overview</SectionTitle>
          <Grid>
            <StatCard>
              <StatLabel>Duration</StatLabel>
              <StatValue>{details.module.durationDays} days</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Total Exams</StatLabel>
              <StatValue>{details.module.examsCount}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Average Score</StatLabel>
              <StatValue>
                <ScoreValue score={details.performance.averageScore}>
                  {details.performance.averageScore || 0}%
                </ScoreValue>
              </StatValue>
            </StatCard>
          </Grid>
        </Section>

        <Section>
          <SectionTitle>Attendance</SectionTitle>
          <Grid>
            <StatCard>
              <StatLabel>Attendance Rate</StatLabel>
              <StatValue>{details.performance.attendance.percentage}%</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Present Days</StatLabel>
              <StatValue>
                {details.performance.attendance.presentDays} / {details.performance.attendance.totalDays}
              </StatValue>
            </StatCard>
          </Grid>
          <AttendanceList>
            {details.performance.attendance.details?.map((record, index) => (
              <AttendanceItem key={index}>
                <AttendanceDate>{new Date(record.date).toLocaleDateString()}</AttendanceDate>
                <AttendanceStatus present={record.present}>
                  {record.present ? 'Present' : 'Absent'}
                </AttendanceStatus>
              </AttendanceItem>
            ))}
          </AttendanceList>
        </Section>

        <Section>
          <SectionTitle>Exam Scores</SectionTitle>
          <Grid>
            {details.performance.examScores.map((score, index) => (
              <StatCard key={index}>
                <StatLabel>Exam {score.exam}</StatLabel>
                <StatValue>
                  <ScoreValue score={score.score}>
                    {score.score !== null ? `${score.score}%` : 'NA'}
                  </ScoreValue>
                </StatValue>
              </StatCard>
            ))}
          </Grid>
        </Section>

        <Section>
          <SectionTitle>Last Updated</SectionTitle>
          <StatCard>
            <StatValue>{formatDate(details.performance.lastUpdated)}</StatValue>
          </StatCard>
        </Section>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ModuleDetailsModal; 