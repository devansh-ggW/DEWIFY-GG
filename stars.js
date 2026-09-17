/* DEWIFY — smooth interactive starfield
   Continuous frame loop keeps motion fluid during scroll on mobile.
   One lightweight canvas, no images, no blur filters.
*/
(function(){
  "use strict";
  const canvas=document.getElementById("starfield");
  if(!canvas)return;
  const ctx=canvas.getContext("2d",{alpha:true});
  if(!ctx)return;

  const reduce=window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const stars=[];
  const pointer={x:-9999,y:-9999,active:false};
  let dpr=1,w=0,h=0,raf=0,resizeTimer=0,initialized=false;
  let scrollTarget=0,scrollSmooth=0,lastTime=0;

  function addStar(x,y,r,a,gold){
    stars.push({
      x,y,ox:x,oy:y,tx:x,ty:y,cx:x,cy:y,
      r,a,gold,parallax:0.018+Math.random()*0.018
    });
  }

  function build(){
    stars.length=0;
    const mobile=window.innerWidth<700;
    const count=mobile
      ? Math.max(110,Math.min(155,Math.floor((w*h)/8500)))
      : Math.max(145,Math.min(205,Math.floor((w*h)/7300)));
    for(let i=0;i<count;i++){
      const r=0.72+Math.random()*0.58;
      const a=0.56+Math.random()*0.30;
      addStar(Math.random()*w,Math.random()*h,r,a,Math.random()<.72);
    }
  }

  function repositionForResize(oldW,oldH){
    if(!initialized||!oldW||!oldH){build();return;}
    const sx=w/oldW,sy=h/oldH;
    for(const s of stars){
      s.ox*=sx;s.oy*=sy;
      s.tx=s.ox;s.ty=s.oy;s.cx=s.ox;s.cy=s.oy;
    }
  }

  function updateTargets(){
    const radius=145;
    const maxDisplacement=18;
    for(const s of stars){
      const baseY=s.oy+scrollSmooth*s.parallax;
      const dx=s.ox-pointer.x,dy=baseY-pointer.y;
      const dist=Math.hypot(dx,dy);
      if(pointer.active&&dist<radius&&dist>0.001){
        const force=1-dist/radius;
        const eased=force*force*(3-2*force);
        s.tx=s.ox+(dx/dist)*eased*maxDisplacement;
        s.ty=baseY+(dy/dist)*eased*maxDisplacement;
      }else{
        s.tx=s.ox;
        s.ty=baseY;
      }
    }
  }

  function draw(now){
    const dt=Math.min(32,Math.max(0,now-lastTime||16.7));
    lastTime=now;

    scrollSmooth+=(scrollTarget-scrollSmooth)*Math.min(1,dt*0.012);
    updateTargets();

    ctx.clearRect(0,0,w,h);
    for(const s of stars){
      const smoothing=1-Math.pow(0.0005,dt/16.7);
      s.cx+=(s.tx-s.cx)*smoothing;
      s.cy+=(s.ty-s.cy)*smoothing;
      ctx.globalAlpha=s.a;
      ctx.fillStyle=s.gold?"#f6d887":"#fbf2d3";
      ctx.beginPath();
      ctx.arc(s.cx,s.cy,s.r,0,Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha=1;

    raf=requestAnimationFrame(draw);
  }

  function applySize(){
    const oldW=w,oldH=h;
    dpr=Math.min(window.devicePixelRatio||1,1.25);
    w=window.innerWidth;
    h=window.innerHeight;
    canvas.width=Math.floor(w*dpr);
    canvas.height=Math.floor(h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    repositionForResize(oldW,oldH);
    initialized=true;
    if(!raf)raf=requestAnimationFrame(draw);
  }

  function size(){
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(applySize,120);
  }

  window.addEventListener("scroll",()=>{
    scrollTarget=window.scrollY||window.pageYOffset||0;
  },{passive:true});

  window.addEventListener("pointermove",e=>{
    pointer.x=e.clientX;
    pointer.y=e.clientY;
    pointer.active=true;
  },{passive:true});

  window.addEventListener("pointerleave",()=>{
    pointer.active=false;
  },{passive:true});

  window.addEventListener("blur",()=>{
    pointer.active=false;
  });

  document.addEventListener("visibilitychange",()=>{
    if(!document.hidden)lastTime=performance.now();
  });

  window.addEventListener("resize",size,{passive:true});
  applySize();
})();