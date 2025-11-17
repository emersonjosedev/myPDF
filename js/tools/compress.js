import PDFTools from '../core/pdf-tools.js';
import { downloadBlob } from '../utils/download.js';

export default { title:'Comprimir PDF', desc:'Compress básico regravando o PDF', icon:'🗜️',
  render(){
    const w=document.createElement('div');
    w.innerHTML=`
      <h3>Comprimir PDF</h3>
      <input type="file" id="compressFile" accept="application/pdf">
      <button id="compressBtn">Comprimir</button>
      <div id="compressStatus"></div>
    `;
    w.querySelector('#compressBtn').addEventListener('click', async ()=>{
      const f=w.querySelector('#compressFile').files[0]; if(!f) return alert('Selecione um PDF');
      w.querySelector('#compressStatus').textContent='Processando...';
      try{ const out = await PDFTools.compressPdf(f); downloadBlob(out,'compressed.pdf'); w.querySelector('#compressStatus').textContent='Pronto'; }
      catch(e){ w.querySelector('#compressStatus').textContent='Erro: '+e.message }
    });
    return w;
  }
};
