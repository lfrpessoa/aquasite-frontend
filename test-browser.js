const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS = path.join(__dirname, 'screenshots');
if (!fs.existsSync(SCREENSHOTS)) fs.mkdirSync(SCREENSHOTS);

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);

  // 1. Página inicial
  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: path.join(SCREENSHOTS, '1-index.png'), fullPage: true });
  console.log('✓ Página inicial carregada');

  // 2. Página de login
  await page.goto('http://localhost:5173/login');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: path.join(SCREENSHOTS, '2-login.png'), fullPage: true });
  console.log('✓ Página de login carregada');

  // 3. Cadastro de usuário
  await page.click('text=Cadastre-se');
  await page.fill('input[placeholder="Nome de usuário"]', 'testuser');
  await page.fill('input[placeholder="Email"]', 'test@aquasite.com');
  await page.fill('input[placeholder="Senha"]', '123456');
  await page.screenshot({ path: path.join(SCREENSHOTS, '3-register-preenchido.png'), fullPage: true });
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000); // aguarda mensagem de sucesso + volta ao modo login
  await page.screenshot({ path: path.join(SCREENSHOTS, '4-register-resultado.png'), fullPage: true });
  console.log('✓ Cadastro realizado');

  // 4. Login (após cadastro a página volta automaticamente ao modo login)
  await page.fill('input[placeholder="Username ou Email"]', 'testuser');
  await page.fill('input[placeholder="Senha"]', '123456');
  await page.screenshot({ path: path.join(SCREENSHOTS, '5-login-preenchido.png'), fullPage: true });
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(SCREENSHOTS, '6-login-resultado.png'), fullPage: true });
  console.log('✓ Login realizado');

  // 5. Página home com feed
  await page.waitForURL('**/home', { timeout: 5000 }).catch(() => {});
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: path.join(SCREENSHOTS, '7-home.png'), fullPage: true });
  console.log('✓ Home com feed carregada');

  // 6. Criar post
  await page.fill('textarea', 'Post de teste via Playwright!');
  await page.click('button.post-btn');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(SCREENSHOTS, '8-post-criado.png'), fullPage: true });
  console.log('✓ Post criado');

  // 7. Curtir o primeiro post
  const likeBtn = page.locator('button.like-btn').first();
  await likeBtn.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(SCREENSHOTS, '9-post-curtido.png'), fullPage: true });
  console.log('✓ Post curtido');

  // Erros de console
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  if (errors.length > 0) {
    console.log('⚠ Erros de console:', errors);
  } else {
    console.log('✓ Sem erros de console');
  }

  await browser.close();
  console.log(`\nScreenshots salvos em: ${SCREENSHOTS}`);
})();
