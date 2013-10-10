Handlebars.registerHelper('makeClass', function(options) {
    return options.fn(this).split(' ').join('-').toLowerCase();
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

            out += '<div class="' + cl + '">';
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
            if (i === 0) {
                out += '<li class="active"><a href="' + this.images[i] + '" title="">';    
            } else {
                out += '<li><a href="' + this.images[i] + '" title="">';     
            }
            out += '<img src="' + this.images[i] + '" alt="" />';
            out += '</a></li>';    
        }
        out += '</ul>';
    }

    return out;
});