import { useClickable } from "@chakra-ui/clickable";
import {
  type UseTabProps,
  useTabsContext,
  useTabsDescendant,
} from "@chakra-ui/react";
import { mergeRefs } from "@chakra-ui/react-use-merge-refs";
import { callAllHandlers } from "@chakra-ui/shared-utils";

/**
 * Adapted from https://github.com/chakra-ui/chakra-ui/blob/main/packages/components/tabs/src/use-tabs.ts
 * (modified to return more information from useTabsDescendant)
 */
export function useTab<P extends UseTabProps>(props: P) {
  const { isDisabled = false, isFocusable = false, ...htmlProps } = props;

  const { setSelectedIndex, isManual, id, setFocusedIndex, selectedIndex } =
    useTabsContext();

  const { index, register, descendants } = useTabsDescendant({
    disabled: isDisabled && !isFocusable,
  });

  const isSelected = index === selectedIndex;

  const onClick = () => {
    setSelectedIndex(index);
  };

  const onFocus = () => {
    setFocusedIndex(index);
    const isDisabledButFocusable = isDisabled && isFocusable;
    const shouldSelect = !isManual && !isDisabledButFocusable;
    if (shouldSelect) {
      setSelectedIndex(index);
    }
  };

  const clickableProps = useClickable({
    ...htmlProps,
    ref: mergeRefs(register, props.ref),
    isDisabled,
    isFocusable,
    onClick: callAllHandlers(props.onClick, onClick),
  });

  const type: "button" | "submit" | "reset" = "button";

  return {
    ...clickableProps,
    id: makeTabId(id, index),
    role: "tab",
    tabIndex: isSelected ? 0 : -1,
    type,
    index,
    count: descendants.count(),
    "aria-selected": isSelected,
    "aria-controls": makeTabPanelId(id, index),
    onFocus: isDisabled ? undefined : callAllHandlers(props.onFocus, onFocus),
  };
}

function makeTabId(id: string, index: number) {
  return `${id}--tab-${index}`;
}

function makeTabPanelId(id: string, index: number) {
  return `${id}--tabpanel-${index}`;
}
