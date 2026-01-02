const usePdfControls = ({ totalPages, setCurrentPage, onChangePdf }) => {
  const handleChangePdf = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf";
    input.onchange = (e) =>
      e.target.files?.[0] && onChangePdf(e.target.files[0]);
    input.click();
  };

  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));

  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return { handleChangePdf, goPrev, goNext };
};

export default usePdfControls;
