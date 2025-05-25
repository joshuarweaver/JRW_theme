/* Mobile menu burger toggle */
(function () {
    const navigation = document.querySelector('.gh-navigation');
    const burger = navigation.querySelector('.gh-burger');
    if (!burger) return;

    burger.addEventListener('click', function () {
        if (!navigation.classList.contains('is-open')) {
            navigation.classList.add('is-open');
            document.documentElement.style.overflowY = 'hidden';
        } else {
            navigation.classList.remove('is-open');
            document.documentElement.style.overflowY = null;
        }
    });
})();

/* Navigation scroll behavior */
(function () {
    let lastScrollTop = 0;
    const navbar = document.querySelector('.gh-navigation');
    const scrollThreshold = 10;
    let ticking = false;

    if (!navbar) return;

    function updateNavbar() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // If scrolled down more than threshold and scrolling down
        if (scrollTop > scrollThreshold && scrollTop > lastScrollTop) {
            navbar.classList.add('nav-hidden');
        } 
        // If scrolling up
        else if (scrollTop < lastScrollTop) {
            navbar.classList.remove('nav-hidden');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
})();

/* Add lightbox to gallery images */
(function () {
    lightbox(
        '.kg-image-card > .kg-image[width][height], .kg-gallery-image > img'
    );
})();

/* Responsive video in post content */
(function () {
    const sources = [
        '.gh-content iframe[src*="youtube.com"]',
        '.gh-content iframe[src*="youtube-nocookie.com"]',
        '.gh-content iframe[src*="player.vimeo.com"]',
        '.gh-content iframe[src*="kickstarter.com"][src*="video.html"]',
        '.gh-content object',
        '.gh-content embed',
    ];
    reframe(document.querySelectorAll(sources.join(',')));
})();

/* Turn the main nav into dropdown menu when there are more than 5 menu items */
(function () {
    dropdown();
})();

/* Infinite scroll pagination */
(function () {
    if (!document.body.classList.contains('home-template') && !document.body.classList.contains('post-template')) {
        pagination();
    }
})();

/* Responsive HTML table */
(function () {
    const tables = document.querySelectorAll('.gh-content > table:not(.gist table)');
    
    tables.forEach(function (table) {
        const wrapper = document.createElement('div');
        wrapper.className = 'gh-table';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
    });
})();

/* Table of Contents */
(function() {
    'use strict';

    // Table of Contents functionality
    class TableOfContents {
        constructor() {
            this.tocContainer = document.querySelector('.gh-toc-container');
            this.tocToggleBtn = document.querySelector('.gh-toc-toggle-btn');
            this.tocNav = document.querySelector('.gh-toc-nav');
            this.tocList = document.querySelector('.gh-toc-list');
            this.tocClose = document.querySelector('.gh-toc-close');
            this.progressBar = document.querySelector('.gh-toc-progress-bar');
            this.content = document.querySelector('.gh-content');
            this.footer = document.querySelector('.gh-footer');
            
            this.headings = [];
            this.currentActiveIndex = -1;
            this.isOpen = true; // Start open by default
            this.isVisible = false;
            this.throttleTimer = null;
            this.resizeTimer = null;
            this.contentStart = 0;
            this.footerStart = 0;
            
            this.init();
        }

        init() {
            if (!this.tocContainer || !this.content) return;
            
            this.collectHeadings();
            
            if (this.headings.length < 2) {
                this.hideTOC();
                return;
            }
            
            this.calculatePositions();
            this.generateTOC();
            this.bindEvents();
            this.updateVisibility();
            this.updateProgress();
            this.updateActiveSection();
        }

        calculatePositions() {
            // Calculate content start position - start at bottom of article header
            const articleHeader = document.querySelector('.gh-article-header');
            if (articleHeader) {
                this.contentStart = this.getElementOffset(articleHeader) + articleHeader.offsetHeight; // Start at bottom of header
            } else if (this.content) {
                this.contentStart = this.getElementOffset(this.content) - 100; // Fallback to content
            }
            
            // Calculate footer start position - should disappear at footer
            // Try multiple selectors to find the footer
            const footerSelectors = [
                '.gh-footer-inner',
                '.gh-footer-main', 
                '.gh-footer.gh-outer', 
                '.gh-footer', 
                'footer.gh-footer',
                'footer',
                '.site-footer'
            ];
            
            let footerFound = false;
            for (const selector of footerSelectors) {
                this.footer = document.querySelector(selector);
                if (this.footer) {
                    this.footerStart = this.getElementOffset(this.footer);
                    console.log(`TOC: Footer found with selector "${selector}" at position`, this.footerStart);
                    footerFound = true;
                    break;
                }
            }
            
            if (!footerFound) {
                // Last resort fallback
                this.footerStart = document.documentElement.scrollHeight - window.innerHeight - 200;
                console.log('TOC: No footer found, using fallback position', this.footerStart);
                
                // Debug: log all elements that might be footers
                const possibleFooters = document.querySelectorAll('[class*="footer"], footer');
                console.log('TOC: Possible footer elements found:', possibleFooters);
                possibleFooters.forEach((el, index) => {
                    console.log(`TOC: Footer candidate ${index}:`, el.className, el.tagName);
                });
            }
            
            console.log('TOC: Content start at', this.contentStart, 'Footer start at', this.footerStart);
        }

        collectHeadings() {
            const headingSelectors = 'h1, h2, h3, h4, h5, h6';
            const headingElements = this.content.querySelectorAll(headingSelectors);
            
            headingElements.forEach((heading, index) => {
                // Generate ID if not present
                if (!heading.id) {
                    heading.id = this.generateHeadingId(heading.textContent, index);
                }
                
                const level = parseInt(heading.tagName.charAt(1));
                
                this.headings.push({
                    element: heading,
                    id: heading.id,
                    text: heading.textContent.trim(),
                    level: level,
                    offset: this.getElementOffset(heading)
                });
            });
        }

        generateHeadingId(text, index) {
            const baseId = text
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');
            
            return baseId ? `toc-${baseId}-${index}` : `toc-heading-${index}`;
        }

        getElementOffset(element) {
            const rect = element.getBoundingClientRect();
            return rect.top + window.pageYOffset;
        }

        generateTOC() {
            const tocItems = this.headings.map((heading, index) => {
                return `
                    <li class="gh-toc-item">
                        <a href="#${heading.id}" 
                           class="gh-toc-link" 
                           data-index="${index}"
                           data-level="${heading.level}">
                            ${heading.text}
                        </a>
                    </li>
                `;
            }).join('');
            
            this.tocList.innerHTML = tocItems;
        }

        bindEvents() {
            // Toggle TOC (now closes instead of opens since it starts open)
            this.tocToggleBtn?.addEventListener('click', () => this.toggleTOC());
            this.tocClose?.addEventListener('click', () => this.closeTOC());
            
            // Handle TOC link clicks
            this.tocList.addEventListener('click', (e) => {
                if (e.target.classList.contains('gh-toc-link')) {
                    e.preventDefault();
                    const targetId = e.target.getAttribute('href').substring(1);
                    this.scrollToHeading(targetId);
                }
            });
            
            // Handle scroll events for visibility, progress, and active section
            window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
            window.addEventListener('resize', () => this.handleResize(), { passive: true });
            
            // Handle keyboard events
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.closeTOC();
                }
            });
        }

        toggleTOC() {
            if (this.isOpen) {
                this.closeTOC();
            } else {
                this.openTOC();
            }
        }

        openTOC() {
            this.isOpen = true;
            this.tocNav.classList.remove('is-closed');
            this.tocToggleBtn.setAttribute('aria-expanded', 'true');
            
            // Update heading offsets in case of layout changes
            this.updateHeadingOffsets();
        }

        closeTOC() {
            this.isOpen = false;
            this.tocNav.classList.add('is-closed');
            this.tocToggleBtn.setAttribute('aria-expanded', 'false');
        }

        updateHeadingOffsets() {
            this.headings.forEach(heading => {
                heading.offset = this.getElementOffset(heading.element);
            });
            this.calculatePositions();
        }

        updateVisibility() {
            const scrollTop = window.pageYOffset;
            const shouldBeVisible = scrollTop >= this.contentStart && scrollTop < this.footerStart;
            
            if (shouldBeVisible && !this.isVisible) {
                this.showTOC();
                this.isVisible = true;
            } else if (!shouldBeVisible && this.isVisible) {
                this.hideTOCVisibility();
                this.isVisible = false;
            }
        }

        showTOC() {
            if (this.tocContainer) {
                this.tocContainer.classList.add('is-visible');
            }
        }

        hideTOCVisibility() {
            if (this.tocContainer) {
                this.tocContainer.classList.remove('is-visible');
            }
        }

        scrollToHeading(headingId) {
            const targetElement = document.getElementById(headingId);
            if (!targetElement) return;
            
            const offset = 100; // Account for fixed header
            const targetPosition = this.getElementOffset(targetElement) - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }

        handleScroll() {
            if (this.throttleTimer) {
                clearTimeout(this.throttleTimer);
            }
            
            this.throttleTimer = setTimeout(() => {
                this.updateVisibility();
                this.updateProgress();
                this.updateActiveSection();
            }, 50); // Increased from 10ms to 50ms for better stability
        }

        handleResize() {
            // Throttle resize updates to prevent constant recalculation
            if (this.resizeTimer) {
                clearTimeout(this.resizeTimer);
            }
            
            this.resizeTimer = setTimeout(() => {
                this.updateHeadingOffsets();
            }, 250); // Wait 250ms after resize stops
        }

        updateProgress() {
            if (!this.isVisible) return;
            
            const scrollTop = window.pageYOffset;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = Math.min((scrollTop / documentHeight) * 100, 100);
            
            this.progressBar.style.width = `${progress}%`;
        }

        updateActiveSection() {
            if (!this.isVisible) return;
            
            const scrollTop = window.pageYOffset + 150; // Offset for better UX
            let activeIndex = -1;
            
            // Find the current active section
            for (let i = this.headings.length - 1; i >= 0; i--) {
                if (scrollTop >= this.headings[i].offset) {
                    activeIndex = i;
                    break;
                }
            }
            
            // Update active states only if changed
            if (activeIndex !== this.currentActiveIndex) {
                this.currentActiveIndex = activeIndex;
                this.updateActiveTOCItem();
            }
        }

        updateActiveTOCItem() {
            // Remove previous active states
            const activeLinks = this.tocList.querySelectorAll('.gh-toc-link.is-active');
            activeLinks.forEach(link => link.classList.remove('is-active'));
            
            // Add active state to current section
            if (this.currentActiveIndex >= 0) {
                const activeLink = this.tocList.querySelector(`[data-index="${this.currentActiveIndex}"]`);
                if (activeLink) {
                    activeLink.classList.add('is-active');
                    
                    // Scroll TOC to show active item if it's visible and open
                    if (this.isVisible && this.isOpen) {
                        this.scrollTOCToActiveItem(activeLink);
                    }
                }
            }
        }

        scrollTOCToActiveItem(activeLink) {
            const tocListRect = this.tocList.getBoundingClientRect();
            const activeLinkRect = activeLink.getBoundingClientRect();
            
            if (activeLinkRect.top < tocListRect.top || activeLinkRect.bottom > tocListRect.bottom) {
                activeLink.scrollIntoView({
                    block: 'center',
                    behavior: 'smooth'
                });
            }
        }

        hideTOC() {
            if (this.tocContainer) {
                this.tocContainer.classList.add('is-hidden');
            }
        }

        showTOCComponent() {
            if (this.tocContainer) {
                this.tocContainer.classList.remove('is-hidden');
            }
        }
    }

    // Initialize TOC when DOM is ready (only on post pages)
    if (document.body.classList.contains('post-template')) {
        // Add a small delay to ensure all elements are fully loaded
        setTimeout(() => {
            new TableOfContents();
        }, 100);
    }

})();