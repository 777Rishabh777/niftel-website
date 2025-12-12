(function($) {
    "use strict";

    // Spinner
    var spinner = function() {
        setTimeout(function() {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();


    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
   $(window).scroll(function () {
    // Get the height of the top orange bar (usually around 45px)
    // You can adjust the '40' number if it still flickers
    if ($(this).scrollTop() > 40) {
        $('.navbar').addClass('sticky-top shadow-sm');
        // Optional: Add a smooth background transition
        $('.navbar').css('top', '0'); 
    } else {
        $('.navbar').removeClass('sticky-top shadow-sm');
        // Force it to go back to its normal place
        $('.navbar').css('top', ''); 
    }
});
    // Dropdown on mouse hover only for large screens, allow Bootstrap default toggle on smaller screens
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";

    function setupDropdownHover() {
        if (window.matchMedia("(min-width: 992px)").matches) {
            // Enable hover dropdown on large screens
            $dropdown.off("mouseenter mouseleave"); // Remove previous handlers to avoid duplicates
            $dropdown.hover(
                function() {
                    const $this = $(this);
                    $this.addClass(showClass);
                    $this.find($dropdownToggle).attr("aria-expanded", "true");
                    $this.find($dropdownMenu).addClass(showClass);
                },
                function() {
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

    // Run once immediately (useful when main.js is loaded dynamically after header fragment)
    setupDropdownHover();
    $(window).on("load resize", setupDropdownHover);

    // Make dropdown-toggle links navigate on desktop clicks
    // (Hover still opens menus on desktop; mobile retains Bootstrap click-to-toggle behavior)
    $(document).on('click', '.nav-link.dropdown-toggle', function(e) {
        // desktop breakpoint — treat click as navigation
        if (window.matchMedia("(min-width: 992px)").matches) {
            var href = $(this).attr('href');
            if (href && href !== '#' && href.trim() !== '') {
                // Allow modifier keys / middle-click to open in new tab
                if (e.ctrlKey || e.metaKey || e.shiftKey || (e.which && e.which === 2)) {
                    return; // let browser handle
                }
                // Prevent Bootstrap toggle and navigate in same tab
                e.preventDefault();
                e.stopImmediatePropagation();
                window.location.href = href;
                return false;
            }
        }
        // otherwise (mobile), let Bootstrap/open behavior proceed
    });

    // Dynamically set active class to nav links based on current URL path
    $(document).ready(function() {
        var path = window.location.pathname.split("/").pop().toLowerCase();
        if (path === "") {
            path = "index.html";
        }

        $('.navbar-nav .nav-link').removeClass('active');

        // Mapping between URL and nav link href
        $('.navbar-nav .nav-link').each(function() {
            var href = $(this).attr('href').toLowerCase();
            if (href === path) {
                $(this).addClass('active');
                // For dropdown items, also add active class to parent dropdown link if exists
                var parent = $(this).closest('.dropdown');
                if (parent.length) {
                    parent.find('> .nav-link.dropdown-toggle').addClass('active');
                }
            }
        });

        // Additional handling to set active on Services dropdown toggle if on service.html or service subpages
        if (path.startsWith("service")) {
            $('.nav-item.dropdown .nav-link.dropdown-toggle').filter(function(){
                return $(this).text().trim() === 'Services';
            }).addClass('active');
            $('.nav-item.nav-link[href="index.html"]').removeClass('active');
        }
    });



    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Back to top button
    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function() {
        $('html, body').animate({
            scrollTop: 0
        }, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        dots: true,
        loop: true,
        center: true,
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            }
        }
    });


   // Vendor carousel
$('.vendor-carousel').owlCarousel({
    loop: true,
    margin: 45,
    dots: false,
    autoplay: true,
    smartSpeed: 1000,
    responsive: {
        0:{
            items:2
        },
        576:{
            items:4
        },
        768:{
            items:6
        },
        992:{
            items:8
        }
    }
});

// Mark the Resources dropdown menu at runtime so we can style it without changing HTML
(function($){
    function buildMobileOffcanvas(){
        console.log('buildMobileOffcanvas called');
        // if offcanvas area not present bail
        var $target = $('#mobile-offcanvas-content');
        console.log('$target length:', $target.length);
        if (!$target.length) return;

        // avoid duplicating content
        if ($target.data('built')) return;

        // Build a copy of the main nav with small mobile-friendly structure
        var $nav = $('.navbar-nav').first();
        console.log('$nav length:', $nav.length);
        if (!$nav.length) return;

        var $container = $('<div class="mobile-nav-items" />');

        // Loop top-level nav items
        $nav.children().each(function(){
            var $item = $(this);
            if ($item.hasClass('dropdown')){
                var label = $item.find('> .nav-link').first().text().trim();
                var href = $item.find('> .nav-link').first().attr('href') || '#';

                var $section = $('<div class="offcanvas-section"/>');
                // Header contains a link to the section page and a toggle to expand/collapse.
                var $header = $('<div class="offcanvas-section-header" />');
                var $link = $('<a class="section-link" />').attr('href', href).text(label);
                var $toggle = $('<button type="button" class="offcanvas-section-toggle" aria-expanded="false">' +
                                '<span class="toggle-icon">▾</span></button>');
                $header.append($link).append($toggle);
                $section.append($header);

                // find dropdown items. For Services we preserve column grouping (menu-column)
                var $menu = $item.find('.dropdown-menu').first();
                var $sub = $('<div class="offcanvas-subitems" />');

                // If the menu contains column groups (mega menu), preserve the group headings
                var $columns = $menu.find('.menu-column');
                if ($columns.length) {
                    $columns.each(function(){
                        var $col = $(this);
                        var groupLabel = $col.find('.menu-header').first().text().trim() || '';
                        var $group = $('<div class="dropdown-group" />');
                        if (groupLabel) {
                            var $ghead = $('<div class="offcanvas-group-header" />').text(groupLabel);
                            $group.append($ghead);
                        }
                        // copy each dropdown item into the group
                        $col.find('.dropdown-item').each(function(){
                            var $orig = $(this);
                            var $a = $('<a class="dropdown-item" />').attr('href', $orig.attr('href') || '#').text($orig.text().trim());
                            $group.append($a);
                        });
                        $sub.append($group);
                    });
                } else {
                    // fallback: flatten all dropdown-items into a single list
                    $menu.find('.dropdown-item').each(function(){
                        var $d = $(this);
                        var $a = $('<a class="dropdown-item" />').attr('href', $d.attr('href') || '#').text($d.text().trim());
                        $sub.append($a);
                    });
                }

                $section.append($sub);
                $container.append($section);

            } else {
                // plain link
                // The navbar may use anchors as direct children (<a class="nav-link">) or
                // wrapper elements containing the anchor. Handle both cases.
                var $a;
                if ($item.is('a.nav-link')) {
                    $a = $item.clone();
                } else {
                    $a = $item.find('> a.nav-link').first().clone();
                }
                if ($a && $a.length) {
                    $a.addClass('d-block');
                    $a.css({'padding':'0.6rem 0'});
                    $container.append($a);
                }
            }
        });

        $target.append($container);
        $target.data('built', true);

        // Make all sections and groups expanded by default so options are visible
        $target.find('.offcanvas-section').addClass('expanded');
        $target.find('.dropdown-group').addClass('expanded');

        // Add click handlers to expand / collapse sections (mobile only)
        // Note: we keep the section label as a normal link; the small toggle button
        // beside it is used to show/hide the section's subitems.
        $target.on('click', '.offcanvas-section-toggle', function(e){
            if (!window.matchMedia('(max-width: 991.98px)').matches) return;
            var $hdr = $(this);
            var $section = $hdr.closest('.offcanvas-section');
            var $sub = $section.find('.offcanvas-subitems').first();

            var labelLower = $section.find('.section-link').first().text().trim().toLowerCase();
            if ($section.hasClass('expanded')){
                $section.removeClass('expanded');
                // update toggle aria state
                $section.find('.offcanvas-section-toggle').attr('aria-expanded','false');
                // collapse: hide all subitems so only the top-level heading remains visible
                $sub.find('.dropdown-item').hide();
                // for grouped menus ensure each group's items are hidden too
                $sub.find('.dropdown-group').each(function(){
                    $(this).find('.dropdown-item').hide();
                });
                $sub.slideUp(180);
            } else {
                // collapse others
                $target.find('.offcanvas-section.expanded').removeClass('expanded').find('.offcanvas-subitems').slideUp(180);
                $section.addClass('expanded');
                // update toggle aria state
                $section.find('.offcanvas-section-toggle').attr('aria-expanded','true');
                // expand: for grouped menus (Services) show the groups but keep
                // each group's items hidden until the user taps that group header.
                if (labelLower === 'services'){
                    // ensure group headers are visible but items hidden
                    $sub.find('.dropdown-group').each(function(){
                        $(this).removeClass('expanded').find('.dropdown-item').hide();
                    });
                } else {
                    // non-grouped menus (e.g., Resources) should reveal all items
                    $sub.find('.dropdown-item').show();
                }
                $sub.slideDown(180);
            }
        });

        // Clicking a group header (inside Services) toggles only that group's items
        $target.on('click', '.offcanvas-group-header', function(e){
            if (!window.matchMedia('(max-width: 991.98px)').matches) return;
            var $hdr = $(this);
            var $group = $hdr.closest('.dropdown-group');
            var $section = $hdr.closest('.offcanvas-section');

            // ensure the parent section is expanded first
            if (!$section.hasClass('expanded')){
                // trigger the section toggle so it expands the groups; find the toggle button
                $section.find('.offcanvas-section-toggle').first().trigger('click');
            }

            if ($group.hasClass('expanded')){
                // collapse this group
                $group.removeClass('expanded');
                $group.find('.dropdown-item').slideUp(140);
            } else {
                // collapse other groups within the same section
                $section.find('.dropdown-group.expanded').removeClass('expanded').find('.dropdown-item').slideUp(140);
                // expand this one
                $group.addClass('expanded');
                $group.find('.dropdown-item').slideDown(140);
            }
            e.preventDefault();
            return false;
        });


    }
    // ensure offcanvas is built when opened (in case header/nav were injected after init)
    $(document).on('show.bs.offcanvas', '#mobileMenuOffcanvas', function(){
        buildMobileOffcanvas();
    });

    // Also try building on button click as fallback
    $(document).on('click', '[data-bs-toggle="offcanvas"][data-bs-target="#mobileMenuOffcanvas"]', function(){
        console.log('Offcanvas button clicked');
        buildMobileOffcanvas();
    });

    // Build immediately on document ready as another fallback
    $(document).ready(function(){
        console.log('Document ready, building mobile offcanvas');
        buildMobileOffcanvas();
    });
    $(function(){
        $('.nav-link.dropdown-toggle').filter(function(){
            return $(this).text().trim() === 'Resources' || $(this).text().trim() === 'Services';
        }).each(function(){
            var $t = $(this);
            var txt = $t.text().trim();
            var $parent = $t.closest('.dropdown');
            if (txt === 'Resources') {
                $parent.addClass('resource-dropdown');
                $parent.find('.dropdown-menu').first().addClass('resource-menu');
            } else if (txt === 'Services') {
                $parent.addClass('service-dropdown');
                $parent.find('.dropdown-menu').first().addClass('service-menu');
            }
        });
    });

    // Make footer compact & collapsible on small screens
    function initFooterMobile(){
        var $holder = $('#footer-placeholder');
        if (!$holder.length) return;
        // footer root container
        var $root = $holder.find('.container-fluid.text-light').first();
        if (!$root.length) return;
        if ($root.data('mobileBuilt')) return;

        // Make footer compact on mobile by adding a helper class. We intentionally
        // do NOT inject toggle buttons any more (user requested no hide/show
        // buttons). Content will remain visible but more compact so the footer
        // doesn't force excessive scrolling on small screens.
        $root.addClass('mobile-compact-footer');
        $root.data('mobileBuilt', true);
    }

    // observe footer-placeholder and initialize when footer fragment loads
    var footerObserver = new MutationObserver(function(m){
        // run init when children are added
        initFooterMobile();
    });
    var holder = document.getElementById('footer-placeholder');
    if (holder) footerObserver.observe(holder, { childList: true, subtree: true });

    // ensure run once on load if footer has already been injected
    $(function(){ initFooterMobile(); });
})(jQuery);


(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('shadow-sm').css('top', '-100px');
        }
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Experience
    $('.experience').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, {offset: '80%'});
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Modal Video
    var $videoSrc;
    $('.btn-play').click(function () {
        $videoSrc = $(this).data("src");
    });
    console.log($videoSrc);
    $('#videoModal').on('shown.bs.modal', function (e) {
        $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
    })
    $('#videoModal').on('hide.bs.modal', function (e) {
        $("#video").attr('src', $videoSrc);
    })


    // Testimonial carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        items: 1,
        loop: true,
        dots: false,
        nav: true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ]
    });
    
})(jQuery);

/* Initialize dropdown UI (tagging + mobile compact accordion behavior)
   This function is safe to call multiple times — it uses namespaced events
   and defensive checks so pages that inject the header and then load main.js
   also get identical behavior. */
(function($){
    function tagDropdowns(){
        $('.nav-link.dropdown-toggle').filter(function(){
            return $(this).text().trim() === 'Resources' || $(this).text().trim() === 'Services';
        }).each(function(){
            var $t = $(this);
            var txt = $t.text().trim();
            var $parent = $t.closest('.dropdown');
            if (txt === 'Resources') {
                $parent.addClass('resource-dropdown');
                $parent.find('.dropdown-menu').first().addClass('resource-menu');
            } else if (txt === 'Services') {
                $parent.addClass('service-dropdown');
                $parent.find('.dropdown-menu').first().addClass('service-menu');
            }
        });
    }

    function bindMobileCompact(){
        // remove previous namespaced handlers to avoid duplicates
        $(document).off('.mobileCompact');

        // On dropdown open/close, set / clear compact state
        $(document).on('shown.bs.dropdown.mobileCompact', '.dropdown', function(){
            if (!window.matchMedia('(max-width: 991.98px)').matches) return;
            var $d = $(this);
            var $menu = $d.find('.dropdown-menu').first();
            if (!$menu.length) return;
            if ($menu.hasClass('service-menu') || $menu.hasClass('service-box')) {
                $menu.addClass('mobile-compact');
                $menu.find('.menu-column').removeClass('expanded');
                // create preview items (first visible item) for each column if missing
                $menu.find('.menu-column').each(function(){
                    var $col = $(this);
                    if ($col.find('.preview-item').length) return;
                    // find first dropdown-item text (may be inside collapse)
                    var $first = $col.find('.dropdown-item').first();
                    if ($first.length) {
                        var text = $first.text().trim();
                        var href = $first.attr('href') || '#';
                        var $preview = $('<div class="preview-item" />');
                        var $a = $('<a class="dropdown-item preview-link" />').attr('href', href).text(text);
                        $preview.append($a);
                        var $hdr = $col.find('.menu-header').first();
                        if ($hdr.length) $hdr.after($preview); else $col.prepend($preview);
                    }
                });
            }
            if ($menu.hasClass('resource-menu') || $menu.hasClass('custom-resource-menu')){
                $menu.addClass('mobile-compact');
            }
        });

        $(document).on('hidden.bs.dropdown.mobileCompact', '.dropdown', function(){
            var $d = $(this);
            var $menu = $d.find('.dropdown-menu').first();
            if (!$menu.length) return;
            $menu.removeClass('mobile-compact');
            $menu.find('.menu-column').removeClass('expanded');
        });

        // clicking a menu header expands only that column (mobile)
        $(document).on('click.mobileCompact', '.service-box .menu-header, .service-menu .menu-header', function(e){
            if (!window.matchMedia('(max-width: 991.98px)').matches) return;
            var $h = $(this);
            var $col = $h.closest('.menu-column');
            var $menu = $h.closest('.dropdown-menu');
            if (!$col.length || !$menu.length) return;
            if ($col.hasClass('expanded')){
                // collapse this column -> show preview again and collapse any inner collapses
                $col.removeClass('expanded');
                $col.find('.preview-item').show();
                // hide inner collapse content if present
                $col.find('.collapse').each(function(){ try { $(this).removeClass('show'); } catch(e){} });
            } else {
                // expand: collapse other columns and show this one's full items
                $menu.find('.menu-column.expanded').each(function(){
                    var $other = $(this);
                    $other.removeClass('expanded');
                    $other.find('.preview-item').show();
                    $other.find('.collapse').each(function(){ try { $(this).removeClass('show'); } catch(e){} });
                });
                $col.addClass('expanded');
                $col.find('.preview-item').hide();
                // open collapse content for this column if present
                $col.find('.collapse').each(function(){ try { $(this).addClass('show'); } catch(e){} });
            }
            e.preventDefault();
            return false;
        });

        // When the user clicks the dropdown toggle inside the collapsed navbar on mobile,
        // toggle a compact <-> expanded-all view so all submenu items are shown at once.
        $(document).off('click.mobileExpandAll', '.navbar-collapse .nav-item.dropdown > .nav-link.dropdown-toggle')
            .on('click.mobileExpandAll', '.navbar-collapse .nav-item.dropdown > .nav-link.dropdown-toggle', function(e){
                if (!window.matchMedia('(max-width: 991.98px)').matches) return; // mobile only
                var $toggle = $(this);
                var $parent = $toggle.closest('.dropdown');
                var $menu = $parent.find('.dropdown-menu').first();
                if (!$menu.length) return;

                // Prevent default bootstrap toggle from interfering and ensure the menu is visible
                e.preventDefault();
                e.stopImmediatePropagation();
                // Make sure the dropdown is shown (Bootstrap may not have applied it yet)
                if (!$parent.hasClass('show')){
                    $parent.addClass('show');
                    $menu.addClass('show');
                }

                if ($menu.hasClass('expanded-all')){
                    // collapse to compact
                    $menu.removeClass('expanded-all').addClass('mobile-compact');
                    // ensure dropdown remains visible when switching back to compact
                    $parent.addClass('show'); $menu.addClass('show');
                    // Services: each column show first item only
                    $menu.find('.menu-column').each(function(){
                        var $col = $(this);
                        // remove expanded class
                        $col.removeClass('expanded');
                        // show only first dropdown-item, hide others
                        var $items = $col.find('.dropdown-item');
                        $items.hide();
                        $items.first().show();
                        // ensure preview item exists and is shown
                        $col.find('.preview-item').show();
                    });

                    // Resources (flat list) show first 3
                    $menu.find('.resource-menu .dropdown-item').hide().slice(0,3).show();
                } else {
                    // expand all
                    $menu.removeClass('mobile-compact').addClass('expanded-all');
                    // ensure dropdown remains visible when expanded-all
                    $parent.addClass('show'); $menu.addClass('show');
                    // Services: reveal all items and mark columns expanded
                    $menu.find('.menu-column').each(function(){
                        var $col = $(this);
                        $col.addClass('expanded');
                        $col.find('.preview-item').hide();
                        $col.find('.dropdown-item').show();
                    });
                    // Resources: reveal all
                    $menu.find('.resource-menu .dropdown-item').show();
                }

                return false;
            });

        // For resource menus we don't have headers, but we ensure the compact state
        // shows only first 3 items (CSS handles that). Allow clicking an item to behave normally.
    }

    window.initDropdownUI = function(){
        try{
            tagDropdowns();
            bindMobileCompact();
            // if setupDropdownHover exists, ensure it's run to pick up newly-tagged elements
            if (typeof setupDropdownHover === 'function') setupDropdownHover();
            // build a mobile offcanvas menu copy (populate only once)
            buildMobileOffcanvas();
        }catch(e){
            console.warn('initDropdownUI error', e);
        }
    };

    // Run once on load in case header is already present
    $(function(){ if (window.initDropdownUI) window.initDropdownUI(); });
})(jQuery);

