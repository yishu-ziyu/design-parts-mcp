(function(){
var Q=new URLSearchParams(location.search),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches||Q.has('still');
var view=document.getElementById('view'),cv=document.getElementById('gl'),hud=document.getElementById('hud');
var gl=cv.getContext('webgl2',{antialias:false,alpha:false});
var VS='#version 300 es\nin vec2 a;void main(){gl_Position=vec4(a,0,1);}';
var FS=`#version 300 es
precision highp float;
uniform vec2 res,bh,pan;uniform float t,scene,zoom,F,hy,gh,wh,alt,wideU,orbit,tiltU,grassX,px;uniform vec2 par;uniform vec4 vk,vA;uniform float vW;uniform vec4 hR,tR,hR2,tR2,hR3;uniform float plateMix,plateTele;
uniform sampler2D grass,field,house,truck,astro,diskT,house2,truck2,house3;
const float DIST=18.5,INCL=.17,ROLL=-.11,DIR=1.,DPOW=1.85,GAIN=1.0,WARP=.065;const vec3 WD=vec3(.0,.0,1.);
out vec4 o;
float sq(float x){return x*x;}
float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float n2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<5;i++){s+=a*n2(p);p=p*2.03+7.1;a*=.5;}return s;}
vec4 spr(sampler2D s,vec2 P,vec4 b){vec2 u=(P-b.xy)/b.zw;if(u.x<0.||u.y<0.||u.x>1.||u.y>1.)return vec4(0);return texture(s,u);}
vec3 ramp(float x){x=clamp(x,0.,3.);
  vec3 c=mix(vec3(.02,.006,.002),vec3(.20,.075,.018),smoothstep(0.,.22,x));
  c=mix(c,vec3(.55,.3,.09),smoothstep(.2,.55,x));
  c=mix(c,vec3(.84,.62,.3),smoothstep(.5,1.,x));
  c=mix(c,vec3(.97,.89,.68),smoothstep(.72,1.15,x));
  return mix(c,vec3(.99,.94,.8),smoothstep(1.15,2.1,x));}
const float RIN=1.5,ROUT=26.;
vec2 rot(vec2 v,float a){float c=cos(a),s=sin(a);return vec2(c*v.x-s*v.y,s*v.x+c*v.y);}
/* 盘面外圈向镜头这边翘起，让左侧尾巴走得更平 */
float gw(vec3 p){float r=length(p);return p.y+WARP*smoothstep(2.,12.,r)*dot(p,WD);}
float diskI(vec3 p,vec3 v,float path,inout float dustOut){
  float r=length(p);if(r<1.05||r>ROUT)return 0.;
  float th=atan(p.z,p.x)/6.28318;
  float sr=sqrt(r),sa=sqrt(RIN),sb=sqrt(ROUT);float u=(sr-sa)/(sb-sa);
  float om=.62*pow(r,-1.5);
  /* 两相交替，避免差速旋转把纹理越拧越细 */
  float ph=fract(t/90.),w=abs(ph*2.-1.);
  float fp=path/max(F,1.)/max(abs(v.y),.05);
  float lod=clamp(log2(max(fp*2048./(2.*sr*(sb-sa)),1e-4))+2.0,0.,6.);
  vec4 a=textureLod(diskT,vec2(th-om*ph*90.,u),lod),b=textureLod(diskT,vec2(th-om*fract(ph+.5)*90.+.37,u),lod);
  vec4 n=mix(a,b,w);
  float zf=smoothstep(.7,-.7,p.z/r);float rs=smoothstep(-.9,.6,p.x/r);float re=mix(mix(RIN,1.25,zf*(1.-rs)),2.42,zf*rs);
  float prof=smoothstep(re-.15,re+mix(.2,.65,zf),r)*pow(RIN/max(r,RIN),.86)*exp(-sq(max(r-3.,0.)/3.9));
  /* 粗带决定明暗层次，细流只调制，不到全黑，所以不会硬 */
  float band=.82+.44*smoothstep(.3,.72,n.b);
  float grainD=textureLod(diskT,vec2(th*7.+om*t*.05,u*4.3),1.).a;
  float fine=.84+.5*(n.g-.5)+.34*(n.r-.5)+.1*(grainD-.5);
  float vel=min(sqrt(.5/max(r-1.,.42)),.74);float gam=1./sqrt(max(1.-vel*vel,.05));
  vec3 tg=normalize(vec3(-p.z,0.,p.x))*DIR;
  float dop=1./(gam*(1.-vel*dot(tg,-v)));
  float I=prof*band*max(fine,.05)*pow(dop,DPOW)*1.25*(1.+.5*(1.-zf));
  /* 右前方的盘面几乎不亮，否则会和背面弯过来的光交叉 */
  I*=1.-.97*zf*smoothstep(-.05,.5,p.x/r)*smoothstep(3.,5.5,r);
  I*=1.-.62*smoothstep(.05,.7,p.x/r)*smoothstep(3.2,7.,r);
  /* 外圈变成细沙 */
  float sand=smoothstep(.975,.998,textureLod(diskT,vec2(th*3.-om*t*.12,u*2.6),0.).a)*exp(-sq(max(r-6.,0.)/8.))*smoothstep(3.,8.,r)*pow(dop,1.6);
  dustOut+=sand;
  return I;
}
/* 真实光线弯曲：屏幕方向 a,e 相对黑洞中心，返回亮度 x、沙粒 y、是否落入视界 z */
vec3 trace(vec2 ae){
  vec2 q=rot(ae,ROLL);
  vec3 ro=vec3(0.,0.,-DIST),rd=normalize(vec3(q.x,q.y,1.));
  float inc=INCL+tiltU;
  ro.yz=rot(ro.yz,inc);rd.yz=rot(rd.yz,inc);
  ro.xz=rot(ro.xz,orbit);rd.xz=rot(rd.xz,orbit);
  vec3 pos=ro,vel=rd;vec3 cr=cross(pos,vel);float h2=dot(cr,cr);
  float I=0.,gl=0.,dust=0.,path=0.,keep=1.,hole=0.;
  for(int i=0;i<84;i++){
    float r2=dot(pos,pos),r=sqrt(r2);
    if(r<1.02){hole=1.;break;}
    if(r>15.&&dot(pos,vel)>0.)break;
    float dt=clamp((r-.75)*.2,.022,1.1);
    /* 远处且已远离盘面时可跨大步 */
    vec3 acc=-1.5*h2*pos/(r2*r2*r);
    vec3 nv=vel+acc*dt,np=pos+nv*dt;
    gl+=exp(-abs(pos.y)*2.1/max(1.,r*.2))*smoothstep(RIN-.1,RIN+1.,r)*pow(RIN/r,2.1)*dt;
    float g0=gw(pos),g1=gw(np);if(g0*g1<0.){float f=g0/(g0-g1);vec3 hit=mix(pos,np,f);
      float e=diskI(hit,normalize(nv),path+dt*f+.001,dust);
      I+=keep*e;keep*=1.-clamp(e*.42,0.,.86);}
    path+=dt;pos=np;vel=nv;
  }
  return vec3(I+gl*.075*keep,dust,hole);
}
/* 绕黑洞漂浮的碎屑：按环带分格，每格一条沿切向的短线 */
float debris(vec2 ae,float cell,float seed,float dens,float lenK){
  float rho=length(ae);float th=atan(ae.y,ae.x)/6.28318+.5;
  float ring=floor(rho/cell);float n=max(5.,floor(6.28318*(ring+.5)));
  float rr=h21(vec2(ring,seed));
  float dth=(t*.006*(1.+rr))/(.25+rho*3.);
  float sc=floor(fract(th+dth+rr)*n);vec2 id=vec2(ring,sc+seed*13.);
  if(h21(id+.5)>dens)return 0.;
  float fu=fract(fract(th+dth+rr)*n),fv=rho/cell-ring;
  vec2 c=vec2(.2+.6*h21(id+1.7),.2+.6*h21(id+2.9));
  float arc=(fu-c.x)*6.28318*(ring+.5)/n;float dr=fv-c.y;
  float L=.015+lenK*pow(h21(id+4.1),5.);
  float tilt=(h21(id+5.3)-.5)*.5;dr-=tilt*arc;
  float d=length(vec2(max(abs(arc)-L,0.),dr));
  float w=px*(.9+.9*h21(id+6.2))/(F*cell);
  return smoothstep(w,w*.25,d)*(.25+.75*h21(id+7.1))*(L>.05?.8:1.);
}
vec3 aurum(vec2 P0){
  float yy=P0.y-hy;
  vec2 ae=vec2(P0.x-bh.x,bh.y-P0.y)/F;
  vec3 c;
  float wide=wideU;
  if(yy<0.){
    /* 天空：只有地平线以上才追光线 */
    vec3 tr=trace(ae);float I=tr.x,hole=tr.z;
    I+=tr.y*(.2+.12*wide);
    /* 视界下沿：真实光线弯曲只给出大形，下沿这道奶白的光带按原片再补一层 */
    vec2 nb=vec2(P0.x-bh.x,P0.y-bh.y)/(288.*F/2041.);
    float yc=.24-.3*sq(nb.x-.2);float db=nb.y-yc;
    float rnb=length(nb);
    float zone=smoothstep(-.015,.07,db)*smoothstep(1.62,1.02,rnb);
    float flow=n2(vec2(nb.x*2.2+3.,db*26.))*.62+n2(vec2(nb.x*5.,db*74.))*.38;
    float paint=mix(.92,.2,smoothstep(-1.05,.9,nb.x))*exp(-max(db,0.)/.46)*(.66+.68*flow);
    I*=1.-smoothstep(.985,.955,rnb)*smoothstep(.0,-.06,db);
    I=mix(I,paint,zone);
    hole*=1.-zone;
    I=I*.9/(1.+.14*I);
    /* 左下扇形尾巴的雾，把真实光线弯曲没铺满的地方填上 */
    float axS=(P0.x-bh.x)*2041./F,ayS=(P0.y-bh.y)*2041./F;float lf=max(-axS-120.,0.);
    float fanv=exp(-sq((ayS-(10.-lf*.13))/(52.+lf*.28)))*smoothstep(0.,220.,lf)*exp(-lf/620.);
    float gnF=h21(floor(P0/1.5)+3.);
    float fanN=texture(diskT,vec2(atan(ayS+40.,axS+500.)*.3,lf*.0006+.1),2.).g;
    I+=(1.-hole)*fanv*(.42+.5*fanN+.4*gnF*gnF*gnF)*.82;
    /* 盘外的细沙：屏幕坐标下约一两个像素，左侧多 */
    vec2 nA2=ae*F/(288.*F/2041.);float rhoS=length(nA2);
    float sandE=exp(-sq((rhoS-1.5)/(.62+.3*smoothstep(0.,-1.,nA2.x/max(rhoS,.1)))))*mix(.32,1.,smoothstep(.5,-.8,nA2.x/max(rhoS,.1)))*smoothstep(.0,.3,yy*-1./max(gh,1.));
    float gS=h21(floor(P0/mix(1.5,1.2,wide)+7.));I+=(1.-hole)*sandE*step(.9-.07*wide,gS)*(.5+.5*h21(floor(P0/1.5)+11.))*mix(.22,.55,wide);
    vec3 sky=ramp(I*GAIN)+vec3(.013,.0035,.001);
    /* 视界内是极暗的棕，由地平线的光从下往上染亮 */
    vec3 inner=vec3(.082,.034,.009);
    c=mix(sky,inner+ramp(I*GAIN)*.9,hole);
    /* 视界内缘的柔光：左下最强，把边缘融开 */
    float edgeD=max(.1426-length(ae),0.)*F*2041./F;
    float aL=smoothstep(.5,-.8,ae.x/max(length(ae),1e-3))*.6+.4*smoothstep(.2,-.9,ae.y/max(length(ae),1e-3));
    c+=vec3(.92,.66,.3)*exp(-edgeD/(9.+22.*aL))*hole*(.2+1.25*aL)*max(F/2041.,.5);
    float up=-yy;
    float xs=(P0.x-bh.x)/F;
    float xw=mix(.2,1.,exp(-sq((xs-.0)/(.26))));
    float glow=exp(-up/gh)*xw;
    float headroom=1.-.82*smoothstep(.45,1.1,dot(c,vec3(.33)));
    c+=vec3(.74,.5,.2)*glow*headroom;
    c+=vec3(.6,.42,.17)*exp(-up/(gh*.28))*xw*.75*headroom;
    float over=max(max(c.r,c.g)-.88,0.);c.gb+=over*vec2(.2,.7);
    c=mix(c,vec3(1.,.93,.75),clamp(exp(-up/7.)*mix(.14,.92,xw),0.,1.));
    /* 右侧视频里的横向扫描痕迹，贴着房子后面 */
    vec2 Qs=vec2((P0.x-bh.x)*2041./F,(P0.y-hy)*2041./F);
    c+=vec3(.14,.07,.018)*step(.72,n2(vec2(Qs.x*.008,Qs.y*.8)))*smoothstep(280.,440.,Qs.x)*smoothstep(-125.,-112.,Qs.y)*smoothstep(-70.,-85.,Qs.y)*(1.-hole);
    /* 飞线和星 */
    if(hole<.5){
      float a=mix(.3,1.,wide);a*=mix(1.,smoothstep(.0,.16,-yy/F*8.+.0)*.5+.5,wide);
      float d=debris(ae,.034,1.,.2,.3)+debris(ae,.021,2.,.17,.1)+debris(ae,.011,3.,.07,.04)*(.4+.6*wide);
      c+=vec3(.95,.86,.72)*d*a*.95;
    }else{
      c+=vec3(.5,.3,.1)*step(.9988,h21(floor((P0-bh)/2.)))*.4;
    }
  }else{
    /* 水面：列宽和行高都随透视变化，靠近底部朝灭点放射 */
    float rows=log(1.+yy/34.)*62.*mix(1.,1.7,smoothstep(1.1,1.8,F/2041.));
    float k=1./(1.+yy/120.);
    float xx=(P0.x-bh.x)*k*2041./F;
    float nA=n2(vec2(xx*.022+t*.09,rows*1.5));
    float nB=n2(vec2(xx*.009-t*.05,rows*.6+4.));
    float nC=n2(vec2(xx*.21,rows*2.4+t*.5));
    float sharp=clamp(F/2041.,.0,1.);
    float teleW=smoothstep(1.1,1.8,F/2041.);
    float gl=mix(1.,mix(.72+.3*nB+.32*nA,.66+.42*nB+.5*pow(nA,3.)+1.15*pow(nC,8.),teleW),smoothstep(.3,.85,sharp));
    float dark=exp(-yy/wh);
    float xw=mix(.34,1.,exp(-sq((P0.x-(bh.x+55.*F/2041.))/(1050.*max(F/2041.,.5)))));
    /* 明亮的倒影色：近地平线奶黄，往下成暗金 */
    vec3 wat=mix(vec3(.96,.76,.4),vec3(.82,.6,.25),smoothstep(0.,wh*.55,yy));wat=mix(wat,wat*vec3(.82,.76,.72),teleW);
    wat=mix(wat,vec3(.36,.22,.08),smoothstep(wh*.8,wh*1.6,yy));
    wat=mix(wat,vec3(.13,.075,.026),smoothstep(wh*1.2,wh*3.2,yy));
    c=wat*gl*xw;
    c=mix(c,c*vec3(.55,.42,.28),smoothstep(300.,720.,(P0.x-bh.x)*2041./F)*sharp);
    float wd2=sqrt(wide);
    vec3 wG=vec3(.74,.48,.15)*exp(-yy/300.)*exp(-sq((P0.x-bh.x+30.)/(420.+yy*1.1)))+vec3(.012,.004,.001);
    wG+=vec3(.5,.34,.12)*exp(-yy/16.)*exp(-sq((P0.x-bh.x+30.)/560.));
    c=mix(c,wG,wd2);
    c+=vec3(.5,.34,.13)*exp(-sq((P0.x-bh.x+60.)/70.))*exp(-yy/170.)*wide*.4;
    /* 草地：按 49mm 下的屏幕坐标取贴图，视角变了也贴合地面 */
    float zk=(2041./F)*(2.09/alt);
    vec2 g49=vec2(677.+(P0.x-bh.x)*2041./F*(2.09/alt)+grassX,658.+yy*zk);
    if(g49.y>700.){vec2 gu=vec2(g49.x/1500.,(g49.y-700.)/144.);
      float sway=(1.-gu.y)*(1.-gu.y)*.0016*sin(g49.x*.03+t*1.2+sin(g49.x*.009+t*.5)*2.);
      /* 贴图里烘进了卡车车轮：这一小块从旁边取样 */
      float gxx=g49.x;if(g49.y<726.&&g49.x>620.&&g49.x<800.)gxx-=190.;if(g49.y>768.&&g49.x>610.&&g49.x<900.)gxx-=320.;
      vec3 gr=texture(grass,vec2(gxx/1500.+sway,gu.y)).rgb;gr*=smoothstep(1.35,.95,gu.y);
      float tele=smoothstep(1.2,1.8,F/2041.);
      /* 长焦下草地是暗地面加亮屑，不再放大贴图 */
      if(tele>0.){vec2 d=vec2(xx*.26,rows*1.4);vec2 ci=floor(d);float fl=step(.965,h21(ci))*smoothstep(.5,.1,length(fract(d)-.5));
        float st=n2(vec2(xx*.11,rows*.25))*n2(vec2(xx*.4,rows*.9+2.));
        vec3 gd=vec3(.15,.08,.03)*exp(-(g49.y-712.)/34.)+vec3(.035,.018,.008)+vec3(.62,.42,.15)*pow(st,1.3)*exp(-(g49.y-712.)/16.)+vec3(.72,.55,.32)*fl*.55;
        /* 路面亮带 */gd+=vec3(.6,.42,.16)*exp(-sq((g49.y-716.)/2.2))*(.6+.6*n2(vec2(xx*.02,1.)));gr=mix(gr,gd,tele);}
      c=mix(c,gr,smoothstep(702.,710.,g49.y)*(1.-smoothstep(.0,.16,wide)));}
  }
  vec4 h=spr(house,P0,hR);if(plateMix>0.)h=mix(h,spr(house3,P0,hR3),plateMix);if(plateTele>0.)h=mix(h,spr(house2,P0,hR2),plateTele);c=mix(c,h.rgb,h.a);
  vec4 trk=mix(spr(truck,P0,tR),spr(truck2,P0,tR2),plateMix);c=mix(c,trk.rgb,trk.a);
  return c;
}
vec3 viola(vec2 P0){
  vec2 P=vec2(800.+(P0.x-vk.x)*196./vk.z,P0.y<vk.y?351.+(P0.y-vk.y)*196./vk.z:351.+(P0.y-vk.y)/(vk.w-vk.y)*111.);
  vec2 C=vec2(800.,351.);float R=196.;
  vec3 sky=mix(vec3(.165,.165,.262),vec3(.294,.27,.33),smoothstep(30.,200.,P.y));
  sky=mix(sky,vec3(.475,.43,.435),smoothstep(200.,300.,P.y));sky=mix(sky,vec3(.635,.585,.55),smoothstep(300.,345.,P.y));
  float d=length(P-C);
  float inside=1.-smoothstep(R-1.,R+1.,d);
  vec3 c=mix(sky,mix(vec3(.42,.37,.40),vec3(.61,.54,.50),smoothstep(190.,345.,P.y)),inside);
  float top=smoothstep(C.y+6.,C.y-4.,P.y);
  float ang=atan(P.y-C.y,P.x-C.x);vec2 rr=vec2(cos(ang),sin(ang));
  float n=fbm(rr*2.+vec2(t*.05,d*.012));
  /* 外晕两层：宽的暖灰 + 中间奶白 */
  float wd=exp(-sq(max(d-R-20.,0.)/(58.+smoothstep(235.,350.,P.y)*40.)))*smoothstep(R+2.,R+30.,d);
  c=mix(c,vec3(.72,.62,.54),wd*top*.66);
  float fl=smoothstep(235.,350.,P.y);float halo=exp(-sq((d-R-37.-fl*fl*24.)/(17.+fl*fl*22.)))*(.82+.42*n);
  float hs=texture(diskT,vec2(ang/6.28318+t*.002,clamp((d-R)/170.,0.,1.)*.55+.05),1.).g;halo*=.82+.42*hs;c=mix(c,vec3(.97,.89,.76),clamp(halo,0.,1.)*top*.92);
  float gap=exp(-sq((d-R-7.)/3.2));
  c=mix(c,vec3(.86,.78,.67),exp(-sq((d-R-15.)/15.))*top*.8);c=mix(c,vec3(.62,.56,.52),gap*top*.26);
  float ring=exp(-sq((d-R)/2.9));
  c=mix(c,vec3(.98,.93,.84),ring*top*.92);
  /* 亮带 */
  float band=smoothstep(344.,354.,P.y);
  float edge=exp(-sq(max(350.-P.y,0.)/13.))*.6*(1.-band);
  c=mix(c,vec3(.97,.93,.86),edge);
  vec3 bandc=mix(vec3(1.,.97,.9),vec3(.85,.81,.75),smoothstep(352.,396.,P.y));
  bandc=mix(bandc,vec3(.9,.86,.8),smoothstep(420.,462.,P.y));
  float mid=exp(-sq((P.x-800.)/360.));bandc=mix(bandc,bandc*.9,mid*.0);
  c=mix(c,bandc,band);
  /* 倒影 */
  if(P.y>356.&&P.y<470.){float rf=exp(-sq((length(vec2(P.x-C.x,P.y-356.))-R)/2.2));c=mix(c,vec3(.72,.66,.6),rf*.3*smoothstep(462.,372.,P.y));}
  /* 花田 */
  if(P0.y>vk.w-6.){float fz=pow(vk.z/196.,1.5);vec2 fu=vec2(.5+(P0.x-750.)/(1500.*fz),(P0.y-vk.w-8.)/(374.*fz));
    float sway=.0011*smoothstep(.0,.2,fu.y)*sin(P.x*.05+P.y*.04+t*1.1);
    vec2 fuv=vec2(fu.x+sway,max(fu.y,0.));float fmx=fract(fuv.x*.5)*2.;fmx=fmx>1.?2.-fmx:fmx;vec3 fl=texture(field,fuv).rgb;
    /* 贴图里烘进了宇航员身体和读数：这两块从旁边的花取样 */
    float inB=smoothstep(.135,.105,abs(fmx-.567))*smoothstep(.8,.62,fuv.y);if(inB>0.)fl=mix(fl,texture(field,vec2(fmx-.32,fuv.y)).rgb,inB);
    float inT=smoothstep(.36,.39,fmx)*smoothstep(.68,.65,fmx)*smoothstep(.72,.76,fuv.y);if(inT>0.)fl=mix(fl,texture(field,vec2(fmx,fuv.y-.24)).rgb,inT);\n    float inH=smoothstep(.92,.94,fmx)*smoothstep(.34,.26,fuv.y);if(inH>0.)fl=mix(fl,texture(field,vec2(fmx-.2,fuv.y)).rgb,inH);
    float lum=dot(fl,vec3(.3,.6,.1));
    float ph=h21(floor(P0/3.));float tw=step(.34,lum)*smoothstep(500.,540.,P0.y);fl*=1.+tw*.5*sin(t*2.2+ph*30.);
    /* 广角时花已小到看不清，换成铺满的紫色细颗粒 */
    float yf=(P0.y-vk.w)/max(844.-vk.w,1.);float fgn=fbm(vec2(P0.x*.1+7.,P0.y*.28))*.7+.6*h21(floor(P0/1.6));
    vec3 flat_=mix(vec3(.36,.3,.6),vec3(.2,.17,.37),smoothstep(0.,.75,yf))*(.62+.62*fgn);flat_+=vec3(.5,.42,.3)*step(.992,h21(floor(P0/2.)))*smoothstep(.2,.8,yf);
    fl=mix(fl,flat_,vW);
    float soft=mix(24.,84.,vW);float a=smoothstep(vk.w-4.,vk.w+soft,P0.y);c=mix(c,fl,a);}
  vec4 ah=spr(astro,P0,vA);c=mix(c,ah.rgb,ah.a);
  /* 前景虚焦光斑 */
  for(int i=0;i<5;i++){float fi=float(i);float life=.5+.5*sin(fi*1.7+t*.3);vec2 ce=vec2(mod(160.+fi*310.+t*(5.+fi*1.5),1600.)-50.,735.+55.*sin(fi*2.1+t*.13));float r=19.+fi*2.2;float b=smoothstep(r,r-9.,length(P0-ce));c=mix(c,vec3(.85,.75,.58),b*.36*life*life*life*(1.-vW));}
  /* 贴近镜头的虚焦花团：不规则的奶白色，只在左右下角 */
  if(vW<1.){vec2 bk[7]=vec2[7](vec2(1345.,650.),vec2(1440.,575.),vec2(1262.,765.),vec2(1450.,745.),vec2(1375.,815.),vec2(62.,775.),vec2(255.,795.));float br[7]=float[7](92.,72.,112.,95.,88.,76.,86.);float bs=0.;for(int i=0;i<7;i++){vec2 q=P0-bk[i]-vec2(sin(t*.11+float(i))*9.,cos(t*.09+float(i)*2.)*6.);float ww=1.+.05*sin(atan(q.y,q.x)*3.+float(i)*2.);bs=max(bs,smoothstep(br[i]*ww,br[i]*ww*.62,length(q)));}c=mix(c,vec3(.74,.68,.57)+.05*n2(P0*.02),bs*.76*smoothstep(165.,185.,vk.z)*smoothstep(235.,205.,vk.z));}
  return c;
}
void main(){
  vec2 uv=gl_FragCoord.xy/res;vec2 P0=vec2(uv.x*1500.,(1.-uv.y)*844.);
  vec2 A=vec2(800.,480.);
  vec2 P=A+(P0-A)/zoom+par*8./zoom;
  vec3 c=scene<.5?aurum(P0+par*5.):viola(P0-pan*.6+par*5.);
  /* 胶片颗粒与四角压暗 */
  float gr=h21(gl_FragCoord.xy+floor(t*14.)*.37)-.5;c+=gr*.018;
  vec2 v=uv-.5;c*=1.-dot(v,v)*.18;
  o=vec4(pow(max(c,0.),vec3(1.)),1.);
}`;
function sh(ty,src){var s=gl.createShader(ty);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){console.error(gl.getShaderInfoLog(s))}return s}
var pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,VS));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS))console.error(gl.getProgramInfoLog(pr));gl.useProgram(pr);
var b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);var loc=gl.getAttribLocation(pr,'a');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
var U={};['res','t','scene','zoom','par','grass','field','house','truck','astro','diskT','bh','pan','F','hy','gh','wh','alt','wideU','orbit','tiltU','grassX','px','vk','vA','vW','hR','tR','hR2','tR2','plateMix','plateTele','hR3','house2','truck2','house3'].forEach(function(n){U[n]=gl.getUniformLocation(pr,n)});
var ready=0;['grass','field','house','truck','astro','','house2','truck2','house3'].forEach(function(n,i){if(!n)return;var im=new Image();im.onload=function(){gl.activeTexture(gl.TEXTURE0+i);var tx=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tx);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,im);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.MIRRORED_REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,n==="field"?gl.MIRRORED_REPEAT:gl.CLAMP_TO_EDGE);gl.uniform1i(U[n],i);ready++;};im.src=(window.EH_PLATES2[n]||window.EH_PLATES[n])});
/* 吸积盘纹理：横向是角度（无缝），纵向是对数半径。启动时画一次，带 mipmap */
(function(){var FSD=`#version 300 es
precision highp float;out vec4 o;in vec2 v;
float h(vec3 p){p=fract(p*vec3(.1031,.1030,.0973));p+=dot(p,p.yxz+33.33);return fract((p.x+p.y)*p.z);}
float n3(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z);}
void main(){float a=v.x*6.2831853;vec2 c=vec2(cos(a),sin(a));float u=v.y;
 float w=.018*n3(vec3(c*2.2,u*7.))+.006*n3(vec3(c*6.,u*30.));float U=u+w;
 float fine=.55*n3(vec3(U*1000.,c*2.6))+.45*n3(vec3(U*1900.+5.,c*5.2));
 float mid=.6*n3(vec3(U*300.,c*1.7))+.4*n3(vec3(U*560.+9.,c*3.2));
 float coarse=.65*n3(vec3(U*38.,c*.9))+.35*n3(vec3(U*96.+3.,c*1.3));
 float grain=h(vec3(gl_FragCoord.xy,1.));
 o=vec4(fine,mid,coarse,grain);}`;
var VSD='#version 300 es\nin vec2 a;out vec2 v;void main(){v=a*.5+.5;gl_Position=vec4(a,0,1);}';
var dp=gl.createProgram();gl.attachShader(dp,sh(gl.VERTEX_SHADER,VSD));gl.attachShader(dp,sh(gl.FRAGMENT_SHADER,FSD));gl.bindAttribLocation(dp,loc,'a');gl.linkProgram(dp);if(!gl.getProgramParameter(dp,gl.LINK_STATUS))console.error(gl.getProgramInfoLog(dp));
var W=2048,H=2048;gl.activeTexture(gl.TEXTURE5);var tx=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tx);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA8,W,H,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
var fb=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,fb);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,tx,0);gl.viewport(0,0,W,H);gl.useProgram(dp);gl.drawArrays(gl.TRIANGLES,0,3);gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.useProgram(pr);
gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.MIRRORED_REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.generateMipmap(gl.TEXTURE_2D);gl.uniform1i(U.diskT,5);})();
/* 不同焦距的取景：横纵位置量自原片各帧 */
var KEYS=[
 {f:23,F:958,hy:634,bx:688,by:603,gh:60,wh:150,alt:31,wide:1,hx:775,hb:735,hs:.153,tx:712,tb:741,ts:.13,hl:900,ht:400,hc:.3,tl:640,tt:720,tc:.3},
 {f:26,F:1083,hy:643,bx:688,by:605,gh:64,wh:130,alt:19,wide:.85,hx:804,hb:722,hs:.19,tx:717,tb:731,ts:.2,hl:900,ht:400,hc:.3,tl:640,tt:720,tc:.3},
 {f:36,F:1500,hy:656,bx:682,by:611,gh:82,wh:60,alt:5.68,wide:.42,hx:917,hb:712,hs:.49,tx:712,tb:724,ts:.47,hl:900,ht:400,hc:.3,tl:640,tt:720,tc:.3},
 {f:49,F:2041,hy:658,bx:677,by:570,gh:125,wh:30,alt:2.09,wide:0,hx:1120,hb:700,hs:1,tx:710,tb:712,ts:1,hl:940,ht:430,hc:.62,tl:600,tt:650,tc:.45},
 {f:86,F:3827,hy:655,bx:333,by:486,gh:200,wh:62,alt:1.97,wide:0,hx:1318,hb:741,hs:2.28,tx:395,tb:762,ts:2.5,hl:1000,ht:398,hc:.73,tl:217,tt:645,tc:1.172},
 {f:108,F:3700,hy:617,bx:47,by:455,gh:235,wh:62,alt:1.9,wide:0,hx:1600,hb:745,hs:3.4,tx:160,tb:790,ts:3.3,hl:996,ht:199,hc:1.172,tl:-127,tt:626,tc:1.94},
 {f:180,F:6100,hy:560,bx:-330,by:300,gh:260,wh:80,alt:1.8,wide:0,hx:1700,hb:800,hs:5,tx:60,tb:880,ts:5,hl:860,ht:-135,hc:1.9,tl:-420,tt:578,tc:3.1}];
