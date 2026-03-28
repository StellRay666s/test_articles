import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Annotation } from '../../../../types/annotations.type';
import { OutputArticleData } from '../../../../types/articles.types';

@Component({
  selector: 'app-text-editor',
  imports: [FormsModule],
  templateUrl: './text-editor.html',
  styleUrl: './text-editor.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
//*
// Часть кода по работе с выделением текста написано
// с помощью нейронки)
export class TextEditor implements AfterViewInit {
  public selectedText: string = '';
  public currentColor = '#231f1f';

  private currentAnnotationUuId = signal('');

  @Input()
  annotations: Annotation[] = [];

  @Input()
  public currentTitle = '';

  @ViewChild('editor')
  editor!: ElementRef<HTMLDivElement>;

  @Output()
  handleSave = new EventEmitter<OutputArticleData>();

  @Input()
  textArticle = '';

  ngAfterViewInit(): void {
    this.editor.nativeElement.innerHTML = this.textArticle;
    if (!!this.annotations) {
      this.annotations.forEach((annotation) => {
        const span = document.getElementById(annotation.uuId);
        const newannotation = this.createAntConfigureAnnotation(annotation.uuId);
        if (span) {
          this.onMouseMove(span, newannotation);
          this.onMouseOver(span, newannotation);
        }
      });
    }

    this.editor.nativeElement.addEventListener('keydown', (e) => this.handleKeyDown(e));
  }

  private handleKeyDown(event: KeyboardEvent) {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const cursorNode = range.startContainer;

    const parentSpan =
      cursorNode.nodeType === Node.TEXT_NODE
        ? cursorNode.parentElement?.closest('span')
        : (cursorNode as Element).closest('span');

    if (parentSpan && this.isAtEndOfSpan(range, parentSpan)) {
      this.moveCursorAfterSpan(parentSpan);
      this.insertCharacter('');
    }
  }

  private insertCharacter(char: string) {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const textNode = range.startContainer;

    if (textNode.nodeType === Node.TEXT_NODE) {
      const text = textNode.textContent || '';
      const offset = range.startOffset;

      textNode.textContent = text.slice(0, offset) + ' ' + text.slice(offset);

      range.setStart(textNode, offset + 1);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      const newTextNode = document.createTextNode(char);
      range.insertNode(newTextNode);

      range.setStart(newTextNode, 1);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  private moveCursorAfterSpan(span: Element) {
    const parent = span.parentElement;
    if (!parent) return;

    let nextNode = span.nextSibling;

    if (!nextNode || nextNode.nodeType !== Node.TEXT_NODE) {
      nextNode = document.createTextNode('');
      parent.insertBefore(nextNode, span.nextSibling);
    }

    const newRange = document.createRange();
    newRange.setStart(nextNode, (nextNode as Text).length);
    newRange.collapse(true);

    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
  }

  private isAtEndOfSpan(range: Range, span: Element): boolean {
    const selection = window.getSelection();
    if (!selection) return false;

    const lastNode = this.getLastTextNode(span);

    if (!lastNode) return false;

    const cursorNode = range.startContainer;
    const cursorOffset = range.startOffset;

    if (cursorNode === lastNode) {
      return cursorOffset === (lastNode as Text).length;
    }

    const rangeBeforeSpan = document.createRange();
    rangeBeforeSpan.selectNodeContents(span);
    rangeBeforeSpan.collapse(false);

    return range.compareBoundaryPoints(Range.END_TO_START, rangeBeforeSpan) >= 0;
  }

  private getLastTextNode(element: Element): Node | null {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        if (node.textContent?.trim() === '') {
          return NodeFilter.FILTER_SKIP;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    let lastNode: Node | null = null;
    let node: Node | null;

    while ((node = walker.nextNode())) {
      lastNode = node;
    }

    return lastNode;
  }

  private isAtEnd(node: Node, range: Range): boolean {
    if (node.nodeType === Node.TEXT_NODE) {
      const textNode = node as Text;
      return textNode.length === range.startOffset;
    }
    return false;
  }

  public saveArticle() {
    const text = this.editor.nativeElement.getHTML();
    if (!text) return alert('Статья не может быть пустой!');
    if (!this.currentTitle) return alert('Необходимо ввести название');
    this.handleSave.emit({ text: text, annotations: this.annotations, title: this.currentTitle });
  }

  public changeTitle(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    if (value) this.currentTitle = value;
  }

  public changeColor(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    if (value) this.currentColor = value;
  }

  private wrapRangeWithSpan(range: Range) {
    const text = prompt('Введите текст аннотации');
    if (!text) return;
    const uuId = crypto.randomUUID();

    this.annotations.push({ uuId: uuId, text: text });

    const span = this.createAndConfigureSpan(uuId);
    const annotation = this.createAntConfigureAnnotation(uuId);

    this.onMouseMove(span, annotation);
    this.onMouseOver(span, annotation);

    try {
      const selectedText = range.toString();
      range.deleteContents();
      span.textContent = selectedText;
      range.insertNode(span);

      range.setStartAfter(span);
      range.collapse(true);

      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } catch (e) {
      console.error('Ошибка при обертке:', e);
    }
  }

  private onMouseMove(span: HTMLSpanElement, annotation: HTMLSpanElement) {
    return span.addEventListener('mousemove', (e) => {
      const uuId = (e.target as HTMLSpanElement).id;
      this.currentAnnotationUuId.set(uuId);
      const matchAnnotatinos = this.annotations.find((i) => i.uuId === uuId);
      span.appendChild(annotation);
    });
  }

  private onMouseOver(span: HTMLSpanElement, annotation: HTMLSpanElement) {
    span.addEventListener('mouseleave', (e) => {
      const spab = e.target as HTMLSpanElement;
      spab.removeChild(annotation);
    });
  }

  public coloredSelection() {
    try {
      const div = document.createElement('div');
      const selection = window.getSelection();
      if (selection) {
        const range = selection.getRangeAt(0);
        this.wrapRangeWithSpan(range);
        this.selectedText = range.toString();
        selection.removeAllRanges();
      }
    } catch (e) {
      alert('Необходимо выделить текст!');
    }
  }

  private createAndConfigureSpan(uuId: string) {
    const span = document.createElement('span');
    span.setAttribute('id', uuId);
    span.style.textDecoration = 'underline';
    span.style.position = 'relative';
    span.style.whiteSpace = 'pre-wrap';
    span.style.cursor = 'pointer';
    span.style.maxWidth = '300px';
    span.style.color = this.currentColor;
    span.style.textDecorationColor = this.currentColor;
    return span;
  }

  private createAntConfigureAnnotation(uuId: string) {
    const matchAnnotatinos = this.annotations.find((i) => i.uuId === uuId);
    const annotation = document.createElement('span');
    annotation.style.position = 'absolute';
    annotation.style.top = '-25px';
    annotation.style.left = '50%';
    annotation.style.transform = 'translateX(-50%)';
    annotation.style.padding = '5px';
    annotation.style.userSelect = 'none';
    annotation.style.display = 'block';
    annotation.style.color = 'white';
    annotation.style.background = 'teal';
    annotation.style.borderRadius = '6px';
    annotation.contentEditable = 'false';
    annotation.textContent = matchAnnotatinos?.text!;
    return annotation;
  }
}
