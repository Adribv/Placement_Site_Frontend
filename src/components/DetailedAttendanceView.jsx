import React, { useState } from 'react';
import { format } from 'date-fns';

const DetailedAttendanceView = ({ logs, role }) => {
    const [filter, setFilter] = useState('all'); // all, present, absent, late
    const [dateRange, setDateRange] = useState({
        start: '',
        end: ''
    });

    // Filter logs based on status and date range
    const filteredLogs = logs.filter(log => {
        const logDate = new Date(log.date);
        const startDate = dateRange.start ? new Date(dateRange.start) : null;
        const endDate = dateRange.end ? new Date(dateRange.end) : null;

        const matchesStatus = filter === 'all' || log.status === filter;
        const matchesDateRange = (!startDate || logDate >= startDate) && 
                                (!endDate || logDate <= endDate);

        return matchesStatus && matchesDateRange;
    });

    // Calculate attendance statistics
    const stats = {
        total: filteredLogs.length,
        present: filteredLogs.filter(log => log.status === 'present').length,
        absent: filteredLogs.filter(log => log.status === 'absent').length,
        late: filteredLogs.filter(log => log.status === 'late').length
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status Filter
                        </label>
                        <select
                            className="w-full p-2 border rounded"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                            <option value="late">Late</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date
                        </label>
                        <input
                            type="date"
                            className="w-full p-2 border rounded"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Date
                        </label>
                        <input
                            type="date"
                            className="w-full p-2 border rounded"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        />
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700">Total Days</h3>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700">Present</h3>
                    <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700">Absent</h3>
                    <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700">Late</h3>
                    <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
                </div>
            </div>

            {/* Attendance Records */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            {role !== 'student' && (
                                <>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Student Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Roll Number
                                    </th>
                                </>
                            )}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Marked By
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Remarks
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredLogs.map((log) => (
                            <tr key={log._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {format(new Date(log.date), 'dd/MM/yyyy')}
                                </td>
                                {role !== 'student' && (
                                    <>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {log.studentId.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {log.studentId.rollNumber}
                                        </td>
                                    </>
                                )}
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
        </div>
    );
};

export default DetailedAttendanceView; 