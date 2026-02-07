<?php
/**
 * The template for displaying archive pages
 *
 * @package Light_Steel
 */

get_header();
?>

<main id="primary" class="site-main archive-page">

    <!-- Archive Header -->
    <div class="archive-header">
        <div class="container">
            <h1 class="archive-title"><?php the_archive_title(); ?></h1>
            <?php the_archive_description( '<div class="archive-description">', '</div>' ); ?>
        </div>
    </div>

    <!-- Archive Content -->
    <div class="archive-content-wrap">
        <div class="container">
            <div class="archive-grid">

                <div class="archive-posts">
                    <?php if ( have_posts() ) : ?>
                        <div class="posts-grid">
                            <?php while ( have_posts() ) : the_post(); ?>
                                <article id="post-<?php the_ID(); ?>" <?php post_class( 'archive-card' ); ?>>
                                    <?php if ( has_post_thumbnail() ) : ?>
                                        <a class="archive-card-image" href="<?php the_permalink(); ?>">
                                            <?php the_post_thumbnail( 'project-thumbnail', array( 'class' => 'card-thumbnail' ) ); ?>
                                        </a>
                                    <?php endif; ?>
                                    <div class="archive-card-content">
                                        <div class="card-meta">
                                            <?php light_steel_posted_on(); ?>
                                            <?php
                                            $categories = get_the_category();
                                            if ( ! empty( $categories ) ) :
                                            ?>
                                                <span class="card-category"><?php echo esc_html( $categories[0]->name ); ?></span>
                                            <?php endif; ?>
                                        </div>
                                        <h2 class="card-title">
                                            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                                        </h2>
                                        <div class="card-excerpt">
                                            <?php the_excerpt(); ?>
                                        </div>
                                        <a href="<?php the_permalink(); ?>" class="card-read-more">
                                            <?php esc_html_e( 'Read More', 'light-steel' ); ?> &rarr;
                                        </a>
                                    </div>
                                </article>
                            <?php endwhile; ?>
                        </div>

                        <?php light_steel_pagination(); ?>

                    <?php else : ?>
                        <div class="no-results">
                            <h2><?php esc_html_e( 'No posts found', 'light-steel' ); ?></h2>
                            <p><?php esc_html_e( 'There are no posts matching your criteria.', 'light-steel' ); ?></p>
                        </div>
                    <?php endif; ?>
                </div>

                <?php get_sidebar(); ?>

            </div>
        </div>
    </div>

</main>

<?php get_footer(); ?>
