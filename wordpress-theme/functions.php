<?php
/**
 * 築安心 Light Steel Construction Theme Functions
 *
 * @package Light_Steel
 * @version 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
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
    // Let WordPress manage the document title
    add_theme_support( 'title-tag' );

    // Enable support for Post Thumbnails
    add_theme_support( 'post-thumbnails' );

    // Add custom image sizes
    add_image_size( 'hero-image', 1920, 1080, true );
    add_image_size( 'service-card', 600, 450, true );
    add_image_size( 'project-thumbnail', 800, 600, true );

    // Register navigation menus
    register_nav_menus( array(
        'primary' => esc_html__( 'Primary Menu', 'light-steel' ),
        'footer'  => esc_html__( 'Footer Menu', 'light-steel' ),
    ) );

    // HTML5 support
    add_theme_support( 'html5', array(
        'search-form', 'comment-form', 'comment-list',
        'gallery', 'caption', 'style', 'script',
    ) );

    // Custom logo
    add_theme_support( 'custom-logo', array(
        'height'      => 80,
        'width'       => 200,
        'flex-height' => true,
        'flex-width'  => true,
    ) );

    // Custom background
    add_theme_support( 'custom-background', array(
        'default-color' => '0a0a0a',
    ) );

    // Responsive embeds & wide alignment
    add_theme_support( 'responsive-embeds' );
    add_theme_support( 'align-wide' );
    add_theme_support( 'automatic-feed-links' );
}
add_action( 'after_setup_theme', 'light_steel_setup' );

/**
 * Content width
 */
function light_steel_content_width() {
    $GLOBALS['content_width'] = apply_filters( 'light_steel_content_width', 1280 );
}
add_action( 'after_setup_theme', 'light_steel_content_width', 0 );

/**
 * Enqueue scripts and styles
 *
 * IMPORTANT: We load Tailwind CSS via CDN for simplified deployment.
 * For production, consider compiling Tailwind locally for smaller bundle size.
 */
function light_steel_scripts() {
    // 1. Tailwind CSS via CDN (simplified deployment)
    wp_enqueue_script(
        'tailwindcss',
        'https://cdn.tailwindcss.com',
        array(),
        null,
        false // load in <head>
    );

    // Tailwind config (inline script after tailwind loads)
    wp_add_inline_script( 'tailwindcss', "
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        primary: {
                            DEFAULT: 'hsl(220, 80%, 45%)',
                            foreground: 'hsl(0, 0%, 100%)',
                        },
                        muted: {
                            DEFAULT: 'hsl(220, 15%, 92%)',
                            foreground: 'hsl(220, 10%, 45%)',
                        },
                    },
                    fontFamily: {
                        sans: ['Noto Sans TC', 'Inter', 'sans-serif'],
                        serif: ['Playfair Display', 'Noto Sans TC', 'serif'],
                    },
                },
            },
        }
    " );

    // 2. Google Fonts — Noto Sans TC + Playfair Display
    wp_enqueue_style(
        'light-steel-google-fonts',
        'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700&family=Playfair+Display:wght@400;500;600;700&display=swap',
        array(),
        null
    );

    // 3. Main theme stylesheet (style.css)
    wp_enqueue_style(
        'light-steel-style',
        get_stylesheet_uri(),
        array(),
        LIGHT_STEEL_VERSION
    );

    // 4. Main JavaScript
    wp_enqueue_script(
        'light-steel-main',
        LIGHT_STEEL_URI . '/assets/js/main.js',
        array(),
        LIGHT_STEEL_VERSION,
        true
    );

    // 5. Navigation script
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

    // Comment reply script
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
        'name'          => esc_html__( 'Primary Sidebar', 'light-steel' ),
        'id'            => 'sidebar-1',
        'before_widget' => '<div id="%1$s" class="sidebar-widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ) );

    for ( $i = 1; $i <= 3; $i++ ) {
        register_sidebar( array(
            'name'          => sprintf( esc_html__( 'Footer Widget %d', 'light-steel' ), $i ),
            'id'            => 'footer-' . $i,
            'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
            'after_widget'  => '</div>',
            'before_title'  => '<h4 class="widget-title">',
            'after_title'   => '</h4>',
        ) );
    }
}
add_action( 'widgets_init', 'light_steel_widgets_init' );

/**
 * Custom navigation walker
 */
class Light_Steel_Nav_Walker extends Walker_Nav_Menu {
    public function start_el( &$output, $item, $depth = 0, $args = array(), $id = 0 ) {
        $classes = empty( $item->classes ) ? array() : (array) $item->classes;
        $classes[] = 'menu-item-' . $item->ID;
        $class_names = join( ' ', apply_filters( 'nav_menu_css_class', array_filter( $classes ), $item, $args, $depth ) );
        $class_names = $class_names ? ' class="' . esc_attr( $class_names ) . '"' : '';

        $output .= '<li' . $class_names . '>';

        $atts = array(
            'title'  => ! empty( $item->attr_title ) ? $item->attr_title : '',
            'target' => ! empty( $item->target ) ? $item->target : '',
            'rel'    => ! empty( $item->xfn ) ? $item->xfn : '',
            'href'   => ! empty( $item->url ) ? $item->url : '',
        );
        $atts = apply_filters( 'nav_menu_link_attributes', $atts, $item, $args, $depth );

        $attributes = '';
        foreach ( $atts as $attr => $value ) {
            if ( ! empty( $value ) ) {
                $value       = ( 'href' === $attr ) ? esc_url( $value ) : esc_attr( $value );
                $attributes .= ' ' . $attr . '="' . $value . '"';
            }
        }

        $title       = apply_filters( 'the_title', $item->title, $item->ID );
        $item_output = isset( $args->before ) ? $args->before : '';
        $item_output .= '<a' . $attributes . '>';
        $item_output .= ( isset( $args->link_before ) ? $args->link_before : '' ) . $title . ( isset( $args->link_after ) ? $args->link_after : '' );
        $item_output .= '</a>';
        $item_output .= isset( $args->after ) ? $args->after : '';

        $output .= apply_filters( 'walker_nav_menu_start_el', $item_output, $item, $depth, $args );
    }
}

