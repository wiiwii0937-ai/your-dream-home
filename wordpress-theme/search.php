<?php
/**
 * The template for displaying search results
 *
 * @package Light_Steel
 */

get_header();
?>

<main id="primary" class="site-main search-page">

    <!-- Search Header -->
    <div class="search-header">
        <div class="container">
            <h1 class="search-title">
                <?php
                printf(
                    /* translators: %s: search query */
                    esc_html__( 'Search Results for: %s', 'light-steel' ),
                    '<span>' . get_search_query() . '</span>'
                );
                ?>
            </h1>

            <!-- Search Form -->
            <div class="search-form-wrap">
                <?php get_search_form(); ?>
            </div>
        </div>
    </div>

    <!-- Search Results -->
    <div class="search-content-wrap">
        <div class="container">
            <div class="search-grid">

                <div class="search-results">
                    <?php if ( have_posts() ) : ?>
                        <p class="results-count">
                            <?php
                            printf(
                                /* translators: %s: number of results */
                                esc_html( _n( '%s result found', '%s results found', $wp_query->found_posts, 'light-steel' ) ),
                                number_format_i18n( $wp_query->found_posts )
                            );
                            ?>
                        </p>

                        <div class="results-list">
                            <?php while ( have_posts() ) : the_post(); ?>
                                <article id="post-<?php the_ID(); ?>" <?php post_class( 'search-result-item' ); ?>>
                                    <div class="result-content">
                                        <span class="result-type">
                                            <?php echo esc_html( get_post_type_object( get_post_type() )->labels->singular_name ); ?>
                                        </span>
                                        <h2 class="result-title">
                                            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                                        </h2>
                                        <div class="result-meta">
                                            <?php light_steel_posted_on(); ?>
                                            <span class="meta-separator">|</span>
                                            <?php light_steel_posted_by(); ?>
                                        </div>
                                        <div class="result-excerpt">
                                            <?php the_excerpt(); ?>
                                        </div>
                                    </div>
                                    <?php if ( has_post_thumbnail() ) : ?>
                                        <a class="result-thumbnail" href="<?php the_permalink(); ?>">
                                            <?php the_post_thumbnail( 'service-card' ); ?>
                                        </a>
                                    <?php endif; ?>
                                </article>
                            <?php endwhile; ?>
                        </div>

                        <?php light_steel_pagination(); ?>

                    <?php else : ?>
                        <div class="no-results">
                            <h2><?php esc_html_e( 'Nothing Found', 'light-steel' ); ?></h2>
                            <p><?php esc_html_e( 'Sorry, no results matched your search. Try different keywords.', 'light-steel' ); ?></p>
                            <div class="search-suggestions">
                                <h3><?php esc_html_e( 'Suggestions:', 'light-steel' ); ?></h3>
                                <ul>
                                    <li><?php esc_html_e( 'Check your spelling', 'light-steel' ); ?></li>
                                    <li><?php esc_html_e( 'Try more general keywords', 'light-steel' ); ?></li>
                                    <li><?php esc_html_e( 'Try different keywords', 'light-steel' ); ?></li>
                                </ul>
                            </div>
                            <?php get_search_form(); ?>
                        </div>
                    <?php endif; ?>
                </div>

                <?php get_sidebar(); ?>

            </div>
        </div>
    </div>

</main>

<?php get_footer(); ?>
