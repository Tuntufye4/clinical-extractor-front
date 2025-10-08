import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import WordCloud from "react-d3-cloud";

export default function ChartSection() {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function fetchEntities() {
      try {
        const res = await axios.get("http://localhost:8000/api/extract/");
        const extracted = [];

        res.data.forEach((item) => {
          const entitiesArray = item.note?.entities?.length
            ? item.note.entities
            : item.entities;

          entitiesArray.forEach((ent) => {
            const drugs = ent.drug
              ? ent.drug.split(",").map((d) => d.trim()).filter(Boolean)
              : [];

            drugs.forEach((drug) => {
              extracted.push({ drug });
            });
          });
        });

        setEntities(extracted);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch entities.");
      } finally {
        setLoading(false);
      }
    }

    fetchEntities();
  }, []);

  const wordCloudData = useMemo(() => {
    const freq = {};
    entities.forEach((e) => {
      freq[e.drug] = (freq[e.drug] || 0) + 1;
    });

    const dataArr = Object.entries(freq).map(([text, value]) => ({ text, value }));
    return dataArr.sort((a, b) => b.value - a.value).slice(0, 30);
  }, [entities]);

  useEffect(() => {
    setReady(true);
  }, []);

  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;

  return (
    <div className="space-y-10">
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Drug Frequency
        </h3>

        {ready && !loading && (
          <div
            style={{
              width: "100%",
              maxWidth: 1200,
              height: 700,
              margin: "0 auto",
            }}
          >
            <WordCloud
              key={wordCloudData.length}
              data={wordCloudData}
              font="Times"
              fontStyle="italic"
              fontWeight="bold"
              fontSize={(word) =>
                Math.min(Math.max(Math.log2(word.value + 1) * 40, 18), 120)
              }
              spiral="rectangular"
              rotate={() => 0}
              padding={2}
            />
          </div>
        )}
      </div>
    </div>
  );
}
