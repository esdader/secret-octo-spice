!function(){var a=Handlebars.template,e=Handlebars.templates=Handlebars.templates||{};e["product.source"]=a(function(a,e,t,s,l){function n(a,e){var s;return(s=t.type)?s=s.call(a,{hash:{},data:e}):(s=a.type,s=typeof s===f?s.apply(a):s),m(s)}function r(a,e){var s;return(s=t.price)?s=s.call(a,{hash:{},data:e}):(s=a.price,s=typeof s===f?s.apply(a):s),m(s)}function i(a,e){var s;return(s=t.images)?s=s.call(a,{hash:{},data:e}):(s=a.images,s=typeof s===f?s.apply(a):s),m(s)}function c(a,e){var s;return(s=t.url)?s=s.call(a,{hash:{},data:e}):(s=a.url,s=typeof s===f?s.apply(a):s),m(s)}function o(a,e){var s;return(s=t.variants)?s=s.call(a,{hash:{},data:e}):(s=a.variants,s=typeof s===f?s.apply(a):s),m(s)}this.compilerInfo=[4,">= 1.0.0"],t=this.merge(t,a.helpers),l=l||{};var p,d,u,h="",f="function",m=this.escapeExpression,y=this,v=t.blockHelperMissing;return h+='<article class="product product-',u={hash:{},inverse:y.noop,fn:y.program(1,n,l),data:l},(p=t.makeClass)?p=p.call(e,u):(p=e.makeClass,p=typeof p===f?p.apply(e):p),t.makeClass||(p=v.call(e,p,u)),(p||0===p)&&(h+=p),h+='">\n    <section class="product-images">\n        <div class="product-main-image-con">\n            \n        </div>\n        <div class="magnify-btns-holder">\n            <a href="#increase-image-size" class="bigger-image-btn ir">Increase image size</a>\n            <a href="#decrease-image-size" class="smaller-image-btn ir">Decrease image size</a>\n        </div>\n    </section>\n    <section class="product-information">\n        <form action="/cart/add" method="post" enctype="multipart/form-data">\n        <div class="product-details">\n            <h1 class="product-title">',(p=t.title)?p=p.call(e,{hash:{},data:l}):(p=e.title,p=typeof p===f?p.apply(e):p),h+=m(p)+'</h1>\n            <h2 class="product-price">',u={hash:{},inverse:y.noop,fn:y.program(3,r,l),data:l},(p=t.formatMoney)?p=p.call(e,u):(p=e.formatMoney,p=typeof p===f?p.apply(e):p),t.formatMoney||(p=v.call(e,p,u)),(p||0===p)&&(h+=p),h+='</h2>\n            <h3 class="selected-material">\n                '+m((p=e.variants,p=null==p||p===!1?p:p[0],p=null==p||p===!1?p:p.title,typeof p===f?p.apply(e):p))+'\n            </h3>\n            <div class="product-description">\n                ',(d=t.description)?d=d.call(e,{hash:{},data:l}):(d=e.description,d=typeof d===f?d.apply(e):d),(d||0===d)&&(h+=d),h+='\n            </div>\n            <div class="product-options clearfix">\n                <h2 class="product-options-title">Select Material</h2>\n                ',u={hash:{},inverse:y.noop,fn:y.program(5,i,l),data:l},(d=t.buildCarousel)?d=d.call(e,u):(d=e.buildCarousel,d=typeof d===f?d.apply(e):d),t.buildCarousel||(d=v.call(e,d,u)),(d||0===d)&&(h+=d),h+='\n            </div>\n            <input type="submit" name="add" id="add" class="add-to-cart-btn" value="Add to cart">\n            <div class="social-share-con">\n               <a href="#open-share" class="social-share-btn">Share</a>\n                <ul class="social-share">\n                    ',u={hash:{},inverse:y.noop,fn:y.program(7,c,l),data:l},(d=t.buildEarls)?d=d.call(e,u):(d=e.buildEarls,d=typeof d===f?d.apply(e):d),t.buildEarls||(d=v.call(e,d,u)),(d||0===d)&&(h+=d),h+='\n                </ul> \n            </div>\n        </div>\n        <select id="product-select" name="id" class="hidden">\n            ',u={hash:{},inverse:y.noop,fn:y.program(9,o,l),data:l},(d=t.parseVariant)?d=d.call(e,u):(d=e.parseVariant,d=typeof d===f?d.apply(e):d),t.parseVariant||(d=v.call(e,d,u)),(d||0===d)&&(h+=d),h+='\n       </select>\n       </form>\n    </section>\n    <a href="#close" class="product-close-btn ir">Close Product</a>\n    <a href="#previous-product" class="product-prev-btn ir">Previous Product</a>\n    <a href="#next-product" class="product-next-btn ir">Next Product</a>\n</article>'})}();