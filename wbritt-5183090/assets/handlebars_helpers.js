Handlebars.registerHelper('makeClass', function(options) {
    return options.fn(this).split(' ').join('-').toLowerCase();
});

Handlebars.registerHelper('formatMoney', function(options) {
    return '$' + options.fn(this).slice(0, -2);
});

Handlebars.registerHelper('parseVariant', function(){
    var v = this.variants,
        vl = this.variants.length, 
        l = this.options.length,
        out = '',
        useSize = false,
        sizePos,
        materialPos,
        i;



    

    // check to see if there is a size option
    if (l > 1) {
        for(i=0; i<l; i++){
            // checking size position
            if (this.options[i].name.toLowerCase() === 'size') {
                sizePos = this.options[i].position;
                useSize = true;
            }
        }

        if (sizePos === 1) {
            materialPos = 2;
        } else {
            materialPos = 1;
        }
    } else {
        materialPos = 1;
    }

    // create options

    for(i=0; i<vl; i++) {
        out += '<option value="' + v[i].id + '" class="';
        var matClass = v[i]['option' + materialPos].split(' ').join('-').toLowerCase();
        matClass = matClass.replace('/', '-');
        out += matClass + '" data-title="' + v[i]['option' + materialPos ] + '"';
        out += ' data-price="' + v[i].price.toString().slice(0, -2) + '"';
        out += ' data-available="' + v[i].available + '"';
        out += ' data-qty="' + v[i].inventory_quantity + '"';
        if(useSize === true) out += 'data-size="' + v[i]['option' + sizePos ] + '"';
        out += '>' + v[i].title + ' - $' + v[i].price.toString().slice(0, -2) + '</option>';
    }

    return out;
    
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
    var variPattern = /(?:_vari?_)([0-9])*(?:.)*(?:\.(?:gif|jpg|jpeg|tiff|png))/,
        altPattern  = /(?:_vari?_)([0-9])*(?:_alt)(?:.)*(?:\.(?:gif|jpg|jpeg|tiff|png))/,
        out,
        cl,
        variImages,
        altImages;

    variImages = $.map(this.images, function(n, i){
        var f = n.match(variPattern);
        if (f) return n;
    });

    altImages = $.map(this.images, function(n, i){
        var f = n.match(altPattern);
        if (f) return n;
    });

    // process all variant images
    var l = variImages.length,
        imgEarl;

    // resize image function
    // based on shopify ajax api
    resizeImage = function(image, size) {
      try {
        if(size == 'original') { return image; }
        else {      
          var matches = image.match(/(.*\/[\w\-\_\.]+)\.(\w{2,4})/);
          return matches[1] + '_' + size + '.' + matches[2];
        }    
      } catch (e) { return image; }
    };

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
            imgEarl = resizeImage(variImages[i], 'small');
            out += '<a href="' + variImages[i] + '" title="">';
            out += '<img src="' + imgEarl + '" alt=""/>';
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
        if (l > 0) {
            for (var i=0; i<l; i++) {
                out += '<li';
                if (i ===0 ) {
                    out += ' class="active"';
                } 
                imgEarl = resizeImage(variImages[i], 'small');
                out += '><a href="' + variImages[i] + '" title="">';
                out += '<img src="' + imgEarl + '" alt="" />';
                out += '</a></li>';    
            }
        } else {
            if (this.images.length < 3) {
                l = this.images.length;
            } else {
                l = 3;
            }

            for (var i=0; i<l; i++) {
                out += '<li';
                if (i ===0 ) {
                    out += ' class="active"';
                }
                imgEarl = resizeImage(this.images[i], 'small'); 
                out += '><a href="' + this.images[i] + '" title="">';
                out += '<img src="' + imgEarl + '" alt="" />';
                out += '</a></li>';    
            }
        }
        out += '</ul>';
    }

    // add sizes if needed

    l = this.options.length;

    if (l > 1) {
        out += '<div class="product-sizes-con">';
        out += '<span class="product-sizes-title">Select a size</span> <ul class="product-sizes"></ul></div>';
    }
    // process all alternative product views

    l = altImages.length;

    if (l > 0) {
        out += '<div class="alternative-images hidden">';
        for (i = 0; i<l; i++) {
            out += '<img src="' + altImages[i] + '" alt=""/>';
        }
        out += '</div>';    
    }

    return out;
});