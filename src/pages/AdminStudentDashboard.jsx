import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { getStudentDetails } from '../services/api';
import StudentAvatar from '../components/student/StudentAvatar';
import ProgressSummary from '../components/student/ProgressSummary';
import TrainingModulesList from '../components/student/TrainingModulesList';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const DashboardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const WelcomeSection = styled.div`
  flex: 1;
`;

const WelcomeText = styled.h1`
  font-size: 2rem;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
`;

const SubText = styled.p`
  color: #666;
  font-size: 1.1rem;
`;

const AdminStudentDashboard = () => {
  const { studentId } = useParams();
  const [studentData, setStudentData] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudentData();
    // eslint-disable-next-line
  }, [studentId]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const response = await getStudentDetails(studentId);
      const { student, progress } = response;
      setStudentData(student);
      setModules(progress.map(p => ({
        _id: p.training._id,
        title: p.training.title,
        isCompleted: p.training.isCompleted,
        examScores: p.examScores || [],
        attendance: p.attendance || [],
        averageScore: p.averageScore ?? 0
      })));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load student data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <div>Loading student dashboard...</div>
      </Container>
    );
  }
  if (error) {
    return (
      <Container>
        <div style={{ color: 'red' }}>{error}</div>
      </Container>
    );
  }
  if (!studentData) {
    return (
      <Container>
        <div>No student data found.</div>
      </Container>
    );
  }

  return (
    <Container>
      <DashboardHeader>
        <StudentAvatar 
          level={getLevelFromCompleted(studentData.numTrainingsCompleted || 0)}
          completedModules={studentData.numTrainingsCompleted || 0}
        />
        <WelcomeSection>
          <WelcomeText>{studentData.name} ({studentData.regNo})</WelcomeText>
          <SubText>Batch: {studentData.batch} | Passout Year: {studentData.passoutYear} | Department: {studentData.department}</SubText>
        </WelcomeSection>
      </DashboardHeader>
      <ProgressSummary 
        totalModules={modules.length}
        completedModules={modules.filter(m => m.isCompleted).length}
        averageScore={calculateAverageScore(modules)}
        attendancePercentage={calculateAttendancePercentage(modules)}
        placementCategory={studentData.batch}
      />
      <TrainingModulesList 
        modules={modules}
      />
    </Container>
  );
};

// Helper functions
const getLevelFromCompleted = (numCompleted) => {
  if (numCompleted >= 12) return 4;
  if (numCompleted >= 8) return 3;
  if (numCompleted >= 4) return 2;
  return 1;
};
const calculateAverageScore = (modules) => {
  const modulesWithScores = modules.filter(m => m.averageScore !== null && m.averageScore !== undefined);
  if (modulesWithScores.length === 0) return 0;
  const totalScore = modulesWithScores.reduce((sum, module) => sum + module.averageScore, 0);
  return Math.round(totalScore / modulesWithScores.length);
};
const calculateAttendancePercentage = (modules) => {
  const totalDays = modules.reduce((sum, module) => sum + (module.attendance?.length || 0), 0);
  const presentDays = modules.reduce((sum, module) => sum + (module.attendance?.filter(a => a.present).length || 0), 0);
  if (totalDays === 0) return 0;
  return Math.round((presentDays / totalDays) * 100);
};

export default AdminStudentDashboard; 