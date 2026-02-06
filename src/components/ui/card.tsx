import { cn } from '@/lib/utils'

function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-component="card"
      className={cn(
        'w-full flex flex-col bg-card text-card-foreground overflow-hidden text-sm ring-1 ring-foreground/10 group/card',
        className,
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-component="card-header"
      className={cn('grid auto-rows-min items-start gap-1 border-b p-4', className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 data-component="card-title" className={cn('text-base leading-snug font-medium', className)} {...props} />
}

function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p data-component="card-description" className={cn('text-muted-foreground text-sm', className)} {...props} />
}

function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-component="card-content" className={cn('flex flex-row', className)} {...props} />
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent }
