"use client";

import { useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Key,
  Sparkles,
  ExternalLink,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";

type ConnectionStatus = "idle" | "testing" | "connected" | "failed";

function ConnectionIndicator({ status }: { status: ConnectionStatus }) {
  switch (status) {
    case "connected":
      return (
        <span className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          Connected
        </span>
      );
    case "failed":
      return (
        <span className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          Failed
        </span>
      );
    case "testing":
      return (
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          Testing...
        </span>
      );
    default:
      return (
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-gray-400" />
          Not tested
        </span>
      );
  }
}

export default function SettingsPage() {
  const [freshdeskStatus, setFreshdeskStatus] =
    useState<ConnectionStatus>("idle");
  const [mondayStatus, setMondayStatus] = useState<ConnectionStatus>("idle");

  const testFreshdesk = async () => {
    setFreshdeskStatus("testing");
    try {
      const res = await fetch("/api/freshdesk/tickets?per_page=1");
      setFreshdeskStatus(res.ok ? "connected" : "failed");
    } catch {
      setFreshdeskStatus("failed");
    }
  };

  const testMonday = async () => {
    setMondayStatus("testing");
    try {
      const res = await fetch("/api/monday/boards");
      setMondayStatus(res.ok ? "connected" : "failed");
    } catch {
      setMondayStatus("failed");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Tabs defaultValue="api-keys">
        <TabsList>
          <TabsTrigger value="api-keys">
            <Key className="h-4 w-4 mr-1.5" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="ai-config">
            <Sparkles className="h-4 w-4 mr-1.5" />
            AI Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="api-keys">
          <div className="space-y-6 mt-4">
            {/* Freshdesk */}
            <Card className="gap-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Freshdesk</CardTitle>
                  <ConnectionIndicator status={freshdeskStatus} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Your Freshdesk API key is configured via the{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                    FRESHDESK_API_KEY
                  </code>{" "}
                  and{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                    FRESHDESK_DOMAIN
                  </code>{" "}
                  environment variables in{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                    .env.local
                  </code>
                  .
                </p>
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">
                    Where to find your API key:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 ml-1">
                    <li>Log in to your Freshdesk portal</li>
                    <li>Click your profile picture (top right)</li>
                    <li>
                      Go to{" "}
                      <span className="font-medium">Profile Settings</span>
                    </li>
                    <li>
                      Your API key is under{" "}
                      <span className="font-medium">
                        Your API Key
                      </span>{" "}
                      on the right side
                    </li>
                  </ol>
                </div>
                <Separator />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={testFreshdesk}
                  disabled={freshdeskStatus === "testing"}
                >
                  {freshdeskStatus === "testing" ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                      Testing...
                    </>
                  ) : freshdeskStatus === "connected" ? (
                    <>
                      <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                      Test Again
                    </>
                  ) : freshdeskStatus === "failed" ? (
                    <>
                      <XCircle className="h-3.5 w-3.5 mr-1.5" />
                      Retry Connection
                    </>
                  ) : (
                    "Test Connection"
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Monday.com */}
            <Card className="gap-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Monday.com</CardTitle>
                  <ConnectionIndicator status={mondayStatus} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Your Monday.com API token is configured via the{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                    MONDAY_API_TOKEN
                  </code>{" "}
                  environment variable in{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                    .env.local
                  </code>
                  .
                </p>
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">
                    Where to find your API token:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 ml-1">
                    <li>Log in to your Monday.com account</li>
                    <li>
                      Click your avatar (bottom left) and select{" "}
                      <span className="font-medium">Developers</span>
                    </li>
                    <li>
                      Go to{" "}
                      <span className="font-medium">
                        My Access Tokens
                      </span>{" "}
                      in the Developer section
                    </li>
                    <li>Create or copy your personal API token</li>
                  </ol>
                </div>
                <Separator />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={testMonday}
                  disabled={mondayStatus === "testing"}
                >
                  {mondayStatus === "testing" ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                      Testing...
                    </>
                  ) : mondayStatus === "connected" ? (
                    <>
                      <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                      Test Again
                    </>
                  ) : mondayStatus === "failed" ? (
                    <>
                      <XCircle className="h-3.5 w-3.5 mr-1.5" />
                      Retry Connection
                    </>
                  ) : (
                    "Test Connection"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-config">
          <div className="space-y-6 mt-4">
            <Card className="gap-0">
              <CardHeader>
                <CardTitle className="text-base">AI Model</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-2">
                    <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      Vercel AI Gateway &mdash; Claude Sonnet
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Routes through Vercel&apos;s AI Gateway for caching,
                      rate limiting, and observability
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>
                    AI requests are routed through{" "}
                    <span className="font-medium text-foreground">
                      Vercel AI Gateway
                    </span>
                    . When deployed on Vercel, authentication is automatic.
                  </p>
                  <p>
                    For local development, set{" "}
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                      VERCEL_AI_GATEWAY_API_KEY
                    </code>{" "}
                    in{" "}
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                      .env.local
                    </code>
                    . Generate one from your Vercel project settings &rarr; AI
                    tab &rarr; Gateway API Keys.
                  </p>
                  <p>
                    The model (currently{" "}
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                      anthropic/claude-sonnet-4-5
                    </code>
                    ) can be changed in{" "}
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                      lib/ai.ts
                    </code>
                    .
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="gap-0">
              <CardHeader>
                <CardTitle className="text-base">
                  Prompt Customization Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-foreground font-medium shrink-0">
                      Triage:
                    </span>
                    Customize categories and priority mapping in{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                      /api/ai/triage/route.ts
                    </code>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-foreground font-medium shrink-0">
                      Replies:
                    </span>
                    Adjust tone and templates in{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                      /api/ai/draft-reply/route.ts
                    </code>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-foreground font-medium shrink-0">
                      Board:
                    </span>
                    Modify suggestion logic in{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                      /api/ai/board-suggestions/route.ts
                    </code>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-foreground font-medium shrink-0">
                      Reorder:
                    </span>
                    Tune thresholds in{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                      /api/ai/reorder-suggestions/route.ts
                    </code>
                  </li>
                </ul>
                <Separator />
                <a
                  href="https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                >
                  Anthropic Prompt Engineering Guide
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
