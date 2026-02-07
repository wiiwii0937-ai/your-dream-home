<?php
/**
 * Custom template tags for this theme
 *
 * @package Light_Steel
 */

if ( ! function_exists( 'light_steel_posted_on' ) ) :
    /**
     * Prints HTML with meta information for the current post-date/time.
     */
    function light_steel_posted_on() {
        $time_string = '<time class="entry-date published updated" datetime="%1$s">%2$s</time>';
        
        if ( get_the_time( 'U' ) !== get_the_modified_time( 'U' ) ) {
            $time_string = '<time class="entry-date published" datetime="%1$s">%2$s</time><time class="updated" datetime="%3$s">%4$s</time>';
        }

        $time_string = sprintf(
            $time_string,
            esc_attr( get_the_date( DATE_W3C ) ),
            esc_html( get_the_date() ),
            esc_attr( get_the_modified_date( DATE_W3C ) ),
            esc_html( get_the_modified_date() )
        );

        printf(
            '<span class="posted-on">%s</span>',
            $time_string
        );
    }
endif;

if ( ! function_exists( 'light_steel_posted_by' ) ) :
    /**
     * Prints HTML with meta information for the current author.
     */
    function light_steel_posted_by() {
        printf(
            '<span class="byline"><span class="author vcard"><a class="url fn n" href="%1$s">%2$s</a></span></span>',
            esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ),
            esc_html( get_the_author() )
        );
    }
endif;

if ( ! function_exists( 'light_steel_entry_footer' ) ) :
    /**
     * Prints HTML with meta information for categories, tags, and comments.
     */
    function light_steel_entry_footer() {
        // Hide category and tag text for pages
        if ( 'post' === get_post_type() ) {
            $categories_list = get_the_category_list( ', ' );
            if ( $categories_list ) {
                printf( '<span class="cat-links">%s</span>', $categories_list );
            }

            $tags_list = get_the_tag_list( '', ', ' );
            if ( $tags_list ) {
                printf( '<span class="tags-links">%s</span>', $tags_list );
            }
        }

        if ( ! is_single() && ! post_password_required() && ( comments_open() || get_comments_number() ) ) {
            echo '<span class="comments-link">';
            comments_popup_link(
                sprintf(
                    wp_kses(
                        __( 'Leave a Comment<span class="screen-reader-text"> on %s</span>', 'light-steel' ),
                        array( 'span' => array( 'class' => array() ) )
                    ),
                    wp_kses_post( get_the_title() )
                )
            );
            echo '</span>';
        }

        edit_post_link(
            sprintf(
                wp_kses(
                    __( 'Edit <span class="screen-reader-text">%s</span>', 'light-steel' ),
                    array( 'span' => array( 'class' => array() ) )
                ),
                wp_kses_post( get_the_title() )
            ),
            '<span class="edit-link">',
            '</span>'
        );
    }
endif;

if ( ! function_exists( 'light_steel_post_thumbnail' ) ) :
    /**
     * Displays an optional post thumbnail.
     */
    function light_steel_post_thumbnail( $size = 'post-thumbnail' ) {
        if ( post_password_required() || is_attachment() || ! has_post_thumbnail() ) {
            return;
        }

        if ( is_singular() ) :
            ?>
            <div class="post-thumbnail">
                <?php the_post_thumbnail( $size ); ?>
            </div>
            <?php
        else :
            ?>
            <a class="post-thumbnail" href="<?php the_permalink(); ?>" aria-hidden="true" tabindex="-1">
                <?php
                the_post_thumbnail(
                    $size,
                    array( 'alt' => the_title_attribute( array( 'echo' => false ) ) )
                );
                ?>
            </a>
            <?php
        endif;
    }
endif;

if ( ! function_exists( 'light_steel_excerpt_length' ) ) :
    /**
     * Filter the excerpt length.
     */
    function light_steel_excerpt_length( $length ) {
        if ( is_admin() ) {
            return $length;
        }
        return 20;
    }
    add_filter( 'excerpt_length', 'light_steel_excerpt_length' );
endif;

if ( ! function_exists( 'light_steel_excerpt_more' ) ) :
    /**
     * Filter the excerpt "read more" string.
     */
    function light_steel_excerpt_more( $more ) {
        if ( is_admin() ) {
            return $more;
        }
        return '&hellip;';
    }
    add_filter( 'excerpt_more', 'light_steel_excerpt_more' );
endif;

if ( ! function_exists( 'light_steel_comment_template' ) ) :
    /**
     * Custom comment callback for wp_list_comments.
     */
    function light_steel_comment_template( $comment, $args, $depth ) {
        $tag = ( 'div' === $args['style'] ) ? 'div' : 'li';
        ?>
        <<?php echo $tag; ?> id="comment-<?php comment_ID(); ?>" <?php comment_class( empty( $args['has_children'] ) ? '' : 'parent' ); ?>>
            <article id="div-comment-<?php comment_ID(); ?>" class="comment-body">
                <footer class="comment-meta">
                    <div class="comment-author vcard">
                        <?php echo get_avatar( $comment, $args['avatar_size'] ); ?>
                        <?php printf( '<cite class="fn">%s</cite>', get_comment_author_link() ); ?>
                    </div>
                    <div class="comment-metadata">
                        <a href="<?php echo esc_url( get_comment_link( $comment, $args ) ); ?>">
                            <time datetime="<?php comment_time( 'c' ); ?>">
                                <?php printf( '%1$s at %2$s', get_comment_date(), get_comment_time() ); ?>
                            </time>
                        </a>
                        <?php edit_comment_link( esc_html__( 'Edit', 'light-steel' ), ' &middot; ' ); ?>
                    </div>
                </footer>

                <?php if ( '0' == $comment->comment_approved ) : ?>
                    <p class="comment-awaiting-moderation"><?php esc_html_e( 'Your comment is awaiting moderation.', 'light-steel' ); ?></p>
                <?php endif; ?>

                <div class="comment-content">
                    <?php comment_text(); ?>
                </div>

                <div class="reply">
                    <?php
                    comment_reply_link( array_merge( $args, array(
                        'depth'     => $depth,
                        'max_depth' => $args['max_depth'],
                        'before'    => '',
                        'after'     => '',
                    ) ) );
                    ?>
                </div>
            </article>
        <?php
    }
endif;
