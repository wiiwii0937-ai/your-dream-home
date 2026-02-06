<?php
/**
 * The main template file
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 *
 * @package Light_Steel
 */

get_header();
?>

<div class="container">
    <div class="content-area">
        
        <?php if ( have_posts() ) : ?>

            <?php if ( is_home() && ! is_front_page() ) : ?>
                <header class="page-header">
                    <h1 class="page-title"><?php single_post_title(); ?></h1>
                </header>
            <?php endif; ?>

            <div class="posts-grid grid grid-3">
                <?php
                while ( have_posts() ) :
                    the_post();
                    ?>
                    
                    <article id="post-<?php the_ID(); ?>" <?php post_class( 'post-card' ); ?>>
                        <?php if ( has_post_thumbnail() ) : ?>
                            <div class="post-card-image">
                                <a href="<?php the_permalink(); ?>">
                                    <?php the_post_thumbnail( 'service-card' ); ?>
                                </a>
                            </div>
                        <?php endif; ?>
                        
                        <div class="post-card-content">
                            <header class="entry-header">
                                <?php the_title( '<h2 class="entry-title"><a href="' . esc_url( get_permalink() ) . '">', '</a></h2>' ); ?>
                                
                                <div class="entry-meta">
                                    <span class="posted-on">
                                        <time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>">
                                            <?php echo esc_html( get_the_date() ); ?>
                                        </time>
                                    </span>
                                    <span class="byline">
                                        <?php esc_html_e( 'by', 'light-steel' ); ?> 
                                        <a href="<?php echo esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ); ?>">
                                            <?php echo esc_html( get_the_author() ); ?>
                                        </a>
                                    </span>
                                </div>
                            </header>

                            <div class="entry-summary">
                                <?php the_excerpt(); ?>
                            </div>

                            <footer class="entry-footer">
                                <a href="<?php the_permalink(); ?>" class="btn btn-outline">
                                    <?php esc_html_e( 'Read More', 'light-steel' ); ?>
                                </a>
                            </footer>
                        </div>
                    </article>

                <?php endwhile; ?>
            </div>

            <?php
            // Pagination
            the_posts_pagination( array(
                'mid_size'  => 2,
                'prev_text' => '&larr; ' . esc_html__( 'Previous', 'light-steel' ),
                'next_text' => esc_html__( 'Next', 'light-steel' ) . ' &rarr;',
            ) );
            ?>

        <?php else : ?>

            <section class="no-results not-found">
                <header class="page-header">
                    <h1 class="page-title"><?php esc_html_e( 'Nothing Found', 'light-steel' ); ?></h1>
                </header>

                <div class="page-content">
                    <?php if ( is_search() ) : ?>
                        <p><?php esc_html_e( 'Sorry, but nothing matched your search terms. Please try again with some different keywords.', 'light-steel' ); ?></p>
                        <?php get_search_form(); ?>
                    <?php else : ?>
                        <p><?php esc_html_e( 'It seems we can&rsquo;t find what you&rsquo;re looking for. Perhaps searching can help.', 'light-steel' ); ?></p>
                        <?php get_search_form(); ?>
                    <?php endif; ?>
                </div>
            </section>

        <?php endif; ?>

    </div>
</div>

<?php
get_footer();
