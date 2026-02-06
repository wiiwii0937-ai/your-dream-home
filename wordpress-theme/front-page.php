<?php
/**
 * The front page template file
 *
 * This is the template for the static front page.
 *
 * @package Light_Steel
 */

get_header();
?>

<!-- Hero Section -->
<section id="hero" class="hero">
    <div class="hero-background">
        <?php 
        $hero_bg = get_theme_mod( 'hero_background' );
        if ( $hero_bg ) : 
        ?>
            <img src="<?php echo esc_url( $hero_bg ); ?>" alt="<?php esc_attr_e( 'Hero background', 'light-steel' ); ?>">
        <?php else : ?>
            <img src="<?php echo esc_url( LIGHT_STEEL_URI . '/assets/images/hero-bg.jpg' ); ?>" alt="<?php esc_attr_e( 'Hero background', 'light-steel' ); ?>">
        <?php endif; ?>
        <div class="hero-overlay"></div>
    </div>

    <div class="hero-content animate-fade-in-up">
        <h1 class="hero-title">
            <?php echo esc_html( get_theme_mod( 'hero_title', __( 'Light Steel Frame Construction', 'light-steel' ) ) ); ?>
        </h1>
        <p class="hero-subtitle">
            <?php echo esc_html( get_theme_mod( 'hero_subtitle', __( 'Building the future with innovative steel construction technology. Durable, eco-friendly, and cost-effective solutions for your dream home.', 'light-steel' ) ) ); ?>
        </p>
        <div class="hero-buttons">
            <a href="#services" class="btn btn-primary">
                <?php esc_html_e( 'Our Services', 'light-steel' ); ?>
            </a>
            <a href="#contact" class="btn btn-outline">
                <?php esc_html_e( 'Get Free Quote', 'light-steel' ); ?>
            </a>
        </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="scroll-indicator">
        <a href="#services" aria-label="<?php esc_attr_e( 'Scroll to services', 'light-steel' ); ?>">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        </a>
    </div>
</section>

