import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { updateProfilePicture } from '../../services/api';

const growAnimation = keyframes`
  0% { transform: scale(0.8); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const AvatarContainer = styled.div`
  width: 150px;
  height: 150px;
  position: relative;
  animation: ${growAnimation} 0.5s ease-out;
`;

const AvatarImage = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: #4a5568;
  border: 4px solid ${props => {
    switch (props.level) {
      case 1: return '#48bb78'; // Green for beginner
      case 2: return '#4299e1'; // Blue for intermediate
      case 3: return '#9f7aea'; // Purple for advanced
      case 4: return '#f6ad55'; // Orange for expert
      default: return '#48bb78';
    }
  }};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const ProfilePic = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const EditOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;
  
  ${AvatarImage}:hover & {
    opacity: 1;
  }
`;

const EditIcon = styled.span`
  color: white;
  font-size: 1.5rem;
`;

const FileInput = styled.input`
  display: none;
`;

const LevelBadge = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: ${props => {
    switch (props.level) {
      case 1: return '#48bb78';
      case 2: return '#4299e1';
      case 3: return '#9f7aea';
      case 4: return '#f6ad55';
      default: return '#48bb78';
    }
  }};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProgressText = styled.div`
  text-align: center;
  margin-top: 1rem;
  color: #4a5568;
  font-size: 0.875rem;
`;

const StatusMessage = styled.div`
  text-align: center;
  font-size: 0.75rem;
  margin-top: 0.5rem;
  color: ${props => props.error ? '#e53e3e' : '#38a169'};
  height: 1rem;
`;

const StudentAvatar = ({ level = 1, completedModules, profilePicture }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState({ message: '', isError: false });
  const [localProfilePic, setLocalProfilePic] = useState('');
  
  // Set local profile picture when prop changes
  useEffect(() => {
    if (profilePicture) {
      setLocalProfilePic(profilePicture);
    }
  }, [profilePicture]);

  const getAvatarEmoji = (level) => {
    switch (level) {
      case 1: return '👶';
      case 2: return '🧒';
      case 3: return '🧑';
      case 4: return '👨‍🎓';
      default: return '👶';
    }
  };

  const getLevelText = (level) => {
    switch (level) {
      case 1: return 'Beginner';
      case 2: return 'Intermediate';
      case 3: return 'Advanced';
      case 4: return 'Expert';
      default: return 'Beginner';
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.match(/image\/(jpeg|jpg|png|gif)/i)) {
      setStatus({
        message: 'Please upload an image file (JPEG, PNG, GIF)',
        isError: true
      });
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setStatus({
        message: 'File is too large (max 5MB)',
        isError: true
      });
      return;
    }

    try {
      setIsUploading(true);
      setStatus({ message: 'Uploading...', isError: false });
      
      const response = await updateProfilePicture(file);
      console.log('Profile picture upload response:', response);
      
      // Update the local state with the new profile picture URL
      const newProfilePicUrl = response.data.student.profilePicture;
      console.log('New profile picture URL:', newProfilePicUrl);
      
      setLocalProfilePic(newProfilePicUrl);
      setStatus({ message: 'Profile picture updated!', isError: false });
      
      // Clear the status message after 3 seconds
      setTimeout(() => {
        setStatus({ message: '', isError: false });
      }, 3000);
    } catch (error) {
      console.error('Profile picture upload error:', error);
      setStatus({
        message: error.response?.data?.message || 'Failed to upload image',
        isError: true
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageError = () => {
    console.log('Image failed to load:', localProfilePic);
    setLocalProfilePic('');
    setStatus({
      message: 'Failed to load profile picture',
      isError: true
    });
  };

  return (
    <div>
      <AvatarContainer>
        <AvatarImage level={level}>
          {localProfilePic ? (
            <ProfilePic 
              src={localProfilePic} 
              alt="Profile" 
              onError={handleImageError}
            />
          ) : (
            getAvatarEmoji(level)
          )}
          <EditOverlay onClick={() => document.getElementById('profile-picture-upload').click()}>
            <EditIcon>📷</EditIcon>
          </EditOverlay>
          <FileInput
            id="profile-picture-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </AvatarImage>
        <LevelBadge level={level}>
          Level {level}
        </LevelBadge>
      </AvatarContainer>
      <ProgressText>
        {getLevelText(level)} • {completedModules} modules completed
      </ProgressText>
      <StatusMessage error={status.isError}>
        {status.message}
      </StatusMessage>
    </div>
  );
};

export default StudentAvatar; 