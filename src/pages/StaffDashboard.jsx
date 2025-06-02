import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { getStaffProfile, getStaffModules, getModuleStudentsByLocation, updateStaffAttendance } from '../services/api';
import StaffAvatar from '../components/staff/StaffAvatar';

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

const Card = styled.div`
  background-color: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  color: #1a1a1a;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const ModuleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ModuleCard = styled.div`
  background-color: ${props => props.$selected ? '#f0f7ff' : 'white'};
  border: 1px solid ${props => props.$selected ? '#2563eb' : '#e5e7eb'};
  border-radius: 0.5rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${props => props.$selected ? '#2563eb' : '#d1d5db'};
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
`;

const ModuleTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const ModuleLocation = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
`;

const AttendanceSection = styled.div`
  margin-top: 1.5rem;
`;

const StudentListContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
  margin-top: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
`;

const StudentList = styled.div`
  padding: 0.5rem;
`;

const StudentItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
  
  &:last-child {
    border-bottom: none;
  }
`;

const StudentName = styled.div`
  flex: 1;
  margin-left: 0.5rem;
`;

const ViewLogsButton = styled.button`
  background-color: #f0f7ff;
  color: #2563eb;
  border: 1px solid #2563eb;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: 1rem;
  
  &:hover {
    background-color: #2563eb;
    color: white;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  background-color: ${props => props.$primary ? '#2563eb' : 'white'};
  color: ${props => props.$primary ? 'white' : '#2563eb'};
  border: 1px solid #2563eb;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.$primary ? '#1d4ed8' : '#f0f7ff'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
  background-color: #dcfce7;
  color: #15803d;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
`;

const LoadingSpinner = styled.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #2563eb;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const DateInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  width: 100%;
  margin-bottom: 1rem;
