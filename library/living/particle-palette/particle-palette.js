(function(){
var P=[
 {id:'scatter-form',plate:'source-assets/plate-1.jpg',a:'Nature Informs',b:'Better ',w:'Solutions',col:'#3b8fe3',line:'#5a9ae0',dot:'#2467d6',
  poly:[[618,213],[338,338],[292,742],[637,521]],extra:[],
  L:[['NEXUS-03 / RESEARCH PROTOCOL',495,170],['BL-016 / CELL DIVISION',160,325],['BL-016 / CELL DIVISION',632,550],['MX-120 / CULTURE STUDY',241,749]],
  G:[['Regeneration and biological systems',517,192],['Intelligence and research',157,345],['Intelligence and research',157,447],['Distinctive, unusual identity',588,575],['Intelligence and research',188,777]]},
 {id:'two-tone',plate:'source-assets/plate-2.jpg',a:'A Deeper View of',b:'Individual ',w:'Health',col:'#ea7d3c',line:'#eaa071',dot:'#e8682a',
  poly:[[636,241],[258,328],[213,662],[361,797],[642,646]],extra:[[637,520,'#2467d6'],[292,742,'#2467d6']],
  L:[['NEXUS-03 / RESEARCH PROTOCOL',465,198],['BL-016 / CELL DIVISION',66,369],['MX-120 / CULTURE STUDY',57,642],['BL-016 / CELL DIVISION',392,793],['BL-016 / CELL DIVISION',624,674]],
  G:[['Regeneration and biological systems',488,215],['Intelligence and research',106,394],['Intelligence and research',34,664],['Intelligence and research',422,813],['Distinctive, unusual identity',624,699]]},
 {id:'diagram-frame',plate:'source-assets/plate-3.jpg',a:'Biology Builds a',b:'Brighter ',w:'Tomorrow',col:'#7fd052',line:'#a4d486',dot:'#7cbc52',
  poly:[[572,183],[239,350],[332,760],[565,475]],extra:[],
  L:[['NEXUS-03 / RESEARCH PROTOCOL',499,199],['BL-016 / CELL DIVISION',170,366],['BL-016 / CELL DIVISION',565,498],['MX-120 / CULTURE STUDY',277,773]],
  G:[['Regeneration and biological systems',551,222],['Intelligence and research',86,394],['Distinctive, unusual identity',604,522],['Intelligence and research',119,652],['Intelligence and research',539,790]]}
];
var Q=new URLSearchParams(location.search),one=Q.get('poster'),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches||Q.has('still');
var G=document.getElementById('gallery');if(one)document.body.classList.add('one');
var posters=P.map(function(p,idx){
  var el=document.createElement('section');el.className='poster'+(String(idx+1)===one?' on':'');el.id=p.id;
  var layer=document.createElement('div');layer.className='layer';
  var html='<h2 class="t">'+p.a+'<br>'+p.b+'<span style="color:'+p.col+'">'+p.w+'</span></h2>';
  var pts=p.poly.map(function(q){return q.join(',')}).join(' ');
  var svg='<svg viewBox="0 0 800 1000" aria-hidden="true"><polygon points="'+pts+'" fill="none" stroke="'+p.line+'" stroke-width="1.15"/>';
  p.poly.forEach(function(q){svg+='<circle cx="'+q[0]+'" cy="'+q[1]+'" r="4.6" fill="'+p.dot+'"/>'});
  p.extra.forEach(function(q){svg+='<circle cx="'+q[0]+'" cy="'+q[1]+'" r="4.6" fill="'+q[2]+'"/>'});
  svg+='</svg>';html+=svg;
  p.L.forEach(function(l){html+='<div class="l" style="left:'+l[1]+'px;top:'+l[2]+'px">'+l[0]+'</div>'});
  p.G.forEach(function(l){html+='<div class="g" style="left:'+l[1]+'px;top:'+l[2]+'px">'+l[0]+'</div>'});
  html+='<div class="f" style="left:30px">Individual health</div><div class="f" style="right:30px">Science in continuous progress</div>';
  layer.innerHTML=html;
  var cv=document.createElement('canvas');el.appendChild(cv);el.appendChild(layer);G.appendChild(el);
  var img=new Image();img.src=p.plate;
  var src=window.PARTICLES[idx],arr=src.map(function(a){var ang=Math.random()*6.283,di=500+Math.random()*700;return{x0:a[0],y0:a[1],r:a[2],c:'#'+a[3],x:reduce?a[0]:a[0]+Math.cos(ang)*di,y:reduce?a[1]:a[1]+Math.sin(ang)*di,vx:0,vy:0,k:40+Math.random()*30,d:6+Math.random()*3,dl:Math.random()*.5}});
  var st={p:p,el:el,cv:cv,ctx:cv.getContext('2d'),img:img,arr:arr,layer:layer,ptr:{x:-1e4,y:-1e4,in:false},age:0,dirty:true,visible:true,settled:reduce};
  var spk=[];for(var i=0;i<4200;i++){spk.push([120+Math.random()*560,110+Math.random()*760,.5+Math.random()*1.6,Math.random()])}st.spk=spk;
  function fit(){var w=el.clientWidth;st.s=w/800;layer.style.transform='scale('+st.s+')';var dpr=Math.min(devicePixelRatio||1,2);cv.width=Math.round(w*dpr);cv.height=Math.round(w*1.25*dpr);st.sc=st.s*dpr;st.dirty=true}
  fit();addEventListener('resize',fit);img.onload=function(){st.dirty=true};
  el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();st.ptr.x=(e.clientX-r.left)/st.s;st.ptr.y=(e.clientY-r.top)/st.s;st.ptr.in=true;st.settled=false});
  el.addEventListener('pointerleave',function(){st.ptr.in=false;st.ptr.x=-1e4});
  new IntersectionObserver(function(es){st.visible=es[0].isIntersecting;if(st.visible)st.dirty=true}).observe(el);
  return st;
});
function step(st,dt){
  st.age+=dt;var moving=0,R=86,px=st.ptr.x,py=st.ptr.y,on=st.ptr.in;
  for(var i=0;i<st.arr.length;i++){var a=st.arr[i];if(st.age<a.dl)continue;
    var ax=(a.x0-a.x)*a.k-a.vx*a.d,ay=(a.y0-a.y)*a.k-a.vy*a.d;
    if(on){var dx=a.x-px,dy=a.y-py;if(dx>-R&&dx<R&&dy>-R&&dy<R){var d2=dx*dx+dy*dy;if(d2<R*R){var d=Math.sqrt(d2)+.01,f=(R-d)/R*5200;ax+=dx/d*f;ay+=dy/d*f}}}
    a.vx+=ax*dt;a.vy+=ay*dt;a.x+=a.vx*dt;a.y+=a.vy*dt;
    if(Math.abs(a.vx)+Math.abs(a.vy)>.5||Math.abs(a.x-a.x0)+Math.abs(a.y-a.y0)>.3)moving++}
  if(!moving&&st.age>.7&&!on)st.settled=true;
}
function draw(st){var c=st.ctx,S=st.sc;c.setTransform(S,0,0,S,0,0);c.fillStyle='#fbf9f5';c.fillRect(0,0,800,1000);
  if(st.img.complete&&st.img.naturalWidth)c.drawImage(st.img,0,0,800,1000);
  c.fillStyle='#fff';for(var i=0;i<st.spk.length;i++){var s=st.spk[i];c.globalAlpha=.4+s[3]*.6;c.fillRect(s[0],s[1],s[2],s[2]*(.7+s[3]*.6))}c.globalAlpha=1;
  c.globalAlpha=.93;for(var j=0;j<st.arr.length;j++){var a=st.arr[j];c.fillStyle=a.c;c.beginPath();c.arc(a.x,a.y,a.r,0,6.283);c.fill()}c.globalAlpha=1;}
var last=performance.now();
function loop(t){var dt=Math.min(.03,(t-last)/1000);last=t;
  posters.forEach(function(st,idx){if(one&&String(idx+1)!==one)return;if(!st.visible)return;
    if(!st.settled&&!reduce){step(st,dt);st.dirty=true}
    if(st.dirty){draw(st);st.dirty=false}});
  requestAnimationFrame(loop)}
window.PP=posters;requestAnimationFrame(loop);
})();
