const filterValues = {
    housingCategories: [
      { value: 'all', label: 'All Categories' },
      { value: 'rent', label: 'Rent' },
      { value: 'roommates', label: 'Roommates' },
      { value: 'shortTerm', label: 'Short Term' },
      { value: 'dailyRent', label: 'Daily Rent' },
    ],
    housingTypes: [
      { value: 'all', label: 'All Types' },
      { value: 'apartment', label: 'Apartment' },
      { value: 'room', label: 'Room' },
      { value: 'house', label: 'House' },
    ],
    locations: [
      { value: 'tbilisi', label: 'Tbilisi', districts: [
        { value: 'vake', label: 'Vake' },
        { value: 'saburtalo', label: 'Saburtalo' },
        { value: 'gldani', label: 'Gldani' },
        { value: 'didube', label: 'Didube' },
        { value: 'isani', label: 'Isani' },
        { value: 'nadzaladevi', label: 'Nadzaladevi' },
        { value: 'mtatsminda', label: 'Mtatsminda' },
      ] },
      { value: 'batumi', label: 'Batumi', districts: [
        { value: 'oldBatumi', label: 'Old Batumi' },
        { value: 'newBoulevard', label: 'New Boulevard' },
        { value: 'gonio', label: 'Gonio' },
        { value: 'chakvi', label: 'Chakvi' },
      ] },
      { value: 'kutaisi', label: 'Kutaisi', districts: [
        { value: 'central', label: 'Central' },
        { value: 'bagrati', label: 'Bagrati' },
        { value: 'ukhimerioni', label: 'Ukhimerioni' },
      ] },
      { value: 'rustavi', label: 'Rustavi', districts: [
        { value: 'oldRustavi', label: 'Old Rustavi' },
        { value: 'newRustavi', label: 'New Rustavi' },
      ] },
      { value: 'zugdidi', label: 'Zugdidi', districts: [
        { value: 'central', label: 'Central' },
        { value: 'dadiani', label: 'Dadiani' },
        { value: 'inganir', label: 'Inganir' },
      ] },
    ],
    rentDurations: [
      { value: 'none', label: 'None Selected' },
      { value: 'daily', label: 'Daily' },
      { value: '1_month', label: '1 Month' },
      { value: '3_months', label: '3 Months' },
      { value: '6_months', label: '6 Months' },
      { value: '1_year', label: '1 Year' },
    ],
  };
  
  export default filterValues;