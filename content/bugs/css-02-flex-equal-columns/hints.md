## Hint 1

`width: 100px` makes each column 100px no matter how wide the row is. You don't want a fixed width — you want the row's free space split three ways.

## Hint 2

`flex: 1` is the one-liner: it expands to `flex: 1 1 0` — grow, shrink, and start from zero basis. When three siblings all have `flex: 1`, they share the row equally.

Remove the `width: 100px` so it doesn't fight the flex sizing.
