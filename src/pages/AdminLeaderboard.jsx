import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getStudentModules, getModuleLeaderboard } from '../services/api';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #1a1a1a;
  margin: 0;
`;

const BackButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  border: none;
  border-radius: 0.375rem;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #e5e7eb;
  }
`;

const FiltersContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  }
`;

const LeaderboardTable = styled.table`
  width: 100%;
  border-collapse: collapse;
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
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9fafb;
  }

  &:hover {
    background-color: #f3f4f6;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: #4b5563;
  border-bottom: 1px solid #e5e7eb;
`;

const RankCell = styled(TableCell)`
  font-weight: 600;
  color: #1f2937;
  width: 80px;
`;

const ScoreCell = styled(TableCell)`
  font-weight: 600;
  color: ${props => {
    if (props.$score >= 90) return '#059669';
    if (props.$score >= 80) return '#2563eb';
    if (props.$score >= 70) return '#d97706';
    return '#dc2626';
  }};
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 0.375rem;
  color: #dc2626;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
  padding: 1rem;
  background-color: #dcfce7;
  border: 1px solid #bbf7d0;
  border-radius: 0.375rem;
  color: #16a34a;
  margin-bottom: 1rem;
`;

const CurrentStudentHighlight = styled.div`
  background-color: #eff6ff;
  border: 2px solid #3b82f6;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CurrentStudentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CurrentStudentRank = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2563eb;
`;

const CurrentStudentDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const CurrentStudentName = styled.div`
  font-weight: 600;
  color: #1f2937;
`;

const CurrentStudentScore = styled.div`
  color: #4b5563;
`;

const TotalStudents = styled.div`
  text-align: right;
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const PromoteButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const PromotionModal = styled.div`
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
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  
  &:hover {
    color: #111827;
  }
`;

const BatchSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #1d4ed8;
  }

  &:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }
`;

const CheckboxCell = styled(TableCell)`
  width: 40px;
  text-align: center;
