You are helping build a world-class EdTech platform that connects creators, students, and developers. The login and user system is already implemented.

Now we want to develop the **Course Creation feature (Authoring Tool)** for creators, where they can create rich, interactive learning materials. The goal is to create the **most advanced and intuitive course authoring tool** ever built, supporting modules, lessons, exercises, MCQs, assignments, challenges, interactive content, and AI-powered content generation.

### Platform Vision:
A professional-grade, clean, elegant UI that feels modern and world-class—backed by best practices in UI/UX, education workflows, and modular development.

---

### Task for Cursor AI:

👉 **Break down this complex feature into small, manageable dev tasks** and implement one thing at a time with a consistent component design system (e.g., Tailwind + Shadcn or Chakra). Follow clean architecture, reusable components, and maintain alignment with the overall platform theme.

---

### Functionality to Implement (in order):

1. **Creator Dashboard**
   - Show CTA: “Create New Course”
   - List of drafts and published courses
   - Analytics snippet (total learners, engagement, etc.)

2. **Course Creation Interface**
   - Two-pane layout:
     - **Left Panel**: Course hierarchy view (Modules → Lessons → Items)
     - **Right Panel**: Rich editor and form inputs for content creation

3. **Course Structure Hierarchy**
   - Course → Modules → Lessons → Pages + MCQs + Exercises + Assignments + Challenges + Interactive blocks

4. **Rich Authoring Tool**
   - Use **Tiptap** (preferred) or equivalent editor
   - Content blocks: text, code, media, tabs, images, AI-generated content
   - Monaco Editor or Sandpack for code exercises
   - Autosave, draft, preview, version history support

5. **AI Integration**
   - Suggest outlines, generate drafts, create quizzes/assignments from lesson content using Gemini/OpenAI
   - Allow creators to edit/approve generated content

6. **Preview System**
   - Toggle between “Creator View” and “Learner View”

7. **Course Metadata Management**
   - Title, description, level, tags, duration, outcomes

8. **Assignment & MCQ Builder**
   - Add/edit MCQs with difficulty, topic tags, explanations
   - Create coding exercises with test cases

9. **Reusable UI Components**
   - Cards, modals, tabs, form inputs, accordions, breadcrumbs

10. **Theming & UI Consistency**
    - Follow platform’s design system (colors, spacing, typography)
    - Responsive layout (mobile/tablet/desktop)

---

### Notes:
- Use modular file and folder structures.
- Always include loading states, error boundaries, and skeleton UIs.
- Include hooks like `useCreateCourse`, `useLessonForm`, etc. for logic separation.
- Aim for extensibility: allow future features like certifications, flashcards, collaborative mode.


