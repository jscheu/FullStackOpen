import { DiaryEntry } from '../types';

const EntriesList = ({ entries }: { entries: DiaryEntry[] }) => {
  if (!entries || entries.length === 0) {
    return (
      <div>
        <strong>No entries to display</strong>
      </div>
    );
  }
  return (
    <div>
      <h2>Diary Entries</h2>
      {entries.map((entry) => (
        <div key={entry.id}>
          <strong>{entry.date}</strong>
          <div>Visibility: {entry.visibility}</div>
          <div>Weather: {entry.weather}</div>
        </div>
      ))}
    </div>
  );
};

export default EntriesList;
