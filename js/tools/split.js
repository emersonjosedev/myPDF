import PDFTools from '../core/pdf-tools.js';
import { downloadBlob } from '../utils/download.js';

export default {
  title:'Dividir PDF', desc:'Divida um PDF por intervalo de páginas', icon:'✂️',
  render(){
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <h3>Dividir PDF</h3>
      <input type="file" id="splitFile" accept="application/pdf">
      <input id="splitRange" placeholder="Ex: 1-3">
      <button id="splitBtn">Dividir</button>
      <div id="splitStatus"></div>
    `;
    wrap.querySelector('#splitBtn').addEventListener('click', async ()=>{
      const f = wrap.querySelector('#splitFile').files[0];
      if(!f) return alert('Selecione um PDF');
      const range = wrap.querySelector('#splitRange').value.split('-').map(x=>Number(x.trim()));
      if(range.length!==2) return alert('Use formato start-end (ex: 1-3)');
      wrap.querySelector('#splitStatus').textContent='Processando...';
      try{
        const out = await PDFTools.splitRange(f, range[0], range[1]);
        downloadBlob(out, 'split.pdf');
        wrap.querySelector('#splitStatus').textContent='Pronto';
      }catch(e){ wrap.querySelector('#splitStatus').textContent='Erro: '+e.message }
    });
    return wrap;
  }
};