/**
 * Custom body classes
 */
function light_steel_body_classes( $classes ) {
    if ( ! is_active_sidebar( 'sidebar-1' ) ) {
        $classes[] = 'no-sidebar';
    }
    if ( is_front_page() ) {
        $classes[] = 'front-page';
    }
    return $classes;
}
add_filter( 'body_class', 'light_steel_body_classes' );

/**
 * Contact form AJAX handler
 */
function light_steel_handle_contact_form() {
    if ( ! wp_verify_nonce( $_POST['nonce'], 'light_steel_nonce' ) ) {
        wp_send_json_error( array( 'message' => __( '安全驗證失敗。', 'light-steel' ) ) );
    }

    $name    = sanitize_text_field( $_POST['name'] ?? '' );
    $email   = sanitize_email( $_POST['email'] ?? '' );
    $phone   = sanitize_text_field( $_POST['phone'] ?? '' );
    $service = sanitize_text_field( $_POST['service'] ?? '' );
    $message = sanitize_textarea_field( $_POST['message'] ?? '' );

    if ( empty( $name ) || empty( $email ) || empty( $message ) ) {
        wp_send_json_error( array( 'message' => __( '請填寫所有必填欄位。', 'light-steel' ) ) );
    }
    if ( ! is_email( $email ) ) {
        wp_send_json_error( array( 'message' => __( '請輸入有效的電子郵件地址。', 'light-steel' ) ) );
    }

    $to      = get_option( 'admin_email' );
    $subject = sprintf( __( '來自 %s 的聯絡表單', 'light-steel' ), $name );
    $body    = sprintf( "姓名: %s\n電郵: %s\n電話: %s\n服務: %s\n\n訊息:\n%s", $name, $email, $phone, $service, $message );
    $headers = array(
        'Content-Type: text/plain; charset=UTF-8',
        'Reply-To: ' . $name . ' <' . $email . '>',
    );

    $sent = wp_mail( $to, $subject, $body, $headers );

    if ( $sent ) {
        wp_send_json_success( array( 'message' => __( '感謝您的來信！我們會盡快與您聯繫。', 'light-steel' ) ) );
    } else {
        wp_send_json_error( array( 'message' => __( '發送失敗，請稍後再試。', 'light-steel' ) ) );
    }
}
add_action( 'wp_ajax_light_steel_contact', 'light_steel_handle_contact_form' );
add_action( 'wp_ajax_nopriv_light_steel_contact', 'light_steel_handle_contact_form' );

/**
 * Theme Customizer
 */
function light_steel_customize_register( $wp_customize ) {
    // Hero Section
    $wp_customize->add_section( 'light_steel_hero', array(
        'title'    => __( 'Hero 主視覺', 'light-steel' ),
        'priority' => 30,
    ) );

    $wp_customize->add_setting( 'hero_title', array(
        'default'           => '築安心',
        'sanitize_callback' => 'sanitize_text_field',
    ) );
    $wp_customize->add_control( 'hero_title', array(
        'label'   => __( 'Hero 標題', 'light-steel' ),
        'section' => 'light_steel_hero',
        'type'    => 'text',
    ) );

    $wp_customize->add_setting( 'hero_subtitle', array(
        'default'           => '輕鋼構建築專家 — 安全、質感、快速',
        'sanitize_callback' => 'sanitize_text_field',
    ) );
    $wp_customize->add_control( 'hero_subtitle', array(
        'label'   => __( 'Hero 副標題', 'light-steel' ),
        'section' => 'light_steel_hero',
        'type'    => 'textarea',
    ) );

    $wp_customize->add_setting( 'hero_background', array(
        'default'           => '',
        'sanitize_callback' => 'esc_url_raw',
    ) );
    $wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'hero_background', array(
        'label'   => __( 'Hero 背景圖片', 'light-steel' ),
        'section' => 'light_steel_hero',
    ) ) );

    // Contact Section
    $wp_customize->add_section( 'light_steel_contact', array(
        'title'    => __( '聯繫資訊', 'light-steel' ),
        'priority' => 40,
    ) );

    $fields = array(
        'contact_phone'   => array( '聯絡電話', 'text' ),
        'contact_email'   => array( '電子郵件', 'email' ),
        'contact_address' => array( '公司地址', 'textarea' ),
        'contact_line'    => array( 'LINE ID', 'text' ),
    );

    foreach ( $fields as $id => $meta ) {
        $wp_customize->add_setting( $id, array(
            'default'           => '',
            'sanitize_callback' => ( $meta[1] === 'email' ) ? 'sanitize_email' : 'sanitize_text_field',
        ) );
        $wp_customize->add_control( $id, array(
            'label'   => $meta[0],
            'section' => 'light_steel_contact',
            'type'    => $meta[1],
        ) );
    }
}
add_action( 'customize_register', 'light_steel_customize_register' );

/**
 * Disable WordPress emoji scripts (performance)
 */
function light_steel_disable_emojis() {
    remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
    remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
    remove_action( 'wp_print_styles', 'print_emoji_styles' );
    remove_action( 'admin_print_styles', 'print_emoji_styles' );
}
add_action( 'init', 'light_steel_disable_emojis' );

/**
 * Include required files
 */
require_once LIGHT_STEEL_DIR . '/inc/template-tags.php';
require_once LIGHT_STEEL_DIR . '/inc/template-functions.php';
