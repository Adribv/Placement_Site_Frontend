import React, { createContext, useContext, useState, useEffect } from 'react';
import sampleData from '../../sampleData.json';

const SampleDataContext = createContext();

export const useSampleData = () => {
  const context = useContext(SampleDataContext);
  if (!context) {
    throw new Error('useSampleData must be used within a SampleDataProvider');
  }
  return context;
};

export const SampleDataProvider = ({ children }) => {
  const [data, setData] = useState(sampleData);

  const updateScores = (moduleId, scores) => {
    setData(prevData => {
      const newData = { ...prevData };
      
      scores.forEach(({ registrationNumber, score }) => {
        // Find the student
        const student = newData.students.find(s => s.regNo === registrationNumber);
        if (!student) return;

        // Find or create training progress
        let progress = newData.trainingProgress.find(
          tp => tp.student === student._id && tp.training === moduleId
        );

        if (!progress) {
          // Create new progress entry
          progress = {
            _id: `temp_${Date.now()}_${student._id}_${moduleId}`,
            student: student._id,
            training: moduleId,
            attendance: [],
            examScores: [],
            averageScore: score,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          newData.trainingProgress.push(progress);

          // Update student's trainings if not already present
          if (!student.trainings.some(t => t.moduleId === moduleId)) {
            student.trainings.push({ moduleId });
            student.numTrainingsCompleted = student.trainings.length;
          }
        }

        // Add or update exam score
        const examNumber = progress.examScores.length + 1;
        progress.examScores.push({
          exam: examNumber,
          score: score
        });

        // Update average score
        progress.averageScore = progress.examScores.reduce((acc, curr) => acc + curr.score, 0) / progress.examScores.length;
        progress.updatedAt = new Date().toISOString();
      });

      // Store updated data in localStorage for persistence
      localStorage.setItem('sampleData', JSON.stringify(newData));
      return newData;
    });
  };

  // Load data from localStorage on initial mount
  useEffect(() => {
    const savedData = localStorage.getItem('sampleData');
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, []);

  return (
    <SampleDataContext.Provider value={{ data, updateScores }}>
      {children}
    </SampleDataContext.Provider>
  );
}; 