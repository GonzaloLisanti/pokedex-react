// Función para determinar el color del texto basado en el brillo del fondo
export const getContrastColor = (hexColor: string): string => {
  const r = parseInt(hexColor.substring(3, 4), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "#2b2b2f" : "#FFFFFF";
};