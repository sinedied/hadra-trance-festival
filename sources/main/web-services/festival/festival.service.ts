import app from 'main.module';
import {RestService} from 'helpers/rest/rest.service';
import {ContextService} from 'helpers/context/context.service';
import {Festival} from 'festival.model';

export class FestivalService {

  festival = null;

  // private ROUTES = {
  //   festival: '/festival'
  // };

  constructor(private $q: ng.IQService,
              private restService: RestService,
              private contextService: ContextService) {
  }

  loadFestival(): Festival {
    // TODO: save/load from localStorage + update from network and reload + error management
    let f = new Festival();
    angular.extend(f, JSON.parse(<string>require('static/data.json')));
    f.processData();
    this.festival = f;

    return this.festival;
  }

}

app.service('festivalService', FestivalService);
