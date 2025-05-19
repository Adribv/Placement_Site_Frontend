import React from 'react';
import styled from 'styled-components';

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1rem;
`;

const TabButton = styled.button`
  padding: 0.5rem 1rem;
  margin-bottom: -1px;
  border-bottom: 2px solid ${props => props.isSelected ? '#2563eb' : 'transparent'};
  font-weight: 600;
  color: ${props => props.isSelected ? '#2563eb' : '#4b5563'};
  transition: all 150ms ease-in-out;

  &:hover {
    color: ${props => props.isSelected ? '#2563eb' : '#3b82f6'};
  }
`;

const CategoryTabs = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <TabContainer>
      {categories.map((category) => (
        <TabButton
          key={category}
          onClick={() => onSelectCategory(category)}
          isSelected={selectedCategory === category}
        >
          {category}
        </TabButton>
      ))}
    </TabContainer>
  );
};

export default CategoryTabs;
