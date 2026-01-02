const usePdfSaver = ({ file, annotations }) => {
  const handleSave = async () => {
    if (!file) return;

    const { PDFDocument, rgb } = await import("pdf-lib");
    const pdfBytes = await file.arrayBuffer();
    const pdfDocLib = await PDFDocument.load(pdfBytes);
    const pages = pdfDocLib.getPages();

    annotations.forEach((a) => {
      if (a.type !== "comment") return;

      const page = pages[a.page - 1];
      const { height } = page.getSize();
      const col = a.color || "#0000FF";

      page.drawText(a.text, {
        x: a.x,
        y: height - a.y,
        size: 16,
        color: rgb(
          parseInt(col.slice(1, 3), 16) / 255,
          parseInt(col.slice(3, 5), 16) / 255,
          parseInt(col.slice(5, 7), 16) / 255
        ),
      });
    });

    const bytes = await pdfDocLib.save();
    const blob = new Blob([bytes], { type: "application/pdf" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Updated.pdf";
    link.click();
  };

  return { handleSave };
};

export default usePdfSaver;
