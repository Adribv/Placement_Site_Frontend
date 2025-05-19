import React, { useState } from 'react';
import styled from 'styled-components';
import { deleteStudent, getStudentModulePerformance } from '../../services/api';

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
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #4b5563;
  
  &:hover {
    color: #1f2937;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1.5rem;
`;

const DetailGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const DetailLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.div`
  font-size: 1rem;
  color: #111827;
`;

const TrainingsContainer = styled.div`
  margin-top: 2rem;
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
`;

const TrainingCard = styled.div`
  background-color: #f3f4f6;
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
`;

const TrainingTitle = styled.div`
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 0.5rem;
  background-color: #e5e7eb;
  border-radius: 0.25rem;
  margin-top: 0.5rem;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: ${props => props.$percentage >= 75 ? '#059669' : props.$percentage >= 60 ? '#d97706' : '#dc2626'};
  width: ${props => props.$percentage}%;
`;

const ExternalLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const ExternalLink = styled.a`
  color: #2563eb;
  text-decoration: none;
  font-size: 0.875rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ExamScores = styled.div`
  margin-top: 1rem;
`;

const ExamScore = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background-color: white;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ExamLabel = styled.span`
  font-size: 0.875rem;
  color: #4b5563;
`;

const ExamValue = styled.span`
  font-weight: 500;
  color: ${props => props.$score >= 75 ? '#059669' : props.$score >= 60 ? '#d97706' : '#dc2626'};
`;

const DeleteButton = styled.button`
  background-color: #dc2626;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 150ms ease-in-out;
  margin-top: 1rem;

  &:hover {
    background-color: #b91c1c;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.5);
  }
`;

const ConfirmDialog = styled.div`
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

const ConfirmBox = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  max-width: 400px;
  width: 90%;
`;

const ConfirmTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #111827;
`;

const ConfirmMessage = styled.p`
  margin-bottom: 1.5rem;
  color: #4b5563;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const CancelButton = styled.button`
  background-color: #f3f4f6;
  color: #374151;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 150ms ease-in-out;

  &:hover {
    background-color: #e5e7eb;
  }
`;

const ConfirmDeleteButton = styled(DeleteButton)`
  margin-top: 0;
`;

const ViewDetailsButton = styled.button`
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 1.25rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 2px 0 rgba(37, 99, 235, 0.08);

  &:hover {
    background-color: #1d4ed8;
    box-shadow: 0 2px 8px 0 rgba(37, 99, 235, 0.12);
  }

  &:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }
`;

const AttendanceList = styled.div`
  margin-top: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  overflow: hidden;
