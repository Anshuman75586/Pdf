/**
 * FileUpload Component
 * Allows the user to select a PDF file
 */

import React from "react";

const FileUpload = ({ onFileSelect }) => {
  const fileInputRef = React.useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      onFileSelect(file);
    } else {
      alert("Please select a PDF file");
    }
  };

  return (
    <div className="text-center py-12">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        onClick={() => fileInputRef.current.click()}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700  transition cursor-pointer"
      >
        Choose PDF
      </button>
    </div>
  );
};

export default FileUpload;
