import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { WordCloud } from "@isoterik/react-word-cloud";

export default function ChartSection() {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);

  // Fetch extracted entities from backend
  useEffect(() => {
    async function fetchEntities() {   
      try {
        const res = await axios.get("http://localhost:8000/api/extract/");
        const extracted = [];

        // Flatten note → entities
        res.data.forEach((item) => {
          item.entities.forEach((ent) => {
            extracted.push({
              id: ent.id,
              age: ent.age || "-",
              drug: ent.drug || "-",
              route: ent.route || "-",
              form: ent.form || "-",
              diagnosis: ent.diagnosis || "-",
              condition: ent.condition || "-",
            });
          });
        });

        setEntities(extracted);
      } catch (err) {
        console.error("Error fetching entities:", err);
        setError("Failed to load extracted entities. Check your backend connection.");
      } finally {
        setLoading(false);
      }
    }

    fetchEntities();
  }, []);

  // Compute drug frequencies for word cloud
  const wordCloudData = useMemo(() => {
    const freq = {};
    entities.forEach((ent) => {
      if (ent.drug && ent.drug !== "-") {
        freq[ent.drug] = (freq[ent.drug] || 0) + 1;
      }
    });
    return Object.entries(freq).map(([text, value]) => ({ text, value }));
  }, [entities]);

  // --- UI Rendering ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <p className="text-gray-500 animate-pulse">Loading charts...</p>
      </div>
    );
  }

  if (error)
    return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="space-y-10">
      {/* Word Cloud Section */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Drug Frequency Word Cloud
        </h3>

        {wordCloudData.length > 0 ? (
          <div className="h-[22rem] w-full">
            <WordCloud
              words={wordCloudData}
              options={{
                rotations: 2,
                rotationAngles: [0, 90],
                fontSizes: [15, 60],
                deterministic: true,
                colors: ["#1E3A8A", "#2563EB", "#60A5FA", "#93C5FD", "#3B82F6"],
              }}
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        ) : (
          <p className="text-gray-500 text-center">No drug data available to visualize.</p>
        )}
      </div>
    </div>
  );
}
      