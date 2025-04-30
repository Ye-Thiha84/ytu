// MajorList.jsx (updated)
import React, { useEffect, useState } from 'react';
import { fetchMajors } from '../lib/fetchMajors';
import MajorCard from './MajorCard';
import ErrorBoundary from './ErrorBoundary';

const MajorList = () => {
  const [majors, setMajors] = useState([]);

  useEffect(() => {
    const loadMajors = async () => {
      const data = await fetchMajors();
      setMajors(data);
    };
    loadMajors();
  }, []);

  return (
    <div>
      {majors.map((major, index) => (
        <ErrorBoundary key={index}>
          <MajorCard majorData={major} />
        </ErrorBoundary>
      ))}
    </div>
  );
};

export default MajorList;