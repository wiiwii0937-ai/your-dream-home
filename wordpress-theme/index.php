<?php
/**
 * The main template file — 築安心 One-Page Template
 *
 * This serves as the primary index and renders the full one-page site
 * when no more specific template (front-page.php etc.) is matched.
 *
 * @package Light_Steel
 */

get_header();
?>

<!-- ========================================
     HERO CAROUSEL SECTION
     ======================================== -->
<section id="hero" class="hero relative min-h-screen flex items-center justify-center overflow-hidden">
    <div class="hero-background absolute inset-0 z-0">
        <?php
        $hero_bg = get_theme_mod( 'hero_background' );
        if ( $hero_bg ) :
        ?>
            <img src="<?php echo esc_url( $hero_bg ); ?>" alt="<?php esc_attr_e( '築安心', 'light-steel' ); ?>" class="w-full h-full object-cover">
        <?php else : ?>
            <img src="<?php echo esc_url( LIGHT_STEEL_URI . '/assets/images/hero-bg.jpg' ); ?>" alt="<?php esc_attr_e( '築安心', 'light-steel' ); ?>" class="w-full h-full object-cover">
        <?php endif; ?>
        <div class="hero-overlay absolute inset-0"></div>
    </div>

    <div class="hero-content relative z-10 text-center max-w-3xl px-6 animate-fade-in-up">
        <h1 class="hero-title text-5xl md:text-7xl font-bold text-white mb-4" style="font-family: 'Playfair Display', 'Noto Sans TC', serif;">
            <?php echo esc_html( get_theme_mod( 'hero_title', '築安心' ) ); ?>
        </h1>
        <p class="hero-subtitle text-xl md:text-2xl text-white/80 mb-10">
            <?php echo esc_html( get_theme_mod( 'hero_subtitle', '輕鋼構建築專家 — 安全、質感、快速' ) ); ?>
        </p>
        <div class="flex flex-wrap gap-4 justify-center">
            <a href="#services" class="btn btn-primary">
                <?php esc_html_e( '服務項目', 'light-steel' ); ?>
            </a>
            <a href="#contact" class="btn btn-outline border-white text-white hover:bg-white hover:text-gray-900">
                <?php esc_html_e( '免費估價', 'light-steel' ); ?>
            </a>
        </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <a href="#services" aria-label="<?php esc_attr_e( '向下捲動', 'light-steel' ); ?>">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        </a>
    </div>
</section>

<!-- ========================================
     SERVICES SECTION — 服務項目
     ======================================== -->
