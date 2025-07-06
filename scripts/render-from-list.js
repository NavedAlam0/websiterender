const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 1️⃣ Always resolve from repo root, not from __dirname alone
const repoRoot    = path.resolve(__dirname, '..');                  // …/websiterender
const remotionDir = path.join(repoRoot, 'remotion', 'website-video-render');

// 2️⃣ Make sure BOTH remotionDir and its /out folder exist
fs.mkdirSync(remotionDir,            { recursive: true });
fs.mkdirSync(path.join(remotionDir, 'out'), { recursive: true });

// 3️⃣ Read the URL list
const urls = JSON.parse(
  fs.readFileSync(path.join(repoRoot, 'urls.json'), 'utf8')
);

urls.forEach((url, index) => {
  const jobId     = `auto-${index}-${Date.now()}`;
  const propsPath = path.join(remotionDir, `props-${jobId}.json`);
  const outPath   = path.join(remotionDir, 'out', `${jobId}.mp4`);

  fs.writeFileSync(propsPath, JSON.stringify({ url }), 'utf8');

  console.log(`🚀 Rendering ${url}`);
  try {
    execSync(
      `npx remotion render src/index.tsx IframeVideo ${outPath} --props=${propsPath}`,
      { cwd: remotionDir, stdio: 'inherit', shell: true }
    );
  } catch (e) {
    console.error(`❌ failed for ${url}`, e);
  } finally {
    fs.rmSync(propsPath, { force: true });
  }
});
