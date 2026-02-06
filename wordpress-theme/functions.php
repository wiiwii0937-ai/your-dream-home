<?php
/**
 * Light Steel Construction Theme Functions
 *
 * @package Light_Steel
 * @version 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

/**
 * Define theme constants
 */
define( 'LIGHT_STEEL_VERSION', '1.0.0' );
define( 'LIGHT_STEEL_DIR', get_template_directory() );
define( 'LIGHT_STEEL_URI', get_template_directory_uri() );

/**
 * Theme Setup
 */
function light_steel_setup() {
    // Add default posts and comments RSS feed links to head
    add_theme_support( 'automatic-feed-links' );

    // Let WordPress manage the document title
    add_theme_support( 'title-tag' );

    // Enable support for Post Thumbnails on posts and pages
    add_theme_support( 'post-thumbnails' );

    // Add custom image sizes
    add_image_size( 'hero-image', 1920, 1080, true );
    add_image_size( 'service-card', 600, 450, true );
    add_image_size( 'project-thumbnail', 800, 600, true );

    // Register navigation menus
    register_nav_menus( array(
        'primary'   => esc_html__( 'Primary Menu', 'light-steel' ),
        'footer'    => esc_html__( 'Footer Menu', 'light-steel' ),
    ) );

    // Switch default core markup to output valid HTML5
    add_theme_support( 'html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ) );

    // Add support for custom logo
    add_theme_support( 'custom-logo', array(
        'height'      => 80,
        'width'       => 200,
        'flex-height' => true,
        'flex-width'  => true,
    ) );

    // Add support for custom background
    add_theme_support( 'custom-background', array(
        'default-color' => '0a0a0a',
    ) );

    // Add support for responsive embeds
    add_theme_support( 'responsive-embeds' );

    // Add support for wide alignment
    add_theme_support( 'align-wide' );

    // Add editor styles
    add_theme_support( 'editor-styles' );
    add_editor_style( 'assets/css/editor-style.css' );
}
add_action( 'after_setup_theme', 'light_steel_setup' );

/**
 * Set the content width in pixels
 */
function light_steel_content_width() {
    $GLOBALS['content_width'] = apply_filters( 'light_steel_content_width', 1280 );
}
add_action( 'after_setup_theme', 'light_steel_content_width', 0 );

/**
 * Enqueue scripts and styles
 */
function light_steel_scripts() {
    // Enqueue Google Fonts
    wp_enqueue_style(
        'light-steel-google-fonts',
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap',
        array(),
        null
    );

    // Enqueue main stylesheet
    wp_enqueue_style(
        'light-steel-style',
        get_stylesheet_uri(),
        array(),
        LIGHT_STEEL_VERSION
    );

    // Enqueue custom CSS if exists
    if ( file_exists( LIGHT_STEEL_DIR . '/assets/css/custom.css' ) ) {
        wp_enqueue_style(
            'light-steel-custom',
            LIGHT_STEEL_URI . '/assets/css/custom.css',
            array( 'light-steel-style' ),
            LIGHT_STEEL_VERSION
        );
    }

    // Enqueue main JavaScript
    wp_enqueue_script(
        'light-steel-main',
        LIGHT_STEEL_URI . '/assets/js/main.js',
        array(),
        LIGHT_STEEL_VERSION,
        true
    );

    // Enqueue navigation script
    wp_enqueue_script(
        'light-steel-navigation',
        LIGHT_STEEL_URI . '/assets/js/navigation.js',
        array(),
        LIGHT_STEEL_VERSION,
        true
    );

    // Localize script with AJAX URL and nonce
    wp_localize_script( 'light-steel-main', 'lightSteelAjax', array(
        'ajaxUrl' => admin_url( 'admin-ajax.php' ),
        'nonce'   => wp_create_nonce( 'light_steel_nonce' ),
    ) );

    // Enqueue comment reply script if needed
    if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
        wp_enqueue_script( 'comment-reply' );
    }
}
add_action( 'wp_enqueue_scripts', 'light_steel_scripts' );

/**
 * Register widget areas
 */
