import React from "react";
import {
  Button,
  ButtonGroup,
  Card,
  Center,
  Container,
  Flex,
  HStack,
  IconButton,
  Input,
  Link,
  Spinner,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  IconArrowLeft,
  IconBooks,
  IconCards,
  IconEdit,
  IconGripHorizontal,
  IconPlus,
  IconSwitchHorizontal,
  IconTrash,
} from "@tabler/icons";
import { AutoResizeTextarea } from "../components/auto-resize-textarea";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import { shallow } from "zustand/shallow";
import debounce from "lodash.debounce";
import { api } from "../utils/api";
import {
  CreateSetContext,
  useCreateSetContext,
} from "../stores/use-create-set-store";
import { useRouter } from "next/router";

export const CreateSetEditor: React.FC = () => {
  const { data } = api.autoSave.get.useQuery();
  const store = React.useContext(CreateSetContext)!;

  const create = true;
  const [lastSavedAt, setLastSavedAt] = React.useState(data?.savedAt);

  const addTerm = useCreateSetContext((state) => state.addTerm);

  const autoSave = api.autoSave.save.useMutation({
    async onSuccess(data) {
      setLastSavedAt(data.savedAt);
    },
  });
  const autoSaveHandler = async () => {
    const state = store.getState();
    const terms = state.termOrder.map(
      (id) => state.terms.find((t) => t.id == id)!
    );

    autoSave.mutateAsync({
      title: state.title,
      description: state.description,
      terms: terms.map((x) => ({
        word: x.word,
        definition: x.definition,
      })),
    });
  };
  const autoSaveCallback = React.useCallback(
    debounce(autoSaveHandler, 1000),
    []
  );

  store.subscribe(
    (s) => [s.title, s.description, s.termOrder, s.terms],
    autoSaveCallback,
    { equalityFn: shallow }
  );

  if (!data)
    return (
      <Center height="calc(100vh - 120px)">
        <Spinner color="blue.200" />
      </Center>
    );

  return (
    <Container maxW="7xl" marginTop="10" marginBottom="20">
      {create && (
        <CreateBar savedAt={lastSavedAt} isSaving={autoSave.isLoading} />
      )}
      <Stack spacing={10}>
        <TitleArea />
        <Stack spacing={4}>
          <TermsList />
        </Stack>
        <Button
          leftIcon={<IconPlus />}
          size="lg"
          height="24"
          variant="outline"
          onClick={addTerm}
        >
          Add Card
        </Button>
      </Stack>
    </Container>
  );
};

const TitleArea = () => {
  const create = true;

  const title = useCreateSetContext((state) => state.title);
  const setTitle = useCreateSetContext((state) => state.setTitle);
  const description = useCreateSetContext((state) => state.description);
  const setDescription = useCreateSetContext((state) => state.setDescription);

  const termOrder = useCreateSetContext(
    (state) => Object.keys(state.termOrder),
    shallow
  );

  const flipTerms = useCreateSetContext((state) => state.flipTerms);

  return (
    <>
      <Stack spacing={2}>
        {!create && (
          <HStack>
            <Button
              leftIcon={<IconArrowLeft />}
              as={Link}
              href="/sets"
              variant="link"
            >
              All sets
            </Button>
          </HStack>
        )}
        <Input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          placeholder="Set Title"
          variant="unstyled"
          fontSize={["2xl", "3xl", "5xl"]}
          fontFamily="heading"
          fontWeight={700}
        />
        <Text color="gray.400">
          {termOrder.length} term
          {termOrder.length != 1 ? "s" : ""}
        </Text>
      </Stack>
      {!create && <ActionRow />}
      <AutoResizeTextarea
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
        }}
        minHeight={24}
        placeholder="Add a description..."
        variant="filled"
      />
      <Flex align={"center"} justifyContent={"space-between"}>
        <Button leftIcon={<IconPlus />} variant="link" colorScheme="orange">
          Import terms
        </Button>
        <ButtonGroup>
          <Tooltip label="Flip terms and definitions">
            <IconButton
              icon={<IconSwitchHorizontal />}
              rounded="full"
              aria-label="Flip terms and definitions"
              onClick={flipTerms}
            />
          </Tooltip>
        </ButtonGroup>
      </Flex>
    </>
  );
};

interface CreateBarProps {
  savedAt?: Date;
  isSaving: boolean;
}

