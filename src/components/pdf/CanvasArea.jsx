import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Text, Line, Image, Rect, Group } from "react-konva";
import SignaturePad from "signature_pad";

const MAX_PDF_WIDTH = 900;

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
  const containerRef = useRef(null);
  const pdfCanvasRef = useRef(null);
  const sigCanvasRef = useRef(null);
  const sigPadRef = useRef(null);

  const [stageSize, setStageSize] = useState({ width: 300, height: 400 });
  const [newLine, setNewLine] = useState(null);
  const [commentInput, setCommentInput] = useState(null);
  const [signatureImage, setSignatureImage] = useState(null);
  const [sigMode, setSigMode] = useState("draw");
  const [typedSignature, setTypedSignature] = useState("");
  const [showSignaturePanel, setShowSignaturePanel] = useState(false);

  /* ---------------- Tool state ---------------- */
  useEffect(() => {
    setShowSignaturePanel(activeTool === "signature");
    if (activeTool === "signature") setSigMode("draw");
  }, [activeTool]);

  /* ---------------- Signature Pad (FIXED) ---------------- */
  useEffect(() => {
    if (!showSignaturePanel || sigMode !== "draw") return;
    if (!sigCanvasRef.current) return;

    // Delay ensures modal & canvas are fully rendered
    const timeout = setTimeout(() => {
      const canvas = sigCanvasRef.current;

      // Proper DPI handling (important on mobile)
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.getContext("2d").scale(ratio, ratio);

      // Destroy old pad if exists
      sigPadRef.current?.off();
      sigPadRef.current = new SignaturePad(canvas, {
        penColor: "#000",
        backgroundColor: "rgba(0,0,0,0)",
      });

      sigPadRef.current.clear();
    }, 0);

    return () => clearTimeout(timeout);
  }, [sigMode, showSignaturePanel]);

  /* ---------------- Render PDF ---------------- */
  useEffect(() => {
    if (!pdfDoc || !currentPage || !containerRef.current) return;

    let cancelled = false;

    const renderPage = async () => {
      const page = await pdfDoc.getPage(currentPage);
      const baseViewport = page.getViewport({ scale: 1 });

      const containerWidth = containerRef.current.clientWidth;
      const renderWidth = Math.min(containerWidth, MAX_PDF_WIDTH);
      const scale = renderWidth / baseViewport.width;
      const viewport = page.getViewport({ scale });

      if (cancelled) return;

      const canvas = pdfCanvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      setStageSize({
        width: viewport.width,
        height: viewport.height,
      });

      await page.render({ canvasContext: ctx, viewport }).promise;
    };

    renderPage();
    window.addEventListener("resize", renderPage);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", renderPage);
    };
  }, [pdfDoc, currentPage]);

  /* ---------------- Drawing ---------------- */
  const handlePointerDown = (e) => {
    if (activeTool !== "draw") return;
    e.evt?.preventDefault?.();

    const pos = e.target.getStage().getPointerPosition();
    setNewLine({
      points: [pos.x, pos.y],
      stroke: color,
      strokeWidth: 3,
      id: String(Date.now()),
      page: currentPage,
      type: "draw",
    });
  };

  const handlePointerMove = (e) => {
    if (!newLine || activeTool !== "draw") return;
    e.evt?.preventDefault?.();

    const pos = e.target.getStage().getPointerPosition();
    setNewLine((prev) => ({
      ...prev,
      points: [...prev.points, pos.x, pos.y],
    }));
  };

  const handlePointerUp = () => {
    if (newLine) {
      setAnnotations((prev) => [...prev, newLine]);
      setNewLine(null);
    }
  };

  /* ---------------- Stage Click ---------------- */
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
      if (signatureImage) {
        setAnnotations((prev) => [
          ...prev,
          {
            id: String(Date.now()),
            type: "signature",
            page: currentPage,
            x: pos.x,
            y: pos.y,
            image: signatureImage,
            width: 180,
            height: 70,
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

  const handleDelete = (id) =>
    setAnnotations((prev) => prev.filter((a) => a.id !== id));

  const currentAnnotations = annotations.filter((a) => a.page === currentPage);

  /* ---------------- Upload Signature ---------------- */
  useEffect(() => {
    if (activeTool === "signature" && sigMode === "upload") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setSignatureImage(reader.result);
        reader.readAsDataURL(file);
      };
      input.click();
    }
  }, [sigMode, activeTool]);

  /* ---------------- UI ---------------- */
  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-auto bg-gray-200 flex justify-center px-2 py-3 overscroll-contain touch-pan-y"
    >
      <div className="relative">
        <canvas
          ref={pdfCanvasRef}
          className="bg-white shadow-md block mx-auto"
        />

        <Stage
          width={stageSize.width}
          height={stageSize.height}
          draggable={false}
          style={{ position: "absolute", top: 0, left: 0, touchAction: "none" }}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          onClick={handleStageClick}
        >
          <Layer>
            {currentAnnotations.map((a) => {
              if (a.type === "comment")
                return (
                  <Text
                    key={a.id}
                    {...a}
                    fontSize={16}
                    draggable
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
                    lineCap="round"
                    lineJoin="round"
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
                    {...a}
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
                    {...a}
                    fontSize={26}
                    fontFamily="cursive"
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
                    {...a}
                    draggable
                    onClick={() =>
                      activeTool === "eraser" && handleDelete(a.id)
                    }
                  >
                    <Rect
                      width={a.width}
                      height={a.height}
                      fill={a.bg}
                      cornerRadius={6}
                    />
                    <Text
                      text={a.text}
                      width={a.width}
                      height={a.height}
                      align="center"
                      verticalAlign="middle"
                      fill={a.color}
                      fontSize={18}
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
                lineCap="round"
                lineJoin="round"
              />
            )}
          </Layer>
        </Stage>

        {commentInput && (
          <input
            autoFocus
            value={commentInput.text}
            onChange={(e) =>
              setCommentInput((p) => ({ ...p, text: e.target.value }))
            }
            onBlur={() => {
              if (commentInput.text.trim())
                setAnnotations((p) => [...p, commentInput]);
              setCommentInput(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
            className="absolute z-20 border px-1 text-sm"
            style={{
              top: commentInput.y,
              left: commentInput.x,
              maxWidth: "90vw",
            }}
          />
        )}

        {showSignaturePanel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-2">
            <div className="bg-white w-full max-w-xs rounded-lg p-3">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Add Signature</span>
                <button onClick={() => setShowSignaturePanel(false)}>✕</button>
              </div>

              <div className="flex gap-2 mb-2">
                {["draw", "typed", "upload"].map((m) => (
                  <button
                    key={m}
                    onClick={() => setSigMode(m)}
                    className={`flex-1 py-1 rounded text-sm ${
                      sigMode === m ? "bg-blue-500 text-white" : "bg-gray-100"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {sigMode === "draw" && (
                <>
                  <canvas
                    ref={sigCanvasRef}
                    className="border rounded w-full h-27.5"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      className="flex-1 bg-green-500 text-white rounded py-1"
                      onClick={() =>
                        !sigPadRef.current.isEmpty() &&
                        setSignatureImage(sigPadRef.current.toDataURL())
                      }
                    >
                      Save
                    </button>
                    <button
                      className="flex-1 bg-red-500 text-white rounded py-1"
                      onClick={() => sigPadRef.current.clear()}
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
                  placeholder="Type signature"
                  className="border p-1 w-full"
                />
              )}

              {sigMode === "upload" && (
                <p className="text-sm text-gray-600">
                  Choose an image to use as signature
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvasArea;
