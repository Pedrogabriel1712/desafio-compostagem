export const RESIDUES = [
  { id: 'banana', name: 'Casca de banana', category: 'compost', emoji: '🍌', group: 'fruta' },
  { id: 'ovo', name: 'Casca de ovo', category: 'compost', emoji: '🥚', group: 'ovo' },
  { id: 'arroz', name: 'Restos de arroz', category: 'compost', emoji: '🍚', group: 'comida' },
  { id: 'feijao', name: 'Restos de feijão', category: 'compost', emoji: '🫘', group: 'comida' },
  { id: 'maca', name: 'Casca de maçã', category: 'compost', emoji: '🍏', group: 'fruta' },
  { id: 'laranja', name: 'Casca de laranja', category: 'compost', emoji: '🍊', group: 'fruta' },
  { id: 'folhas', name: 'Folhas secas', category: 'compost', emoji: '🍃', group: 'jardim' },
  { id: 'cafe', name: 'Borra de café', category: 'compost', emoji: '☕', group: 'cafe' },
  { id: 'cenoura', name: 'Restos de cenoura', category: 'compost', emoji: '🥕', group: 'vegetal' },
  { id: 'batata', name: 'Casca de batata', category: 'compost', emoji: '🥔', group: 'vegetal' },
  { id: 'pao', name: 'Pão', category: 'compost', emoji: '🍞', group: 'comida' },
  { id: 'salada', name: 'Restos de salada', category: 'compost', emoji: '🥗', group: 'comida' },

  { id: 'salgadinho', name: 'Embalagem de salgadinho', category: 'trash', emoji: '🥨', group: 'plastico' },
  { id: 'canudo', name: 'Canudo', category: 'trash', emoji: '🥤', group: 'plastico' },
  { id: 'garrafa-plastica', name: 'Garrafa plástica', category: 'trash', emoji: '🧴', group: 'plastico' },
  { id: 'copo-plastico', name: 'Copo plástico', category: 'trash', emoji: '🥤', group: 'plastico' },
  { id: 'lata', name: 'Lata', category: 'trash', emoji: '🥫', group: 'metal' },
  { id: 'garrafa-vidro', name: 'Garrafa de vidro', category: 'trash', emoji: '🍶', group: 'vidro' },
  { id: 'isopor', name: 'Isopor', category: 'trash', emoji: '🧊', group: 'plastico' },
  { id: 'pilha', name: 'Pilha', category: 'trash', emoji: '🔋', group: 'quimico' },
  { id: 'caixa-longa-vida', name: 'Caixa longa-vida', category: 'trash', emoji: '🥛', group: 'embalagem' },
  { id: 'papel-plastificado', name: 'Papel plastificado', category: 'trash', emoji: '📦', group: 'papel' },
  { id: 'embalagem-comida', name: 'Embalagem de comida', category: 'trash', emoji: '🍱', group: 'embalagem' },
];

export const LEARN_CARDS = [
  {
    id: 'compostagem',
    icon: '🌱',
    title: 'O que é compostagem',
    text: 'É o processo de transformar resíduos orgânicos em adubo natural e rico em nutrientes.',
  },
  {
    id: 'podem',
    icon: '♻️',
    title: 'O que pode ser compostado',
    text: 'Cascas, folhas secas, restos de verduras, borra de café e alimentos orgânicos podem ir para a composteira.',
  },
  {
    id: 'nao-podem',
    icon: '🚫',
    title: 'O que não pode',
    text: 'Plásticos, metais, vidros, pilhas, isopor e materiais sintéticos não devem entrar na composteira.',
  },
  {
    id: 'separar',
    icon: '🧠',
    title: 'Por que separar os resíduos',
    text: 'Separar evita contaminação, melhora a reciclagem e ajuda a reduzir o desperdício.',
  },
  {
    id: 'beneficios',
    icon: '🌍',
    title: 'Benefícios da compostagem',
    text: 'Melhora o solo, reduz lixo, economiza espaço em aterros e ajuda o planeta.',
  },
  {
    id: 'reduzir',
    icon: '💚',
    title: 'Importância da redução de resíduos',
    text: 'Menos lixo produzido significa menos impacto ambiental e mais consciência no cotidiano.',
  },
];

export const ACHIEVEMENTS = [
  { id: 'first-hit', label: '🌱 Primeiro acerto', description: 'Conquistas ao acertar o primeiro resíduo.' },
  { id: 'ten-hits', label: '♻️ 10 acertos', description: 'Acumule 10 acertos em uma partida ou no total.' },
  { id: 'combo-5', label: '🔥 Combo x5', description: 'Alcance uma sequência de 5 acertos.' },
  { id: 'combo-10', label: '🔥 Combo x10', description: 'Alcance uma sequência de 10 acertos.' },
  { id: 'score-100', label: '⭐ 100 pontos', description: 'Marque 100 pontos.' },
  { id: 'score-200', label: '⭐ 200 pontos', description: 'Marque 200 pontos.' },
  { id: 'master', label: '👑 Mestre da Compostagem', description: 'Complete o jogo com grande pontuação e bom desempenho.' },
];

export const DEFAULT_ACHIEVEMENTS = {
  'first-hit': false,
  'ten-hits': false,
  'combo-5': false,
  'combo-10': false,
  'score-100': false,
  'score-200': false,
  'master': false,
};
