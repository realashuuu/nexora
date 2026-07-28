import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAgentsFilters } from "../../hooks/use-agents-filter";

export const AgentsSearchfilters = ()=>{
  const[ filters, setFilters ] = useAgentsFilters();
  return (
    <div className="relative ml-7">
      <Input 
        placeholder="Filter by name"
        className="bg-white h-9 w-50 pl-7"
        value={filters.search}
        onChange={(e) =>setFilters({search:e.target.value})}
      />
      <SearchIcon className="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}