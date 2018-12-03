import autoExternal from 'rollup-plugin-auto-external';
import pkg from './package.json';

export default [
  {
    input: 'src/main.js',
    plugins: [autoExternal()],
    output: [
      {
        file: pkg.module,
        format: 'es',
        exports: 'named'
      }
    ]
  }
];
