import React from 'react';

const SectionIcon = ({ columns }) => {
  const getPath = () => {
    switch (columns) {
      case 1:
        return <rect x="3" y="3" width="14" height="14" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="0.5" />;
      case 2:
        return (
          <>
            <rect x="3" y="3" width="6" height="14" rx="1" ry="1" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <rect x="11" y="3" width="6" height="14" rx="1" ry="1" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </>
        );
      case 3:
        return (
          <>
            <rect x="3" y="3" width="4" height="14" rx="1" ry="1" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <rect x="8" y="3" width="4" height="14" rx="1" ry="1" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <rect x="13" y="3" width="4" height="14" rx="1" ry="1" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </>
        );
      case 4:
        return (
          <>
            <rect x="3" y="3" width="3" height="14" rx="1" ry="1" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <rect x="7" y="3" width="3" height="14" rx="1" ry="1" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <rect x="11" y="3" width="3" height="14" rx="1" ry="1" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <rect x="15" y="3" width="3" height="14" rx="1" ry="1" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20" stroke="currentColor">
      {getPath()}
    </svg>
  );
};

export default SectionIcon;