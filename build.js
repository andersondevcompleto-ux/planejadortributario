const esbuild = require('esbuild');

const isWatch = process.argv.includes('--watch');

const ctxPromise = esbuild.context({
  entryPoints: ['index.ts'],
  bundle: true,
  outfile: 'dist/bundle.js',
  format: 'esm',
  target: ['es2022'],
  platform: 'browser',
  loader: { '.ts': 'ts' },
  minify: !isWatch,
  sourcemap: true,
  logLevel: 'info',
  define: {
    'process.env.NODE_ENV': isWatch ? '"development"' : '"production"',
    'global': 'window'
  }
});

ctxPromise.then(ctx => {
  if (isWatch) {
    ctx.watch();
    console.log('Watching for changes...');
  } else {
    ctx.rebuild().then(() => {
      console.log('Build complete');
      ctx.dispose();
    });
  }
}).catch(() => process.exit(1));