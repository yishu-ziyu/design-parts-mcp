(function(){
var D=window.PIXEL_DATA,Q=new URLSearchParams(location.search);
var CH='.abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',cidx={};for(var ci=0;ci<CH.length;ci++)cidx[CH[ci]]=ci;
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,still=Q.has('still');
var MONO='"JetBrains Mono",monospace';
var one=Q.get('scene');if(one){document.body.classList.add('one');document.getElementById(one).classList.add('on')}
function setup(k){
  var d=D[k],el=document.getElementById(k),inner=el.querySelector('.inner'),cv=el.querySelector('canvas'),ctx=cv.getContext('2d');
  inner.style.width=d.W+'px';inner.style.height=d.H+'px';
  var o={k:k,d:d,el:el,inner:inner,cv:cv,ctx:ctx,s:1,visible:true,ptr:{x:-999,y:-999,in:false}};
  function fit(){var w=el.clientWidth||d.W,s=w/d.W;o.s=s;el.style.height=(d.H*s)+'px';inner.style.transform='scale('+s+')';
    var dpr=Math.min(devicePixelRatio||1,2);cv.width=Math.round(d.W*s*dpr);cv.height=Math.round(d.H*s*dpr);o.sc=s*dpr;}
  fit();addEventListener('resize',fit);
  el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();o.ptr.x=(e.clientX-r.left)/o.s;o.ptr.y=(e.clientY-r.top)/o.s;o.ptr.in=true;o.touched=performance.now()});
  el.addEventListener('pointerleave',function(){o.ptr.in=false;o.ptr.x=-999});
  new IntersectionObserver(function(es){o.visible=es[0].isIntersecting}).observe(el);
  return o;
}
function bg(o){var c=o.ctx,d=o.d,S=o.sc;c.setTransform(S,0,0,S,0,0);c.fillStyle='#fdfdfd';c.fillRect(0,0,d.W,d.H);
  var px=d.p[0],py=d.p[1],ox=d.o[0],oy=d.o[1];if(o.k==='coin')return;c.fillStyle='#f7f8f7';
  for(var x=ox%px;x<d.W;x+=px)c.fillRect(x,0,1,d.H);for(var y=oy%py;y<d.H;y+=py)c.fillRect(0,y,d.W,1)}
function grid(d){return d.g.map(function(r){return r.split('').map(function(ch){return cidx[ch]})})}
function drawGrid(o,g,skip){var c=o.ctx,d=o.d,px=d.p[0],py=d.p[1],ox=d.o[0],oy=d.o[1];
  for(var j=0;j<g.length;j++)for(var i=0;i<g[j].length;i++){var v=g[j][i];if(!v||(skip&&skip(v,i,j)))continue;c.fillStyle=d.pal[v-1];c.fillRect(ox+i*px+.5,oy+j*py+.5,px-1,py-1)}}
function label(c,txt,x,y,size,col,halo){c.font='400 '+size+'px '+MONO;c.textBaseline='middle';if(halo){c.lineWidth=4;c.strokeStyle='rgba(255,255,255,.95)';c.lineJoin='round';c.strokeText(txt,x,y)}c.fillStyle=col;c.fillText(txt,x,y)}
var scenes={};

