const fs = require('fs');
const path = require('path');

const updates = [
  { file: 'collections/Users.ts', group: 'Yönetim', labels: `labels: {\n    singular: 'Yönetici',\n    plural: 'Yöneticiler',\n  },` },
  { file: 'collections/Media.ts', group: 'Yönetim' },
  { file: 'collections/Products.ts', group: 'Yönetim' },
  { file: 'collections/Subscribers.ts', group: 'Yönetim' },
  { file: 'collections/AuditLogs.ts', group: 'Yönetim' },
  { file: 'collections/Coupons.ts', group: 'Yönetim' },
  { file: 'globals/Settings.ts', group: 'Yönetim', replaceLabel: true },
  { file: 'collections/Customers.ts', group: 'Kullanıcı Bilgi Deposu' },
  { file: 'collections/Orders.ts', group: 'Kullanıcı Bilgi Deposu' },
  { file: 'collections/RmaRequests.ts', group: 'Kullanıcı Bilgi Deposu' },
  { file: 'globals/HomePage.ts', group: 'Site' },
  { file: 'globals/AboutPage.ts', group: 'Site' },
  { file: 'globals/ContactPage.ts', group: 'Site' }
];

for (const { file, group, labels, replaceLabel } of updates) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file}`);
    continue;
  }
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Replace group
  if (content.match(/group:\s*['"][^'"]+['"]/)) {
    content = content.replace(/group:\s*['"][^'"]+['"]/, `group: '${group}'`);
  } else if (content.includes('admin: {')) {
    content = content.replace('admin: {', `admin: {\n    group: '${group}',`);
  } else {
    // some don't have admin
    const authRegex = /slug:\s*['"][^'"]+['"],/;
    content = content.replace(authRegex, `$& \n  admin: { group: '${group}' },`);
  }
  
  // Replace Users labels
  if (labels && !content.includes('singular: \'Yönetici\'')) {
    content = content.replace(/slug:\s*['"][^'"]+['"],/, `$& \n  ${labels}`);
  }

  // Replace Settings label
  if (replaceLabel) {
    content = content.replace(/label:\s*'Ücretsiz Kargo Alt Limiti \(TL\)'/, `label: 'Kargo Alt Limiti (TL)'`);
  }

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file} to group ${group}`);
}
