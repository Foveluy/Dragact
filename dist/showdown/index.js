var showdown = require('showdown');
var hljs = require('highlightjs');
var decodeHtml = require("html-encoder-decoder").decode;
function showdownHighlight() {
    return [{
            type: "output",
            filter: function filter(text, converter, options) {
                var left = "<pre><code\\b[^>]*>", right = "</code></pre>", flags = "g", replacement = function replacement(wholeMatch, match, left, right) {
                    match = decodeHtml(match);
                    var lang = (left.match(/class=\"([^ \"]+)/) || [])[1];
                    console.log(left + hljs.highlight(lang, match).value + right);
                    if (lang) {
                        return left + hljs.highlight(lang, match).value + right;
                    }
                    else {
                        return left + hljs.highlightAuto(match).value + right;
                    }
                };
                return showdown.helper.replaceRecursiveRegExp(text, replacement, left, right, flags);
            }
        }];
}
;
export var convertor = new showdown.Converter({
    extensions: [showdownHighlight]
});
