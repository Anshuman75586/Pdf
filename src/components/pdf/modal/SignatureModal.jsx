import { useEffect, useRef } from "react";
import SignaturePad from "signature_pad";

const SignatureModal = ({ onSave, onClose }) => {
  const canvasRef = useRef(null);
  const padRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      padRef.current = new SignaturePad(canvasRef.current, {
        penColor: "#000",
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-lg w-80">
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Draw Signature</span>
          <button onClick={onClose}>✕</button>
        </div>

        <canvas
          ref={canvasRef}
          width={300}
          height={120}
          className="border rounded bg-gray-50"
        />

        <div className="flex gap-2 mt-3">
          <button
            className="flex-1 bg-green-500 text-white py-1 rounded"
            onClick={() => {
              if (!padRef.current.isEmpty()) {
                onSave(padRef.current.toDataURL());
                onClose();
              }
            }}
          >
            Save
          </button>

          <button
            className="flex-1 bg-red-500 text-white py-1 rounded"
            onClick={() => padRef.current.clear()}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignatureModal;
