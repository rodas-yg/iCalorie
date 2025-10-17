// calorieinfo.js

export async function fetchCalorieData(foodName) {
  const apiUrl = `https://platform.fatsecret.com/rest/server.api?query=${encodeURIComponent(foodName)}`;

  try {
    const response = await fetch(apiUrl, {
      headers: { "X-Api-Key": "5291e0575ed74613853cde952aea4ca7" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data from API");
    }

    const data = await response.json();
    return data; // returns array of food objects
  } catch (error) {
    console.error("API fetch error:", error);
    throw error;
  }
}
