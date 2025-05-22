alert('Partner IFrame loaded successfully.');
console.log('Partner code', window.partnerDomain);
console.log('Partner ID', window.partnerId);
console.log('Partner URL', window.partnerUrl);

if (window.partnerDomain) {
  window.fetch(
    `${window.originUrl}/api/partners/portal?ifr_code=${window.partnerDomain}`,
    {
      headers: {
        'X-Partner-Url': window.partnerUrl
      },
      mode: 'cors'
    }
  ).then(function(res) {
    return res;
  }).then(async (res) => {
    if (res.status === 202) {
      const data = await res.json();
      console.log("Data: ", data)

      const partnerContainer = document.querySelector(`[data-domain="${window.partnerDomain}"]`);
      if (partnerContainer) {
        partnerContainer.innerHTML = JSON.stringify(data);
      }
    } else {
      console.log("Response:", res);
    }
  });
}
