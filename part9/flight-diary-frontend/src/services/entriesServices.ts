import axios from 'axios';
import { DiaryEntry, NewDiaryEntry } from '../types';
import { toDiaryEntry } from '../utils';

const baseUrl = 'http://localhost:3000/api/diaries';

const getAllEntires = async (): Promise<DiaryEntry[]> => {
  const response = await axios.get<DiaryEntry[]>(baseUrl);
  const entries = response.data.map((entry) => toDiaryEntry(entry));
  return entries;
};

const createEntry = async (newEntry: NewDiaryEntry): Promise<DiaryEntry> => {
  const response = await axios.post<DiaryEntry>(baseUrl, newEntry);
  return toDiaryEntry(response.data);
};

export default { getAllEntires, createEntry };