var VKEYS=[{f:23,R:75,cx:760,cy:170,fb:370,as:.04,ax:770,ab:500},{f:30,R:98,cx:765,cy:198,fb:390,as:.06,ax:777,ab:532},{f:36,R:122,cx:775,cy:200,fb:375,as:.13,ax:790,ab:520},{f:46,R:150,cx:776,cy:245,fb:395,as:.45,ax:814,ab:426},{f:61,R:196,cx:800,cy:351,fb:462,as:.78,ax:825,ab:408},{f:78,R:215,cx:776,cy:330,fb:473,as:1.17,ax:855,ab:367},{f:180,R:500,cx:776,cy:330,fb:600,as:3,ax:900,ab:300}];
function vkeyAt(f){var a=VKEYS[0],b=VKEYS[VKEYS.length-1];for(var i=1;i<VKEYS.length;i++){if(f<=VKEYS[i].f){a=VKEYS[i-1];b=VKEYS[i];break}}var k=Math.max(0,Math.min(1,Math.log(f/a.f)/Math.log(b.f/a.f))),o={};for(var n in a)o[n]=a[n]+(b[n]-a[n])*k;return o}
function keyAt(f){var a=KEYS[0],b=KEYS[KEYS.length-1];for(var i=1;i<KEYS.length;i++){if(f<=KEYS[i].f){a=KEYS[i-1];b=KEYS[i];break}}var k=Math.max(0,Math.min(1,Math.log(f/a.f)/Math.log(b.f/a.f))),o={};for(var n in a){var lg=(n==='hs'||n==='ts'||n==='alt'||n==='F'||n==='hc'||n==='tc');o[n]=lg?Math.exp(Math.log(a[n])+(Math.log(b[n])-Math.log(a[n]))*k):a[n]+(b[n]-a[n])*k}return o}
var drag=[0,0],dragT=[0,0];
/* 焦距刻度 */
var ruler=document.getElementById('ruler'),TICKS=[23,26,34,49,70,180],FMIN=23,FMAX=180;
var RT=[[23,0],[26,51],[34,127],[49,204],[70,268],[180,332]];function fy(f){for(var i=1;i<RT.length;i++){if(f<=RT[i][0]){var a=RT[i-1],b=RT[i],k=Math.log(f/a[0])/Math.log(b[0]/a[0]);return a[1]+(b[1]-a[1])*k}}return 332}
TICKS.forEach(function(f){var e=document.createElement('span');e.className='t';e.style.top=fy(f)+'px';ruler.appendChild(e);if(f!==49){var n=document.createElement('span');n.className='n';n.style.top=fy(f)+'px';n.textContent=f;ruler.appendChild(n)}});
var fl=document.createElement('div');fl.id='focal';fl.innerHTML='<span id="fl-v"></span><i></i>';ruler.appendChild(fl);
var S=[{name:'Aurum',desc:'The last farm before the event horizon',f:49,alt:2.09,hz:'17.8'},{name:'Viola',desc:'A violet field beneath the arc of the disk',f:61,alt:1.01,hz:'33.6'}];
var scene=Q.get('scene')==='viola'?1:0,focal=S[scene].f,target=focal,paused=false,T=parseFloat(Q.get('t')||'92'),time=0,par=[0,0],parT=[0,0];
if(Q.get('f')){focal=target=parseFloat(Q.get('f'))}
var title=document.getElementById('title'),desc=document.getElementById('desc'),readout=document.getElementById('readout'),flv=null,veil=document.getElementById('veil');
function applyScene(){title.textContent=S[scene].name;desc.textContent=S[scene].desc;document.querySelectorAll('#tabs button').forEach(function(b,i){b.classList.toggle('on',i===scene)})}
applyScene();
function setScene(n){if(n===scene)return;veil.style.opacity=reduce?0:1;title.style.opacity=0;desc.style.opacity=0;setTimeout(function(){scene=n;focal=target=S[n].f;drag=[0,0];dragT=[0,0];applyScene();veil.style.opacity=0;title.style.opacity=1;desc.style.opacity=1},reduce?0:560)}
document.querySelectorAll('#tabs button').forEach(function(b){b.addEventListener('click',function(){setScene(+b.dataset.s)})});
document.getElementById('b-home').onclick=function(){target=S[scene].f;dragT=[0,0]};
document.getElementById('b-pause').onclick=function(){paused=!paused};
document.getElementById('b-eye').onclick=function(){hud.classList.toggle('off')};
document.getElementById('b-full').onclick=function(){if(document.fullscreenElement)document.exitFullscreen();else view.requestFullscreen&&view.requestFullscreen()};
addEventListener('keydown',function(e){if(e.key==='h')hud.classList.toggle('off');if(e.key==='1')setScene(0);if(e.key==='2')setScene(1)});
view.addEventListener('wheel',function(e){e.preventDefault();target=Math.max(FMIN,Math.min(FMAX,target*Math.exp(e.deltaY*.0012)))},{passive:false});
view.addEventListener('pointermove',function(e){var r=view.getBoundingClientRect();parT=[(e.clientX-r.left)/r.width-.5,(e.clientY-r.top)/r.height-.5]});
var ptrs=null;view.addEventListener('pointerdown',function(e){var r=view.getBoundingClientRect();if(e.target.closest&&e.target.closest('button'))return;var onRail=(e.clientX-r.left)/r.width>.915;ptrs={x:e.clientX,y:e.clientY,f:target,d:dragT.slice(),rail:onRail};view.style.cursor=onRail?'ns-resize':'grabbing'});addEventListener('pointerup',function(){ptrs=null;view.style.cursor='grab'});addEventListener('pointermove',function(e){if(!ptrs)return;if(ptrs.rail){var r=view.getBoundingClientRect();target=Math.max(FMIN,Math.min(FMAX,ptrs.f*Math.exp((e.clientY-ptrs.y)*.008*1500/r.width)))}else{var q=1500/view.getBoundingClientRect().width;dragT=[Math.max(-260,Math.min(260,ptrs.d[0]+(e.clientX-ptrs.x)*q)),Math.max(-110,Math.min(110,ptrs.d[1]+(e.clientY-ptrs.y)*q))]}});
var qual=1,needFit=false;function fit(){var r=view.getBoundingClientRect();var dpr=Math.min(devicePixelRatio||1,1.5)*qual;cv.width=Math.round(r.width*dpr);cv.height=Math.round(r.height*dpr);gl.viewport(0,0,cv.width,cv.height);hud.style.transform='scale('+(r.width/1500)+')';}
fit();addEventListener('resize',fit);var vis=true;new IntersectionObserver(function(es){vis=es[0].isIntersecting}).observe(view);
var last=performance.now(),acc=0;
function fmtT(s){var p=function(n){return(n<10?'0':'')+n},h=Math.floor(s/3600),m=Math.floor(s/60)%60,x=Math.floor(s)%60;return p(h)+':'+p(m)+':'+p(x)}
var fpsS=144,fpsC=0,fpsT=performance.now();
function loop(n){requestAnimationFrame(loop);if(!vis)return;if(needFit){needFit=false;fit()}var dt=Math.min(.05,(n-last)/1000);last=n;if(!paused&&!reduce){time+=dt;T+=dt}
  focal+=(target-focal)*Math.min(1,dt*5);par[0]+=(parT[0]-par[0])*Math.min(1,dt*2);par[1]+=(parT[1]-par[1])*Math.min(1,dt*2);
  var z=focal/S[0].f;if(scene===1)z=focal/61;
  /* 广角下缩小；长焦到 180mm 时约放大 3.7 倍 */
  drag[0]+=(dragT[0]-drag[0])*Math.min(1,dt*6);drag[1]+=(dragT[1]-drag[1])*Math.min(1,dt*6);
  var K=keyAt(focal),Fp=K.F,zs=Fp/2041;
  /* 拖动：远的黑洞移得少，近的房子和卡车移得多，所以有真实视差 */
  var dx=drag[0]*Math.min(zs,1.6),dy=drag[1]*Math.min(zs,1.6),hsk=K.hs,tsk=K.ts;
  var HR=[K.hx+dx*1.42-(1120-965)*hsk,K.hb+dy-(700-528)*hsk,307*hsk,178*hsk],TR=[K.tx+dx*1.72-(710-636)*tsk,K.tb+dy-(712-664)*tsk,150*tsk,52*tsk];
  var VK=vkeyAt(focal);gl.uniform4f(U.vk,VK.cx,VK.cy,VK.R,VK.fb);gl.uniform4f(U.vA,VK.ax-140*VK.as-drag[0]*.45,VK.ab-7*VK.as,290*VK.as,405*VK.as);gl.uniform1f(U.vW,Math.max(0,Math.min(1,(46-focal)/10)));var pm=Math.max(0,Math.min(1,(focal-54)/12));gl.uniform1f(U.plateMix,pm);gl.uniform1f(U.plateTele,Math.max(0,Math.min(1,(focal-92)/12)));var c3=.757*hsk;gl.uniform4f(U.hR3,K.hx+dx*1.42-190*c3,K.hb+dy-213*c3,380*c3,217*c3);gl.uniform4f(U.hR2,K.hl+dx*1.42,K.ht+dy,430*K.hc,470*K.hc);gl.uniform4f(U.tR2,K.tl+dx*1.72,K.tt+dy,305*K.tc,105*K.tc);gl.uniform1f(U.F,Fp);gl.uniform1f(U.hy,K.hy+dy);gl.uniform2f(U.bh,K.bx+dx,K.by+dy);gl.uniform1f(U.gh,K.gh);gl.uniform1f(U.wh,K.wh);gl.uniform1f(U.alt,K.alt);gl.uniform1f(U.wideU,K.wide);gl.uniform1f(U.orbit,-drag[0]*.0016);gl.uniform1f(U.tiltU,drag[1]*.0011);gl.uniform1f(U.grassX,drag[0]*.5);gl.uniform1f(U.px,1500/cv.width);gl.uniform4f(U.hR,HR[0],HR[1],HR[2],HR[3]);gl.uniform4f(U.tR,TR[0],TR[1],TR[2],TR[3]);gl.uniform2f(U.pan,-drag[0]*.6,-drag[1]*.5);
  gl.uniform2f(U.res,cv.width,cv.height);gl.uniform1f(U.t,time);gl.uniform1f(U.scene,scene);gl.uniform1f(U.zoom,z);gl.uniform2f(U.par,reduce?0:par[0],reduce?0:par[1]);
  if(ready>=8)gl.drawArrays(gl.TRIANGLES,0,3);
  fpsC++;if(n-fpsT>800){fpsS=Math.round(fpsC*1000/(n-fpsT));fpsC=0;fpsT=n;/* 光线步进吃 GPU：掉帧就降内部分辨率，够快再慢慢升回去 */if(!Q.has('still')&&!Q.has('fixedq')){var oq=qual;if(fpsS<45)qual=Math.max(.55,qual*.85);else if(fpsS>57&&qual<1)qual=Math.min(1,qual*1.05);if(oq!==qual)needFit=true}}
  var ad=scene===0?K.alt:S[1].alt*(1+Math.max(0,61/focal-1)*12+Math.max(0,focal/61-1)*.2);var alt=ad>=10?Math.round(ad)+'':ad.toFixed(2);
  readout.innerHTML='ALT <b>'+alt+' M</b>   HORIZON <b>'+S[scene].hz+'</b> R<sub style="font-size:7px">s</sub>\nT <b>'+fmtT(T)+'</b>   <span>'+fpsS+' FPS · 100%</span>';
  flv=flv||document.getElementById('fl-v');flv.textContent=Math.round(focal)+' mm';fl.style.top=fy(focal)+'px';
}
requestAnimationFrame(loop);window.EH={keys:KEYS,set:function(s,f){scene=s;focal=target=f||S[s].f;applyScene()},pause:function(p){paused=p},state:function(){return{scene:scene,focal:focal,ready:ready}}};
})();
