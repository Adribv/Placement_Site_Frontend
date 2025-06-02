import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import AttendanceTable from '../shared/AttendanceTable';

const Container = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background: white;
  min-width: 200px;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background: white;
  min-width: 200px;
`;

const AdminAttendance = () => {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchModules();
  }, []);

  useEffect(() => {
    if (selectedModule) {
      fetchAttendanceLogs();
    }
  }, [selectedModule, selectedDate]);

  const fetchModules = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.ADMIN.MODULES, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      setModules(response.data);
      if (response.data.length > 0) {
        setSelectedModule(response.data[0]._id);
      }
    } catch (err) {
      console.error('Error fetching modules:', err);
      setError('Failed to fetch modules');
    }
  };

  const fetchAttendanceLogs = async () => {
    try {
      setLoading(true);
      let url = `${API_ENDPOINTS.ADMIN.ATTENDANCE}/${selectedModule}`;
      if (selectedDate) {
        url += `?date=${selectedDate}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.data?.data) {
        const sortedLogs = response.data.data.sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        setAttendanceLogs(sortedLogs);
      } else {
        setAttendanceLogs([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching attendance logs:', err);
      setError(err.response?.data?.message || 'Failed to fetch attendance logs');
      setAttendanceLogs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Attendance Management</Title>
      <FilterContainer>
        <Select 
          value={selectedModule} 
          onChange={(e) => setSelectedModule(e.target.value)}
        >
          <option value="">Select Module</option>
          {modules.map(module => (
            <option key={module._id} value={module._id}>
              {module.title}
            </option>
          ))}
        </Select>
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </FilterContainer>
      <AttendanceTable 
        attendanceLogs={attendanceLogs}
        loading={loading}
        error={error}
        showStudentName={true}
        showModuleTitle={true}
        showDate={true}
        showRemarks={true}
      />
    </Container>
  );
};

export default AdminAttendance; 