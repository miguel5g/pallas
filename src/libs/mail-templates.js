import fs from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';

const templateDir = path.join(path.dirname(url.fileURLToPath(import.meta.url)), '..', 'templates');

async function getFile(template, name) {
  return (await fs.readFile(path.join(templateDir, template, name))).toString();
}

function populate(template, data) {
  let content = template;

  Object.entries(data).forEach(([key, value]) => {
    content = content.replace(new RegExp(`{{ ${key} }}`, 'g'), value);
  });

  return content;
}

async function renderTemplate(name, data) {
  const templateHtml = await getFile(name, 'html');
  const templateTxt = await getFile(name, 'text');
  const { from, title } = JSON.parse(await getFile(name, 'meta'));

  return {
    from,
    html: populate(templateHtml, data),
    text: populate(templateTxt, data),
    title: populate(title, data),
  };
}

export { renderTemplate };
