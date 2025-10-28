"use client";

import { COMMANDS, CATEGORIES } from "@/lib/commands";

interface CommandsProps {
  onCommandClick: (url: string) => void;
}

export default function Commands({ onCommandClick }: CommandsProps) {
  const commandsByCategory = Object.entries(CATEGORIES).map(
    ([key, category]) => ({
      ...category,
      key,
      commands: COMMANDS.filter((cmd) => cmd.category === key),
    })
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      {commandsByCategory.map((category) => (
        <div key={category.key} className="mb-12">
          <h2 className="text-3xl font-bold mb-6 category-title font-inter">
            {category.name}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {category.commands.map((command) => (
              <div
                key={command.id}
                className="command-card rounded-2xl overflow-hidden group cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering search when clicking commands
                  onCommandClick(command.url);
                }}
              >
                <div className="p-5 flex flex-col gap-2 h-full command-text">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-primary text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-duospace">
                      {command.name}
                    </span>
                    <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  {command.description && (
                    <span className="text-xs text-muted text-left leading-relaxed font-duospace">
                      {command.description}
                    </span>
                  )}
                  {command.aliases && command.aliases.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {command.aliases.slice(0, 2).map((alias) => (
                        <span
                          key={alias}
                          className="px-2 py-1 text-xs bg-card text-muted rounded-md font-duospace shadow-sm"
                        >
                          {alias}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
