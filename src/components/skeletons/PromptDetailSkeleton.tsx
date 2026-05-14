export default function PromptDetailSkeleton() {
  return (
    <div className="max-w-[1280px] mx-auto px-6 py-8">
      {/* Back button skeleton */}
      <div className="h-6 w-24 bg-bg-200 rounded animate-pulse mb-6" />
      
      {/* Title and meta skeleton */}
      <div className="h-9 bg-bg-200 rounded animate-pulse mb-2 w-1/3" />
      <div className="h-4 bg-bg-200 rounded animate-pulse mb-6 w-32" />
      
      {/* 2-Column grid skeleton */}
      <div className="grid grid-cols-2 gap-8">
        <div className="bg-bg-200 rounded-2xl h-[500px] animate-pulse" />
        <div>
          <div className="aspect-square rounded-2xl bg-bg-200 animate-pulse" />
          <div className="h-4 w-40 bg-bg-200 rounded animate-pulse mx-auto mt-3" />
        </div>
      </div>
    </div>
  );
}
