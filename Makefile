MAINJS = text-toggle.js
MINI = text-toggle.min.js

hint: 
	jshint $(MAINJS)

minify:
	uglifyjs $(MAINJS) > $(MINI)

.PHONY: docs
docs:
	docco $(MAINJS)
