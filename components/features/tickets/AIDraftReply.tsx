"use client";

import { useState } from "react";
import { useCompletion } from "@ai-sdk/react";
import { Sparkles, Loader2, Send, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface AIDraftReplyProps {
  ticketId: number;
  ticketSubject: string;
  ticketDescription: string;
}

export function AIDraftReply({
  ticketId,
  ticketSubject,
  ticketDescription,
}: AIDraftReplyProps) {
  const [editedReply, setEditedReply] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const { completion, isLoading, complete, stop } = useCompletion({
    api: "/api/ai/draft-reply",
    body: {
      ticketId,
      subject: ticketSubject,
      description: ticketDescription,
    },
    onFinish: (_prompt, completionText) => {
      setEditedReply(completionText);
    },
  });

  const handleDraft = () => {
    setSendResult(null);
    setEditedReply("");
    complete("");
  };

  const handleSendReply = async () => {
    const body = editedReply || completion;
    if (!body.trim()) return;

    setIsSending(true);
    setSendResult(null);
    try {
      const res = await fetch(`/api/freshdesk/tickets/${ticketId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      if (!res.ok) {
        throw new Error(`Failed to send reply: ${res.status} ${res.statusText}`);
      }
      setSendResult({ success: true, message: "Reply sent successfully." });
      setEditedReply("");
    } catch (err) {
      setSendResult({
        success: false,
        message: err instanceof Error ? err.message : "Failed to send reply",
      });
    } finally {
      setIsSending(false);
    }
  };

  const displayText = editedReply || completion;
  const isComplete = !isLoading && displayText.length > 0;

  return (
    <Card className="gap-0">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-500" />
          <CardTitle className="text-sm">AI Draft Reply</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {!displayText && !isLoading && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDraft}
            className="w-full"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Draft Reply
          </Button>
        )}

        {isLoading && !displayText && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating reply...
          </div>
        )}

        {displayText && (
          <>
            <Textarea
              value={isComplete ? editedReply : completion}
              onChange={(e) => setEditedReply(e.target.value)}
              readOnly={isLoading}
              rows={8}
              className="text-sm"
              placeholder="AI-generated reply will appear here..."
            />

            <div className="flex items-center gap-2">
              {isLoading ? (
                <Button variant="outline" size="sm" onClick={stop}>
                  Stop
                </Button>
              ) : (
                <>
                  <Button
                    size="sm"
                    onClick={handleSendReply}
                    disabled={isSending || !displayText.trim()}
                  >
                    {isSending ? (
                      <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    ) : (
                      <Send className="h-3.5 w-3.5 mr-1.5" />
                    )}
                    Send Reply
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleDraft}>
                    <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                    Regenerate
                  </Button>
                </>
              )}
            </div>
          </>
        )}

        {sendResult && (
          <p
            className={`text-sm ${
              sendResult.success ? "text-green-600" : "text-destructive"
            }`}
          >
            {sendResult.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
