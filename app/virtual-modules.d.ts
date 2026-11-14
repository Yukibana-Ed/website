/** The newest IDE release when the site was built; see `ideRelease` in vite.config.ts. */
declare module 'virtual:ide-release' {
  const release: import('./lib/ide-release').IdeRelease;
  export default release;
}
