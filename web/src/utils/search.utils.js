/**
 * Normaliza texto eliminando tildes, espacios innecesarios y pasando a minúsculas.
 * @param {string} text - Texto a normalizar.
 * @returns {string}
 */
export const normalizeText = (text) => {
  return String(text ?? "")
    .normalize("NFD") // separa los acentos de las letras
    .replace(/[\u0300-\u036f]/g, "") // elimina tildes
    .replace(/\s+/g, " ") // colapsa espacios múltiples
    .trim()
    .toLowerCase();
}

/**
 * Filtra un array de objetos según un texto de búsqueda y una función selectora.
 * @template T
 * @param {T[]} items - Lista de objetos a filtrar.
 * @param {string} query - Texto de búsqueda ingresado por el usuario.
 * @param {(item: T) => string | string[]} selector - Función que define qué valores comparar (uno o varios).
 * @returns {T[]} - Elementos que coinciden parcialmente con el texto buscado.
 */
export const filterSearch = (items, query, selector) => {
  if (!query) return items;

  const normalizedQuery = normalizeText(query);

  return items.filter(item => {
    const fields = selector(item);
    const values = Array.isArray(fields) ? fields : [fields];

    return values.some(value =>
      normalizeText(value).includes(normalizedQuery)
    );
  });
}