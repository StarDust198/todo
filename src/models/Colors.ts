export enum Colors {
  YELLOW = 'bg-yellow-800',
  AMBER = 'bg-amber-800',
  LIME = 'bg-lime-800',
  GREEN = 'bg-green-800',
  EMERALD = 'bg-emerald-800',
  TEAL = 'bg-teal-800',
  CYAN = 'bg-cyan-800',
  SKY = 'bg-sky-800',
  BLUE = 'bg-blue-800',
  INDIGO = 'bg-indigo-800',
  VIOLET = 'bg-violet-800',
  PURPLE = 'bg-purple-800',
  FUCHSIA = 'bg-fuchsia-800',
}

export function randomColor(): Colors {
  const colorValues = Object.values(Colors);
  const randomIndex = Math.floor(Math.random() * colorValues.length);
  const randomColorValue = colorValues[randomIndex];
  return randomColorValue;
}
