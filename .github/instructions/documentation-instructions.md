# Instructions for GitHub Copilot

## How Copilot Should Assist in This Project

### Documentation Generation

- When asked to document the project, generate clear, structured, and technically accurate documentation.
- Prefer Markdown output for summaries, architecture descriptions, and folder overviews.
- When documenting code, insert JSDoc‑style comments directly above functions, components, classes, and types.
- Provide high‑level summaries for files and folders, including purpose, responsibilities, and interactions.
- When asked to document the entire project, produce a single consolidated Markdown document containing:
  - Architecture overview
  - Folder‑level summaries
  - File‑level descriptions
  - Key functions and their roles
  - Data flow explanations
  - Missing documentation or unclear areas
  - Suggested improvements

### File‑Level Behavior

- When a file is open, analyze only that file unless explicitly asked to reference others.
- Provide:
  - A top‑level summary
  - Purpose of the file
  - Documentation for each function or component
  - Inputs, outputs, side effects
  - Usage examples when helpful

### Folder‑Level Behavior

- When a folder is selected, generate:
  - A summary of the folder’s purpose
  - A description of each file
  - How the files interact
  - A Markdown document as output

### React Components

- Document props, state, behavior, side effects, and usage examples.
- Highlight component responsibilities and expected interactions.

### TypeScript Types

- Document interfaces, types, enums, and generics with clear descriptions and examples.

### Utility Functions

- Add JSDoc comments including:
  - `@param` descriptions
  - `@returns` descriptions
  - Purpose and behavior

### Tone and Style

- Keep documentation concise, clear, and professional.
- Avoid unnecessary verbosity.
- Use consistent terminology across all generated documentation.
- Prefer actionable, structured output over long prose.
