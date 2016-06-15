import app from 'main.module';
import {ILogger, LoggerService} from 'helpers/logger/logger';

export class MapController {

  isMapLoading = true;
  map: any = {
    center: { latitude: 45, longitude: -73 },
    zoom: 16,
    // see https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    options: {
      scrollwheel: false,
      disableDefaultUI: true    }
  };

  private logger: ILogger;

  constructor(uiGmapGoogleMapApi: any,
              logger: LoggerService) {

    this.logger = logger.getLogger('map');
    this.logger.log('init');

    uiGmapGoogleMapApi.then(() => {
      this.logger.log('Google maps loaded');
      this.isMapLoading = false;
      this.map.options.zoomControlOptions = {
        position: google.maps.ControlPosition.TOP_LEFT
      };
      this.map.options.mapTypeId = google.maps.MapTypeId.SATELLITE;
    });

  }

}

app.controller('mapController', MapController);
