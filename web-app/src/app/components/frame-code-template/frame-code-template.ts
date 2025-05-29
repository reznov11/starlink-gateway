export function getFrameCodeTemplate(data: any, originUrl: string): string {
    return `<!-- Вставьте этот HTML-код в то место, где вы хотите отобразить форму. -->
<bakai-partner data-partner-domain="${data.domain!.code}" data-partner-id="${data.partner!.id}"></bakai-partner>

  <!-- Вставьте этот код внутри тега <body> -->
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

          const bakaiPartner = document.querySelector(\`bakai-partner\`);

          if (!bakaiPartner) return false;

          const partnerShadow = bakaiPartner.attachShadow({ mode: "open" })

          const elem = (t, a) => Object.assign(document.createElement(t), a);
          [
              elem("link", { rel: "stylesheet", href: d["application.css"], type: "text/css", async: true }),
              elem("script", { src: d["purify.js"], type: "text/javascript", async: true }),
              elem("script", { src: d["application.js"], type: "text/javascript", async: true })
          ].forEach(
              e => e.tagName === "LINK" ? partnerShadow.prepend(e) : document.body.appendChild(e)
          )
        })
        .catch(e => console.error("Manifest fetch error:", e));
    })();
  </script>
  `;
}
