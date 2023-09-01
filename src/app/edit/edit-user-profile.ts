import { Country } from '@app/types/enums';

function getFullCountryName(shortCountryName: string): string {
  let fullCountryName: string;
  switch (shortCountryName) {
    case 'US':
      fullCountryName = Country.UnitedStates;
      break;
    case 'DE':
      fullCountryName = Country.Germany;
      break;
    case 'ES':
      fullCountryName = Country.Spain;
      break;
    case 'AU':
      fullCountryName = Country.Australia;
      break;
  }
  return fullCountryName!;
}

export { getFullCountryName };
