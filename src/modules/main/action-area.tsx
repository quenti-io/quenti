import { ButtonGroup, IconButton, Tooltip } from "@chakra-ui/react";
import {
  IconPlus,
  IconPrinter,
  IconShare,
  IconTableExport,
  type TablerIconsProps,
} from "@tabler/icons-react";
import React from "react";
import { useReactToPrint } from "react-to-print";
import { ExportTermsModal } from "../../components/export-terms-modal";
import { SetPrintComponent } from "../../components/set-print-component";
import { useSet } from "../../hooks/use-set";
import { api } from "../../utils/api";
import { AddToFolderModal } from "./add-to-folder-modal";
import { ShareSetModal } from "./share-set-modal";

export const ActionArea: React.FC = () => {
  const utils = api.useContext();
  const { id } = useSet();

  const [addToFolder, setAddToFolder] = React.useState(false);
  const [share, setShare] = React.useState(false);
  const [shouldPrint, setShouldPrint] = React.useState(false);
  const [exportOpen, setExportOpen] = React.useState(false);

  const printRef = React.useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onAfterPrint: () => {
      setShouldPrint(false);
    },
  });

  return (
    <>
      <AddToFolderModal
        isOpen={addToFolder}
        onClose={async () => {
          setAddToFolder(false);
          await utils.folders.invalidate(undefined, {
            queryKey: ["recentForSetAdd", id],
          });
        }}
      />
      <ShareSetModal isOpen={share} onClose={() => setShare(false)} />
      <ExportTermsModal
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
      />
      <ButtonGroup spacing={4}>
        <ActionButton
          label="Add to folder"
          icon={IconPlus}
          onClick={() => setAddToFolder(true)}
        />
        <ActionButton
          label="Share"
          icon={IconShare}
          onClick={() => setShare(true)}
        />
        <ActionButton
          label="Print"
          icon={IconPrinter}
          isLoading={shouldPrint}
          onClick={() => {
            setShouldPrint(true);
            requestAnimationFrame(() => {
              handlePrint();
            });
          }}
        />
        <ActionButton
          label="Export"
          icon={IconTableExport}
          onClick={() => setExportOpen(true)}
        />
      </ButtonGroup>
      {shouldPrint && (
        <div style={{ display: "none" }}>
          <SetPrintComponent ref={printRef} />
        </div>
      )}
    </>
  );
};

interface ActionButtonProps {
  label: string;
  icon: React.FC<TablerIconsProps>;
  onClick?: () => void;
  isLoading?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  icon,
  onClick,
  isLoading,
}) => {
  const Icon = icon;

  return (
    <Tooltip label={label}>
      <IconButton
        icon={<Icon size={18} />}
        rounded="full"
        variant="outline"
        colorScheme="blue"
        aria-label={label}
        outline="solid 1px"
        onClick={onClick}
        isLoading={isLoading}
      />
    </Tooltip>
  );
};
