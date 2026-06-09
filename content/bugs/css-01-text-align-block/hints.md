## Hint 1

`text-align` is about how **inline content** flows inside a block. Read that again: it controls the inline children, not the block itself. Where does the button actually live, and where is the inline context being defined?

## Hint 2

Two clean fixes:

- Put `text-align: center` on the **parent** (`.container`). The button is inline-block by default, so it'll obey.
- Or use flex on the parent: `display: flex; justify-content: center;`.

Either keeps the button at its natural size and centers it.
