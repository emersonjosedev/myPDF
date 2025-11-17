/* main.js — inicializa UI e carrega módulos de ferramentas */
import * as PDFTools from './core/pdf-tools.js';
import './utils/download.js';
import './utils/file.js';

import mergeTool from './tools/merge.js';
import splitTool from './tools/split.js';
import extractTool from './tools/extract.js';
import compressTool from './tools/compress.js';
import img2pdfTool from './tools/img2pdf.js';
import pdf2imgTool from './tools/pdf2img.js';
import watermarkTool from './tools/watermark.js';
import rotateTool from './tools/rotate.js';
import signTool from './tools/sign.js';
import metadataTool from './tools/metadata.js';

const tools = [
  mergeTool,
  splitTool,
  extractTool,
  compressTool,
  img2pdfTool,
  pdf2imgTool,
  watermarkTool,
  rotateTool,
  signTool,
  metadataTool
];

const grid = document.getElementById('toolsGrid');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');

function renderTools(){
  grid.innerHTML = '';
  for(const t of tools){
    const el = document.createElement('div'); el.className='tool';
    el.innerHTML = `<div class="icon">${t.icon || '📄'}</div><div class="info"><h4>${t.title}</h4><p>${t.desc}</p></div><div class="star"></div>`;
    el.addEventListener('click', ()=> openTool(t));
    grid.appendChild(el);
  }
}

function openTool(tool){
  modal.style.display = 'flex';
  modalBody.innerHTML = '';
  const node = tool.render();
  modalBody.appendChild(node);
}

modalClose.addEventListener('click', ()=> modal.style.display='none');
modal.addEventListener('click', (e)=>{ if(e.target===modal) modal.style.display='none'; });

renderTools();

// expose for debugging
window.PDFTools = PDFTools;
