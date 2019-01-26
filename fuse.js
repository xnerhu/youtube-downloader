const { join } = require('path');
const { TypeChecker } = require('fuse-box-typechecker');
const {
  FuseBox,
  EnvPlugin,
  QuantumPlugin,
  Sparky,
  JSONPlugin,
} = require('fuse-box');

const isProduction = process.env.NODE_ENV === 'prod';

const testWatch = TypeChecker({
  tsConfig: './tsconfig.json',
  tsLint: './tslint.json',
  basePath: './',
  yellowOnLint: true,
  shortenFilenames: true,
  skipTsErrors: [2307, 7006],
});

if (!isProduction) {
  testWatch.runWatch('./src/');
}

class Builder {
  constructor(
    config = {
      target: '',
      name: '',
      output: '',
      instructions: '',
      watch: '',
      watchFilter,
      runWhenCompleted: false,
      devServerOptions: {},
      plugins: [],
    },
  ) {
    const { target, name, output, plugins } = config;
    this.config = config;
    this.fuseConfig = Builder.getFuseConfig(target, name, output, plugins);
  }

  static getFuseConfig(target, name, output = 'build', plugins = []) {
    return {
      target,
      homeDir: 'src/',
      output: join(output, '$name.js'),
      tsConfig: './tsconfig.json',
      useTypescriptCompiler: true,
      sourceMaps: target !== 'server',
      cache: !isProduction,
      plugins: [
        EnvPlugin({
          NODE_ENV: isProduction ? 'production' : 'development',
        }),
        JSONPlugin(),
        isProduction &&
          QuantumPlugin({
            bakeApiIntoBundle: name,
            treeshake: true,
            removeExportsInterop: false,
            uglify: {
              es6: true,
            },
          }),
      ].concat(plugins),
      log: {
        showBundledFiles: false,
      },
    };
  }

  async init() {
    const {
      name,
      target,
      instructions,
      watch,
      watchFilter,
      runWhenCompleted,
      devServerOptions,
    } = this.config;
    const fuse = FuseBox.init(this.fuseConfig);
    const app = fuse.bundle(name).instructions(instructions);

    if (!isProduction) {
      app.watch(watch, watchFilter);

      if (target !== 'server') {
        fuse.dev(devServerOptions);
        app.hmr();
      } else if (runWhenCompleted) {
        app.completed(proc => proc.start());
      }
    }

    return await fuse.run();
  }
}

Sparky.task('default', ['server', 'cli']);

Sparky.task('server', async () => {
  await new Builder({
    name: 'server',
    target: 'server',
    instructions: '> [server/index.ts]',
    runWhenCompleted: true,
    watchFilter: path => !path.match('.*.cli'),
  }).init();
});

Sparky.task('cli', async () => {
  await new Builder({
    name: 'cli',
    target: 'server',
    instructions: '> [cli/index.ts]',
    output: isProduction ? 'bin' : 'build',
    watchFilter: path => !path.match('.*.server -express -body-parser'),
  }).init();
});
