import {
  IconBuilding,
  IconBuildingArch,
  IconBuildingBank,
  IconBuildingCastle,
  IconBuildingEstate,
  IconBuildingSkyscraper,
  IconBuildingStore,
  IconTower,
} from "@tabler/icons-react";

export const ORGANIZATION_ICONS = [
  IconBuilding,
  IconBuildingArch,
  IconBuildingBank,
  IconBuildingCastle,
  IconBuildingEstate,
  IconBuildingSkyscraper,
  IconBuildingStore,
  IconTower,
];

export const organizationIcon = (icon: number) => {
  return ORGANIZATION_ICONS[icon] || IconBuilding;
};
