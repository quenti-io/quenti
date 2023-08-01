import {
  TabList,
  Tabs,
  chakra,
  useColorModeValue,
  useTabsStyles,
  type SystemStyleObject,
  type Tab,
  type TabsProps,
  forwardRef,
  useMediaQuery,
} from "@chakra-ui/react";
import React from "react";
import { useTab } from "../lib/use-tab";

interface ToggleGroupProps {
  index: number;
  onChange?: (index: number) => void;
  tabProps?: React.ComponentProps<typeof Tab>;
  baseVertical?: boolean;
}

type ComponentProps = Omit<TabsProps, "index" | "onChange"> & ToggleGroupProps;

const ToggleGroupContext = React.createContext<
  Omit<ComponentProps, "tabListProps" | "children">
>({
  index: 0,
  onChange: undefined,
  tabProps: undefined,
});

export const ToggleGroup = ({
  index,
  onChange,
  tabProps,
  children,
  baseVertical = false,
  ..._props
}: React.PropsWithChildren<ComponentProps>) => {
  const borderColor = useColorModeValue("gray.200", "gray.750");
  const isMobile = useMediaQuery("(max-width: 768px)")[0];
  const orientation = baseVertical
    ? isMobile
      ? "vertical"
      : "horizontal"
    : _props.orientation;

  const props = { ..._props, orientation };

  return (
    <ToggleGroupContext.Provider
      value={{ index, onChange, tabProps, ...props }}
    >
      <Tabs variant="unstyled" shadow="sm" rounded="md" isManual {...props}>
        <TabList border="2px solid" borderColor={borderColor} rounded="md">
          {children}
        </TabList>
      </Tabs>
    </ToggleGroupContext.Provider>
  );
};

ToggleGroup.Tab = forwardRef(function ToggleGroupTab(
  props: React.ComponentProps<typeof Tab>,
  ref
) {
  const {
    index: selectedIndex,
    onChange,
    tabProps,
    orientation = "horizontal",
  } = React.useContext(ToggleGroupContext);

  const borderColor = useColorModeValue("gray.200", "gray.750");
  const hoverColor = useColorModeValue("gray.100", "gray.800");

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
      background={isSelected ? borderColor : undefined}
      _hover={
        !isSelected
          ? {
              background: hoverColor,
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
