const Sidebar = ({ thumbnails, currentPage, onPageChange }) => {
  return (
    <div className="w-24 overflow-y-auto border-r bg-white p-2">
      {thumbnails.map((thumb, i) => (
        <img
          key={i}
          src={thumb}
          className={`w-full mb-2 cursor-pointer border-2 ${
            currentPage === i + 1 ? "border-purple-500" : "border-transparent"
          }`}
          onClick={() => onPageChange(i + 1)} // index + 1 because PDF pages start at 1
        />
      ))}
    </div>
  );
};

export default Sidebar;
