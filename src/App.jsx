export default function InfoCard({ icon, title, text }) {
  return (
    <article className="info-card">
      <div className="info-card-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}
