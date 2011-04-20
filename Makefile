# Start at a Makefile or managing build activities.
# Expects a 'cook' script somewhere on the $PATH
# For now users the OSX specific "open" to run a test file. This
# will need to change.

clean:
	rm *.html || true
	rm *.jar || true


test: tests.html
	[ -L "sample.txt" ] && rm sample.txt
	ln -s test/recipes/sample.txt .
	open tests.html

tests.html:
	cook test/recipes/tests
