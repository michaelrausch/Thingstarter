import { T1Page } from './app.po';

describe('t1 App', function() {
  let page: T1Page;

  beforeEach(() => {
    page = new T1Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
