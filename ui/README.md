# ACNH Tracker

A web application for tracking Animal Crossing: New Horizons items (fish, bugs, and sea creatures) across different profiles and regions.

## Features

- **Multi-Profile Support**: Create and manage multiple profiles for different players or save files
- **Item Tracking**: Track fish, bugs, and sea creatures with their availability by month and time
- **Region Support**: Switch between Northern and Southern hemispheres
- **Date/Time Simulation**: Set custom dates and times to check item availability
- **Profile Export/Import**: Export profiles as `.nt` files and import them to share or backup your data

## Profile Export/Import

### Exporting a Profile

1. Navigate to the Profiles section
2. Click the "Export Profile" button
3. The current profile will be downloaded as a `.nt` file with the profile name
4. The file contains JSON data with all your tracking information

### Importing a Profile

1. Navigate to the Profiles section
2. Click the "Import Profile" button
3. Select a `.nt` or `.json` file containing profile data
4. If a profile with the same ID already exists, you'll be prompted to overwrite it
5. The imported profile will be added to your profile list (or overwrite the existing one)
6. If there's an error, a notification will appear with details

### File Format

Profile files use the `.nt` extension and contain JSON data with the following structure:

```json
{
  "id": "unique-profile-id",
  "name": "Profile Name",
  "region": "north",
  "fish": {
    /* fish tracking data */
  },
  "bug": {
    /* bug tracking data */
  },
  "sea-creature": {
    /* sea creature tracking data */
  }
}
```

## Development

This project uses React + TypeScript + Vite with Material-UI components.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
