export default function ResidueItem({ item, onPointerDown, onPointerMove, onPointerUp, isDragging }) {
  return (
    <div
      className={`residue-item ${isDragging ? 'dragging' : ''}`}
      style={{
        left: `${item.x}%`,
        top: `${item.y}%`,
        width: `${item.size}px`,
        height: `${item.size}px`,
        transform: 'translate(-50%, -50%)',
        background: item.category === 'compost'
          ? 'linear-gradient(135deg, rgba(136, 214, 106, 0.95), rgba(72, 136, 64, 0.92))'
          : 'linear-gradient(135deg, rgba(251, 185, 83, 0.9), rgba(205, 127, 72, 0.9))',
      }}
      onPointerDown={(event) => onPointerDown(event, item)}
      onPointerMove={(event) => onPointerMove(event, item)}
      onPointerUp={(event) => onPointerUp(event, item)}
      onPointerLeave={(event) => onPointerUp(event, item)}
      onPointerCancel={(event) => onPointerUp(event, item)}
    >
      <div className="residue-emoji">{item.emoji}</div>
      <span>{item.name}</span>
    </div>
  );
}
