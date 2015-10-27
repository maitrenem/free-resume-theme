var chartSize = 120;

$( document ).ready(function(){
    var $body = $('body');
    var $html = $('html');

    //change bidirectional settings
    var changeBidi = function(direction, $this) {
        $html.attr('dir', direction);

        $('[data-bidi]').removeClass('active');
        $this.addClass('active');
    };

    //change layout function
    var changeLayout = function(layout, $this) {

        if(layout == 'boxed') {
            $body.addClass('cv-boxed');
        } else {
            $body.removeClass('cv-boxed');
        }

        $('[data-layout]').removeClass('active');
        $this.addClass('active');

    };

    //change theme function
    var changeTheme = function(themeClass, $this) {
        $body.removeClass (function (index, css) {
            return (css.match (/(^|\s)theme-\S+/g) || []).join(' ');
        });

        $body.addClass(themeClass);

        $('[data-theme]').removeClass('active');
        $this.addClass('active');

        changeChartsColor();
    };

    //change background function
    var changeBackground = function(backgroundClass, $this) {
        $body.removeClass (function (index, css) {
            return (css.match (/(^|\s)background-\S+/g) || []).join(' ');
        });

        $body.addClass(backgroundClass);

        $('[data-background]').removeClass('active');
        $this.addClass('active');
    };

    //textarea autosize
    $('textarea').autosize({
        append: ''
    });

    //change color
    $body.on('click', '[data-theme]', function(e){
        var themeClass = $(this).attr('data-theme');

        changeTheme(themeClass, $(this));

        e.preventDefault();
        return false;
    });

    //change layout
    $body.on('click', '[data-layout]', function(e){
        var layout = $(this).attr('data-layout');

        changeLayout(layout, $(this));

        e.preventDefault();
        return false;
    });

    //change background
    $body.on('click', '[data-background]', function(e){
        var backgroundClass = $(this).attr('data-background');

        changeBackground(backgroundClass, $(this));

        e.preventDefault();
        return false;
    });

    //change bidi
    $body.on('click', '[data-bidi]', function(e){
        var direction = $(this).attr('data-bidi');

        changeBidi(direction, $(this));

        e.preventDefault();
        return false;
    });

    //print current document
    $body.on('click', '.cv-print-button', function(e){
        window.print();

        e.preventDefault();
        return false;
    });

    $body.on('click', '.theme-settings-button', function(){
        $('.theme-settings').toggleClass('open');

        e.preventDefault();
        return false;
    });

    $body.on('keydown', function(e){
        if(e.keyCode == 27) {
            $('.theme-settings').removeClass('open');
        }
    });


    /**
     * Charts
     */

    //get all CV charts
    var $charts = $('canvas[data-percentage]');
    var chartsList = [];

    //set width and height (required by browsers)
    $charts.attr({
        width: chartSize,
        height: chartSize
    });

    //change charts color
    var changeChartsColor = function(){
        $.each(chartsList, function(i, chart){
            chart.segments[0].fillColor = getChartColor(chart.chart.canvas);
            chart.update();
        });
    };

    //get chart color
    var getChartColor = function(chart) {
        var style = window.getComputedStyle(chart);
        return style.color || '#999';
    };

    //on each chart
    $.each($charts, function(i, chart){
        //get percentage value
        var percentage = parseInt($(chart).attr('data-percentage'));

        //and create pie chart
        var ch = new Chart(chart.getContext('2d')).Pie([
            {
                value: percentage,
                color: getChartColor(chart)
            },
            {
                value: 100 - percentage,
                color: "transparent"
            }
        ], {
            //additional options
            percentageInnerCutout: 90,
            showTooltips: false,
            animation: false
        });

        chartsList.push(ch);
    });


    // portfolio zoom
    $('.image-link').magnificPopup({
        type: 'image',
        gallery: {
            enabled: true
        },
        zoom: {
            enabled: true,
            duration: 300 // don't foget to change the duration also in CSS
        }
    });



    /*
    * Contact form animation
     */
    var isContactOpen = false,
        isContactAnimating = false,
        contactOpenClass = 'cv-contact--open',
        $contactWrap = $('.cv-contact'),
        $contactMorph = $('.cv-contact-morph'),
        $contactMorphSvg = $contactMorph.find('>svg')

    var s = Snap( $contactMorphSvg.get(0) );
    var pathEl = s.select( 'path' );
    var paths = {
        reset : pathEl.attr( 'd' ),
        active : $contactMorph.attr( 'data-morph-active' )
    };

    //contact button click szmygurygu
    $body.on('click', '.cv-contact-button', function(e){
        if( isContactAnimating )
            return false;

        isContactAnimating = true;

        if(! isContactOpen) {
            $contactWrap.addClass(contactOpenClass);

            pathEl.stop().animate( {
                'path': paths.active
            }, 500, mina.easein, function() {
                isContactAnimating = false;
            });
        } else {
            $contactWrap.removeClass(contactOpenClass);

            setTimeout( function() {
                // reset path
                pathEl.attr( 'd', paths.reset );
                isContactAnimating = false;
            }, 500 );
        }

        isContactOpen = !isContactOpen;

        e.preventDefault();
        return false;
    });

});