/* ---------- 地球 ---------- */
(function(){var o=setup('globe'),d=o.d,c=o.ctx,T=d.t.map(function(r){return r.split('').map(function(ch){return cidx[ch]})}),
  R=d.c[2],CX=d.c[0],CY=d.c[1],tilt=d.tilt*Math.PI/180,ct=Math.cos(tilt),st=Math.sin(tilt),px=d.p[0],py=d.p[1],ox=d.o[0],oy=d.o[1],
  rot=0,vel=reduce||still?0:5,drag=null,moved=0,marks=[];
  var stars=[[93,0],[853,93],[992,318],[82,772],[511,939],[875,950]];
  function lookup(x,y){var nx=(x-CX)/R,ny=-(y-CY)/R,r2=nx*nx+ny*ny;if(r2>=.985)return null;var nz=Math.sqrt(1-r2),y2=ny*ct-nz*st,z2=ny*st+nz*ct;
    var lon=Math.atan2(nx,z2)*180/Math.PI-rot,lat=Math.asin(Math.max(-1,Math.min(1,y2)))*180/Math.PI;return{lon:((lon%360)+360)%360,lat:lat}}
  function project(lon,lat){var la=lat*Math.PI/180,lo=(lon+rot)*Math.PI/180,y2=Math.sin(la),h=Math.cos(la),x=h*Math.sin(lo),z2=h*Math.cos(lo),
    ny=y2*ct+z2*st,nz=-y2*st+z2*ct;return{x:CX+x*R,y:CY-ny*R,front:nz>.05}}
  function snap(v,o0,p){return o0+Math.floor((v-o0)/p)*p}
  function fmt(lat,lon){var l=lon>180?lon-360:lon;return Math.abs(lat).toFixed(4)+'° '+(lat>=0?'N':'S')+' · '+Math.abs(l).toFixed(4)+'° '+(l>=0?'E':'W')}
  function addMark(x,y){var p=lookup(x,y);if(!p)return;var pts=[];for(var i=0,n=3+Math.floor(Math.random()*3);i<n;i++){var a=i/n*6.283+Math.random()*.8,r=7+Math.random()*9;pts.push({lat:p.lat+Math.sin(a)*r,lon:p.lon+Math.cos(a)*r*1.3})}
    marks.push({lat:p.lat,lon:p.lon,pts:pts,t0:performance.now(),n:n,lat0:fmt(p.lat,p.lon),s:(.2+Math.random()*.4).toFixed(2)});if(marks.length>3)marks.shift()}
  o.el.addEventListener('pointerdown',function(e){o.el.setPointerCapture(e.pointerId);var r=o.el.getBoundingClientRect();drag={x:(e.clientX-r.left)/o.s,rot:rot,lx:e.clientX,lt:performance.now()};moved=0;o.el.classList.add('drag')});
  o.el.addEventListener('pointermove',function(e){if(!drag)return;var r=o.el.getBoundingClientRect(),x=(e.clientX-r.left)/o.s;moved=Math.max(moved,Math.abs(x-drag.x));rot=drag.rot+(x-drag.x)/R*57.3;var n=performance.now();vel=(e.clientX-drag.lx)/o.s/R*57.3/Math.max(.008,(n-drag.lt)/1000);drag.lx=e.clientX;drag.lt=n});
  o.el.addEventListener('pointerup',function(e){if(moved<5){var r=o.el.getBoundingClientRect();addMark((e.clientX-r.left)/o.s,(e.clientY-r.top)/o.s);vel=reduce||still?0:5}drag=null;o.el.classList.remove('drag')});
  o.place=addMark;o.setRot=function(v){rot=v;vel=0};
  o.frame=function(dt,t){if(!drag){rot+=vel*dt;var base=reduce||still?0:5;vel+=(base-vel)*Math.min(1,dt*1.6)}
    bg(o);c.fillStyle='#868686';stars.forEach(function(s){c.fillRect(s[0],s[1],10,10)});
    var cols=Math.ceil((d.W-ox)/px),rows=Math.ceil((d.H-oy)/py),tw=d.tw,th=d.th;
    for(var j=-1;j<rows;j++)for(var i=-1;i<cols;i++){var x=ox+(i+.5)*px,y=oy+(j+.5)*py,p=lookup(x,y);if(!p)continue;var u=Math.floor(p.lon/360*tw)%tw,v=Math.min(th-1,Math.max(0,Math.floor((90-p.lat)/180*th))),idx=T[v][u];if(!idx)continue;
      c.fillStyle=d.pal[idx-1];c.fillRect(ox+i*px+.5,oy+j*py+.5,px-1,py-1)}
    /* 标记 */
    for(var m=marks.length-1;m>=0;m--){var mk=marks[m],a=(t-mk.t0)/1000;if(a>6.5){marks.splice(m,1);continue}
      var fade=a>5.5?1-(a-5.5):1,ce=project(mk.lon,mk.lat);if(!ce.front)continue;c.globalAlpha=fade;
      var sx=snap(ce.x,ox,px),sy=snap(ce.y,oy,py);
      mk.pts.forEach(function(q,qi){var e=project(q.lon,q.lat);if(!e.front)return;var ex=snap(e.x,ox,px),ey=snap(e.y,oy,py),pg=Math.min(1,Math.max(0,(a-qi*.08)/.35));if(pg<=0)return;
        var mx=(sx+ex)/2+(ey-sy)*.3,my=(sy+ey)/2-(ex-sx)*.3;c.strokeStyle='#1a1a1a';c.lineWidth=1.2;c.beginPath();c.moveTo(sx+px/2,sy+py/2);
        for(var u2=1;u2<=12*pg;u2++){var tt=u2/12,qx=(1-tt)*(1-tt)*(sx+px/2)+2*(1-tt)*tt*mx+tt*tt*(ex+px/2),qy=(1-tt)*(1-tt)*(sy+py/2)+2*(1-tt)*tt*my+tt*tt*(ey+py/2);c.lineTo(qx,qy)}c.stroke();
        if(pg>=1){c.fillStyle='#0f0f0f';c.fillRect(ex+.5,ey+.5,px-1,py-1)}});
      c.fillStyle='#e6ca76';c.fillRect(sx-px/2,sy-py/2,px*2-1,py*2-1);c.strokeStyle='#b29e5e';c.lineWidth=1;c.strokeRect(sx-px/2,sy-py/2,px*2-1,py*2-1);
      if(a>.3){var la=Math.min(1,(a-.3)/.25);c.globalAlpha=fade*la;label(c,mk.lat0,sx+42,sy-34,14.5,'#111',true);c.globalAlpha=fade*la*.62;label(c,'Sealed · '+mk.n+' witnesses · '+mk.s+' s',sx+42,sy-14,14.5,'#111',true)}
      c.globalAlpha=1}
  };
  scenes.globe=o})();

