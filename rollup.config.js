import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

export default {
  input: 'src/main.js',
  output: {
    name: 'Crontools',
    file: 'lib/crontools.js',
    format: 'cjs',
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
      plugins: ['@babel/proposal-class-properties'],
    }),
    uglify(),
  ],
};
