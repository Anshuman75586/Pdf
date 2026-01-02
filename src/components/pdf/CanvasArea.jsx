import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Text, Line, Image, Rect, Group } from "react-konva";
import SignaturePad from "signature_pad";

const CanvasArea = ({
  pdfDoc,
  currentPage,
  annotations,
  setAnnotations,
  activeTool,
  setActiveTool,
  font,
  color,
  pendingStamp,
  setPendingStamp,
}) => {
  const pdfCanvasRef = useRef(null);
  const sigCanvasRef = useRef(null);
  const sigPadRef = useRef(null);

  const [stageSize, setStageSize] = useState({ width: 800, height: 1000 });
  const [newLine, setNewLine] = useState(null);
  const [commentInput, setCommentInput] = useState(null);
  const [signatureImage, setSignatureImage] = useState(null);
  const [sigMode, setSigMode] = useState("draw");
  const [typedSignature, setTypedSignature] = useState("");
  const [showSignaturePanel, setShowSignaturePanel] = useState(false);

  useEffect(() => {
    setShowSignaturePanel(activeTool === "signature");
    if (activeTool === "signature") setSigMode("draw");
  }, [activeTool]);

  useEffect(() => {
    if (sigMode === "draw" && sigCanvasRef.current) {
      sigPadRef.current = new SignaturePad(sigCanvasRef.current, {
        penColor: "#000",
      });
    }
  }, [sigMode, sigCanvasRef.current]);

  // Render PDF page
  useEffect(() => {
    if (!pdfDoc || !currentPage) return;
    let renderTask = null;
    const renderPage = async () => {
      const page = await pdfDoc.getPage(currentPage);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = pdfCanvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      setStageSize({ width: viewport.width, height: viewport.height });

      if (renderTask) renderTask.cancel();
      renderTask = page.render({ canvasContext: ctx, viewport });
      try {
        await renderTask.promise;
      } catch (err) {
        if (err?.name !== "RenderingCancelledException") console.error(err);
      }
    };
    renderPage();
    return () => renderTask && renderTask.cancel();
  }, [pdfDoc, currentPage]);

  const handleMouseDown = (e) => {
    if (activeTool === "draw") {
      const pos = e.target.getStage().getPointerPosition();
      setNewLine({
        points: [pos.x, pos.y],
        stroke: color,
        strokeWidth: 3,
        id: String(Date.now()),
        page: currentPage,
        type: "draw",
      });
    }
  };
  const handleMouseMove = (e) => {
    if (activeTool === "draw" && newLine) {
      const pos = e.target.getStage().getPointerPosition();
      setNewLine((prev) => ({
        ...prev,
        points: [...prev.points, pos.x, pos.y],
      }));
    }
  };
  const handleMouseUp = () => {
    if (activeTool === "draw" && newLine) {
      setAnnotations((prev) => [...prev, newLine]);
      setNewLine(null);
    }
  };

  const handleStageClick = (e) => {
    const pos = e.target.getStage().getPointerPosition();

    if (activeTool === "stamp" && pendingStamp?.text) {
      setAnnotations((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          type: "stamp",
          page: currentPage,
          x: pos.x,
          y: pos.y,
          text: pendingStamp.text,
          width: pendingStamp.width || 120,
          height: pendingStamp.height || 50,
          bg: pendingStamp.bg || "#FF0000",
          color: pendingStamp.color || "#FFFFFF",
        },
      ]);
      setPendingStamp(null);
      setActiveTool("comment");
      return;
    }

    if (activeTool === "comment") {
      setCommentInput({
        x: pos.x,
        y: pos.y,
        text: "",
        font,
        color,
        id: String(Date.now()),
        page: currentPage,
        type: "comment",
      });
    }

    if (activeTool === "signature") {
      if ((sigMode === "draw" || sigMode === "upload") && signatureImage) {
        setAnnotations((prev) => [
          ...prev,
          {
            id: String(Date.now()),
            type: "signature",
            page: currentPage,
            x: pos.x,
            y: pos.y,
            image: signatureImage,
            width: 200,
            height: 80,
          },
        ]);
        setSignatureImage(null);
      }
      if (sigMode === "typed" && typedSignature.trim()) {
        setAnnotations((prev) => [
          ...prev,
          {
            id: String(Date.now()),
            type: "signature-text",
            page: currentPage,
            x: pos.x,
            y: pos.y,
            text: typedSignature,
          },
        ]);
        setTypedSignature("");
      }
    }
  };

  const saveComment = () => {
    if (commentInput && commentInput.text.trim() !== "")
      setAnnotations((prev) => [...prev, commentInput]);
    setCommentInput(null);
  };
  const handleDelete = (id) =>
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
  const currentAnnotations = annotations.filter((a) => a.page === currentPage);

  useEffect(() => {
    if (activeTool === "signature" && sigMode === "upload") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setSignatureImage(reader.result);
        reader.readAsDataURL(file);
      };
      input.click();
    }
  }, [sigMode, activeTool]);

  return (
    <div className="flex-1 overflow-auto bg-gray-200 flex justify-center items-start py-4">
      <div style={{ position: "relative" }}>
        <canvas
          ref={pdfCanvasRef}
          className="bg-white shadow-lg"
          style={{ display: "block", margin: "0 auto" }}
        />
        <Stage
          width={stageSize.width}
          height={stageSize.height}
          style={{ position: "absolute", top: 0, left: 0 }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={handleStageClick}
        >
          <Layer>
            {currentAnnotations.map((a) => {
              if (a.type === "comment")
                return (
                  <Text
                    key={a.id}
                    x={a.x}
                    y={a.y}
                    text={a.text}
                    fontSize={16}
                    fill={a.color}
                    fontFamily={a.font}
                    draggable
                    onDragEnd={(e) =>
                      setAnnotations((prev) =>
                        prev.map((item) =>
                          item.id === a.id
                            ? { ...item, x: e.target.x(), y: e.target.y() }
                            : item
                        )
                      )
                    }
                    onClick={() =>
                      activeTool === "eraser" && handleDelete(a.id)
                    }
                  />
                );
              if (a.type === "draw")
                return (
                  <Line
                    key={a.id}
                    points={a.points}
                    stroke={a.stroke}
                    strokeWidth={a.strokeWidth}
                    tension={0.5}
                    lineCap="round"
                    onClick={() =>
                      activeTool === "eraser" && handleDelete(a.id)
                    }
                  />
                );
              if (a.type === "signature") {
                const img = new window.Image();
                img.src = a.image;
                return (
                  <Image
                    key={a.id}
                    x={a.x}
                    y={a.y}
                    width={a.width}
                    height={a.height}
                    image={img}
                    draggable
                    onClick={() =>
                      activeTool === "eraser" && handleDelete(a.id)
                    }
                  />
                );
              }
              if (a.type === "signature-text")
                return (
                  <Text
                    key={a.id}
                    x={a.x}
                    y={a.y}
                    text={a.text}
                    fontSize={26}
                    fontFamily="cursive"
                    fill="#000"
                    draggable
                    onClick={() =>
                      activeTool === "eraser" && handleDelete(a.id)
                    }
                  />
                );
              if (a.type === "stamp")
                return (
                  <Group
                    key={a.id}
                    x={a.x}
                    y={a.y}
                    draggable
                    onDragEnd={(e) =>
                      setAnnotations((prev) =>
                        prev.map((item) =>
                          item.id === a.id
                            ? { ...item, x: e.target.x(), y: e.target.y() }
                            : item
                        )
                      )
                    }
                    onClick={() =>
                      activeTool === "eraser" && handleDelete(a.id)
                    }
                  >
                    <Rect
                      width={a.width}
                      height={a.height}
                      fill={a.bg}
                      cornerRadius={5}
                    />
                    <Text
                      y={a.height / 4}
                      width={a.width}
                      text={a.text}
                      fontSize={20}
                      fill={a.color}
                      align="center"
                    />
                  </Group>
                );
              return null;
            })}
            {newLine && (
              <Line
                points={newLine.points}
                stroke={newLine.stroke}
                strokeWidth={newLine.strokeWidth}
                tension={0.5}
                lineCap="round"
              />
            )}
          </Layer>
        </Stage>

        {commentInput && (
          <input
            autoFocus
            value={commentInput.text}
            onChange={(e) =>
              setCommentInput((prev) => ({ ...prev, text: e.target.value }))
            }
            onBlur={saveComment}
            onKeyDown={(e) => e.key === "Enter" && saveComment()}
            style={{
              position: "absolute",
              top: commentInput.y,
              left: commentInput.x,
              zIndex: 10,
              border: "1px solid #333",
              fontSize: 14,
              padding: 2,
            }}
          />
        )}

        {showSignaturePanel && (
          <div
            style={{
              position: "absolute",
              top: 50,
              left: 50,
              width: 300,
              backgroundColor: "white",
              padding: 12,
              borderRadius: 8,
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              zIndex: 50,
            }}
          >
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-700">Add Signature</span>
              <button onClick={() => setShowSignaturePanel(false)}>X</button>
            </div>
            <div className="flex gap-2 mb-2">
              <button
                className={`flex-1 py-1 rounded-md ${
                  sigMode === "draw" ? "bg-blue-500 text-white" : "bg-gray-100"
                }`}
                onClick={() => {
                  setSigMode("draw");
                  sigPadRef.current?.clear();
                }}
              >
                Draw
              </button>
              <button
                className={`flex-1 py-1 rounded-md ${
                  sigMode === "typed" ? "bg-blue-500 text-white" : "bg-gray-100"
                }`}
                onClick={() => setSigMode("typed")}
              >
                Type
              </button>
              <button
                className={`flex-1 py-1 rounded-md ${
                  sigMode === "upload"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100"
                }`}
                onClick={() => setSigMode("upload")}
              >
                Upload
              </button>
            </div>
            {sigMode === "draw" && (
              <>
                <canvas
                  ref={sigCanvasRef}
                  width={280}
                  height={120}
                  className="border rounded"
                  style={{ cursor: "crosshair", background: "#f9f9f9" }}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      if (sigPadRef.current && !sigPadRef.current.isEmpty())
                        setSignatureImage(sigPadRef.current.toDataURL());
                    }}
                    className="flex-1 bg-green-500 text-white rounded py-1"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => sigPadRef.current?.clear()}
                    className="flex-1 bg-red-500 text-white rounded py-1"
                  >
                    Clear
                  </button>
                </div>
              </>
            )}
            {sigMode === "typed" && (
              <input
                value={typedSignature}
                onChange={(e) => setTypedSignature(e.target.value)}
                placeholder="Type your signature"
                className="border p-1 w-full"
              />
            )}
            {sigMode === "upload" && (
              <span>Select an image to use as signature</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvasArea;
