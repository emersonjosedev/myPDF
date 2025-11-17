import PDFTools from '../core/pdf-tools.js';
import { downloadBlob } from '../utils/download.js';

export default { title:'Extrair páginas', desc:'Extraia páginas específicas', icon:'📤',
  render(){
    const w=document.createElement('div');
    w.innerHTML=`
      <h3>Extrair Páginas</h3>
      <input type="file" id="extractFile" accept="application/pdf">
      <input id="extractPages" placeholder="Ex: 2,5,7">
      <button id="extractBtn">Extrair</button>
      <div id="extractStatus"></div>
    `;
    w.querySelector('#extractBtn').addEventListener('click', async ()=>{
      const f=w.querySelector('#extractFile').files[0]; if(!f) return alert('Selecione um PDF');
      const pages = w.querySelector('#extractPages').value.split(',').map(x=>Number(x.trim())).filter(Boolean);
      if(!pages.length) return alert('Informe páginas');
      w.querySelector('#extractStatus').textContent='Processando...';
      try{ const out = await PDFTools.extractPages(f, pages); downloadBlob(out,'extracted.pdf'); w.querySelector('#extractStatus').textContent='Pronto'; }
      catch(e){ w.querySelector('#extractStatus').textContent='Erro: '+e.message }
    });
    return w;
  }
};
