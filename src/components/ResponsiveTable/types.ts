export interface ColumnConfig<T> {
  label: string;
  key: keyof T; // No angle brackets around T here
}