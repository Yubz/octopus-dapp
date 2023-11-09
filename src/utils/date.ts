export const daysBetweenDates = (startDate: Date, endDate: Date): number => {
  // Convertir les deux dates en millisecondes
  const start = startDate.getTime();
  const end = endDate.getTime();

  // Calculer la différence en millisecondes
  const diff = end - start;

  // Convertir la différence en jours
  const days = diff / (1000 * 60 * 60 * 24);

  return days;
};
