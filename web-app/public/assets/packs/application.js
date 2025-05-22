console.log('Partner IFrame loaded successfully.');

console.log('Partner code', window.domain);
console.log('Partner ID', window.partner_id);
console.log('Partner URL', window.partner_url);

if (window.domain) {
  window.fetch(
    `http://localhost:4200/api/partners/portal?ifr_code=${window.domain}`
  ).then(function(res) {
    return res;
  }).then(async (res) => {
    if (res.status === 202) {
      console.log("Data: ", await res.json())
    } else {
      console.log("Response:", res);
    }
  });
}
