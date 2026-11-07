document.querySelectorAll('.arrow-fill').forEach(button => {
  let timer;
  const release=()=>{clearTimeout(timer);timer=setTimeout(()=>{delete button.dataset.pressed},450)};
  button.addEventListener('pointerdown',event=>{if(event.pointerType==='mouse')return;clearTimeout(timer);button.dataset.pressed='true';button.setPointerCapture(event.pointerId)});
  button.addEventListener('pointerup',release);
  button.addEventListener('pointercancel',release);
  button.addEventListener('lostpointercapture',release);
  button.addEventListener('blur',()=>{clearTimeout(timer);delete button.dataset.pressed});
});
