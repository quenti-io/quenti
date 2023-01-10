import { Term } from "@prisma/client";
import { IconLoader2, IconPlus } from "@tabler/icons";
import { useRouter } from "next/router";
import React from "react";
import { IconButton } from "../../components/icon-button";
import { api } from "../../utils/api";

export default function Set() {
  const utils = api.useContext();

  const id = useRouter().query.id as string;
  const { data } = api.studySets.byId.useQuery(id);

  const addTerm = api.terms.add.useMutation({
    async onSuccess() {
      await utils.studySets.invalidate();
    },
  });

  if (!data)
    return (
      <div className="container">
        <IconLoader2 className="animate-spin" />
      </div>
    );

  return (
    <main className="container">
      <h1 className="text-3xl font-bold">{data?.title}</h1>
      <div className="mt-3 text-slate-500">{data?.terms.length} terms</div>
      {data.terms.map((term) => (
        <Term term={term} />
      ))}
      <div className="mt-4">
        <IconButton
          className="default-button mt-4 flex w-full items-center justify-center gap-2"
          label="Add Term"
          icon={IconPlus}
          loading={addTerm.isLoading}
          onClick={() =>
            addTerm.mutateAsync({
              studySetId: id,
              term: {
                definition: "",
                term: "",
              },
            })
          }
        />
      </div>
    </main>
  );
}

const Term: React.FC<{ term: Term }> = ({ term }) => {
  const id = useRouter().query.id as string;

  const [termValue, setTermValue] = React.useState(term.term);
  const [definition, setDefinition] = React.useState(term.definition);

  const editTerm = api.terms.edit.useMutation();

  const finalize = () => {
    editTerm.mutateAsync({
      studySetId: id,
      term: {
        termId: term.id,
        definition: definition,
        term: termValue,
      },
    });
  };

  return (
    <div
      key={term.id}
      className="mt-4 rounded-md border border-slate-300 bg-slate-200 px-6 py-4 shadow-md dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="text-lg text-slate-600 dark:text-slate-400">
        {term.index + 1}
      </div>
      <div className="mt-3 flex gap-4">
        <input
          className="w-1/3 border-b-2 border-slate-500 bg-transparent focus:outline-none"
          value={termValue}
          onChange={(e) => {
            setTermValue(e.target.value);
          }}
          onBlur={() => void finalize()}
          placeholder="TERM"
        />
        <input
          className="w-2/3 border-b-2 border-slate-500 bg-transparent focus:outline-none"
          value={definition}
          onChange={(e) => {
            setDefinition(e.target.value);
          }}
          onBlur={() => void finalize()}
          placeholder="DEFINITION"
        />
      </div>
    </div>
  );
};
