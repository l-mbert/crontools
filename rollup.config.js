import babel from 'rollup-plugin-babel';

export default {
  input: 'src/main.js',
  output: {
    name: 'Crontime',
    file: 'lib/crontime.js',
    format: 'cjs',
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
      plugins: ['@babel/proposal-class-properties'],
    }),
  ],
};
