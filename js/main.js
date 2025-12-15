(function ($) {
    "use strict";

    // =========================================
    // 1. Spinner
    // =========================================
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();


    // =========================================
    // 2. Initialize WOW.js
    // =========================================
    new WOW().init();


    // =========================================
    // 3. Sticky Navbar & Scroll Logic
    // =========================================
    $(window).scroll(function () {
        // Combined logic: Handles sticky class and Back-to-Top visibility
        var scrollTop = $(this).scrollTop();

        // Sticky Navbar
        if (scrollTop > 40) {
            $('.navbar').addClass('sticky-top shadow-sm').css('top', '0');
        } else {
            $('.navbar').removeClass('sticky-top shadow-sm').css('top', '');
        }

        // Back to Top Button
        if (scrollTop > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });

    // Back to Top Click Event
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });


    // =========================================
    // 4. Dropdown Hover (Desktop)
    // =========================================
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";

    function setupDropdownHover() {
        if (window.matchMedia("(min-width: 992px)").matches) {
            // Enable hover dropdown on large screens
            $dropdown.off("mouseenter mouseleave");
            $dropdown.hover(
                function () {
                    const $this = $(this);
                    $this.addClass(showClass);
                    $this.find($dropdownToggle).attr("aria-expanded", "true");
                    $this.find($dropdownMenu).addClass(showClass);
                },
                function () {
                    const $this = $(this);
                    $this.removeClass(showClass);
                    $this.find($dropdownToggle).attr("aria-expanded", "false");
                    $this.find($dropdownMenu).removeClass(showClass);
                }
            );
        } else {
            // On smaller screens, disable hover and let Bootstrap handle click toggles
            $dropdown.off("mouseenter mouseleave");
        }
    }

    $(window).on("load resize", setupDropdownHover);
    setupDropdownHover(); // Run immediately

    // Make dropdown-toggle links navigate on desktop clicks
    $(document).on('click', '.nav-link.dropdown-toggle', function (e) {
        if (window.matchMedia("(min-width: 992px)").matches) {
            var href = $(this).attr('href');
            if (href && href !== '#' && href.trim() !== '') {
                if (e.ctrlKey || e.metaKey || e.shiftKey || (e.which && e.which === 2)) {
                    return; // Allow new tab
                }
                e.preventDefault();
                e.stopImmediatePropagation();
                window.location.href = href;
                return false;
            }
        }
    });


    // =========================================
    // 5. Active Link Highlighting
    // =========================================
    $(document).ready(function () {
        var path = window.location.pathname.split("/").pop().toLowerCase();
        if (path === "") {
            path = "index.html";
        }

        $('.navbar-nav .nav-link').removeClass('active');

        $('.navbar-nav .nav-link').each(function () {
            var href = $(this).attr('href');
            if (href) {
                href = href.toLowerCase();
                if (href === path) {
                    $(this).addClass('active');
                    var parent = $(this).closest('.dropdown');
                    if (parent.length) {
                        parent.find('> .nav-link.dropdown-toggle').addClass('active');
                    }
                }
            }
        });

        // Special handling for Services dropdown
        if (path.startsWith("service")) {
            $('.nav-item.dropdown .nav-link.dropdown-toggle').filter(function () {
                return $(this).text().trim() === 'Services';
            }).addClass('active');
            $('.nav-item.nav-link[href="index.html"]').removeClass('active');
        }
    });


    // =========================================
    // 6. Counters & Experience Skills
    // =========================================
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });

    $('.experience').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, { offset: '80%' });


    // =========================================
    // 7. Carousels
    // =========================================
    
    // Testimonials
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        dots: true,
        loop: true,
        center: true,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0: { items: 1 },
            576: { items: 1 },
            768: { items: 2 },
            992: { items: 3 }
        }
    });

    // Vendors
    $('.vendor-carousel').owlCarousel({
        loop: true,
        margin: 45,
        dots: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0: { items: 2 },
            576: { items: 4 },
            768: { items: 6 },
            992: { items: 8 }
        }
    });


    // =========================================
    // 8. Video Modal
    // =========================================
    var $videoSrc;
    $('.btn-play').click(function () {
        $videoSrc = $(this).data("src");
    });
    
    $('#videoModal').on('shown.bs.modal', function (e) {
        $("#video").attr('src', $videoSrc + "?autoplay=1&modestbranding=1&showinfo=0");
    });
    
    $('#videoModal').on('hide.bs.modal', function (e) {
        $("#video").attr('src', $videoSrc);
    });


    // =========================================
    // 9. Mobile Offcanvas & Advanced Dropdown UI
    // =========================================
    
    // // Helper: Build the Mobile Offcanvas menu dynamically
    // function buildMobileOffcanvas() {
    //     var $target = $('#mobile-offcanvas-content');
    //     if (!$target.length || $target.data('built')) return;

    //     var $nav = $('.navbar-nav').first();
    //     if (!$nav.length) return;

    //     var $container = $('<div class="mobile-nav-items" />');

    //     $nav.children().each(function () {
    //         var $item = $(this);
    //         if ($item.hasClass('dropdown')) {
    //             var label = $item.find('> .nav-link').first().text().trim();
    //             var href = $item.find('> .nav-link').first().attr('href') || '#';

    //             var $section = $('<div class="offcanvas-section"/>');
    //             var $header = $('<div class="offcanvas-section-header" />');
    //             var $link = $('<a class="section-link" />').attr('href', href).text(label);
    //             var $toggle = $('<button type="button" class="offcanvas-section-toggle" aria-expanded="false"><span class="toggle-icon">▾</span></button>');
                
    //             $header.append($link).append($toggle);
    //             $section.append($header);

    //             var $menu = $item.find('.dropdown-menu').first();
    //             var $sub = $('<div class="offcanvas-subitems" />');
    //             var $columns = $menu.find('.menu-column');

    //             if ($columns.length) {
    //                 $columns.each(function () {
    //                     var $col = $(this);
    //                     var groupLabel = $col.find('.menu-header').first().text().trim() || '';
    //                     var $group = $('<div class="dropdown-group" />');
    //                     if (groupLabel) {
    //                         $group.append($('<div class="offcanvas-group-header" />').text(groupLabel));
    //                     }
    //                     $col.find('.dropdown-item').each(function () {
    //                         var $orig = $(this);
    //                         $group.append($('<a class="dropdown-item" />').attr('href', $orig.attr('href') || '#').text($orig.text().trim()));
    //                     });
    //                     $sub.append($group);
    //                 });
    //             } else {
    //                 $menu.find('.dropdown-item').each(function () {
    //                     var $d = $(this);
    //                     $sub.append($('<a class="dropdown-item" />').attr('href', $d.attr('href') || '#').text($d.text().trim()));
    //                 });
    //             }
    //             $section.append($sub);
    //             $container.append($section);
    //         } else {
    //             var $a = $item.is('a.nav-link') ? $item.clone() : $item.find('> a.nav-link').first().clone();
    //             if ($a && $a.length) {
    //                 $a.addClass('d-block').css({ 'padding': '0.6rem 0' });
    //                 $container.append($a);
    //             }
    //         }
    //     });

    //     $target.append($container);
    //     $target.data('built', true);
    //     $target.find('.offcanvas-section, .dropdown-group').addClass('expanded');

    //     // Event Handlers for Offcanvas toggles
    //     $target.on('click', '.offcanvas-section-toggle', function (e) {
    //         if (!window.matchMedia('(max-width: 991.98px)').matches) return;
    //         var $section = $(this).closest('.offcanvas-section');
    //         var $sub = $section.find('.offcanvas-subitems').first();
    //         var labelLower = $section.find('.section-link').first().text().trim().toLowerCase();

    //         if ($section.hasClass('expanded')) {
    //             $section.removeClass('expanded');
    //             $(this).attr('aria-expanded', 'false');
    //             $sub.find('.dropdown-item').hide();
    //             $sub.find('.dropdown-group .dropdown-item').hide();
    //             $sub.slideUp(180);
    //         } else {
    //             $target.find('.offcanvas-section.expanded').removeClass('expanded').find('.offcanvas-subitems').slideUp(180);
    //             $section.addClass('expanded');
    //             $(this).attr('aria-expanded', 'true');
    //             if (labelLower === 'services') {
    //                 $sub.find('.dropdown-group').removeClass('expanded').find('.dropdown-item').hide();
    //             } else {
    //                 $sub.find('.dropdown-item').show();
    //             }
    //             $sub.slideDown(180);
    //         }
    //     });

    //     $target.on('click', '.offcanvas-group-header', function (e) {
    //         if (!window.matchMedia('(max-width: 991.98px)').matches) return;
    //         var $group = $(this).closest('.dropdown-group');
    //         var $section = $(this).closest('.offcanvas-section');

    //         if (!$section.hasClass('expanded')) {
    //             $section.find('.offcanvas-section-toggle').first().trigger('click');
    //         }

    //         if ($group.hasClass('expanded')) {
    //             $group.removeClass('expanded');
    //             $group.find('.dropdown-item').slideUp(140);
    //         } else {
    //             $section.find('.dropdown-group.expanded').removeClass('expanded').find('.dropdown-item').slideUp(140);
    //             $group.addClass('expanded');
    //             $group.find('.dropdown-item').slideDown(140);
    //         }
    //         e.preventDefault();
    //         return false;
    //     });
    // }

    // // Initialize Offcanvas on events
    // $(document).on('show.bs.offcanvas', '#mobileMenuOffcanvas', buildMobileOffcanvas);
    // $(document).on('click', '[data-bs-toggle="offcanvas"][data-bs-target="#mobileMenuOffcanvas"]', buildMobileOffcanvas);
    // $(document).ready(function () { buildMobileOffcanvas(); });


    // =========================================
    // 10. Dropdown UI Utilities (Compact Mode)
    // =========================================
    
    // function tagDropdowns() {
    //     $('.nav-link.dropdown-toggle').filter(function () {
    //         var txt = $(this).text().trim();
    //         return txt === 'Resources' || txt === 'Services';
    //     }).each(function () {
    //         var $t = $(this);
    //         var txt = $t.text().trim();
    //         var $parent = $t.closest('.dropdown');
    //         if (txt === 'Resources') {
    //             $parent.addClass('resource-dropdown');
    //             $parent.find('.dropdown-menu').first().addClass('resource-menu');
    //         } else if (txt === 'Services') {
    //             $parent.addClass('service-dropdown');
    //             $parent.find('.dropdown-menu').first().addClass('service-menu');
    //         }
    //     });
    // }

    // function bindMobileCompact() {
    //     $(document).off('.mobileCompact');

    //     $(document).on('shown.bs.dropdown.mobileCompact', '.dropdown', function () {
    //         if (!window.matchMedia('(max-width: 991.98px)').matches) return;
    //         var $menu = $(this).find('.dropdown-menu').first();
    //         if (!$menu.length) return;

    //         if ($menu.hasClass('service-menu') || $menu.hasClass('service-box')) {
    //             $menu.addClass('mobile-compact');
    //             $menu.find('.menu-column').removeClass('expanded');
    //             $menu.find('.menu-column').each(function () {
    //                 var $col = $(this);
    //                 if ($col.find('.preview-item').length) return;
    //                 var $first = $col.find('.dropdown-item').first();
    //                 if ($first.length) {
    //                     var $preview = $('<div class="preview-item" />');
    //                     var $a = $('<a class="dropdown-item preview-link" />').attr('href', $first.attr('href') || '#').text($first.text().trim());
    //                     $preview.append($a);
    //                     var $hdr = $col.find('.menu-header').first();
    //                     if ($hdr.length) $hdr.after($preview); else $col.prepend($preview);
    //                 }
    //             });
    //         }
    //         if ($menu.hasClass('resource-menu') || $menu.hasClass('custom-resource-menu')) {
    //             $menu.addClass('mobile-compact');
    //         }
    //     });

    //     $(document).on('hidden.bs.dropdown.mobileCompact', '.dropdown', function () {
    //         var $menu = $(this).find('.dropdown-menu').first();
    //         if ($menu.length) {
    //             $menu.removeClass('mobile-compact');
    //             $menu.find('.menu-column').removeClass('expanded');
    //         }
    //     });

    //     $(document).on('click.mobileCompact', '.service-box .menu-header, .service-menu .menu-header', function (e) {
    //         if (!window.matchMedia('(max-width: 991.98px)').matches) return;
    //         var $col = $(this).closest('.menu-column');
    //         var $menu = $(this).closest('.dropdown-menu');
    //         if (!$col.length || !$menu.length) return;

    //         if ($col.hasClass('expanded')) {
    //             $col.removeClass('expanded');
    //             $col.find('.preview-item').show();
    //             $col.find('.collapse').removeClass('show');
    //         } else {
    //             $menu.find('.menu-column.expanded').removeClass('expanded').find('.preview-item').show();
    //             $col.addClass('expanded');
    //             $col.find('.preview-item').hide();
    //             $col.find('.collapse').addClass('show');
    //         }
    //         e.preventDefault();
    //         return false;
    //     });

    //     $(document).on('click.mobileExpandAll', '.navbar-collapse .nav-item.dropdown > .nav-link.dropdown-toggle', function (e) {
    //         if (!window.matchMedia('(max-width: 991.98px)').matches) return;
    //         var $parent = $(this).closest('.dropdown');
    //         var $menu = $parent.find('.dropdown-menu').first();
    //         if (!$menu.length) return;

    //         e.preventDefault();
    //         e.stopImmediatePropagation();
    //         if (!$parent.hasClass('show')) {
    //             $parent.addClass('show');
    //             $menu.addClass('show');
    //         }

    //         if ($menu.hasClass('expanded-all')) {
    //             $menu.removeClass('expanded-all').addClass('mobile-compact');
    //             $menu.find('.menu-column').each(function () {
    //                 $(this).removeClass('expanded');
    //                 $(this).find('.dropdown-item').hide().first().show();
    //                 $(this).find('.preview-item').show();
    //             });
    //             $menu.find('.resource-menu .dropdown-item').hide().slice(0, 3).show();
    //         } else {
    //             $menu.removeClass('mobile-compact').addClass('expanded-all');
    //             $menu.find('.menu-column').each(function () {
    //                 $(this).addClass('expanded');
    //                 $(this).find('.preview-item').hide();
    //                 $(this).find('.dropdown-item').show();
    //             });
    //             $menu.find('.resource-menu .dropdown-item').show();
    //         }
    //         return false;
    //     });
    // }

    // // Expose init function globally
    // window.initDropdownUI = function () {
    //     try {
    //         tagDropdowns();
    //         bindMobileCompact();
    //         if (typeof setupDropdownHover === 'function') setupDropdownHover();
    //         buildMobileOffcanvas();
    //     } catch (e) {
    //         console.warn('initDropdownUI error', e);
    //     }
    // };

    // // Run Dropdown UI setup
    // $(function () {
    //     if (window.initDropdownUI) window.initDropdownUI();
    // });


    // =========================================
    // 11. Footer Logic (Mobile Compact)
    // =========================================
    function initFooterMobile() {
        var $holder = $('#footer-placeholder');
        if (!$holder.length) return;
        var $root = $holder.find('.container-fluid.text-light').first();
        if (!$root.length || $root.data('mobileBuilt')) return;
        $root.addClass('mobile-compact-footer');
        $root.data('mobileBuilt', true);
    }

    var footerObserver = new MutationObserver(function (m) {
        initFooterMobile();
    });
    var holder = document.getElementById('footer-placeholder');
    if (holder) footerObserver.observe(holder, { childList: true, subtree: true });

    $(function () { initFooterMobile(); });

})(jQuery);