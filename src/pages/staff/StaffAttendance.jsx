import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import AttendanceLogTable from '../../components/AttendanceLogTable';
import StudentAttendanceModal from '../../components/StudentAttendanceModal';

const StaffAttendance = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showStudentModal, setShowStudentModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [dateRange, setDateRange] = useState({
        startDate: format(new Date().setDate(new Date().getDate() - 30), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd')
    });

    useEffect(() => {
        fetchAttendanceLogs();
    }, [filterStatus, dateRange]);

    const fetchAttendanceLogs = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/attendance/logs', {
                params: {
                    status: filterStatus !== 'all' ? filterStatus : undefined,
                    startDate: dateRange.startDate,
                    endDate: dateRange.endDate
                }
            });
            setLogs(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch attendance logs');
            console.error('Error fetching attendance logs:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAttendance = async (studentId) => {
        try {
            const response = await axios.post('/api/attendance/mark', {
                studentId,
                date: format(new Date(), 'yyyy-MM-dd'),
                status: 'present',
                remarks: ''
            });
            setLogs(prevLogs => [...prevLogs, response.data]);
        } catch (err) {
            setError('Failed to mark attendance');
            console.error('Error marking attendance:', err);
        }
    };

    const handleViewStudentAttendance = (student) => {
        setSelectedStudent(student);
        setShowStudentModal(true);
    };

    const handleCloseStudentModal = () => {
        setShowStudentModal(false);
        setSelectedStudent(null);
    };

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-center p-4 text-red-600">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Attendance Management</h1>
            
            <div className="mb-6 flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Filter by Status
                    </label>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    >
                        <option value="all">All</option>
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">Late</option>
                    </select>
                </div>
                
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                    </label>
                    <input
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                    </label>
                    <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                        className="w-full p-2 border rounded-md"
                    />
                </div>
            </div>

            <AttendanceLogTable 
                logs={logs} 
                onMarkAttendance={handleMarkAttendance}
                onViewStudentAttendance={handleViewStudentAttendance}
            />

            {showStudentModal && selectedStudent && (
                <StudentAttendanceModal
                    student={selectedStudent}
                    onClose={handleCloseStudentModal}
                />
            )}
        </div>
    );
};

export default StaffAttendance; 