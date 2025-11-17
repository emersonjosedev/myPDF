import PDFTools from '../core/pdf-tools.js';
import { downloadBlob } from '../utils/download.js';

export default { title:'Assinar PDF', desc:'Adicionar assinatura via imagem', icon:'✍️',
  render(){
    const w=document.createElement('div');
    w.innerHTML=`
      <h3>Assinar PDF</h3>
      <input type="file" id="signPdf" accept="application/pdf">
      <input type="file" id="signImg" accept="image/*">
      <button id="signBtn">Assinar</button>
      <div id="signStatus"></div>
    `;
    w.querySelector('#signBtn').addEventListener('click', async ()=>{
      const pdfFile = w.querySelector('#signPdf').files[0]; if(!pdfFile) return alert('Selecione um PDF');
      const imgFile = w.querySelector('#signImg').files[0]; if(!imgFile) return alert('Selecione a imagem da assinatura');
      w.querySelector('#signStatus').textContent='Processando...';
      try{ const out = await PDFTools.signWithImage(pdfFile, imgFile); downloadBlob(out,'signed.pdf'); w.querySelector('#signStatus').textContent='Pronto'; }
      catch(e){ w.querySelector('#signStatus').textContent='Erro: '+e.message }
    });
    return w;
  }
};
