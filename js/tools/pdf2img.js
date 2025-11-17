// uses pdf.js to render first page to canvas and export PNG
import { downloadBlob } from '../utils/download.js';

export default { title:'PDF → Imagem', desc:'Exporta páginas como PNG (usa pdf.js)', icon:'🖨️',
  render(){
    const w=document.createElement('div');
    w.innerHTML=`
      <h3>PDF → Imagem</h3>
      <input type="file" id="pdf2imgFile" accept="application/pdf">
      <input id="pdf2imgPages" placeholder="Páginas (ex: 1,2) - vazio = todas">
      <button id="pdf2imgBtn">Converter</button>
      <div id="pdf2imgStatus"></div>
    `;
    w.querySelector('#pdf2imgBtn').addEventListener('click', async ()=>{
      const f = w.querySelector('#pdf2imgFile').files[0]; if(!f) return alert('Selecione um PDF');
      w.querySelector('#pdf2imgStatus').textContent='Processando...';
      try{
        const array = await f.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({data: array}).promise;
        const total = pdf.numPages;
        const pagesInput = w.querySelector('#pdf2imgPages').value.trim();
        let pages = [];
        if(!pagesInput) pages = Array.from({length: total}, (_,i)=>i+1);
        else pages = pagesInput.split(',').map(x=>Number(x.trim())).filter(Boolean);
        for(const pnum of pages){
          const page = await pdf.getPage(pnum);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width; canvas.height = viewport.height;
          const ctx = canvas.getContext('2d');
          await page.render({ canvasContext: ctx, viewport }).promise;
          const blob = await new Promise(res=> canvas.toBlob(res, 'image/png'));
          downloadBlob(blob, `page-${pnum}.png`);
        }
        w.querySelector('#pdf2imgStatus').textContent='Pronto';
      }catch(e){ w.querySelector('#pdf2imgStatus').textContent='Erro: '+e.message }
    });
    return w;
  }
};
