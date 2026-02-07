<?php
/**
 * The sidebar template
 *
 * @package Light_Steel
 */

if ( ! is_active_sidebar( 'sidebar-1' ) ) {
    return;
}
?>

<aside id="secondary" class="widget-area sidebar" role="complementary">
    <?php dynamic_sidebar( 'sidebar-1' ); ?>
</aside>
