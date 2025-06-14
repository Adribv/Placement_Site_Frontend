import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3500';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // Check if the request is for student or staff endpoints
    const isStudentEndpoint = config.url.startsWith('/student');
    const isStaffEndpoint = config.url.startsWith('/staff');
    const isAdminEndpoint = config.url.startsWith('/admin') || config.url.includes('/admin/');
    const isLoginEndpoint = config.url.endsWith('/login');
    
    // Get the appropriate token based on the endpoint
    let token;
    if (isStudentEndpoint) {
      token = localStorage.getItem('studentToken');
    } else if (isStaffEndpoint) {
      token = localStorage.getItem('staffToken');
    } else if (isAdminEndpoint && !isLoginEndpoint) {
      token = localStorage.getItem('adminToken');
      // For admin endpoints, ensure we have a valid token
      if (!token) {
        console.error('No admin token found for admin endpoint:', config.url);
        return Promise.reject(new Error('Authentication required'));
      }
    }

    if (token) {
      // Ensure the token is properly formatted with 'Bearer' prefix
      const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      config.headers.Authorization = formattedToken;
      console.log('Setting Authorization header for', config.url, ':', formattedToken);
    }

    // For form-data requests, remove Content-Type to let browser set it
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear the appropriate token and data based on the endpoint
      const isStudentEndpoint = error.config.url.startsWith('/student');
      const isStaffEndpoint = error.config.url.startsWith('/staff');
      const isAdminEndpoint = error.config.url.startsWith('/admin') || error.config.url.startsWith('/attendance');
      
      if (isStudentEndpoint) {
        localStorage.removeItem('studentToken');
        localStorage.removeItem('studentData');
        window.location.href = '/student/login';
      } else if (isStaffEndpoint) {
        localStorage.removeItem('staffToken');
        localStorage.removeItem('staffData');
        window.location.href = '/staff/login';
      } else if (isAdminEndpoint) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const loginAdmin = (credentials) => api.post('/admin/login', credentials);
export const registerAdmin = (adminData) => api.post('/admin/register', adminData);
export const loginStudent = (credentials) => api.post('/student/login', credentials);

// Student APIs
export const getAllStudents = () => {
  return api.get('/admin/students');
};

export const getAllStudentsByBatch = (batch) => {
  return api.get('/admin/students', { params: { batch } });
};

export const registerStudent = (studentData) => api.post('/admin/register-student', studentData);
export const bulkRegisterStudents = (file) => {
  const formData = new FormData();
  formData.append('excel', file);
  return api.post('/admin/bulk-register', formData);
};

// Training Module APIs
export const getAllModules = () => api.get('/admin/modules');
export const addModule = async (moduleData) => {
  return api.post('/admin/modules', moduleData);
};
export const updateModule = (moduleId, moduleData) => api.put(`/admin/modules/${moduleId}`, moduleData);
export const getStudentModules = () => {
  return api.get(`/admin/modules`);
};
export const getModuleStudents = (moduleId) => api.get(`/admin/students/module/${moduleId}`);

export const getStudentDetails = async (studentId) => {
  const response = await api.get(`/student/${studentId}`);
  return response.data;
};
export const getStudentModulePerformance = async (studentId, moduleId) => {
  const response = await api.get(`/student/${studentId}/module/${moduleId}`);
  return response.data;
};

export const uploadBulkScores = async (file, moduleId, examNumber) => {
  const formData = new FormData();
  formData.append('marksFile', file);
  formData.append('moduleId', moduleId);
  formData.append('examNumber', examNumber);
  // Do NOT set Content-Type header manually!
  return api.post('/admin/upload-scores', formData);
};

export const uploadIndividualScore = async (studentId, moduleId, examNumber, score) => {
  const response = await api.post('/admin/upload-score', {
    studentId,
    moduleId,
    examNumber,
    score
  });
  return response.data;
};

export const deleteStudent = (studentId) => {
  return api.delete(`/admin/student/${studentId}`);
};

// Student Dashboard APIs
export const getStudentProfile = () => {
  const studentData = JSON.parse(localStorage.getItem('studentData'));
  if (!studentData?._id) {
    return Promise.reject(new Error('Student data not found'));
  }
  return api.get(`/student/${studentData._id}`).then(response => {
    // Update local storage with the latest student data including profile picture
    if (response.data && response.data.student) {
      const updatedStudentData = {
        ...studentData,
        profilePicture: response.data.student.profilePicture,
        numTrainingsCompleted: response.data.student.numTrainingsCompleted
      };
      localStorage.setItem('studentData', JSON.stringify(updatedStudentData));
    }
    return response;
  });
};

