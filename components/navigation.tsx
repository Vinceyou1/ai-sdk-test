"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { List } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

export default function Navigation() {
  const pathName = usePathname();
  return (
    <NavigationMenu className="flex-0" viewport={false}>
      <NavigationMenuList className="gap-4">
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              navigationMenuTriggerStyle(),
              pathName === "/" ? "bg-accent/50 text-accent-foreground" : ""
            )}
          >
            <Link href="/">Home</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={
              pathName.includes("/basic/")
                ? "bg-accent/50 text-accent-foreground"
                : ""
            }
          >
            Basic Functionality
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 md:w-[400px] grid-cols-2">
              <ListItem href="/basic/generate-text" title="Generate Text">
                Generate text using AI models.
              </ListItem>
              <ListItem href="/basic/stream-text" title="Stream Text">
                Stream AI-generated text.
              </ListItem>
              <ListItem
                href="/basic/chat-with-history"
                title="Chat with History"
              >
                Have a conversation with a model.
              </ListItem>
              <ListItem href="/basic/system-prompt" title="System Prompts">
                Manage and use system prompts.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={
              pathName.includes("/structured/")
                ? "bg-accent/50 text-accent-foreground"
                : ""
            }
          >
            Structured Output
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 md:w-[300px]">
              <ListItem href="/structured/stream-object" title="Stream Object">
                Generate a recipe according to a schema.
              </ListItem>
              <ListItem
                href="/structured/sentiment-analysis"
                title="Sentiment Analysis"
              >
                Analyze the sentiment of a given text.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
