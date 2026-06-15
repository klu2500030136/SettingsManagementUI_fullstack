import Card from "../../../components/ui/Card";

function SearchResultCard({ result }) {
  return (
    <Card className="hover:-translate-y-1 hover:shadow-gold-btn transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-surface-900 dark:text-text-main tracking-tight">
            {result.title}
          </h2>
          <p className="text-text-secondary mt-2 font-medium">
            {result.description}
          </p>
        </div>

        {/* Similarity */}
        <div className="bg-brand/10 text-brand border border-brand/20 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap">
          {result.similarity}% Match
        </div>
      </div>
    </Card>
  );
}

export default SearchResultCard;