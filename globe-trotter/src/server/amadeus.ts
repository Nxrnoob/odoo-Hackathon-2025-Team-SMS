import Amadeus from 'amadeus';

// IMPORTANT: In a production environment, these credentials should be stored
// securely in environment variables, not hard-coded in the source code.
const amadeus = new Amadeus({
  clientId: 'DujJxOtRMz6CvRnRQkdmbdtnKdYs6q6a',
  clientSecret: 'cc8AxnHCeF5lFlAg',
});

export default amadeus;
