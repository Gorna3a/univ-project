import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '../ui/navigation-menu';

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";

function navigationMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex justify-end space-x-6">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-lg font-semibold">Sections</NavigationMenuTrigger>
          <NavigationMenuContent className="w-[300px] bg-white p-4 shadow-lg rounded-md">
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <ListItem href="#hero" title="Welcome">
                Jump to the hero section to get started.
              </ListItem>
              <ListItem href="#features" title="Features">
                Discover what makes our app unique.
              </ListItem>
              <ListItem href="#how-it-works" title="How It Works">
                Learn how our AI-powered learning platform works.
              </ListItem>
              <ListItem href="#testimonials" title="Testimonials">
                Read what our users have to say.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/docs">
            <NavigationMenuLink className="text-lg font-semibold">Documentation</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default navigationMenu;
