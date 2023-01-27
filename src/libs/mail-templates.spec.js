import { describe, expect, it } from '@jest/globals';

import '../tests/helpers/node-fs-mock';
import fs from 'node:fs/promises';
import { renderTemplate } from './mail-templates';

function mockReadFile(html, text, meta) {
  fs.readFile
    .mockResolvedValueOnce(Buffer.from(html))
    .mockResolvedValueOnce(Buffer.from(text))
    .mockResolvedValueOnce(Buffer.from(JSON.stringify(meta)));
}

describe('libs/mail-templates', () => {
  it('should try to read the template files', async () => {
    mockReadFile('html', 'text', { title: 'title test', from: 'from test' });

    await renderTemplate('test', { prop: 'Hello World' });

    expect(fs.readFile).toBeCalledTimes(3);
    expect(fs.readFile.mock.calls[0][0]).toMatch(/templates\/test\/html$/);
    expect(fs.readFile.mock.calls[1][0]).toMatch(/templates\/test\/text$/);
    expect(fs.readFile.mock.calls[2][0]).toMatch(/templates\/test\/meta$/);
  });

  it('should replace templates content', async () => {
    const prop = 'World';

    mockReadFile('Html {{ prop }}', 'Text {{ prop }}', {
      title: 'Title {{ prop }}',
      from: 'from test',
    });

    const { from, html, text, title } = await renderTemplate('test', { prop });

    expect(from).toBe('from test');
    expect(html).toBe(`Html ${prop}`);
    expect(title).toBe(`Title ${prop}`);
    expect(text).toBe(`Text ${prop}`);
  });
});
