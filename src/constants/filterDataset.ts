export const filterDataset = (data: number[], minValue: number | string, maxValue: number | string) => {
  const min = minValue !== '' ? Number(minValue) : null;
  const max = maxValue !== '' ? Number(maxValue) : null;

  return data.filter(value => (min === null || value >= min) && (max === null || value <= max)) || [];
};
