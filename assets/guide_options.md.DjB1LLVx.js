import{_ as e,c as a,I as i,aR as l,o as t,D as r}from"./chunks/framework.MDQz7FCs.js";const b=JSON.parse('{"title":"Options","description":"","frontmatter":{},"headers":[],"relativePath":"guide/options.md","filePath":"guide/options.md","lastUpdated":1719453654000}'),s={name:"guide/options.md"},n=l(`<h1 id="options" tabindex="-1">Options <a class="header-anchor" href="#options" aria-label="Permalink to &quot;Options&quot;">​</a></h1><h2 id="content-required" tabindex="-1">content <code>required</code> <a class="header-anchor" href="#content-required" aria-label="Permalink to &quot;content \`required\`&quot;">​</a></h2><ul><li>Type: <code>string</code></li></ul><p>QR Code content.</p><h2 id="width" tabindex="-1">width <a class="header-anchor" href="#width" aria-label="Permalink to &quot;width&quot;">​</a></h2><ul><li><p>Type: <code>number</code></p></li><li><p>Default: <code>380</code></p></li></ul><p>QR Code width.</p><h2 id="canvas" tabindex="-1">canvas <a class="header-anchor" href="#canvas" aria-label="Permalink to &quot;canvas&quot;">​</a></h2><ul><li><p>Type: <code>HTMLCanvasElement</code></p></li><li><p>Default: a new canvas tag</p></li></ul><p>A canvas tag to show the QR code.</p><h2 id="image" tabindex="-1">image <a class="header-anchor" href="#image" aria-label="Permalink to &quot;image&quot;">​</a></h2><ul><li><p>Type: <code>HTMLImageElement</code></p></li><li><p>Default: a new img tag</p></li></ul><p>A img tag to show the QR code.</p><h2 id="download" tabindex="-1">download <a class="header-anchor" href="#download" aria-label="Permalink to &quot;download&quot;">​</a></h2><ul><li><p>Type: <code>boolean</code> | <code>(download: () =&gt; Promise&lt;void&gt;) =&gt; void</code></p></li><li><p>Default: <code>false</code></p></li></ul><p>You can set the value to be true to download the file immediately.</p><p>if download is a funciton, you can use it like:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> QrCodeWithLogo</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  content: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;https://github.com/zxpsuper&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  logo: {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    src: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;https://avatars1.githubusercontent.com/u/28730619?s=460&amp;v=4&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  },</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  download</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">downloadFn</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // you can choose when to start download by downloadFn...</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    downloadFn</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">().</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">then</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">      // do what you want to do after download image!</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span></code></pre></div><h2 id="downloadname" tabindex="-1">downloadName <a class="header-anchor" href="#downloadname" aria-label="Permalink to &quot;downloadName&quot;">​</a></h2><ul><li><p>Type: <code>string</code></p></li><li><p>Default: <code>qr-code.png</code></p></li></ul><p>Set the download file name, should be used with the download property.</p><h2 id="onerror" tabindex="-1">onError <a class="header-anchor" href="#onerror" aria-label="Permalink to &quot;onError&quot;">​</a></h2><ul><li><p>Type: <code>(err) =&gt; void</code></p></li><li><p>Default: <code>null</code></p></li></ul><p>Catch error and handle it!</p><h2 id="nodeqrcodeoptions" tabindex="-1">nodeQrCodeOptions <a class="header-anchor" href="#nodeqrcodeoptions" aria-label="Permalink to &quot;nodeQrCodeOptions&quot;">​</a></h2><ul><li>Type: <code>object</code></li></ul><h3 id="nodeqrcodeoptions-margin" tabindex="-1">nodeQrCodeOptions.margin <a class="header-anchor" href="#nodeqrcodeoptions-margin" aria-label="Permalink to &quot;nodeQrCodeOptions.margin&quot;">​</a></h3><ul><li>Type: <code>number</code></li><li>Default: <code>4</code></li></ul><p>qrcode margin</p><h3 id="nodeqrcodeoptions-errorcorrectionlevel" tabindex="-1">nodeQrCodeOptions.errorCorrectionLevel <a class="header-anchor" href="#nodeqrcodeoptions-errorcorrectionlevel" aria-label="Permalink to &quot;nodeQrCodeOptions.errorCorrectionLevel&quot;">​</a></h3><ul><li>Type: <code>string</code></li><li>Default: according to content length and auto choose.</li></ul><p>qrcode errorCorrectionLevel, such as &quot;L&quot;, &quot;M&quot;, &quot;Q&quot;, &quot;H&quot;</p><h3 id="nodeqrcodeoptions-color" tabindex="-1">nodeQrCodeOptions.color <a class="header-anchor" href="#nodeqrcodeoptions-color" aria-label="Permalink to &quot;nodeQrCodeOptions.color&quot;">​</a></h3><ul><li>Type <code>object</code></li></ul><p>qrcode color</p><h4 id="nodeqrcodeoptions-color-dark" tabindex="-1">nodeQrCodeOptions.color.dark <a class="header-anchor" href="#nodeqrcodeoptions-color-dark" aria-label="Permalink to &quot;nodeQrCodeOptions.color.dark&quot;">​</a></h4><ul><li>Type: <code>string</code></li><li>Default: <code>#000000</code></li></ul><p>qrcode color value of dark</p><h4 id="nodeqrcodeoptions-color-light" tabindex="-1">nodeQrCodeOptions.color.light <a class="header-anchor" href="#nodeqrcodeoptions-color-light" aria-label="Permalink to &quot;nodeQrCodeOptions.color.light&quot;">​</a></h4><ul><li>Type: <code>string</code></li><li>Default: <code>#ffffff</code></li></ul><p>qrcode color value of light</p><div class="tip custom-block github-alert"><p class="custom-block-title">TIP</p><p>If you want a transparent background, please set light equal to &#39;#00000000&#39;</p></div><h2 id="logo" tabindex="-1">logo <a class="header-anchor" href="#logo" aria-label="Permalink to &quot;logo&quot;">​</a></h2><ul><li>Type: <code>object</code> | <code>string</code></li></ul><h3 id="logo-src-required" tabindex="-1">logo.src <code>required</code> <a class="header-anchor" href="#logo-src-required" aria-label="Permalink to &quot;logo.src \`required\`&quot;">​</a></h3><ul><li>Type: <code>string</code></li></ul><h3 id="logo-logoradius" tabindex="-1">logo.logoRadius <a class="header-anchor" href="#logo-logoradius" aria-label="Permalink to &quot;logo.logoRadius&quot;">​</a></h3><ul><li>Type: <code>number</code></li><li>Default: <code>0</code></li></ul><h3 id="logo-logosize" tabindex="-1">logo.logoSize <a class="header-anchor" href="#logo-logosize" aria-label="Permalink to &quot;logo.logoSize&quot;">​</a></h3><ul><li><code>Deprecated</code></li></ul><p>It can auto calculate logoSize now!</p><h3 id="logo-bordersize" tabindex="-1">logo.borderSize <a class="header-anchor" href="#logo-bordersize" aria-label="Permalink to &quot;logo.borderSize&quot;">​</a></h3><ul><li><code>Deprecated</code></li></ul><div class="warning custom-block github-alert"><p class="custom-block-title">WARNING</p><p>You are recommended to use <strong>borderWidth</strong> instead of borderSize!</p></div><h3 id="logo-borderwidth" tabindex="-1">logo.borderWidth <a class="header-anchor" href="#logo-borderwidth" aria-label="Permalink to &quot;logo.borderWidth&quot;">​</a></h3><ul><li>Type: <code>number</code></li><li>Default: <code>10</code></li></ul><h3 id="logo-borderradius" tabindex="-1">logo.borderRadius <a class="header-anchor" href="#logo-borderradius" aria-label="Permalink to &quot;logo.borderRadius&quot;">​</a></h3><ul><li>Type: <code>number</code></li><li>Default: <code>8</code></li></ul><h3 id="logo-bgcolor" tabindex="-1">logo.bgColor <a class="header-anchor" href="#logo-bgcolor" aria-label="Permalink to &quot;logo.bgColor&quot;">​</a></h3><ul><li>Type: <code>String</code></li><li>Default: <code>#ffffff</code></li></ul><p>It is the logo background color</p><h3 id="logo-crossorigin" tabindex="-1">logo.crossOrigin <a class="header-anchor" href="#logo-crossorigin" aria-label="Permalink to &quot;logo.crossOrigin&quot;">​</a></h3><ul><li>Type: <code>string</code></li><li>Default: <code>Anonymous</code></li></ul><h2 id="dotsoptions" tabindex="-1">dotsOptions <a class="header-anchor" href="#dotsoptions" aria-label="Permalink to &quot;dotsOptions&quot;">​</a></h2><ul><li>Type: <code>Object</code></li></ul><h3 id="dotsoptions-type" tabindex="-1">dotsOptions.type <a class="header-anchor" href="#dotsoptions-type" aria-label="Permalink to &quot;dotsOptions.type&quot;">​</a></h3><ul><li>Type: <code>&quot;dot&quot; | &quot;dot-small&quot; | &quot;tile&quot; | &quot;rounded&quot; | &quot;square&quot; | &quot;diamond&quot; | &quot;star&quot; | &quot;fluid&quot; | &quot;fluid-line&quot; | &quot;stripe&quot; | &quot;stripe-column&quot;</code></li><li>Default: <code>square</code></li></ul><h3 id="dotsoptions-color" tabindex="-1">dotsOptions.color <a class="header-anchor" href="#dotsoptions-color" aria-label="Permalink to &quot;dotsOptions.color&quot;">​</a></h3><ul><li>Type: <code>string</code></li><li>Default: <code>#000000</code></li></ul><h2 id="cornersoptions" tabindex="-1">cornersOptions <a class="header-anchor" href="#cornersoptions" aria-label="Permalink to &quot;cornersOptions&quot;">​</a></h2><ul><li>Type: <code>object</code></li></ul><h3 id="cornersoptions-type" tabindex="-1">cornersOptions.type <a class="header-anchor" href="#cornersoptions-type" aria-label="Permalink to &quot;cornersOptions.type&quot;">​</a></h3><ul><li><p>Type: <code>&quot;square&quot; | &quot;rounded&quot; | &quot;circle&quot; | &quot;rounded-circle&quot; | &quot;circle-rounded&quot; | &quot;circle-star&quot; | &quot;circle-diamond&quot;</code></p></li><li><p>Default: <code>square</code></p></li></ul><h3 id="cornersoptions-color" tabindex="-1">cornersOptions.color <a class="header-anchor" href="#cornersoptions-color" aria-label="Permalink to &quot;cornersOptions.color&quot;">​</a></h3><ul><li>Type: <code>string</code></li><li>Default: <code>#000000</code></li></ul><h3 id="cornersoptions-radius" tabindex="-1">cornersOptions.radius <a class="header-anchor" href="#cornersoptions-radius" aria-label="Permalink to &quot;cornersOptions.radius&quot;">​</a></h3><ul><li>Type: <code>object</code> | <code>number</code></li></ul><p>It is the corners rounded radius. It is Effective when cornersOptions.type includes &#39;rounded&#39;.</p><h4 id="cornersoptions-radius-inner" tabindex="-1">cornersOptions.radius.inner <a class="header-anchor" href="#cornersoptions-radius-inner" aria-label="Permalink to &quot;cornersOptions.radius.inner&quot;">​</a></h4><ul><li>Type: <code>number</code></li><li>Default: <code>dotSize / 4</code></li></ul><h4 id="cornersoptions-radius-outer" tabindex="-1">cornersOptions.radius.outer <a class="header-anchor" href="#cornersoptions-radius-outer" aria-label="Permalink to &quot;cornersOptions.radius.outer&quot;">​</a></h4><ul><li>Type: <code>number</code></li><li>Default: <code>dotSize / 2</code></li></ul>`,82);function d(c,u,h,p,g,q){const o=r("Tongji");return t(),a("div",null,[n,i(o)])}const m=e(s,[["render",d]]);export{b as __pageData,m as default};
