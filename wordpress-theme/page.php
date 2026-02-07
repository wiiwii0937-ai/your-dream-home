<?php
/**
 * The template for displaying pages
 *
 * @package Light_Steel
 */

get_header();
?>

<main id="primary" class="site-main page-template">
    <?php while ( have_posts() ) : the_post(); ?>

        <article id="post-<?php the_ID(); ?>" <?php post_class( 'page-article' ); ?>>

            <!-- Page Header -->
            <?php if ( has_post_thumbnail() ) : ?>
                <div class="page-hero">
                    <?php the_post_thumbnail( 'hero-image', array( 'class' => 'page-hero-image' ) ); ?>
                    <div class="page-hero-overlay">
                        <div class="container">
                            <h1 class="page-title"><?php the_title(); ?></h1>
                        </div>
                    </div>
                </div>
            <?php else : ?>
                <div class="page-header">
                    <div class="container">
                        <h1 class="page-title"><?php the_title(); ?></h1>
                    </div>
                </div>
            <?php endif; ?>

            <!-- Page Content -->
            <div class="page-content-wrap">
                <div class="container">
                    <div class="entry-content">
                        <?php
                        the_content();

                        wp_link_pages( array(
                            'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'light-steel' ),
                            'after'  => '</div>',
                        ) );
                        ?>
                    </div>

                    <?php
                    if ( comments_open() || get_comments_number() ) :
                        comments_template();
                    endif;
                    ?>
                </div>
            </div>

        </article>

    <?php endwhile; ?>
</main>

<?php get_footer(); ?>
