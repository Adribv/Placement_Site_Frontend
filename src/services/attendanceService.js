import axios from 'axios';

const API_URL = 'http://localhost:5000/attendance';

export const attendanceService = {
    // Get all attendance logs
    getAllAttendanceLogs: async () => {
        try {
            const response = await axios.get(`${API_URL}/logs`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get attendance logs for a specific student
    getStudentAttendanceLogs: async (studentId) => {
        try {
            const response = await axios.get(`${API_URL}/student/${studentId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Mark attendance for a student
    markAttendance: async (attendanceData) => {
        try {
            const response = await axios.post(`${API_URL}/mark`, attendanceData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}; 