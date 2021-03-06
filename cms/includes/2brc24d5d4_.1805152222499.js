require([
    "cookie", "jquery"
], function () {
    var n = $(".modal");
    if (!$.cookie("ComPop") && $("html").is(".no-flexbox")) {
        $.cookie("ComPop", !0, {
            expires: 1,
            path: "/"
        });
        n.addClass("show");
        $(".modal-btn").on("click", function () {
            n.remove()
        })
    } else 
        n.remove()
    
});
require([
    "jquery", "uri", "j/ui.mobile", "behaviors"
], function () {
    function r() {
        var i = $(".menu-btn"),
            t;
        i.on("click", function (t) {
            t.preventDefault();
            n($(this), "mm-open", bod)
        });
        t = $(".panel-btn");
        t.click(function (n) {
            n.preventDefault();
            var i = $(this);
            i.is(".open") ? t.removeClass("open") : (t.removeClass("open"), i.addClass("open"))
        });
        bod.addClass("mobile-ready")
    }
    function n(n, t, i, r, u) {
        i || (i = n);
        t || (t = "open");
        u ? (i.toggleClass(t), i.slidToggle(t), r && (r.toggleClass(t), r.slidToggle(t))) : (i.toggleClass(t), r && r.toggleClass(t))
    }
    function u(n) {
        var t = n.closest(".slider-box");
        t.find(".slider-panel").filter("[data-tab='" + n.data("tab") + "']").slideToggle(500);
        n.data("close") === !0 && t.find(".slider-btn").filter("[data-tab='" + n.data("tab") + "']").slideToggle(300)
    }
    function t(n) {
        var t = $(window).scrollTop(),
            f = t + $(window).height();
        for (i = 0; i < n.length; i ++) 
            if (! n.eq(i).is(".show")) {
                var r = n.eq(i).outerHeight(),
                    u = n.eq(i).offset().top,
                    e = u + n.eq(i).height();
                e - r * .3 <= f && u + r * .3 >= t && n.eq(i).addClass("show")
            }
        
    }
    bod = $("body");
    Behaviors.On();
    $.widget("cms.masthead", {
        options: {
            overlap: !1,
            speed: 200,
            scrollCount: 1
        },
        _create: function () {
            var n = new URI(window.location.href),
                i = n.Hash && n.Hash.split("#").pop(),
                t = $('a[name="' + i + '"]'),
                r = this,
                u = document.documentElement.clientWidth;
            if (this.transitionEvent = this._whichTransitionEvent(), this.scrollCount = this.element.find(".nav-bar").innerHeight() - 1, this.lastScroll = 0, !this.options.overlap) {
                this._setBuffer();
                setTimeout($.proxy(function () {
                    this._setBuffer();
                    i && t && t.length && setTimeout(this._checkAnchor.apply(this, [t]), 100)
                }, this), 500);
                $(window).onidle("resize", $.proxy(function () {
                    document.documentElement.clientWidth !== u && (u = document.documentElement.clientWidth, this._setBuffer())
                }, this), 250)
            }
            $(window).on("scroll", $.proxy(this._checkScroll, this));
            $('a[href*="#"]').on("click", function (t) {
                var i = $(t.target).is("a") ? t.target : t.currentTarget,
                    u = new URI(i.href),
                    e = u.Hash,
                    f = $('a[name="' + e + '"]');
                t.preventDefault();
                n.Path == u.Path && f.length ? r._checkAnchor.apply(r, [f]) : window.location = i.href
            })
        },
        _setBuffer: function () {
            this.buffer = this.element.innerHeight();
            $("main").css("padding-top", this.buffer)
        },
        _checkScroll: function () {
            var n = $(window).scrollTop();
            $("html").hasClass("anchors") || (n > this.scrollCount ? $("body").addClass("fixed") : $("body").removeClass("fixed"));
            this.lastScroll<n?$("html").addClass("down-scroll").removeClass("up-scroll"):this.lastScroll>n && $("html").removeClass("down-scroll").addClass("up-scroll");
            this.lastScroll = n
        },
        _checkAnchor: function (n) {
            var t = n.offset().top;
            t -= this.options.overlap ? this.element.innerHeight() : this.element.innerHeight() - this.buffer;
            this._runScroll.apply(this, [t])
        },
        _runScroll: function (n) {
            n < 500 && (this.options.speed = 100);
            $("html, body").animate({
                scrollTop: n
            }, this.options.speed, function () {
                $("html").removeClass("anchors")
            })
        },
        _whichTransitionEvent: function () {
            var n,
                i = document.createElement("fakeelement"),
                t = {
                    transition: "transitionend",
                    OTransition: "oTransitionEnd",
                    MozTransition: "transitionend",
                    WebkitTransition: "webkitTransitionEnd"
                };
            for (n in t) 
                if (i.style[n] !== undefined) 
                    return t[n]
                
            
        }
    });
    $.widget("cms.scrollingList", {
        options: {
            direction: "vertical",
            count: 1,
            scroll: "panel",
            breakpoints: {
                tabletLandscape: {
                    width: 1185,
                    count: 3
                },
                tabletPortrait: {
                    width: 785,
                    count: 2
                },
                mobile: {
                    width: 585,
                    count: 1
                },
                smallMobile: {
                    width: 385,
                    count: 1
                }
            },
            infinite: !0,
            nav: !1,
            video: !1,
            setHeights: !1,
            autoAdvance: !1
        },
        _create: function () {
            if (this.total = this.element.find("[data-role='item']").length, this.groups =
                { count: this._detectViewport(this.options.breakpoints, this.options.count, this.total)
            }, this.groups.count) 
                this.groups.total = Math.ceil(this.total / this.groups.count);
             else 
                return !1;
            
            setTimeout($.proxy(this._setup, this), 250);
            this.element.on("click", $.proxy(this._handleMouse, this));
            this.element.on("swipeleft swiperight", $.proxy(this._handleSwipe, this));
            this.options.nav && $.proxy(this._thumbNav(), this);
            this.options.autoAdvance && $.proxy(this._autoAdvance, this)
        },
        _setup: function () {
            this.container = this.element.find("[data-role='container']");
            this.list = this.container.find("[data-role='list']");
            this.items = this.container.find("[data-role='item']");
            $.proxy(this._setSizing(), this);
            this.options.infinite && this.list.clone().insertAfter(this.list);
            this.element.addClass("active start");
            this._index = 0;
            switch (this.options.scroll) {
                case "panel":
                    this.scroll = this.groups.count;
                    break;
                case "single":
                default:
                    this.scroll = 1
            }
        },
        _handleSwipe: function (n) {
            n.type !== "swipeleft" || this.element.is(".end") ? n.type !== "swiperight" || this.element.is(".start") || this._prev(!0) : this._next(!0)
        },
        _handleMouse: function (n) {
            var t = $(n.originalEvent.target),
                i;
            if (t.parents(".minus").length && (t = t.parents(".minus")), t.data("role") == "nav") {
                switch (t.data("direction")) {
                    case "next":
                        this._next();
                        break;
                    case "prev":
                        this._prev()
                }
                t.data("index") !== undefined && (i = t.is(".minus") ? t.data("index") - 1 : t.data("index"));
                i !== undefined && this._moveTo.apply(this, [i])
            }
        },
        _next: function (n) {
            index = n && this.options.scroll != "single" ? this.nav.find("span").filter(".active").next().data("index") : this._index + this.scroll;
            this._moveTo.apply(this, [index])
        },
        _prev: function (n) {
            index = n && this.options.scroll != "single" ? this.nav.find("span").filter(".active").prev().data("index") : this._index - this.scroll;
            this._moveTo.apply(this, [index])
        },
        _moveTo: function (n) {
            var t,
                r,
                i;
            n + this.groups.count >= this.total ? (i = n, n = this.total - this.groups.count, this.element.addClass("end").removeClass("start"), r =! 0) : n <= 0 ? (n = 0, this.element.addClass("start").removeClass("end")) : this.element.removeClass("start end");
            t = this.items.size * n * -1;
            Modernizr && Modernizr.csstransforms ? this.list.css("transform", this.styles.move + "(" + t + "%)") : this.list.css(this.styles.fallback, t + "%");
            this.options.nav && (i ? this.nav.find("span").removeClass("active").filter("[data-index='" + i + "']").addClass("active") : this.nav.find("span").removeClass("active").filter("[data-index='" + n + "']").addClass("active"));
            this._index = n
        },
        _thumbNav: function () {
            this.nav = this.element.find("nav[data-role='thumbs']");
            for (var n = 0; n < this.groups.total; n++) 
                this.nav.append('<span data-role="nav" data-index="' + n * this.groups.count + '">');
            
            this.nav.find("span").first().addClass("active")
        },
        _setSizing: function () {
            switch (this.options.direction) {
                case "vertical":
                    this.options.scroll == "panel" && (this.container.size = this._maxHeight(this.items, this.groups.count));
                    this.styles = {
                        prop: "height",
                        move: "translateY",
                        fallback: "margin-top"
                    };
                    break;
                case "horizontal":
                default:
                    this.container.size = this.container.innerWidth();
                    this.styles = {
                        prop: "width",
                        move: "translateX",
                        fallback: "margin-left"
                    }
            }
            this.list.size = ((this.container.size / this.groups.count * this.total - this.container.size) / this.container.size + 1) * 100;
            this.items.size = this.list.size / this.total / this.list.size * 100;
            this.groups.size = this.items.size * this.groups.count;
            this.options.direction == "vertical" && this.container.height(this.container.size);
            this.list.css(this.styles.prop, this.list.size + "%");
            this.items.css(this.styles.prop, this.items.size + "%")
        },
        _detectViewport: function (n, t, i) {
            var r = $(window).width();
            return r >= n.tabletLandscape.width && i > t ? t : r >= n.tabletPortrait.width && r <= n.tabletLandscape.width && i > n.tabletLandscape.count ? n.tabletLandscape.count : r >= n.mobile.width && r <= n.tabletPortrait.width && i > n.tabletPortrait.count ? n.tabletPortrait.count : r<=n.mobile.width&&r> = n.smallMobile.width && i > n.mobile.count ? n.mobile.count : r <= n.smallMobile.width && i > n.smallMobile.count ? n.smallMobile.count : !1
        },
        _maxHeight: function (n) {
            for (var i =[], t = 0; t < n.length; t++) 
                i.push(n.eq(t).outerHeight());
            
            return Math.max.apply(Math, i)
        }
    });
    $(document).ready(function () {
        var d,
            g,
            nt,
            s,
            h,
            c,
            o,
            l,
            f,
            a,
            v,
            w,
            y,
            tt,
            p,
            e,
            it,
            rt,
            ut,
            b,
            k;
        $("#HeaderZone").masthead();
        document.documentElement.clientWidth <= 985 && r();
        d = $(".search-btn");
        d.on("click", function () {
            n($(this), "search-open", $(this).closest(".site-search"))
        });
        g = $(".video-pop-btn");
        g.on("click", function () {
            var t = $(this).closest(".cta-box");
            t.find("object").length ? t.find(".video-pop").remove() : (t.is(".video-open") ? (clearTimeout(nt), t.find("video").get(0).pause()) : nt = setTimeout(function () {
                t.find("video").get(0).play()
            }, 500), n($(this), "video-open", $(this).closest(".cta-box")))
        });
        for (function (n) {
            typeof require == "function" ? require(["j/jquery"], n) : n(jQuery, window)
        }(function (n) {
            var t = n(".phone-mask");
            t.on("input", function () {
                if (this.value && this.value.match(/\d+/g)) {
                    if (this.value = this.value.match(/\d*/g).join("").replace(/(\d{0,3})(\d{0,3})(\d{0,4})/, "($1) $2-$3").replace(/-*$/g, "").substring(0, 14), this.value.length<=6){var n=this.value.indexOf(")");this.setSelectionRange(n, n)}}else this.value=""});t.trigger("input")}), s=$(".results-area"), s.find(".container").length?s.scrollingList({direction:"horizontal", count:3, scroll:"single", breakpoints:{tabletLandscape:{width:1285, count:2}, tabletPortrait:{width:785, count:2}, mobile:{width:535, count:1}, smallMobile:{width:385, count:1}}, nav:!0, autoAdvance:!1, infinite:!1}):s.remove(), h=$(".sub-results-area"), h.find(".container").length?h.scrollingList({direction:"horizontal", count:3, scroll:"single", breakpoints:{tabletLandscape:{width:1185, count:2}, tabletPortrait:{width:785, count:2}, mobile:{width:585, count:1}, smallMobile:{width:385, count:1}}, nav:!0, autoAdvance:!1, infinite:!1}):h.remove(), c=$(".side-results-area"), c.find(".container").length?c.scrollingList({direction:"horizontal", count:1, scroll:"single", breakpoints:{tabletLandscape:{width:1185, count:1}, tabletPortrait:{width:785, count:1}, mobile:{width:585, count:1}, smallMobile:{width:385, count:1}}, nav:!0, autoAdvance:!1, infinite:!1}):c.remove(), o=$(".panel-section .testimonial-list"), o.find(".container").length?o.scrollingList({direction:"horizontal", count:1, scroll:"single", breakpoints:{tabletLandscape:{width:1185, count:1}, tabletPortrait:{width:785, count:1}, mobile:{width:585, count:1}, smallMobile:{width:385, count:1}}, nav:!0, autoAdvance:!1, infinite:!1}):(o.closest(".panel-section").addClass("full-width"), o.remove()), l=$(".testimonial-area .testimonial-list"), l.find(".container").length?l.scrollingList({direction:"horizontal", count:1, scroll:"single", breakpoints:{tabletLandscape:{width:1185, count:1}, tabletPortrait:{width:785, count:1}, mobile:{width:585, count:1}, smallMobile:{width:385, count:1}}, nav:!0, autoAdvance:!1, infinite:!1}):l.remove(), f=$(".attorneys-area"), f.find(".container").children().length?f.scrollingList({direction:"horizontal", count:3, scroll:"single", breakpoints:{tabletLandscape:{width:1285, count:2}, tabletPortrait:{width:985, count:3}, mobile:{width:535, count:2}, smallMobile:{width:385, count:1}}, nav:!0, autoAdvance:!1, infinite:!1}):(f.addClass("single-atty"), f.find(".container").remove(), f.find(".scrolling-list-nav").remove()), a=$(".sub-attorneys-area"), a.find(".container").length?a.scrollingList({direction:"horizontal", count:5, scroll:"single", breakpoints:{tabletLandscape:{width:1285, count:4}, tabletPortrait:{width:785, count:3}, mobile:{width:535, count:2}, smallMobile:{width:385, count:1}}, nav:!0, autoAdvance:!1, infinite:!1}):a.remove(), v=$(".side-attorneys-area"), v.find(".container").length?v.scrollingList({direction:"horizontal", count:1, scroll:"single", breakpoints:{tabletLandscape:{width:1285, count:1}, tabletPortrait:{width:785, count:1}, mobile:{width:535, count:1}, smallMobile:{width:385, count:1}}, nav:!0, autoAdvance:!1, infinite:!1}):v.remove(), w=$(".awards-area"), w.length&&w.scrollingList({direction:"horizontal", count:5, scroll:"panel", breakpoints:{tabletLandscape:{width:1285, count:3}, tabletPortrait:{width:785, count:3}, mobile:{width:535, count:2}, smallMobile:{width:385, count:2}}, nav:!0, autoAdvance:!1, infinite:!1}), y=$(".single-cta"), i=0;i<y.length;i++)y.eq(i).children().length||y.eq(i).remove();tt=$(".collapsing-contact-area .slider-btn");tt.on("click", function(){u($(this))});document.documentElement.clientWidth<=785&&(p=$(".practices-area"), p.find(".container").length?p.scrollingList({direction:"horizontal", count:4, scroll:"single", breakpoints:{tabletLandscape:{width:1e3, count:3}, tabletPortrait:{width:785, count:2}, mobile:{width:535, count:1}, smallMobile:{width:385, count:1}}, nav:!0, autoAdvance:!1, infinite:!1}):p.remove());e={zones:$(".magic"), bP:785};e.zones.length&&(t(e.zones), setTimeout(t(e.zones), 2e3));it=$(".testimonial-system .testimonial-list").find(".more-btn");it.on("click", function(){n($(this), "test-expand", $(this).closest("li"), bod)});rt=$(".results-page-display .results-list").find(".more-btn");rt.on("click", function(){n($(this), "result-expand", $(this).closest("li"), bod)});$(document).ajaxComplete(function(){var t=$(".results-page-display .results-list").find(".more-btn");t.on("click", function(){n($(this), "result-expand", $(this).closest("li"), bod)})});ut=window.location.pathname;b=$(".side-nav");b.length&&b.find("a[href='"+ut+"']").parentsUntil("nav").filter("li").addClass("selected");k=$(".content-cta-list");k.find("li a").children().length||$("body").is(".cms-admin")||k.remove();$(".header-area .site-search input").on("keydown", function(n){if(n.which===13)return $(this).closest(".site-search").find("button").click(), !1});$(window).onidle("resize", function(){document.documentElement.clientWidth<985&&!bod.is(".mobile-ready")&&r()}, 150);$(window).onidle("scroll", function(){e.zones.length>0&&t(e.zones)}, 300)})});
