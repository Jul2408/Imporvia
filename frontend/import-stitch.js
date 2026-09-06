const fs = require('fs');
const path = require('path');
const https = require('https');

const outputTxtPath = "C:/Users/user/.gemini/antigravity-ide/brain/4db5df08-9139-4265-933e-09ffa8cda11b/.system_generated/steps/30/output.txt";
const srcAppDir = path.join(__dirname, 'src', 'app');

const routeMapping = {
  "DouaneCheck - Accueil": "page.tsx",
  "DouaneCheck - Tarifs": "tarifs/page.tsx",
  "DouaneCheck - Connexion": "connexion/page.tsx",
  "DouaneCheck - Fonctionnalités": "fonctionnalites/page.tsx",
  "DouaneCheck Admin - Entreprises": "admin/entreprises/page.tsx",
  "DouaneCheck - Article Blog": "blog/article/page.tsx",
  "DouaneCheck Admin - Règles de calcul": "admin/regles/page.tsx",
  "DouaneCheck - Nouvelle Simulation (1/5)": "simulation/nouvelle/page.tsx",
  "DouaneCheck - FAQ": "faq/page.tsx",
  "DouaneCheck - Blog": "blog/page.tsx",
  "DouaneCheck - Inscription": "inscription/page.tsx",
  "DouaneCheck - Contact": "contact/page.tsx",
  "DouaneCheck Admin - Dashboard": "admin/page.tsx",
  "DouaneCheck - Paiement": "paiement/page.tsx",
  "DouaneCheck - Dashboard App": "dashboard/page.tsx",
  "DouaneCheck - Résultat de Simulation": "simulation/resultat/page.tsx",
  "DouaneCheck - Comment ça marche": "comment-ca-marche/page.tsx",
  "DouaneCheck - Vérification": "verification/page.tsx",
  "DouaneCheck - Dashboard": "dashboard-old/page.tsx", // backup name if dashboard is duplicated
};

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function convertHtmlToJsx(html) {
  let bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let content = bodyMatch ? bodyMatch[1] : html;

  content = content.replace(/class=/g, 'className=');
  content = content.replace(/for=/g, 'htmlFor=');
  content = content.replace(/tabindex=/g, 'tabIndex=');
  content = content.replace(/stroke-width=/g, 'strokeWidth=');
  content = content.replace(/stroke-linecap=/g, 'strokeLinecap=');
  content = content.replace(/stroke-linejoin=/g, 'strokeLinejoin=');
  content = content.replace(/fill-rule=/g, 'fillRule=');
  content = content.replace(/clip-rule=/g, 'clipRule=');
  content = content.replace(/xmlns:xlink=/g, 'xmlnsXlink=');
  content = content.replace(/xml:space=/g, 'xmlSpace=');

  // Self closing tags
  const tagsToClose = ['img', 'input', 'br', 'hr', 'path', 'circle', 'rect', 'line', 'polygon', 'polyline', 'ellipse'];
  tagsToClose.forEach(tag => {
    const regex = new RegExp(`<${tag}([^>]*?)(?<!/)>`, 'gi');
    content = content.replace(regex, `<${tag}$1 />`);
  });

  // Remove problematic inline styles temporarily (or handle them if simple)
  content = content.replace(/style="[^"]*"/g, '');
  content = content.replace(/<!--[\s\S]*?-->/g, ''); // remove comments

  return content;
}

async function run() {
  const fileData = fs.readFileSync(outputTxtPath, 'utf8');
  let data;
  try {
    data = JSON.parse(fileData);
  } catch (e) {
    const jsonStr = fileData.substring(fileData.indexOf('{'));
    data = JSON.parse(jsonStr);
  }

  const screens = data.screens || [];
  console.log(`Found ${screens.length} screens.`);

  for (const screen of screens) {
    const title = screen.title;
    const url = screen.htmlCode?.downloadUrl;
    let relPath = routeMapping[title];
    if (!relPath) {
      console.log(`No mapping for ${title}, skipping...`);
      continue;
    }

    if (title === "DouaneCheck - Dashboard" && routeMapping["DouaneCheck - Dashboard App"]) {
        // Just keeping the app one as the main dashboard, they mapped differently
    }

    if (url) {
      console.log(`Downloading ${title}...`);
      const html = await fetchUrl(url);
      const jsxContent = convertHtmlToJsx(html);

      const componentName = title.replace(/[^a-zA-Z0-9]/g, '');
      const fileContent = `export default function ${componentName}() {\n  return (\n    <>\n${jsxContent}\n    </>\n  );\n}\n`;

      const absPath = path.join(srcAppDir, relPath);
      const dir = path.dirname(absPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(absPath, fileContent, 'utf8');
      console.log(`Saved to ${relPath}`);
    }
  }
}

run().catch(console.error);
