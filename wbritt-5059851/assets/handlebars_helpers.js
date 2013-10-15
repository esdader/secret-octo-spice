Handlebars.registerHelper('makeClass', function(options) {
    return options.fn(this).split(' ').join('-').toLowerCase();
});

Handlebars.registerHelper('formatMoney', function(options) {
    return '$' + options.fn(this).slice(0, -2);
});

Handlebars.registerHelper('buildEarls', function(options){
    
    var out = '<li><a href="http://www.facebook.com/sharer/sharer.php?s=100&p[url]=';
    out += 'http://' + window.location.host + '/' + this.url;
    out += '&p[images][0]=' + this.featured_image.replace('\/\/', 'http://');
    out += '&p[title]=' + encodeURIComponent(this.title);
    out += '&p[summary]=' + encodeURIComponent(this.description.replace(/(<([^>]+)>)/ig,""));
    out += '" class="facebook ir" target="_blank" >Facebook</a></li>';

    out += '<li><a href="http://twitter.com/home?status=' + encodeURIComponent(this.title);
    out += '%0A' + 'http://' + window.location.host + '/' + this.url;
    out += '" class="twitter ir" target="_blank">Twitter</a></li>';

    out += '<li><a href="http://www.pinterest.com/pin/create/button/?url=';
    out += 'http://' + window.location.host + '/' + this.url;
    out += '&media=' + this.featured_image;
    out += '&description=' + encodeURIComponent(this.description.replace(/(<([^>]+)>)/ig,""));
    out += '" class="pinterest ir" target="_blank">Pinterest</a></li>';

    return out;
});

Handlebars.registerHelper('buildCarousel', function(options){
    var l = this.images.length,
        out,
        cl;

    if (l > 3) {
        out  = '<div class="product-options-images flexslider">';
        out += '<ul class="slides">';
        for (var i=0; i<l; i++) {
            if ((i % 3) === 0) {
                out += '<li>';
            }
            if (i !== 0) {
                cl = 'thmb-holder';
            } else {
                cl = 'thmb-holder active';
            }

            out += '<div class="' + cl + '">"';
            out += '<a href="' + this.images[i] + '" title="">';
            out += '<img src="' + this.images[i] + '" alt=""/>';
            out += '</a></div>';

            if (((i + 1) % 3) === 0 ) {
                out += '</li>'
            }

            if (i === (l - 1)) {
                if (((i + 1) % 3) !== 0) {
                    out += '</li>'
                }
            }
        }
        
        out += '</ul></div>';
        out += '<a href="#previous-slide" class="product-slider-prev ir">Previous</a>';
        out += '<a href="#next-slide" class="product-slider-next ir">Next</a>';

    } else {
        out  = '<ul class="product-options-images">';
        for (var i=0; i<l; i++) {
            out += '<li';
            if (i ===0 ) {
                out += ' class="active"';
            } 
            out += '><a href="' + this.images[i] + '" title="">';
            out += '<img src="' + this.images[i] + '" alt="" />';
            out += '</a></li>';    
        }
        out += '</ul>';
    }

    return out;
});