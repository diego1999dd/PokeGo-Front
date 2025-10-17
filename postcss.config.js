/** @type {import('postcss-load-config').Config} */
module.exports = {
  // O PostCSS precisa usar o Tailwind e o Autoprefixer
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {},
  }
}
