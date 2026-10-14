const http = require('http');

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:9222/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const tabs = JSON.parse(data);
        const tab = tabs.find(t => t.url.includes('8080') || t.type === 'page');
        resolve(tab.webSocketDebuggerUrl);
      });
    }).on('error', reject);
  });
}

function sendCommand(ws, method, params = {}) {
  return new Promise((resolve) => {
    const id = Math.floor(Math.random() * 100000);
    const handler = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === id) {
        ws.removeEventListener('message', handler);
        resolve(data.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function run() {
  const wsUrl = await getWsUrl();
  const ws = new WebSocket(wsUrl);
  await new Promise(r => ws.onopen = r);

  console.log('Connected to CDP');

  // Navigate to products.html
  await sendCommand(ws, 'Page.navigate', { url: 'http://localhost:8080/products.html' });
  await new Promise(r => setTimeout(r, 1200));

  // Test at 375px viewport (mobile)
  await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 800,
    deviceScaleFactor: 1,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 500));

  const evalResult = await sendCommand(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        const footers = document.querySelectorAll('.product-footer');
        return Array.from(footers).slice(0, 5).map((f, i) => {
          const price = f.querySelector('.product-price');
          const btn = f.querySelector('.btn-botanical');
          const pr = price ? price.getBoundingClientRect() : null;
          const br = btn ? btn.getBoundingClientRect() : null;
          const fr = f.getBoundingClientRect();
          return {
            index: i,
            footerWidth: fr.width,
            priceRight: pr ? pr.right : 0,
            btnLeft: br ? br.left : 0,
            overlap: pr && br ? pr.right > br.left : false,
            priceText: price ? price.innerText : '',
            btnText: btn ? btn.innerText : ''
          };
        });
      })()
    `,
    returnByValue: true
  });

  console.log('375px product footer evaluation:', evalResult.result.value);

  // Now test CTA panel button overflow
  await sendCommand(ws, 'Page.navigate', { url: 'http://localhost:8080/index.html' });
  await new Promise(r => setTimeout(r, 1200));

  const ctaResult = await sendCommand(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        const buttons = document.querySelectorAll('.section-cta a, .cta-box a, .section-cta .btn-botanical, .section-cta .btn-outline-botanical');
        return Array.from(buttons).map(b => {
          const rect = b.getBoundingClientRect();
          const parentRect = b.parentElement.getBoundingClientRect();
          return {
            text: b.innerText.replace(/\\n/g, ' ').trim(),
            rectWidth: rect.width,
            scrollWidth: b.scrollWidth,
            textOverflowing: b.scrollWidth > rect.width + 2,
            rightExceedsParent: rect.right > parentRect.right + 2
          };
        });
      })()
    `,
    returnByValue: true
  });

  console.log('CTA buttons check at 375px:', ctaResult.result.value);

  ws.close();
}

run().catch(console.error);
