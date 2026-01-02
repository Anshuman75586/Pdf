const PageNavigation = ({ currentPage, totalPages, onPrev, onNext }) => (
  <div className="flex justify-center items-center gap-4 p-2 border-t bg-white">
    <button onClick={onPrev} disabled={currentPage <= 1}>
      Prev
    </button>
    <span>
      {currentPage} / {totalPages}
    </span>
    <button onClick={onNext} disabled={currentPage >= totalPages}>
      Next
    </button>
  </div>
);

export default PageNavigation;
