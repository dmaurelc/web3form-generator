import React from 'react';

const SectionIcon = ({ columns }) => {
  const getPath = () => {
    switch (columns) {
      case 1:
        return <path fill="currentColor" d="M3 3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3H3zm-1 3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6z"/>;
      case 2:
        return <path fill="currentColor" d="M6 3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3zM4 6a2 2 0 0 1 2-2h3.5v12H6a2 2 0 0 1-2-2zm6.5 10V4H14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2z"/>;
      case 3:
        return <path fill="currentColor" d="M3 3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3H3zm-1 3a1 1 0 0 1 1-1h3.5v10H3a1 1 0 0 1-1-1V6zm5.5 9V4H11v10H7.5zm4.5 0V4h3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-3z"/>;
      case 4:
        return <path fill="currentColor" d="M3 3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3H3zm-1 3a1 1 0 0 1 1-1h2.5v10H3a1 1 0 0 1-1-1V6zm4.5 9V4H9v10H6.5zm3.5 0V4h3v10h-3zm4 0V4h2.5a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H14z"/>;
      default:
        return null;
    }
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20" className="mr-2">
      {getPath()}
    </svg>
  );
};

export default SectionIcon;