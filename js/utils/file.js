/* helpers de arquivo */
export function readAsArrayBuffer(file){
  return new Promise((res,rej)=>{
    const r=new FileReader(); r.onload=()=>res(r.result); r.onerror=rej; r.readAsArrayBuffer(file);
  });
}
export function readAsDataURL(file){
  return new Promise((res,rej)=>{
    const r=new FileReader(); r.onload=()=>res(r.result); r.onerror=rej; r.readAsDataURL(file);
  });
}
