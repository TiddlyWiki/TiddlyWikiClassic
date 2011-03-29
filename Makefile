# Start at a Makefile or managing build activities.
# Expects a 'cook' script somewhere on the $PATH
# For now users the OSX specific "open" to run a test file. This
# will need to change.

RELEASE = 2.6.3.A2

TW = alpha.sh
EXTERNAL = external-js.sh
MAKEFILES = $(EXTERNAL) $(TW)

help: 
	@echo all ......... creates all TW files
	@echo tw .......... creates a TW html file
	@echo external .... creates a TW html with external libraries
	@echo clean ....... cleans up the directory
	@echo test ........ opens tests.html if available on OSX
	@echo tests.html .. creates the tests.html file 

all: $(MAKEFILES)
	./$(TW) $(RELEASE)
	./$(EXTERNAL) $(RELEASE)

external: $(EXTERNAL)
	./$(EXTERNAL) $(RELEASE)

tw: $(TW)
	./$(TW) $(RELEASE)
	
clean:
	rm *.html || true
	rm *.jar || true
	rm twcore.** || true
	rm **.js || true
	rm savetest.txt || true

test: tests.html
	open tests.html

tests.html:
	cook test/recipes/tests

