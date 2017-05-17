import { ConnectedFanAngularHerokuPage } from './app.po';

describe('connected-fan-angular-heroku App', () => {
  let page: ConnectedFanAngularHerokuPage;

  beforeEach(() => {
    page = new ConnectedFanAngularHerokuPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
