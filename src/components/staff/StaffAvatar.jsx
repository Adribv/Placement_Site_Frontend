import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { updateStaffProfilePicture } from '../../services/api';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { Tooltip } from '@mui/material';

const ProfileContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const StyledAvatar = styled(Avatar)`
  width: 100px !important;
  height: 100px !important;
  border: 3px solid #1976d2;
  position: relative;
`;

const FileInput = styled.input`
  display: none;
`;

const CameraIconButton = styled(IconButton)`
  position: absolute !important;
  bottom: 0;
  right: 0;
  background-color: #f5f5f5 !important;
  padding: 6px !important;
  &:hover {
    background-color: #e0e0e0 !important;
  }
`;

const StatusMessage = styled(Typography)`
  font-size: 0.75rem !important;
  color: ${props => props.error ? '#d32f2f' : '#2e7d32'} !important;
  height: 20px;
`;

const StaffAvatar = ({ name, profilePicture }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState({ message: '', isError: false });
  const [localProfilePic, setLocalProfilePic] = useState('');
  
  // Set local profile picture when prop changes
  useEffect(() => {
    if (profilePicture) {
      setLocalProfilePic(profilePicture);
    }
  }, [profilePicture]);

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
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
      
      const response = await updateStaffProfilePicture(file);
      console.log('Profile picture upload response:', response);
      
      // Update the local state with the new profile picture URL
      const newProfilePicUrl = response.data.staff.profilePicture;
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
    <ProfileContainer>
      <Box position="relative">
        <StyledAvatar
          src={localProfilePic}
          alt={name}
          onError={handleImageError}
        >
          {!localProfilePic && getInitials(name)}
        </StyledAvatar>
        
        <Tooltip title="Upload profile picture">
          <CameraIconButton 
            onClick={() => document.getElementById('staff-profile-picture-upload').click()}
            disabled={isUploading}
            size="small"
          >
            {isUploading ? (
              <CircularProgress size={20} />
            ) : (
              <PhotoCameraIcon fontSize="small" />
            )}
          </CameraIconButton>
        </Tooltip>
        
        <FileInput
          id="staff-profile-picture-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </Box>
      
      <Typography variant="subtitle1">{name || 'Staff'}</Typography>
      
      <StatusMessage error={status.isError} variant="caption">
        {status.message}
      </StatusMessage>
    </ProfileContainer>
  );
};

export default StaffAvatar; 