`;

const AttendanceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: white;
  font-size: 0.875rem;

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

const StudentDetailsModal = ({ student, onClose, onDelete }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [detailedModule, setDetailedModule] = useState(null);
  const [detailedLoading, setDetailedLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      await deleteStudent(student._id);
      setShowConfirmDialog(false);
      onDelete(student._id);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete student');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShowModuleDetails = async (moduleId) => {
    if (!moduleId) {
      setError('Module ID is missing or invalid.');
      return;
    }
    try {
      setDetailedLoading(true);
      setError(null);
      const data = await getStudentModulePerformance(student._id, moduleId);
      setDetailedModule(data);
    } catch (err) {
      setError('Failed to fetch module details');
    } finally {
      setDetailedLoading(false);
    }
  };

  const handleCloseModuleDetails = () => {
    setDetailedModule(null);
  };

  if (!student) return null;

  // Normalize trainings to always have a moduleIdStr property
  const normalizedTrainings = (student.trainings || []).map(training => {
    let moduleIdStr = '';
    if (typeof training.moduleId === 'string') {
      moduleIdStr = training.moduleId;
    } else if (training.moduleId && training.moduleId._id) {
      moduleIdStr = training.moduleId._id;
    }
    return { ...training, moduleIdStr };
  });

  return (
    <>
      <ModalOverlay onClick={onClose}>
        <ModalContent onClick={e => e.stopPropagation()}>
          <CloseButton onClick={onClose}>&times;</CloseButton>
          <Title>Student Details</Title>

          <DetailGroup>
            <DetailLabel>Name</DetailLabel>
            <DetailValue>{student.name}</DetailValue>
          </DetailGroup>

          <DetailGroup>
            <DetailLabel>Registration Number</DetailLabel>
            <DetailValue>{student.regNo}</DetailValue>
          </DetailGroup>

          <DetailGroup>
            <DetailLabel>Email</DetailLabel>
            <DetailValue>{student.email}</DetailValue>
          </DetailGroup>

          <DetailGroup>
            <DetailLabel>Batch</DetailLabel>
            <DetailValue>{student.batch}</DetailValue>
          </DetailGroup>

          <DetailGroup>
            <DetailLabel>Passout Year</DetailLabel>
            <DetailValue>{student.passoutYear}</DetailValue>
          </DetailGroup>

          <DetailGroup>
            <DetailLabel>Department</DetailLabel>
            <DetailValue>{student.department}</DetailValue>
          </DetailGroup>

          <ExternalLinks>
            {student.codechefId && (
              <ExternalLink 
                href={`https://www.codechef.com/users/${student.codechefId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                CodeChef Profile
              </ExternalLink>
            )}
            {student.leetcodeId && (
              <ExternalLink 
                href={`https://leetcode.com/${student.leetcodeId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                LeetCode Profile
              </ExternalLink>
            )}
          </ExternalLinks>

          <TrainingsContainer>
            <Title>Training Modules ({normalizedTrainings.length} trainings)</Title>
            {normalizedTrainings.length > 0 ? (
              normalizedTrainings.map((training, index) => (
                <TrainingCard key={index}>
                  <TrainingTitle>{training.moduleId?.title || 'Untitled Module'}</TrainingTitle>
                  <DetailGroup>
                    <DetailLabel>Status</DetailLabel>
                    <DetailValue>
                      {training.progress?.isCompleted ? 'Completed' : 'In Progress'}
                    </DetailValue>
                  </DetailGroup>
                  {training.progress?.score !== undefined && (
                    <DetailGroup>
                      <DetailLabel>Score</DetailLabel>
                      <DetailValue>{training.progress?.score ?? 'NA'}%</DetailValue>
                      <ProgressBar>
                        <ProgressFill $percentage={training.progress?.score ?? 0} />
                      </ProgressBar>
                    </DetailGroup>
                  )}
                  {training.progress?.attendance !== undefined && (
                    <DetailGroup>
                      <DetailLabel>Attendance</DetailLabel>
                      <DetailValue>{training.progress?.attendance ?? 'NA'}%</DetailValue>
                      <ProgressBar>
                        <ProgressFill $percentage={training.progress?.attendance ?? 0} />
                      </ProgressBar>
                    </DetailGroup>
                  )}
                  {training.progress?.examScores && training.progress.examScores.length > 0 && (
                    <DetailGroup>
                      <DetailLabel>Exam Scores</DetailLabel>
                      <ExamScores>
                        {training.progress.examScores.map((exam, examIndex) => (
                          <ExamScore key={examIndex}>
                            <ExamLabel>Exam {exam.exam}</ExamLabel>
                            <ExamValue $score={exam.score}>{exam.score}%</ExamValue>
                          </ExamScore>
                        ))}
                      </ExamScores>
                    </DetailGroup>
                  )}
                  <DetailGroup>
                    <ViewDetailsButton
                      onClick={() => handleShowModuleDetails(training.moduleIdStr)}
                      disabled={detailedLoading || !training.moduleIdStr}
                    >
                      {detailedLoading ? 'Loading...' : 'View Full Module Details'}
                    </ViewDetailsButton>
                  </DetailGroup>
                </TrainingCard>
              ))
            ) : (
              <DetailValue style={{ textAlign: 'center', color: '#6b7280' }}>
                No training modules attended yet
              </DetailValue>
            )}
          </TrainingsContainer>

          <DeleteButton onClick={() => setShowConfirmDialog(true)}>
            Delete Student
          </DeleteButton>
        </ModalContent>
      </ModalOverlay>

      {showConfirmDialog && (
        <ConfirmDialog>
          <ConfirmBox>
            <ConfirmTitle>Confirm Delete</ConfirmTitle>
            <ConfirmMessage>
              Are you sure you want to delete {student.name}? This action cannot be undone.
            </ConfirmMessage>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <ButtonGroup>
              <CancelButton 
                onClick={() => setShowConfirmDialog(false)}
                disabled={isDeleting}
              >
                Cancel
              </CancelButton>
              <ConfirmDeleteButton 
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </ConfirmDeleteButton>
            </ButtonGroup>
          </ConfirmBox>
        </ConfirmDialog>
      )}

      {detailedModule && (
        <ModalOverlay onClick={handleCloseModuleDetails}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <CloseButton onClick={handleCloseModuleDetails}>&times;</CloseButton>
            <Title>Module Details: {detailedModule.data.module.title}</Title>
            <DetailGroup>
              <DetailLabel>Description</DetailLabel>
              <DetailValue>{detailedModule.data.module.description}</DetailValue>
            </DetailGroup>
            <DetailGroup>
              <DetailLabel>Duration</DetailLabel>
              <DetailValue>{detailedModule.data.module.durationDays} days</DetailValue>
            </DetailGroup>
            <DetailGroup>
              <DetailLabel>Total Exams</DetailLabel>
              <DetailValue>{detailedModule.data.module.examsCount}</DetailValue>
            </DetailGroup>
            <DetailGroup>
              <DetailLabel>Average Score</DetailLabel>
              <DetailValue>{detailedModule.data.performance.averageScore}%</DetailValue>
            </DetailGroup>
            <DetailGroup>
              <DetailLabel>Attendance</DetailLabel>
              <DetailValue>{detailedModule.data.performance.attendance.percentage}%</DetailValue>
              <AttendanceList>
                {detailedModule.data.performance.attendance.details?.map((record, index) => (
                  <AttendanceItem key={index}>
                    <AttendanceDate>{new Date(record.date).toLocaleDateString()}</AttendanceDate>
                    <AttendanceStatus present={record.present}>
                      {record.present ? 'Present' : 'Absent'}
                    </AttendanceStatus>
                  </AttendanceItem>
                ))}
              </AttendanceList>
            </DetailGroup>
            <DetailGroup>
              <DetailLabel>Exam Scores</DetailLabel>
              <ExamScores>
                {detailedModule.data.performance.examScores.map((exam, idx) => (
                  <ExamScore key={idx}>
                    <ExamLabel>Exam {exam.exam}</ExamLabel>
                    <ExamValue $score={exam.score}>{exam.score}%</ExamValue>
                  </ExamScore>
                ))}
              </ExamScores>
            </DetailGroup>
            <DetailGroup>
              <DetailLabel>Last Updated</DetailLabel>
              <DetailValue>{new Date(detailedModule.data.performance.lastUpdated).toLocaleString()}</DetailValue>
            </DetailGroup>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default StudentDetailsModal; 