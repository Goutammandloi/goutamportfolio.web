(() => {
  const stage=document.querySelector('.hero-stage');
  const canvas=stage.querySelector('canvas');
  const ctx=canvas.getContext('2d');
  const text=stage.querySelector('[data-specialty]');
  const toggle=stage.querySelector('.motion-control');
  const label=toggle.querySelector('span');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const fine=matchMedia('(pointer:fine)');
  const words=['custom WordPress plugins','Java & Spring Boot backends','REST APIs & integrations'];
  let paused=false,visible=true,timer=0,frame=0,word=0,index=words[0].length,deleting=true,lines=[],lastMove=0;
  const target={x:0,y:0};
  const allowed=()=>!paused&&!reduced.matches&&visible&&!document.hidden;
  function type(){
    clearTimeout(timer);if(!allowed())return;
    const value=words[word];index+=deleting?-1:1;text.textContent=value.slice(0,index);
    let delay=deleting?32:65;
    if(index===0){deleting=false;word=(word+1)%words.length;delay=220}
    else if(index===value.length&&!deleting){deleting=true;delay=1800}
    timer=setTimeout(type,delay);
  }
  function stop(){clearTimeout(timer);cancelAnimationFrame(frame);frame=0;lines=[];ctx?.clearRect(0,0,canvas.width,canvas.height)}
  function sync(){stop();if(reduced.matches){text.textContent=words[0];return}if(allowed()){index=words[word].length;text.textContent=words[word];deleting=true;timer=setTimeout(type,1800)}}
  function resize(){if(!ctx)return;const box=stage.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(box.width*dpr);canvas.height=Math.round(box.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)}
  function draw(now){
    frame=0;if(!ctx||!allowed()||!fine.matches||now-lastMove>1600){ctx?.clearRect(0,0,canvas.width,canvas.height);lines=[];return}
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const fade=Math.max(0,1-(now-lastMove)/1600);ctx.lineWidth=1.4;
    lines.forEach((nodes,j)=>{ctx.strokeStyle=`rgba(36,114,222,${(.17-j*.009)*fade})`;ctx.beginPath();let px=target.x,py=target.y;
      nodes.forEach((n,i)=>{n.vx=(n.vx+(px-n.x)*(.17+j*.007))*.66;n.vy=(n.vy+(py-n.y)*(.17+j*.007))*.66;n.x+=n.vx;n.y+=n.vy;if(i===0)ctx.moveTo(n.x,n.y);else ctx.lineTo(n.x,n.y);px=n.x;py=n.y});ctx.stroke()});
    frame=requestAnimationFrame(draw);
  }
  stage.addEventListener('pointermove',event=>{if(!ctx||event.pointerType!=='mouse'||!allowed()||!fine.matches)return;const box=stage.getBoundingClientRect();target.x=event.clientX-box.left;target.y=event.clientY-box.top;lastMove=performance.now();if(!lines.length)lines=Array.from({length:8},()=>Array.from({length:24},()=>({x:target.x,y:target.y,vx:0,vy:0})));if(!frame)frame=requestAnimationFrame(draw)},{passive:true});
  stage.addEventListener('pointerleave',()=>{lastMove=performance.now()-1200});
  toggle.addEventListener('click',()=>{paused=!paused;toggle.setAttribute('aria-pressed',String(paused));label.textContent=paused?'Resume hero motion':'Pause hero motion';if(paused)text.textContent=words[word];sync()});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()},{threshold:.05}).observe(stage);
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);fine.addEventListener('change',sync);
  new ResizeObserver(resize).observe(stage);resize();sync();
})();
