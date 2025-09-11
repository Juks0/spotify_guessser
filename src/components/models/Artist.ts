import {Album} from "@/components/models/Album.ts";

export class Artist {
    id!: string;
    name!: string;
    genres!: string[];
    popularity!: number;
    image!: string;
    albums: Album[] = [];

    constructor(id: string, name: string, genres: string[], popularity: number, image: string) {
        this.id = id;
        this.name = name;
        this.genres = genres;
        this.popularity = popularity;
        this.image = image;
        this.albums = [];
    }

    setAlbums(albums: Album[]) {
        this.albums = albums;
    }
}
