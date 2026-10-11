import JSZip from 'jszip';
import { BookChapter, BookProject } from '../types/wh40k';

/**
 * Generates a valid EPUB (v3 / v2 compatible) file using JSZip
 * for a single chapter or the entire translated book.
 */
export async function generateEpub(
  book: BookProject, 
  chaptersToExport: BookChapter[],
  options?: { customTitle?: string }
): Promise<Blob> {
  const zip = new JSZip();

  const title = options?.customTitle || book.title;
  const author = book.author || 'Black Library / Adeptus Translatio';
  const bookId = `urn:uuid:${book.id}-${Date.now()}`;
  const nowIso = new Date().toISOString();

  // 1. mimetype (MUST be first and uncompressed)
  zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });

  // 2. META-INF/container.xml
  const containerXml = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;
  zip.file('META-INF/container.xml', containerXml);

  // 3. OEBPS/style.css
  const styleCss = `
body {
  font-family: Georgia, 'Crimson Pro', 'Times New Roman', serif;
  margin: 5% 8%;
  line-height: 1.6;
  color: #1a1a1a;
  background-color: #faf9f6;
}
h1, h2, h3 {
  font-family: 'Cinzel', Georgia, serif;
  text-align: center;
  margin-top: 1.5em;
  margin-bottom: 0.8em;
  color: #4a2c11;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
h1 {
  font-size: 1.8em;
  border-bottom: 1px solid #c4a47c;
  padding-bottom: 0.3em;
}
p {
  text-indent: 1.5em;
  margin: 0;
  text-align: justify;
}
p.first, p:first-of-type {
  text-indent: 0;
}
.cover-title {
  text-align: center;
  margin-top: 25vh;
}
.cover-title h1 {
  font-size: 2.2em;
  border-bottom: 2px solid #8c6239;
  padding-bottom: 0.5em;
  color: #2b1704;
}
.cover-author {
  text-align: center;
  font-style: italic;
  font-size: 1.2em;
  color: #555;
  margin-top: 1em;
}
.cover-footer {
  text-align: center;
  margin-top: 20vh;
  font-size: 0.85em;
  color: #777;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
hr.imperial {
  border: 0;
  height: 1px;
  background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(140,98,57,0.75), rgba(0,0,0,0));
  margin: 2em 0;
}
`;
  zip.file('OEBPS/style.css', styleCss);

  // 4. Chapter HTML files
  const chapterEntries: { id: string; filename: string; title: string }[] = [];

  // Title Page
  const titlePageHtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="pl" lang="pl">
<head>
  <title>${escapeXml(title)}</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
  <div class="cover-title">
    <h1>${escapeXml(title)}</h1>
    <div class="cover-author">${escapeXml(author)}</div>
    <hr class="imperial"/>
    <div class="cover-footer">Przekład polski z zachowaniem kanonu Warhammer 40,000<br/>Adeptus Translatio</div>
  </div>
</body>
</html>`;
  zip.file('OEBPS/title.xhtml', titlePageHtml);
  chapterEntries.push({ id: 'titlepage', filename: 'title.xhtml', title: 'Strona Tytułowa' });

  // Add individual chapters
  chaptersToExport.forEach((ch, idx) => {
    const chapterNum = idx + 1;
    const filename = `chapter_${chapterNum}.xhtml`;
    const chapterTitle = ch.title || `Rozdział ${chapterNum}`;
    const textContent = ch.translatedText.trim() || ch.sourceText.trim() || 'Brak treści.';

    const paragraphs = textContent
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 0)
      .map((p, pIdx) => `<p class="${pIdx === 0 ? 'first' : ''}">${escapeXml(p).replace(/\n/g, '<br/>')}</p>`)
      .join('\n    ');

    const chapterHtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="pl" lang="pl">
<head>
  <title>${escapeXml(chapterTitle)}</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
  <h2>${escapeXml(chapterTitle)}</h2>
  <hr class="imperial"/>
  <div class="chapter-content">
    ${paragraphs}
  </div>
</body>
</html>`;

    zip.file(`OEBPS/${filename}`, chapterHtml);
    chapterEntries.push({
      id: `chapter_${chapterNum}`,
      filename,
      title: chapterTitle
    });
  });

  // 5. OEBPS/toc.ncx (EPUB 2 compatibility)
  const navPoints = chapterEntries.map((c, i) => `
    <navPoint id="navpoint-${i + 1}" playOrder="${i + 1}">
      <navLabel><text>${escapeXml(c.title)}</text></navLabel>
      <content src="${c.filename}"/>
    </navPoint>`).join('');

  const tocNcx = `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="${bookId}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle><text>${escapeXml(title)}</text></docTitle>
  <docAuthor><text>${escapeXml(author)}</text></docAuthor>
  <navMap>
    ${navPoints}
  </navMap>
</ncx>`;
  zip.file('OEBPS/toc.ncx', tocNcx);

  // 6. OEBPS/nav.xhtml (EPUB 3 Navigation Document)
  const navListItems = chapterEntries.map(c => `<li><a href="${c.filename}">${escapeXml(c.title)}</a></li>`).join('\n        ');
  const navXhtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="pl" lang="pl">
<head>
  <title>Spis Treści</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
  <nav epub:type="toc" id="toc">
    <h1>Spis Treści</h1>
    <ol>
      ${navListItems}
    </ol>
  </nav>
</body>
</html>`;
  zip.file('OEBPS/nav.xhtml', navXhtml);

  // 7. OEBPS/content.opf
  const manifestItems = [
    `<item id="css" href="style.css" media-type="text/css"/>`,
    `<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>`,
    `<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>`,
    ...chapterEntries.map(c => `<item id="${c.id}" href="${c.filename}" media-type="application/xhtml+xml"/>`)
  ].join('\n    ');

  const spineItems = chapterEntries.map(c => `<itemref idref="${c.id}"/>`).join('\n    ');

  const contentOpf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookID" version="3.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${escapeXml(title)}</dc:title>
    <dc:creator>${escapeXml(author)}</dc:creator>
    <dc:language>pl</dc:language>
    <dc:identifier id="BookID">${bookId}</dc:identifier>
    <meta property="dcterms:modified">${nowIso.slice(0, 19)}Z</meta>
    <dc:publisher>Adeptus Translatio • Warhammer 40K Polish Canon</dc:publisher>
    <dc:description>Przekład powieści z uniwersum Warhammer 40,000 na język polski z zachowaniem oficjalnej terminologii Black Library.</dc:description>
  </metadata>
  <manifest>
    ${manifestItems}
  </manifest>
  <spine toc="ncx">
    ${spineItems}
  </spine>
</package>`;
  zip.file('OEBPS/content.opf', contentOpf);

  // Generate EPUB blob
  return await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/epub+zip',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
