import { useState, useEffect } from 'react';

import { DiaryEntry } from './types';

import entriesServices from './services/entriesServices';

import EntriesList from './components/EntriesList';
import EntryForm from './components/EntryForm';

const App = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  const onCreateEntry = (newEntry: DiaryEntry) => {
    setEntries(entries.concat(newEntry));
  };

  const fetchEntries = async () => {
    try {
      const fetchedEntries = await entriesServices.getAllEntires();
      setEntries(fetchedEntries);
    } catch (error) {
      let errorMessage = 'Something went wrong.';
      if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message;
      }
      console.error(errorMessage);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div>
      <EntryForm onCreateEntry={onCreateEntry} />
      <EntriesList entries={entries} />
    </div>
  );
};

export default App;
