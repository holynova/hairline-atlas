import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { assemble, nameOf } from "../.agents/skills/hairline-create/build.mjs";

const root=resolve(fileURLToPath(new URL("..",import.meta.url)));
const out=join(root,"dist"),figureOut=join(out,"figures");
const catalog=JSON.parse(readFileSync(join(root,"src/catalog.json"),"utf8"));
const releaseVersion=JSON.parse(readFileSync(join(root,"package.json"),"utf8")).version;
const readouts={lamp:"折叠",moka:"萃取",clock:"报时",turntable:"循迹",scissors:"剪切",sewing:"缝纫",watch:"走时",locomotive:"驱动",helicopter:"旋翼",biplane:"螺旋桨",balloon:"上升",rowboat:"划桨",cablecar:"滑行",roadster:"转向",dns:"解析",balancer:"分流",cache:"命中",queue:"推进",btree:"查找",auth:"验证",cdn:"边缘",mona:"远退",starry:"旋卷",wave:"卷浪",pearl:"摆动",scream:"起伏",lilies:"涟漪",venus:"展开",kiss:"收拢",nightwatch:"前行",meninas:"映照",gears:"啮合",crank:"滑移",cam:"顶升",pulley:"起吊",scissor:"举升",ratchet:"步进",rack:"平移",fourbar:"摆动",geneva:"分度",press:"压合"};
const escaped=(value)=>String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
function specialize(template,kind){
  const start=template.indexOf("  if(SPEC.kind===\"");
  const end=template.indexOf("\n  active=mk(",start);
  if(start<0||end<0)throw new Error(`Cannot find the figure branches in template for ${kind}`);
  const section=template.slice(start,end),branches=[...section.matchAll(/^[ \t]{2}(?:if|} else if)\(SPEC\.kind===\"([^\"]+)\"\)\{/gm)];
  for(let i=0;i<branches.length;i++){
    const branch=branches[i];
    if(branch[1]!==kind)continue;
    const bodyStart=branch.index+branch[0].length;
    const next=section.indexOf("\n  } else if(SPEC.kind===",bodyStart);
    const close=next<0?section.lastIndexOf("\n  }"):next;
    return template.slice(0,start)+`  {${section.slice(bodyStart,close)}\n  }`+template.slice(end);
  }
  throw new Error(`Template has no ${kind} figure branch`);
}
const entries=catalog.groups.flatMap((group)=>group.figures.map((figure)=>({...figure,group})));
if(catalog.groups.length!==5||catalog.groups.some((g)=>g.figures.length!==10)||entries.length!==50)throw new Error("Catalog must contain five groups of ten figures");
mkdirSync(figureOut,{recursive:true});
for(const entry of entries){
  let source,declaredName;
  if(entry.source){source=readFileSync(join(root,"src/figures",entry.source),"utf8");declaredName=nameOf(source);}
  else{
    const template=specialize(readFileSync(join(root,"src/templates",`${entry.template}.js`),"utf8"),entry.kind);
    const spec={id:entry.id,kind:entry.kind,means:`${entry.action}。`,readout:readouts[entry.kind]??"move",range:entry.group.id==="paintings"?[12,16,20]:[16,22,28],answer:[300,166],edge:[[126,166],[300,166]],tour:[[155,166],[220,142],[270,166],null]};
    source=template.replace("__FIGURE_SPEC__",JSON.stringify(spec));
    source=source.replace(/hairline\(\{name:SPEC\.id,means:SPEC\.means,rules:\[1,3,4,8,9\],range:SPEC\.range,answer:SPEC\.answer,edge:SPEC\.edge,tour:SPEC\.tour,mount\}\);/,
      `hairline({name:${JSON.stringify(entry.id)},means:${JSON.stringify(spec.means)},rules:[1,3,4,8,9],range:${JSON.stringify(spec.range)},tour:${JSON.stringify(spec.tour)},mount});`);
    declaredName=entry.id;
  }
  const name=declaredName;
  if(name!==entry.id)throw new Error(`Catalog id ${entry.id} does not match figure name ${name}`);
  // 给单图页注入中文名, 让图内角标与浏览器标题显示中文
  const callAt=source.lastIndexOf("hairline({");
  if(callAt>=0){
    const head=source.slice(0,callAt),tail=source.slice(callAt);
    source=head+tail.replace(/name:\s*"[^"]*"/,(m)=>`${m},label:${JSON.stringify(entry.title)}`);
  }
  const page=assemble(source);
  writeFileSync(join(figureOut,`${entry.id}.html`),page);
  writeFileSync(join(root,"figures",`${entry.id}.html`),page);
}
copyFileSync(join(root,"src/styles.css"),join(out,"styles.css"));

const feature=(group,index)=>{
  const item=group.figures[0],stamp=String(index*10+1).padStart(2,"0");
  const attribution=item.artist?`<p class="feature-attribution">${escaped(item.artist)} <span>${escaped(item.year)}</span></p>`:"";
  return `<article class="feature-card" aria-labelledby="${item.id}-title">
    <div class="feature-art"><iframe class="figure-frame feature-frame" src="figures/${item.id}.html?theme=light" title="${escaped(item.title)}线稿：${escaped(item.action)}" allow="fullscreen" loading="${index===0?"eager":"lazy"}"></iframe><span class="art-stamp">${stamp} / 50</span></div>
    <div class="feature-copy"><p class="eyebrow">${escaped(group.english)}</p><h3 id="${item.id}-title">${escaped(item.title)}</h3>${attribution}<p class="motion-line"><span class="motion-dot"></span>${escaped(item.action)}</p><p class="feature-description">${escaped(item.note)}</p><a class="text-link" href="figures/${item.id}.html">单独打开这张图 <span aria-hidden="true">↗</span></a></div>
  </article>`;
};
const card=(item,n,group)=>`<article class="figure-card" aria-labelledby="${item.id}-title">
  <div class="figure-art"><iframe class="figure-frame" src="figures/${item.id}.html?theme=light" title="${escaped(item.title)}线稿：${escaped(item.action)}" allow="fullscreen" loading="lazy"></iframe><span class="art-stamp">${String(n).padStart(2,"0")} / 50</span></div>
  <div class="card-caption"><div><p class="eyebrow">${escaped(group.english)}</p><h3 id="${item.id}-title">${escaped(item.title)}</h3>${item.artist?`<p class="card-attribution">${escaped(item.artist)} ${escaped(item.year)}</p>`:""}</div><p class="motion-line"><span class="motion-dot"></span>${escaped(item.action)}</p></div>
  <a class="card-link" href="figures/${item.id}.html">单独打开这张图 <span aria-hidden="true">↗</span></a>
</article>`;

let offset=0;
const sections=catalog.groups.map((group,index)=>{
  const first=group.figures[0];
  const rest=group.figures.slice(1).map((item,j)=>card(item,offset+j+2,group)).join("\n");
  offset+=group.figures.length;
  return `<section class="chapter chapter-${group.id}" id="${group.id}" aria-labelledby="${group.id}-title">
    <div class="chapter-heading"><div><p class="eyebrow">CHAPTER ${String(index+1).padStart(2,"0")}　/　${escaped(group.english.split(" / ")[0])}</p><h2 id="${group.id}-title">${escaped(group.title)}</h2></div><p class="chapter-note">${escaped(group.note).replaceAll("\n","<br>")}</p></div>
    ${feature(group,index)}
    <div class="figure-grid four-up">${rest}</div>
  </section>`;
}).join("\n");

const nav=catalog.groups.map((g,i)=>`<a href="#${g.id}">${escaped(g.title)} <span>${String(i+1).padStart(2,"0")}</span></a>`).join("");
const html=`<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f2f1ed">
  <meta name="description" content="Hairline Atlas 线感物集：五类、五十张细致的交互线稿，涵盖日常物件、交通工具、网站结构、世界名画与机械原理。">
  <title>${escaped(catalog.title)}</title>
  <script defer src="https://cloud.umami.is/script.js" data-website-id="e01c9f78-4607-4e60-b01c-77c8190b12b4"></script>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <a class="skip" href="#main">跳到图集</a>
  <header class="topbar"><a class="brand" href="#top" aria-label="Hairline Atlas 首页"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span><span>HAIRLINE ATLAS <em>线感物集</em></span></a><nav aria-label="图集章节">${nav}</nav></header>
  <main id="main">
    <section class="intro" id="top" aria-labelledby="title"><div class="intro-copy"><p class="eyebrow"><span class="live-dot"></span> 五组可以触摸的线稿　/　2026</p><h1 id="title">让线条<br><span>动起来。</span></h1><p class="intro-lede">从厨房到画布，从网页到机械。<br>触摸图面，看一个动作怎样显露内部结构。</p></div><aside class="intro-index" aria-label="图集信息"><p class="eyebrow">INTERACTIVE INDEX</p><div class="index-number">50</div><p>张独立线稿<br>五组不同结构</p><div class="index-rule"></div><p class="index-note">触摸图面探索<br>点播放看完整一轮</p></aside><div class="intro-bottom"><span>01 / 50</span><span>线、物、结构</span><span>向下浏览 ↓</span></div></section>
    ${sections}
    <section class="method" aria-labelledby="method-title"><div><p class="eyebrow">THE METHOD　/　HAIRLINE</p><h2 id="method-title">线条少一点，<br>动作准一点。</h2></div><div class="method-copy"><p>每张图都是一页独立的互动线稿：静止时先读出形体，触摸图面再触发一个清楚的动作。物件、画面与机构都从具体结构出发，动作结束后回到安静的状态。</p><a class="text-link" href="https://hairline.lucasmarkes.com/skill" target="_blank" rel="noreferrer">了解 Hairline 的绘制方法 <span aria-hidden="true">↗</span></a></div><div class="method-footer"><span>ONE SUBJECT</span><span>ONE GESTURE</span><span>ONE READOUT</span></div></section>
  </main>
  <footer class="footer"><a class="brand" href="#top"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span><span>HAIRLINE ATLAS <em>线感物集</em></span></a><p>图形方法来自 <a href="https://hairline.lucasmarkes.com/skill" target="_blank" rel="noreferrer">Hairline by Lucas Marques</a>。本页收录五十张独立线稿。 <a href="https://github.com/holynova/hairline-atlas" target="_blank" rel="noreferrer">GitHub 仓库 ↗</a>　v${escaped(releaseVersion)}</p><a class="to-top" href="#top">回到开头 ↑</a></footer>
</body></html>`;
writeFileSync(join(out,"index.html"),html);
copyFileSync(join(out,"index.html"),join(root,"index.html"));
copyFileSync(join(out,"styles.css"),join(root,"styles.css"));
console.log(`built ${entries.length} standalone figures and ${catalog.groups.length} gallery chapters`);
