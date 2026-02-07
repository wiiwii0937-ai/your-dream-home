<?php
/**
 * The template for displaying comments
 *
 * @package Light_Steel
 */

if ( post_password_required() ) {
    return;
}
?>

<div id="comments" class="comments-area">

    <?php if ( have_comments() ) : ?>

        <h2 class="comments-title">
            <?php
            $comment_count = get_comments_number();
            printf(
                /* translators: 1: comment count, 2: post title */
                esc_html( _nx(
                    '%1$s Comment on &ldquo;%2$s&rdquo;',
                    '%1$s Comments on &ldquo;%2$s&rdquo;',
                    $comment_count,
                    'comments title',
                    'light-steel'
                ) ),
                number_format_i18n( $comment_count ),
                '<span>' . wp_kses_post( get_the_title() ) . '</span>'
            );
            ?>
        </h2>

        <ol class="comment-list">
            <?php
            wp_list_comments( array(
                'style'       => 'ol',
                'short_ping'  => true,
                'avatar_size' => 48,
                'callback'    => 'light_steel_comment_template',
            ) );
            ?>
        </ol>

        <?php
        the_comments_navigation( array(
            'prev_text' => '&larr; ' . esc_html__( 'Older Comments', 'light-steel' ),
            'next_text' => esc_html__( 'Newer Comments', 'light-steel' ) . ' &rarr;',
        ) );
        ?>

    <?php endif; ?>

    <?php if ( ! comments_open() && get_comments_number() && post_type_supports( get_post_type(), 'comments' ) ) : ?>
        <p class="no-comments"><?php esc_html_e( 'Comments are closed.', 'light-steel' ); ?></p>
    <?php endif; ?>

    <?php
    comment_form( array(
        'title_reply'          => esc_html__( 'Leave a Comment', 'light-steel' ),
        'title_reply_to'       => esc_html__( 'Reply to %s', 'light-steel' ),
        'cancel_reply_link'    => esc_html__( 'Cancel Reply', 'light-steel' ),
        'label_submit'         => esc_html__( 'Post Comment', 'light-steel' ),
        'comment_notes_before' => '<p class="comment-notes">' . esc_html__( 'Your email address will not be published. Required fields are marked *', 'light-steel' ) . '</p>',
        'comment_field'        => '<div class="comment-form-comment"><label for="comment">' . esc_html__( 'Comment *', 'light-steel' ) . '</label><textarea id="comment" name="comment" required></textarea></div>',
        'fields'               => array(
            'author' => '<div class="comment-form-author"><label for="author">' . esc_html__( 'Name *', 'light-steel' ) . '</label><input id="author" name="author" type="text" value="' . esc_attr( $commenter['comment_author'] ?? '' ) . '" required /></div>',
            'email'  => '<div class="comment-form-email"><label for="email">' . esc_html__( 'Email *', 'light-steel' ) . '</label><input id="email" name="email" type="email" value="' . esc_attr( $commenter['comment_author_email'] ?? '' ) . '" required /></div>',
            'url'    => '<div class="comment-form-url"><label for="url">' . esc_html__( 'Website', 'light-steel' ) . '</label><input id="url" name="url" type="url" value="' . esc_attr( $commenter['comment_author_url'] ?? '' ) . '" /></div>',
        ),
    ) );
    ?>

</div>
