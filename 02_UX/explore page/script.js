function toggleNav() {
    const navLinks = document.getElementById('navLinks');
    const menuIcon = document.querySelector('.menu-icon');
    if (navLinks.style.left === '-350px') {
        navLinks.style.left = '0';
        menuIcon.classList.add('active');
    } else {
        navLinks.style.left = '-350px';
        menuIcon.classList.remove('active');
    }
}