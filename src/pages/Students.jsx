import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getAllStudents } from '../services/api';
import StudentDetailsModal from '../components/admin/StudentDetailsModal';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  padding: 2rem;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1.5rem;
`;

const FilterContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: #f9fafb;
`;

const TableHeaderCell = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
`;

const TableRow = styled.tr`
  cursor: pointer;
  &:hover {
    background-color: #f9fafb;
  }
`;

const TableCell = styled.td`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #4b5563;
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #fee2e2;
  border-radius: 0.375rem;
`;

const batchTypes = ['Marquee', 'Super Dream', 'Dream', 'Service', 'General'];
const departmentOptions = [
  'CSE', 'IT', 'EEE', 'ECE', 'CIVIL',
  'BME', 'Bio Tech', 'AIML', 'BDA', 'CS', 'CC', 'IOT', 'GT', 'CSBS', 'Civil', 'Mech'
];

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filter states
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await getAllStudents();
      setStudents(response.data.students);
      setFilteredStudents(response.data.students);
      setError(null);
    } catch {
      setError('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...students];

    if (selectedBatch) {
      filtered = filtered.filter(student => 
        student.batch?.toLowerCase() === selectedBatch.toLowerCase()
      );
    }

    if (selectedDepartment) {
      filtered = filtered.filter(student => 
        student.department?.toLowerCase() === selectedDepartment.toLowerCase()
      );
    }

    if (selectedYear) {
      filtered = filtered.filter(student => 
        String(student.passoutYear) === String(selectedYear)
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(student => 
        (student.name?.toLowerCase() || '').includes(query) ||
        (student.regNo?.toLowerCase() || '').includes(query) ||
        (student.email?.toLowerCase() || '').includes(query)
      );
    }

    setFilteredStudents(filtered);
  }, [students, selectedBatch, selectedDepartment, selectedYear, searchQuery]);

  const handleStudentClick = (student) => {
    navigate(`/admin/students/${student._id}/dashboard`);
  };

  const handleDeleteStudent = (studentId) => {
    setStudents(students.filter(student => student._id !== studentId));
  };

  // Use predefined options for filters
  const batchOptions = batchTypes;
  const departmentOptionsList = departmentOptions;
  const yearOptions = Array.from({ length: 4 }, (_, i) => new Date().getFullYear() + i);

  if (loading) {
    return (
      <Container>
        <Card>
          <Title>Loading Students...</Title>
        </Card>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Card>
          <Title>Error</Title>
          <ErrorMessage>{error}</ErrorMessage>
        </Card>
      </Container>
    );
  }

  if (!students || students.length === 0) {
    return (
      <Container>
        <Card>
          <Title>No Students Found</Title>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <Title>Students</Title>
        
        <FilterContainer>
          <Select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
          >
            <option value="">All Batches</option>
            {batchOptions.map(batch => (
              <option key={batch} value={batch}>{batch}</option>
            ))}
          </Select>

          <Select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            {departmentOptionsList.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </Select>

          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">All Years</option>
            {yearOptions.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </Select>

          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              width: '100%'
            }}
          />
        </FilterContainer>

        <Table>
          <TableHead>
            <tr>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Registration No</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Batch</TableHeaderCell>
              <TableHeaderCell>Department</TableHeaderCell>
              <TableHeaderCell>Passout Year</TableHeaderCell>
            </tr>
          </TableHead>
          <tbody>
            {filteredStudents.map(student => (
              <TableRow
                key={student._id}
                onClick={() => handleStudentClick(student)}
              >
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.regNo}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.batch}</TableCell>
                <TableCell>{student.department}</TableCell>
                <TableCell>{student.passoutYear}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </Card>

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

export default Students; 