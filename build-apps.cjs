const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const publicDir = path.join(__dirname, 'public');
const configPath = path.join(publicDir, 'mode-config.json');

// Clean release directory at the very start of the build process
const releaseDir = path.join(__dirname, 'release');
if (fs.existsSync(releaseDir)) {
  console.log('Cleaning existing release directory...');
  try {
    fs.rmSync(releaseDir, { recursive: true, force: true });
  } catch (err) {
    console.warn('Warning: Could not clean release directory:', err.message);
  }
}
fs.mkdirSync(releaseDir, { recursive: true });

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

function buildApp(mode, productName, exeName) {
  console.log(`\n=== Building ${productName} (${mode} mode) ===`);
  
  // 1. Write the runtime configuration
  const config = { mode };
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
  console.log(`Wrote mode configuration to public/mode-config.json:`, config);
  
  // 2. Run npm run build (Vite + esbuild)
  console.log('Running npm run build...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // 3. Create a temporary builder config file to avoid Windows CLI escaping bugs
  const tempBuildDir = path.join(os.tmpdir(), `lpu-build-${mode}-${Date.now()}`);
  const builderConfigPath = path.join(__dirname, 'dist', 'builder-config.json');
  
  const builderConfig = {
    appId: `com.lpu.smartcanteen.${mode}`,
    productName: productName,
    artifactName: exeName,
    files: [
      "dist/**/*",
      "electron.cjs"
    ],
    directories: {
      output: tempBuildDir
    },
    win: {
      target: "portable"
    }
  };
  
  fs.writeFileSync(builderConfigPath, JSON.stringify(builderConfig, null, 2), 'utf8');
  console.log(`Wrote builder configuration to ${builderConfigPath}`);
  
  // 4. Package as portable exe
  console.log(`Packaging ${exeName} with electron-builder...`);
  const builderCmd = `npx electron-builder build --win -c dist/builder-config.json`;
  execSync(builderCmd, { stdio: 'inherit' });
  
  // 5. Copy the compiled .exe file back to the release directory
  const builtExePath = path.join(tempBuildDir, exeName);
  const targetExePath = path.join(releaseDir, exeName);
  
  console.log(`Copying built executable from ${builtExePath} to ${targetExePath}...`);
  fs.copyFileSync(builtExePath, targetExePath);
  
  // 6. Clean up temp build folder & builder config file
  try {
    fs.rmSync(tempBuildDir, { recursive: true, force: true });
    fs.unlinkSync(builderConfigPath);
  } catch (e) {
    console.warn(`Failed to clean up build artifacts:`, e.message);
  }
  
  console.log(`Finished packaging ${exeName}!`);
}

// Build both versions
try {
  buildApp('vendor', 'LPU Canteen Operator Portal', 'LPU-Vendor.exe');
  buildApp('developer', 'LPU Canteen Developer Portal', 'LPU-Developer.exe');
  console.log('\n✅ All builds packaged successfully! Executables are in the "release" directory.');
} catch (error) {
  console.error('\n❌ Build process failed:', error);
  process.exit(1);
}