export const updateProfilePicture = (file) => {
  const studentData = JSON.parse(localStorage.getItem('studentData'));
  if (!studentData?._id) {
    return Promise.reject(new Error('Student data not found'));
  }
  
  const formData = new FormData();
  formData.append('profilePicture', file);
  
  console.log('Uploading profile picture for student:', studentData._id);
  
  return api.post(`/student/${studentData._id}/profile-picture`, formData)
    .then(response => {
      console.log('Profile picture upload success, response:', response.data);
      // Update the local storage with the new data
      const updatedStudent = {
        ...studentData,
        profilePicture: response.data.student.profilePicture
      };
      localStorage.setItem('studentData', JSON.stringify(updatedStudent));
      return response;
    })
    .catch(error => {
      console.error('Profile picture upload error:', error);
      throw error;
    });
};

export const getStudentModuleDetails = (moduleId) => {
  const studentData = JSON.parse(localStorage.getItem('studentData'));
  if (!studentData?._id) {
    return Promise.reject(new Error('Student data not found'));
  }
  return api.get(`/student/${studentData._id}/module/${moduleId}`);
};

// Admin Attendance and Module Update APIs
export const updateAttendance = (data) => api.post('/admin/attendance', data);
export const updateModuleDetails = (moduleId, data) => api.put(`/admin/modules/${moduleId}`, data);

// Mark module as completed
export const markModuleAsCompleted = async (moduleId) => {
  const response = await api.put(`/admin/modules/${moduleId}/complete`, {});
  return response.data;
};

// Leaderboard API
export const getModuleLeaderboard = async (moduleId, examType) => {
  try {
    const response = await api.get(`/student/module/${moduleId}/leaderboard`, {
      params: {
        examType
      }
    });
    return response;
  } catch (error) {
    console.error('Leaderboard API Error:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(error.response.data.message || 'Failed to fetch leaderboard data');
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please check your internet connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error('Error setting up the request');
    }
  }
};

// Staff APIs
export const loginStaff = (credentials) => api.post('/staff/login', credentials);
export const getStaffProfile = () => {
  return api.get('/staff/profile')
    .then(response => {
      // Update local storage with the latest staff data including profile picture
      const staffData = JSON.parse(localStorage.getItem('staffData'));
      if (staffData && response.data) {
        const updatedStaffData = {
          ...staffData,
          profilePicture: response.data.profilePicture
        };
        localStorage.setItem('staffData', JSON.stringify(updatedStaffData));
      }
      return response;
    });
};

export const updateStaffProfilePicture = (file) => {
  console.log('Uploading staff profile picture');
  
  const formData = new FormData();
  formData.append('profilePicture', file);
  
  return api.post('/staff/profile-picture', formData)
    .then(response => {
      console.log('Staff profile picture upload success, response:', response.data);
      // Update the local storage with the new data
      const staffData = JSON.parse(localStorage.getItem('staffData'));
      if (staffData) {
        const updatedStaff = {
          ...staffData,
          profilePicture: response.data.staff.profilePicture
        };
        localStorage.setItem('staffData', JSON.stringify(updatedStaff));
      }
      return response;
    })
    .catch(error => {
      console.error('Staff profile picture upload error:', error);
      throw error;
    });
};

export const getStaffModules = () => api.get('/staff/modules');
export const getModuleStudentsByLocation = (moduleId, location) => {
  if (location) {
    return api.get(`/staff/module/${moduleId}/students`, {
      params: { location }
    });
  } else {
    return api.get(`/staff/module/${moduleId}/students`);
  }
};
export const updateStaffAttendance = (data) => api.post('/staff/attendance', data);

// Admin Staff Management APIs
export const registerStaff = (staffData) => api.post('/admin/register-staff', staffData);
export const getAllStaff = () => api.get('/admin/staff');
export const deleteStaff = (staffId) => api.delete(`/admin/staff/${staffId}`);
export const assignStaffToModule = (moduleId, staffId) => {
  return api.post('/admin/assign-staff', { moduleId, staffId });
};

export default api;
