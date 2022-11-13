// check if it is dev Vercel preview or localhost
// help us to enable smth during development but do not let leak it to prod
export function isPreview() {
  return (
    globalThis?.window.document.location.href.search('honey-labs.vercel.app') >
      -1 || globalThis?.window.document.location.href.search('localhost') > -1
  );
}
