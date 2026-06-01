## Hint 1

The two arrow functions in `setup()` and `teardown()` have identical bodies. But are they the *same function*, or two different functions that happen to do the same thing?

## Hint 2

Two arrow functions with identical bodies are still two different function objects in memory — they have different identities. `removeEventListener` looks for the *exact same reference* that was passed to `addEventListener`. To remove a listener successfully, save the function in a variable once and use that same reference in both places.
