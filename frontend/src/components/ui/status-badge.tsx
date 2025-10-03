import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
        success: "bg-success text-success-foreground hover:bg-success/80",
        warning: "bg-warning text-warning-foreground hover:bg-warning/80",
        info: "bg-info text-info-foreground hover:bg-info/80",
        outline: "text-foreground border border-border hover:bg-accent hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: 'active' | 'inactive' | 'pending' | 'approved' | 'rejected' | 'draft'
}

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  const getVariant = (status: string) => {
    switch (status) {
      case 'active':
      case 'approved':
        return 'success'
      case 'inactive':
      case 'rejected':
        return 'destructive'
      case 'pending':
        return 'warning'
      case 'draft':
        return 'secondary'
      default:
        return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'ใช้งาน'
      case 'inactive':
        return 'ไม่ใช้งาน'
      case 'pending':
        return 'รอดำเนินการ'
      case 'approved':
        return 'อนุมัติ'
      case 'rejected':
        return 'ปฏิเสธ'
      case 'draft':
        return 'ร่าง'
      default:
        return status
    }
  }

  return (
    <Badge 
      variant={getVariant(status)} 
      className={cn("capitalize", className)} 
      {...props}
    >
      {getStatusText(status)}
    </Badge>
  )
}

export { Badge, badgeVariants }