import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { getStudentProfile } from '../services/api';
import StudentAvatar from '../components/student/StudentAvatar';
import ProgressSummary from '../components/student/ProgressSummary';
import TrainingModulesList from '../components/student/TrainingModulesList';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
`;

const MenuButton = styled.button`
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 1001;
  background: white;
  border: none;
  cursor: pointer;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #374151;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  
  &:hover {
    color: #2563eb;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
`;

const MenuIcon = styled.div`
  width: 18px;
  height: 14px;
  position: relative;
  
  span {
    display: block;
    position: absolute;
    height: 2px;
    width: 100%;
    background: #374151;
    border-radius: 2px;
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: .25s ease-in-out;
    
    &:nth-child(1) {
      top: ${props => props.$isOpen ? '7px' : '0px'};
      transform: ${props => props.$isOpen ? 'rotate(135deg)' : 'rotate(0)'};
    }
    
    &:nth-child(2) {
      top: 7px;
      opacity: ${props => props.$isOpen ? '0' : '1'};
      transform: ${props => props.$isOpen ? 'translateX(20px)' : 'translateX(0)'};
    }
    
    &:nth-child(3) {
      top: ${props => props.$isOpen ? '7px' : '14px'};
      transform: ${props => props.$isOpen ? 'rotate(-135deg)' : 'rotate(0)'};
    }
  }
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 1rem;
  position: absolute;
  top: 60px;
  right: 1rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  min-width: 200px;
  display: ${props => props.$isOpen ? 'block' : 'none'};
  z-index: 100;
`;

const MenuItem = styled.button`
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  background: none;
  border: none;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 0.375rem;

  &:hover {
    background: #f3f4f6;
    color: #2563eb;
  }
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

// Map completed trainings to 4 levels
const getLevelFromCompleted = (numCompleted) => {
  if (numCompleted >= 12) return 4;
  if (numCompleted >= 8) return 3;
  if (numCompleted >= 4) return 2;
  return 1;
};

const StudentDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const studentData = JSON.parse(localStorage.getItem('studentData'));
      if (!studentData?._id) {
        throw new Error('Student data not found. Please login again.');
      }
      console.log("Student data from localStorage:", studentData);
      
      const profileResponse = await getStudentProfile();
      console.log("Profile response:", profileResponse.data);
      
      const { student, progress } = profileResponse.data;
      console.log("Student from API:", student);
      console.log("Student profile picture:", student.profilePicture);
      
      setStudentData(student);
      // Map progress to modules for dashboard
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
      console.error("Error fetching student data:", err);
      if (err.message === 'Student data not found. Please login again.') {
        localStorage.removeItem('studentToken');
        localStorage.removeItem('studentData');
        window.location.href = '/student/login';
      } else {
        setError(err.response?.data?.message || 'Failed to load student data. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentData');
    navigate('/student/login');
  };

  const handleLeaderboard = () => {
    navigate('/student/leaderboard');
  };

  if (loading) {
    return (
      <Container>
        <div>Loading your dashboard...</div>
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
      <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <MenuIcon $isOpen={isMenuOpen}>
          <span></span>
          <span></span>
          <span></span>
        </MenuIcon>
      </MenuButton>

      <MenuList $isOpen={isMenuOpen}>
        <MenuItem onClick={handleLeaderboard}>Leaderboard</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </MenuList>

      <DashboardHeader>
        <StudentAvatar 
          level={getLevelFromCompleted(studentData.numTrainingsCompleted || 0)}
          completedModules={studentData.numTrainingsCompleted || 0}
          profilePicture={studentData.profilePicture}
        />
        <WelcomeSection>
          <WelcomeText>Welcome back, {studentData.name}!</WelcomeText>
          <SubText>Track your progress and stay motivated on your journey to success.</SubText>
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

export default StudentDashboard; 