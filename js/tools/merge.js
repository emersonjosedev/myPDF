import PDFTools from '../core/pdf-tools.js';
import { downloadBlob } from '../utils/download.js';

export default {
  title: 'Juntar PDFs',
  desc: 'Combine vários arquivos PDF em um único documento',
  icon: '🧩',
  render(){
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <h3>Juntar PDFs</h3>
      <input type="file" id="mergeFiles" multiple accept="application/pdf">
      <button id="mergeBtn">Juntar</button>
      <div id="mergeStatus"></div>
    `;
    wrap.querySelector('#mergeBtn').addEventListener('click', async ()=>{
      const files = wrap.querySelector('#mergeFiles').files;
      if(!files.length) return alert('Escolha ao menos 1 PDF');
      wrap.querySelector('#mergeStatus').textContent = 'Processando...';
      try{
        const out = await PDFTools.mergeFiles(Array.from(files));
        downloadBlob(out, 'merged.pdf');
        wrap.querySelector('#mergeStatus').textContent = 'Pronto';
      }catch(e){ wrap.querySelector('#mergeStatus').textContent = 'Erro: '+e.message }
    });
    return wrap;
  }
};