<!-- Services Section -->
<section id="services" class="services-section section">
    <div class="container">
        <div class="section-header">
            <h2><?php esc_html_e( 'Our Services', 'light-steel' ); ?></h2>
            <p><?php esc_html_e( 'Professional light steel frame construction services tailored to your needs', 'light-steel' ); ?></p>
        </div>

        <div class="grid grid-4">
            <!-- Villa Construction -->
            <div class="service-card animate-fade-in-up stagger-1">
                <div class="service-card-image">
                    <img src="<?php echo esc_url( LIGHT_STEEL_URI . '/assets/images/service-villa.jpg' ); ?>" alt="<?php esc_attr_e( 'Villa Construction', 'light-steel' ); ?>">
                </div>
                <div class="service-card-content">
                    <h3><?php esc_html_e( 'Villa Construction', 'light-steel' ); ?></h3>
                    <p><?php esc_html_e( 'Luxury villas with modern light steel frame technology for durability and elegance.', 'light-steel' ); ?></p>
                    <a href="<?php echo esc_url( home_url( '/services/villa/' ) ); ?>" class="btn btn-outline">
                        <?php esc_html_e( 'Learn More', 'light-steel' ); ?>
                    </a>
                </div>
            </div>

            <!-- Farm Buildings -->
            <div class="service-card animate-fade-in-up stagger-2">
                <div class="service-card-image">
                    <img src="<?php echo esc_url( LIGHT_STEEL_URI . '/assets/images/service-farm.jpg' ); ?>" alt="<?php esc_attr_e( 'Farm Buildings', 'light-steel' ); ?>">
                </div>
                <div class="service-card-content">
                    <h3><?php esc_html_e( 'Farm Buildings', 'light-steel' ); ?></h3>
                    <p><?php esc_html_e( 'Efficient agricultural structures designed for modern farming operations.', 'light-steel' ); ?></p>
                    <a href="<?php echo esc_url( home_url( '/services/farm/' ) ); ?>" class="btn btn-outline">
                        <?php esc_html_e( 'Learn More', 'light-steel' ); ?>
                    </a>
                </div>
            </div>

            <!-- Commercial Buildings -->
            <div class="service-card animate-fade-in-up stagger-3">
                <div class="service-card-image">
                    <img src="<?php echo esc_url( LIGHT_STEEL_URI . '/assets/images/service-commercial.jpg' ); ?>" alt="<?php esc_attr_e( 'Commercial Buildings', 'light-steel' ); ?>">
                </div>
                <div class="service-card-content">
                    <h3><?php esc_html_e( 'Commercial Buildings', 'light-steel' ); ?></h3>
                    <p><?php esc_html_e( 'Professional commercial spaces built with precision and efficiency.', 'light-steel' ); ?></p>
                    <a href="<?php echo esc_url( home_url( '/services/commercial/' ) ); ?>" class="btn btn-outline">
                        <?php esc_html_e( 'Learn More', 'light-steel' ); ?>
                    </a>
                </div>
            </div>

            <!-- Renovation -->
            <div class="service-card animate-fade-in-up stagger-4">
                <div class="service-card-image">
                    <img src="<?php echo esc_url( LIGHT_STEEL_URI . '/assets/images/service-renovation.jpg' ); ?>" alt="<?php esc_attr_e( 'Renovation', 'light-steel' ); ?>">
                </div>
                <div class="service-card-content">
                    <h3><?php esc_html_e( 'Renovation', 'light-steel' ); ?></h3>
                    <p><?php esc_html_e( 'Transform existing structures with modern steel frame upgrades.', 'light-steel' ); ?></p>
                    <a href="<?php echo esc_url( home_url( '/services/renovation/' ) ); ?>" class="btn btn-outline">
                        <?php esc_html_e( 'Learn More', 'light-steel' ); ?>
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Advantages Section -->
<section id="advantages" class="advantages-section section section-dark">
    <div class="container">
        <div class="section-header">
            <h2><?php esc_html_e( 'Why Choose Light Steel?', 'light-steel' ); ?></h2>
            <p><?php esc_html_e( 'Discover the benefits of modern light steel frame construction', 'light-steel' ); ?></p>
        </div>

        <div class="grid grid-4">
            <!-- Fast Construction -->
            <div class="advantage-card">
                <div class="advantage-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                </div>
                <h4><?php esc_html_e( 'Fast Construction', 'light-steel' ); ?></h4>
                <p><?php esc_html_e( '50% faster than traditional methods with prefabricated components.', 'light-steel' ); ?></p>
            </div>

            <!-- Earthquake Resistant -->
            <div class="advantage-card">
                <div class="advantage-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                </div>
                <h4><?php esc_html_e( 'Earthquake Resistant', 'light-steel' ); ?></h4>
                <p><?php esc_html_e( 'Flexible steel frames absorb seismic energy effectively.', 'light-steel' ); ?></p>
            </div>

            <!-- Eco-Friendly -->
            <div class="advantage-card">
                <div class="advantage-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                        <path d="M2 17l10 5 10-5"></path>
                        <path d="M2 12l10 5 10-5"></path>
                    </svg>
                </div>
                <h4><?php esc_html_e( 'Eco-Friendly', 'light-steel' ); ?></h4>
                <p><?php esc_html_e( '100% recyclable steel with minimal construction waste.', 'light-steel' ); ?></p>
            </div>

            <!-- Cost Effective -->
            <div class="advantage-card">
                <div class="advantage-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                </div>
                <h4><?php esc_html_e( 'Cost Effective', 'light-steel' ); ?></h4>
                <p><?php esc_html_e( 'Reduced labor costs and shorter project timelines.', 'light-steel' ); ?></p>
            </div>

            <!-- Fire Resistant -->
            <div class="advantage-card">
                <div class="advantage-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 22c5-3 9-6 9-10a7 7 0 0 0-14 0c0 4 4 7 5 10z"></path>
                    </svg>
                </div>
                <h4><?php esc_html_e( 'Fire Resistant', 'light-steel' ); ?></h4>
                <p><?php esc_html_e( 'Non-combustible steel provides enhanced fire safety.', 'light-steel' ); ?></p>
            </div>

            <!-- Durability -->
            <div class="advantage-card">
                <div class="advantage-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                </div>
                <h4><?php esc_html_e( 'Long Durability', 'light-steel' ); ?></h4>
                <p><?php esc_html_e( '50+ years lifespan with minimal maintenance required.', 'light-steel' ); ?></p>
            </div>

            <!-- Precision -->
            <div class="advantage-card">
                <div class="advantage-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                </div>
                <h4><?php esc_html_e( 'High Precision', 'light-steel' ); ?></h4>
                <p><?php esc_html_e( 'Computer-aided manufacturing ensures exact specifications.', 'light-steel' ); ?></p>
            </div>

            <!-- Energy Efficient -->
            <div class="advantage-card">
                <div class="advantage-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                </div>
                <h4><?php esc_html_e( 'Energy Efficient', 'light-steel' ); ?></h4>
                <p><?php esc_html_e( 'Excellent insulation options reduce heating and cooling costs.', 'light-steel' ); ?></p>
            </div>
        </div>
    </div>
