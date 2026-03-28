import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/articles-list/articles-list').then((c) => c.ArcticlesList),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./pages/create-article /create-article').then((c) => c.CreateArticle),
  },
  {
    path: 'update/:uuId',
    loadComponent: () =>
      import('./pages/update-article/update-article').then((c) => c.UpdateArticle),
  },
];