function light_steel_widgets_init() {
    register_sidebar( array(
        'name'          => esc_html__( 'Footer Widget 1', 'light-steel' ),
        'id'            => 'footer-1',
        'description'   => esc_html__( 'Add widgets here for footer column 1.', 'light-steel' ),
        'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ) );

    register_sidebar( array(
        'name'          => esc_html__( 'Footer Widget 2', 'light-steel' ),
        'id'            => 'footer-2',
        'description'   => esc_html__( 'Add widgets here for footer column 2.', 'light-steel' ),
        'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ) );

    register_sidebar( array(
        'name'          => esc_html__( 'Footer Widget 3', 'light-steel' ),
        'id'            => 'footer-3',
        'description'   => esc_html__( 'Add widgets here for footer column 3.', 'light-steel' ),
        'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ) );
}
add_action( 'widgets_init', 'light_steel_widgets_init' );

/**
 * Custom navigation walker for primary menu
 */
class Light_Steel_Nav_Walker extends Walker_Nav_Menu {
    public function start_el( &$output, $item, $depth = 0, $args = array(), $id = 0 ) {
        $classes = empty( $item->classes ) ? array() : (array) $item->classes;
        $classes[] = 'menu-item-' . $item->ID;

        $class_names = join( ' ', apply_filters( 'nav_menu_css_class', array_filter( $classes ), $item, $args, $depth ) );
        $class_names = $class_names ? ' class="' . esc_attr( $class_names ) . '"' : '';

        $output .= '<li' . $class_names . '>';

        $atts = array();
        $atts['title']  = ! empty( $item->attr_title ) ? $item->attr_title : '';
        $atts['target'] = ! empty( $item->target ) ? $item->target : '';
        $atts['rel']    = ! empty( $item->xfn ) ? $item->xfn : '';
        $atts['href']   = ! empty( $item->url ) ? $item->url : '';

        $atts = apply_filters( 'nav_menu_link_attributes', $atts, $item, $args, $depth );

        $attributes = '';
        foreach ( $atts as $attr => $value ) {
            if ( ! empty( $value ) ) {
                $value = ( 'href' === $attr ) ? esc_url( $value ) : esc_attr( $value );
                $attributes .= ' ' . $attr . '="' . $value . '"';
            }
        }

        $title = apply_filters( 'the_title', $item->title, $item->ID );

        $item_output = isset( $args->before ) ? $args->before : '';
        $item_output .= '<a' . $attributes . '>';
        $item_output .= ( isset( $args->link_before ) ? $args->link_before : '' ) . $title . ( isset( $args->link_after ) ? $args->link_after : '' );
        $item_output .= '</a>';
        $item_output .= isset( $args->after ) ? $args->after : '';

        $output .= apply_filters( 'walker_nav_menu_start_el', $item_output, $item, $depth, $args );
    }
}

/**
 * Add custom body classes
 */
function light_steel_body_classes( $classes ) {
    // Add class if no sidebar
    if ( ! is_active_sidebar( 'sidebar-1' ) ) {
        $classes[] = 'no-sidebar';
    }

    // Add class for front page
    if ( is_front_page() ) {
        $classes[] = 'front-page';
    }

    return $classes;
}
add_filter( 'body_class', 'light_steel_body_classes' );

/**
 * Handle contact form submission via AJAX
 */
function light_steel_handle_contact_form() {
    // Verify nonce
    if ( ! wp_verify_nonce( $_POST['nonce'], 'light_steel_nonce' ) ) {
        wp_send_json_error( array( 'message' => __( 'Security check failed.', 'light-steel' ) ) );
    }

    // Sanitize form data
    $name    = sanitize_text_field( $_POST['name'] ?? '' );
    $email   = sanitize_email( $_POST['email'] ?? '' );
    $phone   = sanitize_text_field( $_POST['phone'] ?? '' );
    $service = sanitize_text_field( $_POST['service'] ?? '' );
    $message = sanitize_textarea_field( $_POST['message'] ?? '' );

    // Validate required fields
    if ( empty( $name ) || empty( $email ) || empty( $message ) ) {
        wp_send_json_error( array( 'message' => __( 'Please fill in all required fields.', 'light-steel' ) ) );
    }

    // Validate email
    if ( ! is_email( $email ) ) {
        wp_send_json_error( array( 'message' => __( 'Please enter a valid email address.', 'light-steel' ) ) );
    }

    // Prepare email
    $to      = get_option( 'admin_email' );
    $subject = sprintf( __( 'New Contact Form Submission from %s', 'light-steel' ), $name );
    
    $body = sprintf(
        __( "Name: %s\nEmail: %s\nPhone: %s\nService: %s\n\nMessage:\n%s", 'light-steel' ),
        $name,
        $email,
        $phone,
        $service,
        $message
    );

    $headers = array(
        'Content-Type: text/plain; charset=UTF-8',
        'Reply-To: ' . $name . ' <' . $email . '>',
    );

    // Send email
    $sent = wp_mail( $to, $subject, $body, $headers );

    if ( $sent ) {
        wp_send_json_success( array( 'message' => __( 'Thank you for your message. We will get back to you soon!', 'light-steel' ) ) );
    } else {
        wp_send_json_error( array( 'message' => __( 'There was an error sending your message. Please try again.', 'light-steel' ) ) );
    }
}
add_action( 'wp_ajax_light_steel_contact', 'light_steel_handle_contact_form' );
add_action( 'wp_ajax_nopriv_light_steel_contact', 'light_steel_handle_contact_form' );

/**
 * Theme Customizer additions
 */
function light_steel_customize_register( $wp_customize ) {
    // Hero Section
    $wp_customize->add_section( 'light_steel_hero', array(
        'title'    => __( 'Hero Section', 'light-steel' ),
        'priority' => 30,
    ) );

    // Hero Title
    $wp_customize->add_setting( 'hero_title', array(
        'default'           => __( 'Light Steel Frame Construction', 'light-steel' ),
        'sanitize_callback' => 'sanitize_text_field',
    ) );

    $wp_customize->add_control( 'hero_title', array(
        'label'   => __( 'Hero Title', 'light-steel' ),
        'section' => 'light_steel_hero',
        'type'    => 'text',
    ) );

    // Hero Subtitle
    $wp_customize->add_setting( 'hero_subtitle', array(
        'default'           => __( 'Building the future with innovative steel construction', 'light-steel' ),
        'sanitize_callback' => 'sanitize_text_field',
    ) );

    $wp_customize->add_control( 'hero_subtitle', array(
        'label'   => __( 'Hero Subtitle', 'light-steel' ),
        'section' => 'light_steel_hero',
        'type'    => 'textarea',
    ) );

    // Hero Background Image
    $wp_customize->add_setting( 'hero_background', array(
        'default'           => '',
        'sanitize_callback' => 'esc_url_raw',
    ) );

    $wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'hero_background', array(
        'label'   => __( 'Hero Background Image', 'light-steel' ),
        'section' => 'light_steel_hero',
    ) ) );

    // Contact Section
    $wp_customize->add_section( 'light_steel_contact', array(
        'title'    => __( 'Contact Information', 'light-steel' ),
        'priority' => 40,
    ) );

    // Phone
    $wp_customize->add_setting( 'contact_phone', array(
        'default'           => '',
        'sanitize_callback' => 'sanitize_text_field',
    ) );

    $wp_customize->add_control( 'contact_phone', array(
        'label'   => __( 'Phone Number', 'light-steel' ),
        'section' => 'light_steel_contact',
        'type'    => 'text',
    ) );

    // Email
    $wp_customize->add_setting( 'contact_email', array(
        'default'           => '',
        'sanitize_callback' => 'sanitize_email',
    ) );

    $wp_customize->add_control( 'contact_email', array(
        'label'   => __( 'Email Address', 'light-steel' ),
        'section' => 'light_steel_contact',
        'type'    => 'email',
    ) );

    // Address
    $wp_customize->add_setting( 'contact_address', array(
        'default'           => '',
        'sanitize_callback' => 'sanitize_textarea_field',
    ) );

    $wp_customize->add_control( 'contact_address', array(
        'label'   => __( 'Address', 'light-steel' ),
        'section' => 'light_steel_contact',
        'type'    => 'textarea',
    ) );
}
add_action( 'customize_register', 'light_steel_customize_register' );

/**
 * Disable WordPress emoji scripts
 */
function light_steel_disable_emojis() {
    remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
    remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
    remove_action( 'wp_print_styles', 'print_emoji_styles' );
    remove_action( 'admin_print_styles', 'print_emoji_styles' );
    remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
    remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );
    remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
}
add_action( 'init', 'light_steel_disable_emojis' );

/**
 * Include required files
 */
// Template tags
require_once LIGHT_STEEL_DIR . '/inc/template-tags.php';

// Custom template functions
require_once LIGHT_STEEL_DIR . '/inc/template-functions.php';
