import { useState } from "react";

const useCanvasTools = ({
  activeTool,
  currentPage,
  color,
  font,
  setAnnotations,
}) => {
  const [newLine, setNewLine] = useState(null);
  const [commentInput, setCommentInput] = useState(null);

  //DRAW
  const handleMouseDown = (e) => {
    if (activeTool !== "draw") return;

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

  const handleMouseMove = (e) => {
    if (activeTool !== "draw" || !newLine) return;

    const pos = e.target.getStage().getPointerPosition();
    setNewLine((prev) => ({
      ...prev,
      points: [...prev.points, pos.x, pos.y],
    }));
  };

  const handleMouseUp = () => {
    if (activeTool === "draw" && newLine) {
      setAnnotations((prev) => [...prev, newLine]);
      setNewLine(null);
    }
  };

  //COMMENT
  const handleStageClick = (e) => {
    if (activeTool !== "comment") return;

    const pos = e.target.getStage().getPointerPosition();
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
  };

  const saveComment = () => {
    if (commentInput?.text.trim()) {
      setAnnotations((prev) => [...prev, commentInput]);
    }
    setCommentInput(null);
  };

  //ERASE
  const handleDelete = (id) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
  };

  return {
    newLine,
    commentInput,
    setCommentInput,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleStageClick,
    saveComment,
    handleDelete,
  };
};

export default useCanvasTools;
