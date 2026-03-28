import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from '../../../services/localStorage.service';
import { Observable } from 'rxjs';
import { Article } from '../../../types/articles.types';

@Injectable({
  providedIn: 'root',
})
export class ArticlesListService {
  private localStorageService = inject(LocalStorageService);

  getList(): Observable<Article[]> {
    return this.localStorageService.getAll();
  }

  delete(uuId: string) {
    const isConfirm = confirm('Вы точно хотите удалить статью?');
    if (isConfirm) {
      return this.localStorageService.delete(uuId);
    }
    return;
  }
}
