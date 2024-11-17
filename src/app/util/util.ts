import { PDFDocumentProxy } from "pdfjs-dist";
import { TextItem } from "pdfjs-dist/types/src/display/api";

export const madeupTextForPDF = async (pdfDocument: PDFDocumentProxy) => {
  let texts = "";
  for (let i = 1; i <= pdfDocument.numPages; i++) {
    const page = await pdfDocument.getPage(i);
    const textContent = await page.getTextContent();
    textContent.items.forEach((textItem) => {
      console.log(textItem);
      if ((textItem as TextItem).height) {
        texts += (textItem as TextItem).str;
        if ((textItem as TextItem).str) {
          texts += "\n";
        }
      }
    });
  }
  // pdfDocument

  return texts;
};
