import { dequal as deepEqual } from 'dequal';
import type { FC } from 'react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  useArgs,
  useGlobals,
  useArgTypes,
  useParameter,
  useStorybookState,
  useStorybookApi,
} from '@storybook/manager-api';
import { PureArgsTable as ArgsTable, type PresetColor, type SortType } from '@storybook/blocks';
import { styled } from '@storybook/theming';
import type { ArgTypes } from '@storybook/types';
import { SAVE_STORY_REQUEST, SAVE_STORY_RESULT } from '@storybook/core-events';

import { PARAM_KEY } from './constants';
import { SaveFromControls } from './SaveFromControls';

// Remove undefined values (top-level only)
const clean = (obj: { [key: string]: any }) =>
  Object.entries(obj).reduce(
    (acc, [key, value]) => (value !== undefined ? Object.assign(acc, { [key]: value }) : acc),
    {} as typeof obj
  );

const AddonWrapper = styled.div({
  display: 'grid',
  gridTemplateRows: '1fr 39px',
  height: '100%',
  maxHeight: '100vh',
  overflowY: 'auto',
});

interface ControlsParameters {
  sort?: SortType;
  expanded?: boolean;
  presetColors?: PresetColor[];
}

export const ControlsPanel: FC = () => {
  const api = useStorybookApi();
  const [isLoading, setIsLoading] = useState(true);
  const [args, updateArgs, resetArgs, initialArgs] = useArgs();
  const [globals] = useGlobals();
  const rows = useArgTypes();
  const { expanded, sort, presetColors } = useParameter<ControlsParameters>(PARAM_KEY, {});
  const { path, previewInitialized } = useStorybookState();

  const currentArgsRef = useRef(args);
  currentArgsRef.current = args;

  // If the story is prepared, then show the args table
  // and reset the loading states
  useEffect(() => {
    if (previewInitialized) setIsLoading(false);
  }, [previewInitialized]);

  const hasControls = Object.values(rows).some((arg) => arg?.control);

  const withPresetColors = Object.entries(rows).reduce((acc, [key, arg]) => {
    const control = arg?.control;
    if (typeof control !== 'object' || control?.type !== 'color' || control?.presetColors)
      acc[key] = arg;
    else acc[key] = { ...arg, control: { ...control, presetColors } };
    return acc;
  }, {} as ArgTypes);

  const hasUpdatedArgs = useMemo(
    () => !!args && !!initialArgs && !deepEqual(clean(args), clean(initialArgs)),
    [args, initialArgs]
  );

  const saveStory = useCallback(() => {
    const data = api.getCurrentStoryData();

    api.emit(SAVE_STORY_REQUEST, {
      args: currentArgsRef.current,
      id: data.id,
      importPath: data.importPath,
    });
  }, [api]);
  const createStory = useCallback(
    (name: string) => {
      const data = api.getCurrentStoryData();

      api.emit(SAVE_STORY_REQUEST, {
        args: currentArgsRef.current,
        id: data.id,
        importPath: data.importPath,
        name,
      });
    },
    [api]
  );

  return (
    <AddonWrapper>
      <ArgsTable
        key={path} // resets state when switching stories
        compact={!expanded && hasControls}
        rows={withPresetColors}
        args={args}
        globals={globals}
        updateArgs={updateArgs}
        resetArgs={resetArgs}
        inAddonPanel
        sort={sort}
        isLoading={isLoading}
      />
      {hasControls && hasUpdatedArgs && (
        <SaveFromControls {...{ resetArgs, saveStory, createStory }} />
      )}
    </AddonWrapper>
  );
};
