// MajorCard.jsx
import React from 'react';

const MajorCard = ({ majorData }) => {
  // Log the incoming majorData to debug
  console.log('majorData in MajorCard:', majorData);

  // Check if majorData exists and is an object
  if (!majorData || typeof majorData !== 'object') {
    return <div>Error: Invalid major data.</div>;
  }

  return (
    <div>
      {/* Render the majorData directly, no JSON.parse needed */}
      <h2>{majorData.slug || 'No name available'}</h2>
      <p>{majorData.description || 'No description available'}</p>
    </div>
  );
};

export default MajorCard;