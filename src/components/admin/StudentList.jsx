import React, { useState } from 'react';
import styled from 'styled-components';
import StudentDetailsModal from './StudentDetailsModal';

const Container = styled.div`
  padding: 1rem;
  max-width: 800px;
  margin: 0 auto;
  @media (max-width: 600px) {
    padding: 0.25rem;
    max-width: 100vw;
  }
`;

const Title = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  overflow: hidden;
  @media (max-width: 700px) {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
    font-size: 0.95rem;
  }
`;

const TableHead = styled.thead`
  background-color: #e5e7eb;
  text-align: left;
  color: #4b5563;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const TableHeader = styled.th`
  padding: 1rem;
  border-bottom: 1px solid #d1d5db;
  @media (max-width: 700px) {
    padding: 0.5rem;
    font-size: 0.95rem;
  }
`;

const TableRow = styled.tr`
  cursor: pointer;
  border-top: 1px solid #d1d5db;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  @media (max-width: 700px) {
    padding: 0.5rem;
    font-size: 0.95rem;
  }
`;

const StudentList = ({ students, batch, onStudentSelect }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleDeleteStudent = (studentId) => {
    onStudentSelect(students.filter(student => student._id !== studentId));
  };

  return (
    <Container>
      <Title>{batch} Students</Title>
      <Table>
        <TableHead>
          <tr>
            <TableHeader>Name</TableHeader>
            <TableHeader>Reg. No</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Department</TableHeader>
          </tr>
        </TableHead>
        <tbody>
          {students.map((student) => (
            <TableRow
              key={student._id}
              onClick={() => handleStudentClick(student)}
            >
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.regNo}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{student.department}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
      
      {isModalOpen && selectedStudent && (
        <StudentDetailsModal
          student={selectedStudent}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedStudent(null);
          }}
          onDelete={handleDeleteStudent}
        />
      )}
    </Container>
  );
};

export default StudentList;
