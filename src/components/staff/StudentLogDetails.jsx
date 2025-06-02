import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { format } from 'date-fns';
import { API_ENDPOINTS } from '../../config/api';

const Container = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  border-radius: 0.5rem;
  min-width: 200px;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  background-color: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  
  &:hover {
    background-color: #f1f5f9;
  }
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  color: #1a1a1a;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${props => 
    props.status === 'present' ? '#dcfce7' : 
    props.status === 'absent' ? '#fee2e2' : 
    '#fef3c7'};
  color: ${props => 
    props.status === 'present' ? '#166534' : 
    props.status === 'absent' ? '#991b1b' : 
    '#92400e'};
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 2rem;
  color: #64748b;
`;

const ErrorText = styled.div`
  text-align: center;
  padding: 2rem;
  color: #ef4444;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: #f8fafc;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
`;

const StudentLogDetails = ({ studentId }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedModule, setSelectedModule] = useState('');
  const [modules, setModules] = useState([]);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [dateRange, setDateRange] = useState({
    startDate: format(new Date().setDate(new Date().getDate() - 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });

  useEffect(() => {
    fetchModules();
    fetchLogs();
  }, [studentId, selectedModule, dateRange, sortField, sortDirection]);

  const fetchModules = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.STAFF.MODULES, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('staffToken')}`
        }
      });
      setModules(response.data.data || []);
    } catch (err) {
      console.error('Error fetching modules:', err);
    }
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_ENDPOINTS.STAFF.STUDENT_LOGS}/${studentId}`, {
        params: {
          moduleId: selectedModule || undefined,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          sortField,
          sortDirection
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('staffToken')}`
        }
      });

      if (response.data?.data) {
        setLogs(response.data.data);
      } else {
        setLogs([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError(err.response?.data?.message || 'Failed to fetch logs');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const calculateStats = () => {
    const totalClasses = logs.length;
    const present = logs.filter(log => log.status === 'present').length;
    const absent = logs.filter(log => log.status === 'absent').length;
    const late = logs.filter(log => log.status === 'late').length;
    const attendanceRate = totalClasses > 0 ? ((present + late) / totalClasses) * 100 : 0;

    return {
      totalClasses,
      present,
      absent,
      late,
      attendanceRate: attendanceRate.toFixed(1)
    };
  };

  if (loading) {
    return <LoadingText>Loading attendance records...</LoadingText>;
  }

  if (error) {
    return <ErrorText>{error}</ErrorText>;
  }

  const stats = calculateStats();

  return (
    <Container>
      <Title>Attendance Records</Title>
      
      <StatsContainer>
        <StatCard>
          <StatValue>{stats.totalClasses}</StatValue>
          <StatLabel>Total Classes</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.present}</StatValue>
          <StatLabel>Present</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.absent}</StatValue>
          <StatLabel>Absent</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.late}</StatValue>
          <StatLabel>Late</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.attendanceRate}%</StatValue>
          <StatLabel>Attendance Rate</StatLabel>
        </StatCard>
      </StatsContainer>

      <FilterContainer>
        <Select
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value)}
        >
          <option value="">All Modules</option>
          {modules.map(module => (
            <option key={module._id} value={module._id}>
              {module.name}
            </option>
          ))}
        </Select>
        <Input
          type="date"
          value={dateRange.startDate}
          onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
        />
        <Input
          type="date"
          value={dateRange.endDate}
          onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
        />
      </FilterContainer>

      {logs.length === 0 ? (
        <ErrorText>No attendance records found for the selected filters.</ErrorText>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th onClick={() => handleSort('date')}>Date</Th>
              <Th onClick={() => handleSort('module')}>Module</Th>
              <Th onClick={() => handleSort('status')}>Status</Th>
              <Th onClick={() => handleSort('markedBy')}>Marked By</Th>
              <Th>Remarks</Th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <Td>{format(new Date(log.date), 'MMM dd, yyyy')}</Td>
                <Td>{log.module?.name || 'N/A'}</Td>
                <Td>
                  <StatusBadge status={log.status}>
                    {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                  </StatusBadge>
                </Td>
                <Td>{log.markedBy?.name || 'N/A'}</Td>
                <Td>{log.remarks || '-'}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default StudentLogDetails; 