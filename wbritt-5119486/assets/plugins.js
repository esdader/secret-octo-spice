// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

/**
 * Isotope v1.5.25
 * An exquisite jQuery plugin for magical layouts
 * http://isotope.metafizzy.co
 *
 * Commercial use requires one-time purchase of a commercial license
 * http://isotope.metafizzy.co/docs/license.html
 *
 * Non-commercial use is licensed under the MIT License
 *
 * Copyright 2013 Metafizzy
 */

/*jshint asi: true, browser: true, curly: true, eqeqeq: true, forin: false, immed: false, newcap: true, noempty: true, strict: true, undef: true */
/*global jQuery: false */

(function( window, $, undefined ){

  'use strict';

  // get global vars
  var document = window.document;
  var Modernizr = window.Modernizr;

  // helper function
  var capitalize = function( str ) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // ========================= getStyleProperty by kangax ===============================
  // http://perfectionkills.com/feature-testing-css-properties/

  var prefixes = 'Moz Webkit O Ms'.split(' ');

  var getStyleProperty = function( propName ) {
    var style = document.documentElement.style,
        prefixed;

    // test standard property first
    if ( typeof style[propName] === 'string' ) {
      return propName;
    }

    // capitalize
    propName = capitalize( propName );

    // test vendor specific properties
    for ( var i=0, len = prefixes.length; i < len; i++ ) {
      prefixed = prefixes[i] + propName;
      if ( typeof style[ prefixed ] === 'string' ) {
        return prefixed;
      }
    }
  };

  var transformProp = getStyleProperty('transform'),
      transitionProp = getStyleProperty('transitionProperty');


  // ========================= miniModernizr ===============================
  // <3<3<3 and thanks to Faruk and Paul for doing the heavy lifting

  /*!
   * Modernizr v1.6ish: miniModernizr for Isotope
   * http://www.modernizr.com
   *
   * Developed by:
   * - Faruk Ates  http://farukat.es/
   * - Paul Irish  http://paulirish.com/
   *
   * Copyright (c) 2009-2010
   * Dual-licensed under the BSD or MIT licenses.
   * http://www.modernizr.com/license/
   */

  /*
   * This version whittles down the script just to check support for
   * CSS transitions, transforms, and 3D transforms.
  */

  var tests = {
    csstransforms: function() {
      return !!transformProp;
    },

    csstransforms3d: function() {
      var test = !!getStyleProperty('perspective');
      // double check for Chrome's false positive
      if ( test ) {
        var vendorCSSPrefixes = ' -o- -moz- -ms- -webkit- -khtml- '.split(' '),
            mediaQuery = '@media (' + vendorCSSPrefixes.join('transform-3d),(') + 'modernizr)',
            $style = $('<style>' + mediaQuery + '{#modernizr{height:3px}}' + '</style>')
                        .appendTo('head'),
            $div = $('<div id="modernizr" />').appendTo('html');

        test = $div.height() === 3;

        $div.remove();
        $style.remove();
      }
      return test;
    },

    csstransitions: function() {
      return !!transitionProp;
    }
  };

  var testName;

  if ( Modernizr ) {
    // if there's a previous Modernzir, check if there are necessary tests
    for ( testName in tests) {
      if ( !Modernizr.hasOwnProperty( testName ) ) {
        // if test hasn't been run, use addTest to run it
        Modernizr.addTest( testName, tests[ testName ] );
      }
    }
  } else {
    // or create new mini Modernizr that just has the 3 tests
    Modernizr = window.Modernizr = {
      _version : '1.6ish: miniModernizr for Isotope'
    };

    var classes = ' ';
    var result;

    // Run through tests
    for ( testName in tests) {
      result = tests[ testName ]();
      Modernizr[ testName ] = result;
      classes += ' ' + ( result ?  '' : 'no-' ) + testName;
    }

    // Add the new classes to the <html> element.
    $('html').addClass( classes );
  }


  // ========================= isoTransform ===============================

  /**
   *  provides hooks for .css({ scale: value, translate: [x, y] })
   *  Progressively enhanced CSS transforms
   *  Uses hardware accelerated 3D transforms for Safari
   *  or falls back to 2D transforms.
   */

  if ( Modernizr.csstransforms ) {

        // i.e. transformFnNotations.scale(0.5) >> 'scale3d( 0.5, 0.5, 1)'
    var transformFnNotations = Modernizr.csstransforms3d ?
      { // 3D transform functions
        translate : function ( position ) {
          return 'translate3d(' + position[0] + 'px, ' + position[1] + 'px, 0) ';
        },
        scale : function ( scale ) {
          return 'scale3d(' + scale + ', ' + scale + ', 1) ';
        }
      } :
      { // 2D transform functions
        translate : function ( position ) {
          return 'translate(' + position[0] + 'px, ' + position[1] + 'px) ';
        },
        scale : function ( scale ) {
          return 'scale(' + scale + ') ';
        }
      }
    ;

    var setIsoTransform = function ( elem, name, value ) {
          // unpack current transform data
      var data =  $.data( elem, 'isoTransform' ) || {},
          newData = {},
          fnName,
          transformObj = {},
          transformValue;

      // i.e. newData.scale = 0.5
      newData[ name ] = value;
      // extend new value over current data
      $.extend( data, newData );

      for ( fnName in data ) {
        transformValue = data[ fnName ];
        transformObj[ fnName ] = transformFnNotations[ fnName ]( transformValue );
      }

      // get proper order
      // ideally, we could loop through this give an array, but since we only have
      // a couple transforms we're keeping track of, we'll do it like so
      var translateFn = transformObj.translate || '',
          scaleFn = transformObj.scale || '',
          // sorting so translate always comes first
          valueFns = translateFn + scaleFn;

      // set data back in elem
      $.data( elem, 'isoTransform', data );

      // set name to vendor specific property
      elem.style[ transformProp ] = valueFns;
    };

    // ==================== scale ===================

    $.cssNumber.scale = true;

    $.cssHooks.scale = {
      set: function( elem, value ) {
        // uncomment this bit if you want to properly parse strings
        // if ( typeof value === 'string' ) {
        //   value = parseFloat( value );
        // }
        setIsoTransform( elem, 'scale', value );
      },
      get: function( elem, computed ) {
        var transform = $.data( elem, 'isoTransform' );
        return transform && transform.scale ? transform.scale : 1;
      }
    };

    $.fx.step.scale = function( fx ) {
      $.cssHooks.scale.set( fx.elem, fx.now+fx.unit );
    };


    // ==================== translate ===================

    $.cssNumber.translate = true;

    $.cssHooks.translate = {
      set: function( elem, value ) {

        // uncomment this bit if you want to properly parse strings
        // if ( typeof value === 'string' ) {
        //   value = value.split(' ');
        // }
        //
        // var i, val;
        // for ( i = 0; i < 2; i++ ) {
        //   val = value[i];
        //   if ( typeof val === 'string' ) {
        //     val = parseInt( val );
        //   }
        // }

        setIsoTransform( elem, 'translate', value );
      },

      get: function( elem, computed ) {
        var transform = $.data( elem, 'isoTransform' );
        return transform && transform.translate ? transform.translate : [ 0, 0 ];
      }
    };

  }

  // ========================= get transition-end event ===============================
  var transitionEndEvent, transitionDurProp;

  if ( Modernizr.csstransitions ) {
    transitionEndEvent = {
      WebkitTransitionProperty: 'webkitTransitionEnd',  // webkit
      MozTransitionProperty: 'transitionend',
      OTransitionProperty: 'oTransitionEnd otransitionend',
      transitionProperty: 'transitionend'
    }[ transitionProp ];

    transitionDurProp = getStyleProperty('transitionDuration');
  }

  // ========================= smartresize ===============================

  /*
   * smartresize: debounced resize event for jQuery
   *
   * latest version and complete README available on Github:
   * https://github.com/louisremi/jquery.smartresize.js
   *
   * Copyright 2011 @louis_remi
   * Licensed under the MIT license.
   */

  var $event = $.event,
      dispatchMethod = $.event.handle ? 'handle' : 'dispatch',
      resizeTimeout;

  $event.special.smartresize = {
    setup: function() {
      $(this).bind( "resize", $event.special.smartresize.handler );
    },
    teardown: function() {
      $(this).unbind( "resize", $event.special.smartresize.handler );
    },
    handler: function( event, execAsap ) {
      // Save the context
      var context = this,
          args = arguments;

      // set correct event type
      event.type = "smartresize";

      if ( resizeTimeout ) { clearTimeout( resizeTimeout ); }
      resizeTimeout = setTimeout(function() {
        $event[ dispatchMethod ].apply( context, args );
      }, execAsap === "execAsap"? 0 : 100 );
    }
  };

  $.fn.smartresize = function( fn ) {
    return fn ? this.bind( "smartresize", fn ) : this.trigger( "smartresize", ["execAsap"] );
  };



// ========================= Isotope ===============================


  // our "Widget" object constructor
  $.Isotope = function( options, element, callback ){
    this.element = $( element );

    this._create( options );
    this._init( callback );
  };

  // styles of container element we want to keep track of
  var isoContainerStyles = [ 'width', 'height' ];

  var $window = $(window);

  $.Isotope.settings = {
    resizable: true,
    layoutMode : 'masonry',
    containerClass : 'isotope',
    itemClass : 'isotope-item',
    hiddenClass : 'isotope-hidden',
    hiddenStyle: { opacity: 0, scale: 0.001 },
    visibleStyle: { opacity: 1, scale: 1 },
    containerStyle: {
      position: 'relative',
      overflow: 'hidden'
    },
    animationEngine: 'best-available',
    animationOptions: {
      queue: false,
      duration: 800
    },
    sortBy : 'original-order',
    sortAscending : true,
    resizesContainer : true,
    transformsEnabled: true,
    itemPositionDataEnabled: false
  };

  $.Isotope.prototype = {

    // sets up widget
    _create : function( options ) {

      this.options = $.extend( {}, $.Isotope.settings, options );

      this.styleQueue = [];
      this.elemCount = 0;

      // get original styles in case we re-apply them in .destroy()
      var elemStyle = this.element[0].style;
      this.originalStyle = {};
      // keep track of container styles
      var containerStyles = isoContainerStyles.slice(0);
      for ( var prop in this.options.containerStyle ) {
        containerStyles.push( prop );
      }
      for ( var i=0, len = containerStyles.length; i < len; i++ ) {
        prop = containerStyles[i];
        this.originalStyle[ prop ] = elemStyle[ prop ] || '';
      }
      // apply container style from options
      this.element.css( this.options.containerStyle );

      this._updateAnimationEngine();
      this._updateUsingTransforms();

      // sorting
      var originalOrderSorter = {
        'original-order' : function( $elem, instance ) {
          instance.elemCount ++;
          return instance.elemCount;
        },
        random : function() {
          return Math.random();
        }
      };

      this.options.getSortData = $.extend( this.options.getSortData, originalOrderSorter );

      // need to get atoms
      this.reloadItems();

      // get top left position of where the bricks should be
      this.offset = {
        left: parseInt( ( this.element.css('padding-left') || 0 ), 10 ),
        top: parseInt( ( this.element.css('padding-top') || 0 ), 10 )
      };

      // add isotope class first time around
      var instance = this;
      setTimeout( function() {
        instance.element.addClass( instance.options.containerClass );
      }, 0 );

      // bind resize method
      if ( this.options.resizable ) {
        $window.bind( 'smartresize.isotope', function() {
          instance.resize();
        });
      }

      // dismiss all click events from hidden events
      this.element.delegate( '.' + this.options.hiddenClass, 'click', function(){
        return false;
      });

    },

    _getAtoms : function( $elems ) {
      var selector = this.options.itemSelector,
          // filter & find
          $atoms = selector ? $elems.filter( selector ).add( $elems.find( selector ) ) : $elems,
          // base style for atoms
          atomStyle = { position: 'absolute' };

      // filter out text nodes
      $atoms = $atoms.filter( function( i, atom ) {
        return atom.nodeType === 1;
      });

      if ( this.usingTransforms ) {
        atomStyle.left = 0;
        atomStyle.top = 0;
      }

      $atoms.css( atomStyle ).addClass( this.options.itemClass );

      this.updateSortData( $atoms, true );

      return $atoms;
    },

    // _init fires when your instance is first created
    // (from the constructor above), and when you
    // attempt to initialize the widget again (by the bridge)
    // after it has already been initialized.
    _init : function( callback ) {

      this.$filteredAtoms = this._filter( this.$allAtoms );
      this._sort();
      this.reLayout( callback );

    },

    option : function( opts ){
      // change options AFTER initialization:
      // signature: $('#foo').bar({ cool:false });
      if ( $.isPlainObject( opts ) ){
        this.options = $.extend( true, this.options, opts );

        // trigger _updateOptionName if it exists
        var updateOptionFn;
        for ( var optionName in opts ) {
          updateOptionFn = '_update' + capitalize( optionName );
          if ( this[ updateOptionFn ] ) {
            this[ updateOptionFn ]();
          }
        }
      }
    },

    // ====================== updaters ====================== //
    // kind of like setters

    _updateAnimationEngine : function() {
      var animationEngine = this.options.animationEngine.toLowerCase().replace( /[ _\-]/g, '');
      var isUsingJQueryAnimation;
      // set applyStyleFnName
      switch ( animationEngine ) {
        case 'css' :
        case 'none' :
          isUsingJQueryAnimation = false;
          break;
        case 'jquery' :
          isUsingJQueryAnimation = true;
          break;
        default : // best available
          isUsingJQueryAnimation = !Modernizr.csstransitions;
      }
      this.isUsingJQueryAnimation = isUsingJQueryAnimation;
      this._updateUsingTransforms();
    },

    _updateTransformsEnabled : function() {
      this._updateUsingTransforms();
    },

    _updateUsingTransforms : function() {
      var usingTransforms = this.usingTransforms = this.options.transformsEnabled &&
        Modernizr.csstransforms && Modernizr.csstransitions && !this.isUsingJQueryAnimation;

      // prevent scales when transforms are disabled
      if ( !usingTransforms ) {
        delete this.options.hiddenStyle.scale;
        delete this.options.visibleStyle.scale;
      }

      this.getPositionStyles = usingTransforms ? this._translate : this._positionAbs;
    },


    // ====================== Filtering ======================

    _filter : function( $atoms ) {
      var filter = this.options.filter === '' ? '*' : this.options.filter;

      if ( !filter ) {
        return $atoms;
      }

      var hiddenClass    = this.options.hiddenClass,
          hiddenSelector = '.' + hiddenClass,
          $hiddenAtoms   = $atoms.filter( hiddenSelector ),
          $atomsToShow   = $hiddenAtoms;

      if ( filter !== '*' ) {
        $atomsToShow = $hiddenAtoms.filter( filter );
        var $atomsToHide = $atoms.not( hiddenSelector ).not( filter ).addClass( hiddenClass );
        this.styleQueue.push({ $el: $atomsToHide, style: this.options.hiddenStyle });
      }

      this.styleQueue.push({ $el: $atomsToShow, style: this.options.visibleStyle });
      $atomsToShow.removeClass( hiddenClass );

      return $atoms.filter( filter );
    },

    // ====================== Sorting ======================

    updateSortData : function( $atoms, isIncrementingElemCount ) {
      var instance = this,
          getSortData = this.options.getSortData,
          $this, sortData;
      $atoms.each(function(){
        $this = $(this);
        sortData = {};
        // get value for sort data based on fn( $elem ) passed in
        for ( var key in getSortData ) {
          if ( !isIncrementingElemCount && key === 'original-order' ) {
            // keep original order original
            sortData[ key ] = $.data( this, 'isotope-sort-data' )[ key ];
          } else {
            sortData[ key ] = getSortData[ key ]( $this, instance );
          }
        }
        // apply sort data to element
        $.data( this, 'isotope-sort-data', sortData );
      });
    },

    // used on all the filtered atoms
    _sort : function() {

      var sortBy = this.options.sortBy,
          getSorter = this._getSorter,
          sortDir = this.options.sortAscending ? 1 : -1,
          sortFn = function( alpha, beta ) {
            var a = getSorter( alpha, sortBy ),
                b = getSorter( beta, sortBy );
            // fall back to original order if data matches
            if ( a === b && sortBy !== 'original-order') {
              a = getSorter( alpha, 'original-order' );
              b = getSorter( beta, 'original-order' );
            }
            return ( ( a > b ) ? 1 : ( a < b ) ? -1 : 0 ) * sortDir;
          };

      this.$filteredAtoms.sort( sortFn );
    },

    _getSorter : function( elem, sortBy ) {
      return $.data( elem, 'isotope-sort-data' )[ sortBy ];
    },

    // ====================== Layout Helpers ======================

    _translate : function( x, y ) {
      return { translate : [ x, y ] };
    },

    _positionAbs : function( x, y ) {
      return { left: x, top: y };
    },

    _pushPosition : function( $elem, x, y ) {
      x = Math.round( x + this.offset.left );
      y = Math.round( y + this.offset.top );
      var position = this.getPositionStyles( x, y );
      this.styleQueue.push({ $el: $elem, style: position });
      if ( this.options.itemPositionDataEnabled ) {
        $elem.data('isotope-item-position', {x: x, y: y} );
      }
    },


    // ====================== General Layout ======================

    // used on collection of atoms (should be filtered, and sorted before )
    // accepts atoms-to-be-laid-out to start with
    layout : function( $elems, callback ) {

      var layoutMode = this.options.layoutMode;

      // layout logic
      this[ '_' +  layoutMode + 'Layout' ]( $elems );

      // set the size of the container
      if ( this.options.resizesContainer ) {
        var containerStyle = this[ '_' +  layoutMode + 'GetContainerSize' ]();
        this.styleQueue.push({ $el: this.element, style: containerStyle });
      }

      this._processStyleQueue( $elems, callback );

      this.isLaidOut = true;
    },

    _processStyleQueue : function( $elems, callback ) {
      // are we animating the layout arrangement?
      // use plugin-ish syntax for css or animate
      var styleFn = !this.isLaidOut ? 'css' : (
            this.isUsingJQueryAnimation ? 'animate' : 'css'
          ),
          animOpts = this.options.animationOptions,
          onLayout = this.options.onLayout,
          objStyleFn, processor,
          triggerCallbackNow, callbackFn;

      // default styleQueue processor, may be overwritten down below
      processor = function( i, obj ) {
        obj.$el[ styleFn ]( obj.style, animOpts );
      };

      if ( this._isInserting && this.isUsingJQueryAnimation ) {
        // if using styleQueue to insert items
        processor = function( i, obj ) {
          // only animate if it not being inserted
          objStyleFn = obj.$el.hasClass('no-transition') ? 'css' : styleFn;
          obj.$el[ objStyleFn ]( obj.style, animOpts );
        };

      } else if ( callback || onLayout || animOpts.complete ) {
        // has callback
        var isCallbackTriggered = false,
            // array of possible callbacks to trigger
            callbacks = [ callback, onLayout, animOpts.complete ],
            instance = this;
        triggerCallbackNow = true;
        // trigger callback only once
        callbackFn = function() {
          if ( isCallbackTriggered ) {
            return;
          }
          var hollaback;
          for (var i=0, len = callbacks.length; i < len; i++) {
            hollaback = callbacks[i];
            if ( typeof hollaback === 'function' ) {
              hollaback.call( instance.element, $elems, instance );
            }
          }
          isCallbackTriggered = true;
        };

        if ( this.isUsingJQueryAnimation && styleFn === 'animate' ) {
          // add callback to animation options
          animOpts.complete = callbackFn;
          triggerCallbackNow = false;

        } else if ( Modernizr.csstransitions ) {
          // detect if first item has transition
          var i = 0,
              firstItem = this.styleQueue[0],
              testElem = firstItem && firstItem.$el,
              styleObj;
          // get first non-empty jQ object
          while ( !testElem || !testElem.length ) {
            styleObj = this.styleQueue[ i++ ];
            // HACK: sometimes styleQueue[i] is undefined
            if ( !styleObj ) {
              return;
            }
            testElem = styleObj.$el;
          }
          // get transition duration of the first element in that object
          // yeah, this is inexact
          var duration = parseFloat( getComputedStyle( testElem[0] )[ transitionDurProp ] );
          if ( duration > 0 ) {
            processor = function( i, obj ) {
              obj.$el[ styleFn ]( obj.style, animOpts )
                // trigger callback at transition end
                .one( transitionEndEvent, callbackFn );
            };
            triggerCallbackNow = false;
          }
        }
      }

      // process styleQueue
      $.each( this.styleQueue, processor );

      if ( triggerCallbackNow ) {
        callbackFn();
      }

      // clear out queue for next time
      this.styleQueue = [];
    },


    resize : function() {
      if ( this[ '_' + this.options.layoutMode + 'ResizeChanged' ]() ) {
        this.reLayout();
      }
    },


    reLayout : function( callback ) {

      this[ '_' +  this.options.layoutMode + 'Reset' ]();
      this.layout( this.$filteredAtoms, callback );

    },

    // ====================== Convenience methods ======================

    // ====================== Adding items ======================

    // adds a jQuery object of items to a isotope container
    addItems : function( $content, callback ) {
      var $newAtoms = this._getAtoms( $content );
      // add new atoms to atoms pools
      this.$allAtoms = this.$allAtoms.add( $newAtoms );

      if ( callback ) {
        callback( $newAtoms );
      }
    },

    // convienence method for adding elements properly to any layout
    // positions items, hides them, then animates them back in <--- very sezzy
    insert : function( $content, callback ) {
      // position items
      this.element.append( $content );

      var instance = this;
      this.addItems( $content, function( $newAtoms ) {
        var $newFilteredAtoms = instance._filter( $newAtoms );
        instance._addHideAppended( $newFilteredAtoms );
        instance._sort();
        instance.reLayout();
        instance._revealAppended( $newFilteredAtoms, callback );
      });

    },

    // convienence method for working with Infinite Scroll
    appended : function( $content, callback ) {
      var instance = this;
      this.addItems( $content, function( $newAtoms ) {
        instance._addHideAppended( $newAtoms );
        instance.layout( $newAtoms );
        instance._revealAppended( $newAtoms, callback );
      });
    },

    // adds new atoms, then hides them before positioning
    _addHideAppended : function( $newAtoms ) {
      this.$filteredAtoms = this.$filteredAtoms.add( $newAtoms );
      $newAtoms.addClass('no-transition');

      this._isInserting = true;

      // apply hidden styles
      this.styleQueue.push({ $el: $newAtoms, style: this.options.hiddenStyle });
    },

    // sets visible style on new atoms
    _revealAppended : function( $newAtoms, callback ) {
      var instance = this;
      // apply visible style after a sec
      setTimeout( function() {
        // enable animation
        $newAtoms.removeClass('no-transition');
        // reveal newly inserted filtered elements
        instance.styleQueue.push({ $el: $newAtoms, style: instance.options.visibleStyle });
        instance._isInserting = false;
        instance._processStyleQueue( $newAtoms, callback );
      }, 10 );
    },

    // gathers all atoms
    reloadItems : function() {
      this.$allAtoms = this._getAtoms( this.element.children() );
    },

    // removes elements from Isotope widget
    remove: function( $content, callback ) {
      // remove elements immediately from Isotope instance
      this.$allAtoms = this.$allAtoms.not( $content );
      this.$filteredAtoms = this.$filteredAtoms.not( $content );
      // remove() as a callback, for after transition / animation
      var instance = this;
      var removeContent = function() {
        $content.remove();
        if ( callback ) {
          callback.call( instance.element );
        }
      };

      if ( $content.filter( ':not(.' + this.options.hiddenClass + ')' ).length ) {
        // if any non-hidden content needs to be removed
        this.styleQueue.push({ $el: $content, style: this.options.hiddenStyle });
        this._sort();
        this.reLayout( removeContent );
      } else {
        // remove it now
        removeContent();
      }

    },

    shuffle : function( callback ) {
      this.updateSortData( this.$allAtoms );
      this.options.sortBy = 'random';
      this._sort();
      this.reLayout( callback );
    },

    // destroys widget, returns elements and container back (close) to original style
    destroy : function() {

      var usingTransforms = this.usingTransforms;
      var options = this.options;

      this.$allAtoms
        .removeClass( options.hiddenClass + ' ' + options.itemClass )
        .each(function(){
          var style = this.style;
          style.position = '';
          style.top = '';
          style.left = '';
          style.opacity = '';
          if ( usingTransforms ) {
            style[ transformProp ] = '';
          }
        });

      // re-apply saved container styles
      var elemStyle = this.element[0].style;
      for ( var prop in this.originalStyle ) {
        elemStyle[ prop ] = this.originalStyle[ prop ];
      }

      this.element
        .unbind('.isotope')
        .undelegate( '.' + options.hiddenClass, 'click' )
        .removeClass( options.containerClass )
        .removeData('isotope');

      $window.unbind('.isotope');

    },


    // ====================== LAYOUTS ======================

    // calculates number of rows or columns
    // requires columnWidth or rowHeight to be set on namespaced object
    // i.e. this.masonry.columnWidth = 200
    _getSegments : function( isRows ) {
      var namespace = this.options.layoutMode,
          measure  = isRows ? 'rowHeight' : 'columnWidth',
          size     = isRows ? 'height' : 'width',
          segmentsName = isRows ? 'rows' : 'cols',
          containerSize = this.element[ size ](),
          segments,
                    // i.e. options.masonry && options.masonry.columnWidth
          segmentSize = this.options[ namespace ] && this.options[ namespace ][ measure ] ||
                    // or use the size of the first item, i.e. outerWidth
                    this.$filteredAtoms[ 'outer' + capitalize(size) ](true) ||
                    // if there's no items, use size of container
                    containerSize;

      segments = Math.floor( containerSize / segmentSize );
      segments = Math.max( segments, 1 );

      // i.e. this.masonry.cols = ....
      this[ namespace ][ segmentsName ] = segments;
      // i.e. this.masonry.columnWidth = ...
      this[ namespace ][ measure ] = segmentSize;

    },

    _checkIfSegmentsChanged : function( isRows ) {
      var namespace = this.options.layoutMode,
          segmentsName = isRows ? 'rows' : 'cols',
          prevSegments = this[ namespace ][ segmentsName ];
      // update cols/rows
      this._getSegments( isRows );
      // return if updated cols/rows is not equal to previous
      return ( this[ namespace ][ segmentsName ] !== prevSegments );
    },

    // ====================== Masonry ======================

    _masonryReset : function() {
      // layout-specific props
      this.masonry = {};
      // FIXME shouldn't have to call this again
      this._getSegments();
      var i = this.masonry.cols;
      this.masonry.colYs = [];
      while (i--) {
        this.masonry.colYs.push( 0 );
      }
    },

    _masonryLayout : function( $elems ) {
      var instance = this,
          props = instance.masonry;
      $elems.each(function(){
        var $this  = $(this),
            //how many columns does this brick span
            colSpan = Math.ceil( $this.outerWidth(true) / props.columnWidth );
        colSpan = Math.min( colSpan, props.cols );

        if ( colSpan === 1 ) {
          // if brick spans only one column, just like singleMode
          instance._masonryPlaceBrick( $this, props.colYs );
        } else {
          // brick spans more than one column
          // how many different places could this brick fit horizontally
          var groupCount = props.cols + 1 - colSpan,
              groupY = [],
              groupColY,
              i;

          // for each group potential horizontal position
          for ( i=0; i < groupCount; i++ ) {
            // make an array of colY values for that one group
            groupColY = props.colYs.slice( i, i+colSpan );
            // and get the max value of the array
            groupY[i] = Math.max.apply( Math, groupColY );
          }

          instance._masonryPlaceBrick( $this, groupY );
        }
      });
    },

    // worker method that places brick in the columnSet
    //   with the the minY
    _masonryPlaceBrick : function( $brick, setY ) {
      // get the minimum Y value from the columns
      var minimumY = Math.min.apply( Math, setY ),
          shortCol = 0;

      // Find index of short column, the first from the left
      for (var i=0, len = setY.length; i < len; i++) {
        if ( setY[i] === minimumY ) {
          shortCol = i;
          break;
        }
      }

      // position the brick
      var x = this.masonry.columnWidth * shortCol,
          y = minimumY;
      this._pushPosition( $brick, x, y );

      // apply setHeight to necessary columns
      var setHeight = minimumY + $brick.outerHeight(true),
          setSpan = this.masonry.cols + 1 - len;
      for ( i=0; i < setSpan; i++ ) {
        this.masonry.colYs[ shortCol + i ] = setHeight;
      }

    },

    _masonryGetContainerSize : function() {
      var containerHeight = Math.max.apply( Math, this.masonry.colYs );
      return { height: containerHeight };
    },

    _masonryResizeChanged : function() {
      return this._checkIfSegmentsChanged();
    },

    // ====================== fitRows ======================

    _fitRowsReset : function() {
      this.fitRows = {
        x : 0,
        y : 0,
        height : 0
      };
    },

    _fitRowsLayout : function( $elems ) {
      var instance = this,
          containerWidth = this.element.width(),
          props = this.fitRows;

      $elems.each( function() {
        var $this = $(this),
            atomW = $this.outerWidth(true),
            atomH = $this.outerHeight(true);

        if ( props.x !== 0 && atomW + props.x > containerWidth ) {
          // if this element cannot fit in the current row
          props.x = 0;
          props.y = props.height;
        }

        // position the atom
        instance._pushPosition( $this, props.x, props.y );

        props.height = Math.max( props.y + atomH, props.height );
        props.x += atomW;

      });
    },

    _fitRowsGetContainerSize : function () {
      return { height : this.fitRows.height };
    },

    _fitRowsResizeChanged : function() {
      return true;
    },


    // ====================== cellsByRow ======================

    _cellsByRowReset : function() {
      this.cellsByRow = {
        index : 0
      };
      // get this.cellsByRow.columnWidth
      this._getSegments();
      // get this.cellsByRow.rowHeight
      this._getSegments(true);
    },

    _cellsByRowLayout : function( $elems ) {
      var instance = this,
          props = this.cellsByRow;
      $elems.each( function(){
        var $this = $(this),
            col = props.index % props.cols,
            row = Math.floor( props.index / props.cols ),
            x = ( col + 0.5 ) * props.columnWidth - $this.outerWidth(true) / 2,
            y = ( row + 0.5 ) * props.rowHeight - $this.outerHeight(true) / 2;
        instance._pushPosition( $this, x, y );
        props.index ++;
      });
    },

    _cellsByRowGetContainerSize : function() {
      return { height : Math.ceil( this.$filteredAtoms.length / this.cellsByRow.cols ) * this.cellsByRow.rowHeight + this.offset.top };
    },

    _cellsByRowResizeChanged : function() {
      return this._checkIfSegmentsChanged();
    },


    // ====================== straightDown ======================

    _straightDownReset : function() {
      this.straightDown = {
        y : 0
      };
    },

    _straightDownLayout : function( $elems ) {
      var instance = this;
      $elems.each( function( i ){
        var $this = $(this);
        instance._pushPosition( $this, 0, instance.straightDown.y );
        instance.straightDown.y += $this.outerHeight(true);
      });
    },

    _straightDownGetContainerSize : function() {
      return { height : this.straightDown.y };
    },

    _straightDownResizeChanged : function() {
      return true;
    },


    // ====================== masonryHorizontal ======================

    _masonryHorizontalReset : function() {
      // layout-specific props
      this.masonryHorizontal = {};
      // FIXME shouldn't have to call this again
      this._getSegments( true );
      var i = this.masonryHorizontal.rows;
      this.masonryHorizontal.rowXs = [];
      while (i--) {
        this.masonryHorizontal.rowXs.push( 0 );
      }
    },

    _masonryHorizontalLayout : function( $elems ) {
      var instance = this,
          props = instance.masonryHorizontal;
      $elems.each(function(){
        var $this  = $(this),
            //how many rows does this brick span
            rowSpan = Math.ceil( $this.outerHeight(true) / props.rowHeight );
        rowSpan = Math.min( rowSpan, props.rows );

        if ( rowSpan === 1 ) {
          // if brick spans only one column, just like singleMode
          instance._masonryHorizontalPlaceBrick( $this, props.rowXs );
        } else {
          // brick spans more than one row
          // how many different places could this brick fit horizontally
          var groupCount = props.rows + 1 - rowSpan,
              groupX = [],
              groupRowX, i;

          // for each group potential horizontal position
          for ( i=0; i < groupCount; i++ ) {
            // make an array of colY values for that one group
            groupRowX = props.rowXs.slice( i, i+rowSpan );
            // and get the max value of the array
            groupX[i] = Math.max.apply( Math, groupRowX );
          }

          instance._masonryHorizontalPlaceBrick( $this, groupX );
        }
      });
    },

    _masonryHorizontalPlaceBrick : function( $brick, setX ) {
      // get the minimum Y value from the columns
      var minimumX  = Math.min.apply( Math, setX ),
          smallRow  = 0;
      // Find index of smallest row, the first from the top
      for (var i=0, len = setX.length; i < len; i++) {
        if ( setX[i] === minimumX ) {
          smallRow = i;
          break;
        }
      }

      // position the brick
      var x = minimumX,
          y = this.masonryHorizontal.rowHeight * smallRow;
      this._pushPosition( $brick, x, y );

      // apply setHeight to necessary columns
      var setWidth = minimumX + $brick.outerWidth(true),
          setSpan = this.masonryHorizontal.rows + 1 - len;
      for ( i=0; i < setSpan; i++ ) {
        this.masonryHorizontal.rowXs[ smallRow + i ] = setWidth;
      }
    },

    _masonryHorizontalGetContainerSize : function() {
      var containerWidth = Math.max.apply( Math, this.masonryHorizontal.rowXs );
      return { width: containerWidth };
    },

    _masonryHorizontalResizeChanged : function() {
      return this._checkIfSegmentsChanged(true);
    },


    // ====================== fitColumns ======================

    _fitColumnsReset : function() {
      this.fitColumns = {
        x : 0,
        y : 0,
        width : 0
      };
    },

    _fitColumnsLayout : function( $elems ) {
      var instance = this,
          containerHeight = this.element.height(),
          props = this.fitColumns;
      $elems.each( function() {
        var $this = $(this),
            atomW = $this.outerWidth(true),
            atomH = $this.outerHeight(true);

        if ( props.y !== 0 && atomH + props.y > containerHeight ) {
          // if this element cannot fit in the current column
          props.x = props.width;
          props.y = 0;
        }

        // position the atom
        instance._pushPosition( $this, props.x, props.y );

        props.width = Math.max( props.x + atomW, props.width );
        props.y += atomH;

      });
    },

    _fitColumnsGetContainerSize : function () {
      return { width : this.fitColumns.width };
    },

    _fitColumnsResizeChanged : function() {
      return true;
    },



    // ====================== cellsByColumn ======================

    _cellsByColumnReset : function() {
      this.cellsByColumn = {
        index : 0
      };
      // get this.cellsByColumn.columnWidth
      this._getSegments();
      // get this.cellsByColumn.rowHeight
      this._getSegments(true);
    },

    _cellsByColumnLayout : function( $elems ) {
      var instance = this,
          props = this.cellsByColumn;
      $elems.each( function(){
        var $this = $(this),
            col = Math.floor( props.index / props.rows ),
            row = props.index % props.rows,
            x = ( col + 0.5 ) * props.columnWidth - $this.outerWidth(true) / 2,
            y = ( row + 0.5 ) * props.rowHeight - $this.outerHeight(true) / 2;
        instance._pushPosition( $this, x, y );
        props.index ++;
      });
    },

    _cellsByColumnGetContainerSize : function() {
      return { width : Math.ceil( this.$filteredAtoms.length / this.cellsByColumn.rows ) * this.cellsByColumn.columnWidth };
    },

    _cellsByColumnResizeChanged : function() {
      return this._checkIfSegmentsChanged(true);
    },

    // ====================== straightAcross ======================

    _straightAcrossReset : function() {
      this.straightAcross = {
        x : 0
      };
    },

    _straightAcrossLayout : function( $elems ) {
      var instance = this;
      $elems.each( function( i ){
        var $this = $(this);
        instance._pushPosition( $this, instance.straightAcross.x, 0 );
        instance.straightAcross.x += $this.outerWidth(true);
      });
    },

    _straightAcrossGetContainerSize : function() {
      return { width : this.straightAcross.x };
    },

    _straightAcrossResizeChanged : function() {
      return true;
    }

  };


  // ======================= imagesLoaded Plugin ===============================
  /*!
   * jQuery imagesLoaded plugin v1.1.0
   * http://github.com/desandro/imagesloaded
   *
   * MIT License. by Paul Irish et al.
   */


  // $('#my-container').imagesLoaded(myFunction)
  // or
  // $('img').imagesLoaded(myFunction)

  // execute a callback when all images have loaded.
  // needed because .load() doesn't work on cached images

  // callback function gets image collection as argument
  //  `this` is the container

  $.fn.imagesLoaded = function( callback ) {
    var $this = this,
        $images = $this.find('img').add( $this.filter('img') ),
        len = $images.length,
        blank = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
        loaded = [];

    function triggerCallback() {
      callback.call( $this, $images );
    }

    function imgLoaded( event ) {
      var img = event.target;
      if ( img.src !== blank && $.inArray( img, loaded ) === -1 ){
        loaded.push( img );
        if ( --len <= 0 ){
          setTimeout( triggerCallback );
          $images.unbind( '.imagesLoaded', imgLoaded );
        }
      }
    }

    // if no images, trigger immediately
    if ( !len ) {
      triggerCallback();
    }

    $images.bind( 'load.imagesLoaded error.imagesLoaded',  imgLoaded ).each( function() {
      // cached images don't fire load sometimes, so we reset src.
      var src = this.src;
      // webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
      // data uri bypasses webkit log warning (thx doug jones)
      this.src = blank;
      this.src = src;
    });

    return $this;
  };


  // helper function for logging errors
  // $.error breaks jQuery chaining
  var logError = function( message ) {
    if ( window.console ) {
      window.console.error( message );
    }
  };

  // =======================  Plugin bridge  ===============================
  // leverages data method to either create or return $.Isotope constructor
  // A bit from jQuery UI
  //   https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.widget.js
  // A bit from jcarousel
  //   https://github.com/jsor/jcarousel/blob/master/lib/jquery.jcarousel.js

  $.fn.isotope = function( options, callback ) {
    if ( typeof options === 'string' ) {
      // call method
      var args = Array.prototype.slice.call( arguments, 1 );

      this.each(function(){
        var instance = $.data( this, 'isotope' );
        if ( !instance ) {
          logError( "cannot call methods on isotope prior to initialization; " +
              "attempted to call method '" + options + "'" );
          return;
        }
        if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {
          logError( "no such method '" + options + "' for isotope instance" );
          return;
        }
        // apply method
        instance[ options ].apply( instance, args );
      });
    } else {
      this.each(function() {
        var instance = $.data( this, 'isotope' );
        if ( instance ) {
          // apply options & init
          instance.option( options );
          instance._init( callback );
        } else {
          // initialize new instance
          $.data( this, 'isotope', new $.Isotope( options, this, callback ) );
        }
      });
    }
    // return jQuery object
    // so plugin methods do not have to
    return this;
  };

})( window, jQuery );


