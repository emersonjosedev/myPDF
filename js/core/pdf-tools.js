/* pdf-tools.js - Wrappers importantes para pdf-lib operations */

export async function mergeFiles(fileList){
  const merged = await PDFLib.PDFDocument.create();
  for(const f of fileList){
    const arr = await f.arrayBuffer();
    const src = await PDFLib.PDFDocument.load(arr);
    const copied = await merged.copyPages(src, src.getPageIndices());
    copied.forEach(p=> merged.addPage(p));
  }
  return await merged.save();
}

export async function extractPages(file, pages){
  const arr = await file.arrayBuffer();
  const src = await PDFLib.PDFDocument.load(arr);
  const out = await PDFLib.PDFDocument.create();
  const total = src.getPageCount();
  const indices = pages.map(p=> p-1).filter(i=> i>=0 && i<total);
  const copied = await out.copyPages(src, indices);
  copied.forEach(p=> out.addPage(p));
  return await out.save();
}

export async function splitRange(file, start, end){
  const arr = await file.arrayBuffer();
  const src = await PDFLib.PDFDocument.load(arr);
  const out = await PDFLib.PDFDocument.create();
  const total = src.getPageCount();
  const s = Math.max(1, start); const e = Math.min(end, total);
  const indices = Array.from({length: e - s + 1}, (_,i)=> s - 1 + i);
  const copied = await out.copyPages(src, indices);
  copied.forEach(p=> out.addPage(p));
  return await out.save();
}

export async function addWatermark(file, text){
  const arr = await file.arrayBuffer();
  const pdf = await PDFLib.PDFDocument.load(arr);
  const pages = pdf.getPages();
  for(const p of pages){
    const { width, height } = p.getSize();
    p.drawText(text, { x: width/6, y: height/2, size: 48, rotate: PDFLib.degrees(-30), opacity: 0.15 });
  }
  return await pdf.save();
}

export async function addPageNumbers(file){
  const arr = await file.arrayBuffer();
  const pdf = await PDFLib.PDFDocument.load(arr);
  const pages = pdf.getPages();
  for(let i=0;i<pages.length;i++){
    const p = pages[i];
    const { width } = p.getSize();
    p.drawText(String(i+1), { x: width - 40, y: 20, size: 12 });
  }
  return await pdf.save();
}

export async function rotateAll(file, degrees){
  const arr = await file.arrayBuffer();
  const pdf = await PDFLib.PDFDocument.load(arr);
  pdf.getPages().forEach(p => p.setRotation(PDFLib.degrees(degrees)));
  return await pdf.save();
}

export async function signWithImage(file, sigFile){
  const arr = await file.arrayBuffer();
  const pdf = await PDFLib.PDFDocument.load(arr);
  const sigArr = await sigFile.arrayBuffer();
  let img;
  try{ img = await pdf.embedPng(sigArr); }
  catch(e){ img = await pdf.embedJpg(sigArr); }
  const pages = pdf.getPages();
  for(const p of pages){
    const { width } = p.getSize();
    p.drawImage(img, { x: width - 160, y: 40, width: 120 });
  }
  return await pdf.save();
}

export async function imagesToPdf(imageFiles){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  let first = true;
  for(const f of imageFiles){
    const data = await fileToDataURL(f);
    if(!first) doc.addPage();
    doc.addImage(data, 'JPEG', 20, 20, 560, 720);
    first = false;
  }
  const blob = doc.output('arraybuffer');
  return blob;
}

async function fileToDataURL(file){
  return new Promise((resolve,reject)=>{
    const r = new FileReader();
    r.onload = ()=> resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

// simple compress by re-saving (pdf-lib does not do aggressive compression)
export async function compressPdf(file){
  const arr = await file.arrayBuffer();
  const pdf = await PDFLib.PDFDocument.load(arr);
  const out = await pdf.save({ useObjectStreams: true });
  return out;
}

// Reorder pages given an array of 1-based indices
export async function reorderPages(file, order){
  const arr = await file.arrayBuffer();
  const src = await PDFLib.PDFDocument.load(arr);
  const out = await PDFLib.PDFDocument.create();
  const total = src.getPageCount();
  const indices = order.map(n => n-1).filter(i => i>=0 && i<total);
  const copied = await out.copyPages(src, indices);
  copied.forEach(p=> out.addPage(p));
  return await out.save();
}

// export functions for other modules
export default {
  mergeFiles, extractPages, splitRange, addWatermark, addPageNumbers, rotateAll, signWithImage, imagesToPdf, compressPdf, reorderPages
};
