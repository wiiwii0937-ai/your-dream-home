<?php
/**
 * Functions which enhance the theme by hooking into WordPress
 *
 * @package Light_Steel
 */

/**
 * Add a pingback url auto-discovery header for single posts, pages, or attachments.
 */
function light_steel_pingback_header() {
    if ( is_singular() && pings_open() ) {
        printf( '<link rel="pingback" href="%s">', esc_url( get_bloginfo( 'pingback_url' ) ) );
    }
}
add_action( 'wp_head', 'light_steel_pingback_header' );

/**
 * Add preconnect for Google Fonts.
 */
function light_steel_resource_hints( $urls, $relation_type ) {
    if ( wp_style_is( 'light-steel-google-fonts', 'queue' ) && 'preconnect' === $relation_type ) {
        $urls[] = array(
            'href' => 'https://fonts.googleapis.com',
            'crossorigin',
        );
        $urls[] = array(
            'href' => 'https://fonts.gstatic.com',
            'crossorigin',
        );
    }

    return $urls;
}
add_filter( 'wp_resource_hints', 'light_steel_resource_hints', 10, 2 );

/**
 * Add custom classes to the body element.
 */
function light_steel_custom_body_class( $classes ) {
    // Add class if is front page
    if ( is_front_page() && ! is_home() ) {
        $classes[] = 'is-front-page';
    }

    // Add class for single posts
    if ( is_singular( 'post' ) ) {
        $classes[] = 'single-post-view';
    }

    return $classes;
}
add_filter( 'body_class', 'light_steel_custom_body_class' );

/**
 * Add custom image sizes to media library
 */
function light_steel_custom_image_sizes( $sizes ) {
    return array_merge( $sizes, array(
        'hero-image'        => __( 'Hero Image', 'light-steel' ),
        'service-card'      => __( 'Service Card', 'light-steel' ),
        'project-thumbnail' => __( 'Project Thumbnail', 'light-steel' ),
    ) );
}
add_filter( 'image_size_names_choose', 'light_steel_custom_image_sizes' );

/**
 * Modify the archive title
 */
function light_steel_archive_title( $title ) {
    if ( is_category() ) {
        $title = single_cat_title( '', false );
    } elseif ( is_tag() ) {
        $title = single_tag_title( '', false );
    } elseif ( is_author() ) {
        $title = get_the_author();
    } elseif ( is_post_type_archive() ) {
        $title = post_type_archive_title( '', false );
    }

    return $title;
}
add_filter( 'get_the_archive_title', 'light_steel_archive_title' );

/**
 * Get social share URLs
 */
function light_steel_get_share_urls() {
    $url   = urlencode( get_permalink() );
    $title = urlencode( get_the_title() );

    return array(
        'facebook'  => 'https://www.facebook.com/sharer/sharer.php?u=' . $url,
        'twitter'   => 'https://twitter.com/intent/tweet?url=' . $url . '&text=' . $title,
        'linkedin'  => 'https://www.linkedin.com/shareArticle?mini=true&url=' . $url . '&title=' . $title,
        'pinterest' => 'https://pinterest.com/pin/create/button/?url=' . $url . '&description=' . $title,
        'email'     => 'mailto:?subject=' . $title . '&body=' . $url,
    );
}

/**
 * Custom pagination
 */
function light_steel_pagination( $args = array() ) {
    $defaults = array(
        'prev_text' => '&larr; ' . __( 'Previous', 'light-steel' ),
        'next_text' => __( 'Next', 'light-steel' ) . ' &rarr;',
        'mid_size'  => 2,
    );

    $args = wp_parse_args( $args, $defaults );

    the_posts_pagination( $args );
}

/**
 * Add schema.org markup to navigation
 */
function light_steel_nav_schema( $nav_menu, $args ) {
    if ( 'primary' === $args->theme_location ) {
        $nav_menu = str_replace( '<nav', '<nav itemscope itemtype="https://schema.org/SiteNavigationElement"', $nav_menu );
    }

    return $nav_menu;
}
add_filter( 'wp_nav_menu', 'light_steel_nav_schema', 10, 2 );
