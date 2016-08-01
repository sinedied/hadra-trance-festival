export class Festival {
  version: number = 1.0;
  photo: string;
  description: string;
  playerSoundcloud: string;
  playerShop: string;
  buyMusic: string;
  buyClothes: string;
  featuredArtistIds: string[];
  featuredPhotos: string[];
  featuredVideo: string;
  soundcloudPlayer: string;
  map: MapInfo[] = [];
  infos: InfoPage[] = [];
  lineup: Scene[] = [];
  artists: Artist[] = [];
  artistById: Map<string, Artist>;

  // App data only
  featuredArtists: Artist[];

  buildArtistIndex() {
    this.artistById = {};
    _.each(this.artists, (artist: Artist) => {
      this.artistById[artist.id] = artist;
    });
    this.featuredArtists = _.map(this.featuredArtistIds, id => this.artistById[id]);

    _.each(this.lineup, scene => {
      _.each(scene.sets, set => {
        set.artist = this.artistById[set.artistId];
        set.scene = scene;

        if (!set.artist.sets) {
          set.artist.sets = [];
        }

        set.artist.sets.push(set);

        if (!set.artist.type) {
          set.artist.type = <any>set.type;
        } else {
          set.artist.type += ' / ' + <any>set.artist.type;
        }
      });
    });
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

  // App data only
  sets: Set[];
  type: string;
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
  artistId: string;

  // App data only
  artist: Artist;
  scene: Scene;
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
