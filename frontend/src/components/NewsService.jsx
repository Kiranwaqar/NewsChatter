// NewsService.js - Handles news data fetching functions

// This could be an API endpoint in a real scenario
// For now, we're using mock data to simulate database fetching
const API_BASE_URL = "/api/news";

// Sample news data by category
const mockNewsDatabase = {
  all: [
    "Welcome to tonight's broadcast. Our top story: AI technology is revolutionizing news delivery around the world.",
    "Breaking news: Global leaders agree on climate policy framework in an unprecedented summit.",
    "Headlines today include economic growth surpassing expectations and technology breakthroughs.",
  ],
  politics: [
    "Congress passes new infrastructure bill with bipartisan support.",
    "Presidential approval ratings show slight improvement following policy announcements.",
    "Local elections see record turnout as community engagement increases.",
  ],
  sports: [
    "The championship finals ended with a surprising upset victory.",
    "Olympic qualifying rounds begin next month with new athletes to watch.",
    "Local team secures funding for new training facilities.",
  ],
  technology: [
    "Breakthrough in quantum computing announced by research team.",
    "New smartphone technology promises extended battery life and faster processing.",
    "Tech giants collaborate on AI ethics standards for industry-wide adoption.",
  ],
  business: [
    "Stock markets reach new heights as investor confidence grows.",
    "Startup funding reaches record levels in the first quarter.",
    "Major merger announced between industry leaders, pending regulatory approval.",
  ],
  entertainment: [
    "Box office records broken by new film release over the weekend.",
    "Music streaming platforms announce new artist payment structures.",
    "Award show controversy sparks industry-wide conversation about representation.",
  ],
  health: [
    "Medical researchers announce promising results in treatment trials.",
    "Public health initiative shows positive outcomes in preliminary data.",
    "New guidelines issued for preventative care practices nationwide.",
  ],
  science: [
    "Astronomers discover potentially habitable exoplanet within our galaxy.",
    "Research breakthrough in materials science promises more efficient solar panels.",
    "Gene therapy trials show promising results for treating rare diseases.",
  ],
  environment: [
    "Renewable energy adoption exceeds targets in several regions.",
    "Conservation efforts successfully increase endangered species population.",
    "New study maps impact of climate change on agricultural production.",
  ],
  war: [
    "Peace talks scheduled following ceasefire agreement in conflict zone.",
    "Humanitarian aid reaches affected populations in war-torn regions.",
    "International coalition announces new security cooperation framework.",
  ],
  international: [
    "Trade agreement signed between major economic powers.",
    "Cultural exchange program launched to strengthen diplomatic relations.",
    "International court ruling sets precedent for future disputes.",
  ],
  weather: [
    "Severe weather warning issued for coastal regions this weekend.",
    "Record temperatures recorded across multiple regions this summer.",
    "Long-term forecast predicts milder winter conditions than previous years.",
  ],
  crime: [
    "Major investigation concludes with multiple arrests in fraud case.",
    "Community policing initiative shows reduction in neighborhood crime rates.",
    "New security measures implemented following cybersecurity breach.",
  ],
};

// Function to fetch news by category
async function fetchNewsByCategory(category) {
  // In a real application, this would be an API call
  // For demonstration, we'll simulate network latency with a timeout
  return new Promise((resolve) => {
    setTimeout(() => {
      const newsItems = mockNewsDatabase[category] || mockNewsDatabase.all;
      // Return a random news item from the category
      const randomIndex = Math.floor(Math.random() * newsItems.length);
      resolve(newsItems[randomIndex]);
    }, 300);
  });
}

// Function to fetch all available categories
async function fetchCategories() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Object.keys(mockNewsDatabase));
    }, 200);
  });
}

// Export the service functions
export default {
  fetchNewsByCategory,
  fetchCategories,
};
