import { EmptyState } from "@/components/empty-state" 

export const CancelledState = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-y-8 px-4 py-5 rounded-lg bg-white ">
        <EmptyState
        image="/cancelled.svg"
        title="Meeting Cancelled"
        description="This meeting has been cancelled."
        />
    </div>
  )
};