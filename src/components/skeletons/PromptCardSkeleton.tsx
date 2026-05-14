export default function PromptCardSkeleton() {
  return (
    <div className="block">
      <div className="aspect-[16/10] rounded-xl bg-bg-200 animate-pulse" />
      <div className="mt-3">
        <div className="h-5 bg-bg-200 rounded animate-pulse mb-2 w-3/4" />
        <div className="flex justify-between items-center">
          <div className="h-4 bg-bg-200 rounded animate-pulse w-20" />
          <div className="h-7 bg-bg-200 rounded animate-pulse w-24" />
        </div>
      </div>
    </div>
  );
}
