import { useEffect } from "react";

const usePdfPageRender = ({
  pdfDoc,
  currentPage,
  pdfCanvasRef,
  setStageSize,
}) => {
  useEffect(() => {
    if (!pdfDoc || !currentPage) return;

    const renderPage = async () => {
      const page = await pdfDoc.getPage(currentPage);
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = pdfCanvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      setStageSize({
        width: viewport.width,
        height: viewport.height,
      });

      await page.render({
        canvasContext: ctx,
        viewport,
      }).promise;
    };

    renderPage();
  }, [pdfDoc, currentPage]);
};

export default usePdfPageRender;
