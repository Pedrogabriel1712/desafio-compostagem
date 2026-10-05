import { useEffect, useMemo, useRef, useState } from 'react';
import { ACHIEVEMENTS, DEFAULT_ACHIEVEMENTS, LEARN_CARDS, RESIDUES } from './data/residuos';
import { readAchievements, readBestScore, saveAchievements, saveBestScore } from './utils/storage';
import ScreenShell from './components/ScreenShell';
import StatHeader from './components/StatHeader';
import TargetZone from './components/TargetZone';
import ResidueItem from './components/ResidueItem';
import InfoCard from './components/InfoCard';

const INITIAL_LIVES = 3;
const ROUND_LENGTH = 90;
const BASE_SPAWN_TARGET = 4;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function createRandomItem(level) {
  const item = RESIDUES[Math.floor(Math.random() * RESIDUES.length)];
  const size = 72 + Math.random() * 28;
  const speedMultiplier = 0.8 + Math.random() * 0.7 + level * 0.15;

  return {
    id: `${item.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: item.name,
    emoji: item.emoji,
    category: item.category,
    x: 14 + Math.random() * 70,
    y: 15 + Math.random() * 62,
    vx: (Math.random() > 0.5 ? 1 : -1) * speedMultiplier,
    vy: (Math.random() > 0.5 ? 1 : -1) * speedMultiplier,
    size,
    ttl: Math.max(4.5, 9.5 - level * 0.6),
  };
}

function getLevelFromTime(timeLeft) {
  return Math.max(1, Math.min(12, Math.floor((ROUND_LENGTH - timeLeft) / 15) + 1));
}

function getAchievementState(stats) {
  const unlocked = { ...DEFAULT_ACHIEVEMENTS };

  unlocked['first-hit'] = stats.accurate >= 1;
  unlocked['ten-hits'] = stats.accurate >= 10;
  unlocked['combo-5'] = stats.maxCombo >= 5;
  unlocked['combo-10'] = stats.maxCombo >= 10;
  unlocked['score-100'] = stats.score >= 100;
  unlocked['score-200'] = stats.score >= 200;
  unlocked['master'] = stats.score >= 250 && stats.maxCombo >= 5;

  return unlocked;
}

export default function App() {
  const [screen, setScreen] = useState('home');
  const [bestScore, setBestScore] = useState(() => readBestScore());
  const [savedAchievements, setSavedAchievements] = useState(() => readAchievements());
  const [feedback, setFeedback] = useState({ text: '', type: '' });
  const [draggingItemId, setDraggingItemId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [game, setGame] = useState({
    score: 0,
    lives: INITIAL_LIVES,
    combo: 0,
    timeLeft: ROUND_LENGTH,
    accurate: 0,
    errors: 0,
    maxCombo: 0,
    items: [],
    status: 'ready',
    result: null,
  });

  const boardRef = useRef(null);
  const compostZoneRef = useRef(null);
  const trashZoneRef = useRef(null);

  const currentLevel = useMemo(() => getLevelFromTime(game.timeLeft), [game.timeLeft]);

  useEffect(() => {
    setSavedAchievements((prev) => {
      const { ...next } = prev;
      Object.keys(DEFAULT_ACHIEVEMENTS).forEach((key) => {
        if (next[key] === undefined) next[key] = false;
      });
      saveAchievements(next);
      return next;
    });
  }, []);

  useEffect(() => {
    saveBestScore(bestScore);
  }, [bestScore]);

  useEffect(() => {
    saveAchievements(savedAchievements);
  }, [savedAchievements]);

  useEffect(() => {
    if (screen !== 'game' || game.status !== 'playing') return undefined;

    const timer = setInterval(() => {
      setGame((prev) => {
        if (prev.status !== 'playing') return prev;

        const nextTime = Math.max(0, prev.timeLeft - 1);
        const nextLevel = getLevelFromTime(nextTime);

        let nextItems = prev.items.map((item) => ({
          ...item,
          x: clamp(item.x + item.vx * 0.8, 8, 92),
          y: clamp(item.y + item.vy * 0.8, 12, 88),
          ttl: item.ttl - 0.9,
        }));

        let nextCombo = prev.combo;
        let nextLives = prev.lives;
        let nextErrors = prev.errors;
        let nextScore = prev.score;

        const expired = nextItems.filter((item) => item.ttl <= 0);
        if (expired.length > 0) {
          nextItems = nextItems.filter((item) => item.ttl > 0);
          nextLives -= expired.length;
          nextCombo = 0;
          nextErrors += expired.length;
          nextScore = Math.max(0, nextScore - expired.length * 10);
          setFeedback({ text: 'Ops! Um resíduo sumiu.', type: 'error' });
        }

        const targetCount = Math.min(9, BASE_SPAWN_TARGET + Math.floor(nextLevel * 0.7));
        while (nextItems.length < targetCount) {
          nextItems.push(createRandomItem(nextLevel));
        }

        const finished = nextTime <= 0 || nextLives <= 0;
        if (finished) {
          const nextResult = {
            score: nextScore,
            accurate: prev.accurate,
            errors: nextErrors,
            combo: prev.maxCombo,
            level: nextLevel,
          };

          setBestScore((currentBest) => Math.max(currentBest, nextScore));
          setSavedAchievements((current) => {
            const nextUnlocked = getAchievementState({
              accurate: prev.accurate,
              maxCombo: prev.maxCombo,
              score: nextScore,
            });
            return { ...current, ...nextUnlocked };
          });

          return {
            ...prev,
            score: nextScore,
            lives: Math.max(0, nextLives),
            combo: nextCombo,
            errors: nextErrors,
            timeLeft: 0,
            items: nextItems,
            status: 'finished',
            result: nextResult,
          };
        }

        return {
          ...prev,
          score: nextScore,
          lives: nextLives,
          combo: nextCombo,
          errors: nextErrors,
          timeLeft: nextTime,
          items: nextItems,
        };
      });
    }, 900);

    return () => clearInterval(timer);
  }, [screen, game.status]);

  useEffect(() => {
    if (game.status !== 'finished' || !game.result) return;
    setScreen('result');
  }, [game.status, game.result]);

  const startGame = () => {
    setFeedback({ text: '', type: '' });
    setGame({
      score: 0,
      lives: INITIAL_LIVES,
      combo: 0,
      timeLeft: ROUND_LENGTH,
      accurate: 0,
      errors: 0,
      maxCombo: 0,
      items: Array.from({ length: 4 }, () => createRandomItem(1)),
      status: 'playing',
      result: null,
    });
    setScreen('game');
  };

  const handleDrop = (itemId, targetCategory) => {
    setGame((prev) => {
      if (prev.status !== 'playing') return prev;

      const itemToCheck = prev.items.find((item) => item.id === itemId);
      if (!itemToCheck) return prev;

      const isCorrect = itemToCheck.category === targetCategory;
      const nextItems = prev.items.filter((item) => item.id !== itemId);

      if (isCorrect) {
        const nextScore = prev.score + 10;
        const nextCombo = prev.combo + 1;
        const nextAccurate = prev.accurate + 1;
        const nextMaxCombo = Math.max(prev.maxCombo, nextCombo);

        setFeedback({ text: 'Boa! ♻️', type: 'success' });

        const unlocked = getAchievementState({
          accurate: nextAccurate,
          maxCombo: nextMaxCombo,
          score: nextScore,
        });

        setSavedAchievements((current) => ({ ...current, ...unlocked }));
        setBestScore((currBest) => Math.max(currBest, nextScore));

        return {
          ...prev,
          score: nextScore,
          combo: nextCombo,
          accurate: nextAccurate,
          maxCombo: nextMaxCombo,
          items: nextItems,
        };
      }

      const nextErrors = prev.errors + 1;
      const nextLives = prev.lives - 1;
      const nextScore = Math.max(0, prev.score - 10);
      const nextCombo = 0;
      const destination = targetCategory === 'compost' ? 'composteira' : 'lixeira';

      setFeedback({
        text: `Ops! Tente novamente. O certo era ${itemToCheck.category === 'compost' ? 'composteira' : 'lixeira'}.`,
        type: 'error',
      });

      const unlocked = getAchievementState({
        accurate: prev.accurate,
        maxCombo: prev.maxCombo,
        score: nextScore,
      });
      setSavedAchievements((current) => ({ ...current, ...unlocked }));

      if (nextLives <= 0) {
        const finalResult = {
          score: nextScore,
          accurate: prev.accurate,
          errors: nextErrors,
          combo: prev.maxCombo,
          level: currentLevel,
        };
        setBestScore((currBest) => Math.max(currBest, nextScore));

        return {
          ...prev,
          score: nextScore,
          lives: 0,
          combo: nextCombo,
          errors: nextErrors,
          items: nextItems,
          status: 'finished',
          result: finalResult,
        };
      }

      return {
        ...prev,
        score: nextScore,
        lives: nextLives,
        combo: nextCombo,
        errors: nextErrors,
        items: nextItems,
      };
    });
  };

  const handlePointerDown = (event, item) => {
    if (screen !== 'game') return;
    event.preventDefault();
    const boardRect = boardRef.current?.getBoundingClientRect();
    if (!boardRect) return;

    const pointerX = event.clientX - boardRect.left;
    const pointerY = event.clientY - boardRect.top;

    setDraggingItemId(item.id);
    setDragOffset({
      x: pointerX - (item.x / 100) * boardRect.width,
      y: pointerY - (item.y / 100) * boardRect.height,
    });
  };

  const handlePointerMove = (event, item) => {
    if (!draggingItemId || draggingItemId !== item.id) return;

    const boardRect = boardRef.current?.getBoundingClientRect();
    if (!boardRect) return;

    const pointerX = event.clientX - boardRect.left;
    const pointerY = event.clientY - boardRect.top;

    const nextX = clamp(((pointerX - dragOffset.x) / boardRect.width) * 100, 8, 92);
    const nextY = clamp(((pointerY - dragOffset.y) / boardRect.height) * 100, 10, 88);

    setGame((prev) => ({
      ...prev,
      items: prev.items.map((entry) => (entry.id === item.id ? { ...entry, x: nextX, y: nextY } : entry)),
    }));
  };

  const handlePointerUp = (event, item) => {
    if (!draggingItemId || draggingItemId !== item.id) return;

    const boardRect = boardRef.current?.getBoundingClientRect();
    if (!boardRect) return;

    const centerX = (item.x / 100) * boardRect.width;
    const centerY = (item.y / 100) * boardRect.height;

    const compostRect = compostZoneRef.current?.getBoundingClientRect();
    const trashRect = trashZoneRef.current?.getBoundingClientRect();

    let target = null;
    if (compostRect && centerX >= compostRect.left && centerX <= compostRect.right && centerY >= compostRect.top && centerY <= compostRect.bottom) {
      target = 'compost';
    }
    if (trashRect && centerX >= trashRect.left && centerX <= trashRect.right && centerY >= trashRect.top && centerY <= trashRect.bottom) {
      target = 'trash';
    }

    if (target) {
      handleDrop(item.id, target);
    }

    setDraggingItemId(null);
    setDragOffset({ x: 0, y: 0 });
  };

  const renderHome = (
    <div className="home-screen">
      <div className="logo-badge">♻️</div>
      <h1>Desafio da Compostagem</h1>
      <p className="lead">Você sabe separar os resíduos corretamente?</p>
      <div className="action-stack">
        <button className="primary-button" onClick={startGame}>JOGAR</button>
        <button className="secondary-button" onClick={() => setScreen('howto')}>COMO JOGAR</button>
        <button className="secondary-button" onClick={() => setScreen('learn')}>APRENDER</button>
        <button className="secondary-button" onClick={() => setScreen('achievements')}>CONQUISTAS</button>
      </div>
    </div>
  );

  const renderHowTo = (
    <ScreenShell title="Como jogar" subtitle="Aprenda a manter a compostagem correta e divertida." action={() => setScreen('home')}>
      <div className="rules-list">
        <div className="rule-item"><span>1.</span><p>Observe o resíduo.</p></div>
        <div className="rule-item"><span>2.</span><p>Arraste o resíduo com o dedo.</p></div>
        <div className="rule-item"><span>3.</span><p>Coloque no destino correto.</p></div>
        <div className="rule-item"><span>4.</span><p>Acerte para ganhar pontos.</p></div>
        <div className="rule-item"><span>5.</span><p>Erre para perder uma vida.</p></div>
      </div>
      <button className="primary-button" onClick={startGame}>COMEÇAR</button>
    </ScreenShell>
  );

  const renderLearn = (
    <ScreenShell title="Aprender" subtitle="Tudo sobre compostagem e conscientização ambiental." action={() => setScreen('home')}>
      <div className="learning-grid">
        {LEARN_CARDS.map((card) => (
          <InfoCard key={card.id} icon={card.icon} title={card.title} text={card.text} />
        ))}
      </div>
    </ScreenShell>
  );

  const renderAchievements = (
    <ScreenShell title="Conquistas" subtitle="Desbloqueie metas e mostre seu progresso." action={() => setScreen('home')}>
      <div className="achievement-list">
        {ACHIEVEMENTS.map((achievement) => {
          const unlocked = !!savedAchievements[achievement.id];
          return (
            <div key={achievement.id} className={`achievement-item ${unlocked ? 'unlocked' : ''}`}>
              <div className="achievement-badge">{achievement.label.split(' ')[0]}</div>
              <div>
                <h3>{achievement.label}</h3>
                <p>{achievement.description}</p>
              </div>
              <span>{unlocked ? '✓' : '🔒'}</span>
            </div>
          );
        })}
      </div>
    </ScreenShell>
  );

  const renderGame = (
    <div className="game-screen">
      <StatHeader
        lives={game.lives}
        score={game.score}
        timeLeft={game.timeLeft}
        combo={game.combo}
        level={currentLevel}
      />

      <div className="game-board" ref={boardRef}>
        {game.items.map((item) => (
          <ResidueItem
            key={item.id}
            item={item}
            isDragging={draggingItemId === item.id}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          />
        ))}

        {feedback.text ? <div className={`feedback-banner ${feedback.type}`}>{feedback.text}</div> : null}
      </div>

      <div className="drop-zones">
        <TargetZone
          type="compost"
          emoji="🟤"
          title="COMPOSTEIRA"
          onZoneRef={compostZoneRef}
        />
        <TargetZone
          type="trash"
          emoji="🗑️"
          title="LIXEIRA"
          onZoneRef={trashZoneRef}
        />
      </div>
    </div>
  );

  const renderResult = (
    <ScreenShell title="Fim de jogo!" subtitle="Confira seu desempenho na rodada." action={() => setScreen('home')}>
      <div className="result-card">
        <div className="result-score">{game.result?.score ?? 0}</div>
        <div className="result-grid">
          <div><span>Acertos</span><strong>{game.result?.accurate ?? 0}</strong></div>
          <div><span>Erros</span><strong>{game.result?.errors ?? 0}</strong></div>
          <div><span>Maior combo</span><strong>x{game.result?.combo ?? 0}</strong></div>
          <div><span>Nível</span><strong>{game.result?.level ?? currentLevel}</strong></div>
        </div>
      </div>

      <div className="action-stack result-actions">
        <button className="primary-button" onClick={startGame}>JOGAR NOVAMENTE</button>
        <button className="secondary-button" onClick={() => setScreen('home')}>MENU</button>
        <button className="secondary-button" onClick={() => setScreen('learn')}>APRENDER</button>
      </div>
    </ScreenShell>
  );

  if (screen === 'game') return renderGame;
  if (screen === 'howto') return renderHowTo;
  if (screen === 'learn') return renderLearn;
  if (screen === 'achievements') return renderAchievements;
  if (screen === 'result') return renderResult;

  return renderHome;
}
