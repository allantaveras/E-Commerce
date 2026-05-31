import { faker } from '@faker-js/faker';

export interface CustomerProfile {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export class TestDataFactory {
  static createCustomerProfile(): CustomerProfile {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      postalCode: faker.location.zipCode('#####'),
    };
  }

  static createInvalidCustomerProfile(missingField: 'firstName' | 'lastName' | 'postalCode'): CustomerProfile {
    const profile = this.createCustomerProfile();
    profile[missingField] = '';
    return profile;
  }
}
