import { countries, getCountryByCallingCode } from '../constants/countries';

export interface PhoneFormat {
  countryCode: string;
  callingCode: string;
  format: (number: string) => string;
}

// Phone number formatting patterns for different countries
const phoneFormats: Record<string, PhoneFormat> = {
  '+1': {
    countryCode: 'US',
    callingCode: '+1',
    format: (number: string) => {
      // US/Canada format: +1 (XXX) XXX-XXXX
      const cleaned = number.replace(/\D/g, '');
      if (cleaned.length === 10) {
        return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      }
      return `+1 ${number}`;
    }
  },
  '+46': {
    countryCode: 'SE',
    callingCode: '+46',
    format: (number: string) => {
      // Sweden format: +46 XX XXX XX XX
      const cleaned = number.replace(/\D/g, '');
      if (cleaned.length >= 9) {
        return `+46 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7, 9)}`;
      }
      return `+46 ${number}`;
    }
  },
  '+44': {
    countryCode: 'GB',
    callingCode: '+44',
    format: (number: string) => {
      // UK format: +44 XXXX XXXXXX
      const cleaned = number.replace(/\D/g, '');
      if (cleaned.length >= 10) {
        return `+44 ${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
      }
      return `+44 ${number}`;
    }
  },
  '+49': {
    countryCode: 'DE',
    callingCode: '+49',
    format: (number: string) => {
      // Germany format: +49 XXX XXXXXXX
      const cleaned = number.replace(/\D/g, '');
      if (cleaned.length >= 11) {
        return `+49 ${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
      }
      return `+49 ${number}`;
    }
  },
  '+33': {
    countryCode: 'FR',
    callingCode: '+33',
    format: (number: string) => {
      // France format: +33 X XX XX XX XX
      const cleaned = number.replace(/\D/g, '');
      if (cleaned.length >= 9) {
        return `+33 ${cleaned.slice(0, 1)} ${cleaned.slice(1, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7, 9)}`;
      }
      return `+33 ${number}`;
    }
  },
  '+91': {
    countryCode: 'IN',
    callingCode: '+91',
    format: (number: string) => {
      // India format: +91 XXXXX XXXXX
      const cleaned = number.replace(/\D/g, '');
      if (cleaned.length >= 10) {
        return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
      }
      return `+91 ${number}`;
    }
  },
  '+86': {
    countryCode: 'CN',
    callingCode: '+86',
    format: (number: string) => {
      // China format: +86 XXX XXXX XXXX
      const cleaned = number.replace(/\D/g, '');
      if (cleaned.length >= 11) {
        return `+86 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 7)} ${cleaned.slice(7)}`;
      }
      return `+86 ${number}`;
    }
  },
  '+81': {
    countryCode: 'JP',
    callingCode: '+81',
    format: (number: string) => {
      // Japan format: +81 X XXXX XXXX
      const cleaned = number.replace(/\D/g, '');
      if (cleaned.length >= 10) {
        return `+81 ${cleaned.slice(0, 1)} ${cleaned.slice(1, 5)} ${cleaned.slice(5)}`;
      }
      return `+81 ${number}`;
    }
  },
  '+55': {
    countryCode: 'BR',
    callingCode: '+55',
    format: (number: string) => {
      // Brazil format: +55 XX XXXXX XXXX
      const cleaned = number.replace(/\D/g, '');
      if (cleaned.length >= 11) {
        return `+55 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
      }
      return `+55 ${number}`;
    }
  },
  '+52': {
    countryCode: 'MX',
    callingCode: '+52',
    format: (number: string) => {
      // Mexico format: +52 XXX XXX XXXX
      const cleaned = number.replace(/\D/g, '');
      if (cleaned.length >= 10) {
        return `+52 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
      }
      return `+52 ${number}`;
    }
  },
  '+34': {
    countryCode: 'ES',
    callingCode: '+34',
    format: (number: string) => {
      // Spain format: +34 XXX XXX XXX
      const cleaned = number.replace(/\D/g, '');
      if (cleaned.length >= 9) {
        return `+34 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
      }
      return `+34 ${number}`;
    }
  },
  '+39': {
    countryCode: 'IT',
    callingCode: '+39',
    format: (number: string) => {
      // Italy format: +39 XXX XXX XXXX
      const cleaned = number.replace(/\D/g, '');
      if (cleaned.length >= 10) {
        return `+39 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
      }
      return `+39 ${number}`;
    }
  },
  '+47': {
    countryCode: 'NO',
    callingCode: '+47',
    format: (number: string) => {
      // Norway format: +47 XXX XX XXX
      const cleaned = number.replace(/\D/g, '');
      if (cleaned.length >= 8) {
        return `+47 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5)}`;
      }
      return `+47 ${number}`;
    }
  },
  '+45': {
    countryCode: 'DK',
    callingCode: '+45',
    format: (number: string) => {
      // Denmark format: +45 XX XX XX XX
      const cleaned = number.replace(/\D/g, '');
      if (cleaned.length >= 8) {
        return `+45 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6)}`;
      }
      return `+45 ${number}`;
    }
  },
  '+358': {
    countryCode: 'FI',
    callingCode: '+358',
    format: (number: string) => {
      // Finland format: +358 XX XXX XXXX
      const cleaned = number.replace(/\D/g, '');
      if (cleaned.length >= 9) {
        return `+358 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
      }
      return `+358 ${number}`;
    }
  },
  '+41': {
    countryCode: 'CH',
    callingCode: '+41',
    format: (number: string) => {
      // Switzerland format: +41 XX XXX XXXX
      const cleaned = number.replace(/\D/g, '');
      if (cleaned.length >= 9) {
        return `+41 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
      }
      return `+41 ${number}`;
    }
  }
};

/**
 * Formats a phone number according to the country's standard format
 * @param phoneNumber - The phone number to format (e.g., "+12322322222")
 * @returns Formatted phone number (e.g., "+1 (232) 232-2222")
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  
  // Find the calling code from the phone number
  const callingCode = Object.keys(phoneFormats).find(code => 
    phoneNumber.startsWith(code)
  );
  
  if (callingCode && phoneFormats[callingCode]) {
    // Remove the calling code to get the local number
    const localNumber = phoneNumber.substring(callingCode.length);
    return phoneFormats[callingCode].format(localNumber);
  }
  
  // If no specific format found, return the original number
  return phoneNumber;
};

/**
 * Gets the country information for a phone number
 * @param phoneNumber - The phone number
 * @returns Country information or null if not found
 */
export const getCountryFromPhoneNumber = (phoneNumber: string) => {
  if (!phoneNumber) return null;
  
  const callingCode = Object.keys(phoneFormats).find(code => 
    phoneNumber.startsWith(code)
  );
  
  if (callingCode) {
    return getCountryByCallingCode(callingCode);
  }
  
  return null;
};

/**
 * Validates if a phone number is in the correct format for its country
 * @param phoneNumber - The phone number to validate
 * @returns true if valid, false otherwise
 */
export const validatePhoneNumber = (phoneNumber: string): boolean => {
  if (!phoneNumber) return false;
  
  const callingCode = Object.keys(phoneFormats).find(code => 
    phoneNumber.startsWith(code)
  );
  
  if (callingCode) {
    const localNumber = phoneNumber.substring(callingCode.length);
    const cleaned = localNumber.replace(/\D/g, '');
    const country = getCountryFromPhoneNumber(phoneNumber);
    
    if (country) {
      return cleaned.length === country.phoneLength;
    }
  }
  
  return false;
}; 