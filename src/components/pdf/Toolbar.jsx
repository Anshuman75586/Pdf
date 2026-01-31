import {
  FaPen,
  FaEraser,
  FaFilePdf,
  FaSave,
  FaStamp,
  FaSignature,
  FaComment,
} from "react-icons/fa";

const Toolbar = ({
  activeTool,
  setActiveTool,
  color,
  setColor,
  font,
  setFont,
  onShowStampModal,
  onSavePdf,
  onChangePdf,
}) => {
  const tools = [
    { id: "comment", icon: FaComment, label: "Comment" },
    { id: "draw", icon: FaPen, label: "Draw" },
    { id: "eraser", icon: FaEraser, label: "Eraser" },
    { id: "signature", icon: FaSignature, label: "Sign" },
  ];

  return (
    <div className="w-full bg-white border-b">
      {/* Mobile-first toolbar */}
      <div className="flex items-center gap-2 px-2 py-2 overflow-x-auto scrollbar-hide">
        {/* Tool buttons */}
        {tools.map(({ id, icon: Icon, label }) => {
          const isActive = activeTool === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTool(id)}
              className={`flex flex-col items-center justify-center min-w-[56px] h-[52px] rounded-lg text-[11px] transition
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <Icon className="text-base mb-0.5" />
              <span className="leading-none">{label}</span>
            </button>
          );
        })}

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200 mx-1" />

        {/* Stamp */}
        <button
          onClick={onShowStampModal}
          className="flex flex-col items-center justify-center min-w-[56px] h-[52px] rounded-lg text-[11px] text-gray-700 hover:bg-gray-100 transition"
        >
          <FaStamp className="text-base mb-0.5" />
          <span>Stamp</span>
        </button>

        {/* Color picker */}
        <div className="flex flex-col items-center justify-center min-w-[56px] h-[52px] rounded-lg hover:bg-gray-100 transition">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-6 h-6 rounded border border-gray-300 cursor-pointer"
          />
          <span className="text-[10px] mt-1 text-gray-600">Color</span>
        </div>

        {/* Font selector */}
        <div className="flex flex-col justify-center min-w-[92px] h-[52px] px-1 rounded-lg hover:bg-gray-100 transition">
          <select
            value={font}
            onChange={(e) => setFont(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-2 py-1 text-[11px] bg-white focus:outline-none"
          >
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Times New Roman">Times</option>
            <option value="Courier New">Courier</option>
            <option value="cursive">Cursive</option>
          </select>
          <span className="text-[10px] text-center mt-0.5 text-gray-600">
            Font
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200 mx-1" />

        {/* Save */}
        <button
          onClick={onSavePdf}
          className="flex items-center justify-center gap-1 min-w-[72px] h-[40px] px-2 bg-green-600 text-white rounded-lg text-[11px] hover:bg-green-700 transition"
        >
          <FaSave className="text-xs" />
          <span>Save</span>
        </button>

        {/* Change PDF */}
        <button
          onClick={onChangePdf}
          className="flex items-center justify-center gap-1 min-w-[96px] h-[40px] px-2 bg-orange-500 text-white rounded-lg text-[11px] hover:bg-orange-600 transition"
        >
          <FaFilePdf className="text-xs" />
          <span>Change</span>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
