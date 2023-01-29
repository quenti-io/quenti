import { Center, Spinner } from "@chakra-ui/react";
import type { AutoSaveTerm, SetAutoSave } from "@prisma/client";
import type { NextPage } from "next";
import React from "react";
import { CreateSetEditor } from "../modules/create-set-editor";
import {
  createCreateSetStore,
  CreateSetContext,
  type CreateSetStore,
} from "../stores/use-create-set-store";
import { api } from "../utils/api";

const Create: NextPage = () => {
  const { data } = api.autoSave.get.useQuery();

  if (!data)
    return (
      <Center height="calc(100vh - 120px)">
        <Spinner color="blue.200" />
      </Center>
    );

  return <LoadedEditor data={data} />;
};

const LoadedEditor = ({
  data,
}: {
  data: SetAutoSave & { autoSaveTerms: AutoSaveTerm[] };
}) => {
  const storeRef = React.useRef<CreateSetStore>();
  if (!storeRef.current) {
    storeRef.current = createCreateSetStore({
      ...data,
      termOrder: data.autoSaveTermOrder,
      terms: data.autoSaveTerms,
    });
  }

  React.useEffect(() => {
    storeRef.current?.setState({
      ...data,
      termOrder: data.autoSaveTermOrder,
      terms: data.autoSaveTerms,
    });
  }, [data]);

  return (
    <CreateSetContext.Provider value={storeRef.current}>
      <CreateSetEditor />
    </CreateSetContext.Provider>
  );
};

export { getServerSideProps } from "../components/chakra";

export default Create;
