/*
 * Interfaces
 */

export interface IFestival {
  version: number;
  utcOffset: number;
  social?: {
    facebook?: string;
    website?: string;
    twitter?: string;
    soundcloud?: string;
    youtube?: string;
  };
  photo: string;
  description: string;
  playerSoundcloud: string;
  playerShop: string;
  buyMusic: string;
  buyClothes: string;
  featuredArtistIds: string[];
  featuredPhotos: string[];
  featuredVideo: string;
  map?: string;
  infos: IInfoPage[];
  showLineup: boolean;
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
  sets: Set[];  // must be ordered by date
  hide: boolean;
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

// App-only interfaces

export interface IStartInfo {
  hasStarted: boolean;
  start: moment.Moment;
  diff: number;
}

export interface IDailySets {
  weekday: number;  // moment locale-aware weekday
  sets: Set[];
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

/*
 * Classes
 */

export class Festival implements IFestival {
  version: number = 1.0;
  utcOffset: number = 0;
  social = null;
  photo: string;
  description: string;
  playerSoundcloud: string;
  playerShop: string;
  buyMusic: string;
  buyClothes: string;
  featuredArtistIds: string[];
  featuredPhotos: string[];
  featuredVideo: string;
  map: string;
  infos: InfoPage[] = [];
  showLineup: boolean = true;
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
      let days = {};
      let previousSet = null;

      _.each(scene.sets, set => {
        set.id = Set.getHashCode(set);
        set.artist = this.artistById[set.artistId];
        set.scene = scene;

        // Set !== BREAK
        if (set.artist) {
          if (!set.artist.sets) {
            set.artist.sets = [];
          }

          set.artist.sets.push(set);

          if (!set.artist.type) {
            set.artist.type = <any>set.type;
          } else if (set.artist.type.indexOf(<any>set.type) === -1) {
            set.artist.type += ' / ' + <any>set.type;
          }
        }

        // Update the first set of the festival
        if (set.start < this.start) {
          this.start = set.start;
        }

        // Check for set overlapping (= versus set)
        set.versus = !!previousSet && previousSet.start === set.start && previousSet.end === set.end;
        previousSet = set;

        // Split sets by day
        let weekday = this.getSetDate(set.start).weekday();
        if (!days[weekday]) {
          days[weekday] = [];
        }
        days[weekday].push(set);
      });

      // Order sets by day
      scene.setsByDay = [];
      _.each(days, (sets: Set[], weekday) => {
        scene.setsByDay.push({
          weekday: parseInt(weekday, 10),
          sets: sets
        });
      });

    });
  }

  nowPlaying(): Set[] {
    let now = moment();
    return _.map(this.lineup, (scene: Scene) => {
      return _.find(scene.sets, (set: Set) => {
        let start = moment(set.start);
        let end = moment(set.end);
        return now.isBetween(start, end, null, '[)');
      });
    });
  }

  startInfo(): IStartInfo {
    let start = moment(this.start);
    let now = moment();
    return {
      hasStarted: now.isAfter(start),
      start: start,
      diff: start.diff(now)
    };
  }

  // Use moment UTC mode + manual timezone fix to display date whatever the local timezone is
  getSetDate(date: Date): moment.Moment {
    return moment.utc(date).add(this.utcOffset, 'h');
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
  hide: boolean = false;

  // App data only
  setsByDay: IDailySets[] = [];
}

export class Set implements ISet {
  type: SetType;
  start: Date;
  end: Date;
  artistId: string;

  // App data only
  id: string;
  artist: Artist;
  scene: Scene;
  versus: boolean = false;

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
    /* tslint:disable */
    for (let i = 0; i < s.length; ++i) {
      char = s.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return '' + (hash >>> 0);
    /* tslint:enable */
  }

}

export class InfoPage implements IInfoPage {
  title: string;
  content: string;
}