`;

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [staff, setStaff] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchStaffProfile = async () => {
      try {
        const response = await getStaffProfile();
        setStaff(response.data);
      } catch (error) {
        console.error('Error fetching staff profile:', error);
        setError('Failed to load staff profile');
      }
    };

    const fetchModules = async () => {
      try {
        const response = await getStaffModules();
        setModules(response.data);
      } catch (error) {
        console.error('Error fetching modules:', error);
        setError('Failed to load assigned modules');
      } finally {
        setLoading(false);
      }
    };

    fetchStaffProfile();
    fetchModules();
  }, []);

  const handleModuleSelect = async (module) => {
    setSelectedModule(module);
    setStudents([]);
    setAttendanceStatus({});
    setError('');
    setSuccess('');
    
    try {
      setLoading(true);
      const response = await getModuleStudentsByLocation(module._id, staff.location);
      
      if (response.data.length === 0) {
        setError(`No students found at ${staff.location} for this module. Students might be assigned to other locations.`);
      } else {
        setStudents(response.data);
        
        // Initialize attendance status for all students (default to present)
        const initialStatus = {};
        response.data.forEach(student => {
          initialStatus[student._id] = true;
        });
        setAttendanceStatus(initialStatus);
      }
    } catch (error) {
      console.error('Error fetching students for module:', error);
      setError('Failed to load students for this module');
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId) => {
    setAttendanceStatus(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const handleSelectAll = (value) => {
    const newStatus = {};
    students.forEach(student => {
      newStatus[student._id] = value;
    });
    setAttendanceStatus(newStatus);
  };

  const handleSaveAttendance = async () => {
    if (!selectedModule || !selectedDate) {
      setError('Please select a module and date');
      return;
    }
    
    // Check if any students are marked present
    const presentStudents = Object.values(attendanceStatus).filter(isPresent => isPresent);
    if (presentStudents.length === 0 && students.length > 0) {
      setError('Please mark at least one student present before saving attendance');
      return;
    }
    
    setSaveLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Get all student IDs that are marked as present
      const presentStudentIds = Object.entries(attendanceStatus)
        .filter(([, isPresent]) => isPresent)
        .map(([studentId]) => studentId);
      
      // Get all student IDs that are marked as absent
      const absentStudentIds = Object.entries(attendanceStatus)
        .filter(([, isPresent]) => !isPresent)
        .map(([studentId]) => studentId);
      
      // First, mark present students
      if (presentStudentIds.length > 0) {
        await updateStaffAttendance({
          moduleId: selectedModule._id,
          studentIds: presentStudentIds,
          date: selectedDate.toISOString(),
          attendanceStatus: true
        });
      }
      
      // Then, mark absent students
      if (absentStudentIds.length > 0) {
        await updateStaffAttendance({
          moduleId: selectedModule._id,
          studentIds: absentStudentIds,
          date: selectedDate.toISOString(),
          attendanceStatus: false
        });
      }
      
      setSuccess('Attendance saved successfully');
    } catch (error) {
      console.error('Error saving attendance:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save attendance';
      
      if (error.response?.status === 403) {
        setError('Not authorized to update attendance for this module. Please contact an administrator.');
      } else if (error.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        // Force logout on authentication error
        setTimeout(() => {
          handleLogout();
        }, 3000);
      } else {
        setError(`${errorMessage}. Please try again.`);
      }
    } finally {
      setSaveLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('staffToken');
    localStorage.removeItem('staffData');
    localStorage.removeItem('isStaffAuthenticated');
    navigate('/staff/login');
  };

  const handleViewLogs = (studentId) => {
    navigate(`/staff/student-logs?studentId=${studentId}`);
  };

  if (loading && !staff) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
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
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </MenuList>

      <DashboardHeader>
        <StaffAvatar 
          name={staff?.name || ''} 
          profilePicture={staff?.profilePicture || ''} 
        />
        <WelcomeSection>
          <WelcomeText>Welcome back, {staff?.name || 'Staff'}!</WelcomeText>
          <SubText>Manage your trainings and student attendance at {staff?.location || 'your location'}.</SubText>
        </WelcomeSection>
      </DashboardHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <Card>
        <CardTitle>Your Training Modules</CardTitle>
        {modules.length === 0 ? (
          <p>No modules assigned yet</p>
        ) : (
          <ModuleGrid>
            {modules.map((module) => (
              <ModuleCard 
                key={module._id} 
                $selected={selectedModule?._id === module._id}
                onClick={() => handleModuleSelect(module)}
              >
                <ModuleTitle>{module.title}</ModuleTitle>
                <ModuleLocation>Location: {module.location}</ModuleLocation>
              </ModuleCard>
            ))}
          </ModuleGrid>
        )}
      </Card>

      {selectedModule && (
        <Card>
          <CardTitle>Attendance Management - {selectedModule.title}</CardTitle>
          
          <DateInput 
            type="date" 
            value={selectedDate.toISOString().split('T')[0]} 
            onChange={(e) => setSelectedDate(new Date(e.target.value))} 
          />
          
          <ButtonGroup>
            <Button onClick={() => handleSelectAll(true)}>
              Mark All Present
            </Button>
            <Button onClick={() => handleSelectAll(false)}>
              Mark All Absent
            </Button>
          </ButtonGroup>

          {loading ? (
            <LoadingContainer>
              <LoadingSpinner />
            </LoadingContainer>
          ) : students.length === 0 ? (
            <p>No students found for this module at your location.</p>
          ) : (
            <AttendanceSection>
              <StudentListContainer>
                <StudentList>
                  {students.map((student) => (
                    <StudentItem key={student._id}>
                      <input 
                        type="checkbox" 
                        checked={!!attendanceStatus[student._id]} 
                        onChange={() => handleAttendanceChange(student._id)}
                      />
                      <StudentName>
                        {student.name} ({student.regNo})
                      </StudentName>
                      <ViewLogsButton onClick={() => handleViewLogs(student._id)}>
                        View Logs
                      </ViewLogsButton>
                    </StudentItem>
                  ))}
                </StudentList>
              </StudentListContainer>
              
              <ButtonGroup>
                <Button 
                  $primary
                  onClick={handleSaveAttendance}
                  disabled={saveLoading}
                >
                  {saveLoading ? 'Saving...' : 'Save Attendance'}
                </Button>
              </ButtonGroup>
            </AttendanceSection>
          )}
        </Card>
      )}
    </Container>
  );
};

export default StaffDashboard; 