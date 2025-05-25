export function getFrameCodeTemplate(data: any, originUrl: string): string {
    return `<div data-partner-domain="${data.domain!.code}" data-partner-id="${data.partner!.id}"></div>
  <script type="text/javascript">
    (() => {
      Object.assign(window, {
        partnerId: "${data.partner!.id}",
        partnerDomain: "${data.domain!.code}",
        partnerUrl: "${data.domain!.url}",
        originUrl: "${originUrl}",
        lang: "ru"
      });

      fetch("${originUrl}/api/partners/manifest/", {
        headers: { 'Content-Type': 'application/json' }
      })
        .then(async r => {
          if (r.status !== 202) throw new Error("Error: " + r.status);

          const d = await r.json();
          const origins = d["origins"];

          if (!origins.includes(originUrl)) throw new Error("Origin not allowed");

          const elem = (t, a) => Object.assign(document.createElement(t), a);
          [
            elem("link", { rel: "stylesheet", href: d["application.css"], type: "text/css", async: true }),
            elem("script", { src: d["purify.js"], type: "text/javascript", async: true }),
            elem("script", { src: d["application.js"], type: "text/javascript", async: true })
          ].forEach(e => (e.tagName === "LINK" ? document.head : document.body).appendChild(e));
        })
        .catch(e => console.error("Manifest fetch error:", e));
    })();
  </script>
  `;
}