<section id="services" class="services-section section py-20">
    <div class="container max-w-7xl mx-auto px-6">
        <div class="section-header text-center mb-16">
            <h2 class="text-3xl md:text-5xl font-bold mb-4" style="font-family: 'Playfair Display', serif;">
                <?php esc_html_e( '服務項目', 'light-steel' ); ?>
            </h2>
            <p class="text-lg max-w-2xl mx-auto" style="color: var(--color-text-muted);">
                <?php esc_html_e( '四大專業領域，全方位滿足您的建築需求', 'light-steel' ); ?>
            </p>
        </div>

        <div class="grid grid-4">
            <!-- 輕鋼構別墅 -->
            <div class="service-card animate-fade-in-up stagger-1">
                <div class="service-card-image">
                    <img src="<?php echo esc_url( LIGHT_STEEL_URI . '/assets/images/service-villa.jpg' ); ?>" alt="<?php esc_attr_e( '輕鋼構別墅', 'light-steel' ); ?>">
                </div>
                <div class="service-card-content">
                    <h3><?php esc_html_e( '輕鋼構別墅/住宅', 'light-steel' ); ?></h3>
                    <p><?php esc_html_e( '從現代極簡到溫馨鄉村風格，以精準工藝實現您對家的所有想像。耐震、節能、快速完工。', 'light-steel' ); ?></p>
                    <a href="<?php echo esc_url( home_url( '/services/villa/' ) ); ?>" class="btn btn-outline">
                        <?php esc_html_e( '了解更多', 'light-steel' ); ?>
                    </a>
                </div>
            </div>

            <!-- 農舍/資材室 -->
            <div class="service-card animate-fade-in-up stagger-2">
                <div class="service-card-image">
                    <img src="<?php echo esc_url( LIGHT_STEEL_URI . '/assets/images/service-farm.jpg' ); ?>" alt="<?php esc_attr_e( '農舍建造', 'light-steel' ); ?>">
                </div>
                <div class="service-card-content">
                    <h3><?php esc_html_e( '輕鋼構農舍/資材室', 'light-steel' ); ?></h3>
                    <p><?php esc_html_e( '結合實用功能與美學設計，為您的農地打造符合法規、堅固耐用的農舍或資材室。', 'light-steel' ); ?></p>
                    <a href="<?php echo esc_url( home_url( '/services/farm/' ) ); ?>" class="btn btn-outline">
                        <?php esc_html_e( '了解更多', 'light-steel' ); ?>
                    </a>
                </div>
            </div>

            <!-- 商業空間/民宿 -->
            <div class="service-card animate-fade-in-up stagger-3">
                <div class="service-card-image">
                    <img src="<?php echo esc_url( LIGHT_STEEL_URI . '/assets/images/service-commercial.jpg' ); ?>" alt="<?php esc_attr_e( '商業空間', 'light-steel' ); ?>">
                </div>
                <div class="service-card-content">
                    <h3><?php esc_html_e( '商業空間/民宿', 'light-steel' ); ?></h3>
                    <p><?php esc_html_e( '獨特的建築外觀是最好的品牌行銷。以快速工期搶占市場先機，創造持續的投資回報。', 'light-steel' ); ?></p>
                    <a href="<?php echo esc_url( home_url( '/services/commercial/' ) ); ?>" class="btn btn-outline">
                        <?php esc_html_e( '了解更多', 'light-steel' ); ?>
                    </a>
                </div>
            </div>

            <!-- 舊屋增建/翻新 -->
            <div class="service-card animate-fade-in-up stagger-4">
                <div class="service-card-image">
                    <img src="<?php echo esc_url( LIGHT_STEEL_URI . '/assets/images/service-renovation.jpg' ); ?>" alt="<?php esc_attr_e( '舊屋翻新', 'light-steel' ); ?>">
                </div>
                <div class="service-card-content">
                    <h3><?php esc_html_e( '舊屋增建/翻新', 'light-steel' ); ?></h3>
                    <p><?php esc_html_e( '海砂屋、老舊危樓不必擔心。輕鋼構增建技術讓舊屋華麗轉身，以最短時間完成升級改造。', 'light-steel' ); ?></p>
                    <a href="<?php echo esc_url( home_url( '/services/renovation/' ) ); ?>" class="btn btn-outline">
                        <?php esc_html_e( '了解更多', 'light-steel' ); ?>
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- ========================================
     ADVANTAGES SECTION — 優勢工法
     ======================================== -->
