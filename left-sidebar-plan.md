## 🎯 Task Objective:
Redesign and rebuild the **Left Sidebar** that shows the **Course Hierarchy** (Modules → Lessons → Pages) from scratch. Completely remove the existing sidebar component and all its associated logic, styles, imports, and files from the frontend.

---

## ✅ Functional & UX Requirements for the New Sidebar

Create a **new, modern sidebar** that delivers an exceptional user experience — fluid, intuitive, and visually elegant. This sidebar will serve as the central navigation and structural management panel for the course creator.

### Key Features to Implement:
1. **Inline Creation & Editing:**
   - Allow users to create/edit module, lesson, and page names directly within the hierarchy via inline fields.
   - Add tooltips and placeholder text for better UX.

2. **Inline Deletion with Confirmation:**
   - Delete any hierarchy item (module, lesson, page) with a small contextual menu or button (use icon-based UI).
   - Show confirmation modal before deletion.

3. **Drag & Drop Reordering:**
   - Make modules, lessons, and pages **draggable and sortable** using modern drag-and-drop UX patterns.
   - Smooth animations and transitions during reordering.

4. **Collapsible Hierarchy:**
   - Allow users to collapse/expand modules and lessons to manage long structures easily.
   - Use animated arrows/icons to indicate collapsed/expanded state.

5. **Editor Visibility Trigger:**
   - Clicking on a **Page** should load the **Quill Editor** in the center pane.
   - Clicking on a **Module or Lesson** should **not trigger the editor**.

6. **Visual Design & Feedback:**
   - Highlight the selected page with a soft highlight or indicator.
   - Use modern icons, hover animations, and a clean UI design system (Tailwind or similar utility classes).
   - Add subtle microinteractions (e.g., highlight on hover, transition on collapse, etc.).

---

## 🧪 Technical Guidance

- Use a modern drag-and-drop library like **dnd-kit**, **@dnd-kit/core**, or **React DnD**.
- Use **Framer Motion** or **Tailwind transition classes** for animations.
- Structure components clearly (e.g., `Sidebar`, `HierarchyTree`, `NodeItem`, etc.).
- Keep components small, reusable, and maintainable.
- Use context or global state if needed to track selected page or open items.

---

## 🎨 UI/UX Design Inspiration

Take visual and interaction inspiration from the following **top platforms**:

| Platform     | Inspiration Area |
|--------------|------------------|
| **Notion**   | Clean, collapsible content blocks, inline editing, hover controls |
| **Jira**     | Structured collapsible boards, drag-and-drop ordering |
| **Trello**   | Card-style drag-and-drop with smooth visuals |
| **Linear**   | Minimal, elegant sidebar navigation with inline actions |
| **ClickUp**  | Multi-level task hierarchy with collapsible tree and inline controls |
| **Super.so** | Minimal UI with delightful micro-interactions |
| **Figma**    | Layer tree with contextual buttons and smooth hierarchy management |

You can combine the best UX patterns from these to craft a sidebar that feels **modern, powerful, and seamless to use**.

---

## 🚀 Final Goal

Deliver a **world-class, visually delightful, and smooth sidebar experience** that sets a new standard for content authoring tools. It should be:

- Visually stunning
- Fast and responsive
- Intuitive for creators of all skill levels
- Animation-rich, yet performant

This sidebar will be one of the most frequently used parts of the authoring tool — it must be elegant, scalable, and a pleasure to interact with.