`;

const SelectAllCheckbox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: #f9fafb;
  border-radius: 0.375rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const SelectionButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.$isActive ? '#1d4ed8' : '#2563eb'};
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-right: 1rem;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const AdminLeaderboard = () => {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState('');
  const [examType, setExamType] = useState('average');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [promotionError, setPromotionError] = useState(null);
  const [promotionSuccess, setPromotionSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchModules();
  }, []);

  useEffect(() => {
    if (selectedModule) {
      fetchLeaderboardData();
    }
  }, [selectedModule, examType]);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const response = await getStudentModules();
      setModules(response.data.modules);
      if (response.data.modules.length > 0) {
        setSelectedModule(response.data.modules[0]._id);
      }
    } catch (err) {
      setError('Failed to fetch modules');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      const response = await getModuleLeaderboard(selectedModule);
      console.log(response)
      setLeaderboardData(response.data.leaderboard);
      setCurrentStudent(response.data.currentStudent);
    } catch (err) {
      setError('Failed to fetch leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  const getScoreForExamType = (student) => {
    if (examType === 'average') {
      return student.averageScore;
    }
    const examNumber = parseInt(examType.replace('exam', ''));
    const examScore = student.examScores.find(s => s.examNumber === examNumber);
    return examScore ? examScore.score : 0;
  };

  const filteredData = leaderboardData
    .filter(student => 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.regNo.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => getScoreForExamType(b) - getScoreForExamType(a));

  const selectedModuleData = modules.find(m => m._id === selectedModule);
  const examOptions = selectedModuleData ? 
    [
      { value: 'average', label: 'Average Score' },
      ...Array.from({ length: selectedModuleData.examsCount }, (_, i) => ({
        value: `exam${i + 1}`,
        label: `Exam ${i + 1}`
      }))
    ] : [];

  const handleSelectClick = () => {
    setIsSelectionMode(!isSelectionMode);
    if (!isSelectionMode) {
      setSelectedStudents([]);
    }
  };

  const handlePromoteClick = () => {
    if (selectedStudents.length === 0) {
      setPromotionError('Please select at least one student');
      return;
    }
    setShowPromotionModal(true);
    setSelectedBatch('');
    setPromotionError(null);
    setPromotionSuccess(null);
  };

  const handleClosePromotion = () => {
    setShowPromotionModal(false);
    setSelectedBatch('');
    setPromotionError(null);
    setPromotionSuccess(null);
  };

  const handlePromoteSubmit = async () => {
    try {
      if (!selectedBatch) {
        setPromotionError('Please select a batch');
        return;
      }

      await api.put('/admin/update-batch', {
        studentIds: selectedStudents,
        newBatch: selectedBatch
      });
      
      setPromotionSuccess('Students promoted successfully');
      handleClosePromotion();
      setIsSelectionMode(false);
      setSelectedStudents([]);
      
      // Refresh the leaderboard data
      await fetchLeaderboardData();
    } catch (err) {
      setPromotionError(err.response?.data?.message || 'Failed to promote students');
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

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudents(filteredData.map(student => student.studentId));
    } else {
      setSelectedStudents([]);
    }
  };

  if (loading && !selectedModule) {
    return (
      <Container>
        <LoadingMessage>Loading modules...</LoadingMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Module Leaderboard</Title>
        <ButtonGroup>
          <SelectionButton
            onClick={() => setIsSelectionMode(!isSelectionMode)}
            $isActive={isSelectionMode}
          >
            {isSelectionMode ? 'Cancel Selection' : 'Select Students'}
          </SelectionButton>
          {isSelectionMode && selectedStudents.length > 0 && (
            <PromoteButton 
              onClick={handlePromoteClick}
              disabled={selectedStudents.length === 0}
            >
              Promote Selected ({selectedStudents.length})
            </PromoteButton>
          )}
        </ButtonGroup>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <FiltersContainer>
        <Select
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value)}
        >
          {modules.map(module => (
            <option key={module._id} value={module._id}>
              {module.title}
            </option>
          ))}
        </Select>

        <Select
          value={examType}
          onChange={(e) => setExamType(e.target.value)}
        >
          {examOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <SearchInput
          type="text"
          placeholder="Search by name or registration number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </FiltersContainer>

      {currentStudent && (
        <CurrentStudentHighlight>
          <CurrentStudentInfo>
            <CurrentStudentRank>#{currentStudent.position}</CurrentStudentRank>
            <CurrentStudentDetails>
              <CurrentStudentName>{currentStudent.name}</CurrentStudentName>
              <CurrentStudentScore>
                {examType === 'average' 
                  ? `Average Score: ${currentStudent.averageScore}%`
                  : `Exam ${examType.replace('exam', '')} Score: ${
                      currentStudent.examScores.find(
                        s => s.examNumber === parseInt(examType.replace('exam', ''))
                      )?.score || 0
                    }%`
                }
              </CurrentStudentScore>
            </CurrentStudentDetails>
          </CurrentStudentInfo>
          <TotalStudents>
            Total Students: {leaderboardData.length}
          </TotalStudents>
        </CurrentStudentHighlight>
      )}

      {loading ? (
        <LoadingMessage>Loading leaderboard data...</LoadingMessage>
      ) : (
        <LeaderboardTable>
          <TableHead>
            <tr>
              {isSelectionMode && (
                <TableHeader style={{ width: '40px' }}>
                  <input
                    type="checkbox"
                    checked={selectedStudents.length === filteredData.length}
                    onChange={handleSelectAll}
                  />
                </TableHeader>
              )}
              <TableHeader>Rank</TableHeader>
              <TableHeader>Name</TableHeader>
              <TableHeader>Registration No</TableHeader>
              <TableHeader>Department</TableHeader>
              <TableHeader>Score</TableHeader>
            </tr>
          </TableHead>
          <tbody>
            {filteredData.map((student, index) => (
              <TableRow key={student.studentId}>
                {isSelectionMode && (
                  <CheckboxCell>
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.studentId)}
                      onChange={() => handleStudentSelect(student.studentId)}
                    />
                  </CheckboxCell>
                )}
                <RankCell>#{student.rank}</RankCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.regNo}</TableCell>
                <TableCell>{student.department}</TableCell>
                <ScoreCell $score={getScoreForExamType(student)}>
                  {getScoreForExamType(student)}%
                </ScoreCell>
              </TableRow>
            ))}
          </tbody>
        </LeaderboardTable>
      )}

      {showPromotionModal && (
        <PromotionModal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Promote Students</ModalTitle>
              <CloseButton onClick={handleClosePromotion}>&times;</CloseButton>
            </ModalHeader>

            <BatchSelect
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
            >
              <option value="">Select Batch</option>
              <option value="Marquee">Marquee</option>
              <option value="Super Dream">Super Dream</option>
              <option value="Dream">Dream</option>
              <option value="Service">Service</option>
              <option value="General">General</option>
            </BatchSelect>

            {promotionError && <ErrorMessage>{promotionError}</ErrorMessage>}
            {promotionSuccess && <SuccessMessage>{promotionSuccess}</SuccessMessage>}

            <SubmitButton
              onClick={handlePromoteSubmit}
              disabled={!selectedBatch}
            >
              Promote Selected Students
            </SubmitButton>
          </ModalContent>
        </PromotionModal>
      )}
    </Container>
  );
};

export default AdminLeaderboard; 