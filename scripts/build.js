const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');
const distDir = path.join(__dirname, '../dist');
const prefix = '/EPAM-Campus-fundamental-project';

// 1. Ensure directories exist
['', 'html', 'assets', 'img', 'js', 'css'].forEach(dir => {
  fs.mkdirSync(path.join(distDir, dir), { recursive: true });
});

// 2. Copy and rewrite data.json
let dataJson = fs.readFileSync(path.join(srcDir, 'assets/data.json'), 'utf8');
dataJson = dataJson.replace(/\/src\/img\//g, `${prefix}/img/`);
fs.writeFileSync(path.join(distDir, 'assets/data.json'), dataJson);

// 3. Copy images
fs.cpSync(path.join(srcDir, 'img'), path.join(distDir, 'img'), { recursive: true });

// 4. Function to replace paths in HTML
const processHtml = (content) => {
  let newContent = content;
  
  // Replace /dist/css/
  newContent = newContent.replace(/href="\/dist\/css\/([^"]+)"/g, `href="${prefix}/css/$1"`);
  
  // Replace /dist/js/
  newContent = newContent.replace(/src="[^"]*dist\/js\/([^"]+)"/g, `src="${prefix}/js/$1"`);
  
  // Replace /src/html/
  newContent = newContent.replace(/href="\/src\/html\/([^"]+)"/g, `href="${prefix}/html/$1"`);
  
  // Replace /src/index.html
  newContent = newContent.replace(/href="\/src\/index\.html"/g, `href="${prefix}/index.html"`);
  newContent = newContent.replace(/href="index\.html"/g, `href="${prefix}/index.html"`);
  
  // Replace /src/img/
  newContent = newContent.replace(/src="\/src\/img\/([^"]+)"/g, `src="${prefix}/img/$1"`);
  
  // Replace ../img/ and ./img/
  newContent = newContent.replace(/src="\.\.\/img\/([^"]+)"/g, `src="${prefix}/img/$1"`);
  newContent = newContent.replace(/src="\.\/img\/([^"]+)"/g, `src="${prefix}/img/$1"`);

  // Replace JS window.location.href='/src/html/...'
  newContent = newContent.replace(/window\.location\.href='\/src\/html\/([^']+)'/g, `window.location.href='${prefix}/html/$1'`);

  return newContent;
};

// 5. Process HTML files
const indexHtml = fs.readFileSync(path.join(srcDir, 'index.html'), 'utf8');
fs.writeFileSync(path.join(distDir, 'index.html'), processHtml(indexHtml));

const htmlFiles = fs.readdirSync(path.join(srcDir, 'html')).filter(f => f.endsWith('.html'));
htmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(srcDir, 'html', file), 'utf8');
  fs.writeFileSync(path.join(distDir, 'html', file), processHtml(content));
});

// 6. Process JS files (must run AFTER tsc)
const jsDir = path.join(distDir, 'js');
if (fs.existsSync(jsDir)) {
  const processJs = (file) => {
    let content = fs.readFileSync(file, 'utf8');
    
    // fetch('/src/assets/data.json')
    content = content.replace(/fetch\('\/src\/assets\/data\.json'\)/g, `fetch('${prefix}/assets/data.json')`);
    
    // window.location.href = `./product.html?id=${id}`
    content = content.replace(/window\.location\.href\s*=\s*`\.\/product\.html\?id=\$\{id\}`/g, `window.location.href = \`${prefix}/html/product.html?id=\${id}\``);
    content = content.replace(/window\.location\.href\s*=\s*`\.\/html\/product\.html\?id=\$\{id\}`/g, `window.location.href = \`${prefix}/html/product.html?id=\${id}\``);
    
    // /src/img/
    content = content.replace(/src="\/src\/img\/([^"]+)"/g, `src="${prefix}/img/$1"`);
    
    fs.writeFileSync(file, content);
  };

  const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
  jsFiles.forEach(file => processJs(path.join(jsDir, file)));
}

// 7. Process CSS files
const cssDir = path.join(distDir, 'css');
if (fs.existsSync(cssDir)) {
  const processCss = (file) => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace /src/img/ or ../src/img/ or ../../src/img/
    content = content.replace(/url\(\s*['"]?(?:\.\.\/)*src\/img\/([^'"\)]+)['"]?\s*\)/g, `url('${prefix}/img/$1')`);
    
    // Replace absolute /src/img/
    content = content.replace(/url\(\s*['"]?\/src\/img\/([^'"\)]+)['"]?\s*\)/g, `url('${prefix}/img/$1')`);
    
    // Replace ../img/
    content = content.replace(/url\(\s*['"]?\.\.\/img\/([^'"\)]+)['"]?\s*\)/g, `url('${prefix}/img/$1')`);

    fs.writeFileSync(file, content);
  };

  const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
  cssFiles.forEach(file => processCss(path.join(cssDir, file)));
}

console.log('Build script complete: Files copied and paths rewritten for GitHub Pages!');
