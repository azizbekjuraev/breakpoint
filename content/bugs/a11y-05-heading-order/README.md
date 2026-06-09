# Heading levels jump from h1 straight to h4

An article section uses an `<h1>` for the title, then `<h4>` for the subsections beneath it. The author picked `<h4>` because it looked the right size. Visually, the styling is fine — the subsections are clearly smaller than the title.

Underneath, the document outline is broken. Screen-reader users navigating by heading level (a common shortcut) will jump from level 1 to level 4 with two missing rungs. They'll wonder what they skipped, or assume the page has lost structure.

Heading levels describe the **outline** of the document, not its **font sizes**. Fix the outline. Visual size belongs in CSS.

**Before you run it: what do you think will happen, and why?**
