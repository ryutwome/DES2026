# Project Instructions

## Before Every Commit

### 1. Remove debug code
- Remove all `#if DEBUG` / `#endif` blocks added for debugging
- Remove any `print(...)` statements added for debugging
- Remove any temporary logging, breakpoint helpers, or test harnesses
- Exception: debug code that was already present before your changes and is intentional (ask if unsure)

### 2. Comments must be concise with what/why/how
- Only applies to comments in code you changed — don't touch unrelated comments
- Every non-obvious comment should answer: **what** it does, **why** it exists, and **how** it works
- Delete filler comments ("// helper", "// TODO: remove") unless they carry meaningful context
- Keep comments short — one to three lines max per block

### 3. Confirm commit message before committing
- Show the proposed commit message to the user and **wait for explicit approval** before running `git commit`
- Do not commit until the user says yes (or provides an alternative message)
