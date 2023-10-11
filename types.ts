export interface Billboard {
  id: string;
  label: string;
  imageUrl: string;
  description: string;
  productId: string;
  cover: string;
  color: string;
}

export interface Genre {
  id: string;
  name: string;
  billboard: Billboard;
}

export interface Product {
  id: string;
  genre: Genre;
  price: string;
  isFeatured: boolean;
  isSpotify: boolean;
  album: string;
  artist: string;
  description: string;
  imageUrl: string;
}

export interface Search {
  genreId: string;
  sort: string;
}
