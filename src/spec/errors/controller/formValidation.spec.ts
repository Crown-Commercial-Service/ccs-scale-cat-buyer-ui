import { expect } from 'chai';
import { genarateFormValidation } from 'main/errors/controller/formValidation';

describe('form validation', () => {
  describe('genarateFormValidation', () => {
    it('generates the form validation correctly', () => {
      const formValidation = genarateFormValidation('egil', 'Your blade, it do not cut deep enough');

      expect(formValidation).to.eql({
        summary: [
          {
            id: 'egil',
            href: '#egil',
            text: 'Your blade, it do not cut deep enough',
          },
        ],
        inline: {
          'egil': {
            id: 'egil',
            href: '#egil',
            text: 'Your blade, it do not cut deep enough',
          },
        },
        text: { 'egil': 'Your blade, it do not cut deep enough' },
        hasErrors: true,
      });
    });
  });
});
