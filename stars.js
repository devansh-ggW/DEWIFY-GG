/* DEWIFY — smooth interactive starfield
   Dense continuous starfield with cloud-like drift across the full page.
   Mixed brightness, gentle size variation, smooth scrolling, and repulsion.
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
  let dpr=1,w=0,h=0,worldH=0,raf=0,resizeTimer=0,initialized=false;
  let scrollTarget=0,scrollSmooth=0,lastTime=0;
  let flowTime=0;

  function addStar(x,y,r,a,gold){
    const phase=Math.random()*Math.PI*2;
    stars.push({
      x,y,ox:x,oy:y,tx:x,ty:y,cx:x,cy:y,
      r,a,gold,phase,
      speed:6+Math.random()*5,
      sway:3.5+Math.random()*5,
      swaySpeed:0.00022+Math.random()*0.00016,
      parallax:0.010+Math.random()*0.010
    });
  }

  function build(){
    stars.length=0;
    const mobile=window.innerWidth<700;
    const area=w*Math.max(worldH,h);
    const count=mobile
      ? Math.max(360,Math.min(700,Math.floor(area/5200)))
      : Math.max(480,Math.min(900,Math.floor(area/4700)));

    for(let i=0;i<count;i++){
      const roll=Math.random();
      let r,a;
      if(roll<0.24){
        r=0.95+Math.random()*0.55;
        a=0.82+Math.random()*0.16;
      }else if(roll<0.44){
        r=0.50+Math.random()*0.34;
        a=0.22+Math.random()*0.22;
      }else{
        r=0.72+Math.random()*0.58;
        a=0.56+Math.random()*0.30;
      }
      addStar(Math.random()*w,Math.random()*worldH,r,a,Math.random()<.72);
    }
  }

  function updateWorldHeight(){
    const next=Math.max(h,document.documentElement.scrollHeight||0,document.body?.scrollHeight||0);
    if(Math.abs(next-worldH)>80){
      worldH=next;
      build();
    }else{
      worldH=next;
    }
  }

  function repositionForResize(oldW,oldH){
    if(!initialized||!oldW||!oldH){build();return;}
    const sx=w/oldW;
    const sy=worldH/oldH;
    for(const s of stars){
      s.ox*=sx;
      s.oy*=sy;
      s.tx=s.ox;
      s.ty=s.oy;
      s.cx=s.ox;
      s.cy=s.oy-scrollSmooth;
    }
  }

  function updateTargets(dt){
    const radius=145;
    const maxDisplacement=18;
    flowTime+=dt;

    for(const s of stars){
      const wave=flowTime*s.swaySpeed+s.phase;
      const driftX=(flowTime*0.001*s.speed)+(Math.sin(wave)*s.sway);
      const driftY=Math.sin(wave*0.78+s.phase*0.35)*s.sway*0.36;
      const worldX=s.ox+driftX;
      const worldY=s.oy+driftY;
      const viewX=worldX;
      const viewY=worldY-scrollSmooth;

      const wrappedX=((viewX+w*0.5)%w+w)%w-w*0.5;
      const wrappedY=((viewY+h*0.5)%h+h)%h-h*0.5;

      const dx=wrappedX-pointer.x;
      const dy=wrappedY-pointer.y;
      const dist=Math.hypot(dx,dy);
      if(pointer.active&&dist<radius&&dist>0.001){
        const force=1-dist/radius;
        const eased=force*force*(3-2*force);
        s.tx=wrappedX+(dx/dist)*eased*maxDisplacement;
        s.ty=wrappedY+(dy/dist)*eased*maxDisplacement;
      }else{
        s.tx=wrappedX;
        s.ty=wrappedY;
      }
    }
  }

  function draw(now){
    const dt=Math.min(32,Math.max(0,now-lastTime||16.7));
    lastTime=now;

    scrollSmooth+=(scrollTarget-scrollSmooth)*Math.min(1,dt*0.014);
    updateTargets(dt);

    ctx.clearRect(0,0,w,h);
    for(const s of stars){
      const smoothing=1-Math.pow(0.0008,dt/16.7);
      s.cx+=(s.tx-s.cx)*smoothing;
      s.cy+=(s.ty-s.cy)*smoothing;
      if(s.cy<-4||s.cy>h+4)continue;
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
    const oldW=w,oldH=worldH;
    dpr=Math.min(window.devicePixelRatio||1,1.25);
    w=window.innerWidth;
    h=window.innerHeight;
    worldH=Math.max(h,document.documentElement.scrollHeight||0,document.body?.scrollHeight||0);
    canvas.width=Math.floor(w*dpr);
    canvas.height=Math.floor(h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    repositionForResize(oldW,oldH);
    initialized=true;
    if(!raf){
      lastTime=performance.now();
      raf=requestAnimationFrame(draw);
    }
  }

  function size(){
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(applySize,120);
  }

  window.addEventListener("scroll",()=>{
    scrollTarget=window.scrollY||window.pageYOffset||0;
    updateWorldHeight();
  },{passive:true});

  window.addEventListener("pointermove",e=>{
    pointer.x=e.clientX;
    pointer.y=e.clientY;
    pointer.active=true;
  },{passive:true});

  window.addEventListener("pointerleave",()=>{pointer.active=false;},{passive:true});
  window.addEventListener("blur",()=>{pointer.active=false;});

  document.addEventListener("visibilitychange",()=>{
    if(!document.hidden)lastTime=performance.now();
  });

  if("ResizeObserver" in window){
    const ro=new ResizeObserver(updateWorldHeight);
    ro.observe(document.documentElement);
  }

  window.addEventListener("resize",size,{passive:true});
  applySize();
  updateWorldHeight();
})();