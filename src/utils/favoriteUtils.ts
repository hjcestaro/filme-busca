const FAVORITES_KEY = "favorite_movies";

export function getFavorites(): string[] {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(id);
}

export function toggleFavorite(id: string): boolean {
  const favorites = getFavorites();
  let updated;
  let nowFav;

  if (favorites.includes(id)) {
    updated = favorites.filter((f) => f !== id);
    nowFav = false;
  } else {
    updated = [...favorites, id];
    nowFav = true;
  }

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return nowFav;
}
