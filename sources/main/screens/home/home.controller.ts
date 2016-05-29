import app from 'main.module';
import {ILogger, LoggerService} from 'helpers/logger/logger';
import {QuoteService} from 'web-services/quote/quote.service';

export class HomeController {

  isLoading: boolean = true;
  quote: string = null;
  images = [
    'images/home/party1.jpg',
    'images/home/party2.jpg',
    'images/home/party3.jpg',
    'images/home/party4.jpg',
    'images/home/party2.jpg?',
    'images/home/party3.jpg?'
  ];

  private logger: ILogger;
  private quoteService: QuoteService;

  constructor(private $cordovaInAppBrowser: any,
              logger: LoggerService,
              quoteService: QuoteService) {

    this.logger = logger.getLogger('home');
    this.quoteService = quoteService;

    this.logger.log('init');

    this.quoteService
      .getRandomJoke({category: 'nerdy'})
      .then((quote: string) => {
        this.quote = quote;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  open(url: string) {
    this.$cordovaInAppBrowser.open(url, '_system');
  }

}

app.controller('homeController', HomeController);
