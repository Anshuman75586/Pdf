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
    { id: "comment", icon: <FaComment />, label: "Comment" },
    { id: "draw", icon: <FaPen />, label: "Draw" },
    { id: "eraser", icon: <FaEraser />, label: "Eraser" },
    { id: "signature", icon: <FaSignature />, label: "Signature" },
  ];

  return (
    <div className="flex items-center gap-3 p-2 border-b bg-white relative">
      {/* Tool Buttons */}
      {tools.map((t) => (
        <div key={t.id} className="flex flex-col items-center">
          <button
            className={`p-2 rounded-md hover:bg-gray-200 ${
              activeTool === t.id ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => setActiveTool(t.id)}
          >
            {t.icon}
          </button>
          <span className="text-xs">{t.label}</span>
        </div>
      ))}

      {/* Stamp Button */}
      <div className="flex flex-col items-center">
        <button
          className="p-2 rounded-md hover:bg-gray-200"
          onClick={onShowStampModal}
        >
          <FaStamp />
        </button>
        <span className="text-xs">Stamp</span>
      </div>

      {/* Color Picker */}
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="ml-4 w-10 h-8 p-0 border rounded cursor-pointer"
      />

      {/* Font Selector */}
      <select
        value={font}
        onChange={(e) => setFont(e.target.value)}
        className="ml-2 border px-2 py-1 rounded"
      >
        <option value="Arial">Arial</option>
        <option value="Helvetica">Helvetica</option>
        <option value="Times New Roman">Times</option>
        <option value="Courier New">Courier</option>
        <option value="cursive">Cursive</option>
      </select>

      <button
        onClick={onSavePdf}
        className="ml-auto px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-1"
      >
        <FaSave /> Save
      </button>

      {/* Change PDF */}
      <button
        onClick={onChangePdf}
        className="px-3 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600 flex items-center gap-1 ml-2"
      >
        <FaFilePdf /> Change PDF
      </button>
    </div>
  );
};

export default Toolbar;
