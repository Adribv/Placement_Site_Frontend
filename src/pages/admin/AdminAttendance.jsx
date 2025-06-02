import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../services/attendanceService';
import AttendanceLogTable from '../../components/AttendanceLogTable';
import StudentAttendanceModal from '../../components/StudentAttendanceModal';

const AdminAttendance = () => {
    const [attendanceLogs, setAttendanceLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showMarkAttendance, setShowMarkAttendance] = useState(false);
    const [showStudentModal, setShowStudentModal] = useState(false);
    const [attendanceData, setAttendanceData] = useState({
        status: 'present',
        remarks: ''
    });

    useEffect(() => {
        fetchAttendanceLogs();
    }, []);

    const fetchAttendanceLogs = async () => {
        try {
            setLoading(true);
            const response = await attendanceService.getAllAttendanceLogs();
            setAttendanceLogs(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch attendance logs');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAttendance = (studentId) => {
        setSelectedStudent(studentId);
        setShowMarkAttendance(true);
    };

    const handleViewStudentAttendance = (student) => {
        setSelectedStudent(student);
        setShowStudentModal(true);
    };

    const handleSubmitAttendance = async (e) => {
        e.preventDefault();
        try {
            await attendanceService.markAttendance({
                studentId: selectedStudent,
                ...attendanceData
            });
            setShowMarkAttendance(false);
            fetchAttendanceLogs();
            setAttendanceData({ status: 'present', remarks: '' });
        } catch (err) {
            setError('Failed to mark attendance');
            console.error(err);
        }
    };

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Student Attendance Logs</h1>
            
            <AttendanceLogTable 
                logs={attendanceLogs} 
                onMarkAttendance={handleMarkAttendance}
                onViewStudentAttendance={handleViewStudentAttendance}
            />

            {showMarkAttendance && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                        <h2 className="text-xl font-bold mb-4">Mark Attendance</h2>
                        <form onSubmit={handleSubmitAttendance}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Status
                                </label>
                                <select
                                    className="w-full p-2 border rounded"
                                    value={attendanceData.status}
                                    onChange={(e) => setAttendanceData({
                                        ...attendanceData,
                                        status: e.target.value
                                    })}
                                >
                                    <option value="present">Present</option>
                                    <option value="absent">Absent</option>
                                    <option value="late">Late</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Remarks
                                </label>
                                <textarea
                                    className="w-full p-2 border rounded"
                                    value={attendanceData.remarks}
                                    onChange={(e) => setAttendanceData({
                                        ...attendanceData,
                                        remarks: e.target.value
                                    })}
                                    rows="3"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowMarkAttendance(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showStudentModal && selectedStudent && (
                <StudentAttendanceModal
                    student={selectedStudent}
                    onClose={() => {
                        setShowStudentModal(false);
                        setSelectedStudent(null);
                    }}
                />
            )}
        </div>
    );
};

export default AdminAttendance; 