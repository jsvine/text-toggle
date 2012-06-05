# Text Toggle 0.1.0

## About

Text Toggle is a reincarnation of [Slate Magazine](http://slate.com)'s ["Plain English"](http://labs.slate.com/articles/plain-english/), a script that lets readers toggle between two versions of a text. The fine folks at Slate, my former employer, have given me permission to open-source the project. Text Toggle is a complete rewriting of Plain English, but retains its spirit.

## Dependencies

TextToggle currently requires jQuery 1.7+.

## Usage

If you're curious, you can read the [annotated source code](http://jsvine.github.com/text-toggle/docs/text-toggle.html).

To use Text Toggle on a web page, you'll need to include the Javascript and CSS files:

	<link rel="stylesheet" href="text-toggle.css"/>
	<script src="text-toggle.js"></script>

Then, you can generate a Text Toggle in two ways: from live HTML, or from a JSON object. The result of each is essentially the same. See the examples below, or view [interactive versions here](http://jsvine.github.com/text-toggle/examples/).

### Via Live HTML

	<div id="example">
		I would like a pet <del>Eublepharis macularius</del><ins>leopard gecko</ins>.
	</div>
	<script>
		var t = new TextToggle(document.getElementById("example"))
	</script>

As you can see, Text Toggle depends on the semantic `<ins>` and `<del>` tags. They can be nested ad inifintum: 

	<div id="example">
		I would like a <del>pet</del><ins>pet, specifically a <del>Eublepharis macularius</del><ins>leopard gecko</ins></ins>.
	</div>
	<script>
		var t = new TextToggle($("#example"))
	</script>

As shown above, you can pass the `TextToggle` constructor either a plain HTML element or a jQuery-wrapped one.

### Via JSON

	<div id="example"></div>
	<script>
		var json = [
			"I would like a ",
			[ "pet", [
				"pet, specifically a ",
				[ "Eublepharis macularius", "leopard gecko" ]
			]],
			"."
		];
		var t = new TextToggle.fromJSON(json);
		$("#example").html(t.$el);
	</script>

The code above will produce the same functionality as the second HTML-derived example. Text Toggle expects a very particular JSON structure:

	[
		"Plain, non-substituting sections go in strings. ",
		[ "Something to toggle out", "Something to toggle in" ],
		" more plain text. ",
		[ "You can created nested toggles.", [
			"Nested toggles work",
			[ " just the same", " similarly" ],
			"."
		]]
	]

## API

All `TextToggle` objects have the following public methods:

* TextToggle.__translate()__: Hides all `<del>`s, shows all `<ins>`es.

* TextToggle.__reset()__: The opposite. Resets the TextToggle to its initial state by showing all `<del>`s and hiding all `<ins>`es.

You might want to add these methods as click-handlers to HTML buttons.

## To-Do

- Create a test suite.

- Test on Internet Explorer 6, 7, 8, 9.

- Wean script off of its jQuery dependency.
