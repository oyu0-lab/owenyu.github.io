const sliders = ['a', 'b', 'c'].map(id => document.getElementById(id));
const format = value => String(Math.round(value * 100) / 100);
function updateGraph() {
  const [a, b, c] = sliders.map(slider => Number(slider.value));
  sliders.forEach(slider => { document.getElementById(`${slider.id}-value`).textContent = format(Number(slider.value)); });
  const terms = [];
  for (const [coefficient, variable] of [[a, 'x²'], [b, 'x'], [c, '']]) {
    if (!coefficient) continue;
    const magnitude = Math.abs(coefficient);
    const term = (magnitude === 1 && variable ? '' : format(magnitude)) + variable;
    terms.push((terms.length ? (coefficient < 0 ? ' − ' : ' + ') : (coefficient < 0 ? '−' : '')) + term);
  }
  document.getElementById('equation').textContent = `y = ${terms.join('') || '0'}`;
  let path = '';
  for (let px = 0; px <= 500; px += 2) {
    const x = (px - 250) / 25;
    const py = 150 - (a * x * x + b * x + c) * 25;
    path += `${px ? 'L' : 'M'}${px},${py} `;
  }
  document.getElementById('curve').setAttribute('d', path);
  const vertex = document.getElementById('vertex');
  if (a === 0) {
    vertex.setAttribute('visibility', 'hidden');
    document.getElementById('insight').textContent = b === 0 ? `This is a horizontal line at y = ${format(c)}.` : `With a = 0, this is a straight line with slope ${format(b)}.`;
  } else {
    const x = -b / (2 * a);
    const y = a * x * x + b * x + c;
    vertex.setAttribute('cx', 250 + x * 25);
    vertex.setAttribute('cy', 150 - y * 25);
    vertex.setAttribute('visibility', Math.abs(x) <= 10 && Math.abs(y) <= 6 ? 'visible' : 'hidden');
    document.getElementById('insight').textContent = `The curve opens ${a > 0 ? 'upward' : 'downward'}. Its turning point is (${format(x)}, ${format(y)}).`;
  }
}
sliders.forEach(slider => slider.addEventListener('input', updateGraph));
document.getElementById('reset').addEventListener('click', () => {
  sliders.forEach((slider, i) => { slider.value = i === 0 ? 1 : 0; });
  updateGraph();
});
const questions = [
  'Can you explain why a negative times a negative is positive?',
  'If you doubled the radius of a circle, what would happen to its area?',
  'How would you estimate the height of a tree without climbing it?',
  'Why does a 50% increase followed by a 50% decrease leave you with less?',
  'What would you change about an experiment to make its results more reliable?',
  'How could you tell the difference between correlation and causation?',
  'What is something you understand better after explaining it to someone else?'
];
let questionIndex = 0;
document.getElementById('new-question').addEventListener('click', () => {
  questionIndex = (questionIndex + 1) % questions.length;
  document.getElementById('question').textContent = questions[questionIndex];
});
document.getElementById('year').textContent = new Date().getFullYear();
updateGraph();
