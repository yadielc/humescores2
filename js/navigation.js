/* global humescores22ScreenReaderText */
/**
 * Theme functions file.
 *
 * Contains handlers for navigation and widget area.
 */

(function( $ ) {
	var masthead, menuToggle, siteNavigation;

	function initMainNavigation( container ) {

		// Add dropdown toggle that displays child menu items.
		var dropdownToggle = $( '<button />', { 'class': 'dropdown-toggle', 'aria-expanded': false })
			.append( humescores2ScreenReaderText.icon )
			.append( $( '<span />', { 'class': 'screen-reader-text', text: humescores2ScreenReaderText.expand }) );

		container.find( '.menu-item-has-children > a, .page_item_has_children > a' ).after( dropdownToggle );

		// Toggle buttons and submenu items with active children menu items.
		container.find( '.current-menu-ancestor > button' ).addClass( 'toggled-on' );
		container.find( '.current-menu-ancestor > .sub-menu' ).addClass( 'toggled-on' );

		container.find( '.dropdown-toggle' ).click( function( e ) {
			var _this = $( this ),
				screenReaderSpan = _this.find( '.screen-reader-text' );

			e.preventDefault();
			_this.toggleClass( 'toggled-on' );
			_this.next( '.children, .sub-menu' ).toggleClass( 'toggled-on' );

			_this.attr( 'aria-expanded', _this.attr( 'aria-expanded' ) === 'false' ? 'true' : 'false' );

			screenReaderSpan.text( screenReaderSpan.text() === humescores2ScreenReaderText.expand ? humescores2ScreenReaderText.collapse : humescores2ScreenReaderText.expand );
		});
	}

	initMainNavigation( $( '.main-navigation' ) );

	masthead       = $( '#masthead' );
	menuToggle     = masthead.find( '.menu-toggle' );
	siteNavigation = masthead.find( '.main-navigation > div > ul' );

	// Enable menuToggle.
	(function() {

		// Return early if menuToggle is missing.
		if ( ! menuToggle.length ) {
			return;
		}

		// Add an initial values for the attribute.
		menuToggle.add( siteNavigation ).attr( 'aria-expanded', 'false' );

		menuToggle.on( 'click.humescores2', function() {
			$( siteNavigation.closest( '.main-navigation' ), this ).toggleClass( 'toggled-on' );

			$( this )
				.add( siteNavigation )
				.attr( 'aria-expanded', $( this ).add( siteNavigation ).attr( 'aria-expanded' ) === 'false' ? 'true' : 'false' );
		});
	})();

	// Fix sub-menus for touch devices and better focus for hidden submenu items for accessibility.
	(function() {
		if ( ! siteNavigation.length || ! siteNavigation.children().length ) {
			return;
		}

		// Toggle `focus` class to allow submenu access on tablets.
		function toggleFocusClassTouchScreen() {
			if ( 'none' === $( '.menu-toggle' ).css( 'display' ) ) {

				$( document.body ).on( 'touchstart.humescores2', function( e ) {
					if ( ! $( e.target ).closest( '.main-navigation li' ).length ) {
						$( '.main-navigation li' ).removeClass( 'focus' );
					}
				});

				siteNavigation.find( '.menu-item-has-children > a, .page_item_has_children > a' )
					.on( 'touchstart.humescores2', function( e ) {
						var el = $( this ).parent( 'li' );

						if ( ! el.hasClass( 'focus' ) ) {
							e.preventDefault();
							el.toggleClass( 'focus' );
							el.siblings( '.focus' ).removeClass( 'focus' );
						}
					});

			} else {
				siteNavigation.find( '.menu-item-has-children > a, .page_item_has_children > a' ).unbind( 'touchstart.humescores2' );
			}
		}

		if ( 'ontouchstart' in window ) {
			$( window ).on( 'resize.humescores2', toggleFocusClassTouchScreen );
			toggleFocusClassTouchScreen();
		}

		siteNavigation.find( 'a' ).on( 'focus.humescores2 blur.humescores2', function() {
			$( this ).parents( '.menu-item, .page_item' ).toggleClass( 'focus' );
		});
	})();

	// Add the default ARIA attributes for the menu toggle and the navigations.
	function onResizeARIA() {
		if ( 'block' === $( '.menu-toggle' ).css( 'display' ) ) {

			if ( menuToggle.hasClass( 'toggled-on' ) ) {
				menuToggle.attr( 'aria-expanded', 'true' );
			} else {
				menuToggle.attr( 'aria-expanded', 'false' );
			}

			if ( siteNavigation.closest( '.main-navigation' ).hasClass( 'toggled-on' ) ) {
				siteNavigation.attr( 'aria-expanded', 'true' );
			} else {
				siteNavigation.attr( 'aria-expanded', 'false' );
			}
		} else {
			menuToggle.removeAttr( 'aria-expanded' );
			siteNavigation.removeAttr( 'aria-expanded' );
			menuToggle.removeAttr( 'aria-controls' );
		}
	}

	$( document ).ready( function() {
		$( window ).on( 'load.humescores2', onResizeARIA );
		$( window ).on( 'resize.humescores2', onResizeARIA );
	});

})( jQuery );
