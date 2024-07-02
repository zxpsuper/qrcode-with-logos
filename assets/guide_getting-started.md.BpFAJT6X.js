import{_ as a,c as i,I as t,aR as e,o as n,D as l}from"./chunks/framework.MDQz7FCs.js";const y=JSON.parse('{"title":"Getting-started","description":"","frontmatter":{},"headers":[],"relativePath":"guide/getting-started.md","filePath":"guide/getting-started.md","lastUpdated":1719893146000}'),h={name:"guide/getting-started.md"},p=e(`<h1 id="getting-started" tabindex="-1">Getting-started <a class="header-anchor" href="#getting-started" aria-label="Permalink to &quot;Getting-started&quot;">​</a></h1><h2 id="installation" tabindex="-1">Installation <a class="header-anchor" href="#installation" aria-label="Permalink to &quot;Installation&quot;">​</a></h2><p>Qrcode-with-logos has been published on npm and you can install it with:</p><div class="vp-code-group vp-adaptive-theme"><div class="tabs"><input type="radio" name="group-aqh3E" id="tab-fGE_Zy7" checked><label for="tab-fGE_Zy7">npm</label><input type="radio" name="group-aqh3E" id="tab-FA4qmfX"><label for="tab-FA4qmfX">pnpm</label><input type="radio" name="group-aqh3E" id="tab-O3x5vNn"><label for="tab-O3x5vNn">yarn</label></div><div class="blocks"><div class="language-sh vp-adaptive-theme active"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> qrcode-with-logos</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --save</span></span></code></pre></div><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pnpm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> add</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> qrcode-with-logos</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --save</span></span></code></pre></div><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">yarn</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> add</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> qrcode-with-logos</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --save</span></span></code></pre></div></div></div><h2 id="usage" tabindex="-1">Usage <a class="header-anchor" href="#usage" aria-label="Permalink to &quot;Usage&quot;">​</a></h2><p>You can new a QrCodeWithLogo instance with canvas and content to create a qrcode.</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> QrCodeWithLogo </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;qrcode-with-logos&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> QrCodeWithLogo</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  canvas: document.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getElementById</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;canvas&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  content: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;https://github.com/zxpsuper&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  width: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">380</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  logo: {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    src: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;https://avatars1.githubusercontent.com/u/28730619?s=460&amp;v=4&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span></code></pre></div><p>If you do not need to show the qrcode on the page, try not input the canvas options. And It will create a Canvas element inside to finish it&#39;s work!</p>`,8);function d(o,k,r,c,g,E){const s=l("Tongji");return n(),i("div",null,[p,t(s)])}const F=a(h,[["render",d]]);export{y as __pageData,F as default};