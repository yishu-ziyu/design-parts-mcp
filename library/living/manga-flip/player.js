/* frame sequence player: one clock, preloads every frame, draws on a canvas */
function Player(o){const cv=o.canvas,ctx=cv.getContext('2d'),imgs=[];let cur=-1,want=0,playing=false,t0=0,start=0,ready=0;
 const url=i=>`source-assets/f/f${String(i).padStart(4,'0')}.jpg`;
 for(let i=0;i<o.n;i++){const im=new Image();im.decoding='async';im.onload=()=>{ready++;if(o.onload)o.onload(ready/o.n);if(i===want)show(want,true)};imgs[i]=im}
 let nxt=0;function pump(){while(nxt<o.n&&nxt-ready<8){imgs[nxt].src=url(nxt);nxt++}if(nxt<o.n)setTimeout(pump,40)}pump();
 function show(i,force){i=Math.max(0,Math.min(o.n-1,i));want=i;if(i===cur&&!force)return;const im=imgs[i];if(!im.complete||!im.naturalWidth){if(!im.src)im.src=url(i);return}cur=i;if(cv.width!==im.naturalWidth){cv.width=im.naturalWidth;cv.height=im.naturalHeight}(o.draw||((c,m)=>c.drawImage(m,0,0)))(ctx,im,cv);if(o.onframe)o.onframe(i)}
 function tick(t){if(!playing)return;let f=Math.floor(start+(t-t0)/1000*o.fps);if(f>=o.n){t0=t;start=0;f=0}show(f);requestAnimationFrame(tick)}
 return{play(){if(playing)return;playing=true;start=Math.max(cur,0);t0=performance.now();requestAnimationFrame(tick);o.onstate&&o.onstate(true)},pause(){playing=false;o.onstate&&o.onstate(false)},toggle(){playing?this.pause():this.play()},seek(i){show(i,true);start=i;t0=performance.now()},get cur(){return cur},redraw(){show(cur,true)},get playing(){return playing}}}
