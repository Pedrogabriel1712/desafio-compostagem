export default function TargetZone({ type, emoji, title, onDrop, active, onZoneRef, isEmpty = false }) {
  const isCompost = type === 'compost';

  return (
    <div
      ref={onZoneRef}
      className={`drop-zone ${isCompost ? 'drop-zone-compost' : 'drop-zone-trash'} ${active ? 'active' : ''} ${isEmpty ? 'empty' : ''}`}
      data-zone={type}
    >
      <div className="drop-zone-icon">{emoji}</div>
      <div className="drop-zone-title">{title}</div>
      <div className="drop-zone-tag">{isCompost ? 'Pode compostar' : 'Vai para a lixeira'}</div>
    </div>
  );
}
