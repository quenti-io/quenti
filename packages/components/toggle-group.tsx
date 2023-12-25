import React from "react";

import {
  type SystemStyleObject,
  type Tab,
  TabList,
  Tabs,
  type TabsProps,
  chakra,
  forwardRef,
  useColorModeValue,
  useTabsStyles,
} from "@chakra-ui/react";

import { useTab } from "./lib/use-tab";

interface ToggleGroupProps {
  index: number;
  onChange?: (index: number) => void;
  tabProps?: React.ComponentProps<typeof Tab>;
  tabBorderColor?: string;
  tabHoverColor?: string;
}

type ComponentProps = Omit<TabsProps, "index" | "onChange"> & ToggleGroupProps;

const ToggleGroupContext = React.createContext<
  Omit<ComponentProps, "tabListProps" | "children">
>({
  index: 0,
});

export const ToggleGroup = ({
  index,
  onChange,
  tabProps,
  children,
  tabBorderColor,
  tabHoverColor,
  ...props
}: React.PropsWithChildren<ComponentProps>) => {
  const _borderColor = useColorModeValue("gray.200", "gray.750");
  const _hoverColor = useColorModeValue("gray.100", "gray.800");
  const borderColor = tabBorderColor ?? _borderColor;
  const hoverColor = tabHoverColor ?? _hoverColor;

  return (
    <ToggleGroupContext.Provider
      value={{
        index,
        onChange,
        tabProps,
        tabBorderColor: borderColor,
        tabHoverColor: hoverColor,
        ...props,
      }}
    >
      <Tabs variant="unstyled" shadow="sm" rounded="lg" isManual {...props}>
        <TabList border="2px solid" borderColor={borderColor} rounded="lg">
          {children}
        </TabList>
      </Tabs>
    </ToggleGroupContext.Provider>
  );
};

ToggleGroup.Tab = forwardRef(function ToggleGroupTab(
  props: React.ComponentProps<typeof Tab>,
  ref,
) {
  const {
    index: selectedIndex,
    onChange,
    tabProps,
    tabBorderColor,
    tabHoverColor,
    orientation = "horizontal",
  } = React.useContext(ToggleGroupContext);

  const styles = useTabsStyles();
  const coreProps = useTab({ ...props, ref });
  const { index, count } = coreProps;
  const isSelected = index === selectedIndex;

  const isLeftMost = index === 0;
  const isRightMost = index === count - 1;

  const tabStyles: SystemStyleObject = {
    outline: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ...styles.tab,
  };

  return (
    <chakra.button
      roundedLeft={orientation == "horizontal" && isLeftMost ? "md" : undefined}
      roundedRight={
        orientation == "horizontal" && isRightMost ? "md" : undefined
      }
      roundedTop={orientation == "vertical" && isLeftMost ? "md" : undefined}
      roundedBottom={
        orientation == "vertical" && isRightMost ? "md" : undefined
      }
      background={isSelected ? tabBorderColor : undefined}
      _hover={
        !isSelected
          ? {
              background: tabHoverColor,
            }
          : {}
      }
      {...coreProps}
      onClick={(e) => {
        e.preventDefault();
        onChange?.(index);
      }}
      {...tabProps}
      {...props}
      __css={tabStyles}
    >
      {props.children}
    </chakra.button>
  );
});
