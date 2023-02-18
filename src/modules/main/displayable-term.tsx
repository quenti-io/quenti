import {
  Box,
  Card,
  Flex,
  HStack,
  IconButton,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import type { Term } from "@prisma/client";
import { IconEdit, IconStar, IconStarFilled } from "@tabler/icons-react";
import React from "react";
import { AutoResizeTextarea } from "../../components/auto-resize-textarea";
import { SetCreatorOnly } from "../../components/set-creator-only";
import { useOutsideClick } from "../../hooks/use-outside-click";
import { useSet } from "../../hooks/use-set";
import { useExperienceContext } from "../../stores/use-experience-store";
import { api } from "../../utils/api";

export interface DisplayableTermProps {
  term: Term;
}

export const DisplayableTerm: React.FC<DisplayableTermProps> = ({ term }) => {
  const utils = api.useContext();

  const starMutation = api.experience.starTerm.useMutation();
  const unstarMutation = api.experience.unstarTerm.useMutation();

  const { experience } = useSet();
  const starredTerms = useExperienceContext((s) => s.starredTerms);
  const starTerm = useExperienceContext((s) => s.starTerm);
  const unstarTerm = useExperienceContext((s) => s.unstarTerm);

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

  return (
    <Card px="4" py="5" ref={ref}>
      <Flex
        flexDir={["column-reverse", "row", "row"]}
        alignItems="stretch"
        gap={[0, 6, 6]}
      >
        <Flex w="full" flexDir={["column", "row", "row"]} gap={[2, 6, 6]}>
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
              {editWord}
            </Text>
          )}
          <Box
            bg={useColorModeValue("gray.200", "gray.600")}
            h="full"
            w="3px"
          />
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
              {editDefinition}
            </Text>
          )}
        </Flex>
        <Box h="full">
          <Flex w="full" justifyContent="end">
            <HStack spacing={1} height="24px">
              <SetCreatorOnly>
                <IconButton
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
                icon={<Star />}
                variant="ghost"
                aria-label="Edit"
                rounded="full"
                onClick={() => {
                  if (!starred) {
                    starTerm(term.id);
                    starMutation.mutate({
                      termId: term.id,
                      experienceId: experience.id,
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
  );
};
