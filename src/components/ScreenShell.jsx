import React from 'react';

export default function ScreenShell({ title, subtitle, children, action }) {
  return (
    <div className="screen-shell">
      <header className="screen-header">
        {action ? <button className="back-button" onClick={action}>←</button> : <div className="header-spacer" />}
        <div className="header-title-wrap">
          <p className="eyebrow">Desafio da Compostagem</p>
          <h2>{title}</h2>
        </div>
        <div className="header-spacer" />
      </header>

      {subtitle ? <p className="screen-subtitle">{subtitle}</p> : null}
      {children}
    </div>
  );
}
