import { jsPDF } from 'jspdf';
import { BookChapter, BookProject } from '../types/wh40k';

/**
 * Generates and downloads a formatted PDF document using jsPDF.
 */
export async function generatePdf(
  book: BookProject,
  chaptersToExport: BookChapter[],
  options?: { customTitle?: string }
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const title = options?.customTitle || book.title;
  const author = book.author || 'Black Library';

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  let currentY = margin;

  // Title Page
  doc.setFillColor(15, 17, 22); // Deep grimdark
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Decorative border
  doc.setDrawColor(180, 130, 60); // Gold/brass
  doc.setLineWidth(0.8);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
  doc.setLineWidth(0.3);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  // Title page text
  doc.setTextColor(245, 230, 200);
  doc.setFont('times', 'bold');
  doc.setFontSize(24);
  const titleLines = doc.splitTextToSize(title.toUpperCase(), contentWidth);
  doc.text(titleLines, pageWidth / 2, 70, { align: 'center' });

  // Subtitle
  doc.setFontSize(13);
  doc.setFont('times', 'italic');
  doc.setTextColor(190, 170, 140);
  doc.text(`Autor: ${author}`, pageWidth / 2, 95, { align: 'center' });

  // Separator line
  doc.setDrawColor(180, 130, 60);
  doc.line(pageWidth / 2 - 40, 105, pageWidth / 2 + 40, 105);

  doc.setFontSize(10);
  doc.setFont('times', 'normal');
  doc.setTextColor(160, 150, 130);
  doc.text('WARHAMMER 40,000 • KANONICZNY PRZEKŁAD POLSKI', pageWidth / 2, 115, { align: 'center' });
  doc.text('ADEPTUS TRANSLATIO • COGITATOR LINGUARUM', pageWidth / 2, 122, { align: 'center' });

  // Motto
  doc.setFontSize(9);
  doc.setFont('times', 'italic');
  doc.setTextColor(130, 120, 100);
  doc.text('„Czystość słowa niesie wolę Imperatora.”', pageWidth / 2, pageHeight - 35, { align: 'center' });

  // Process chapters
  for (let cIdx = 0; cIdx < chaptersToExport.length; cIdx++) {
    const chapter = chaptersToExport[cIdx];
    doc.addPage();
    currentY = margin + 10;

    // Running Header
    doc.setFontSize(8);
    doc.setFont('times', 'normal');
    doc.setTextColor(130, 130, 130);
    doc.text(title.toUpperCase(), margin, 12);
    doc.text('WARHAMMER 40,000', pageWidth - margin, 12, { align: 'right' });
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(margin, 14, pageWidth - margin, 14);

    // Chapter Title
    doc.setFontSize(16);
    doc.setFont('times', 'bold');
    doc.setTextColor(50, 30, 15);
    const chTitleLines = doc.splitTextToSize(chapter.title.toUpperCase(), contentWidth);
    doc.text(chTitleLines, pageWidth / 2, currentY, { align: 'center' });
    currentY += chTitleLines.length * 8 + 4;

    // Small divider
    doc.setDrawColor(160, 120, 70);
    doc.setLineWidth(0.4);
    doc.line(pageWidth / 2 - 25, currentY, pageWidth / 2 + 25, currentY);
    currentY += 8;

    // Chapter Content
    const text = chapter.translatedText.trim() || chapter.sourceText.trim() || 'Brak treści.';
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);

    doc.setFontSize(10.5);
    doc.setFont('times', 'normal');
    doc.setTextColor(25, 25, 25);

    for (let pIdx = 0; pIdx < paragraphs.length; pIdx++) {
      const p = paragraphs[pIdx].trim();
      const lines = doc.splitTextToSize(p, contentWidth);
      const paragraphHeight = lines.length * 5.2 + 3.5;

      // Page break check
      if (currentY + paragraphHeight > pageHeight - margin) {
        // Add footer page number
        const pageNum = doc.getNumberOfPages();
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.text(`— ${pageNum} —`, pageWidth / 2, pageHeight - 10, { align: 'center' });

        doc.addPage();
        currentY = margin + 10;

        // Running Header on new page
        doc.setFontSize(8);
        doc.setFont('times', 'normal');
        doc.setTextColor(130, 130, 130);
        doc.text(title.toUpperCase(), margin, 12);
        doc.text('WARHAMMER 40,000', pageWidth - margin, 12, { align: 'right' });
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.2);
        doc.line(margin, 14, pageWidth - margin, 14);

        doc.setFontSize(10.5);
        doc.setFont('times', 'normal');
        doc.setTextColor(25, 25, 25);
      }

      doc.text(lines, margin, currentY);
      currentY += lines.length * 5.2 + 3.5;
    }

    // Footer page number for current chapter last page
    const pageNum = doc.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(`— ${pageNum} —`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  }

  const safeFilename = `${title.replace(/[^a-zA-Z0-9\-_]/g, '_')}_PL.pdf`;
  doc.save(safeFilename);
}