<section id="advantages" class="advantages-section section section-dark py-20">
    <div class="container max-w-7xl mx-auto px-6">
        <div class="section-header text-center mb-16">
            <h2 class="text-3xl md:text-5xl font-bold mb-4" style="font-family: 'Playfair Display', serif;">
                <?php esc_html_e( '優勢工法', 'light-steel' ); ?>
            </h2>
            <p class="text-lg max-w-2xl mx-auto" style="color: var(--color-text-muted);">
                <?php esc_html_e( '築安心的精準革新 — 一條更精準、更靈活、更負責任的「第三條道路」', 'light-steel' ); ?>
            </p>
        </div>

        <div class="grid grid-4">
            <!-- 設計自由 -->
            <div class="advantage-card">
                <div class="advantage-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                        <path d="M2 17l10 5 10-5"></path>
                        <path d="M2 12l10 5 10-5"></path>
                    </svg>
                </div>
                <h4><?php esc_html_e( '設計自由', 'light-steel' ); ?></h4>
                <p><?php esc_html_e( '實現優雅美學的結構基石。各式斜屋頂、大面開窗、多樣造型，忠實還原夢想中的模樣。', 'light-steel' ); ?></p>
            </div>

            <!-- 極致耐震 -->
            <div class="advantage-card">
                <div class="advantage-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                </div>
                <h4><?php esc_html_e( '極致耐震', 'light-steel' ); ?></h4>
                <p><?php esc_html_e( '高強度冷鍍鋅鋼骨「韌性框架」，輕質高強、專業鉸接設計，超越法規標準的安心保障。', 'light-steel' ); ?></p>
            </div>

            <!-- 抗風防線 -->
            <div class="advantage-card">
                <div class="advantage-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"></path>
                        <path d="M9.6 4.6A2 2 0 1 1 11 8H2"></path>
                        <path d="M12.6 19.4A2 2 0 1 0 14 16H2"></path>
                    </svg>
                </div>
                <h4><?php esc_html_e( '抗風防線', 'light-steel' ); ?></h4>
                <p><?php esc_html_e( '颱風頻仍的臺灣必備。抗拔、抗剪系統與氣密錨固設計，牢固守護家園安全。', 'light-steel' ); ?></p>
            </div>

            <!-- 超凡精準 -->
            <div class="advantage-card">
                <div class="advantage-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="6"></circle>
                        <circle cx="12" cy="12" r="2"></circle>
                    </svg>
                </div>
                <h4><?php esc_html_e( '超凡精準', 'light-steel' ); ?></h4>
                <p><?php esc_html_e( '電腦控制產線精準切割，誤差毫米級。所見即所得，告別傳統施工中常見的尺寸誤差。', 'light-steel' ); ?></p>
            </div>

            <!-- 迅捷高效 -->
            <div class="advantage-card">
                <div class="advantage-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                </div>
                <h4><?php esc_html_e( '迅捷高效', 'light-steel' ); ?></h4>
                <p><?php esc_html_e( '並行工程、免養護期、全氣候施工。縮短一半工期，讓美好生活提早開始。', 'light-steel' ); ?></p>
            </div>

            <!-- 靈活永續 -->
            <div class="advantage-card">
                <div class="advantage-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M2 22c1.25-1.25 2.5-2 4-2 3 0 4 3 7 3s4-3 7-3c1.5 0 2.75.75 4 2"></path>
                        <path d="M12 2v10"></path>
                        <path d="M8 6l4-4 4 4"></path>
                    </svg>
                </div>
                <h4><?php esc_html_e( '靈活永續', 'light-steel' ); ?></h4>
                <p><?php esc_html_e( '可變、可逆、環境友善。鋼材100%可回收，施工廢棄物減少達70%，綠色建築的理想選擇。', 'light-steel' ); ?></p>
            </div>

            <!-- 綠色環保 -->
            <div class="advantage-card">
                <div class="advantage-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17 8c.7-1 1-2.2 1-3.5C18 2 16 0 16 0s-2 2-2 4.5c0 1.3.3 2.5 1 3.5"></path>
                        <path d="M14 12c-2 0-3.5.5-5 2-1.5 1.5-2 3-2 5 0 3 2.5 5 5 5h4c2.5 0 5-2 5-5 0-2-.5-3.5-2-5-1.5-1.5-3-2-5-2z"></path>
                    </svg>
                </div>
                <h4><?php esc_html_e( '綠色環保', 'light-steel' ); ?></h4>
                <p><?php esc_html_e( '低碳排、低汙染、輕量化，減少水泥砂石用量。結構層與高性能保溫隔熱材無縫結合。', 'light-steel' ); ?></p>
            </div>

            <!-- 節能高效 -->
            <div class="advantage-card">
                <div class="advantage-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                </div>
                <h4><?php esc_html_e( '節能高效', 'light-steel' ); ?></h4>
                <p><?php esc_html_e( '高性能隔熱系統杜絕冷熱橋效應，大幅降低空調能耗，50年以上使用壽命。', 'light-steel' ); ?></p>
            </div>
        </div>
    </div>
</section>

<!-- ========================================
     ABOUT / BRAND STORY — 品牌故事
     ======================================== -->
