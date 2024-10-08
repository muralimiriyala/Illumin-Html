!(function (e) {
  var t = (window.SelectBox = function (e, t) {
    if (e instanceof jQuery) {
      if (!(e.length > 0)) return;
      e = e[0];
    }
    return (
      (this.typeTimer = null),
      (this.typeSearch = ""),
      (this.isMac = navigator.platform.match(/mac/i)),
      (t = "object" == typeof t ? t : {}),
      (this.selectElement = e),
      !(
        !t.mobile &&
        navigator.userAgent.match(/iPad|iPhone|Android|IEMobile|BlackBerry/i)
      ) &&
        "select" === e.tagName.toLowerCase() &&
        void this.init(t)
    );
  });
  (t.prototype.version = "1.2.0"),
    (t.prototype.init = function (t) {
      var s = e(this.selectElement);
      if (s.data("selectBox-control")) return !1;
      var o = e('<a class="selectBox" />'),
        a = s.attr("multiple") || parseInt(s.attr("size")) > 1,
        n = t || {},
        l = parseInt(s.prop("tabindex")) || 0,
        i = this;
      if (
        (o
          .width(s.outerWidth())
          .addClass(s.attr("class"))
          .attr("title", s.attr("title") || "")
          .attr("tabindex", l)
          .css("display", "inline-block")
          .bind("focus.selectBox", function () {
            this !== document.activeElement &&
              document.body !== document.activeElement &&
              e(document.activeElement).blur(),
              o.hasClass("selectBox-active") ||
                (o.addClass("selectBox-active"), s.trigger("focus"));
          })
          .bind("blur.selectBox", function () {
            o.hasClass("selectBox-active") &&
              (o.removeClass("selectBox-active"), s.trigger("blur"));
          }),
        e(window).data("selectBox-bindings") ||
          e(window)
            .data("selectBox-bindings", !0)
            .bind(
              "scroll.selectBox",
              n.hideOnWindowScroll ? this.hideMenus : e.noop,
            )
            .bind("resize.selectBox", this.hideMenus),
        s.attr("disabled") && o.addClass("selectBox-disabled"),
        s.bind("click.selectBox", function (e) {
          o.focus(), e.preventDefault();
        }),
        a)
      ) {
        if (
          ((t = this.getOptions("inline")),
          o
            .append(t)
            .data("selectBox-options", t)
            .addClass("selectBox-inline selectBox-menuShowing")
            .bind("keydown.selectBox", function (e) {
              i.handleKeyDown(e);
            })
            .bind("keypress.selectBox", function (e) {
              i.handleKeyPress(e);
            })
            .bind("mousedown.selectBox", function (t) {
              1 === t.which &&
                (e(t.target).is("A.selectBox-inline") && t.preventDefault(),
                o.hasClass("selectBox-focus") || o.focus());
            })
            .insertAfter(s),
          !s[0].style.height)
        ) {
          var c = s.attr("size") ? parseInt(s.attr("size")) : 5,
            r = o
              .clone()
              .removeAttr("id")
              .css({ position: "absolute", top: "-9999em" })
              .show()
              .appendTo("body");
          r.find(".selectBox-options").html("<li><a> </a></li>");
          var d = parseInt(
            r.find(".selectBox-options A:first").html("&nbsp;").outerHeight(),
          );
          r.remove(), o.height(d * c);
        }
        this.disableSelection(o);
      } else {
        var h = e('<span class="selectBox-label" />'),
          p = e('<span class="selectBox-arrow" />');
        h.attr("class", this.getLabelClass()).html(this.getLabelHtml()),
          (t = this.getOptions("dropdown")).appendTo("BODY"),
          o
            .data("selectBox-options", t)
            .addClass("selectBox-dropdown")
            .append(h)
            .append(p)
            .bind("mousedown.selectBox", function (e) {
              1 === e.which &&
                (o.hasClass("selectBox-menuShowing")
                  ? i.hideMenus()
                  : (e.stopPropagation(),
                    t
                      .data("selectBox-down-at-x", e.screenX)
                      .data("selectBox-down-at-y", e.screenY),
                    i.showMenu()));
            })
            .bind("keydown.selectBox", function (e) {
              i.handleKeyDown(e);
            })
            .bind("keypress.selectBox", function (e) {
              i.handleKeyPress(e);
            })
            .bind("open.selectBox", function (e, t) {
              (t && !0 === t._selectBox) || i.showMenu();
            })
            .bind("close.selectBox", function (e, t) {
              (t && !0 === t._selectBox) || i.hideMenus();
            })
            .insertAfter(s);
        var x =
          o.width() -
          p.outerWidth() -
          (parseInt(h.css("paddingLeft")) || 0) -
          (parseInt(h.css("paddingRight")) || 0);
        h.width(x), this.disableSelection(o);
      }
      s.addClass("selectBox")
        .data("selectBox-control", o)
        .data("selectBox-settings", n)
        .hide();
    }),
    (t.prototype.getOptions = function (t) {
      var s,
        o = e(this.selectElement),
        a = this,
        n = function (t, s) {
          return (
            t.children("OPTION, OPTGROUP").each(function () {
              if (e(this).is("OPTION"))
                e(this).length > 0
                  ? a.generateOptions(e(this), s)
                  : s.append("<li> </li>");
              else {
                var t = e('<li class="selectBox-optgroup" />');
                t.text(e(this).attr("label")), s.append(t), (s = n(e(this), s));
              }
            }),
            s
          );
        };
      switch (t) {
        case "inline":
          return (
            (s = e('<ul class="selectBox-options" />')),
            (s = n(o, s))
              .find("A")
              .bind("mouseover.selectBox", function (t) {
                a.addHover(e(this).parent());
              })
              .bind("mouseout.selectBox", function (t) {
                a.removeHover(e(this).parent());
              })
              .bind("mousedown.selectBox", function (e) {
                1 === e.which &&
                  (e.preventDefault(),
                  o.selectBox("control").hasClass("selectBox-active") ||
                    o.selectBox("control").focus());
              })
              .bind("mouseup.selectBox", function (t) {
                1 === t.which &&
                  (a.hideMenus(), a.selectOption(e(this).parent(), t));
              }),
            this.disableSelection(s),
            s
          );
        case "dropdown":
          (s = e('<ul class="selectBox-dropdown-menu selectBox-options" />')),
            (s = n(o, s))
              .data("selectBox-select", o)
              .css("display", "none")
              .appendTo("BODY")
              .find("A")
              .bind("mousedown.selectBox", function (t) {
                1 === t.which &&
                  (t.preventDefault(),
                  t.screenX === s.data("selectBox-down-at-x") &&
                    t.screenY === s.data("selectBox-down-at-y") &&
                    (s
                      .removeData("selectBox-down-at-x")
                      .removeData("selectBox-down-at-y"),
                    /android/i.test(navigator.userAgent.toLowerCase()) &&
                      /chrome/i.test(navigator.userAgent.toLowerCase()) &&
                      a.selectOption(e(this).parent()),
                    a.hideMenus()));
              })
              .bind("mouseup.selectBox", function (t) {
                1 === t.which &&
                  ((t.screenX === s.data("selectBox-down-at-x") &&
                    t.screenY === s.data("selectBox-down-at-y")) ||
                    (s
                      .removeData("selectBox-down-at-x")
                      .removeData("selectBox-down-at-y"),
                    a.selectOption(e(this).parent()),
                    a.hideMenus()));
              })
              .bind("mouseover.selectBox", function (t) {
                a.addHover(e(this).parent());
              })
              .bind("mouseout.selectBox", function (t) {
                a.removeHover(e(this).parent());
              });
          var l = o.attr("class") || "";
          if ("" !== l) {
            l = l.split(" ");
            for (var i = 0; i < l.length; i++)
              s.addClass(l[i] + "-selectBox-dropdown-menu");
          }
          return this.disableSelection(s), s;
      }
    }),
    (t.prototype.getLabelClass = function () {
      return (
        "selectBox-label " +
        (e(this.selectElement).find("OPTION:selected").attr("class") || "")
      ).replace(/\s+$/, "");
    }),
    (t.prototype.getLabelHtml = function () {
      var t = e(this.selectElement).find("OPTION:selected");
      return (
        (t.data("icon")
          ? '<i class="fa fa-' +
            t.data("icon") +
            ' fa-fw fa-lg"></i> ' +
            t.text()
          : t.text()) || " "
      );
    }),
    (t.prototype.setLabel = function () {
      var t = e(this.selectElement).data("selectBox-control");
      t &&
        t
          .find(".selectBox-label")
          .attr("class", this.getLabelClass())
          .html(this.getLabelHtml());
    }),
    (t.prototype.destroy = function () {
      var t = e(this.selectElement),
        s = t.data("selectBox-control");
      s &&
        (s.data("selectBox-options").remove(),
        s.remove(),
        t
          .removeClass("selectBox")
          .removeData("selectBox-control")
          .data("selectBox-control", null)
          .removeData("selectBox-settings")
          .data("selectBox-settings", null)
          .show());
    }),
    (t.prototype.refresh = function () {
      var t,
        s = e(this.selectElement).data("selectBox-control"),
        o = s.hasClass("selectBox-dropdown") ? "dropdown" : "inline";
      switch (
        (s.data("selectBox-options").remove(),
        (t = this.getOptions(o)),
        s.data("selectBox-options", t),
        o)
      ) {
        case "inline":
          s.append(t);
          break;
        case "dropdown":
          this.setLabel(), e("BODY").append(t);
      }
      "dropdown" === o &&
        s.hasClass("selectBox-menuShowing") &&
        this.showMenu();
    }),
    (t.prototype.showMenu = function () {
      var t = this,
        s = e(this.selectElement),
        o = s.data("selectBox-control"),
        a = s.data("selectBox-settings"),
        n = o.data("selectBox-options");
      if (o.hasClass("selectBox-disabled")) return !1;
      this.hideMenus();
      var l = parseInt(o.css("borderBottomWidth")) || 0,
        i = parseInt(o.css("borderTopWidth")) || 0,
        c = o.offset(),
        r = a.topPositionCorrelation ? a.topPositionCorrelation : 0,
        d = a.bottomPositionCorrelation ? a.bottomPositionCorrelation : 0,
        h = n.outerHeight(),
        p = o.outerHeight(),
        x = parseInt(n.css("max-height")),
        u = e(window).scrollTop(),
        f = c.top - u,
        B = e(window).height() - (f + p),
        m = f > B && (null == a.keepInViewport || a.keepInViewport),
        v = o.innerWidth() >= n.innerWidth() ? o.innerWidth() + "px" : "auto",
        g = m ? c.top - h + i + r : c.top + p - l - d;
      if (f < x && B < x)
        if (m) {
          var b = x - (f - 5);
          n.css({ "max-height": x - b + "px" }), (g += b);
        } else {
          b = x - (B - 5);
          n.css({ "max-height": x - b + "px" });
        }
      if (
        (n.data("posTop", m),
        n
          .width(v)
          .css({ top: g, left: o.offset().left })
          .addClass(
            "selectBox-options selectBox-options-" + (m ? "top" : "bottom"),
          ),
        a.styleClass && n.addClass(a.styleClass),
        s.triggerHandler("beforeopen"))
      )
        return !1;
      var w = function () {
        s.triggerHandler("open", { _selectBox: !0 });
      };
      switch (a.menuTransition) {
        case "fade":
          n.fadeIn(a.menuSpeed, w);
          break;
        case "slide":
          n.slideDown(a.menuSpeed, w);
          break;
        default:
          n.show(a.menuSpeed, w);
      }
      a.menuSpeed || w();
      var C = n.find(".selectBox-selected:first");
      this.keepOptionInView(C, !0),
        this.addHover(C),
        o.addClass(
          "selectBox-menuShowing selectBox-menuShowing-" +
            (m ? "top" : "bottom"),
        ),
        e(document).bind("mousedown.selectBox", function (s) {
          if (1 === s.which) {
            if (e(s.target).parents().andSelf().hasClass("selectBox-options"))
              return;
            t.hideMenus();
          }
        });
    }),
    (t.prototype.hideMenus = function () {
      0 !== e(".selectBox-dropdown-menu:visible").length &&
        (e(document).unbind("mousedown.selectBox"),
        e(".selectBox-dropdown-menu").each(function () {
          var t = e(this),
            s = t.data("selectBox-select"),
            o = s.data("selectBox-control"),
            a = s.data("selectBox-settings"),
            n = t.data("posTop");
          if (s.triggerHandler("beforeclose")) return !1;
          var l = function () {
            s.triggerHandler("close", { _selectBox: !0 });
          };
          if (a) {
            switch (a.menuTransition) {
              case "fade":
                t.fadeOut(a.menuSpeed, l);
                break;
              case "slide":
                t.slideUp(a.menuSpeed, l);
                break;
              default:
                t.hide(a.menuSpeed, l);
            }
            a.menuSpeed || l(),
              o.removeClass(
                "selectBox-menuShowing selectBox-menuShowing-" +
                  (n ? "top" : "bottom"),
              );
          } else
            e(this).hide(),
              e(this).triggerHandler("close", { _selectBox: !0 }),
              e(this).removeClass(
                "selectBox-menuShowing selectBox-menuShowing-" +
                  (n ? "top" : "bottom"),
              );
          t.css("max-height", ""),
            t.removeClass("selectBox-options-" + (n ? "top" : "bottom")),
            t.data("posTop", !1);
        }));
    }),
    (t.prototype.selectOption = function (t, s) {
      var o = e(this.selectElement);
      t = e(t);
      var a,
        n = o.data("selectBox-control");
      o.data("selectBox-settings");
      if (n.hasClass("selectBox-disabled")) return !1;
      if (0 === t.length || t.hasClass("selectBox-disabled")) return !1;
      o.attr("multiple")
        ? s.shiftKey && n.data("selectBox-last-selected")
          ? (t.toggleClass("selectBox-selected"),
            (a = (a =
              t.index() > n.data("selectBox-last-selected").index()
                ? t
                    .siblings()
                    .slice(n.data("selectBox-last-selected").index(), t.index())
                : t
                    .siblings()
                    .slice(
                      t.index(),
                      n.data("selectBox-last-selected").index(),
                    )).not(".selectBox-optgroup, .selectBox-disabled")),
            t.hasClass("selectBox-selected")
              ? a.addClass("selectBox-selected")
              : a.removeClass("selectBox-selected"))
          : (this.isMac && s.metaKey) || (!this.isMac && s.ctrlKey)
            ? t.toggleClass("selectBox-selected")
            : (t.siblings().removeClass("selectBox-selected"),
              t.addClass("selectBox-selected"))
        : (t.siblings().removeClass("selectBox-selected"),
          t.addClass("selectBox-selected"));
      n.hasClass("selectBox-dropdown") &&
        n.find(".selectBox-label").html(t.html());
      var l = 0,
        i = [];
      return (
        o.attr("multiple")
          ? n.find(".selectBox-selected A").each(function () {
              i[l++] = e(this).attr("rel");
            })
          : (i = t.find("A").attr("rel")),
        n.data("selectBox-last-selected", t),
        o.val() !== i && (o.val(i), this.setLabel(), o.trigger("change")),
        !0
      );
    }),
    (t.prototype.addHover = function (t) {
      (t = e(t)),
        e(this.selectElement)
          .data("selectBox-control")
          .data("selectBox-options")
          .find(".selectBox-hover")
          .removeClass("selectBox-hover"),
        t.addClass("selectBox-hover");
    }),
    (t.prototype.getSelectElement = function () {
      return this.selectElement;
    }),
    (t.prototype.removeHover = function (t) {
      (t = e(t)),
        e(this.selectElement)
          .data("selectBox-control")
          .data("selectBox-options")
          .find(".selectBox-hover")
          .removeClass("selectBox-hover");
    }),
    (t.prototype.keepOptionInView = function (t, s) {
      if (t && 0 !== t.length) {
        var o = e(this.selectElement).data("selectBox-control"),
          a = o.data("selectBox-options"),
          n = o.hasClass("selectBox-dropdown") ? a : a.parent(),
          l = parseInt(t.offset().top - n.position().top),
          i = parseInt(l + t.outerHeight());
        s
          ? n.scrollTop(
              t.offset().top - n.offset().top + n.scrollTop() - n.height() / 2,
            )
          : (l < 0 &&
              n.scrollTop(t.offset().top - n.offset().top + n.scrollTop()),
            i > n.height() &&
              n.scrollTop(
                t.offset().top +
                  t.outerHeight() -
                  n.offset().top +
                  n.scrollTop() -
                  n.height(),
              ));
      }
    }),
    (t.prototype.handleKeyDown = function (t) {
      var s = e(this.selectElement),
        o = s.data("selectBox-control"),
        a = o.data("selectBox-options"),
        n = s.data("selectBox-settings"),
        l = 0,
        i = 0;
      if (!o.hasClass("selectBox-disabled"))
        switch (t.keyCode) {
          case 8:
            t.preventDefault(), (this.typeSearch = "");
            break;
          case 9:
          case 27:
            this.hideMenus(), this.removeHover();
            break;
          case 13:
            o.hasClass("selectBox-menuShowing")
              ? (this.selectOption(a.find("LI.selectBox-hover:first"), t),
                o.hasClass("selectBox-dropdown") && this.hideMenus())
              : this.showMenu();
            break;
          case 38:
          case 37:
            if ((t.preventDefault(), o.hasClass("selectBox-menuShowing"))) {
              var c = a.find(".selectBox-hover").prev("LI");
              for (
                l = a.find("LI:not(.selectBox-optgroup)").length, i = 0;
                (0 === c.length ||
                  c.hasClass("selectBox-disabled") ||
                  c.hasClass("selectBox-optgroup")) &&
                (0 === (c = c.prev("LI")).length &&
                  (c = n.loopOptions ? a.find("LI:last") : a.find("LI:first")),
                !(++i >= l));

              );
              this.addHover(c),
                this.selectOption(c, t),
                this.keepOptionInView(c);
            } else this.showMenu();
            break;
          case 40:
          case 39:
            if ((t.preventDefault(), o.hasClass("selectBox-menuShowing"))) {
              var r = a.find(".selectBox-hover").next("LI");
              for (
                l = a.find("LI:not(.selectBox-optgroup)").length, i = 0;
                (0 === r.length ||
                  r.hasClass("selectBox-disabled") ||
                  r.hasClass("selectBox-optgroup")) &&
                (0 === (r = r.next("LI")).length &&
                  (r = n.loopOptions ? a.find("LI:first") : a.find("LI:last")),
                !(++i >= l));

              );
              this.addHover(r),
                this.selectOption(r, t),
                this.keepOptionInView(r);
            } else this.showMenu();
        }
    }),
    (t.prototype.handleKeyPress = function (t) {
      var s = e(this.selectElement).data("selectBox-control"),
        o = s.data("selectBox-options"),
        a = this;
      if (!s.hasClass("selectBox-disabled"))
        switch (t.keyCode) {
          case 9:
          case 27:
          case 13:
          case 38:
          case 37:
          case 40:
          case 39:
            break;
          default:
            s.hasClass("selectBox-menuShowing") || this.showMenu(),
              t.preventDefault(),
              clearTimeout(this.typeTimer),
              (this.typeSearch += String.fromCharCode(t.charCode || t.keyCode)),
              o.find("A").each(function () {
                if (
                  e(this)
                    .text()
                    .substr(0, a.typeSearch.length)
                    .toLowerCase() === a.typeSearch.toLowerCase()
                )
                  return (
                    a.addHover(e(this).parent()),
                    a.selectOption(e(this).parent(), t),
                    a.keepOptionInView(e(this).parent()),
                    !1
                  );
              }),
              (this.typeTimer = setTimeout(function () {
                a.typeSearch = "";
              }, 1e3));
        }
    }),
    (t.prototype.enable = function () {
      var t = e(this.selectElement);
      t.prop("disabled", !1);
      var s = t.data("selectBox-control");
      s && s.removeClass("selectBox-disabled");
    }),
    (t.prototype.disable = function () {
      var t = e(this.selectElement);
      t.prop("disabled", !0);
      var s = t.data("selectBox-control");
      s && s.addClass("selectBox-disabled");
    }),
    (t.prototype.setValue = function (t) {
      var s = e(this.selectElement);
      s.val(t),
        null === (t = s.val()) && ((t = s.children().first().val()), s.val(t));
      var o = s.data("selectBox-control");
      if (o) {
        var a = s.data("selectBox-settings"),
          n = o.data("selectBox-options");
        this.setLabel(),
          n.find(".selectBox-selected").removeClass("selectBox-selected"),
          n.find("A").each(function () {
            if ("object" == typeof t)
              for (var s = 0; s < t.length; s++)
                e(this).attr("rel") == t[s] &&
                  e(this).parent().addClass("selectBox-selected");
            else
              e(this).attr("rel") == t &&
                e(this).parent().addClass("selectBox-selected");
          }),
          a.change && a.change.call(s);
      }
    }),
    (t.prototype.disableSelection = function (t) {
      e(t)
        .css("MozUserSelect", "none")
        .bind("selectstart", function (e) {
          e.preventDefault();
        });
    }),
    (t.prototype.generateOptions = function (t, s) {
      var o = e("<li />"),
        a = e("<a />");
      o.addClass(t.attr("class")),
        o.data(t.data()),
        t.data("icon")
          ? a
              .attr("rel", t.val())
              .html(
                '<i class="fa fa-' +
                  t.data("icon") +
                  ' fa-fw fa-lg"></i> ' +
                  t.text(),
              )
          : a.attr("rel", t.val()).text(t.text()),
        o.append(a),
        t.attr("disabled") && o.addClass("selectBox-disabled"),
        t.attr("selected") && o.addClass("selectBox-selected"),
        s.append(o);
    }),
    e.extend(e.fn, {
      setOptions: function (t) {
        var s = e(this),
          o = s.data("selectBox-control");
        switch (typeof t) {
          case "string":
            s.html(t);
            break;
          case "object":
            for (var a in (s.html(""), t))
              if (null !== t[a])
                if ("object" == typeof t[a]) {
                  var n = e('<optgroup label="' + a + '" />');
                  for (var l in t[a])
                    n.append(
                      '<option value="' + l + '">' + t[a][l] + "</option>",
                    );
                  s.append(n);
                } else {
                  var i = e('<option value="' + a + '">' + t[a] + "</option>");
                  s.append(i);
                }
        }
        o && e(this).selectBox("refresh");
      },
      selectBox: function (s, o) {
        var a;
        switch (s) {
          case "control":
            return e(this).data("selectBox-control");
          case "settings":
            if (!o) return e(this).data("selectBox-settings");
            e(this).each(function () {
              e(this).data(
                "selectBox-settings",
                e.extend(!0, e(this).data("selectBox-settings"), o),
              );
            });
            break;
          case "options":
            if (void 0 === o)
              return e(this)
                .data("selectBox-control")
                .data("selectBox-options");
            e(this).each(function () {
              e(this).setOptions(o);
            });
            break;
          case "value":
            if (void 0 === o) return e(this).val();
            e(this).each(function () {
              (a = e(this).data("selectBox")) && a.setValue(o);
            });
            break;
          case "refresh":
            e(this).each(function () {
              (a = e(this).data("selectBox")) && a.refresh();
            });
            break;
          case "enable":
            e(this).each(function () {
              (a = e(this).data("selectBox")) && a.enable(this);
            });
            break;
          case "disable":
            e(this).each(function () {
              (a = e(this).data("selectBox")) && a.disable();
            });
            break;
          case "destroy":
            e(this).each(function () {
              (a = e(this).data("selectBox")) &&
                (a.destroy(), e(this).data("selectBox", null));
            });
            break;
          case "instance":
            return e(this).data("selectBox");
          default:
            e(this).each(function (o, a) {
              e(a).data("selectBox") || e(a).data("selectBox", new t(a, s));
            });
        }
        return e(this);
      },
    });
})(jQuery);
