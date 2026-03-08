# Unity To React Migration Notes

Source Unity project:
- `C:\Users\alext\Cloud Repositories\Learning c`

Primary extracted logic file:
- `Assets/Scripts/InputManagers/InputReader.cs`

Generated extraction artifact:
- `src/data/unity-inputreader-map.json`

Extractor script:
- `scripts/extract-unity-inputreader.js`

## Current Findings

`InputReader.cs` contains 119 interactive handlers (`Q...` methods), grouped into 17 lesson IDs:
- `1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18`

No `Q10_*` methods were found in `InputReader.cs`. Lesson 10 behavior is likely static-content driven and/or encoded in scene wiring (`Assets/Scenes/Main.unity`) rather than this script.

Unlock lesson keys found in Unity logic:
- `output`
- `comments`
- `variables`
- `operators`
- `ifelse`
- `switch`
- `loops`
- `arrays`
- `userinput`
- `functions`
- `recursion`
- `files`
- `memorya`
- `memorym`

## React Route Mapping Notes

Current React lesson routes:
- `basics`
- `output`
- `comments`
- `variables`
- `booleans`
- `operators`
- `if-else`
- `switch-case`
- `loops`
- `arrays`
- `user-input`
- `memory`
- `functions`
- `recursion`
- `structs`
- `enums`
- `files`
- `memory-management`

Unity unlock keys use slightly different names in some cases:
- `ifelse` -> `if-else`
- `switch` -> `switch-case`
- `userinput` -> `user-input`
- `memorya` / `memorym` -> likely split between `memory` and `memory-management`

## Next Implementation Steps

1. Build a reusable lesson runtime in React for:
- static text/code screens
- multiple choice checks
- text input checks
- reveal/unlock progression

2. Add a mapping table from Unity lesson keys and handler IDs to React route slugs and step IDs.

3. Migrate lesson content and interactions in this order:
- beginner (`output`, `comments`, `variables`, `booleans`, `operators`)
- intermediate (`if-else`, `switch-case`, `loops`, `arrays`, `user-input`, `memory`)
- advanced (`functions`, `recursion`, `structs`, `enums`, `files`, `memory-management`)

4. Fill gaps by parsing scene text/wiring from `Assets/Scenes/Main.unity` where interaction text is not in `InputReader.cs`.
