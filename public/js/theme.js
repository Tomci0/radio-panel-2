(() => {
    'use strict'
  
      const getStoredTheme = () => localStorage.getItem('theme');
      const setStoredTheme = theme => localStorage.setItem('theme', theme);
  
      const getPreferredTheme = () => {
        const storedTheme = getStoredTheme();
        if (storedTheme) {
          return storedTheme;
        }
  
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      };
  
      const setTheme = theme => {
        document.documentElement.setAttribute('data-bs-theme', theme);
        document.querySelectorAll('#theme-toggle').forEach(button => {
          const iconElement = button.querySelector('#theme-icon');
          if (iconElement) {
            const currentIcon = iconElement.getAttribute('data-icon');
            const newIcon = theme === 'dark' ? 'mdi:weather-sunny' : 'mdi:weather-night';
            iconElement.setAttribute('data-icon', newIcon);
          }
        });
      };
  
      const updateTheme = () => {
        const currentTheme = getStoredTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setStoredTheme(newTheme);
        setTheme(newTheme);
      };
  
      const showActiveTheme = () => {
        const currentTheme = getStoredTheme() || getPreferredTheme();
        setTheme(currentTheme);
      };
  
      // each document query selector
      document.addEventListener('DOMContentLoaded', () => {
        Array.from(document.querySelectorAll("#theme-toggle")).forEach(button=> {
          button.addEventListener('click', () => {
            updateTheme();
          });
        })
  
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
          const storedTheme = getStoredTheme();
          if (!storedTheme) {
            showActiveTheme();
          }
        });
      });
  
      showActiveTheme(); // Ustawienie trybu po załadowaniu strony
  })()