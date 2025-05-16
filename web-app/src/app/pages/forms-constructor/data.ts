import {FormConstructor, Partner} from '@pages/forms-constructor/interfaces';
import {UserProfile} from '@services/auth.service';
import {faker} from '@faker-js/faker';

function generateUserProfile(): UserProfile {
  const firstNames = ["John", "Jane", "Sam", "Sue", "Alex", "Chris", "Taylor", "Jordan", "Morgan", "Casey"];
  const lastNames = ["Doe", "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Martinez", "Hernandez", "Lopez"];
  const roles = ["Admin", "Manager", "User", "Support", "Guest"];
  const emails = ["@gmail.com", "@yahoo.com", "@outlook.com", "@hotmail.com"];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const role = roles[Math.floor(Math.random() * roles.length)];
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${emails[Math.floor(Math.random() * emails.length)]}`;

  return {
    id: faker.string.uuid(),
    first_name: firstName,
    last_name: lastName,
    fullname: `${firstName} ${lastName}`,
    job_title: ["Developer", "Manager", "Support", "Lead", "Intern"][Math.floor(Math.random() * 5)],
    email: email,
    phone_number: `+1-800-${Math.floor(Math.random() * 10000000)}`,
    role: role,
    is_active: Math.random() > 0.5,
    is_staff: Math.random() > 0.5,
  };
}

export function generatePartner(): Partner {
  const partners = ["Partner A", "Partner B", "Partner C", "Partner D", "Partner E"];
  return {
    id: faker.string.uuid(),
    name: partners[Math.floor(Math.random() * partners.length)],
    login: faker.internet.username(),
    phone_number: faker.phone.number(),
    email: faker.internet.email(),
    person_contact: faker.internet.displayName(),
    category: faker.string.alphanumeric(20),
    inn: faker.string.numeric(14)
  }
}

export function generateFormConstructor(): FormConstructor {
  const titles = ["Form A", "Form B", "Form C", "Form D", "Form E"];

  const partner = generatePartner();
  const title = titles[Math.floor(Math.random() * titles.length)];
  const user = generateUserProfile();
  const created_at = new Date(Date.now() - Math.floor(Math.random() * 1000000000));
  const components_total = Math.floor(Math.random() * 5) + 1;

  return {
    id: faker.string.uuid(),
    title: title,
    partner: partner,
    user: user,
    created_at: created_at,
    components_total: components_total
  };
}
