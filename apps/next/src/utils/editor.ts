export function trimHTML(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const paragraphs = doc.getElementsByTagName("p");
  while (paragraphs[0] && paragraphs[0]!.textContent!.trim() === "") {
    paragraphs[0].parentNode?.removeChild(paragraphs[0]);
  }
  while (
    paragraphs[paragraphs.length - 1] &&
    paragraphs[paragraphs.length - 1]!.textContent!.trim() === ""
  ) {
    paragraphs[paragraphs.length - 1]!.parentNode?.removeChild(
      paragraphs[paragraphs.length - 1]!,
    );
  }
  return doc.body.innerHTML;
}
