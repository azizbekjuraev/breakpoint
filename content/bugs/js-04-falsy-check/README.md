# User ID zero gets rejected as missing

`findUser(id)` should look up a user by ID. If no ID is provided (`undefined` or `null`), it should return `"no user provided"`. Otherwise it should look up that user.

There's just one problem: user ID `0` is a valid user (the admin), but the function rejects it as if no ID was passed.

**Before you run it: predict what each of the four calls will return. Which one will surprise you?**
