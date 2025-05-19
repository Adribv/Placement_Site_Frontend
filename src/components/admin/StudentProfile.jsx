import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 1rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const ProfileImage = styled.img`
  margin-bottom: 1rem;
  width: 12rem;
  height: 12rem;
  object-fit: contain;
`;

const InfoText = styled.p`
  margin-bottom: 0.5rem;
`;

const Strong = styled.strong`
  font-weight: 600;
`;

const SubTitle = styled.h3`
  margin-top: 1rem;
  font-weight: 600;
`;

const TrainingList = styled.ul`
  list-style-type: disc;
  list-style-position: inside;
`;

const StudentProfile = ({ student }) => {
  if (!student) {
    return <div>Select a student to view details</div>;
  }

  // Determine animation image based on number of trainings completed
  const getAnimationImage = (numTrainings) => {
    if (numTrainings === 0) return '/assets/child.png';
    if (numTrainings < 3) return '/assets/teen.png';
    if (numTrainings < 6) return '/assets/young_adult.png';
    return '/assets/adult.png';
  };

  return (
    <Container>
      <Title>{student.name} - Profile</Title>
      <ProfileImage
        src={getAnimationImage(student.numTrainingsCompleted)}
        alt="Training Progress Animation"
      />
      <InfoText><Strong>Registration No:</Strong> {student.regNo}</InfoText>
      <InfoText><Strong>Email:</Strong> {student.email}</InfoText>
      <InfoText><Strong>Batch:</Strong> {student.batch}</InfoText>
      <InfoText><Strong>Passout Year:</Strong> {student.passoutYear}</InfoText>
      <InfoText><Strong>Number of Trainings Completed:</Strong> {student.numTrainingsCompleted}</InfoText>
      <SubTitle>Trainings Attended:</SubTitle>
      <TrainingList>
        {student.trainings && student.trainings.length > 0 ? (
          student.trainings.map((training, idx) => (
            <li key={idx}>{training.moduleId}</li> // moduleId can be replaced with module title if available
          ))
        ) : (
          <li>No trainings attended yet.</li>
        )}
      </TrainingList>
    </Container>
  );
};

export default StudentProfile;
