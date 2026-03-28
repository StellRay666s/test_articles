import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from '../../../services/localStorage.service';
import { OutputArticleData } from '../../../types/articles.types';

@Injectable({
  providedIn: 'root',
})
export class ArticlesCreateService {
  private localStorageService = inject(LocalStorageService);

  createArticle(data: OutputArticleData) {
    const uuId = crypto.randomUUID();
    return this.localStorageService.create({
      uuId,
      ...data,
    });
  }
}
