<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <link rel="profile" href="https://gmpg.org/xfn/11">

    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<div id="page" class="site">
    <a class="skip-link sr-only" href="#primary"><?php esc_html_e( 'Skip to content', 'light-steel' ); ?></a>

    <header id="masthead" class="site-header">
        <div class="container">
            <!-- Site Logo / Branding -->
            <div class="site-branding">
                <?php if ( has_custom_logo() ) : ?>
                    <?php the_custom_logo(); ?>
                <?php else : ?>
                    <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="site-logo" rel="home">
                        <?php bloginfo( 'name' ); ?>
                    </a>
                <?php endif; ?>
            </div>

            <!-- Mobile Menu Toggle -->
            <button class="menu-toggle" aria-controls="primary-menu" aria-expanded="false">
                <span class="sr-only"><?php esc_html_e( 'Toggle menu', 'light-steel' ); ?></span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>

            <!-- Primary Navigation -->
            <nav id="site-navigation" class="main-navigation">
                <?php
                wp_nav_menu( array(
                    'theme_location' => 'primary',
                    'menu_id'        => 'primary-menu',
                    'container'      => false,
                    'fallback_cb'    => false,
                    'walker'         => new Light_Steel_Nav_Walker(),
                ) );
                ?>
            </nav>

            <!-- Header CTA Button -->
            <div class="header-cta">
                <a href="#contact" class="btn btn-primary">
                    <?php esc_html_e( 'Get Quote', 'light-steel' ); ?>
                </a>
            </div>
        </div>
    </header>

    <main id="primary" class="site-main">
