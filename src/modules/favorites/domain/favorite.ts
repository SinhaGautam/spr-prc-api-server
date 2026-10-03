import { Favorite } from "../../../shared/domain/entities";

export type FavoriteEntity = Favorite;
export const favoriteEntityTypes = ["reading", "song", "mantra"] as const;