<section id="about" class="section py-20">
    <div class="container max-w-4xl mx-auto px-6">
        <div class="section-header text-center mb-12">
            <h2 class="text-3xl md:text-5xl font-bold mb-4" style="font-family: 'Playfair Display', serif;">
                <?php esc_html_e( '關於築安心', 'light-steel' ); ?>
            </h2>
            <p class="text-lg" style="color: var(--color-text-muted);">
                <?php esc_html_e( '專門做輕鋼構住宅的公司，致力於打造安全、質感、快速的理想居所', 'light-steel' ); ?>
            </p>
        </div>

        <div class="brand-story" style="background-color: var(--color-surface); border-radius: var(--radius-lg); padding: 2rem 2.5rem; border: 1px solid var(--color-border);">
            <p style="font-size: 1.1rem; margin-bottom: 1.5rem;">
                <?php esc_html_e( '在臺灣，關於「家」的建築，似乎長久以來只有兩種選擇：', 'light-steel' ); ?>
            </p>
            <blockquote style="border-left: 4px solid var(--color-primary); padding-left: 1.5rem; margin-bottom: 1rem;">
                <p><?php esc_html_e( '一邊是厚重而昂貴的RC水泥盒子，固然堅固，但漫長的工期、難以更動的格局，彷彿框限了生活的形狀。', 'light-steel' ); ?></p>
            </blockquote>
            <blockquote style="border-left: 4px solid var(--color-primary); padding-left: 1.5rem; margin-bottom: 1.5rem;">
                <p><?php esc_html_e( '另一邊是倉促拼湊的鐵皮浪板，滿足速成的需求，卻將城市美學墜落至地平面下。', 'light-steel' ); ?></p>
            </blockquote>
            <p style="font-size: 1.2rem; text-align: center; font-weight: 600; color: var(--color-primary); padding: 1.5rem 0;">
                <?php esc_html_e( '我們不禁想問：家的模樣，能否有第三條路？', 'light-steel' ); ?>
            </p>
            <p style="font-size: 1.1rem;">
                <?php esc_html_e( '這就是「築安心」誕生的起點。我們深信，建築不只是遮蔽風雨的構造物，更是承載生活的歸屬，是形塑城市美學的決定性筆觸。', 'light-steel' ); ?>
            </p>
        </div>

        <!-- Core Values -->
        <div class="grid grid-3" style="margin-top: 3rem;">
            <div class="advantage-card" style="text-align: center;">
                <div class="advantage-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </div>
                <h4><?php esc_html_e( '安全', 'light-steel' ); ?></h4>
                <p><?php esc_html_e( '耐震抗風的科學結構，守護每一個家庭的安心。', 'light-steel' ); ?></p>
            </div>
            <div class="advantage-card" style="text-align: center;">
                <div class="advantage-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l1.5 4.5H18l-3.5 2.5L16 15l-4-3-4 3 1.5-5L6 7.5h4.5z"></path></svg>
                </div>
                <h4><?php esc_html_e( '質感', 'light-steel' ); ?></h4>
                <p><?php esc_html_e( '精準工藝與美學設計，打造獨一無二的理想居所。', 'light-steel' ); ?></p>
            </div>
            <div class="advantage-card" style="text-align: center;">
                <div class="advantage-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                </div>
                <h4><?php esc_html_e( '快速', 'light-steel' ); ?></h4>
                <p><?php esc_html_e( '工廠預製現場組裝，縮短工期讓您早日入住。', 'light-steel' ); ?></p>
            </div>
        </div>
    </div>
</section>

<!-- ========================================
     PROJECTS SECTION — 工程實例
     ======================================== -->
