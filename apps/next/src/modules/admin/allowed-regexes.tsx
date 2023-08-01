import {
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import React from "react";
import { ConfirmModal } from "../../components/confirm-modal";
import { api } from "@quenti/trpc";
import { RegexModal } from "./regex-modal";

export const AllowedRegexes = () => {
  const emails = api.admin.getWhitelist.useQuery();
  const regexes = emails?.data?.regexes ?? [];

  const removeRegex = api.admin.removeRegex.useMutation({
    onSuccess: async () => {
      setDeleteOpen(false);
      await emails.refetch();
    },
  });

  const [modalOpen, setModalOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [currentRegex, setCurrentRegex] = React.useState<string | undefined>();

  const bg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "gray.750");

  return (
    <>
      <ConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        heading="Delete this Regex?"
        body={
          <Text>
            Are you sure you want to delete this regex? This action cannot be
            undone.
          </Text>
        }
        actionText="Delete"
        isLoading={removeRegex.isLoading}
        onConfirm={() => {
          if (currentRegex !== undefined)
            removeRegex.mutate({ regex: currentRegex });
        }}
      />
      {!!emails?.data && (
        <RegexModal
          isOpen={modalOpen}
          onClose={() => {
            setCurrentRegex(undefined);
            setModalOpen(false);
          }}
          regex={currentRegex}
        />
      )}
      <Stack spacing={6}>
        <Heading size="md">Allowed Regexes</Heading>
        <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
          {regexes.map((regex, i) => (
            <GridItem
              key={i}
              bg={bg}
              py="3"
              px="6"
              rounded="lg"
              shadow="lg"
              border="2px"
              borderColor={border}
              transition="all ease-in-out 150ms"
              _hover={{
                borderBottomColor: "blue.300",
              }}
            >
              <Stack>
                <Flex justifyContent="space-between">
                  <Text fontSize="sm" color="gray.500">
                    {regex.label}
                  </Text>
                  <HStack spacing={1}>
                    <IconButton
                      aria-label="Edit"
                      size="xs"
                      variant="ghost"
                      rounded="full"
                      icon={<IconPencil size={18} />}
                      onClick={() => {
                        setCurrentRegex(regex.regex);
                        setModalOpen(true);
                      }}
                    />
                    <IconButton
                      aria-label="Delete"
                      size="xs"
                      variant="ghost"
                      rounded="full"
                      icon={<IconTrash size={18} />}
                      onClick={() => {
                        setCurrentRegex(regex.regex);
                        setDeleteOpen(true);
                      }}
                    />
                  </HStack>
                </Flex>
                <Text fontFamily="monospace" color="blue.300" fontWeight={600}>
                  {regex.regex}
                </Text>
              </Stack>
            </GridItem>
          ))}
          <Button
            leftIcon={<IconPlus />}
            variant="outline"
            h="full"
            minH="80px"
            w="full"
            onClick={() => {
              setCurrentRegex(undefined);
              setModalOpen(true);
            }}
          >
            Add Regex
          </Button>
        </Grid>
      </Stack>
    </>
  );
};
