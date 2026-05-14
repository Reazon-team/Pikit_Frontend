export default function PopularPromptCardSkeleton() {
  return (
    <div>
      <div className="aspect-square rounded-xl bg-bg-200 animate-pulse" />
      <div className="mt-2">
        <div className="h-4 bg-bg-200 rounded animate-pulse mb-1 w-3/4" />
        <div className="h-3 bg-bg-200 rounded animate-pulse w-1/2" />
      </div>
    </div>
  );
}
