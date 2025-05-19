import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getAllModules, getModuleStudents, getStudentModulePerformance, updateAttendance, updateModuleDetails, markModuleAsCompleted } from '../../services/api';
import StudentDetailsModal from './StudentDetailsModal';
import axios from 'axios';

const Container = styled.div`
  padding: 1.5rem;
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  max-width: 56rem;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

const SortButton = styled.button`
  margin-bottom: 1rem;
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 150ms ease-in-out;

  &:hover {
    background-color: #1d4ed8;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

const Table = styled.table`
  width: 100%;
  border: 1px solid #e5e7eb;
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

const TableHead = styled.thead`
  background-color: #f3f4f6;
`;

const TableHeaderCell = styled.th`
  padding: 0.75rem;
  text-align: left;
`;

const TableCell = styled.td`
  padding: 0.75rem;
`;

const TableRow = styled.tr`
  border-top: 1px solid #e5e7eb;
  transition: background-color 150ms ease-in-out;
  cursor: pointer;

  &:hover {
    background-color: #f9fafb;
  }
`;

const EmptyMessage = styled.td`
  padding: 0.75rem;
  text-align: center;
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 0.875rem;
  text-align: center;
  padding: 1rem;
  background-color: #fee2e2;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
`;

const LoadingMessage = styled.div`
  color: #4b5563;
  font-size: 0.875rem;
  text-align: center;
  padding: 1rem;
`;

const ActionBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const AttendanceButton = styled.button`
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 0.375rem;
  padding: 0.5rem 1.25rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: #1d4ed8; }
`;

const EditButton = styled(AttendanceButton)`
  background: #f59e42;
  &:hover { background: #ea580c; }
`;

const SelectAllBox = styled.input`
  margin-right: 0.5rem;
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  z-index: 1000;
  display: flex; align-items: center; justify-content: center;
`;

const ModalBox = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
  min-width: 350px;
  max-width: 95vw;
`;

const TrainingModuleView = () => {
  const [modules, setModules] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [studentsWithScores, setStudentsWithScores] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [completionFilter, setCompletionFilter] = useState('all');
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showAttendanceDialog, setShowAttendanceDialog] = useState(false);
  const [attendanceType, setAttendanceType] = useState('present');
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceResult, setAttendanceResult] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editModuleData, setEditModuleData] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [completeLoading, setCompleteLoading] = useState(false);
  const [completeError, setCompleteError] = useState('');
  const [completeSuccess, setCompleteSuccess] = useState('');

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getAllModules();
        setModules(response.data.modules || []);
      } catch (err) {
        setError('Failed to fetch training modules');
        setModules([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModules();
  }, []);

  useEffect(() => {
    const fetchModuleStudents = async () => {
      if (!selectedModuleId) {
        setStudentsWithScores([]);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await getModuleStudents(selectedModuleId);
        console.log(response.data);
        const students = response.data.students || [];
        setStudentsWithScores(students.map(student => ({
          _id: student._id,
          name: student.name,
          regNo: student.regNo,
          averageScore: student.trainingProgress?.averageScore || 'NA',
          isCompleted: student.trainingProgress?.isCompleted || false
        })));
      } catch (err) {
        setError('Failed to fetch module students');
        setStudentsWithScores([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModuleStudents();
  }, [selectedModuleId]);

  const handleSort = () => {
    const sorted = [...studentsWithScores].sort((a, b) => {
      if (a.averageScore === 'NA') return 1;
      if (b.averageScore === 'NA') return -1;
      return sortOrder === 'asc'
        ? a.averageScore - b.averageScore
        : b.averageScore - a.averageScore;
    });
    setStudentsWithScores(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleStudentClick = async (studentId) => {
    try {
      if (!selectedModuleId) {
        setError('No module selected');
        return;
      }
      const response = await getStudentModulePerformance(studentId, selectedModuleId);
      const studentDetails = {
        ...response.data.student,
        trainings: [{
          moduleId: response.data.module,
          progress: {
            isCompleted: response.data.performance.averageScore >= 75,
            score: response.data.performance.averageScore,
            attendance: response.data.performance.attendance.percentage,
            examScores: response.data.performance.examScores
          }
        }]
      };
      setSelectedStudent(studentDetails);
      setIsModalOpen(true);
    } catch (err) {
      console.error('Failed to fetch student details:', err);
      setError('Failed to fetch student details');
    }
  };

  // Attendance selection logic
  const handleSelectStudent = (studentId) => {
    setSelectedStudentIds(ids =>
      ids.includes(studentId) ? ids.filter(id => id !== studentId) : [...ids, studentId]
    );
  };
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStudentIds([]);
      setSelectAll(false);
    } else {
      setSelectedStudentIds(studentsWithScores.map(s => s._id));
      setSelectAll(true);
    }
  };
  useEffect(() => {
    if (selectedStudentIds.length === studentsWithScores.length && studentsWithScores.length > 0) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedStudentIds, studentsWithScores]);

  // Attendance dialog logic
  const openAttendanceDialog = () => setShowAttendanceDialog(true);
  const closeAttendanceDialog = () => setShowAttendanceDialog(false);
  const handleAttendanceType = (type) => setAttendanceType(type);
  const confirmAttendance = async () => {
    setAttendanceLoading(true);
    setAttendanceResult(null);
    try {
      const res = await updateAttendance({
        studentIds: selectedStudentIds,
        moduleId: selectedModuleId,
        date: attendanceDate,
        isPresent: attendanceType === 'present'
      });
      setAttendanceResult(res.data);
      setSelectedStudentIds([]);
      setSelectionMode(false);
    } catch (err) {
      setAttendanceResult({ error: err.response?.data?.message || 'Failed to update attendance' });
    } finally {
      setAttendanceLoading(false);
      closeAttendanceDialog();
    }
  };

  // Edit module logic
  const openEditModal = () => {
    const mod = modules.find(m => m._id === selectedModuleId);
    setEditModuleData({ ...mod });
    setShowEditModal(true);
    setEditError('');
  };
  const closeEditModal = () => setShowEditModal(false);
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditModuleData(data => ({
      ...data,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  const saveEditModule = async () => {
    setEditLoading(true);
    setEditError('');
    try {
      await updateModuleDetails(editModuleData._id, {
        title: editModuleData.title,
        description: editModuleData.description,
        durationDays: Number(editModuleData.durationDays),
        examsCount: Number(editModuleData.examsCount)
      });
      setShowEditModal(false);
      // Optionally, refresh modules list
      const response = await getAllModules();
      setModules(response.data.modules || []);
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to update module');
    } finally {
      setEditLoading(false);
    }
  };

  const markAsCompleted = async () => {
    if (!selectedModuleId) return;
    setCompleteLoading(true);
    setCompleteError('');
    setCompleteSuccess('');
    try {
      const response = await markModuleAsCompleted(selectedModuleId);
      setCompleteSuccess(response.message + ` (${response.studentsUpdated} students updated)`);
      // Refresh modules list
      const modulesRes = await getAllModules();
      setModules(modulesRes.data.modules || []);
    } catch (err) {
      setCompleteError(err.response?.data?.message || 'Failed to mark module as completed');
    } finally {
      setCompleteLoading(false);
    }
  };

  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Training Modules</Title>
      
      {isLoading && modules.length === 0 ? (
        <LoadingMessage>Loading training modules...</LoadingMessage>
      ) : (
        <>
          <Select
            value={selectedModuleId}
            onChange={(e) => setSelectedModuleId(e.target.value)}
          >
            <option value="">Select a module</option>
            {modules.map(module => (
              <option key={module._id} value={module._id}>
                {module.title} {module.isCompleted ? '(Completed)' : ''}
              </option>
            ))}
          </Select>

          {selectedModuleId && (
            <ActionBar>
              <AttendanceButton onClick={() => setSelectionMode(m => !m)}>
                {selectionMode ? 'Cancel Attendance' : 'Upload Attendance'}
              </AttendanceButton>
              <EditButton onClick={openEditModal}>Edit Module</EditButton>
              {(() => {
                const mod = modules.find(m => m._id === selectedModuleId);
                if (mod && !mod.isCompleted) {
                  return (
                    <AttendanceButton
                      style={{ background: '#059669' }}
                      onClick={markAsCompleted}
                      disabled={completeLoading}
                    >
                      {completeLoading ? 'Marking...' : 'Mark as Completed'}
                    </AttendanceButton>
                  );
                }
                return null;
              })()}
              {selectionMode && (
                <AttendanceButton
                  onClick={openAttendanceDialog}
                  disabled={selectedStudentIds.length === 0}
                >
                  Mark Attendance
                </AttendanceButton>
              )}
            </ActionBar>
          )}

          {selectionMode && (
            <div style={{ marginBottom: '0.5rem' }}>
              <label>
                <SelectAllBox
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
                Select All
              </label>
            </div>
          )}

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {completeError && <ErrorMessage>{completeError}</ErrorMessage>}
          {completeSuccess && <div style={{ color: '#059669', textAlign: 'center', marginBottom: '1rem' }}>{completeSuccess}</div>}
          {isLoading && <LoadingMessage>Loading...</LoadingMessage>}

          {!isLoading && !error && (
            <Table>
              <TableHead>
                <tr>
                  {selectionMode && <TableHeaderCell></TableHeaderCell>}
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>Registration Number</TableHeaderCell>
                  <TableHeaderCell>Average Score</TableHeaderCell>
                </tr>
              </TableHead>
              <tbody>
                {studentsWithScores.length === 0 ? (
                  <tr>
                    <EmptyMessage colSpan={selectionMode ? 5 : 4}>No students found</EmptyMessage>
                  </tr>
                ) : (
                  studentsWithScores.map((student) => (
                    <TableRow
                      key={student._id}
                      onClick={!selectionMode ? () => handleStudentClick(student._id) : undefined}
                    >
                      {selectionMode && (
                        <TableCell>
                          <Checkbox
                            type="checkbox"
                            checked={selectedStudentIds.includes(student._id)}
                            onChange={() => handleSelectStudent(student._id)}
                          />
                        </TableCell>
                      )}
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.regNo}</TableCell>
                      <TableCell>{student.averageScore}</TableCell>
                    </TableRow>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </>
      )}

      {/* Attendance Dialog */}
      {showAttendanceDialog && (
        <ModalBackdrop>
          <ModalBox>
            <h3>Mark Attendance</h3>
            <div style={{ margin: '1rem 0' }}>
              <label>
                <input
                  type="radio"
                  name="attendanceType"
                  value="present"
                  checked={attendanceType === 'present'}
                  onChange={() => handleAttendanceType('present')}
                /> Present
              </label>
              <label style={{ marginLeft: '1.5rem' }}>
                <input
                  type="radio"
                  name="attendanceType"
                  value="absent"
                  checked={attendanceType === 'absent'}
                  onChange={() => handleAttendanceType('absent')}
                /> Absent
              </label>
              <div style={{ marginTop: '1rem' }}>
                <label>
                  Date: {' '}
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={e => setAttendanceDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    required
                  />
                </label>
              </div>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <AttendanceButton onClick={confirmAttendance} disabled={attendanceLoading}>
                {attendanceLoading ? 'Marking...' : 'Confirm'}
              </AttendanceButton>
              <AttendanceButton style={{ background: '#f3f4f6', color: '#374151' }} onClick={closeAttendanceDialog}>
                Cancel
              </AttendanceButton>
            </div>
          </ModalBox>
        </ModalBackdrop>
      )}
      {/* Attendance Result Dialog */}
      {attendanceResult && (
        <ModalBackdrop onClick={() => setAttendanceResult(null)}>
          <ModalBox onClick={e => e.stopPropagation()}>
            <h3>Attendance Update Result</h3>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', margin: '1rem 0' }}>{JSON.stringify(attendanceResult, null, 2)}</pre>
            <AttendanceButton onClick={() => setAttendanceResult(null)}>Close</AttendanceButton>
          </ModalBox>
        </ModalBackdrop>
      )}
      {/* Edit Module Modal */}
      {showEditModal && editModuleData && (
        <ModalBackdrop>
          <ModalBox>
            <h3>Edit Module</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1rem 0' }}>
              <label>
                Title
                <input name="title" value={editModuleData.title} onChange={handleEditChange} />
              </label>
              <label>
                Description
                <textarea name="description" value={editModuleData.description} onChange={handleEditChange} />
              </label>
              <label>
                Duration (days)
                <input name="durationDays" type="number" value={editModuleData.durationDays} onChange={handleEditChange} />
              </label>
              <label>
                Exams Count
                <input name="examsCount" type="number" value={editModuleData.examsCount} onChange={handleEditChange} />
              </label>
            </div>
            {editError && <ErrorMessage>{editError}</ErrorMessage>}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <EditButton onClick={saveEditModule} disabled={editLoading}>
                {editLoading ? 'Saving...' : 'Save'}
              </EditButton>
              <AttendanceButton style={{ background: '#f3f4f6', color: '#374151' }} onClick={closeEditModal}>
                Cancel
              </AttendanceButton>
            </div>
          </ModalBox>
        </ModalBackdrop>
      )}

      {isModalOpen && (
        <StudentDetailsModal
          student={selectedStudent}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedStudent(null);
          }}
        />
      )}
    </Container>
  );
};

export default TrainingModuleView;
