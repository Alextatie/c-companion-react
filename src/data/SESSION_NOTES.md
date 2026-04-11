# Session Notes (Codex)

Last updated: 2026-04-10

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
- `src/app/play/time_attack/page.tsx`

Behavior:
- Initial state: Play button.
- On click: Play hides, difficulty buttons appear.
- Difficulty buttons currently no-op (as requested).

Styling:
- Play button uses main-menu blue style.
- Difficulty buttons use lesson-selector color scheme.
- Back button uses shared default back style.
- Home button intentionally absent in play menus for now.

## Session Update (2026-03-14)
This session was focused on detailed UI/layout polish for both play games, plus timeout behavior fixes.

### Files Changed
- `src/app/play/code_fixer/page.tsx`
- `src/app/play/time_attack/page.tsx`
- `src/components/lesson/ui.tsx`

### Global Primitive Change
- `HomeButton` in `src/components/lesson/ui.tsx` now supports:
  - `topClass` (existing)
  - `leftClass` (new; default `left-0`)
- This was added so play pages can position Home consistently above the game panel without affecting other pages.

### Code Fixer (current final state)
- Header alignment tuned:
  - Home and Selector aligned with round title row and moved over panel area.
  - Current positions are controlled in-page (`top-[6px]`, left offsets).
- Main round layout rebuilt around shared lesson primitives:
  - Input uses `CodeEditor` + gutter + `RunButton`.
  - Output uses `OutputPanel`.
  - Uses `LessonChip` labels (`Input`, `output`).
- Panel geometry normalized:
  - main panel width/padding/gaps and inner column widths were tightened iteratively.
  - left content column fixed width; right controls fixed width; explicit gap between them.
- Button text sizing tuned:
  - `Quit`/`Next` large text retained.
  - `Confirm` text specifically reduced to fit button.
  - `Finish` state text reduced so it fits in same button size.
- Selector button behavior fixed:
  - no jump/shift when opening dropdown
  - dropdown is now absolutely positioned under button.

### Time Attack (current final state)
- Layout intentionally matched to Code Fixer structure:
  - same outer spacing behavior and scaled frame dimensions
  - same top controls placement style (Home + Selector in debug)
  - same main panel width/padding/gap pattern
  - same right-side timer + action-button sizing model
- Panels switched to primitives:
  - top uses `CodeEditor` (gutter included)
  - bottom uses `OutputPanel`
  - labels use `LessonChip`
- Multiple-choice buttons were resized to fit tighter layout and then spacing-normalized:
  - final stack uses fixed heights with even vertical gaps
  - single-line/ellipsis safeguards added for long labels.

### Timer End Behavior (both games, final)
- Removed previous full-screen black timeout overlay with giant Finish button.
- On timeout:
  - `Next` changes to `Finish`.
  - non-finish gameplay interactions are locked until game ends/restarts.
  - `Finish` remains usable to continue to result.
- Locking includes disabled/pointer-blocked non-finish controls and suppressed interaction highlights.

### Color Experiments During Session (final resolved state)
- Time Attack choice buttons were tested in blue variants, then reverted.
- Final state: choice buttons are green again.
- Quit/Confirm/Next buttons remain their intended orange/red/green palette.

### Conflict Log (requests that changed later)
- Home/Selector vertical offsets were changed multiple times; final is the latest in-file values.
- Panel width/height were repeatedly tuned; final dimensions reflect latest user-approved state.
- Time Attack choice colors:
  - changed to blue
  - user requested only choice buttons blue
  - later requested back to green
  - final is green.
- Timeout UX:
  - previously overlay-based
  - replaced by in-button Finish behavior + interaction lock.

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
- Some imported bullets/symbols from external sources were garbled (e.g. "Ã...").
- These should be replaced with proper symbols (for example `?`) and UTF-8-safe source content.

## What Was In Progress Right Before Handoff
- Final alignment polish for play/leaderboard pages:
  - ensure title centered
  - main panel centered
  - back button centered
  - pagination controls centered
