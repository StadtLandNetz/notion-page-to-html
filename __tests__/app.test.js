const NotionPageToHtml = require('../app');
const nock = require('nock');
const NotionApiMocks = require('./mocks/notion-api');
const HTML_RESPONSES = require('./mocks/html');
const Errors = require('../errors');

describe('#parse', () => {
  describe('When should include full html document', () => {
    it('it returns full html', async () => {
      nock('https://www.notion.so')
        .post('/api/v3/loadPageChunk')
        .reply(200, NotionApiMocks.SUCCESSFUL_PAGE_CHUCK);

      nock('https://www.notion.so')
        .post('/api/v3/getRecordValues')
        .reply(200, NotionApiMocks.SUCCESSFUL_RECORDS);

      const response = await NotionPageToHtml.parse(
        'https://www.notion.so/asnunes/Simple-Page-Text-4d64bbc0634d4758befa85c5a3a6c22f'
      );

      expect(response).toEqual(HTML_RESPONSES.FULL_DOCUMENT);
    });
  });

  describe('When should not include full html document', () => {
    it('it returns full html', async () => {
      nock('https://www.notion.so')
        .post('/api/v3/loadPageChunk')
        .reply(200, NotionApiMocks.SUCCESSFUL_PAGE_CHUCK);

      nock('https://www.notion.so')
        .post('/api/v3/getRecordValues')
        .reply(200, NotionApiMocks.SUCCESSFUL_RECORDS);

      const response = await NotionPageToHtml.parse(
        'https://www.notion.so/asnunes/Simple-Page-Text-4d64bbc0634d4758befa85c5a3a6c22f',
        false
      );

      expect(response).toEqual(HTML_RESPONSES.BODY_ONLY);
    });
  });

  describe('When wrong link is given', () => {
    it('throw invalid page url error', async () => {
      nock('https://www.notion.so')
        .post('/api/v3/loadPageChunk')
        .reply(200, NotionApiMocks.SUCCESSFUL_PAGE_CHUCK);

      nock('https://www.notion.so')
        .post('/api/v3/getRecordValues')
        .reply(200, NotionApiMocks.SUCCESSFUL_RECORDS);

      const response = () =>
        NotionPageToHtml.parse(
          'https://www.example.com/asnunes/Simple-Page-Text-4d64bbc0634d4758befa85c5a3a6c22f'
        );

      await expect(response).rejects.toThrow(Errors.InvalidPageUrl);
    });
  });
});
