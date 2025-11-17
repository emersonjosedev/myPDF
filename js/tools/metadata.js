import { downloadBlob } from '../utils/download.js';

export default {
  title:'Editar metadados', desc:'Editar título e autor do PDF', icon:'ℹ️',
  render(){
    const w=document.createElement('div');
    w.innerHTML = `
      <h3>Editar Metadados</h3>
      <input type="file" id="metaFile" accept="application/pdf">
      <input id="metaTitle" placeholder="Título">
      <input id="metaAuthor" placeholder="Autor">
      <button id="metaBtn">Salvar</button>
      <div id="metaStatus"></div>
    `;
    w.querySelector('#metaBtn').addEventListener('click', async ()=>{
      const f = w.querySelector('#metaFile').files[0]; if(!f) return alert('Selecione um PDF');
      const title = w.querySelector('#metaTitle').value; const author = w.querySelector('#metaAuthor').value;
      w.querySelector('#metaStatus').textContent='Processando...';
      try{
        const arr = await f.arrayBuffer();
        const pdf = await PDFLib.PDFDocument.load(arr);
        if(title) pdf.setTitle(title);
        if(author) pdf.setAuthor(author);
        const out = await pdf.save();
        downloadBlob(out,'meta.pdf');
        w.querySelector('#metaStatus').textContent='Pronto';
      }catch(e){ w.querySelector('#metaStatus').textContent='Erro: '+e.message }
    });
    return w;
  }
};
