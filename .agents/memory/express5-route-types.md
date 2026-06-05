---
name: Express 5 route handler TypeScript types
description: How to satisfy TypeScript in Express 5 async route handlers and middleware.
---

## Rule
- Async route handlers must be typed as `async (req, res): Promise<void> => { ... }`
- After `res.status(N).json(...)` inside a conditional block, add `return;` explicitly so TS knows the code path terminates.
- `req.params.id` is typed as `string | string[]` in Express 5 — always cast with `String(req.params.id)` before `parseInt`.
- Middleware that calls `res.status(...).json(...)` and returns must use `return;` after the response call and the function return type should be `void` (not `Promise<void>`).

**Why:** Express 5 tightened its TypeScript types. TS7030 "not all code paths return a value" fires when a function has a `Promise<void>` return type but some branches fall off the end without an explicit `return`. TS2345 fires because Express 5 types `req.params` values as `string | string[]`.

**How to apply:** Any time you write or edit Express 5 route handlers, annotate the handler signature and add `return;` after early-exit `res` calls inside conditional blocks.