- Continue standardizing newer lessons so they match early-lesson frame/scale behavior exactly.

## Next Recommended Steps
1. Run local build/typecheck and quickly verify `learn`, `play/code_fixer`, `play/time_attack`, and `play/leaderboards` visually.
2. Confirm difficulty session persistence and numbering remap on learn menu.
3. Continue screenshot tuning pass for latest lessons with consistent text-size scale from lessons 1-5.
4. Commit in small chunks (lesson imports, play UI, leaderboard UI, resize fixes) for safer rollback.

## Quick Resume Prompt (for new Codex session)
Use this in a new chat:

"Read `data/SESSION_NOTES.md`, then continue from the last in-progress item: normalize centering/scale behavior across `play` pages and ensure lessons 10-18 match lesson 1-5 frame + typography conventions. Keep all prior UI decisions intact and avoid reintroducing text-width locks."

## Session Update (2026-04-02)
This session focused on game-data cleanup, extracting non-UI game rules out of page files, aligning game code colors with lesson colors, and improving Code Fixer input sizing.

### Files Changed
- `src/data/SESSION_NOTES.md`
- `src/data/code-fixer-levels.json`
- `src/components/lesson/text.tsx`
- `src/components/lesson/code-highlighting.tsx`
- `src/app/play/code_fixer/page.tsx`
- `src/app/play/time_attack/page.tsx`
- `src/lib/games/code-fixer-logic.ts`
- `src/lib/games/time-attack-logic.ts`

### Data / Structure Cleanup
- Code Fixer was consolidated to one content source:
  - `src/data/code-fixer-levels.json`
- Old Code Fixer import/helper files were removed during this session series so the runtime no longer depends on separate JSON/TS/C# answer-key files.
- `answerTarget` was removed from Code Fixer level data because current runtime behavior was not actually using that property.

### Game Logic Refactor
- Both play pages were cleaned up so non-UI rules live in shared logic files:
  - `src/lib/games/code-fixer-logic.ts`
  - `src/lib/games/time-attack-logic.ts`
- Validation helpers were merged into those same logic files instead of being split into separate `validation` modules.
- Logic now includes:
  - scoring/star rules
  - timer formatting and timer warning colors
  - random question selection
  - answer validation / correctness checks
- UI pages still own React state, click handlers, and JSX layout.

### Shared Code Color Rule
- Game code highlighting now uses a shared lesson-based renderer:
  - `src/components/lesson/code-highlighting.tsx`
- This renderer uses the lesson color system from:
  - `src/components/lesson/text.tsx`
- Current agreed color rules for both games going forward:
  - datatypes like `int`, `float`, `char` are blue
  - `return` is blue
  - numeric values are red
  - string/text values are red
  - comments are green
  - `???` placeholders are yellow
- Prompt text in both games should be left-aligned, not centered.

### Code Fixer Screenshot Import Notes
- Level 1 was re-imported from screenshot guidance instead of guessed text.
- Current level 1 uses:
  - prompt: `Fix the following code to achieve the right output as seen bellow:`
  - inline input token in code: `[[input]]`
- `[[input]]` support was added in `src/app/play/code_fixer/page.tsx` so the answer field can appear inline inside the code line instead of always on its own line.
- Levels 2-50 were then imported in batches from screenshots with the same rule:
  - do not improvise prompt/code content when screenshot data is available
  - place `[[input]]` exactly where the screenshot shows the answer box
  - keep visible output text in `expectedOutput` when the screenshot shows it
  - preserve existing validator logic unless screenshot/source data clearly requires a change

### Code Fixer Multi-Input Support
- `src/app/play/code_fixer/page.tsx` no longer assumes there is only one inline input box.
- Added token parsing for:
  - `[[input]]`
  - `[[input_a]]`
  - `[[input_b]]`
  - `[[input_c]]`
  - `[[input_d]]`
- Runtime now stores Code Fixer answer state as per-field drafts instead of one single input string.
- This was needed so multi-blank questions can be represented accurately from screenshots.
- Level 36 specifically now uses two separate input boxes and should be rechecked visually/functionally later:
  - one field for the `%d` argument
  - one field for the `%p` argument