/**
 * Opens an elegant Imperial Print/Save-as-PDF view in a new window,
 * which renders high-resolution Google Fonts (Cinzel / Crimson Pro)
 * and allows the user to directly Print or Save as PDF with native vector quality.
 */
export function openImperialPrintView(
  book: BookProject, 
  chaptersToExport: BookChapter[],
  options?: { customTitle?: string }
): void {
  const title = options?.customTitle || book.title;
  const author = book.author || 'Black Library';

  const chaptersHtml = chaptersToExport.map((ch, idx) => {
    const text = ch.translatedText.trim() || ch.sourceText.trim() || 'Brak treści.';
    const paragraphs = text
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 0)
      .map(p => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
      .join('\n');

    return `
      <section class="chapter-page">
        <header class="chapter-header">
          <div class="super-title">Warhammer 40,000 • Rozdział ${idx + 1}</div>
          <h2>${ch.title}</h2>
          <div class="divider">✦ 𝕴 ✦</div>
        </header>
        <div class="chapter-body">
          ${paragraphs}
        </div>
      </section>
    `;
  }).join('\n');

  const fullHtml = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <title>${title} - Warhammer 40K (PL)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4;
      margin: 20mm 18mm;
      @bottom-center {
        content: counter(page);
        font-family: 'Cinzel', serif;
        font-size: 9pt;
        color: #777;
      }
    }
    body {
      font-family: 'Crimson Pro', Georgia, serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #1a1a1a;
      background: #fff;
      margin: 0;
      padding: 0;
    }
    .print-toolbar {
      position: sticky;
      top: 0;
      background: #11141a;
      color: #e5d5be;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 1000;
    }
    .print-btn {
      background: #96612b;
      color: white;
      border: 1px solid #c2884a;
      padding: 8px 18px;
      font-family: 'Cinzel', serif;
      font-weight: bold;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
    }
    .print-btn:hover {
      background: #b87735;
    }
    @media print {
      .print-toolbar { display: none !important; }
      body { background: transparent; }
      .chapter-page { page-break-before: always; }
      .title-page { page-break-after: always; }
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 30px;
    }
    .title-page {
      text-align: center;
      padding: 150px 20px 80px;
      border: 2px solid #b3864d;
      margin-bottom: 50px;
    }
    .title-page h1 {
      font-family: 'Cinzel', serif;
      font-size: 28pt;
      color: #2b1704;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .title-page .author {
      font-size: 14pt;
      font-style: italic;
      color: #666;
      margin-bottom: 40px;
    }
    .title-page .credo {
      font-family: 'Cinzel', serif;
      font-size: 10pt;
      color: #8b5d2b;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }
    .chapter-page {
      margin-bottom: 50px;
    }
    .chapter-header {
      text-align: center;
      margin-bottom: 24px;
    }
    .super-title {
      font-family: 'Cinzel', serif;
      font-size: 9pt;
      text-transform: uppercase;
      color: #888;
      letter-spacing: 1px;
    }
    .chapter-header h2 {
      font-family: 'Cinzel', serif;
      font-size: 18pt;
      color: #3b2207;
      margin: 6px 0;
    }
    .divider {
      color: #a67c47;
      font-size: 12pt;
      margin-top: 6px;
    }
    .chapter-body p {
      margin: 0 0 10px 0;
      text-indent: 1.5em;
      text-align: justify;
    }
    .chapter-body p:first-of-type {
      text-indent: 0;
    }
  </style>
</head>
<body>
  <div class="print-toolbar">
    <div>
      <strong style="font-family:'Cinzel', serif;">WARHAMMER 40,000</strong> — Podgląd wydruku / Zapis do PDF
    </div>
    <button class="print-btn" onclick="window.print()">🖨️ ZAPISZ JAKO PDF / DRUKUJ</button>
  </div>

  <div class="container">
    <div class="title-page">
      <h1>${title}</h1>
      <div class="author">Autor: ${author}</div>
      <div class="credo">Kanon Polski Black Library • Adeptus Translatio</div>
    </div>

    ${chaptersHtml}
  </div>
</body>
</html>`;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(fullHtml);
    printWindow.document.close();
  } else {
    alert('Przeglądarka zablokowała wyskakujące okno. Zezwól na wyskakujące okna dla tej witryny.');
  }
}
