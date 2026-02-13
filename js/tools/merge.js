import PDFTools from '../core/pdf-tools.js';
import { downloadBlob } from '../utils/download.js';

export default {
  title: 'Juntar PDFs',
  desc: 'Combine vários arquivos PDF em um único documento',
  icon: '🧩',

  render() {
    const wrap = document.createElement('div');

    wrap.innerHTML = `
      <h3>Juntar PDFs</h3>

      <input type="file" id="mergeFiles" multiple accept="application/pdf">

      <div id="previewList" style="
        display:flex;
        gap:12px;
        flex-wrap:wrap;
        margin:15px 0;
      "></div>

      <button id="mergeBtn">Juntar</button>
      <div id="mergeStatus"></div>
    `;

    const input = wrap.querySelector('#mergeFiles');
    const previewList = wrap.querySelector('#previewList');
    const status = wrap.querySelector('#mergeStatus');

    let files = [];

    input.addEventListener('change', async () => {
      files = Array.from(input.files);
      await renderPreviews();
    });

    async function renderPreviews() {
      previewList.innerHTML = '';

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const card = document.createElement('div');
        card.draggable = true;
        card.dataset.index = i;

        card.style.cssText = `
  width:120px;
  border:1px solid #ccc;
  border-radius:6px;
  padding:6px;
  text-align:center;
  background:#fff;
  cursor:grab;
  position:relative;
`;
const removeBtn = document.createElement('button');
removeBtn.textContent = '✖';
removeBtn.title = 'Remover PDF';

removeBtn.style.cssText = `
  position:absolute;
  top:4px;
  right:4px;
  border:none;
  background:#ff4d4f;
  color:#fff;
  border-radius:50%;
  width:20px;
  height:20px;
  cursor:pointer;
  font-size:12px;
  line-height:18px;
`;

removeBtn.addEventListener('click', (e) => {
  e.stopPropagation(); // evita conflito com drag
  files.splice(i, 1);
  renderPreviews();
});

card.appendChild(removeBtn);

        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';

        const name = document.createElement('div');
        name.textContent = file.name;
        name.style.cssText = 'font-size:11px; margin-top:6px; word-break:break-all';

        card.appendChild(canvas);
        card.appendChild(name);
        previewList.appendChild(card);

        await renderPDFPreview(file, canvas);

        enableDrag(card);
      }
    }

    async function renderPDFPreview(file, canvas) {
      const buffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      const page = await pdf.getPage(1);

      const viewport = page.getViewport({ scale: 0.4 });
      const ctx = canvas.getContext('2d');

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: ctx, viewport }).promise;
    }

    function enableDrag(el) {
      el.addEventListener('dragstart', e => {
        e.dataTransfer.setData('from', el.dataset.index);
        el.style.opacity = '0.5';
      });

      el.addEventListener('dragend', () => {
        el.style.opacity = '1';
      });

      el.addEventListener('dragover', e => e.preventDefault());

      el.addEventListener('drop', e => {
        e.preventDefault();
        const from = Number(e.dataTransfer.getData('from'));
        const to = Number(el.dataset.index);

        const moved = files.splice(from, 1)[0];
        files.splice(to, 0, moved);

        renderPreviews();
      });
    }

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
