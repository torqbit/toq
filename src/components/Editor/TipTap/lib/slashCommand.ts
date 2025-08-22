import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Editor } from '@tiptap/react';

export interface SlashCommandOptions {
  onOpen: (position: { x: number; y: number }) => void;
  onClose: () => void;
  onExecuteCommand: (command: any) => void;
}

export default (options: SlashCommandOptions) => {
  return Extension.create({
    name: 'slashCommand',

    addProseMirrorPlugins() {
      return [
        new Plugin({
          key: new PluginKey('slashCommand'),
          props: {
            handleKeyDown: (view, event) => {
              // Check if we're at the start of an empty line and the key is "/"
              const { selection, doc } = view.state;
              const { $from } = selection;
              
              // If we're at the start of a node and the key pressed is "/"
              if (
                $from.parent.type.name === 'paragraph' && 
                $from.parent.textContent === '' && 
                event.key === '/'
              ) {
                // Get position for the menu
                const coords = view.coordsAtPos($from.pos);
                const domRect = view.dom.getBoundingClientRect();
                
                options.onOpen({
                  x: coords.left - domRect.left,
                  y: coords.top - domRect.top
                });
                
                return false;
              }
              
              return false;
            }
          },
        }),
      ];
    },
  });
};