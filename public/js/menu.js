// public/js/menu.js
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menu-btn');
  const menu    = document.getElementById('menu');
  const menuIcon= document.getElementById('menu-icon');

  if (!menuBtn || !menu || !menuIcon) return;

  menuBtn.addEventListener('click', () => {
    const isHidden = menu.classList.contains('hidden');

    if (isHidden) {
      menu.classList.remove('hidden', 'menu-leave-active');
      menu.classList.add('menu-enter');
      requestAnimationFrame(() => {
        menu.classList.add('menu-enter-active');
        menu.classList.remove('menu-enter');
      });
    } else {
      menu.classList.add('menu-leave');
      requestAnimationFrame(() => {
        menu.classList.add('menu-leave-active');
        menu.classList.remove('menu-leave');
      });
      setTimeout(() => menu.classList.add('hidden'), 300);
    }

    // Cambia icono ☰ ↔ ✖️
    if (isHidden) {
      menuIcon.innerHTML =
        '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>';
    } else {
      menuIcon.innerHTML =
        '<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>';
    }
  });
});
