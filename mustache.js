var Mustache = {
  name: "mustache.js",
  version: "0.1",
  debug: !0,
  stack: " ",
  context: {},
  to_html: function (t, e) {
    return this.render(t, e);
  },
  render: function (t, e) {
    if (((this.stack = this.stack + " "), -1 == t.indexOf("{{"))) return t;
    this.context = context = this.merge(this.context || {}, e);
    var r = this.render_section(t);
    return (this.context = context), this.render_tags(r);
  },
  render_partial: function (name) {
    var evil_name = eval(name);
    switch (typeof evil_name) {
      case "string":
        return this.to_html(evil_name, "");
      case "object":
        var tpl = name + "_template";
        return this.to_html(eval(tpl), evil_name);
      default:
        throw "Unknown partial type.";
    }
  },
  merge: function (t, e) {
    for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
    return t;
  },
  render_section: function (t) {
    if (-1 == t.indexOf("{{#")) return t;
    var e = this;
    return t.replace(
      /\{\{\#(.+)\}\}\s*([\s\S]+)\{\{\/\1\}\}\s*/gm,
      function (t, r, n) {
        var i = e.find(r);
        return e.is_array(i)
          ? i
              .map(function (t) {
                return e.render(n, t);
              })
              .join("")
          : i
          ? e.render(n)
          : "";
      }
    );
  },
  is_array: function (t) {
    return t && "object" == typeof t && t.constructor === Array;
  },
  render_tags: function (t) {
    var e = this;
    return t.replace(
      /\{\{(!|<|\{)?([^\/#]+?)\1?\}\}+/gm,
      function (t, r, n) {
        switch (r) {
          case "!":
            return t;
          case "<":
            return e.render_partial(n);
          case "{":
            return e.find(n);
          default:
            return e.escape(e.find(n));
        }
      },
      this
    );
  },
  escape: function (t) {
    return t.toString().replace(/[&"<>\\]/g, function (t) {
      switch (t) {
        case "&":
          return "&amp;";
        case "\\":
          return "\\\\";
        case '"':
          return '"';
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        default:
          return t;
      }
    });
  },
  find: function (t) {
    t = this.trim(t);
    var e = this.context;
    if ("function" == typeof e[t]) return e[t].apply(e);
    if (void 0 !== e[t]) return e[t];
    throw "Can't find " + t + " in " + e;
  },
  trim: function (t) {
    return t.replace(/^\s*|\s*$/g, "");
  },
};
