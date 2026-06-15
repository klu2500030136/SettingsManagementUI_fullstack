import { useEffect, useState } from "react";
import AISearchBar from "../features/search/components/AISearchBar";
import SearchSuggestions from "../features/search/components/SearchSuggestions";
import SearchLoader from "../features/search/components/SearchLoader";
import SearchResultCard from "../features/search/components/SearchResultCard";
import useDebounce from "../hooks/useDebounce";

function getSearchUserName() {
  try {
    const user = JSON.parse(sessionStorage.getItem("user"));
    return user?.fullName || user?.username || user?.email || "Unknown User";
  } catch {
    return "Unknown User";
  }
}

function SearchPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const debouncedQuery = useDebounce(query, 700);

  useEffect(() => {
    if (!debouncedQuery) {
      Promise.resolve().then(() => setResults([]));
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
        const response = await fetch(`${apiUrl}/api/semantic-search`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            query: debouncedQuery,
            userName: getSearchUserName()
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          // Transform response to match UI expectations
          const formattedResults = data.map(item => ({
            id: item.settingKey,
            title: item.settingKey,
            description: item.description,
            similarity: Math.round(item.score * 100) || 0
          }));
          setResults(formattedResults);
        } else {
          console.error("Failed to fetch semantic search results");
          setResults([]);
        }
      } catch (error) {
        console.error("Semantic search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    Promise.resolve().then(fetchResults);
  }, [debouncedQuery]);

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Header */}
      <div>

        <h1 className="text-3xl font-bold font-heading text-surface-900 dark:text-text-main tracking-tight">
          Semantic Search
        </h1>

        <p className="text-text-secondary mt-1.5 text-base font-medium">
          AI-powered intelligent search system.
        </p>

      </div>

      {/* Search */}
      <AISearchBar
        query={query}
        setQuery={setQuery}
      />

      {/* Suggestions */}
      <SearchSuggestions
        setQuery={setQuery}
      />

      {/* Loading */}
      {loading && <SearchLoader />}

      {/* Results */}
      <div className="space-y-6">

        {!loading &&
          results.map((result) => (
            <SearchResultCard
              key={result.id}
              result={result}
            />
          ))}

      </div>

    </div>
  );
}

export default SearchPage;
