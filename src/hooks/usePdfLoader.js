import { useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";

const usePdfLoader = ({
  file,
  setPdfDoc,
  setTotalPages,
  setCurrentPage,
  setAnnotations,
  setThumbnails,
}) => {
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
};

export default usePdfLoader;
