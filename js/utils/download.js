export function downloadBlob(data, filename){
  let blob;
  if(data instanceof ArrayBuffer || data instanceof Uint8Array) blob = new Blob([data], { type: 'application/pdf' });
  else if(data instanceof Blob) blob = data;
  else blob = new Blob([data], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=> URL.revokeObjectURL(url), 1500);
}

// also expose default
export default { downloadBlob };
