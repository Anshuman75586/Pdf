import { useState } from "react";

const StampModal = ({ onAdd, onClose }) => {
  const [text, setText] = useState("");
  const [bg, setBg] = useState("#ff0000");

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded shadow-lg w-64">
        <input
          placeholder="Stamp text"
          className="border p-1 mb-2 w-full rounded"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="color"
          value={bg}
          onChange={(e) => setBg(e.target.value)}
          className="w-full mb-2 h-8"
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => {
              onAdd({ text, bg });
              onClose();
            }}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Add
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StampModal;
