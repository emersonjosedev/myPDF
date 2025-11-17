import PDFTools from '../core/pdf-tools.js';
import { downloadBlob } from '../utils/download.js';

export default { title:'Imagem → PDF', desc:'Converter imagens para PDF', icon:'🖼️',
  render(){
    const w=document.createElement('div');
    w.innerHTML=`
      <h3>Imagem → PDF</h3>
      <input type="file" id="imgFiles" accept="image/*" multiple>
      <button id="img2pdfBtn">Converter</button>
      <div id="img2pdfStatus"></div>
    `;
    w.querySelector('#img2pdfBtn').addEventListener('click', async ()=>{
      const files = Array.from(w.querySelector('#imgFiles').files);
      if(!files.length) return alert('Selecione imagens');
      w.querySelector('#img2pdfStatus').textContent='Processando...';
      try{ const out = await PDFTools.imagesToPdf(files); downloadBlob(out,'images.pdf'); w.querySelector('#img2pdfStatus').textContent='Pronto'; }
      catch(e){ w.querySelector('#img2pdfStatus').textContent='Erro: '+e.message }
    });
    return w;
  }
};
