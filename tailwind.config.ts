/** @type {import('tailwindcss').Config} */
module.exports = {
  // Configura o Tailwind para escanear todos os arquivos HTML e TypeScript
  // que estão dentro do diretório 'src'
  content: ['./src/**/*.{html,ts}'],
  theme: {
    // Aqui você pode estender cores, fontes, espaçamentos, etc.
    extend: {},
  },
  plugins: [],
};
