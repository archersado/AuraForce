/**
 * SlashCommand Palette Component
 *
 * Displays available slash commands as user types /
 * Auto-completes and shows command preview with parameters.
 */

'use client';

import { useState, useEffect, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  FileText,
  Wrench,
  PlayCircle,
  Bug,
  Lightbulb,
  HelpCircle,
  X,
  ChevronRight,
  Check,
  AlertTriangle,
  Command,
  FileEdit,
  Trash2,
  Regex,
  GitCommit,
  Puzzle,
  Terminal,
  Server,
  Brain,
  Loader2,
} from 'lucide-react';
import type { SlashCommand, CommandCategory } from '@/types/slash-commands';
import {
  SLASH_COMMANDS,
  commandCategoryIcons,
  commandCategoryColors,
  groupCommandsByCategory,
  getAllCommands,
  fetchSDKCommands,
} from '@/types/slash-commands';

interface SlashCommandPaletteProps {
  onClose: () => void;
  onSelectCommand: (command: SlashCommand, args: Record<string, string>) => void;
  triggerPosition?: { x: number; y: number };
}


export function SlashCommandPalette({
  onClose,
  onSelectCommand,
  triggerPosition,
}: SlashCommandPaletteProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedCommand, setSelectedCommand] = useState<SlashCommand | null>(null);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [allCommands, setAllCommands] = useState<SlashCommand[]>(SLASH_COMMANDS);
  const [isLoadingSDK, setIsLoadingSDK] = useState(false);
  const [sdkCommandsLoaded, setSdkCommandsLoaded] = useState(false);

  // Load SDK commands on mount
  useEffect(() => {
    const loadSDKCommands = async () => {
      setIsLoadingSDK(true);
      try {
        const commands = await getAllCommands();
        setAllCommands(commands);
        setSdkCommandsLoaded(true);
        console.log('[SlashCommandPalette] Loaded commands:', commands.length, 'total,', commands.length - SLASH_COMMANDS.length, 'from SDK');
      } catch (error) {
        console.error('[SlashCommandPalette] Failed to load SDK commands:', error);
      } finally {
        setIsLoadingSDK(false);
      }
    };

    loadSDKCommands();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const filtered = allCommands.filter(
          (cmd) =>
            cmd.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cmd.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cmd.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cmd.alias?.some((a) => a.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setSelectedIndex((prev) => (prev + 1) % filtered.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const filtered = allCommands.filter(
          (cmd) =>
            cmd.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cmd.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cmd.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cmd.alias?.some((a) => a.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === 'Enter') {
        const filtered = allCommands.filter(
          (cmd) =>
            cmd.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cmd.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cmd.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cmd.alias?.some((a) => a.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        if (filtered.length > 0) {
          const command = filtered[selectedIndex];
          if (command.params && command.params.length > 0) {
            handleSelectCommand(command);
          } else {
            onSelectCommand(command, {});
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown as any);
    return () => window.removeEventListener('keydown', handleKeyDown as any);
  }, [searchTerm, selectedIndex, onClose, onSelectCommand, allCommands]);

  const filteredCommands = allCommands.filter(
    (cmd) =>
      cmd.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cmd.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cmd.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cmd.alias?.some((a) => a.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const groupedCommands = groupCommandsByCategory(filteredCommands);

  const handleSelectCommand = (command: SlashCommand) => {
    setSelectedCommand(command);
    setParamValues({});
    setSearchTerm('');
  };

  const handleBack = () => {
    setSelectedCommand(null);
    setParamValues({});
  };

  const handleExecute = () => {
    if (selectedCommand) {
      onSelectCommand(selectedCommand, paramValues);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  // If a command is selected, show its parameters
  if (selectedCommand) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <button onClick={handleBack} className="p-1 hover:bg-gray-200 rounded">
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <div className="flex items-center gap-2">
              {getCommandIcon(selectedCommand)}
              <span className="font-semibold text-gray-900">/{selectedCommand.name}</span>
            </div>
          </div>
          <button onClick={handleCancel} className="p-1 hover:bg-gray-200 rounded text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-gray-600 mb-4">{selectedCommand.description}</p>
          {selectedCommand.example && (
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <code className="text-sm text-gray-700">{selectedCommand.example}</code>
            </div>
          )}

          {/* Parameters */}
          {selectedCommand.params && selectedCommand.params.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Parameters</h3>
              {selectedCommand.params.map((param) => (
                <div key={param.name} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {param.label}
                    {param.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {param.description && (
                    <p className="text-xs text-gray-500">{param.description}</p>
                  )}

                  {param.type === 'text' && (
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={param.placeholder}
                      value={paramValues[param.name] || ''}
                      onChange={(e) => setParamValues({ ...paramValues, [param.name]: e.target.value })}
                    />
                  )}

                  {param.type === 'number' && (
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={param.placeholder}
                      value={paramValues[param.name] || ''}
                      onChange={(e) => setParamValues({ ...paramValues, [param.name]: e.target.value })}
                    />
                  )}

                  {param.type === 'select' && param.options && (
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={paramValues[param.name] || (param.defaultValue as string) || ''}
                      onChange={(e) => setParamValues({ ...paramValues, [param.name]: e.target.value })}
                    >
                      {param.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  )}

                  {param.type === 'boolean' && (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        checked={paramValues[param.name] === 'true' || (param.defaultValue === true && !paramValues[param.name])}
                        onChange={(e) => setParamValues({ ...paramValues, [param.name]: e.target.checked ? 'true' : 'false' })}
                      />
                      <span className="text-sm text-gray-700">Enable</span>
                    </label>
                  )}

                  {param.type === 'file' && (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={param.placeholder || 'Enter file path...'}
                        value={paramValues[param.name] || ''}
                        onChange={(e) => setParamValues({ ...paramValues, [param.name]: e.target.value })}
                      />
                      <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 text-sm">
                        Browse
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Risk warning */}
          {selectedCommand.riskLevel === 'high' && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md mt-4">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                <strong>Danger:</strong> This command may significantly modify your codebase. Review the changes carefully.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex justify-between">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExecute}
            disabled={
              selectedCommand.params?.some((p) => p.required && !paramValues[p.name])
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {selectedCommand.requiresConfirmation ? 'Review & Execute' : 'Execute'}
          </button>
        </div>
      </div>
    );
  }

  // Show command list
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          className="flex-1 outline-none bg-transparent text-gray-900 placeholder-gray-400"
          placeholder="Search commands... (e.g., /read, /write)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
        />
        {isLoadingSDK && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
        {!isLoadingSDK && sdkCommandsLoaded && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
              {allCommands.length - SLASH_COMMANDS.length} SDK
            </span>
          </div>
        )}
        <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded text-gray-500">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto p-2">
        {filteredCommands.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No commands found</p>
            <p className="text-sm mt-1">Try searching for "read", "write", "test", etc.</p>
          </div>
        ) : (
          Object.entries(groupedCommands).map(([category, commands]) => {
            const Icon = iconMap[commandCategoryIcons[category as CommandCategory]] || Command;
            const [textColor, bgColor] = commandCategoryColors[category as CommandCategory];

            return (
              <div key={category} className="mb-4">
                <div className="flex items-center gap-2 px-2 py-1 mb-2">
                  <Icon className={`w-4 h-4 ${textColor}`} />
                  <span className="text-xs font-semibold text-gray-500 uppercase">
                    {category}
                  </span>
                </div>
                {commands.map((command, idx) => (
                  <button
                    key={command.name}
                    className={`w-full px-3 py-2 rounded-md flex items-center gap-3 transition-colors ${
                      idx === selectedIndex
                        ? 'bg-blue-50 border border-blue-300'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                    onClick={() => {
                      if (command.params && command.params.length > 0) {
                        handleSelectCommand(command);
                      } else {
                        onSelectCommand(command, {});
                      }
                    }}
                  >
                    {getCommandIcon(command)}
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900">
                        /{command.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {command.description}
                      </div>
                    </div>
                    {command.riskLevel === 'high' && (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                    {idx === selectedIndex && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            );
          })
        )}
      </div>

      {/* Footer - Help */}
      <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
        <div className="flex items-center justify-between">
          <span>Use ↑↓ to navigate, Enter to select</span>
          <span>Type /help for command help</span>
        </div>
      </div>
    </div>
  );
}

const iconMap: Record<string, any> = {
  FileText,
  FileEdit,
  Wrench,
  PlayCircle,
  Bug,
  Lightbulb,
  HelpCircle,
  X,
  Search,
  Command,
  Trash2,
  Regex,
  GitCommit,
  Puzzle,
  Terminal,
  Server,
  Brain,
};

function getCommandIcon(command: SlashCommand) {
  const Icon = iconMap[command.icon] || Command;
  const [textColor] = commandCategoryColors[command.category];
  return <Icon className={`w-5 h-5 ${textColor}`} />;
}
