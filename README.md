# Backstage Design System

Reusable UI components for Codelitt's internal tools, documented with Storybook.

## Quick Start

```bash
pnpm install
pnpm storybook
```

Open [http://localhost:6006](http://localhost:6006) to browse components.

## Components

| Category | Components |
|----------|-----------|
| **Components** | Button, Card, SectionHeader, Tag |
| **Form** | FormInput, FormLabel, FormSelect, SearchableSelect |
| **Feedback** | Toast, ErrorAlert, LoadingSpinner, EmptyState, Tooltip |
| **Data Display** | StatusIndicator, Pagination |

## Tech Stack

- React 19, TypeScript 5, Tailwind CSS 4
- Storybook 8 with Vite

## Build

```bash
pnpm build-storybook
```

Static output is generated in `storybook-static/`.
