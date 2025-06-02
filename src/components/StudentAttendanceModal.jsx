import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const StudentAttendanceModal = ({ student, onClose }) => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState({
        startDate: format(new Date().setDate(new Date().getDate() - 30), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd')
    });

    useEffect(() => {
        fetchStudentAttendance();
    }, [student._id, dateRange]);

    const fetchStudentAttendance = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/attendance/student/${student._id}`, {
                params: {
                    startDate: dateRange.startDate,
                    endDate: dateRange.endDate
                }
            });
            setAttendanceData(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch student attendance data');
            console.error('Error fetching student attendance:', err);
        } finally {
            setLoading(false);
        }
    };

    const calculateAttendanceStats = () => {
        const total = attendanceData.length;
        const present = attendanceData.filter(log => log.status === 'present').length;
        const absent = attendanceData.filter(log => log.status === 'absent').length;
        const late = attendanceData.filter(log => log.status === 'late').length;
        
        return {
            total,
            present,
            absent,
            late,
            presentPercentage: total ? ((present / total) * 100).toFixed(1) : 0
        };
    };

    const stats = calculateAttendanceStats();

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Student Attendance Details</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Student Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600">Name</p>
                                <p className="font-medium">{student.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Roll Number</p>
                                <p className="font-medium">{student.rollNumber}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Attendance Statistics</h3>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">Total Days</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">Present</p>
                                <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">Absent</p>
                                <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">Late</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-gray-600">Attendance Percentage</p>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                    className="bg-blue-600 h-2.5 rounded-full" 
                                    style={{ width: `${stats.presentPercentage}%` }}
                                ></div>
                            </div>
                            <p className="text-right text-sm font-medium mt-1">{stats.presentPercentage}%</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Date Range Filter</h3>
                        <div className="flex gap-4">
                            <div className="flex-1">
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
                            <div className="flex-1">
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
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Attendance History</h3>
                        {loading ? (
                            <div className="text-center p-4">Loading...</div>
                        ) : error ? (
                            <div className="text-center p-4 text-red-600">{error}</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-300">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Marked By
                                            </th>
                                            <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Remarks
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {attendanceData.map((log) => (
                                            <tr key={log._id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {format(new Date(log.date), 'dd/MM/yyyy')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                        ${log.status === 'present' ? 'bg-green-100 text-green-800' : 
                                                        log.status === 'absent' ? 'bg-red-100 text-red-800' : 
                                                        'bg-yellow-100 text-yellow-800'}`}>
                                                        {log.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {log.markedBy.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {log.remarks || '-'}
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
        </div>
    );
};

export default StudentAttendanceModal; 