/* ---------- 小屋 ---------- */
(function(){var o=setup('house'),d=o.d,c=o.ctx,g=grid(d),count=1287,bursts=[],sc0=Math.round((586-d.o[0])/d.p[0]),sr0=Math.round((209-d.o[1])/d.p[1]);
  function lum0(h){var n=parseInt(h.slice(1),16);return((n>>16)&255)*.3+((n>>8)&255)*.6+(n&255)*.1}
  var darkSkip=function(v,i,j){if(j<sr0+1&&i>sc0-2)return true;if(j<sr0+3&&i>sc0+1)return true;return lum0(d.pal[v-1])<60&&j<sr0+9&&i>sc0-5&&i<sc0+5};
  function burst(t){bursts.push({t0:t});count++;if(bursts.length>4)bursts.shift()}
  o.el.addEventListener('pointerdown',function(){burst(performance.now());o.touched=performance.now()});
  o.burst=burst;var last=0;
  o.frame=function(dt,t){bg(o);drawGrid(o,g,darkSkip);
    if(!reduce&&!still&&t-last>1400&&(!o.touched||t-o.touched>2500)){last=t;burst(t)}
    /* 站点黑格 */
    c.fillStyle='#111';[[0,0],[-1,1],[0,1],[-1,2],[0,2],[0,3],[0,4]].forEach(function(p){c.fillRect(d.o[0]+(sc0+p[0])*d.p[0]+.5,d.o[1]+(sr0+p[1])*d.p[1]+.5,d.p[0]-1,d.p[1]-1)});
    /* 引线 + 文案 */
    c.strokeStyle='#111';c.lineWidth=1.1;c.beginPath();c.moveTo(592,212);c.lineTo(622,181);c.stroke();
    label(c,'Your station · witnessed '+count.toLocaleString('en-US')+' today',630,180,14.5,'#111',false);
    for(var b=bursts.length-1;b>=0;b--){var a=(t-bursts[b].t0)/1000;if(a>2.4){bursts.splice(b,1);continue}
      /* 环按格错峰亮起 */
      var n=30,R=88,cx=590,cy=209;for(var i=0;i<n;i++){var on=a-i*.022,al=on<0?0:on<.12?on/.12:a>1.5?Math.max(0,1-(a-1.5)/.5):1;if(al<=0)continue;var ang=-2.6+i/n*5.0,x=cx+Math.cos(ang)*R,y=cy+Math.sin(ang)*R;
        x=Math.round((x-d.o[0])/d.p[0])*d.p[0]+d.o[0];y=Math.round((y-d.o[1])/d.p[1])*d.p[1]+d.o[1];c.globalAlpha=al;c.fillStyle=i<n*.45?'#a9c1e4':i<n*.8?'#8fa5c6':'#7f91b0';if(i%3!==2||i<8)c.fillRect(x+.5,y+.5,9,9)}
      c.globalAlpha=1;
      var f=a<.25?a/.25:Math.max(0,1-(a-1.2)/1);if(f>0){c.globalAlpha=f;label(c,'+$0.002',506,180-Math.min(a,2.2)*16,14.5,'#9a8855',false);c.globalAlpha=1}}
  };
  scenes.house=o})();

