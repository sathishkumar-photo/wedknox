// LOCATION: raw.d.ts   (NEW FILE - project root, next to package.json)
// Lets TypeScript understand `import text from "./file.html?raw"`.
declare module "*?raw" {
  const content: string;
  export default content;
}