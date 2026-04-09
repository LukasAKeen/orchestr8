"use client";

import { Sparkles, Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AISuggestionCardProps {
  title: string;
  description: string;
  reasoning?: string;
  onAccept?: () => void;
  onReject?: () => void;
  isLoading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function AISuggestionCard({
  title,
  description,
  reasoning,
  onAccept,
  onReject,
  isLoading,
  className,
  children,
}: AISuggestionCardProps) {
  return (
    <Card
      className={cn(
        "border-purple-200 dark:border-purple-800/50 bg-purple-50/50 dark:bg-purple-900/10",
        className
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-1.5 mt-0.5">
            <Sparkles className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{title}</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {description}
            </p>
            {reasoning && (
              <p className="text-xs text-muted-foreground/70 mt-2 italic">
                {reasoning}
              </p>
            )}
            {children}
          </div>
        </div>
        {(onAccept || onReject) && (
          <div className="flex items-center gap-2 mt-3 ml-9">
            {onAccept && (
              <Button
                size="sm"
                variant="default"
                onClick={onAccept}
                disabled={isLoading}
                className="h-7 text-xs"
              >
                <Check className="h-3 w-3 mr-1" />
                Accept
              </Button>
            )}
            {onReject && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onReject}
                disabled={isLoading}
                className="h-7 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Dismiss
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
