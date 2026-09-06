import { EmptyState } from "@/components/empty-state"
import { Button} from "@/components/ui/button"
import Link from "next/link"
import { VideoIcon, BanIcon} from "lucide-react"

interface Props{
  meetingId: string;
  onCancelMeeting: ()=> void;
  isCancelling: boolean;
}

export const UpcomingState = ({ meetingId, onCancelMeeting, isCancelling }: Props) => {
  return (
    <div className="flex flex-col justify-center items-center gap-y-8 px-4 py-5 rounded-lg bg-white ">
        <EmptyState
        image="/upcoming.svg"
        title="No started yet"
        description="Once you start the meeting, a summary of the meeting will be generated and you can view it here. You can also view your past meetings and their summaries in the completed section."
        />
        <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2-w-full">
          <Button 
           variant="secondary"
           className="w-full lg:w-auto  "
           onClick={onCancelMeeting}
           disabled={isCancelling}
           >
            <BanIcon/>
            Cancel Meeting
          </Button>
          <Button asChild  disabled={isCancelling} className="w-full lg:w-auto">
          <Link href={`/call/${meetingId}`}>
            <VideoIcon/>
            Start Meeting
          </Link>
          </Button>
        </div>
    </div>
  )
}