### Code Fixer Output-Answer Levels
- Some screenshot imports in levels 21-50 are output-answer questions rather than input-fix questions.
- `OUTPUT_FIX_LEVELS` in `src/app/play/code_fixer/page.tsx` was expanded for these imported levels so the answer entry appears in the output area instead of the code area.

### Code Fixer 21-50 Import Note
- Levels 21-50 were imported from screenshots and now include:
  - operator questions
  - function-name questions
  - output-answer questions
  - control-flow questions
  - array/pointer questions
- Prompt highlight support was extended so the word `function` renders red in prompts, matching screenshots.
- Level 45 has one explicit follow-up check item:
  - screenshot was not fully clear
  - import was matched using both screenshot layout and the existing validator range
  - current expected output was set to `1 2 4 8 16`
  - this level should be tested and confirmed later

### Code Fixer Input Box Sizing
- Code Fixer input widths are no longer hardcoded only as fixed values in the page.
- New helper added in `src/lib/games/code-fixer-logic.ts`:
  - `getCodeFixerExpectedAnswerSample(...)`
  - `getCodeFixerInputWidthPx(...)`
- Behavior:
  - `exact_any` validators use answer-length-based sizing
  - if multiple accepted answers exist, the longest accepted answer is used
  - all non-`exact_any` validator types default to `280px`
- This applies to:
  - inline Code Fixer inputs
  - normal Code Fixer input fields
  - output-fix input fields

### Result Text Placement
- `Correct!` / `Wrong!` feedback for both games was moved away from layout-expanding behavior.
- Current intended behavior:
  - feedback is positioned inside the output panel area at the lower-right
  - `Correct!` uses green
  - `Wrong!` uses red

### Current Direction / Constraints
- For screenshot-based imports, do not improvise missing content. Prefer screenshot/source data over guesses.
- Keep game rendering rules aligned with lesson primitives/colors wherever possible.

### Time Attack Screenshot Import Notes
- Time Attack levels 1-70 were re-imported from screenshots in batches and cleaned up to replace the rough earlier import.
- Main data file:
  - `src/data/game-time-attack-levels.json`
- Import rules used:
  - do not improvise prompt/code content when screenshot data is available
  - keep prompt text left-aligned
  - match screenshot line breaks and blank rows in the input panel
  - set `expectedOutput` only when the screenshot is asking for a real runtime result to be shown after selection
  - keep conceptual/error questions label-based when there is no concrete runtime output to reveal

### Time Attack Prompt Highlight Rules
- `src/app/play/time_attack/page.tsx` prompt highlighting was expanded for the screenshot imports.
- Words/phrases currently intended to render red in Time Attack prompts:
  - `output`
  - `function`
  - `data type`
  - `printf()`
  - `scanf()`
  - `condition`
  - `loop`
  - `bool`
  - `strcat`
  - `strcpy`
  - `recursion`
  - `HARD`
  - `edit`
  - `print()`

### Game Placeholder Color Rule
- Lesson-mode `???` placeholders keep their lesson behavior.
- Game-mode `???` placeholders now use a shared lighter gray:
  - `#c2c2c2`
- This applies to both:
  - `src/app/play/code_fixer/page.tsx`
  - `src/app/play/time_attack/page.tsx`

### Time Attack Recheck Levels
- These levels were specifically worth verifying after the new screenshot import because they involve library prompts, control-flow phrasing, or special output semantics:
  - `22`
  - `31`
  - `43`
  - `46`
  - `56`
  - `64`
  - `68`

## Session Update (2026-04-07)
This update captures the latest implementation state around leaderboards/database wiring, username flow, profile/medals, and UI consistency work.

### Core Routing / Page Split
- App uses split home flow:
  - `/` = pre-login landing
  - `/Home` = logged-in main menu
- Back/home navigation across lessons/play/profile was migrated to target `/Home` where appropriate.

