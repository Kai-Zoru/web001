/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      screens: {
        mob_land: { raw: "(min-width: 480px) and (orientation: landscape)" },
      },
    },
  },
};
