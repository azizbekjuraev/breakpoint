# format() calls toUpperCase on a number

`format` accepts `string | number`. Inside the body it calls `.toUpperCase()` on the value — fine when it's a string, a runtime crash when it's a number. TypeScript catches this, but only if the body actually narrows the union before reaching for string methods.

Fix the implementation so the compiler is happy and both inputs return a sensible string.

**Before you run it: which path through the union is unsafe, and why?**
