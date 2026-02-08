<?php
/**
 * Custom Search Form Template
 *
 * @package Light_Steel
 */
?>

<form role="search" method="get" class="search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
    <label class="search-label" for="search-field-<?php echo esc_attr( wp_unique_id() ); ?>">
        <span class="screen-reader-text"><?php esc_html_e( 'Search for:', 'light-steel' ); ?></span>
    </label>
    <div class="search-input-wrap">
        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
        </svg>
        <input
            type="search"
            id="search-field-<?php echo esc_attr( wp_unique_id() ); ?>"
            class="search-field"
            placeholder="<?php esc_attr_e( 'Search...', 'light-steel' ); ?>"
            value="<?php echo get_search_query(); ?>"
            name="s"
            autocomplete="off"
        />
        <button type="submit" class="search-submit">
            <?php esc_html_e( 'Search', 'light-steel' ); ?>
        </button>
    </div>
</form>
