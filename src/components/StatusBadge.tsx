import { Badge } from "@/components/ui/badge";
import type { PersonRecord } from "@/store/dataStore";

interface StatusBadgeProps {
  status: PersonRecord["state"];
}

const statusConfig = {
  "new customer": {
    color: "bg-red-50 text-red-700 hover:bg-red-100",
    label: "new customer",
  },
  served: {
    color: "bg-blue-50 text-blue-700 hover:bg-blue-100",
    label: "served",
  },
  "to contact": {
    color: "bg-green-50 text-green-700 hover:bg-green-100",
    label: "to contact",
  },
  paused: {
    color: "bg-yellow-50 text-yellow-700 hover:bg-yellow-100",
    label: "paused",
  },
} as const;

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge className={`${config.color} border font-medium text-xs px-2 py-1`}>
      {config.label}
    </Badge>
  );
}
