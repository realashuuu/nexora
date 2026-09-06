import { EmptyState } from "@/components/empty-state" 

export const ProcessingState = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-y-8 px-4 py-5 rounded-lg bg-white ">
        <EmptyState
        image="/processing.svg"
        title="Meeting completed"
        description="This meeting has been completed, a summary will appear soon."
        />
    </div>
  )
};