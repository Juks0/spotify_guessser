
export class Album {
    id!: string;
    name!: string;
    release_date!: string;
    image!: string;

    constructor(id: string, name: string, release_date: string, image: string) {
        this.id = id;
        this.name = name;
        this.release_date = release_date;
        this.image = image;
    }
}
