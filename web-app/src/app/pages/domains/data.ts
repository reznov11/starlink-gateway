import {Domain, DomainStatus} from '@pages/forms-constructor/interfaces';
import {faker} from '@faker-js/faker';
import {generatePartner} from '@pages/forms-constructor/data';

export function generateDomains(): Domain {
  const domains = [
    "https://google.com",
    "https://facebook.com",
    "https://x.com",
    "https://bakai.kg",
    "https://lalafo.kg"
  ];

  return {
    id: faker.string.uuid(),
    partner: generatePartner(),
    code: faker.string.alpha(14),
    url: faker.internet.url(),
    status: getRandomDomainStatus()
  }
}

function getRandomDomainStatus(): DomainStatus {
  const statusValues = Object.values(DomainStatus);
  const randomIndex = Math.floor(Math.random() * statusValues.length);
  return statusValues[randomIndex];
}
