<?php
/**
 * The template for displaying single posts
 *
 * @package Light_Steel
 */

get_header();
?>

<main id="primary" class="site-main single-post-page">
    <?php while ( have_posts() ) : the_post(); ?>

        <article id="post-<?php the_ID(); ?>" <?php post_class( 'single-article' ); ?>>

            <!-- Hero Banner -->
            <?php if ( has_post_thumbnail() ) : ?>
                <div class="single-hero">
                    <?php the_post_thumbnail( 'hero-image', array( 'class' => 'single-hero-image' ) ); ?>
                    <div class="single-hero-overlay">
                        <div class="container">
                            <h1 class="single-title"><?php the_title(); ?></h1>
                            <div class="single-meta">
                                <?php light_steel_posted_on(); ?>
                                <span class="meta-separator">|</span>
                                <?php light_steel_posted_by(); ?>
                                <?php
                                $categories_list = get_the_category_list( ', ' );
                                if ( $categories_list ) :
                                ?>
                                    <span class="meta-separator">|</span>
                                    <span class="cat-links"><?php echo $categories_list; ?></span>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                </div>
            <?php else : ?>
                <div class="single-header">
                    <div class="container">
                        <h1 class="single-title"><?php the_title(); ?></h1>
                        <div class="single-meta">
                            <?php light_steel_posted_on(); ?>
                            <span class="meta-separator">|</span>
                            <?php light_steel_posted_by(); ?>
                        </div>
                    </div>
                </div>
            <?php endif; ?>

            <!-- Content -->
            <div class="single-content-wrap">
                <div class="container">
                    <div class="single-content-grid">

                        <div class="single-content">
                            <div class="entry-content">
                                <?php
                                the_content();

                                wp_link_pages( array(
                                    'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'light-steel' ),
                                    'after'  => '</div>',
                                ) );
                                ?>
                            </div>

                            <!-- Tags -->
                            <?php
                            $tags_list = get_the_tag_list( '', ', ' );
                            if ( $tags_list ) :
                            ?>
                                <div class="single-tags">
                                    <span class="tags-label"><?php esc_html_e( 'Tags:', 'light-steel' ); ?></span>
                                    <?php echo $tags_list; ?>
                                </div>
                            <?php endif; ?>

                            <!-- Post Navigation -->
                            <nav class="post-navigation">
                                <div class="nav-links">
                                    <?php
                                    $prev_post = get_previous_post();
                                    $next_post = get_next_post();
                                    ?>
                                    <?php if ( $prev_post ) : ?>
                                        <div class="nav-previous">
                                            <span class="nav-label"><?php esc_html_e( 'Previous Post', 'light-steel' ); ?></span>
                                            <a href="<?php echo esc_url( get_permalink( $prev_post ) ); ?>">
                                                <?php echo esc_html( $prev_post->post_title ); ?>
                                            </a>
                                        </div>
                                    <?php endif; ?>
                                    <?php if ( $next_post ) : ?>
                                        <div class="nav-next">
                                            <span class="nav-label"><?php esc_html_e( 'Next Post', 'light-steel' ); ?></span>
                                            <a href="<?php echo esc_url( get_permalink( $next_post ) ); ?>">
                                                <?php echo esc_html( $next_post->post_title ); ?>
                                            </a>
                                        </div>
                                    <?php endif; ?>
                                </div>
                            </nav>

                            <!-- Comments -->
                            <?php
                            if ( comments_open() || get_comments_number() ) :
                                comments_template();
                            endif;
                            ?>
                        </div>

                        <!-- Sidebar -->
                        <aside class="single-sidebar">
                            <?php if ( is_active_sidebar( 'footer-1' ) ) : ?>
                                <?php dynamic_sidebar( 'footer-1' ); ?>
                            <?php else : ?>
                                <!-- Recent Posts -->
                                <div class="sidebar-widget">
                                    <h3 class="widget-title"><?php esc_html_e( 'Recent Posts', 'light-steel' ); ?></h3>
                                    <ul class="recent-posts-list">
                                        <?php
                                        $recent_posts = wp_get_recent_posts( array(
                                            'numberposts' => 5,
                                            'post_status' => 'publish',
                                        ) );
                                        foreach ( $recent_posts as $post ) :
                                        ?>
                                            <li>
                                                <a href="<?php echo esc_url( get_permalink( $post['ID'] ) ); ?>">
                                                    <?php echo esc_html( $post['post_title'] ); ?>
                                                </a>
                                                <span class="post-date"><?php echo esc_html( get_the_date( '', $post['ID'] ) ); ?></span>
                                            </li>
                                        <?php endforeach; wp_reset_postdata(); ?>
                                    </ul>
                                </div>

                                <!-- Categories -->
                                <div class="sidebar-widget">
                                    <h3 class="widget-title"><?php esc_html_e( 'Categories', 'light-steel' ); ?></h3>
                                    <ul class="categories-list">
                                        <?php wp_list_categories( array(
                                            'title_li' => '',
                                            'show_count' => true,
                                        ) ); ?>
                                    </ul>
                                </div>
                            <?php endif; ?>
                        </aside>

                    </div>
                </div>
            </div>

        </article>

    <?php endwhile; ?>
</main>

<?php get_footer(); ?>
