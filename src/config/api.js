const API_BASE_URL = 'http://localhost:3500';

export const API_ENDPOINTS = {
  STUDENT: {
    PROFILE: `${API_BASE_URL}/student/profile`,
    ATTENDANCE: `${API_BASE_URL}/attendance/my-attendance`,
    CREATE_TEST_DATA: `${API_BASE_URL}/attendance/create-test-data`
  },
  STAFF: {
    MODULES: `${API_BASE_URL}/staff/modules`,
    ATTENDANCE: `${API_BASE_URL}/attendance/module`,
    STUDENT_ATTENDANCE: `${API_BASE_URL}/attendance/student`,
    STUDENT_LOGS: `${API_BASE_URL}/attendance/student`,
    STUDENTS: `${API_BASE_URL}/staff/students`
  },
  ADMIN: {
    MODULES: `${API_BASE_URL}/admin/modules`,
    ATTENDANCE: `${API_BASE_URL}/attendance/module`,
    STUDENTS: `${API_BASE_URL}/admin/students`,
    STUDENT_ATTENDANCE: `${API_BASE_URL}/attendance/admin/student`,
    CREATE_TEST_DATA: `${API_BASE_URL}/attendance/create-test-data`
  }
};

export default API_BASE_URL; 