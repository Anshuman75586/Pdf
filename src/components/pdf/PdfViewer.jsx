import { useEffect, useState, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";

import Toolbar from "./Toolbar";
import Sidebar from "./Sidebar";
import PageNavigation from "./PageNavigation";
import CanvasArea from "./CanvasArea";
import StampModal from "./modal/StampModal";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const PdfViewer = ({ file, onChangePdf }) => {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [thumbnails, setThumbnails] = useState([]);
  const [annotations, setAnnotations] = useState([]);

  const [activeTool, setActiveTool] = useState("comment");
  const [color, setColor] = useState("#0000FF");
  const [font, setFont] = useState("Arial");

  const [showStampModal, setShowStampModal] = useState(false);
  const [pendingStamp, setPendingStamp] = useState(null);

  const stageRef = useRef();

  // Load PDF
  useEffect(() => {
    if (!file) return;

    const loadPdf = async () => {
      const url = URL.createObjectURL(file);
      const pdf = await pdfjsLib.getDocument(url).promise;

      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);
      setCurrentPage(1);
      setAnnotations([]);

      const thumbs = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.2 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: ctx, viewport }).promise;
        thumbs.push(canvas.toDataURL());
      }
      setThumbnails(thumbs);
    };

    loadPdf();
  }, [file]);

  // Save PDF
  const handleSave = async () => {
    if (!pdfDoc) return;
    const { PDFDocument } = await import("pdf-lib");

    const pdfBytes = await file.arrayBuffer();
    const pdfDocLib = await PDFDocument.load(pdfBytes);
    const pages = pdfDocLib.getPages();

    // Render annotations from Stage to images per page
    const pdfAnnotationsByPage = {};
    annotations.forEach((a) => {
      if (!pdfAnnotationsByPage[a.page]) pdfAnnotationsByPage[a.page] = [];
      pdfAnnotationsByPage[a.page].push(a);
    });

    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = pages[i - 1];
      const { width, height } = page.getSize();

      // Create canvas for page
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = width;
      tempCanvas.height = height;
      const ctx = tempCanvas.getContext("2d");

      const pdfPage = await pdfDoc.getPage(i);
      const viewport = pdfPage.getViewport({ scale: 1 });
      await pdfPage.render({ canvasContext: ctx, viewport }).promise;

      // Draw annotations
      const anns = pdfAnnotationsByPage[i] || [];
      anns.forEach((a) => {
        ctx.save();
        if (a.type === "draw") {
          ctx.strokeStyle = a.stroke;
          ctx.lineWidth = a.strokeWidth;
          ctx.beginPath();
          ctx.moveTo(a.points[0], a.points[1]);
          for (let j = 2; j < a.points.length; j += 2) {
            ctx.lineTo(a.points[j], a.points[j + 1]);
          }
          ctx.stroke();
        } else if (a.type === "comment") {
          ctx.fillStyle = a.color;
          ctx.font = `16px ${a.font}`;
          ctx.fillText(a.text, a.x, a.y);
        } else if (a.type === "stamp") {
          ctx.fillStyle = a.bg;
          ctx.fillRect(a.x, a.y, a.width, a.height);
          ctx.fillStyle = a.color;
          ctx.font = "20px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(a.text, a.x + a.width / 2, a.y + a.height / 2);
        } else if (a.type === "signature" || a.type === "signature-text") {
          if (a.type === "signature") {
            const img = new Image();
            img.src = a.image;
            ctx.drawImage(img, a.x, a.y, a.width, a.height);
          } else {
            ctx.fillStyle = "#000";
            ctx.font = "26px cursive";
            ctx.fillText(a.text, a.x, a.y);
          }
        }
        ctx.restore();
      });

      const imgBytes = tempCanvas.toDataURL("image/png");
      const pngImage = await pdfDocLib.embedPng(imgBytes);
      page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width,
        height,
      });
    }

    const bytes = await pdfDocLib.save();
    const blob = new Blob([bytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Updated.pdf";
    link.click();
  };

  // Change PDF
  const handleChangePdf = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf";
    input.onchange = (e) =>
      e.target.files?.[0] && onChangePdf(e.target.files[0]);
    input.click();
  };

  const addStamp = (stamp) => {
    setPendingStamp(stamp);
    setActiveTool("stamp");
    setShowStampModal(false);
  };

  return (
    <div className="h-screen flex flex-col">
      <Toolbar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        color={color}
        setColor={setColor}
        font={font}
        setFont={setFont}
        onSavePdf={handleSave}
        onChangePdf={handleChangePdf}
        onShowStampModal={() => setShowStampModal(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          thumbnails={thumbnails}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />

        <CanvasArea
          pdfDoc={pdfDoc}
          currentPage={currentPage}
          annotations={annotations}
          setAnnotations={setAnnotations}
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          font={font}
          color={color}
          pendingStamp={pendingStamp}
          setPendingStamp={setPendingStamp}
        />
      </div>

      <PageNavigation
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
        onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
      />

      {showStampModal && (
        <StampModal onAdd={addStamp} onClose={() => setShowStampModal(false)} />
      )}
    </div>
  );
};

export default PdfViewer;
