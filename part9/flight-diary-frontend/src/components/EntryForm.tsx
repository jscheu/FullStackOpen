import { useState } from 'react';
import { toNewDiaryEntry } from '../utils';
import { DiaryEntry } from '../types';
import entriesServices from '../services/entriesServices';

interface EntryFormProps {
  onCreateEntry: (param: DiaryEntry) => void;
}

const EntryForm: React.FC<EntryFormProps> = ({ onCreateEntry }) => {
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState('');
  const [visibility, setVisibility] = useState('');
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const newEntry = toNewDiaryEntry({
        date,
        weather,
        visibility,
        comment
      });

      const createdEntry = await entriesServices.createEntry(newEntry);

      onCreateEntry(createdEntry);
      setErrorMessage('');
    } catch (error) {
      let errorMessage = 'Something went wrong.';
      if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message;
      }
      setErrorMessage(errorMessage);
    }
  };

  return (
    <div>
      <h2>Add New Entry</h2>
      {errorMessage && <div>{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <fieldset>
          <legend>Weather:</legend>
          <label>
            <input
              type="radio"
              name="weather"
              value="sunny"
              checked={weather == 'sunny'}
              onChange={(e) => setWeather(e.target.value)}
            />
            Sunny
          </label>
          <label>
            <input
              type="radio"
              name="weather"
              value="rainy"
              checked={weather == 'rainy'}
              onChange={(e) => setWeather(e.target.value)}
            />
            Rainy
          </label>
          <label>
            <input
              type="radio"
              name="weather"
              value="cloudy"
              checked={weather == 'cloudy'}
              onChange={(e) => setWeather(e.target.value)}
            />
            Cloudy
          </label>
          <label>
            <input
              type="radio"
              name="weather"
              value="stormy"
              checked={weather == 'stormy'}
              onChange={(e) => setWeather(e.target.value)}
            />
            Stormy
          </label>
          <label>
            <input
              type="radio"
              name="weather"
              value="windy"
              checked={weather == 'windy'}
              onChange={(e) => setWeather(e.target.value)}
            />
            Windy
          </label>
        </fieldset>

        <fieldset>
          <legend>Visibility:</legend>
          <label>
            <input
              type="radio"
              name="visibility"
              value="great"
              checked={visibility == 'great'}
              onChange={(e) => setVisibility(e.target.value)}
            />
            Great
          </label>
          <label>
            <input
              type="radio"
              name="visibility"
              value="good"
              checked={visibility == 'good'}
              onChange={(e) => setVisibility(e.target.value)}
            />
            Good
          </label>
          <label>
            <input
              type="radio"
              name="visibility"
              value="ok"
              checked={visibility == 'ok'}
              onChange={(e) => setVisibility(e.target.value)}
            />
            OK
          </label>
          <label>
            <input
              type="radio"
              name="visibility"
              value="poor"
              checked={visibility == 'poor'}
              onChange={(e) => setVisibility(e.target.value)}
            />
            Poor
          </label>
        </fieldset>

        <fieldset>
          <legend>Comment:</legend>
          <textarea
            id="comment"
            name="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </fieldset>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default EntryForm;
