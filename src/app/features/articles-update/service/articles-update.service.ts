import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from '../../../services/localStorage.service';
import { Article } from '../../../types/articles.types';

@Injectable({
  providedIn: 'root',
})
export class ArticlesUpdateService {
  private localStorageService = inject(LocalStorageService);

  getByUuId(uuId: string) {
    return this.localStorageService.getByUuId(uuId);
  }

  update(article: Article) {
    return this.localStorageService.update(article);
  }
}
