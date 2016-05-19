import app from 'main.module';
import {ILogger, LoggerService} from 'helpers/logger/logger';
import {QuoteService} from 'web-services/quote/quote.service';

/**
 * Displays the home screen.
 */
export class HomeController {

  isLoading: boolean = true;
  quote: string = null;
  images = [
    'images/home/party1.jpg',
    'images/home/party2.jpg',
    'images/home/party3.jpg',
    'images/home/party4.jpg'
  ];

  private logger: ILogger;
  private quoteService: QuoteService;

  constructor(logger: LoggerService,
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

}

app.controller('homeController', HomeController);