</section>

<!-- Contact Section -->
<section id="contact" class="contact-section section">
    <div class="container">
        <div class="section-header">
            <h2><?php esc_html_e( 'Get In Touch', 'light-steel' ); ?></h2>
            <p><?php esc_html_e( 'Ready to start your project? Contact us for a free consultation and quote.', 'light-steel' ); ?></p>
        </div>

        <div class="contact-grid">
            <!-- Contact Information -->
            <div class="contact-info">
                <h3><?php esc_html_e( 'Contact Information', 'light-steel' ); ?></h3>
                
                <?php if ( get_theme_mod( 'contact_phone' ) ) : ?>
                    <div class="contact-item">
                        <div class="contact-item-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                        </div>
                        <div>
                            <strong><?php esc_html_e( 'Phone', 'light-steel' ); ?></strong>
                            <p><?php echo esc_html( get_theme_mod( 'contact_phone' ) ); ?></p>
                        </div>
                    </div>
                <?php endif; ?>

                <?php if ( get_theme_mod( 'contact_email' ) ) : ?>
                    <div class="contact-item">
                        <div class="contact-item-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                        </div>
                        <div>
                            <strong><?php esc_html_e( 'Email', 'light-steel' ); ?></strong>
                            <p><?php echo esc_html( get_theme_mod( 'contact_email' ) ); ?></p>
                        </div>
                    </div>
                <?php endif; ?>

                <?php if ( get_theme_mod( 'contact_address' ) ) : ?>
                    <div class="contact-item">
                        <div class="contact-item-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                        </div>
                        <div>
                            <strong><?php esc_html_e( 'Address', 'light-steel' ); ?></strong>
                            <p><?php echo nl2br( esc_html( get_theme_mod( 'contact_address' ) ) ); ?></p>
                        </div>
                    </div>
                <?php endif; ?>

                <div class="contact-item">
                    <div class="contact-item-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                    </div>
                    <div>
                        <strong><?php esc_html_e( 'Business Hours', 'light-steel' ); ?></strong>
                        <p><?php esc_html_e( 'Mon - Fri: 9:00 AM - 6:00 PM', 'light-steel' ); ?></p>
                        <p><?php esc_html_e( 'Sat: 10:00 AM - 4:00 PM', 'light-steel' ); ?></p>
                    </div>
                </div>
            </div>

            <!-- Contact Form -->
            <div class="contact-form">
                <form id="contact-form" method="post">
                    <?php wp_nonce_field( 'light_steel_contact_form', 'contact_nonce' ); ?>
                    
                    <div class="form-group">
                        <label for="contact-name"><?php esc_html_e( 'Name', 'light-steel' ); ?> *</label>
                        <input type="text" id="contact-name" name="name" required>
                    </div>

                    <div class="form-group">
                        <label for="contact-email"><?php esc_html_e( 'Email', 'light-steel' ); ?> *</label>
                        <input type="email" id="contact-email" name="email" required>
                    </div>

                    <div class="form-group">
                        <label for="contact-phone"><?php esc_html_e( 'Phone', 'light-steel' ); ?></label>
                        <input type="tel" id="contact-phone" name="phone">
                    </div>

                    <div class="form-group">
                        <label for="contact-service"><?php esc_html_e( 'Service Interested In', 'light-steel' ); ?></label>
                        <select id="contact-service" name="service">
                            <option value=""><?php esc_html_e( 'Select a service', 'light-steel' ); ?></option>
                            <option value="villa"><?php esc_html_e( 'Villa Construction', 'light-steel' ); ?></option>
                            <option value="farm"><?php esc_html_e( 'Farm Buildings', 'light-steel' ); ?></option>
                            <option value="commercial"><?php esc_html_e( 'Commercial Buildings', 'light-steel' ); ?></option>
                            <option value="renovation"><?php esc_html_e( 'Renovation', 'light-steel' ); ?></option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="contact-message"><?php esc_html_e( 'Message', 'light-steel' ); ?> *</label>
                        <textarea id="contact-message" name="message" rows="5" required></textarea>
                    </div>

                    <button type="submit" class="btn btn-primary">
                        <?php esc_html_e( 'Send Message', 'light-steel' ); ?>
                    </button>
                </form>

                <div id="form-response" class="form-response" style="display: none;"></div>
            </div>
        </div>
    </div>
</section>

<?php
get_footer();
