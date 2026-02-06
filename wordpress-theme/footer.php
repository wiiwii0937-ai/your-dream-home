    </main><!-- #primary -->

    <footer id="colophon" class="site-footer">
        <div class="container">
            <div class="footer-grid">
                <!-- Footer Brand -->
                <div class="footer-brand">
                    <?php if ( has_custom_logo() ) : ?>
                        <?php the_custom_logo(); ?>
                    <?php else : ?>
                        <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="site-logo" rel="home">
                            <?php bloginfo( 'name' ); ?>
                        </a>
                    <?php endif; ?>
                    
                    <p class="footer-description">
                        <?php echo esc_html( get_bloginfo( 'description' ) ); ?>
                    </p>

                    <!-- Social Links -->
                    <div class="social-links">
                        <a href="#" aria-label="<?php esc_attr_e( 'Facebook', 'light-steel' ); ?>">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                            </svg>
                        </a>
                        <a href="#" aria-label="<?php esc_attr_e( 'Instagram', 'light-steel' ); ?>">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                        </a>
                        <a href="#" aria-label="<?php esc_attr_e( 'LinkedIn', 'light-steel' ); ?>">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                <rect x="2" y="9" width="4" height="12"></rect>
                                <circle cx="4" cy="4" r="2"></circle>
                            </svg>
                        </a>
                        <a href="#" aria-label="<?php esc_attr_e( 'YouTube', 'light-steel' ); ?>">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                            </svg>
                        </a>
                    </div>
                </div>

                <!-- Footer Widget Area 1 -->
                <div class="footer-widget-area">
                    <?php if ( is_active_sidebar( 'footer-1' ) ) : ?>
                        <?php dynamic_sidebar( 'footer-1' ); ?>
                    <?php else : ?>
                        <div class="footer-widget">
                            <h4><?php esc_html_e( 'Services', 'light-steel' ); ?></h4>
                            <ul>
                                <li><a href="#"><?php esc_html_e( 'Villa Construction', 'light-steel' ); ?></a></li>
                                <li><a href="#"><?php esc_html_e( 'Farm Buildings', 'light-steel' ); ?></a></li>
                                <li><a href="#"><?php esc_html_e( 'Commercial Buildings', 'light-steel' ); ?></a></li>
                                <li><a href="#"><?php esc_html_e( 'Renovation', 'light-steel' ); ?></a></li>
                            </ul>
                        </div>
                    <?php endif; ?>
                </div>

                <!-- Footer Widget Area 2 -->
                <div class="footer-widget-area">
                    <?php if ( is_active_sidebar( 'footer-2' ) ) : ?>
                        <?php dynamic_sidebar( 'footer-2' ); ?>
                    <?php else : ?>
                        <div class="footer-widget">
                            <h4><?php esc_html_e( 'Company', 'light-steel' ); ?></h4>
                            <ul>
                                <li><a href="#"><?php esc_html_e( 'About Us', 'light-steel' ); ?></a></li>
                                <li><a href="#"><?php esc_html_e( 'Projects', 'light-steel' ); ?></a></li>
                                <li><a href="#"><?php esc_html_e( 'Advantages', 'light-steel' ); ?></a></li>
                                <li><a href="#"><?php esc_html_e( 'Contact', 'light-steel' ); ?></a></li>
                            </ul>
                        </div>
                    <?php endif; ?>
                </div>

                <!-- Footer Widget Area 3 - Contact Info -->
                <div class="footer-widget-area">
                    <?php if ( is_active_sidebar( 'footer-3' ) ) : ?>
                        <?php dynamic_sidebar( 'footer-3' ); ?>
                    <?php else : ?>
                        <div class="footer-widget">
                            <h4><?php esc_html_e( 'Contact', 'light-steel' ); ?></h4>
                            <ul class="contact-list">
                                <?php if ( get_theme_mod( 'contact_phone' ) ) : ?>
                                    <li>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                        </svg>
                                        <?php echo esc_html( get_theme_mod( 'contact_phone' ) ); ?>
                                    </li>
                                <?php endif; ?>
                                
                                <?php if ( get_theme_mod( 'contact_email' ) ) : ?>
                                    <li>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                            <polyline points="22,6 12,13 2,6"></polyline>
                                        </svg>
                                        <?php echo esc_html( get_theme_mod( 'contact_email' ) ); ?>
                                    </li>
                                <?php endif; ?>
                                
                                <?php if ( get_theme_mod( 'contact_address' ) ) : ?>
                                    <li>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                            <circle cx="12" cy="10" r="3"></circle>
                                        </svg>
                                        <?php echo esc_html( get_theme_mod( 'contact_address' ) ); ?>
                                    </li>
                                <?php endif; ?>
                            </ul>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Footer Bottom -->
            <div class="footer-bottom">
                <p>&copy; <?php echo esc_html( date( 'Y' ) ); ?> <?php bloginfo( 'name' ); ?>. <?php esc_html_e( 'All rights reserved.', 'light-steel' ); ?></p>
                
                <?php
                wp_nav_menu( array(
                    'theme_location' => 'footer',
                    'menu_id'        => 'footer-menu',
                    'container'      => 'nav',
                    'container_class'=> 'footer-nav',
                    'fallback_cb'    => false,
                    'depth'          => 1,
                ) );
                ?>
            </div>
        </div>
    </footer>
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
