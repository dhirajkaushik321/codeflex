
# 🧪 Code Playground Feature – Step-by-Step Implementation Plan (Cursor Optimized)

You're building the world's best learning platform. This task focuses on introducing a **beautiful, reusable, and performant code playground** feature that can be embedded inside lessons and also exist as a standalone practice resource.

Our goal is to match or outperform top playgrounds like JSFiddle, CodeSandbox, RunJS, etc., while maintaining platform consistency, Quill Editor integration, and reusability.

---

## ✅ Phase 0: Cleanup & Setup

- [ ] Remove any existing dummy code editor components, placeholders, or unscalable playground widgets.
- [ ] Clean slate setup for isolated and reusable playground module.
- [ ] Define supported languages for Phase 1: `JavaScript`, `HTML`, `CSS`, `Python`.

---

## 🎯 Phase 1: Design + Layout Planning

### Embed Support in Lesson (Reference Screenshot Provided)

📌 Use existing layout:

```
| Sidebar (Course Tree) | Quill Editor + Playground | Settings Panel |
```

### When Creator Adds a Playground Block in Quill:
- It inserts a **“Playground Block” component** inside the rich text editor.
- Visually separated with a subtle shadow + card layout.
- Playground is collapsible/expandable while editing content.

### For Standalone Playgrounds:
- Render in full-page layout (like a separate “Page”):
  - Top Nav: Title, Duration, Tags, Save/Preview
  - Playground Area:
    ```
    | Editor Tabs (HTML/CSS/JS/Python) | Output / Console |
    ```
  - Option to open in fullscreen popup for distraction-free practice.

---

## ✨ Phase 2: Core Component Features (MVP)

### Editor Section

- Tabs for: HTML, CSS, JS, Python (Only visible if language is selected)
- Editor: Monaco or Sandpack with language modes enabled
- Starter code snippets can be pre-filled by the Creator
- Run Button: Compiles/Executes based on language
- Output Section:
  - JS/HTML/CSS → Live Preview iframe
  - Python → stdout console output

### UI/UX Enhancements

- Collapsible editor panels
- Dark theme with toggle
- Beautiful, animated tab transitions
- Resizable editor-output split
- Smooth focus animation on Run
- Placeholder text: “Write your code here…”
- “Reset Code” button with confirmation modal
- Auto-resize for better mobile support

---

## 🛠 Phase 3: Creator Workflow Integration

### From Sidebar (Course Tree):
- [ + Playground ] option at:
  - Course Level
  - Module Level
  - Lesson Level

### In Quill Editor:
- Creator inserts `/playground` block → Triggers component picker modal
- Select language → Playground block inserted with language name badge

### Settings Panel (Right):
- Title
- Description (Optional)
- Language Selector
- Estimated Practice Time
- Difficulty Level
- Tags Input
- Visibility Toggle (Draft / Published)

---

## 🔁 Reusability Strategy

- `PlaygroundComponent` must be fully reusable:
  - Can be dropped inside the Quill Editor
  - Can be rendered as a standalone route/page
  - Can be invoked in Preview Mode (`/preview/:id`)

- Use prop-driven configuration to control:
  - Language
  - Read-only mode
  - Initial code
  - Fullscreen toggle

---

## 🧩 Development Order

1. 🔧 Setup reusable `<Playground />` component
2. 🎨 Design UI for tabbed code editor + output
3. ⚙️ Create config schema for supported languages
4. 🧠 Add Quill integration: `/playground` slash command block
5. 🖼 Integrate into Lesson Page
6. 🌐 Setup standalone route `/playground/:id`
7. 🧪 Preview & read-only rendering support
8. 💾 Backend schema: `Playground` model
   - id, title, description, language, code_snippets, tags, visibility, etc.
9. 📤 API endpoints:
   - Create Playground
   - Update Playground
   - Fetch Playground
10. ✅ Final polish: dark/light theme, responsiveness, keyboard shortcuts, UX animations

---

## 🧠 Tips for Cursor Execution

- Prioritize UI polish and performance.
- Structure all logic into composable blocks.
- Use TailwindCSS  for consistent design system.
- Reuse logic where possible from Quiz/Page integrations.
- Keep language-specific behaviors modular (e.g. output rendering for JS vs Python).

---

## 📸 Figma References

- `embedded-playground` mockup 
---

## 🌍 Final Note

This is the foundation of a billion-user code practice experience. It must:
- Look visually stunning
- Work responsively and intuitively
- Be developer and creator friendly
- Allow for future extensibility: linting, error markers, AI-assist, collaborative coding.

No compromises. Go build a masterpiece.
