import AdmZip from "adm-zip";
import Database from "better-sqlite3";

export async function parseAnkiApkg(base64: string) {
  const zip = new AdmZip(Buffer.from(base64, "base64"));
  const entry = zip.getEntry("collection.anki2");
  if (!entry) throw new Error("APKG inválido");
  const db = new Database(entry.getData(), { readonly: true });
  const cards: { term: string; definition: string }[] = [];
  for (const { flds } of db.prepare("SELECT flds FROM notes").all() as any[]) {
    const [front, back] = flds.split("\u001F");
    if (front && back) cards.push({ term: front, definition: back });
  }
  db.close();
  return cards;
}
