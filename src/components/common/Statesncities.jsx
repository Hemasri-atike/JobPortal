// const statesWithCities = {
//   "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati"],
//   "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tawang"],
//   "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat"],
//   "Bihar": ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur"],
//   "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba"],
//   "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa"],
//   "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
//   "Haryana": ["Gurgaon", "Faridabad", "Panipat", "Ambala"],
//   "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala", "Solan"],
//   "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro"],
//   "Karnataka": ["Bengaluru", "Mysuru", "Mangalore", "Hubli"],
//   "Kerala": ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur"],
//   "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior"],
//   "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
//   "Manipur": ["Imphal", "Thoubal", "Churachandpur", "Ukhrul"],
//   "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongpoh"],
//   "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Serchhip"],
//   "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang"],
//   "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Sambalpur"],
//   "Punjab": ["Amritsar", "Ludhiana", "Jalandhar", "Patiala"],
//   "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota"],
//   "Sikkim": ["Gangtok", "Namchi", "Geyzing", "Mangan"],
//   "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem"],
//   "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
//   "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailasahar"],
//   "Uttar Pradesh": ["Lucknow", "Noida", "Ghaziabad", "Kanpur"],
//   "Uttarakhand": ["Dehradun", "Haridwar", "Nainital", "Rishikesh"],
//   "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri"],

//   // Union Territories
//   "Andaman and Nicobar Islands": ["Port Blair", "Havelock", "Car Nicobar", "Diglipur"],
//   "Chandigarh": ["Chandigarh"],
//   "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa"],
//   "Delhi": ["New Delhi", "Dwarka", "Rohini", "Saket"],
//   "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla"],
//   "Ladakh": ["Leh", "Kargil"],
//   "Lakshadweep": ["Kavaratti", "Agatti", "Minicoy", "Amini"],
//   "Puducherry": ["Pondicherry", "Karaikal", "Mahe", "Yanam"]
// };



const statesWithCities = {
  "Andhra Pradesh": [
    "Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool",
    "Rajahmundry", "Tirupati", "Anantapur", "Kadapa", "Ongole",
    "Eluru", "Machilipatnam", "Srikakulam", "Vizianagaram", "Chittoor"
  ],
  "Arunachal Pradesh": [
    "Itanagar", "Naharlagun", "Pasighat", "Tawang", "Ziro"
  ],
  "Assam": [
    "Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Tezpur"
  ],
  "Bihar": [
    "Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia"
  ],
  "Chhattisgarh": [
    "Raipur", "Bhilai", "Bilaspur", "Korba", "Durg"
  ],
  "Goa": [
    "Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"
  ],
  "Gujarat": [
    "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar"
  ],
  "Haryana": [
    "Gurugram", "Faridabad", "Panipat", "Ambala", "Hisar", "Karnal"
  ],
  "Himachal Pradesh": [
    "Shimla", "Manali", "Dharamshala", "Mandi", "Solan"
  ],
  "Jharkhand": [
    "Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar"
  ],
  "Karnataka": [
    "Bengaluru", "Mysuru", "Mangalore", "Hubli", "Belagavi"
  ],
  "Kerala": [
    "Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"
  ],
  "Madhya Pradesh": [
    "Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Sagar"
  ],
  "Maharashtra": [
    "Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Kolhapur"
  ],
  "Manipur": [
    "Imphal", "Thoubal", "Kakching", "Ukhrul"
  ],
  "Meghalaya": [
    "Shillong", "Tura", "Jowai", "Nongpoh"
  ],
  "Mizoram": [
    "Aizawl", "Lunglei", "Champhai"
  ],
  "Nagaland": [
    "Kohima", "Dimapur", "Mokokchung", "Tuensang"
  ],
  "Odisha": [
    "Bhubaneswar", "Cuttack", "Rourkela", "Sambalpur", "Puri"
  ],
  "Punjab": [
    "Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Bathinda"
  ],
  "Rajasthan": [
    "Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner"
  ],
  "Sikkim": [
    "Gangtok", "Namchi", "Gyalshing", "Mangan"
  ],
  "Tamil Nadu": [
    "Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli", "Vellore"
  ],
  "Telangana": [
    "Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"
  ],
  "Tripura": [
    "Agartala", "Udaipur", "Kailasahar", "Dharmanagar"
  ],
  "Uttar Pradesh": [
    "Lucknow", "Kanpur", "Noida", "Ghaziabad", "Varanasi", "Agra", "Prayagraj"
  ],
  "Uttarakhand": [
    "Dehradun", "Haridwar", "Rishikesh", "Haldwani", "Roorkee"
  ],
  "West Bengal": [
    "Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"
  ],
  // Union Territories
  "Delhi": ["New Delhi", "Dwarka", "Rohini", "Saket"],
  "Chandigarh": ["Chandigarh"],
  "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam"],
  "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla"],
  "Ladakh": ["Leh", "Kargil"],
  "Andaman and Nicobar Islands": ["Port Blair"],
  "Lakshadweep": ["Kavaratti"]
};




export default statesWithCities;
