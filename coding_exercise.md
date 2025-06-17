# 📘 Phase 1: Minimal Viable Coding Exercise Component (with Sandpack)

## ✅ Goal

Implement a **minimal but polished and reusable coding exercise component** using `sandpack-react` for the Code Editor. This will be used by Creators to:

- Add JavaScript-based coding exercises inside lessons.
- Learners can view the problem and interactively write and run code with test cases.
- This component must also be reusable as a **standalone code playground** without problem statements/test cases.
- We're building the **world's best platform**, so this playground must be **modern**, **visually appealing**, **interactive**, and deliver a delightful experience for both creators and learners.

## 🚀 Technologies

- `sandpack-react` for code editor and preview.
- `react-hook-form` or similar for test case form handling.
- Styling: Tailwind CSS 

---
We have already created feature to embeed playground inside pages to run snippets.So see if you can can re-use something or need to develop separate component.

## 🧱 Component Name

`<ExercisePlayground />`

### Props:

```ts
{
  mode: 'creator' | 'learner';
  initialCode: string;
  testCases?: Array<{ input: string; expectedOutput: string }>;
  description: string;
  title: string;
}
```

---

## 🧩 Component Layout (UI Structure)

```
┌───────────────────────────────────────────────┐
│ Title: JavaScript Sum Problem                │
│ Description: Markdown-rendered text          │
├───────────────────────────────────────────────┤
│               Sandpack Code Editor           │
│          (Theme toggle + Reset Code)         │
├───────────────────────────────────────────────┤
│ [Test Cases]                                  │
│  Input 1: "2, 3"   Output: "5"   ✅ Passed     │
│  Input 2: "-1, 1"  Output: "0"   ✅ Passed     │
├───────────────────────────────────────────────┤
│ [Run Code] [Reset]                            │
└───────────────────────────────────────────────┘
```

---

## 🎨 Design Details

- **Modern UI**: Clean borders, glassy buttons, Monaco font, good padding.
- **Visually Appealing**: Use subtle gradients, responsive layout, and animations.
- **Interactive**: Code run feedback, hover states, smooth UX.
- **Code Editor Area**:
  - Sandpack theme: `dark` and `light`
  - Toggle themes
  - Editor height \~400px
- **Description**: Rendered with `react-markdown`, collapsible on mobile.
- **Test Cases**:
  - Creators can add them in a form (in mode: `creator`)
  - Learners see only summary + pass/fail after running
- **Output Display**:
  - `console.log` redirected into custom output panel

---

## 🧠 Step-by-Step Implementation Plan

### Step 1: Setup Sandpack
Already installed 

```bash
npm install @codesandbox/sandpack-react
```

Create a component `<SandpackEditor />` with:

```tsx
<Sandpack
  template="vanilla"
  theme="auto"
  files={{
    "/index.js": initialCode
  }}
  options={{
    showConsole: true,
    showTabs: false,
    showLineNumbers: true
  }}
/>
```

### Step 2: Create `ExercisePlayground` Wrapper

```tsx
const ExercisePlayground = ({ mode, initialCode, description, title, testCases }) => {
  const [output, setOutput] = useState('');
  const [results, setResults] = useState([]);

  const handleRun = () => {
    // Evaluate JS with test cases and compare results
  };

  return (
    <div className="rounded-xl p-6 shadow bg-white dark:bg-zinc-900">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <ReactMarkdown className="prose dark:prose-invert mb-4">{description}</ReactMarkdown>
      <SandpackEditor initialCode={initialCode} />

      <div className="mt-4">
        <button onClick={handleRun}>Run Code</button>
        <TestCaseOutput results={results} />
      </div>
    </div>
  );
};
```

### Step 3: Evaluate Test Cases

Use `Function` constructor safely to evaluate user code:

```js
const runTests = (code, testCases) => {
  const userFn = new Function('input', `${code}; return solution(...input);`);
  return testCases.map(tc => {
    try {
      const input = JSON.parse(`[${tc.input}]`);
      const result = userFn(input);
      return {
        ...tc,
        result,
        passed: String(result) === tc.expectedOutput
      };
    } catch (e) {
      return { ...tc, error: true, passed: false };
    }
  });
};
```

### Step 4: Add Creator Mode Form

In `mode: 'creator'`, show a dynamic test case builder:

```tsx
<TestCaseForm onAdd={(newTC) => setTestCases([...testCases, newTC])} />
```

### Step 5: Build UI Polish

- Theme toggle (dark/light)
- Nice pass/fail icons
- Smooth animation on code run
- Highlight failed test cases

---

## ✅ Phase 1 Completion Criteria

- Working ExercisePlayground component for JS
- Clean UI/UX with dark/light theme toggle
- Interactive feedback with test case evaluation
- Reusable as both lesson-embedded and standalone playground

---

## 📦 Future Enhancements (Phase 2+)

- Multi-language support
- Hidden/public test cases
- Code scoring/AI feedback
- Editor collaboration

---

s