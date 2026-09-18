/* DEWIFY brand icon — embedded 32px favicon derived from the supplied DEWIFY icon. */
(function(){
  const icon="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAF00lEQVR42u1WbWyW5RW+zrmf7/d9+361b1tKu1JQUDKV4TbHYlu2ZFEClZBUo7hkX5kSxyI/tmRbFtb92JwbmYmui9kfDcmytUyiDAkLLiKoTKm6TRAphrZ8lI+Ovn1b2r7P89z32Y/SgDOEt879WbiSJ09yP3nOuc65z7nOAa7j/wx06akY1hwM/0+gPtHo29oUmpsZg4OCTy6ymiRwXgP1BAwTUAvAEGoAGEN5VMNxknp4uG/y8j+bGThMQK8BIB+XgAKgXTexUph/D6AMgQIzmG1SlgN2fCgnIMtNxLaXOmf7VX3Ky20b2P+7PQIAbZst7O2KZ/zM8iCZSwYUAO14qW5i3jBjhMHKAVvuLAEoJ4DlpcBeFvCqYdz5Lyb8xkeP71zfL8ufttH3UHQ5OcLoIlMpgdmqJtdP7QXxF4kIRBaEbZBlg5UHsn0oJwH2MmWx8yzJxXbo3HTWSiy55+KLS/82r/M1/yS+oACE6KVwrtVNM/eYTwXpeGFgB5zLZYOGhsZcIpMr2LbrFC9OFd478sHaqRC3BqmCHptyY2SWu7F/86nG+U0dF0p0YzF707dlsd/E+ejXZqPzm9lMVEoAvp9rIEt92UvlkczPS35m2W0Xtj+75RCAHAAUR4rq3q8/vOnM+dFVR46eMF6qQevkpx0rqNs+9ub371/6g4srDxcSu6g2Pirr7cWAEEDCFThXAEQjvF0gz4Rh+ExxbOKpt/7+7kYA6ZHRUmNxfHwR2VbhLzv+sOuGRU2xnjjFVD6taPR1rUffWPPwVzcuoYWJNFoAzpttAIAeMABwBRmYqVqisjEmNkZfNNF0TJASAOM7NmVSgU6n43AKWHTrinbbRCUzWTpLJrog8q93rO1vnXvo/Rx+SX70/oLM+C8gQuiEqUQJL7dMrBm2ZYmJYhOHlkRlBUBCDQydQ2LfYHJBxGbtyo51cvLYD/HX3bswcryfw/zSeOS7WzZITg9Wl0dXH7ujtnRlJ/AclE7EaIiOYXQEHZcBQAyA/YPI7zjGbYcvULO4vrR/qZWaCnmg/RGZfnIfUy4aWHB+sHXkrtpj6OlRV7ZhxXLtOMEq20uJm8hPuelGqWtZtltEPj82PvmgSPygRKV1Tw7In77T/YJBamGE7+3R+LNE9jd/JkGi/gABQE+P+rjDCBoAi4GIgehIxMQGAE2GOtYhnKzjxxkPr27VC9ZR9z/ZHt4HevRzwgP9MJkCycRpAn00cmsu80JEBEbHAu3FkU4AQF2OSijH6r7n6e6dU2ZtXJM6aT/eUc9vvwJ4VYJcvQByAkQyq6wVEhD6iFYRk4CTYmKTscZfBzC9fqus2DPGq6cDbTo7uOu19rWrjh96twPZ+hhkgUAEUi/PGGgjYO+HvPDVnZMAJLhjk93ZI0pBPIonRgJdfOL2O9esnvejoaPzH8NjL40ll7XeZv927BteZ9WmB8KhoeGvcKbOQBSIXSVklRDbz83Y3WsqmYYz0rtoo5uOcn5psKtIAKoLTS3hjT9eYbd+q7E8inv12d2fyoZ9vcv1K286EvM7J8c/O3Ti1AMiKmDb02A7IjvpCfTm6dMHfwp0KqBXX4OAEPATQj081LU+T44/QW7NPvGzy5DP3wLCYnVmh8tHfgU692qZ2FPGSVvCNkAW2PZByo+gPIFT5Zh4endYKK5BX4u52m7wYQKdotBLGnd+0A2/ZgMcDczLAB7A/c9Bvf3zmEcORmSnCF41k3IB9oxYAeBmIFbWEbfAUD4kHNkW2amv4R9bJi/5MZXvhA11PloCIGvA/duhdj4OHjgA2IFFqWaL3SrAyUCcaojXAOM3Q7tNEDsTA9ZBROefMvvv23opYL6a86tcAQmePmgjvfwuPtDdwk88IgwQUrUCZUGxS/BrALce2m+A8ZfAVN2iTfKGMwjq38MfrUMQfWWBy7XWsmuAAeI5Lqebrf9yKRVCDxiHXiZ0rfyPb21XvNovnbUDhXbBzZC56vx1XMe/AftLWPgnyLtnAAAAAElFTkSuQmCC";
  let links=document.querySelectorAll('link[rel~="icon"]');
  if(!links.length){
    const link=document.createElement("link");
    link.rel="icon";
    document.head.appendChild(link);
    links=[link];
  }
  links.forEach(link=>{link.href=icon;link.type="image/png";});
})();

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

  const stars=[];
  const pointer={x:-9999,y:-9999,active:false};
  let dpr=1,w=0,h=0,worldH=0,raf=0,resizeTimer=0,initialized=false;
  let scrollTarget=0,scrollSmooth=0,lastTime=0;
  let flowTime=0;

  function addStar(x,y,r,a,gold){
    const phase=Math.random()*Math.PI*2;
    stars.push({x,y,ox:x,oy:y,tx:x,ty:y,cx:x,cy:y,r,a,gold,phase,speed:6+Math.random()*5,sway:3.5+Math.random()*5,swaySpeed:0.00022+Math.random()*0.00016});
  }
  function build(){
    stars.length=0;
    const mobile=window.innerWidth<700;
    const area=w*Math.max(worldH,h);
    const count=mobile?Math.max(280,Math.min(600,Math.floor(area/6000))):Math.max(380,Math.min(800,Math.floor(area/5600)));
    for(let i=0;i<count;i++){
      const roll=Math.random();let r,a;
      if(roll<0.24){r=0.95+Math.random()*0.55;a=0.82+Math.random()*0.16}else if(roll<0.44){r=0.50+Math.random()*0.34;a=0.22+Math.random()*0.22}else{r=0.72+Math.random()*0.58;a=0.56+Math.random()*0.30}
      addStar(Math.random()*w,Math.random()*worldH,r,a,Math.random()<.72);
    }
  }
  function updateWorldHeight(){const next=Math.max(h,document.documentElement.scrollHeight||0,document.body?.scrollHeight||0);if(Math.abs(next-worldH)>80){worldH=next;build()}else worldH=next}
  function repositionForResize(oldW,oldH){if(!initialized||!oldW||!oldH){build();return}const sx=w/oldW,sy=worldH/oldH;for(const s of stars){s.ox*=sx;s.oy*=sy;s.tx=s.ox;s.ty=s.oy;s.cx=s.ox;s.cy=s.oy-scrollSmooth}}
  function updateTargets(dt){const radius=145,maxDisplacement=18;flowTime+=dt;for(const s of stars){const wave=flowTime*s.swaySpeed+s.phase;const driftX=-(flowTime*0.001*s.speed)+(Math.sin(wave)*s.sway);const driftY=Math.sin(wave*0.78+s.phase*0.35)*s.sway*0.36;const rawX=s.ox+driftX;const worldX=((rawX%w)+w)%w;const worldY=s.oy+driftY;const viewX=worldX,viewY=worldY-scrollSmooth;const dx=viewX-pointer.x,dy=viewY-pointer.y,dist=Math.hypot(dx,dy);if(pointer.active&&dist<radius&&dist>0.001){const force=1-dist/radius,eased=force*force*(3-2*force);s.tx=viewX+(dx/dist)*eased*maxDisplacement;s.ty=viewY+(dy/dist)*eased*maxDisplacement}else{s.tx=viewX;s.ty=viewY}}}
  function draw(now){const dt=Math.min(32,Math.max(0,now-lastTime||16.7));lastTime=now;scrollSmooth+=(scrollTarget-scrollSmooth)*Math.min(1,dt*0.014);updateTargets(dt);ctx.clearRect(0,0,w,h);for(const s of stars){const smoothing=1-Math.pow(0.0008,dt/16.7);s.cx+=(s.tx-s.cx)*smoothing;s.cy+=(s.ty-s.cy)*smoothing;if(s.cy<-4||s.cy>h+4)continue;ctx.globalAlpha=s.a;ctx.fillStyle=s.gold?"#f6d887":"#fbf2d3";ctx.beginPath();ctx.arc(s.cx,s.cy,s.r,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1;raf=requestAnimationFrame(draw)}
  function applySize(){const oldW=w,oldH=worldH;dpr=Math.min(window.devicePixelRatio||1,1.25);w=window.innerWidth;h=window.innerHeight;worldH=Math.max(h,document.documentElement.scrollHeight||0,document.body?.scrollHeight||0);canvas.width=Math.floor(w*dpr);canvas.height=Math.floor(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);repositionForResize(oldW,oldH);initialized=true;if(!raf){lastTime=performance.now();raf=requestAnimationFrame(draw)}}
  function size(){clearTimeout(resizeTimer);resizeTimer=setTimeout(applySize,120)}
  window.addEventListener("scroll",()=>{scrollTarget=window.scrollY||window.pageYOffset||0;updateWorldHeight()},{passive:true});
  window.addEventListener("pointermove",e=>{pointer.x=e.clientX;pointer.y=e.clientY;pointer.active=true},{passive:true});
  window.addEventListener("pointerleave",()=>{pointer.active=false},{passive:true});
  window.addEventListener("blur",()=>{pointer.active=false});
  document.addEventListener("visibilitychange",()=>{if(!document.hidden)lastTime=performance.now()});
  if("ResizeObserver" in window){const ro=new ResizeObserver(updateWorldHeight);ro.observe(document.documentElement)}
  window.addEventListener("resize",size,{passive:true});
  applySize();
  updateWorldHeight();
})();