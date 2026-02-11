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

      <ul id="fileList" style="
        list-style:none;
        padding:0;
        margin:10px 0;
        border:1px dashed #ccc;
      "></ul>

      <button id="mergeBtn">Juntar</button>
      <div id="mergeStatus"></div>
    `;

    const input = wrap.querySelector('#mergeFiles');
    const list  = wrap.querySelector('#fileList');
    const status = wrap.querySelector('#mergeStatus');

    let files = [];

    /* Atualiza lista visual */
    input.addEventListener('change', () => {
      files = Array.from(input.files);
      renderList();
    });

    function renderList(){
      list.innerHTML = '';
      files.forEach((file, index) => {
        const li = document.createElement('li');
        li.textContent = file.name;
        li.draggable = true;
        li.dataset.index = index;

        li.style.cssText = `
          padding:8px;
          border-bottom:1px solid #eee;
          cursor:grab;
          background:#fafafa;
        `;

        /* Drag events */
        li.addEventListener('dragstart', e => {
          e.dataTransfer.setData('index', index);
          li.style.opacity = '0.5';
        });

        li.addEventListener('dragend', () => {
          li.style.opacity = '1';
        });

        li.addEventListener('dragover', e => e.preventDefault());

        li.addEventListener('drop', e => {
          e.preventDefault();
          const from = Number(e.dataTransfer.getData('index'));
          const to = Number(li.dataset.index);

          const moved = files.splice(from, 1)[0];
          files.splice(to, 0, moved);

          renderList();
        });

        list.appendChild(li);
      });
    }

    /* Juntar PDFs respeitando a ordem visual */
    wrap.querySelector('#mergeBtn').addEventListener('click', async () => {
      if (!files.length) return alert('Escolha ao menos 1 PDF');

      status.textContent = 'Processando...';

      try {
        const out = await PDFTools.mergeFiles(files);
        downloadBlob(out, 'merged.pdf');
        status.textContent = 'Pronto ✔️';
      } catch (e) {
        status.textContent = 'Erro: ' + e.message;
      }
    });

    return wrap;
  }
};
