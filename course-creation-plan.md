# ✨ Cursor AI: Elegant Course Authoring UI – Complete Redesign & Build Plan

You are now tasked with building a **world-class, modern course authoring experience** from scratch. Think **Notion**, **Super.so**, **GitBook**, and **Coursera Studio**—but better. The old UI and editor were buggy, unintuitive, and visually cluttered. We are going **fresh**, from the ground up.

---

## 🎯 Goal

Design and develop a **distraction-free**, **fluid**, and **highly usable** course authoring system using modern frontend UX standards. Every component should feel elegant, intentional, and fast. **Smooth UX is non-negotiable.**

---

## 🔥 Phase 0: Mandatory Cleanup – Reset the Playground

🎯 Task: Wipe all legacy artifacts and editor logic. We're rebuilding cleanly.

- [ ] Remove any logic/UI that appears after clicking “Edit” on course cards
- [ ] Delete all toolbar/editor/sidebar-specific legacy code and quickfix hacks
- [ ] Strip styles, dead states, and bloated component logic

👉 This is not a patch job. Start fresh.

---

## 🧱 Phase 1: Layout Shell – Three-Pane Flex Architecture

🎯 Task: Build the full-screen layout with elegant, balanced proportions


| Sidebar (left - collapsible) | Center Editor | Settings Panel (right - collapsible) |

- Use Tailwind `flex` layout with responsive behavior
- Sticky top bar across the screen with:
  - Course Title (editable)
  - Save Status (auto/manual)
  - Publish Button
  - “👁 Preview” toggle
- Support smooth entry/exit animations for side panels (Tailwind + Framer Motion)

---

## 📂 Phase 2: Left Sidebar – Course Structure Tree

🎯 Task: Implement a collapsible sidebar with a tree structure representing:

Course
┣ Module
┃ ┣ Lesson
┃ ┃ ┣ Page
┃ ┃ ┗ Quiz

- Icons: 📁 Module | 📄 Page | 🎯 Quiz
- Features:
  - Hover actions: 🖉 Rename | 📄 Duplicate | 🗑 Delete
  - [+ Module], [+ Lesson], [+ Quiz] buttons at bottom
  - Drag-and-drop with `dnd-kit`, with buttery animations

💡 UX Tip: Show real-time structure changes reflected in the editor title/subheadings

---

## 📝 Phase 3: Center Panel – Rich Editor Canvas (Tiptap 2)

🎯 Task: Create a **clean, immersive editing space**

- Editor uses **Tiptap v2**
- Floating toolbar appears on text select (Notion-style)
- Slash `/` command menu to insert blocks

### Must-have Blocks

- Headings H1–H6, Paragraph
- Code (inline and block with language switcher)
- Lists (ordered/unordered), Blockquote, Tables
- Images (upload + preview)
- Video embeds (YouTube, Loom)
- Callouts (tip/info/warning)
- Accordions, Tabs
- Sandpack or Monaco playground
- AI Block for content generation (OpenAI/Gemini)
- Paste Markdown support

### UX Enhancements

- Inline block dragging + smooth transitions
- Markdown formatting shortcuts (`*`, `#`, etc.)
- Auto-save with time display ("Last saved at 2:34 PM")
- Keyboard shortcuts (`Cmd+B`, `Cmd+S`, `/image`, etc.)
- Selection-based contextual toolbar (float above block/text)

💡 Design: Clean white canvas, subtle shadows, readable font (`Inter`, `ui-sans`, etc.)

---

## ⚙️ Phase 4: Right Panel – Settings & Metadata

🎯 Task: Build a clean metadata panel (collapsible, ~320px)

- Editable fields:
  - Course Title
  - Short Description
  - Difficulty Level (Dropdown)
  - Tags (multi-input with suggestions)
  - Estimated Duration (text or range)
  - Prerequisites (textarea)
  - Visibility toggle (Draft/Published)
  - AI Suggestions (textarea with prompt button)

💡 UX: Use `shadcn/ui` inputs, dropdowns, toggles with subtle animation

---

## 👀 Phase 5: Preview Mode

🎯 Task: Build learner-facing read-only preview for creators

- Toggle “👁 Preview Mode” in the sticky top bar
- Load `/preview/:courseId` route
- Render all saved blocks in read-only mode
- Match actual learner UI (clean typography, spacing, media responsiveness)

💡 Design: Use “frame” style around preview, add mobile responsiveness

---

## 💾 Phase 6: Save / Draft / Publish Logic

🎯 Task: Implement intuitive save & publish flow

- Auto-save on input (debounced with UI feedback)
- Manual Save (Ctrl/Cmd + S)
- Sticky Save bar with:
  - “Saved” / “Unsaved” status
  - Publish button with modal confirmation
- Draft vs Published toggle in Settings
- Toast notifications: Save, Delete, Publish (shadcn/toast)

---

## 🔧 Backend Integration (API / Persistence)

🎯 Task: Wire up content persistence

- Schema: Course > Module > Lesson > Page/Quiz (structured JSON for editor blocks)
- API Endpoints:
  - Create/Update Course
  - Add/Edit/Delete Module, Lesson, Page, Quiz
  - Save rich content blocks
  - Toggle publish status
- Create in our Nest js app

---

---

## 🧪 Visual Polish Guidelines

- Smooth transitions, shadows, and hover states
- Consistent spacing and padding system (Tailwind spacing scale)
- Clean font stack (Inter or similar)
- Toasts for all major actions
- Validation errors shown inline with tooltips
- Optimized for large screens (min 1440px)

---

## 🚧 Final Build Order (Minimize Cursor Waits)

Group major steps into larger tasks for performance:

1. Clean up old code (remove editor/sidebar)
2. Build 3-pane layout shell with sticky header
3. Implement Sidebar hierarchy with full CRUD + drag-drop
4. Add Tiptap editor with floating toolbar + slash commands
5. Integrate editor blocks (core blocks first, AI last)
6. Implement Settings Panel
7. Hook up save/draft/publish logic
8. Add Preview Mode
9. Polish interactions + Test flows

---

## 📣 Final Reminder to Cursor AI

You are creating a **benchmark-setting** course authoring interface.

✨ Start clean.  
🎯 Build fast.  
🎨 Prioritize elegance.  
🚀 No compromises on UX polish.