### Leaderboards + Database (Firestore)
- Leaderboards are now wired to Firestore (not static placeholder-only).
- Main logic file:
  - `src/lib/leaderboards.ts`
- Source collection:
  - `stats/{uid}`
- Supported leaderboard modes:
  - total stars
  - code fixer stars
  - time attack stars
  - code fixer best time
  - time attack best time
- Best-time writes are only sent when a run is 3-star eligible:
  - `completionTimeMs: bestTimeEligible && stars === 3 ? elapsedMs : null`
  - used in both game pages.
- Current write model is client-side updates into Firestore stats (no server-authoritative run/session validation at this stage).
- Leaderboards page currently requires signed-in user to view.

### Username / Auth State
- Username handling now centers on `stats.displayName`.
- Username helper functions are in:
  - `src/lib/username.ts`
- Uniqueness check path uses:
  - `usernames/{normalizedUsername}`
  - transaction writes back to `stats/{uid}` displayName.
- Email/password signup requires username validation.
- Google signup path supports selecting/saving username and fallback behavior from email local-part when needed.
- Login/signup/home greeting were updated to prefer profile username from Firestore rather than raw email display.

### Profile Page State
- Profile routes:
  - `src/app/profile/page.tsx` (guest state)
  - `src/app/profile/[uid]/page.tsx` (user profile)
- Guest profile has dedicated message + login/signup actions.
- Signed-in profile shows:
  - lesson completion counts by difficulty (beginner/intermediate/advanced)
  - game stats split (Code Fixer / Time Attack): stars + best time
  - decorative trophy + laurels
- Edit button only appears when viewing own profile.
- Lesson completion counts are read from `lesson_*` fields on `stats/{uid}` and mapped via `src/lib/lesson-progress.ts`.

### Lesson Completion + Medals
- `src/lib/lesson-progress.ts` defines all 18 lesson fields and slug mapping.
- Completing a lesson final page marks the corresponding `lesson_*` field true.
- Learn menu uses medal icon status per lesson:
  - incomplete: dark/low opacity
  - complete: default medal color/full opacity
- Medal asset:
  - `src/data/Medal.png`

### UI / Styling Consistency (Recent)
- Button shadow style standardized to:
  - `0 2px 6px rgba(0,0,0,0.55)`
- Applied globally for:
  - native `<button>`
  - button-like links (`a.text-shadow-lg`)
- Also explicitly applied to:
  - lesson difficulty middle panel
  - round home buttons (shared primitive + play pages)
  - hint panel popup + hint trigger button.

### Game UI Notes
- Play menus and leaderboard tables were restyled to match project visual system (blue controls, dark translucent panel surfaces, consistent spacing/alignment work).
- Code Fixer / Time Attack continue using shared lesson primitives where possible.
- Game result updates now feed leaderboard stats via `updateLeaderboardStats(...)`.

### Current Resume Guidance
1. If continuing gameplay/backend hardening, decide whether to keep client-trusted writes or re-introduce server-authoritative validation path.
2. Re-verify Firestore rules/indexes still match the current `stats` queries in `leaderboards.ts`.
3. Regression-check profile + learn medals after any future stats schema changes.

## Session Update (2026-04-08)
This session focused on gameplay unlock UX rollback/simplification, Options debug actions, and guest-specific messaging.

### Files Changed
- `src/app/play/page.tsx`
- `src/app/play/code_fixer/page.tsx`
- `src/app/play/time_attack/page.tsx`
- `src/app/learn/page.tsx`
- `src/app/options/page.tsx`
- `src/lib/play-unlocks.ts` (deleted)

### Play Navigation / Unlock Flow
- Removed pre-navigation unlock resolving/cache logic from `/play`.
- Restored immediate navigation from Play menu to game pages.
- Removed the temporary play-unlock cache helper:
  - `src/lib/play-unlocks.ts` deleted.
- Both game pages now resolve unlock state normally after load (no preload gate).

### Guest Game Unlock Rules (Current)
- For guests:
  - `Play` button is always unlocked.
  - Only `Easy` difficulty is unlocked.
  - `Medium` and `Hard` remain locked.
