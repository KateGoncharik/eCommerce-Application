import { Country } from '@app/types/enums';

function getFullCountryName(shortCountryName: string): string {
  const countryNames: Record<string, string> = {
    US: Country.UnitedStates,
    DE: Country.Germany,
    ES: Country.Spain,
    AU: Country.Australia,
  };
  if (shortCountryName in countryNames) {
    return countryNames[shortCountryName];
  }
  throw new Error('Invalid country');
}

export { getFullCountryName };