require("form", function(){$("#Form_ContactPageDisplay").html5form()});
require(["jquery", "map"], function(){$(".imap").gmap({data:!0, map:{scrollwheel:!1}, zoom:16, ready:function(){var i, n=$(this).data(), u=n.latitude, f=n.longitude, e={lat:u, lng:f}, t=$(this).gmap("setPin", e, n.pin), r=t.getMap(), o="<div class='map-info'>"+n.address+"<br>"+n.city+", "+n.state+" "+n.zip+"<\/div>", s=new google.maps.InfoWindow({content:o});t.addListener("click", function(){s.open(r, t)});i=[{stylers:[{hue:"#70ACEA"}, {saturation:-30}, {lightness:20}]}];r.setOptions({styles:i})}})});
function _said_(n, t, i){if(n===undefined)return+$.cookie("_sa");_vaid_(t);$.cookie("_sa", n);_set6210(n, i)}function _vaid_(n){if(typeof localStorage=="undefined")return null;if(n===undefined)return localStorage._vid_;n>0&&(localStorage._vid_=n)}function _raid_(n, t, i, r, u, f, e, o, s, h, c, l, a, v){var nt, w, b, k, p, d, tt, it, g, y;if(n&&t){for(_said_(n, t, i), nt={expires:v}, w={SPPC:i, PPCAD:r, PPCEX:u, PPCCMP:f, SEOD:e, SEOK:o, PPCP1:s, PPCP2:h, PPCTR:c, L:l}, b=Object.keys(w), k=b.length;k--;)p=b[k], d=w[p], d?$.cookie(p, d, nt):$.removeCookie(p);if(window.Process&&(window.Process.Delayed(), s=_getPhoneNumber(), s!=a)){if(tt="sa.scorpiondesign.com", it="https:"==document.location.protocol?"1":"", g=(it?"https://":"http://")+tt+"/sa6.js?"+__said+", "+n+", "+a+", "+s, navigator.sendBeacon){navigator.sendBeacon(g);return}y=document.createElement("img");y.style.display="none";y.src="about:blank";document.body.appendChild(y);y.src=g}}}function _vvid_(n, t, i){var r, f=window.jwplayer, u=n&&document.getElementById(n);u&&u.nodeName&&/video/i.test(u.nodeName)?r=u:f&&(r=f(n));r&&t&&i&&(r.sa||(r.sa={}), r.sa.vvid=t, r.sa.vpid=i)}function _set6210(n, t){var i;n&&!__sd&&(t===undefined&&(t=$.cookie("SPPC")||""), t&&(i="#~"+_base6210(parseInt(n)), window.location.hash!=i&&(window.history&&window.history.replaceState?(window.location.search&&window.location.search.indexOf("SPPC=")>0&&(i=window.location.pathname+i), window.history.replaceState(undefined, undefined, i)):window.location.replace&&window.location.replace(i))))}function _getPhoneNumber(){var i, n, f, r, u, t;for(i=document.getElementsByTagName("a"), n=0, f=i.length;n<f;n++)if(r=i[n].getAttribute("href"), u=r&&/^tel:(.+)$/.exec(r), u&&(t=u[1].replace(/\D+/g, ""), t&&t.length>=10))return t;return""}function _base6210(n){var t, u, e, o, i=1, r=!0, s=[], f;if(typeof n=="number"){if(isNaN(n))return undefined;for(t=n;t> 0;) 
                        u = r ? i * 62 : i * 10,
                        r = ! r,
                        e = t % u,
                        o = _toDigit62(e / i),
                        s.push(o),
                        t -= e,
                        i = u;
                    
                    return s.join("")
                }
                if (typeof n == "string") {
                    if (! n) 
                        return 0;
                    
                    for (t = 0, f = 0; f < n.length; f++) 
                        u = _fromDigit62(n, f),
                        t += u * i,
                        i *= r ? 62 : 10,
                        r = ! r;
                    
                    return t
                }
                return undefined
            }
            function _toDigit62(n) {
                return n < 10 ? String.fromCharCode(n + 48) : n < 36 ? String.fromCharCode(n + 55) : String.fromCharCode(n + 61)
            }
            function _fromDigit62(n, t) {
                var i = n.charCodeAt(t);
                return i < 58 ? i - 48 : i < 91 ? i - 55 : i - 61
            }
            window.registerLoading && registerLoading("sa");
            __said = document.documentElement.getAttribute("data-sa");
            __sd = !!document.documentElement.getAttribute("data-sd");
            require([
                "jquery", "cookie"
            ], function () {
                function ft() {
                    for (var n, u =
                        {}, r =[], t = document.getElementsByClassName ? document.getElementsByClassName("ui-track-version") : $(".ui-track-version"), i = t.length; i--;) 
                        n = t[i].getAttribute("id"),
                        n && ! u[n] && (u[n] =! 0, r.push(n));
                    
                    return r.length ? encodeURIComponent(r.join("|")) : ""
                }
                if (__said && !/google|bing|yahoo|spider|crawl|monitor|site24|bots\b|bot\b/i.test(window.navigator.userAgent || "")) {
                    var n,
                        e,
                        d,
                        o,
                        i,
                        s,
                        h,
                        c,
                        l,
                        g,
                        nt,
                        tt,
                        it,
                        rt,
                        ut,
                        w,
                        f,
                        a,
                        t,
                        b,
                        v = $.cookie("SPPC") || "",
                        r = "sa.scorpiondesign.com",
                        y = _said_() || 0,
                        p = "https:" == document.location.protocol ? "1" : "",
                        k = _getPhoneNumber(),
                        u = document.createElement("script");
                    u.type = "text/javascript";
                    u.async = !0;
                    n = $.cookie("L") || "0";
                    e = ft() || "0";
                    ! v && !__sd && window.location.hash && window.location.hash[1] === "~" && (d = _base6210(window.location.hash.substr(2))) > 0 ? ($.cookie("SPPC", "true"), o = window.innerWidth || document.documentElement.offsetWidth || document.body.offsetWidth || 0, i = new Date, s = new Date(i.getFullYear(), 0, 1), h = new Date(i.getFullYear(), 6, 1), c = Math.max(s.getTimezoneOffset(), h.getTimezoneOffset()) / 60, l = _vaid_() || 0, u.src =( p ? "https://" : "http://") + r + "/sa4.js?" + __said + "," + y + "," + l + "," + d + "," + o + "," + c + "," + k + "," + encodeURIComponent(window.location.href) + "," + n + "," + e) : y ? (u.src =( p ? "https://" : "http://") + r + "/sa2.js?" + __said + "," + y + "," + k + "," + encodeURIComponent(window.location.href) + "," + n + "," + e, (v || !__sd) && _set6210(y, v), window.Process && window.Process.Delayed()) : (g = $.cookie("SEOD") || "", nt = $.cookie("SEOK") || "", o = window.innerWidth || document.documentElement.offsetWidth || document.body.offsetWidth || 0, i = new Date, s = new Date(i.getFullYear(), 0, 1), h = new Date(i.getFullYear(), 6, 1), c = Math.max(s.getTimezoneOffset(), h.getTimezoneOffset()) / 60, l = _vaid_() || "", tt = $.cookie("PPCAD") || "", it = $.cookie("PPCEX") || "", rt = $.cookie("PPCCMP") || "", ut = __said + "," + p + "," + v + "," + g + "," + encodeURIComponent(nt) + "," + o + "," + c + "," + k + "," + encodeURIComponent(window.location.href) + "," + l + "," + tt + "," + it + "," + rt + "," + n + "," + e, u.src =( p ? "https://" : "http://") + r + "/sa.js?" + ut, window.Process && window.Process.Delayed());
                    w = document.getElementsByTagName("script")[0];
                    w.parentNode.insertBefore(u, w);
                    f = function (n) {
                        return n && $.trim(n) ? "." + $.trim(n).replace(/ +/g, ".") : ""
                    };
                    a = function () {
                        return undefined
                    };
                    t = !1;
                    b = function (i) {
                        var h,
                            b,
                            s,
                            g,
                            nt,
                            tt,
                            it,
                            rt,
                            ut,
                            ft,
                            k,
                            e = $(i.target || i.srcElement),
                            c = e[0].nodeName.toLowerCase(),
                            p = e.closest("button"),
                            w = p.closest("form"),
                            ot = w.attr("method") === "post" ? "1" : "",
                            et = w.attr("action"),
                            d = et && w.data("search") && w.find("input:text:visible").val(),
                            u = e.closest("a[href]"),
                            y = u.attr("href"),
                            l = e.attr("id"),
                            v = f(e.attr("class")),
                            o = [];
                        if ($.isFunction(a) && (d = a(i) || d), p.length ? (e = p, c = "button", l = p.attr("id"), v = f(e.attr("class")), y = et) : u.length && (e = u, c = "a", l = u.attr("id"), v = f(e.attr("class"))), l ? o.push("#" + l) : (e.parents("[id],[class],li").filter(":not(body,html)").each(function () {
                            var n = $(this),
                                t = (n[0].nodeName || "").toLowerCase(),
                                i = n.attr("id"),
                                r = f(n.attr("class"));
                            if (i) 
                                return o.unshift("#" + i),
                                !1;
                            
                            r ? o.unshift(t + r) : o.unshift(t)
                        }), h = $(o.join(" ")), h.length > 1 && (s = -1, h.each(function (n) {
                            var t = $(this).find(c + v);
                            if (t.index(e) >= 0) 
                                return s = n,
                                !1
                            
                        }), s >= 0 && (o[o.length - 1] += ":eq(" + s + ")", h = h.eq(s))), b = h.find(c + v), b.length === 1 ? o.push(c + v) : (s = b.index(e), s >= 0 && o.push(c + v + ":eq(" + s + ")"))), l = _said_(), g = "https:" == document.location.protocol ? "1" : "", nt = encodeURIComponent(o.join(" ")), tt = window.innerWidth || document.documentElement.offsetWidth || document.body.offsetWidth || 0, it = window.innerHeight || document.documentElement.offsetHeight || document.body.offsetHeight || 0, rt = Math.max(document.documentElement.scrollTop, document.body.scrollTop), ut = i.pageX || i.clientX || 0, ft = i.pageY || i.clientY || 0, k =( g ? "https://" : "http://") + r + "/sa3.js?" + __said + "," + l + "," + nt + "," + tt + "," + it + "," + rt + "," + ut + "," + ft + "," + encodeURIComponent(y || "") + "," + ot + "," + encodeURIComponent(d || "") + "," + n, navigator.sendBeacon) {
                            navigator.sendBeacon(k);
                            return
                        }
                        if (t || (t = document.createElement("img"), t.style.display = "none", t.src = "about:blank", document.body.appendChild(t)), t.src = k, u.length && y && ! i.shiftKey && ! i.ctrlKey && y.indexOf("javascript:") != 0 && y.indexOf("#") != 0 && (u.attr("target") || "_self") === "_self") {
                            i.stopPropagation ? (i.stopPropagation(), i.stopImmediatePropagation(), i.preventDefault()) : i.returnValue = !1;
                            u.one("click", function (n) {
                                n.stopPropagation()
                            });
                            return u = u[0],
                            setTimeout(function () {
                                u && u.click && u.click();
                                u = null
                            }, 100),
                            !1
                        }
                    };
                    document.addEventListener ? document.addEventListener("click", b, !1) : document.attachEvent && document.attachEvent("onclick", b);
                    window._sa_overrideSearch = function (n) {
                        a = n
                    };
                    window._sa_videoStart = function (t, i, u, f, e, o) {
                        var s,
                            h,
                            c;
                        if (u.substring(0, 11) == "/cms/video/") {
                            $.ajax({
                                url: u,
                                dataType: "xml",
                                success: function (n) {
                                    var u,
                                        r;
                                    if ($("video[src]", n).each(function () {
                                        var n = $(this),
                                            t = n.attr("src");
                                        if (n.attr("width")) 
                                            u = t;
                                         else if (! r) 
                                            return r = t,
                                            !1
                                        
                                    }), r = r || u, r) {
                                        if (r = r.replace(/^(\w+:)?\d+\//, "/"), r.substring(0, 11) == "/cms/video/") 
                                            return
                                        
                                    } else 
                                        return;
                                    
                                    window._sa_videoStart(t, i, r, f, e, o)
                                }
                            });
                            return
                        }
                        s = document.createElement("script");
                        h = _said_();
                        c = "https:" == document.location.protocol ? "1" : "";
                        s.type = "text/javascript";
                        s.async = !0;
                        s.src = "about:blank";
                        s.src = (c ? "https://" : "http://") + r + "/va.js?" + __said + "," + h + "," + t + "," + encodeURIComponent(u || "") + "," + f + "," + e + "," + i + "," + o + "," + n;
                        (document.head || document.body).appendChild(s)
                    };
                    window._sa_videoPlay = function (t, i, u, f) {
                        var o = "https:" == document.location.protocol ? "1" : "",
                            e = (o ? "https://" : "http://") + r + "/va2.js?" + __said + "," + t + "," + i + "," + u + "," + f + "," + n;
                        if (navigator.sendBeacon) {
                            navigator.sendBeacon(e);
                            return
                        }
                        va_play || (va_play = document.createElement("img"), va_play.style.display = "none", va_play.src = "about:blank", document.body.appendChild(va_play));
                        va_play.src = e
                    };
                    window.register && window.register("sa")
                }
            });
