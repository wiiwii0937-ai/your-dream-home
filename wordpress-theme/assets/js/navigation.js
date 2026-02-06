/**
 * Light Steel Theme - Navigation JavaScript
 *
 * Handles navigation accessibility and keyboard navigation.
 *
 * @package Light_Steel
 */

(function() {
    'use strict';

    const navigation = document.querySelector('.main-navigation');
    
    if (!navigation) {
        return;
    }

    const menu = navigation.querySelector('ul');
    
    if (!menu) {
        return;
    }

    // Get all menu items with children
    const menuItemsWithChildren = menu.querySelectorAll('.menu-item-has-children');

    /**
     * Toggle focus class for menu items with children
     */
    menuItemsWithChildren.forEach(function(menuItem) {
        const link = menuItem.querySelector('a');
        const submenu = menuItem.querySelector('.sub-menu');

        if (!link || !submenu) {
            return;
        }

        // Handle focus
        link.addEventListener('focus', function() {
            menuItem.classList.add('focus');
        });

        // Handle blur
        menuItem.addEventListener('focusout', function(e) {
            if (!menuItem.contains(e.relatedTarget)) {
                menuItem.classList.remove('focus');
            }
        });

        // Handle click on parent items (for touch devices)
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && submenu.offsetParent === null) {
                e.preventDefault();
                menuItem.classList.toggle('focus');
            }
        });
    });

    /**
     * Handle escape key for submenus
     */
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const focusedSubmenu = document.querySelector('.menu-item-has-children.focus');
            
            if (focusedSubmenu) {
                focusedSubmenu.classList.remove('focus');
                focusedSubmenu.querySelector('a').focus();
            }
        }
    });

    /**
     * Touch-away listener for mobile
     */
    document.addEventListener('touchstart', function(e) {
        if (!navigation.contains(e.target)) {
            menuItemsWithChildren.forEach(function(item) {
                item.classList.remove('focus');
            });
        }
    });

})();