/* ---------- 城区 ---------- */
(function(){var o=setup('city'),d=o.d,c=o.ctx,g=grid(d),px=d.p[0],py=d.p[1],ox=d.o[0],oy=d.o[1];
  var phone={x:845,y:253},target={x:845,y:253},dragging=false,t0=performance.now(),path=[[845,253],[770,470],[670,370],[845,253]],pi=0;
  var towers=[[692,338],[799,310],[706,546],[880,558],[505,484]];
  o.el.addEventListener('pointerdown',function(e){var r=o.el.getBoundingClientRect(),x=(e.clientX-r.left)/o.s,y=(e.clientY-r.top)/o.s;dragging=true;target.x=x-35;target.y=y-55;o.el.setPointerCapture(e.pointerId);o.touched=performance.now();t0=performance.now()});
  o.el.addEventListener('pointermove',function(e){if(!dragging)return;var r=o.el.getBoundingClientRect();target.x=(e.clientX-r.left)/o.s-35;target.y=(e.clientY-r.top)/o.s-55;o.touched=performance.now()});
  o.el.addEventListener('pointerup',function(){dragging=false;t0=performance.now()});
  var pt=0;
  o.frame=function(dt,t){bg(o);drawGrid(o,g);
    if(!reduce&&!still&&!dragging&&(!o.touched||t-o.touched>3000)){pt+=dt;if(pt>2.2){pt=0;pi=(pi+1)%path.length;target.x=path[pi][0];target.y=path[pi][1];t0=t}}
    phone.x+=(target.x-phone.x)*Math.min(1,dt*9);phone.y+=(target.y-phone.y)*Math.min(1,dt*9);
    var sx=ox+Math.round((phone.x-ox)/px)*px,sy=oy+Math.round((phone.y-oy)/py)*py;
    /* 手机：6×10 格 */
    for(var j=0;j<10;j++)for(var i=0;i<6;i++){var edge=i==0||i==5||j==0||j==1||j==8||j==9;c.fillStyle=edge?'#111':'#5a78b4';c.fillRect(sx+i*px+.5,sy+j*py+.5,px-1,py-1)}
    /* 弧线 */
    var a=(t-t0)/1000,arc=Math.min(1,a/.8),n=46,cx=sx+40,cy=sy+78,R1=196,R2=170;
    for(var k=0;k<n*arc;k++){var u=k/n,ang=-3.28+u*3.35,x=cx+Math.cos(ang)*R1,y=cy+Math.sin(ang)*R2,gx=ox+Math.round((x-ox)/px)*px,gy=oy+Math.round((y-oy)/py)*py;
      c.fillStyle=u<.55?'#a9c1e4':u<.85?'#8fa5c6':'#7f91b0';c.fillRect(gx+.5,gy+.5,px-1,py-1);if(k%2==0){c.fillRect(gx+px+.5,gy+py+.5,px-1,py-1)}}
    /* 引线和文字 */
    c.strokeStyle='#111';c.lineWidth=1.1;c.beginPath();c.moveTo(sx+46,sy-3);c.lineTo(sx+78,sy-34);c.stroke();label(c,'Your phone',sx+87,sy-36,15.5,'#111',true);
    label(c,'Arabian Sea',388,337,15.5,'#111',true);
    c.beginPath();c.moveTo(888,540);c.lineTo(921,508);c.stroke();label(c,'Station',929,507,15.5,'#111',true);
    /* 最近两座塔的延迟 */
    var sorted=towers.map(function(w){var dx=w[0]-sx,dy=w[1]-sy;return{w:w,dist:Math.sqrt(dx*dx+dy*dy)}}).sort(function(p,q){return p.dist-q.dist});
    sorted.slice(0,2).forEach(function(s){var us=(s.dist/40+1.2+Math.sin(t/300+s.w[0])*.04).toFixed(2);var mx=s.w[0]+10,my=s.w[1]-27;c.fillStyle='#d3b96a';c.fillRect(s.w[0]-2,s.w[1]-22,px-1,py-1);label(c,us+' μs',mx,my,15.5,'#555',true)});
  };
  scenes.city=o})();

