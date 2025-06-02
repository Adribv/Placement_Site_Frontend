import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../services/attendanceService';
import DetailedAttendanceView from '../../components/DetailedAttendanceView';

const StudentDetailedAttendance = () => {
    const [attendanceLogs, setAttendanceLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAttendanceLogs();
    }, []);

    const fetchAttendanceLogs = async () => {
        try {
            setLoading(true);
            const studentId = localStorage.getItem('studentId');
            const response = await attendanceService.getStudentAttendanceLogs(studentId);
            setAttendanceLogs(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch attendance logs');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">My Attendance Record</h1>
            <DetailedAttendanceView logs={attendanceLogs} role="student" />
        </div>
    );
};

export default StudentDetailedAttendance; 