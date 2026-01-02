import { useState } from "react";
import FileUpload from "./components/pdf/FileUpload";
import PdfViewer from "./components/pdf/PdfViewer";
import Login from "./components/auth/Login";
import Header from "./components/common/Header";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);

  const handleLogin = () => {
    setPdfFile(null);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setPdfFile(null);
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <Header
        title="PDF Editor"
        rightElement={
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Logout
          </button>
        }
      />

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {!pdfFile ? (
          <FileUpload onFileSelect={setPdfFile} />
        ) : (
          <PdfViewer file={pdfFile} onChangePdf={setPdfFile} />
        )}
      </div>
    </div>
  );
};

export default App;
