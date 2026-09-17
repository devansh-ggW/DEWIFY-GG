/* DEWIFY — galaxy starfield
   Continuous horizontal drift + scroll-reactive 3D galaxy/tornado warp.
   A mix of structured spiral stars and free wanderers keeps the field alive.
*/
(function(){
  "use strict";

  const canvas=document.getElementById("starfield");
  if(!canvas)return;
  const ctx=canvas.getContext("2d",{alpha:true});
  if(!ctx)return;

  const stars=[];
  const pointer={x:-9999,y:-9999,active:false};
  let dpr=1,w=0,h=0,raf=0,resizeTimer=0,initialized=false;
  let lastTime=0,flowTime=0;
  let scrollY=0,scrollLastY=0,scrollVelocity=0;
  let warp=0,warpTarget=0,galaxyAngle=0;

  function addStar(){
    const roll=Math.random();
    let type="galaxy";
    if(roll<0.26)type="wander";
    else if(roll>0.90)type="tornado";

    const angle=Math.random()*Math.PI*2;
    const radius=Math.pow(Math.random(),0.72);
    const arm=Math.floor(Math.random()*3);
    const depth=Math.random()*2-1;
    const rollBrightness=Math.random();
    let r,a;

    if(rollBrightness<0.22){
      r=1.0+Math.random()*0.6;
      a=0.84+Math.random()*0.15;
    }else if(rollBrightness<0.43){
      r=0.5+Math.random()*0.34;
      a=0.22+Math.random()*0.22;
    }else{
      r=0.72+Math.random()*0.58;
      a=0.56+Math.random()*0.30;
    }

    stars.push({
      type,
      angle,
      radius,
      arm,
      depth,
      r,
      a,
      gold:Math.random()<0.72,
      phase:Math.random()*Math.PI*2,
      driftX:(Math.random()*2-1)*0.9,
      driftY:(Math.random()*2-1)*0.9,
      driftSpeed:0.08+Math.random()*0.18,
      spin:0.00004+Math.random()*0.00008,
      wobble:0.8+Math.random()*2.2,
      cx:Math.random()*w,
      cy:Math.random()*h,
      tx:0,
      ty:0,
      screenR:r
    });
  }

  function build(){
    stars.length=0;
    const mobile=window.innerWidth<700;
    const count=mobile
      ? Math.max(380,Math.min(760,Math.floor((w*h)/4300)))
      : Math.max(520,Math.min(980,Math.floor((w*h)/3900)));
    for(let i=0;i<count;i++)addStar();
  }

  function resize(){
    dpr=Math.min(window.devicePixelRatio||1,1.25);
    w=window.innerWidth;
    h=window.innerHeight;
    canvas.width=Math.floor(w*dpr);
    canvas.height=Math.floor(h*dpr);
    canvas.style.width="100%";
    canvas.style.height="100%";
    ctx.setTransform(dpr,0,0,dpr,0,0);

    if(!initialized){
      build();
      initialized=true;
      return;
    }

    for(const s of stars){
      s.cx=Math.max(-30,Math.min(w+30,s.cx*(w/(w||1))));
      s.cy=Math.max(-30,Math.min(h+30,s.cy*(h/(h||1))));
    }
  }

  function update(dt){
    flowTime+=dt;

    const maxScrollWarp=1.0;
    const scrollImpulse=Math.min(1,Math.abs(scrollVelocity)*0.055);
    warpTarget=Math.min(maxScrollWarp,0.18+scrollImpulse*0.92);
    warp+=(warpTarget-warp)*Math.min(1,dt*0.012);

    /* The field keeps rotating slowly even without scrolling.
       Scrolling adds angular momentum so the galaxy visibly twists. */
    galaxyAngle+=dt*(0.00010+warp*0.00075);

    const cx=w*0.50;
    const cy=h*0.52;
    const maxR=Math.min(w,h)*0.73;
    const perspective=0.72+warp*0.56;

    for(const s of stars){
      if(s.type==="wander"){
        const wobble=Math.sin(flowTime*0.0009+s.phase)*s.wobble;
        const wobble2=Math.cos(flowTime*0.00075+s.phase*1.7)*s.wobble;
        s.cx+=s.driftX*s.driftSpeed*dt*0.06;
        s.cy+=s.driftY*s.driftSpeed*dt*0.06;
        s.cx+=Math.cos(s.phase+flowTime*0.00013)*dt*0.004*wobble;
        s.cy+=Math.sin(s.phase*1.7+flowTime*0.00011)*dt*0.004*wobble2;
        if(s.cx<-20)s.cx=w+20;
        if(s.cx>w+20)s.cx=-20;
        if(s.cy<-20)s.cy=h+20;
        if(s.cy>h+20)s.cy=-20;
        s.tx=s.cx;
        s.ty=s.cy;
        s.screenR=s.r*(0.86+0.18*((s.depth+1)*0.5));
        continue;
      }

      const armOffset=(s.arm*(Math.PI*2/3));
      const baseSpiral=s.angle+armOffset+galaxyAngle*(1.05+s.depth*0.22);
      const spiralTightness=2.8+warp*2.7;
      const stair=Math.sin(s.radius*28+s.phase)*0.045*warp;
      const spiral=baseSpiral+s.radius*spiralTightness+stair;
      const twist=warp*(0.55+s.radius*1.5)*(s.depth>=0?1:-0.74);

      let radius=maxR*(0.11+s.radius*0.98);
      const tornado=s.type==="tornado";
      if(tornado)radius*=0.72+0.22*Math.sin(s.radius*12+s.phase);

      const depthScale=0.56+(s.depth+1)*0.30;
      radius*=depthScale;

      const x=radius*Math.cos(spiral+twist);
      const y=radius*Math.sin(spiral+twist)*0.64;

      /* Scroll warp compresses the vertical axis and pulls stars toward
         a rotating funnel, giving the illusion of depth without WebGL. */
      const funnel=1-warp*(0.14+0.32*(1-s.radius));
      const px=x*funnel;
      const py=y*funnel;

      const parallaxX=Math.sin(flowTime*0.00032+s.phase)*7*(1-s.radius);
      const parallaxY=Math.cos(flowTime*0.00027+s.phase*0.7)*5*(1-s.radius);
      s.tx=cx+px+parallaxX;
      s.ty=cy+py+parallaxY;

      s.screenR=s.r*(0.58+depthScale*0.78)*(0.92+warp*0.28);
    }
  }

  function draw(now){
    const dt=Math.min(32,Math.max(0,now-lastTime||16.7));
    lastTime=now;

    const currentY=window.scrollY||window.pageYOffset||0;
    const dy=currentY-scrollLastY;
    scrollLastY=currentY;
    scrollY=currentY;
    scrollVelocity+=(dy/dt*16.7-scrollVelocity)*Math.min(1,dt*0.12);
    scrollVelocity*=Math.pow(0.91,dt/16.7);

    update(dt);
    ctx.clearRect(0,0,w,h);

    for(const s of stars){
      const smoothing=1-Math.pow(0.0007,dt/16.7);
      s.cx+=(s.tx-s.cx)*smoothing;
      s.cy+=(s.ty-s.cy)*smoothing;

      if(s.cy<-8||s.cy>h+8||s.cx<-8||s.cx>w+8)continue;

      const depthLight=0.76+((s.depth+1)*0.12);
      const localAlpha=Math.min(1,s.a*depthLight*(0.86+warp*0.20));
      ctx.globalAlpha=localAlpha;
      ctx.fillStyle=s.gold?"#f6d887":"#fbf2d3";

      ctx.beginPath();
      ctx.arc(s.cx,s.cy,s.screenR,0,Math.PI*2);
      ctx.fill();

      /* Tiny directional streak on the brightest/deepest stars makes the
         rotation read more like motion in a 3D space. */
      if(warp>0.34&&s.a>0.78&&s.type!=="wander"){
        const streak=1.5+warp*2.7*(0.5+Math.abs(s.depth));
        ctx.globalAlpha=localAlpha*0.25;
        ctx.fillRect(s.cx-streak,s.cy,s.screenR*0.7+streak*2,0.7);
      }
    }

    ctx.globalAlpha=1;
    raf=requestAnimationFrame(draw);
  }

  function handleScroll(){
    const y=window.scrollY||window.pageYOffset||0;
    const delta=y-scrollY;
    scrollVelocity+=delta*0.02;
    warpTarget=Math.min(1,0.28+Math.min(0.7,Math.abs(delta)*0.018));
  }

  window.addEventListener("scroll",handleScroll,{passive:true});
  window.addEventListener("pointermove",e=>{
    pointer.x=e.clientX;
    pointer.y=e.clientY;
    pointer.active=true;
  },{passive:true});
  window.addEventListener("pointerleave",()=>{pointer.active=false;},{passive:true});
  window.addEventListener("blur",()=>{pointer.active=false;});
  window.addEventListener("resize",()=>{
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(resize,120);
  },{passive:true});
  document.addEventListener("visibilitychange",()=>{
    if(!document.hidden)lastTime=performance.now();
  });

  resize();
  lastTime=performance.now();
  scrollLastY=window.scrollY||window.pageYOffset||0;
  raf=requestAnimationFrame(draw);
})();