// customization of isotope
// custom layout mode spineAlign
  $.Isotope.prototype._spineAlignReset = function() {
    this.spineAlign = {
      colA: 100,
      colB: 100,
      itemCount: 0,
      gutterCount: 6
    };
  };

  $.Isotope.prototype._spineAlignLayout = function( $elems ) {
    var instance = this,
        props = this.spineAlign,
        gutterWidth = Math.round( this.options.spineAlign && this.options.spineAlign.gutterWidth ) || 0,

        // Set initial vertical gutter placement, and store centerline and window for future gutter movement 
        winWidth = this.element.width(),
        makeHgutter = false,
        availableWidth = 0,
        wideItem = false,
        gutterX = Math.round(this.element.width() * 0.4),
        centerX = Math.round(this.element.width() / 2);        

    for (var i=0;i<$elems.length;i++) {
      var $this = $($elems[i]);
      //console.log('processing element: '+i+' width: '+$this.width());
      isColA = props.colA <= props.colB; // Do we put the item to the left (colA) or right (colB) of gutter

      // Test to see if the next image will fit in the space between the vertical gutter and edge of container
      if ($this.outerHeight(true) > Math.abs(props.colA - props.colB)) { // if next item will be in opposite column
        availableWidth = (isColA ? (winWidth - gutterX - 100) : (gutterX - 100)); // check opposite column
      } else {
        availableWidth = (isColA ? (gutterX - 100) : (winWidth - gutterX - 100)); // check same column
      }
      wideItem = ($($elems[i+1]).width() > availableWidth);

      //console.log('availableWidth: '+availableWidth+', next item width: '+$($elems[i+1]).width());
      //if (wideItem) console.log('next item will be too wide');
 
      if (makeHgutter) { // create horizontal gutter
        //console.log('making h-gutter, last gap was: '+lastGap+', old gutterX: '+gutterX);
        // move current item down to horizontal gutter, which is the GREATER of colA or colB
        y = (isColA ? props.colB  : props.colA);
        // Equalize colA and colB values at the greater of the two, to define the gutter
        props[( isColA ? 'colA' : 'colB' )] = (isColA ? props.colB : props.colA);

        // Shift vertical gutter by between 100 and 300 pixels
        var gutterShift = (Math.floor(Math.random()*6)*25)+100;
        gutterX += (gutterX > centerX) ? -gutterShift : gutterShift;

        // check to see if the current item is too big for the space defined by the new vertical gutter
        availableWidth = (isColA ? (gutterX - 100) : (winWidth - gutterX - 100));
        wideItem = ($this.width() > availableWidth);
        //console.log('New gutterX is '+gutterX+'. Available width in '+( isColA ? 'colA' : 'colB' )+' is '+availableWidth+', item is '+$this.width()+' and wideItem is '+wideItem);

        if (wideItem) { // Move stuff around to make the item fit..
          // check if the other column is wider, and if our item will fit there
          var otherColumnWidth = (isColA ? (winWidth - gutterX - 100) : (gutterX - 100));
          //console.log('other column is '+otherColumnWidth+' wide');
          if (otherColumnWidth > availableWidth) {
            // other column is bigger, switch to that one
            isColA = !isColA;
            //console.log('switching columns, now in column '+( isColA ? 'colA' : 'colB' ));
            // if the item still doesn't fit, move the vertical gutter until it does
            if ($this.width() > otherColumnWidth)
              gutterX = (isColA ? (gutterX + ($this.width() - otherColumnWidth)) : (gutterX - ($this.width() - otherColumnWidth)));
              //console.log('Moving gutterX to '+gutterX+' to enlarge switched column.');
          } else { // make the current column bigger to fit the item
            gutterX = (isColA ? (gutterX + ($this.width() - availableWidth)) : (gutterX - ($this.width() - availableWidth)));
            //console.log('Moving gutterX to '+gutterX+' to enlarge current column.');

          }

        } else { // Tests to make sure we don't create a gap in the flow..

          // Switch columns, so that the first element post-gutter is on the same side as the last element
          // pre-gutter.. this ensures that the test we did above to eliminate any gaps in the flow actually works
          // otherwise if last element was colA and first post-gutter element is colB, next post-gutter element in 
          // colA could still be smaller than the gap in vertical gutters.
          if ( (lastGap > 0) && ( (isColA && (gutterX<centerX)) || (!isColA &&(gutterX>centerX)) ) ) {
            isColA = !isColA;
            //console.log('switching columns!! gutterX was '+gutterX+' and column was '+(isColA?'colB':'colA'));
          }

          // Safety check to make sure the shift won't be greater than the next block width
          // so we don't create a gap in the flow.. make sure overlap is at least 0.3 of new block width
          // if not, decrease the gutter shift by half
          if (gutterShift > ($this.outerWidth(true)*0.7)) { 
            gutterShift *= 0.5;
            //console.log('scaling back guttershift by '+gutterShift+' from '+gutterX);
            // Make sure we shift towards/past centerline of screen
            gutterX += (gutterX > centerX) ? -gutterShift : gutterShift;
            //console.log('... to '+gutterX);
          }
           
          
        } // end if wideItem

        // Update colA/B value to account for new block
        props[( isColA ? 'colA' : 'colB' )] = y + $this.outerHeight(true);

        // Repeat the test to see if the next item is too wide, given we've moved gutterX
        // (but check opposite column, since we just placed an item in the current column)
        availableWidth = (isColA ? (winWidth - gutterX - 100) : (gutterX - 100));
        wideItem = ($($elems[i+1]).width() > availableWidth);
        //console.log('just made h-gutter, checking if next item is too wide: '+wideItem);
        if (!wideItem) {
          // Reset item counter and randomize threshold for next horizontal gutter
          makeHgutter = false;
          props.itemCount = 0;
          props.gutterCount = 4 + Math.round(Math.random()*2);
        } // if next item IS wide, leave makeHgutter true since we'll create another horizontal gutter above it
      } else {
        //console.log('no h-gutter, itemCount: '+props.itemCount+' gutterCount '+props.gutterCount+' wideItem? '+wideItem);
        // Not there yet, set the y value to the normal column position
        y = isColA ? props.colA : props.colB;
        props[( isColA ? 'colA' : 'colB' )] += $this.outerHeight(true);
        // Move first item down a bit
        if ($this.index() === 0) {
          y += 150;
          props.colA += 150;
        }

       // Figure out placement of the current item
        if ((props.itemCount == props.gutterCount) || wideItem ) { // prep for horizontal gutter

          // last element before horizontal gutter, make sure the gap isn't too small
          //var lastGap = ((props.colB > props.colA) ? props.colB - props.colA : props.colA - props.colB);
          var lastGap = (isColA ? props.colA - props.colB : props.colB - props.colA);
          //console.log('gap is '+lastGap);
          if (lastGap < 200) {
            // gap is too small, either shrink or expand the last item before the horizontal gutter
            var innerImageHeight = $this.find('img').innerHeight();
            //console.log('image height is '+innerImageHeight+' and outer is '+$this.innerHeight());
            if (($this.innerHeight() - $this.find('img').innerHeight()) < lastGap) {
              // Can't shrink last item to eliminate gap, not enough margin around image, so increase it
              sizeChange = 200 - lastGap; // make the gap the minimum 200px
              //console.log('increasing gap by '+sizeChange);
            } else {
              // Shrink item to elminate gap
              sizeChange = -lastGap;
              //console.log('changing gap by '+sizeChange);
            }
            //console.log('gap is '+lastGap+', changing last image size by '+sizeChange);

            // If we're increasing the current image size, make sure there's room in the column
            availableWidth = (isColA ? (gutterX - 100) : (winWidth - gutterX - 100));
            if (($this.innerWidth() + sizeChange) > availableWidth) 
              sizeChange = availableWidth - $this.innerWidth();

            // If it's a pendant, make sure increase/decrease only affects the sides and bottom
            if ($(this).attr('data-category') == 'pendants') {
              $this.css({
                'height':($this.innerHeight()+sizeChange)+'px',
                'width':($this.innerWidth()+(sizeChange*2))+'px'
              });
              $this.find('img').css({
                'margin-left':($this.outerWidth(true)-$this.find('img').innerWidth())/2+'px'
              });
            } else {
              $this.css({
                'height':($this.innerHeight()+sizeChange)+'px',
                'width':($this.innerWidth()+sizeChange)+'px'
              });
              $this.find('img').css({
                'margin-top':($this.outerHeight(true)-$this.find('img').innerHeight())/2+'px',
                'margin-left':($this.outerWidth(true)-$this.find('img').innerWidth())/2+'px'
              });
            }
            // Increment the appropriate column counter by the height of the new item
            props[( isColA ? 'colA' : 'colB' )] += sizeChange;

            lastGap = 0;
          } // end if lastgap
        } // end if props.itemCount == props.gutterCount
        // Increment the column value by the height (modified or not) of the element
        props.itemCount += 1;
        makeHgutter = ((props.itemCount > props.gutterCount) || wideItem);
        //console.log('index: '+i+' itemcount: '+props.itemCount+' makeHgutter: '+makeHgutter);
        
      } // end if makeHgutter
      x = isColA ?
          gutterX - ( $this.outerWidth(true) + gutterWidth / 2 ) : // left side
          gutterX + gutterWidth / 2, // right side
      //console.log('setting x to: '+x+', gutterX is '+gutterX+', item width: '+$this.outerWidth(true));

      // Label the element left or right
      $this.addClass(( isColA ? 'left-column' : 'right-column' ));
      $this.attr('data-x',x);
      $this.attr('data-y',y);
      $this.attr('data-height',$this.innerHeight());
      $this.attr('data-width',$this.innerWidth());

      // Set the item position in isotope
      instance._pushPosition( $this, x, y );
    //});
    } // end for loop
    console.log('RELAYOUT DONE');
  };

  $.Isotope.prototype._spineAlignGetContainerSize = function() {
    var size = {};
    size.height = this.spineAlign[( this.spineAlign.colB > this.spineAlign.colA ? 'colB' : 'colA' )];
    return size;
  };

  $.Isotope.prototype._spineAlignResizeChanged = function() {
    return true;
  };