- For signed-in users:
  - Existing lesson-completion-based unlock logic remains active.

### Guest Tooltip Text (Current)
- On both games, when guest hovers locked `Medium` or `Hard`, tooltip now says:
  - `Login to unlock`
- Signed-in users still get difficulty-specific lesson-completion tooltip text.

### Learn Menu Guest Message
- Learn menu now shows a small white helper text for guests:
  - `Login to keep progress`
- Appears under the lesson list for guest/not-signed-in users only.

### Options Debug Panel (Temporary)
- Added a second panel under the main options panel:
  - label: `Debug Panel`
- Added 3 confirm-style actions (same interaction pattern as reset actions):
  - `Complete Beginner`
  - `Complete Intermediate`
  - `Complete Advanced`
- Each action, for logged-in non-guest users, writes all corresponding `lesson_*` fields to `true` in `stats/{uid}` and updates `updatedAt`.

### Notes
- Typecheck was run successfully with:
  - `npx tsc --noEmit`
- `npm run lint` is currently not reliable in this environment due local script/powershell invocation issues.

## Session Update (2026-04-10)
This session focused on consolidating auth into `/login`, turning `/` into a welcome/preview page, and adding non-interactive showcase animations.

### Auth / Routing State
- `/` is now a welcome-only landing page.
- `/login` owns the login and signup stages.
- Separate old login/signup pages were removed from the flow.
- `/Home` logout and unauthenticated fallback should route to `/login`, not `/`.
- The root welcome page has one main CTA button labeled `Play->` that routes to `/login`.

### Login / Signup Behavior
- Email/password signup includes a username input.
- Signup should create/update both Firestore username/profile-related data and stats data.
- Google first-signup behavior should derive the display name from the email local part before `@` when needed.
- Existing Google users with an existing display name should not have that display name overwritten.
- Guest login remains available on the login page.

### Root Welcome Page
- Main implementation is in:
  - `src/app/page.tsx`
- Current root page contains:
  - a welcome panel with CTA
  - a separate preview panel that can swap between `Lessons` and `Games`
- The current preview panel is intentionally non-interactive:
  - wrapper uses pointer-blocking behavior so it behaves like a screenshot/demo, not a playable component.
- Current page positioning uses hard-coded absolute offsets and user-tuned transforms.
- Be careful not to overwrite the user's manual layout/position tweaks unless explicitly requested.

### Lesson Preview
- Lesson preview copies the first Output lesson screen into the welcome preview panel.
- It uses real lesson primitives/components where possible, but is presented as a static/non-interactive demo.
- The fake cursor animation:
  - starts under the output panel near the lower input-panel height
  - waits about 2 seconds
  - moves to the upper Run button
  - clicks it
  - shows `Hello World!` in the output
  - leaves the cursor and output visible at the final frame instead of fading/resetting.

### Games Preview
- Games preview copies Code Fixer round 8 into the welcome preview panel.
- Title is `Games` only; `Round 8` text was removed.
- It is a static/non-interactive demo of the game UI.
- The fake cursor animation:
  - starts near the timer/number area
  - waits about 2 seconds
  - moves to the inline answer input
  - clicks it
  - types `%d`
  - moves to Run
  - clicks Run
  - shows `Correct!`
- Timer animation starts at `01:55` and counts down once per second to `01:47`.
- The mouse finishes earlier; the remaining animation time is timer-only.

### Preview Assets
- Cursor source asset:
  - `src/data/cursor.png`
- Filled cursor asset generated for the preview:
  - `src/data/cursor-filled.png`
- Root page imports the filled cursor asset for the fake cursor animations.

### Current Constraints / Resume Guidance
- Preserve `/` as the welcome page and `/login` as the auth page unless the user requests another routing change.
- Preserve the current non-interactive preview behavior.
- Root page preview alignment/scale is still being tuned visually; expect future requests to adjust offsets, scale, and cursor target positions.
- If changing auth, verify both Authentication and Firestore collections are updated for the relevant login/signup path.
