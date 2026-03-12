# Session Notes (Codex)

Last updated: 2026-03-12

## Purpose
Working log and handoff notes to continue this project from another computer.

## Core UI Rules Agreed With User
- Lesson frame should be uniform across lessons 1-18: centered title, centered main panel, consistent nav button row.
- Main panel can have different default sizes per page, but should use the same scaling behavior as older lessons.
- If screen/browser is too small, scale the full lesson content proportionally (keep ratios stable).
- Avoid text-width locks (`max-w-*`) unless absolutely required; preferred fix for overlap is positioning panels (often absolute) instead of constraining text.
- Keep text selectable only inside lessons (excluding non-text UI like chips/gutters/buttons where requested).
- Keep lesson visuals consistent with imported style decisions:
  - faux code editor/input/output panels
  - chip labels (Input/Output) style
  - nav button styling and placement
  - hint panel behavior and placement

## Reusable Primitives Added/Adjusted
- Shared lesson primitives are in:
  - `src/components/learn/lesson-primitives.tsx`
- Includes editor/output/chip/button/table-like building blocks used across lessons.
- A 4-button group primitive was introduced for repeated choice-button layouts.
- Page output state keys were standardized from `pageXOutput` to `Output_X` format.

## Imported Lessons Status
- Lessons imported and iteratively tuned with Unity + screenshot guidance.
- Recent imports included lessons 10-14, then 15-16, then 17 (`files`) and 18 (`memory-management`).
- `files` lesson image assets now expected at:
  - `/public/lesson-images/files/1.png`
  - `/public/lesson-images/files/2.png`
  - `/public/lesson-images/files/3.png`
- Image display for `files` was set to show full image (no crop/zoom, no decorative frame).

## Play Section Status
Implemented menu-only flow for both games:
- `src/app/play/code_fixer/page.tsx`
- `src/app/play/quiz_rush/page.tsx`

Behavior:
- Initial state: Play button.
- On click: Play hides, difficulty buttons appear.
- Difficulty buttons currently no-op (as requested).

Styling:
- Play button uses main-menu blue style.
- Difficulty buttons use lesson-selector color scheme.
- Back button uses shared default back style.
- Home button intentionally absent in play menus for now.

## Leaderboards Status
- `src/app/play/leaderboards/page.tsx` implemented with static tables and selector tabs.
- No database wiring yet (placeholder/static content).
- Iterative style changes applied per user:
  - blue top selectors
  - unselected buttons darker
  - panel black with transparency
  - square corners / zero button gaps
  - text-size and color tuning
- Layout and centering were being normalized to match lesson-page alignment expectations.

## Important Bug History / Fixes
- Fixed multiple invalid UTF-8 file issues that caused Turbopack parse failures.
- Hydration mismatch occurred on learn menu difficulty state; session-persistence logic was revisited.
- Resizing behavior mismatch existed in newly imported lessons; part fixed by matching older frame/scaling patterns.
- Remaining alignment checks were still being refined in newer pages.

## Learn Menu (Difficulty Selector)
Requested/implemented behavior:
- Center panel is non-clickable label (`Beginner` / `Intermediate` / `Advanced`).
- Left/right circular arrow buttons switch difficulty.
- Disabled direction button becomes non-clickable and visually dimmed at bounds.
- Middle label color:
  - Beginner = green
  - Intermediate = yellow
  - Advanced = red
- Difficulty state should persist for session when leaving/returning to menu.
- Lesson numbering should remap by difficulty:
  - Beginner: 1-6
  - Intermediate: 7-12
  - Advanced: 13-18

## Content/Encoding Notes
- Some imported bullets/symbols from external sources were garbled (e.g. "Ãƒ...").
- These should be replaced with proper symbols (for example `●`) and UTF-8-safe source content.

## What Was In Progress Right Before Handoff
- Final alignment polish for play/leaderboard pages:
  - ensure title centered
  - main panel centered
  - back button centered
  - pagination controls centered
- Continue standardizing newer lessons so they match early-lesson frame/scale behavior exactly.

## Next Recommended Steps
1. Run local build/typecheck and quickly verify `learn`, `play/code_fixer`, `play/quiz_rush`, and `play/leaderboards` visually.
2. Confirm difficulty session persistence and numbering remap on learn menu.
3. Continue screenshot tuning pass for latest lessons with consistent text-size scale from lessons 1-5.
4. Commit in small chunks (lesson imports, play UI, leaderboard UI, resize fixes) for safer rollback.

## Quick Resume Prompt (for new Codex session)
Use this in a new chat:

"Read `data/SESSION_NOTES.md`, then continue from the last in-progress item: normalize centering/scale behavior across `play` pages and ensure lessons 10-18 match lesson 1-5 frame + typography conventions. Keep all prior UI decisions intact and avoid reintroducing text-width locks."
