import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentAttendanceDetails = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [studentInfo, setStudentInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const storedStudent = localStorage.getItem('student');
        if (!storedStudent) {
            navigate('/student/login');
            return;
        }

        const student = JSON.parse(storedStudent);
        setStudentInfo(student);
        fetchAttendanceData(student._id);
    }, [navigate]);

    const fetchAttendanceData = async (studentId) => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/attendance/student/${studentId}`);
            console.log('API Response:', response.data);
            
            // Handle the course data structure
            if (response.data && response.data.attendance) {
                setAttendanceData(response.data.attendance);
            } else {
                setAttendanceData([]);
            }
            setError(null);
        } catch (err) {
            setError('Failed to fetch attendance data');
            console.error('Error fetching attendance data:', err);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = () => {
        const total = attendanceData.length;
        const present = attendanceData.filter(record => record.present).length;
        const absent = total - present;
        
        return {
            total,
            present,
            absent,
            presentPercentage: total ? ((present / total) * 100).toFixed(1) : 0
        };
    };

    const stats = calculateStats();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading attendance data...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="text-center text-red-600">
                        <p>{error}</p>
                        <button 
                            onClick={() => fetchAttendanceData(studentInfo._id)}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Student Information Card */}
                {studentInfo && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">{studentInfo.name}</h1>
                                <div className="mt-2 space-y-1">
                                    <p className="text-gray-600">
                                        <span className="font-semibold">Registration No:</span> {studentInfo.regNo}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-semibold">Batch:</span> {studentInfo.batch}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0 md:text-right">
                                <p className="text-gray-600">
                                    <span className="font-semibold">Email:</span> {studentInfo.email}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-semibold">Passout Year:</span> {studentInfo.passoutYear}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Attendance Overview */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Attendance Overview</h2>
                    
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-blue-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-blue-700 mb-2">Total Days</h3>
                            <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                        </div>
                        <div className="bg-green-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-green-700 mb-2">Present Days</h3>
                            <p className="text-3xl font-bold text-green-600">{stats.present}</p>
                        </div>
                        <div className="bg-red-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-red-700 mb-2">Absent Days</h3>
                            <p className="text-3xl font-bold text-red-600">{stats.absent}</p>
                        </div>
                    </div>

                    {/* Attendance Progress */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold text-gray-700">Attendance Percentage</h3>
                            <span className="text-lg font-bold text-blue-600">{stats.presentPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div 
                                className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                                style={{ width: `${stats.presentPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Attendance Records Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">Attendance History</h2>
                    </div>
                    
                    {attendanceData.length === 0 ? (
                        <div className="text-center p-8 text-gray-500">
                            No attendance records found
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Day
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {attendanceData.map((record) => (
                                        <tr key={record._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {format(new Date(record.date), 'dd/MM/yyyy')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {format(new Date(record.date), 'EEEE')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {format(new Date(record.date), 'hh:mm a')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${record.present ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {record.present ? 'Present' : 'Absent'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentAttendanceDetails; 