import PDFTools from '../core/pdf-tools.js';
import { downloadBlob } from '../utils/download.js';

export default { title:'Rotacionar páginas', desc:'Rotaciona as páginas por um ângulo', icon:'🔁',
  render(){
    const w=document.createElement('div');
    w.innerHTML=`
      <h3>Rotacionar PDF</h3>
      <input type="file" id="rotFile" accept="application/pdf">
      <input id="rotDeg" placeholder="Ex: 90">
      <button id="rotBtn">Rotacionar</button>
      <div id="rotStatus"></div>
    `;
    w.querySelector('#rotBtn').addEventListener('click', async ()=>{
      const f=w.querySelector('#rotFile').files[0]; if(!f) return alert('Selecione um PDF');
      const deg = Number(w.querySelector('#rotDeg').value) || 90;
      w.querySelector('#rotStatus').textContent='Processando...';
      try{ const out = await PDFTools.rotateAll(f, deg); downloadBlob(out,'rotated.pdf'); w.querySelector('#rotStatus').textContent='Pronto'; }
      catch(e){ w.querySelector('#rotStatus').textContent='Erro: '+e.message }
    });
    return w;
  }
};
