import { EmptyState } from "@/components/empty-state"
import { Button} from "@/components/ui/button"
import Link from "next/link"
import { VideoIcon} from "lucide-react"

interface Props{
  meetingId: string;
}

export const ActiveState = ({ meetingId }: Props) => {
  return (
    <div className="flex flex-col justify-center items-center gap-y-8 px-4 py-5 rounded-lg bg-white ">
        <EmptyState
        image="/upcoming.svg"
        title="Meeting is Active"
        description="Meeting will end once all participants leave the meeting."
        />
        <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2-w-full">
          <Button asChild className="w-full lg:w-auto">
          <Link href={` /call/${meetingId}`}>
            <VideoIcon/>
            Join Meeting
          </Link>
          </Button>
        </div>
    </div>
  )
}