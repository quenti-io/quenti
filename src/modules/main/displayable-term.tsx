import {
  Box,
  Card,
  Flex,
  HStack,
  IconButton,
  Skeleton,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import type { Term } from "@prisma/client";
import { IconEdit, IconStar, IconStarFilled } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import React from "react";
import { AutoResizeTextarea } from "../../components/auto-resize-textarea";
import { ScriptFormatter } from "../../components/script-formatter";
import { SetCreatorOnly } from "../../components/set-creator-only";
import { menuEventChannel } from "../../events/menu";
import { useOutsideClick } from "../../hooks/use-outside-click";
import { useSet, useSetReady } from "../../hooks/use-set";
import { useContainerContext } from "../../stores/use-container-store";
import { api } from "../../utils/api";

export interface DisplayableTermProps {
  term: Term;
}

export const DisplayableTerm: React.FC<DisplayableTermProps> = ({ term }) => {
  const ready = useSetReady();
  const authed = useSession().status == "authenticated";
  const utils = api.useContext();

  const starMutation = api.container.starTerm.useMutation();
  const unstarMutation = api.container.unstarTerm.useMutation();

  const { container } = useSet();
  const starredTerms = useContainerContext((s) => s.starredTerms);
  const starTerm = useContainerContext((s) => s.starTerm);
  const unstarTerm = useContainerContext((s) => s.unstarTerm);

  const starred = starredTerms.includes(term.id);
  const Star = starred ? IconStarFilled : IconStar;

  const [isEditing, setIsEditing] = React.useState(false);

  const [editWord, setEditWord] = React.useState(term.word);
  const wordRef = React.useRef(editWord);
  wordRef.current = editWord;

  const [editDefinition, setEditDefinition] = React.useState(term.definition);
  const definitionRef = React.useRef(editDefinition);
  definitionRef.current = editDefinition;

  React.useEffect(() => {
    setEditWord(term.word);
    setEditDefinition(term.definition);
  }, [term.word, term.definition]);

  const edit = api.terms.edit.useMutation({
    async onSuccess() {
      await utils.studySets.invalidate();
    },
  });

  const doEdit = () => {
    setIsEditing((e) => {
      if (e) {
        void (async () =>
          await edit.mutateAsync({
            id: term.id,
            studySetId: term.studySetId,
            word: wordRef.current,
            definition: definitionRef.current,
          }))();
      }

      return false;
    });
  };

  const ref = useOutsideClick(doEdit);

  const { colorMode } = useColorMode();
  const divider = useColorModeValue("gray.200", "gray.600");
  const verticalDivider = useColorModeValue("gray.200", "gray.800");
  const secondary = useColorModeValue("gray.100", "gray.750");

  return React.useMemo(
    () => (
      <Skeleton rounded="md" isLoaded={ready}>
        <Card
          ref={ref}
          px={{ base: 0, sm: 4 }}
          py={{ base: 0, sm: 5 }}
          overflow="hidden"
        >
          <Flex
            flexDir={["column-reverse", "row", "row"]}
            alignItems="stretch"
            gap={[0, 6, 6]}
          >
            <Flex
              w="full"
              flexDir={["column", "row", "row"]}
              gap={[2, 6, 6]}
              px={{ base: 3, sm: 0 }}
              py={{ base: 3, sm: 0 }}
            >
              {isEditing ? (
                <AutoResizeTextarea
                  allowTab={false}
                  value={editWord}
                  onChange={(e) => setEditWord(e.target.value)}
                  w="full"
                  variant="flushed"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") doEdit();
                  }}
                />
              ) : (
                <Text w="full" whiteSpace="pre-wrap">
                  <ScriptFormatter>{editWord}</ScriptFormatter>
                </Text>
              )}
              <Box bg={divider} h="full" w="3px" />
              {isEditing ? (
                <AutoResizeTextarea
                  allowTab={false}
                  value={editDefinition}
                  onChange={(e) => setEditDefinition(e.target.value)}
                  w="full"
                  variant="flushed"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") doEdit();
                  }}
                />
              ) : (
                <Text w="full" whiteSpace="pre-wrap">
                  <ScriptFormatter>{editDefinition}</ScriptFormatter>
                </Text>
              )}
            </Flex>
            <Box
              h="full"
              bg={{ base: secondary, sm: "none" }}
              px={{ base: 1, sm: 0 }}
              py={{ base: 2, sm: 0 }}
              borderBottomWidth={{ base: 3, sm: 0 }}
              borderBottomColor={{ base: verticalDivider, sm: "none" }}
            >
              <Flex w="full" justifyContent="end">
                <HStack
                  spacing={1}
                  height="24px"
                  justifyContent={{ base: "space-between", sm: "end" }}
                  w="full"
                >
                  <SetCreatorOnly fallback={<Box />}>
                    <IconButton
                      size={{ base: "sm", sm: undefined }}
                      transform={{ base: "scale(0.8)", sm: "scale(1)" }}
                      icon={<IconEdit />}
                      variant={isEditing ? "solid" : "ghost"}
                      aria-label="Edit"
                      rounded="full"
                      onClick={() => {
                        if (isEditing) {
                          edit.mutate({
                            id: term.id,
                            studySetId: term.studySetId,
                            word: editWord,
                            definition: editDefinition,
                          });
                        }
                        setIsEditing(!isEditing);
                      }}
                    />
                  </SetCreatorOnly>
                  <IconButton
                    size={{ base: "sm", sm: undefined }}
                    transform={{ base: "scale(0.8)", sm: "scale(1)" }}
                    icon={<Star />}
                    variant="ghost"
                    aria-label="Edit"
                    rounded="full"
                    onClick={() => {
                      if (!authed) {
                        menuEventChannel.emit("openSignup", {
                          message:
                            "Create an account for free to customize and star terms",
                        });
                        return;
                      }

                      if (!starred) {
                        starTerm(term.id);
                        starMutation.mutate({
                          termId: term.id,
                          containerId: container!.id,
                        });
                      } else {
                        unstarTerm(term.id);
                        unstarMutation.mutate({
                          termId: term.id,
                        });
                      }
                    }}
                  />
                </HStack>
              </Flex>
            </Box>
          </Flex>
        </Card>
      </Skeleton>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [term, starred, isEditing, editWord, editDefinition, colorMode]
  );
};

export const DisplayableTermPure = React.memo(DisplayableTerm);
