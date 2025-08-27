// in tailwind.config.js
module.exports = {
  darkMode: 'class',
  // ... your other config
  theme: {
    extend: {
      keyframes: {
        // ... your existing float keyframe
        slideDown: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        // Add this new keyframe for the exit animation
        slideUp: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-100%)' },
        }
      },
      animation: {
        // ... your existing float animation
        'slide-down': 'slideDown 0.5s ease-in-out forwards',
        // Add this new animation class
        'slide-up': 'slideUp 0.5s ease-in-out forwards',
      },
    },
  },
  // ...
}