import * as React from 'react';
import { render } from '@testing-library/react';
import { ELEMENT_PARAGRAPH } from '@udecode/slate-plugins-paragraph';
import { createEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import * as SlateReact from 'slate-react';
import { TEditor } from '../../../../core/src/types/TEditor';
import { mentionables } from '../../../mention/src/__tests__/useMention/onKeyDown/mentionables.fixture';
import { MentionSelect } from './MentionSelect';

describe('when MentionSelect', () => {
  describe('when at is null', () => {
    it('should render null', () => {
      jest.spyOn(SlateReact, 'useSlate').mockReturnValue(null as any);

      const { queryByTestId } = render(
        <MentionSelect
          data-testid="MentionSelect"
          at={null}
          options={mentionables}
          valueIndex={0}
          onClickMention={() => {}}
        />
      );

      expect(queryByTestId('MentionSelect')).toBeNull();
    });
  });

  describe('when at is the selection', () => {
    it('should render', () => {
      const editor = createEditor() as TEditor;
      editor.children = [
        {
          type: ELEMENT_PARAGRAPH,
          children: [
            {
              text: '@t2',
            },
          ],
        },
      ];

      editor.selection = {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      };

      jest.spyOn(SlateReact, 'useSlate').mockReturnValue(null as any);
      jest.spyOn(ReactEditor, 'toDOMRange').mockReturnValue({
        getBoundingClientRect: () => ({
          top: 1,
          left: 1,
          width: 100,
        }),
      } as any);

      const { getByTestId } = render(
        <MentionSelect
          data-testid="MentionSelect"
          at={editor.selection}
          options={mentionables}
          valueIndex={0}
          onClickMention={() => {}}
        />
      );

      expect(getByTestId('MentionSelect')).toBeVisible();
    });
  });
});
