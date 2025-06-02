import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios';

const AttendanceView = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [studentInfo, setStudentInfo] = useState(null);

    useEffect(() => {
        // Get student info from localStorage
        const storedStudent = localStorage.getItem('student');
        if (storedStudent) {
            setStudentInfo(JSON.parse(storedStudent));
        }
        fetchAttendanceData();
    }, []);

    const fetchAttendanceData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/attendance/student');
            console.log('API Response:', response.data); // Debug log
            
            // Handle the array structure where first element contains attendance data
            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                const courseData = response.data[0];
                if (courseData && courseData.attendance) {
                    setAttendanceData(courseData.attendance);
                } else {
                    setAttendanceData([]);
                }
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
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading attendance data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center text-red-600">
                    <p>{error}</p>
                    <button 
                        onClick={fetchAttendanceData}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Student Information Header */}
            {studentInfo && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">{studentInfo.name}</h1>
                            <p className="text-gray-600 mt-1">Registration No: {studentInfo.regNo}</p>
                            <p className="text-gray-600">Batch: {studentInfo.batch}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-600">Email: {studentInfo.email}</p>
                            <p className="text-gray-600">Passout Year: {studentInfo.passoutYear}</p>
                        </div>
                    </div>
                </div>
            )}

            <h2 className="text-2xl font-bold mb-6">Attendance Record</h2>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Days</h3>
                    <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Present Days</h3>
                    <p className="text-3xl font-bold text-green-600">{stats.present}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Absent Days</h3>
                    <p className="text-3xl font-bold text-red-600">{stats.absent}</p>
                </div>
            </div>

            {/* Attendance Progress */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Attendance Percentage</h3>
                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                        className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${stats.presentPercentage}%` }}
                    ></div>
                </div>
                <p className="text-right text-sm font-medium mt-2">{stats.presentPercentage}%</p>
            </div>

            {/* Attendance Records Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <h3 className="text-lg font-semibold text-gray-700 p-6 border-b">Attendance History</h3>
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
    );
};

export default AttendanceView; 