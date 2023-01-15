import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import '../tests/helpers/nodemailer-mock';
import '../tests/helpers/mail-templates-mock';
import { renderTemplate } from './mail-templates';
import { sendMail, transport } from './send-mail';

describe('libs/send-mail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should calls render template with name and data', async () => {
    const template = 'test';
    const data = { prop: 'test', to: 'miguel' };

    renderTemplate.mockResolvedValueOnce({});

    await sendMail(template, data);

    expect(renderTemplate).toBeCalledWith(template, { ...data, to: undefined });
  });

  it('should send email with rendered template', async () => {
    const template = { html: 'html', text: 'text', title: 'title', from: 'from' };

    renderTemplate.mockResolvedValueOnce(template);

    await sendMail('test', { to: 'to' });

    expect(transport.sendMail).toBeCalledWith({
      ...template,
      title: undefined,
      subject: template.title,
      to: 'to',
    });
  });
});
