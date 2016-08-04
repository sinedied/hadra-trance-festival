/*
 * Interfaces
 */

export const SET_UTC_OFFSET = 2; // +1 for Paris GMT, +1 for DST

export interface IFestival {
  version: number;
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
  map: IMapInfo[];
  infos: IInfoPage[];
  lineup: IScene[];
  artists: IArtist[];
}

export interface IArtist {
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
}

export interface IScene {
  name: string;
  sets: Set[];
}

export interface ISet {
  id?: string;
  type: SetType;
  start: Date;
  end: Date;
  artistId: string;
}

export interface IInfoPage {
  title: string;
  content: string;
}

export interface IMapInfo {
  lat: number;
  lon: number;
  title: string;
  type: MapInfoType;
  description: string;
}

export interface IStartInfo {
  hasStarted: boolean;
  start: moment.Moment;
}

/*
 * Enums
 */

export enum SetType {
  DJ = <any>'dj',
  LIVE = <any>'live',
  GIG = <any>'gig',
  VJ = <any> 'vj',
  BREAK = <any>'break'
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

/*
 * Classes
 */

export class Festival implements IFestival {
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

  // App data only
  artistById: Map<string, Artist>;
  featuredArtists: Artist[];
  private start: Date;

  processData() {
    this.artistById = {};
    _.each(this.artists, (artist: Artist) => {
      this.artistById[artist.id] = artist;
    });
    this.featuredArtists = _.map(this.featuredArtistIds, id => this.artistById[id]);
    this.start = this.lineup[0].sets[0].start;

    _.each(this.lineup, scene => {
      _.each(scene.sets, set => {
        set.id = Set.getHashCode(set);
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

        // Update the first set of the festival
        if (set.start < this.start) {
          this.start = set.start;
        }
      });
    });
  }

  nowPlaying(): Set[] {
    let now = moment();
    // console.log('now: ' + now.toDate());

    return _.map(this.lineup, (scene: Scene) => {
      return _.find(scene.sets, (set: Set) => {
        let start = this.getSetDate(set.start);
        let end = this.getSetDate(set.end);

        // console.log(set);
        // console.log(start.toDate());
        // console.log(end.toDate());

        return now.isBetween(start, end, null, '[)');
      });
    });
  }

  startInfo(): IStartInfo {
    let start = this.getSetDate(this.start);
    return {
      hasStarted: moment().isAfter(start),
      start: start
    };
  }

  getSetDate(date: Date): moment.Moment {
    return moment.utc(date).subtract(SET_UTC_OFFSET, 'h');
  }

}

export class Artist implements IArtist {
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

export class Scene implements IScene {
  name: string;
  sets: Set[] = [];
}

export class Set implements ISet {
  id: string;
  type: SetType;
  start: Date;
  end: Date;
  artistId: string;

  // App data only
  artist: Artist;
  scene: Scene;

  static getSerializableCopy(set: Set): ISet {
    return <Set>{
      type: set.type,
      start: set.start,
      end: set.end,
      artistId: set.artistId
    };
  }

  static getSerializableCopyWithId(set: Set): ISet {
    return <Set>{
      id: Set.getHashCode(set),
      type: set.type,
      start: set.start,
      end: set.end,
      artistId: set.artistId
    };
  }

  static getHashCode(set: Set): string {
    let s = JSON.stringify(Set.getSerializableCopy(set));
    let char, hash = 0;
    if (s.length === 0) {
      return '' + hash;
    }
    for (let i = 0; i < s.length; ++i) {
      char = s.charCodeAt(i);
      /* tslint:disable */
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
      /* tslint:enable */
    }
    return '' + hash;
  }

}

export class InfoPage implements IInfoPage {
  title: string;
  content: string;
}


export class MapInfo implements IMapInfo {
  lat: number;
  lon: number;
  title: string;
  type: MapInfoType;
  description: string;
}