const CreateBar: React.FC<CreateBarProps> = ({ savedAt, isSaving }) => {
  const router = useRouter();

  const create = api.studySets.createFromAutosave.useMutation({
    onSuccess: (data) => {
      router.push(`/sets/${data.id}`);
    },
  });

  return (
    <HStack
      py="3"
      px="5"
      bg={useColorModeValue("gray.100", "gray.800")}
      rounded="lg"
      marginBottom="10"
      position="sticky"
      top="2"
      zIndex="10"
      shadow="xl"
    >
      <Flex align="center" justify="space-between" w="full">
        <Stack>
          <HStack>
            <IconEdit />
            <Text fontSize="lg" fontWeight={600}>
              Create a new set
            </Text>
          </HStack>
          <HStack color="gray.400" spacing={4}>
            {isSaving && <Spinner size="sm" />}
            <Text fontSize="sm">
              {isSaving
                ? "Saving..."
                : `Last saved at ${savedAt?.toTimeString()}`}
            </Text>
          </HStack>
        </Stack>
        <Button
          fontWeight={700}
          isLoading={create.isLoading}
          isDisabled={isSaving}
          onClick={() => {
            create.mutate();
          }}
        >
          Create
        </Button>
      </Flex>
    </HStack>
  );
};

const ActionRow = () => {
  return (
    <HStack spacing={4}>
      <Button leftIcon={<IconBooks />} fontWeight={700}>
        Learn
      </Button>
      <Button leftIcon={<IconCards />} fontWeight={700} variant="outline">
        Flashcards
      </Button>
      <Button leftIcon={<IconEdit />} variant="ghost" color="orange">
        Edit
      </Button>
    </HStack>
  );
};

const TermsList = () => {
  const termOrder = useCreateSetContext((state) => state.termOrder);
  const reorderTerms = useCreateSetContext((state) => state.reorderTerms);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over?.id && active.id !== over.id) {
      const oldIndex = termOrder.indexOf(active.id as string);
      const newIndex = termOrder.indexOf(over.id as string);
      reorderTerms(arrayMove(termOrder, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={termOrder} strategy={verticalListSortingStrategy}>
        {termOrder.map((term, i) => (
          <TermCardMemoized key={term} id={term} index={i} />
        ))}
      </SortableContext>
    </DndContext>
  );
};

interface TermCardProps {
  id: string;
  index: number;
}

const TermCard: React.FC<TermCardProps> = ({ id, index }) => {
  const terms = useCreateSetContext((state) => state.terms);
  const editTerm = useCreateSetContext((state) => state.editTerm);
  const deleteTerm = useCreateSetContext((state) => state.deleteTerm);
  const term = terms.find((term) => term.id === id)!;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2000 : undefined,
  };

  const [word, setWord] = React.useState(term.word);
  const [definition, setDefinition] = React.useState(term.definition);

  React.useEffect(() => {
    setWord(term.word);
    setDefinition(term.definition);
  }, [term.word, term.definition]);

  return (
    <Card
      position="relative"
      ref={setNodeRef}
      style={style}
      shadow={isDragging ? "xl" : "lg"}
    >
      <Stack>
        <Flex
          align="center"
          borderBottom="4px"
          borderColor={useColorModeValue("gray.100", "gray.900")}
          roundedTop="md"
          bg={useColorModeValue("gray.50", "gray.750")}
          px="5"
          py="3"
          justify="space-between"
        >
          <Text fontWeight={700}>{index + 1}</Text>
          <HStack>
            <IconButton
              icon={<IconGripHorizontal />}
              aria-label="Reorder"
              variant="ghost"
              {...attributes}
              {...listeners}
            />
            <IconButton
              icon={<IconTrash />}
              aria-label="Delete"
              variant="ghost"
              onClick={() => deleteTerm(id)}
            />
          </HStack>
        </Flex>
        <HStack px="5" pt="2" pb="6" spacing={6}>
          <Input
            placeholder="Enter term"
            variant="flushed"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            onBlur={() => {
              if (word !== term.word)
                editTerm(id, { ...term, word, definition });
            }}
          />
          <Input
            placeholder="Enter definition"
            variant="flushed"
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            onBlur={() => {
              if (definition !== term.definition)
                editTerm(id, { ...term, word, definition });
            }}
          />
        </HStack>
      </Stack>
    </Card>
  );
};

const TermCardMemoized = React.memo(TermCard);
