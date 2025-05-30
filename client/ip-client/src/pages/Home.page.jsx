import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";

export default function Home() {
  const [monsters, setMonsters] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingMonsters, setLoadingMonsters] = useState({});
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRarity, setSelectedRarity] = useState({}); // Add this state for rarity per monster

  const baseURL = "https://gc.handriasyrafi.site";

  // Fetch monsters on component mount
  useEffect(() => {
    fetchMonsters();
    fetchRecommendations();
  }, []);

  const fetchMonsters = async () => {
    try {
      const response = await axios.get(`${baseURL}/monsters`);
      setMonsters(response.data);
    } catch (error) {
      console.error("Error fetching monsters:", error);
      Swal.fire("Error", "Failed to fetch monsters", "error");
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get(`${baseURL}/recommendations`);
      setRecommendations(response.data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  const generateWeapon = async (monsterId) => {
    setLoadingMonsters((prev) => ({ ...prev, [monsterId]: true }));
    try {
      const token = localStorage.getItem("access_token");

      // Build URL with rarity parameter if selected
      let url = `${baseURL}/monsters/${monsterId}/best-weapon`;
      if (selectedRarity[monsterId]) {
        url += `?rarity=${selectedRarity[monsterId]}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSelectedRecommendation(response.data);
      setShowModal(true);

      await fetchRecommendations();

      Swal.fire({
        title: "Weapon Generated!",
        text: `Best weapon: ${response.data.recommendedWeapon.name} (Rarity: ${response.data.recommendedWeapon.rarity})`,
        icon: "success",
      });
    } catch (error) {
      console.error("Error generating weapon:", error);
      if (error.response?.status === 401) {
        Swal.fire("Error", "Please login to generate weapons", "error");
      } else {
        Swal.fire(
          "Error",
          error.response?.data?.error ||
            "Failed to generate weapon recommendation",
          "error"
        );
      }
    } finally {
      setLoadingMonsters((prev) => ({ ...prev, [monsterId]: false }));
    }
  };

  const handleRarityChange = (monsterId, rarity) => {
    setSelectedRarity((prev) => ({ ...prev, [monsterId]: rarity }));
  };

  const deleteRecommendation = async (recommendationId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await axios.delete(`${baseURL}/recommendations/${recommendationId}`);
        await fetchRecommendations();
        Swal.fire("Deleted!", "Recommendation has been deleted.", "success");
      }
    } catch (error) {
      console.error("Error deleting recommendation:", error);
      Swal.fire("Error", "Failed to delete recommendation", "error");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRecommendation(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-4">
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2">
              # Welcome to Monster Hunter Wilds Weapon Advisor! 🗡️⚔️
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Your ultimate Monster Hunter companion! This intelligent weapon
              recommendation system is designed to help you dominate every hunt
              with the perfect weapon choice.
            </p>
          </div>
          <button
            onClick={() => setShowRecommendations(!showRecommendations)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 w-full sm:w-auto lg:ml-4 lg:flex-shrink-0"
          >
            {showRecommendations ? "Show Monsters" : "My Recommendations"}
          </button>
        </div>

        {!showRecommendations ? (
          // Monsters Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {monsters.map((monster) => (
              <div
                key={monster.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Add monster image */}
                {monster.imageUrl && (
                  <div className="h-75 overflow-hidden">
                    <img
                      src={monster.imageUrl}
                      alt={monster.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {monster.name}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">Species:</span>{" "}
                    {monster.species}
                  </p>
                  {monster.weaknesses && monster.weaknesses.length > 0 && (
                    <div className="mb-4">
                      <p className="text-gray-600 font-semibold mb-1">
                        Weaknesses:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {monster.weaknesses.map((weakness, index) => (
                          <span
                            key={index}
                            className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded"
                          >
                            {weakness}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rarity Selector */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weapon Rarity (Optional):
                    </label>
                    <select
                      value={selectedRarity[monster.id] || ""}
                      onChange={(e) =>
                        handleRarityChange(monster.id, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any Rarity</option>
                      <option value="6">⭐⭐⭐⭐⭐⭐ Rarity 6</option>
                      <option value="7">⭐⭐⭐⭐⭐⭐⭐ Rarity 7</option>
                      <option value="8">⭐⭐⭐⭐⭐⭐⭐⭐ Rarity 8</option>
                    </select>
                  </div>

                  <button
                    onClick={() => generateWeapon(monster.id)}
                    disabled={loadingMonsters[monster.id]}
                    className="w-full bg-teal-800 hover:bg-teal-900 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                  >
                    {loadingMonsters[monster.id]
                      ? "Generating..."
                      : "Generate Best Weapon"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Recommendations List
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                My Recommendations
              </h2>
            </div>
            <div className="p-6">
              {recommendations.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                  No recommendations yet. Generate some weapon recommendations
                  first!
                </p>
              ) : (
                <div className="space-y-4">
                  {recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-gray-800">
                            {rec.Weapon?.name || "Unknown Weapon"}
                          </h4>
                          <p className="text-gray-600 mb-2">
                            <span className="font-semibold">Type:</span>{" "}
                            {rec.Weapon?.kind || "N/A"} |
                            <span className="font-semibold"> Damage:</span>{" "}
                            {rec.Weapon?.damage || "N/A"} |
                            <span className="font-semibold"> Element:</span>{" "}
                            {rec.Weapon?.element || "None"}
                          </p>
                          <p className="text-gray-600 mb-2">
                            <span className="font-semibold">User:</span>{" "}
                            {rec.User?.email || "Unknown"}
                          </p>
                          {rec.reasoning && (
                            <p className="text-sm text-gray-700 bg-gray-100 p-2 rounded">
                              {rec.reasoning}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => deleteRecommendation(rec.id)}
                          className="ml-4 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded transition duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal for showing generated recommendation */}
      {showModal && selectedRecommendation && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-5xl w-full mx-4 max-h-200 overflow-y-auto border-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">
                Weapon Recommendation
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-lg">
                  Monster: {selectedRecommendation.monster.name}
                </h4>
                <p className="text-gray-600">
                  Species: {selectedRecommendation.monster.species}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-lg">Recommended Weapon:</h4>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-semibold">
                    {selectedRecommendation.recommendedWeapon.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Type: {selectedRecommendation.recommendedWeapon.kind} |
                    Damage: {selectedRecommendation.recommendedWeapon.damage} |
                    Element:{" "}
                    {selectedRecommendation.recommendedWeapon.element || "None"}{" "}
                    | Rarity:{" "}
                    {"⭐".repeat(
                      selectedRecommendation.recommendedWeapon.rarity || 1
                    )}{" "}
                    ({selectedRecommendation.recommendedWeapon.rarity})
                  </p>
                </div>
              </div>

              {selectedRecommendation.recommendation.reasoning && (
                <div>
                  <h4 className="font-bold text-lg">Reasoning:</h4>
                  <p className="text-sm text-gray-700 bg-gray-100 p-3 rounded">
                    {selectedRecommendation.recommendation.reasoning}
                  </p>
                </div>
              )}

              {selectedRecommendation.alternativeWeapons &&
                selectedRecommendation.alternativeWeapons.length > 0 && (
                  <div>
                    <h4 className="font-bold text-lg">Alternative Weapons:</h4>
                    <div className="space-y-2">
                      {selectedRecommendation.alternativeWeapons.map(
                        (weapon, index) => (
                          <div key={index} className="bg-blue-50 p-2 rounded">
                            <p className="font-medium">{weapon.name}</p>
                            <p className="text-sm text-gray-600">
                              Effectiveness: {weapon.effectivenessScore}% |
                              Damage: {weapon.damage} | Element:{" "}
                              {weapon.element || "None"}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
