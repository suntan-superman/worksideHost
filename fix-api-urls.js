/**
 * Fix API URL references in worksideHost
 * Replaces REACT_APP_MONGO_URI with REACT_APP_API_URL
 */

const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/pages/SupplierGroupUsersTabX.jsx',
  'src/components/HelpDialog.jsx',
  'src/components/route-designer/RouteDesigner.jsx',
  'src/components/route-designer/components/Navigation.jsx',
  'src/pages/Requests.jsx',
  'src/components/RequestInfoModal.jsx',
  'src/pages/FirmsTab.jsx',
  'src/components/SupplierProductEditTemplate.jsx',
  'src/pages/SupplierProductsTab.jsx',
  'src/pages/RigsTab.jsx',
  'src/pages/ProjectRequestorsTab.jsx',
  'src/pages/ProjectDocumentsTab.jsx',
  'src/components/SignupDialog.jsx',
  'src/components/ForgotPasswordModal.jsx',
  'src/pages/ValidateUsersTab.jsx',
  'src/components/DeliveryScheduleView.jsx',
  'src/components/DeliveryAssociateDialog.jsx',
  'src/pages/VerifyEmail.jsx',
  'src/pages/ProductsTab.jsx',
  'src/pages/Products.jsx',
  'src/pages/NotificationDialog.jsx',
  'src/pages/CustomerSupplierMSATabX.jsx',
  'src/pages/ContactsTab.jsx',
  'src/components/UserValidationModal.jsx',
  'src/components/ThemeSettings.jsx',
  'src/components/ResetPassword.jsx',
  'src/components/Navbar.jsx',
  'src/components/FileDownload.jsx',
];

let totalFixed = 0;
let filesFixed = 0;

console.log('\n🔧 Fixing API URL references in worksideHost...\n');

filesToFix.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⊘ ${file} - Not found, skipping`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;
  
  // Replace REACT_APP_MONGO_URI with REACT_APP_API_URL
  content = content.replace(/process\.env\.REACT_APP_MONGO_URI/g, 'process.env.REACT_APP_API_URL || "http://localhost:5000"');
  
  if (content !== originalContent) {
    const matches = (originalContent.match(/process\.env\.REACT_APP_MONGO_URI/g) || []).length;
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✓ ${file} - Fixed ${matches} reference(s)`);
    totalFixed += matches;
    filesFixed++;
  } else {
    console.log(`⊘ ${file} - No changes needed`);
  }
});

console.log(`\n═══════════════════════════════════════════════════════════════`);
console.log(`✅ Fixed ${totalFixed} references in ${filesFixed} files\n`);
console.log('Run your app and try logging in again!\n');

