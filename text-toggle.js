//  **Text Toggle**
//
//  https://github.com/jsvine/text-toggle
//
//  Author: Jeremy Singer-Vine
//  
//  Based on a script originally published on Slate Magazine (slate.com). Licensed under the MIT license.
//
//  ***

//
(function($) {
  // Our main constructor. 
  // Takes a single argument, an HTMLElement (plain, or jQuery-wrapped).
  var TextToggle = function (container) {
    var zipped, delinses, parent_toggle;

    // Wrap our container in a jQuery object if not already so.
    this.$el = container.constructor === $ ? container : $(container);
    
    // Fetch all the non-nested `<del>` and `<ins>` elements 
    // inside our container.
    delinses = this._getDelinses(this.$el);

    // Zip these `<del>`s and `<ins>`es, so that `zipped` is an
    // array that looks like this: 
    //     
    //   [ [ del1, ins1 ], [ del2, ins2 ], ... ]
    zipped = this._zipDelinses(delinses);

    // Construct an array of `Pair` objects, one for
    // `<del>`/`<ins>` pair in the array.
    this.pairs = $.map(zipped, $.proxy(function (arr) { 
      return new Pair(arr[0], arr[1], this); 
    }, this));

    // TextToggles can be nested inside one another. 
    // If this TextToggle is nested, find its parent.
    this.parent = container.delins ? container.delins.pair.parent : null;

    // If this TextToggle is a top-level TextToggle,
    // attach click-event handlers to it.
    if (!this.parent) {
      this._activateToggling();
    }
  };

  TextToggle.prototype = {
    // Return this TextToggle to its original state.
    reset: function () {
      this.$el.find("del").removeClass("text_toggle_off");    
      this.$el.find("ins").addClass("text_toggle_off");    
    },
    // Expand all translations, i.e., show all `<ins>`es, hide 
    // all `<del>`s.
    translate: function () {
      this.$el.find("del").addClass("text_toggle_off");    
      this.$el.find("ins").removeClass("text_toggle_off");    
    },
    // Attach the core click handler.
    _activateToggling: function () {
      this.$el.on("click", ".text_toggle", function (e) {
        this.delins.$el.toggleClass("text_toggle_off");
        this.delins.getSibling().$el.toggleClass("text_toggle_off");
        e.stopPropagation();
      });
    },
    // Fetch all `<del>`s and `<ins>`es in the current nesting level.
    // (Hence the lengthy selectors.) 
    _getDelinses: function () {
      var del_sel = "del:not(ins:not(.text_toggle) del):not(del:not(.text_toggle) del)",
        ins_sel = "ins:not(ins:not(.text_toggle) ins):not(del:not(.text_toggle) ins)"
      return {
        dels: this.$el.find(del_sel),
        inses: this.$el.find(ins_sel)
      };
    },
    // A custom zip utility.
    _zipDelinses: function (delinses) {
      if (delinses.inses.length !== delinses.dels.length) {
        throw new Error("Each TextToggle must have the same number of <ins>es and <del>s.");  
      }
      var length = delinses.inses.length;
      var results = new Array(length);
      for (var i = 0; i < length; i++) {
        results[i] = [ delinses.dels[i], delinses.inses[i] ];
      }
      return results;
    }
  };

  // Each `Pair` contains one `<ins>` and one `<del>` 
  // that we'll toggle between.
  var Pair = function (del, ins, parent) {
    this.parent = parent;
    this.del = new Delins(del, this);
    this.ins = new Delins(ins, this);
  };

  // The Delins constructor represents a single
  // `<del>` or `<ins>`.
  var Delins = function (el, pair) {
    this.el = el;
    this.$el = $(el);
    this.tag = el.tagName;
    this.el.delins = this;
    
    // Upon construction, hide `<ins>`es.
    if (this.tag.toLowerCase() === "ins") {
      this.$el.addClass("text_toggle_off");  
    }

    // `text_toggle` is the class we give all
    // togglable `<del>`s and `<ins>`es.
    this.$el.addClass("text_toggle");
    this.pair = pair;

    // Here's the recursive bit. If this `<del>` or `<ins>`
    // itself has `<del>`s and `<ins>`es as children, create
    // a nested TextToggle.
    this.children = new TextToggle(this.el);
    if (!this.children.pairs.length) {
      delete this.children;  
    }
  };

  Delins.prototype.getSibling = function () {
    if (this.tag.toLowerCase() === "del") {
      return this.pair.ins;  
    } else {
      return this.pair.del;
    }
  };
  
  // Given a JSON array, turn it into a TextToggle. The array,
  // as well as the resulting TextToggle, can be nested ad infinitum.
  // It should take the following structure:
  //
  //  	[
  //  	 "Plain text, not toggleable ",
  //  	 [ "something to sub out", "something to sub in" ],
  //  	 " and then more plain text. ",
  //  	 [ "At first this looks like a normal toggle but ", 
  //  	   [ "then you notice", "it's a nested toggle" ]
  //  	 ]
  //  	]
  TextToggle.fromJSON = function (json) {
    var $container, parse, html;
    $container = $("<div>");
    parse = function (item, is_subitem) {
      if (item.constructor === Array)  {
        if (!is_subitem) {
          return $.map(item, function (subitem, i) { 
            return parse(subitem, true); 
          }).join("");
        } else {
          return "<del>" + parse(item[0]) + "</del>" + 
              "<ins>" + parse(item[1]) + "</ins>";  
        }
      }
      // If item is a string, return it and stop recursing.
      return item;
    };
    html = parse(json);
    $container.html(html);
    return new TextToggle($container);
  };

  // Attach `TextToggle` to the global object.
  this.TextToggle = TextToggle;
}(jQuery));
