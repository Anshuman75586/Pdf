# React.js PDF Editor

A high-performance React.js application for viewing, annotating, and signing PDF documents.

## 📝 Objective

Build a smooth PDF editor where users can:

- Load large PDFs quickly.
- Add comments, signatures, and stamps.
- Save the file with all annotations flattened into the document.

## Features

### 1. Authentication

- Simple login with username and password to access the app.

### 2. PDF Viewer & Performance

- Browse and upload PDFs from your computer.
- Handles large PDFs (100+ pages) without lag.
- Sidebar with page thumbnails for fast navigation.

### 3. Annotation Tools

- Comment: Add text anywhere on the PDF. Choose font and color.
- Signatures: Three options:
  - Typed: Type your name.
  - Drawn: Draw your signature on a canvas.
  - Uploaded:Upload an image of your signature.
- Stamps: Create stamps with custom text and background colors.

### 4. Saving & Export

- All annotations are merged into the PDF (“flattened”).
- Output is final—annotations are no longer editable layers.

---

## Evaluation Focus

- Performance: Smooth PDF rendering and navigation.
- Functionality: Signature and stamp tools must work seamlessly.
- Technical Approach: Flatten annotations properly into the PDF.
- Code Quality: Clean component structure and state management.

---

## 📂 Project Structure

src/
├── components/
│ ├── auth/ Login screen
│ │ └── Login.jsx
│ │
│ ├── common/ Shared UI
│ │ └── Header.jsx
│ │
│ ├── pdf/ PDF editor components
│ │ ├── PdfViewer.jsx
│ │ ├── CanvasArea.jsx
│ │ ├── Sidebar.jsx
│ │ ├── Toolbar.jsx
│ │ ├── PageNavigation.jsx
│ │ └── modal/
│ │ ├── StampModal.jsx
│ │ └── SignatureModal.jsx
│ │
│ └── hooks/ Custom reusable logic
│ ├── usePdfLoader.js
│ ├── usePdfPageRender.js
│ ├── usePdfControls.js
│ ├── useCanvasTools.js
│ └── usePdfSaver.js
│
├── App.jsx Root component
├── main.jsx Entry point
├── index.css Global styles

## Libraries Used

| Library                          | Purpose                                        |
| -------------------------------- | ---------------------------------------------- |
| `pdfjs-dist`                     | Load and render PDFs in the browser.           |
| `pdf-lib`                        | Add annotations and flatten PDFs for saving.   |
| `react-pdf`                      | Optional React PDF rendering.                  |
| `react-konva`                    | Canvas rendering for annotations.              |
| `konva`                          | Core canvas library used by `react-konva`.     |
| `fabric` / `fabric-pure-browser` | Optional advanced canvas tools.                |
| `signature_pad`                  | Draw hand-written signatures.                  |
| `jspdf`                          | PDF generation or adding images.               |
| `react-icons`                    | Toolbar icons.                                 |
| `lucide-react`                   | Optional extra icons.                          |
| `tailwindcss`                    | Styling framework.                             |
| `use-image`                      | Load images for stamps or uploaded signatures. |
| `react` / `react-dom`            | Core React libraries.                          |

🚀 Getting Started
Follow these steps to run the project locally:

1. Clone the repository
   git clone https://github.com/Anshuman75586/Pdf.git
   cd pdf-editor

2. Install dependencies
   Make sure you have Node.js (>=16) and npm installed. Then run:
   npm install

3. Start the development server
   npm run dev

4. Open in browser
   By default, Vite runs on port 5173. Open:
   http://localhost:5173

5. Login and explore

- Use the Login screen (components/auth/Login.jsx) to access the app.
- Upload a PDF file to start viewing, annotating, and signing.
- Try out the Toolbar, Sidebar, CanvasArea, and Modals for full functionality.