// start flexslider
/*
 * jQuery FlexSlider v2.2.0
 * Copyright 2012 WooThemes
 * Contributing Author: Tyler Smith
 */(function(e){e.flexslider=function(t,n){var r=e(t);r.vars=e.extend({},e.flexslider.defaults,n);var i=r.vars.namespace,s=window.navigator&&window.navigator.msPointerEnabled&&window.MSGesture,o=("ontouchstart"in window||s||window.DocumentTouch&&document instanceof DocumentTouch)&&r.vars.touch,u="click touchend MSPointerUp",a="",f,l=r.vars.direction==="vertical",c=r.vars.reverse,h=r.vars.itemWidth>0,p=r.vars.animation==="fade",d=r.vars.asNavFor!=="",v={},m=!0;e.data(t,"flexslider",r);v={init:function(){r.animating=!1;r.currentSlide=parseInt(r.vars.startAt?r.vars.startAt:0);isNaN(r.currentSlide)&&(r.currentSlide=0);r.animatingTo=r.currentSlide;r.atEnd=r.currentSlide===0||r.currentSlide===r.last;r.containerSelector=r.vars.selector.substr(0,r.vars.selector.search(" "));r.slides=e(r.vars.selector,r);r.container=e(r.containerSelector,r);r.count=r.slides.length;r.syncExists=e(r.vars.sync).length>0;r.vars.animation==="slide"&&(r.vars.animation="swing");r.prop=l?"top":"marginLeft";r.args={};r.manualPause=!1;r.stopped=!1;r.started=!1;r.startTimeout=null;r.transitions=!r.vars.video&&!p&&r.vars.useCSS&&function(){var e=document.createElement("div"),t=["perspectiveProperty","WebkitPerspective","MozPerspective","OPerspective","msPerspective"];for(var n in t)if(e.style[t[n]]!==undefined){r.pfx=t[n].replace("Perspective","").toLowerCase();r.prop="-"+r.pfx+"-transform";return!0}return!1}();r.vars.controlsContainer!==""&&(r.controlsContainer=e(r.vars.controlsContainer).length>0&&e(r.vars.controlsContainer));r.vars.manualControls!==""&&(r.manualControls=e(r.vars.manualControls).length>0&&e(r.vars.manualControls));if(r.vars.randomize){r.slides.sort(function(){return Math.round(Math.random())-.5});r.container.empty().append(r.slides)}r.doMath();r.setup("init");r.vars.controlNav&&v.controlNav.setup();r.vars.directionNav&&v.directionNav.setup();r.vars.keyboard&&(e(r.containerSelector).length===1||r.vars.multipleKeyboard)&&e(document).bind("keyup",function(e){var t=e.keyCode;if(!r.animating&&(t===39||t===37)){var n=t===39?r.getTarget("next"):t===37?r.getTarget("prev"):!1;r.flexAnimate(n,r.vars.pauseOnAction)}});r.vars.mousewheel&&r.bind("mousewheel",function(e,t,n,i){e.preventDefault();var s=t<0?r.getTarget("next"):r.getTarget("prev");r.flexAnimate(s,r.vars.pauseOnAction)});r.vars.pausePlay&&v.pausePlay.setup();r.vars.slideshow&&r.vars.pauseInvisible&&v.pauseInvisible.init();if(r.vars.slideshow){r.vars.pauseOnHover&&r.hover(function(){!r.manualPlay&&!r.manualPause&&r.pause()},function(){!r.manualPause&&!r.manualPlay&&!r.stopped&&r.play()});if(!r.vars.pauseInvisible||!v.pauseInvisible.isHidden())r.vars.initDelay>0?r.startTimeout=setTimeout(r.play,r.vars.initDelay):r.play()}d&&v.asNav.setup();o&&r.vars.touch&&v.touch();(!p||p&&r.vars.smoothHeight)&&e(window).bind("resize orientationchange focus",v.resize);r.find("img").attr("draggable","false");setTimeout(function(){r.vars.start(r)},200)},asNav:{setup:function(){r.asNav=!0;r.animatingTo=Math.floor(r.currentSlide/r.move);r.currentItem=r.currentSlide;r.slides.removeClass(i+"active-slide").eq(r.currentItem).addClass(i+"active-slide");if(!s)r.slides.click(function(t){t.preventDefault();var n=e(this),s=n.index(),o=n.offset().left-e(r).scrollLeft();if(o<=0&&n.hasClass(i+"active-slide"))r.flexAnimate(r.getTarget("prev"),!0);else if(!e(r.vars.asNavFor).data("flexslider").animating&&!n.hasClass(i+"active-slide")){r.direction=r.currentItem<s?"next":"prev";r.flexAnimate(s,r.vars.pauseOnAction,!1,!0,!0)}});else{t._slider=r;r.slides.each(function(){var t=this;t._gesture=new MSGesture;t._gesture.target=t;t.addEventListener("MSPointerDown",function(e){e.preventDefault();e.currentTarget._gesture&&e.currentTarget._gesture.addPointer(e.pointerId)},!1);t.addEventListener("MSGestureTap",function(t){t.preventDefault();var n=e(this),i=n.index();if(!e(r.vars.asNavFor).data("flexslider").animating&&!n.hasClass("active")){r.direction=r.currentItem<i?"next":"prev";r.flexAnimate(i,r.vars.pauseOnAction,!1,!0,!0)}})})}}},controlNav:{setup:function(){r.manualControls?v.controlNav.setupManual():v.controlNav.setupPaging()},setupPaging:function(){var t=r.vars.controlNav==="thumbnails"?"control-thumbs":"control-paging",n=1,s,o;r.controlNavScaffold=e('<ol class="'+i+"control-nav "+i+t+'"></ol>');if(r.pagingCount>1)for(var f=0;f<r.pagingCount;f++){o=r.slides.eq(f);s=r.vars.controlNav==="thumbnails"?'<img src="'+o.attr("data-thumb")+'"/>':"<a>"+n+"</a>";if("thumbnails"===r.vars.controlNav&&!0===r.vars.thumbCaptions){var l=o.attr("data-thumbcaption");""!=l&&undefined!=l&&(s+='<span class="'+i+'caption">'+l+"</span>")}r.controlNavScaffold.append("<li>"+s+"</li>");n++}r.controlsContainer?e(r.controlsContainer).append(r.controlNavScaffold):r.append(r.controlNavScaffold);v.controlNav.set();v.controlNav.active();r.controlNavScaffold.delegate("a, img",u,function(t){t.preventDefault();if(a===""||a===t.type){var n=e(this),s=r.controlNav.index(n);if(!n.hasClass(i+"active")){r.direction=s>r.currentSlide?"next":"prev";r.flexAnimate(s,r.vars.pauseOnAction)}}a===""&&(a=t.type);v.setToClearWatchedEvent()})},setupManual:function(){r.controlNav=r.manualControls;v.controlNav.active();r.controlNav.bind(u,function(t){t.preventDefault();if(a===""||a===t.type){var n=e(this),s=r.controlNav.index(n);if(!n.hasClass(i+"active")){s>r.currentSlide?r.direction="next":r.direction="prev";r.flexAnimate(s,r.vars.pauseOnAction)}}a===""&&(a=t.type);v.setToClearWatchedEvent()})},set:function(){var t=r.vars.controlNav==="thumbnails"?"img":"a";r.controlNav=e("."+i+"control-nav li "+t,r.controlsContainer?r.controlsContainer:r)},active:function(){r.controlNav.removeClass(i+"active").eq(r.animatingTo).addClass(i+"active")},update:function(t,n){r.pagingCount>1&&t==="add"?r.controlNavScaffold.append(e("<li><a>"+r.count+"</a></li>")):r.pagingCount===1?r.controlNavScaffold.find("li").remove():r.controlNav.eq(n).closest("li").remove();v.controlNav.set();r.pagingCount>1&&r.pagingCount!==r.controlNav.length?r.update(n,t):v.controlNav.active()}},directionNav:{setup:function(){var t=e('<ul class="'+i+'direction-nav"><li><a class="'+i+'prev" href="#">'+r.vars.prevText+'</a></li><li><a class="'+i+'next" href="#">'+r.vars.nextText+"</a></li></ul>");if(r.controlsContainer){e(r.controlsContainer).append(t);r.directionNav=e("."+i+"direction-nav li a",r.controlsContainer)}else{r.append(t);r.directionNav=e("."+i+"direction-nav li a",r)}v.directionNav.update();r.directionNav.bind(u,function(t){t.preventDefault();var n;if(a===""||a===t.type){n=e(this).hasClass(i+"next")?r.getTarget("next"):r.getTarget("prev");r.flexAnimate(n,r.vars.pauseOnAction)}a===""&&(a=t.type);v.setToClearWatchedEvent()})},update:function(){var e=i+"disabled";r.pagingCount===1?r.directionNav.addClass(e).attr("tabindex","-1"):r.vars.animationLoop?r.directionNav.removeClass(e).removeAttr("tabindex"):r.animatingTo===0?r.directionNav.removeClass(e).filter("."+i+"prev").addClass(e).attr("tabindex","-1"):r.animatingTo===r.last?r.directionNav.removeClass(e).filter("."+i+"next").addClass(e).attr("tabindex","-1"):r.directionNav.removeClass(e).removeAttr("tabindex")}},pausePlay:{setup:function(){var t=e('<div class="'+i+'pauseplay"><a></a></div>');if(r.controlsContainer){r.controlsContainer.append(t);r.pausePlay=e("."+i+"pauseplay a",r.controlsContainer)}else{r.append(t);r.pausePlay=e("."+i+"pauseplay a",r)}v.pausePlay.update(r.vars.slideshow?i+"pause":i+"play");r.pausePlay.bind(u,function(t){t.preventDefault();if(a===""||a===t.type)if(e(this).hasClass(i+"pause")){r.manualPause=!0;r.manualPlay=!1;r.pause()}else{r.manualPause=!1;r.manualPlay=!0;r.play()}a===""&&(a=t.type);v.setToClearWatchedEvent()})},update:function(e){e==="play"?r.pausePlay.removeClass(i+"pause").addClass(i+"play").html(r.vars.playText):r.pausePlay.removeClass(i+"play").addClass(i+"pause").html(r.vars.pauseText)}},touch:function(){var e,n,i,o,u,a,f=!1,d=0,v=0,m=0;if(!s){t.addEventListener("touchstart",g,!1);function g(s){if(r.animating)s.preventDefault();else if(window.navigator.msPointerEnabled||s.touches.length===1){r.pause();o=l?r.h:r.w;a=Number(new Date);d=s.touches[0].pageX;v=s.touches[0].pageY;i=h&&c&&r.animatingTo===r.last?0:h&&c?r.limit-(r.itemW+r.vars.itemMargin)*r.move*r.animatingTo:h&&r.currentSlide===r.last?r.limit:h?(r.itemW+r.vars.itemMargin)*r.move*r.currentSlide:c?(r.last-r.currentSlide+r.cloneOffset)*o:(r.currentSlide+r.cloneOffset)*o;e=l?v:d;n=l?d:v;t.addEventListener("touchmove",y,!1);t.addEventListener("touchend",b,!1)}}function y(t){d=t.touches[0].pageX;v=t.touches[0].pageY;u=l?e-v:e-d;f=l?Math.abs(u)<Math.abs(d-n):Math.abs(u)<Math.abs(v-n);var s=500;if(!f||Number(new Date)-a>s){t.preventDefault();if(!p&&r.transitions){r.vars.animationLoop||(u/=r.currentSlide===0&&u<0||r.currentSlide===r.last&&u>0?Math.abs(u)/o+2:1);r.setProps(i+u,"setTouch")}}}function b(s){t.removeEventListener("touchmove",y,!1);if(r.animatingTo===r.currentSlide&&!f&&u!==null){var l=c?-u:u,h=l>0?r.getTarget("next"):r.getTarget("prev");r.canAdvance(h)&&(Number(new Date)-a<550&&Math.abs(l)>50||Math.abs(l)>o/2)?r.flexAnimate(h,r.vars.pauseOnAction):p||r.flexAnimate(r.currentSlide,r.vars.pauseOnAction,!0)}t.removeEventListener("touchend",b,!1);e=null;n=null;u=null;i=null}}else{t.style.msTouchAction="none";t._gesture=new MSGesture;t._gesture.target=t;t.addEventListener("MSPointerDown",w,!1);t._slider=r;t.addEventListener("MSGestureChange",E,!1);t.addEventListener("MSGestureEnd",S,!1);function w(e){e.stopPropagation();if(r.animating)e.preventDefault();else{r.pause();t._gesture.addPointer(e.pointerId);m=0;o=l?r.h:r.w;a=Number(new Date);i=h&&c&&r.animatingTo===r.last?0:h&&c?r.limit-(r.itemW+r.vars.itemMargin)*r.move*r.animatingTo:h&&r.currentSlide===r.last?r.limit:h?(r.itemW+r.vars.itemMargin)*r.move*r.currentSlide:c?(r.last-r.currentSlide+r.cloneOffset)*o:(r.currentSlide+r.cloneOffset)*o}}function E(e){e.stopPropagation();var n=e.target._slider;if(!n)return;var r=-e.translationX,s=-e.translationY;m+=l?s:r;u=m;f=l?Math.abs(m)<Math.abs(-r):Math.abs(m)<Math.abs(-s);if(e.detail===e.MSGESTURE_FLAG_INERTIA){setImmediate(function(){t._gesture.stop()});return}if(!f||Number(new Date)-a>500){e.preventDefault();if(!p&&n.transitions){n.vars.animationLoop||(u=m/(n.currentSlide===0&&m<0||n.currentSlide===n.last&&m>0?Math.abs(m)/o+2:1));n.setProps(i+u,"setTouch")}}}function S(t){t.stopPropagation();var r=t.target._slider;if(!r)return;if(r.animatingTo===r.currentSlide&&!f&&u!==null){var s=c?-u:u,l=s>0?r.getTarget("next"):r.getTarget("prev");r.canAdvance(l)&&(Number(new Date)-a<550&&Math.abs(s)>50||Math.abs(s)>o/2)?r.flexAnimate(l,r.vars.pauseOnAction):p||r.flexAnimate(r.currentSlide,r.vars.pauseOnAction,!0)}e=null;n=null;u=null;i=null;m=0}}},resize:function(){if(!r.animating&&r.is(":visible")){h||r.doMath();if(p)v.smoothHeight();else if(h){r.slides.width(r.computedW);r.update(r.pagingCount);r.setProps()}else if(l){r.viewport.height(r.h);r.setProps(r.h,"setTotal")}else{r.vars.smoothHeight&&v.smoothHeight();r.newSlides.width(r.computedW);r.setProps(r.computedW,"setTotal")}}},smoothHeight:function(e){if(!l||p){var t=p?r:r.viewport;e?t.animate({height:r.slides.eq(r.animatingTo).height()},e):t.height(r.slides.eq(r.animatingTo).height())}},sync:function(t){var n=e(r.vars.sync).data("flexslider"),i=r.animatingTo;switch(t){case"animate":n.flexAnimate(i,r.vars.pauseOnAction,!1,!0);break;case"play":!n.playing&&!n.asNav&&n.play();break;case"pause":n.pause()}},pauseInvisible:{visProp:null,init:function(){var e=["webkit","moz","ms","o"];if("hidden"in document)return"hidden";for(var t=0;t<e.length;t++)e[t]+"Hidden"in document&&(v.pauseInvisible.visProp=e[t]+"Hidden");if(v.pauseInvisible.visProp){var n=v.pauseInvisible.visProp.replace(/[H|h]idden/,"")+"visibilitychange";document.addEventListener(n,function(){v.pauseInvisible.isHidden()?r.startTimeout?clearTimeout(r.startTimeout):r.pause():r.started?r.play():r.vars.initDelay>0?setTimeout(r.play,r.vars.initDelay):r.play()})}},isHidden:function(){return document[v.pauseInvisible.visProp]||!1}},setToClearWatchedEvent:function(){clearTimeout(f);f=setTimeout(function(){a=""},3e3)}};r.flexAnimate=function(t,n,s,u,a){!r.vars.animationLoop&&t!==r.currentSlide&&(r.direction=t>r.currentSlide?"next":"prev");d&&r.pagingCount===1&&(r.direction=r.currentItem<t?"next":"prev");if(!r.animating&&(r.canAdvance(t,a)||s)&&r.is(":visible")){if(d&&u){var f=e(r.vars.asNavFor).data("flexslider");r.atEnd=t===0||t===r.count-1;f.flexAnimate(t,!0,!1,!0,a);r.direction=r.currentItem<t?"next":"prev";f.direction=r.direction;if(Math.ceil((t+1)/r.visible)-1===r.currentSlide||t===0){r.currentItem=t;r.slides.removeClass(i+"active-slide").eq(t).addClass(i+"active-slide");return!1}r.currentItem=t;r.slides.removeClass(i+"active-slide").eq(t).addClass(i+"active-slide");t=Math.floor(t/r.visible)}r.animating=!0;r.animatingTo=t;n&&r.pause();r.vars.before(r);r.syncExists&&!a&&v.sync("animate");r.vars.controlNav&&v.controlNav.active();h||r.slides.removeClass(i+"active-slide").eq(t).addClass(i+"active-slide");r.atEnd=t===0||t===r.last;r.vars.directionNav&&v.directionNav.update();if(t===r.last){r.vars.end(r);r.vars.animationLoop||r.pause()}if(!p){var m=l?r.slides.filter(":first").height():r.computedW,g,y,b;if(h){g=r.vars.itemMargin;b=(r.itemW+g)*r.move*r.animatingTo;y=b>r.limit&&r.visible!==1?r.limit:b}else r.currentSlide===0&&t===r.count-1&&r.vars.animationLoop&&r.direction!=="next"?y=c?(r.count+r.cloneOffset)*m:0:r.currentSlide===r.last&&t===0&&r.vars.animationLoop&&r.direction!=="prev"?y=c?0:(r.count+1)*m:y=c?(r.count-1-t+r.cloneOffset)*m:(t+r.cloneOffset)*m;r.setProps(y,"",r.vars.animationSpeed);if(r.transitions){if(!r.vars.animationLoop||!r.atEnd){r.animating=!1;r.currentSlide=r.animatingTo}r.container.unbind("webkitTransitionEnd transitionend");r.container.bind("webkitTransitionEnd transitionend",function(){r.wrapup(m)})}else r.container.animate(r.args,r.vars.animationSpeed,r.vars.easing,function(){r.wrapup(m)})}else if(!o){r.slides.eq(r.currentSlide).css({zIndex:1}).animate({opacity:0},r.vars.animationSpeed,r.vars.easing);r.slides.eq(t).css({zIndex:2}).animate({opacity:1},r.vars.animationSpeed,r.vars.easing,r.wrapup)}else{r.slides.eq(r.currentSlide).css({opacity:0,zIndex:1});r.slides.eq(t).css({opacity:1,zIndex:2});r.wrapup(m)}r.vars.smoothHeight&&v.smoothHeight(r.vars.animationSpeed)}};r.wrapup=function(e){!p&&!h&&(r.currentSlide===0&&r.animatingTo===r.last&&r.vars.animationLoop?r.setProps(e,"jumpEnd"):r.currentSlide===r.last&&r.animatingTo===0&&r.vars.animationLoop&&r.setProps(e,"jumpStart"));r.animating=!1;r.currentSlide=r.animatingTo;r.vars.after(r)};r.animateSlides=function(){!r.animating&&m&&r.flexAnimate(r.getTarget("next"))};r.pause=function(){clearInterval(r.animatedSlides);r.animatedSlides=null;r.playing=!1;r.vars.pausePlay&&v.pausePlay.update("play");r.syncExists&&v.sync("pause")};r.play=function(){r.playing&&clearInterval(r.animatedSlides);r.animatedSlides=r.animatedSlides||setInterval(r.animateSlides,r.vars.slideshowSpeed);r.started=r.playing=!0;r.vars.pausePlay&&v.pausePlay.update("pause");r.syncExists&&v.sync("play")};r.stop=function(){r.pause();r.stopped=!0};r.canAdvance=function(e,t){var n=d?r.pagingCount-1:r.last;return t?!0:d&&r.currentItem===r.count-1&&e===0&&r.direction==="prev"?!0:d&&r.currentItem===0&&e===r.pagingCount-1&&r.direction!=="next"?!1:e===r.currentSlide&&!d?!1:r.vars.animationLoop?!0:r.atEnd&&r.currentSlide===0&&e===n&&r.direction!=="next"?!1:r.atEnd&&r.currentSlide===n&&e===0&&r.direction==="next"?!1:!0};r.getTarget=function(e){r.direction=e;return e==="next"?r.currentSlide===r.last?0:r.currentSlide+1:r.currentSlide===0?r.last:r.currentSlide-1};r.setProps=function(e,t,n){var i=function(){var n=e?e:(r.itemW+r.vars.itemMargin)*r.move*r.animatingTo,i=function(){if(h)return t==="setTouch"?e:c&&r.animatingTo===r.last?0:c?r.limit-(r.itemW+r.vars.itemMargin)*r.move*r.animatingTo:r.animatingTo===r.last?r.limit:n;switch(t){case"setTotal":return c?(r.count-1-r.currentSlide+r.cloneOffset)*e:(r.currentSlide+r.cloneOffset)*e;case"setTouch":return c?e:e;case"jumpEnd":return c?e:r.count*e;case"jumpStart":return c?r.count*e:e;default:return e}}();return i*-1+"px"}();if(r.transitions){i=l?"translate3d(0,"+i+",0)":"translate3d("+i+",0,0)";n=n!==undefined?n/1e3+"s":"0s";r.container.css("-"+r.pfx+"-transition-duration",n)}r.args[r.prop]=i;(r.transitions||n===undefined)&&r.container.css(r.args)};r.setup=function(t){if(!p){var n,s;if(t==="init"){r.viewport=e('<div class="'+i+'viewport"></div>').css({overflow:"hidden",position:"relative"}).appendTo(r).append(r.container);r.cloneCount=0;r.cloneOffset=0;if(c){s=e.makeArray(r.slides).reverse();r.slides=e(s);r.container.empty().append(r.slides)}}if(r.vars.animationLoop&&!h){r.cloneCount=2;r.cloneOffset=1;t!=="init"&&r.container.find(".clone").remove();r.container.append(r.slides.first().clone().addClass("clone").attr("aria-hidden","true")).prepend(r.slides.last().clone().addClass("clone").attr("aria-hidden","true"))}r.newSlides=e(r.vars.selector,r);n=c?r.count-1-r.currentSlide+r.cloneOffset:r.currentSlide+r.cloneOffset;if(l&&!h){r.container.height((r.count+r.cloneCount)*200+"%").css("position","absolute").width("100%");setTimeout(function(){r.newSlides.css({display:"block"});r.doMath();r.viewport.height(r.h);r.setProps(n*r.h,"init")},t==="init"?100:0)}else{r.container.width((r.count+r.cloneCount)*200+"%");r.setProps(n*r.computedW,"init");setTimeout(function(){r.doMath();r.newSlides.css({width:r.computedW,"float":"left",display:"block"});r.vars.smoothHeight&&v.smoothHeight()},t==="init"?100:0)}}else{r.slides.css({width:"100%","float":"left",marginRight:"-100%",position:"relative"});t==="init"&&(o?r.slides.css({opacity:0,display:"block",webkitTransition:"opacity "+r.vars.animationSpeed/1e3+"s ease",zIndex:1}).eq(r.currentSlide).css({opacity:1,zIndex:2}):r.slides.css({opacity:0,display:"block",zIndex:1}).eq(r.currentSlide).css({zIndex:2}).animate({opacity:1},r.vars.animationSpeed,r.vars.easing));r.vars.smoothHeight&&v.smoothHeight()}h||r.slides.removeClass(i+"active-slide").eq(r.currentSlide).addClass(i+"active-slide")};r.doMath=function(){var e=r.slides.first(),t=r.vars.itemMargin,n=r.vars.minItems,i=r.vars.maxItems;r.w=r.viewport===undefined?r.width():r.viewport.width();r.h=e.height();r.boxPadding=e.outerWidth()-e.width();if(h){r.itemT=r.vars.itemWidth+t;r.minW=n?n*r.itemT:r.w;r.maxW=i?i*r.itemT-t:r.w;r.itemW=r.minW>r.w?(r.w-t*(n-1))/n:r.maxW<r.w?(r.w-t*(i-1))/i:r.vars.itemWidth>r.w?r.w:r.vars.itemWidth;r.visible=Math.floor(r.w/r.itemW);r.move=r.vars.move>0&&r.vars.move<r.visible?r.vars.move:r.visible;r.pagingCount=Math.ceil((r.count-r.visible)/r.move+1);r.last=r.pagingCount-1;r.limit=r.pagingCount===1?0:r.vars.itemWidth>r.w?r.itemW*(r.count-1)+t*(r.count-1):(r.itemW+t)*r.count-r.w-t}else{r.itemW=r.w;r.pagingCount=r.count;r.last=r.count-1}r.computedW=r.itemW-r.boxPadding};r.update=function(e,t){r.doMath();if(!h){e<r.currentSlide?r.currentSlide+=1:e<=r.currentSlide&&e!==0&&(r.currentSlide-=1);r.animatingTo=r.currentSlide}if(r.vars.controlNav&&!r.manualControls)if(t==="add"&&!h||r.pagingCount>r.controlNav.length)v.controlNav.update("add");else if(t==="remove"&&!h||r.pagingCount<r.controlNav.length){if(h&&r.currentSlide>r.last){r.currentSlide-=1;r.animatingTo-=1}v.controlNav.update("remove",r.last)}r.vars.directionNav&&v.directionNav.update()};r.addSlide=function(t,n){var i=e(t);r.count+=1;r.last=r.count-1;l&&c?n!==undefined?r.slides.eq(r.count-n).after(i):r.container.prepend(i):n!==undefined?r.slides.eq(n).before(i):r.container.append(i);r.update(n,"add");r.slides=e(r.vars.selector+":not(.clone)",r);r.setup();r.vars.added(r)};r.removeSlide=function(t){var n=isNaN(t)?r.slides.index(e(t)):t;r.count-=1;r.last=r.count-1;isNaN(t)?e(t,r.slides).remove():l&&c?r.slides.eq(r.last).remove():r.slides.eq(t).remove();r.doMath();r.update(n,"remove");r.slides=e(r.vars.selector+":not(.clone)",r);r.setup();r.vars.removed(r)};v.init()};e(window).blur(function(e){focused=!1}).focus(function(e){focused=!0});e.flexslider.defaults={namespace:"flex-",selector:".slides > li",animation:"fade",easing:"swing",direction:"horizontal",reverse:!1,animationLoop:!0,smoothHeight:!1,startAt:0,slideshow:!0,slideshowSpeed:7e3,animationSpeed:600,initDelay:0,randomize:!1,thumbCaptions:!1,pauseOnAction:!0,pauseOnHover:!1,pauseInvisible:!0,useCSS:!0,touch:!0,video:!1,controlNav:!0,directionNav:!0,prevText:"Previous",nextText:"Next",keyboard:!0,multipleKeyboard:!1,mousewheel:!1,pausePlay:!1,pauseText:"Pause",playText:"Play",controlsContainer:"",manualControls:"",sync:"",asNavFor:"",itemWidth:0,itemMargin:0,minItems:1,maxItems:0,move:0,allowOneSlide:!0,start:function(){},before:function(){},after:function(){},end:function(){},added:function(){},removed:function(){}};e.fn.flexslider=function(t){t===undefined&&(t={});if(typeof t=="object")return this.each(function(){var n=e(this),r=t.selector?t.selector:".slides > li",i=n.find(r);if(i.length===1&&t.allowOneSlide===!0||i.length===0){i.fadeIn(400);t.start&&t.start(n)}else n.data("flexslider")===undefined&&new e.flexslider(this,t)});var n=e(this).data("flexslider");switch(t){case"play":n.play();break;case"pause":n.pause();break;case"stop":n.stop();break;case"next":n.flexAnimate(n.getTarget("next"),!0);break;case"prev":case"previous":n.flexAnimate(n.getTarget("prev"),!0);break;default:typeof t=="number"&&n.flexAnimate(t,!0)}}})(jQuery);