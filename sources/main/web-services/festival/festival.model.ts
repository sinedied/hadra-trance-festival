export class Festival {
  version: number = 1.0;
  photo: string;
  description: string;
  featuredArtistIds: string[];  // filled by server
  featuredArtists: Artist[];    // filled by app
  featuredPhotos: string[];
  featuredVideo: string;
  soundcloudPlayer: string;
  map: MapInfo[] = [];
  infos: InfoPage[] = [];
  lineup: Scene[] = [];
  artists: Artist[] = [];
  artistById: Map<string, Artist>;

  buildArtistIndex() {
    this.artistById = {};
    _.each(this.artists, (artist: Artist) => {
      this.artistById[artist.id] = artist;
    });
    this.featuredArtists = _.map(this.featuredArtistIds, id => this.artistById[id]);
  }
}

export class Artist {
  id: string;
  name: string;
  photo: string;
  banner: string;
  label: string;
  country: string;
  facebook: string;
  soundcloud: string;
  mixcloud: string;
  website: string;
  bio: {
    fr: string;
    en: string;
  };
  sets: Set[];  // filled by app
}

export class Scene {
  name: string;
  sets: Set[] = [];
}

export enum SetType {
  DJ = <any>'dj',
  LIVE = <any>'live',
  GIG = <any>'gig',
  VJ = <any> 'vj',
  BREAK = <any>'break'
}

export class Set {
  type: SetType;
  start: Date;
  end: Date;
  artistId: string; // filled by server
//  artist: Artist;   // filled by app
}

export class InfoPage {
  title: string;
  content: string;
}

export enum MapInfoType {
  WATER,
  TOILET,
  SCENE,
  FOOD,
  SHOP,
  INFO,
  SHOWER,
  HADRA_STAND
}

export class MapInfo {
  lat: number;
  lon: number;
  title: string;
  type: MapInfoType;
  description: string;
}