<section id="projects" class="section section-dark py-20">
    <div class="container max-w-7xl mx-auto px-6">
        <div class="section-header text-center mb-16">
            <h2 class="text-3xl md:text-5xl font-bold mb-4" style="font-family: 'Playfair Display', serif;">
                <?php esc_html_e( '工程實例', 'light-steel' ); ?>
            </h2>
            <p class="text-lg max-w-2xl mx-auto" style="color: var(--color-text-muted);">
                <?php esc_html_e( '探索我們的輕鋼構建築作品，見證品質與美學的完美結合', 'light-steel' ); ?>
            </p>
        </div>

        <?php
        // Display recent posts tagged as projects, or fallback to static content
        $projects_query = new WP_Query( array(
            'post_type'      => 'post',
            'posts_per_page' => 4,
            'meta_key'       => '_thumbnail_id', // Only posts with thumbnails
        ) );

        if ( $projects_query->have_posts() ) :
        ?>
        <div class="grid grid-4">
            <?php while ( $projects_query->have_posts() ) : $projects_query->the_post(); ?>
            <div class="service-card">
                <?php if ( has_post_thumbnail() ) : ?>
                <div class="service-card-image">
                    <?php the_post_thumbnail( 'project-thumbnail' ); ?>
                </div>
                <?php endif; ?>
                <div class="service-card-content">
                    <h3><?php the_title(); ?></h3>
                    <p><?php echo esc_html( wp_trim_words( get_the_excerpt(), 20 ) ); ?></p>
                    <a href="<?php the_permalink(); ?>" class="btn btn-outline">
                        <?php esc_html_e( '查看詳情', 'light-steel' ); ?>
                    </a>
                </div>
            </div>
            <?php endwhile; wp_reset_postdata(); ?>
        </div>
        <?php else : ?>
        <!-- Static fallback projects -->
        <div class="grid grid-4">
            <div class="service-card">
                <div class="service-card-image">
                    <img src="<?php echo esc_url( LIGHT_STEEL_URI . '/assets/images/project-1.jpg' ); ?>" alt="YO HOUSE">
                </div>
                <div class="service-card-content">
                    <h3>YO HOUSE 東港Mini初代宅</h3>
                    <p><?php esc_html_e( '展示屋案例 — 移動屋系列', 'light-steel' ); ?></p>
                </div>
            </div>
            <div class="service-card">
                <div class="service-card-image">
                    <img src="<?php echo esc_url( LIGHT_STEEL_URI . '/assets/images/project-2.jpg' ); ?>" alt="景觀窗微型屋">
                </div>
                <div class="service-card-content">
                    <h3>4公尺景觀窗微型屋</h3>
                    <p><?php esc_html_e( '3.3米挑高Loft 完美微型屋', 'light-steel' ); ?></p>
                </div>
            </div>
            <div class="service-card">
                <div class="service-card-image">
                    <img src="<?php echo esc_url( LIGHT_STEEL_URI . '/assets/images/project-3.jpg' ); ?>" alt="鋼構夢想宅">
                </div>
                <div class="service-card-content">
                    <h3>漁業大哥的鋼構夢想宅</h3>
                    <p><?php esc_html_e( '客製化鋼構住宅', 'light-steel' ); ?></p>
                </div>
            </div>
            <div class="service-card">
                <div class="service-card-image">
                    <img src="<?php echo esc_url( LIGHT_STEEL_URI . '/assets/images/project-4.jpg' ); ?>" alt="離島鋼構宅">
                </div>
                <div class="service-card-content">
                    <h3>Yo遊 離島鋼構宅</h3>
                    <p><?php esc_html_e( '打造你的日式夢想家', 'light-steel' ); ?></p>
                </div>
            </div>
        </div>
        <?php endif; ?>

        <div class="text-center" style="margin-top: 3rem;">
            <a href="<?php echo esc_url( home_url( '/projects/' ) ); ?>" class="btn btn-outline">
                <?php esc_html_e( '查看更多案例', 'light-steel' ); ?>
            </a>
        </div>
    </div>
</section>

<!-- ========================================
     CONTACT SECTION — 聯繫我們
     ======================================== -->
