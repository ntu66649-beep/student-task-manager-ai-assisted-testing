# StudyFlow UI synchronization

Date: 2026-10-30. Branch: `codex/studyflow-ui`. Design reference: DuANE2E commit `36629698fd2d4aa1945ca11fe07cf27ac2c635a4`.

## Shared design

All seven projects share `design/studyflow-tokens.json`. Primary #7662cf, hover #6450bb, navy #191d33, canvas #f7f8fc, white panels, lavender #f0ecfc, ink #2b2d43. Buttons use a 9px corner radius, panels 12px, inputs 8px. System sans-serif typography uses Segoe UI with platform fallbacks.

Web apps use identical `css/studyflow-common.css` and `js/studyflow-common.js` plus a small layout adapter. Login story, form, demo account controls and StudyFlow branding are shared; project-specific controls stay available. Flutter implements the same design tokens in native widgets, with a responsive navy sidebar/header and split login.

## Preserved behavior

The existing REST API authentication, sessionStorage token, server data, CRUD, loading/error states, list/board modes and project-specific testing tools remain active. Native API usernames/passwords are retained.

## Validation

npm test: 31 E2E tests passed. npm run test:api: 15 passed. npm run demo:status: HEALTHY.

Visual QA checked the login and authenticated workspace. Browser verification covered the web apps at 320–1440px with no horizontal overflow or JavaScript errors in the checked flows.

## Maintenance

Update the shared token file and common CSS/JS consistently across the six web repositories, and map the same tokens into Flutter. Preserve each project’s backend, test tools and accessibility keys when changing presentation. Keep intentional failure demonstrations separate from normal test results.
