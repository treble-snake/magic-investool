export const scoreSector = (sector: string, sectorsPercentage: Record<string, number>) => {
  const value = 1 - ((sectorsPercentage[sector] || 0) / 100);
  return Math.round(100 * 100 * value) / 100;
};