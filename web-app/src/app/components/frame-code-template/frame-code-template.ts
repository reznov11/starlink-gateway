export function getFrameCodeTemplate(data: any, originUrl: string): string {
    return `<div data-domain="${data.domain!.code}" data-partner="${data.partner!.id}"></div>
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
          const ifrPartner = document.createElement("script");
          const data = await res.json()
          ifrPartnerStyle.href = data["application.css"];
          ifrPartnerStyle.type = "text/css";
          ifrPartnerStyle.rel = "stylesheet";
          ifrPartnerStyle.async = true;
          ifrPartner.type = "text/javascript";
          ifrPartner.async = true;
          ifrPartner.src = data["application.js"];
          document.head.appendChild(ifrPartnerStyle);
          document.body.appendChild(ifrPartner);
          return res;
        } else {
          console.log("Error", res);
          return;
        }
      });
  </script>
  `;
}
