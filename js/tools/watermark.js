import PDFTools from '../core/pdf-tools.js';
import { downloadBlob } from '../utils/download.js';

export default { title:'Marca d\'água', desc:'Adiciona texto como marca d\'água', icon:'💧',
  render(){
    const w=document.createElement('div');
    w.innerHTML=`
      <h3>Marca d'água</h3>
      <input type="file" id="wmFile" accept="application/pdf">
      <input id="wmText" placeholder="Texto da marca (ex: CONFIDENCIAL)">
      <button id="wmBtn">Aplicar</button>
      <div id="wmStatus"></div>
    `;
    w.querySelector('#wmBtn').addEventListener('click', async ()=>{
      const f=w.querySelector('#wmFile').files[0]; if(!f) return alert('Selecione um PDF');
      const text = w.querySelector('#wmText').value || 'Confidencial';
      w.querySelector('#wmStatus').textContent='Processando...';
      try{ const out = await PDFTools.addWatermark(f, text); downloadBlob(out,'watermarked.pdf'); w.querySelector('#wmStatus').textContent='Pronto'; }
      catch(e){ w.querySelector('#wmStatus').textContent='Erro: '+e.message }
    });
    return w;
  }
};