/* ---------- 圆环 ---------- */
(function(){var o=setup('coin'),d=o.d,c=o.ctx,g=grid(d),px=d.p[0],py=d.p[1],ox=d.o[0],oy=d.o[1];
  function lum(h){var n=parseInt(h.slice(1),16);return((n>>16)&255)*.3+((n>>8)&255)*.6+(n&255)*.1}
  var ring=[],gold=[],sx=0,sy=0,n=0;
  for(var j=0;j<g.length;j++)for(var i=0;i<g[j].length;i++){var v=g[j][i];if(!v)continue;var col=d.pal[v-1],x=ox+i*px,y=oy+j*py;if(j*py+oy>440)continue;
    if(lum(col)<105){ring.push({x:x,y:y,col:col})}else{gold.push({x:x,y:y,col:col})}sx+=x;sy+=y;n++}
  var cx=sx/n,cy=sy/n,N=13,ch=[];for(var q=0;q<N;q++){var an=(q+.5)/N*6.283;ch.push({a:an,dx:0,dy:0,vx:0,vy:0})}
  ring.forEach(function(r){var a=Math.atan2(r.y-cy,r.x-cx);if(a<0)a+=6.283;var jit=(Math.sin(r.x*.31)+Math.cos(r.y*.27))*.02;r.c=Math.floor(((a+jit+6.283)%6.283)/6.283*N)%N;r.s=(r.x*7+r.y*13)%5});
  function burst(p){ch.forEach(function(k){var f=p*(.75+Math.random()*.5);k.vx+=Math.cos(k.a)*f+(Math.random()-.5)*120;k.vy+=Math.sin(k.a)*f+(Math.random()-.5)*120})}
  o.burst=burst;o.ch=ch;var press=false,last=0;
  o.el.addEventListener('pointerdown',function(){press=true;burst(850);o.touched=performance.now()});
  o.el.addEventListener('pointerup',function(){press=false});
  o.frame=function(dt,t){bg(o);var P=o.ptr;
    if(!reduce&&!still&&t-last>2600&&(!o.touched||t-o.touched>3000)){last=t;burst(720)}
    var maxd=0;if(!o.hold)ch.forEach(function(k){var mx=cx+Math.cos(k.a)*130+k.dx,my=cy+Math.sin(k.a)*130+k.dy;
      if(P.in){var dx=mx-P.x,dy=my-P.y,di=Math.sqrt(dx*dx+dy*dy);if(di<100){var f=(100-di)/100*2600;k.vx+=dx/(di+1)*f*dt;k.vy+=dy/(di+1)*f*dt}}
      var K=reduce?400:58,C=reduce?40:7.5;k.vx+=(-K*k.dx-C*k.vx)*dt;k.vy+=(-K*k.dy-C*k.vy)*dt;k.dx+=k.vx*dt;k.dy+=k.vy*dt;maxd=Math.max(maxd,Math.abs(k.dx)+Math.abs(k.dy))});
    var c2=c;ring.forEach(function(r){var k=ch[r.c],e=Math.min(1,(Math.abs(k.dx)+Math.abs(k.dy))/34);/* 散开时每格再缩一点，块边变圆 */
      var near=e*(.5+r.s*.1),rx=r.x-cx-k.dx*0,ry=r.y-cy;var gx=ox+Math.round((r.x+k.dx-ox)/px)*px,gy=oy+Math.round((r.y+k.dy-oy)/py)*py;
      c2.fillStyle=r.col;c2.fillRect(gx+.5,gy+.5,px-1,py-1)});
    /* 中心金币：按余弦变窄来表示翻转 */
    var ang=reduce||still?0:t/1000*2.2,sc=.46+.54*Math.abs(Math.cos(ang)),done={};
    gold.forEach(function(g2){var gx=cx+(g2.x-cx)*sc,sn=ox+Math.round((gx-ox)/px)*px,key=sn+','+g2.y;if(done[key])return;done[key]=1;c2.fillStyle=g2.col;c2.fillRect(sn+.5,g2.y+.5,px-1,py-1)});
  };
  scenes.coin=o;
  var pad=function(n){return(n<10?'0':'')+n},sealed=document.getElementById('sealed'),now=document.getElementById('now');
  function tick(){var d0=new Date(),s=pad(d0.getHours())+':'+pad(d0.getMinutes())+':'+pad(d0.getSeconds());now.textContent=s;if(!tick.s||!reduce&&d0.getSeconds()%4==0){sealed.textContent=s;tick.s=1}}tick();setInterval(tick,1000);
})();

window.PT=scenes;
var lastT=performance.now();
function loop(t){var dt=Math.min(.05,(t-lastT)/1000);lastT=t;for(var k in scenes){var o=scenes[k];if(!o.visible)continue;if(one&&one!==k)continue;o.ctx.setTransform(o.sc,0,0,o.sc,0,0);o.frame(dt,t);}requestAnimationFrame(loop)}
requestAnimationFrame(loop);
if(document.fonts)document.fonts.load('14px "JetBrains Mono"');
})();
