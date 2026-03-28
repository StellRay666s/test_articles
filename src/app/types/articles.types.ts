import { Annotation } from './annotations.type';

export interface Article {
  uuId: string;
  title: string;
  text: string;
  annotations: Annotation[];
}

export type OutputArticleData  = Omit<Article, 'uuId'>
