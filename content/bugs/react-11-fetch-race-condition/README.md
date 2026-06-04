# Switching users fast displays the wrong one

`UserDisplay` fetches a user by id and shows their name. The first user (Bob) takes 80ms; the second (Alice) takes 10ms.

The page mounts with Bob selected, then we quickly click **Load Alice**. Briefly, the page shows "User: Alice" — but a moment later it flips back to "User: Bob" and stays there.

Alice was clicked _after_ Bob — so why does Bob win?