<section id="contact" class="contact-section section py-20">
    <div class="container max-w-7xl mx-auto px-6">
        <div class="section-header text-center mb-16">
            <h2 class="text-3xl md:text-5xl font-bold mb-4" style="font-family: 'Playfair Display', serif;">
                <?php esc_html_e( '聯繫我們', 'light-steel' ); ?>
            </h2>
            <p class="text-lg max-w-2xl mx-auto" style="color: var(--color-text-muted);">
                <?php esc_html_e( '歡迎諮詢任何關於輕鋼構建築的問題，我們將竭誠為您服務', 'light-steel' ); ?>
            </p>
        </div>

        <div class="contact-grid">
            <!-- Contact Information -->
            <div class="contact-info">
                <h3><?php esc_html_e( '聯繫資訊', 'light-steel' ); ?></h3>

                <?php if ( get_theme_mod( 'contact_phone' ) ) : ?>
                <div class="contact-item">
                    <div class="contact-item-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.81.36 1.58.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c1.23.34 2 .57 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                    </div>
                    <div>
                        <strong><?php esc_html_e( '聯絡電話', 'light-steel' ); ?></strong>
                        <p><?php echo esc_html( get_theme_mod( 'contact_phone' ) ); ?></p>
                    </div>
                </div>
                <?php else : ?>
                <div class="contact-item">
                    <div class="contact-item-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.81.36 1.58.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c1.23.34 2 .57 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    </div>
                    <div>
                        <strong><?php esc_html_e( '聯絡電話', 'light-steel' ); ?></strong>
                        <p>0800-000-000</p>
                    </div>
                </div>
                <?php endif; ?>

                <?php if ( get_theme_mod( 'contact_email' ) ) : ?>
                <div class="contact-item">
                    <div class="contact-item-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    </div>
                    <div>
                        <strong><?php esc_html_e( '電子郵件', 'light-steel' ); ?></strong>
                        <p><?php echo esc_html( get_theme_mod( 'contact_email' ) ); ?></p>
                    </div>
                </div>
                <?php else : ?>
                <div class="contact-item">
                    <div class="contact-item-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    </div>
                    <div>
                        <strong><?php esc_html_e( '電子郵件', 'light-steel' ); ?></strong>
                        <p>service@zhuan-xin.com</p>
                    </div>
                </div>
                <?php endif; ?>

                <?php if ( get_theme_mod( 'contact_address' ) ) : ?>
                <div class="contact-item">
                    <div class="contact-item-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    </div>
                    <div>
                        <strong><?php esc_html_e( '公司地址', 'light-steel' ); ?></strong>
                        <p><?php echo nl2br( esc_html( get_theme_mod( 'contact_address' ) ) ); ?></p>
                    </div>
                </div>
                <?php else : ?>
                <div class="contact-item">
                    <div class="contact-item-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    </div>
                    <div>
                        <strong><?php esc_html_e( '公司地址', 'light-steel' ); ?></strong>
                        <p>台中市西屯區台灣大道三段99號</p>
                    </div>
                </div>
                <?php endif; ?>

                <div class="contact-item">
                    <div class="contact-item-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </div>
                    <div>
                        <strong><?php esc_html_e( '營業時間', 'light-steel' ); ?></strong>
                        <p><?php esc_html_e( '週一至週六 09:00-18:00', 'light-steel' ); ?></p>
                        <p><?php esc_html_e( '週日及國定假日公休', 'light-steel' ); ?></p>
                    </div>
                </div>
            </div>

            <!-- Contact Form -->
            <div class="contact-form">
                <form id="contact-form" method="post">
                    <?php wp_nonce_field( 'light_steel_contact_form', 'contact_nonce' ); ?>

                    <div class="form-group">
                        <label for="contact-name"><?php esc_html_e( '姓名', 'light-steel' ); ?> *</label>
                        <input type="text" id="contact-name" name="name" placeholder="<?php esc_attr_e( '請輸入您的姓名', 'light-steel' ); ?>" required>
                    </div>

                    <div class="form-group">
                        <label for="contact-email"><?php esc_html_e( '電子郵件', 'light-steel' ); ?> *</label>
                        <input type="email" id="contact-email" name="email" placeholder="<?php esc_attr_e( 'your@email.com', 'light-steel' ); ?>" required>
                    </div>

                    <div class="form-group">
                        <label for="contact-phone"><?php esc_html_e( '聯絡電話', 'light-steel' ); ?></label>
                        <input type="tel" id="contact-phone" name="phone" placeholder="<?php esc_attr_e( '0912-345-678', 'light-steel' ); ?>">
                    </div>

                    <div class="form-group">
                        <label for="contact-service"><?php esc_html_e( '感興趣的服務', 'light-steel' ); ?></label>
                        <select id="contact-service" name="service">
                            <option value=""><?php esc_html_e( '請選擇服務項目', 'light-steel' ); ?></option>
                            <option value="villa"><?php esc_html_e( '輕鋼構別墅/住宅', 'light-steel' ); ?></option>
                            <option value="farm"><?php esc_html_e( '農舍/資材室', 'light-steel' ); ?></option>
                            <option value="commercial"><?php esc_html_e( '商業空間/民宿', 'light-steel' ); ?></option>
                            <option value="renovation"><?php esc_html_e( '舊屋增建/翻新', 'light-steel' ); ?></option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="contact-message"><?php esc_html_e( '需求說明', 'light-steel' ); ?> *</label>
                        <textarea id="contact-message" name="message" placeholder="<?php esc_attr_e( '請描述您的需求，例如：預計坪數、預算範圍、施工時間等...', 'light-steel' ); ?>" required></textarea>
                    </div>

                    <button type="submit" class="btn btn-primary" style="width: 100%;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline; vertical-align: middle; margin-right: 0.5rem;"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        <?php esc_html_e( '送出預約', 'light-steel' ); ?>
                    </button>

                    <div id="form-response" style="display:none; margin-top: 1rem; padding: 1rem; border-radius: var(--radius-sm);"></div>
                </form>
            </div>
        </div>
    </div>
</section>

<?php
get_footer();
