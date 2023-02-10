export interface ApiStudiableItem {
  id: number;
  rank: number;
  cardSides: ApiCardSide[];
}

export interface ApiCardSide {
  sideId: number;
  label: string;
  media: ApiCardSideMedia[];
}

export interface ApiCardSideMedia {
  type: number;
  plainText: string;
}
