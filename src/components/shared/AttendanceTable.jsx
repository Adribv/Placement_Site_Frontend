import React from 'react';
import styled from 'styled-components';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  background: #f8fafc;
  color: #475569;
  font-weight: 600;
  border-bottom: 2px solid #e2e8f0;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  color: #475569;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'present':
        return '#dcfce7';
      case 'absent':
        return '#fee2e2';
      case 'late':
        return '#fef3c7';
      default:
        return '#e2e8f0';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'present':
        return '#166534';
      case 'absent':
        return '#991b1b';
      case 'late':
        return '#92400e';
      default:
        return '#475569';
    }
  }};
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

const NoRecordsText = styled.div`
  text-align: center;
  padding: 2rem;
  color: #64748b;
  font-style: italic;
`;

const AttendanceTable = ({ 
  attendanceLogs, 
  loading, 
  error, 
  showStudentName = true,
  showModuleTitle = true,
  showDate = true,
  showRemarks = true
}) => {
  if (loading) {
    return <LoadingText>Loading attendance records...</LoadingText>;
  }

  if (error) {
    return <ErrorText>{error}</ErrorText>;
  }

  if (!attendanceLogs || attendanceLogs.length === 0) {
    return <NoRecordsText>No attendance records found</NoRecordsText>;
  }

  return (
    <Table>
      <thead>
        <tr>
          {showDate && <Th>Date</Th>}
          {showStudentName && <Th>Student</Th>}
          {showModuleTitle && <Th>Module</Th>}
          <Th>Status</Th>
          {showRemarks && <Th>Remarks</Th>}
        </tr>
      </thead>
      <tbody>
        {attendanceLogs.map((log) => (
          <tr key={log._id}>
            {showDate && (
              <Td>{new Date(log.date).toLocaleDateString()}</Td>
            )}
            {showStudentName && (
              <Td>{log.studentName}</Td>
            )}
            {showModuleTitle && (
              <Td>{log.moduleTitle}</Td>
            )}
            <Td>
              <StatusBadge status={log.status}>
                {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
              </StatusBadge>
            </Td>
            {showRemarks && (
              <Td>{log.remarks || '-'}</Td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default AttendanceTable; 