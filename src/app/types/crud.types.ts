import { Observable } from 'rxjs';

export interface CRUD<T> {
  getAll(): Observable<T[]>;
  create(model: T):Observable<{text: string }>;
  update(model: Partial<T>): Observable<{text: string }>;
  delete(uuId: string): Observable<{ text: string }>;
  getByUuId(uuId: string): Observable<T>;
}
