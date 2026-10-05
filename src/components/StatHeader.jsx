export default function StatHeader({ lives, score, timeLeft, combo, level }) {
  return (
    <div className="status-bar">
      <div className="status-pill status-live">
        <span>❤️</span>
        <strong>{lives}</strong>
      </div>

      <div className="status-pill status-score">
        <span>⭐</span>
        <strong>{score}</strong>
      </div>

      <div className="status-pill status-time">
        <span>⏱️</span>
        <strong>{timeLeft}s</strong>
      </div>

      <div className="status-pill status-combo">
        <span>🔥</span>
        <strong>x{combo}</strong>
      </div>

      <div className="status-pill status-level">
        <span>🏆</span>
        <strong>{level}</strong>
      </div>
    </div>
  );
}
