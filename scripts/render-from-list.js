const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const urls = JSON.parse(fs.readFileSync('urls.json', 'utf8'));
const remotionDir = path.resolve(__dirname, '../remotion/website-video-render');

urls.forEach((url, index) => {
  const jobId = `auto-${index}-${Date.now()}`;
  const propsPath = path.join(remotionDir, `props-${jobId}.json`);
  const outPath = path.join(remotionDir, 'out', `${jobId}.mp4`);
  const entry = 'src/index.tsx';
  const comp = 'IframeVideo';

  fs.writeFileSync(propsPath, JSON.stringify({ url }), 'utf8');

  console.log(`Rendering: ${url}`);
  try {
    execSync(
      `npx remotion render ${entry} ${comp} ${outPath} --props=${propsPath}`,
      { cwd: remotionDir, stdio: 'inherit', shell: true }
    );
    fs.unlinkSync(propsPath);
  } catch (e) {
    console.error(`❌ Failed to render ${url}`, e);
  }
});
