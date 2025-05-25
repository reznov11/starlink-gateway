export function getFrameCodeTemplate(data: any, originUrl: string): string {
    return `<div data-partner-domain="${data.domain!.code}" data-partner-id="${data.partner!.id}"></div>
  <script type="text/javascript">
      window.partnerId = "${data.partner!.id}";
      window.partnerDomain = "${data.domain!.code}";
      window.partnerUrl = "${data.domain!.url}";
      window.originUrl = "${originUrl}";
      window.lang = "ru";
      const headers = new Headers();
      headers.set('Content-Type', 'application/json');
      window.fetch("${originUrl}/api/partners/manifest/",{headers: headers}).then((res) => {
        return res;
      }).then(async (res) => {
        if (res.status === 202) {
          const ifrPartnerStyle = document.createElement("link");
          const ifrPartnerJs = document.createElement("script");
          const purifyJs = document.createElement("script");
          const data = await res.json()
          ifrPartnerStyle.href = data["application.css"];
          ifrPartnerStyle.type = "text/css";
          ifrPartnerStyle.rel = "stylesheet";
          ifrPartnerStyle.async = true;
          ifrPartnerJs.type = "text/javascript";
          ifrPartnerJs.async = true;
          ifrPartnerJs.src = data["application.js"];
          purifyJs.type = "text/javascript";
          purifyJs.async = true;
          purifyJs.src = data["purify.js"];
          [ifrPartnerStyle, purifyJs, ifrPartnerJs].forEach(element => {
            if (element.type === "text/css") {
              document.head.appendChild(element);
            } else {
              document.body.appendChild(element);
            }
          });
          return res;
        } else {
          console.log("Error", res);
          return;
        }
      });
  </script>
  `;
}
